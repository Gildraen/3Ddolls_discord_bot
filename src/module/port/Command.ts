import { Base, CommandInteraction, Message } from 'discord.js';
import ModuleInterface from './Module';

export default interface CommandInterface
{
    name: string;
    description: string;

    module: ModuleInterface;
    canExecute ( data: Base ): boolean;

    execute ( data: Base ): Promise<void>;

}