
let currentSong = new Audio();

function sectomin(seconds){
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}




async function getSongs() {
    let a = await fetch("http://192.168.0.12:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic = (track) => {
    //let audio = new Audio("/songs/" + track);
    let formattedTrack = formatTrack(track);
    currentSong.src = "/songs/" + track
    currentSong.play();
    document.querySelector(".songinformation").innerHTML = formattedTrack;
    document.querySelector(".songtimeplay").innerHTML = currentSong.currentTime, currentSong.duration;

   
}

function playSecondSong() {

    var audioPlayer = document.getElementById("audioPlayer");
    
    // Change the source to the second song
    audioPlayer.src = "songs/ANIMAL_Pehle Bhi Main.mp3";
    
    // Play the second song
    audioPlayer.play();
}

const formatTrack = (track) => {
    let decodedTrack = decodeURIComponent(track);
    let formattedTrack = decodedTrack.replace(".mp3",'').replace("%20",'');
    return formattedTrack;
}

async function main() {


    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songList ul");
    for (const song of songs) {
        let songItem = document.createElement("li");
        songItem.innerHTML = `
            <div>${decodeURIComponent(song.replace(".mp3", ""))}</div>
            <img class="invert" src="playcircle.svg" alt="Play">
        `;
        songItem.addEventListener("click", () => {
            playMusic(song);
        });
        songUL.appendChild(songItem);
    }

    play.addEventListener("click" , () =>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    
    // listen for timeupdate
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtimeplay").innerHTML = `${sectomin(currentSong.currentTime)} / ${sectomin(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", ()=>{
        currentSong.pause();
        console.log("Next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    document.querySelector(".loginbtn").addEventListener("click", () => {
        window.location.href = 'login.html';
    });


    
}

main();
