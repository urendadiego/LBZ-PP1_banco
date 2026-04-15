const express = require('express');
const cors = require('cors');
const app = express();
const personaController = require('./controllers/personaController');
const tablaController = require('./controllers/tablaController');
const authController = require('./controllers/authController');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Auth
app.post('/api/login', authController.login);
app.get('/login', (req, res) => res.sendFile('login.html', { root: 'public' }));

// Endpoints con joins
app.get('/api/personas', personaController.obtenerPersonas);
app.get('/api/personas/:id/roles', personaController.obtenerRoles);
app.get('/api/personas/:id/productos', personaController.obtenerProductos);
app.post('/api/personas', personaController.crearPersona);
app.delete('/api/personas/:id', personaController.eliminarPersona);

// Admin panel
app.get('/admin', (req, res) => res.sendFile('admin.html', { root: 'public' }));

// Endpoints sin joins (tablas crudas) — CRUD genérico
app.get('/api/tablas/:tabla',      tablaController.obtenerTabla);
app.get('/api/tablas/:tabla/:id',  tablaController.obtenerPorId);
app.post('/api/tablas/:tabla',     tablaController.crear);
app.put('/api/tablas/:tabla/:id',  tablaController.actualizar);
app.delete('/api/tablas/:tabla/:id', tablaController.eliminar);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));