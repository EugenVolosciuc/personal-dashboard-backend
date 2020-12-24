const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const { ErrorHandler } = require('../../utils/errorHandler');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Please provide a username']
    },
    email: {
        type: String,
        unique: true,
        validate: [isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
}, {
    timestamps: true
});

// Remove password from the returned user object
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

// Login method
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });

    if (user) {
        const auth = await bcrypt.compare(password, user.password);

        if (auth) return user;
    }

    throw new ErrorHandler(401, 'Incorrect email or password');
}


userSchema.pre('save', async function (next) {
    // Hash password before saving user to DB
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;