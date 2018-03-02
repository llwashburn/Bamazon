//create data connection
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

// create connection object but using mysql package and function
// pass in connection credentials
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_DB",
});


// connect to database-open connection \ method is .connect which will execute a connection using credentials 
//callback function to know what to do after connects
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected " + connection.threadId);
    // thread Id is a property of our connection
    // connection.end();close connection
    start(); //start function

});
//start function 
//prompt user if they would like to purchase a product.
function start() {
    inquirer.prompt({
            name: "purchaseProduct",
            type: "list", //or input?
            message: "Welcome to Bamazon! Would you like to purchase a product today?",
            choices: ["YES", "NO"]

        })
        //if yes then go to next step
        .then(function(answer) {
            //based on their answer, either display products or console log another message.
            //return the user's response to UPPERCASE so that it matches conditional
            if (answer.purchaseProduct.toUpperCase() === "YES") {
                displayProducts();
            } else {
                console.log("Please visit our site again. Have a nice day")
                    //if no then console log a message
                connection.end();
                //close connection - end of conversation
            }
        });
}

function displayProducts() {
    //query the database for all the items in the bamazon database
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        //prompt user to as what item they would like to purchase from the database
        //BEFORE INQUIRER DISPLAY TABLE OF PRODUCTS
        console.table(results)
        inquirer.prompt([{
                name: "choice",
                type: "list",
                message: "What item would you like to purchase? Use the arrow key to make your selection.",
                //choices: inquirer list all options
                //INSTEAD OF THESE STRINGS, DISPLAY JUST results[i].item_id
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_id.toString());
                    };
                    return choiceArray; //return all the user choices
                    //how to create the quantity function to run next? 
                }

            }])
            .then(function(response) {
                productQuantity(results, response.choice);
            })
    })
};

//results = sql query results, and choice = user chosen item_id
function productQuantity(results, choice) {
    //make connection again - look at data and then ask user questions

    inquirer.prompt([{
            name: "quantity",
            //prompt user to enter a number for quantity
            type: "input",
            //ask user how many products they would like to purchase. 
            message: "How many products would you like to purchase?",
        }])
        .then(function(response) {
            //create variable to hold the results?
            var product;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(choice)) {
                    product = results[i];
                }
            }
            //console.log(product)
            //determine if data results match user quantity
            if (product.stock_quantity >= parseInt(response.quantity)) //if this is true then change quantity in database
                console.log("This product has been added to your order"),
                updateInventory(choice, parseInt(response.quantity));
            else {
                console.log("This product is not available");
                //restart?
                start();
            }
        })

}

function updateInventory(choice, quantity) {
    console.log('update here')
        //query the database for the stock_quantity  - use select or update? 
        //UPDATE database to reduce stock_quantity for the given item_id (choice)
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [quantity, choice], function(err, data) {
            if (err) throw err;
            console.log(data.affectedRows + ' item(s) successfully updated!');
            start();
        })
        // if (err) throw err;
}
//then compare the response to the current inventory
//create a variable to store new inventory? 
// var updatedQuantity = results[i].stock_quantity
//     //somehow subtract the response from the current inventory
// updatedQuantity - choice
//     //update the mysql database 
// connection.query("UPDATE stock_quantity FROM products WHERE ?")
// if (err) throw err;

// // do I need to set
// [{
//     stock_quantity: results.stock_quantity,
// }]

// connection.query("UPDATE stock_quantity FROM products WHERE ?")