import type { Message } from '../../common';
import dedent from 'dedent';

export const buyPackMsg: Message = {
  title: '🎉 ¡Has comprado un sobre! 🎉',
  description: dedent`
      ============================================
      
      ***🎉 ¡<@{discordId}> ha comprado un sobre de cartas! 🎉***

      - Tiene **{packs}** sobres sin abrir.

      Para abrir un sobre, usa el comando \`/open-pack\`.
      
      ============================================
    `,
  color: '#FFD700',
};
