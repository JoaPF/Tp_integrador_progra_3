//Controladores de usuario
import userModels from "../models/user.models.js";
import bcrypt from "bcrypt";


export const createAdminUser = async (req, res) => {

    try {
        //Levanto los dato del body
        const { nameUser, emailUser, passUser } = req.body;

        //Convierto la contraseña de texto a hash
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passUser, saltRounds);

        const [rows] = await userModels.insertAdminUser(nameUser, emailUser, hashedPassword);

        res.status(201).json({
            message: `Usuario creado con exito`,
            userId: rows.insertId
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}


