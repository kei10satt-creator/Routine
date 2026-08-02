const menus = {
  "骨盤": [
    ["骨盤の前後傾", "3分"],
    ["ヒップリフト", "4分"],
    ["クラムシェル", "左右4分"],
    ["膝倒しストレッチ", "4分"]
  ],
  "肩・背中": [
    ["肩回し", "3分"],
    ["胸開き", "4分"],
    ["キャット＆カウ", "4分"],
    ["背中ストレッチ", "4分"]
  ],
  "股関節": [
    ["股関節回し", "3分"],
    ["ワイドスクワット", "4分"],
    ["ランジストレッチ", "左右4分"],
    ["お尻ストレッチ", "4分"]
  ],
  "全身": [
    ["その場足踏み", "3分"],
    ["スクワット", "4分"],
    ["プランク", "4分"],
    ["全身ストレッチ", "4分"]
  ]
};

const state = {
  body: "骨盤",
  purpose: "姿勢改善"
};

const todayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `routine-${year}-${month}-${day}`;
};

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
document.getElementById("back-button").addEventListener("click", () => {
  document.getElementById("routine-screen").classList.add("hidden");
  document.getElementById("home-screen").classList.remove("hidden");
});

function openRoutine() {
  document.getElementById("home-screen").classList.add("hidden");
  document.getElementById("routine-screen").classList.remove("hidden");
  document.getElementById("routine-label").textContent = `${state.body}・${state.purpose}`;
  document.getElementById("routine-title").textContent = "15分ルーティン";
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  const saved = JSON.parse(localStorage.getItem(todayKey()) || "{}");
  const selectedMenu = menus[state.body] || menus["骨盤"];

  selectedMenu.forEach(([name, time], index) => {
    const label = document.createElement("label");
    label.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(saved[`${state.body}-${index}`]);

    const taskName = document.createElement("span");
    taskName.className = "task-name";
    taskName.textContent = name;

    const taskTime = document.createElement("span");
    taskTime.className = "task-time";
    taskTime.textContent = time;

    if (checkbox.checked) {
      label.classList.add("checked");
    }

    checkbox.addEventListener("change", () => {
      const latest = JSON.parse(localStorage.getItem(todayKey()) || "{}");
      latest[`${state.body}-${index}`] = checkbox.checked;
      localStorage.setItem(todayKey(), JSON.stringify(latest));
      label.classList.toggle("checked", checkbox.checked);
      updateProgress();
    });

    label.append(checkbox, taskName, taskTime);
    taskList.appendChild(label);
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
