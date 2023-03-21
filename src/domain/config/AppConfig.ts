import { GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { RepositoryConfig } from '../../lib/types';

export enum RepositoryType
{
    STORAGE = 'storage',
    COMMUNICATION = 'communication',
    AI = 'ai',
}

export type ModuleConfig = {
    name: string;
    properties: any;
};

class AppConfig
{
    private static _instance: AppConfig;

    intents: number[] = [ GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds ];
    private readonly _modules: ModuleConfig[];
    private readonly _repositories: RepositoryConfig[];

    private constructor ()
    {
        const rawData = fs.readFileSync( path.resolve( __dirname ) + '/config.json', 'utf8' );
        const configData = JSON.parse( rawData );

        this._modules = configData.modules;
        this._repositories = configData.repositories;
    }

    static getInstance (): AppConfig
    {
        if ( !AppConfig._instance )
        {
            AppConfig._instance = new AppConfig();
        }

        return AppConfig._instance;
    }

    get modules (): ModuleConfig[]
    {
        return this._modules;
    }

    get repositories (): RepositoryConfig[]
    {
        return this._repositories;
    }
    getRepositoryByType ( type: RepositoryType ): RepositoryConfig
    {
        const repo = this._repositories.find( ( repo ) => repo.type === type );
        if ( !repo )
        {
            throw new Error( `Repository of type '${ type }' not found` );
        }
        return repo;
    }

    getModuleByName ( name: string ): ModuleConfig
    {
        const module = this._modules.find( ( module ) => module.name === name );
        if ( !module )
        {
            throw new Error( `Module with name '${ name }' not found` );
        }
        return module;
    }
}

export const Config = AppConfig.getInstance();