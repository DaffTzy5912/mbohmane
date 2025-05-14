document.addEventListener('DOMContentLoaded', async () => {
  const number = localStorage.getItem('number');
  if (!number) return location.href = 'index.html';

  const res = await fetch(`/chats/${number}`);
  const chats = await res.json();

  const chatList = document.getElementById('chatList');
  chatList.innerHTML = '';

  chats.forEach(chat => {
    const div = document.createElement('div');
    div.className = 'chat-item';
    div.innerText = `${chat.name} (${chat.number})`;
    div.onclick = () => {
      localStorage.setItem('chatWith', chat.number);
      window.location.href = 'chat.html';
    };
    chatList.appendChild(div);
  });
});