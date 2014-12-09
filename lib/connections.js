var jr = require( "jackrabbit" );
var loggly = require( "loggly" );
var mongoose = require( "mongoose" );
var config = require( "./configuration" );


exports.jackrabbit = function () {
    return jr( config.rabbitURL, 1 );
};


exports.logger = function ( tag ) {
    return loggly.createClient( {
        token: config.logglyToken,
        subdomain: config.logglySubdomain,
        tags: [ tag ]
    } );
};


exports.database = function () {
    return mongoose.connect( config.mongoURL );
};
