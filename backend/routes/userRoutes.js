import express from "express";
import { followUnfollowUser, getAllUsers, getUserProfile, loginUser, logout, signupUser, updateUser } from "../controllers/userController.js";
import protectRoutes from "../middleware/protectRoutes.js";

const router = express.Router();

router.post("/signup", signupUser);

router.post("/login", loginUser)

router.post("/logout", logout);

router.post("/profile/:query", getUserProfile);

router.post("/follow/:id", protectRoutes, followUnfollowUser);

router.post("/updateProfile/:id", protectRoutes, updateUser);

router.post("/allUsers", protectRoutes ,getAllUsers);

export default router;