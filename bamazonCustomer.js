//create data connection
var mysql = require("mysql");
var inquirer = require("inquirer");

// create connection object but using mysql package and function
// pass in connection credentials
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    user: "root",

    password: "root",
    database: "bamazon_DB",
});

//setting the scene above 
//now connect to database-open connection
//connection -name of var from above
//.method is .connect which will execute a connection using credentials 
//callback function to know what to do after connects
connection.connect(function(err) {
    if (err) throw err;
    //console.log("Connected " + connection.threadId);
    //thread Id is a property of our connection
    //connection.end();
    //close connection

    //start function
    start();


});
//start function 
//prompt user if they would like to purchase a product.
function start() {
    inquirer.prompt({
            name: "purchaseProduct",
            type: "list", //or input?
            message: "Would you like to purchase a product today?",
            choices: ["YES", "NO"]
        })
        //if yes then go to next step
        //if no then console log a message
        .then(function(answer) {
            //based on their answer, either display products or console log another message.
            if (answer.purchaseProduct.toUpperCase() === "YES") {

                displayProducts();
            } else {
                console.log("Please visit our site again. Have a nice day")
            }
        });
}
//display products for sale if user chooses yes
function displayProducts() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        //once you have the items, prompt the user for which they'd like to bid on


        inquirer.prompt([{
                name: "item",
                type: "input",
                message: "What items would you like to purchase toady?",
                //validate property to make sure the user's response is the correct data type
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }

            }])
            //ask user how many items they would like to purchase
        inquirer.prompt([{
            name: "item",
            type: "input",
            message: "How many would you like to purchase?",
            //validate property to make sure the user's response is the correct data type
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }

        }])
    })
};