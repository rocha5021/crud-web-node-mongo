const API_URL = "http://localhost:5000/api/users";
let editId = null;

const form = document.getElementById("user-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const tbody = document.querySelector("#user-table tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = {
    name: nameInput.value,
    email: emailInput.value,
  };

  try {
    if (editId) {
      // Atualizar usuário existente
      const res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar o usuário.");
      }

      editId = null;
    } else {
      // Criar novo usuário
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar o usuário.");
      }
    }

    form.reset();
    loadUsers();
  } catch (error) {
    alert(error.message);
  }
});

async function loadUsers() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error("Erro ao carregar os usuários.");
    }

    const users = await res.json();
    tbody.innerHTML = "";
    users.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <button onclick="editUser('${user.id || user._id}', '${user.name}', '${user.email}')">Editar</button>
          <button onclick="deleteUser('${user.id || user._id}')">Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    alert(error.message);
  }
}

function editUser(id, name, email) {
  nameInput.value = name;
  emailInput.value = email;
  editId = id;
}

async function deleteUser(id) {
  if (confirm("Deseja excluir este usuário?")) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir o usuário.");
      }

      loadUsers();
    } catch (error) {
      alert(error.message);
    }
  }
}

loadUsers();
