const Discord = require('discord.js');
const client = new Discord.Client();
const recordsServerName = 'Bot Records'; //records of bot

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  const recordsServer = await client.guilds.cache.find(server => server.name === recordsServerName);
  if (!recordsServer) {
    console.log(`Server "${recordsServerName}" does not exist. Creating it.`);
    const newServer = await client.guilds.create(recordsServerName, { region: 'us-central' });
    console.log(`Server "${recordsServerName}" created with ID ${newServer.id}.`);
  } else {
    console.log(`Found server "${recordsServerName}" with ID ${recordsServer.id}.`);
  }
});

client.on('message', message => {
  if (!message.content.startsWith('?') || message.guild.name !== recordsServerName) return; 
  const args = message.content.slice(1).trim().split(/ +/); 
  const command = args.shift().toLowerCase(); 

  if (!message.member.hasPermission('MANAGE_MESSAGES')) {
    return message.reply('You do not have permission to use this bot.'); // server modss only
  }

  if (command === 'deafen') {
    const member = message.mentions.members.first(); // mentioned member
    const minutes = parseInt(args[0]); // deafen duration in MINUTES
    if (!member || !minutes) {
      return message.reply('Invalid command usage. Usage: `?deafen [user] [minutes]`');
    }
    member.voice.setDeaf(true, 'Deafened by bot'); 
    message.channel.send(`${member.user.username} has been deafened for ${minutes} minutes.`);
    setTimeout(() => {
      member.voice.setDeaf(false, 'Deafened time expired'); // Un-deafen after X minutes
      message.channel.send(`${member.user.username} has been un-deafened.`);
    }, minutes * 60 * 1000);
  }

  if (command === 'warn') {
    const member = message.mentions.members.first(); 
    const reason = args.slice(1).join(' '); 
    if (!member) {
      return message.reply('Invalid command usage. Usage: `?warn [user] [reason]`');
    }
    recordsServer.systemChannel.send(`${member.user.username} has been warned${reason ? ` for \`${reason}\`` : ''}.`); 
    message.channel.send(`${member.user.username} has been warned${reason ? ` for \`${reason}\`` : ''}.`);
  }

  if (command === 'ban') {
    const member = message.mentions.members.first(); 
    const days = parseInt(args[1]); // ban duration in DAYS
    const reason = args.slice(2).join(' '); // ban reason (not mandatory)
    if (!member) {
      return message.reply('Invalid command usage. Usage: `?ban [user] [days] [reason]`');
    }
    if (!days) {
      member.ban({ reason: reason || 'Banned by bot' }); // Permanently ban
client.login('DISCORD_BOT_TOKEN');
