import { Bot } from "Bot";
import ModuleInterface from "@module/port/Module";
import MessageCommand from "./MessageCommand";
import ApplicationCommand from "./ApplicationCommand";
import { ChatInputCommandInteraction } from "discord.js";
import path from "path";
import { Config } from "./Config";
import { ImgHandler } from './img';

export default class EmiraConversationModule implements ModuleInterface
{
    bot: Bot;
    messageCommand: MessageCommand;
    applicationCommand: ApplicationCommand;
    imgHandler: ImgHandler = new ImgHandler();

    constructor ( bot: Bot )
    {
        this.bot = bot;
        this.messageCommand = new MessageCommand( this );
        this.applicationCommand = new ApplicationCommand( this );
        bot.messageCommandHandler.commands.push( this.messageCommand );
        bot.applicationHandler.commands.push( this.applicationCommand );
    }

    sendPic ( interaction: ChatInputCommandInteraction )
    {
        let type;
        try
        {
            type = interaction.options.get( "type", true );
        } catch ( error )
        {
            interaction.reply( { content: "Veuillez choisir un type de pic", ephemeral: true } );
            return;
        }
        if ( typeof type.value !== "string" )
        {
            interaction.reply( { content: "Veuillez choisir un type de pic autorisé", ephemeral: true } );
            return;
        }
        const file = this.imgHandler.getImg( type.value );
        try
        {
            interaction.reply( { files: [ "file" ] } );
        } catch {
            const channel = this.bot.client.channels.cache.get( Config.QUESTION_CHANNEL_ID );
            if ( channel && channel.isTextBased() )
            {
                channel.send( `Fichier manquant : ${ file }` );
            }
        }
    }

}