let prompt = document.querySelector('#prompt');
let chatContainer = document.querySelector('.chat-container');
let imagebtn = document.querySelector('#image');
let imageinput = document.querySelector('#image input');

const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyARoWaM7RKmnYdXUcg20QjE1YsZh7iXkrI"

let user={
    data:null,
    // file:{mime_type:null,
    //       data :null
    }
// }

async function generateResponse(aiChatBox){
    let text = aiChatBox.querySelector('.ai-chat-area');
    let request = {
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
        "contents": [{"parts":[{"text": user.data}]}]
        })
    }

try {
    let response = await fetch(url,request);
    let data = await response.json();
    // console.log(data);
    let path = data.candidates[0].content.parts[0].text;
    // let apiPath = data.candidates[0].content.parts[0].text;
    text.innerHTML = path;
} catch (error) {
    console.log(error);
}
finally{
    chatContainer.scrollTo ({top: chatContainer.scrollHeight, behavior: 'smooth'});

}
}

function createChatBox(html,classes){
    let div = document.createElement('div');
    div.innerHTML = html;
    div.classList.add(classes);
    return div
}



function chatResponse(message){
    user.data = message;
    let html = `<img src="images.jpg" alt="" id="userImage" width="100" height="100">
            <div class="user-chat-area">
            ${user.data}
            </div>`
            prompt.value = "";
    let userChatBox = createChatBox(html,"user-chat-box");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo ({top: chatContainer.scrollHeight, behavior: "smooth"});

    setTimeout(()=>{
        let html = `<img src="aiii.jpg" alt="" width="100" height="100" id="aiImage">
            <div class="ai-chat-area">

            </div>`
            let aiChatBox = createChatBox(html,"ai-chat-box");
            chatContainer.appendChild(aiChatBox);
            generateResponse(aiChatBox);
    },1000)
}

prompt.addEventListener('keydown', function (e) {
    if(e.key === 'Enter'){
        chatResponse(prompt.value);        
    }
})  
imageinput.addEventListener('change', function(){
    const file = this.files[0];
    if(!file) return;
    let reader = new FileReader();
    reader.onload = function(e){
        console.log(e)
    }
    reader.readAsDataURL(file);
})

imagebtn.addEventListener("click", function(){
    imagebtn.querySelector("input").click()
})