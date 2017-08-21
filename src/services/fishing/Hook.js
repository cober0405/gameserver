/**
 * Created by B-04 on 2017/8/8.
 */
var express = require('express');

function Hook(x,y,w,h,rs,ts,a,rl,rx,ry) {
    this.throwDirection = 1;
    this.rollDirection = 1;
    this.ropeLengthExt = 0;
    this.throwAncle = 0;
    this.isThrowing = 0;
    this.hasHooked = false;
    this.xPos = x;
    this.yPos = y;
    this.width = w;
    this.height = h;
    this.throwSpeed = ts;
    this.rollSpeed = rs;
    this.ancle = a;
    this.ropeLength = rl;
    this.ropeXPos = rx;
    this.ropeYPos = ry;
    this.ropeLengthExt = this.ropeLength;
    this.hookedFishType = -1;
    this.score = 0;

    this.initHookStatus = function () {
        this.throwDirection = 1;
        this.isThrowing = 0;
        this.hasHooked = false;
        this.hookedFishType = -1;
        this.ropeLengthExt = this.ropeLength;
    };

    this.throwHook = function () {
        if (this.isThrowing == 0) {
            this.throwDirection = 1;
            return;
        }

        this.throwAncle = this.ancle;
        this.ropeLengthExt += this.throwSpeed * this.throwDirection;

        // console.log("Throwing hook, rope len: " + this.ropeLengthExt);

        if (this.ropeLengthExt <= this.ropeLength) {
            this.initHookStatus();
        }

        this.xPos = this.ropeXPos - (this.ropeLengthExt * Math.cos(Math.PI * this.throwAncle / 180));
        this.yPos = this.ropeYPos + (this.ropeLengthExt * Math.sin(Math.PI * this.throwAncle / 180));
        this.xPos = this.xPos.toFixed(0);
        this.yPos = this.yPos.toFixed(0);
    };

    this.rollHook = function () {
        if (this.isThrowing == 1) {
            return;
        }
        this.ancle += this.rollDirection * this.rollSpeed;
        if (this.ancle == 15 || this.ancle == 165) {
            this.rollDirection = this.rollDirection * -1;
        }
        this.throwAncle = this.ancle;
        this.xPos = this.ropeXPos - (this.ropeLength * Math.cos(Math.PI * this.ancle/180));
        this.yPos = this.ropeYPos + (this.ropeLength * Math.sin(Math.PI * this.ancle/180));
        this.xPos = this.xPos.toFixed(0);
        this.yPos = this.yPos.toFixed(0);

        // console.log("current ancle: " + this.ancle);
    };
}

module.exports = Hook;