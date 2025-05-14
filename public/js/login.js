document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const number = document.getElementById('regNumber').value.trim();

  if (number.length > 6) return alert("Nomor maksimal 6 digit!");

  localStorage.setItem('name', name);
  localStorage.setItem('number', number);

  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, number })
  });

  if (res.ok) {
    window.location.href = 'home.html';
  } else {
    alert("Nomor sudah terdaftar.");
  }
});

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const number = document.getElementById('loginNumber').value.trim();

  const res = await fetch(`/user/${number}`);
  if (!res.ok) return alert("Nomor tidak ditemukan!");

  const data = await res.json();
  localStorage.setItem('number', number);
  localStorage.setItem('name', data.name);

  window.location.href = 'home.html';
});