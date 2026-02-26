const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.registerUser = async (userData) => {
    const { name, email, password, role } = userData;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new ErrorResponse('User already exists', 400);
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    return generateTokenResponse(user, 201);
};

exports.loginUser = async (email, password) => {
    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new ErrorResponse('Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw new ErrorResponse('Invalid credentials', 401);
    }

    return generateTokenResponse(user, 200);
};

exports.getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }
    return user;
};

// Helper function
const generateTokenResponse = (user, statusCode) => {
    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d' // e.g. 30 days
    });

    return {
        statusCode,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            hasActivatedPass: user.hasActivatedPass
        },
        token
    };
};
