var request = require("request");
var moment = require("moment");

var startTime;
var sender;
var id;
var ready = false;


// iterate through DB for all data up to 1 day ago

    var updateData = function(){
        var total = [];

        var _date = new Date(startTime.clone().subtract(6, 'hours'));
        //var dateToString = _date.toString();

        /*
         Nov 14 2014 04:25 <  10:25
         Soonest time is greatest
         */

        StatusResult.find({
            //created less than an hour ago
            //TODO This keeps returning 0 results ******************************

            createdAt: {'>=': _date}
            //url = "url" TODO

        }).exec(function countCB(error, found){
            total = found;
        });

        // Make up some data to see if anything else works
        for(var i = 0; i < 17; i++){
            total[i] = (Math.random() > 0.2)? 200 : 505;
        }

        setDay(total);

    }


var setDay = function(array){
    // Check that there is enough space for a new value
    if (sender.day_values.length === 24) {
        sender.day_dates.shift();
        sender.day_values.shift();
        //Set new day_start
        sender.day_start = sender.day_dates[22];
    } // Make space if necessary
    else{
        sender.day_start = new moment(sender.day_dates[sender.day_values.length]).unix()*1000;
    }

    //check values for uptime
    var other = 0;
    array.forEach(function(element, index, arr) {
        //TODO element.status
        if (element !== 200) {
            other++;
        }
    });
    // Calculate uptime
    var uptime = (((array.length - other)/array.length) * 100).toPrecision(4);
    //Update sender

    sender.day_values.push(uptime);
    sender.day_dates.push(startTime.utc().format());
    //day_dates[last]

    // set day_avg
    var daily = average(sender.day_values, 24);

    // Decide if week/month need to be updated
    if(sender.day_values.length === 24){
        setWeek(daily);
        setMonth(daily);
    }

}

//"month_dates": ["2014-02-28T04:43:00+00:00",


    var setWeek = function(value){
        //var day = sender.day_values;

        if (sender.week_values.length === 7) {
            sender.week_values.shift();
            sender.week_dates.shift();
        }
        else{
            sender.week_start = new moment(sender.week_dates[sender.week_values.length]).unix()*1000;
        }
        sender.week_values.push(value)
        average(sender.week_values, 7);
        sender.week_dates.push(startTime.utc().format());
    }


    var setMonth = function(value){
        //var day = sender.day_values;
        sender.month_start = startTime.clone().subtract(30, 'day').unix()*1000;

        if (sender.month_values.length === 30) {
            ready = true;
            sender.month_values.shift();
            sender.month_dates.shift();
        }
        else{
            sender.month_start = new moment(sender.month_dates[sender.month_values.length]).unix()*1000;

        }
        sender.month_values.push(value)
        average(sender.month_values, 30);
        sender.month_dates.push(startTime.utc().format());
    }

// calculate any average given an aray


    var average = function(array, total){ //takes a slice
        var avg;
        var length = array.length;
        var sum = 0;

        if(length === 0){
            avg = 0;
        }
        else {
            for (var i = 0; i <= length - 1; i++) {
                sum += array[i];
            }
            avg = (sum / length).toPrecision(4);
        }

        switch(total){
            case 24: sender.day_avg= avg;
                return avg;

            case 7: sender.week_avg=avg;
                return avg;

            case 30: sender.month_avg=avg;
                return avg;
        }
    }

    var send = function(){
        startTime =  moment();

        updateData();

//TODO Sender overwrites sender averages
        console.log(sender);
        // we don't want duplicate objects, so update
        // TODO update(id, sender)
        Sender.update(id, sender).exec(function createCB(err,created) {
            // Doesn't really do anything...
            console.log(created);
            //sending to custom metric
            if (ready){
                request({
                    url: "https://private-39405-statusio.apiary-proxy.com/v2/metric/update",
                    body: JSON.stringify(sender),
                    headers: {"x-api-id": "75744ed0-af87-49ce-8003-eea50469cf63",
                        "x-api-key": "6aj1eg+MwZ+8p601YlknqclWC2tCOHLxzTT4+BMQBJ8gsmhd7Zt/Rw2bchkNFL1xGLbqJfnbEulKA4aePWoiuQ==",
                        "Content-Type": "application/json"},
                    method: "POST"
                }, function (error, response, body) {
                    console.log(body);

                });
            }


        });
        if(ready){
            setTimeout(send.bind(null), 10000);
        }
        else{
            setTimeout(send.bind(null), 1000);
        }


    }

/*
 body: '{\n  "status": {\n    "error": "yes",\n    "message": "Input validation failed"\n  }\n}' }
 */

module.exports = {
    aggregate: function() {


        sender = {
            statuspage_id: "544e810996cc7fe45400896c",
            metric_id:  "544e86d396cc7fe4540089f2",
            day_avg: null,
            day_start: null,
            day_dates: [],
            day_values: [],
            week_avg: null,
            week_start: null,
            week_dates: [],
            week_values: [],
            month_avg: null,
            month_start: null,
            month_dates: [],
            month_values: []
        };
        // create initial object
        Sender.create(sender).exec(function createCB(err,created) {
            console.log(created);
            id = created.id;
            send();
            //TODO get id
        });



    }
}