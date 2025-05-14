document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const number = document.getElementById('contactNumber').value;
  const name = document.getElementById('contactName').value;

  await fetch('/addContact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      owner: localStorage.getItem('number'),
      number, name
    })
  });

  alert("Kontak disimpan.");
});

document.getElementById('searchContact').addEventListener('input', async (e) => {
  const keyword = e.target.value;
  const res = await fetch(`/searchContact?owner=${localStorage.getItem('number')}&q=${keyword}`);
  const data = await res.json();

  const list = document.getElementById('contactList');
  list.innerHTML = '';
  data.forEach(contact => {
    const li = document.createElement('li');
    li.innerText = `${contact.name} (${contact.number})`;
    list.appendChild(li);
  });
});