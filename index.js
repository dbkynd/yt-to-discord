require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const { Client } = require('discord.js');

const YouTubeNotifier = require('youtube-notification');
const client = new Client({intents: []})

const channels = process.env.DISCORD_CHANNELS.split(',')

client.once('ready', () => {
    console.log(`Connected to Discord as: ${client.user.tag}`)
})

client.login(process.env.BOT_TOKEN).catch((err) => {
    console.error(err)
})

const notifier = new YouTubeNotifier({
    hubCallback: process.env.CALLBACK_URL,
    secret: uuidv4(),
    port: 3000,
});
notifier.setup()

notifier.on('subscribe', data => {
    console.log(`Subscribed to channel: ${data.channel}`)
})

notifier.on('notified', data => {
    console.log(`${data.channel.name} just uploaded a new video titled: ${data.video.title} at: ${data.video.link}`)
    channels.forEach(channel => {
        client.channels.fetch(channel).then(c => {
            if (c && c.isText()) {
                c.send(data.video.link).catch((err) => console.error(err))
            }
        })
    })
})

notifier.subscribe(process.env.YT_CHANNEL)
