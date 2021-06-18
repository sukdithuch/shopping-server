const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3006;

app.use(express.json());
app.use(cors({
    origin: ["*"],
    methods: ["GET", "POST"],
    allowedHeaders:['X-Requested-With', 'content-type'],
    credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    user: "5VWOu5POBi",
    host: "remotemysql.com",
    password: "pRY2hyyQlw",
    database: "5VWOu5POBi",
});

app.get("/api/products", (req, res) => {
    const sqlSelect = "SELECT * FROM products";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
});

app.post("/api/order", (req, res) => {

    const userName = req.body.user.name;
    const userAddress = req.body.user.address;
    const userCity = req.body.user.city;
    const userState = req.body.user.state;
    const userPostalCode = req.body.user.postalCode;
    const userPhoneNumber = req.body.user.phoneNum;

    const sqlInsertUserOrder = "INSERT INTO user_order (name, address, city, state, postalCode, phoneNumber) VALUES (?,?,?,?,?,?)";
    db.query(sqlInsertUserOrder,
        [userName, userAddress, userCity, userState, userPostalCode, userPhoneNumber],
        (err, result) => {
            console.log("user",err);
        });
        


    const sqlSelectUserOrderID = "SELECT id FROM user_order WHERE name = ? ORDER BY id DESC LIMIT 1";
    db.query(sqlSelectUserOrderID, [userName], (err, result) => {

        let value;

        Object.keys(result).forEach(function (key) {
            value = result[key];
        });

        const userID = value.id;
        const ordered = req.body.orderedItems;
        let orderItem = [];
        let valueOrder = [];

        for (let i = 0; i < ordered.length; i++) {

            for (const key in ordered[i]) {
                orderItem.push(ordered[i][key]);
            };
            orderItem.push(userID);
            valueOrder.push(orderItem);
            orderItem = [];
        };

        // console.log("order", order);
        // console.log("orderItem", orderItem);
        // console.log("valueOrder", valueOrder);
        // console.log("ee", value);

        const sqlInsertOrder = "INSERT INTO 5VWOu5POBi.order (name, price, quantity, totalPrice, productsID, user_orderID) VALUES ?";
        db.query(sqlInsertOrder, [valueOrder], (err, result) => {
            console.log("order",err);
        });
    });

});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
