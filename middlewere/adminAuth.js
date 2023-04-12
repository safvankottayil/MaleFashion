const isAdmin = (req, res, next) => {
    try {
        if (req.session.admin_id) {

            next()
        } else {
            res.redirect('/admin/login')
        }
    } catch (err) {
        console.log(err);

    }
}

const isLogout = (req, res, next) => {
    try {
        if (req.session.admin_id) {
            res.redirect('/admin')
        } else {
            next()
        }
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    isAdmin,
    isLogout
}