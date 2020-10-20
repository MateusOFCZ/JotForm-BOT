const config = require("./config.json");
const fs = require("fs");
const jotform = require("jotform");
const moment = require("moment")
require("moment-duration-format")
moment.locale('pt-BR')
const tz = require("moment-timezone")
moment().tz("America/Sao_Paulo").format();

const Discord = require("discord.js");
const { SSL_OP_CISCO_ANYCONNECT } = require("constants");
const { equal } = require("assert");
const bot = new Discord.Client({ disableEveryone: true });

bot.login(config.token);
let guild_id = config.guild_id;
let bot_id = config.bot_id;
let jotform_key = config.jotform_key;
let form_id = config.form_id;
let channelform_forms = config.channelform_forms;
let channelform_count = config.channelform_count;

jotform.options({
  debug: true,
  apiKey: jotform_key,
  timeout: 120000
});

function FormCount() {
  const guild = bot.guilds.cache.get(guild_id);
  const ChannelForm = guild.channels.cache.get(channelform_forms)
  const ChannelCount = guild.channels.cache.get(channelform_count)

  const NewFormEmbed = new Discord.MessageEmbed()
    .setColor('#2b6799')
    .setTitle('Saúde mental LGBTQI+')
    .setDescription('Depressão, ansiedade e risco de suicídio são principais problemas')
    .setURL('http://jotform.com/form_id/202806581619055')
    .setThumbnail('https://i.imgur.com/rIWuNWP.png')

  jotform.getFormSubmissions(form_id, { orderby: 'count' })
    .then(function (FormSubmissions) {
      jotform.getForm(form_id)
        .then(function (FormInfos) {
          const CountChannel = parseInt(ChannelCount.name.replace(/\D/g, ''));
          const CountForm = parseInt(FormInfos.count);
          const NewCountChannel = CountChannel + 1;

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

          if (CountChannel !== CountForm) {
            ChannelCount.setName(`Formulários: ${NewCountChannel}`);
            ChannelForm.setTopic(`✉️ **Formulários:** ${NewCountChannel}`);
            ChannelForm.send(NewFormEmbed);
          }
        });
    });
}
const Activity_List = [
  `Usuários: ${bot.users.cache.size}`,
  `Servidores: ${bot.guilds.cache.size}`
];

function Bot_Activity() {
  setTimeout(() => bot.user.setActivity(Activity_List[0]), 5000);
  setTimeout(() => bot.user.setActivity(Activity_List[1]), 10000);
}
bot.on("ready", async () => {
  console.log(`\n${bot.user.username} está online!\nServidores: ${bot.guilds.cache.size}\nUsuários: ${bot.users.cache.size}\n\nBOT Invite: https://discord.com/oauth2/authorize?client_id=${bot_id}&scope=bot&permissions=8\n\n`);
  bot.user.setStatus('dnd');
  Bot_Activity();
  setInterval(() => Bot_Activity(), 20000)
  FormCount();
  setInterval(() => FormCount(), 300000)
});