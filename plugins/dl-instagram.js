const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "igimagedl",
  alias: ["instagramimages", "igimages","igimage"],
  react: '📥',
  desc: "Download Instagram posts (images or videos).",
  category: "download",
  use: ".igdl <Instagram post URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided an Instagram URL
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('Please provide a valid Instagram post URL. Example: `.igdl https://instagram.com/...`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = `https://api.fgmods.xyz/api/downloader/igdl?url=${encodeURIComponent(igUrl)}&apikey=E8sfLg9l`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result) {
      return reply('❌ Unable to fetch the post. Please check the URL and try again.');
    }

    // Extract the post details
    const { url, caption, username, like, comment, isVideo } = response.data.result;

    // Inform the user that the post is being downloaded
    await reply(`📥 *Downloading Instagram post by @${username}... Please wait.*`);

    // Download and send each media item
    for (const mediaUrl of url) {
      const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
      if (!mediaResponse.data) {
        return reply('❌ Failed to download the media. Please try again later.');
      }

      const mediaBuffer = Buffer.from(mediaResponse.data, 'binary');

      if (isVideo) {
        // Send as video
        await conn.sendMessage(from, {
          video: mediaBuffer,
          caption: `📥 *Instagram Post*\n\n` +
            `👤 *Username*: @${username}\n` +
            `❤️ *Likes*: ${like}\n` +
            `💬 *Comments*: ${comment}\n` +
            `📝 *Caption*: ${caption || "No caption"}\n\n` +
            `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙳𝙰𝚁𝙺-𝙺𝙽𝙸𝙶𝙷𝚃-𝚇𝙼𝙳`,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363401868132010@newsletter',
              newsletterName: '『 𝚁𝙰𝙽𝚄𝙼𝙸𝚃𝙷𝙰-𝚇-𝙼𝙳 』',
              serverMessageId: 143
            }
          }
        }, { quoted: mek });
      } else {
        // Send as image
        await conn.sendMessage(from, {
          image: mediaBuffer,
          caption: `📥 *Instagram Post*\n\n` +
            `👤 *Username*: @${username}\n` +
            `❤️ *Likes*: ${like}\n` +
            `💬 *Comments*: ${comment}\n` +
            `📝 *Caption*: ${caption || "No caption"}\n\n` +
            `> © OWN BY 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗`,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363401868132010@newsletter',
              newsletterName: '『 𝚁𝙰𝙽𝚄𝙼𝙸𝚃𝙷𝙰-𝚇-𝙼𝙳 』',
              serverMessageId: 143
            }
          }
        }, { quoted: mek });
      }
    }

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading Instagram post:', error);
    reply('❌ Unable to download the post. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
// VIDEO SECTION

cmd({
  pattern: "igvid",
  alias: ["igvideo","ig","instagram", "igdl"],
  react: '📥',
  desc: "Download Instagram videos.",
  category: "download",
  use: ".igvid <Instagram video URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided an Instagram video URL
    const igUrl = args[0];
    if (!igUrl || !igUrl.includes("instagram.com")) {
      return reply('Please provide a valid Instagram video URL. Example: `.igvid https://instagram.com/...`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = `https://api.nexoracle.com/downloader/aio2?apikey=free_key@maher_apis&url=${encodeURIComponent(igUrl)}`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || response.data.status !== 200 || !response.data.result) {
      return reply('❌ Unable to fetch the video. Please check the URL and try again.');
    }

    // Extract the video details
    const { title, low, high } = response.data.result;

    // Inform the user that the video is being downloaded
    await reply(`📥 *Downloading ${title || "Instagram video"}... Please wait.*`);

    // Choose the highest quality video URL
    const videoUrl = high || low;

    // Download the video
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      return reply('❌ Failed to download the video. Please try again later.');
    }

    // Prepare the video buffer
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    // Send the video
    await conn.sendMessage(from, {
      video: videoBuffer,
      caption: `📥 *Instagram Video*\n\n` +
        `🔖 *Title*: ${title || "No title"}\n\n` +
        `> © OWN BY 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363401868132010@newsletter',
          newsletterName: '『 𝚁𝙰𝙽𝚄𝙼𝙸𝚃𝙷𝙰-𝚇-𝙼𝙳 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading Instagram video:', error);
    reply('❌ Unable to download the video. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});


cmd({
  pattern: "ig2",
  alias: ["insta2", "Instagram2"],
  desc: "To download Instagram videos.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Please provide a valid Instagram link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${q}`);
    const data = response.data;

    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("⚠️ Failed to fetch Instagram video. Please check the link and try again.");
    }

    await conn.sendMessage(from, {
      video: { url: data.downloadUrl },
      mimetype: "video/mp4",
      caption: "📥 *Instagram Video Downloaded Successfully!*"
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});
