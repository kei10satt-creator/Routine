const dailyVideos=[
{title:"全身の自重筋トレ",description:"初心者向け。器具なしで全身を動かす日です。",duration:"約10分",videoId:"6uQq4U2mDSQ"},
{title:"首・肩を軽くするストレッチ",description:"デスクワークで固まりやすい首と肩をほぐします。",duration:"約10分",videoId:"TbpzWIfeU0k"},
{title:"体幹プランクトレーニング",description:"腹部と体幹を中心に、自重でしっかり刺激します。",duration:"約8分",videoId:"EPiPNL8Azfs"},
{title:"股関節ストレッチ",description:"股関節まわりをやさしく動かして整えます。",duration:"約10分",videoId:"SMOGOm-x5qI"},
{title:"飛ばない全身有酸素運動",description:"マンションでも取り組みやすい全身運動です。",duration:"約19分",videoId:"9UX7XUBMJnc"},
{title:"全身を鍛える自重トレーニング",description:"胸・腕・体幹・脚まで、器具なしで動かします。",duration:"約10分",videoId:"6CQ0rmeArg8"},
{title:"寝る前のリラックスヨガ",description:"一週間の疲れをほぐす、やさしい回復日です。",duration:"約15分",videoId:"MAstgS8OwKM"}];

const menus={
"骨盤":{query:"骨盤 リセット ストレッチ 理学療法士 日本語",tasks:[["骨盤の前後傾","3分"],["ヒップリフト","4分"],["クラムシェル","左右4分"],["骨盤まわりストレッチ","4分"]]},
"首":{query:"首 ストレッチ 理学療法士 日本語",tasks:[["首の前後運動","3分"],["首の側屈ストレッチ","左右4分"],["肩甲骨寄せ","4分"],["胸開きストレッチ","4分"]]},
"肩":{query:"肩こり ストレッチ 理学療法士 日本語",videoId:"TbpzWIfeU0k",tasks:[["肩回し","3分"],["肩甲骨の前後運動","4分"],["胸・肩ストレッチ","4分"],["背中ほぐし","4分"]]},
"腰":{query:"腰 ストレッチ 理学療法士 日本語",tasks:[["骨盤ゆらし","3分"],["膝抱えストレッチ","4分"],["膝倒し","4分"],["股関節ストレッチ","4分"]]},
"体幹":{query:"体幹トレーニング 日本語 自重",videoId:"EPiPNL8Azfs",tasks:[["ドローイン","3分"],["バードドッグ","4分"],["初心者プランク","4分"],["体幹ストレッチ","4分"]]},
"自重全身":{query:"全身 自重トレーニング 初心者 日本語",videoId:"6uQq4U2mDSQ",tasks:[["スクワット","3分"],["膝つき腕立て","3分"],["ヒップリフト","3分"],["バードドッグ","3分"],["プランク","3分"]]}};

const state={body:"骨盤",purpose:"姿勢改善",calendarDate:new Date()};
const dialog=document.getElementById("video-dialog");
const dateKey=(date=new Date())=>`routine-${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
const getData=(date=new Date())=>{try{return JSON.parse(localStorage.getItem(dateKey(date))||"{}")}catch{return{}}};
const saveData=data=>localStorage.setItem(dateKey(),JSON.stringify(data));
const todayVideo=()=>dailyVideos[new Date().getDay()];
const hideAll=()=>document.querySelectorAll(".screen").forEach(x=>x.classList.add("hidden"));

function openVideo(title,id){
 document.getElementById("video-title").textContent=title;
 document.getElementById("video-frame").src=`https://www.youtube-nocookie.com/embed/${id}?rel=0`;
 if(typeof dialog.showModal==="function") dialog.showModal(); else window.open(`https://www.youtube.com/watch?v=${id}`,"_blank");
}
function closeVideo(){document.getElementById("video-frame").src="";if(dialog.open)dialog.close()}
function renderHome(){
 hideAll();document.getElementById("home-screen").classList.remove("hidden");
 const v=todayVideo(),d=getData(),done=d._dailyComplete===true,now=new Date(),w=["日","月","火","水","木","金","土"];
 document.getElementById("today-label").textContent=`${now.getMonth()+1}月${now.getDate()}日（${w[now.getDay()]}）`;
 document.getElementById("daily-title").textContent=v.title;
 document.getElementById("daily-description").textContent=v.description;
 document.getElementById("daily-duration").textContent=v.duration;
 const cb=document.getElementById("daily-complete-checkbox");cb.checked=done;
 document.getElementById("daily-complete-label").classList.toggle("completed",done);
 document.getElementById("daily-message").classList.toggle("hidden",!done);
 updateTodayRate();
}
function getRate(date){
 const d=getData(date);if(d._dailyComplete===true)return 100;
 const b=d._body;if(!b||!menus[b])return null;
 const total=menus[b].tasks.length;
 const done=menus[b].tasks.reduce((s,_,i)=>s+(d[`${b}-${i}`]===true?1:0),0);
 return Math.round(done/total*100);
}
function updateTodayRate(){document.getElementById("today-rate").textContent=`${getRate(new Date())??0}%`}

