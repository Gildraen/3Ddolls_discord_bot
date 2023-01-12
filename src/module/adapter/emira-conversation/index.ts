import { CommandInteraction, ButtonStyle, ActionRowBuilder, ButtonBuilder, MessageActionRowComponentBuilder, InteractionResponse, ComponentType, ButtonInteraction } from "discord.js";
import { CollectorEvent } from "domain/event/CollectorEvent";
import User from "domain/model/User";
import { Bot } from "Bot";
import ModuleInterface from "@module/port/Module";
import MessageCommand from "./MessageCommand";

export default class EmiraConversationModule implements ModuleInterface {

    bot: Bot;
    messageCommand: MessageCommand;

    constructor(bot: Bot) {
        this.bot = bot
        this.messageCommand = new MessageCommand(this)
        bot.messageCommandHandler.commands.push(this.messageCommand)
    }
}