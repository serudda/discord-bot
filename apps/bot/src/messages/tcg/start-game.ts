import type { Message } from '../../common';
import dedent from 'dedent';

export const startGameMsg: Message = {
  title: '¡Bienvenido a la colección de cartas!',
  description: dedent`
      ============================================

      **Bienvenido al juego**
      ¡Ya puedes empezar a coleccionar cartas!

      Este es tu nuevo balance:
      <{coinEmoji}> **{coins}** monedas
      <{gemEmoji}> **{gems}** gemas.

      -----------------------------------------------------
      
      Estos son los comandos que puedes usar:
      - \`/buy-pack\` para comprar sobres de cartas.
      - \`/open-pack\` para abrir un sobre de cartas.
      - \`/inventory\` para ver que tienes en tu inventario.
      - \`/collection\` para ver tu colección.
      - \`/give-coins\` para dar monedas a otro usuario.
      - \`/help\` para ver la lista de comandos y aprender a jugar.

      ============================================
    `,
  color: '#FFD700',
};
