'use strict'

var gImgs = [{ id: 1, url: 'imgs/1.jpg', keywords: ['funny', 'cat'] }]

var gMeme = {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Write your text here',
            size: 20,
            color: 'red',
            strokeColor: 'black',
            isSelected: true
        },
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red',
            strokeColor: 'black',
            isSelected: false
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

function addLine() {
    gMeme.lines.forEach(line => line.isSelected = false)

    const newLine =
    {
        txt: 'New line added',
        size: 20,
        color: 'red',
        strokeColor: 'black',
        isSelected: true,
    }

    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function getNextLineY() {
    const lineCount = gMeme.lines.length
    const baseY = 50
    const lineSpacing = 50
    return baseY + lineCount * lineSpacing
}

function switchLine() {
    const lines = gMeme.lines
    const currIdx = gMeme.selectedLineIdx

    lines[currIdx].isSelected = false

    const nextIdx = (currIdx + 1) % lines.length
    gMeme.selectedLineIdx = nextIdx
    lines[nextIdx].isSelected = true
    console.log('gMeme.selectedLineIdx', gMeme.selectedLineIdx)
}

function setPosition(line, idx, x, y) {
    gMeme.lines[idx].pos = {x, y}
}