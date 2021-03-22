const fetch = require("node-fetch"),
    cheerio = require("cheerio");

module.exports = () => {
    return new Promise((resolve, reject) => {
        fetch("https://www.worldometers.info/coronavirus/")
        .then(res => {
            res.text()
            .then(text => {
                let html = cheerio.load(text);
                let cases = [];

                html(".maincounter-number").each((i, el) => {
                    cases.push(el.children[0].next.children[0].data.replace(/\s+/g, ""));
                });

                resolve(cases);
            })
            .catch(reject);
        })
        .catch(reject);
    });
}