import { ComponentType } from './component';
import { Client } from 'discord.js';

export type ClientWithComponents = Client & {
  [key in ComponentType]: Map<string, any>;
};
