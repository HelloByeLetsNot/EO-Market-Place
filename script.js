document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:5000/api';
    let token = localStorage.getItem('token');

    const itemsList = document.getElementById('items-list');
    const playerItemsTable = document.getElementById('player-items');
    const loginForm = document.getElementById('login-form');
    const memberStatus = document.getElementById('member-status');
    const makeListingBtn = document.getElementById('make-listing-btn');
    const logoutBtn = document.getElementById('logout-btn');

    function fetchItems() {
        fetch(`${API_URL}/items`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            itemsList.innerHTML = '';
            playerItemsTable.innerHTML = '';
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.name;
                itemsList.appendChild(li);

                const tr = document.createElement('tr');
                const tdPlayer = document.createElement('td');
                const tdItem = document.createElement('td');
                tdPlayer.textContent = item.owner.username;
                tdItem.textContent = item.name;
                tr.appendChild(tdPlayer);
                tr.appendChild(tdItem);
                playerItemsTable.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                token = data.token;
                localStorage.setItem('token', token);
                memberStatus.textContent = `Member: ${username}`;
                fetchItems();
            } else {
                alert('Invalid credentials');
            }
        })
        .catch(error => console.error('Error logging in:', error));
    });

    makeListingBtn.addEventListener('click', () => {
        const itemName = prompt('Enter the name of the item:');
        if (itemName) {
            fetch(`${API_URL}/items/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: itemName })
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    fetchItems();
                } else {
                    alert('Error adding item');
                }
            })
            .catch(error => console.error('Error adding item:', error));
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        token = null;
        memberStatus.textContent = 'Member: Not Logged In';
        itemsList.innerHTML = '';
        playerItemsTable.innerHTML = '';
    });

    if (token) {
        fetchItems();
    }
});