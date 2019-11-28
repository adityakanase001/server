var mysql = require("mysql");
var express = require("express");
var srouter = express();
var Joi = require("joi");
var config = require("config");

var connection = mysql.createConnection({
    host : config.get("host"),
    database : config.get("database"),
    user : config.get("user"),
    password : config.get("password")
});

connection.connect();
srouter.use(express.json());


srouter.get("/",(request, response)=>{
    var queryText = "select * from Staff";
    connection.query(queryText,(err, result)=>{
        response.header("Content-type","application/json");
        if(err == null )
        {
            console.log("selecrt done ... ");
            response.send(JSON.stringify(result));
        }
        else{
            console.log(err);
            response.send(JSON.stringify(err));
        }
    });
});

srouter.get("/:No",(request, response)=>{

    var No = request.params.No;
    console.log(`you are searching for ${No}`);
    
    var queryText = `select * from Staff where empId = ${No}`;
    connection.query(queryText,(err, result)=>{
        response.header("Content-type","application/json");
        if(err == null )
        {
            console.log("select with where clause done ... ");
            response.send(JSON.stringify(result));
        }
        else{
            console.log(err);
            response.send(JSON.stringify(err));
        }
    });
});

srouter.post("/",(request, response)=>{

    var validatioResult = Validate(request);
    if(validatioResult.error == null)
    {
        var empId = request.body.empId;
        var name = request.body.name;
        var salary = request.body.salary;
        var noOfSessions = request.body.noOfSessions;
        var Role = request.body.Role;
        
        var queryText = `insert into Staff values(${empId},'${name}',${salary},${noOfSessions},'${Role}')`;
        connection.query(queryText,(err, result)=>{
            response.header("Content-type","application/json");
            if(err == null )
            {
                console.log("Insert done ... ");
                response.send(JSON.stringify(result));
            }
            else{
                console.log(err);
                response.send(JSON.stringify(err));
            }
        });
    }
    else{
        response.send(JSON.stringify(validatioResult.error));
    }
});

function Validate(request)
{
    var validationSchema = {
        empId : Joi.number().required(),
        name : Joi.string().required(),
        salary : Joi.number().required(),
        noOfSessions : Joi.number().required(),
        Role : Joi.string().required()
    };
    return Joi.validate(request.body , validationSchema);
}

srouter.put("/:No",(request, response)=>{

    var empId = request.params.No;
    var salary = request.body.salary;
    var noOfSessions = request.body.noOfSessions;
    
    var queryText = `update Staff set salary = ${salary}, noOfSessions=${noOfSessions} where empId =${empId}`;
    connection.query(queryText,(err, result)=>{
        response.header("Content-type","application/json");
        if(err == null )
        {
            console.log("Update done ... ");
            response.send(JSON.stringify(result));
        }
        else{
            console.log(err);
            response.send(JSON.stringify(err));
        }
    });
});

srouter.delete("/:No",(request, response)=>{
    var No = request.params.No;
    var queryText = `delete from Staff where empId = ${No}`;
    connection.query(queryText,(err, result)=>{
        if(err==null)
            {
                response.send(JSON.stringify(result));
            }
            else{
                response.send(JSON.stringify(err));
            }
    });
});

module.exports = srouter;