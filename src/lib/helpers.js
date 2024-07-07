const helpers = {};
const bcrypt = require('bcryptjs');


helpers.encryptPassword = async (contraseña) =>{
   const salt = await bcrypt.genSalt(10);
   const hash = await  bcrypt.hash(contraseña, salt);
   return hash;
};

helpers.mathPassword = async (contraseña, savePassword) =>{
    try {
        return await bcrypt.compare(contraseña, savePassword)
    }catch(e){
        console.log(e);
    }
};

module.exports = helpers;