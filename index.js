// Importações E API Início
const config = require("./config.json");
const fs = require("fs");
const jotformkey = require("jotform");
const moment = require("moment")
require("moment-duration-format")
moment.locale('pt-BR')
const tz = require("moment-timezone")
moment().tz("America/Sao_Paulo").format();

const Discord = require("discord.js");
const { SSL_OP_CISCO_ANYCONNECT } = require("constants");
const { equal } = require("assert");
const bot = new Discord.Client({ disableEveryone: true });
bot.comandos = new Discord.Collection();
let Prefix = config.prefix;
bot.login(config.token);
let Form = config.formid;

jotformkey.options({
  debug: true,
  apiKey: config.jotformkey,
  timeout: 120000
});
// Importações E API Fim
// Função Enviar Formulário Início
function FormCount() {
  const guild = bot.guilds.cache.get(config.guildid); // GuildID
  const ChannelForm = guild.channels.cache.get(config.channeltextid) // Canal de texto onde o BOT irá enviar as respostas
  const ChannelCount = guild.channels.cache.get(config.channelvoiceid) // Canal de voz onde o BOT irá contar quantas respostas foram enviadas com o nome "✉️ **Formulários:** 0"

  const NewFormEmbed = new Discord.MessageEmbed()
    .setColor('#2b6799')
    .setTitle(config.formtitle) // Título do Formulário
    .setDescription(config.formdesc) // Descrição do Formulário
    .setURL(`http://jotform.com/form/${config.formid}`) // Link do Formulário
    .setThumbnail(config.formimg) // Imagem Ilustrativa

  jotformkey.getFormSubmissions(Form, { orderby: 'count' })
    .then(function (FormSubmissions) {
      jotformkey.getForm(Form)
        .then(function (FormInfos) {
          const CountChannel = parseInt(ChannelCount.name.replace(/\D/g, ''));
          const CountForm = parseInt(FormInfos.count);
          const NewCountChannel = CountChannel + 1;

          // Perguntas e Respostas Início
          NewFormEmbed.addField('**Qual a sua idade?**', FormSubmissions[`${NewCountChannel}`]['answers']['20']['answer'])
          const Resposta2 = FormSubmissions[`${NewCountChannel}`]['answers']['2']['answer'];
          const NewResposta2 = Resposta2.replace(/<div>/g, '').replace(/<\/div>/g, '\n');
          NewFormEmbed.addField('**O que é homofobia para você?**', NewResposta2)
          NewFormEmbed.addField('**Já conversou com a família sobre?**', FormSubmissions[`${NewCountChannel}`]['answers']['11']['answer'])
          if (FormSubmissions[`${NewCountChannel}`]['answers']['11']['answer'] === "Sim") {
            const Resposta3 = FormSubmissions[`${NewCountChannel}`]['answers']['3']['answer'];
            const NewResposta3 = Resposta3.replace(/<div>/g, '').replace(/<\/div>/g, '\n');
            NewFormEmbed.addField('**Como foi?**', NewResposta3)
          }
          const Resposta5 = FormSubmissions[`${NewCountChannel}`]['answers']['5']['answer'];
          const NewResposta5 = Resposta5.replace(/<div>/g, '').replace(/<\/div>/g, '\n');
          NewFormEmbed.addField('**Quando descobriu sua opção sexual?**', NewResposta5)
          NewFormEmbed.addField('**Você passa ou já passou por uma depressão, ou ansiedade mental?**', FormSubmissions[`${NewCountChannel}`]['answers']['9']['answer'])
          NewFormEmbed.addField('**Já precisou esconder sua sexualidade por medo?**', FormSubmissions[`${NewCountChannel}`]['answers']['12']['answer'])
          NewFormEmbed.addField('**Já sofreu alguma violência física ou verbal?**', FormSubmissions[`${NewCountChannel}`]['answers']['13']['answer'])
          if (FormSubmissions[`${NewCountChannel}`]['answers']['13']['answer'] === "Sim") {
            NewFormEmbed.addField('**Como foi?**', FormSubmissions[`${NewCountChannel}`]['answers']['14']['answer'])
          }
          NewFormEmbed.addField('**No seu trabalho, já sentiu que estivesse sentindo desvalorização social?**', FormSubmissions[`${CountChannel}`]['answers']['15']['answer'])
          if (FormSubmissions[`${CountChannel}`]['answers']['15']['answer'] === "Sim") {
            const Resposta16 = FormSubmissions[`${NewCountChannel}`]['answers']['16']['answer'];
            const NewResposta16 = Resposta16.replace(/<div>/g, '').replace(/<\/div>/g, '\n');
            NewFormEmbed.addField('**Como foi?**', NewResposta16)
          }
          NewFormEmbed.addField('**Por que nos tempos de hoje você acha que ainda tem pessoas que praticam homofobia?**', FormSubmissions[`${NewCountChannel}`]['answers']['18']['answer'])
          NewFormEmbed.addField('**Em relação à sociedade, o que poderia melhorar para melhor aceitação social?**', FormSubmissions[`${NewCountChannel}`]['answers']['19']['answer'])
          NewFormEmbed.setFooter(`Formulário recebido em: ${moment(FormSubmissions[`${NewCountChannel}`]['created_at']).calendar()} • Última Atualização: ${moment().tz("America/Sao_Paulo").calendar()}`);
          // Perguntas e Respostas Fim
          if (CountChannel !== CountForm) {
            ChannelCount.setName(`Formulários: ${NewCountChannel}`);
            ChannelForm.setTopic(`✉️ **Formulários:** ${NewCountChannel}`);
            ChannelForm.send(NewFormEmbed);
          }
        });
    });
}
// Função Enviar Formulário Fim
// Função Atividades Início
const Activity_List = [ 
  `By: Mateus#2835`,
  `Prefix: ${Prefix}`,
  `${Prefix}Comandos`
];

