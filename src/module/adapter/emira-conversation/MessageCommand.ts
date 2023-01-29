import { ModuleInterface } from "@module/port";
import MessageCommandInterface from "@module/port/MessageCommand";
import { Message } from "discord.js";
import EmiraConversationModule from ".";
import * as fs from 'fs';
import * as readline from "readline";
import path from "path";
import { SequenceMatcher } from "difflib";
import { Config } from "./Config";
import * as QR from "./QR.txt"


export default class MessageCommand implements MessageCommandInterface {
    module: ModuleInterface;
    startString: string = "emira";
    seuils = [0.9, 0.8]

    constructor(module: EmiraConversationModule) {
        this.module = module
    }
    execute(message: Message<boolean>): void {
        const text = this.removeFirstWord(message.content)
        if (text == "") {
            message.reply("Si tu veux me parler, dis quelque chose !")
            return
        }
        let answerFound = false
        let finalAnswer = ""
        let answered = false
        this.seuils.forEach((seuil) => {
            const rl = readline.createInterface({
                input: fs.createReadStream(path.join(__dirname, "QR.txt")),
                crlfDelay: Infinity
            });
            rl.on("line", (content) => {
                if (!content.includes("=") || answerFound)
                    return
                const line = content.split("=")
                const phrase = line[0].toLowerCase().trim()
                const answer = line[1].trim()
                // @ts-ignore There is no ratio() in type
                const similitude = new SequenceMatcher(null, text, phrase).ratio();
                if (similitude >= seuil) {
                    answerFound = true
                    finalAnswer = answer
                    rl.close()
                }
            })
            rl.on("close", () => {
                if (answered)
                    return
                if (finalAnswer != "") {
                    message.reply(finalAnswer)
                } else {
                    message.reply("Désolé, je n'ai pas compris votre phrase. Elle a été enregistrée pour une utilisation future.")
                    const channel = this.module.bot.client.channels.cache.get(Config.QUESTION_CHANNEL_ID)
                    if (channel && channel.isTextBased()) {
                        channel.send(`Nouvelle question posée à Emira : ${text}`)
                    }
                }
                answered = true
            })
        })
    }
    removeFirstWord(str: string) {
        const indexOfSpace = str.indexOf(' ');

        if (indexOfSpace === -1) {
            return '';
        }

        return str.slice(indexOfSpace + 1);
    }
}
