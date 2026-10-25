// Tudo que conversa com o Firebase fica neste arquivo.
// O resto do site só usa as funções exportadas aqui.
import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, addDoc, deleteDoc, arrayUnion,
  collection, query, orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const disponivel = !String(firebaseConfig.apiKey).startsWith("COLE");

let auth, db;
if (disponivel) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

/* ---------- Login ---------- */
export function aoMudarLogin(callback) {
  if (!disponivel) return callback(null);
  onAuthStateChanged(auth, callback);
}

export async function entrarComGoogle() {
  const provedor = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provedor);
  } catch (erro) {
    if (erro.code === "auth/popup-blocked") return signInWithRedirect(auth, provedor);
    throw erro;
  }
}

export const sair = () => signOut(auth);

/* ---------- Grupo ---------- */
const refGrupo = id => doc(db, "grupos", id);

function gerarCodigo() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem O, I, 0 e 1, para não confundir
  const sorteio = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(sorteio, n => letras[n % letras.length]).join("");
}

// Cada pessoa sempre tem um grupo. O primeiro é só dela, e depois ela pode entrar em outro.
export async function garantirGrupo(usuario) {
  const refUsuario = doc(db, "users", usuario.uid);
  const salvo = await getDoc(refUsuario);
  if (salvo.exists() && salvo.data().grupoId) return salvo.data().grupoId;

  const id = gerarCodigo();
  await setDoc(refGrupo(id), {
    nome: "Nosso grupo",
    membros: [usuario.uid],
    criadoPor: usuario.uid,
    criadoEm: serverTimestamp()
  });
  await setDoc(refUsuario, { grupoId: id }, { merge: true });
  return id;
}

export async function entrarNoGrupo(usuario, codigo) {
  const id = codigo.trim().toUpperCase();
  const grupo = await getDoc(refGrupo(id));
  if (!grupo.exists()) throw new Error("grupo-inexistente");
  if (!grupo.data().membros.includes(usuario.uid)) {
    await updateDoc(refGrupo(id), { membros: arrayUnion(usuario.uid) });
  }
  await setDoc(doc(db, "users", usuario.uid), { grupoId: id }, { merge: true });
  return id;
}

export function observarGrupo(id, aoReceber, aoFalhar) {
  return onSnapshot(refGrupo(id), snap => aoReceber(snap.data() || null), aoFalhar);
}

/* ---------- Progresso de cada pessoa ---------- */
export function observarMembros(grupoId, aoReceber, aoFalhar) {
  return onSnapshot(collection(db, "grupos", grupoId, "membros"), snap => {
    aoReceber(snap.docs.map(d => ({ uid: d.id, ...d.data(), pendente: d.metadata.hasPendingWrites })));
  }, aoFalhar);
}

export function salvarProgresso(grupoId, usuario, estado) {
  return setDoc(doc(db, "grupos", grupoId, "membros", usuario.uid), {
    nome: usuario.displayName || "",
    lidos: estado.lidos,
    inicio: estado.inicio || null,
    atualizadoEm: serverTimestamp()
  });
}

/* ---------- Notas ---------- */
export function observarNotas(grupoId, aoReceber, aoFalhar) {
  const consulta = query(collection(db, "grupos", grupoId, "notas"), orderBy("criadoEm"));
  return onSnapshot(consulta, snap => {
    aoReceber(snap.docs.map(d => {
      const dados = d.data({ serverTimestamps: "estimate" });
      return { id: d.id, ...dados, criadoEm: dados.criadoEm ? dados.criadoEm.toMillis() : Date.now() };
    }));
  }, aoFalhar);
}

export const criarNota = (grupoId, nota) =>
  addDoc(collection(db, "grupos", grupoId, "notas"), { ...nota, criadoEm: serverTimestamp() });

export const editarNota = (grupoId, id, texto) =>
  updateDoc(doc(db, "grupos", grupoId, "notas", id), { texto, editadoEm: serverTimestamp() });

export const apagarNota = (grupoId, id) =>
  deleteDoc(doc(db, "grupos", grupoId, "notas", id));
