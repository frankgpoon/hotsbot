
import { loggers, transports } from 'winston';
import { format } from 'logform';
import { Client, ActivityType, Events, GatewayIntentBits } from 'discord.js';



const DISCORD_TOKEN: string = process.env.HOTSBOT_DISCORD_TOKEN !== undefined ? process.env.HOTSBOT_DISCORD_TOKEN : '';

const HOTS_CHANNEL_ID = '911088515624886312';
const HOTTIES_ROLE_ID = '981533066088558682';


const logger = loggers.add('global_logger');
logger.add(new transports.Console());
logger.format = format.cli();
logger.level = 'info';


// create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});
logger.info('Starting up Adobot');


// logging stuff when adobot signs in
client.on(Events.ClientReady, () => {
  logger.info(`Logged in as ${client.user!.tag}!`);
});


client.on(Events.Error, (err) => {
  logger.error(err);
  client.destroy();
  process.exit();
});

client.on(Events.MessageCreate, async (message) => {
  if (message.channelId === HOTS_CHANNEL_ID && message.content === '🔥') {
      message.reply(`<@&${HOTTIES_ROLE_ID}>`);
  }
});


// login with given token
client.login(DISCORD_TOKEN);


process.on('SIGINT', () => {
  logger.info('Hotsbot is shutting down');

  client.destroy();
  process.exit();
});
