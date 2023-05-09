import 'dotenv/config.js'
import express from 'express'
import session from 'express-session'
//import session from 'express-session'
import multer from 'multer'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'
import * as path from 'path'
import router from './routes/index.routes.js'
import routerUser from './routes/user.routes.js'
import routerSession from './routes/session.routes.js'
import initializePassport from './config/passport.js'
import cors from 'cors'

const whiteList = ['http://localhost:3000'] //Rutas validas a mi servidor

const corsOptions = { //Reviso si el cliente que intenta ingresar a mi servidor esta o no en esta lista
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by Cors'))
        }
    }
}

const app = express()

app.use(express.json())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGODBURL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 210
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

/* const connectionMongoose = async () => {
    await mongoose.connect(process.env.MONGODBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .catch((err) => console.log(err));
}
 */
/* connectionMongoose() */

app.use(cookieParser(process.env.JWT_SECRET))
app.use(passport.initialize())
initializePassport(passport)
app.use('/users', routerUser)
app.use('/auth', routerSession)
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname, "./views"))

app.set("port", process.env.PORT || 5000)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

app.listen(4000, () => {
    console.log(`Server on port 4000`)
})

