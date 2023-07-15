const { Schema, model } = require('mongoose');

//schema to create model
const userSchema = new Schema(
  {
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true,
    },
    email: {
        type: String,
        required: 'Email is required',
        unique: true,
        match: [/.+\@.+\..+/],
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'thought',
        },
    ],
    friends: [
        {
          
            type: Schema.Types.ObjectId,
            ref: 'user',
        
        },
    ],
},
{
    toJSON: {
        virtuals: true,
    },
   
}
);

//retrieves the length of the user's friends array field on query
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Initialize our user model
const User = model('user', userSchema);

module.exports = User;
