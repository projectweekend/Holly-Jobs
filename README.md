This project has two main components:
* `/app` -  An [Express](http://expressjs.com/) web server exposing routes that correspond to job tasks.
* `/cron` - The scripts that get called by various Cron jobs.


### API


#### Sensor Reading Job

**GET:** `/job/sensor-reading`


#### System Reading Job

**GET:** `/job/system-reading`


#### Calculate Daily Sensor Stats Job

**GET:** `/job/sensor-stats/day`


#### Calculate Daily System Stats Job

**GET:** `/job/system-stats/day`
