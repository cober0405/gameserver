/**
 * Created by B-04 on 2017/7/27.
 */
var controlArr = new Array();//记录所有control端的连接
var showArr = new Array();//记录所有show端的连接
var ws = require('nodejs-websocket');
var server = ws.createServer(function (connection) {
    connection.data = null;
    connection.type = null;
    console.log("new connetion");
    console.log("连接数connection = " + server.connections.length);
    //接收数据
    connection.on("text", function (str) {
        // console.log(str);
        var data = JSON.parse(str);
        // console.log("userid =", data.userid, "type =", data.type, "roomId =", data.roomId);
        if (connection.data === null) {

            /**
             * 1.判断链接是control端还是show端
             * 2.如果是control端，且是第一次发送消息，什么都不做
             * 3.如果是control端，不是第一次发送消息，那给所有的show端发送消息请求，游戏开始。
             * 4.show端接受消息，对应的唯一show端，做相对应的处理，并返回消息。
             * 5.游戏正式开始
             */

            connection.userid = data.userid;
            connection.type = data.type;
            connection.roomId = data.roomId;
            connection.player = data.player;
            var broadData;

            broadData = data;

            broadcast(JSON.stringify(broadData));

        } else {
            broadcast("[" + connection.userid + "] " + connection.userid);
            // console.log("connection.userid = " + connection.userid);
        }
    });
    connection.on("close", function () {
        var data = {userid: connection.userid, roomId: connection.roomId, type: "leave", player: connection.player};
        var str = JSON.stringify(data);
        broadcast(str);
        console.log("userid =", data.userid, "roomId =", data.roomId, " close");
        console.log("连接数connection = " + server.connections.length);
    });
    connection.on("error", function () {
        if (connection.type == "control") {
            var indexControl = controlArr.indexOf(connection);
            if (indexControl != -1) {
                controlArr.splice(indexControl, 1);
            }
        }
        if (connection.type == "show") {
            var indexShow = controlArr.indexOf(connection);
            if (indexShow != -1) {
                controlArr.splice(indexShow, 1);
            }
        }
    });
})
server.listen(8001);
/**
 *
 * 发送消息到所有连接
 */
function broadcast(str) {
    server.connections.forEach(function (connection) {
        connection.sendText(str);
    })
}
/**
 *
 * 发送消息到control(控制)端
 */
function sendMessageToControl(str) {
    server.connections.forEach(function (connection) {
        if (connection.type == "control") {
            connection.sendText(str);
        }
    })
}
/**
 *
 * 发送消息到show(表现)端
 */
function sendMessageToShow(str) {
    server.connections.forEach(function (connection) {
        if (connection.type == "show") {
            connection.sendText(str);
        }
    })
}
console.log("服务器启动");

var request = require('request').defaults({
    baseUrl: 'http://localhost:' + (process.env.PORT || 3000),
    json: true
});

function closeGameServer(roomId) {
    request({
        url: '/api/closeSocket?roomId=' + roomId,
        method: 'GET'
    }, function (err, res, body) {
        try {
            console.log(body.msg);
        }catch (e){
            console.log('no msg');
        }
    });
}
