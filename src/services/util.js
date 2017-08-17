var express = require('express');
var crypto = require('crypto');

function md5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

var gameServerKey = '85fcaefc3ad955d814e1e9605b674719';

module.exports = {
    construct: function (params) {
        return params.appId + '|' + params.handler + '|' + params.uid + '|'
            + params.roomId + '|' + params.ts + '|' + encodeURI(params.gd);
    },
    deconstruct: function (msg) {
        var arr = msg.split('|');
        var gdArr = decodeURI(arr[5]).split(',');
        return {
            appId: arr[0],
            handler: arr[1],
            uid: arr[2],
            roomId: arr[3],
            ts: arr[4],
            gd: {
                player: gdArr[0],
                type: gdArr[1]
            }
        };
    },
    getMd5: function (data) {
        return md5(data);
    },
    getGameServerId: function (data) {
        return md5(data + gameServerKey);
    }
};