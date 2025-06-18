const SHEETDB_API = 'https://sheetdb.io/api/v1/27o8ed5ayvouj';

function getTodayKey() {
  const today = new Date();
  return today.toISOString().slice(0,10);
}

function getCurrentUser() {
  return document.getElementById("user-select").value;
}

function getTaskTableColor(user) {
  if (user === "valerie") return "#ffe0f0"; // Light pink
  if (user === "olivia") return "#e0edff";  // Light blue
  return "#f9f9f9";
}

// ======= Google Sheets Cloud Sync =======
async function loadProgress(user, date) {
  const url = `${SHEETDB_API}/search?user=${user}&date=${date}`;
  const response = await fetch(url);
  return await response.json(); // array of rows (if any)
}

async function saveProgress(user, date, checklist) {
  // First, remove old rows for this user/date
  // (SheetDB only supports DELETE by id, so we get the old rows and delete them by row id)
  const oldRows = await loadProgress(user, date);
  for (let row of oldRows) {
    await fetch(`${SHEETDB_API}/id/${row.id}`, { method: "DELETE" });
  }
  // Add new rows
  const data = checklist.map((item, i) => ({
    date,
    user,
    index: i,
    time: item.time,
    task: item.task,
    done: item.done ? "TRUE" : "FALSE"
  }));
  await fetch(`${SHEETDB_API}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
}

// ======= Checklist for Today =======
async function renderToday() {
  const user = getCurrentUser();
  const tasks = SCHEDULES[user];
  const dateEl = document.getElementById("date");
  const taskList = document.getElementById("task-list");
  const todayKey = getTodayKey();
  let progressRows = await loadProgress(user, todayKey);

  // Build the status array (default: all false)
  let todayProgress = Array(tasks.length).fill(false);
  progressRows.forEach(row => {
    if (row.done === "TRUE" || row.done === "true") todayProgress[parseInt(row.index)] = true;
  });

  dateEl.textContent = todayKey + " (" + capitalize(user) + ")";

  // Build the task table
  let html = `<table class="task-table" style="background:${getTaskTableColor(user)}"><tr><th>Time</th><th>Task</th><th>Done?</th></tr>`;
  tasks.forEach((item, i) => {
    html += `<tr>
      <td>${item.time}</td>
      <td>${item.task}</td>
      <td style="text-align:center;"><input type="checkbox" id="task${i}" ${todayProgress[i] ? "checked" : ""}></td>
    </tr>`;
  });
  html += "</table>";
  taskList.innerHTML = html;
}

async function saveToday() {
  const user = getCurrentUser();
  const tasks = SCHEDULES[user];
  const todayKey = getTodayKey();
  const checkboxes = document.querySelectorAll("#task-list input[type=checkbox]");
  const checklist = tasks.map((task, i) => ({
    ...task,
    done: checkboxes[i].checked
  }));
  await saveProgress(user, todayKey, checklist);
  alert("Saved!");
  renderCalendar(); // update calendar after save
}

// ======= Calendar =======
async function renderCalendar() {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";
  const user = getCurrentUser();
  const tasks = SCHEDULES[user];
  const days = 30;
  // We'll need to fetch progress for each day
  let promises = [];
  for (let i = days-1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0,10);
    promises.push(loadProgress(user, key));
  }
  let results = await Promise.all(promises);
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days-1-i));
    const key = d.toISOString().slice(0,10);
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = key.slice(5); // MM-DD
    const progressRows = results[i];
    if (progressRows && progressRows.length > 0) {
      // Check if all tasks are done
      let doneCount = 0;
      for (let row of progressRows) if (row.done === "TRUE" || row.done === "true") doneCount++;
      const done = (doneCount === tasks.length);
      dayDiv.style.background = done ? "#c4f0c4" : "#ffc6c6";
      dayDiv.title = done ? "All tasks completed" : "Not all tasks done";
    } else {
      dayDiv.style.background = "#eee";
      dayDiv.title = "No data";
    }
    grid.appendChild(dayDiv);
  }
}

// ======= Parent Summary =======
async function renderParentSummary() {
  const days = 30;
  let html = '<table border="1" cellpadding="5"><tr><th>Date</th>';
  USERS.forEach(user => {
    html += `<th>${capitalize(user)}</th>`;
  });
  html += '</tr>';

  let dateList = [];
  for (let i = days-1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0,10);
    dateList.push(key);
  }
  // Fetch all data up front for all users and days
  let allResults = {};
  for (let user of USERS) {
    allResults[user] = [];
    for (let key of dateList) {
      allResults[user].push(loadProgress(user, key));
    }
  }
  // Wait for all
  for (let user of USERS) {
    allResults[user] = await Promise.all(allResults[user]);
  }

  for (let i = 0; i < days; i++) {
    const key = dateList[i];
    html += `<tr><td>${key}</td>`;
    USERS.forEach(user => {
      const tasks = SCHEDULES[user];
      const progressRows = allResults[user][i];
      if (progressRows && progressRows.length > 0) {
        let doneCount = 0;
        for (let row of progressRows) if (row.done === "TRUE" || row.done === "true") doneCount++;
        const done = (doneCount === tasks.length);
        html += `<td style="background:${done?'#c4f0c4':'#ffc6c6'};text-align:center;">${done?'✅':'❌'}</td>`;
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
