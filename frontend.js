const quoteText = document.getElementById("quote");
const authorName = document.getElementById("author");
const generateQuote = document.getElementById("generate-quote");

const newQuote = document.getElementById("quote-input");
const newAuthor = document.getElementById("author-input");
const submitQuote = document.getElementById("add-quote");
const serverURL = "https://pooriya-quote-generator-server.hosting.codeyourfuture.io/";

async function getData() {
  fetch(serverURL)
    .then((response) => {
      if (!response.ok) throw new Error("Response not OK");
      return response.text();
    })
    .then((text) => {
      const dashIndex = text.lastIndexOf("-");
      const quote = text.slice(0, dashIndex).replaceAll('"', '').trim();
      const author = text.slice(dashIndex + 1).trim();
      const quoteElem = document.getElementById("quote");
      const authorElem = document.getElementById("author");
      // fade-in effect
      quoteElem.classList.remove("fade-in");
      authorElem.classList.remove("fade-in");
      quoteElem.innerText = quote;
      authorElem.innerText = `Author: ${author}`;
      setTimeout(() => {
        quoteElem.classList.add("fade-in");
        authorElem.classList.add("fade-in");
      }, 10);
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
    const response = await fetch(serverURL, {
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
