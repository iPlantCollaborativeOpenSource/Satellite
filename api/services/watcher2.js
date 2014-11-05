var request = require("request");
var moment = require("moment");

var api_id = process.env.STATUS_IO_API_ID;
var api_key = process.env.STATUS_IO_API_KEY;
var status = "544e810996cc7fe45400896c";
var metric = "544e86d396cc7fe4540089f2";

var data = {
    "statuspage_id": "544e810996cc7fe45400896c",
    "metric_id":  "544e86d396cc7fe4540089f2",
    "day_avg": "22.58",
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
    "month_values": []
}

var day_dates = ["2014-03-28T05:43:00+00:00","2014-03-28T06:43:00+00:00","2014-03-28T07:43:00+00:00","2014-03-28T08:43:00+00:00","2014-03-28T09:43:00+00:00","2014-03-28T10:43:00+00:00","2014-03-28T11:43:00+00:00","2014-03-28T12:43:00+00:00","2014-03-28T13:43:00+00:00","2014-03-28T14:43:00+00:00","2014-03-28T15:43:00+00:00","2014-03-28T16:43:00+00:00","2014-03-28T17:43:00+00:00","2014-03-28T18:43:00+00:00","2014-03-28T19:43:00+00:00","2014-03-28T20:43:00+00:00","2014-03-28T21:43:00+00:00","2014-03-28T22:43:00+00:00","2014-03-28T23:43:00+00:00","2014-03-29T00:43:00+00:00","2014-03-29T01:43:00+00:00","2014-03-29T02:43:00+00:00","2014-03-29T03:43:00+00:00"];
var day_values = ["20.70","20.00","19.20","19.80","19.90","20.10","21.40","23.00","27.40","28.70","27.50","29.30","28.50","27.20","28.60","28.70","25.90","23.40","22.40","21.40","19.80","19.50","20.00"];
var index = 0;




var randomizeDay = function(){
    var temp_values = [];
    var time_values = [];

    var newVal;// generate nuber between 15-30
    var timestamp = moment().utc();
    var yesterday = moment().utc().subtract(1, 'day');

    data.day_start = yesterday.unix()*1000;

    temp_values.push((Math.random() *15 + 15).toString());
    time_values.push(timestamp);

    for(var i = 0; i < 23; i++){
        newVal = Math.random() *15 + 15 ;// generate nuber between 15-30
        timestamp.subtract(1, 'hour').format();

        temp_values.push(newVal.toString());
        time_values.push(timestamp);

        //data.day_dates = day_dates_slice;
        data.day_dates = time_values;

        //data.day_values = day_values_slice;
        data.day_values = temp_values;
    }
}

var randomizeWeek = function(){
    var temp_values = [];
    var time_values = [];

    var newVal;// generate nuber between 15-30
    var timestamp = moment().utc();
    var lastWeek = moment().utc().subtract(1, 'week');

    data.week_start = lastWeek.unix()*1000;

    temp_values.push((Math.random() *15 + 15).toString());
    time_values.push(timestamp);

    for(var i = 0; i < 6; i++){
        newVal = Math.random() *15 + 15 ;// generate nuber between 15-30
        timestamp.subtract(1, 'day').format();

        temp_values.push(newVal.toString());
        time_values.push(timestamp);

        data.week_dates = time_values;
        data.week_values = temp_values;
    }
}

var randomizeMonth = function(){

    var temp_values = [];
    var time_values = [];

    var newVal;// generate nuber between 15-30
    var timestamp = moment().utc();
    var lastMonth = moment().utc().subtract(1, 'month');

    data.month_start = lastMonth.unix()*1000;

    temp_values.push((Math.random() *15 + 15).toString());
    time_values.push(timestamp);

    for(var i = 0; i < 29; i++){
        newVal = Math.random() *15 + 15 ;// generate nuber between 15-30
        timestamp.subtract(1, 'day').format();

        temp_values.push(newVal.toString());
        time_values.push(timestamp);

        data.month_dates = time_values;
        data.month_values = temp_values;
    }
}





var sendData = function(){
    //var day_dates_slice = day_dates.slice(0, index);
    //var day_values_slice = day_values.slice(0, index);
    randomizeDay();
    randomizeWeek();
    randomizeMonth();



    request({
        url: "https://private-39405-statusio.apiary-proxy.com/v2/metric/update",
        body: JSON.stringify(data),
        headers: {"x-api-id": api_id, "x-api-key": api_key, "Content-Type": "application/json"},
        method: "POST"
    }, function (error, response, body) {


        console.log("Status", response.statusCode);
        console.log("Headers", JSON.stringify(response.headers));
        console.log("Response received", body);

        index++;
        //if(index < day_dates.length) {
            //setTimeout(sendData, 1000);
        //}
    });
}

module.exports = {
    watch: function() {
        sendData();
    }
}