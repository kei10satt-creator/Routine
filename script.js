const menus = {
  "骨盤": {
    featuredVideoId: "UCiRFfsfa4A",
    tasks: [
      { name: "骨盤の前後傾", time: "3分", videoId: "UCiRFfsfa4A", query: "骨盤 前後傾 理学療法士 日本語" },
      { name: "ヒップリフト", time: "4分", videoId: "MA9aiNCW9hA", query: "ヒップリフト 理学療法士 日本語" },
      { name: "クラムシェル", time: "左右4分", videoId: "38NTzokW7a8", query: "クラムシェル 理学療法士 日本語" },
      { name: "骨盤まわりストレッチ", time: "4分", videoId: "IhAi4PVeO-Q", query: "骨盤 ストレッチ 病院 日本語" }
    ]
  },
  "首": {
    featuredVideoId: null,
    featuredQuery: "首 ストレッチ 理学療法士 日本語",
    tasks: [
      { name: "首の前後運動", time: "3分", query: "首 前後運動 理学療法士 日本語" },
      { name: "首の側屈ストレッチ", time: "左右4分", query: "首 側屈 ストレッチ 理学療法士 日本語" },
      { name: "肩甲骨寄せ", time: "4分", query: "肩甲骨 寄せる 運動 理学療法士 日本語" },
      { name: "胸開きストレッチ", time: "4分", query: "胸開き ストレッチ 理学療法士 日本語" }
    ]
  },
  "肩": {
    featuredVideoId: "zj521H4boeI",
    tasks: [
      { name: "肩回し", time: "3分", query: "肩回し 理学療法士 日本語" },
      { name: "肩甲骨の前後運動", time: "4分", videoId: "zj521H4boeI", query: "肩甲骨 運動 理学療法士 日本語" },
      { name: "胸・肩ストレッチ", time: "4分", query: "胸 肩 ストレッチ 整形外科 日本語" },
      { name: "背中ほぐし", time: "4分", query: "背中 ほぐし 理学療法士 日本語" }
    ]
  },
  "腰": {
    featuredVideoId: "IhAi4PVeO-Q",
    tasks: [
      { name: "骨盤ゆらし", time: "3分", videoId: "IhAi4PVeO-Q", query: "骨盤 ゆらし 腰痛 日本語" },
      { name: "膝抱えストレッチ", time: "4分", query: "膝抱え ストレッチ 腰 理学療法士 日本語" },
      { name: "膝倒し", time: "4分", query: "膝倒し 腰 ストレッチ 理学療法士 日本語" },
      { name: "股関節ストレッチ", time: "4分", query: "腰痛 股関節 ストレッチ 理学療法士 日本語" }
    ]
  },
  "体幹": {
    featuredVideoId: "JqLJZRgGXBE",
    tasks: [
      { name: "ドローイン", time: "3分", query: "ドローイン 理学療法士 日本語" },
      { name: "バードドッグ", time: "4分", query: "バードドッグ 理学療法士 日本語" },
      { name: "初心者プランク", time: "4分", videoId: "lSKmC3kLT6w", query: "プランク 初心者 正しいフォーム 日本語" },
      { name: "体幹ストレッチ", time: "4分", videoId: "JqLJZRgGXBE", query: "体幹 トレーニング 病院 日本語" }
    ]
  }
};

const state = {
  body: "骨盤",
  purpose: "姿勢改善",
  calendarDate: new Date()
};

function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `routine-${y}-${m}-${d}`;
}

function getDailyData(date = new Date()) {
  try { return JSON.parse(localStorage.getItem(dateKey(date)) || "{}"); }
  catch { return {}; }
}

function saveDailyData(data) {
  localStorage.setItem(dateKey(), JSON.stringify(data));
}

function formatToday() {
  const now = new Date();
  return `${now.getMonth() + 1}月${now.getDate()}日`;
}

document.getElementById("today-label").textContent = `${formatToday()}の15分`;

