import MessageCommandInterface from "@module/port/MessageCommand"
import { GuildBasedChannel, GuildChannel, Message } from "discord.js"

export default class MessageCommandHandler {

    commands: MessageCommandInterface[] = []

    handle(message:Message): void {
        const firstWord = message.content.split(' ')[0].toLowerCase()
        this.commands.forEach(element => {
            if (element.startString == firstWord) {
                element.execute(message)
            }
        });
    }

}