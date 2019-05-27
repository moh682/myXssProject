var express = require('express');
var router = express.Router();
const colors = require('colors');
const atob = require('atob');

const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/getData', async (req, res, next) => {
	var data = await getAllData();
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.json(data.data);
});

router.post('/addProduct', async (req, res, next) => {
	console.log('hello');
	console.log(req.body);
	var product = {
		username: req.body.username,
		description: req.body.description
	};
	addProduct(product);
	res.sendStatus(200);
});

router.get('/getUsers', async (req, res, next) => {
	var users = await getAllData();
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.json(users.users);
});

router.post('/addUser', async (req, res, next) => {
	// add a user to the database
	console.log(req.body);
	let user = {
		username: req.body.username,
		password: req.body.password
	};
	console.log(user);
	await addUser(user);
});

router.get('/:sessionId', (req, res, next) => {
	var session = atob(req.params.sessionId.split(':')[1]);
	var sessionObject = JSON.parse(session);
	console.log(colors.bgBlue(sessionObject));
	res.send('you have been hacked, Your password: ' + sessionObject.password);
});

function getAllData() {
	return new Promise((resolve, reject) => {
		fs.readFile(__dirname + '/db.json', 'utf8', function(err, data) {
			if (err) reject(err);
			json = JSON.parse(data);
			resolve(json);
		});
	});
}

function addProduct(product) {
	fs.readFile(__dirname + '/db.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			if (data === '') {
				fs.writeFile(__dirname + '/db.json', product, null, function(err) {
					console.log(err);
				});
			} else {
				var obj = JSON.parse(data);
				obj.data.push(product); //add some data
				json = JSON.stringify(obj); //convert it back to json
				fs.writeFile(__dirname + '/db.json', json, 'utf8', function(err) {
					console.log(err);
				}); // write it back
			}
		}
	});
}

function addUser(user) {
	fs.readFile(__dirname + '/db.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			if (data === '') {
				fs.writeFile(__dirname + '/db.json', user, null, function(err) {
					console.log(err);
				});
			} else {
				var obj = JSON.parse(data);
				obj.users.push(user); //add some data
				json = JSON.stringify(obj); //convert it back to json
				fs.writeFile(__dirname + '/db.json', json, null, function(err) {
					console.log(err);
				}); // write it back
			}
		}
	});
}

module.exports = router;
