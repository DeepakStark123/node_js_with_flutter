const UserService = require('../services/user_services');

//---User-registration----
exports.register = async (req, res, next)=> {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const duplicate = await UserService.checkUserExistence(email);
        if (duplicate) {
            return res.status(409).json({ error: `User with email ${email} already exists` });
        }
        const response = await UserService.registerUser(email, password);
        return res.status(200).json({ status: true, success: 'User registered successfully' });
    } catch (error) {
        console.log('Registration Error---->', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

//---User-Login--
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        let user = await UserService.checkUserExistence(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }
        // Creating Token
        let tokenData = { _id: user._id, email: user.email };
        const token = await UserService.generateAccessToken(tokenData,"secret","1h")
        res.status(200).json({ status: true, success: "sendData", token: token });
    } catch (error) {
        console.log('Login Exceptions---->', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
