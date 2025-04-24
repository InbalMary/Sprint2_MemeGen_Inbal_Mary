'use strict'

function renderGallery() {
    var pics = getPics()
    console.log('pics', pics)
    var strHtmls = pics.map(pic => `  
            <img onclick="onImgSelect('${pic.id}')" title="Photo ${pic.id}" 
                src="${pic.url}" 
                alt="Photo id ${pic.id}"
                >
    `)
    document.querySelector('.gallery-container').innerHTML = strHtmls.join('')

}

function onGallery(){
    document.querySelector('.gallery-container').classList.remove('hide')
    document.querySelector('.meme-editor').classList.add('hide')

}

// function selectPic(picId, text = null) {
//     const curImg = getPicById(picId)
//     console.log('curImgonselectpic', picId, curImg)
//     const img = new Image()
//     img.src = curImg.url
//     img.onload = () => {
//         gCtx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight)

//         drawText(text, gElCanvas.width / 2, gElCanvas.height / 6)

//     }
// }