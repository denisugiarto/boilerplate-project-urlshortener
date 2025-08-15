require("dotenv").config();
const dns = require("dns");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const db = ["test"];

app.use(cors());
app.use(bodyParser.urlencoded());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  // Check if URL is provided
  if (!url) {
    return res.json({ error: "invalid url" });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (err) {
    return res.json({ error: "invalid url" });
  }

  // Check if protocol is http or https
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) return res.json({ error: "invalid url" });
    db.push(url);
    console.log(db);
    const index = db.findIndex((item) => item === url);
    res.json({
      original_url: url,
      short_url: index,
    });
  });
});

app.get("/api/shorturl/:short_url?", (req, res) => {
  if (!req.params.short_url) return res.json({ error: "invalid url" });
  res.redirect(db?.[req.params.short_url]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
