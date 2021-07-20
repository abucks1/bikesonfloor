const express = require("express");
const router = express.Router();
const db = require("../database");

const category = [
  /Hybrid/,
  /Commuter/,
  /Electric Bikes/,
  /Electric Hybrid/,
  //Recreation Bikes/,
  /Mountain Bikes/,
  /Electric Dual Suspension Mountain Bike/,
  /Balance Bikes/,
  /Kids Bikes/,
  /Freestyle BMX/,
  /Hardtail/,
  /Dual Suspension/,
  /Drop Bar Road/,
  /Cruiser Bikes/,
  /Adventure Road/,
  /Electric Mountain/,
];

router.get("/", (req, res) => {
  const categories = req.query.categories;
  const queryArr = [];

  if (categories === "all") {
    for (let i = 0; i < category.length; i++) {
      console.log(category[i].toString().replace(/\//g, ""));
      const query = db.any(
        "SELECT * FROM bikes WHERE category = $1 ORDER BY frame_size ASC, price_point DESC;",
        category[i].toString().replace(/\//g, "")
      );
      queryArr.push(query);
    }
  } else {
    console.log(categories);
    for (let i = 0; i < categories.length; i++) {
      const query = db.any(
        "SELECT * FROM bikes WHERE category = $1 ORDER BY frame_size ASC;",
        categories[i]
      );
      queryArr.push(query);
    }
  }

  console.log(queryArr);

  // const query1 = db.any(
  //   "SELECT * FROM bikes WHERE category = $1 ORDER BY frame_size ASC;",
  //   req.params.category1
  // )

  // const query2 = db.any(
  //   "SELECT * FROM bikes WHERE category = $1 ORDER BY frame_size ASC;",
  //   req.params.category2
  // )

  Promise.all(queryArr)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
