const jwt = require('jsonwebtoken');
require("dotenv").config();
const superSecret = process.env.SECRET;
const expiration = "2h";

module.exports = {
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, superSecret, { expiresIn: expiration });
    },
    authMiddleware: function ({ req }) {

        let token = req.body.token || req.query.token || req.headers.authorization;

        console.log("TOKEN", token);

        if (req.headers.authorization) {
            token = token.split(" ").pop().trim();
        }

        if (!token) {
            return req;
        }

        try {

            const { data } = jwt.verify(token, superSecret, { maxAge: expiration });
            console.log("DATA", data);
            req.user = data;
        } catch {
            console.log("Invalid token");
        }

        return req;
    }
}