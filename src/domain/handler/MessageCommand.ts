import MessageCommandInterface from "../../module/port/MessageCommand";
import { GuildBasedChannel, GuildChannel, Message } from "discord.js";

export default class MessageCommandHandler
{

    commands: MessageCommandInterface[] = [];

    handle ( message: Message ): void
    {
        this.commands.forEach( element =>
        {
            if ( element.canExecute( message ) )
            {
                element.execute( message )
                    .catch( error =>
                    {
                        console.log( error );
                    }
                    );
            }
        } );
    }

}