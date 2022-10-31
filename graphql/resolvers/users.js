const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const { SECRET_KEY } = require('../../config');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');

/**
 * Generate JWT Token from User information.
 * @param {Logged in user information} user 
 */
function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
    Mutation: {
        async login(_, { username, password }, _context, _info) {
            const { errors, valid } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }
            const user = await User.findOne({ username });
            if (!user) {
                errors.general = "User not found";
                throw new UserInputError('User not found', { errors });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Wrong Credentials";
                throw new UserInputError("Wrong Credentials", { errors });
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_parent,
            { registerInput: { username, email, password, confirmPassword } },
            _context,
            _info
        ) { //parent: output of previous resolver, args: destructued registerInput, context: , info: metadata
            //validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            //check if user exists
            const user = await User.findOne({ username });
            if (user) {
                //either throw error or throw apollo error so apollo client identify it
                throw new UserInputError('Username is taken', { // ---> extensions.code = BAD_USER_INPUT
                    errors: {
                        username: 'This username is taken'  //use the key value pair to show in the UI side
                    }
                })
            }
            //hash the passowrd before persisting
            password = await bcrypt.hash(password, 12);
            //create User mongo db document entry
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });
            //persist user in mongo db
            const res = await newUser.save();
            //create oauth token
            const token = generateToken(newUser);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
};
