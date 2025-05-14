const socket = io();

// Ambil user aktif dari localStorage
const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
  location.href = '/login.html';
}

const urlParams = new URLSearchParams(window.location.search);
const chatWith = urlParams.get('to'); // nomor lawan chat

let userNumber = user.number;
const chatContainer = document.getElementById('chatContainer');
const form = document.getElementById('chatForm');
const textInput = document.getElementById('textMessage');
const imageInput = document.getElementById('imageMessage');

// Fungsi untuk tampilkan pesan
function addMessage(msg) {
  const div = document.createElement('div');
  div.className = 'message ' + (msg.from === userNumber ? 'sent' : 'received');
  if (msg.text) {
    div.textContent = msg.text;
  } else if (msg.image) {
    const img = document.createElement('img');
    img.src = msg.image;
    img.style.maxWidth = '150px';
    div.appendChild(img);
  }
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Ambil riwayat pesan dari backend
async function loadHistory() {
  const res = await fetch(`/messages/${userNumber}/${chatWith}`);
  const messages = await res.json();
  messages.forEach(addMessage);
}

loadHistory();

// Kirim pesan
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = textInput.value.trim();
  const file = imageInput.files[0];

  if (!text && !file) return;

  let imageBase64 = null;
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imageBase64 = reader.result;
      sendMessage(text, imageBase64);
    };
    reader.readAsDataURL(file);
  } else {
    sendMessage(text, null);
  }

  textInput.value = '';
  imageInput.value = '';
});

function sendMessage(text, image) {
  const data = {
    from: userNumber,
    to: chatWith,
    text: text || null,
    image: image || null
  };
  socket.emit('chat', data);
}

// Tampilkan pesan baru yang dikirim/diterima
socket.on('chat', (msg) => {
  if (
    (msg.from === userNumber && msg.to === chatWith) ||
    (msg.from === chatWith && msg.to === userNumber)
  ) {
    addMessage(msg);
  }
});