document.getElementById("daily-video-button").onclick=()=>{const v=todayVideo();openVideo(v.title,v.videoId)};
document.getElementById("daily-complete-checkbox").onchange=e=>{const d=getData();d._dailyComplete=e.target.checked;d._dailyTitle=todayVideo().title;saveData(d);renderHome()};
document.getElementById("choose-menu-button").onclick=()=>{hideAll();document.getElementById("choose-screen").classList.remove("hidden")};
document.getElementById("choose-back-button").onclick=renderHome;
document.querySelectorAll(".option-button").forEach(btn=>btn.onclick=()=>{const g=btn.dataset.group;document.querySelectorAll(`[data-group="${g}"]`).forEach(x=>x.classList.remove("selected"));btn.classList.add("selected");state[g]=btn.dataset.value});
document.getElementById("start-button").onclick=openRoutine;
document.getElementById("back-button").onclick=()=>{hideAll();document.getElementById("choose-screen").classList.remove("hidden")};
document.getElementById("calendar-button").onclick=showCalendar;
document.getElementById("calendar-back-button").onclick=renderHome;
document.getElementById("prev-month").onclick=()=>changeMonth(-1);
document.getElementById("next-month").onclick=()=>changeMonth(1);
document.getElementById("close-video").onclick=closeVideo;
dialog.onclick=e=>{if(e.target===dialog)closeVideo()};

function openRoutine(){
 hideAll();document.getElementById("routine-screen").classList.remove("hidden");
 document.getElementById("routine-label").textContent=`${state.body}・${state.purpose}`;
 renderTasks();
}
function renderTasks(){
 const list=document.getElementById("task-list"),d=getData(),menu=menus[state.body];list.innerHTML="";
 menu.tasks.forEach(([name,time],i)=>{
  const card=document.createElement("div");card.className="task-card";
  const label=document.createElement("label");label.className="task-main";
  const cb=document.createElement("input");cb.type="checkbox";cb.checked=d[`${state.body}-${i}`]===true;
  const text=document.createElement("span");text.className="task-text";text.innerHTML=`<span class="task-name">${name}</span><span class="task-time">${time}</span>`;
  label.append(cb,text);if(cb.checked)card.classList.add("checked");
  cb.onchange=()=>{const x=getData();x[`${state.body}-${i}`]=cb.checked;x._body=state.body;x._purpose=state.purpose;saveData(x);card.classList.toggle("checked",cb.checked);updateProgress()};
  const media=document.createElement("div");media.className="media-buttons";
  const vb=document.createElement("button");vb.className="media-button";vb.textContent="▶ 日本語動画";vb.onclick=()=>window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(name+" 正しいやり方 日本語 日本人")}`,"_blank");
  const ib=document.createElement("button");ib.className="media-button";ib.textContent="フォーム画像";ib.onclick=()=>window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(name+" 正しいフォーム 日本語")}`,"_blank");
  media.append(vb,ib);card.append(label,media);list.append(card);
 });
 document.getElementById("routine-video-button").onclick=()=>menu.videoId?openVideo(`${state.body}メニュー`,menu.videoId):window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(menu.query)}`,"_blank");
 updateProgress();
}
function updateProgress(){
 const boxes=[...document.querySelectorAll("#task-list input")],done=boxes.filter(x=>x.checked).length,rate=boxes.length?Math.round(done/boxes.length*100):0;
 document.getElementById("progress-value").textContent=rate;document.getElementById("progress-bar").style.width=`${rate}%`;
 document.getElementById("complete-message").classList.toggle("hidden",rate!==100);updateTodayRate();
}
function showCalendar(){hideAll();document.getElementById("calendar-screen").classList.remove("hidden");renderCalendar()}
function changeMonth(n){state.calendarDate=new Date(state.calendarDate.getFullYear(),state.calendarDate.getMonth()+n,1);renderCalendar()}
function renderCalendar(){
 const y=state.calendarDate.getFullYear(),m=state.calendarDate.getMonth(),first=new Date(y,m,1).getDay(),last=new Date(y,m+1,0).getDate(),today=new Date(),grid=document.getElementById("calendar-grid");
 document.getElementById("calendar-title").textContent=`${y}年 ${m+1}月`;grid.innerHTML="";
 for(let i=0;i<first;i++){const e=document.createElement("div");e.className="calendar-day empty";grid.append(e)}
 for(let day=1;day<=last;day++){
  const date=new Date(y,m,day),rate=getRate(date),cell=document.createElement("div");cell.className="calendar-day";
  if(y===today.getFullYear()&&m===today.getMonth()&&day===today.getDate())cell.classList.add("today");
  if(rate===100)cell.classList.add("rate-full");else if(rate>=50)cell.classList.add("rate-medium");else if(rate>0)cell.classList.add("rate-light");
  cell.innerHTML=`<span class="day-number">${day}</span><span class="day-rate">${rate==null?"":rate+"%"}</span>`;grid.append(cell);
 }
}
renderHome();
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));
