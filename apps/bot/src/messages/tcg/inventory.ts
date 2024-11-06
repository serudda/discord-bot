import type { Message } from '../../common';
import dedent from 'dedent';

export const inventoryMsg: Message = {
  title: 'Ver tu inventario',
  description: dedent`
      ============================================
      
      Este es tu inventario actual:
      <{coinEmoji}> **{coins}** monedas
      <{gemEmoji}> **{gems}** gemas
      <{boosterEmoji}> **{packs}** sobres sin abrir

      ============================================
    `,
  color: '#FFD700',
};
