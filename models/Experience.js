const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
    location: {
        type: String
    },
    image: {
      type: String  
    },
    description: {
        type: String
    },
    explorer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Experience", ExperienceSchema)