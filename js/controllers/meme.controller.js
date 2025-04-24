'use strict'

var gElCanvas
var gCtx
var gIsMouseDown = false
var gStartPos
var gSelectedImg

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    renderGallery()
    // renderRandomMeme()
    onResize()
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

function onImgSelect(picId) {
    const elGallery = document.querySelector('.gallery-container')
    const elEditor = document.querySelector('.meme-editor')

    elGallery.classList.add('hide')
    elEditor.classList.remove('hide')

    onClearCanvas()
    setselectedImgId(picId)
    renderMeme()
}

function renderMeme() {
    const curMeme = getMeme()

    const curImg = getPicById(+curMeme.selectedImgId)
    console.log('curImg', curImg, curMeme.selectedImgId)
    console.log('getPics()', getPics())
    const img = new Image()
    img.src = curImg.url
    img.onload = () => {
        onClearCanvas()
        renderImg(img)

        curMeme.lines.forEach((line, idx) => {
            const x = gElCanvas.width / 2
            const baseY = gElCanvas.height / 6
            const y = baseY + idx * ((line.size + 10))
            drawText(line.txt, x, y, line.color, line.strokeColor, line.size)
        })
    }
    console.log('meme', curMeme)
    img.onerror = () => {
        console.error('Error loading image:', curImg.url);
    }
}

function renderImg(img) {
    const containerWidth = document.querySelector('.canvas-container').offsetWidth
    gElCanvas.width = containerWidth
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * containerWidth

    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}


// function renderMeme(meme = getMeme()) {
//     var txt = getCurTxt()

//     console.log('meme', meme)
//     onRenderMeme(gSelectedImg.id, txt)
// }

// function renderRandomMeme() {
//     var pics = getPics()
//     var randPic = pics[getRandomIntInclusive(0, pics.length - 1)]
//     gSelectedImg = randPic

//     setCurImgId(randPic.id)
//     renderMeme(randPic)
// }

function drawText(text, x, y, color, strokeColor, size) {
    gCtx.lineWidth = size / 10
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = color
    gCtx.font = `${size}px Impact`
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

function onDownloadCanvas(elLink) {
    const dataUrl = gElCanvas.toDataURL()

    elLink.href = dataUrl
    // Set a name for the downloaded file
    elLink.download = 'my-perfect-img'
}

function onSetColor(color) {
    setColor(color)
    renderMeme()
}

function onSetStrokeColor(strokeColor) {
    setStrokeColor(strokeColor)
    renderMeme()
}

function onChangeTxtSize(sign) {
    if (sign === '+') setFontSize(+5)
    if (sign === '-') setFontSize(-5)

    renderMeme()
}