import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../../utils/generateTokens.js";



// Signup Controller
export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;

        // Check for missing fields
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate profile picture URL
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // Create new user
        const newUser = new User({
            fullname,
            username,
            password: hashedPassword,
            gender,
            ProfilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        // Save the user to the database
        await newUser.save();

        // Generate JWT token and set it in cookies
        generateTokenAndSetCookie(newUser._id, res);

        // Respond with the created user
        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            ProfilePic: newUser.ProfilePic,
        });

    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        // Check if the user exists and if the password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // Generate JWT token and set it in cookies
        generateTokenAndSetCookie(user._id, res);

        // Respond with the user details
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            ProfilePic: user.ProfilePic,
        });

    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = (req,res) => {
    try {
        res.cookie("jwt","", {maxAge:0});
        res.status(200).json({message : "logged out successfully"})
        
    } catch (error) {
        console.log("Error logout controller", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
