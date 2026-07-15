// CONTROLADORES DE VENTAS

import SalesModels from "../models/sales.models.js";

export const createSale = async (req, res) => {
    try {

        const { usuario, fecha, precioTotal } = req.body;

        const [rows] = await SalesModels.insertNewSale(usuario, fecha, precioTotal);

        res.status(201).json({
            message: "Venta creada con exito"
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Error interno del servidor",
        });
    }
}