import { CommandInteraction, ButtonStyle, ActionRowBuilder, ButtonBuilder, MessageActionRowComponentBuilder, InteractionResponse, ComponentType, ButtonInteraction } from "discord.js";
import { CollectorEvent } from "../../../domain/event/CollectorEvent";
import User from "../../../domain/model/User";
import { Bot } from "../../../Bot";
import ApplicationCommand from "./ApplicationCommand";
import ModuleInterface from "../../port/Module";
import PointsManager from "./PointsManager";

export default class ReactionGameModule implements ModuleInterface
{

    bot: Bot;
    players: User[] = [];
    applicationCommand: ApplicationCommand;
    pointsManager = new PointsManager();

    constructor ( bot: Bot )
    {
        this.bot = bot;
        this.applicationCommand = new ApplicationCommand( this );
        bot.applicationHandler.commands.push( this.applicationCommand );
    }


    createNewReactionMessage ( interaction: CommandInteraction )
    {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId( 'primary' )
                    .setLabel( 'Je veux des points !' )
                    .setStyle( ButtonStyle.Primary ),
            );
        interaction.reply(
            {
                content: "Jeu de réaction ! Appuyez sur le bouton pour gagner quelques points !",
                components: [ row ]
            }
        ).then( ( message: InteractionResponse ) =>
        {
            this.pointsManager.createGame( message );
            const collector = message.createMessageComponentCollector( { componentType: ComponentType.Button, filter: () => { return true; }, time: 60000 } );
            collector.on( CollectorEvent.COLLECT, ( event: ButtonInteraction ) =>
            {
                this.pointsManager.givePoints( message, event ).then( () =>
                {

                    interaction.editReply(
                        {
                            content: "Jeu de réaction ! Appuyez sur le bouton pour gagner quelques points ! Joueurs ayant déjà cliqués : " + this.pointsManager.getPlayerNumber( message )
                        }
                    ).catch( ( error ) =>
                    {
                        console.log( JSON.stringify( error ) );
                    } );
                } ).catch( ( error ) =>
                {
                    console.log( JSON.stringify( error ) );
                } );
            } );
            collector.on( CollectorEvent.END, ( collected ) =>
            {
                this.pointsManager.endGame( message );
                interaction.followUp(
                    {
                        content: "Jeu de réaction terminé, restez à l'affut pour le prochain !",
                    }
                ).catch();
            } );
        } ).catch( ( error ) =>
        {
            console.log( JSON.stringify( error ) );
        } );
    }
}