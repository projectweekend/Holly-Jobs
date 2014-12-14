This project has two main components:
* `/app` -  An [Express](http://expressjs.com/) web server exposing routes that correspond to job tasks.
* `/cron` - The scripts that get called by various Cron jobs.


API Routes
====================


#### Sensor Reading Job

**GET:** `/job/sensor-reading`


#### System Reading Job

**GET:** `/job/system-reading`


#### Calculate Daily Sensor Stats Job

**GET:** `/job/sensor-stats/day`


#### Calculate Daily System Stats Job

**GET:** `/job/system-stats/day`


#### Calculate Weekly Sensor Stats Job

**GET:** `/job/sensor-stats/week`


#### Calculate Weekly System Stats Job

**GET:** `/job/system-stats/week`


#### Calculate Monthly Sensor Stats Job

**GET:** `/job/sensor-stats/month`


#### Calculate Monthly System Stats Job

**GET:** `/job/system-stats/month`
