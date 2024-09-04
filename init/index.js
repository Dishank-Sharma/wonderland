const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');

main().then(() => { console.log('Connected to Database') }).catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

const intiDB = async () => {
    initData.data = initData.data.map((obj) => ({...obj, owner: '66d70a0d937bc08f21146658'}))
    await Listing.insertMany(initData.data);
}

intiDB()