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
        case 'explosm':
            var q = argv.site;
            osmosis
                .get('http://explosm.net/comics/archive')
                .find('ul.no-bullet > li > a')
                .follow('@href')
                .find('h3.past-week-comic-title a')
                .follow('@href')
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
