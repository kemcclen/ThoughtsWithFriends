const { User, Thought } = require("../models");

// ENDPOINT: /api/users

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("thoughts").populate("frends");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET a single user by its _id and populated thought and friend data
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
      .populate("thoughts")
      .populate("friends");

    if (!user) {
      return res.status(404).json({ message: "No user with that ID" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

// POST a new user
const createUser = async (req, res) => {
  try {
    const result = await User.create(req.body);
    res.status(200).json({ message: "Success", user: result });
  } catch (err) {
    res.status(500).json(err);
  }
};

// PUT to update a user by its _id
const updateUser = async (req, res) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE to remove user by its _id + Remove a user's associated thoughts when deleted.
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });

    if (!user) {
      return res.status(404).json({ message: "No user with that ID" });
    }

    await Thought.deleteMany({ _id: { $in: user.thoughts } });
    res.json({ message: "User and associated thoughts deleted!" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ENDPOINT: /api/users/:userId/friends/:friendId

// POST to add a new friend to a user's friend list
const addFriend = async (req, res) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.body.friends_id } },
      { new: true, runValidators: true }
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE to remove a friend from a user's friend list
const removeFriend = async (req, res) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friend: { friendId: req.params.friendId } } },
      { runValidators: true, new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "No user found with that ID :(" });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

//exports

module.exports = {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
};
