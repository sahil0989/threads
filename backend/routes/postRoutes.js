import express from "express";
import { createPost, deletePost, getPost, getUserPost, likeUnlikePost } from "../controllers/postController.js";
import protectRoutes from "../middleware/protectRoutes.js";
import { getFeedPost, replyToPost } from "../controllers/userController.js";

const router = express.Router();


router.post("/feed", protectRoutes, getFeedPost);

router.post("/create", protectRoutes, createPost);

router.post("/delete/:id", protectRoutes, deletePost);

router.get("/user/:username", getUserPost);

router.post("/like/:id", protectRoutes, likeUnlikePost);

router.post("/reply/:id", protectRoutes, replyToPost);  

router.post("/delte/img")

router.get("/:id", getPost);

export default router;