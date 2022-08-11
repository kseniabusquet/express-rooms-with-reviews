import mongoose from 'mongoose';
const { Schema, model } = mongoose

const reviewSchema = new Schema({
  comment: { type: String, maxlength: 200 },
  roomId: { type: Schema.Types.ObjectId, ref: "Room" },
  userId: { type: Schema.Types.ObjectId, ref: "User" }
});

const Review = model("Review", reviewSchema);

export default Review
