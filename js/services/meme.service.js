'use strict'

var gImgs = [{ id: 1, url: 'imgs/1.jpg', keywords: ['funny', 'cat'] }]

const STORAGE_KEY = 'savedMemesDB'

var gSavedMemes = loadFromStorage(STORAGE_KEY) || []
var gSelectedSavedMemeId = null

var gMeme = {
    selectedImgId: 2,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Write your text here',
            size: 30,
            color: 'white',
            strokeColor: 'black',
            isSelected: true,
            font: 'Tahoma',
            align: 'center',
            isDeleted: false,
            isDrag: false,
            rotation: 0
        },
        {
            txt: 'I sometimes eat Falafel',
            size: 30,
            color: 'white',
            strokeColor: 'black',
            isSelected: false,
            font: 'Tahoma',
            align: 'center',
            isDeleted: false,
            isDrag: false,
            rotation: 0
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

function addLine(txt = 'New line added') {
    gMeme.lines.forEach(line => line.isSelected = false)

    const newLine =
    {
        txt,
        size: 30,
        color: 'white',
        strokeColor: 'black',
        isSelected: true,
        font: 'Tahoma',
        align: 'center',
        isDeleted: false,
        isDrag: false,
        rotation: 0
    }

    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
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

function setRandomGmem(picId) {
    gMeme = {
        selectedImgId: picId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: makeFunnyLorem(),
                size: 30,
                color: 'white',
                strokeColor: 'black',
                isSelected: true,
                font: 'Tahoma',
                align: 'center',
                isDeleted: false,
                isDrag: false,
                rotation: 0
            }
        ]
    }
}

function setGmem(picId) {
    gMeme = {
        selectedImgId: picId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Write your text here',
                size: 30,
                color: 'white',
                strokeColor: 'black',
                isSelected: true,
                font: 'Tahoma',
                align: 'center',
                isDeleted: false,
                isDrag: false,
                rotation: 0
            },
            {
                txt: 'I sometimes eat Falafel',
                size: 30,
                color: 'white',
                strokeColor: 'black',
                isSelected: false,
                font: 'Tahoma',
                align: 'center',
                isDeleted: false,
                isDrag: false,
                rotation: 0
            }
        ]
    }
}

// Saved Memes
function saveCurMeme(preview) {
    if (gSelectedSavedMemeId) {
        const idx = gSavedMemes.findIndex(meme => meme.memeId === gSelectedSavedMemeId)
        if (idx !== -1) {
            gSavedMemes[idx].preview = preview
            gSavedMemes[idx].memeData = _createMemeDataToSave()
        }
        gSelectedSavedMemeId = null
    } else {
        var curMmeme = _createCurMemeToSave(preview, makeId())
        gSavedMemes.unshift(curMmeme)
    }
    saveToStorage(STORAGE_KEY, gSavedMemes)
    renderSavedMemes()
}

function _createCurMemeToSave(preview, memeId) {
    // const memeToSave = JSON.parse(JSON.stringify(getMeme()))
    return {
        memeId: memeId,
        preview: preview,
        memeData: _createMemeDataToSave(),
        timestamp: Date.now()
    }
}

function _createMemeDataToSave() {
    const meme = JSON.parse(JSON.stringify(getMeme()))
    if (gUploadedImg?.src) {
        meme.uploadedImgUrl = gUploadedImg.src
    }
    return meme
}

function getSavedMemes() {
    return gSavedMemes
}

function saveMemes(updatedMemes) {
    gSavedMemes = updatedMemes
    saveToStorage(STORAGE_KEY, gSavedMemes)
    renderSavedMemes()
}

function loadMemeForEditing(memeId) {
    console.log('getSavedMemes(), memeid', getSavedMemes(), memeId)
    const memeToLoad = getSavedMemes().find(meme => meme.memeId === memeId)
    console.log('memeToLoad', memeToLoad)
    if (!memeToLoad) return null
    const memeCopy = JSON.parse(JSON.stringify(memeToLoad.memeData))
    setGmemFromSaved(memeCopy)
    return memeCopy
}

function setGmemFromSaved(meme) {
    // gMeme = meme
    gMeme = JSON.parse(JSON.stringify(meme))
}

function deleteMeme(memeId) {
    const memeIdx = gSavedMemes.findIndex(meme => memeId === meme.memeId)
    if (memeIdx === -1) return
    gSavedMemes.splice(memeIdx, 1)
    saveToStorage(STORAGE_KEY, gSavedMemes)
}