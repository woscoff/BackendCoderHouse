import userModel from "./dao/MongoDB/models/user.js";
import mongoose from "mongoose";


const main = async() => {
    await mongoose.connect("mongodb+srv://santiwoscoff:coderhouse@cluster0.mmq3z3f.mongodb.net/?retryWrites=true&w=majority")
    const response = await userModel.find({lastname: "Santiago"}).explain('executionStats')
    console.log(response);
}
main()