module.exports = {
    isLoggedIn(req, res, next) {
    console.log("isLoggedIn called");
    if (req.isAuthenticated()) {
        console.log("Uuario Autenticado");
        return next();
    }
    console.log("Usuario No Autenticado");
    res.redirect("/signin");
},
isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/Home");
},
};
