import type { Message } from '../../common';
import dedent from 'dedent';

export const buyPackMsg: Message = {
  title: '🎉 ¡Has comprado un sobre! 🎉',
  description: dedent`
      ============================================
      
      Has comprado un sobre de 3 cartas.
      - Tienes **{packs}** sobres sin abrir.
      - Tu nuevo saldo es de **{coins}** monedas.

      Para abrir un sobre, usa el comando \`/open-pack\`.
      
      ============================================
    `,
  color: '#FFD700',
};
