// CONTROLADORES DE VENTAS

import salesModels from "../models/sales.models.js";
import SalesModels from "../models/sales.models.js";
import ExcelJS from "exceljs";

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

export const descargarVentasExcel = async (req, res) => {
    try {
        // Ventas de la BBDD
        const [rows] = await SalesModels.selectAllSales();

        // Creo el libro y la hoja
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Ventas");

        // Defino las columnas
        sheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Usuario", key: "nombre_usuario", width: 20 },
            { header: "Fecha", key: "fecha", width: 20 },
            { header: "Total", key: "precio_total", width: 15 },
        ];

        // Agrego las filas
        rows.forEach(venta => sheet.addRow(venta));

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=ventas.xlsx");

        await workbook.xlsx.write(res);
        res.end();
        

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error generando el Excel" });
    }
}