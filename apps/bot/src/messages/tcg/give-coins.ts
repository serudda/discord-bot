import type { Message } from '../../common';
import dedent from 'dedent';

export const giveCoinsMsg: Message = {
  title: '🎉 ¡Has dado monedas! 🎉',
  description: dedent`
      ============================================
      
      ¡<@{senderId}> ha dado **{coins}** monedas a <@{recipientId}>!
      
      ============================================
    `,
  color: '#FFD700',
};
