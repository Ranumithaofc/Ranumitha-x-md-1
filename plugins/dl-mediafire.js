const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "mediafire",
  alias: ["mfire", "mfdownload"],
  react: '📥',
  desc: "Download files from MediaFire.",
  category: "download",
  use: ".mediafire <MediaFire URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided a MediaFire URL
    const mediafireUrl = args[0];
    if (!mediafireUrl || !mediafireUrl.includes("mediafire.com")) {
      return reply('Please provide a valid MediaFire URL. Example: `.mediafire https://mediafire.com/...`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the Velyn API URL
    const apiUrl = `https://velyn.vercel.app/api/downloader/mediafire?url=${encodeURIComponent(mediafireUrl)}`;

    // Call the Velyn API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.data) {
      return reply('❌ Unable to fetch the file. Please check the URL and try again.');
    }

    // Extract the file details
    const { filename, size, mimetype, link } = response.data.data;

    // Inform the user that the file is being downloaded
    await reply(`📥 *Downloading ${filename} (${size})... Please wait.*`);

    // Download the file
    const fileResponse = await axios.get(link, { responseType: 'arraybuffer' });
    if (!fileResponse.data) {
      return reply('❌ Failed to download the file. Please try again later.');
    }

    // Prepare the file buffer
    const fileBuffer = Buffer.from(fileResponse.data, 'binary');

    // Send the file based on its MIME type
    if (mimetype.startsWith('image')) {
      // Send as image
      await conn.sendMessage(from, {
        image: fileBuffer,
        caption: `📥 *File Details*\n\n` +
          `🔖 *Name*: ${filename}\n` +
          `📏 *Size*: ${size}\n\n` +
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
    } else if (mimetype.startsWith('video')) {
      // Send as video
      await conn.sendMessage(from, {
        video: fileBuffer,
        caption: `📥 *File Details*\n\n` +
          `🔖 *Name*: ${filename}\n` +
          `📏 *Size*: ${size}\n\n` +
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
    } else {
      // Send as document
      await conn.sendMessage(from, {
        document: fileBuffer,
        mimetype: mimetype,
        fileName: filename,
        caption: `📥 *File Details*\n\n` +
          `🔖 *Name*: ${filename}\n` +
          `📏 *Size*: ${size}\n\n` +
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

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading file:', error);
    reply('❌ Unable to download the file. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});


cmd({
  pattern: "mediafire1",
  alias: ["mfire1", "media1"],
  react: '📂',
  desc: "Download files from MediaFire using Keith's API.",
  category: "download",
  use: ".mediafire1 <MediaFire URL>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
  try {
    // Check if the user provided a URL
    if (!q) {
      return reply('Please provide a MediaFire URL. Example: `.mediafire2 https://www.mediafire.com/...`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = `https://apis-keith.vercel.app/download/mfire?url=${encodeURIComponent(q)}`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result || !response.data.result.dl_link) {
      return reply('❌ Unable to fetch the file. Please try again later.');
    }

    // Extract file details
    const { fileName, fileType, size, date, dl_link } = response.data.result;

    // Inform the user that the file is being downloaded
    await reply(`📂 *Downloading ${fileName}...*`);

    // Download the file
    const fileResponse = await axios.get(dl_link, { responseType: 'arraybuffer' });
    if (!fileResponse.data) {
      return reply('❌ Failed to download the file. Please try again later.');
    }

    // Send the file with emojis in the message content
    await conn.sendMessage(from, {
      document: fileResponse.data,
      mimetype: fileType,
      fileName: fileName,
      caption: `📂 *File Name:* ${fileName}\n📦 *File Size:* ${size}\n📅 *Upload Date:* ${date}\n `,
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
    console.error('Error downloading file:', error);
    reply('❌ Unable to download the file. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});


cmd({
  pattern: "mediafire2",
  alias: ["mfire2"],
  desc: "To download MediaFire files.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid MediaFire link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.dl_link) {
      return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.");
    }

    const { dl_link, fileName, fileType } = data.result;
    const file_name = fileName || "mediafire_download";
    const mime_type = fileType || "application/octet-stream";

    await conn.sendMessage(from, {
      react: { text: "⬆️", key: m.key }
    });

    const caption = `╭━━━〔 *MEDIAFIRE DOWNLOADER* 〕━━━⊷\n`
      + `┃▸ *File Name:* ${file_name}\n`
      + `┃▸ *File Type:* ${mime_type}\n`
      + `╰━━━⪼\n\n`
      + `📥 *Downloading your file...*`;

    await conn.sendMessage(from, {
      document: { url: dl_link },
      mimetype: mime_type,
      fileName: file_name,
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});
