const quoteText = document.getElementById("quote");
const authorName = document.getElementById("author");
const generateQuote = document.getElementById("generate-quote");

const newQuote = document.getElementById("quote-input");
const newAuthor = document.getElementById("author-input");
const submitQuote = document.getElementById("add-quote");

// function randomQuote() {
//   quoteText.innerText = pickFromArray(quotes).quote;
//   authorName.textContent = `Author: ${pickFromArray(quotes).author}`;
// };

// function pickFromArray(choices) {
//     return choices[Math.floor(Math.random() * choices.length);]
// };

// window.onload = randomQuote;
// generateQuote.addEventListener("click", randomQuote);

async function getData() {
  fetch("http://127.0.0.1:3000/")
  .then((response) => {
    if (!response.ok) throw new Error("Response not OK");
    return response.text();
  })
  .then((text) => {
    const [quote, author] = text.split("-");
    document.getElementById("quote").innerText = quote;
    document.getElementById("author").innerText = `Author: ${author}`;
  })
  .catch((err) => {
    console.error("Fetch error:", err);
    document.getElementById("quote").innerText = "Fetch error";
  });
}

document.getElementById("generate-quote").addEventListener("click", getData);
window.onload = getData;

submitQuote.addEventListener("click", async () => {
  const quote = newQuote.value.trim();
  const author = newAuthor.value.trim();

  if (!quote || !author) {
    alert("Please fill in both quote and author fields.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:3000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ quote, author })
    });

    if (!response.ok) throw new Error("Server error");
    alert("Quote added successfully!");
    newQuote.value = "";
    newAuthor.value = "";
  } catch (error) {
    console.error("Failed to add quote:", error);
    alert("Failed to add quote");
  }
});
