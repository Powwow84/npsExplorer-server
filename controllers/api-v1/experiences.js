const router = require('express').Router();
const db = require('../../models');



// GET /experiences 
router.get('/', (req, res) => {
        res.json({
            msg: "Welcome to the experiences endpoint"
        })

})
router.get('/:id', async (req, res) => {
    try {
        findUser = await db.User.findOne({
            _id: req.body._id
        })
        res.json({
            msg: findUser.Experiences
        })
    } catch (error) {
        console.log(error)
    }

})

module.exports = router