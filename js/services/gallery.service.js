'use strict'

var gPics = []
_createPics()
_addCategories()

function getPics() {
    // return gPics
    const allPics = gPics
    const keyword = document.getElementById('search-input').value.toLowerCase()

    return allPics.filter(pic => {
        return !keyword || pic.categories.map(cat => cat.toLowerCase()).includes(keyword)
    })
    
}

function getPicById(picId) {
    return gPics.find(pic => picId === pic.id)
}

function _createPics() {
    for (var i = 0; i < 28; i++) {
        gPics.push(_createPic(i))
    }
}

function _createPic(idx) {
    return {
        id: idx + 1,
        url: `imgs/${idx + 1}.jpg`
    }
}

function _addCategories() {
    gPics[0].categories = ['women', 'smile', 'happy']
    gPics[1].categories = ['men', 'funny']
    gPics[2].categories = ['dog', 'love', 'smile']
    gPics[3].categories = ['baby', 'funny', 'smile']
    gPics[4].categories = ['cartoon', 'funny']
    gPics[5].categories = ['dog', 'baby', 'love']
    gPics[6].categories = ['cat', 'smile']
    gPics[7].categories = ['men', 'smile', 'funny']
    gPics[8].categories = ['baby', 'funny', 'smile']
    gPics[9].categories = ['men', 'funny']
    gPics[10].categories = ['men', 'funny']
    gPics[11].categories = ['men', 'funny']
    gPics[12].categories = ['men', 'funny']
    gPics[13].categories = ['baby', 'funny', 'smile']
    gPics[14].categories = ['men', 'funny']
    gPics[15].categories = ['baby', 'funny', 'smile']
    gPics[16].categories = ['dog', 'funny']
    gPics[17].categories = ['men', 'smile', 'funny']
    gPics[18].categories = ['men', 'love', 'funny']
    gPics[19].categories = ['men', 'smile', 'happy']
    gPics[20].categories = ['men']
    gPics[21].categories = ['men']
    gPics[22].categories = ['women', 'happy']
    gPics[23].categories = ['men', 'funny', 'smile']
    gPics[24].categories = ['men']
    gPics[25].categories = ['cartoon', 'funny']
    gPics[26].categories = ['cartoon', 'funny']
    gPics[27].categories = ['cartoon', 'funny']
}