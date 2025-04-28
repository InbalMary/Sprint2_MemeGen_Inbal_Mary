'use strict'

function makeId(length = 6) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var id = ''

    for (var i = 0; i < length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return id
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open');
}

function makeFunnyLorem(wordCount = 3) {
    const funnyWords = [
        'chips', 'sheep', 'robot', 'coconut', 'alien', 'rat', 'salmon', 'burekas', 'pretzel',
        'hotdog', 'pizza', 'donut', 'panda', 'sushi', 'lemon', 'apple', 'mango', 'gizmo', 'tiger',
        'whale', 'zebra', 'peach', 'plum', 'grape', 'skate', 'cheese', 'taco', 'muffin', 'lizard',
        'honey', 'pumpkin', 'carrot', 'fluff', 'star', 'cloud', 'jelly', 'spicy'
    ]
    let str = ''
    let isNewSentence = true
    for (let i = 0; i < wordCount; i++) {
        let word = funnyWords[Math.floor(Math.random() * funnyWords.length)]
        if (isNewSentence) {
            word = word.charAt(0).toUpperCase() + word.slice(1)
            isNewSentence = false
        }
        str += word + ' '
        if (i % 5 === 4) {
            str = str.trim() + '. '
            isNewSentence = true
        }
    }
    return str.trim()
}
