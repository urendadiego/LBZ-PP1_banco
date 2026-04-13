const db = require('../config/db');

exports.login = async (req, res) => {
  const { dni, clave } = req.body;

  if (!dni || !clave) {
    return res.status(400).json({ error: 'DNI y clave son requeridos' });
  }

  try {
    const { rows } = await db.query(
      'SELECT id, nombre, apellido, dni, email, telefono, direccion, fecha_nac FROM Personas WHERE dni = $1 AND clave = $2',
      [dni, clave]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'DNI o clave incorrectos' });
    }

    res.json({ persona: rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
