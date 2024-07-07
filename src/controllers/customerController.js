const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ginacv10',
  database: 'listproducts'
});

const controller = {};


controller.edit = (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const imageUrl = req.query.imageUrl;

  connection.query('SELECT * FROM products WHERE id = ?', [id], (err, customer) => {
    if (err) throw err;
    res.render('editProduct', {
      data: customer[0],
      title: 'Inventario || Editar Producto',
      titleMain: 'Editar Producto',
      currentOption: 'Products',
      user: user,
    imageUrl: imageUrl
    });
  });
};






controller.update = (req, res) => {
  const id = req.params.id;
  const newCustomer = req.body;
  const imageUrl = req.query.imageUrl;
  connection.query('UPDATE products set ? WHERE id=?', [newCustomer, id], (err, rows) => {
    req.flash('success', 'Articulo Actualizado Correctamente');
    res.redirect('/Products');
  });
};



module.exports = controller;
