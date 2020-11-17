const Discord = require("discord.js");
const tz = require("moment-timezone")
const moment = require("moment")
require("moment-duration-format")
moment.locale('pt-BR')
const config = require("../config.json");
let Prefix = config.prefix;

module.exports.run = async (bot, message, args) => {

  let Onlines = message.guild.members.cache.filter(a => a.presence.status == "online").size;
  let Ocupados = message.guild.members.cache.filter(a => a.presence.status == "dnd").size;
  let Ausentes = message.guild.members.cache.filter(a => a.presence.status == "idle").size;
  let Offlines = message.guild.members.cache.filter(a => a.presence.status == "offline").size;
  let Bots = message.guild.members.cache.filter(a => a.user.bot).size;
  let Humanos = message.guild.members.cache.filter(a => !a.user.bot).size;
  let CanaisTexto = message.guild.channels.cache.filter(a => a.type === "text").size;
  let CanaisVoz = message.guild.channels.cache.filter(a => a.type === "voice").size;
  let Categorias = message.guild.channels.cache.filter(a => a.type === "category").size;
  let Cargos = message.guild.roles.cache.size;

  let LevelVerificacao = ["None", "Low", "Medium", "(╯°□°）╯︵  ┻━┻", "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"];

  let Regiao = {
        "brazil": ":flag_br: Brazil",
        "eu-central": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "eu-west": ":flag_eu: Western Europe",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa"
    };

  let serverinfo = new Discord.MessageEmbed()
  .setDescription("Informações Do Servidor")
  .setColor(`RANDOM`)
  .setThumbnail(message.guild.iconURL())
  .addField(`\🏢 **Servidor:**`, `${message.guild.name}`, true)
  .addField(`\👑 **Dono:**`, `${message.guild.owner}`, true)
  .addField(`\🗓️ **Criado:**`, `${moment(message.guild.createdAt).calendar()}`)
  .addField(`\🗺️ **Região:**`, `${Regiao[message.guild.region]}`, true)
  //.addField(`\🚦 **Level de Verificação:**`, `${LevelVerificacao[message.guild.verificationLevel]}`, true)
  .addField(`\🗣️ **Prefix:**`, `${Prefix}`, true)
  .addField(`\🟢 **Onlines:**`, `${Onlines}`, true)
  .addField(`\🔴 **Ocupados:**`, `${Ocupados}`, true)
  .addField(`\🟠 **Ausentes:**`, `${Ausentes}`, true)
  .addField(`\⚪ **Offlines:**`, `${Offlines}`, true)
  .addField(`\🤖 **Bots:**`, `${Bots}`, true)
  .addField(`\👤**Humanos:**`, `${Humanos}`, true)
  .addField(`\💬 **Canais de Texto:**`, `${CanaisTexto}`, true)
  .addField(`\🎙️ **Canais de Voz:**`, `${CanaisVoz}`, true)
  .addField(`\🗃️ **Categorias:**`, `${Categorias}`, true)
  .addField(`\📚 **Cargos:**`, `${Cargos}`, true)
  .setFooter(`Executado por: ${message.author.username}`, message.author.avatarURL());
  
  message.delete().catch();
  message.channel.send(serverinfo);
}

module.exports.help = {
  name:"serverinfo",
  adm: false
}