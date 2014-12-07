var mongoose = require( 'mongoose' );

var Schema = mongoose.Schema;


var SensorReadingSchema = Schema( {
    date: Date,
    temp_c: Number,
    temp_f: Number,
    humidity: Number,
    pressure: Number,
    luminosity: Number
} );

SensorReadingSchema.statics = {
    calcStatsForDateRange: function ( startDate, endDate, cb ) {
        var matchOptions = {
            date: {
                $gte: startDate,
                $lte: endDate
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

        var q = this.aggregate()
                    .match( matchOptions )
                    .group( groupOptions );

        q.exec( cb );
    }
};

exports.SensorReading = mongoose.model( 'SensorReading', SensorReadingSchema );


var SystemReadingSchema = Schema( {
    date: Date,
    cpu_temp_c: Number,
    cpu_temp_f: Number
} );

exports.SystemReading = mongoose.model( 'SystemReading', SystemReadingSchema );
