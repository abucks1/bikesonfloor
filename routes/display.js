const express = require("express")
const router = express.Router()
// const db = require("../database")
const axios = require("axios")

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("/api?categories=all")
    console.log(response.data)
    res.end()
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

module.exports = router
