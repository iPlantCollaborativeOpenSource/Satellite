var request = require("request");
var moment = require("moment");




var check = function(url, poll, cb){
    //var startTime = moment();

    request({
        url: url,
        method: "GET"
    }, function (error, response, body) {

        if (error){
            throw error;
        }

        console.log("Status", response.statusCode);
        //console.log("Response received", body);


        //saved to DB :)
        StatusResult.create({url: url, status:response.statusCode}).exec(function createCB(err,created){
            // TODO: save info with url as key (or nickname as key)
            // this is to manage multiple services
            //console.log(created);
        })

        if(response.statusCode === "200"){
            cb(true);

        }
        else {
            cb(false);
        }

        setTimeout(check.bind(null, url, poll, function(){}), poll);

    });

}



module.exports = {
    watch: function(url, poll) {
        check(url, poll, function(){});
        //setTimeout(check(url, function(){}), 5000);
    }
}