var request = require("request");
var moment = require("moment");

var start;

// TODO set up day data
// iterate through DB for all data up to 1 day ago

    var updateData = function(cb){
        var total;
        //check for updtime by searching for any non-200 pings
        StatusResult.count({
            status: 200
        }).exec(function countCB(error, found){
            console.log("I found this many 200's: ");
            console.log(found);
        });

        // TODO make a call for all records in the last month,
        // TODO narrow down and count how many were 200
        // TODO make an array slice, send it to be averaged

//        StatusResult.count({
//            status: { '!' : ['200'] }
//        });
        StatusResult.find(
            //find month/week/day
        ).exec(function countCB(error, found){
            total = found.length;

        });


        cb(true);

        // TODO call every hour
        setTimeout(updateData.bind(null,function(){}), 10000);

    }




// TODO set up week data
// TODO set up month data

// TODO calculate any average


    var average = function(array){ //takes a slice
        var length = array.length;
        var sum;
        for( var i ; i < length; i++){
            sum += array[i];
        }
        var avg =  sum/length;

        switch(length){
            case 24: Sender[day_avg].set(avg);
                break;
            case 7: Sender[week_avg].set(avg);
                break;
            case 30: Sender[month_avg].set(avg);
                break;
        }

    }


/*  "day_avg": "22.58",
    "day_start": "",
    "day_dates": [],
    "day_values": [],
    "week_avg": "20.07",
    "week_start": "",
    "week_dates": [],
    "week_values": [],
    "month_avg": "10.63",
    "month_start": "",
    "month_dates": [],
    "month_values": []*/


module.exports = {
    aggregate: function() {
        start =  new Date.now();
        updateData(function(){});

    }
}