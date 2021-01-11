const express = require('express');
const app = express();

app.listen(() => console.log('Server started'));

app.use('/ping', (req, res) => {
  res.send(new Date());
});
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/website/index.html');
});

const Discord = require("discord.js");
const niro = new Discord.Client()
const fs = require("fs");
const dateFormat = require("dateformat")
const moment = new require("moment");
const { prefix, token, roomid, website, youtubekey } = require("./Config/configuration.json");
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const youtube = new YouTube(youtubekey);

niro.login(token).catch(err => console.error(`[ Discord ] Worng Token :<`))

niro.on("ready", async () => {
  console.log(`
    ::::::::::::::::::::::::::::::::::::::::::::::::::
    :                                                :
    : - bot name : ${niro.user.username}                            :
    :                                                :
    ::::::::::::::::::::::::::::::::::::::::::::::::::
    :                                                :
    : - server : ${niro.guilds.size}                                   :
    :                                                :
    ::::::::::::::::::::::::::::::::::::::::::::::::::
    :                                                :
    : - bot id : ${niro.user.id}                  :
    :                                                :
    ::::::::::::::::::::::::::::::::::::::::::::::::::
    :                                                :
    : - bot developer : @ニロ#3892                   :
    :                                                :
    ::::::::::::::::::::::::::::::::::::::::::::::::::
    :                                                :
    ██████╗░██████╗░░█████╗░██████╗░░█████╗░████████╗:
    ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝:
    ██████╔╝██████╔╝██║░░██║██████╦╝██║░░██║░░░██║░░░:
    ██╔═══╝░██╔══██╗██║░░██║██╔══██╗██║░░██║░░░██║░░░:
    ██║░░░░░██║░░██║╚█████╔╝██████╦╝╚█████╔╝░░░██║░░░:
    ╚═╝░░░░░╚═╝░░╚═╝░╚════╝░╚═════╝░░╚════╝░░░░╚═╝░░░:
    ::::::::::::::::::::::::::::::::::::::::::::::::::
    `)
  await niro.user.setActivity(`${prefix}help`, {
    type: "COMPETING",
  })
});

niro.on("message", async message => {
  if (message.content.startsWith(prefix + "help")) {
    message.channel.send(new Discord.RichEmbed().setAuthor("Helpful Links").setDescription(`**
[Add To Your Server](https://discord.com/oauth2/authorize?client_id=${niro.user.id}&scope=bot&permissions=2117594495)
[ProBot commands](${website})**`))
      .then(m => {
        message.react('✅');
      })
      .catch(() => {
        message.react('❌');
      });
  }
})

niro.on("message", message => {
  let args = message.content.split(" ");
  if (message.content.startsWith(prefix + "profile")) {
    let member = message.mentions.users.first();

    if (args[0] && !args[1]) {
      message.channel.startTyping();
      setTimeout(() => {
        message.channel.stopTyping();
      }, Math.random() * (1 - 3) + 1 * 1000);
      message.channel.send({
        files: [
          {
            name: "cutie=niro.png",
            attachment: `https://api.probot.io/profile/${message.author.id}`
          }
        ]
      });
    }
    if (member) {
      message.channel.startTyping();
      setTimeout(() => {
        message.channel.stopTyping();
      }, Math.random() * (1 - 3) + 1 * 1000);
      message.channel.send({
        files: [
          {
            name: "cutie=niro.png",
            attachment: `https://api.probot.io/profile/${member.id}`
          }
        ]
      });
    } else if (args[1] && !member) {
      niro.fetchUser(args[1]).then(userr => {
        message.channel.stopTyping();
        setTimeout(() => {
          message.channel.stopTyping();
        }, Math.random() * (1 - 3) + 1 * 1000);
        message.channel.send({
          files: [
            {
              name: "cutie=niro.png",
              attachment: `https://api.probot.io/profile/${userr.id}`
            }
          ]
        });
      });
    }
  }
});

niro.on('message', async message => {

  let Fire = message.content.split(' ')[0].substring(prefix.length);
  let mention = message.mentions.users.first() || message.author;
  if (Fire === 'acredits') {
    let args = message.content.split(' ');
    if (!devs.includes(message.author.id)) return;
    if (!args[1] || isNaN(args[1])) return message.reply('**اكتب عدد الرصيد**');
    if (!credits[mention.id]) return;
    credits[mention.id].credits += +args[1];
    fs.writeFileSync('./data/credits.json', JSON.stringify(credits));
    console.log(credits[mention.id]);
    message.reply(`** Adedd Money For : \`${args[1]}\` Done **`);
  } else if (Fire === 'rcredits') {
    let args = message.content.split(' ');
    if (!devs.includes(message.author.id)) return;
    if (!args[1] || isNaN(args[1])) return message.reply('**اكتب عدد الرصيد**');
    if (!credits[mention.id]) return;
    credits[mention.id].credits += -args[1];
    fs.writeFileSync('./data/credits.json', JSON.stringify(credits));
    console.log(credits[mention.id]);
    message.reply(`**, Remove Money For : \`${args[1]}\`**`);
  }
});


////////////////////////////////////////////////

const credits = JSON.parse(fs.readFileSync('./data/credits.json'));
var time = require('./data/credits.json');
niro.on('message', async message => {


  if (message.author.bot || message.channel.type === 'dm') return;
  let args = message.content.split(' ');
  let author = message.author.id;
  if (!credits[author])
    credits[author] = {
      credits: 0
    };
  fs.writeFileSync('./data/credits.json', JSON.stringify(credits, null, 4));
  if (args[0].toLowerCase() == `${prefix}credits`) {
    const mention = message.mentions.users.first() || message.author;
    const mentionn = message.mentions.users.first();
    if (!args[2]) {
      message.channel.send(
        `**${mention.username}, your :credit_card: balance is  \`$${
        credits[mention.id].credits
        }\`**`
      );
    } else if (mentionn && args[2]) {
      if (isNaN(args[2]) || [',', '.'].includes(args[2]))
        return message.channel.send(`**:x: | خطا **`);

      if (args[2] < 1) return message.channel.send(`**:x: | خطا**`);
      if (mention.bot) return message.channel.send(`**:x: | خطا**`);
      if (mentionn.id === message.author.id)
        return message.channel.send(`**:x: | خطا**`);
      if (args[2] > credits[author].credits)
        return message.channel.send(
          `**:x: | Error ,You dont have credits in your account**`
        );
      if (args[2].includes('-')) return message.channel.send(`**:x: | خطا**`);
      let resulting =
        parseInt(args[2]) == 1
          ? parseInt(args[2])
          : Math.floor(args[2] - args[2] * (5 / 100));
      let tax =
        parseInt(args[2]) == 1
          ? parseInt(args[2])
          : Math.floor(args[2] * (5 / 100));
      let first = Math.floor(Math.random() * 9);
      let second = Math.floor(Math.random() * 9);
      let third = Math.floor(Math.random() * 9);
      let fourth = Math.floor(Math.random() * 9);
      let num = `${first}${second}${third}${fourth}`;
      let Canvas = require('canvas');
      let canvas = Canvas.createCanvas(108, 40);
      let ctx = canvas.getContext('2d');
      const background = await Canvas.loadImage(
        'https://cdn.discordapp.com/attachments/608278049091223552/617791172810899456/hmmm.png'
      );
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.font = '20px Arial Bold';
      ctx.fontSize = '20px';
      ctx.fillStyle = '#ffffff';
      message.channel
        .send(
          `**${
          message.author.username
          }, Transfer Fees: \`${tax}\`, Amount: \`$${resulting.toLocaleString()}\`**
type these numbers to confirm: `
        )
        .then(async essss => {
          message.channel.send(`\`${num}\``).then(m => {
            message.channel
              .awaitMessages(r => r.author.id === message.author.id, {
                max: 1,
                time: 20000,
                errors: ['time']
              })
              .then(collected => {
                if (collected.first().content === num) {
                  essss.delete();
                  message.channel.send(
                    `**:moneybag: | ${
                    message.author.username
                    }, Done Trans \`$${resulting.toLocaleString()}\` To ${mentionn}**`
                  );
                  mention.send(
                    `**:money_with_wings: | Transfer Receipt **\`\`\`You Have Received \`$${resulting.toLocaleString()}\` From User ${
                    message.author.username
                    }; (ID (${message.author.id})\`\`\``
                  );
                  m.delete();
                  credits[author].credits += Math.floor(
                    -resulting.toLocaleString()
                  );
                  credits[mentionn.id].credits += Math.floor(
                    +resulting.toLocaleString()
                  );
                  fs.writeFileSync(
                    './data/credits.json',
                    JSON.stringify(credits, null, 4)
                  );
                } else {
                  m.delete();
                  essss.delete();
                }
              });
          });
        });
    } else {
      message.channel.send(
        `**:x: | Error , Please Command True Ex: \`${prefix}credits [MentionUser] [Balance]\`**`
      );
    }
  }
  if (args[0].toLowerCase() === `${prefix}daily`) {
    let cooldown = 8.64e7;
    let Daily = time[message.author.id];
    if (Daily !== null && cooldown - (Date.now() - Daily) > 0) {
      let times = cooldown - (Date.now() - Daily);
      message.channel.send(
        `**:stopwatch: |  ${
        message.author.username
        }, your daily :dollar: credits refreshes in ${pretty(times, {
          verbose: true
        })}.**`
      );
      fs.writeFile('./data/credits.json', JSON.stringify(time), function(e) {
        if (e) throw e;
      });
    } else {
      let ammount = (300, 500, 100, 200, 120, 150, 350, 320, 220, 250);
      credits[author].credits += ammount;
      time[message.author.id] = Date.now();
      message.channel.send(
        `**:atm: | ${message.author.username} you received your :yen: 250 daily credits!**`);
      fs.writeFile('./data/credits.json', JSON.stringify(credits), function(e) {
        if (e) throw e;
      });
    }
  }
});

let xp = require('./data/xp.json'); //سوي ملف بأسم xp.json

niro.on('message', message => {


  if (message.author.bot) return;
  if (message.channel.type == "dm") return;


  let Addxp = Math.floor(Math.random() * 6) + 8;

  if (!xp[message.author.id]) {
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }

  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level + 1;
  let nextLvL = xp[message.author.id].level * 1000; //كل كم اكس بي لحتا يرتفع لفله انصحكم تخلونه فوق ال الف
  xp[message.author.id].xp = curxp + Addxp;
  if (nextLvL <= xp[message.author.id].xp) {
    xp[message.author.id].level = xp[message.author.id].level + 1;

    let lvlup = new Discord.RichEmbed()
      .setTitle('Level Up!')
      .setColor(`BLUE`)
      .setDescription(`New Level: ` + curlvl)
      .setTimestamp()
      .setFooter(message.author.username + '#' + message.author.discriminator);
    message.channel.send(lvlup)
  }
  fs.writeFile("./data/xp.json", JSON.stringify(xp), (err) => {
    if (err) console.log(err)
  });


});

niro.on('message', message => {

  if (message.author.bot) return;
  if (message.channel.type == "dm") return;


  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nextlvlxp = curlvl * 200;
  let difference = nextlvlxp - curxp

  if (message.content == prefix + "rank") {

    if (!xp[message.author.id]) {
      xp[message.author.id] = {
        xp: 0,
        level: 1,
      }
    }
    fs.writeFile("./data/xp.json", JSON.stringify(xp), (err) => {
      if (err) console.log(err)
    });
    var embed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setColor(`BLUE`)
      .setTitle('Your rank')
      .addField('XP: ', curxp, true)
      .addField('Level: ', curlvl, true)
      .setFooter(` ${difference} xp till level up `, message.author.displayAvatarURL);
    message.channel.send(embed);

  }
});

var top = require("./data/top.json");
function save() {
  fs.writeFileSync("./data/top.json", JSON.stringify(top, null, 4));
}
niro.on("voiceStateUpdate", async function(oldMember, newMember) {

  if (newMember.user.bot) return;
  if (!top[newMember.guild.id]) top[newMember.guild.id] = {};
  if (!top[newMember.guild.id][newMember.user.id]) top[newMember.guild.id][newMember.user.id] = {
    "text": 0,
    "voice": parseInt(Math.random() * 10),
    "msgs": 0,
    "id": newMember.user.id
  }
  save();
  if (!oldMember.voiceChannel && newMember.voiceChannel) {
    var addXP = setInterval(async function() {
      top[newMember.guild.id][newMember.user.id].voice += parseInt(Math.random() * 4);
      save();
      if (!newMember.voiceChannel) {
        clearInterval(addXP);
      }
    }, 60000);
  }
});



