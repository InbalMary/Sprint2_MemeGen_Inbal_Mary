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

let gEditingText = false
let gTextInput = null
let gEditingLineIdx = -1
const gIsMobile = /Mobi|Android/i.test(navigator.userAgent)

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    loadCategories()
    renderGallery()
    // renderRandomMeme()
    onResize()
    console.log('gIsMobile', gIsMobile)
    if (!gIsMobile) initTextEditing()
}

function onResize() {
    resizeCanvas()
    renderMeme()
}

function resizeCanvas(img = null) {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth
    if (img) {
        gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    } else {
        gElCanvas.height = gElCanvas.width * 0.75
    }
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

    document.querySelector('.about-container').classList.add('hide')

    document.getElementById('sRotation-angle').innerText = getCurLine().rotation
    document.getElementById('rotation-angle').value = getCurLine().rotation || 0
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
    } else if (gUploadedImg) {
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
        resizeCanvas(img)
        onClearCanvas()
        renderImg(img)

        curMeme.lines.forEach((line, idx) => {
            if (!line.isDeleted) {

                if (!line.pos || !line.pos.x || !line.pos.y) {
                    const x = gElCanvas.width / 2
                    var y
                    if (idx === 0) y = gElCanvas.height * 0.1
                    else if (idx === 1) y = gElCanvas.height * 0.9
                    else y = gElCanvas.height * 0.35 + ((line.size + 10))
                    setPosition(line, idx, x, y)
                }
                if (!gIsMobile && gEditingLineIdx != idx) drawText(line)
                if (gIsMobile) drawText(line)
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
    const { txt, pos, color, strokeColor, size, isSelected, font, align, rotation = 0 } = line
    const x = pos.x
    const y = pos.y

    gCtx.lineWidth = size / 25
    
    gCtx.save()
    
    gCtx.font = `bold ${size}px ${font}`
    // gCtx.textAlign = 'center'
    // gCtx.textBaseline = 'middle'

    const metrics = gCtx.measureText(txt)
    const actualHeight = size

    const padding = 10
    const width = metrics.width + padding * 2
    const height = actualHeight + padding * 2

    let w, textX
    const canvasWidth = gElCanvas.width
    if (align === 'right') {
        w = Math.max(2, x - width + padding)
        if (w + width > canvasWidth) w = canvasWidth - width - 2
        textX = w + width - padding
        gCtx.textAlign = 'right'
    } else if (align === 'center') {
        w = x - width / 2
        if (w < 0) w = 2
        else if (w + width > canvasWidth) w = canvasWidth - width - 2
        textX = w + width / 2
        gCtx.textAlign = 'center'
    } else {
        w = x - padding
        if (w < 0) w = 2
        else if (w + width > canvasWidth) w = canvasWidth - width - 2
        textX = w + padding
        gCtx.textAlign = 'left'
    }

    const h = y - height / 2
    const canvasHeight = gElCanvas.height
    let adjustedH = h

    if (h < 2) {
        adjustedH = 2
    } else if (h + height > canvasHeight) {
        adjustedH = canvasHeight - height - 2
    }

    const centerX = w + width / 2
    const centerY = adjustedH + height / 2

    gCtx.translate(centerX, centerY)
    gCtx.rotate(rotation * Math.PI / 180)
    gCtx.translate(-centerX, -centerY)

    if (isSelected) {
        gCtx.strokeStyle = 'black'
        gCtx.strokeRect(w, adjustedH, width, height)
    }

    gCtx.fillStyle = color
    gCtx.textBaseline = 'middle'
    const textY = adjustedH + height / 2

    gCtx.fillText(txt, textX, textY)
    gCtx.strokeStyle = strokeColor
    gCtx.strokeText(txt, textX, textY)

    gCtx.restore()

    line.w = w
    line.h = adjustedH
    line.width = width
    line.height = height
    line.rotation = rotation || 0
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

function onCanvasClick(pos) {
    console.log('pos', pos)
    // const { offsetX, offsetY } = ev

    if (!gIsMobile && gEditingText) {
        finishEditing()
        return -1
    }

    const idx = getMeme().lines.findIndex(line => {
        return pos.x >= line.w && pos.x <= line.w + line.width
            && pos.y >= line.h && pos.y <= line.h + line.height
    })
    console.log('idx', idx)
    if (idx !== -1) {
        selectLine(idx)
        updateInput()
        if (!gIsMobile) startEditing(idx)
    }
    return idx
}

function selectLine(idx) {
    gMeme.lines.forEach(line => (line.isSelected = false))
    gMeme.lines[idx].isSelected = true
    gMeme.selectedLineIdx = idx
    renderMeme()
    if (!gIsMobile && gEditingText) {
        finishEditing()
    }
}

function updateInput() {
    const elInput = document.querySelector('.txt-line')
    const elSelect = document.getElementById('font-select')
    const elSpan = document.getElementById('sRotation-angle')
    const elRotationSlider = document.getElementById('rotation-angle')
        
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

    if(elSpan) {
        elSpan.innerText = line.rotation
    }

    if(elRotationSlider) {
        elRotationSlider.value = line.rotation || 0
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
    const idx = onCanvasClick(pos)
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
    document.querySelector('.about-container').classList.add('hide')
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
    document.querySelector('.about-container').classList.add('hide')
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
    resizeCanvas()
    renderMeme()
    showEditor()
    document.querySelector('.txt-line').value = getCurLine().txt
    document.getElementById('sRotation-angle').innerText = getCurLine().rotation
    document.getElementById('rotation-angle').value = getCurLine().rotation || 0
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
    gSelectedSavedMemeId = null 
    gUploadedImg = null
    loadImageFromInput(ev, onImageReady)
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

function onImageReady(img) {
    gUploadedImg = img
    setGmem(null)

    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

    showEditor()
    renderMeme()
}

function renderImg(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

    gUploadedImg = img
}

function createTextInput() {
    if (!gTextInput) {
        gTextInput = document.createElement('textarea')
        gTextInput.className = 'hide'
        gTextInput.style.position = 'absolute'
        gTextInput.style.background = 'transparent'
        gTextInput.style.border = '1px dashed black'
        gTextInput.style.outline = 'none'
        gTextInput.style.overflow = 'hidden'
        gTextInput.style.resize = 'none'
        gTextInput.style.zIndex = '10'
        gTextInput.style.fontFamily = 'Tahoma'
        gTextInput.style.fontWeight = 'bold'
        gTextInput.dir = 'auto'

        document.body.appendChild(gTextInput)

        gTextInput.addEventListener('blur', finishEditing)

        gTextInput.addEventListener('input', () => {
            adjustTextareaSize()
        })
    }
    return gTextInput
}

function adjustTextareaSize() {
    if (!gTextInput) return

    const line = getMeme().lines[getMeme().selectedLineIdx]
    if (!line) return

    gTextInput.style.height = 'auto'
}

function startEditing(lineIdx) {
    if (gIsMobile) return
    const line = getMeme().lines[lineIdx]
    if (!line) return

    gEditingText = true
    gEditingLineIdx = lineIdx

    const textarea = createTextInput()
    textarea.value = line.txt

    const canvasRect = gElCanvas.getBoundingClientRect()
    textarea.style.left = `${canvasRect.left + line.w}px`
    textarea.style.top = `${canvasRect.top + line.h}px`
    textarea.style.color = line.color
    textarea.style.fontSize = `${line.size}px`
    textarea.style.fontFamily = line.font
    textarea.style.textAlign = line.align
    textarea.style.width = `${line.width}px`
    textarea.style.height = `${line.height}px`

    textarea.style.display = 'block'
    textarea.focus()
    textarea.select()
    renderMeme()
}

function finishEditing() {
    if (!gEditingText || !gTextInput) return

    const meme = getMeme()
    if (gEditingLineIdx !== -1 && meme.lines[gEditingLineIdx]) {
        meme.lines[gEditingLineIdx].txt = gTextInput.value
    }

    gTextInput.style.display = 'none'
    gEditingText = false
    gEditingLineIdx = -1
    renderMeme()
}

function onCanvasDblClick(pos) {
    if (gIsMobile) return
    const idx = getMeme().lines.findIndex(line => {
        return pos.x >= line.w && pos.x <= line.w + line.width
            && pos.y >= line.h && pos.y <= line.h + line.height
    })

    if (idx !== -1) {
        selectLine(idx)
        if (!gIsMobile) startEditing(idx)
        return idx
    }
    return -1
}

function addDoubleClickListener() {


    gElCanvas.addEventListener('dblclick', (ev) => {
        const pos = getEvPos(ev)
        onCanvasDblClick(pos)
    })
}


function initTextEditing() {

    if (gIsMobile) return
    createTextInput()
    addDoubleClickListener()
}

function onAbout() {
    document.querySelector('.gallery-container').classList.add('hide')
    document.querySelector('.about-container').classList.remove('hide')
    document.querySelector('.meme-editor').classList.add('hide')
    document.querySelector('.saved-memes-container').classList.add('hide')

    if (window.innerWidth <= 640) {
        document.body.classList.remove('menu-open');
    }
}

function onShowRotateDegree(newAngleVal){
    document.getElementById('sRotation-angle').innerText = newAngleVal
    document.getElementById('rotation-angle').value = getCurLine().rotation || 0
    const selectedLineIdx = getCurLineIdx()

    if (isNaN(newAngleVal) || selectedLineIdx === -1) return
    const line = gMeme.lines[selectedLineIdx]
    line.rotation = newAngleVal
    renderMeme()
}
