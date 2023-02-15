const axios = require("axios");
const { OPEN_AI } = require("../apis");

const ChatHelpHandler = async (text, msg) => {
  const cmd = text.split("/");

  if (cmd.length < 2) {
    return msg.reply("Incorrect Format. type *help/your question*");
  }

  msg.reply("Processing, please wait a moment...");

  const question = cmd[1];
  const response = await ChatGPTRequest(question);

  if (!response.success) {
    return msg.reply(response.message);
  }

  return msg.reply(response.data);
};

const ChatGPTRequest = async (text) => {
  const result = {
    success: false,
    data: "Oh Noo! I don't know",
    message: "",
  };

  return await axios({
    method: "post",
    url: "https://api.openai.com/v1/completions",
    data: {
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 1000,
      temperature: 0,
    },
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": "in-ID",
      Authorization: `Bearer ${OPEN_AI}`,
    },
  })
    .then((response) => {
      if (response.status == 200) {
        const { choices } = response.data;

        if (choices && choices.length) {
          result.success = true;
          result.data = choices[0].text;
        }
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
  ChatHelpHandler,
};
