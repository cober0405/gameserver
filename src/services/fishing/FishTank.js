/**
 * Created by B-04 on 2017/8/8.
 */
var express = require('express');
var FishFactory = require('./FishFactory');


var tankWidth = 960;
var tankHeight = 640;
var tankLines = 4;
var fishCount = 4;
var hookWidth = 20;
var hookHeight = 20;
function updateHook(hook) {
    if (hook.isThrowing == 1) {
        hook.throwHook();
        if (hook.yPos >= tankHeight - hookHeight - 50 ||
            hook.xPos <= 50 || hook.xPos >= tankWidth - hookWidth - 50) {
            hook.throwDirection = -1;
        }
    }
    else {
        hook.rollHook();
    }
}

//碰撞检测
function checkPointInFish(fish, xPos, yPos) {
    return (xPos >= fish.xPos && xPos <= fish.xPos + fish.width
    && yPos >= fish.yPos && yPos >= fish.yPos + fish.height );
}

function checkFishOut(fish) {
    var result = true;
    if (fish.xPos >= fish.width * -1 && fish.xPos <= tankWidth + fish.width && fish.yPos > 150) {
        result = false;
    }
    return result;
}


function FishTank() {
    this.ropeLen = 0;
    this.frequency = 50; //ms
    // this.leftHook = null;
    // this.rightHook = null;
    // this.leftHook = FishFactory.jumpHook(tankWidth / 3, -3, this.ropeLen);
    // this.rightHook = FishFactory.jumpHook(tankWidth * 2 / 3, -3, this.ropeLen);
    this.leftHook = FishFactory.jumpHook(275, 110, this.ropeLen);
    this.rightHook = FishFactory.jumpHook(690, 110, this.ropeLen);
    // this.fishList = null;
    this.fishList = [];
    for (var i = 0; i < fishCount; i++) {
        this.fishList[i] = FishFactory.jumpFish(tankWidth, tankHeight, tankLines);
    }

    /*    this.doCreateTank = function () {
     this.leftHook = FishFactory.jumpHook(this.tankWidth / 3, -3, this.ropeLen);
     this.rightHook = FishFactory.jumpHook(this.tankWidth * 2 / 3, -3, this.ropeLen);
     this.fishList = [];
     for (var i = 0; i < this.fishCount; i++) {
     this.fishList[i] = FishFactory.jumpFish(this.tankWidth, this.tankHeight, this.tankLines);
     }
     };*/


    this.throwLeftHook = function () {
        this.leftHook.isThrowing = 1;

    };

    this.throwRightHook = function () {
        this.rightHook.isThrowing = 1;
    };

    function checkFishHook(ind, fish, hook) {

        var result;

        result = (
            checkPointInFish(fish, hook.xPos, hook.yPos)
            || checkPointInFish(fish, hook.xPos + hook.width, hook.yPos)
            || checkPointInFish(fish, hook.xPos, hook.yPos + hook.height)
            || checkPointInFish(fish, hook.xPos + hook.width, hook.yPos + hook.height)
        );

        if (result) {
            console.log(result);
            hook.throwDirection = -1;
            hook.hasHooked = true;
            hook.hookedFishType = ind;
            hook.score += fish.score;
            // var newFish = null;
            // newFish = FishFactory.jumpFish(tankWidth, tankHeight, tankLines);
            //TODO
            //Need add fish dead body on the hook
            // fish = null;
            // fish = FishFactory.jumpFish(tankWidth, tankHeight, tankLines);
        } else {
            hook.hasHooked = false;
        }
        return result;
    }

    this.updateStatus = function () {
        // console.log("LeftHook isThrowing: " + this.leftHook.isThrowing);
        updateHook(this.leftHook);

        // console.log("RightHook isThrowing: " + this.rightHook.isThrowing);
        updateHook(this.rightHook);
        var pos = fishCount;

        for (var i = 0; i < fishCount; i++) {
            this.fishList[i].swim();

            if (this.leftHook.isThrowing == 1) {
                if (!this.leftHook.hasHooked) {
                    if (checkFishHook(i, this.fishList[i], this.leftHook)) {
                        this.fishList[i].xPos = this.leftHook.xPos;
                        this.fishList[i].yPos = this.leftHook.yPos;
                    }
                } else {
                    if (this.leftHook.hookedFishType == i) {
                        this.fishList[i].xPos = this.leftHook.xPos;
                        this.fishList[i].yPos = this.leftHook.yPos;
                    }
                }
            }

            if (this.rightHook.isThrowing == 1) {
                if (!this.rightHook.hasHooked) {
                    if (checkFishHook(i, this.fishList[i], this.rightHook)) {
                        this.fishList[i].xPos = this.rightHook.xPos;
                        this.fishList[i].yPos = this.rightHook.yPos;
                    }
                } else {
                    if (this.rightHook.hookedFishType == i) {
                        this.fishList[i].xPos = this.rightHook.xPos;
                        this.fishList[i].yPos = this.rightHook.yPos;
                    }
                }
            }

            if (checkFishOut(this.fishList[i])) { //If the fish swim out the tank, then renew the fish
                this.fishList[i] = null;
                this.fishList[i] = FishFactory.jumpFish(tankWidth, tankHeight, tankLines);
            }

            pos += "," + this.fishList[i].xPos + "," + this.fishList[i].yPos + ","
                + this.fishList[i].fishType + "," + this.fishList[i].swimDirection;
        }

        pos += "," + this.leftHook.throwDirection + "," + this.leftHook.rollDirection +
            ","+ this.leftHook.isThrowing +
            "," + this.leftHook.xPos + "," + this.leftHook.yPos +
            "," + this.leftHook.ancle + "," + this.leftHook.score +
            "," + this.leftHook.hasHooked + "," + this.leftHook.hookedFishType +
            "," + this.rightHook.throwDirection + "," + this.rightHook.rollDirection +
            "," + this.rightHook.isThrowing +
            "," + this.rightHook.xPos + "," + this.rightHook.yPos +
            "," + this.rightHook.ancle + "," + this.rightHook.score +
            "," + this.rightHook.hasHooked + "," + this.rightHook.hookedFishType;

        return pos;
    }

}


module.exports = FishTank;
