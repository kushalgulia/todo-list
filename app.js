const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + '/date.js');


const app = express();
//items can be pushed in const array but they cannot be reassigned to other array
const items = ["Add itmes"];
const workItems = ["Add work items"]

app.use(express.static('public'));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set("view engine", "ejs");

//home route
app.get("/", function(req, res) {

  const currentDay = date.getDay();

  res.render("list", {
    heading: currentDay,
    itemList: items,
    url: "/"
  });
});

app.post("/", function(req, res) {
  const newItem = req.body.newItem;
  items.push(newItem);
  res.redirect("/");
});



//work route
app.get("/work", function(req, res) {

  res.render('list', {
    heading: "Work List",
    itemList: workItems,
    url: "/work"
  });
});

app.post('/work', function(req, res) {
  const newItem = req.body.newItem;
  workItems.push(newItem);
  res.redirect('/work');

});


//about route
app.get('/about', function(req, res) {
  res.render('about');
});




app.listen(3000, function() {
  console.log("Server running at port 3000");
});