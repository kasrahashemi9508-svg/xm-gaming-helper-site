const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json({ limit: "30kb" }));
app.use(express.static(__dirname));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "XM Gaming Helper API" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: "هنوز کلید API در تنظیمات امن Render اضافه نشده است."
      });
    }

    const message = typeof req.body.message === "string" ? req.body.message.trim() : "";
    if (!message || message.length > 4000) {
      return res.status(400).json({ error: "متن پیام خالی است یا بیش از حد طولانی است." });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: "تو XM Gaming Helper هستی؛ یک دستیار فارسی برای عیب‌یابی امن و مرحله‌به‌مرحله بازی‌ها، ویندوز، کامپیوتر، اینترنت، صدا، Minecraft و Roblox. ساده و دقیق پاسخ بده. هر بار فقط چند قدم مشخص پیشنهاد بده، از راهکارهای مخرب یا دور زدن امنیت پرهیز کن، و اگر اطلاعات کافی نیست یک سؤال روشن بپرس. ادعا نکن به دستگاه کاربر دسترسی داری.",
        input: message,
        max_output_tokens: 700
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", response.status, JSON.stringify(data).slice(0, 1200));
      return res.status(502).json({ error: "پاسخ‌گویی هوش مصنوعی انجام نشد. تنظیمات API و گزارش‌های Render را بررسی کن." });
    }

    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("\n")
      .trim();

    if (!answer) return res.status(502).json({ error: "پاسخ خالی از سرویس دریافت شد؛ دوباره امتحان کن." });
    res.json({ answer });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "خطای سرور رخ داد. بعداً دوباره امتحان کن." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`XM Gaming Helper running on port ${PORT}`);
});
