const prompt = document.querySelector('#prompt');
const chatContainer = document.querySelector('.chat-container');
const imageBtn = document.querySelector('#image');
const imageInput = document.querySelector('#image input');
const submitBtn = document.querySelector('#submit');
const imagePreview = document.querySelector('#imagePreview');
const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyARoWaM7RKmnYdXUcg20QjE1YsZh7iXkrI";

const user = {
    data: null,
    image: null
};

async function generateResponse(aiChatBox) {
    const textArea = aiChatBox.querySelector('.ai-chat-area');
    textArea.textContent = 'Loading';
    textArea.classList.add('loading');

    try {
        const parts = [];
        if (user.data) {
            parts.push({ text: user.data });
        } else if (user.image) {
            parts.push({ text: 'Describe this image.' });
        }
        if (user.image) {
            const mimeType = user.image.match(/data:(image\/[a-zA-Z]+);base64,/)[1];
            const base64Data = user.image.split(',')[1];
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                }
            });
        }

        if (parts.length === 0) {
            throw new Error('No text or image provided');
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts }]
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const path = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process your request.';
        textArea.textContent = path;
    } catch (error) {
        console.error('Error:', error);
        textArea.textContent = 'An error occurred. Please try again.';
    } finally {
        textArea.classList.remove('loading');
        user.image = null; // Clear image after sending
        imagePreview.innerHTML = ''; // Clear preview
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
    }
}

function createChatBox(html, classes) {
    const div = document.createElement('div');
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function chatResponse(message) {
    user.data = message.trim() || null;
    if (!user.data && !user.image) return; // Prevent sending empty messages

    let html = `
        <img src="images.jpg" alt="User avatar" class="chat-image" id="userImage">
        <div class="user-chat-area">
            ${user.data || ''}
            ${user.image ? `<img src="${user.image}" alt="Uploaded image" class="uploaded-image">` : ''}
        </div>
    `;
    prompt.value = '';
    const userChatBox = createChatBox(html, 'user-chat-box');
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });

    setTimeout(() => {
        const html = `
            <img src="aiii.jpg" alt="AI avatar" class="chat-image" id="aiImage">
            <div class="ai-chat-area"></div>
        `;
        const aiChatBox = createChatBox(html, 'ai-chat-box');
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    }, 500);
}

prompt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatResponse(prompt.value);
    }
});

submitBtn.addEventListener('click', () => {
    chatResponse(prompt.value);
});

imageInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        user.image = e.target.result;
        imagePreview.innerHTML = `<img src="${user.image}" alt="Image preview">`;
        console.log('Image loaded:', user.image);
    };
    reader.onerror = () => {
        console.error('Error reading file');
        imagePreview.innerHTML = '';
    };
    reader.readAsDataURL(file);
});

imageBtn.addEventListener('click', () => imageInput.click());
