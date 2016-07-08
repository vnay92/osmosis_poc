var osmosis = require('osmosis');
var argv = require('minimist')(process.argv.slice(2));

var usage = function() {
    console.log('Usage:\nnode index.js --site=<site name>');
};

var main = function() {
    if (argv.site === undefined) {
        usage();
        return;
    }
    switch (argv.site) {
        case 'channelate':
            osmosis
                .get('http://www.channelate.com/?randomcomic&nocache=1')
                .set({
                    image: 'div#comic-1 > img@src',
                    title: 'h2.post-title > a',
                    author: 'span.post-author > a',
                    publish_date: 'span.post-date'
                })
                .data(function(scrapeData) {
                    console.log(scrapeData);
                }).debug(console.log);

            break;

        case 'ex':
            osmosis
                .get('http://explosm.net/comics/random')
                .set({
                    image: '#main-comic@src',
                    author: 'small.author-credit-name',
                    publish_date: '.past-week-comic-title'
                })
                .data(function(scrapeData) {
                    console.log(scrapeData);
                }).debug(console.log);

            break;

        default:

    }
};

main();
