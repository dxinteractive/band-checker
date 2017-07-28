const scrapeIt = require("scrape-it");

var args = process.argv.slice(2);
var limit = Number(args[0] || 100);

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
        var words = page.table[2].rows.filter(ii => ii.length <= limit);
        words.forEach(ii => console.log("- " + ii));
    });
