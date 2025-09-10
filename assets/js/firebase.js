import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYT4OkPkJHkXE44jqIcaWtXL-f105JNoE",
  authDomain: "aprovamaispb-6ea02.firebaseapp.com",
  projectId: "aprovamaispb-6ea02",
  storageBucket: "aprovamaispb-6ea02.firebasestorage.app",
  messagingSenderId: "980253365163",
  appId: "1:980253365163:web:e1d116769cd8031dd1b8ee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function salvarInscricao(dados) {
  await addDoc(collection(db, "inscricoes"), dados);
}

export async function listarInscricoes() {
  const snapshot = await getDocs(collection(db, "inscricoes"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function salvarProfessor(prof) {
  await addDoc(collection(db, "professores"), prof);
}

export async function listarProfessores() {
  const snapshot = await getDocs(collection(db, "professores"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function autenticarProfessor(usuario, senha) {
  const q = query(
    collection(db, "professores"),
    where("usuario", "==", usuario),
    where("senha", "==", senha)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}
