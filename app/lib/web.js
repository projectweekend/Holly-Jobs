var express = require( "express" );
var async = require( "async" );
var moment = require( "moment" );
var models = require( "./models" );
var config = require( "./configuration" );


var handleSensorReading = function ( messageBroker, logger, app ) {
    var getSensorData = function ( done ) {
        messageBroker.publish( config.sensorQueue, { serialMessage: "A" }, function ( err, data ) {
            if ( err ) {
                return done( err );
            }
            return done( null, data );
        } );
    };

    var saveSensorData = function ( sensorData, done ) {
        models.SensorReading.create( sensorData, function ( err, data ) {
            if ( err ) {
                return done( err );
            }
            return done( null, data );
        } );
    };

    app.get( "/job/sensor-reading", function ( req, res ) {
        async.waterfall( [ getSensorData, saveSensorData ], function ( err, data ) {
            if ( err ) {
                logger.log( err );
                return res.status( 500 ).json();
            }
            return res.status( 200 ).json( data );
        } );
    } );
};


var handleSystemReading = function ( messageBroker, logger, app ) {
    var getSystemData = function ( done ) {
        messageBroker.publish( config.systemQueue, {}, function ( err, data ) {
            if ( err ) {
                return done( err );
            }
            return done( null, data );
        } );
    };

    var saveSystemData = function ( systemData, done ) {
        models.SystemReading.create( systemData, function ( err, data ) {
            if ( err ) {
                return done( err );
            }
            return done( null, data );
        } );
    };

    app.get( "/job/system-reading", function ( req, res ) {
        async.waterfall( [ getSystemData, saveSystemData ], function ( err, data ) {
            if ( err ) {
                logger.log( err );
                return res.status( 500 ).json();
            }
            return res.status( 200 ).json( data );
        } );
    } );
};


var handleDailyStats = function ( options, logger, app ) {
    app.get( options.path, function ( req, res ) {
        var yesterdayStart = moment().subtract( 1, "day" ).startOf( "day" ).toDate();
        var yesterdayEnd = moment().subtract( 1, "day" ).endOf( "day" ).toDate();

        var statCalcOptions = {
            startDate: yesterdayStart,
            endDate: yesterdayEnd,
            date: yesterdayStart,
            type: "day"
        };

        options.model.calcStatsForDateRange( statCalcOptions, function ( err, data ) {
            if ( err ) {
                logger.log( err );
                return res.status( 500 ).json();
            }
            return res.status( 200 ).json( data );
        } );
    } );
};


var handleWeeklyStats = function ( options, logger, app ) {
    app.get( options.path, function ( req, res ) {
        var lastWeekStart = moment().subtract( 1, "week").startOf( "week" ).toDate();
        var lastWeekEnd = moment().subtract( 1, "week").endOf( "week" ).toDate();

        var statCalcOptions = {
            startDate: lastWeekStart,
            endDate: lastWeekEnd,
            date: lastWeekStart,
            type: "week"
        };

        options.model.calcStatsForDateRange( statCalcOptions, function ( err, data ) {
            if ( err ) {
                logger.log( err );
                return res.status( 500 ).json();
            }
            return res.status( 200 ).json( data );
        } );
    } );
};


var handleMonthlyStats = function ( options, logger, app ) {
    app.get( options.path, function ( req, res ) {
        var lastMonthStart = moment().subtract( 1, "month" ).startOf( "month" ).toDate();
        var lastMonthEnd = moment().subtract( 1, "month" ).startOf( "month" ).toDate();

        var statCalcOptions = {
            startDate: lastMonthStart,
            endDate: lastMonthEnd,
            date: lastMonthStart,
            type: "month"
        };

        options.model.calcStatsForDateRange( statCalcOptions, function ( err, data ) {
            if ( err ) {
                logger.log( err );
                return res.status( 500 ).json();
            }
            return res.status( 200 ).json( data );
        } );
    } );
};


module.exports = function ( messageBroker, logger ) {

    var app = express();

    messageBroker.create( "sensor.get" );
    messageBroker.create( "system.get" );

    handleSensorReading( messageBroker, logger, app );
    handleSystemReading( messageBroker, logger, app );

    handleDailyStats( {
        path: "/job/sensor-stats/day",
        model: models.SensorReading
    }, logger, app );

    handleDailyStats( {
        path: "/job/system-stats/day",
        model: models.SystemReading
    }, logger, app );

    handleWeeklyStats( {
        path: "/job/sensor-stats/week",
        model: models.SensorReading
    }, logger, app );

    handleWeeklyStats( {
        path: "/job/system-stats/week",
        model: models.SystemReading
    }, logger, app );

    handleMonthlyStats( {
        path: "/job/sensor-stats/month",
        model: models.SensorReading
    }, logger, app );

    handleMonthlyStats( {
        path: "/job/system-stats/month",
        model: models.SystemReading
    }, logger, app );

    return app;

};
