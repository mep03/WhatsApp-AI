const axios = require("axios");
const { RM_BG } = require("../apis");

const ChatEditHandler = async (text, msg) => {
  const cmd = text.split("/");
  if (cmd.length < 2) {
    return msg.reply("Incorrect Format. type *edit/color*");
  }

  if (msg.hasMedia) {
    if (msg.type != "image") {
      return msg.reply("Can only edit with image format.");
    }

    msg.reply("Processing, please wait a moment...");

    const media = await msg.downloadMedia();

    if (media) {
      const color = cmd[1];
      const newPhoto = await EditPhotoRequest(media.data, color);

      if (!newPhoto.success) {
        return msg.reply("There is an error.");
      }

      const chat = await msg.getChat();
      media.data = newPhoto.base64;
      chat.sendMessage(media, { caption: "WOW, Here are the results" });
    }
  }
};

const EditPhotoRequest = async (base64, bg_color) => {
  const result = {
    success: false,
    base64: null,
    message: "",
  };

  return await axios({
    method: "post",
    url: "https://api.remove.bg/v1.0/removebg",
    data: {
      image_file_b64: base64,
      bg_color: bg_color,
    },
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-Api-Key": RM_BG,
    },
  })
    .then((response) => {
      if (response.status == 200) {
        result.success = true;
        result.base64 = response.data.data.result_b64;
      } else {
        result.message = "Failed response";
      }

      return result;
    })
    .catch((error) => {
      result.message = "Error : " + error.message;
      return result;
    });
};

module.exports = {
  ChatEditHandler,
};
