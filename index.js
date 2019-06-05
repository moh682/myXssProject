var username = document.getElementById('username');
var password = document.getElementById('password');
var textarea = document.getElementById('textarea');

// Temporary storage
var users = [];
var posts = [];

var loginForm = document.getElementById('login-form');
var outputDiv = document.getElementById('outputDiv');
var logoutbtn = document.getElementById('logout');

// Check if the user is logged in
if (getItem() == undefined) {
	// if NOT logged in remove the outputDiv
	logOut();
} else {
	// if Logged in remove The login Form
	logIn();
}

// Login button
document.getElementById('login').addEventListener('click', async function() {
	users = await getAllUsers();
	username = document.getElementById('username').value;
	password = document.getElementById('password').value;

	if (username !== '' || password !== '') {
		console.log(users);
		if (doesUsernameExist(username)) {
			if (ValidateUsername(username, password)) {
				createCookie(username, password);
				logIn();
			} else {
				alert('Wrong Password');
			}
		} else {
			createUser(username, password);
		}
	} else {
		alert('username or password not valid');
	}
});

async function ValidateUsername(username, password) {
	var users = await getAllUsers();
	if (users.filter((user) => user.username === username && user.password === password)) {
		return true;
	}
	if (users.filter((user) => user.username === username && user.password !== password)) {
		alert('Wrong Password');
		return false;
	}
	return false;
}

async function doesUsernameExist(username) {
	if (users.length === 0) return false;
	if (
		users.filter((user) => {
			user.username === username;
		})
	) {
		return true;
	} else {
		return false;
	}
}

// Logout button
logoutbtn.addEventListener('click', function() {
	logOut();
});

// Submit text Area
document.getElementById('btn').addEventListener('click', async function() {
	textarea = await document.getElementById('textarea').value;
	textarea = textarea !== '' ? filteringInput(textarea) : ''; // Adding prevention
	let username = await JSON.parse(atob(getItem())).username;
	var body = await JSON.stringify({
		username,
		description: textarea
	});
	var config = {
		method: 'POST',
		body,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	};
	fetch('http://localhost:5000/addProduct', config)
		.catch((err) => console.log(err))
		.then((data) => console.log(data));
});

// display all products on site
async function displayProducts() {
	let htmlOutput = posts.map((obj, index) => {
		return '<p >name: ' + obj.username + ', product: ' + obj.description + '</p>';
	});
	var output = document.getElementById('output');
	console.log(output);
	document.getElementById('output').innerHTML = htmlOutput.join();
}

// Creates The session for the user
function createCookie(username, password) {
	var created = new Date();
	var expires = created.getTime() + 60 * 60 * 24 * 365; // expires date after one year
	var cookie = { created, expires, username, password };
	cookie = JSON.stringify(cookie);
	cookie = btoa(cookie);
	setItem(cookie);
}

// Validates the user and password
function ValidatePassword(username, password) {
	if (user[username] !== password) {
		return false;
	}
	// if we ends here means the username exist and password correct
	return true;
}

// Prevention
function filteringInput(data) {
	var splitData = data.split('');
	for (let index = 0; index < splitData.length; index++) {
		if (splitData[index] === '<' || splitData[index] === '>') {
			delete splitData[index];
		}
	}
	return splitData.join('');
}

// Creates User and Adds a Session id to him
async function createUser(username, password) {
	// var body = JSON.stringify({
	// 	username,
	// 	password
	// });
	// console.log(body);
	// var config = {
	// 	method: 'POST',
	// 	mode: 'cors',
	// 	body,
	// 	headers: {
	// 		'Access-Control-Allow-Origin': '*',
	// 		'Content-Type': 'application/json'
	// 	},
	// 	credentials: 'include'
	// };
	// fetch('http://localhost:5000/addUser', config).catch((err) => console.log(err));
}

async function createPost(username, description) {
	var body = await JSON.stringify({
		username,
		description
	});
	var config = {
		method: 'POST',
		body,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	};
	fetch('http://localhost:5000/addProduct', config)
		.catch((err) => console.log(err))
		.then((data) => console.log(data));
}

async function getAllData() {
	var data = await fetch('http://localhost:5000/getData').then((res) => res.json());
	posts = data;
	return data;
}

async function getAllUsers() {
	var config = {
		method: 'GET'
	};
	var users = await fetch('http://localhost:5000/getUsers', config).then((res) => res.json());
	return users;
}

function logIn() {
	loginForm.style.display = 'none';
	outputDiv.style.display = 'block';
	logoutbtn.style.display = 'block';
	document.getElementById('textarea').value = '';
}
function logOut() {
	removeItem();
	outputDiv.style.display = 'none';
	logoutbtn.style.display = 'none';
	loginForm.style.display = 'block';
	document.getElementById('username').value = '';
	document.getElementById('password').value = '';
}

(async () => {
	await getAllData();
	displayProducts();
})();

/************************
 * *******Session********
 * **********************/
function setItem(item) {
	sessionStorage.setItem('session', item);
}

function getItem() {
	return sessionStorage.getItem('session');
}

function removeItem() {
	sessionStorage.removeItem('session');
}
