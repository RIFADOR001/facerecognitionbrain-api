const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');



const db = knex({
	client: 'pg',
	connection: {
		host: process.env.DATABASE_URL, //'127.0.0.1' is home or localhost
		ss1: {rejectUnauthorized: false},
		host: process.env.DATABASE_HOST,
		port: 5432,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PW,
		database: process.env.DATABASE_DB
	}
});

// db.select('*').from('users').then(data => {
// 	console.log(data);
// })


const app = express();

// app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
	res.send('Hello there');
})

app.post('/signin', (req, res) => {
	signin.handleSignin(req, res, db, bcrypt)
})

app.post('/register', (req, res) => { 
	register.handleRegister(req, res, db, bcrypt) 
})

app.get('/profile/:id', (req, res) => {
	profile.handleProfileGet(req, res, db)
})

app.put('/image', (req, res) => {
	image.handleImage(req, res, db)
})

app.post('/imageurl', (req, res) => {
	image.handleApiCall(req, res)
})







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('app is running on port ', PORT);
})







