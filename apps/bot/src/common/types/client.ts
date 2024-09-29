import { Collection } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, any>;
    buttons: Collection<string, any>;
    dropdowns: Collection<string, any>;
    modals: Collection<string, any>;
  }
}
