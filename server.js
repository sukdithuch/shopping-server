const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3006;

app.use(express.json());
app.use(cors());


app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    user: "5VWOu5POBi",
    host: "remotemysql.com",
    password: "pRY2hyyQlw",
    database: "5VWOu5POBi",
});

app.get("/api/version", (req, res) => {
    res.json({ "version": "1.0.01" });
});

app.get("/api/products", (req, res) => {
    const sqlSelect = "SELECT * FROM products";
    db.query(sqlSelect, (err, result) => {
        res.json(result);
    });
});

app.post("/api/user/order", (req, res) => {

    const userName = req.body.user.name;
    const userAddress = req.body.user.address;
    const userCity = req.body.user.city;
    const userState = req.body.user.state;
    const userPostalCode = req.body.user.postalCode;
    const userPhoneNumber = req.body.user.phoneNum;

    const sqlInsertUserOrder = "INSERT INTO user_order (name, address, city, state, postalCode, phoneNumber) VALUES (?,?,?,?,?,?)";

    console.log("Start");
    db.query(sqlInsertUserOrder,
        [userName, userAddress, userCity, userState, userPostalCode, userPhoneNumber],
        (err, result) => {

            console.log("user", err);
            console.log("userresult", result);
            console.log("result.insertId:", result.insertId);

          
            const userID = result.insertId;
            const ordered = req.body.orderedItems;
            let valueOrderItems = [];

            for (let i = 0; i < ordered.length; i++) {
                let orderItems = [];
                orderItems[0] = ordered[i].title;
                orderItems[1] = ordered[i].price;
                orderItems[2] = ordered[i].quantity;
                orderItems[3] = ordered[i].totalPrice;
                orderItems[4] = ordered[i].id;
                orderItems[5] = userID;
              
                valueOrderItems.push(orderItems);
            };

            const sqlInsertOrder = "INSERT INTO `order`(`name`, `price`, `quantity`, `totalPrice`, `productsID`, `user_orderID`) VALUES ?";
            db.query(sqlInsertOrder, [valueOrderItems], (err, innerResult) => {
                console.log("order", innerResult);
                res.json(
                    {
                        "orderId": userID,
                        "innerResult": innerResult,
                        "err": err
                    }
                );
            });


        });



});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
