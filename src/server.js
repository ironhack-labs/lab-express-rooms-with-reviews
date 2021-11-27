const app = require ('./app')

app.listen(process.env.PORT, ()=>{
    console.log(`Conectado en http://localhost:${process.env.PORT}`)
})