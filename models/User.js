// require mongoose ODM
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2
	},
	email: {
		type: String,
		required: true,
		minlength: 5
	},
	password: {
		type: String,
		required: true
	},
	image: {
		type: String,
		default: ""
	},
	favorites: [{
		type: String
	}],
	Experiences: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Experience"
	}]

}, {
	timestamps: true
})

module.exports = mongoose.model('User', UserSchema)