import newUser from '../models/user.model.js';
import pushInQueue from '../asynchandlers/producer.js';

// Configure Multer for file uploads

const handleRegister = async (req, res) => {
    const { name, email, annual_income } = req.body;
    console.log(req)
    const existingUser = await newUser.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ msg: 'No user Registration allowed with this credential' });
    } else {
        const newusers = await newUser.create({ name, email, annual_income });
        await newusers.save();
        
        pushInQueue({name,email});
        
        return res.status(201).json({ msg: "Registration Successful" });
    }
};

export default handleRegister;