const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')


// GET /users - test endpoint
router.get('/', (req, res) => {
	res.json({ msg: 'welcome to the users endpoint' })
})

// POST /users/register - CREATE new user
router.post('/register', async (req, res) => {
	try {
		// check if user exists already
		const findUser = await db.User.findOne({
			email: req.body.email
		})

		// don't allow emails to register twice
		if (findUser) {
			return res.status(400).json({ msg: 'email exists already' })
		}

		// hash password
		const password = req.body.password
		const saltRounds = 12
		const hashedPassword = await bcrypt.hash(password, saltRounds)

		// create new user
		const newUser = new db.User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		})

		await newUser.save()

		// create jwt payload
		const payload = {
			name: newUser.name,
			email: newUser.email,
			_id: newUser.id
		}

		// sign jwt and send back
		const token = jwt.sign(payload, process.env.JWT_SECRET)

		res.json({ token })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'server error' })
	}
})

// POST /users/login -- validate login credentials
router.post('/login', async (req, res) => {
	try {
		// try to find user in the db
		const foundUser = await db.User.findOne({
			email: req.body.email
		})

		const noLoginMessage = 'Incorrect username or password'

		// if the user is not found in the db, return and sent a status of 400 with a message
		if (!foundUser) {
			return res.status(400).json({ msg: noLoginMessage })
		}

		// check the password from the req body against the password in the database
		const matchPasswords = bcrypt.compare(req.body.password, foundUser.password)

		// if provided password does not match, return an send a status of 400 with a message
		if (!matchPasswords) {
			return res.status(400).json({ msg: noLoginMessage })
		}

		// create jwt payload
		const payload = {
			name: foundUser.name,
			email: foundUser.email,
			_id: foundUser.id
		}

		// sign jwt and send back
		const token = jwt.sign(payload, process.env.JWT_SECRET)

		res.json({ token })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'server error' })
	}
})


// GET /auth-locked - will redirect if bad jwt token is found
router.get('/auth-locked', authLockedRoute, (req, res) => {
	// use res.locals.user here to do authorization stuff
	console.log('logged in user:', res.locals.user)
	// res.json({ msg: 'welcome to the private route!' })
	res.json({ msg: res.locals.user.image})
})


// PUT - update user profile image
router.put('/auth-locked', authLockedRoute, async (req, res) => {
	console.log('logged in user:', res.locals.user._id)
	newImageURL = req.body.image
	try {
		await db.User.findByIdAndUpdate({
			_id: res.locals.user._id
		}, {
			image: newImageURL
		})
		res.json({msg: "user image updated"})
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'server error' })
	}
})



//POST CREATE new destination
router.post('/destinations', authLockedRoute, async (req, res) => {
	try {
		const parkId = req.body.parkId;

		// check if destination already exists
		const findDestinations = await db.User.findOne({
			favorites: parkId
		});

		// don't allow favorites to get faved twice
		if (findDestinations) {
			return res.status(400).json({ msg: 'destination exists already' });
		}

		// Add parkId to the user's favorites array
		const user = await db.User.findById(res.locals.user._id);
		user.favorites.push(parkId);
		await user.save();

		res.json({ msg: 'destination added to favorites' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'server error' });
	}
});


// GET res.locals.user.destinations
router.get('/destinations', authLockedRoute, async (req, res) => {
	try {
		const user = await db.User.findById(res.locals.user._id);
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		res.json(res.locals.user.favorites);
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'server error' });
	}
});

// DELETE 
router.delete('/destinations/:id', authLockedRoute, async (req, res) => {
	try {
		const user = await db.User.findById(res.locals.user._id);
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		const destinationIndex = user.favorites.indexOf(req.params.id);
		if (destinationIndex === -1) {
			return res.status(404).json({ msg: 'Destination not found in favorites' });
		}

		user.favorites.splice(destinationIndex, 1);
		await user.save();

		res.sendStatus(204)
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'server error' });
	}
});


// PUT update a favorite destination
router.put('/destinations/:id', authLockedRoute, async (req, res) => {
	try {
		const user = await db.User.findById(res.locals.user._id);
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		const destinationId = req.params.id;
		const destinationIndex = user.favorites.indexOf(destinationId);

		if (destinationIndex === -1) {
			return res.status(404).json({ msg: 'Destination not found in favorites' });
		}

		// Update the destination
		user.favorites[destinationIndex] = req.body.updatedDestination;
		await user.save();

		res.json({ msg: 'Destination updated successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'Server error' });
	}
});


// need to ping the api to get the parks id and then add it to the faviorits array

module.exports = router