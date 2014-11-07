/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
    //watcher4.watch("http://atmobeta.iplantc.org", 5000);
    watcher5.watch("https://atmo.iplantcollaborative.org", 5000);
    //aggregator.aggregate("https://atmo.iplantcollaborative.org");


    //TODO call reporting service every hour
    setTimeout(aggregator.aggregate(), 10000);

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
