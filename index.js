const TelegramBot = require("node-telegram-bot-api")
const mongodb = require("mongodb")
const dotenv = require("dotenv")

dotenv.config()

let TOKEN = process.env.TOKEN
let MONGO_URI = process.env.MONGO_URI
let ADMIN = parseInt(process.env.ADMIN)
let APP_URL = process.env.APP_URL

let client = new mongodb.MongoClient(MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

let bot = new TelegramBot(TOKEN, {
  webHook: {
    port: parseInt(process.env.PORT)
  }
})

bot.setWebHook(`${APP_URL}/bot${TOKEN}`)

client.connect((err) => {

  let users = client.db("test_fff").collection("Users")

  bot.on("message", (msg) => {

    if (err) {
      console.error(err)
      bot.sendMessage(msg.chat.id, "Something went wrong. Please try again shortly.")
      return
    }

    if (msg.text === "/start") {
      if (msg.from.id === ADMIN) {
        bot.sendMessage(msg.chat.id, `Hello Admin, what message would you like to broadcast today?`)
      } else {
        users.findOne({
          userId: msg.from.id
        })
          .then((doc) => {
            if (doc === null) {
              users.insertOne({
                userId: msg.from.id,
                chatId: msg.chat.id,
                firstName: msg.from.first_name
              })

              bot.sendMessage(msg.chat.id, `Hello, ${msg.from.first_name}😀!\n\nMy name is Bolu Okunade, and I am the WordFeast Cell Leader at CMSS Building.\n\nThank you for showing interest in fellowshipping with the WordFeast Family at CMSS Building.\n\nThrough this chat, you will be receiving direct messages about our meeting schedules, and other relevant information.\n\nShould the need arise, please do not hesitate to send me a direct message @tradewithbolu .\n\nSending plently love in your direction❤.\nThe mission is possible🔥.`)
            } else {
              bot.sendMessage(msg.chat.id, `Hello, ${doc.firstName}😀!\n\nMy name is Bolu Okunade, and I am the WordFeast Cell Leader at CMSS Building.\n\nThank you for showing interest in fellowshipping with the WordFeast Family at CMSS Building.\n\nThrough this chat, you will be receiving direct messages about our meeting schedules, and other relevant information.\n\nShould the need arise, please do not hesitate to send me a direct message @tradewithbolu .\n\nSending plently love in your direction❤.\nThe mission is possible🔥.`)
            }
          })
          .catch((err) => {
            console.error(err)
            bot.sendMessage(msg.chat.id, "Something went wrong. Please try again shortly.")
          })
      }
    } else {
      if (msg.from.id === ADMIN) {
        users.find()
          .forEach((user, err) => {
            if (err) {
              console.error(err)
              bot.sendMessage(msg.chat.id, "Something went wrong. Please try again shortly.")
              return
            }


            bot.sendMessage(user.chatId, msg.text.replace(/firstName/g, user.firstName))
          })
          .catch((err) => {
            console.error(err)
            bot.sendMessage(msg.chat.id, "Something went wrong. Please try again shortly.")
          })
      } else {
        bot.sendMessage(msg.chat.id, "Please no messages allowed.")
      }
    }
  })

  console.log("Bot working")
})