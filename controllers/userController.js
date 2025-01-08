import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Joi from 'joi';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Joi validation schema
        const schema = Joi.object({
            email: Joi.string().email().required(),  // Validate email format
            password: Joi.string().min(6).required()  // Validate password minimum length
        });

        // Validate incoming request body against schema
        const { error } = schema.validate({ email, password });
        if (error) {
            return res.status(400).json({
                success: false,
                message: `Validation error: ${error.details[0].message}`,
                errorCode: 'VALIDATION_ERROR'
            });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email already exists. Please try another one.',
                errorCode: 'USER_EXISTS'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ email, password: hashedPassword });

        try {
            await user.save();
            res.status(201).json({
                success: true,
                message: 'You have successfully registered. Welcome aboard!',
                data: { email }
            });
        } catch (err) {
            res.status(400).json({
                success: false,
                message: `Error saving user: ${err.message}`,
                errorCode: 'SAVE_ERROR'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error. Please try again later.',
            errorCode: 'SERVER_ERROR'
        });
    }
};

// Log in and get JWT
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Joi validation schema
        const schema = Joi.object({
            email: Joi.string().email().required(),  // Validate email format
            password: Joi.string().min(6).required()  // Validate password minimum length
        });

        // Validate incoming request body against schema
        const { error } = schema.validate({ email, password });
        if (error) {
            return res.status(400).json({
                success: false,
                message: `Validation error: ${error.details[0].message}`,
                errorCode: 'VALIDATION_ERROR'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Oops! The email or password you entered is incorrect.',
                errorCode: 'INVALID_CREDENTIALS'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Oops! The email or password you entered is incorrect.',
                errorCode: 'INVALID_CREDENTIALS'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            success: true,
            message: 'Login successful! You are now authenticated.',
            data: { token }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error. Please try again later.',
            errorCode: 'SERVER_ERROR'
        });
    }
};
