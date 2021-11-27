const app = require("./app")

app.listen(process.env.PORT, () => {
    console.log(`Servidor conectado en puerto http://localhost:${process.env.PORT}`)
})