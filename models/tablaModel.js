const db = require('../config/db');

const tablas = [
  'Personas', 'Roles', 'Roles_x_Personas', 'Tipos_Producto',
  'Estados_Producto', 'Productos', 'Cuentas_Bancarias', 'Tarjetas_Credito',
];

const pkMap = {
  Personas:          'id',
  Roles:             'id_rol',
  Roles_x_Personas:  null,            // clave compuesta
  Tipos_Producto:    'id_tipo_producto',
  Estados_Producto:  'id_estado_producto',
  Productos:         'id_producto',
  Cuentas_Bancarias: 'id_cuenta',
  Tarjetas_Credito:  'id_tarjeta',
};

const TablaModel = {};

tablas.forEach((tabla) => {
  const pk = pkMap[tabla];

  TablaModel[tabla] = {
    pk,

    getAll: async () => {
      const order = pk ? `ORDER BY ${pk}` : '';
      const { rows } = await db.query(`SELECT * FROM ${tabla} ${order}`);
      return rows;
    },

    getById: async (id) => {
      if (!pk) return null;
      const { rows } = await db.query(`SELECT * FROM ${tabla} WHERE ${pk} = $1`, [id]);
      return rows[0] || null;
    },

    create: async (data) => {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const cols   = keys.join(', ');
      const params = keys.map((_, i) => `$${i + 1}`).join(', ');
      const { rows } = await db.query(
        `INSERT INTO ${tabla} (${cols}) VALUES (${params}) RETURNING *`,
        values
      );
      return rows[0];
    },

    update: async (id, data) => {
      if (!pk) return null;
      const keys   = Object.keys(data);
      const values = Object.values(data);
      const sets   = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
      values.push(id);
      const { rows } = await db.query(
        `UPDATE ${tabla} SET ${sets} WHERE ${pk} = $${values.length} RETURNING *`,
        values
      );
      return rows[0] || null;
    },

    delete: async (id) => {
      if (pk) {
        const { rows } = await db.query(
          `DELETE FROM ${tabla} WHERE ${pk} = $1 RETURNING *`,
          [id]
        );
        return rows[0] || null;
      }
      // Roles_x_Personas: id viene como "idPersona_idRol"
      if (tabla === 'Roles_x_Personas') {
        const [id_persona, id_rol] = id.split('_');
        const { rows } = await db.query(
          `DELETE FROM Roles_x_Personas WHERE id_persona = $1 AND id_rol = $2 RETURNING *`,
          [id_persona, id_rol]
        );
        return rows[0] || null;
      }
      return null;
    },
  };
});

module.exports = TablaModel;
