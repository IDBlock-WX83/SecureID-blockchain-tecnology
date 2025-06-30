const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getBlockNumber } = require('./config/blockchain');
 // Rutas de inspección
const residenteRoutes = require('./DIGITAL/residenteRoutes');  // Rutas de residentes
// Crear la aplicación Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Para poder procesar JSON en las solicitudes


// Rutas

app.use('/api/residentes', residenteRoutes);

// Ruta para obtener el número de bloque
app.get('/api/blocknumber', async (req, res) => {
    try {
        const blockNumber = await getBlockNumber();  // Llamada a la función para obtener el número de bloque
        res.status(200).json({ blockNumber });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el número de bloque', error: error.message });
    }
});


// Iniciar el servidor
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('¡API de SecureID desplegada y funcionando!');
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Swagger UI disponible en http://localhost:5000/api-docs');
});
