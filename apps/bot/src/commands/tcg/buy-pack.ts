/*
const command = {
  data: new SlashCommandBuilder().setName('buy-pack').setDescription('Compra un sobre de 5 cartas'),
  execute: async (interaction: CommandInteraction) => {
    const userId = interaction.user.id;

    try {
      // Llamar al endpoint de tRPC para comprar el paquete
      // const pack = await trpc.mutation('cards.buyPack', { userId });
      const pack = await api.

      if (pack && pack.cards.length > 0) {
        let response = '🎉 ¡Has comprado un paquete y obtenido las siguientes cartas! 🎉\n';
        pack.cards.forEach((card: any) => {
          response += `- **${card.name}** (Rareza: ${card.rarity})\n`;
        });
        await interaction.reply(response);
      } else {
        await interaction.reply('No tienes suficientes coins para comprar un paquete.');
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Hubo un error al comprar el paquete. Por favor, intenta nuevamente.');
    }
  },
};

export default command;
*/
