/**
 * Created by B-04 on 2017/8/18.
 */
var express = require('express');
var instance;
module.exports = {
    getInstance : function () {
        if(!instance){
            instance = new RoomLogic();
        }
        return instance;
    }
};

function RoomLogic() {
    this.roomNum = 0;
    this.socket_map = {};
}