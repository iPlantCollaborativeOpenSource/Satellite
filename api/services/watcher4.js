var request = require("request");
var moment = require("moment");

var api_id = process.env.STATUS_IO_API_ID;
var api_key = process.env.STATUS_IO_API_KEY;
var status = "544e810996cc7fe45400896c";
var metric = "544e86d396cc7fe4540089f2";


var check = function(url, cb){
    request({
        url: url,
        method: "GET"
    }, function (error, response, body) {

        if (error){
            throw error;
        }

        console.log("Status", response.statusCode);
        console.log("Response received", body);

        StatusResult.create({url: url, status:response.statusCode}).exec(function createCB(err,created){
            console.log(created);
        })

        if(response.statusCode === "200"){
            cb(true);

        }
        else {
            cb(false);
        }

        //setTimeout(check, 5000);


    });

}



module.exports = {
    watch: function(url) {
        check(url, function(){});

    }
}