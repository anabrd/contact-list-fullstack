const jwt = require('jsonwebtoken');
const jwtSKey = process.env.JWT_S_KEY;

exports.checkAuth = (req, res, next) => {
    // Token is sent in the header
    
    const token = req.header('x-auth-token');
    console.log(token)
    if (!token) {
        res.status(401).send({status: "failed", message: "Absent token."})
    } else {
    try {
        jwt.verify(token, jwtSKey, (fail, decodedPayLoad) => {
            if (fail) {
                res.status(401).send({status: "failed", message: "Invalid token."})
            } else if (decodedPayLoad) {
                // this will attach the id to the reqest, which we can use for mongoose queries
                req.userId = decodedPayLoad.id;
                // and only in case of success can we move onto controller with next
                next();
            }
        });
    } catch (err) {
        console.log(err);
    }
}
}
