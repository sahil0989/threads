import jwt from "jsonwebtoken";

const generateTokenAndCookies = (userId, res) => {
    const token = jwt.sign({userId}, process.env.SECRATE_KEY, 
    {
        expiresIn: "15d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return token;
};

export default generateTokenAndCookies;