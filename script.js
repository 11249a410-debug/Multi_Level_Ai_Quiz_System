function finish(){
let t=Math.floor((Date.now()-startTime)/1000);

let key="L"+level;
let data=JSON.parse(localStorage.getItem(key))||[];

/* ADD NEW PLAYER */
data.push({
    name:player,
    score:score,
    time:t
});

/* SORT: Highest score first, then least time */
data.sort((a,b)=> b.score-a.score || a.time-b.time);

/* ❌ REMOVE LIMIT (IMPORTANT CHANGE) */
// data = data.slice(0,25);   <-- DELETE THIS LINE

/* SAVE ALL PLAYERS */
localStorage.setItem(key,JSON.stringify(data));

hideAll();
document.getElementById("result").style.display="block";
document.getElementById("res").innerText=`Score: ${score} | Time: ${t}s`;
}
