/**
 * Created by B-04 on 2017/8/9.
 */
/**
 * Created by B-04 on 2016/12/21.
 */
var express = require('express');
var async = require('async');
var GameServer = require('../services/GameServer');
var RoomLogic = require('../services/RoomLogic');
var FishTank = require('../services/fishing/FishTank');
var router = express.Router();
var util = require('../services/util');

router.get('/getUrl', function (req, res) {

    var currentRoom = RoomLogic.getInstance().roomNum;
    res.header('Access-Control-Allow-Origin', '*');

    var reqData = req.query;
    var host = reqData.host;
    var port = reqData.port;
    var appId = reqData.appId;
    var uid = reqData.uid;
    var localAddress = res.app.locals.addr;
    console.log(currentRoom);
    var rid = util.getMd5(localAddress + currentRoom);
    console.log(rid);
    var gameServerId = util.getGameServerId(rid);
    var player = 0;

    var resData = {
        roomId: util.getMd5(localAddress + currentRoom),
        gameServerId: gameServerId,
        createRoom: false
    };

    var roomInfo = {
        pNum: 0,
        player1: null,
        player2: null
    };
    try {
        //分配玩家身份以及把gameServer连接到socket并创建房间
        if (RoomLogic.getInstance().socket_map[rid] == null) {
            player = 1;
            resData.createRoom = true;
            new GameServer({
                roomId: resData.roomId,
                host: host,
                gameServerId: gameServerId,
                port: port,
                appId: appId
            }, function () {
                roomInfo.pNum++;
                roomInfo.player1 = uid;
                RoomLogic.getInstance().socket_map[rid] = roomInfo;
            });
            res.json(200, {
                data: resData,
                gd: {
                    player: player
                }
            });
        } else if (RoomLogic.getInstance().socket_map[rid] && RoomLogic.getInstance().socket_map[rid].player1 == uid) {
            res.json(400, {msg: '该玩家重复进入游戏'});
        }
        else {
            player = 2;
            RoomLogic.getInstance().socket_map[rid].pNum++;
            RoomLogic.getInstance().roomNum++;
            res.json(200, {
                data: resData,
                gd: {
                    player: player
                }
            });
        }
    } catch (e) {
        console.log(e);
        res.json(200, {
            data: resData,
            gd: {
                player: player
            }
        });
    }
});

module.exports = router;