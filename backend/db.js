const mongoose=require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)

const userSchema=new mongoose.Schema({
    username:String,
    password:String
})

const expenseSchema = new mongoose.Schema({
    username: { type: String, required: true },
    expenseId: { type: String, required: true, unique: true },
    description: { type: String, required: true, minlength: 1 },
    date: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
  });

const Users=mongoose.model("Users" ,userSchema)
const Expenses=mongoose.model("Expenses",expenseSchema)

module.exports={
    Users,
    Expenses
}