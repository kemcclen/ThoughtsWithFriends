const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat')
const Reactions = require('./Reaction');

// Schema to create model
const thoughtSchema = new Schema(
  {
    thoughtText: {
        type: String,
        required: "A thought is required",
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
    },
    username: {
        type: String,
        required: true,
    }, 
    reactions: [Reactions],
},
{
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
}
);

//retrieves the length of the thoughts reactions array field on query
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Initialize our thoughts model
const Thought = model('thought', thoughtSchema);


module.exports = Thought;
