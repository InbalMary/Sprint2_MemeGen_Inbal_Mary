'use strict'

var gImgs = [{ id: 1, url: 'imgs/1.jpg', keywords: ['funny', 'cat'] }]

var gMeme = {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Write your text here',
            size: 30,
            color: 'red',
            strokeColor: 'black',
            isSelected: true,
            font: 'David',
            align: 'center',
            isDeleted: false,
            isDrag: false
        },
        {
            txt: 'I sometimes eat Falafel',
            size: 30,
            color: 'red',
            strokeColor: 'black',
            isSelected: false,
            font: 'David',
            align: 'center',
            isDeleted: false,
            isDrag: false
        }
    ]
}
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function getLines() {
    return gMeme.lines
}

function getCurLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function getCurLineIdx() {
    return gMeme.selectedLineIdx
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
        size: 30,
        color: 'red',
        strokeColor: 'black',
        isSelected: true,
        font: 'David',
        align: 'center',
        isDeleted: false,
        isDrag: false
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
    gMeme.lines[idx].pos = { x, y }
}

function setCurLineFont(fontName) {
    gMeme.lines[gMeme.selectedLineIdx].font = fontName
}

function setAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align
}

function deleteLine() {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    if (line) line.isDeleted = true;
}

function setLineDrag(idx, isDrag) {
    if (idx < 0 || idx >= gMeme.lines.length) return
    const line = gMeme.lines[idx]
    line.isDrag = isDrag
}

function moveSpecificLine(lineIdx, dx, dy) {
    if (lineIdx < 0) return
    gMeme.lines[lineIdx].pos.x += dx
    gMeme.lines[lineIdx].pos.y += dy
}