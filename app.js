const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const {
  ChatAskHandler,
  ChatHelpHandler,
  ChatEditHandler,
} = require("./components");

const app = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
  authStrategy: new LocalAuth(),
});

app.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

app.on("ready", () => {
  console.log("Client is ready!");
});

app.on("message", async (msg) => {
  const contact = await msg.getContact();
  const name = contact.pushname;
  console.log("Message from " + name + " with a message " + msg.body);
  const text = msg.body.toLowerCase() || "";

  // status
  if (text === "status") {
    msg.reply("Running Normal");
    console.log("Send Reply to " + name);
  }

  // ask
  if (text.includes("ask/")) {
    await ChatAskHandler(text, msg);
    console.log("Send Reply to " + name);
  }

  // help
  if (text.includes("help/")) {
    await ChatHelpHandler(text, msg);
    console.log("Send Reply to " + name);
  }

  // edit
  if (text.includes("edit/")) {
    await ChatEditHandler(text, msg);
    console.log("Send Reply to " + name);
  }
});

app.initialize();

module.exports = { app };
