var request = require("request");
var moment = require("moment");




var check = function(url, cb){
    request({
        url: url,
        method: "GET"
    }, function (error, response, body) {

        if (error){
            throw error;
        }

        console.log("Status", response.statusCode);
        //console.log("Response received", body);

        StatusResult.create({url: url, status:response.statusCode}).exec(function createCB(err,created){
            console.log(created);
        })

        if(response.statusCode === "200"){
            cb(true);

        }
        else {
            cb(false);
        }

        setTimeout(check.bind(null, url, function(){}), 5000);

    });

}



module.exports = {
    watch: function(url) {
        check(url, function(){});
        //setTimeout(check(url, function(){}), 5000);
    }
}