function Bot_Activity() {
  setTimeout(() => bot.user.setActivity(Activity_List[0]), 5000);
  setTimeout(() => bot.user.setActivity(Activity_List[1]), 10000);
  setTimeout(() => bot.user.setActivity(Activity_List[2]), 15000);
}
// Função Atividades Fim
// BOT Ligado Início
bot.on("ready", async () => {
  console.log(`\n${bot.user.username} está online!\nServidores: ${bot.guilds.cache.size}\nUsuários: ${bot.users.cache.size}\nPrefix: ${Prefix}\n`);
  console.log(`BOT Invite: https://discord.com/oauth2/authorize?client_id=${config.clientid}&scope=bot&permissions=8`);
  bot.user.setStatus('dnd');
  Bot_Activity();
  setInterval(() => Bot_Activity(), 20000)
  FormCount();
  setInterval(() => FormCount(), 300000)
});
// BOT Ligado Fim
//Executar Comandos Inicio
bot.on("message", async message => {
  const guild = bot.guilds.cache.get(config.guildid);
  guild.roles.cache.find(a => a.name === config.botrolename).setColor(config.botrolecolor);

  if (message.author.bot) return;
  if (message.channel.type != 'dm') {
    if (message.content.startsWith(Prefix)) {
      if (message.author.bot) return;
      if (message.channel.type === "dm") return;
      if (message.author.bot) return
      if (!message.content.startsWith(Prefix)) return;

      const args = message.content.slice(Prefix.length).trim().split(/ +/g)
      const cmd = args.shift().toLowerCase();
      const comandosfile = bot.comandos.get(cmd);
      comandosfile.run(bot, message, args, message.guild);
    }
  }
});
// Executar Comandos Fim
// Procurar Comandos Inicio
fs.readdir("./Comandos/", (err, files) => {

  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if (jsfile.length <= 0) {
    console.log("Não consegui procurar por comandos!");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./Comandos/${f}`);
    console.log(`${f} carregado!`);
    bot.comandos.set(props.help.name, props);
  });
});
// Procurar Comandos Fim