function getTodayKey() {
  const today = new Date();
  return today.toISOString().slice(0,10);
}

function loadProgress(user) {
  return JSON.parse(localStorage.getItem("taskProgress_" + user) || "{}");
}
function saveProgress(user, progress) {
  localStorage.setItem("taskProgress_" + user, JSON.stringify(progress));
}
function getCurrentUser() {
  return document.getElementById("user-select").value;
}

// ======= Checklist for Today =======
function renderToday() {
  const user = getCurrentUser();
  const tasks = SCHEDULES[user];
  const dateEl = document.getElementById("date");
  const taskList = document.getElementById("task-list");
  const todayKey = getTodayKey();
  const progress = loadProgress(user);
  const todayProgress = progress[todayKey] || [];
  
  // Choose color by user
  let tableClass = "";
  if (user === "valerie") tableClass = "pink-table";
  else if (user === "olivia") tableClass = "blue-table";
  else tableClass = "";

  dateEl.textContent = todayKey + " (" + capitalize(user) + ")";
  let html = `<table class="task-table ${tableClass}"><tr><th>Time</th><th>Task</th><th>Done?</th></tr>`;
  tasks.forEach((item, i) => {
    html += `<tr>
      <td>${item.time}</td>
      <td>${item.task}</td>
      <td><input type="checkbox" id="task${i}" ${todayProgress[i] ? "checked" : ""}></td>
    </tr>`;
  });
  html += "</table>";
  taskList.innerHTML = html;
}

function saveToday() {
  const user = getCurrentUser();
  const tasks = SCHEDULES[user];
  const todayKey = getTodayKey();
  const checkboxes = document.querySelectorAll("#task-list input[type=checkbox]");
  const checked = Array.from(checkboxes).map(box => box.checked);
  const progress = loadProgress(user);
  progress[todayKey] = checked;
  saveProgress(user, progress);
  renderCalendar();
  alert("Saved!");
}

// ======= Calendar ========
function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";
  const user = getCurrentUser();
  const progress = loadProgress(user);
  const tasks = SCHEDULES[user];
