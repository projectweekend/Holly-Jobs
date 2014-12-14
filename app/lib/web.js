var express = require( "express" );
var async = require( "async" );
var models = require( "./models" );


var handleSensorReading = function ( messageBroker, app ) {
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


var handleSystemReading = function ( messageBroker, app ) {
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


module.exports = function ( messageBroker, logger ) {

    var app = express();

    messageBroker.create( "sensor.get" );
    messageBroker.create( "system.get" );

    handleSensorReading( messageBroker, app );
    handleSystemReading( messageBroker, app );

    return app;

};
