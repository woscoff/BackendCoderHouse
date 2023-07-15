/* import { Schema, model } from "mongoose";
import { ManagerMongoDB } from "../db/mongoDBManager.js";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = model("Users", userSchema)

export class ManagerUserMongoDB extends ManagerMongoDB {
    constructor() {
        super(process.env.MONGODBURL, "users", userSchema)

    }

    async getElementByEmail(email) {
        super.setConnection()
        try {
            return await this.model.findOne({ email: email })
        } catch (error) {
            return error
        }
    }


}
export default userModel */

import { Schema, model } from "mongoose";
import { Roles } from "../../middlewares/session.js";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    default: Roles.USER
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  cart_id: {
    type: Schema.Types.ObjectId,
    ref: 'carts'
  }
});

const userModel = model("users", userSchema)
export default userModel