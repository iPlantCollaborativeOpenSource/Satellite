var request = require("request");
var moment = require("moment");

var start;
var sender;

// TODO set up day data
// iterate through DB for all data up to 1 day ago

    var updateData = function(cb){
        var total = [];

        var _date = new Date(start.clone().subtract(1, "hour").format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z');
        StatusResult.count({
            //created less than an hour ago
            //TODO
            createdAt: {'>=': _date}
            //
        }).exec(function countCB(error, found){
            total = found;
        });

       total.toString();
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

        setTimeout(updateData.bind(null, function(){}), 20000);
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
    var day = sender.day_values;
    var startDate = start.clone().subtract(24, 'hour').utc().format();
    sender.day_start = startDate;

    // TODO sender Myseriously turns into a string
    if (sender.day_values.length === 24) {
        sender.day_dates.shift();
        sender.day_values.shift();
    }
    sender.day_values.push(average(day,24));
    sender.day_dates.push(start.utc().format());
}

//"month_dates": ["2014-02-28T04:43:00+00:00",

// TODO set up week data

    var setWeek = function(){
        var day = sender.day_values;
        var startDate = start.clone().subtract(7, 'day').utc().format();
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
        var startDate = start.clone().subtract(30, 'day').utc().format();
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

        start =  moment().utc();

        updateData(function(){});

        //console.log(sender.toString());

        Sender.create(sender).exec(function createCB(err,created) {
            console.log(created);
        });
    }
}