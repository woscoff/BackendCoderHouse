import { ManagerMongoDB } from "../../../db/gestorMongoDB.js";
import {Schema} from "mongoose";

const url = ""

const messageSchema= new Schema({
    nombre: String,
    marca: String,
    precio: Number,
    stock: Number,
    email:{
        type: String,
        unique: true
    },
    message: String
})

export class ManagerMessageMongoDB extends ManagerMongoDB{
    constructor(){
        super(url, "messages", messageSchema)
    }
}