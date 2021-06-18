const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3006;

// var whitelist=['https://shopping-s.herokuapp.com', 'https://shopping-server-sql.herokuapp.com']; //white list consumers
// var corsOptions={
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !==-1) {
//       callback(null, true);
//     } else {
//       callback(null, false);
//     }
//   },
//   methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
// };

app.use(express.json());
app.use(cors(

    {
    origin: ["https://shopping-s.herokuapp.com"],
    methods: ["GET", "POST"],
    allowedHeaders:['X-Requested-With', 'content-type'],
    credentials: true,
}

));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,recording-session");
//     next();
// });


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

app.post("/api/user-order", (req, res) => {

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
            console.log("user", err);
        });



    // const sqlSelectUserOrderID = "SELECT id FROM user_order WHERE name = ? ORDER BY id DESC LIMIT 1";
    // db.query(sqlSelectUserOrderID, [userName], (err, result) => {

    //     let value;

    //     Object.keys(result).forEach(function (key) {
    //         value = result[key];
    //     });

    //     const userID = value.id;
    //     const ordered = req.body.orderedItems;
    //     let orderItem = [];
    //     let valueOrder = [];

    //     for (let i = 0; i < ordered.length; i++) {

    //         for (const key in ordered[i]) {
    //             orderItem.push(ordered[i][key]);
    //         };
    //         orderItem.push(userID);
    //         valueOrder.push(orderItem);
    //         orderItem = [];
    //     };

    //     // console.log("order", order);
    //     // console.log("orderItem", orderItem);
    //     // console.log("valueOrder", valueOrder);
    //     // console.log("ee", value);

    //     const sqlInsertOrder = "INSERT INTO `order`(`name`, `price`, `quantity`, `totalPrice`, `productsID`, `user_orderID`) VALUES ?";
    //     db.query(sqlInsertOrder, [valueOrder], (err, result) => {
    //         console.log("order",err);
    //     });
});

app.post("/api/order-items", (req, res) => {
    const userName = req.body.user.name;

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

        const sqlInsertOrder = "INSERT INTO `order`(`name`, `price`, `quantity`, `totalPrice`, `productsID`, `user_orderID`) VALUES ?";
        db.query(sqlInsertOrder, [valueOrder], (err, result) => {
            console.log("order", err);
        });

    });

});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
