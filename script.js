const menus = {
  "骨盤": [
    { name: "骨盤の前後傾", time: "3分", videoId: "ivwzYxrck6M", query: "骨盤 前後傾 トレーニング" },
    { name: "ヒップリフト", time: "4分", videoId: "XudFwCwxOUg", query: "ヒップリフト 正しいやり方" },
    { name: "クラムシェル", time: "左右4分", videoId: "bPaZAvTyJFs", query: "クラムシェル トレーニング やり方" },
    { name: "膝倒しストレッチ", time: "4分", videoId: "hnBbzGBG0KE", query: "膝倒し ストレッチ 腰" }
  ],
  "肩・背中": [
    { name: "肩回し", time: "3分", query: "肩回し ストレッチ 正しいやり方" },
    { name: "胸開き", time: "4分", query: "胸開き ストレッチ やり方" },
    { name: "キャット＆カウ", time: "4分", query: "キャットアンドカウ 正しいやり方" },
    { name: "背中ストレッチ", time: "4分", query: "背中 ストレッチ 4分" }
  ],
  "股関節": [
    { name: "股関節回し", time: "3分", query: "股関節回し ストレッチ" },
    { name: "ワイドスクワット", time: "4分", query: "ワイドスクワット 正しいフォーム" },
    { name: "ランジストレッチ", time: "左右4分", query: "ランジストレッチ 股関節" },
    { name: "お尻ストレッチ", time: "4分", query: "お尻 ストレッチ 寝ながら" }
  ],
  "全身": [
    { name: "その場足踏み", time: "3分", query: "その場足踏み 3分 運動" },
    { name: "スクワット", time: "4分", query: "スクワット 正しいフォーム 初心者" },
    { name: "プランク", time: "4分", videoId: "pvIjsG5Svck", query: "プランク 正しいフォーム" },
    { name: "全身ストレッチ", time: "4分", query: "全身ストレッチ 4分 初心者" }
  ]
};

const state = {
  body: "骨盤",
  purpose: "姿勢改善",
  calendarDate: new Date()
};

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `routine-${year}-${month}-${day}`;
}

function getDailyData(date = new Date()) {
  try {
    return JSON.parse(localStorage.getItem(dateKey(date)) || "{}");
  } catch {
    return {};
  }
}

document.querySelectorAll(".option-button").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.group;
    document
      .querySelectorAll(`[data-group="${group}"]`)
      .forEach((item) => item.classList.remove("selected"));

    button.classList.add("selected");
    state[group] = button.dataset.value;
  });
});

document.getElementById("start-button").addEventListener("click", openRoutine);
document.getElementById("back-button").addEventListener("click", showHome);
document.getElementById("calendar-button").addEventListener("click", showCalendar);
document.getElementById("calendar-back-button").addEventListener("click", showHome);
document.getElementById("prev-month").addEventListener("click", () => changeMonth(-1));
document.getElementById("next-month").addEventListener("click", () => changeMonth(1));
document.getElementById("close-video").addEventListener("click", closeVideo);

const dialog = document.getElementById("video-dialog");
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeVideo();
});

function hideAllScreens() {
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.add("hidden"));
}

function showHome() {
  hideAllScreens();
  document.getElementById("home-screen").classList.remove("hidden");
}

function openRoutine() {
  hideAllScreens();
  document.getElementById("routine-screen").classList.remove("hidden");
  document.getElementById("routine-label").textContent = `${state.body}・${state.purpose}`;
  renderTasks();
}

