/* import local from 'passport-local'
import passport from 'passport'
//import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { managerUser } from '../controllers/user.controller.js'
import { managerCart } from '../controllers/cart.controller.js'
import { createHash, validatePassword } from '../utils/bcrypt.js'
import { authToken, generateToken } from '../utils/jwt.js'

//Passport se va a manejar como si fuera un middleware 
const LocalStrategy = local.Strategy //Estretagia local de autenticacion
//Passport define done como si fuera un res.status()

const JWTStrategy = jwt.Strategy //Estrategia de JWT
const ExtractJWT = jwt.ExtractJwt //Extractor ya sea de headers o cookies, etc


const initializePassport = () => {

    const cookieExtractor = (req) => {
        //Si existen cookies, verifico si existe mi cookie  sino asigno null
        const token = req.cookies ? req.cookies.jwtCookies : null
        //Si no existe, asigno undefined
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //De donde extraigo mi token
        secretOrKey: process.env.SIGNED_COOKIE //Mismo valor que la firma de las cookies
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }

    }))


    //Ruta a implementar
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            //Validar y crear Usuario
            const { first_name, last_name, email, age } = req.body
            try {
                const user = await managerUser.getElementByEmail(username) //Username = email

                if (user) { //Usuario existe
                    return done(null, false) //null que no hubo errores y false que no se creo el usuario

                }

                const passwordHash = createHash(password)
                const carrito = await managerCart.addElements()
                const userCreated = await managerUser.addElements([{
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    age: age,
                    password: passwordHash,
                    idCart: carrito[0]._id
                }])
                const token = generateToken(userCreated)
                console.log(token)
                return done(null, userCreated) //Usuario creado correctamente

            } catch (error) {
                return done(error)
            }

        }

    ))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {

        try {
            const user = await managerUser.getElementByEmail(username)

            if (!user) { //Usuario no encontrado
                return done(null, false)
            }
            if (validatePassword(password, user.password)) { //Usuario y contraseña validos
                //const token = generateToken(user)
                //console.log(token)
                return done(null, user)
            }

            return done(null, false) //Contraseña no valida

        } catch (error) {
            return done(error)
        }
    }))

    //Iniciar la session del usuario
    passport.serializeUser((user, done) => {
        console.log(user)
        if (Array.isArray(user)) {
            done(null, user[0]._id)
        } else {
            done(null, user._id)
        }
    })

    //Eliminar la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await managerUser.getElementById(id)
        done(null, user)

    })

}

export default initializePassport */

// import local from "passport-local";
// import passport from "passport";
// import mongoose from "mongoose";
// import GitHubStrategy from "passport-github2";
// import { createUser, findUserByEmail, findUserById } from "../services/userServices.js";
// import { createCart } from "../services/cartServices.js";
// import { createHash, validatePassword } from "../utils/bcrypt.js";
// import { Roles } from "../middlewares/session.js";

// const LocalStrategy = local.Strategy;

// const initializePassport = () => {

//   passport.use("register",
//     new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
//       const { first_name, last_name, email } = req.body;

//       try {
//         const user = await findUserByEmail(username); // username <=> email
//         if (user) {
//           return done(null, false); // null: no errores - false: no se creo el user
//         } else {
//           const hashPassword = await createHash(password);
//           const newCart = await createCart()

//           const createdUser = await createUser({
//             first_name: first_name,
//             last_name: last_name,
//             email: email,
//             password: hashPassword,
//             role: Roles.USER,
//             cart_id: newCart._id
//           });

//           return done(null, createdUser);
//         }
//       } catch (error) {
//         return done(error);
//       }
//     })
//   );

//   passport.use("login",
//     new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
//       try {
//         if (username === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//           // ADMIN LOGIN
//           const user = {
//             _id: new mongoose.Types.ObjectId(),
//             first_name: process.env.ADMIN_NAME,
//             last_name: " ",
//             email: process.env.ADMIN_EMAIL,
//             password: " ", // Default password required by Challenge #5
//             role: Roles.ADMIN
//           };
//           return done(null, user);
//         }

//         // USER LOGIN
//         const user = await findUserByEmail(username);

