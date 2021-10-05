const express = require ('express');
const mongoose = require ('mongoose');
const path=require('path');
const ejsMate=require('ejs-mate');
const Joi=require('joi');
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const methodOverride=require('method-override');
const Campground= require('./models/campground');
const { error } = require('console');
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

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/campgrounds',catchAsync( async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds});
}));
app.get('/campgrounds/new',catchAsync((req,res)=>{    
    res.render('campgrounds/new.ejs');
}));
app.post('/campgrounds',catchAsync(async (req,res)=>{    
    const campgroundSchema=Joi.object({
        campground:Joi.object().required({
            title:Joi.string().required(),
            price:Joi.number().required().min(0)
        })
    });
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    const campground=new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
app.get('/campgrounds/:id',catchAsync(async (req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show.ejs',{campground});
}));
app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
    if(!req.body.params) throw new ExpressError();
    const campground =await Campground.findById(req.params.id);
    res.render('campgrounds/edit.ejs',{campground});
}));

app.put('/campgrounds/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id',catchAsync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

app.all('*',(req,res,next)=>{
    return next(new ExpressError('Page Not found',404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500}= err;
    if(!err.message) err.message="Oh no!! Something went wrong"
    return res.status(statusCode).render('error',{err});
    
})

app.listen(5500,()=>{
    console.log('Serving  on port 5500');

})

