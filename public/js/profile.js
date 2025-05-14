document.addEventListener('DOMContentLoaded', async () => {
  const number = localStorage.getItem('number');
  const res = await fetch(`/user/${number}`);
  const user = await res.json();

  document.getElementById('profilePic').src = user.photo || 'default.png';
  document.getElementById('profileName').value = user.name;
  document.getElementById('profileBio').value = user.bio || '';
});

document.getElementById('saveProfile').addEventListener('click', async () => {
  const name = document.getElementById('profileName').value;
  const bio = document.getElementById('profileBio').value;

  const res = await fetch('/updateProfile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      number: localStorage.getItem('number'),
      name, bio
    })
  });

  if (res.ok) alert("Profil diperbarui!");
});