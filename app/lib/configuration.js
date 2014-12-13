if ( !process.env.RABBIT_URL ) {
    throw new Error( "Configuration: RabbitMQ connection URL (RABBIT_URL) must be defined" );
}

if ( !process.env.MONGO_URL ) {
    throw new Error( "Configuration: MongoDB connection URL (MONGO_URL) must be defined" );
}

if ( !process.env.LOGGLY_TOKEN ) {
    throw new Error( "Configuration: Loggly account token (LOGGLY_TOKEN) must be defined" );
}

if ( !process.env.LOGGLY_SUBDOMAIN ) {
    throw new Error( "Configuration: Loggly account subdomain (LOGGLY_SUBDOMAIN) must be defined" );
}

module.exports = {
    rabbitURL: process.env.RABBIT_URL,
    mongoURL: process.env.MONGO_URL,
    logglyToken: process.env.LOGGLY_TOKEN,
    logglySubdomain: process.env.LOGGLY_SUBDOMAIN,
    logglyTag: process.env.LOGGLY_TAG || "Holly-Jobs-App",
    sensorQueue: process.env.SENSOR_QUEUE || "sensor.get",
    systemQueue: process.env.SYSTEM_QUEUE || "system.get",
    debugMode: process.env.DEBUG === "true"
};
