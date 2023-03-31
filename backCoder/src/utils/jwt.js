import jwt from "jsonwebtoken"

export const generateToken = (user) =>{
    const token = jwt.sign({user}, process.env.SIGNED_COOKIE, {expiresIn: '24h'})
    return token
}

export const authToken = (res, req, next) =>{
    //consultar en el header el token
    const authHeader = req.headers.authorization

    //token no existente o expirado
    if(!authHeader){
        return res.status(401).send({error: "usuario no autenticado"})
    }
    //Sacar la palabra Bearer del token
    const token = authHeader.split('')[1]

    //validar le token
    jwt.sign(token, process.env.SIGNED_COOKIE, (error, credentials)=>{
        if(error){
            return res.status(403).send({error: "usuario no autorizado"})
        }
        //token existente y valido
        req.user = credentials.user
        next()
    })
}