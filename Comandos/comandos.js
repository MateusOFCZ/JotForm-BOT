const Discord = require("discord.js");
const tz = require("moment-timezone")
const moment = require("moment")
require("moment-duration-format")
moment.locale('pt-BR')
const config = require("../config.json");
let Prefix = config.prefix;

module.exports.run = async (bot, message, args) => {
  let Avatar_BOT = bot.user.displayAvatarURL();
  let Comandos_Embed = new Discord.MessageEmbed()
  .setDescription("Comandos:")
  .setColor(`RANDOM`)
  .setThumbnail(Avatar_BOT)
  .addField(`${Prefix}limpar = Limpa uma quantidade de mensagens em um canal.`, `Exemplo: *${Prefix}limpar [Número de 1 a 100]*`)
  .addField(`${Prefix}serverinfo = Utilizado para ver as informações do servidor.`, `Exemplo: *${Prefix}serverinfo*`)
  .setFooter(`Executado por: ${message.author.username}`, message.author.avatarURL());
  
  message.delete().catch();
  message.channel.send(Comandos_Embed);
}

module.exports.help = {
  name:"comandos",
  adm: false
}