/**
 * Created by B-04 on 2017/8/8.
 */
var express = require('express');

module.exports = LittleFish;

function LittleFish(x, y, w, h, ss,  l, sd, ft) {
    this.xPos = x;
    this.yPos = y;
    this.width = w;
    this.height = h;
    this.swimSpeed = ss;
    this.line = l;
    this.swimDirection = sd;
    this.fishType = ft;

    this.swim = function () {
        switch (this.swimDirection) {
            case 0:
                this.xPos += this.swimSpeed;
                break;
            case 1:
                this.xPos -= this.swimSpeed;
                break;
        }
    };
}