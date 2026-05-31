import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCGQnpivusum0ocUuHx-AFrjzl1dukui8A",
    authDomain: "hankyul-point.firebaseapp.com",
    projectId: "hankyul-point",
    storageBucket: "hankyul-point.firebasestorage.app",
    messagingSenderId: "774806046730",
    appId: "1:774806046730:web:b663d65d9504fdd588b7f3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userList = document.getElementById("userList");
const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", async () => {
  const name = document.getElementById("nameInput").value;

  if (!name) return;

  await addDoc(collection(db, "users"), {
    name,
    point: 0
  });

  location.reload();
});

async function loadUsers() {
  userList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "users"));

  snapshot.forEach((item) => {
    const user = item.data();

    const div = document.createElement("div");
    div.className = "user";

    div.innerHTML = `
      <h3>${user.name}</h3>
      <p>포인트 : ${user.point}</p>

      <input type="number" id="input-${item.id}" value="1">

      <button onclick="addPoint('${item.id}',${user.point})">
        추가
      </button>

      <button onclick="minusPoint('${item.id}',${user.point})">
        차감
      </button>
      
      <button onclick="deleteUser('${item.id}')">
        삭제
      </button>
    `;

    userList.appendChild(div);
  });
}

window.addPoint = async (id,current) => {
  const value = Number(
    document.getElementById(`input-${id}`).value
  );

  await updateDoc(doc(db,"users",id),{
    point: current + value
  });

  location.reload();
};

window.minusPoint = async (id,current) => {
  const value = Number(
    document.getElementById(`input-${id}`).value
  );

  await updateDoc(doc(db,"users",id),{
    point: current - value
  });

  location.reload();
};

loadUsers();