var express = require("express");
var Arouter = express();

Arouter.get("/",(request,response)=>{
    response.send("This is admin Page");
});

Arouter.get("/:ANo",(request, response)=>{
    response.send("You Searched for admin No. "+ request.params.ANo);
});

module.exports = Arouter;