niro.on("message", async function(message) {

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!top[message.guild.id]) top[message.guild.id] = {};
  if (!top[message.guild.id][message.author.id]) top[message.guild.id][message.author.id] = {
    "text": parseInt(Math.random() * 10),
    "voice": 1,
    "msgs": 0,
    "id": message.author.id
  }
  if (top[message.guild.id][message.author.id].msgs > 10) {
    top[message.guild.id][message.author.id].text += parseInt(Math.random() * 4);
    top[message.guild.id][message.author.id].msgs = 0;
  }
  save();
  var args = message.content.split(" ");
  var cmd = args[0].toLowerCase();
  if (!message.content.startsWith(prefix)) return;
  if (message.content.startsWith(prefix + "top text")) {
    var topArray = Object.values(top[message.guild.id]);
    var num = 0;
    var textStr = `${topArray.sort((a, b) => b.text - a.text).slice(0, 5).filter(user => user.text > 0 && message.guild.members.get(user.id)).map(function(user) {
      if (user.text > 0) {
        return `**#${++num} | <@${user.id}> XP: \`${user.text}\` **`
      }
    }).join("\n")}`;
    var embed = new Discord.RichEmbed()
      .setAuthor("?? | Guild Score Leaderboards", message.guild.iconURL)
      .setColor(`RED`)
      .addField(`**:speech_balloon: | TEXT LEADERBOARD**`, `${textStr}   \n\n\n **\`${prefix}top text\`**`, true)
      .setFooter(message.author.tag, message.author.displayAvatarURL)
      .setTimestamp()
    message.channel.send({
      embed: embed
    });
    //   if (!message.content.startsWith(prefix)) return;
  } else {
    if (message.content.startsWith(prefix + "top voice")) {
      var topArray = Object.values(top[message.guild.id]);
      var num = 0;
      var voiceStr = `${topArray.sort((a, b) => b.voice - a.voice).slice(0, 5).filter(user => user.voice > 0 && message.guild.members.get(user.id)).map(function(user) {
        if (user.voice > 0) {
          return `**#${++num} | <@${user.id}> XP: \`${user.voice}\` **`
        }
      }).join("\n")}`;
      var embed = new Discord.RichEmbed()
        .setAuthor("?? | Guild Score Leaderboards", message.guild.iconURL)
        .setColor(`RED`)
        .addField(`**:microphone2: | VOICE LEADERBOARD**`, `${voiceStr}   \n\n\n **:sparkles:\`${prefix}top voice\``, true)

        .setFooter(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp()
      message.channel.send({
        embed: embed
      });


      //  break;
      // if (!message.content.startsWith(prefix)) return;
    } else {
      if (message.content.startsWith(prefix + "top")) {
        var topArray = Object.values(top[message.guild.id]);
        var num = 0;
        var textStr = `${topArray.sort((a, b) => b.text - a.text).slice(0, 10).filter(user => user.text > 0 && message.guild.members.get(user.id)).map(function(user) {
          if (user.text > 0) {
            return `**#${++num} | <@${user.id}> XP: \`${user.text}\` **`
          }
        }).join("\n")}`;
        num = 0;
        var voiceStr = `${topArray.sort((a, b) => b.voice - a.voice).slice(0, 10).filter(user => user.voice > 0 && message.guild.members.get(user.id)).map(function(user) {
          if (user.voice > 0) {
            return `**#${++num} | <@${user.id}> XP: \`${user.voice}\` **`
          }
        }).join("\n")}`;
        var embed = new Discord.RichEmbed()
          .setAuthor("?? | Guild Score Leaderboards", message.guild.iconURL)
          .addField("**TOP 5 TEXT :speech_balloon:**", `${textStr}  \n\n  **:sparkles: More?** \`${prefix}top text\``, true)
          .addField("**TOP 5 VOICE :microphone2:**", `${voiceStr} \n\n **:sparkles: More?** \`${prefix}top voice\``, true)
          .setFooter(message.author.tag, message.author.displayAvatarURL)
          .setTimestamp()
          .setColor(`RED`);
        message.channel.send({
          embed: embed


        });



      }
    }
  }

});

niro.on('message', message => {
  if (message.content.startsWith(prefix + "user")) {
    var args = message.content.split(" ").slice(1);
    let user = message.mentions.users.first();
    var men = message.mentions.users.first();
    var heg;
    if (men) {
      heg = men
    } else {
      heg = message.author
    }
    var mentionned = message.mentions.members.first();
    var h;
    if (mentionned) {
      h = mentionned
    } else {
      h = message.member
    }
    moment.locale('ar-TN');
    var id = new Discord.RichEmbed()
      .setAuthor(message.author.username, message.author.avatarURL)
      .setColor(`RANDOM`)
      .addField('**JOINED DISCORD :**', `${moment(heg.createdTimestamp).format('YYYY/M/D')} **\n** \`${moment(heg.createdTimestamp).fromNow()}\``, true)
      .addField('**JOINED SERVER :**', `${moment(h.joinedAt).format('YYYY/M/D')} \n \`${moment(h.joinedAt).fromNow()}\``, true)
      .setThumbnail(heg.avatarURL);
    message.channel.send(id)
  }
});

niro.on("message", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (message.content.startsWith(prefix + "avatar")) {
    const mention = message.mentions.users.first()

    if (!mention) return console.log("")
    let embed = new Discord.RichEmbed()
      .setColor("BLACK")
      .setAuthor(`${mention.username}#${mention.discriminator}`, `${mention.avatarURL}`)
      .setTitle("Avatar Link")
      .setURL(`${mention.avatarURL}`)
      .setImage(`${mention.avatarURL}`)
      .setFooter(`Requested By ${message.author.tag}`, `${message.author.avatarURL}`)
    message.channel.send(embed)
  }
})

niro.on("message", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (message.content.startsWith(prefix + "avatar server")) {
    let doma = new Discord.RichEmbed()
      .setColor("BLACK")
      .setAuthor(message.guild.name, message.guild.iconURL)
      .setTitle("Avatar Link")
      .setURL(message.guild.iconURL)
      .setImage(message.guild.iconURL)
      .setFooter(`Requested By ${message.author.tag}`, message.author.avatarURL)
    message.channel.send(doma)
  } else if (message.content.startsWith(prefix + "avatar")) {
    let args = message.content.split(" ")[1]
    var avt = args || message.author.id;
    niro.fetchUser(avt).then(user => {
      avt = user;
      let embed = new Discord.RichEmbed()
        .setColor("BLACK")
        .setAuthor(`${avt.tag}`, avt.avatarURL)
        .setTitle("Avatar Link")
        .setURL(avt.avatarURL)
        .setImage(avt.avatarURL)
        .setFooter(`Requested By ${message.author.tag}`, message.author.avatarURL)
      message.channel.send(embed)
    })
  }
});

niro.on('message', message => {
  if (message.content.startsWith(prefix + "server")) {
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return message.reply(`**هذه الخاصية للادارة فقط** :negative_squared_cross_mark: `)
    if (!message.channel.guild) return message.reply(' ');
    const millis = new Date().getTime() - message.guild.createdAt.getTime();
    const now = new Date();
    dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
    const verificationLevels = ['None', 'Low', 'Medium', 'Insane', 'Extreme'];
    const days = millis / 1000 / 60 / 60 / 24;
    let roles = niro.guilds.get(message.guild.id).roles.map(r => r.name);
    var embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL)
      .addField("**🆔 Server ID:**", message.guild.id, true)
      .addField("**📅 Created On**", message.guild.createdAt.toLocaleString(), true)
      .addField("**👑 Owned by**", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`)
      .addField(`**👥 Members (${message.guild.memberCount})**`, `**${
        message.guild.members.filter(c => c.presence.status !== "ONLINE").size}** **Online**`, true)
      .addField('**💬 Channels **', `**${message.guild.channels.filter(m => m.type === 'text').size}**` + ' text | Voice  ' + `**${message.guild.channels.filter(m => m.type === 'voice').size}** `, true)
      .addField("**🌍 Others **", message.guild.region, true)
      .addField(`**🔐 Roles (${message.guild.roles.size})**`, `To see a list with all roles use **#roles** `, true)
      .setColor(`BLACK`)
    message.channel.sendEmbed(embed)

  }
  
  niro.on("message", message => {
  if (message.author.bot) return;

  let command = message.content.split(" ")[0];

  if (command === prefix + "unmute") {
    if (message.author.bot) return;
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message
        .reply("** لا يوجد لديك برمشن 'Manage Roles' **")
        .catch(console.error);
    let user = message.mentions.users.first();
    let modlog = niro.channels.find(gg => gg.name === "log");
    let muteRole = niro.guilds
      .get(message.guild.id)
      .roles.find(gg => gg.name === "Muted");
    if (!muteRole)
      return message
        .reply("** لا يوجد لديك رتبه الميوت 'Muted' **")
        .catch(console.error);
    if (message.mentions.users.size < 1)
      return message
        .channel.send(new Discord.RichEmbed().setDescription(`
        **Command: unmute**

Unmutes a member.

**Usage:**
#unmute (user)

**Examples:**
#unmute @ニロ
#unmute 157605500488384512`))
        .catch(console.error);
    const embed = new Discord.RichEmbed()
      .setColor(0x00ae86)
      .setTimestamp()
      .addField("الأستعمال:", "اسكت/احكي")
      .addField(
        "تم فك الميوت عن:",
        `${user.username}#${user.discriminator} (${user.id})`
      )
      .addField(
        "بواسطة:",
        `${message.author.username}#${message.author.discriminator}`
      );

    if (
      !message.guild
        .member(niro.user)
        .hasPermission("MANAGE_ROLES_OR_PERMISSIONS")
    )
      return message
        .reply("** لا يوجد لدي برمشن Manage Roles **")
        .catch(console.error);

    if (message.guild.member(user).removeRole(muteRole.id)) {
      return message
        .reply("**:white_check_mark: .. تم فك الميوت عن الشخص **")
        .catch(console.error);
    } else {
      message.guild
        .member(user)
        .removeRole(muteRole)
        .then(() => {
          return message
            .reply("**:white_check_mark: .. تم فك الميوت عن الشخص **")
            .catch(console.error);
        });
    }
  }
});
niro.on("message", message => {
  if (message.author.bot) return;

  let command = message.content.split(" ")[0];

  if (command === prefix + "unmute") {
    if (message.author.bot) return;
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message
        .reply("** لا يوجد لديك برمشن 'Manage Roles' **")
        .catch(console.error);
    let user = message.mentions.users.first();
    let modlog = niro.channels.find(gg => gg.name === "log");
    let muteRole = niro.guilds
      .get(message.guild.id)
      .roles.find(gg => gg.name === "Muted");
    if (!muteRole)
      return message
        .reply("** لا يوجد لديك رتبه الميوت 'Muted' **")
        .catch(console.error);
    if (message.mentions.users.size < 1)
      return message
        .reply("** يجب عليك منشنت شخص اولاً**")
        .catch(console.error);
    const embed = new Discord.RichEmbed()
      .setColor(0x00ae86)
      .setTimestamp()
      .addField("الأستعمال:", "اسكت/احكي")
      .addField(
        "تم فك الميوت عن:",
        `${user.username}#${user.discriminator} (${user.id})`
      )
      .addField(
        "بواسطة:",
        `${message.author.username}#${message.author.discriminator}`
      );

    if (
      !message.guild
        .member(niro.user)
        .hasPermission("MANAGE_ROLES_OR_PERMISSIONS")
    )
      return message
        .reply("** لا يوجد لدي برمشن Manage Roles **")
        .catch(console.error);

    if (message.guild.member(user).removeRole(muteRole.id)) {
      return message
        .reply("**:white_check_mark: .. تم فك الميوت عن الشخص **")
        .catch(console.error);
    } else {
      message.guild
        .member(user)
        .removeRole(muteRole)
        .then(() => {
          return message
            .reply("**:white_check_mark: .. تم فك الميوت عن الشخص **")
            .catch(console.error);
        });
    }
  }
});
});

niro.on("message", message => {
  if (message.content.startsWith(prefix + "setnick")) {
    if (message.author.bot || message.channel.type == "dm" || !message.member.hasPermission("MANAGE_NICKNAMES") || !message.guild.member(niro.user).hasPermission("MANAGE_NICKNAMES")) return;
    var user = message.mentions.members.first();
    var args = message.content.split(" ").slice(2);
    var nick = args.join(" ");
    if (!user || !args) return message.channel.send(`
\`\`\`js
Command: setnick
EX:
#setnick @7mada mada
\`\`\`
`);
    message.guild.member(user.user).setNickname(`${nick}`);
    message.channel.send(`Successfully changed **${user}** nickname to **${nick}**`);
  }
});

niro.on("message", message => {
  if (message.author.codes) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  if (command == "ban") {
    if (message.author.bot) return;
    if (!message.channel.guild)
      return message.reply("** This command only for servers**");

    if (!message.guild.member(message.author).hasPermission("BAN_MEMBERS"))
      return message.reply("**انت لا تملك الصلاحيات المطلوبه**");
    if (!message.guild.member(niro.user).hasPermission("BAN_MEMBERS"))
      return message.reply("**I Don't Have ` BAN_MEMBERS ` Permission**");
    let user = message.mentions.users.first();

    if (message.mentions.users.size < 1) return message.channel.send(new Discord.RichEmbed().setDescription(`
    **Command: ban**

Bans a member.

**Usage:**
#ban (user) (time m/h/d/mo/y) (reason)

**Examples:**
#ban @ニロ
#ban @ニロ spamming
#ban @ニロ 1h spamming
#ban @ニロ 1d spamming
#ban @ニロ 1w
    `));
    if (
      message.mentions.members.first().highestRole.position >=
      message.member.highestRole.position
    )
      return message.channel.send("ما تقدر تبند شخص رتبته اعلى منك!");
    if (!message.guild.member(user).bannable)
      return message.reply(
        "**يجب ان تكون رتبة البوت اعلي من رتبه الشخص المراد تبنيدة**"
      );

    message.guild.member(user).ban(7, user);

    message.channel.send(
      `**:white_check_mark: ${user.tag} banned from the server ! :airplane: **  `
    );
  }
});

