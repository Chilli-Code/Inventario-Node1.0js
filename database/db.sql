--Creando base de datos
CREATE DATABASE listproducts;


USE listproducts;

CREATE TABLE products (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    producto VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    estado VARCHAR(40) NOT NULL,
    ventas VARCHAR(255),
    cantidad VARCHAR(255),
    precio VARCHAR(255)
);

SHOW TABLES;
DESCRIBE products;



CREATE DATABASE database_Links
USE database_Links;

CREATE TABLE users (
    id INT(11) NOT NULL,
    usuario VARCHAR(20) NOT NULL,
    contraseña VARCHAR(100) NOT NULL,
    nombreCompleto VARCHAR(100) NOT NULL
);





ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

    DESCRIBE users;


CREATE TABLE carrito (
  id INT NOT NULL AUTO_INCREMENT,
  productoVenta VARCHAR(255) NOT NULL,
  precioVenta DECIMAL(10, 2) NOT NULL,
  cantidadVenta INT NOT NULL,
  medio_pago VARCHAR(255) NOT NULL,
  nombre_cliente VARCHAR(255),
  hora_venta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  codigo VARCHAR(255) NOT NULL,
  vendedor VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
