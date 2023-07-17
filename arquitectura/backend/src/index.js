import 'dotenv/config.js'
import express from 'express'
import session from 'express-session'
import multer from 'multer'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import nodemailer from 'nodemailer'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'
import * as path from 'path'
import router from './routes/index.routes.js'
import routerUser from './routes/users.routes.js'
import routerSession from './routes/sessions.routes.js'
import initializePassport from './config/passport.js'
import cors from 'cors'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import { readMessages, createMessage } from './services/messageServices.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { log, middlewareLogger } from './middlewares/logger.js'
import { Server as SocketServer } from 'socket.io'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

//const whiteList = ['http://localhost:3000'] //Rutas validas a mi servidor

// const corsOptions = { //Reviso si el cliente que intenta ingresar a mi servidor esta o no en esta lista
//     origin: (origin, callback) => {
//         if (whiteList.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by Cors'))
//         }
//     }
// }

 const app = express()

const swaggerOpts = {
    definition: {
      openapi: '3.0.1',
      info: {
        title: "Natufriend - API documentation",
        description: "Description of the APIRest"
      }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
  }
  const specs = swaggerJSDoc(swaggerOpts)
  app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

 

app.use(express.json())
app.use(middlewareLogger)
//app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(session({
    store: new MongoStore({
        mongoUrl: process.env.MONGODBURL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 210
    }),
    secret: '1234coder',
    resave: false,
    saveUninitialized: false,
    rolling: false
}))





// mongoose.connect(process.env.MONGODBURL)
// .then(() => {
//     console.log("Conectado con exito a la base de datos");
// })
// .catch((error) => {
//     console.log(error);
// })


initializePassport()
app.use(passport.initialize())
app.use(passport.session())
//initializePassport(passport)
//app.use('/user', routerSession);
//app.use('/auth', routerSession)
//app.use('/', router)
//app.use('/', express.static(__dirname + '/public'))
//app.use(errorHandler)

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'))

app.set("port", process.env.PORT)

app.use('/', router)
app.use('/', express.static(__dirname + '/public'))

/* const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`)
    }
}) */







//const upload = multer({ storage: storage })




export const io = new Server();

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
      authMethod: 'LOGIN'
    },
    tls: {
      rejectUnauthorized: false  //para superar la barrera de avast
    }
  });

  app.use(errorHandler)

io.on("connection", async (socket) => {
    console.log("Chat client online");

    socket.on("message", async newMessage => {
        await createMessage([newMessage]);
        const messages = await readMessages();
        console.log(messages)
        socket.emit("allMessages", messages)
    })

    socket.on("load messages", async () => {
        const messages = await readMessages()
        console.log(messages)
        socket.emit("allMessages", messages)
    })
})

const connectToMongoDB = async () => {
  await mongoose.connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .catch(error => log('error', error.message))
  log('info', `Database connected`)
}

connectToMongoDB()

const server = app.listen(app.get("port"), () => {
  log('info', `Server running on http://localhost:${app.get("port")}`);
})


export const chatServer = new SocketServer(server)
log('info', `Chat server online`)
chatServer.on("connection", async (socket) => {
  log('info', "Connection to chat detected")

  socket.on("message", async (newMessage) => {
    await createMessage([newMessage])
    const messages = await readMessages()
    log('info', 'New chat message received')
    chatServer.emit("allMessages", messages)
  })

  socket.on("load messages", async () => {
    const messages = await readMessages()
    chatServer.emit("allMessages", messages)
  })
})




// // * Server
// import './config/config.js'
// import router from './routes/index.routes.js'
// import express from 'express'
// //import multer from 'multer'
// import { engine } from 'express-handlebars'
// import { __dirname } from "./path.js";
// import * as path from 'path'
// import mongoose from 'mongoose';
// import MongoStore from 'connect-mongo'
// import cookieParser from 'cookie-parser'
// import session from 'express-session';
// import initializePassport from './config/passport.js'
// import passport from 'passport'
// import nodemailer from 'nodemailer'
// import { Server as SocketServer } from 'socket.io'
// import { readMessages, createMessage } from './services/messageServices.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import { log, middlewareLogger } from './middlewares/logger.js';
// import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerUiExpress from 'swagger-ui-express'

// const app = express()

// /*
//   ***********
//   Middlewares
//   ***********
// */

// // * Express, Winston Logger and Session
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(middlewareLogger)
// app.use(cookieParser(process.env.COOKIE_SECRET))
// app.use(session({
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGO_URL,
//         mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
//         ttl: 60 * 60
//     }),
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     rolling: false
// }))

// // * Swagger API documentation
// const swaggerOpts = {
//   definition: {
//     openapi: '3.0.1',
//     info: {
//       title: "Natufriend - API documentation",
//       description: "Description of the APIRest"
//     }
//   },
//   apis: [`${__dirname}/docs/**/*.yaml`]
// }
// const specs = swaggerJSDoc(swaggerOpts)
// app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))


// // * Passport
// initializePassport()
// app.use(passport.initialize())
// app.use(passport.session())

// // * Handlebars as template engine
// app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');
// app.set('views', path.resolve(__dirname, './views'))

// // * Port setting
// app.set("port", process.env.PORT)

// // * Router
// app.use('/', router)

// // * Pathfile
// app.use('/', express.static(__dirname + '/public'))

// // * Nodemailer
// export const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.MAILER_EMAIL,
//     pass: process.env.MAILER_PASSWORD,
//     authMethod: 'LOGIN'
//   },
//   tls: {
//     rejectUnauthorized: false  //para superar la barrera de avast
//   }
// });

// // ERROR HANDLER (LAST MIDDLEWARE TO USE)
// app.use(errorHandler)

// // Multer settings
// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //         cb(null, 'src/public/img')
// //     },
// //     filename: (req, file, cb) => {
// //         cb(null, `${Date.now()}${file.originalname}`)
// //     }
// // })
// // const upload = multer({ storage: storage })

// const connectToMongoDB = async () => {
//   await mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//     .catch(error => log('error', error.message))
//   log('info', `Database connected`)
// }

// connectToMongoDB()

// // Server launch
// const server = app.listen(app.get("port"), () => {
//   log('info', `Server running on http://localhost:${app.get("port")}`)
// })

// // Socket server for chat service
// export const chatServer = new SocketServer(server)
// log('info', `Chat server online`)
// chatServer.on("connection", async (socket) => {
//   log('info', "Connection to chat detected")

//   socket.on("message", async (newMessage) => {
//     await createMessage([newMessage])
//     const messages = await readMessages()
//     log('info', 'New chat message received')
//     chatServer.emit("allMessages", messages)
//   })

//   socket.on("load messages", async () => {
//     const messages = await readMessages()
//     chatServer.emit("allMessages", messages)
//   })
// })

