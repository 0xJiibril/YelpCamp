const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
 const ObjectId = require("mongodb").ObjectId;
const { places, descriptors } = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
const sample = array => array[Math.floor(Math.random() * array.length)];

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DataBase Connected");
})

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
					author: "6173bb3ae454397c60c1e4c4",
					location: `${cities[random1000].city}, ${cities[random1000].state}`,
					title: `${sample(descriptors)} ${sample(places)}`,
					geometry: {
						type: "Point",
						coordinates: [
							cities[random1000].longitude,
							cities[random1000].latitude,
						],
					},
					image: [
						{
							url: "https://res.cloudinary.com/anas12345/image/upload/v1635687637/YelpCamp/rnk6mxrjrxv5cvivvrso.jpg",
							filename: "YelpCamp/rnk6mxrjrxv5cvivvrso",
							_id: new ObjectId("617e9cdb5598f3314d72f6ef"),
						},
						{
							url: "https://res.cloudinary.com/anas12345/image/upload/v1635687643/YelpCamp/i5aoyvcumm3alu9huv6l.jpg",
							filename: "YelpCamp/i5aoyvcumm3alu9huv6l",
							_id: new ObjectId("617e9cdb5598f3314d72f6f0"),
						},
					],
					description:
						"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut in pariatur quaerat, labore unde harum.",
					price,
					// idx: `${i}`
				});
        await camp.save();
    }
}

seedDB();

