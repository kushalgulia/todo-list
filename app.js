const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();

mongoose.connect('mongodb://localhost:27017/todolistDB');

app.use(express.static('public'));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set("view engine", "ejs");


const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({
  name: 'Welcome to the todo list'
})
const item2 = new Item({
  name: 'hit ➕ to add new item'
})
const item3 = new Item({
  name: '👈 hit this to delete an item'
})

const defaultItems = [item1, item2, item3];




const ListSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model('List', ListSchema);



//home route
app.get("/", function(req, res) {


  Item.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else if (items.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully added default items');
        }
      });
      res.redirect('/');
    } else {
      res.render("list", {
        heading: 'Today',
        itemList: items,
      }); //render
    }
  }) //find
}); //home route

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });
  if (listName === 'Today') {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, (err, result) => {
      result.items.push(item);
      result.save();
      res.redirect(listName);
    })
  }


});

app.post('/delete', function(req, res) {
  const itemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === 'Today') {
    Item.deleteOne({
      _id: itemId
    }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted Item");
      }
    });
    res.redirect('/');
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: itemId
        }
      }
    }, (err, result) => {
      if (!err) {
        res.redirect(listName);
      }
    }); //findOneAndUpdate
  } //else

})




app.get('/:name', (req, res) => {
  const customListName = _.capitalize(req.params.name);

  List.findOne({
    name: customListName
  }, (err, result) => {
    if (!result) {
      //create a new list
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect(customListName);
    } else {
      //show an existing list
      res.render("list", {
        heading: result.name,
        itemList: result.items,
      });
    }
  }); //find one

}); //custom route


//about route
app.get('/about', function(req, res) {
  res.render('about');
});




app.listen(3000, function() {
  console.log("Server running at port 3000");
});