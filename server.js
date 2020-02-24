//CONFI|GURANDO SERVIDOR

const express = require ("express")
const server = express ()

//CONFIGURAR DB

const Pool = require('pg').Pool
const db = new Pool ({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'

})

//CONFIGURANDO TEMPLATE ERNGINE NUNJUCKS

const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, 
})

// CONFIGURAR SERVER PARA APRESENAR ARQUIVOS ESTATICOS

    server.use(express.static('public'))

//HABILITAR BODY DO FORM

server.use(express.urlencoded({ extended: true}))



//CONFIGURAR APRESENTACAO NA PAGINA

server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro no banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })

    
})

server.post("/", function(req, res) {

    //PEGAR DADOS DO FORM

    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    //IMPEDE CAMPO NULL

    if (name == "" || email == "" || blood ==""){
        return res.send("Todos os campos são obrigatórios.")
    }

    //COLOCA VALORES NO DB

    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
    //FLUUXO DE ERRO
    if (err) res.send("erro no banco de dados.")
    //FLUXO IDEAL
    return res.redirect("/")
})
})



//LIGARM O SERVER E PERMITIR PORTA 3000

server.listen(3000, function(){

    console.log("Iniciei o servidor")
})