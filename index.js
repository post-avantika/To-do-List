

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


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});








