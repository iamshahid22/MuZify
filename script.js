// ===============================
// SHAHID MUSIC PLAYER
// ===============================

const audioPlayer = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");

const songTitle = document.getElementById("songTitle");
const artistName = document.getElementById("artistName");
const cover = document.getElementById("cover");

// ===============================
// SONG DATABASE
// ===============================

const songs = [
{
title: "Adiye",
artist: "GV Prakash",
src: "Songs/song1.mp3",
cover: "Images/TopHits2026.jpg"
},
{
title: "Nee Paata Madhuram",
artist: "SP Balasubrahmanyam",
src: "Songs/song2.mp3",
cover: "Images/ChillVibes.jpg"
},
{
title: "Cheli Kasiresthunna",
artist: "Telugu Melody",
src: "Songs/song3.mp3",
cover: "Images/codingnights.jpg"
},
{
title: "Gehra Hua",
artist: "Romantic Hits",
src: "Songs/song4.mp3",
cover: "Images/GymBeast.jpg"
}
];

// ===============================
// VARIABLES
// ===============================

let currentSong = 0;
let isPlaying = false;

// ===============================
// LOAD SONG
// ===============================

function loadSong(index){

songTitle.textContent = songs[index].title;

artistName.textContent = songs[index].artist;

cover.src = songs[index].cover;

audioPlayer.src = songs[index].src;

localStorage.setItem(
"lastPlayed",
JSON.stringify(songs[index])
);

}

// ===============================
// PLAY SONG
// ===============================

function playSong(){

const playPromise = audioPlayer.play();

if(playPromise){

playPromise.catch(() => {

isPlaying = false;

playBtn.innerHTML =
'<i class="fa-solid fa-play"></i>';

console.warn(
"Audio file is missing or blocked. Add matching MP3 files inside the Songs folder."
);

});

}

isPlaying = true;

playBtn.innerHTML =
'<i class="fa-solid fa-pause"></i>';

}

// ===============================
// PAUSE SONG
// ===============================

function pauseSong(){

audioPlayer.pause();

isPlaying = false;

playBtn.innerHTML =
'<i class="fa-solid fa-play"></i>';

}

// ===============================
// TOGGLE PLAY
// ===============================

playBtn.addEventListener("click", () => {

if(isPlaying){

pauseSong();

}else{

playSong();

}

});

// ===============================
// NEXT SONG
// ===============================

function nextSong(){

currentSong++;

if(currentSong >= songs.length){

currentSong = 0;

}

loadSong(currentSong);

playSong();

}

// ===============================
// PREVIOUS SONG
// ===============================

function prevSong(){

currentSong--;

if(currentSong < 0){

currentSong = songs.length - 1;

}

loadSong(currentSong);

playSong();

}

// ===============================
// BUTTONS
// ===============================

const buttons =
document.querySelectorAll(".controls button");

if(buttons[1]){

buttons[1].addEventListener(
"click",
prevSong
);

}

if(buttons[3]){

buttons[3].addEventListener(
"click",
nextSong
);

}

// ===============================
// PROGRESS BAR
// ===============================

audioPlayer.addEventListener(
"timeupdate",
() => {

if(!Number.isFinite(audioPlayer.duration)){

progress.value = 0;

return;

}

const progressPercent =
(audioPlayer.currentTime /
audioPlayer.duration) * 100;

progress.value = progressPercent || 0;

}
);

// ===============================
// SEEK
// ===============================

progress.addEventListener(
"input",
() => {

if(!Number.isFinite(audioPlayer.duration)){

progress.value = 0;

return;

}

audioPlayer.currentTime =
(progress.value / 100) *
audioPlayer.duration;

}
);

// ===============================
// VOLUME
// ===============================

const volumeSlider =
document.querySelector(
".right-player input"
);

if(volumeSlider){

volumeSlider.addEventListener(
"input",
() => {

audioPlayer.volume =
volumeSlider.value / 100;

}
);

}

// ===============================
// FAVORITES
// ===============================

let favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];

function addToFavorites(){

const song = songs[currentSong];

const exists =
favorites.find(
item => item.title === song.title
);

if(!exists){

favorites.push(song);

localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);

alert(
song.title +
" added to favorites"
);

}

}

// ===============================
// KEYBOARD SHORTCUTS
// ===============================

document.addEventListener(
"keydown",
(e)=>{

if(e.code==="Space"){

e.preventDefault();

if(isPlaying){

pauseSong();

}else{

playSong();

}

}

if(e.code==="ArrowRight"){

nextSong();

}

if(e.code==="ArrowLeft"){

prevSong();

}

}
);

// ===============================
// SONG CARD CLICK
// ===============================

const cards =
document.querySelectorAll(
".song-card"
);

cards.forEach(
(card,index)=>{

card.addEventListener(
"click",
()=>{

currentSong=index;

loadSong(currentSong);

playSong();

}
);

}
);

// ===============================
// RECENTLY PLAYED
// ===============================

function saveHistory(song){

let history =
JSON.parse(
localStorage.getItem(
"history"
)
) || [];

history.unshift(song);

history =
history.slice(0,20);

localStorage.setItem(
"history",
JSON.stringify(history)
);

}

audioPlayer.addEventListener(
"play",
()=>{

saveHistory(
songs[currentSong]
);

}
);

// ===============================
// SHUFFLE
// ===============================

let shuffleMode = false;

if(buttons[0]){

buttons[0].addEventListener(
"click",
()=>{

shuffleMode =
!shuffleMode;

buttons[0].style.color =
shuffleMode
? "#7c3aed"
: "white";

}
);

}

function nextSongShuffle(){

if(shuffleMode){

currentSong =
Math.floor(
Math.random() *
songs.length
);

}else{

currentSong++;

if(
currentSong >=
songs.length
){

currentSong = 0;

}

}

loadSong(currentSong);

playSong();

}

// ===============================
// REPEAT
// ===============================

let repeatMode = false;

if(buttons[4]){

buttons[4].addEventListener(
"click",
()=>{

repeatMode =
!repeatMode;

buttons[4].style.color =
repeatMode
? "#7c3aed"
: "white";

}
);

}

audioPlayer.addEventListener(
"ended",
()=>{

if(repeatMode){

playSong();

}else{

nextSongShuffle();

}

}
);

// ===============================
// START
// ===============================

loadSong(currentSong);

audioPlayer.volume = 0.8;

console.log(
"Shahid Music Loaded Successfully"
);
