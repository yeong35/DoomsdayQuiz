let score = 0;
let totalTime = 60;
let timeLeft = 60;
let currentDate = null;
let currentAnswer = null;
let timerId = null;
let isPlaying = false;

const question = document.querySelector("#question");
const feedback = document.querySelector("#feedback");
const scoreText = document.querySelector("#score");
const anchorDay = document.querySelector("#anchorday");
const buttons = document.querySelectorAll(".day-btn");
const startBtn = document.querySelector("#startBtn");
const timerBar = document.querySelector("#timer-bar");

const startScreen = document.querySelector("#start-screen");
const mainboard = document.querySelector("#mainboard");

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

function getRandomDate() {
    const year = Math.floor(Math.random() * 5) + 2026;
    const month = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;

    return new Date(year, month, day);
}

function showQuestion() {
    currentDate = getRandomDate();
    currentAnswer = currentDate.getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    question.textContent = `${year}년 ${month}월 ${day}일`;
    feedback.textContent = "";

    const doomsday = getDoomsday(year);
    anchorDay.textContent = `${year}년의 앵커요일은 ${dayNames[doomsday]}요일`;
}

function getDoomsday(year) {
    const century = Math.floor(year / 100);
    const y = year % 100;

    const centuryAnchor = (5 * (century % 4) + 2) % 7;

    const a = Math.floor(y / 12);
    const b = y % 12;
    const c = Math.floor(b / 4);

    return (a + b + c + centuryAnchor) % 7;
}

function checkAnswer(userAnswer) {
    if (!isPlaying) return;

    isPlaying = false;

    if (userAnswer === currentAnswer) {
        score++;
        feedback.textContent = "정답! 너 정말 대단해";
        question.style.color = "#4caf50";
    } else {
        feedback.textContent = `오답! 정답은 ${dayNames[currentAnswer]}요일이지롱`;
        question.style.color = "#ff4d4d";
    }
    scoreText.textContent = score;

    setTimeout(() => {
        if (timeLeft >= 0) {
            question.style.color = "black";
            showQuestion();
            isPlaying = true;

        }
    }, 700);
}

function startGame() {
    score = 0;
    timeLeft = totalTime;
    isPlaying = true;

    // timer init
    timerBar.classList.remove("danger");
    timerBar.classList.remove("shake");
    timerBar.style.height = "100%";

    scoreText.textContent = score;
    feedback.textContent = "";
    startBtn.textContent = "START";

    startScreen.style.display = "none";
    mainboard.style.display = "flex";

    showQuestion();

    clearInterval(timerId);

    timerId = setInterval(() => {
        timeLeft -= 0.1;

        const percent = Math.max((timeLeft / totalTime) * 100, 0);
        timerBar.style.height = percent + "%";

        // change the bar color to red
        if (timeLeft <= 10) {
            timerBar.classList.add("danger");
            timerBar.classList.add("shake");
        }

        if (timeLeft <= 0) {
            endGame();
        }
    }, 100);
}

function endGame() {
    clearInterval(timerId);
    isPlaying = false;

    question.style.color = 'black';
    question.textContent = "끝!";
    feedback.textContent = `최종 점수: ${score}개`;

    startBtn.textContent = "다시 시작";
    startScreen.style.display = "flex";
}

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const userAnswer = Number(button.dataset.day);
        checkAnswer(userAnswer);
    });
});

startBtn.addEventListener("click", startGame);