niro.on("message", message => {
  if (message.author.x5bz) return;
  if (!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  if (command == "kick") {
    if (message.author.bot) return;
    if (!message.channel.guild)
      return message.reply("** This command only for servers**");

    if (!message.guild.member(message.author).hasPermission("KICK_MEMBERS"))
      return message.reply("**You Don't Have ` KICK_MEMBERS ` Permission**");
    if (!message.guild.member(niro.user).hasPermission("KICK_MEMBERS"))
      return message.reply("**I Don't Have ` KICK_MEMBERS ` Permission**");
    let user = message.mentions.users.first();
    let reason = message.content
      .split(" ")
      .slice(2)
      .join(" ");
    if (message.mentions.users.size < 1) return message.channel.send(new Discord.RichEmbed().setDescription(`
      **Command: kick**

Kicks a member.

**Usage:**
#kick (user) (reason)

**Examples:**
#kick @ニロ
#kick 157605500488384512
      `));
    if (!reason) return message.reply("**اكتب سبب الطرد**");
    if (!message.guild.member(user).kickable)
      return message.reply(
        "**لايمكنني طرد شخص اعلى من رتبتي يرجه اعطاء البوت رتبه عالي**"
      );
    if (
      message.mentions.members.first().highestRole.position >=
      message.member.highestRole.position
    )
      return message.channel.send("ما تقدر تطرد شخص رتبته اعلى منك!");

    message.guild.member(user).kick();

    const kickembed = new Discord.RichEmbed()
      .setAuthor(`KICKED!`, user.displayAvatarURL)
      .setColor(`${color}`)
      .setTimestamp()
      .addField("**User:**", "**[ " + `${user.tag}` + " ]**")
      .addField("**By:**", "**[ " + `${message.author.tag}` + " ]**")
      .addField("**Reason:**", "**[ " + `${reason}` + " ]**");
    message.channel.send({
      embed: kickembed
    });
  }
});

niro.on("message", async message => {
  var command = message.content.toLowerCase().split(" ")[0];
  var args = message.content.toLowerCase().split(" ");
  var userM = message.mentions.users.first();
  if (command == prefix + "unban") {
    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.channel.send(
        ":no_entry: | You dont have **BAN_MEMBERS** Permission!"
      );
    if (!message.guild.member(niro.user).hasPermission("BAN_MEMBERS"))
      return message.channel.send(
        ":no_entry: | I dont have **BAN_MEMBERS** Permission!"
      );
    if (!args[1])
      return message.channel.send(new Discord.RichEmbed().setDescription(`
      **Command: unban**

Unbans a member.

**Usage:**
#unban (username / user id)

**Examples:**
#unban @ニロ
#unban 157605500488384512
`));
    if (args[1].length < 16)
      return message.reply(":no_entry: | This ID is not id user!");
    message.guild.fetchBans().then(bans => {
      var Found = bans.find(m => m.id === args[1]);
      if (!Found)
        return message.channel.send(
          `:no_entry: | <@${message.author.id}> This preson not have any ban from this server! :unlock:`
        );
      message.guild.unban(args[1]);
      message.channel.send(
        `:white_check_mark: Successfully \`\`UNBANNED\`\` <@${
        args[1]
        }> From the server!`
      );
    });
  }
});

niro.on("message", message => {
  if (message.author.bot) return;

  let command = message.content.split(" ")[0];

  if (command === prefix + "mute") {
    if (message.author.bot) return;
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message
        .reply("** لا يوجد لديك برمشن 'Manage Roles' **")
        .catch(console.error);
    let user = message.mentions.users.first();
    let modlog = niro.channels.find(gg => gg.name === "log");
    let muteRole = niro.guilds
      .get(message.guild.id)
      .roles.find(gg => gg.name === "Muted");
    if (!muteRole)
      return message
        .reply("** لا يوجد رتبة الميوت 'Muted' **")
        .catch(console.error);
    if (message.mentions.users.size < 1)
      return message
        .channel.send(new Discord.RichEmbed().setDescription(`
        **Command: mute**

Mute a member from text channels so they cannot type.

**Usage:**
#mute (user) (time ends with m,h,d,mo,y) (reason)

**Examples:**
#mute @ニロ 1m Spamming
#mute @ニロ 1h
#mute @ニロ 1d
#mute @ニロ 1mo
#mute @ニロ 1y`))
        .catch(console.error);

    const embed = new Discord.RichEmbed()
      .setColor(0x00ae86)
      .setTimestamp()
      .addField("الأستعمال:", "اسكت/احكي")
      .addField(
        "تم ميوت:",
        `${user.username}#${user.discriminator} (${user.id})`
      )
      .addField(
        "بواسطة:",
        `${message.author.username}#${message.author.discriminator}`
      );

    if (
      !message.guild
        .member(niro.user)
        .hasPermission("MANAGE_ROLES_OR_PERMISSIONS")
    )
      return message
        .reply("** لا يوجد لدي برمشن Manage Roles **")
        .catch(console.error);

    if (message.guild.member(user).roles.has(muteRole.id)) {
      return message
        .reply("**:white_check_mark: .. تم اعطاء العضو ميوت**")
        .catch(console.error);
    } else {
      message.guild
        .member(user)
        .addRole(muteRole)
        .then(() => {
          return message
            .reply("**:white_check_mark: .. تم اعطاء العضو ميوت كتابي**")
            .catch(console.error);
        });
    }
  }
});

niro.on("message", message => {
  if (message.author.bot) return;

  let command = message.content.split(" ")[0];

  if (command === prefix + "unmute") {
    if (message.author.bot) return;
    if (!message.member.hasPermission("MANAGE_ROLES"))
      return message
        .reply("** لا يوجد لديك برمشن 'Manage Roles' **")
        .catch(console.error);
    let user = message.mentions.users.first();
    let modlog = niro.channels.find(gg => gg.name === "log");
    let muteRole = niro.guilds
      .get(message.guild.id)
      .roles.find(gg => gg.name === "Muted");
    if (!muteRole)
      return message
        .reply("** لا يوجد لديك رتبه الميوت 'Muted' **")
        .catch(console.error);
    if (message.mentions.users.size < 1)
      return message
        .channel.send(new Discord.RichEmbed().setDescription(`
        **Command: unmute**

Unmutes a member.

**Usage:**
#unmute (user)

**Examples:**
#unmute @ニロ
#unmute 157605500488384512`));
    const embed = new Discord.RichEmbed()
      .setColor(0x00ae86)
      .setTimestamp()
      .addField("الأستعمال:", "اسكت/احكي")
      .addField(
        "تم فك الميوت عن:",
        `${user.username}#${user.discriminator} (${user.id})`
      )
      .addField(
        "بواسطة:",
        `${message.author.username}#${message.author.discriminator}`
      );

    if (
      !message.guild
        .member(niro.user)
        .hasPermission("MANAGE_ROLES_OR_PERMISSIONS")
    )
      return message
        .reply("** لا يوجد لدي برمشن Manage Roles **")
        .catch(console.error);

    if (message.guild.member(user).removeRole(muteRole.id)) {
      return message
        .reply("**:white_check_mark: .. تم فك الميوت عن الشخص **")
        .catch(console.error);
    } else {
      message.guild
        .member(user)
        .removeRole(muteRole)
        .then(() => {
          return message
            .reply("**:white_check_mark: .. تم فك الميوت عن الشخص **")
            .catch(console.error);
        });
    }
  }
});

let warning = JSON.parse(fs.readFileSync('./data/warning.json', 'utf8'));
niro.on('message', message => {
  if (message.author.bot || message.channel.type == "dm" || !message.channel.guild) return;
  if (!message.content.startsWith(prefix)) return;
  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);
  if (command == 'warn') {
    if (!message.member.hasPermission('MANAGE_GUILD')) return;
    if (!warning[message.guild.id]) warning[message.guild.id] = { warns: [] }
    let T = warning[message.guild.id].warns;
    let user = message.mentions.users.first(); if (!user) return message.channel.send(`**:rolling_eyes: I can't find this member**`)
    let reason = message.content.split(" ").slice(2).join(" "); if (!reason) return message.channel.send(`**:rolling_eyes: Please specify a reason.**`)
    let W = warning[message.guild.id].warns;
    let ID = 0; let leng = 0;
    W.forEach(w => {
      ID++;
      if (w.id !== undefined) leng++;
    })
    if (leng === 90) return message.channel.send(`** You Can't Give More than \`90\` Warns**, please reset the warn list.`)
    T.push({ user: user.id, by: message.author.id, reason: reason, time: moment(Date.now()).format('llll'), id: ID + 1 })
    message.channel.send(`**✅ @${user.username} warned!**`);
    fs.writeFile("./data/warning.json", JSON.stringify(warning), (err) => { if (err) console.error(err) });
    fs.writeFile("./data/warning.json", JSON.stringify(warning), (err) => { if (err) console.error(err) });
    user.send(new Discord.RichEmbed().addField('**:warning: You were warned!**', reason)
      .setFooter(message.guild.name, message.guild.iconURL).setTimestamp().setColor('#fffe62')); return;
  }
  if (command == 'warnings') {
    if (!message.member.hasPermission('MANAGE_GUILD')) return;
    if (!warning[message.guild.id]) warning[message.guild.id] = { warns: [] }
    let count = 0; let page = message.content.split(" ")[1]; if (!page || isNaN(page)) page = 1; if (page > 4) return message.channel.send('**Warnings are only recorded on 4 pages!**')
    let embed = new Discord.RichEmbed().setFooter(message.author.username, message.author.avatarURL)
    let W = warning[message.guild.id].warns;
    W.forEach(w => {
      if (!w.id) return; count++;
      if (page == 1) {
        if (count > 24) return null
        let reason = w.reason; let user = w.user; let ID = w.id; let By = w.by; let time = w.time;
        embed.addField(`⏱ ${time}`, `Warn ID (**${ID}**) - By <@${By}>
User: <@${user}>\n\`\`\`${reason}\`\`\``);
        if (count == 24) embed.addField('**:sparkles: More ?**', `${message.content.split(" ")[0]} 2`);
      } if (page == 2) {
        if (count <= 24) return null; if (count > 45) return null
        let reason = w.reason; let user = w.user; let ID = w.id; let By = w.by; let time = w.time;
        embed.addField(`⏱ ${time}`, `Warn ID (**${ID}**) - By <@${By}>
User: <@${user}>\n\`\`\`${reason}\`\`\``);
        if (count == 45) embed.addField('**:sparkles: More ?**', `${message.content.split(" ")[0]} 3`);
      } if (page == 3) {
        if (count <= 45) return null; if (count > 69) return null
        let reason = w.reason; let user = w.user; let ID = w.id; let By = w.by; let time = w.time;
        embed.addField(`⏱ ${time}`, `Warn ID (**${ID}**) - By <@${By}>
User: <@${user}>\n\`\`\`${reason}\`\`\``);
        if (count == 69) embed.addField('**:sparkles: More ?**', `${message.content.split(" ")[0]} 4`);
      } if (page == 4) {
        if (count <= 69) return null; if (count > 92) return null
        let reason = w.reason; let user = w.user; let ID = w.id; let By = w.by; let time = w.time;
        embed.addField(`⏱ ${time}`, `Warn ID (**${ID}**) - By <@${By}>
User: <@${user}>\n\`\`\`${reason}\`\`\``);
        if (count == 64) embed.addField('**FULL**', `** **`);
      }
    });
    embed.setTitle(`**${count} Warnings** [ ${page}/4 ]`)
    message.channel.send(embed)
  };
  if (command == 'removewarn' || command == 'rm') {
    if (!message.member.hasPermission('MANAGE_GUILD')) return;
    if (!warning[message.guild.id]) warning[message.guild.id] = { warns: [] };
    let args = message.content.split(" ")[1]; if (!args) return message.channel.send(
      `**:rolling_eyes: Please specify warning number or user mention or (all) to delete all warnings.**`);
    let user = message.mentions.members.first();
    if (user) {
      let C = 0; let a = warning[message.guild.id].warns
      a.forEach(w => {
        if (w.user !== user.id) return
        delete w.user; delete w.reason; delete w.id; delete w.by; delete w.time;
        C++;
      })
      if (C === 0) return message.channel.send(`**:mag: I can't find the warning that you're looking for.**`)
      return message.channel.send('**✅ ' + C + ' warnings has been removed.**');
    };
    if (args == 'all') {
      let c = 0; let W = warning[message.guild.id].warns;
      W.forEach(w => { if (w.id !== undefined) c++; })
      warning[message.guild.id] = { warns: [] };
      fs.writeFile("./data/warning.json", JSON.stringify(warning), (err) => { if (err) console.error(err) })
      fs.writeFile("./data/warning.json", JSON.stringify(warning), (err) => { if (err) console.error(err) })
      return message.channel.send('**✅ ' + c + ' warnings has been removed.**')
    } if (isNaN(args)) return message.channel.send(
      `**:rolling_eyes: Please specify warning number or user mention or (all) to delete all warnings.**`);
    let W = warning[message.guild.id].warns;
    let find = false;
    W.forEach(w => {
      if (w.id == args) {
        delete w.user; delete w.reason; delete w.id; delete w.by; delete w.time;
        find = true; return message.channel.send('**✅ 1 warnings has been removed.**')
      }
    }); if (find == false) return message.channel.send(`**:mag: I can't find the warning that you're looking for.**`)
  }
});

niro.on('message', message => {
  if (!message.channel.guild) return;
  if (message.content.startsWith(prefix + 'move')) {
    if (message.member.hasPermission("MOVE_MEMBERS")) {
      if (message.mentions.users.size === 0) {
        return message.channel.send(new Discord.RichEmbed().setDescription(`
        **Command: move**

Moves a member to a voice channel.

**Usage:**
#move (user) (user or channel)

**Examples:**
#move @ニロ
#move @ニロ @ProBot ✨
#move @ニロ General
`))
      }
      if (message.member.voiceChannel != null) {
        if (message.mentions.members.first().voiceChannel != null) {
          var authorchannel = message.member.voiceChannelID;
          var usermentioned = message.mentions.members.first().id;
          var embed = new Discord.RichEmbed()
            .setTitle("Succes!")
            .setColor(`${color}`)
            .setDescription(`لقد قمت بسحب <@${usermentioned}> الى الروم الصوتي الخاص بك✅ `)
          var embed = new Discord.RichEmbed()
            .setTitle(`You are Moved in ${message.guild.name}`)
            .setColor(`${color}`)
            .setDescription(`**<@${message.author.id}> Moved You To His Channel!\nServer --> ${message.guild.name}**`)
          message.guild.members.get(usermentioned).setVoiceChannel(authorchannel).then(m => message.channel.send(embed))
          message.guild.members.get(usermentioned).send(embed)
        } else {
          message.channel.send("``لا تستطيع سحب " + message.mentions.members.first() + " `يجب ان يكون هذه العضو في روم صوتي`")
        }
      } else {
        message.channel.send("**``يجب ان تكون في روم صوتي لكي تقوم بسحب العضو أليك``**")
      }
    } else {
      message.react("❌")
    }
  }
});

