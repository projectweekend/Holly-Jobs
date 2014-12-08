var async = require( "async" );
var moment = require( "moment" );
var connections = require( "./lib/connections" );
var models = require( "./lib/models" );


var interval = parseInt( process.env.SENSOR_READING_INTERVAL, 10 );
var minute = parseInt( process.env.SENSOR_READING_MINUTE, 10 );

var logger = connections.logger( [ "Holly-Jobs-Sensor-Reading" ] );
var db = connections.database();
var broker = connections.jackrabbit();

broker.once( "connected", createQueue );


function createQueue () {
    broker.create( "sensor.get", run );
}


function run () {
    var previousMinute;
    setInterval( function () {
        var currentMinute = moment().minutes();
        if ( previousMinute !== currentMinute && currentMinute % minute === 0 ) {
            previousMinute = currentMinute;
            processSensorReading();
        }
    }, interval );
}


function processSensorReading () {
    async.waterfall( [ readSensor, saveData ], function ( err, result ) {
        if ( err ) {
            logger.log( err );
            process.exit( 1 );
        }
        console.log( result );
    } );
}


function readSensor ( done ) {
    broker.publish( "sensor.get", { serialMessage: "A" }, function ( err, data ) {
        if ( err ) {
            return done( err );
        }
        return done( null, data );
    } );
}


function saveData ( sensorData, done ) {
    models.SensorReading.create( sensorData, function ( err, data ) {
        if ( err ) {
            return done( err );
        }
        return done( null, data );
    } );
}
