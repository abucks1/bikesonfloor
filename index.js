const express = require("express")
const fs = require("fs")
const path = require("path")
const csv = require("fast-csv")

const app = express()

const bikes = []
const sizes = [ / XXS/, / XS/, / SM/, / MD/, / LG/, / XL/, / XXL/, / XXXL/, / WXS/, / WSM/, / WMD/, / WL/, / WXL/, ]
const wheelsize = [ / 27.5/, / 29/,]
const category = [/Hybrid/, /Commuter/, /Electric Bikes/, /Recreation Bikes/, /Electric Mountain Bikes/,/Mountain Bikes/, /Electric Dual Suspension Mountain Bike/, /Kids Bikes/, /Balance Bikes/, /Freestyle BMX/, /Hardtail/, /Dual Suspension/, /Drop Bar Road/, /Cruiser Bikes/, /Adventure Road/,]

app.get("/", async (req, res) => {
  await fs
    .createReadStream("./Bikesinstock-691.csv")
    .pipe(csv.parse({ headers: true }))
    .on("error", error => console.error(error))
    .on("data", row => {
      for (let i = 0; i < sizes.length; i++) {
        if (sizes[i].test(row["Display Name "])) {
          row["Display Name "] = row["Display Name "].replace(sizes[i], "")
          row["Inventory Item: Frame Size "] = sizes[i].toString().replace(/\//g, '').trim()        }
          
      }

      for (let i = 0; i < wheelsize.length; i++) {
        if (wheelsize[i].test(row["Display Name "])) {
          row["Display Name "] = row["Display Name "].replace(wheelsize[i], "")
          row["Inventory Item: Wheel Size "] = wheelsize[i].toString().replace(/\//g, '').trim()        }
          
      }

      for (let i = 0; i < category.length; i++) {
        console.log(category)
      if (category[i].test(row["Inventory Item: Web Category "])) {
        row["Inventory Item: Web Category "] = row["Inventory Item: Web Category "].replace(category[i], "")
        row["Inventory Item: Category"] = category[i].toString().replace(/\//g, '').trim()        }
        
    }


   

      
      bikes.push(row)
    })
    .on("end", () => {
      // console.log(bikes)
      res.send(bikes)
    })
})

app.listen(3000)
