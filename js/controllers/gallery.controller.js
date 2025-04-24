'use strict'

function renderGallery() {
    var pics = getPics()
    console.log('pics', pics)
    var strHtmls = pics.map(pic => `  
            <img onclick="onRenderMeme('${pic.id}')" title="Photo ${pic.id}" 
                src="${pic.data}" 
                alt="Photo id ${pic.id}"
                >
    `)
    document.querySelector('.gallery-container').innerHTML = strHtmls.join('')

}

function selectPic(picId, text = null) {
    const curImg = getPicById(picId)
    const img = new Image()
    img.src = curImg.data
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)
        if(text) {
            drawText('Write your text here', gElCanvas.width / 2, gElCanvas.height / 6)
        }
    }
}