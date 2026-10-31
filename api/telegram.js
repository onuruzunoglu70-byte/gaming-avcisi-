
export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;

  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Yetkisiz erişim" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Telegram ayarları eksik" });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🎮 Gaming Avcısı aktif! Bildirim sistemi hazır."
        })
      }
    );

    const result = await response.json();

    if (!result.ok) {
      return res.status(500).json(result);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Mesaj gönderilemedi" });
  }
}
