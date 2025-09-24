import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Destination from "./models/Destination.js";
import Trip from "./models/Trip.js";

const app = express();


app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wander-main-project";

// Mongo connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    return seedIfEmpty();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Seed DB if empty
async function seedIfEmpty() {
  const count = await Destination.countDocuments();
  if (count > 0) return;

  const docs = [
    {
      name: "Aurangabad Caves Tour",
      category: "historical",
      location: "Aurangabad",
      rating: 4.9,
      duration: "2 Days",
      price: "₹6,500",
      description: "Ancient rock-cut caves with exquisite carvings.",
      highlights: ["Ajanta & Ellora nearby", "UNESCO heritage", "Guided tours"],
    },
    {
      name: "Mumbai to Lonavala",
      category: "nature",
      location: "Lonavala",
      rating: 4.8,
      duration: "2 Days",
      price: "₹4,200",
      description: "Green valleys, waterfalls, and misty viewpoints.",
      highlights: ["Tiger Point", "Bhushi Dam", "Monsoon treks"],
    },
    {
      name: "Konkan Coast Adventure",
      category: "adventure",
      location: "Konkan",
      rating: 4.6,
      duration: "4 Days",
      price: "₹9,800",
      description: "Beaches, water sports, and coastal cuisine.",
      highlights: ["Water sports", "Sea forts", "Seafood"],
    },
    {
      name: "Pune Food Trail",
      category: "cuisine",
      location: "Pune",
      rating: 4.7,
      duration: "1 Day",
      price: "₹1,200",
      description: "Explore iconic eateries and local Maharashtrian dishes.",
      highlights: ["Misal pav", "Bakeries", "Street food"],
    },
  ];

  await Destination.insertMany(docs);
  console.log("Seeded destinations");
}

// Health route
app.get("/", (req, res) => {
  res.send("root is working");
});


app.get("/api/destinations", async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    const items = await Destination.find(filter).lean();
    const mapped = items.map((d) => ({ ...d, id: d._id?.toString() }));

    res.json({ items: mapped, total: mapped.length, page: 1, limit: mapped.length });
  } catch (err) {
    console.error("GET /api/destinations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
