import bcrypt from "bcryptjs"
import User from "../models/userModel.js";
import Post from "../models/postSchema.js";
import generateTokenAndCookies from "../utils/helpers/generateTokenAndSetCookies.js";
import mongoose from "mongoose";

const signupUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name, email, username, password: hashedPassword
        })

        await newUser.save();

        if (newUser) {
            const token = generateTokenAndCookies(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                tokenId: token,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("Error in Singup : ", error.message)
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const data = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, data?.password || "");

        if (!data || !isPasswordCorrect) {
            return res.status(400).json({ error: "Wrong credentials" });
        }

        res.cookie("testing", "new cookie ")
        const token = generateTokenAndCookies(data._id, res);

        res.status(201).json({
            _id: data._id,
            name: data.name,
            username: data.username,
            email: data.email,
            bio: data.bio,
            profilePic: data.profilePic,
            tokenId: token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logout successfully" });
    } catch (err) {
        console.error("Logout error:", err.message);
        res.status(500).json({ error: "Internal server error from logout" });
    }
};

const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow yourself" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            return res.status(200).json({ message: "Unfollowed successfully" });
        } else {
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            return res.status(200).json({ message: "Followed successfully" });
        }
    } catch (error) {
        console.error("Follow/unfollow error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, username, email, bio } = req.body;
        let { profilePic } = req.body;
        const userId = req.user._id;

        let user = await User.findById(userId);

        if (!user) return res.status(400).json({ error: "User not found.." });

        if (req.params.id !== userId.toString()) return res.status(400).json({ error: "You can't update the other's profile" });

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        res.status(200).json({ message: "Profile Update Successfully!!", user });

    } catch (error) {
        console.error("Update User error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const getUserProfile = async (req, res) => {
    const { query } = req.params;
    try {
        let user;

        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        } else {
            user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
        }

        if (!user) return res.status(400).json({ error: "User not found" });
        return res.status(200).json({ user });

    } catch (error) {
        console.error("Profile error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const replyToPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!text) return res.status(400).json({ error: "Text field is required" });

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: "Post not found!" });

        const reply = { userId, text, userProfilePic, username };

        post.replies.push(reply);
        await post.save();

        return res.status(200).json({ message: "Reply added Successfully", post });
    } catch (err) {
        console.log("Reply Error: ", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getFeedPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: "User not found" });

        // const following = user.following;

        // const feedPosts = await Post.find({ postedby: { $in: following } }).sort({ createdAt: -1 })
        const feedPosts = await Post.find().sort({ createdAt: -1 })

        return res.status(200).json(feedPosts);
    } catch (err) {
        console.log("Feed Error: ", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ error: "User not found" });

        const allUsers = await User.find().sort({ createdAt: -1 })

        return res.status(200).json(allUsers);
    } catch (err) {
        console.log("All User's Error: ", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { signupUser, loginUser, logout, followUnfollowUser, updateUser, getUserProfile, replyToPost, getFeedPost, getAllUsers };