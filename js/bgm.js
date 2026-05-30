// BGM库
const BGM_LIST = [
    "bgm/bgm1.mp3",
    "bgm/bgm2.mp3",
    "bgm/bgm3.mp3",
    "bgm/bgm4.mp3",
    "bgm/bgm5.mp3",
    "bgm/bgm6.mp3",
];

const bgmPlayer = new Audio();

let bgmEnabled = true;

let currentIndex = -1;

// 随机播放下一首
function playRandomBGM() {

    let choices = [];

    // 排除当前曲目
    for (let i = 0; i < BGM_LIST.length; i++) {
        if (i !== currentIndex) {
            choices.push(i);
        }
    }

    // 等概率随机
    const nextIndex =
        choices[
            Math.floor(Math.random() * choices.length)
            ];

    currentIndex = nextIndex;

    bgmPlayer.src = BGM_LIST[currentIndex];
    bgmPlayer.play();
}

// 一首结束后自动切歌
bgmPlayer.addEventListener(
    "ended",
    playRandomBGM
);



function toggleBGM() {
    bgmEnabled = !bgmEnabled;
    const btn = document.getElementById("bgmToggleBtn");
    if (bgmEnabled) {
        if (!bgmPlayer.src) {
            playRandomBGM();
        } else {
            bgmPlayer.play();
        }
        btn.innerText = "🔊 BGM: ON";
    } else {
        bgmPlayer.pause();
        btn.innerText = "🔇 BGM: OFF";
    }
}



function updateBGM() {

    if (!bgmEnabled) {
        bgmPlayer.pause();
        return;
    }

    if (currentScene === "gameplay") {

        if (
            bgmPlayer.paused &&
            !bgmPlayer.src
        ) {
            playRandomBGM();
        }
        else if (bgmPlayer.paused) {
            bgmPlayer.play();
        }

    } else {

        bgmPlayer.pause();
    }
}



document
    .getElementById("bgmToggleBtn")
    .addEventListener(
        "click",
        toggleBGM
    );