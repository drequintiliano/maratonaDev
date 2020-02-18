// configurar o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

// configurando o template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    nocache: true 
})

//configurar a apresentação da pagina
server.get("/", function(req, res) {
    
    db.query("select * from donors", function(err, result) {
        if(err) return res.send("erro no banco de dados")
        
        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

server.post("/", function(req, res) {
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "") {
        return res.send("todos os campos são obrigatórios")
    }

    // coloca valores dentro do banco de dados
    const query = `
        insert into donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`
    const values = [name, email, blood]
    
    db.query(query, values, function(err) {
        if(err) return res.send("erro no banco de dados")

        return res.redirect("/")
    })
})

// ligar servidor e permitir acesso na porta 3000
server.listen(3000, function() {
    console.log("servidor iniciado.");
})