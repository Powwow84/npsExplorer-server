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
router.get('/:userId', authLockedRoute, async (req, res) => {
    const { userId } = req.params;
    try {
        const foundExperience = await db.Experience.find({
            explorer: userId
        })
        res.json(foundExperience)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal Server Error" })
    }

})

// GET - Get information for a single experience 
router.get("/experience/:experienceId", authLockedRoute, async (req, res) => {
    const { experienceId } = req.params;
    try {
            const foundExperience = await db.Experience.find({
                    _id: experienceId
        })
        res.json(foundExperience)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal Server Error" })
    }
})


// POST - Create new experience of a single, authorized user
router.post('/:userId', authLockedRoute, async (req, res) => {
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
router.put("/:experienceId", authLockedRoute, async (req, res) => {
    const { experienceId } = req.params;
    try {
        const updatedExperience = await db.Experience.findByIdAndUpdate({
            _id: experienceId
        }, {
            description: req.body.description,
            image: req.body.image
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
router.delete("/:experienceId", authLockedRoute, async (req, res) => {
    const { experienceId } = req.params;
    try {
        await db.Experience.findByIdAndDelete(experienceId)
        res.sendStatus(204)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal Server Error" })
    }
})


module.exports = router