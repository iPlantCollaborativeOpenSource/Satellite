var request = require("request");
var moment = require("moment");

var startTime;
var sender;

// iterate through DB for all data up to 1 day ago

    var updateData = function(){
        var total = [];

        var _date = new Date(startTime.clone().subtract(6, 'hours'));
        var dateToString = _date.toString();

        /*
         Nov 14 2014 04:25 <  10:25
         Soonest time is greatest
         */

//        StatusResult.find({
//            //created less than an hour ago
//            //TODO This keeps returning 0 results ******************************
//
//            createdAt: {'>=': _date}
//
//        }).exec(function countCB(error, found){
//            total = found;
//        });

        // Make up some data to see if anything else works
        for(var i = 0; i < 10; i++){
            total[i] = (Math.random() > 0.4)? 200 : 505;

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
    var uptime = ( array.length - other)/array.length;
    //Update sender
    sender.day_values.push(uptime); //TODO
    sender.day_dates.push(startTime.utc().format());
    //day_dates[last]

    // set day_avg
    average(sender.day_values, 24);

    // Decide if week/month need to be updated
    if(sender.day_values.length === 24){
        setWeek();
        setMonth();
    }

}

//"month_dates": ["2014-02-28T04:43:00+00:00",


    var setWeek = function(){
        var day = sender.day_values;

        if (sender.week_values.length === 7) {
            sender.week_values.shift();
            sender.week_dates.shift();
        }
        else{
            sender.week_start = new moment(sender.week_dates[sender.week_values.length]).unix()*1000;
        }
        sender.week_values.push(average(day, 7));
        sender.week_dates.push(startTime.utc().format());
    }


    var setMonth = function(){
        var day = sender.day_values;
        sender.month_start = startTime.clone().subtract(30, 'day').unix()*1000;

        if (sender.month_values.length === 30) {
            sender.month_values.shift();
            sender.month_dates.shift();
        }
        else{
            sender.month_start = new moment(sender.month_dates[sender.month_values.length]).unix()*1000;

        }
        sender.month_values.push(average(day, 30));
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
            avg = sum / length;
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

//TODO Sender overwrites sender averages!!!!
        // we don't want duplicate objects, so update
        Sender.update(sender).exec(function createCB(err,created) {
            // Doesn't really do anything...
            console.log(created);
        });

        setTimeout(send.bind(null), 2000);
    }


module.exports = {
    aggregate: function() {


        sender = {
            day_avg: '',
            day_start: '',
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
        });

        send();

    }
}