const express = require('express');
const router = express.Router();
const residenteController = require('./residenteController');

// Registrar
router.post('/registrar', async (req, res) => {
    try {
        const txHash = await residenteController.registrarResidente(req.body);
        res.status(200).json({ message: 'Residente registrado correctamente', txHash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos
router.get('/', async (req, res) => {
    try {
        const residentes = await residenteController.obtenerTodosResidentes();
        res.status(200).json({ residentes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener por ID
router.get('/:id', async (req, res) => {
    try {
        const residente = await residenteController.obtenerResidenteById(Number(req.params.id));
        res.status(200).json({ residente });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Login por idDigital
router.post('/login', async (req, res) => {
    try {
        const { idDigital } = req.body;
        const residente = await residenteController.loginByIdDigital(idDigital);
        res.status(200).json({ residente });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;
