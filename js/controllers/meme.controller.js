'use strict'

var gElCanvas
var gCtx
var gIsMouseDown = false
var gStartPos
var gSelectedImg
var gIsRandMode = false
let gUploadedImg = null

const gStickers = ['😎', '😂', '🔥', '😍', '🥦', '🚩', '🐶', '🌈', '🤓', '👑', '⭐', '😉', '📚']
let gStickerStartIdx = 0
const STICKERS_TO_SHOW = 4

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    loadCategories()
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
    gUploadedImg = null
    console.log('gIsRandMode', gIsRandMode)
    if (!gIsRandMode) {
        setGmem(picId)
    }
    if (gIsRandMode) {
        setRandomGmem(picId)
        gIsRandMode = false
    }
    const elGallery = document.querySelector('.gallery-container')
    const elEditor = document.querySelector('.meme-editor')

    elGallery.classList.add('hide')
    elEditor.classList.remove('hide')
    document.querySelector('.txt-line').value = getCurLine().txt
    onClearCanvas()
    setselectedImgId(picId)
    renderMeme()
    onResize()
}

function renderMeme() {
    const curMeme = getMeme()
    const img = new Image()

    if (curMeme.uploadedImgUrl) {
        img.src = curMeme.uploadedImgUrl
    }else if (gUploadedImg) {
        img.src = gUploadedImg.src
    } else {
        const curImg = getPicById(+curMeme.selectedImgId)
        // console.log('curImg', curImg, curMeme.selectedImgId)
        // console.log('getPics()', getPics())
        if (!curImg || !curImg.url) {
            console.error('Err: Photo was not found')
            return
        }
        img.src = curImg.url
    }
    img.onload = () => {
        onClearCanvas()
        renderImg(img)

        curMeme.lines.forEach((line, idx) => {
            if (!line.isDeleted) {

                if (!line.pos || !line.pos.x || !line.pos.y) {
                    const x = gElCanvas.width / 2
                    var y
                    if (idx === 0) y = gElCanvas.height * 0.1
                    else if (idx === 1) y = gElCanvas.height * 0.9
                    else y = gElCanvas.height * 0.35 + idx * ((line.size + 10))
                    setPosition(line, idx, x, y)
                }
                drawText(line)
                // console.log('line.box', line.box)
            }
        })
    }
    // console.log('meme', curMeme)
    img.onerror = () => {
        console.error('Error loading image:', curImg.url);
    }
    renderStickers()
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

function onRenderRandomMeme() {
    gUploadedImg = null
    var pics = getPics()
    var randPic = pics[getRandomIntInclusive(0, pics.length - 1)]
    gSelectedImg = randPic
    console.log('randPic.id', randPic.id)
    // setCurImgId(randPic.id)
    // setRandomGmem(randPic.id)
    gIsRandMode = true
    onImgSelect(randPic.id)
    onResize()
}

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

function onSetLineTxt(elInput) {
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
    return idx
}

function selectLine(idx) {
    gMeme.lines.forEach(line => (line.isSelected = false))
    gMeme.lines[idx].isSelected = true
    gMeme.selectedLineIdx = idx
    renderMeme()
}

function updateInput() {
    const elInput = document.querySelector('.txt-line')
    const elSelect = document.getElementById('font-select')
    const line = getCurLine()
    if (!line) return
    console.log('line', line, line.txt)

    if (elInput) {
        elInput.placeholder = line.txt || 'Write your text here'
        elInput.value = line.txt
    }

    if (elSelect) {
        elSelect.value = line.font || ''
    }
}

function onSelectFont(fontName) {
    setCurLineFont(fontName)
    updateInput()
    renderMeme()
}

function onSetAlign(align) {
    setAlign(align)
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    renderMeme()
}

function onDown(ev) {
    console.log('onDown')
    // Get the ev pos from mouse or touch
    const pos = getEvPos(ev)
    console.log('pos', pos)
    const idx = onCanvasClick(ev)
    if (idx === -1) return

    setLineDrag(idx, true)
    //Save the pos we start from
    gStartPos = pos
    document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
    const lines = getLines()
    const line = lines.find(line => line.isDrag === true)

    if (!line) return
    console.log('onMove')

    const pos = getEvPos(ev)
    // Calc the delta, the diff we moved
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    const draggedLineIdx = lines.findIndex(line => line.isDrag === true)
    moveSpecificLine(draggedLineIdx, dx, dy)
    // Save the last pos, we remember where we`ve been and move accordingly
    gStartPos = pos
    // The canvas is render again after every move
    renderMeme()
}

function onUp() {
    console.log('onUp')
    const lines = getLines()
    const draggedLineIdx = lines.findIndex(line => line.isDrag === true)
    if (draggedLineIdx !== -1) {
        setLineDrag(draggedLineIdx, false)
    }
    document.body.style.cursor = 'grab'
}

function getEvPos(ev) {
    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        // Prevent triggering the mouse ev
        ev.preventDefault()
        // Gets the first touch point
        ev = ev.changedTouches[0]
        // Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

// Saved Memes
function onSavedMemesGallery() {
    renderSavedMemes()
    document.querySelector('.gallery-container').classList.add('hide')
    document.querySelector('.meme-editor').classList.add('hide')
    document.querySelector('.saved-memes-container').classList.remove('hide')

    if (window.innerWidth <= 640) {
        document.body.classList.remove('menu-open');
    }
}

function onSaveMeme() {
    const preview = gElCanvas.toDataURL('image/jpeg')
    saveCurMeme(preview)
}

function showEditor() {
    document.querySelector('.meme-editor').classList.remove('hide')
    document.querySelector('.gallery-container').classList.add('hide')
    document.querySelector('.saved-memes-container').classList.add('hide')
}

function renderSavedMemes() {
    const savedMemes = getSavedMemes()
    var strHtmls = ''

    if (savedMemes.length === 0) {
        strHtmls = '<p>No saved memes</p>';
    } else {
        strHtmls = savedMemes.map(meme => `
            <article class="meme-item" >
                <button class="delete-btn" onclick="onMemeDelete(event, '${meme.memeId}')">X</button>

                <img onclick="onMemeEdit('${meme.memeId}')" src="${meme.preview}" alt="Saved Meme">
                
            </article>
        `).join('')
    }
    document.querySelector('.saved-memes-container').innerHTML = strHtmls
}

function onMemeEdit(memeId) {
    gSelectedSavedMemeId = memeId
    loadMemeForEditing(memeId)
    renderMeme()
    showEditor()
    document.querySelector('.txt-line').value = getCurLine().txt
}

function onMemeDelete(ev, memeId) {
    ev.stopPropagation()
    console.log('event', ev, memeId)
    deleteMeme(memeId)
    renderSavedMemes()
}

// Stickers

function renderStickers() {
    const elContainer = document.querySelector('.stickers-container')
    const stickersToShow = gStickers.slice(gStickerStartIdx, gStickerStartIdx + STICKERS_TO_SHOW)

    const strHtml = stickersToShow.map(sticker =>
        `<button class="sticker-btn" onclick="onAddSticker('${sticker}')">${sticker}</button>`
    ).join('')

    elContainer.innerHTML = strHtml
}

function onNextStickers() {
    if (gStickerStartIdx + STICKERS_TO_SHOW < gStickers.length) {
        gStickerStartIdx++
        renderStickers()
    }
}

function onPrevStickers() {
    if (gStickerStartIdx > 0) {
        gStickerStartIdx--
        renderStickers()
    }
}

function onAddSticker(sticker) {
    addLine(sticker)
    updateInput()
    renderMeme()
}

// Share on Facebook
function onShareImg(ev) {
    ev.preventDefault()
    const canvasData = gElCanvas.toDataURL('image/jpeg')

    // After a succesful upload, allow the user to share on Facebook
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log('encodedUploadedImgUrl:', encodedUploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)

    }
    uploadImg(canvasData, onSuccess)
}

// on submit call to this function
async function uploadImg(imgData, onSuccess) {
    const CLOUD_NAME = 'webify'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const formData = new FormData()
    formData.append('file', imgData)
    formData.append('upload_preset', 'webify')
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        console.log('Cloudinary response:', data)
        onSuccess(data.secure_url)

    } catch (err) {
        console.log(err)
    }
}

// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()

    reader.onload = function (event) {
        const img = new Image()
        img.onload = () => {
            onImageReady(img)
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

    gUploadedImg = img
}