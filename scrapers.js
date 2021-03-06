const scrapeIt = require("scrape-it");

function checkInstagram(word) {
    return scrapeIt(
        'https://www.instagram.com/'+word+'/',
        {
            error: ".dialog-404"
        }
    ).then(res => ({
        free: !!res.error
    }));
}

function checkYoutube(word) {
    return scrapeIt(
        'https://www.youtube.com/user/'+word,
        {
            error: ".channel-empty-message"
        }
    ).then(res => ({
        free: !!res.error
    }));
}


function checkLastfm(word) {
    return scrapeIt(
        'https://www.last.fm/music/'+word,
        {
            name: ".header-title",
            listeners: ".header-metadata-item--listeners .intabbr"
        }
    ).then(res => ({
        free: !res.listeners || res.listeners === '0',
        name: res.name,
        listeners: res.listeners
    }));
}

function checkBandcamp(word) {
    return scrapeIt(
        'https://bandcamp.com/search?q='+word,
        {
            results: {
                listItem: ".searchresult",
                data: {
                    band: ".heading",
                    url: ".itemurl"
                }
            }
        }
    ).then(res => {
        var matchWord = word.replace(/\s/g, "").toLowerCase();
        var urlTakenBy = res.results.filter(ii => 'https://' + matchWord + '.bandcamp.com' === ii.url.replace(/[-]/g, ""));
        var nameTakenBy = res.results
            .filter(ii => matchWord === ii.band.replace(/[\s]/g, "").toLowerCase())
            .filter(ii => {
                return ii.url.indexOf("bandcamp.com/album") === -1
                    && ii.url.indexOf("bandcamp.com/track") === -1
                    && ii.url.indexOf("https://bandcamp.com/") === -1;
            });

        return {
            free: urlTakenBy.length === 0 || nameTakenBy.length === 0,
            urlTakenBy: urlTakenBy,
            nameTakenBy: nameTakenBy
        }
    });
}

module.exports = {
    checkInstagram,
    checkLastfm,
    checkBandcamp,
    checkYoutube
};