niro.on('message', message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix + 'clear')) {
    if (!message.channel.guild) return message.reply('⛔ | This Command For Servers Only!');
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('⛔ | You dont have **MANAGE_MESSAGES**Permission!');
    if (!message.guild.member(niro.user).hasPermission('MANAGE_MESSAGES')) return message.channel.send('⛔ | I dont have **MANAGE_MESSAGES** Permission!');
    let args = message.content.split(" ").slice(1)
    let messagecount = parseInt(args);
    if (args > 99) return message.reply("**🛑 || يجب ان يكون عدد المسح أقل من 100 .**").then(messages => messages.delete(5000))
    if (!messagecount) args = '100';
    message.channel.fetchMessages({ limit: messagecount + 1 }).then(messages => message.channel.bulkDelete(messages));
    message.channel.send(`\`\`\`js
    ${args} : عدد الرسائل التي تم مسحها\`\`\``).then(messages => messages.delete(5000));
  }
});

niro.on("message", message => {
  let roleembed = new Discord.RichEmbed()
    .setDescription(`
أمثله على الأوامر :
-role @mention rolename : لأعطاء رتبة لعضو معين
-role all rolename : لأعطاء رتبة للجميع
-role humans rolename : لأعطاء رتبة للاشخاص فقط
-role bots rolename : لأعطاء رتبة لجميع البوتات`)
    .setFooter('Requested by ' + message.author.username, message.author.avatarURL)
  var args = message.content.split(' ').slice(1);
  var msg = message.content.toLowerCase();
  if (!message.guild) return;
  if (!msg.startsWith(prefix + 'role')) return;
  if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(' **__ليس لديك صلاحيات__**');
  if (msg.toLowerCase().startsWith(prefix + 'roleembed')) {
    if (!args[0]) return message.channel.sendEmbed(roleembed)
    if (!args[1]) return message.channel.sendEmbed(roleembed)
    var role = msg.split(' ').slice(2).join(" ").toLowerCase();
    var role1 = message.guild.roles.filter(r => r.name.toLowerCase().indexOf(role) > -1).first();
    if (!role1) return message.reply(roleembed); if (message.mentions.members.first()) {
      message.mentions.members.first().addRole(role1);
      return message.reply('**:white_check_mark: [ ' + role1.name + ' ] رتبة [ ' + args[0] + ' ] تم اعطاء الى **');
    }
    if (args[0].toLowerCase() == "all") {
      message.guild.members.forEach(m => m.addRole(role1))
      return message.reply('**:white_check_mark: [ ' + role1.name + ' ] تم اعطاء الى الكل رتبة**');
    } else if (args[0].toLowerCase() == "bots") {
      message.guild.members.filter(m => m.user.bot).forEach(m => m.addRole(role1))
      return message.reply('**:white_check_mark: [ ' + role1.name + ' ] تم اعطاء الى البوتات رتبة**');
    } else if (args[0].toLowerCase() == "humans") {
      message.guild.members.filter(m => !m.user.bot).forEach(m => m.addRole(role1))
      return message.reply('**:white_check_mark: [ ' + role1.name + ' ] تم اعطاء الى البشريين رتبة**');
    }
  } else {
    if (!args[0]) return message.reply(roleembed);
    if (!args[1]) return message.reply('**:x: يرجى وضع الرتبة المراد اعطائها للشخص**');
    var role = msg.split(' ').slice(2).join(" ").toLowerCase();
    var role1 = message.guild.roles.filter(r => r.name.toLowerCase().indexOf(role) > -1).first();
    if (!role1) return message.reply('**:x: يرجى وضع الرتبة المراد اعطائها للشخص**'); if (message.mentions.members.first()) {
      message.mentions.members.first().addRole(role1);
      return message.reply('**:white_check_mark: [ ' + role1.name + ' ] رتبة [ ' + args[0] + ' ] تم اعطاء **');
    }
    if (args[0].toLowerCase() == "all") {
      message.guild.members.forEach(m => m.addRole(role1))
      return message.reply('**:white_check_mark: [ ' + role1.name + ' ] تم اعطاء الكل رتبة**');
    } else if (args[0].toLowerCase() == "bots") {
      message.guild.members.filter(m => m.user.bot).forEach(m => m.addRole(role1))
      return message.reply('**:white_check_mark: [ ' + role1.name + ' ] تم اعطاء البوتات رتبة**');
    } else if (args[0].toLowerCase() == "humans") {
      message.guild.members.filter(m => !m.user.bot).forEach(m => m.addRole(role1))
      return message.reply('**:white_check_mark: [ ' + role1.name + ' ] تم اعطاء البشريين رتبة**');
    }
  }
});

niro.on('message', message => {
  if (message.content === prefix + "lock") {
    if (!message.channel.guild) return message.reply('** This command only for servers**');

    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply(' **__ليس لديك صلاحيات__**');
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: false

    }).then(() => {
      message.reply(":lock: **has been locked.**")
    });
  }
  if (message.content === prefix + "unlock") {
    if (!message.channel.guild) return message.reply('** This command only for servers**');

    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('**__ليس لديك صلاحيات__**');
    message.channel.overwritePermissions(message.guild.id, {
      SEND_MESSAGES: true

    }).then(() => {
      message.reply(":unlock: **has been unlocked.**")
    });
  }

});

niro.on("message", message => {
  if (
    message.content == prefix + "roll"
  ) {
    var x = ["0", "0", "0", "3", "14", "7", "5", "52", "83", "72", "89", "15", "68", "72", "45", "35", "26", "39", "41", "52", "61", "69", "73", "81", "97", "100"];
    var x3 = Math.floor(Math.random() * x.length);
        message.channel.send(`${x[x3]}`)
  }
})

const shorten = require("isgd");
niro.on("message", async message => {
  if (message.content.startsWith(prefix + "short")) {
    let args = message.content.split(" ").slice(1);
    if (!args[0]) return message.channel.send(`${prefix}short <link>`)
    if (!args[1]) {
      shorten.shorten(args[0], function(res) {
        if (res.startsWith("Error:"))
          return message.channel.send("**Usage**: " + prefix + "short <link>");
        message.channel.send(`${res}`);
      });
    } else {
      shorten.custom(args[0], args[1], function(res) {
        if (res.startsWith("Error:")) return message.channel.send(`**${res}**`);
        message.channel.send(`**${res}**`);
      });
    }
  }
});

niro.on("message", async message => {
  if (message.content === prefix + "hide") {
    if (!message.channel.guild) return;
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.reply("You Dont Have Perms ❌");
    message.channel.overwritePermissions(message.guild.id, {
      READ_MESSAGES: false
    });
    message.channel.send("Channel Hided Successfully ! ✅  ");
  }
});

niro.on("message", async message => {
  if (message.content === prefix + "show") {
    if (!message.channel.guild) return;
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.reply("You Dont Have Perms ❌");
    message.channel.overwritePermissions(message.guild.id, {
      READ_MESSAGES: true
    });
    message.channel.send("Channel Hided Successfully ! ✅  ");
  }
});

niro.on("message", async message => {
  if (message.content.startsWith(`${prefix}ping`)) {
    if (!message.channel.guild) return;
    if (message.author.bot) return;
    message.channel.send(`\`\`\`js
Time_Taken: ${Date.now() - message.createdTimestamp} ms 📶
Web_Socket: ${Math.round(niro.ping)} ms 📶\`\`\``)
  }
})

niro.on('message', async message => {
  if (message.content.startsWith(prefix + 'roles')) {
    message.channel.send(`${message.guild.roles.map(e => e.toString()).join(" ")}`)
  }
});

const queue = new Map();

let cmds = {
  play: { cmd: "play", a: ["p", "شغل"] },
  skip: { cmd: "skip", a: ["s", "تخطى"] },
  stop: { cmd: "stop", a: ["ايقاف"] },
  pause: { cmd: "pause", a: ["ايقاف مؤقت"] },
  resume: { cmd: "resume", a: ["r", "كمل"] },
  volume: { cmd: "volume", a: ["vol", "صوت"] },
  queue: { cmd: "queue", a: ["q", "قائمة"] },
  repeat: { cmd: "repeat", a: ["re", "تكرار"] },
  forceskip: { cmd: "forceskip", a: ["تخطي الكل", "fskip"] },
  skipto: { cmd: "skipto", a: ["st", "اذهب الى"] },
  nowplaying: { cmd: "Nowplaying", a: ["np", "الان"] }
};

niro.commands = new Discord.Collection();
niro.aliases = new Discord.Collection();

Object.keys(cmds).forEach(key => {
  var value = cmds[key];
  var command = value.cmd;
  niro.commands.set(command, command);

  if (value.a) {
    value.a.forEach(alias => {
      niro.aliases.set(alias, command);
    });
  }
});

setInterval(() => {
  const channel = niro.channels.get(roomid);
  if (!channel) return console.error("I can't find this channel!");
  channel
    .join()
    .then(con => {
      console.log("Working!");
    })
    .catch(e => {
      console.error(e);
    });
}, 3000);

let active = new Map();

niro.on("warn", console.warn);

niro.on("error", console.error);

