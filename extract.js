var q = 'explosm';
var osmosis = require('osmosis');
var Sequelize = require('sequelize');
var open = require('amqplib').connect('amqp://localhost');

var sequelize = new Sequelize('test', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 1000,
        min: 0,
        idle: 10000
    },
});

sequelize
    .authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
        process.exit(1);
    });

var Comics = sequelize.define('comics', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: Sequelize.STRING,
    image_link: Sequelize.STRING,
    publish_date: {
        type: Sequelize.DATE,
    },
    createdAt: {
        type: Sequelize.DATE
    },
    updatedAt: {
        type: Sequelize.DATE
    }
});

var saveLinkToDatabase = function (link) {
    osmosis
    .get(link)
    .set({
        image_link: '#main-comic@src',
        author: 'small.author-credit-name',
        publish_date: '.past-week-comic-title'
    })
    .data(function(scrapeData) {
        scrapeData.image_link = 'http:' + scrapeData.image_link;
        return Comics.create(scrapeData);
    });
};


// Consumer
open.then(function(conn) {
    return conn.createChannel();
}).then(function(ch) {
    return ch.assertQueue(q).then(function(ok) {
        return ch.consume(q, function(msg) {
            if (msg !== null) {
                saveLinkToDatabase(msg.content.toString());
                // ch.ack(msg);
            }
        });
    });
}).catch(console.warn);
