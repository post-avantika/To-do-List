

import express from "express";
import bodyParser from "body-parser";
import * as mongoose from "mongoose";

const app = express();
const port = 3000;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



// let todos = [];
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema={
  name:String
}
const Item=mongoose.model("Item",itemsSchema);

app.get("/", (req, res) => {
  Item.find({}).then((foundItems) => {
    res.render("index.ejs",{newListItems:foundItems});
   
   })
   .catch((err) => console.log(err));
}); 
    
  


app.post("/submit", (req, res) => {
  const itemName = req.body.toDoName;

  
  const item=new Item({
    name: itemName
  });
  item.save();
  console.log("Saved successfully")
  res.redirect("/");
});




app.post("/delete", async function(req, res) {
  try {
    const checkedItemId = req.body.checkbox;
    await Item.findByIdAndRemove(checkedItemId);
    console.log("Successfully deleted");
    res.redirect("/");
     
  } catch (err) {
    console.error(err);
    
  }
});


app.get("/edit/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const foundItem = await Item.findById(itemId);
    res.render("edit-form.ejs", { item: foundItem });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Define a route to handle the edit form submission
app.post("/edit/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const updatedName = req.body.editedName;

    await Item.findByIdAndUpdate(itemId, { name: updatedName });
    console.log("Successfully updated item");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});








