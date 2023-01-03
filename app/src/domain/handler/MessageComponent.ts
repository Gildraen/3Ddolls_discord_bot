import { MessageComponentInteraction } from "discord.js";

export default class MessageComponentHandler {


    handle(interaction: MessageComponentInteraction): void {
        console.log('here')
    }

}