import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();
const port = 3000;

app.use(cors());

async function readQuotes() {
  const data = await fs.readFile("./data.json", "utf-8");
  return JSON.parse(data);
}

async function writeQuotes(quotes) {
  await fs.writeFile("./data.json", JSON.stringify(quotes, null, 2));
}

function randomQuote(quotes) {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

app.get("/", async (req, res) => {
  try {
    const quotes = await readQuotes();
    const quote = randomQuote(quotes);
    res.send(`"${quote.quote}" -${quote.author}`);
  } catch (err) {
    console.error("Error reading quotes:", err);
    res.status(500).send("Server error.");
  }
});

app.post("/", async (req, res) => {
  const bodyBytes = [];
  req.on("data", chunk => bodyBytes.push(...chunk));
  req.on("end", async () => {
    const bodyString = String.fromCharCode(...bodyBytes);
    let body;
    try {
      body = JSON.parse(bodyString);
    } catch (error) {
      console.error(`Failed to parse body ${bodyString} as JSON: ${error}`);
      res.status(400).send("Expected body to be JSON.");
      return;
    }
    if (typeof body !== "object" || !("quote" in body) || !("author" in body)) {
      res.status(400).send("Expected body to be a JSON object containing keys quote and author.");
      return;
    }

    try {
      const quotes = await readQuotes();
      quotes.push({ quote: body.quote, author: body.author });
      await writeQuotes(quotes);
      res.send("ok");
    } catch (err) {
      console.error("Error writing quote:", err);
      res.status(500).send("Server error.");
    }
  });
});

app.listen(port, () => {
  console.log(`Quote server listening on port ${port}`);
});
