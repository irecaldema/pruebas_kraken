'use strict';
var mongoose = require('mongoose');

var db = function () {
    return {
        config: function (conf) {
        //config: function () {
            mongoose.connect('mongodb://' + conf.host + '/' + conf.database);
            //mongoose.connect('mongodb://admin:zubiri@ds049864.mongolab.com:49864/app_tracking');
            var db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', function callback() {
                console.log('db connection open');
            });
        }
    };
};

module.exports = db();