/**
 * Created by B-04 on 2017/8/9.
 */
var express = require('express');

var ws = require('nodejs-websocket');
var FishTank = require('./fishing/FishTank');
var util = require('./util');
var handlerJson = require('../data/handler.json');

function GameServer(params, callback) {
    var that = this;
    this.gsData = {
        roomId: params.roomId,
        appId: params.appId,
        ft: null,
        url: 'ws://' + params.host + ':' + params.port,
        gameServerId: params.gameServerId
    };

    this.server = ws.connect(that.gsData.url, function () {
        console.log('CONNECTED: ' + that.gsData.url + ',roomId=' + that.gsData.roomId);
        that.sendMessage(handlerJson.CHECK_GAME_SERVER, '');
        callback();
    });

    this.sendMessage = function (handler, data) {
        var sendData = {
            appId: that.gsData.appId,
            handler: handler,
            uid: that.gsData.gameServerId,
            roomId: that.gsData.roomId,
            ts: +new Date(),
            gd: data || ''
        };
        var sendStr = util.construct(sendData);
        console.log(sendStr);
        that.server.sendText(sendStr);
    };
    this.closeConnect = function () {
        console.log('CLOSE CONNECT: ' + that.gsData.url + ',roomId=' + that.gsData.roomId);
        that.server.close();
    };

    this.server.on('text', function (str) {
        console.log("I receive a msg:" + str);
        var recData = util.deconstruct(str);
        if (recData.roomId == that.gsData.roomId) {
            switch (recData.gd.type) {
                //1号玩家准备
                case 'create':
                    that.gsData[recData.appId + '_' + recData.uid] = true;
                    break;
                //所有玩家准备完毕
                case 'allReady':
                    that.startGame();
                    that.gsData[recData.appId + '_' + recData.uid] = true;
                    break;
                //有玩家离开游戏
                case 'leave':
                    clearInterval(that.si);
                    that.closeConnect();
                    break;
                case 'startThrow':
                    console.log(recData);
                    if (recData.gd.player == 1) {
                        that.gsData.ft.throwLeftHook();
                    } else if (recData.gd.player == 2) {
                        that.gsData.ft.throwRightHook();
                    }
                    break;
            }
        }
    })
        .on('error', function () {
            console.log('socket bye bye');
            clearInterval(that.si);
        });


    this.si = null;

    this.startGame = function () {
        var ft = new FishTank();
        var count = 0;
        that.gsData.ft = ft;
        that.sendMessage(handlerJson.SEND_MESSAGE, 'startGame,' +ft.updateStatus());
        that.si = setInterval(function () {
            count++;
            if (count % 2 == 0) {
                that.sendMessage(handlerJson.SEND_MESSAGE, 'updateTank,' + ft.updateStatus());
            } else {
                ft.updateStatus();
            }
        }, 100);
    }
}

module.exports = GameServer;