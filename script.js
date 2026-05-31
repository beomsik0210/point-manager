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

import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGQnpivusum0ocUuHx-AFrjzl1dukui8A",
  authDomain: "hankyul-point.firebaseapp.com",
  projectId: "hankyul-point",
  storageBucket: "hankyul-point.firebasestorage.app",
  messagingSenderId: "774806046730",
  appId: "1:774806046730:web:b663d65d9504fdd588b7f3"
};

/////////////////////////////
// 1️⃣ Firebase 초기화 (순서 중요)
/////////////////////////////
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 로그인
await signInAnonymously(auth);
console.log(auth.currentUser.uid);

// 🔥 관리자 UID
const ADMIN_UID = "여기에_관리자_UID";

// 관리자 체크 함수
function isAdmin() {
  return auth.currentUser?.uid === ADMIN_UID;
}

/////////////////////////////
// 2️⃣ DOM
/////////////////////////////
const userList = document.getElementById("userList");
const addBtn = document.getElementById("addBtn");

/////////////////////////////
// 3️⃣ 이름 추가 (관리자만)
/////////////////////////////
addBtn.addEventListener("click", async () => {
  if (!isAdmin()) {
    alert("관리자만 추가할 수 있습니다.");
    return;
  }

  const name = document.getElementById("nameInput").value;
  if (!name) return;

  await addDoc(collection(db, "users"), {
    name,
    point: 0
  });

  loadUsers();
});

/////////////////////////////
// 4️⃣ 사용자 불러오기
/////////////////////////////
async function loadUsers() {
  userList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "users"));

  snapshot.forEach((item) => {
    const user = item.data();
    const admin = isAdmin();

    const div = document.createElement("div");
    div.className = "user";

    div.innerHTML = `
      <h3>${user.name}</h3>
      <p>포인트 : ${user.point}</p>

      <input type="number" id="input-${item.id}" value="1">

      ${admin ? `
        <button onclick="addPoint('${item.id}', ${user.point})">추가</button>
        <button onclick="minusPoint('${item.id}', ${user.point})">차감</button>
        <button onclick="deleteUser('${item.id}')">삭제</button>
      ` : `` }
    `;

    userList.appendChild(div);
  });
}

/////////////////////////////
// 5️⃣ 포인트 추가 (관리자만)
/////////////////////////////
window.addPoint = async (id, current) => {
  if (!isAdmin()) return alert("관리자만 가능합니다.");

  const value = Number(document.getElementById(`input-${id}`).value);

  await updateDoc(doc(db, "users", id), {
    point: current + value
  });

  loadUsers();
};

/////////////////////////////
// 6️⃣ 포인트 차감 (관리자만)
/////////////////////////////
window.minusPoint = async (id, current) => {
  if (!isAdmin()) return alert("관리자만 가능합니다.");

  const value = Number(document.getElementById(`input-${id}`).value);

  await updateDoc(doc(db, "users", id), {
    point: current - value
  });

  loadUsers();
};

/////////////////////////////
// 7️⃣ 삭제 (관리자만)
/////////////////////////////
window.deleteUser = async (id) => {
  if (!isAdmin()) return alert("관리자만 가능합니다.");

  const ok = confirm("정말 삭제할까요?");
  if (!ok) return;

  await deleteDoc(doc(db, "users", id));

  loadUsers();
};

/////////////////////////////
// 8️⃣ 최초 실행
/////////////////////////////
loadUsers();