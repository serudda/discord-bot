import type { Message } from '../../common';
import dedent from 'dedent';

export const giveCoinsMsg: Message = {
  title: '🎉 ¡Has dado monedas! 🎉',
  description: dedent`
      ============================================
      
      ¡<@{senderId}> ha dado **{coins}** monedas a <@{recipientId}>!
      Nuevo balance es: **{balance}** monedas.
      
      ============================================
    `,
  color: '#FFD700',
};
