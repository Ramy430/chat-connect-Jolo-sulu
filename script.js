import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.6.1/firebase-firestore.js";

// ---------------- Firebase Config ----------------
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ---------------- DOM Elements ----------------
const wordsTable = document.getElementById("wordsTable");
const searchInput = document.getElementById("search");
const suggestionsDiv = document.getElementById("suggestions");
const tausugInput = document.getElementById("tausug");
const englishInput = document.getElementById("english");
const addBtn = document.getElementById("addBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const notification = document.getElementById("notification");

const wordsCol = collection(db,"dictionary");
let allWords = [];
let editedRows = new Map();

// ---------------- Notifications ----------------
function showNotification(msg, isError=false){
  notification.innerHTML = msg;
  notification.className = isError?'notification error show':'notification show';
  setTimeout(()=>{ notification.className='notification'; },3000);
}

// ---------------- Render Table ----------------
function renderTable(words){
  wordsTable.innerHTML="";
  if(words.length===0){
    wordsTable.innerHTML=`<tr><td colspan="4" style="text-align:center;padding:30px;color:#6c757d;">No words in dictionary yet.</td></tr>`;
    return;
  }
  words.forEach((word,index)=>{
    const tr=document.createElement("tr");

    const idxTd=document.createElement("td");
    idxTd.innerText=index+1;
    tr.appendChild(idxTd);

    const tausugTd=document.createElement("td");
    tausugTd.innerText=word.tausug;
    setupEditableCell(tausugTd,word,"tausug");
    tr.appendChild(tausugTd);

    const englishTd=document.createElement("td");
    englishTd.innerText=word.english;
    setupEditableCell(englishTd,word,"english");
    tr.appendChild(englishTd);

    const actionTd=document.createElement("td");
    const delBtn=document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.innerText="Delete";
    delBtn.addEventListener("click",async()=>{
      if(confirm(`Are you sure you want to delete "${word.tausug}"?`)){
        try{ await deleteDoc(doc(db,"dictionary",word.id)); showNotification(`"${word.tausug}" deleted!`); }
        catch(e){ console.error(e); showNotification("Error deleting word.",true); }
      }
    });
    actionTd
