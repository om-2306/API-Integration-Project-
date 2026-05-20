const API_URL = 'https://jsonplaceholder.typicode.com/users';
const userList = document.getElementById('user-list');
const statusEl = document.getElementById('status');
const searchInput = document.getElementById('search');
const refreshButton = document.getElementById('refresh');

let users = [];

function setStatus(message, type = 'loading') {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function clearStatus() {
  statusEl.className = 'status hidden';
  statusEl.textContent = '';
}

function renderUsers(items) {
  if (!items.length) {
    userList.innerHTML = '<div class="status error">No users match your search.</div>';
    return;
  }

  userList.innerHTML = items
    .map((user) => `
      <article class="card">
        <h2>${user.name}</h2>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <span>${user.address.city}, ${user.address.street}</span>
      </article>
    `)
    .join('');
}

function filterUsers(query) {
  const lowerQuery = query.trim().toLowerCase();
  if (!lowerQuery) {
    renderUsers(users);
    return;
  }

  const filtered = users.filter((user) => {
    return [user.name, user.username, user.email, user.company.name, user.address.city]
      .some((value) => value.toLowerCase().includes(lowerQuery));
  });

  renderUsers(filtered);
}

async function loadUsers() {
  setStatus('Loading users…', 'loading');
  userList.innerHTML = '';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    users = await response.json();
    clearStatus();
    renderUsers(users);
  } catch (error) {
    setStatus(`Failed to load data: ${error.message}`, 'error');
    userList.innerHTML = '<div class="status error">Try clicking Reload or check your network connection.</div>';
  }
}

searchInput.addEventListener('input', (event) => {
  filterUsers(event.target.value);
});

refreshButton.addEventListener('click', () => {
  searchInput.value = '';
  loadUsers();
});

loadUsers();
