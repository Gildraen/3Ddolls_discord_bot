import { Client, InteractionType, Interaction } from "discord.js";
import { ClientEvent } from "./domain/event";
import { ApplicationCommandHandler, MessageComponentHandler } from "./domain/handler";
import MessageCommandHandler from "./domain/handler/MessageCommand";
import { Config } from './domain/config/AppConfig';
import Lib from './lib';
import { RepositoryType } from './lib/types';

export class Bot
{
    client: Client;
    token: string;
    applicationHandler: ApplicationCommandHandler = new ApplicationCommandHandler();
    messageComponentHandler: MessageComponentHandler = new MessageComponentHandler();
    messageCommandHandler: MessageCommandHandler = new MessageCommandHandler();

    constructor ()
    {
        this.client = new Client( { intents: Config.intents } );
        this.token = Config.getRepositoryByType( RepositoryType.COMMUNICATION ).properties.token;
    }

    initEvents ()
    {
        return new Promise( ( resolve, reject ) =>
        {
            this.client.on( ClientEvent.READY, () => this.finalizeReady() );
            this.client.on( ClientEvent.ERROR, ( e: { message: any; } ) => console.error( e.message ) );
            this.client.on( ClientEvent.INTERACTION_CREATE, ( interaction: Interaction ) =>
            {
                switch ( interaction.type )
                {
                    case InteractionType.ApplicationCommand:
                        this.applicationHandler.handle( interaction );
                        break;
                    case InteractionType.ApplicationCommandAutocomplete:
                        console.log( "application autocomplete" );
                        break;
                    case InteractionType.MessageComponent:
                        // this.messageComponentHandler.handle(interaction)
                        console.log( "MessageComponent" );
                        break;
                    case InteractionType.ModalSubmit:
                        console.log( "ModalSubmit" );
                        break;
                    default:
                        break;
                }
            } );
            this.client.on( ClientEvent.MESSAGE_CREATE, ( message: any ) =>
            {
                this.messageCommandHandler.handle( message );
            } );
            resolve( null );
        } );
    }

    initModules ()
    {
        return new Promise( ( resolve, reject ) =>
        {
            const modules = Config.modules;
            const promises: Promise<any>[] = [];
            modules.forEach( ( module ) =>
            {
                const promise = new Promise( ( resolve, reject ) =>
                {
                    import( '@module/adapter/' + module.name ).then( ( module_class ) =>
                    {
                        const command_class = new module_class.default( this, module.properties );
                        resolve( null );
                    } );
                } );
                promises.push( promise );
            } );

            Promise.all( promises ).then( ( result ) =>
            {
                resolve( null );
            } );
        } );
    }

    initLib ()
    {
        return new Promise<void>( ( resolve, reject ) =>
        {
            Lib.initRepositories( Config.repositories ).then( () =>
            {
                resolve();
            } );

        }
        );
    }


    finalizeReady ()
    {
        console.log( "ready" );
    }

    connect ()
    {
        console.log( 'logging...' );
        const promises = [ this.initEvents(), this.initModules(), this.initLib() ];
        Promise.all( promises ).then( ( result ) =>
        {
            this.client.login( this.token );
        } ).catch( ( err ) =>
        {
            console.log( JSON.stringify( err ) );
            this.client.login( this.token );
        } );
    }

    deploy ()
    {
        this.initModules().then( () =>
        {
            this.applicationHandler.deploy();
        } );
    }
}

