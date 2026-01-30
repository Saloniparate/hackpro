// 🌐 Data Structures
class PatientNode {
  constructor(name, age, disease, dept, priority) {
    this.name = name;
    this.age = age;
    this.disease = disease;
    this.dept = dept;
    this.priority = priority;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  add(node) {
    if (!this.head) this.head = node;
    else {
      let temp = this.head;
      while (temp.next) temp = temp.next;
      temp.next = node;
    }
  }
  traverse() {
    let temp = this.head, arr = [];
    while (temp) {
      arr.push(temp);
      temp = temp.next;
    }
    return arr;
  }
}

class PriorityQueue {
  constructor() { this.queue = []; }
  enqueue(patient) {
    if (patient.priority === "Emergency") this.queue.unshift(patient);
    else this.queue.push(patient);
  }
  dequeue() { return this.queue.shift(); }
  isEmpty() { return this.queue.length === 0; }
}

class Stack {
  constructor() { this.items = []; }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  getAll() { return [...this.items].reverse(); }
}

const allPatients = new LinkedList();
const waitingQueue = new PriorityQueue();
const historyStack = new Stack();

// 🩺 Add Patient
function addPatient() {
  const name = pname.value.trim();
  const age = page.value.trim();
  const disease = pdisease.value.trim();
  const dept = pdept.value;
  const priority = ppriority.value;

  if (!name || !age || !disease) return alert("Please fill all fields!");

  const newPatient = new PatientNode(name, age, disease, dept, priority);
  allPatients.add(newPatient);
  waitingQueue.enqueue(newPatient);
  localStorage.setItem("patients", JSON.stringify(allPatients.traverse()));
  renderPatients();
  renderQueue();
  updateStats();
}

// 💉 Treat Next Patient
function treatNext() {
  if (waitingQueue.isEmpty()) return alert("No patients waiting!");
  const treated = waitingQueue.dequeue();
  historyStack.push(treated);
  renderQueue();
  renderHistory();
  updateStats();
  alert(`👩‍⚕️ ${treated.name} treated successfully!`);
}

// ⏪ Undo Last Treatment
function undoLastTreatment() {
  const last = historyStack.pop();
  if (!last) return alert("No treatments to undo!");
  waitingQueue.enqueue(last);
  renderQueue();
  renderHistory();
  updateStats();
}

// 🔍 Search Patient
function searchPatient() {
  const query = search.value.toLowerCase();
  const all = allPatients.traverse();
  const filtered = all.filter(p =>
    p.name.toLowerCase().includes(query) || p.disease.toLowerCase().includes(query)
  );
  renderPatients(filtered);
}

// 🎨 Canvas Visualization
function renderQueue() {
  const canvas = document.getElementById("queueCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  waitingQueue.queue.forEach((p, i) => {
    const x = 50 + i * 120;
    const y = 100;
    ctx.fillStyle = p.priority === "Emergency" ? "#ff4d4d" : "#007bff";
    ctx.fillRect(x, y, 100, 50);
    ctx.fillStyle = "#fff";
    ctx.font = "14px Poppins";
    ctx.fillText(p.name, x + 10, y + 30);
  });
}

// 🧾 Render Patients
function renderPatients(list = allPatients.traverse()) {
  const ul = document.getElementById("patientList");
  ul.innerHTML = "";
  list.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name}, Age: ${p.age}, ${p.disease} (${p.dept}, ${p.priority})`;
    ul.appendChild(li);
  });
}

// 🩹 Render History
function renderHistory() {
  const ul = document.getElementById("historyList");
  ul.innerHTML = "";
  historyStack.getAll().forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} (${p.dept}) - ${p.priority}`;
    ul.appendChild(li);
  });
}

// 📊 Stats
function updateStats() {
  totalPatients.textContent = `Total Patients: ${allPatients.traverse().length}`;
  treatedPatients.textContent = `Treated: ${historyStack.getAll().length}`;
  emergencyCount.textContent = `Emergency Cases: ${
    allPatients.traverse().filter(p => p.priority === "Emergency").length
  }`;
}

// 🌗 Dark/Light Mode
const toggleBtn = document.getElementById("themeToggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  toggleBtn.textContent =
    document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// 🧠 Init
window.onload = () => {
  renderPatients();
  renderQueue();
  renderHistory();
  updateStats();
};