const TablaModel = require('../models/tablaModel');

const mapaRutas = {
  personas:          'Personas',
  roles:             'Roles',
  roles_x_personas:  'Roles_x_Personas',
  tipos_producto:    'Tipos_Producto',
  estados_producto:  'Estados_Producto',
  productos:         'Productos',
  cuentas_bancarias: 'Cuentas_Bancarias',
  tarjetas_credito:  'Tarjetas_Credito',
};

function resolveTabla(req, res) {
  const nombreTabla = mapaRutas[req.params.tabla];
  if (!nombreTabla) {
    res.status(404).json({ error: `Tabla '${req.params.tabla}' no encontrada` });
    return null;
  }
  return nombreTabla;
}

exports.obtenerTabla = async (req, res) => {
  const t = resolveTabla(req, res);
  if (!t) return;
  try {
    res.json(await TablaModel[t].getAll());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.obtenerPorId = async (req, res) => {
  const t = resolveTabla(req, res);
  if (!t) return;
  try {
    const row = await TablaModel[t].getById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.crear = async (req, res) => {
  const t = resolveTabla(req, res);
  if (!t) return;
  try {
    const row = await TablaModel[t].create(req.body);
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.actualizar = async (req, res) => {
  const t = resolveTabla(req, res);
  if (!t) return;
  try {
    const row = await TablaModel[t].update(req.params.id, req.body);
    if (!row) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.eliminar = async (req, res) => {
  const t = resolveTabla(req, res);
  if (!t) return;
  try {
    const row = await TablaModel[t].delete(req.params.id);
    if (!row) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
