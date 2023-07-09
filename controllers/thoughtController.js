const { User, Thought } = require("../models");

// ENDPOINT: /api/thoughts

// GET to get all thoughts
const getThoughts = async (req, res) => {
    try {
      const thoughts = await Thought.find().populate("reactions");
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  };

// GET to get a single thought by its _id
const getSingleThought = async (req, res) => {
    try {
      const thought = await Thought.findOne({ _id: req.params.id })
        .populate("reactions");
  
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
  
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  };

// POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)

// const createThoughtt = async (req, res) => {
//     try {
//       const thought = await Thought.create(req.body);
//       res.status(200).json({ message: "Success", user: thought });
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   };

//     try {
//       const User = await User.findOneAndUpdate(
//         { _id: req.params.userId },
//         { $addToSet: { thought: req.body } },
//         { runValidators: true, new: true }
//       );
//       res.json(thought);
//     } catch (err) {
//       res.status(500).json(err);
//     }

//chat gpt generated naming isnt corrct 
//   const createThought = async (req, res) => {
//     try {
//       const { thoughtText, username } = req.body;
  
//       const thought = await Thought.create({ thoughtText, username });
  
//       const user = await User.findOneAndUpdate(
//         { username },
//         { $push: { thoughts: thought._id } },
//         { new: true }
//       );
  
//       res.status(201).json({ thought, user });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to create thought' });
//     }
//   };
  
  
// PUT to update a thought by its _id
const updateThought = async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  };

// DELETE to remove a thought by its _id
const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndDelete({_id: req.params.id});
        res.status(200).json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
};


// ENDPOINT: /api/thoughts/:thoughtId/reactions

// POST to create a reaction stored in a single thought's reactions array field
const addReaction = async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { reaction: req.body.reaction_id } },
        { new: true, runValidators: true }
      );
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  };

// DELETE to pull and remove a reaction by the reaction's reactionId value

const deleteReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reaction: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        );
  
        res.json(thought);
      } catch (err) {
        res.status(500).json(err);
      }
    };

    module.exports = {
        getThoughts,
        getSingleThought,
       // createThought,
        updateThought,
        deleteThought,
        addReaction,
        deleteReaction,
      };