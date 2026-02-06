const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true,
        },
        profilePicture: {
            type: String,
        },
        avatarNumber: {
            type: Number,
            required: true,
        },
        role: {
            type: String,
            default: 'student',
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', function (next) {
    if (!this.profilePicture) {
        const paddedNumber = String(this.avatarNumber).padStart(2, '0');
        this.profilePicture = `/assets/avatars/${this.gender}-avatar-${paddedNumber}.svg`;
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
