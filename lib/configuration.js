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
    debugMode: process.env.DEBUG === "true",
    sensorQueue: process.env.SENSOR_QUEUE || "sensor.get",
    sensorReadingLogglyTag: process.env.SENSOR_READING_LOGGLY_TAG || "Holly-Jobs-Sensor-Reading",
    sensorReadingMinute: parseInt( process.env.SENSOR_READING_MINUTE || 0, 10 ),
    systemQueue: process.env.SYSTEM_QUEUE || "system.get",
    systemReadingLogglyTag: process.env.SYSTEM_READING_LOGGLY_TAG || "Holly-Jobs-System-Reading",
    systemReadingMinute: parseInt( process.env.SYSTEM_READING_MINUTE || 0, 10 ),
    sensorDailyStatLogglyTag: process.env.SENSOR_DAILY_STAT_LOGGLY_TAG || "Holly-Jobs-Daily-Sensor-Reading-Stats",
    sensorDailyStatHour: parseInt( process.env.SENSOR_DAILY_STAT_HOUR || 0, 10 ),
    runInterval: parseInt( process.env.RUN_INTERVAL || 500, 10 )
};
