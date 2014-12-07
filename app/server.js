var http = require( "http" );

var connections = require( "./lib/connections" );
var web = require( "./lib/web" );


var messageBroker = connections.jackrabbit();
var server = web( messageBroker );

messageBroker.once( "connected", serve );
messageBroker.once( "disconnected", exit.bind( this, "disconnected" ) );
process.on( "SIGTERM", exit );


function serve () {
    server.listen( process.env.PORT );
}


function exit ( reason ) {
    // add logging here
    if ( server ) {
        server.close( process.exit.bind( process ) );
    } else {
        process.exit();
    }
}
