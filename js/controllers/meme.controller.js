'use strict'

var gElCanvas
var gCtx
var gIsMouseDown = false
var gStartPos
var gSelectedImg

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    onResize()
    renderGallery()
}

function onResize() {
    resizeCanvas()
    renderRandomMeme()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}


function onRenderMeme(picId, txt) {
    onClearCanvas()
    selectPic(picId, txt)
}

function renderMeme(meme = getMeme(), txt = null) {
    if (!txt) {        
        txt = getCurTxt()
        setCurImgId(gSelectedImg.id)
    } 

    console.log('meme', meme)
    onRenderMeme(gSelectedImg.id, txt)
}

function renderRandomMeme() {
    var pics = getPics()
    var randPic = pics[getRandomIntInclusive(0, pics.length - 1)]
    gSelectedImg = randPic
    renderMeme(randPic, 'Write your text here')
}

function drawText(text, x, y) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'brown'
    gCtx.fillStyle = 'black'
    gCtx.font = '40px Arial'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function onSetSetLineTxt(elInput) {
    console.log('elinput', elInput.value)
    setLineTxt(elInput.value)
    renderMeme()
}