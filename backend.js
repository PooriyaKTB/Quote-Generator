import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();
const port = 3000;

app.use(cors());

// const quotes = [
//   {
//     quote: "Either write something worth reading or do something worth writing.",
//     author: "Benjamin Franklin",
//   },
//   {
//     quote: "I should have been more kind.",
//     author: "Clive James",
//   },
//   {
//     quote: "Strive not to be a success, but rather to be of value.",
//     author: "Albert Einstein",
//   },
//   {
//     quote: "Hello World. This is Pooriya",
//     author: "Pooriya Ketabi",
//   },
//   {
//     quote:
//       "Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.",
//     author: "Robert Frost",
//   },
//   {
//     quote: "I attribute my success to this: I never gave or took any excuse.",
//     author: "Florence Nightingale",
//   },
//   {
//     quote: "You miss 100% of the shots you don't take.",
//     author: "Wayne Gretzky",
//   },
//   {
//     quote:
//       "I've missed more than 9000 shots in my career. I've lost almost 300 games. 26 times I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.",
//     author: "Michael Jordan",
//   }
// ];

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
