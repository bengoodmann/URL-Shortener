const ShortUniqueId = require("short-unique-id");
const Short = require("../models/shortModel");
const { Op } = require("sequelize");

const uid = new ShortUniqueId({ length: 5 });

const PORT = process.env.PORT;


const searchByName = async (req, res) => {
  try {
    const { name } = req.query;
    const user = req.user.id;
    if (!name) {
      return res
        .status(400)
        .json({ error: "Input the name of the short URL you want to search" });
    }
    const result = await Short.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
        userId: user,
      },
    });
    const count = await Short.count({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
        userId: user,
      },
    });
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ error: "No short URLs were found with the specified name" });
    }
    return res.status(200).json({ data: { result }, count: { count } });
  } catch (error) {
    console.error("Error fetching short URLs:", error);
    return res.status(500).json({ error: "Failed to fetch short URLs" });
  }
};


const allUserCreatedShort = async (req, res) => {
  try {
    const user = req.user.id;
    const shorts = await Short.findAll({ where: { userId: user } });
    if (!shorts) {
      return res
        .status(404)
        .json({ error: "You haven't created any short URLs" });
    }
    return res.status(200).json({ shorts });
  } catch (error) {
    console.error("Error fetching user's created short URLs:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch user's created short URLs" });
  }
};


const createShort = async (req, res) => {
  try {
    const { originalURL, name, description } = req.body;
    if (!(originalURL && name)) {
      return res
        .status(400)
        .json({ error: "The web address and name are required field" });
    }
    if (!isValidUrl(originalURL)) {
      return res.status(400).json({
        error: "Invalid URL format, please enter a valid website address",
      });
    }
    let genShort = `${req.protocol}://${req.hostname}:${PORT}/${uid.rnd()}`;
    const findShort = await Short.findOne({ where: { shortened: genShort } });
    if (findShort) {
      genShort = `${req.protocol}://${req.hostname}:${PORT}/${uid.rnd()}`;
    }
    const newShort = await Short.create({
      userId: req.user.id,
      originalURL: originalURL,
      name: name,
      description: description,
      shortened: genShort,
    });
    return res.status(201).json({ data: { newShort } });
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error:
          "Invalid user ID provided. Check if you're logged out and log in again",
      });
    } else if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Short URL already exists" });
    } else if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: "Validation error: " + error.message });
    } else {
      return res.status(500).json({ error: "An unknown error has occurred" });
    }
  }
};


const getShort = async (req, res) => {
  try {
    const userId = req.user.id;
    const shortId = req.params.id;
    const short = await Short.findOne({
      where: { userId: userId, id: shortId },
    });
    if (!short) {
      return res.status(404).json({ error: "The short URL not found" });
    }
    return res.status(200).json({ short });
  } catch (error) {
    console.error("Error fetching short URL:", error);
    return res.status(500).json({ error: "Failed to fetch short URL" });
  }
};


const updateShort = async (req, res) => {
  try {
    const userId = req.user.id;
    const shortId = req.params.id;
    const { name, originalURL, description } = req.body;
    const short = await Short.findOne({
      where: { userId: userId, id: shortId },
    });
    if (!short) {
      return res.status(404).json({ error: "The short URL doesn't exist" });
    }
    // const updateDetails = {
    //     name: name || short.name,
    //     description: description || short.description
    // }
    // const  updatedShort = await Short.update(updateDetails, { where: { id: shortId }, returning: true });
    short.name = name || short.name;
    short.description = description || short.description;
    short.originalURL = originalURL || short.originalURL;
    await short.save();

    return res
      .status(200)
      .json({ message: "Short URL updated successfully", short });
  } catch (error) {
    console.error("Error updating short URL:", error);
    return res.status(500).json({ error: "Failed to update short URL" });
  }
};



const deleteShort = async (req, res) => {
  try {
    const userId = req.user.id;
    const shortId = req.params.id;
    const short = await Short.findOne({
      where: { userId: userId, id: shortId },
    });
    if (!short) {
      return res.status(404).json({ error: "The short URL doesn't exist" });
    }
    await short.destroy();
    return res.status(200).json({ message: "Short URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting short URL:", error);
    return res.status(500).json({ error: "Failed to delete short URL" });
  }
};

/**
 * @swagger
 * /api/{short}:
 *   get:
 *     summary: Redirect to original URL from short URL
 *     description: Redirect to the original URL from the short URL
 *     tags: [Shorts]
 *     parameters:
 *       - in: path
 *         name: short
 *         required: true
 *         schema:
 *           type: string
 *         description: Short code of the URL to redirect to
 *     responses:
 *       '302':
 *         description: Redirect to the original URL
 *       '404':
 *         description: Short URL not found
 *       '500':
 *         description: Internal server error
 */
const redirectShort = async (req, res) => {
  try {
    const short = req.params.short;
    const _ = `${req.protocol}://${req.hostname}:${PORT}/${short}`;
    const findShort = await Short.findOne({ where: { shortened: _ } });
    if (!findShort) {
      return res.status(404).json({ error: "The link doesn't exist" });
    }

    findShort.increment("clickedTimes");
    return res.redirect(findShort.originalURL);
  } catch (error) {
    console.log(error);
    return res.status(500).json("An unknown error has occurred", error);
  }
};

const isValidUrl = (url) => {
  const urlRegex = /^(http|https):\/\/[^\s]+/;
  return urlRegex.test(url);
};

module.exports = {
  allUserCreatedShort,
  createShort,
  getShort,
  updateShort,
  deleteShort,
  redirectShort,
  searchByName,
};
