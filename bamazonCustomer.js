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


// connect to database-open connection
//connection -name of var from above
//.method is .connect which will execute a connection using credentials 
//callback function to know what to do after connects
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected " + connection.threadId);
    // thread Id is a property of our connection
    // connection.end();
    // close connection

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
            //use validate with inquirer module so that the user input is what you expect
            //validate: function(value){
            //if (isNan(value) === false) {
            //return true;
            //         }
            //         return false:
            //     }
    })

    //if yes then go to next step
    //if no then console log a message
    .then(function(answer) {
        //based on their answer, either display products or console log another message.
        //return the user's response to UPPERCASE so that it matches conditional
        if (answer.purchaseProduct.toUpperCase() === "YES") {
            displayProducts();
        } else {
            console.log("Please visit our site again. Have a nice day")
            connection.end();
            //close connection - end of conversation
        }
    });
}

//display products for sale if user chooses yes
function displayProducts() {
    //query the database for all the items in the bamazon database
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        //once you have the items, prompt the user for which they'd like to bid on
        connection.connect();
        //connect to database to get information and put in a table
        //create the table
        var table = productTable
            //item ID, product name, price
            //for loop - loop through the items and display the data found in the loop in table format
            //check to see if the quanitity is available  
        for (var i = 0; i < results.length; i++) {
            //productTable.push(results[i].item_id, product_name, department_name, price, stock_quantity);
            console.log(results)
            console.log("item_id", "product_name", "department_name ", "price", "stock_quantity ")


            .prompt([{
                name: "choice",
                type: "list",
                //choices: inquirer list all options
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].item_id, product_name, department_name, price, stock_quantity);
                    }
                    return choiceArray;
                },
                message: "What item would you like to purchase?"
            }])
        }
    });



    //             .then(function(answer) {
    //                     var chosenItem;
    //                     for (var i = 0; i < results.length; i++) {
    //                         if (results[i].product_name === answer.choice) {
    //                             chosenItem = results[i];
    //                         }
    //                     }

    //                     if (chosenItem.stock_quantity < parseInt(answer.stock_quantity)) {
    //                         connection.query(
    //                             "UPDATE ? SET ? WHERE ?",
    //                         ]
    //                     )
    //                 }

    //                 //connection.connect(); 

    //                 //connect to database to get information and put in a table

    //                 //create the table
    //                 var table = productTable
    //                     //item ID, product name, price

    //                 //for loop - loop through the items and display the data found in the loop in table format
    //                 //check to see if the quanitity is available 
    //                 //if not console.log message stating that this item is not avaiable in this quanitity. 

    //                 //else if the store has enough of the product then the customer order can be filled.
    //                 //console.log 

    //                 //create a function to buy/purchase

    //                 //call the function
    //                 //update mySQl database to reflect the remaining quantity. 
    //                 //once order goes through show the customer the total cost of their purchase.











    //                 inquirer.prompt([{
    //                     name: "item",
    //                     type: "input",
    //                     message: "What items would you like to purchase today? Please enter product ID number.",
    //                     //validate property to make sure the user's response is the correct data type
    //                     validate: function(value) {
    //                         if (isNaN(value) === false) {
    //                             return true;
    //                         }
    //                         return false;
    //                     }

    //                 }])
    //                 //ask user how many items they would like to purchase
    //                 inquirer.prompt([{
    //                     name: "item",
    //                     type: "input",
    //                     message: "How many items would you like to purchase?",
    //                     //validate property to make sure the user's response is the correct data type
    //                     validate: function(value) {
    //                         if (isNaN(value) === false) {
    //                             return true;
    //                         }
    //                         return false;
    //                     }

    //                 }])
    //             })
    //     };
    // }
    //