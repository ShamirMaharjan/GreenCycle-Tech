const mongoose = require("mongoose");
const Location = require("../models/location");
require("dotenv").config();

const locations = [
  {
    name: "Balaju",
    imageFilename: "balaju.png",
    description: "Balaju area waste collection point",
    coordinates: { lat: 27.7362, lng: 85.2995 },
  },
  {
    name: "Maharajgunj",
    imageFilename: "maharajgunj.png",
    description: "Maharajgunj area waste collection point",
    coordinates: { lat: 27.7362, lng: 85.3504 },
  },
  {
    name: "Pashupatinath",
    imageFilename: "pashupati.png",
    description: "Pashupatinath area waste collection point",
    coordinates: { lat: 27.7109, lng: 85.3488 },
  },
  {
    name: "Kalanki",
    imageFilename: "kalanki.png",
    description: "Kalanki area waste collection point",
    coordinates: { lat: 27.6942, lng: 85.2805 },
  },
];

const seedLocations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Location.deleteMany({});
    await Location.insertMany(locations);
    console.log("Locations seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding locations:", error);
    process.exit(1);
  }
};

seedLocations();
