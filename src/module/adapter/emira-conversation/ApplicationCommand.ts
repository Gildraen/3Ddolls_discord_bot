import { ApplicationCommandInterface } from "@module/port";
import EmiraConversationModule from ".";
import { SlashCommandBuilder, CommandInteraction, CacheType, ChatInputCommandInteraction } from "discord.js";

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
        slashCommand.addStringOption( option =>
            option.setName( 'type' )
                .setDescription( 'Select type of picture' )
                .setRequired( true )
                .addChoices( { name: "Nude", value: "nude" } )
        );
        return slashCommand;
    }
    execute ( interaction: ChatInputCommandInteraction ): void
    {
        this.module.sendPic( interaction );
    }

    canExecute ( interaction: CommandInteraction ): boolean
    {
        return true;
    }
}