niro.on("message", async msg => {
  if (msg.author.bot) return undefined;
  if (!msg.content.startsWith(prefix)) return undefined;

  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  const url = args[1] ? args[1].replace(/<(.+)>/g, "$1") : "";

  let cmd =
    niro.commands.get(command) ||
    niro.commands.get(niro.aliases.get(command));

  let s;

  if (cmd === "play") {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel)
      return msg.channel.send(
        `:no_entry_sign: You must be listening in a voice channel to use that!`
      );
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT")) {
      return msg.channel.send(
        `:no_entry_sign: I can't join Your voiceChannel because i don't have ` +
          "`" +
          "`CONNECT`" +
          "`" +
          ` permission!`
      );
    }

    if (!permissions.has("SPEAK")) {
      return msg.channel.send(
        `:no_entry_sign: I can't SPEAK in your voiceChannel because i don't have ` +
          "`" +
          "`SPEAK`" +
          "`" +
          ` permission!`
      );
    }

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();

      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
      }
      return msg.channel.send(`Added to queue: ${playlist.title}`);
    } else {
      try {
        var video = await youtube.getVideo(url);
      } catch (error) {
        try {
          var videos = await youtube.searchVideos(args, 1);

          // eslint-disable-next-line max-depth
          var video = await youtube.getVideoByID(videos[0].id);
        } catch (err) {
          console.error(err);
          return msg.channel.send("I can't find any thing");
        }
      }

      return handleVideo(video, msg, voiceChannel);
    }

    async function handleVideo(video, msg, voiceChannel, playlist = false) {
      const serverQueue = active.get(msg.guild.id);

      //	console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));

      let hrs =
        video.duration.hours > 0
          ? video.duration.hours > 9
            ? `${video.duration.hours}:`
            : `0${video.duration.hours}:`
          : "";
      let min =
        video.duration.minutes > 9
          ? `${video.duration.minutes}:`
          : `0${video.duration.minutes}:`;
      let sec =
        video.duration.seconds > 9
          ? `${video.duration.seconds}`
          : `0${video.duration.seconds}`;
      let dur = `${hrs}${min}${sec}`;

      let ms = video.durationSeconds * 1000;

      const song = {
        id: video.id,
        title: video.title,
        duration: dur,
        msDur: ms,
        url: `https://www.youtube.com/watch?v=${video.id}`
      };
      if (!serverQueue) {
        const queueConstruct = {
          textChannel: msg.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 25, 
          requester: msg.author,
          playing: true,
          repeating: false
        };
        active.set(msg.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueConstruct.connection = connection;
          play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
          console.error(`I could not join the voice channel: ${error}`);
          active.delete(msg.guild.id);
          return msg.channel.send(`I cant join this voice channel`);
        }
      } else {
        serverQueue.songs.push(song);

        if (playlist) return undefined;
        if (!args) return msg.channel.send("no results.");
        else
          return msg.channel
            .send(":watch: Loading... [`" + args + "`]")
            .then(m => {
              setTimeout(() => {
                //:watch: Loading... [let]
                m.edit(
                  `:notes: Added **${song.title}**` +
                    "(` " +
                    song.duration +
                    ")`" +
                    ` to the queue at position ` +
                    `${serverQueue.songs.length}`
                );
              }, 500);
            });
      }
      return undefined;
    }

    function play(guild, song) {
      const serverQueue = active.get(guild.id);

      if (!song) {
        serverQueue.voiceChannel.leave();
        active.delete(guild.id);
        return;
      }
      //console.log(serverQueue.songs);
      if (serverQueue.repeating) {
        console.log("Repeating");
      } else {
        serverQueue.textChannel.send(
          ":notes: Added **" +
            song.title +
            "** (`" +
            song.duration +
            "`) to begin playing."
        );
      }
      const dispatcher = serverQueue.connection
        .playStream(ytdl(song.url))
        .on("end", reason => {
          //if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
          //else console.log(reason);
          if (serverQueue.repeating) return play(guild, serverQueue.songs[0]);
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    }
  } else if (cmd === "stop") {
    if (msg.guild.me.voiceChannel !== msg.member.voiceChannel)
      return msg.channel.send(
        `You must be in ${msg.guild.me.voiceChannel.name}`
      );
     if (!msg.member.hasPermission("ADMINISTRATOR")) {
        msg.react("❌");
        return msg.channel.send("You don't have permission `ADMINSTRATOR`");
      }//not by niro bro :)
    let queue = active.get(msg.guild.id);
    if (queue.repeating)
      return msg.channel.send(
        "Repeating Mode is on, you can't stop the music, run `" +
          `${prefix}repeat` +
          "` to turn off it."
      );
    queue.songs = [];
    queue.connection.dispatcher.end();
    return msg.channel.send(
      ":notes: The player has stopped and the queue has been cleared."
    );
  } else if (cmd === "skip") {
    let vCh = msg.member.voiceChannel;

    let queue = active.get(msg.guild.id);

    if (!vCh)
      return msg.channel.send(
        "Sorry, but you can't because you are not in voice channel"
      );

    if (!queue) return msg.channel.send("No music playing to skip it");

    if (queue.repeating)
      return msg.channel.send(
        "You can't skip it, because repeating mode is on, run " +
          `\`${prefix}forceskip\``
      );

    // let req = vCh.members.size - 1;

    //if (req == 1) {
    msg.channel.send("**:notes: Skipped **" + args);
    return queue.connection.dispatcher.end("Skipping ..");
    // }

    // if (!queue.votes) queue.votes = [];

    // if (queue.votes.includes(msg.member.id))
    //  return msg.say(
    //    `You already voted for skip! ${queue.votes.length}/${req}`
    //  );

    //  queue.votes.push(msg.member.id);

    //  if (queue.votes.length >= req) {
    //     msg.channel.send("**:notes: Skipped **" + args);

    //     delete queue.votes;

    //     return queue.connection.dispatcher.end("Skipping ..");
    //   }
    //
    //  msg.channel.send(
    //  `**You have successfully voted for skip! ${queue.votes.length}/${req}**`
    // );
  } else if (cmd === "pause") {
    let queue = active.get(msg.guild.id);

    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send(`You are not in my voice channel.`);

    if (!queue) {
      return msg.channel.send("No music playing to pause.");
    }

    if (!queue.playing)
      return msg.channel.send(
        ":no_entry_sign: There must be music playing to use that!"
      );

    let disp = queue.connection.dispatcher;

    disp.pause("Pausing..");

    queue.playing = false;

    msg.channel.send(
      ":notes: Paused " + args + ". **Type** `" + prefix + "resume` to unpause!"
    );
  } else if (cmd === "resume") {
    let queue = active.get(msg.guild.id);

    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send(`You are not in my voice channel.`);

    if (!queue) return msg.channel.send(":notes: No music paused to resume.");

    if (queue.playing)
      return msg.channel.send(":notes: No music paused to resume.");

    let disp = queue.connection.dispatcher;

    disp.resume("Resuming..");

    queue.playing = true;

    msg.channel.send(":notes: Resumed.");
  } else if (cmd === "volume") {
    let queue = active.get(msg.guild.id);

    if (!queue || !queue.songs)
      return msg.channel.send(
        ":notes: There is no music playing to set volume."
      );

    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send(":notes: You are not in my voice channel");

    let disp = queue.connection.dispatcher;

    if (isNaN(args[0])) return msg.channel.send(":notes: Numbers only!");

    if (parseInt(args[0]) > 100)
      return msg.channel.send("You can't set the volume more than **100**.");
    //:speaker: Volume changed from 20 to 20 ! The volume has been changed from ${queue.volume} to ${args[0]}
    msg.channel.send(
      ":loud_sound: Volume has been **changed** from (`" +
        queue.volume +
        "`) to (`" +
        args[0] +
        "`)"
    );

    queue.volume = args[0];

    disp.setVolumeLogarithmic(queue.volume / 100);
  } else if (cmd === "queue") {
    let queue = active.get(msg.guild.id);

    if (!queue)
      return msg.channel.send(
        ":no_entry_sign: There must be music playing to use that!"
      );

    let embed = new Discord.RichEmbed().setAuthor(
      `${niro.user.username}`,
      niro.user.displayAvatarURL
    );
    let text = "";

    for (var i = 0; i < queue.songs.length; i++) {
      let num;
      if (i > 8) {
        let st = `${i + 1}`;
        let n1 = Converter.toWords(st[0]);
        let n2 = Converter.toWords(st[1]);
        num = `:${n1}::${n2}:`;
      } else {
        let n = Converter.toWords(i + 1);
        num = `:${n}:`;
      }
      text += `${num} ${queue.songs[i].title} [${queue.songs[i].duration}]\n`;
    }
    embed.setDescription(`Songs Queue | ${msg.guild.name}\n\n ${text}`);
    msg.channel.send(embed);
  } else if (cmd === "repeat") {
    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send("You are not in my voice channel");

    let queue = active.get(msg.guild.id);

    if (!queue || !queue.songs)
      return msg.channel.send("There is no music playing to repeat it.");

    if (queue.repeating) {
      queue.repeating = false;
      return msg.channel.send(
        ":arrows_counterclockwise: **Repeating Mode** (`False`)"
      );
    } else {
      queue.repeating = true;
      return msg.channel.send(
        ":arrows_counterclockwise: **Repeating Mode** (`True`)"
      );
    }
  } else if (cmd === "forceskip") {
    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send("You are not in my voice channel");

    let queue = active.get(msg.guild.id);

    if (queue.repeating) {
      queue.repeating = false;

      msg.channel.send("ForceSkipped, Repeating mode is on.");

      queue.connection.dispatcher.end("ForceSkipping..");

      queue.repeating = true;
    } else {
      queue.connection.dispatcher.end("ForceSkipping..");

      msg.channel.send("ForceSkipped.");
    }
  } else if (cmd === "skiper") {
    let vCh = msg.member.voiceChannel;

    if (!vCh || vCh !== msg.guild.me.voiceChannel)
      return msg.channel.send("You are not in my voice channel");

    let queue = active.get(msg.guild.id);

    if (!queue.songs || queue.songs < 2)
      return msg.channel.send("There is no music to skip to.");

    if (queue.repeating)
      return msg.channel.send(
        "You can't skip, because repeating mode is on, run " +
          `\`${prefix}repeat\` to turn off.`
      );

    if (!args[0] || isNaN(args[0]))
      return msg.channel.send(
        "Please input song number to skip to it, run " +
          prefix +
          `queue` +
          " to see songs numbers."
      );

    let sN = parseInt(args[0]) - 1;

    if (!queue.songs[sN])
      return msg.channel.send("There is no song with this number.");

    let i = 1;

    msg.channel.send(
      `Skipped to: **${queue.songs[sN].title}[${queue.songs[sN].duration}]**`
    );

    while (i < sN) {
      i++;
      queue.songs.shift();
    }

    queue.connection.dispatcher.end("SkippingTo..");
  } else if (cmd === "nowplaying") {
    let q = active.get(msg.guild.id);

    let now = npMsg(q);

    msg.channel.send(now.mes, now.embed).then(me => {
      setInterval(() => {
        let noww = npMsg(q);
        me.edit(noww.mes, noww.embed);
      }, 5000);
    });

    function npMsg(queue) {
      let m =
        !queue || !queue.songs[0] ? "No music playing." : "Now Playing...";

      const eb = new Discord.RichEmbed();

      eb.setColor(msg.guild.me.displayHexColor);

      if (!queue || !queue.songs[0]) {
        eb.setTitle("No music playing");
        eb.setDescription(
          "\u23F9 " + bar(-1) + " " + volumeIcon(!queue ? 100 : queue.volume)
        );
      } else if (queue.songs) {
        if (queue.requester) {
          let u = msg.guild.members.get(queue.requester.id);

          if (!u) eb.setAuthor("Unkown (ID:" + queue.requester.id + ")");
          else eb.setAuthor(u.user.tag, u.user.displayAvatarURL);
        }

        if (queue.songs[0]) {
          try {
            eb.setTitle(queue.songs[0].title);
            eb.setURL(queue.songs[0].url);
          } catch (e) {
            eb.setTitle(queue.songs[0].title);
          }
        }
        eb.setDescription(embedFormat(queue));
      }

      return {
        mes: m,
        embed: eb
      };
    }

    function embedFormat(queue) {
      if (!queue || !queue.songs) {
        return "No music playing\n\u23F9 " + bar(-1) + " " + volumeIcon(100);
      } else if (!queue.playing) {
        return (
          "No music playing\n\u23F9 " + bar(-1) + " " + volumeIcon(queue.volume)
        );
      } else {
        let progress = queue.connection.dispatcher.time / queue.songs[0].msDur;
        let prog = bar(progress);
        let volIcon = volumeIcon(queue.volume);
        let playIcon = queue.connection.dispatcher.paused ? "\u23F8" : "\u25B6";
        let dura = queue.songs[0].duration;

        return (
          playIcon +
          " " +
          prog +
          " `[" +
          formatTime(queue.connection.dispatcher.time) +
          "/" +
          dura +
          "]`" +
          volIcon
        );
      }
    }

    function formatTime(duration) {
      var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      return (hours > 0 ? hours + ":" : "") + minutes + ":" + seconds;
    }

    function bar(precent) {
      var str = "";

      for (var i = 0; i < 12; i++) {
        let pre = precent;
        let res = pre * 12;

        res = parseInt(res);

        if (i == res) {
          str += "\uD83D\uDD18";
        } else {
          str += "▬";
        }
      }

      return str;
    }

    function volumeIcon(volume) {
      if (volume == 0) return "\uD83D\uDD07";
      if (volume < 30) return "\uD83D\uDD08";
      if (volume < 70) return "\uD83D\uDD09";
      return "\uD83D\uDD0A";
    }
  }
});

niro.on('message', message => {
  if(message.content === prefix + 'colors') {
  if(!message.channel.guild) return message.channel.send('**This Commnad only For Servers !**'); 
let menu = new Discord.RichEmbed()
.setImage('https://b.top4top.net/p_1002p20mv1.png')
.setFooter('Colors Menu')
message.channel.sendEmbed(menu)
  }
})

niro.on('message', message => {
  if(message.content === prefix + 'createcolors') {
                       if(!message.channel.guild) return message.channel.send('**This Commnad only For Servers !**'); 
       if(!message.member.hasPermission('ADMINISTRATOR')) return    message.channel.send('**You Dont Have** `ADMINISTRATOR` **premission**').then(msg => msg.delete(6000))
    message.guild.createRole({
                name: "1",
                  color: "#FFB6C1",
                  permissions: []
   })
         message.guild.createRole({
                name: "2",
                  color: "#FFC0CB",
                  permissions: []
   })
              message.guild.createRole({
                name: "3",
                  color: "#FF69B4",
                  permissions: []
   })
                   message.guild.createRole({
                name: "4",
                  color: "#FF1493",
                  permissions: []
   })
                   message.guild.createRole({
                name: "5",
                  color: "#DB7093",
                  permissions: []
   })
                   message.guild.createRole({
                name: "6",
                  color: "#C71585",
                  permissions: []
   })
                   message.guild.createRole({
                name: "7",
                  color: "#E6E6FA",
                  permissions: []
   })
                   message.guild.createRole({
                name: "8",
                  color: "#D8BFD8",
                  permissions: []
   })
                   message.guild.createRole({
                name: "8",
                  color: "#DDA0DD",
                  permissions: []
   })
                   message.guild.createRole({
                name: "9",
                  color: "#DA70D6",
                  permissions: []
   })
                   message.guild.createRole({
                name: "10",
                  color: "#EE82EE",
                  permissions: []
   })
                   message.guild.createRole({
                name: "11",
                  color: "#FF00FF",
                  permissions: []
   })
                   message.guild.createRole({
                name: "12",
                  color: "#BA55D3",
                  permissions: []
   })
                   message.guild.createRole({
                name: "13",
                  color: "#9932CC",
                  permissions: []
   })
                        message.guild.createRole({
                name: "14",
                  color: "#9400D3",
                  permissions: []
   })
                        message.guild.createRole({
                name: "15",
                  color: "#8A2BE2",
                  permissions: []
   })
                             message.guild.createRole({
                name: "16",
                  color: "#8B008B",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "17",
                  color: "#800080",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "18",
                  color: "#9370DB",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "19",
                  color: "#7B68EE",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "20",
                  color: "#6A5ACD",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "21",
                  color: "#483D8B",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "22",
                  color: "#663399",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "23",
                  color: "#4B0082",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "24",
                  color: "#FFA07A",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "25",
                  color: "#FA8072",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "26",
                  color: "#E9967A",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "27",
                  color: "#F08080",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "28",
                  color: "#CD5C5C",
                  permissions: []
   })
                                  message.guild.createRole({
                name: "29",
                  color: "#DC143C",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "30",
                  color: "	#FF0000",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "31",
                  color: "#B22222",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "32",
                  color: "#8B0000",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "33",
                  color: "#FFA500",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "34",
                  color: "#FF8C00",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "35",
                  color: "#FF7F50",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "36",
                  color: "#FF6347",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "37",
                  color: "#FF4500",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "38",
                  color: "#FFD700",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "39",
                  color: "#FFFFE0",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "40",
                  color: "#FFFACD",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "41",
                  color: "#FAFAD2",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "42",
                  color: "	#FFEFD5",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "43",
                  color: "#FFE4B5",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "44",
                  color: "#FFDAB9",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "45",
                  color: "#EEE8AA",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "46",
                  color: "#F0E68C",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "47",
                  color: "#BDB76B",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "48",
                  color: "#ADFF2F",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "49",
                  color: "#7FFF00",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "50",
                  color: "#7CFC00",
                  permissions: []
   })
                                       message.guild.createRole({
                name: "51",
                  color: "#00FF00",
                  permissions: []
   })  
   
                                       message.guild.createRole({
                name: "52",
                  color: "#32CD32",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "53",
                  color: "#98FB98",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "54",
                  color: "#90EE90",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "55",
                  color: "#00FA9A",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "56",
                  color: "#00FF7F",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "57",
                  color: "#3CB371",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "58",
                  color: "#2E8B57",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "59",
                  color: "#2E8B57",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "60",
                  color: "#008000",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "61",
                  color: "#006400",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "62",
                  color: "#9ACD32",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "63",
                  color: "#6B8E23",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "64",
                  color: "#556B2F",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "65",
                  color: "#66CDAA",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "66",
                  color: "#8FBC8F",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "67",
                  color: "#20B2AA",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "68",
                  color: "#008B8B",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "69",
                  color: "#008080",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "70",
                  color: "#00FFFF",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "71",
                  color: "#E0FFFF",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "72",
                  color: "#AFEEEE",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "73",
                  color: "#7FFFD4",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "74",
                  color: "#40E0D0",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "75",
                  color: "#48D1CC",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "76",
                  color: "#00CED1",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "77",
                  color: "#5F9EA0",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "78",
                  color: "#4682B4",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "79",
                  color: "#B0C4DE",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "80",
                  color: "#ADD8E6",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "81",
                  color: "#B0E0E6",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "82",
                  color: "#87CEFA",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "83",
                  color: "#87CEEB",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "84",
                  color: "#6495ED",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "85",
                  color: "#00BFFF",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "86",
                  color: "#1E90FF",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "87",
                  color: "#4169E1",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "88",
                  color: "#0000FF",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "89",
                  color: "#0000CD",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "90",
                  color: "#00008B",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "91",
                  color: "#000080",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "92",
                  color: "#191970",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "93",
                  color: "#FFF8DC",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "94",
                  color: "#FFEBCD",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "95",
                  color: "#FFE4C4",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "96",
                  color: "#FFDEAD",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "97",
                  color: "#F5DEB3",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "98",
                  color: "#DEB887",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "99",
                  color: "#D2B48C",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "100",
                  color: "#BC8F8F",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "101",
                  color: "#F4A460",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "102",
                  color: "#DAA520",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "103",
                  color: "#B8860B",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "104",
                  color: "#CD853F",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "105",
                  color: "#D2691E",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "106",
                  color: "#808000",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "107",
                  color: "#8B4513",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "108",
                  color: "#A0522D",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "109",
                  color: "#A52A2A",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "110",
                  color: "#800000",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "111",
                  color: "#FFFFFF",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "112",
                  color: "#FFFAFA",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "113",
                  color: "#F0FFF0",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "114",
                  color: "#F5FFFA",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "115",
                  color: "#F0FFFF",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "116",
                  color: "#F0F8FF",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "117",
                  color: "#F8F8FF",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "118",
                  color: "#F5F5F5",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "119",
                  color: "#FFF5EE",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "120",
                  color: "#F5F5DC",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "121",
                  color: "#FDF5E6",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "122",
                  color: "#FFFAF0",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "123",
                  color: "#FFFFF0",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "124",
                  color: "#FAEBD7",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "125",
                  color: "#FAF0E6",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "126",
                  color: "#FFF0F5",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "127",
                  color: "#FFE4E1",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "128",
                  color: "#DCDCDC",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "129",
                  color: "#D3D3D3",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "130",
                  color: "#C0C0C0",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "131",
                  color: "#f7f7f7",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "132",
                  color: "#b2b2b2",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "133",
                  color: "#6f6c6c",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "134",
                  color: "#4d4646",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "135",
                  color: "#4c4c4c",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "136",
                  color: "#2F4F4F",
                  permissions: []
   })     
                                       message.guild.createRole({
                name: "137",
                  color: "#040000",
                  permissions: []
   })     

   
        message.channel.sendMessage({embed: new Discord.RichEmbed()
   .setColor('#502faf').setAuthor(`${message.author.username}'`, message.author.avatarURL).setDescription('``Colors Has Been Created``')});
  }
})