document.querySelectorAll(".option-button").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.group;
    document.querySelectorAll(`[data-group="${group}"]`)
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
document.getElementById("routine-video-button").addEventListener("click", openFeaturedVideo);

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
  updateTodaySummary();
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
  const selectedMenu = menus[state.body];

  selectedMenu.tasks.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = "task-card";

    const main = document.createElement("label");
    main.className = "task-main";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(saved[`${state.body}-${index}`]);

    const text = document.createElement("span");
    text.className = "task-text";

    const name = document.createElement("span");
    name.className = "task-name";
    name.textContent = task.name;

    const time = document.createElement("span");
    time.className = "task-time";
    time.textContent = task.time;

    text.append(name, time);
    main.append(checkbox, text);

    if (checkbox.checked) card.classList.add("checked");

    checkbox.addEventListener("change", () => {
      const latest = getDailyData();
      latest[`${state.body}-${index}`] = checkbox.checked;
      latest._body = state.body;
      latest._purpose = state.purpose;
      saveDailyData(latest);
      card.classList.toggle("checked", checkbox.checked);
      updateProgress();
    });

    const media = document.createElement("div");
    media.className = "media-buttons";

    const videoButton = document.createElement("button");
    videoButton.type = "button";
    videoButton.className = "media-button";
    videoButton.textContent = task.videoId ? "▶ 日本語動画" : "▶ 日本語動画を検索";
    videoButton.addEventListener("click", () => {
      task.videoId ? openVideo(task.name, task.videoId) : openJapaneseVideoSearch(task.query);
    });

    const imageButton = document.createElement("button");
    imageButton.type = "button";
    imageButton.className = "media-button";
    imageButton.textContent = "フォーム画像";
    imageButton.addEventListener("click", () => openImageSearch(task.query));

    media.append(videoButton, imageButton);
    card.append(main, media);
    taskList.appendChild(card);
  });

  updateProgress();
}

function updateProgress() {
  const checkboxes = [...document.querySelectorAll("#task-list input[type='checkbox']")];
  const completed = checkboxes.filter((item) => item.checked).length;
  const rate = checkboxes.length ? Math.round((completed / checkboxes.length) * 100) : 0;

  document.getElementById("progress-value").textContent = rate;
  document.getElementById("progress-bar").style.width = `${rate}%`;
  document.getElementById("complete-message").classList.toggle("hidden", rate !== 100);
  updateTodaySummary();
}

function updateTodaySummary() {
  const rate = getRateForDate(new Date());
  document.getElementById("today-rate").textContent = `${rate ?? 0}%`;
}

function openFeaturedVideo() {
  const menu = menus[state.body];
  if (menu.featuredVideoId) {
    openVideo(`${state.body} 15分メニュー`, menu.featuredVideoId);
  } else {
    openJapaneseVideoSearch(menu.featuredQuery || `${state.body} トレーニング 日本語`);
  }
}

function openVideo(title, id) {
  document.getElementById("video-title").textContent = title;
  document.getElementById("video-frame").src =
    `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else window.open(`https://www.youtube.com/watch?v=${id}`, "_blank", "noopener");
}

function closeVideo() {
  document.getElementById("video-frame").src = "";
  if (dialog.open) dialog.close();
}

function openJapaneseVideoSearch(query) {
  const q = `${query} 日本人 日本語 -英語`;
  window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, "_blank", "noopener");
}

function openImageSearch(query) {
  const q = `${query} 日本語 フォーム`;
  window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`, "_blank", "noopener");
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
  const body = data._body;
  if (!body || !menus[body]) return null;
  const total = menus[body].tasks.length;
  const completed = menus[body].tasks.reduce(
    (sum, _, index) => sum + (data[`${body}-${index}`] === true ? 1 : 0), 0
  );
  return Math.round((completed / total) * 100);
}

function renderCalendar() {
  const y = state.calendarDate.getFullYear();
  const m = state.calendarDate.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const lastDate = new Date(y, m + 1, 0).getDate();
  const today = new Date();
  const grid = document.getElementById("calendar-grid");

  document.getElementById("calendar-title").textContent = `${y}年 ${m + 1}月`;
  grid.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    grid.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const date = new Date(y, m, day);
    const rate = getRateForDate(date);
    const cell = document.createElement("div");
    cell.className = "calendar-day";

    if (y === today.getFullYear() && m === today.getMonth() && day === today.getDate()) {
      cell.classList.add("today");
    }

    if (rate !== null) {
      if (rate === 100) cell.classList.add("rate-full");
      else if (rate >= 50) cell.classList.add("rate-medium");
      else if (rate > 0) cell.classList.add("rate-light");
    }

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = day;

    const rateText = document.createElement("span");
    rateText.className = "day-rate";
    rateText.textContent = rate === null ? "" : `${rate}%`;

    cell.append(number, rateText);
    grid.appendChild(cell);
  }
}

updateTodaySummary();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js"));
}
