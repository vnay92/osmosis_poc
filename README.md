# osmosis_poc
## Requirements:
 - Node.js

 - RabbitMQ

 - MySQL

To run:

    node index.js --site=explosm

This would crawl Explosm and push to the queue

Then :

    node extract.js
