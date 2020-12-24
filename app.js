const express = require('express');
const bodyParser =  require('body-parser');
const app = express();
const mongoose = require('mongoose');
const _ = require("lodash");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://admin-srishti:Test123@cluster0.ywo7p.mongodb.net/<dbname>?retryWrites=true&w=majority/TodoDB',{useNewUrlParser: true});

const ItemSchema = new mongoose.Schema({
	name: String
})
const ListSchema = new mongoose.Schema({
	name: String,
	items: [ItemSchema]
})
const Item = new mongoose.model("Item",ItemSchema);
const List =  new mongoose.model("List", ListSchema);
var items = []
let newlistitems = []
const defaultItem = Item({
	name: "Welcome to your List!"
})
// defaultItem.save();
var date = new Date();
	var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var today = dayname[date.getDay()];
	var options = {
		weekday: "long",
		day: "numeric",
		month: "long"
	}

app.get('/', function(req, res){
	
	Item.find(function(err, Items){
	if(err)
		console.log(err);
	// else{
	// 	Items.forEach((Item) => {
	// 		items.push(Item);
		
	else{

		today = date.toLocaleDateString("en-US", options);
		res.render("list",{listTitle : today,litems: Items});
		}

	});
});
app.post('/',function(req,res){
		var date = new Date();
	today = date.toLocaleDateString("en-US", options);
	console.log(req.body);
	const listname =  req.body.list;
	const newItem = new Item({
			name: req.body.newitem
		});
		console.log(today);
	if (listname === today){
		// newlistitems.push(req.body.newitem);
		// res.redirect('/work');
		items.push(req.body.newitem);
		newItem.save();
		res.redirect('/');
	}
	else{
		List.findOne({name: listname},function(err, foundList){
			if (!err){
				foundList.items.push(newItem);
				foundList.save();
				res.redirect('/'+listname);
			}
		})
		}
	
})
app.get("/:customListName",function(req,res){
	const customListName = _.capitalize(req.params.customListName);
	List.findOne({name:customListName},function(err,found){
		if(err){
			console.log(err)
		}
		else{
			console.log(found);
			if (found)
			{

				console.log(found);
				res.render("list",{listTitle : customListName,litems: found.items});
			}
			else{
				const List1 = new List({
					name:customListName,
					items: [ defaultItem ]

				})
				console.log("Hereeeeee");
				console.log(List1.items)
				List1.save();
				res.render("list",{listTitle : customListName,litems: List1.items});


			}
		}
	})
	

});
app.post('/delete', function(req,res){
	console.log(req.body.checkbox);	
	var date = new Date();
	today = date.toLocaleDateString("en-US", options);
	listTitle = req.body.listTitle

	if ( listTitle=== today)
	{

		Item.findByIdAndRemove(req.body.checkbox,function(err){
			if (err)
				console.log(err);
			else
				console.log("Success");
			res.redirect("/");
		})
	}
	else{
		List.findOneAndUpdate({name: listTitle},{$pull: {items:{_id: req.body.checkbox}}}, function(err){
			if (!err){
				res.redirect("/"+listTitle);
			}
		})
	}
})

app.listen(3000, function(){
	console.log("Server is up and running.")
})