// Laden der discord.js library
const Discord = require("discord.js");

// Generieren des Clients
const client = new Discord.Client();

// Laden der config.json Datei, die das Token und den Prefix beinhaltet
const config = require("./config.json");
// config.token beinhaltet das Token
// config.prefix beinhaltet den Prefix

const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : config.host,
  port     : '11234',
  user     : config.user,
  password : config.password,
  database : 'phpMyAdmin',
  charset : 'utf8mb4'
});

client.on("ready", () => {
  // Event, das startet, wenn der Bot sich erfolgreich eingeloggt hat
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Konsolenausgabe
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
  // Ändern des angezeigten Statuses
});

client.on("guildCreate", guild => {
  // Event, wenn der Bot einem neuen Server hinzugefügt wird
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // Event, wenn der Bot von einem Server entfernt wird
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

xpRangeStart = 50
xpRange = 25
// Anfang und Länge des Erfahrungszuweisungsbetrags

client.on("message", async message => {
  // Event, wenn eine Nachricht gesendet wird, auf die der Bot Zugriff hat
  if(message.author.bot) return;
  // Bewirkt, dass der Bot nicht auf andere Bots antwortet (=> Verhindert Botception)

  xpGain = Math.floor(Math.random() * (xpRange + 1)) + parseInt(xpRangeStart, 10);
  console.log(`${xpGain} ${xpRange} ${xpRangeStart}`)
  // Willkür des tatsächlichen Erfahrungszuweisungsbetrags
  //message.reply(xpGain);
  mysql.Members.

  if(!message.content.startsWith(config.prefix)) return;
  // Ignoriert alle Nachrichten, die nicht mit dem Prefix beginnen

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  // Separiert den Befehl in Command und Argumente
  console.log(`${args.length}`);

  if(command === "ping") {
    // Berechnet den Ping zwischen dem Senden und dem Bearbeiten einer Nachricht
    // Der zweite Ping ist die durchschnittliche Latenz zwischen Bot und WebSocket Server
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "xpgain") {
    xpRangeStart = args[0];
    xpRange = args[1] - args[0];
    xpEnd = parseInt(xpRange, 10) + parseInt(xpRangeStart, 10);
    console.log(`${xpRangeStart} ${xpRange} ${xpEnd}`);
    message.reply(`Experience Range set from ${xpRangeStart} to ${xpEnd}`);
  }
  
  if(command === "purge") {
    // Entfernt bis zu 100 Nachrichten eine Nutzers
    
    // Parsing der Nummer an Nachrichten, die entfernt werden sollen
    const deleteCount = parseInt(args[0], 10);
    
    // Bedingungsstellung
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // Entfernen der Nachrichten
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login(config.token);