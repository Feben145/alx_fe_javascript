// Initialize quotes array (try to load from localStorage if available)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Inspiration" },
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Philosophy" }
];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load the last viewed quote from sessionStorage
function loadLastViewedQuote() {
  const lastViewedQuoteIndex = sessionStorage.getItem('lastViewedQuoteIndex');
  if (lastViewedQuoteIndex !== null) {
    const quote = quotes[lastViewedQuoteIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><strong>- ${quote.category}</strong></p>`;
  }
}

// Function to show a random quote and save the last viewed index in sessionStorage
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><strong>- ${quote.category}</strong></p>`;

  // Store the last viewed quote index in sessionStorage
  sessionStorage.setItem('lastViewedQuoteIndex', randomIndex);
}

// Load the last viewed quote and show a random quote on page load
loadLastViewedQuote();
showRandomQuote();

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes(); // Save to localStorage

    // Clear the input fields after adding the quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    populateCategories(); // Update category filter after adding a new quote
    alert('Quote added!');
  } else {
    alert('Please enter both a quote and category!');
  }
}

// Function to dynamically create the category filter dropdown based on unique categories
function populateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories
  const categorySelect = document.getElementById('categoryFilter');

  // Clear existing options
  categorySelect.innerHTML = '<option value="">All Categories</option>';

  // Add category options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Function to filter quotes by selected category
function categoryFilter(event) {
  const selectedCategory = event.target.value;
  const filteredQuotes = selectedCategory ? quotes.filter(q => q.category === selectedCategory) : quotes;
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `<p>"${quote.text}"</p><p><strong>- ${quote.category}</strong></p>`).join('');
}

// Function to export quotes to a JSON file
function exportQuotesToJson() {
  const jsonBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const a = document.createElement('a');
  a.href = jsonUrl;
  a.download = 'quotes.json'; // Name of the exported file
  a.click();
  URL.revokeObjectURL(jsonUrl);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes(); // Save to localStorage
    populateCategories(); // Update category filter after importing quotes
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener to trigger category filter
document.getElementById('categoryFilter').addEventListener('change', categoryFilter);

// Populate categories when the page loads
populateCategories();