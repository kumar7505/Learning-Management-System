const User = require('../../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async(req, res) => {
    try {
        const { userName, userEmail, password, role } = req.body;

        const existingUser = await User.findOne({
            $or: [{userEmail}, {userName}],
        });

        if(existingUser) {
            return res.status(400).json({
                success: false, 
                message: 'User name or user email is already exists '
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({userName, userEmail, role, password: hashPassword})

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User registered successfully!',
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = {registerUser};