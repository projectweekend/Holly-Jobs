var async = require( "async" );
var moment = require( "moment" );
var config = require( "./lib/configuration" );
var connections = require( "./lib/connections" );
var models = require( "./lib/models" );


var logger = connections.logger( config.sensorReadingLogglyTag );
var db = connections.database();
var broker = connections.jackrabbit();

broker.once( "connected", createQueue );


function createQueue () {
    broker.create( config.sensorQueue, run );
}


function run () {
    var previousMinute;
    setInterval( function () {
        var currentMinute = moment().minutes();
        if ( previousMinute !== currentMinute && currentMinute % config.sensorReadingMinute === 0 ) {
            previousMinute = currentMinute;
            processSensorReading();
        }
    }, config.runInterval );
}


function processSensorReading () {
    async.waterfall( [ readSensor, saveData ], function ( err, result ) {
        if ( err ) {
            logger.log( err );
            process.exit( 1 );
        }
    } );
}


function readSensor ( done ) {
    broker.publish( config.sensorQueue, { serialMessage: "A" }, function ( err, data ) {
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
