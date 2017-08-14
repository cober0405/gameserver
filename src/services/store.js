var express = require('express');
var async = require('async');
var util = require('./util');

var request = require('request').defaults({
    baseUrl: 'http://localhost:' + (process.env.PORT || 3000),
    json: true
});

module.exports = {
    pfLogin: function (params, callback) {
        params.sign = util.getSign(params);
        request({
            url: '/pf/ema-platform/member/pfLogin',
            method: 'POST',
            form: params
        }, function (err, res, body) {
            callback(err, body);
        });
    }
};
