const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const { object } = require('joi');

main().then(() => {
    console.log("Connected to database");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner : "67ec3a438a4a156e207be166"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();
