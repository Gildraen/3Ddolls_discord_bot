import { BaseInteraction, CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import ModuleInterface from "./Module";

export default interface ApplicationCommandInterface {
    name: string
    description: string 
    module: ModuleInterface
    getSlashCommand(): SlashCommandBuilder
    execute(interaction: CommandInteraction):void
    canExecute(interaction: CommandInteraction): boolean;
}