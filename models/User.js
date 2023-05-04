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
		default: "https://github.com/andrewbantly/npsExplorer-server/blob/serverDev/media/default-avatar.png?raw=true"
	},
	favorites: [{
		type: String
	}],
	experiences: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Experience"
	}]

}, {
	timestamps: true
})

module.exports = mongoose.model('User', UserSchema)