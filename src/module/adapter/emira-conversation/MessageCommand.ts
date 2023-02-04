import { ModuleInterface } from "@module/port";
import MessageCommandInterface from "@module/port/MessageCommand";
import { Message } from "discord.js";
import EmiraConversationModule from ".";
import { SequenceMatcher } from "difflib";
import { Config } from "./Config";
import qrFile from "./QR4.json"
import OpenAIService from "@domain/service/OpenAI";


export default class MessageCommand implements MessageCommandInterface {
    module: EmiraConversationModule;
    startString: string = "emira";
    floors = [0.9, 0.8]
    freeChannelId = Config.FREE_CHANNEL_ID
    openAiService = new OpenAIService()

    constructor(module: EmiraConversationModule) {
        this.module = module
    }
    canStart(message: Message<boolean>): boolean {
        if (message.author.bot)
            return false
        const firstWord = message.content.split(' ')[0].toLowerCase()
        if (firstWord == this.startString)
            return true
        if (message.channelId == this.freeChannelId)
            return true
        return false
    }
    execute(message: Message<boolean>): void {
        const firstWord = message.content.split(' ')[0].toLowerCase()
        let text = message.content
        if (firstWord == this.startString)
            text = this.removeFirstWord(message.content)

        if (text == "") {
            message.reply("Si tu veux me parler, dis quelque chose !")
            return
        }
        let answerFound = false
        let finalAnswer = ""
        let nextCommand = ""
        this.floors.some((floor) => {
            if (answerFound) {
                return true
            }
            let last_similitude = 0
            qrFile.forEach((item) => {
                // @ts-ignore There is no ratio() in type
                const similitude = new SequenceMatcher(null, text, item.question).ratio();
                if (similitude >= floor && similitude > last_similitude) {
                    last_similitude = similitude
                    answerFound = true
                    finalAnswer = item.answer
                    nextCommand = item.command || ""
                }
            })

        })
        if (finalAnswer != "") {
            message.reply(finalAnswer)
            if (nextCommand != "") {
                const file = this.module.getPic(nextCommand)
                try {
                    message.channel.send({ files: [file] })
                } catch {
                    const channel = this.module.bot.client.channels.cache.get(Config.QUESTION_CHANNEL_ID)
                    if (channel && channel.isTextBased()) {
                        channel.send(`Fichier manquant : ${file}`)
                    }
                }
            }
        } else {
            this.openAiService.send(text).then((result) => {
                message.reply(result)
                const channel = this.module.bot.client.channels.cache.get(Config.QUESTION_CHANNEL_ID)
                if (channel && channel.isTextBased()) {
                    channel.send(`Nouvelle question posée à Emira : ${text} - Réponse de OpenAI : ${result}`)
                }
                qrFile.push({ "question": text, "answer": result })
            }).catch((error) => {
                console.log(error)
            })

        }
    }
    removeFirstWord(str: string) {
        const indexOfSpace = str.indexOf(' ');

        if (indexOfSpace === -1) {
            return '';
        }

        return str.slice(indexOfSpace + 1);
    }
}
