const SHEETDB_API = 'https://sheetdb.io/api/v1/27o8ed5ayvouj';

// Set up your date range here!
const CALENDAR_START = "2025-06-15";
const CALENDAR_END   = "2025-08-16";

// Start with today as default, but allow user to change
let selectedDate = getTodayKey();

function getTodayKey() {
  const today = new Date();
  return today.toISOString().slice(0,10);
}

function getTaskTableColor(user) {
  if (user === "olivia") return "#ffe0f0"; // Light pink
  if (user === "valerie") return "#f3e8ff";  // Light purple
  return "#f9f9f9";
}

// ======= Google Sheets Cloud Sync =======
async function loadProgress(user, date) {
  const url = `${SHEETDB_API}/search?user=${user}&date=${date}`;
  const response = await fetch(url);
  return await response.json();
}

async function saveProgress(user, date, checklist) {
  const oldRows = await loadProgress(user, date);
  for (let row of oldRows) {
    await fetch(`${SHEETDB_API}/id/${row.id}`, { method: "DELETE" });
  }
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

async function renderUserToday(user) {
  const tasks = SCHEDULES[user];
  const dateEl = document.getElementById(user + "-date");
  const taskList = document.getElementById(user + "-task-list");
  let progressRows = await loadProgress(user, selectedDate);

  let todayProgress = Array(tasks.length).fill(false);
  progressRows.forEach(row => {
    if (row.done === "TRUE" || row.done === "true") todayProgress[parseInt(row.index)] = true;
  });

  dateEl.textContent = capitalize(user) + " — " + selectedDate;

  let html = `<table class="task-table" style="background:${getTaskTableColor(user)}"><tr><th>Time</th><th>Task</th><th>Done?</th></tr>`;
  tasks.forEach((item, i) => {
    html += `<tr>
      <td>${item.time}</td>
      <td>${item.task}</td>
      <td style="text-align:center;"><input type="checkbox" class="check-${user}" data-idx="${i}" ${todayProgress[i] ? "checked" : ""}></td>
    </tr>`;
  });
  html += "</table>";
  taskList.innerHTML = html;
}

async function saveUserToday(user) {
  const tasks = SCHEDULES[user];
  const checkboxes = document.querySelectorAll(`.check-${user}`);
  const checklist = tasks.map((task, i) => ({
    ...task,
    done: checkboxes[i].checked
  }));
  await saveProgress(user, selectedDate, checklist);
  alert("Saved for " + capitalize(user) + "!");
  await renderUserToday(user); // refresh table for this user
  await renderParentSummary(); // update summary table
}

function daysBetween(d1, d2) {
  return Math.round
