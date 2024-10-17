import type { Message } from '../../common';
import dedent from 'dedent';

export const walletMsg: Message = {
  title: 'Ver tu billetera',
  description: dedent`
      ============================================
      
      ¡<@{userId}> tienes **{coins}** monedas en tu billetera!
      
      ============================================
    `,
  color: '#FFD700',
};
