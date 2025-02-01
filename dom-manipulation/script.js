// Initialize quotes array with sample data
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Inspiration" },
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Philosophy" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><strong>- ${quote.category}</strong></p>`;
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    // Ensure both fields are filled before adding the quote
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      alert('New quote added!');
      
      // Clear the input fields after adding the quote
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
    } else {
      alert('Please enter both a quote and category!');
    }
  }
  
  // Function to dynamically create the add quote form
  function createAddQuoteForm() {
    const formDiv = document.createElement('div');
  
    // Create the text input for the quote
    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
  
    // Create the category input
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
  
    // Create the button to submit the new quote
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;
  
    // Append inputs and button to the formDiv
    formDiv.appendChild(quoteInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addButton);
  
    // Append the formDiv to the body
    document.body.appendChild(formDiv);
  }
  
  // Add event listener to show a new random quote when the button is clicked
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Show a random quote when the page loads
  showRandomQuote();
  
  // Create the form to add quotes dynamically
  createAddQuoteForm();
  