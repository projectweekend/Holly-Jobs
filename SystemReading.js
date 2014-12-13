var async = require( "async" );
var moment = require( "moment" );
var throng = require( "throng" );
var config = require( "./lib/configuration" );
var connections = require( "./lib/connections" );
var models = require( "./lib/models" );


function main () {
    var logger = connections.logger( config.systemReadingLogglyTag );
    var db = connections.database();
    var broker = connections.jackrabbit();

    broker.once( "connected", createQueue );


    function createQueue () {
        broker.create( config.systemQueue, run );
    }


    function run () {
        var previousMinute;
        setInterval( function () {
            var currentMinute = moment().minutes();
            if ( previousMinute !== currentMinute && currentMinute % config.systemReadingMinute === 0 ) {
                previousMinute = currentMinute;
                processSystemReading();
            }
        }, config.runInterval );
    }


    function processSystemReading () {
        async.waterfall( [ readSystem, saveData ], function ( err, result ) {
            if ( err ) {
                logger.log( err );
                process.exit( 1 );
            }
            console.log( result );
        } );
    }


    function readSystem ( done ) {
        broker.publish( config.systemQueue, {}, function ( err, data ) {
            if ( err ) {
                return done( err );
            }
            return done( null, data );
        } );
    }


    function saveData ( systemData, done ) {
        models.SystemReading.add( systemData, function ( err, data ) {
            if ( err ) {
                return done( err );
            }
            return done( null, data );
        } );
    }
}


if ( require.main === module ) {
    if ( config.debugMode ) {
        console.log( "Running in debug mode..." );
        main();
    } else {
        throng( main, {
            workers: 1,
            lifetime: Infinity
        } );
    }
}
