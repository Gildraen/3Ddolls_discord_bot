import { Config } from "./Config";
import { ButtonInteraction, CommandInteraction, ComponentType, InteractionResponse, TextChannel, resolveColor } from "discord.js";
import { CollectorEvent } from "../../../domain/event/CollectorEvent";
import { Bot } from "../../../Bot";

type game = {
    id: string,
    currentPoints: number,
    playerNumber: number,
    isEnded: boolean,
    history: Map<string, number>;
};


export default class PointsManager
{

    points: { [ key: string ]: { [ key: string ]: number; }; } = {};


    games = new Map<string, game>();

    createGame ( interaction: InteractionResponse )
    {
        const gameId = interaction.id;
        this.games.set( gameId, {
            id: gameId,
            currentPoints: this.getCurrentPoints( 0 ),
            playerNumber: 0,
            isEnded: false,
            history: new Map<string, number>()
        } );
    }

    givePoints ( message: InteractionResponse, event: ButtonInteraction )
    {
        return new Promise( ( resolve, reject ) =>
        {
            const guild = event.guildId;
            const userId = event.user.id;
            const interactionId = event.message.id;
            const gameId = message.id;
            const game = this.games.get( gameId );
            if ( !guild || !game )
                return;
            const currentPoints = this.getCurrentPoints( game.playerNumber );
            if ( !this.points[ guild ] )
            {
                this.points[ guild ] = {};
            }
            if ( !this.points[ guild ][ userId ] )
            {
                this.points[ guild ][ userId ] = currentPoints;
            } else
            {
                this.points[ guild ][ userId ] += currentPoints;
            }

            if ( game.history.get( userId ) )
            {
                event.reply( { content: "Vous avez déjà cliqué, attendez le prochain jeu", ephemeral: true } );
                resolve( null );
            } else
            {
                game.history.set( userId, currentPoints );
                game.playerNumber++;
                event.reply( { content: "Vous venez de gagner " + currentPoints + " points. Votre total est de : " + this.points[ guild ][ userId ] + " points.", ephemeral: true } ).then( ( response ) =>
                {
                    resolve( null );
                } );
            }
        } );
    }

    getPlayerNumber ( message: InteractionResponse )
    {
        return this.games.get( message.id )?.playerNumber || 0;
    }


    getCurrentPoints ( playerNumber: number = 0 )
    {
        return Config.POINTS[ playerNumber ] || 1;
    }

    endGame ( message: InteractionResponse )
    {
        const history = this.games.get( message.id )?.history;
        if ( history )
        {
            const channel = message.client.channels.cache.get( Config.COMMAND_CHANNEL_ID );
            if ( channel && channel.isTextBased() )
            {
                history.forEach( ( value, key ) =>
                {
                    try
                    {
                        // Hack because there is no way to check if channel is TextChannel
                        (channel as TextChannel).send( `/giverep user:${ key } num:${ value }` );
                    }
                    catch ( error )
                    {
                        console.log( JSON.stringify( error ) );
                    }
                    
                } );
            }
        }
    }
}