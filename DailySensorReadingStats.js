var async = require( "async" );
var moment = require( "moment" );
var config = require( "./lib/configuration" );
var connections = require( "./lib/connections" );
var models = require( "./lib/models" );


var logger = connections.logger( config.sensorDailyStatLogglyTag );
var db = connections.database();

var now;


function main () {
    // var previousHour;
    // setInterval( function () {
    //     now = moment();
    //     var currentHour = now.hour();
    //     if ( previousHour !== currentHour && currentHour % config.sensorDailyStatHour === 0 ) {
    //         previousHour = currentHour;
    //         processDailyStats();
    //     }
    // }, config.runInterval );
    now = moment();
    processDailyStats();
}


function processDailyStats () {
    async.waterfall( [ calculateStats, saveStats ], function ( err, result ) {
        if ( err ) {
            // logger.log( err );
            console.log( err );
            process.exit( 1 );
        }
        console.log( result );
    } );
}


function calculateStats ( done ) {
    var start = now.clone().subtract( 1, "days" ).startOf( "day" ).toISOString();
    console.log( start );
    var end = now.clone().subtract( 1, "days" ).endOf( "day" ).toISOString();
    console.log( end );

    // models.SensorReading.calcStatsForDateRange( start, end, function ( err, data ) {
    //     if ( err ) {
    //         return done( err );
    //     }
    //     return done( null, data );
    // } );

    models.SensorReading.find( {}, function ( err, data ) {
        if ( err ) {
            console.log( err );
            process.exit( 1 );
        }
        console.log( data );
    } );

}


function saveStats ( dailyStats, done ) {
    return done( null, dailyStats );
}


main();
