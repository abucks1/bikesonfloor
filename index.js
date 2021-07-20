const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
const db = require("./database");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set port
const PORT = process.env.PORT || 3000;

const apiRouter = require("./routes/api")
app.use("/api", apiRouter)

const displayRouter = require("./routes/display");
app.use("/", displayRouter);

const bikes = [];
const sizes = [
  / XXS/,
  / XS/,
  / SM/,
  / MD/,
  / LG/,
  / XL/,
  / XXL/,
  / XXXL/,
  / WXS/,
  / WSM/,
  / WMD/,
  / WL/,
  / WXL/,
];
const wheelsize = [/ 27.5/, / 29/];
const category = [
  /Electric Hybrid/,
  /Electric Mountain/,
  //Electric Dual Suspension Mountain Bike/,
  /Hybrid/,
  /Commuter/,
  ///Electric Bikes/,
  /Dual Suspension/,
  /Hardtail/,
  //Recreation Bikes/,
  /Mountain Bikes/,
  /Kids Bikes/,
  /Balance Bikes/,
  /Freestyle BMX/,
  /Drop Bar Road/,
  /Cruiser Bikes/,
  /Adventure Road/,
];

const pricepoint = [
  /Bikes/
];


app.get("/", async (req, res) => {});

app.post("/seed-bikes", async (req, res) => {
  // load file in - check out multer
  try {
    await fs
      .createReadStream("./Bikesinstock-111.csv")
      .on("open", async ( ) => {
      await db.none("DELETE FROM bikes;");
      })
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {   console.log("reading error")

        console.log(error)
        return res.send(error)
        })
      .on("data", (row) => {

        for (let i = 0; i < sizes.length; i++) {
          if (sizes[i].test(row["Display Name "])) {
            console.log("is there a size ")
            row["Display Name "] = row["Display Name "].replace(sizes[i], "")
            row["Inventory Item: Frame Size "] = sizes[i]
              .toString()
              .replace(/\//g, "")
              .trim()
          }
        }
      
        for (let i = 0; i < wheelsize.length; i++) {
          if (wheelsize[i].test(row["Display Name "])) {
            console.log("is there a wheel size ")

            row["Display Name "] = row["Display Name "].replace(
              wheelsize[i],
              ""
            );
            row["Inventory Item: Wheel Size "] = wheelsize[i]
              .toString()
              .replace(/\//g, "")
              .trim();
          }
        }

        for (let i = 0; i < category.length; i++) {
          if (category[i].test(row["Inventory Item: Web Category "])) {
            console.log("is there a category ")
            row["Inventory Item: Web Category "] = row[
              "Inventory Item: Web Category "
            ].replace(/[\s\S]/g, "")
            row["Inventory Item: Category"] = category[i]
              .toString()
              .replace(/\//g, "")
              .trim();
          }
        }

        for (let i = 0; i < pricepoint.length; i++) {
          if (pricepoint[i].test(row["Inventory Item: Price Point "])) {
            console.log("is there a price ")
            row["Inventory Item: Price Point "] = row[
              "Inventory Item: Price Point "
            ].replace("Bikes", "")
          }
        }


        db.none(
          "INSERT INTO bikes(bikename, frame_size, wheel_size, price_point, category, qty_available) VALUES ($1, $2, $3, $4, $5, $6);",
          [
            row["Display Name "],
            row["Inventory Item: Size "],
            row["Inventory Item: Wheel Size "],
            row["Inventory Item: Price Point "],
            row["Inventory Item: Category"],
            row["Current Quantity Available"],
          ]
        ).catch((err) => {
          console.log('db error')
          console.log(err);
         return res.send(err);
        });

       bikes.push(row);
      })
      .on("end", () => {
        console.log('file end')
       return res.send(bikes);
      });
  } catch (error) {
    console.log('error with file')
    console.log(error);
   return res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Bikesonfloor listening at http://localhost:${PORT}`);
});
