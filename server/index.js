import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Destination from "./models/Destination.js";
import Trip from "./models/Trip.js";
import seedDestinations from "./data/destinations.seed.js";

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

  await Destination.insertMany(seedDestinations);
  console.log(`Seeded destinations: ${seedDestinations.length}`);
}

// Health route
app.get("/", (req, res) => {
  res.send("root is working");
});


app.get("/api/destinations", async (req, res) => {
  try {
    const { category, q } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 12, 1);
    const sortParam = (req.query.sort || "popular").toString();

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

    const sort = (() => {
      switch (sortParam) {
        case "rating":
          return { rating: -1 };
        case "price-low":
          return { numericPrice: 1 };
        case "price-high":
          return { numericPrice: -1 };
        case "popular":
        default:
          return { rating: -1, createdAt: -1 };
      }
    })();

    const total = await Destination.countDocuments(filter);
    const items = await Destination.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const mapped = items.map((d) => ({ ...d, id: d._id?.toString() }));

    res.json({ items: mapped, total, page, limit });
  } catch (err) {
    console.error("GET /api/destinations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Trips API
app.post("/api/trips", async (req, res) => {
  try {
    const payload = req.body || {};
    const trip = await Trip.create({
      title: payload.title,
      destination: payload.destination,
      startDate: payload.startDate ? new Date(payload.startDate) : undefined,
      endDate: payload.endDate ? new Date(payload.endDate) : undefined,
      travelers: payload.travelers,
      budget: payload.budget,
      interests: Array.isArray(payload.interests) ? payload.interests : [],
      itinerary: Array.isArray(payload.itinerary) ? payload.itinerary : [],
      status: payload.status || "upcoming",
      imageUrl: payload.imageUrl,
    });
    const json = trip.toJSON();
    res.status(201).json({ ...json, id: json._id?.toString() });
  } catch (err) {
    console.error("POST /api/trips error:", err);
    res.status(400).json({ message: "Invalid trip payload" });
  }
});

app.get("/api/trips", async (_req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 }).lean();
    const mapped = trips.map((t) => ({ ...t, id: t._id?.toString() }));
    res.json({ items: mapped, total: mapped.length });
  } catch (err) {
    console.error("GET /api/trips error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/trips/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/trips/:id error:", err);
    res.status(400).json({ message: "Invalid id" });
  }
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
