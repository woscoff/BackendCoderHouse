import express from 'express'
import nodemailer from 'nodemailer'

const app = express();

let transporter = nodemailer.createTransport({  // Genero la forma de enviar info desde mail(gmail)
    host: 'smtp.gmail.com', //defino que voy a utilizar un servicio de gmail
    port: 465,
    secure: true,
    auth: {
        user: "woscoffsantiago@gmail.com", //mail del que se envia informacion
        pass: "dxpcoyhonmkaxotm",
        authMethod: 'LOGIN'
    }
}) 

app.get('/email', async (req, res)=>{
    await transporter.sendMail({
        from: 'Test Coder woscoffsantiago@gmail.com',
        to: "santi.woscoff@gmail.com",
        subjet: "Saludos, buenas noches",
        html: `
            <div>
            <h2>Hola, esto es una prueba libre de virus</h2>
            </div>
        `,
        attachments: []
    })
    res.send("Email enviado")
})

app.listen(4000, () =>{
    console.log("Server on port 4000");
})