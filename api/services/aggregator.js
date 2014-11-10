var request = require("request");
var moment = require("moment");

var start;


// TODO set up day data
// iterate through DB for all data up to 1 day ago

    var updateData = function(cb){
        var total = [];

        StatusResult.count({
            //created less than an hour ago
            createdAt: {'>=': startclone.subtract(1, "hour")}
        }).exec(function countCB(error, found){
            total = found;
        });

        // TODO get hourly info

        takeHour(total);

        //TODO Update Weekly and Monthly every day

        setDay();
        if(sender.day_values.length === 24){
            setWeek();
            setMonth();
        }

        // TODO update Timestamp array


        cb(true);


    }
// TODO narrow down and count how many were 200


var takeHour = function(array){
    var other = 0;
    array.forEach(function(element, index, arr){
        if( element.status !== 200){
            other++;
        }
        var uptime = ( array.length - other)/array.length;
        sender.day_values.push(uptime);
    })

}

var setDay = function(){
    //var day = sender.day_values;
    var startDate = start.clone().utc().subtract(24, 'hour');
    sender.day_start = startDate;

    if (sender.day_values.length === 24) {
        sender.day_dates.shift();
        sender.day_values.shift();
    }
    sender.day_values.push(average(day,24));
    sender.day_dates.push(start.utc().format());
}



// TODO set up week data

    var setWeek = function(){
        var day = sender.day_values;
        var startDate = start.clone().utc().subtract(7, 'day');
        sender.week_start = startDate;

        if (sender.week_values.length === 7) {
            sender.week_values.shift();
            sender.week_dates.shift();
        }
        sender.week_values.push(average(day, 7));
        sender.week_dates.push(start.utc().format());
    }

// TODO set up month data
    var setMonth = function(){
        var day = sender.day_values;
        var startDate = start.clone().utc().subtract(30, 'day');
        sender.month_start = startDate;

        if (sender.month_values.length === 30) {
            sender.month_values.shift();
            sender.month_dates.shift();
        }
        sender.month_values.push(average(day, 30));
        sender.month_dates.push(start.utc().format());
    }

// calculate any average given an aray

    var average = function(array, total){ //takes a slice
        var length = array.length;
        var sum = 0;
        for( var i ; i < length; i++){
            sum += array[i];
        }
        var avg =  sum/length;

        switch(total){
            case 24: sender[day_avg].set(avg);
                return avg;

            case 7: sender[week_avg].set(avg);
                return avg;

            case 30: sender[month_avg].set(avg);
                return avg;
        }
    }


module.exports = {
    aggregate: function() {

        var sender = {
            day_avg: "",
            day_start: "",
            day_dates: [],
            day_values: [],
            week_avg: '',
            week_start: "",
            week_dates: [],
            week_values: [],
            month_avg: "",
            month_start: "",
            month_dates: [],
            month_values: []
        };

        start =  moment().utc();

        updateData(function(){});

        //console.log(sender.toString());

        Sender.create(sender).exec(function createCB(err,created) {
            console.log(created);
        });
    }
}