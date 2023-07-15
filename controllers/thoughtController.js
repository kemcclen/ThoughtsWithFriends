const { User, Thought } = require("../models");

// ENDPOINT: /api/thoughts

// GET to get all thoughts
const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET to get a single thought by its _id
const getSingleThought = async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;

    const thought = await Thought.findOne({ _id: thoughtId });

    if (!thought) {
      return res.status(404).json({ message: "No thought with that ID" });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)

const createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { thoughts: thought._id } },
      { runValidators: true, new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create thought' });
  }
};
  
  
// PUT to update a thought by its _id
const updateThought = async (req, res) => {
  try {
    const thoughtId = req.params.thoughId;

    const thought = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $set: { thoughtText: req.body.thoughtText } },
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
    const thoughtId = req.params.thoughtId;

    const deletedThought = await Thought.findOneAndDelete({ _id: thoughtId });
    res.status(200).json(deletedThought);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ENDPOINT: /api/thoughts/:thoughtId/reactions

// POST to create a reaction stored in a single thought's reactions array field
const addReaction = async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;

    const postReaction = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    );
    res.status(200).json(postReaction);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE to pull and remove a reaction by the reaction's reactionId value
    const deleteReaction = async (req, res) => {
      try {
        const thoughtId = req.params.thoughtId;
        const reactionId = req.params.reactionId;
    
        const removeReaction = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $pull: { reactions: { _id: reactionId } } },
          { runValidators: true, new: true }
        );
    
        res.json(removeReaction);
      } catch (err) {
        res.status(500).json(err);
      }
    };

    module.exports = {
        getThoughts,
        getSingleThought,
       createThought,
        updateThought,
        deleteThought,
        addReaction,
        deleteReaction,
      };