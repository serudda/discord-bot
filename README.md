
# Discord Bot Project

This project sets up a Discord bot using **Node.js**, **Prisma**, and **pnpm**. Follow the instructions below to install, configure, and run the bot in your development environment.

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Discord Developer Portal Setup](#discord-developer-portal-setup)
- [License](#license)

---

## Requirements

Make sure the following tools are installed on your machine:

- **Node.js**: Install the latest stable version of Node.js. You can download it from [here](https://nodejs.org/).
- **pnpm**: If you haven't installed pnpm, follow the installation steps below.
- **Discord Developer Account**: You will need access to the [Discord Developer Portal](https://discord.com/developers/docs/intro) to create a bot and obtain your bot token.

---

## Installation

### 1. Clone the Repository

Clone this repository to your local machine using the following command:

```sh
git clone https://github.com/serudda/discord-bot.git
cd discord-bot
```

### 2. Install pnpm (if you don't have it installed globally)

You can install pnpm globally using npm with the following command:

```sh
npm install -g pnpm
```

### 3. Install Dependencies

Install all the project dependencies by running:

```sh
pnpm install
```

This will download and install all required packages defined in your `package.json`.

---

## Database Setup

### 1. Prisma Configuration

Make sure you have configured the Prisma connection in the `.env` file with your database settings.

### 2. Generate Prisma Client

After setting up your database connection, generate the Prisma client by running:

```sh
pnpm db:generate
```

This will create the Prisma client necessary to interact with your database.

---

## Running the Project

Once all dependencies are installed and the Prisma client is generated, you can start the bot in development mode using the following command:

```sh
pnpm dev
```

This will start the bot locally, allowing you to test its functionality.

---

## Discord Developer Portal Setup

If you haven’t already created a Discord bot, follow these steps:

1. Visit the [Discord Developer Portal](https://discord.com/developers/docs/intro).
2. Create a new application and add a bot to it.
3. Copy the **bot token** from the application settings.
4. Set up your `.env` file with the following content:

   ```sh
   DISCORD_TOKEN=your-bot-token-here
   ```

   Replace `your-bot-token-here` with the actual bot token you copied from the developer portal.

---

## License

This project is licensed under the [MIT License](./LICENSE). Feel free to use, modify, and distribute as per the terms of the license.

---

## Contributing

If you would like to contribute to the project, feel free to open a pull request or issue.
