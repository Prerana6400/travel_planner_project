import mongoose from "mongoose";

const ItineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String },
    activities: [{ type: String }],
    meals: [{ type: String }],
    accommodation: { type: String },
  },
  { _id: false }
);


const TripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    travelers: { type: String },
    budget: { type: String },
    interests: [{ type: String }],
    itinerary: [ItineraryDaySchema],
    status: { type: String, enum: ["draft", "upcoming", "completed"], default: "draft" },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

TripSchema.index({ createdAt: -1 });

const Trip = mongoose.models.Trip || mongoose.model("Trip", TripSchema);

export default Trip;


