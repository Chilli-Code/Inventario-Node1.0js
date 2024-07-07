// const multer = require('multer');
// const path = require('path');
// const express = require("express");
// const router = express.Router();

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/profile_pictures')
//     },
//     filename: function (req, file, cb) {
//       cb(null, req.user.id + path.extname(file.originalname))
//     }
//   });


  
//   const upload = multer({ storage });

// router.post('/Profile', upload.single('picture'), function(req, res) {
//   // Actualizar la URL de la imagen en la base de datos
//   const pictureUrl = '/profile_pictures/' + req.file.filename;
//   const userId = req.user.id;
//   const sql = "UPDATE users SET profile_picture = ? WHERE id = ?";
//   connection.query(sql, [pictureUrl, userId], function(error, results, fields) {
//     if (error) throw error;
//     // Redirigir al usuario de vuelta a su página de perfil
//     res.redirect('/Profile');
//   });
// });

// module.exports = router;

const cloudinary = require('cloudinary').v2;
const { Router } = require("express");
const router = Router();
const multer = require('multer');
const pool = require("../../database");
const { isLoggedIn } = require('../lib/auth');
const upload = multer({ dest: 'uploads/' });

//Cloudinary
cloudinary.config({
    cloud_name: "dvszcbopy",
    api_key: "899377394997181",
    api_secret: "8fIr4wS6QNcu54alsJe2swcFRgs"
});
// router.get('/Profile', isLoggedIn, (req, res) => {
//     const user = req.user;
//     const imageUrl = req.query.imageUrl; // get the imageUrl from the query parameter, if any
//     res.render('Profile', {
//     title: 'Inventario || Perfil',
//     titleMain: 'Ajustes',
//     currentOption: 'Home',
//     user: user,
//       imageUrl: imageUrl // pass the imageUrl to the view
//     });
// });

router.get("/Profile", isLoggedIn, async (req, res) => {
  const imageUrl = req.query.imageUrl;
  const user = req.user;
  const userId = user.id;
  try {
    const result = await pool.query(
      "SELECT profile_picture FROM users WHERE id = ?",
      [userId]
    );
    const profilePicture = result[0].profile_picture;
    const messages = req.flash();
    res.render("Profile", {
      title: "Inventario || Perfil",
      titleMain: "Ajustes",
      currentOption: "Home",
      user: user,
      profilePicture: profilePicture,
      imageUrl: imageUrl,
      successMessage: messages.success,
      errorMessage: messages.error
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve user data",
      error
    });
  }
});

//Actualizar Imagen De Perfil
router.post('/uploadP', upload.single('picture'), async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);

      const imageUrl = result.secure_url;
      const userId = req.user.id;
  
      const updateQuery = 'UPDATE users SET profile_picture = ? WHERE id = ?';
      await pool.query(updateQuery, [imageUrl, userId]);

      res.redirect('/Profile?imageUrl=' + imageUrl);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Failed to upload image',
        error
      });
    }
  });
  

module.exports = router;