//         if (!user) {
//           //User not found
//           return done(null, false);
//         }

//         if (await validatePassword(password, user.password)) {
//           //const token = generateToken(user);
//           return done(null, user);
//         }

//         // Wrong password
//         return done(null, false);
//       } catch (error) {
//         return done(error);
//       }
//     })
//   );

//   // passport.use("github", new GitHubStrategy(
//   //   {
//   //     clientID: process.env.CLIENT_ID,
//   //     clientSecret: process.env.CLIENT_SECRET,
//   //     callbackURL: "http://localhost:4000/authSession/githubSession",
//   //   },
//   //   async (accessToken, refreshToken, profile, done) => {
//   //     try {
//   //       const user = await findUserByEmail(profile._json.email);

//   //       if (user) {
//   //         done(null, user);
//   //       } else {
//   //         log('info', "New Github user created");

//   //         const newCart = await createCart()

//   //         const createdUser = await createUser({
//   //           first_name: profile._json.name,
//   //           last_name: " ",
//   //           email: profile._json.email,
//   //           password: " ", // Default password required by Challenge #5
//   //           role: "user",
//   //           cart_id: newCart[0]._id
//   //         });

//   //         done(null, createdUser);
//   //       }
//   //     } catch (error) {
//   //       return done(error);
//   //     }
//   //   }
//   // )
//   // );

//   // Iniciar sesión
//   passport.serializeUser((user, done) => {
//     if (!user) {
//       done(null, null);
//     }
//     if (Array.isArray(user)) {
//       done(null, user[0]._id);
//     } else {
//       done(null, user._id);
//     }
//   });

//   // Eliminar sesión
//   passport.deserializeUser(async (id, done) => {
//     const user = await findUserById(id);
//     done(null, user);
//   });
// };

// export default initializePassport;


import local from "passport-local";
import passport from "passport";
import mongoose from "mongoose";
import GitHubStrategy from "passport-github2";
import { createUser, findUserByEmail, findUserById } from "../services/userServices.js";
import { createCart } from "../services/cartServices.js";
import { createHash, validatePassword } from "../utils/bcrypt.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {

  passport.use("register",
    new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
      const { first_name, last_name, email } = req.body;

      try {
        const user = await findUserByEmail(username); // username <=> email
        if (user) {
          return done(null, false); // null: no errores - false: no se creo el user
        } else {
          const hashPassword = await createHash(password);
          const newCart = await createCart()

          const createdUser = await createUser({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashPassword,
            role: 1,
            cart_id: newCart._id
          });

          return done(null, createdUser);
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use("login",
    new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        if (username === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
          // ADMIN LOGIN
          const user = {
            _id: new mongoose.Types.ObjectId(),
            first_name: process.env.ADMIN_NAME,
            last_name: " ",
            email: process.env.ADMIN_EMAIL,
            password: " ", // Default password required by Challenge #5
            role: 2,
          };
          return done(null, user);
        }

        // USER LOGIN
        const user = await findUserByEmail(username);

        if (!user) {
          //User not found
          return done(null, false);
        }

        if (await validatePassword(password, user.password)) {
          //const token = generateToken(user);
          return done(null, user);
        }

        // Wrong password
        return done(null, false);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use("github", new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8080/authSession/githubSession",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findUserByEmail(profile._json.email);

        if (user) {
          done(null, user);
        } else {
          log('info', "New Github user created");

          const newCart = await createCart()

          const createdUser = await createUser({
            first_name: profile._json.name,
            last_name: " ",
            email: profile._json.email,
            password: " ", // Default password required by Challenge #5
            role: "user",
            cart_id: newCart[0]._id
          });

          done(null, createdUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
  );

  // Iniciar sesión
  passport.serializeUser((user, done) => {
    if (!user) {
      done(null, null);
    }
    if (Array.isArray(user)) {
      done(null, user[0]._id);
    } else {
      done(null, user._id);
    }
  });

  // Eliminar sesión
  passport.deserializeUser(async (id, done) => {
    const user = await findUserById(id);
    done(null, user);
  });
};

export default initializePassport;