function showCalendar() {
  hideAllScreens();
  document.getElementById("calendar-screen").classList.remove("hidden");
  renderCalendar();
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  const saved = getDailyData();
  const selectedMenu = menus[state.body] || menus["骨盤"];

  selectedMenu.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = "task-card";

    const main = document.createElement("label");
    main.className = "task-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(saved[`${state.body}-${index}`]);

    const taskText = document.createElement("span");
    taskText.className = "task-text";

    const taskName = document.createElement("span");
    taskName.className = "task-name";
    taskName.textContent = task.name;

    const taskTime = document.createElement("span");
    taskTime.className = "task-time";
    taskTime.textContent = task.time;

    taskText.append(taskName, taskTime);
    main.append(checkbox, taskText);

    if (checkbox.checked) card.classList.add("checked");

    checkbox.addEventListener("change", () => {
      const latest = getDailyData();
      latest[`${state.body}-${index}`] = checkbox.checked;
      latest._lastBody = state.body;
      latest._lastPurpose = state.purpose;
      localStorage.setItem(dateKey(), JSON.stringify(latest));
      card.classList.toggle("checked", checkbox.checked);
      updateProgress();
    });

    const mediaButtons = document.createElement("div");
    mediaButtons.className = "media-buttons";

    const videoButton = document.createElement("button");
    videoButton.type = "button";
    videoButton.className = "media-button";
    videoButton.textContent = task.videoId ? "▶ 実演動画" : "▶ 動画を検索";
    videoButton.addEventListener("click", () => {
      if (task.videoId) {
        openVideo(task.name, task.videoId);
      } else {
        openSearch(`YouTube ${task.query}`);
      }
    });

    const imageButton = document.createElement("button");
    imageButton.type = "button";
    imageButton.className = "media-button";
    imageButton.textContent = "画像を検索";
    imageButton.addEventListener("click", () => openSearch(`${task.query} 画像`));

    mediaButtons.append(videoButton, imageButton);
    card.append(main, mediaButtons);
    taskList.appendChild(card);
  });

  updateProgress();
}

function updateProgress() {
  const checkboxes = [...document.querySelectorAll("#task-list input[type='checkbox']")];
  const checked = checkboxes.filter((item) => item.checked).length;
  const rate = checkboxes.length ? Math.round((checked / checkboxes.length) * 100) : 0;

  document.getElementById("progress-value").textContent = rate;
  document.getElementById("progress-bar").style.width = `${rate}%`;
  document.getElementById("complete-message").classList.toggle("hidden", rate !== 100);
}

function openVideo(title, videoId) {
  document.getElementById("video-title").textContent = title;
  document.getElementById("video-frame").src =
    `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank", "noopener");
  }
}

function closeVideo() {
  document.getElementById("video-frame").src = "";
  if (dialog.open) dialog.close();
}

function openSearch(query) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(url, "_blank", "noopener");
}

function changeMonth(offset) {
  state.calendarDate = new Date(
    state.calendarDate.getFullYear(),
    state.calendarDate.getMonth() + offset,
    1
  );
  renderCalendar();
}

function getRateForDate(date) {
  const data = getDailyData(date);
  const completedKeys = Object.entries(data)
    .filter(([key, value]) => !key.startsWith("_") && value === true)
    .map(([key]) => key);

  if (!completedKeys.length) return null;

  const body = data._lastBody || completedKeys[0].split("-")[0];
  const total = menus[body]?.length || 4;
  const completed = completedKeys.filter((key) => key.startsWith(`${body}-`)).length;
  return Math.min(100, Math.round((completed / total) * 100));
}

function renderCalendar() {
  const year = state.calendarDate.getFullYear();
  const month = state.calendarDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const grid = document.getElementById("calendar-grid");
  const today = new Date();

  document.getElementById("calendar-title").textContent = `${year}年 ${month + 1}月`;
  grid.innerHTML = "";

  for (let i = 0; i < firstDay; i += 1) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    grid.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day += 1) {
    const date = new Date(year, month, day);
    const rate = getRateForDate(date);
    const cell = document.createElement("div");
    cell.className = "calendar-day";

    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    ) {
      cell.classList.add("today");
    }

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = day;

    const rateLabel = document.createElement("span");
    rateLabel.className = "day-rate";
    if (rate !== null) {
      rateLabel.textContent = `${rate}%`;
      if (rate === 100) rateLabel.classList.add("done");
    }

    cell.append(number, rateLabel);
    grid.appendChild(cell);
  }
}
