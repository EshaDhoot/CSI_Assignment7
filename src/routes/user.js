const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = await User.create({ email, password: hashedPassword });
        res.status(201).json({
            message: "User registered successfully",
            data: user,
            success: true,
            error: {}
        });
    } catch (error) {
        res.status(400).json({
            data: {},
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({
                message: "User signed in successfully",
                data: token,
                success: true,
                error: {}
            });
        } else {
            res.status(401).json({
                data: {},
                success: false,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        res.status(400).json({
            data: {},
            success: false,
            message: "Error logging in",
            error: error.message
        });
    }
});


module.exports = router;