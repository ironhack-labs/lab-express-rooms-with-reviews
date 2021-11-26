const app       =require("./app")

app.listen(process.env.PORT, () =>{
    console.log(`Escuchando en http://localgost${process.env.PORT}`)
})