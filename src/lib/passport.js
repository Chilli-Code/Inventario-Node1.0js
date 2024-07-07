const passport = require('passport');
const LocalStrategy = require('passport-local');
const pool = require('../../database');
const helpers = require('../lib/helpers');





passport.use('local.signin', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contraseña',
    passReqToCallback: true
}, async(req, usuario, contraseña, done) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM users WHERE usuario = ?', [usuario]);
    if (rows.length > 0) {
        const user = rows[0];
        const valueContraseña = await helpers.mathPassword(contraseña, user.contraseña)
        if(valueContraseña){
            done(null, user, req.flash('success', 'Bienvenido' + user.usuario));
        }else{
            done(null, false, req.flash('message','Usuario o Contraseña  Incorrectos'));
        }
    }
    else{
        return done(null, false, req.flash('message','Nombre de usuario no existe'));
    }
}));




passport.use('local.signup', new LocalStrategy({
    usernameField: 'usuario',
    passwordField: 'contraseña',
    passReqToCallback: true
}, async (req, usuario, contraseña, done) => {
    const { nombreCompleto, pregunta, respuesta } = req.body;
    const newUser = {
        usuario,
        contraseña,
        nombreCompleto
    }
    const existingUser = await pool.query('SELECT * FROM users WHERE usuario = ?', [newUser.usuario]);
    if(existingUser.length > 0) {
        const passwordMatch = await helpers.mathPassword(contraseña, existingUser[0].contraseña);
        if(passwordMatch){
            const message = 'Este usuario ya existe';
            return done(null, false, req.flash('message', message));
        }
    }

    newUser.contraseña = await helpers.encryptPassword(contraseña);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;

    // guardar la pregunta de seguridad y la respuesta
    const questionResult = await pool.query('INSERT INTO security_questions (user_id, question, answer) VALUES (?, ?, ?)', [newUser.id, pregunta, respuesta]);

    return done(null, newUser);
}));



