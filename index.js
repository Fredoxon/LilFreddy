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
  port     : '3306',
  user     : config.user,
  password : config.password,
  database : 'phpMyAdmin',
  charset : 'utf8mb4'
}); // MySQL-Verbindungsdaten

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

xpRangeStart = 20
xpRange = 10
// Anfang und Länge des Erfahrungszuweisungsbetrags

client.on("message", async message => {
  // Event, wenn eine Nachricht gesendet wird, auf die der Bot Zugriff hat
  if(message.author.bot) return;
  // Bewirkt, dass der Bot nicht auf andere Bots antwortet (=> Verhindert Botception)

  xpGain = Math.floor(Math.random() * (xpRange + 1)) + parseInt(xpRangeStart, 10);
  console.log(`xpGain: ${xpGain}; xpRange: ${xpRange}; xpRangeStart ${xpRangeStart};`)
  // Willkür des tatsächlichen Erfahrungszuweisungsbetrags
  message.channel.send(xpGain + " Experience Points to be added.");
  /*connection.connect(err => {
    if(err) throw err;
    console.log("Connected to database!");
    connection.query(`INSERT INTO Member (userID, experience) values (?, ?)`, [message.author.id, xpGain], console.log);
  }); */ // Zugang verweigert auf jedem Port.

  if(!message.content.startsWith(config.prefix)) return;
  // Ignoriert alle Nachrichten, die nicht mit dem Prefix beginnen

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  // Separiert den Befehl in Command und Argumente
  console.log(`amount args: ${args.length};`);

  if(command === "ping") {
    // Berechnet den Ping zwischen dem Senden und dem Bearbeiten einer Nachricht
    // Der zweite Ping ist die durchschnittliche Latenz zwischen Bot und WebSocket Server
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "xpgain") { // Ändern des Erfahrungszuweisungsbereiches
    xpRangeStart = args[0]; // Anfang
    xpRange = args[1] - args[0]; // Länge
    xpEnd = args[1]; // Ende
    console.log(`${xpRangeStart} ${xpRange} ${xpEnd}`);
    message.reply(`Experience Range set from ${xpRangeStart} to ${xpEnd}`); // Bestätigung
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

  if(command === "role") {
    var person;
    if(args[0] === "add") { // Unterbefehl zum Rollen hinzufügen
      const role = message.guild.roles.find('name', `${args[3]}`);
      console.log(args);
      person = message.mentions.members.first();
      person.addRole(role);
    } else {
      if(args[0]) { // Wenn dem Befehl etwas hinzugefügt wurde, das keinem Unterbefehl entspricht...
        person = message.mentions.members.first(); // ... wird nach einer Erwähnung eines Nutzers gesucht, derer dann...
        message.channel.send(person); // ... der Zielnutzer entnommen wird.
      } else { // Ansonsten...
        person = message.member; // ... wird der Autor der Nachricht genommen.
      }
      var rolesArray = person.roles.array(); // Zur besseren Handhabung wird die Collection in ein Array übertragen
      var userRoles= [];
      for(i=0; i<rolesArray.length; i++) {
        userRoles.push(rolesArray[i].name); // Selektieren der benötigten Infos: die Namen der Rollen
      }
      console.log(userRoles);
      const rolesEmbed = new Discord.RichEmbed() // Einbettung
        .setColor(person.displayHexColor)
        .setTitle('Roles')
       	.setAuthor(person.user.username, person.user.avatarURL)
       	.setDescription(`<@${person.user.id}> has the following roles:`);
        for(j=0; j<userRoles.length;j++) {
     	    rolesEmbed.addField(userRoles[j], `${rolesArray[j]} with the ID: ${rolesArray[j].id}`);
        } // Alle Rollen werden als Element der Einbettung dargestellt.
        rolesEmbed
        .setTimestamp()
        .setFooter(`Requested by ${message.member.user.tag}`, message.member.user.avatarURL);
      message.channel.send(rolesEmbed);
    }
  }
});

client.login(config.token);