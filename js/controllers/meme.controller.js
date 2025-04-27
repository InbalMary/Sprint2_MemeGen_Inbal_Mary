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
    // console.log('curImg', curImg, curMeme.selectedImgId)
    // console.log('getPics()', getPics())
    const img = new Image()
    img.src = curImg.url
    img.onload = () => {
        onClearCanvas()
        renderImg(img)

        curMeme.lines.forEach((line, idx) => {
            const x = gElCanvas.width / 2
            var y
            if (idx === 0) y = gElCanvas.height * 0.1
            else if (idx === 1) y = gElCanvas.height * 0.9
            else y = gElCanvas.height * 0.35 + idx * ((line.size + 10))
            setPosition(line, idx, x, y)
            drawText(line)
            console.log('line.box', line.box)
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

function drawText(line) {
    const { txt, pos, color, strokeColor, size, isSelected, font, align } = line
    const x = pos.x
    const y = pos.y

    gCtx.lineWidth = size / 25
    gCtx.strokeStyle = strokeColor
    gCtx.fillStyle = color
    gCtx.font = `bold ${size}px ${font}`
    // gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    const metrics = gCtx.measureText(txt)
    const padding = 10
    const width = metrics.width + padding
    const height = size + padding

    let w, h
    if (align === 'right') {
        w = x - width
        if (w < 0) w = 2
    } else if (align === 'center') {
        w = x - width / 2
        if (w < 0) w = 2
    } else {
        w = x
        if (w + width > gElCanvas.width) w = gElCanvas.width - width - 2
    }

    h = y - height / 2;

    gCtx.fillText(txt, w, y)
    gCtx.strokeText(txt, w, y)

    line.w = w
    line.h = h
    line.width = width
    line.height = height

    if (isSelected) {
        gCtx.strokeStyle = 'black'
        gCtx.strokeRect(w, h, width, height)
    }
}

function onSetSetLineTxt(elInput) {
    console.log('elinput', elInput.value)
    setLineTxt(elInput.value)
    updateInput()
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

function onAddLine() {
    addLine()
    updateInput()
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    updateInput()
    renderMeme()
}

function onCanvasClick(ev) {
    console.log('ev', ev)
    const { offsetX, offsetY } = ev

    const idx = getMeme().lines.findIndex(line => {
        return offsetX >= line.w && offsetX <= line.w + line.width
            && offsetY >= line.h && offsetY <= line.h + line.height
    })
    console.log('idx', idx)
    if (idx !== -1) {
        selectLine(idx)
        updateInput()
    }
}

function selectLine(idx) {
    gMeme.lines.forEach(line => (line.isSelected = false))
    gMeme.lines[idx].isSelected = true
    gMeme.selectedLineIdx = idx
    renderMeme()
}

function updateInput() {
    const elInput = document.querySelector('.txt-line')
    const line = getCurLine()
    console.log('line', line, line.txt)

    if (line) {
        elInput.placeholder = line.txt || 'Write your text here'
        elInput.value = line.txt
    }
}

function onSelectFont(fontName) {
    setCurLineFont(fontName)
    renderMeme()
}

function onSetAlign(align) {
    setAlign(align)
    renderMeme()
}