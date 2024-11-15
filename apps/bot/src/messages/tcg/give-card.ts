import type { Message } from '../../common';
import dedent from 'dedent';

export const giveCardMsg: Message = {
  title: '🎉 ¡Has dado cartas! 🎉',
  description: dedent`
      ============================================
      
      ¡<@{senderId}> ha dado la carta **{cardName}** #{cardNumber} a <@{recipientId}>!
      
      ============================================
    `,
  color: '#FFD700',
};
