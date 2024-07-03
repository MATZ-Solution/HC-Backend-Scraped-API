const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer"))  {
        const token = authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            // console.log(user)
            if (err) {
                res.status(400).json(err)
            } else {

                req.user = user;
                next();
            }
        })
    } else {
        res.status(400).json("you are not authenticated");
    }
}

const verifyTokenForFav = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer"))  {
        const token = authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            // console.log(user)
            if (err) {
                res.status(400).json(err)
            } else {

                req.user = user;
                next();
            }
        })
    } else {
        // res.status(400).json("you are not authenticated");
        req.user="notLogin"
        next()
    }
}

const verifyTokenAndCorporate = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin === "corporate") {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

const verifyTokenAndCareGivers = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin === "care-givers") {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin === "super-admin") {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};
const verifyCaptcha= (req, res, next) => {
    const { recaptchaToken } = req.body;
    if (recaptchaToken === null || recaptchaToken === '' || recaptchaToken === undefined) {
        return res.json({ "success": false, "msg": "Please select recaptchaToken" });
    }
    const secretKey = process.env.SECRET_KEY ?? '6LcoSwMqAAAAAMO0tpLZqxQnIIRyxb1VQcWYzThj';
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    fetch(url,{
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            if (data.success !== undefined && !data.success) {
                return res.json({ "success": false, "msg": "Failed captcha verification" });
            }
            next();
        }).catch(error => {
        return res.json({ "success": false, "msg": "Failed captcha verification" });
        });
}
module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndCorporate,
    verifyTokenAndCareGivers,verifyTokenForFav,
    verifyCaptcha
};