const scrapeIt = require("scrape-it");
const scrapers = require("./scrapers");

var args = process.argv.slice(2);
var limit = Number(args[0] || 0);
var check = args[1];
var delay = Number(args[2] || 0);

function make() {
    scrapeIt(
        "http://soybomb.com/tricks/words/",
        {
            table: {
                listItem: "center table",
                data: {
                    rows: {
                        listItem: "td"
                    }
                }
            }
        }
    )
        .then(page => {
            var words = page.table[2].rows.filter(ii => !limit || ii.length <= limit);
            if(!check) {
                words.forEach(ii => console.log("- " + ii));
                return;
            }

            if(check === "insta") {
                console.log("...");
                words.forEach(word => {
                    var shortWord = word.replace(/\s/g, "");
                    Promise.all([
                        scrapers.checkInstagram(shortWord),
                        //scrapers.checkYoutube(shortWord)
                    ])
                        .then(([insta]) => {
                            var str = "- "+shortWord;
                            str += insta.free ? " :)" : "";
                            //str += youtube.free ? " :)" : "";
                            console.log(str);
                        });
                });
            }

            if(check === "go") {
                console.log("...")
                var promises = words.map(word => {
                    var shortWord = word.replace(/\s/g, "");
                    return scrapers.checkInstagram(shortWord)
                        .then((insta) => {
                            if(insta.free) {
                                console.log(shortWord);
                            }
                        });
                });

                Promise.all(promises)
                    .then(() => new Promise(resolve => {
                        setTimeout(resolve, delay);
                    }))
                    .then(() => make());
            }
        });
}

make();