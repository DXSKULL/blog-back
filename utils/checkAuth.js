import jwt from "jsonwebtoken"

export default (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (token) {
        try {
            const decoed = jwt.verify(token, "secret123")

            req.userId = decoed._id
            next()
        } catch (error) {
            return res.status(403).json({
                message: "Нед доступа"
            })
        }
    } else {
        return res.status(403).json({
            message: "Нед доступа"
        })
    }
    
    
}