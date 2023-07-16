const { Schema, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat')


// Schema to create  model
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      max_length: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
  },
  
    // toJSON: {
    //   getters: true,
    // },
 
  }
);

module.exports = reactionSchema;
