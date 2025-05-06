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
    for (var i = 0; i < 44; i++) {
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
    gPics[0].categories = ['cartoon', 'funny']
    gPics[1].categories = ['men', 'funny', 'smile']
    gPics[2].categories = ['men', 'smile', 'funny']
    gPics[3].categories = ['baby', 'funny']
    gPics[4].categories = ['cartoon', 'funny']
    gPics[5].categories = ['dog', 'baby', 'love']
    gPics[6].categories = ['cat', 'smile']
    gPics[7].categories = ['dog', 'love', 'smile']
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
    gPics[28].categories = ['women', 'smile', 'happy']
    gPics[29].categories = ['men', 'funny']
    gPics[30].categories = ['men', 'funny']
    gPics[31].categories = ['baby', 'funny', 'smile']
    gPics[32].categories = ['men', 'funny', 'smile']
    gPics[33].categories = ['cartoon', 'funny']
    gPics[34].categories = ['women', 'sad']
    gPics[35].categories = ['cartoon', 'funny']
    gPics[36].categories = ['women', 'funny']
    gPics[37].categories = ['women', 'happy']
    gPics[38].categories = ['baby', 'funny']
    gPics[39].categories = ['men', 'funny']
    gPics[40].categories = ['cartoon', 'sad']
    gPics[41].categories = ['men', 'sad']
    gPics[42].categories = ['men', 'funny']
    gPics[43].categories = ['men', 'funny']
}