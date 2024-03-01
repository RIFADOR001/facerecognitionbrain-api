

const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	if(!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			//always return so the db knows about it
		return trx('users')
		.returning('*')
			.insert({
				email: loginEmail[0].email,
				name: name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
		.catch(err => {
			if(err.constraint === "users_email_key"){
				console.log('This email has been already used');
			}
			res.status(400).json('Unable to register')
		})
}


module.exports = {
	handleRegister: handleRegister
};

