import Post from "../models/postSchema.js";
import User from "../models/userModel.js";

const createPost = async (req, res) => {
    try {
        const { postedby, img, text } = req.body;

        if (!postedby || !text) return res.status(400).json({ error: "Posteby and text field required" });

        const user = await User.findById(postedby);

        if (!user) return res.status(404).json({ error: "User not found" });

        if (req.user._id.toString() !== user._id.toString()) return res.status(401).json({ error: "Unauthorized for post" });

        const maxLength = 500;

        if (text.length > maxLength) return res.status(401).json({ error: `Text must be less than ${maxLength} characters` });

        const newPost = new Post({ postedby, img, text });
        await newPost.save();

        return res.status(201).json({ message: "Post Created Successfully", newPost });
    } catch (error) {
        console.log("Create Post Error: ", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const getPost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) return res.status(404).json({ error: "Post not found" });

        return res.status(200).json({ post });
    } catch (error) {
        console.log("GetPost error: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ error: "Post not found" });

        if (req.user._id.toString() !== post.postedby._id.toString())
            return res.status(401).json({ error: "Unauthorized to delete a post" });

        await Post.findByIdAndDelete(req.params.id);

        return res.status(201).json({ message: "Post deleted Successfully" })
    } catch (error) {
        console.log("Delete Post Error: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: "Post not found" });

        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            return res.status(201).json({ message: "Post Unliked Successfully" })
        } else {
            post.likes.push(userId);
            await post.save();
            return res.status(201).json({ message: "Post Liked Successfully" });
        }
    } catch (error) {
        console.log("Liked Post Error: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getUserPost = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ postedby: user?._id }).sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (err) {
        console.log("User Post Error: ", err.message);
        res.status(500).json({ error: "Internal Server Errror" });
    }
}

const deleteImg = async (req, res) => {
    
}

export { createPost, getPost, deletePost, likeUnlikePost, getUserPost };