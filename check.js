const scrapers = require("./scrapers");

var args = process.argv.slice(2);


function checkWord(word) {
    console.log("");
    console.log('Searching for "' + word + '"...');
    console.log("");

    var shortWord = word.replace(/\s/g, "");

    Promise.all([
        scrapers.checkInstagram(shortWord),
        scrapers.checkYoutube(shortWord),
        scrapers.checkLastfm(word),
        scrapers.checkBandcamp(word)
    ]).then(([insta, youtube, lastfm, bandcamp]) => {
        console.log("Instagram: " + (insta.free ? ":D" : '"' + shortWord + '" taken'));
        console.log("");
        //console.log("Youtube: " + (youtube.free ? ":D" : '"' + shortWord + '" taken'));
        //console.log("");
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
