var express = require('express');
var crypto = require('crypto');
var tokenName = require('../data/config.json').tokenName;
var accountIdName = require('../data/config.json').accountIdName;

function md5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

var appKey = '5600441101c8818c4480d3c503742a3b';

module.exports = {
    getSign: function (params) {
        var temArray = [];
        for (var i in params) {
            temArray.push(i);
        }
        temArray.sort();
        var str = '';
        for (var j in temArray) {
            str += params[temArray[j]];
        }
        str += appKey;
        return md5(str).toUpperCase();
    },
    getSignCreate: function (params) {
        var sign = params.appId + params.gameTransCode + params.pid + params.quantity + params.token + params.appKey;
        return md5(sign).toUpperCase();
    },
    getShareSign: function (params) {
        // var sign = params.appId + params.jsApiTicket + params.appKey;
        var sign = params.allianceId + params.appId + params.appKey;
        return md5(sign).toUpperCase();
    }
};