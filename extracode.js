                if (chosenItem.stock_quantity < parseInt(answer.stock_quantity)) {
                    connection.query(
                        "UPDATE products SET ? WHERE ?", [{
                            id_name: answer.productName,
                            stock_quantity: answer.stockQuantity
                        }],
                        function(error) {
                            if (error) throw err;
                            console.log("Stock updated successfully!");
                            start();
                            //restart application
                        }
                    );

                } else {
                    console.log("stock was not updated-what happened?");
                    // start();
                }
                //purchased complete function 
                //take that response 
                //run loop through data to find stock_quantity
                //compare response quantity to stock quantity
                //if equal console log the product has been added to your order
                //else console.log this product is not available
                //restart - start();
                // {take the response amount and subtract from the current inventory}

                //update SQL stock function
                //function updateStock
                //connect to database
                //INSERT into table - decrease stock by response
                //once decreased stop function
                //restart - start();

                // function updateInventory() {
                //     //update stock quantity in database 
                //     connection.query(
                //             "UPDATE products SET ? WHERE ?"




                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false
                }