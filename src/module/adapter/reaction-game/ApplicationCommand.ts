import MessageComponentHandler from "../../../domain/handler/MessageComponent";
import ApplicationCommandInterface from "../../port/ApplicationCommand";
import { CacheType, CommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import ReactionGameModule from ".";
import { Config } from "./Config";

export default class ApplicationCommand implements ApplicationCommandInterface
{
    name = "reaction";
    description = "Démarre un jeu de réaction";
    messageComponentHandler: MessageComponentHandler = new MessageComponentHandler();
    module: ReactionGameModule;

    constructor ( module: ReactionGameModule )
    {
        this.module = module;
    }

    getSlashCommand ()
    {
        const slashCommand = new SlashCommandBuilder();
        slashCommand.setName( this.name );
        slashCommand.setDescription( this.description );
        return slashCommand;
    }

    async execute ( interaction: CommandInteraction ): Promise<void>
    {
        this.module.createNewReactionMessage( interaction );
    }

    canExecute ( interaction: CommandInteraction ): boolean
    {
        const member = interaction.member as GuildMember;
        const canExecute = member.roles.cache.some( r => Config.EXECUTER_ROLES.includes( r.id ) );
        return canExecute;
    }

}