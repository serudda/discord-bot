import type { Message } from '../../common';
import dedent from 'dedent';

export const startGameMsg: Message = {
  title: '¡Bienvenido a la colección de cartas!',
  description: dedent`
      ============================================

      **Bienvenido al juego**
      ¡Ya puedes empezar a coleccionar cartas!
      Te hemos dado **{coins}** monedas de regalo.
      También te hemos dado **{gems}** gemas de regalo.
      
      Estos son los comandos que puedes usar:
      - \`/buy-pack\` para comprar sobres de cartas.
      - \`/wallet\` para ver tu balance de monedas.
      - \`/collection\` para ver tu colección.
      - \`/give-coins\` para dar monedas a otro usuario.

      ============================================
    `,
  color: '#FFD700',
};
