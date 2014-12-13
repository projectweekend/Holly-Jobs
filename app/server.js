var http = require( "http" );

var connections = require( "./lib/connections" );
var config = require( "./lib/configuration" );
var web = require( "./lib/web" );

var server;
var database = connections.database();
var messageBroker = connections.jackrabbit();

messageBroker.once( "connected", serve );
messageBroker.once( "disconnected", exit.bind( this, "disconnected" ) );
process.on( "SIGTERM", exit );


function serve () {
    server = web( messageBroker );
    server.listen( config.port );
}


function exit ( reason ) {
    // add logging here
    if ( server ) {
        server.close( process.exit.bind( process ) );
    } else {
        process.exit();
    }
}
