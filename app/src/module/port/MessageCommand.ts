import { BaseInteraction, CacheType, CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import ModuleInterface from "./Module";

export default interface MessageCommandInterface {
    module: ModuleInterface
    startString: string
    execute(message: Message):void
}