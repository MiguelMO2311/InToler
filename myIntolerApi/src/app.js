const express = require ('express')
const cors = require ('cors')
const mysql = require('mysql2')
const cardRouters = require ('./routers/card.router')
const userRouters = require ('./routers/user.router')
const errorHandling = require('./error/errorHandling')

const app = express();
app.use(express.json());

app.set('port', process.env.PORT || 3000)

app.use(cors());
app.use(express.urlencoded({extended: false }));
app.use(express.json());
app.use(cardRouters);
app.use(userRouters);
app.use(function(req, res, next)
{
    res.status(404).json({  error:true,
                            codice: 404,
                             message:'endPoint doesn´t found'})
})

app.use(errorHandling);

module.exports = app;