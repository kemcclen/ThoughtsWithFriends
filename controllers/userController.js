const { User, Thought } = require("../models");

// ENDPOINT: /api/users

// GET all users
const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find().populate("thoughts").populate("friends");
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET a single user by its _id and populated thought and friend data
const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOne({ _id: userId })
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
    const newUser = await User.create(req.body);
    res.status(200).json({ user: newUser });
  } catch (err) {
    res.status(500).json(err);
  }
};

// PUT to update a user by its _id
const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE to remove user by its _id + Remove a user's associated thoughts when deleted.
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findOneAndDelete({ _id: userId });

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
    const userId = req.params.userId;

    const addedFriend = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { friends: req.body.friends } },
      { new: true, runValidators: true }
    );
    res.status(200).json(addedFriend);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE to remove a friend from a user's friend list
const removeFriend = async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    const removedFriend = await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } },
      { runValidators: true, new: true }
    );

    if (!removedFriend) {
      return res.status(404).json({ message: "No user found with that ID :(" });
    }

    res.json(removedFriend);
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
