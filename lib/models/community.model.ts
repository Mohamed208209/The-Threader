import mongoose from "mongoose";
const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageurl: String,
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      role: "member"||"admin",
      ref: "User",
    },
  ],
});

const Community = mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;