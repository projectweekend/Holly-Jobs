var express = require( "express" );
var async = require( "async" );
var models = require( "./models" );


module.exports = function ( messageBroker ) {

    var app = express();

    messageBroker.create( "sensor.get" );
    messageBroker.create( "system.get" );


    // log sensor data job
    var getSensorData = function ( done ) {
        console.log( "Request sent: sensor.get" );
        messageBroker.publish( "sensor.get", { serialMessage: "A" }, function ( err, data ) {
            if ( err ) {
                return done( err );
            }
            console.log( "Response received: sensor.get" );
            return done( null, data );
        } );
    };

    var saveSensorData = function ( sensorData, done ) {
        console.log( "Request sent: SensorReading.create" );
        models.SensorReading.create( sensorData, function ( err, data ) {
            if ( err ) {
                return done( err );
            }
            console.log( "Response received: SensorReading.create" );
            return done( null, data );
        } );
    };

    app.get( "/job/log-sensor-reading", function ( req, res ) {
        async.waterfall( [ getSensorData, saveSensorData ], function ( err, data ) {
            if ( err ) {
                // add logging here
                return res.status( 500 ).json();
            }
            console.log( "Sensor Reading" );
            console.log( data );
            return res.status( 200 ).json();
        } );
    } );


    // log system data job
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

    app.get( "/job/log-system-reading", function ( req, res ) {
        async.waterfall( [ getSystemData, saveSystemData ], function ( err, data ) {
            if ( err ) {
                // add logging here
                return res.status( 500 ).json();
            }
            console.log( "System Reading" );
            console.log( data );
            return res.status( 200 ).json();
        } );
    } );

    return app;

};
