function displayProducts() {
    //query the database for all the items in the bamazon database
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        //once you have the items, prompt the user for which they'd like to bid on
        // connection.connect();
        //connect to database to get information and put in a table
        //create the table
        // var table = productTable
        //item ID, product name, price
        //for loop - loop through the items and display the data found in the loop in table format
        //check to see if the quanitity is available  
        // for (var i = 0; i < results.length; i++) {
        //     //productTable.push(results[i].item_id, product_name, department_name, price, stock_quantity);
        //     console.log(results[i])
        // }
        inquirer.prompt([{
            name: "choice",
            type: "list",
            //choices: inquirer list all options
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(
                        "Product: " + results[i].product_name + " | " +
                        "ID: " + results[i].item_id.toString() + " | " +
                        "Price: " + results[i].price.toString()
                    );
                }
                return choiceArray;
            },
            message: "What item would you like to purchase?"
        }])
    });
};