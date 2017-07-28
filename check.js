const scrapeIt = require("scrape-it");

var args = process.argv.slice(2);

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

function checkWord(word) {
    console.log("");
    console.log('Searching for "' + word + '"...');
    console.log("");

    var instaWord = word.replace(/\s/g, "");

    Promise.all([
        checkInstagram(instaWord),
        checkLastfm(word),
        checkBandcamp(word)
    ]).then(([insta, lastfm, bandcamp]) => {
        console.log("Instagram: " + (insta.free ? ":D" : '"' + instaWord + '" taken'));
        console.log("");
        console.log("Lastfm: " + (lastfm.free ? ":D" : '"' + lastfm.name + '" taken'));
        if(!lastfm.free) {
            console.log("  (" + lastfm.listeners + " listeners)");
        }
        console.log("");
        console.log("Bandcamp: " + (bandcamp.free ? ":D" : "taken"));
        if(!bandcamp.free) {
            console.log("  URL taken by:")
            bandcamp.urlTakenBy.forEach(ii => console.log("  - " + ii.url));
            console.log("  Name taken by:");
            bandcamp.nameTakenBy.forEach(ii => console.log("  - " + ii.band + " (" + ii.url + ")"));
        }
    });
}

checkWord(args[0]);

// scrapeIt(
//     "http://soybomb.com/tricks/words/",
//     {
//         table: {
//             listItem: "center table",
//             data: {
//                 rows: {
//                     listItem: "td"
//                 }
//             }
//         }
//     }
// )
//     .then(page => {
//         var words = page.table[2].rows;
//         console.log(words);
//     });
