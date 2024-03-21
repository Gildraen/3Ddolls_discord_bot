import { BaseInteraction, CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandInterface from './Command';
import ModuleInterface from "./Module";

export default interface ApplicationCommandInterface extends CommandInterface
{
    getSlashCommand (): SlashCommandBuilder;

    execute ( interaction: CommandInteraction ): Promise<void>;
    canExecute ( interaction: CommandInteraction ): boolean;
}