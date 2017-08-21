/**
 * Created by B-04 on 2017/8/8.
 */
var express = require('express');
var Hook = require('./Hook');
var LittleFish = require('./LittleFish');

var hookSpeed = 8;
var hookWidth = 20;
var hookHeight = 20;
var rollSpeed = 5;
var ancle = 15;
module.exports = {
    jumpHook: function (ropeXPos, ropeYPos, ropeLen) {
        return new Hook((ropeXPos - (ropeLen * Math.cos(Math.PI * 15 / 180))),
            (ropeYPos + ( ropeLen * Math.sin(Math.PI * 15 / 180))), hookWidth, hookHeight, rollSpeed, hookSpeed, ancle, ropeLen, ropeXPos, ropeYPos);
    },
    jumpFish: function (tankWidth, tankHeight, lines) {
        var fishType = Math.floor(4 * Math.random());
        var tankLine = Math.floor(lines * Math.random());
        var swimDirection = Math.floor(2 * Math.random());
        var fish = new LittleFish(0, 0, 0, 0, 0, 0, 0, fishType);
        switch (fishType) {
            case 0: //BigFish
                fish.width = 63;
                fish.height = 57;
                fish.swimSpeed = 2;
                fish.score = 500;
                break;
            case 1: //SmallFish
                fish.width = 91;
                fish.height = 67;
                fish.swimSpeed = 4;
                fish.score = 999;
                break;
            case 2: //SmallFish
                fish.width = 72;
                fish.height = 72;
                fish.swimSpeed = 4;
                fish.score = 1500;
                break;
            case 3: //SmallFish
                fish.width = 65;
                fish.height = 55;
                fish.swimSpeed = 8;
                fish.score = -50;
                break;
        }
        fish.line = tankLine;
        // fish.yPos = (tankLine + 1) * tankHeight / (lines + 1);
        fish.yPos = (220 + 300 * Math.random()).toFixed(0);
        fish.swimDirection = swimDirection;
        // console.log(fishType,swimDirection);

        switch (swimDirection) {
            case 0://from left to right
                fish.xPos = -fish.width;
                break;
            case 1://from right to left
                fish.xPos = tankWidth + fish.width;
                break;
        }

        return fish;
    }
};