niro.on("message", async message => {
  let args = message.content.split(" ").slice(1);
  if (message.content.split(" ")[0] == prefix + "color") {
    const embedd = new Discord.RichEmbed()
      .setFooter(
        "Requested by " + message.author.username,
        message.author.avatarURL
      )
      .setDescription(`**There's No Color With This Number ** :x: `)
      .setColor(`ff0000`);
    if (!args[0]) return message.channel.sendEmbed(embedd);
    if (isNaN(args[0]))
      return message.channel.sendEmbed(
        embedd.setDescription("Please select a number :x:")
      );
    if (!message.guild.roles.find("name", `${args[0]}`))
      return message.channel.sendEmbed(embedd);

    var a = message.guild.roles.find("name", `${args[0]}`);
    if (!a) return;
    if (a.hasPermission(8))
      return message.channel.send(
        embedd.setDescription("This color has administrator!")
      );
    const embed = new Discord.RichEmbed()

      .setFooter(
        "Requested by " + message.author.username,
        message.author.avatarURL
      )
      .setDescription(`**Color Changed To Successfully** :white_check_mark: `)

      .setColor(`${a.hexColor}`);
    message.channel.sendEmbed(embed);
    if (!args[0]) return;
    setInterval(function() {});
    let count = 0;
    let ecount = 0;
    for (let x = 1; x < 201; x++) {
      message.member.removeRole(message.guild.roles.find("name", `${x}`));
    }
    message.member.addRole(message.guild.roles.find("name", `${args[0]}`));
  }
});

const temp = JSON.parse(fs.readFileSync('./data/temp.json', 'utf8'));
niro.on('message', async message => {
 if(message.channel.type === "dm") return;
  if(message.author.bot) return;
   if(!temp[message.guild.id]) temp[message.guild.id] = {
    time: "3000",
     category : 'Create Temp Channel',
      channel : 'Create Temp Channel'
       }
        if(message.content.startsWith(prefix + 'temp on')){
         if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
          var ggg= message.guild.createChannel('Create Temp Channel', 'category').then(cg => {
           var ccc =message.guild.createChannel('Create Temp Channel', 'voice').then(ch => {
            ch.setParent(cg)
             message.channel.send('**Done ,**')
              niro.on('message' , message => {
               if(message.content === prefix + 'temp off') {
                if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
                 cg.delete()
                  ch.delete()
                   message.channel.send('**Done ,**')
                    }
                     });
                      const time = temp[message.guild.id].time
                       niro.on('message' , message => {
                        if (message.content.startsWith(prefix + "temptime")) {
                         if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
                          let newTime= message.content.split(' ').slice(1).join(" ")
                          if(!newTime) return message.reply(`**${prefix}temptime <time>  \`1000 = 1s\`**`)
	                 if(isNaN(newTime)) return message.reply(`** The Time Be Nambers :face_palm: **`);
	                if(newTime < 1) return message.reply(`**The Time Be Up \`3000s\`**`)
                       temp[message.guild.id].time = newTime
                      message.channel.send(`**Temp Rooms Time Change To \`${newTime}\`**`);
                     }
                    });
                   niro.on('voiceStateUpdate', (old, neww) => {
                  let newUserChannel = neww.voiceChannel
                 let oldUserChannel = old.voiceChannel
                temp[message.guild.id].category = cg.id
               temp[message.guild.id].channel = ch.id
              let channel = temp[message.guild.id].channel
             let category = temp[message.guild.id].category
            if(oldUserChannel === undefined && newUserChannel !== undefined && newUserChannel.id == channel) {
           neww.guild.createChannel(neww.displayName , 'voice').then(c => {
          c.setParent(category)
         let scan = setTimeout(()=>{
        if(!neww.voiceChannel) {
       c.delete();
      niro.channels.get(channel).overwritePermissions(neww, {
     CONNECT:true,
    SPEAK:true
   })
  }
 }, temp[neww.guild.id].time);
  c.overwritePermissions(neww, {
   CONNECT:true,
    SPEAK:true,
     MANAGE_CHANNEL:true,
      MUTE_MEMBERS:true,
       DEAFEN_MEMBERS:true,
	MOVE_MEMBERS:true,
	 VIEW_CHANNEL:true
	  })
	   neww.setVoiceChannel(c)
            })
             niro.channels.get(channel).overwritePermissions(neww, {
	      CONNECT:false,
	       SPEAK:false
		})
               }
              })
             })
           })
          }
         fs.writeFile("./data/temp.json", JSON.stringify(temp), (err) => {
        if(err) console.error(err)
       })
      });

     niro.on('message',message=>{
      const auto = require('./data/auto.json')
      if(!auto) return console.log(`**هناك خطأ في ملف الرد للبوت**`)
      let args = message.content.split(' ')
      if(message.content.startsWith(prefix + 'auto')){
          if(!message.guild) return;
          if(message.author.bot) return;
          if(!message.member.hasPermission('ADMINISTRATOR')) return;
          if(!args[1]) return message.channel.send(new Discord.RichEmbed().setDescription(`
          **Command: auto-respoce**

Unmutes a member.

**Usage:**
#auto (msg) (respoce)

**Examples:**
#auto (msg) (respoce)
#unmute hello hi`))
          if(!args[2]) return message.channel.send(new Discord.RichEmbed().setDescription(`
          **Command: auto-respoce**

Unmutes a member.

**Usage:**
#auto (msg) (respoce)

**Examples:**
#auto (msg) (respoce)
#unmute hello hi`))
          auto[args[1]+message.guild.id] = {
              msg : args[1],
              guild : message.guild.id,
              reply : args[2]
          }
          fs.writeFile('data/auto.json',JSON.stringify(auto,null,5),err=>{
              console.error(err);
          })
          message.channel.send(`**:white_check_mark:  تم اضافة الرد التلقائي**`)
      }
      if(message.content.startsWith(prefix + 'adelete')){
          if(!message.guild) return;
          if(message.author.bot) return;
          if(!message.member.hasPermission('ADMINISTRATOR')) return;
          if(!args[1]) return message.channel.send(`**${prefix}adelete \`Massage\` \`Respoce\`**`)
          if(!auto[args[1]+message.guild.id]) return message.channel.send(`**:negative_squared_cross_mark:  لا استطيع العثور على الرد**`)
          delete auto[args[1]+message.guild.id]
          fs.writeFile('data/auto.json',JSON.stringify(auto,null,5),err=>{
              console.error(err);
          })
          message.channel.send(`**:white_check_mark: تم حذف الرد **`)
      }
      let niro  = message.content
      if(!auto[niro+message.guild.id]) return;
      if(niro == auto[niro+message.guild.id].msg) return message.channel.send(auto[niro+message.guild.id].reply)
  })

  const Arole_niro = JSON.parse(fs.readFileSync("./data/AutoRole.json", "utf8"));
