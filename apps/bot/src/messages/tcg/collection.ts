import type { Message } from '../../common';
import dedent from 'dedent';

export const collectionMsg: Message = {
  title: 'Ver tu colección',
  description: dedent`
      ============================================

       **¡Aquí está la colección de cartas de <@{discordId}>!**
      👉🏻 [Accede a la colección](<{url}>)

      ============================================
    `,
  color: '#FFD700',
};
