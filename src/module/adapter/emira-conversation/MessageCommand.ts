import MessageCommandInterface from "../../port/MessageCommand";
import { Message, TextChannel } from "discord.js";
import EmiraConversationModule from ".";
import { SequenceMatcher } from "difflib";
import { Config } from "./Config";
import qrFile from "./QR.json";
import OpenAIService from "../../../domain/service/OpenAI";
import { StorageRepository } from '../../../lib/repositories/storage';
import lib from '../../../lib';
import { RepositoryType } from '../../../lib/types';

type QRItem = {
    question: string;
    answer: string;
    command: string;
};
export default class MessageCommand implements MessageCommandInterface
{
    name: string = "emira";
    description: string = "Emira conversation";
    module: EmiraConversationModule;
    startString: string = "emira";
    floors = [ 0.9, 0.8 ];
    freeChannelId = Config.FREE_CHANNEL_ID;
    openAiService = new OpenAIService();

    constructor ( module: EmiraConversationModule )
    {
        this.module = module;
    }
    canExecute ( message: Message<boolean> ): boolean
    {
        if ( message.author.bot )
        {
            return false;
        }
        const firstWord = message.content.split( ' ' )[ 0 ].toLowerCase();
        if ( firstWord == this.startString )
        {

            return true;
        }
        if ( message.channelId == this.freeChannelId )
        {

            return true;
        }
        return false;
    }
    async execute ( message: Message<boolean> ): Promise<void>
    {
        const firstWord = message.content.split( ' ' )[ 0 ].toLowerCase();
        let text = message.content;
        if ( firstWord == this.startString )
            text = this.removeFirstWord( message.content );

        if ( text == "" )
        {
            message.reply( "Si tu veux me parler, dis quelque chose !" );
            return;
        }
        const finalItem = await this.checkAnswers( text );

        if ( finalItem != null )
        {
            await this.sendAnswer( message, finalItem, text );
        } else
        {
            await this.sendAIAnswer( message, text );
        }



    }

    async checkAnswers ( text: string ): Promise<QRItem | null>
    {
        const qrFile = await lib.getRepository<StorageRepository>( RepositoryType.STORAGE ).getText( "modules/emira-conversation/ai/QR.json" );
        const parsedQrFile: QRItem[] = JSON.parse( qrFile );
        let answerFound = false;
        let finalItem = null;
        this.floors.some( ( floor ) =>
        {
            if ( answerFound )
            {
                return true;
            }
            let last_similitude = 0;
            parsedQrFile.forEach( ( item: QRItem ) =>
            {
                // @ts-ignore There is no ratio() in type
                const similitude = new SequenceMatcher( null, text, item.question ).ratio();
                if ( similitude >= floor && similitude > last_similitude )
                {
                    last_similitude = similitude;
                    answerFound = true;
                    finalItem = item;
                }
            } );

        } );
        return finalItem;
    }

    async sendAnswer ( message: Message<boolean>, finalItem: QRItem, text: string ): Promise<void>
    {
        message.reply( finalItem.answer );
        if ( finalItem.command == null || finalItem.command == "" )
            return;
        const file = await this.module.imgHandler.getImg( finalItem.command );
        try
        {

            ( message.channel as TextChannel ).send( { files: [ file ] } );
        } catch ( error )
        {
            const channel = this.module.bot.client.channels.cache.get( Config.QUESTION_CHANNEL_ID );
            // Hack because there is no way to check if channel is TextChannel
            ( channel as TextChannel ).send( `Fichier manquant : ${ file }` );
        }
    }

    async sendAIAnswer ( message: Message<boolean>, text: string ): Promise<void>
    {
        const storageRepository = lib.getRepository<StorageRepository>( RepositoryType.STORAGE );
        const aiContextPath = "modules/emira-conversation/ai/emira_context.txt";

        const context = await storageRepository.getText( aiContextPath );
        const result = await this.openAiService.send( context, text );
        message.reply( result );
        const channel = this.module.bot.client.channels.cache.get( Config.QUESTION_CHANNEL_ID );
        if ( !channel ) throw new Error( "Question Channel not found" );

        // Hack because there is no way to check if channel is TextChannel
        ( channel as TextChannel ).send( `Nouvelle question posée à Emira : ${ text } - Réponse de OpenAI : ${ result }` );
        qrFile.push( { "question": text, "answer": result, "command": "" } );
    }


    removeFirstWord ( str: string ): string
    {
        const indexOfSpace = str.indexOf( ' ' );

        if ( indexOfSpace === -1 )
        {
            return '';
        }

        return str.slice( indexOfSpace + 1 );
    }
}
