var osmosis = require('osmosis');
var argv = require('minimist')(process.argv.slice(2));
var open = require('amqplib').connect('amqp://localhost');

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
                .set('location')
                .follow('@href')
                .set({
                    links: ['h3.past-week-comic-title > a@href']
                })
                .data(function(scrapeData) {
                    // Push all the links to the queue
                    open.then(function(conn) {
                        return conn.createChannel();
                    }).then(function(ch) {
                        return ch.assertQueue(q).then(function(ok) {
                            for (var i = 0; i < scrapeData.links.length; i++) {
                                ch.sendToQueue(q, new Buffer(scrapeData.links[i]));
                            }
                            return ch.close();
                        });
                    }).catch(console.warn);
                });
            break;

        default:

    }
};

main();
