const db = require("./models");

const findUser = async () => {
    try {
        const foundUser = await db.User.findOne({
            _id: "6452d9cf7fc03e7f8351eaf2"
        })
        console.log(foundUser)
    } catch (error) {
        console.log(error)
    }
}

findUser()