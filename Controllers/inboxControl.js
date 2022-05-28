//inbox CONTROLLERS
const escape = require("../utilities/escape");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
//Models
const USER = require("../Models/PeopleModel");
const CONV = require("../Models/Conversation");
const MSG = require("../Models/Message");
//Scafolding
const wrapper = {};

//- - - - - - - - - -  CONVERSATION GET CONTROLLER - - - - - - - - - -
wrapper.inboxGetControl = async (req, res) => {
  const { userId } = res.locals.loggedInUser;

  try {
    const convs = await CONV.find({
      $or: [{ "creator.id": userId }, { "participant.id": userId }],
    });

    if (req.accepts("html")) {
      res.locals.moment = require("moment");
      res.locals.data = convs.length > 0 ? convs : [];
      res.render("inbox");
    } else {
      res.json({ data: convs });
    }
  } catch (err) {
    if (req.accepts("html")) {
    } else {
      const response = {
        errors: {
          common: {
            msg: "Coudn't find any user",
          },
        },
      };
      res.status(404).json(response);
    }
  }
};

//- - - - - - - - - -  USERS GET CONTROLLER - - - - - - - - - -
wrapper.inboxUserGetControl = async (req, res) => {
  let { user } = req.body;
  const { userId } = res.locals.loggedInUser;
  user = escape(user);
  const ReGex = { $regex: user, $options: "i" };
  const emailReGex = { $regex: `^${user}$` };
  const mobileReGex = { $regex: `^${user}$` };
  try {
    const existingUsersInConvs = await CONV.find(
      {
        $or: [{ "creator.id": userId }, { "participant.id": userId }],
      },
      { "creator.id": 1, "participant.id": 1 }
    );

    let existingUserIdsInConvs = [];
    existingUsersInConvs.forEach((conv) => {
      if (conv.creator.id.toString() !== userId) {
        existingUserIdsInConvs.push(conv.creator.id);
      } else {
        existingUserIdsInConvs.push(conv.participant.id);
      }
    });
    existingUserIdsInConvs.push(userId);

    if (user && user.length > 0) {
      const found_users = await USER.find(
        {
          $and: [
            {
              $or: [
                { name: ReGex },
                { mobile: mobileReGex },
                { email: emailReGex },
              ],
            },
            { _id: { $nin: existingUserIdsInConvs } },
          ],
        },
        { avatar: 1, name: 1 }
      );
      res.json(found_users);
    }
  } catch (error) {
    const response = {
      errors: {
        common: {
          msg: "Coudn't find any user",
        },
      },
    };
    res.status(404).json(response);
  }
};
//____________________________________________________________________

//- - - - - - - - - -  CONVERSATION POST CONTROLLER - - - - - - - - - -
wrapper.inboxConvPostControl = async (req, res) => {
  //CREATOR OBJ
  const { userId, userName, userAvatar } = res.locals.loggedInUser;
  const creatorObj = userAvatar
    ? {
        id: userId,
        name: userName,
        avatar: userAvatar,
      }
    : {
        id: userId,
        name: userName,
      };

  //PARTICIPANT OBJ
  const { participant, id } = req.body;
  const participantObj = req.body.avatar
    ? {
        id,
        name: participant,
        avatar: req.body.avatar,
      }
    : {
        id,
        name: participant,
      };

  //NOW POSTing those OBJs
  try {
    await CONV.create({
      creator: creatorObj,
      participant: participantObj,
    });
    res.render("inbox");
  } catch (err) {
    const errorObj = {
      errors: {
        common: {
          msg: "Failed to Create NEW Conversation",
        },
      },
    };
    res.status(500).json(errorObj);
  }
};
//____________________________________________________________________

