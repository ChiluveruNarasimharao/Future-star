// 1. SETUP - Replace 'YOUR_API_KEY_HERE' with the key you got from AI Studio
const API_KEY = 'AIzaSyADvBw3vXXs9MjAJ2p-jWZRnDE0LoEWy4I';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// 2. SELECT ELEMENTS
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const userInput = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const aiResponse = document.getElementById('aiResponse');

let base64Image = ""; // This will store our "text version" of the image

// 3. HANDLE IMAGE UPLOAD & PREVIEW
imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            // Show the image to the user
            imagePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
            // Prepare the image for Gemini (remove the header part of the base64 string)
            base64Image = event.target.result.split(',')[1];
        };
        reader.readAsDataURL(file);
    }
});

// 4. CALL GEMINI API
submitBtn.addEventListener('click', async () => {
    const text = userInput.value;

    if (!text && !base64Image) {
        alert("Please upload a photo or type a question first!");
        return;
    }

    // Show a loading message
    aiResponse.innerHTML = `<p class="placeholder-text">Analyzing your style... please wait ✨</p>`;

    // Prepare the data to send to Gemini
    const requestData = {
        contents: [{
            parts: [
                { text: `You are a professional fashion stylist. Based on this input, provide 3 specific styling tips or outfit matches: ${text}` },
                ...(base64Image ? [{ inline_data: { mime_type: "image/jpeg", data: base64Image } }] : [])
            ]
        }]
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        
        // Extract the text from Gemini's complex response
        const markdownResponse = data.candidates[0].content.parts[0].text;
        
        // Display it! (We use innerText to keep it simple, or you can use a library to render Markdown)
        aiResponse.innerText = markdownResponse;

    } catch (error) {
        console.error("Error:", error);
        aiResponse.innerHTML = `<p style="color: red;">Oops! Something went wrong. Check your API key or internet connection.</p>`;
    }
});