var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;


// Sensor Stats
var SensorStatsSchema = Schema( {
    date: Date,
    type: String,
    avg_temp_c: Number,
    min_temp_c: Number,
    max_temp_c: Number,
    avg_temp_f: Number,
    min_temp_f: Number,
    max_temp_f: Number,
    avg_humidity: Number,
    min_humidity: Number,
    max_humidity: Number,
    avg_pressure: Number,
    min_pressure: Number,
    max_pressure: Number,
    avg_luminosity: Number,
    min_luminosity: Number,
    max_luminosity: Number
} );

SensorStatsSchema.index( { date: 1, type: 1 }, { unique: true } );

var SensorStats = mongoose.model( 'SensorStats', SensorStatsSchema );


// Sensor Reading
var SensorReadingSchema = Schema( {
    date: Date,
    temp_c: Number,
    temp_f: Number,
    humidity: Number,
    pressure: Number,
    luminosity: Number
} );

SensorReadingSchema.statics = {
    add: function ( sensorReadingData, cb ) {
        // Override the date here in case time from Raspberry Pi is off
        sensorReadingData.data = new Date();
        this.create( sensorReadingData, function ( err, newSensorReading ) {
            if ( err ) {
                return cb( err );
            }
            return cb( null, newSensorReading );
        } );
    },
    calcStatsForDateRange: function ( options, cb ) {
        var matchOptions = {
            date: {
                $gte: options.startDate,
                $lte: options.endDate
            }
        };

        var groupOptions = {
            _id: null,
            avg_temp_c: {
                $avg: "$temp_c"
            },
            min_temp_c: {
                $min: "$temp_c"
            },
            max_temp_c: {
                $max: "$temp_c"
            },
            avg_temp_f: {
                $avg: "$temp_f"
            },
            min_temp_f: {
                $min: "$temp_f"
            },
            max_temp_f: {
                $max: "$temp_f"
            },
            avg_humidity: {
                $avg: "$humidity"
            },
            min_humidity: {
                $min: "$humidity"
            },
            max_humidity: {
                $max: "$humidity"
            },
            avg_pressure: {
                $avg: "$pressure"
            },
            min_pressure: {
                $min: "$pressure"
            },
            max_pressure: {
                $max: "$pressure"
            },
            avg_luminosity: {
                $avg: "$luminosity"
            },
            min_luminosity: {
                $min: "$luminosity"
            },
            max_luminosity: {
                $max: "$luminosity"
            }
        };

        this.aggregate()
            .match( matchOptions )
            .group( groupOptions )
            .exec( function ( err, data ) {
                if ( err ) {
                    return cb( err );
                }

                data = data[ 0 ];
                delete data._id;
                data.date = options.date;
                data.type = options.type;

                SensorStats.create( data, function ( err, newSensorStat ) {
                    if ( err ) {
                        return cb( err );
                    }
                    return cb( null, newSensorStat );
                } );
            } );
    }
};

var SensorReading = mongoose.model( 'SensorReading', SensorReadingSchema );


// System Stats
var SystemStatsSchema = Schema( {
    date: Date,
    type: String,
    avg_cpu_temp_c: Number,
    min_cpu_temp_c: Number,
    max_cpu_temp_c: Number,
    avg_cpu_temp_f: Number,
    min_cpu_temp_f: Number,
    max_cpu_temp_f: Number
} );

SystemStatsSchema.index( { date: 1, type: 1 }, { unique: true } );

var SystemStats = mongoose.model( 'SystemStats', SystemStatsSchema );


// System Reading
var SystemReadingSchema = Schema( {
    date: Date,
    cpu_temp_c: Number,
    cpu_temp_f: Number
} );

SystemReadingSchema.statics = {
    add: function ( systemReadingData, cb ) {
        // Override the date here in case time from Raspberry Pi is off
        systemReadingData.data = new Date();
        this.create( systemReadingData, function ( err, newSystemReading ) {
            if ( err ) {
                return cb( err );
            }
            return cb( null, newSystemReading );
        } );
    },
    calcStatsForDateRange: function ( options, cb ) {
        var matchOptions = {
            date: {
                $gte: options.startDate,
                $lte: options.endDate
            }
        };

        var groupOptions = {
            _id: null,
            avg_cpu_temp_c: {
                $avg: "$cpu_temp_c"
            },
            min_cpu_temp_c: {
                $min: "$cpu_temp_c"
            },
            max_cpu_temp_c: {
                $max: "$cpu_temp_c"
            },
            avg_cpu_temp_f: {
                $avg: "$cpu_temp_f"
            },
            min_cpu_temp_f: {
                $min: "$cpu_temp_f"
            },
            max_cpu_temp_f: {
                $max: "$cpu_temp_f"
            }
        };

        this.aggregate()
            .match( matchOptions )
            .group( groupOptions )
            .exec( function ( err, data ) {
                if ( err ) {
                    return cb( err );
                }

                data = data[ 0 ];
                delete data._id;
                data.date = options.date;
                data.type = options.type;

                SystemStats.create( data, function ( err, newSystemStat ) {
                    if ( err ) {
                        return cb( err );
                    }
                    return cb( null, newSystemStat );
                } );
            } );

    }
};

var SystemReading = mongoose.model( 'SystemReading', SystemReadingSchema );


exports.SensorStats = SensorStats;
exports.SensorReading = SensorReading;
exports.SystemStats = SystemStats;
exports.SystemReading = SystemReading;
