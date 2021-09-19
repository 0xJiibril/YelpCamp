const express = require ('express');
const mongoose = require ('mongoose');
const path=require('path');
const Campground= require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp',
    {
    useNewUrlParser:true,
    useUnifiedTopology:true
    }
)

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{ 
    console.log("DataBase Connected");
})

const app=express();


app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));


app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/campgrounds',async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds});
});
app.get('/campgrounds/new',(req,res)=>{    
    res.render('campgrounds/new.ejs');
});
app.post('/campgrounds',async (req,res)=>{    
    const campground=new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});
app.get('/campgrounds/:id',async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show.ejs',{campground});
});
app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground =await Campground.findById(req.params.id);
    res.render('campgrounds/edit.ejs',{campground});
})

app.listen(5500,()=>{
    console.log('Serving  on port 5500');

})

