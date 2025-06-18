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

  dateEl.textContent = todayKey + " (" + capitalize(user) + ")";
  taskList.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todayProgress[i] || false;
    checkbox.id = `task${i}`;
    li.appendChild(checkbox);
    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = " " + task;
    li.appendChild(label);
    taskList.appendChild(li);
  });
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
  const days = 30;
  for (let i = days-1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0,10);
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = key.slice(5); // MM-DD
    if (progress[key]) {
      const done = progress[key].length === tasks.length && progress[key].every(v => v);
      dayDiv.style.background = done ? "lightgreen" : "salmon";
      dayDiv.title = done ? "All tasks completed" : "Not all tasks done";
    } else {
      dayDiv.style.background = "#eee";
      dayDiv.title = "No data";
    }
    grid.appendChild(dayDiv);
  }
}

// ======= Parent Summary =======
function renderParentSummary() {
  const days = 30;
  let html = '<table border="1" cellpadding="5"><tr><th>Date</th>';
  USERS.forEach(user => {
    html += `<th>${capitalize(user)}</th>`;
  });
  html += '</tr>';

  for (let i = days-1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0,10);
    html += `<tr><td>${key}</td>`;
    USERS.forEach(user => {
      const progress = loadProgress(user);
      const tasks = SCHEDULES[user];
      if (progress[key]) {
        const done = progress[key].length === tasks.length && progress[key].every(v => v);
        html += `<td style="background:${done?'lightgreen':'salmon'};text-align:center;">${done?'✅':'❌'}</td>`;
      } else {
        html += `<td style="background:#eee;text-align:center;">—</td>`;
      }
    });
    html += '</tr>';
  }
  html += '</table>';
  document.getElementById("parent-summary-table").innerHTML = html;
}

// ======= Event Listeners & Initialization =======

document.getElementById("user-select").onchange = function() {
  renderToday();
  renderCalendar();
};
document.getElementById("save-btn").onclick = saveToday;
document.getElementById("parent-summary-btn").onclick = function() {
  document.getElementById("main").style.display = "none";
  document.getElementById("parent-summary").style.display = "block";
  renderParentSummary();
};
document.getElementById("close-summary-btn").onclick = function() {
  document.getElementById("main").style.display = "block";
  document.getElementById("parent-summary").style.display = "none";
};

window.onload = function() {
  // Fill dropdown with users
  const sel = document.getElementById("user-select");
  sel.innerHTML = USERS.map(user => `<option value="${user}">${capitalize(user)}</option>`).join('');
  renderToday();
  renderCalendar();
};
