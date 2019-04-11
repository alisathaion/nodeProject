const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
var objOrder= require('./order.json');
const c = require('./calculate');
var fs = require('fs');

//Initialize the Express Framework
var app = express();

//set EJS enjine
app.set('view engine', 'ejs');

//Initialization of Body Parser middleware
app.use(bodyParser.urlencoded({extended : false}));

//Middleware built into Express
app.use(express.static('public'));


//data from JSON to index.ejs
app.get('/', function(req, res){
    res.render('index', {
        size : objOrder.sizes,
        crust : objOrder.crust,
        meattopping : objOrder.meattopping,
        nonmeat : objOrder.nonmeats
     });
});


//data from index.ejs to confirm.ejs
app.post('/', (req, res) => {
    //console.log('Received a request ', req.body);


    var price = [];
    for(var i = 0; i < objOrder.sizes.length; i++){
        if(objOrder.sizes[i].size == req.body.size){
            price.push(objOrder.sizes[i].price);
        }
    }
    for(var i = 0; i < objOrder.crust.length; i++){
        if(objOrder.crust[i].type == req.body.crust){
            price.push(objOrder.crust[i].price);
        }
    }
    var topping = req.body.topping;
    topping.forEach(function(element) {
        for(var i = 0; i < objOrder.meattopping.length; i++){
            if(element == objOrder.meattopping[i].items){
                price.push(objOrder.meattopping[i].price);
            }
        }
        for(var i = 0; i < objOrder.nonmeats.length; i++){
            if(element == objOrder.nonmeats[i].items){
                price.push(objOrder.nonmeats[i].price);
            }
        }
    });

    //calculate total price
    let total = c.total(price,req.body.qty);
    //console.log(total);


    res.render('confirmation', {
        fname : req.body.firstname,
        lname : req.body.lastname,
        phone : req.body.phone,
        address : req.body.address,
        details : req.body.size + " Size " + ", " + req.body.crust + " Crust ",
        toppings :req.body.topping,
        quantity : req.body.qty,
        totalCost : total
    });
 

});

app.post('/gettingdata', function(req, res) {
 
res.send("Thank you!!! Your order is on its way... It will take approximately 30 min");

    fs.writeFile("./customerInfo.json",JSON.stringify(req.body),(err)=>{
        if(err){
            console.error(err);
            return;
        }
        console.log("File has been created");
    });
}); 


app.listen(8080, () => {
    console.log("Listening on port 8080");
});
