const quoteText = document.getElementById("quote");
const authorName = document.getElementById("author");
const generateQuote = document.getElementById("generate-quote");

const newQuote = document.getElementById("quote-input");
const newAuthor = document.getElementById("author-input");
const submitQuote = document.getElementById("add-quote");

function randomQuote() {
  quoteText.innerText = pickFromArray(quotes).quote;
  authorName.textContent = `Author: ${pickFromArray(quotes).author}`;
};

function pickFromArray(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
};

window.onload = randomQuote;
generateQuote.addEventListener("click", randomQuote);

const quotes = [
    {
      quote: "Life isn't about getting and having, it's about giving and being.",
      author: "Kevin Kruse",
    },
    {
      quote: "Whatever the mind of man can conceive and believe, it can achieve.",
      author: "Napoleon Hill",
    },
    {
      quote: "Strive not to be a success, but rather to be of value.",
      author: "Albert Einstein",
    },
    {
      quote:
        "Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.",
      author: "Robert Frost",
    }
];