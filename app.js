const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const port = 3000;
const shortUrl = require("./models/shortUrl");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//Connection to mongodb
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/shortUrls",
  { useNewUrlParser: true }
);

app.use(express.static(__dirname + "/public"));

/*================================================
This is a get request which provides a User interface for getting the Shortned URL code

=================================================*/
app.get("/", function(req, res) {
  res.render("index");
});

/*================================================
This is a get request which redirects user to actual site
if the short code is present then it redirects to actual site
else displays error
=================================================*/

app.get("/:urlForward", function(req, res) {
  var url = req.params.urlForward;
  shortUrl.findOne({ shortUrl: url }, function(err, data) {
    if (err) {
      console.log(err);
      return json({
        error: {
          message: "error"
        }
      });
    } else {
      if (data != null) {
        if (data.actualUrl != null) {
          console.log(data.actualUrl);
          res.redirect(data.actualUrl);
        }
      }
    }
    res.json({ error: "URL not present" });
  });
});
/*================================================
THis is a post request which allows user to create the short url
A Random number is genereated which allows to retrieve the actual url
The data is saved into mongodb
=================================================*/
app.post("/", function(req, res) {
  var urlShortner = req.body.url;

  //checks if the url have wwww
  if (!/^(w){3}/i.test(urlShortner)) {
    urlShortner = "www." + urlShortner;
  }
  //checks if url have https
  if (!/^(f|ht)tps?:\/\//i.test(urlShortner)) {
    urlShortner = "http://" + urlShortner;
  }
  //random number generation
  var random = Math.floor(Math.random() * 100000).toString();
  //data which will be added
  var data = new shortUrl({
    actualUrl: urlShortner,
    shortUrl: random
  });

  //saving the data to mongodb
  data.save(function(err) {
    if (err) {
      return json({
        error: "Error occured"
      });
    }
  });
  console.log(urlShortner);
  //json response
  return res.json({
    actualUrl:urlShortner,
    shortUrl: req.headers.host+'/'+random
  });
});

app.listen(process.env.PORT || port, function() {
  console.log("The connection is running on " + port);
});
