
const jwt = require("jsonwebtoken")

const authentication = async(req,res,next) => {
    try {
        const token = req.headers["token"];

        jwt.verify(token, "my-secret-key", (err,decodedToken)=>{
            if(err){
                return res.status(401).send({status : false, message : err.message})
            }

            console.log(decodedToken);
            req.phoneNumber = decodedToken.phoneNumber
            next();
        })

    } catch (error) {
        return res.status(500).send({status : false, message : "server error in authentiaction", error })
    }
}

module.exports = authentication