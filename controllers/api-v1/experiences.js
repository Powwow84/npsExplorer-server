const router = require('express').Router();
const db = require('../../models');
const authLockedRoute = require('./authLockedRoute');

// GET /experiences 
router.get('/', (req, res) => {
        res.json({
            msg: "Welcome to the experiences endpoint"
        })

})

// GET - See all experiences of a single, authorized user
router.get('/:userName', authLockedRoute, async (req, res) => {
    try {
        res.json({
            msg: res.locals.user.experiences
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal Server Error" })
    }

})
// POST - Create new experience of a single, authorized user
router.post('/:userName/:park', authLockedRoute, async (req, res) => {
    try {
        const createExperience = new db.Experience({
            location: req.body.park.location,
            image: req.body.park.image,
            description: "",
            explorer: res.locals.user._id
        })
        await createExperience.save()

        res.locals.user.experiences.push(createExperience._id);
        await res.locals.user.save();
        res.json({
            msg: "transcation worked"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal Server Error" })
    }
})

// PUT - update single experience for authorized user
router.put("/:userName/:park", authLockedRoute, async (req, res) => {
    try {
        const updatedExperience = await db.Experience.findByIdAndUpdate({
            _id: req.body.park._id
        }, {
            description: req.body.park.description,
            image: req.body.park.image
        }, { new: true })
        res.json({
            msg: updatedExperience
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal Server Error" })
    }
})


// DELETE ROUTE FOR EXPERIENCES
router.delete("/:userName/:park", authLockedRoute, async (req, res) => {
    try {
        await db.Experience.findByIdAndDelete(req.body.park._id)
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal Server Error" })
    }
})


module.exports = router