var request = require("request");
var moment = require("moment");

var startTime;
var sender;

// iterate through DB for all data up to 1 day ago

    var updateData = function(){
        var total = [];

        var _date = new Date(startTime.clone().subtract(6, "hour").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z');
        var dateToString = _date.toString();
        //Wed Nov 12 2014 03:13:19 GMT-0700 (MST)
        //Wed Nov 12 2014 11:15:40 GMT-0700 (MST)
        StatusResult.count({
            //created less than an hour ago
            //TODO This keeps returning 0 results
            createdAt: {'>=': _date}
            //
        }).exec(function countCB(error, found){
            total = found;
        });


        takeHour(total);


        setDay();
        if(sender.day_values.length === 24){
            setWeek();
            setMonth();
        }



        //cb(true);

        //setTimeout(updateData.bind(null, function(){}), 2000);
    }



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
    var day = sender.day_values;
    var startDate = startTime.clone().subtract(24, 'hour').utc().format();
    sender.day_start = startDate;


    if (sender.day_values.length === 24) {
        sender.day_dates.shift();
        sender.day_values.shift();
    }
    sender.day_values.push(average(day,24));
    sender.day_dates.push(startTime.utc().format());
}

//"month_dates": ["2014-02-28T04:43:00+00:00",


    var setWeek = function(){
        var day = sender.day_values;
        var startDate = startTime.clone().subtract(7, 'day').utc().format();
        sender.week_start = startDate;

        if (sender.week_values.length === 7) {
            sender.week_values.shift();
            sender.week_dates.shift();
        }
        sender.week_values.push(average(day, 7));
        sender.week_dates.push(startTime.utc().format());
    }


    var setMonth = function(){
        var day = sender.day_values;
        var startDate = startTime.clone().subtract(30, 'day').utc().format();
        sender.month_start = startDate;

        if (sender.month_values.length === 30) {
            sender.month_values.shift();
            sender.month_dates.shift();
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
            for (var i; i < length; i++) {
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

        updateData();

        Sender.create(sender).exec(function createCB(err,created) {
            console.log(created);
        });

        setTimeout(send.bind(null), 2000);
    }


module.exports = {
    aggregate: function() {


        sender = {
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

        startTime =  moment();

        send();
        //updateData(function(){});

        //console.log(sender.toString());


    }
}