const isLogin = (req, res, next) => {
    try {
        if (req.session.user_id) {
            next()
        } else {
            res.redirect('/login')
        }
    } catch (err) {
        console.log(err);

    }
}

const isLogout = (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/')
        } else {
            next()
        }
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    isLogin,
    isLogout
}