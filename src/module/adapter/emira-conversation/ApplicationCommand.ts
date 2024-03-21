import { ApplicationCommandInterface } from "../../port";
import EmiraConversationModule from ".";
import { SlashCommandBuilder, CommandInteraction, CacheType, ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import { ImgType } from './ImgHandler';

export default class ApplicationCommand implements ApplicationCommandInterface
{
    name = "sendpic";
    description = "Envoie une image d'Emira";
    module: EmiraConversationModule;

    constructor ( module: EmiraConversationModule )
    {
        this.module = module;
    }

    getSlashCommand (): SlashCommandBuilder
    {
        const slashCommand = new SlashCommandBuilder();
        slashCommand.setName( this.name );
        slashCommand.setDescription( this.description );
        // I want a mapper here from ImgType to {name, value}
        const option = new SlashCommandStringOption();
        option.setName( 'type' ).setDescription( 'Select type of picture' ).setRequired( true );
        Object.entries( ImgType ).map( ( [ key, value ] ) =>
        {
            option.addChoices( { name: key, value: value } );
        } );
        slashCommand.addStringOption( option );
        return slashCommand;
    }
    async execute ( interaction: ChatInputCommandInteraction ): Promise<void>
    {
        this.module.sendPic( interaction );
    }

    canExecute ( interaction: CommandInteraction ): boolean
    {
        return true;
    }
}