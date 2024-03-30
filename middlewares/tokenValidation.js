const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateToken = async (req, res, next) => {
    const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ error: "Unauthorized: Token expired" });
            } else {
                return res.status(403).json({ error: "Invalid token" });
            }
        }
        req.user = decoded.user;
        next();
    });
};

module.exports = validateToken;