//- - - - - - - - - -  MESSAGE GET CONTROLLER - - - - - - - - - -
wrapper.inboxMessageGetControl = async (req, res) => {
  try {
    const messages = await MSG.find({
      conversation_id: escape(req.params.conversation_id),
    }).sort("-createdAt");

    let { participant, creator } = await CONV.findById(
      escape(req.params.conversation_id)
    );

    const loggedUser = res.locals.loggedInUser.userId;

    if (loggedUser === participant.id.toString()) {
      participant = creator;
    } else {
      participant = participant;
    }
    const resObj = {
      user: res.locals.loggedInUser,
      conversation_id: escape(req.params.conversation_id),
      data: {
        participant: participant,
        messages,
      },
    };
    res.json(resObj);
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Couldn't find messages",
        },
      },
    });
  }
};
//____________________________________________________________________

//- - - - - - - - - -  MESSAGE POST CONTROLLER - - - - - - - - - -
wrapper.inboxMessagePostControl = async (req, res) => {
  const { conversationId, avatar, message, receiverId, receiverName } =
    req.body;
  const files = req.files;
  const file_names = [];
  await files.forEach((file) => file_names.push(file.filename));
  try {
    const sender = {
      id: res.locals.loggedInUser.userId,
      avatar: res.locals.loggedInUser.userAvatar,
      name: res.locals.loggedInUser.userName,
    };
    const receiver = {
      id: receiverId,
      avatar,
      name: receiverName,
    };
    const date_time = Date.now();

    const dbPost = {
      text: message,
      attachment: file_names,
      sender,
      receiver,
      conversation_id: conversationId,
      date_time,
    };
    const resObj = {
      message: {
        conversation_id: conversationId,
        sender,
        message,
        attachment: file_names,
        date_time,
      },
    };

    await MSG.create(dbPost);

    await global.io.emit("new_message", resObj);
  } catch (err) {
    res.status(500).end();
  }
};
//____________________________________________________________________

//- - - - - - - - - -  CONVERSATION DELETE CONTROLLER - - - - - - - - - -
wrapper.inboxConvDeleteControl = async (req, res) => {
  try {
    //Grabbing the attachments of the Messages
    const messages = await MSG.find(
      {
        conversation_id: escape(req.params.id),
      },
      { attachment: 1 }
    );

    //First Deleting Attachments
    messages.forEach(async (msg) => {
      if (msg.attachment && msg.attachment.length > 0) {
        await msg.attachment.forEach(async (attch) => {
          fs.unlink(
            path.join(__dirname, "/../public/uploads/attachments", `${attch}`),
            (err) => {
              if (err) throw err;
            }
          );
        });
      }
    });

    //Then deleting those messages from database
    await MSG.deleteMany({
      conversation_id: escape(req.params.id),
    });
    //Deleting the conversation
    await CONV.deleteOne({ _id: escape(req.params.id) });

    //Sending response if there is no error
    res
      .status(200)
      .json({ errors: false, message: "Succesfully Deleted Conversation" });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Coudn't delete Conversation",
        },
      },
    });
  }
};

//- - - - - - - - - -  CONVERSATION SEARCH CONTROLLER - - - - - - - - - -
wrapper.inboxConvSearchPostController = async (req, res) => {
  let { searchConv } = req.body;
  const { userId } = res.locals.loggedInUser;
  let found_convs;
  searchConv = escape(searchConv);
  try {
    if (searchConv && searchConv.length > 0) {
      const ReGex = { $regex: searchConv, $options: "i" };
      const queryObj = {
        $and: [
          { $or: [{ "creator.name": ReGex }, { "participant.name": ReGex }] },
          { $or: [{ "creator.id": userId }, { "participant.id": userId }] },
        ],
      };
      found_convs = await CONV.find(queryObj);

      res.json({ data: found_convs });
    }
  } catch (err) {
    console.log(err);
    if (req.accepts("html")) {
    } else {
      const response = {
        errors: {
          common: {
            msg: "Coudn't find any user",
          },
        },
      };
      res.status(404).json(response);
    }
  }
};

module.exports = wrapper;
