const SHEETDB_API = 'https://sheetdb.io/api/v1/27o8ed5ayvouj';

const CALENDAR_START = "2025-06-15";
const CALENDAR_END   = "2025-08-16";

let selectedDate = getTodayKey();

function getTodayKey() {
  const today = new Date();
  return today.toISOString().slice(0,10);
}

function getTaskTableColor(user) {
  if (user === "valerie") return "#ffe0f0";
  if (user === "olivia") return "#f3e8ff";
  return "#f9f9f9";
}

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
  dateEl.textContent = capitalize(user) + " — " + selectedDate;
  taskList.innerHTML = "<div class='loading'>Loading...</div>";

  let progressRows = await loadProgress(user, selectedDate);

  let todayProgress = Array(tasks.length).fill(false);
  progressRows.forEach(row => {
    if (row.done === "TRUE" || row.done === "true") todayProgress[parseInt(row.index)] = true;
  });

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
  const btn = document.querySelector(`.save-btn[data-user="${user}"]`);
  btn.disabled = true;
  btn.textContent = "Saving...";
  await saveProgress(user, selectedDate, checklist);
  btn.textContent = "Save for " + capitalize(user);
  btn.disabled = false;
  await renderUserToday(user);
}

function daysBetween(d1, d2) {
  return Math.round((d2 - d1) / (1000*60*60*24));
}

function dateAdd(date, days) {
  let d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10);
}

function isToday(date) {
  return date === getTodayKey();
}

async function renderMainCalendar() {
  const grid = document.getElementById("main-calendar-grid");
  grid.innerHTML = "";
  let start = new Date(CALENDAR_START);
  let end = new Date(CALENDAR_END);
  let numDays = daysBetween(start, end);

  let weekRow;
  for (let i = 0; i <= numDays; i++) {
    const thisDate = dateAdd(CALENDAR_START, i);
    if (i % 7 === 0) {
      weekRow = document.createElement("div");
      weekRow.className = "calendar-row";
      grid.appendChild(weekRow);
    }
    const btn = document.createElement("button");
    btn.className = "calendar-btn";
    btn.textContent = thisDate.slice(5);
    if (thisDate === selectedDate) btn.classList.add("selected");
    if (isToday(thisDate)) btn.classList.add("today");
    btn.onclick = async function() {
      selectedDate = thisDate;
      await renderUserToday("olivia");
      await renderUserToday("valerie");
      renderMainCalendar();
    };
    weekRow.appendChild(btn);
  }
}

async function renderParentSummary() {
  const parentDiv = document.getElementById("parent-summary");
  parentDiv.style.display = "block";
  const tableDiv = document.getElementById("parent-summary-table");
  tableDiv.innerHTML = "<div class='loading'>Loading summary...</div>";

  const days = daysBetween(new Date(CALENDAR_START), new Date(CALENDAR_END));
  let html = '<table border="1" cellpadding="5"><tr><th>Date</th>';
  USERS.forEach(user => {
    html += `<th>${capitalize(user)}</th>`;
  });
  html += '</tr>';

  let dateList = [];
  for (let i = 0; i <= days; i++) {
    dateList.push(dateAdd(CALENDAR_START, i));
  }
  let allResults = {};
  for (let user of USERS) {
    allResults[user] = [];
    for (let key of dateList) {
      allResults[user].push(loadProgress(user, key));
    }
  }
  for (let user of USERS) {
    allResults[user] = await Promise.all(allResults[user]);
  }

  for (let i = 0; i <= days; i++) {
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
  tableDiv.innerHTML = html;
}

document.body.addEventListener('click', async function(e) {
  if (e.target.classList.contains('save-btn')) {
    const user = e.target.getAttribute('data-user');
    await saveUserToday(user);
  }
});

document.getElementById("parent-summary-btn").onclick = function() {
  document.getElementById("parent-summary").style.display = "block";
  renderParentSummary();
  window.scrollTo(0, document.body.scrollHeight);
};
document.getElementById("close-summary-btn").onclick = function() {
  document.getElementById("parent-summary").style.display = "none";
};

window.onload = async function() {
  await renderUserToday("olivia");
  await renderUserToday("valerie");
  await renderMainCalendar();
  document.getElementById("parent-summary").style.display = "none";
};
