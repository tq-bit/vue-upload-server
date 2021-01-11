const express = require('express');
const FileType = require('file-type');
const { Buffer } = require('buffer');

// Create the server app & define the port
const app = express();
const port = process.env.PORT || 3000;

// Set cors headers
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Methods', 'GET, POST');
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// Handle a single post request
app.post('/', async (req, res) => {
  const data = [];
  // When new data chunks are received, push them to the data
  req.on('data', d => data.push(d));

  // When the request is done being read, concat the array items
	req.on('end', async () => {
		const buffer = Buffer.concat(data);

    // Extract some basic data from the buffer
		const bytes = buffer.length;
		const type = await FileType.fromBuffer(buffer);

		// const info = fs.statSync(body);
		res.send({ bytes, type });
	});
	req.on('error', e => res.status(500).send({ status: 'error', msg: e }));
});

app.use('/*', (req, res) => res.status(404).send({status: 'not-found', msg: 'try posting to / instead'}))

app.listen(port, () => {
	console.log('App listening on port ' + port);
});
