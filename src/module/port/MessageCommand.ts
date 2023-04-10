import { Message } from 'discord.js';
import CommandInterface from './Command';
import ModuleInterface from "./Module";

export default interface MessageCommandInterface extends CommandInterface
{
    startString: string;
    execute ( message: Message ): Promise<void>;
    canExecute ( message: Message ): boolean;
}