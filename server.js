const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "public", "data.json");

app.use(express.static("public"));

app.get("/", (req, res) => {
  fs.readFile(DATA_PATH, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send(data);
    }
  });
});

app.get("/save-as-pdf", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("Ошибочные URL параметры");
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Открываем страницу
    await page.goto(url, { waitUntil: "networkidle0" });

    // Генерируем PDF из содержимого страницы
    const pdfBuffer = await page.pdf({ format: "A4" });

    // Отправляем PDF файл клиенту
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="page.pdf"');
    res.send(pdfBuffer);

    // Закрываем браузер
    await browser.close();
  } catch (error) {
    console.error("Error saving page as PDF:", error);
    res.status(500).send("Error saving page as PDF");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
