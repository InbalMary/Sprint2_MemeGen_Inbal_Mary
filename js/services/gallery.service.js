'use strict'

var gPics = []
_createPics()

function getPics() {
    return gPics
}

function getPicById(picId) {
    return gPics.find(pic => picId === pic.id)
}

function _createPics() {
    for(var i=0; i<2; i++){
        gPics.push(_createPic(i))
    }
}

function _createPic(idx) {
    return {
        id: idx+1,
        url: `imgs/${idx+1}.jpg`
    }
}