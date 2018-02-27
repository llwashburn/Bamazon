var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
// belongs to mysql module that is required at the top of the page
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "greatBay_DB"
});

// connect to the mysql server and sql database
//method on new connection object - acts like an instructor
//callback function below
//.connect comes from createConnection mysql from above
connection.connect(function(err) {
    //handle any errors that may occur
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// function which prompts the user for what action they should take

function start() {
    inquirer
        .prompt({
            name: "postOrBid",
            type: "rawlist",
            message: "Would you like to [POST] an auction or [BID] on an auction?",
            choices: ["POST", "BID"]
        })
        .then(function(answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.postOrBid.toUpperCase() === "POST") {
                postAuction();
            } else {
                bidAuction();
            }
        });
}

// function to handle posting new items up for auction
function postAuction() {
    // prompt for info about the item being put up for auction
    //property names have to match value
    //item has to include? watch video and take notes
    inquirer
        .prompt([{
                name: "item",
                type: "input",
                message: "What is the item you would like to submit?"
            },
            {
                name: "category",
                type: "input",
                message: "What category would you like to place your auction in?"
            },
            {
                name: "startingBid",
                type: "input",
                message: "What would you like your starting bid to be?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO auctions SET ?", {
                    item_name: answer.item,
                    category: answer.category,
                    starting_bid: answer.startingBid,
                    highest_bid: answer.startingBid
                },
                function(err) {
                    if (err) throw err;
                    console.log("Your auction was created successfully!");
                    // re-prompt the user for if they want to bid or post
                    start();
                    //using this function again will start back again to post and run again- 
                    //watch video and type notes 
                }
            );
        });
}

function bidAuction() {
    // query the database for all items being auctioned
    //user needs to know what they are bidding on so we are creating a list for them to choose? watch video to make notes 
    connection.query("SELECT * FROM auctions", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
        //sort through data using a loop
        //run a function
        //create an array 
        //loop through ? 
        //push items names into empty array
        //choices becomes new array that we just created
            .prompt([{
                    name: "choice",
                    type: "rawlist",
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].item_name);
                        }
                        return choiceArray;
                    },
                    message: "What auction would you like to place a bid in?"
                },
                {
                    name: "bid",
                    type: "input",
                    message: "How much would you like to bid?"
                }
            ])
            .then(function(answer) {
                // get the information of the chosen item
                var chosenItem;
                //loop through al results to see if data matches the Array
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name === answer.choice) {
                        //need all the information about that item  
                        chosenItem = results[i];
                    }
                }

                // determine if chosen item was less than the bid -  bid was high enough
                //comparing to the bid they put in
                //if true then highest bid is less than what they bid - change the highest bid in database - creating a record

                if (chosenItem.highest_bid < parseInt(answer.bid)) {
                    // bid was high enough, so update db, let the user know, and start over
                    connection.query(
                        //these ? are in a specific place values 
                        "UPDATE auctions SET ? WHERE ?", [{
                                highest_bid: answer.bid
                            },
                            {
                                id: chosenItem.id
                            }
                        ],
                        function(error) {
                            if (error) throw err;
                            console.log("Bid placed successfully!");
                            start();
                            //restart the application
                        }
                    );
                } else {
                    // bid wasn't high enough, so apologize and start over
                    console.log("Your bid was too low. Try again...");
                    start();
                }
            });
    });
}