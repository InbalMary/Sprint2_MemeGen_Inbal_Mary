'use strict'

var gImgs = [{ id: 1, url: 'imgs/1.jpg', keywords: ['funny', 'cat'] }]

var gMeme = {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red',
            strokeColor: 'black'
        }
    ]
}
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function getCurTxt() {
    return gMeme.lines[gMeme.selectedLineIdx].txt
}

function setselectedImgId(id) {
    gMeme.selectedImgId = id
}

function setColor(color) {
    console.log('color', color)
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setStrokeColor(strokeColor) {
    console.log('strokeColor', strokeColor)
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = strokeColor
}

function setFontSize(val) {
    gMeme.lines[gMeme.selectedLineIdx].size += val
}