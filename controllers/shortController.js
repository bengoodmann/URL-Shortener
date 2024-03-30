const ShortUniqueId = require('short-unique-id')
const Short = require("../models/shortModel");

const uid = new ShortUniqueId({ length: 5 });

// require("dotenv").config()

const PORT = process.env.PORT

const createShort = async (req, res) => {
    try {
        const { url, name, description } = req.body
        if (!(url && name)) {
            return res.status(400).json({ error: "The web address and name are required field" })
        }
        if (!isValidUrl(url)) {
            return res.status(400).json({ error: "Invalid URL format, please enter a valid website address" });
        }
        let genShort = `${req.protocol}://${req.hostname}:${PORT}/${uid.rnd()}`
        const findShort = await Short.findOne({ where: { shortened: genShort } })
        if (findShort) {
            genShort = `${req.protocol}://${req.hostname}:${PORT}/${uid.rnd()}`
        }
        const newShort = await Short.create({
            userId: req.user.id,
            originalURL: url,
            name: name,
            description: description,
            shortened: genShort
        })
        return res.status(201).json({ "data": { newShort } })

    } catch (error) {
        console.log(error)
        return res.status(500).json("An unknown error has occurred", error)
    }
}

const redirectShort = async (req, res) => {
    try {
        const short = req.params.short
        const _ = `${req.protocol}://${req.hostname}:${PORT}/${short}`
        const findShort = await Short.findOne({ where: { shortened: _ } })
        if (!findShort) {
            return res.status(404).json({ "error": "The link doesn't exist" })
        }

        findShort.increment('clickedTimes')
        return res.redirect(findShort.originalURL)
    } catch (error) {
        console.log(error)
        return res.status(500).json("An unknown error has occurred", error)
    }
}


const isValidUrl = (url) => {
    const urlRegex = /^(http|https):\/\/[^\s]+/;
    return urlRegex.test(url);
}

module.exports = { createShort, redirectShort }