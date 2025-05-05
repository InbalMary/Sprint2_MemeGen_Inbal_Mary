'use strict'

var gCategories = { 'women': 2, 'men': 0, 'baby': 0, 'smile': 3, 'happy': 0, 'funny': 0, 'love': 5, 'dog': 0, 'cat': 0, 'cartoon': 0 }
const CATEGORIES_STORAGE_KEY = 'popularCategoriesDB'
let gShowAllKeywords = false

function renderGallery() {
    var pics = getPics()
    // console.log('pics', pics)
    var strHtmls = pics.map(pic => `  
            <img onclick="onImgSelect('${pic.id}')" title="Photo ${pic.id}" 
                src="${pic.url}" 
                alt="Photo id ${pic.id}"
                >
    `)
    strHtmls.unshift(`
        <button class="flexible-btn" onclick="onRenderRandomMeme()">I'm flexible!</button>
    `)
    document.querySelector('.gallery-images').innerHTML = strHtmls.join('')
    renderCategories()
}

function onToggleCategoriesView() {
    gShowAllKeywords = !gShowAllKeywords
    renderCategories()
    document.querySelector('.btn-show-more').innerText = gShowAllKeywords ? '...less' : 'more...'
}

function renderCategories() {
    const elContainer = document.querySelector('.categories-container')
    const entries = Object.entries(gCategories)

    const keywordsToShow = gShowAllKeywords ? entries : entries.slice(0, 4)

    const strHtml = keywordsToShow.map(([keyword, count]) => {
        const fontSize = 14 + count * 1.5
        return `<span class="category" style="font-size:${fontSize}px" onclick="onCategoryClick('${keyword}')">${keyword}</span>`
    }).join(' ')

    elContainer.innerHTML = strHtml
}

function onCategoryClick(keyword) {
    if (!gCategories[keyword]) gCategories[keyword] = 1
    else gCategories[keyword]++

    saveToStorage(CATEGORIES_STORAGE_KEY, gCategories)

    document.getElementById('search-input').value = keyword
    onFilterChange()
    renderCategories()
}

function loadCategories() {
    const stored = loadFromStorage(CATEGORIES_STORAGE_KEY)
    if (stored) gCategories = stored
}

function onGallery() {
    document.querySelector('.gallery-container').classList.remove('hide')
    document.querySelector('.meme-editor').classList.add('hide')
    document.querySelector('.saved-memes-container').classList.add('hide')

    if (window.innerWidth <= 640) {
        document.body.classList.remove('menu-open');
    }
}

function onFilterChange() {
    renderGallery()
}
