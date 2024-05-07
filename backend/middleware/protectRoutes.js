import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoutes = async (req, res, next) => {
    try {
        let token = req?.body?.tokenId;
        let cookie = req?.cookies?.jwt;
        
        if(!token) token = cookie;
        
        if (!token) return res.status(400).json({ error: "Unauthorized Token" });

        const decoded = jwt.verify(token, process.env.SECRATE_KEY);

        const user = await User.findById(decoded.userId);
        
        req.user = user;

        next();
    } catch (error) {
        console.error("Middleware error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default protectRoutes;