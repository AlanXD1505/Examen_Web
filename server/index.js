// server/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // Para recibir JSON en POST y PUT

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // tu usuario
  password: '', // tu contraseña
  database: 'registro_estudiantes'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

// --------------------- RUTAS CRUD ---------------------

// Obtener todos los estudiantes
app.get('/estudiante', (req, res) => {
  db.query('SELECT * FROM estudiante', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Crear nuevo estudiante
app.post('/estudiante', (req, res) => {
  const { nombre, apellido, materia, nota1_p, nota2_p, promedio } = req.body;
  const query = 'INSERT INTO estudiante (nombre, apellido, materia, nota1_p, nota2_p, promedio) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [nombre, apellido, materia, nota1_p, nota2_p, promedio], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, nombre, apellido, materia, nota1_p, nota2_p, promedio });
  });
});

// Actualizar estudiante
app.put('/estudiantes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, materia, nota1_p, nota2_p, promedio } = req.body;
  const query = 'UPDATE estudiante SET nombre=?, apellido=?, materia=?, nota1_p=?, nota2_p=?, promedio=? WHERE Id=?';
  db.query(query, [nombre, apellido, materia, nota1_p, nota2_p, promedio, id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Estudiante actualizado correctamente' });
  });
});

// Eliminar estudiante
app.delete('/estudiantes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM estudiante WHERE Id=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Estudiante eliminado correctamente' });
  });
});

// --------------------- INICIAR SERVIDOR ---------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
