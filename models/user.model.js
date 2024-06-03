import mongoose from 'mongoose'

const User = new mongoose.Schema({
    name : {
        type: String,
    },
    email : {
        type: String,
    },
    annual_income : {
        type : Number
    },
    credit_score : {
        type : Number
    }
})

const newUser = mongoose.model('User',User)

export default newUser