/**
 * Created by B-04 on 2017/8/9.
 */
/**
 * Created by B-04 on 2016/12/21.
 */
var express = require('express');
var async = require('async');
var GameServer = require('../services/GameServer');
var FishTank = require('../services/fishing/FishTank');
var router = express.Router();

router.post('/create', function (req, res) {
    var id = req.body.id || 1;
    var user = req.body.user || 2;
    var gs = new GameServer(id, user, function () {
        var roomInfo = {
            id: res.app.locals.socket_map.length,
            gs: gs
        };
        res.app.locals.socket_map.push(roomInfo);
        gs.sendMessage();
        res.json(400, {msg: roomInfo.id});
    });

});


router.get('/create', function (req, res) {

    var id = req.query.id || 1;
    var user = req.query.user || 2;
    var gs = new GameServer(id, user, function () {
        res.app.locals.socket_map[res.app.locals.roomNum] = gs;
        gs.sendMessage();
        res.app.locals.roomNum++;
        res.json(200, {msg: res.app.locals.roomNum});
    });

});

router.get('/closeSocket', function (req, res) {

    var msg = '';
    var roomId = req.query.roomId || 0;
    if (res.app.locals.socket_map[roomId]) {
        res.app.locals.socket_map[roomId].gs.closeConnect();
        res.app.locals.socket_map[roomId] = null;
        msg = roomId;
    } else {
        msg = 'no this room';
    }
    res.json(200, {msg: msg});
});

router.get('/getUrl', function (req, res) {

    var currentRoom = res.app.locals.roomNum;
    res.header('Access-Control-Allow-Origin', '*');

    var resData = {
        host: '127.0.0.1',
        port: 8001,
        roomId: currentRoom,
        player: 0
    };

    var roomInfo = {
        pNum: 0
    };
    if (res.app.locals.socket_map[res.app.locals.roomNum] == null) {
        resData.player = 1;
        new GameServer({roomId: currentRoom}, function () {
            roomInfo.pNum++;
            res.app.locals.socket_map[res.app.locals.roomNum] = roomInfo;
        });
    } else {
        resData.player = 2;
        res.app.locals.socket_map[res.app.locals.roomNum].pNum++;
        res.app.locals.roomNum++;
    }
    res.json(200, {data: resData});
});


module.exports = router;