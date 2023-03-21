
import { GatewayIntentBits } from "discord.js";
import { RepositoryConfig, RepositoryType } from '../../lib/types';
import * as config from "./config.json";

type BotConfig = {
    modules: string[];
    repositories: RepositoryConfig[];
};
export default class Config
{
    // botConfig: BotConfig = config as BotConfig;
    // allIntents: number = 7796;
    // intents: number[] = [ GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds ];

    // getRepositoryByType ( type: RepositoryType )
    // {
    //     const repo = this.botConfig.repositories.find( ( repo ) => repo.type === type );
    //     if ( !repo ){
    //         throw new Error( `Repository not found for type: ${ type }` );
    //     }
    //     return repo;
    // }
}

