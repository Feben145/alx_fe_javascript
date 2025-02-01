// Initialize quotes array (try to load from localStorage if available)
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Inspiration" },
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Philosophy" }
  ];
  
  // Simulating the server API URL (using JSONPlaceholder or similar API)
  const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock URL for quotes (this will be simulated)
  
  // Function to save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to simulate fetching quotes from the server
  async function fetchQuotesFromServer() {
    try {
      // Simulate a delay for fetching data from a server
      const response = await fetch(serverUrl);
      const data = await response.json();
      
      // Simulating a conflict scenario (for demo purposes, data from the server is random)
      const serverQuotes = data.map(item => ({
        text: item.title, // Using the title as the quote
        category: item.body.substring(0, 5) // Random category from the body
      }));
  
      return serverQuotes;
    } catch (error) {
      console.error("Error fetching from the server:", error);
      return [];
    }
  }
  
  // Function to sync the local data with the server data
  async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
  
    // Compare server data with local data and resolve conflicts (server data takes precedence)
    let conflictsResolved = false;
  
    // Loop through each server quote and check if it already exists locally
    serverQuotes.forEach((serverQuote, index) => {
      const localQuote = quotes.find(quote => quote.text === serverQuote.text);
      
      if (localQuote) {
        // Conflict detected: resolve by preferring server data
        Object.assign(localQuote, serverQuote);
        conflictsResolved = true;
      } else {
        // No conflict: add the new quote from the server
        quotes.push(serverQuote);
      }
    });
  
    // Save the updated quotes to localStorage
    saveQuotes();
  
    // Notify the user about the sync process and any conflicts resolved
    if (conflictsResolved) {
      alert("Quotes have been synced with the server. Some conflicts were resolved.");
    } else {
      alert("Quotes have been synced with the server. No conflicts were found.");
    }
  
    // Show a notification for successful sync
    alert("Quotes synced with server!");
  }
  
  // Function to handle periodic syncing (every 30 seconds)
  function startAutoSync() {
    setInterval(syncQuotes, 30000); // Sync every 30 seconds
  }
  
  // Function to display quotes based on category (or all quotes)
  function showQuotesByCategory(category = '') {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const filteredQuotes = filterQuote(category); // Use filterQuote to get filtered quotes
    quoteDisplay.innerHTML = filteredQuotes.map(quote => `<p>"${quote.text}"</p><p><strong>- ${quote.category}</strong></p>`).join('');
  }
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><strong>- ${quote.category}</strong></p>`;
  
    // Store the last viewed quote index in sessionStorage
    sessionStorage.setItem('lastViewedQuoteIndex', randomIndex);
  }
  
  // Function to add a new quote
  async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    // Ensure both fields are filled before adding the quote
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
  
      // Add the new quote locally
      quotes.push(newQuote);
      saveQuotes();
  
      // Send the new quote to the server using a POST request
      try {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
          },
          body: JSON.stringify(newQuote), // Convert the new quote to JSON
        });
  
        if (response.ok) {
          alert('New quote added to the server and locally!');
        } else {
          console.error('Error adding quote to server:', response.status);
        }
      } catch (error) {
        console.error('Error connecting to the server:', error);
      }
      
      // Clear the input fields after adding the quote
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      populateCategories(); // Update category filter after adding a new quote
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
  
  // Function to export quotes to a JSON file
  function exportQuotesToJson() {
    const jsonBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = jsonUrl;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(jsonUrl);
  }
  
  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      populateCategories(); // Update category filter after importing quotes
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Function to populate category dropdown based on unique categories
  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories
    const categorySelect = document.getElementById('categoryFilter');
  
    // Clear existing options
    categorySelect.innerHTML = '';
  
    // Create a default "All" option
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Categories';
    categorySelect.appendChild(allOption);
  
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
    showQuotesByCategory(selectedCategory); // Pass selected category to filter quotes
  }
  
  // Add event listener to show a new random quote when the button is clicked
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Show a random quote when the page loads
  showRandomQuote();
  
  // Create the form to add quotes dynamically
  createAddQuoteForm();
  
  // Add Export and Import JSON functionality
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export Quotes to JSON';
  exportButton.onclick = exportQuotesToJson;
  document.body.appendChild(exportButton);
  
  const importFileInput = document.createElement('input');
  importFileInput.type = 'file';
  importFileInput.accept = '.json';
  importFileInput.id = 'importFile';
  importFileInput.onchange = importFromJsonFile;
  document.body.appendChild(importFileInput);
  
  // Create category filter dropdown
  const categoryFilterSelect = document.createElement('select');
  categoryFilterSelect.id = 'categoryFilter';
  categoryFilterSelect.addEventListener('change', categoryFilter);
  document.body.appendChild(categoryFilterSelect);
  
  // Populate category filter and update quotes display
  populateCategories();
  
  // Start auto sync every 30 seconds
  startAutoSync();

  