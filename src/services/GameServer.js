/**
 * Created by B-04 on 2017/8/9.
 */
var express = require('express');

var ws = require('nodejs-websocket');
var url = 'ws://127.0.0.1:8001';
var FishTank = require('./fishing/FishTank');

function GameServer(params, callback) {
    var that = this;
    this.testData = {
        roomId: params.roomId,
        ft: null
    };

    this.server = ws.connect(url, function (conn) {
        console.log('CONNECTED TO: ' + url);
        callback();
    });

    this.sendMessage = function (type, data) {
        // console.log('SEND TO: ' + url + ',roomId=' + that.testData.roomId + ',type=' + type);
        var sendData = {
            roomId: that.testData.roomId,
            type: type,
            msg: data
        };
        that.server.sendText(JSON.stringify(sendData));
    };
    this.closeConnect = function () {
        console.log('CLOSE CONNECT: ' + url + ',roomId=' + that.testData.roomId);
        that.server.close();
    };

    this.server.on('text', function (str) {
        // console.log("I receive a msg:" + str);
        var recData = JSON.parse(str);
        if (recData.roomId == that.testData.roomId) {
            switch (recData.type) {
                //所有玩家准备完毕
                case 'allReady':
                    that.startGame();
                    break;
                //有玩家离开游戏
                case 'leave':
                    clearInterval(that.si);
                    that.closeConnect();
                    break;
                case 'startThrow':
                    console.log(recData);
                    if (recData.player == 1) {
                        that.testData.ft.throwLeftHook();
                    } else if (recData.player == 2) {
                        that.testData.ft.throwRightHook();
                    }
                    break;
            }
        }
    });

    this.si = null;

    this.startGame = function () {
        var ft = new FishTank();
        var count = 0;
        that.testData.ft = ft;
        that.sendMessage('startGame', ft.updateStatus());
        that.si = setInterval(function () {
            count++;
            if(count%2==0){
                that.sendMessage('updateTank', ft.updateStatus());
            }else{
                ft.updateStatus();
            }
        }, 50);
    }
}

module.exports = GameServer;