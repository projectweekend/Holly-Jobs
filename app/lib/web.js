var express = require( "express" );
var async = require( "async" );
var moment = require( "moment" );
var models = require( "./models" );


var handleSensorReading = function ( messageBroker, logger, app ) {
    var getSensorData = function ( done ) {
        messageBroker.publish( "sensor.get", { serialMessage: "A" }, function ( err, data ) {
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
        messageBroker.publish( "system.get", {}, function ( err, data ) {
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

    return app;

};
