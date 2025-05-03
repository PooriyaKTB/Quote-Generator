import express from "express";
import cors from "cors";
import {quotes} from "./data.js";

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

function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
}

app.get("/", (req, res) => {
  const quote = randomQuote();
  res.send(`"${quote.quote}" -${quote.author}`);
});

app.post("/", (req, res) => {
  const bodyBytes = [];
  req.on("data", chunk => bodyBytes.push(...chunk));
  req.on("end", () => {
    const bodyString = String.fromCharCode(...bodyBytes);
    let body;
    try {
      body = JSON.parse(bodyString);
    } catch (error) {
      console.error(`Failed to parse body ${bodyString} as JSON: ${error}`);
      res.status(400).send("Expected body to be JSON.");
      return;
    }
    if (typeof body != "object" || !("quote" in body) || !("author" in body)) {
      console.error(`Failed to extract quote and author from post body: ${bodyString}`);
      res.status(400).send("Expected body to be a JSON object containing keys quote and author.");
      return;
    }
    quotes.push({
      quote: body.quote,
      author: body.author,
    });
    res.send("ok");
  });
});

app.listen(port, () => {
  console.error(`Quote server listening on port ${port}`);
});