const User = require('../../models/user');

const registerUser = async(req, res) => {

    const existingUser = await User.findOne({
        $or: [{userEmail}, {userName}],
    });

    if(existingUser) {
        return res.status(400).json({
            success: false, 
            message: 'User name or user email is already exists '
        })
    }
};