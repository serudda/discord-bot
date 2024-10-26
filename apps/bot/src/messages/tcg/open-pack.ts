import type { Message } from '../../common';
import dedent from 'dedent';

export const openPackMsg: Message = {
  title: 'Has abierto un sobre',
  description: dedent`
      ============================================
      
      ***<@{discordId}> acaba de abrir un sobre***
      Le quedan **{packs}** sobres sin abrir.
      Ver colección: {url}
      
      ============================================
    `,
  color: '#FFD700',
};
