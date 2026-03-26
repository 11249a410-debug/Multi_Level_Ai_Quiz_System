function loadDashboard(){

    let data = JSON.parse(localStorage.getItem("GLOBAL")) || [];

    document.getElementById("totalPlayers").innerText = data.length;

    let top = data.slice(0,20);

    let html="";
    top.forEach((p,i)=>{
        html+=`
        <tr>
        <td>${i+1}</td>
        <td>${p.name}</td>
        <td>${p.score}</td>
        <td>${p.time}s</td>
        </tr>`;
    });

    document.getElementById("globalBoard").innerHTML = html;
}
let player="",level,index,score,startTime;
let questions=[],mistakes=[];

/* QUESTIONS (UNCHANGED) */
const quizData = {
1:[{q:"AI stands for?",o:["Artificial Intelligence","Auto","Advanced","Algo"],a:"Artificial Intelligence"}],
2:[{q:"Data science used for?",o:["Analysis","Gaming","Cooking","Art"],a:"Analysis"}],
3:[{q:"Integration reverse of?",o:["Differentiation","Add","Div","Mul"],a:"Differentiation"}],
};

/* START */
function start(){
player=document.getElementById("name").value;
if(!player){alert("Enter name");return;}
document.getElementById("start").style.display="none";
showLevels();
}

/* LEVELS */
function showLevels(){
let d=document.getElementById("levels");
d.style.display="block";
d.innerHTML="<h2>Select Level</h2>";
hideAll();

for(let i=1;i<=3;i++){
d.innerHTML+=`<button onclick="startLevel(${i})">Level ${i}</button>
<button onclick="leader(${i})">🏆</button><br>`;
}
}

/* HIDE */
function hideAll(){
["quiz","result","review","leader","dashboard"].forEach(x=>{
document.getElementById(x).style.display="none";
});
}

/* START LEVEL */
function startLevel(l){
level=l;
questions=quizData[l];
index=0;
score=0;
mistakes=[];
startTime=Date.now();

hideAll();
document.getElementById("levels").style.display="none";
document.getElementById("quiz").style.display="block";

loadQ();
}

/* LOAD QUESTION */
function loadQ(){
let q=questions[index];
document.getElementById("q").innerText=q.q;

let html="";
q.o.forEach(o=>{
html+=`<div class="option" onclick="check('${o}')">${o}</div>`;
});
document.getElementById("opts").innerHTML=html;

document.getElementById("bar").style.width=(index/questions.length*100)+"%";
}

/* CHECK */
function check(ans){
let correct=questions[index].a;
let opts=document.querySelectorAll(".option");

opts.forEach(opt=>{
if(opt.innerText===correct) opt.classList.add("correct");
if(opt.innerText===ans && ans!==correct) opt.classList.add("wrong");
opt.style.pointerEvents="none";
});

if(ans===correct) score++;
else mistakes.push({q:questions[index].q,a:ans,c:correct});

setTimeout(()=>{
index++;
if(index<questions.length) loadQ();
else finish();
},800);
}

/* FINISH */
function finish(){
let t=Math.floor((Date.now()-startTime)/1000);

/* LEVEL STORAGE */
let key="L"+level;
let data=JSON.parse(localStorage.getItem(key))||[];

data.push({name:player,score:score,time:t});
data.sort((a,b)=> b.score-a.score || a.time-b.time);
data=data.slice(0,25);

localStorage.setItem(key,JSON.stringify(data));

/* GLOBAL */
let global = JSON.parse(localStorage.getItem("GLOBAL")) || [];
global.push({name:player,score:score,time:t});
global.sort((a,b)=> b.score-a.score || a.time-b.time);
localStorage.setItem("GLOBAL", JSON.stringify(global));

/* UPDATE DASHBOARD */
loadDashboard();

hideAll();
document.getElementById("result").style.display="block";
document.getElementById("res").innerText=`Score: ${score} | Time: ${t}s`;
}

/* GLOBAL SAVE */
function saveGlobal(player, score, time){
let data = JSON.parse(localStorage.getItem("GLOBAL")) || [];

data.push({name:player, score:score, time:time});
data.sort((a,b)=> b.score-a.score || a.time-b.time);

localStorage.setItem("GLOBAL", JSON.stringify(data));
}

/* LEADERBOARD */
function leader(l){
hideAll();
document.getElementById("leader").style.display="block";

let table=document.getElementById("table");
table.innerHTML="<tr><th>Name</th><th>Score</th><th>Time</th></tr>";

let data=JSON.parse(localStorage.getItem("L"+l))||[];

data.forEach(p=>{
table.innerHTML+=`<tr>
<td>${p.name}</td>
<td>${p.score}</td>
<td>${p.time}s</td>
</tr>`;
});
}

/* DASHBOARD */
function openDashboard(){
hideAll();
document.getElementById("dashboard").style.display="block";

let data = JSON.parse(localStorage.getItem("GLOBAL")) || [];

document.getElementById("totalPlayers").innerText = data.length;

let top = data.slice(0,20);

let html="";
top.forEach((p,i)=>{
html+=`<tr>
<td>${i+1}</td>
<td>${p.name}</td>
<td>${p.score}</td>
<td>${p.time}s</td>
</tr>`;
});

document.getElementById("globalBoard").innerHTML = html;
}

/* REVIEW */
function review(){
hideAll();
document.getElementById("review").style.display="block";

let div=document.getElementById("rev");

if(mistakes.length===0){
div.innerHTML="Perfect 🎉";
return;
}

let html="";
mistakes.forEach((m,i)=>{
html+=`<p><b>${i+1}. ${m.q}</b><br>
❌ ${m.a} | ✅ ${m.c}</p>`;
});

div.innerHTML=html;
}

/* THEME */
function toggleTheme(){
document.body.classList.toggle("light");
}
