import type { Command } from './command';
import { type Collection } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
    buttons: Collection<string, unknown>;
    dropdowns: Collection<string, unknown>;
    modals: Collection<string, unknown>;
  }
}
