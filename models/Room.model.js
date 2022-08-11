import mongoose from 'mongoose';
const { Schema, model } = mongoose

const roomSchema = new Schema({
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}] 
  });

const Room = model("Room", roomSchema);

export default Room
