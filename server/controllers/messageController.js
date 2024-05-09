const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    console.log(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    console.log(ex);
  }
};



module.exports.deleteMessage = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.body;

    // Query messages where senderId matches
    const messages = await Messages.find({ sender: senderId });

    // Filter messages where receiverId is also present
    const messagesToDelete = messages.filter((message) =>
      message.users.includes(receiverId)
    );

    // Delete matching messages
    await Promise.all(messagesToDelete.map((message) => message.remove()));

    res
      .status(200)
      .json({ success: true, message: "Messages deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
