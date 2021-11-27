const home = (req, res) => {   //como no vamos a acceder a la bd no usamos async-await
    res.render("index")
}
module.exports = home