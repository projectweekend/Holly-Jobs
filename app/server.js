var connections = require( "./lib/connections" );
var config = require( "./lib/configuration" );
var web = require( "./lib/web" );


if ( config.debugMode ) {
    console.log( "DEBUG..." );
}

var server;
var database = connections.database();
var messageBroker = connections.jackrabbit();
var logger = connections.logger( "Holly-Jobs-Server" );

messageBroker.once( "connected", serve );
messageBroker.once( "disconnected", exit.bind( this, "disconnected" ) );
process.on( "SIGTERM", exit );


function serve () {
    logger.log( "Serving..." );
    server = web( messageBroker, logger );
    server.listen( config.port );
}


function exit ( reason ) {
    logger.log( "Exiting..." );
    if ( server ) {
        server.close( process.exit.bind( process ) );
    } else {
        process.exit();
    }
}
