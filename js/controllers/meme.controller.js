'use strict'

var gElCanvas
var gCtx
var gIsMouseDown = false
var gStartPos

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    onResize()
    renderGallery()
}

function onResize() {
    resizeCanvas()
    renderMeme()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onRenderMeme(picId) {
    onClearCanvas()
    selectPic(picId, 'Write your text here')
}

function renderMeme() {
    var pics = getPics()
    var randPicIdx = (pics[getRandomIntInclusive(0, pics.length - 1)]).id
    onRenderMeme(randPicIdx)
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