niro.on('message', message => {
if(message.channel.type === "dm") return;
if(message.author.bot) return;
   if(!Arole_niro[message.guild.id]) Arole_niro[message.guild.id] = {
    role: "member"
  }
const channel = Arole_niro[message.guild.id].role
  if (message.content.startsWith(prefix + "autorole")) {
    if(!message.member.hasPermission(`MANAGE_GUILD`)) return;
    let newrole = message.content.split(' ').slice(1).join(" ")
    if(!newrole) return message.reply(`**${prefix}autorole <role name>**`)
    Arole_niro[message.guild.id].role = newrole
    message.channel.send(`**${message.guild.name}'s role has been changed to ${newrole}**`);
  }
fs.writeFile("./data/AutoRole.json", JSON.stringify(Arole_niro), function(e){
    if (e) throw e;
})
});
niro.on("guildMemberAdd", member => {
      if(!Arole_niro[member.guild.id]) Arole_niro[member.guild.id] = {
    role: "member"
  }
    const sRole = Arole_niro[member.guild.id].role
    let Rrole = member.guild.roles.find('name', sRole);
  member.addRole(Rrole);
 
  
      
      });

      niro.on("message", message => {
        if (message.author.bot) return;
       
        if (!message.content.startsWith(prefix)) return;
       
        let command = message.content.split(" ")[0];
        command = command.slice(prefix.length);
       
        let args = message.content.split(" ").slice(1);
        if (command === "say") {
          if (!message.channel.guild)
            return message.channel
              .send("هذا الأمر فقط للسيرفرات")
              .then(m => m.delete(5000));
          if (!message.member.hasPermission("ADMINISTRATOR"))
            return message.channel.send("للأسف لا تمتلك صلاحية ADMINISTRATOR");
          message.delete();
          message.channel.sendMessage(args.join(" "));
        }
       
        if (command == "embed") {
          if (!message.channel.guild)
            return message.channel
              .send("هذا الأمر فقط للسيرفرات")
              .then(m => m.delete(5000));
          if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.channel.send("للأسف لا تمتلك صلاحية MANAGE_MESSAGES");
          let say = new Discord.RichEmbed()
            .setDescription(args.join("  "))
            .setColor(0x23b2d6);
          message.channel.sendEmbed(say);
          message.delete();
        }
      });

      const log = JSON.parse(fs.readFileSync("./data/log.json", "utf8"));

      niro.on("message", message => {
        if (!message.channel.guild) return;
        let room = message.content.split(" ").slice(1);
        let findroom = message.guild.channels.find(r => r.name == room);
        if (message.content.startsWith(prefix + "set-log")) {
          if (!message.channel.guild)
            return message.reply("**This Command Only For Servers**");
          if (!message.member.hasPermission("MANAGE_GUILD"))
            return message.channel.send(
              "**Sorry But You Dont Have Permission** `MANAGE_GUILD`"
            );
          if (!room) return message.channel.send("Please Type The Channel Name");
          if (!findroom)
            return message.channel.send("Please Type The Log Channel Name");
          let embed = new Discord.RichEmbed()
            .setTitle("**Done The Log Code Has Been Setup**")
            .addField("Channel:", `${room}`)
            .addField("Requested By:", `${message.author}`)
            .setThumbnail(message.author.avatarURL)
            .setFooter(`${niro.user.username}`);
          message.channel.sendEmbed(embed);
          log[message.guild.id] = {
            channel: room,
            onoff: "On"
          };
          fs.writeFile("./data/log.json", JSON.stringify(log), err => {
            if (err) console.error(err);
          });
        }
      });
      
      niro.on("message", message => {
        if (message.content.startsWith(prefix + "toggleLog")) {
          if (!message.channel.guild)
            return message.reply("**This Command Only For Servers**");
          if (!message.member.hasPermission("MANAGE_GUILD"))
            return message.channel.send(
              "**Sorry But You Dont Have Permission** `MANAGE_GUILD`"
            );
          if (!log[message.guild.id])
            log[message.guild.id] = {
              onoff: "Off"
            };
          if (log[message.guild.id].onoff === "Off")
            return [
              message.channel.send(`**The log Is __𝐎𝐍__ !**`),
              (log[message.guild.id].onoff = "On")
            ];
          if (log[message.guild.id].onoff === "On")
            return [
              message.channel.send(`**The log Is __𝐎𝐅𝐅__ !**`),
              (log[message.guild.id].onoff = "Off")
            ];
          fs.writeFile("./data/log.json", JSON.stringify(log), err => {
            if (err)
              console.error(err).catch(err => {
                console.error(err);
              });
          });
        }
      });
      
      niro.on("messageDelete", message => {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        if (!message.guild.member(niro.user).hasPermission("EMBED_LINKS")) return;
        if (!message.guild.member(niro.user).hasPermission("MANAGE_MESSAGES"))
          return;
        if (!log[message.guild.id])
          log[message.guild.id] = {
            onoff: "Off"
          };
        if (log[message.guild.id].onoff === "Off") return;
        var logChannel = message.guild.channels.find(
          c => c.name === `${log[message.guild.id].channel}`
        );
        if (!logChannel) return;
      
        let messageDelete = new Discord.RichEmbed()
          .setTitle("**[MESSAGE DELETE]**")
          .setColor("RED")
          .setThumbnail(message.author.avatarURL)
          .setDescription(
            `**\n**:wastebasket: Successfully \`\`DELETE\`\` **MESSAGE** In ${message.channel}\n\n**Channel:** \`\`${message.channel.name}\`\` (ID: ${message.channel.id})\n**Message ID:** ${message.id}\n**Sent By:** <@${message.author.id}> (ID: ${message.author.id})\n**Message:**\n\`\`\`${message}\`\`\``
          )
          .setTimestamp()
          .setFooter(message.guild.name, message.guild.iconURL);
      
        logChannel.send(messageDelete);
      });
      niro.on("messageUpdate", (oldMessage, newMessage) => {
        if (oldMessage.author.bot) return;
        if (!oldMessage.channel.type === "dm") return;
        if (!oldMessage.guild.member(niro.user).hasPermission("EMBED_LINKS"))
          return;
        if (!oldMessage.guild.member(niro.user).hasPermission("MANAGE_MESSAGES"))
          return;
        if (!log[oldMessage.guild.id])
          log[oldMessage.guild.id] = {
            onoff: "Off"
          };
        if (log[oldMessage.guild.id].onoff === "Off") return;
        var logChannel = oldMessage.guild.channels.find(
          c => c.name === `${log[oldMessage.guild.id].channel}`
        );
        if (!logChannel) return;
      
        if (oldMessage.content.startsWith("https://")) return;
      
        let messageUpdate = new Discord.RichEmbed()
          .setTitle("**[MESSAGE EDIT]**")
          .setThumbnail(oldMessage.author.avatarURL)
          .setColor("BLUE")
          .setDescription(
            `**\n**:wrench: Successfully \`\`EDIT\`\` **MESSAGE** In ${oldMessage.channel}\n\n**Channel:** \`\`${oldMessage.channel.name}\`\` (ID: ${oldMessage.channel.id})\n**Message ID:** ${oldMessage.id}\n**Sent By:** <@${oldMessage.author.id}> (ID: ${oldMessage.author.id})\n\n**Old Message:**\`\`\`${oldMessage}\`\`\`\n**New Message:**\`\`\`${newMessage}\`\`\``
          )
          .setTimestamp()
          .setFooter(oldMessage.guild.name, oldMessage.guild.iconURL);
      
        logChannel.send(messageUpdate);
      });
      
      niro.on("roleCreate", role => {
        if (!role.guild.member(niro.user).hasPermission("EMBED_LINKS")) return;
        if (!role.guild.member(niro.user).hasPermission("VIEW_AUDIT_LOG")) return;
        if (!log[role.guild.id])
          log[role.guild.id] = {
            onoff: "Off"
          };
        if (log[role.guild.id].onoff === "Off") return;
        var logChannel = role.guild.channels.find(
          c => c.name === `${log[role.guild.id].channel}`
        );
        if (!logChannel) return;
      
        role.guild.fetchAuditLogs().then(logs => {
          var userID = logs.entries.first().executor.id;
          var userAvatar = logs.entries.first().executor.avatarURL;
      
          let roleCreate = new Discord.RichEmbed()
            .setTitle("**[ROLE CREATE]**")
            .setThumbnail(userAvatar)
            .setDescription(
              `**\n**:white_check_mark: Successfully \`\`CREATE\`\` Role.\n\n**Role Name:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
            )
            .setColor("GREEN")
            .setTimestamp()
            .setFooter(role.guild.name, role.guild.iconURL);
      
          logChannel.send(roleCreate);
        });
      });
      niro.on("roleDelete", role => {
        if (!role.guild.member(niro.user).hasPermission("EMBED_LINKS")) return;
        if (!role.guild.member(niro.user).hasPermission("VIEW_AUDIT_LOG")) return;
        if (!log[role.guild.id])
          log[role.guild.id] = {
            onoff: "Off"
          };
        if (log[role.guild.id].onoff === "Off") return;
        var logChannel = role.guild.channels.find(
          c => c.name === `${log[role.guild.id].channel}`
        );
        if (!logChannel) return;
      
        role.guild.fetchAuditLogs().then(logs => {
          var userID = logs.entries.first().executor.id;
          var userAvatar = logs.entries.first().executor.avatarURL;
      
          let roleDelete = new Discord.RichEmbed()
            .setTitle("**[ROLE DELETE]**")
            .setThumbnail(userAvatar)
            .setDescription(
              `**\n**:white_check_mark: Successfully \`\`DELETE\`\` Role.\n\n**Role Name:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
            )
            .setColor("RED")
            .setTimestamp()
            .setFooter(role.guild.name, role.guild.iconURL);
      
          logChannel.send(roleDelete);
        });
      });
      niro.on("roleUpdate", (oldRole, newRole) => {
        if (!oldRole.guild.member(niro.user).hasPermission("EMBED_LINKS")) return;
        if (!oldRole.guild.member(niro.user).hasPermission("VIEW_AUDIT_LOG"))
          return;
        if (!log[oldRole.guild.id])
          log[oldRole.guild.id] = {
            onoff: "Off"
          };
        if (log[oldRole.guild.id].onoff === "Off") return;
        var logChannel = oldRole.guild.channels.find(
          c => c.name === `${log[oldRole.guild.id].channel}`
        );
        if (!logChannel) return;
      
        oldRole.guild.fetchAuditLogs().then(logs => {
          var userID = logs.entries.first().executor.id;
          var userAvatar = logs.entries.first().executor.avatarURL;
      
          if (oldRole.name !== newRole.name) {
            if (log[oldRole.guild.id].onoff === "Off") return;
            let roleUpdateName = new Discord.RichEmbed()
              .setTitle("**[ROLE NAME UPDATE]**")
              .setThumbnail(userAvatar)
              .setColor("BLUE")
              .setDescription(
                `**\n**:white_check_mark: Successfully \`\`EDITED\`\` Role Name.\n\n**Old Name:** \`\`${oldRole.name}\`\`\n**New Name:** \`\`${newRole.name}\`\`\n**Role ID:** ${oldRole.id}\n**By:** <@${userID}> (ID: ${userID})`
              )
              .setTimestamp()
              .setFooter(oldRole.guild.name, oldRole.guild.iconURL);
      
            logChannel.send(roleUpdateName);
          }
          if (oldRole.hexColor !== newRole.hexColor) {
            if (oldRole.hexColor === "#000000") {
              var oldColor = "`Default`";
            } else {
              var oldColor = oldRole.hexColor;
            }
            if (newRole.hexColor === "#000000") {
              var newColor = "`Default`";
            } else {
              var newColor = newRole.hexColor;
            }
            if (log[oldRole.guild.id].onoff === "Off") return;
            let roleUpdateColor = new Discord.RichEmbed()
              .setTitle("**[ROLE COLOR UPDATE]**")
              .setThumbnail(userAvatar)
              .setColor("BLUE")
              .setDescription(
                `**\n**:white_check_mark: Successfully \`\`EDITED\`\` **${oldRole.name}** Role Color.\n\n**Old Color:** ${oldColor}\n**New Color:** ${newColor}\n**Role ID:** ${oldRole.id}\n**By:** <@${userID}> (ID: ${userID})`
              )
              .setTimestamp()
              .setFooter(oldRole.guild.name, oldRole.guild.iconURL);
      
            logChannel.send(roleUpdateColor);
          }
        });
      });
      
      niro.on("channelCreate", channel => {
        if (!channel.guild) return;
        if (!channel.guild.member(niro.user).hasPermission("EMBED_LINKS")) return;
        if (!channel.guild.member(niro.user).hasPermission("VIEW_AUDIT_LOG"))
          return;
        if (!log[channel.guild.id])
          log[channel.guild.id] = {
            onoff: "Off"
          };
        if (log[channel.guild.id].onoff === "Off") return;
        var logChannel = channel.guild.channels.find(
          c => c.name === `${log[channel.guild.id].channel}`
        );
        if (!logChannel) return;
      
        if (channel.type === "text") {
          var roomType = "Text";
        } else if (channel.type === "voice") {
          var roomType = "Voice";
        } else if (channel.type === "category") {
          var roomType = "Category";
        }
      
        channel.guild.fetchAuditLogs().then(logs => {
          var userID = logs.entries.first().executor.id;
          var userAvatar = logs.entries.first().executor.avatarURL;
      
          let channelCreate = new Discord.RichEmbed()
            .setTitle("**[CHANNEL CREATE]**")
            .setThumbnail(userAvatar)
            .setDescription(
              `**\n**:white_check_mark: Successfully \`\`CREATE\`\` **${roomType}** channel.\n\n**Channel Name:** \`\`${channel.name}\`\` (ID: ${channel.id})\n**By:** <@${userID}> (ID: ${userID})`
            )
            .setColor("GREEN")
            .setTimestamp()
            .setFooter(channel.guild.name, channel.guild.iconURL);
      
          logChannel.send(channelCreate);
        });
      });
      niro.on("channelDelete", channel => {
        if (!channel.guild) return;
        if (!channel.guild.member(niro.user).hasPermission("EMBED_LINKS")) return;
        if (!channel.guild.member(niro.user).hasPermission("VIEW_AUDIT_LOG"))
          return;
        if (!log[channel.guild.id])
          log[channel.guild.id] = {
            onoff: "Off"
          };
        if (log[channel.guild.id].onoff === "Off") return;
        var logChannel = channel.guild.channels.find(
          c => c.name === `${log[channel.guild.id].channel}`
        );
        if (!logChannel) return;
      
        if (channel.type === "text") {
          var roomType = "Text";
        } else if (channel.type === "voice") {
          var roomType = "Voice";
        } else if (channel.type === "category") {
          var roomType = "Category";
        }
      
        channel.guild.fetchAuditLogs().then(logs => {
          var userID = logs.entries.first().executor.id;
          var userAvatar = logs.entries.first().executor.avatarURL;
      
          let channelDelete = new Discord.RichEmbed()
            .setTitle("**[CHANNEL DELETE]**")
            .setThumbnail(userAvatar)
            .setDescription(
              `**\n**:white_check_mark: Successfully \`\`DELETE\`\` **${roomType}** channel.\n\n**Channel Name:** \`\`${channel.name}\`\` (ID: ${channel.id})\n**By:** <@${userID}> (ID: ${userID})`
            )
            .setColor("RED")
            .setTimestamp()
            .setFooter(channel.guild.name, channel.guild.iconURL);
      
          logChannel.send(channelDelete);
        });
      });
      niro.on("channelUpdate", (oldChannel, newChannel) => {
        if (!oldChannel.guild) return;
        if (!log[oldChannel.guild.id])
          log[oldChannel.guild.id] = {
            onoff: "Off"
          };
        if (log[oldChannel.guild.id].onoff === "Off") return;
        var logChannel = oldChannel.guild.channels.find(
          c => c.name === `${log[oldChannel.guild.id].channel}`
        );
        if (!logChannel) return;
      
        if (oldChannel.type === "text") {
          var channelType = "Text";
        } else if (oldChannel.type === "voice") {
          var channelType = "Voice";
        } else if (oldChannel.type === "category") {
          var channelType = "Category";
        }
      
        oldChannel.guild.fetchAuditLogs().then(logs => {
          var userID = logs.entries.first().executor.id;
          var userAvatar = logs.entries.first().executor.avatarURL;
      
          if (oldChannel.name !== newChannel.name) {
            let newName = new Discord.RichEmbed()
              .setTitle("**[CHANNEL EDIT]**")
              .setThumbnail(userAvatar)
              .setColor("BLUE")
              .setDescription(
                `**\n**:wrench: Successfully Edited **${channelType}** Channel Name\n\n**Old Name:** \`\`${oldChannel.name}\`\`\n**New Name:** \`\`${newChannel.name}\`\`\n**Channel ID:** ${oldChannel.id}\n**By:** <@${userID}> (ID: ${userID})`
              )
              .setTimestamp()
              .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL);
      
            logChannel.send(newName);
          }
          if (oldChannel.topic !== newChannel.topic) {
            if (log[oldChannel.guild.id].onoff === "Off") return;
            let newTopic = new Discord.RichEmbed()
              .setTitle("**[CHANNEL EDIT]**")
              .setThumbnail(userAvatar)
              .setColor("BLUE")
              .setDescription(
                `**\n**:wrench: Successfully Edited **${channelType}** Channel Topic\n\n**Old Topic:**\n\`\`\`${oldChannel.topic ||
                  "NULL"}\`\`\`\n**New Topic:**\n\`\`\`${newChannel.topic ||
                  "NULL"}\`\`\`\n**Channel:** ${oldChannel} (ID: ${
                  oldChannel.id
                })\n**By:** <@${userID}> (ID: ${userID})`
              )
              .setTimestamp()
              .setFooter(oldChannel.guild.name, oldChannel.guild.iconURL);
      
            logChannel.send(newTopic);
          }
        });
      });
      
      niro.on("guildBanAdd", (guild, user) => {
        if (!guild.member(niro.user).hasPermission("EMBED_LINKS")) return;
        if (!guild.member(niro.user).hasPermission("VIEW_AUDIT_LOG")) return;
        if (!log[guild.id])
          log[guild.id] = {
            onoff: "Off"
          };
        if (log[guild.id].onoff === "Off") return;
        var logChannel = guild.channels.find(
          c => c.name === `${log[guild.id].channel}`
        );
        if (!logChannel) return;
      
        guild.fetchAuditLogs().then(logs => {
          var userID = logs.entries.first().executor.id;
          var userAvatar = logs.entries.first().executor.avatarURL;
      
          if (userID === niro.user.id) return;
      
          let banInfo = new Discord.RichEmbed()
            .setTitle("**[BANNED]**")
            .setThumbnail(userAvatar)
            .setColor("DARK_RED")
            .setDescription(
              `**\n**:airplane: Successfully \`\`BANNED\`\` **${user.username}** From the server!\n\n**User:** <@${user.id}> (ID: ${user.id})\n**By:** <@${userID}> (ID: ${userID})`
            )
            .setTimestamp()
            .setFooter(guild.name, guild.iconURL);
      
          logChannel.send(banInfo);
        });
      });
      niro.on("guildBanRemove", (guild, user) => {
        if (!guild.member(niro.user).hasPermission("EMBED_LINKS")) return;
        if (!guild.member(niro.user).hasPermission("VIEW_AUDIT_LOG")) return;
        if (!log[guild.id])
          log[guild.id] = {
            onoff: "Off"
          };
        if (log[guild.id].onoff === "Off") return;
        var logChannel = guild.channels.find(
          c => c.name === `${log[guild.id].channel}`
        );
        if (!logChannel) return;
      
        guild.fetchAuditLogs().then(logs => {
          var userID = logs.entries.first().executor.id;
          var userAvatar = logs.entries.first().executor.avatarURL;
      
          if (userID === niro.user.id) return;
      
          let unBanInfo = new Discord.RichEmbed()
            .setTitle("**[UNBANNED]**")
            .setThumbnail(userAvatar)
            .setColor("GREEN")
            .setDescription(
              `**\n**:unlock: Successfully \`\`UNBANNED\`\` **${user.username}** From the server\n\n**User:** <@${user.id}> (ID: ${user.id})\n**By:** <@${userID}> (ID: ${userID})`
            )
            .setTimestamp()
            .setFooter(guild.name, guild.iconURL);
      
          logChannel.send(unBanInfo);
        });
      });
      
      niro.on("guildMemberUpdate", (oldMember, newMember) => {
        if (!oldMember.guild) return;
        if (!log[oldMember.guild.id])
          log[oldMember.guild.id] = {
            onoff: "Off"
          };
        if (log[oldMember.guild.id].onoff === "Off") return;
        var logChannel = oldMember.guild.channels.find(
          c => c.name === `${log[(oldMember, newMember.guild.id)].channel}`
        );
        if (!logChannel) return;
      
        oldMember.guild.fetchAuditLogs().then(logs => {
          var userID = logs.entries.first().executor.id;
          var userAvatar = logs.entries.first().executor.avatarURL;
          var userTag = logs.entries.first().executor.tag;
      
          if (oldMember.nickname !== newMember.nickname) {
            if (oldMember.nickname === null) {
              var oldNM = "`اسمه الاصلي`";
            } else {
              var oldNM = oldMember.nickname;
            }
            if (newMember.nickname === null) {
              var newNM = "`اسمه الاصلي`";
            } else {
              var newNM = newMember.nickname;
            }
      
            let updateNickname = new Discord.RichEmbed()
              .setTitle("**[UPDATE MEMBER NICKNAME]**")
              .setThumbnail(userAvatar)
              .setColor("BLUE")
              .setDescription(
                `**\n**:spy: Successfully \`\`CHANGE\`\` Member Nickname.\n\n**User:** ${oldMember} (ID: ${oldMember.id})\n**Old Nickname:** ${oldNM}\n**New Nickname:** ${newNM}\n**By:** <@${userID}> (ID: ${userID})`
              )
              .setTimestamp()
              .setFooter(oldMember.guild.name, oldMember.guild.iconURL);
      
            logChannel.send(updateNickname);
          }
          if (oldMember.roles.size < newMember.roles.size) {
            let role = newMember.roles
              .filter(r => !oldMember.roles.has(r.id))
              .first();
            if (!log[oldMember.guild.id])
              log[oldMember.guild.id] = {
                onoff: "Off"
              };
            if (log[oldMember.guild.id].onoff === "Off") return;
            let roleAdded = new Discord.RichEmbed()
              .setTitle("**[ADDED ROLE TO MEMBER]**")
              .setThumbnail(oldMember.guild.iconURL)
              .setColor("GREEN")
              .setDescription(
                `**\n**:white_check_mark: Successfully \`\`ADDED\`\` Role to **${oldMember.user.username}**\n\n**User:** <@${oldMember.id}> (ID: ${oldMember.user.id})\n**Role:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
              )
              .setTimestamp()
              .setFooter(userTag, userAvatar);
      
            logChannel.send(roleAdded);
          }
          if (oldMember.roles.size > newMember.roles.size) {
            let role = oldMember.roles
              .filter(r => !newMember.roles.has(r.id))
              .first();
            if (!log[oldMember.guild.id])
              log[oldMember.guild.id] = {
                onoff: "Off"
              };
            if (log[(oldMember, newMember.guild.id)].onoff === "Off") return;
            let roleRemoved = new Discord.RichEmbed()
              .setTitle("**[REMOVED ROLE FROM MEMBER]**")
              .setThumbnail(oldMember.guild.iconURL)
              .setColor("RED")
              .setDescription(
                `**\n**:negative_squared_cross_mark: Successfully \`\`REMOVED\`\` Role from **${oldMember.user.username}**\n\n**User:** <@${oldMember.user.id}> (ID: ${oldMember.id})\n**Role:** \`\`${role.name}\`\` (ID: ${role.id})\n**By:** <@${userID}> (ID: ${userID})`
              )
              .setTimestamp()
              .setFooter(userTag, userAvatar);
      
            logChannel.send(roleRemoved);
          }
        });
        if (oldMember.guild.owner.id !== newMember.guild.owner.id) {
          if (!log[oldMember.guild.id])
            log[oldMember.guild.id] = {
              onoff: "Off"
            };
          if (log[(oldMember, newMember.guild.id)].onoff === "Off") return;
          let newOwner = new Discord.RichEmbed()
            .setTitle("**[UPDATE GUILD OWNER]**")
            .setThumbnail(oldMember.guild.iconURL)
            .setColor("GREEN")
            .setDescription(
              `**\n**:white_check_mark: Successfully \`\`TRANSFER\`\` The Owner Ship.\n\n**Old Owner:** <@${oldMember.user.id}> (ID: ${oldMember.user.id})\n**New Owner:** <@${newMember.user.id}> (ID: ${newMember.user.id})`
            )
            .setTimestamp()
            .setFooter(oldMember.guild.name, oldMember.guild.iconURL);
      
          logChannel.send(newOwner);
        }
      });
      
      niro.on("voiceStateUpdate", (voiceOld, voiceNew) => {
        if (!voiceOld.guild.member(niro.user).hasPermission("EMBED_LINKS")) return;
        if (!voiceOld.guild.member(niro.user).hasPermission("VIEW_AUDIT_LOG"))
          return;
        if (!log[voiceOld.guild.id])
          log[voiceOld.guild.id] = {
            onoff: "Off"
          };
        if (log[(voiceOld, voiceOld.guild.id)].onoff === "Off") return;
        var logChannel = voiceOld.guild.channels.find(
          c => c.name === `${log[(voiceOld, voiceNew.guild.id)].channel}`
        );
        if (!logChannel) return;
      
        voiceOld.guild.fetchAuditLogs().then(logs => {
          var userID = logs.entries.first().executor.id;
          var userTag = logs.entries.first().executor.tag;
          var userAvatar = logs.entries.first().executor.avatarURL;
      
          if (voiceOld.serverMute === false && voiceNew.serverMute === true) {
            let serverMutev = new Discord.RichEmbed()
              .setTitle("**[VOICE MUTE]**")
              .setThumbnail(
                "https://images-ext-1.discordapp.net/external/pWQaw076OHwVIFZyeFoLXvweo0T_fDz6U5C9RBlw_fQ/https/cdn.pg.sa/UosmjqDNgS.png"
              )
              .setColor("RED")
              .setDescription(
                `**User:** ${voiceOld} (ID: ${voiceOld.id})\n**By:** <@${userID}> (ID: ${userID})\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannel.id})`
              )
              .setTimestamp()
              .setFooter(userTag, userAvatar);
      
            logChannel.send(serverMutev);
          }
          if (voiceOld.serverMute === true && voiceNew.serverMute === false) {
            if (!log[voiceOld.guild.id])
              log[voiceOld.guild.id] = {
                onoff: "Off"
              };
            if (log[(voiceOld, voiceOld.guild.id)].onoff === "Off") return;
            let serverUnmutev = new Discord.RichEmbed()
              .setTitle("**[VOICE UNMUTE]**")
              .setThumbnail(
                "https://images-ext-1.discordapp.net/external/u2JNOTOc1IVJGEb1uCKRdQHXIj5-r8aHa3tSap6SjqM/https/cdn.pg.sa/Iy4t8H4T7n.png"
              )
              .setColor("GREEN")
              .setDescription(
                `**User:** ${voiceOld} (ID: ${voiceOld.id})\n**By:** <@${userID}> (ID: ${userID})\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannel.id})`
              )
              .setTimestamp()
              .setFooter(userTag, userAvatar);
      
            logChannel.send(serverUnmutev);
          }
          if (voiceOld.serverDeaf === false && voiceNew.serverDeaf === true) {
            if (!log[voiceOld.guild.id])
              log[voiceOld.guild.id] = {
                onoff: "Off"
              };
            if (log[(voiceOld, voiceOld.guild.id)].onoff === "Off") return;
            let serverDeafv = new Discord.RichEmbed()
              .setTitle("**[VOICE DEAF]**")
              .setThumbnail(
                "https://images-ext-1.discordapp.net/external/7ENt2ldbD-3L3wRoDBhKHb9FfImkjFxYR6DbLYRjhjA/https/cdn.pg.sa/auWd5b95AV.png"
              )
              .setColor("RED")
              .setDescription(
                `**User:** ${voiceOld} (ID: ${voiceOld.id})\n**By:** <@${userID}> (ID: ${userID})\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannel.id})`
              )
              .setTimestamp()
              .setFooter(userTag, userAvatar);
      
            logChannel.send(serverDeafv);
          }
          if (voiceOld.serverDeaf === true && voiceNew.serverDeaf === false) {
            if (!log[voiceOld.guild.id])
              log[voiceOld.guild.id] = {
                onoff: "Off"
              };
            if (log[(voiceOld, voiceOld.guild.id)].onoff === "Off") return;
            let serverUndeafv = new Discord.RichEmbed()
              .setTitle("**[VOICE UNDEAF]**")
              .setThumbnail(
                "https://images-ext-2.discordapp.net/external/s_abcfAlNdxl3uYVXnA2evSKBTpU6Ou3oimkejx3fiQ/https/cdn.pg.sa/i7fC8qnbRF.png"
              )
              .setColor("GREEN")
              .setDescription(
                `**User:** ${voiceOld} (ID: ${voiceOld.id})\n**By:** <@${userID}> (ID: ${userID})\n**Channel:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannel.id})`
              )
              .setTimestamp()
              .setFooter(userTag, userAvatar);
      
            logChannel.send(serverUndeafv);
          }
        });
      
        if (
          voiceOld.voiceChannelID !== voiceNew.voiceChannelID &&
          voiceNew.voiceChannel &&
          voiceOld.voiceChannel != null
        ) {
          if (!log[voiceOld.guild.id])
            log[voiceOld.guild.id] = {
              onoff: "Off"
            };
          if (log[(voiceOld, voiceOld.guild.id)].onoff === "Off") return;
          let voiceLeave = new Discord.RichEmbed()
            .setTitle("**[CHANGED VOICE ROOM]**")
            .setColor("GREEN")
            .setThumbnail(voiceOld.user.avatarURL)
            .setDescription(
              `**\n**:repeat: Successfully \`\`CHANGED\`\` The Voice Channel.\n\n**From:** \`\`${voiceOld.voiceChannel.name}\`\` (ID: ${voiceOld.voiceChannelID})\n**To:** \`\`${voiceNew.voiceChannel.name}\`\` (ID: ${voiceNew.voiceChannelID})\n**User:** ${voiceOld} (ID: ${voiceOld.id})`
            )
            .setTimestamp()
            .setFooter(voiceOld.user.tag, voiceOld.user.avatarURL);
      
          logChannel.send(voiceLeave);
        }
      });