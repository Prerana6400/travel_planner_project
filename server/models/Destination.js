import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["historical", "nature", "adventure", "cuisine"],
      required: true,
    },
    location: { type: String, required: true },
    rating: { type: Number, default: 0 },
    duration: { type: String },
    price: { type: String },
    numericPrice: { type: Number },
    imageUrl: { type: String },
    description: { type: String },
    highlights: [{ type: String }],
  },
  { timestamps: true }
);

DestinationSchema.index({ category: 1 });
DestinationSchema.index({ name: "text", location: "text" });

const Destination =
  mongoose.models.Destination || mongoose.model("Destination", DestinationSchema);

export default Destination;


