const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
var objOrder= require('./order.json');
const c = require('./calculate');
var fs = require('fs');
const validatePhoneNumber = require('validate-phone-number-node-js');

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
        nonmeat : objOrder.nonmeats,
        firstname : "",
        lastname : "",
        phone : "",
        address : "",
        result : true
     });
});


//data from index.ejs to confirm.ejs
app.post('/', function(req, res){
    console.log(req.body);
    //validation check
    const validPhone = validatePhoneNumber.validate(req.body.phone);
    if(!req.body.firstname || !req.body.lastname || !req.body.phone || !req.body.address || !validPhone){

            res.render('index', {
                size : objOrder.sizes,
                crust : objOrder.crust,
                meattopping : objOrder.meattopping,
                nonmeat : objOrder.nonmeats,
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                phone : req.body.phone,
                address : req.body.address,
                result : validPhone
            });
    }
    

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

//Send to another page
app.post('/gettingdata', function(req, res) {
    res.send("Thank you!!! Your order is on its way... It will take approximately 30 min");
    //read file
    var data = fs.readFileSync("./customerInfo.json");
    //append file
    fs.appendFileSync("./customerInfo.json", JSON.stringify(req.body));
    //write file
    fs.writeFile("./customerInfo.json",JSON.stringify(req.body),(err)=>{
        if(err){
            console.error(err);
            return;
        }
        console.log("File has been created");
    });
}); 

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//localhost:3000
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
