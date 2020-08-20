const express=require("express"),
	  mongoose=require("mongoose"),
	  app=express(),
	  methodOverride=require("method-override")
	  bodyParser=require("body-parser");
	  expressSanitizer=require("express-sanitizer");

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));

mongoose.set('useFindAndModify', false)
mongoose.connect('mongodb://localhost:27017/restful_blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	description:String,
	created:{type:Date,default:Date.now}
});



var Blog=mongoose.model("Blog",blogSchema);

app.get("/",(req,res)=>{
	res.redirect("/blogs");
})

app.get("/blogs",(req,res)=>{
	Blog.find({},(err,blogs)=>{
		if(err)
			console.log(err);
		else
			res.render("index",{blogs:blogs});
	});
});

app.get("/blogs/new",(req,res)=>{
	Blog.find({},(err,blogs)=>{
		if(err)
			console.log(err);
		else
			res.render("new");
	});
});
app.get("/blogs/:id",(req,res)=>{
	// req.body.blog.description=req.sanitize(req.body.blog.description);
	Blog.findById(req.params.id,(err,blog)=>{
		if(err)
			res.send(err);
		else
			res.render("show",{blog:blog});
	});
});
app.get("/blogs/:id/edit",(req,res)=>{
	// req.body.blog.description=req.sanitize(req.body.blog.description);
	Blog.findById(req.params.id,(err,blog)=>{
		if(err)
			res.send(err);
		else
			res.render("edit",{blog:blog});
	});
});

app.put("/blogs/:id",(req,res)=>{
	req.body.blog.description=req.sanitize(req.body.blog.description);
	Blog.findOneAndUpdate(req.params.id,req.body.blog,(err,blogs)=>{
		if(err)
			console.log(err);
		else
			res.redirect("/blogs/"+req.params.id);
	});
});

app.delete("/blogs/:id",(req,res)=>{
	Blog.findByIdAndRemove(req.params.id,(err,blogs)=>{
		if(err)
			console.log(err);
		else
			res.redirect("/blogs");
	});
})

app.post("/blogs",(req,res)=>{
	const blog=req.body.blog;
	req.body.blog.description=req.sanitize(req.body.blog.description);
	Blog.create(blog,(err,newBlog)=>{
		if(err)
			console.log(err);
		else
			res.redirect("/blogs");
	})
})

app.listen(3000, function() { 
  console.log('YELP CAMP STARTED'); 
});


