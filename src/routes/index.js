const express = require("express");
const router = express.Router();
const pool = require("../../database");
const customerController = require("../controllers/customerController");
const { isLoggedIn } = require('../lib/auth');
const bcrypt = require('bcryptjs');
const Swal = require ('sweetalert2');

//Page Inicial
router.get("/",  (req, res) => {
  res.render("Index",)
});
//Page Inicio
router.get("/Home", isLoggedIn, (req, res) => {
  const user = req.user;
  const imageUrl = req.query.imageUrl;
  res.locals.hasSeenWelcomeAnimation = req.session.hasSeenWelcomeAnimation;
  req.session.hasSeenWelcomeAnimation = true;
  res.render("Home", {
    title: "Inventario || Home",
    titleMain: "Inicio",
    currentOption: "/Home",
    user: user,
    imageUrl: imageUrl

  });
});
//Page Productos
router.get("/Products", isLoggedIn, async (req, res) => {
  let orderBy = req.query.orderBy || 'id';
  let order = req.query.order || 'asc';
  const sql = `SELECT * FROM products WHERE user_id = ? ORDER BY ${orderBy} ${order}`;
  const products = await pool.query(sql, [req.user.id]);
  const success = req.flash("success");
  const user = req.user;
  const imageUrl = req.query.imageUrl;
  console.log(products);
  res.render("Products", {
    data: products,
    title: "Inventario || Producto",
    titleMain: "Lista De Productos",
    currentOption: "Products",
    success: success.length ? success[0] : null,
    user: user,
    orderBy: orderBy,
    order: order,
    imageUrl: imageUrl
  });
});
//Añadir Productos
router.post("/add", isLoggedIn, async (req, res) => {
  const { producto, categoria, estado, ventas, cantidad, precio, hora } = req.body;
  const data = {
    producto,
    categoria,
    estado,
    ventas,
    cantidad,
    precio,
    hora,
    user_id: req.user.id,
  };
  await pool.query("INSERT INTO products SET ?", [data]);
  req.flash("success", "Producto Agregado Correctamente");
  res.redirect("/Products");
});
//Eliminar Producto
router.get("/delete/:id",isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM products WHERE ID = ?", [id]);
  req.flash('success', 'Producto Eliminado');
  res.redirect("/Products");
});
//Actualizar Y Editar Productos
router.get("/update/:id", isLoggedIn, customerController.edit);
router.post("/update/:id", isLoggedIn, customerController.update);
//Page Perdida de Contraseña
router.get('/forgot-password', (req, res) => {
  const error = req.flash('error');
  res.render('forgot-password', {
    error: error.length ? error[0] : null
  });
});
//Actulizar usuario
router.post('/users/update',isLoggedIn, async (req, res) => {
  const userId = req.user.id;
  const { usuario, 'current-password': currentPassword, newPassword } = req.body;

  console.log("userId:", userId);
  console.log("usuario:", usuario);
  console.log("currentPassword:", currentPassword);
  console.log("newPassword:", newPassword);

  if (!usuario && !newPassword) {
    req.flash('error', 'Debe proporcionar un nombre de usuario o una nueva contraseña');
    res.redirect('/Profile');    return;
  }

  const user = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
  const passwordMatch = await bcrypt.compare(currentPassword, user[0].contraseña);

  if (usuario) {
    console.log("Actualizando nombre de usuario...");
    await pool.query('UPDATE users SET usuario = ? WHERE id = ?', [usuario, userId]);
    console.log("Nombre de usuario actualizado.");
    req.flash('success', 'Nombre de usuario actualizado');
  }

  if (!passwordMatch) {
    req.flash('error', 'Contraseña actual incorrecta');
    res.redirect('/Profile');    return;
  }

  if (newPassword && typeof newPassword === 'string' && newPassword.length > 0) {
    console.log("Actualizando contraseña...");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (newPassword === currentPassword) {
      req.flash('error', 'La nueva contraseña debe ser diferente a la anterior');
      res.redirect('/Profile');
      return;
    }
    try {
      await pool.query('UPDATE users SET contraseña = ? WHERE id = ?', [hashedPassword, userId]);
      req.flash('success', 'Contraseña actualizada');
    } catch (error) {
      console.error(error);
      req.flash('error', 'No se pudo actualizar la contraseña');
    }
  }

  res.redirect('/Profile');
});
//Perdida de Contraseña
router.post('/forgot-password', async function(req, res) {
  const nombre_completo = req.body.nombre_completo;
  const pregunta = req.body.pregunta;
  const respuesta = req.body.respuesta;

  try {
    const query = `SELECT u.id FROM users u INNER JOIN security_questions sq ON u.id = sq.user_id WHERE u.nombreCompleto = '${nombre_completo}' AND sq.question = '${pregunta}' AND sq.answer = '${respuesta}'`;
    const results = await pool.query(query);

    if (results.length === 0) {
      console.log('error de nombre');
      req.flash('error', 'Los datos ingresados no son correctos');
      res.redirect('/forgot-password');
    } else {
      res.render('update-password', { id: results[0].id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Ha ocurrido un error en el servidor');
  }
});
//Actualizar Contraseña
router.post('/update-password/:id', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `UPDATE users SET contraseña = ? WHERE id = ?`;
  await pool.query(query, [hashedPassword, id]);
  res.redirect('/signin');


});
//Page Estadisticas
router.get("/statistics",isLoggedIn, (req, res) => {
  const user = req.user;
  const imageUrl = req.query.imageUrl;
  res.render("statistics", {
    title: "Inventario || Estadisticas",
    titleMain: " Estadisticas",
    currentOption: "statistics",
    user: user,
    imageUrl: imageUrl
  });
});
//Page Vender Productos
router.get("/Sell", isLoggedIn, async (req, res) => {
  const user = req.user;
  const imageUrl = req.query.imageUrl;
  const products = await pool.query('SELECT * FROM products WHERE user_id = ?', [req.user.id]);
  res.render("Sell", {
    title: "Inventario || Vender",
    titleMain: "Vender Producto",
    currentOption: "Sell",
    user:user,
    products,
    imageUrl: imageUrl
  });
});



module.exports = router;
