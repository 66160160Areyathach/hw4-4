import { questions } from "./questions.js";
import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";

let timerInterval;

export function startQuiz() {
    const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 5);
    saveToLocalStorage("currentQuiz", selectedQuestions);
    saveToLocalStorage("score", 0);
    saveToLocalStorage("timeLeft", 60);
    
    document.getElementById("quizContainer").classList.remove("hidden");
    document.getElementById("result").classList.add("hidden");
    document.getElementById("startQuiz").classList.add("hidden"); // ซ่อนปุ่มเริ่มทำข้อสอบ

    renderQuiz(selectedQuestions);
    startTimer();
}


export function renderQuiz(questions) {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = "";

    questions.forEach(q => {
        let choicesHtml = q.choices.map(choice => `
            <button class="choice-btn" data-qid="${q.id}" data-answer="${choice}">${choice}</button>
        `).join(" ");

        quizContainer.innerHTML += `<div><p>${q.text}</p>${choicesHtml}</div>`;
    });

    // ✨ เพิ่ม Event Listener ให้ปุ่มทุกปุ่มที่ถูกสร้าง
    document.querySelectorAll(".choice-btn").forEach(button => {
        button.addEventListener("click", function() {
            submitAnswer(this.dataset.qid, this.dataset.answer);
            this.classList.add("selected"); // ไฮไลต์คำตอบที่เลือก
        });
    });
}


export function submitAnswer(questionId, answer) {
    let questions = loadFromLocalStorage("currentQuiz");
    let question = questions.find(q => q.id == questionId);
    let score = loadFromLocalStorage("score");

    if (!question) return; // ถ้าไม่มีคำถามที่ตรงกับ ID ให้ออก

    if (question.correct === answer) {
        score += 20;
    }

    saveToLocalStorage("score", score);
}

// ⏳ ฟังก์ชันจับเวลา
export function startTimer() {
    let timeLeft = loadFromLocalStorage("timeLeft");
    const timerElement = document.getElementById("timer");

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showResults();
        } else {
            timeLeft--;
            timerElement.textContent = `เวลาที่เหลือ: ${timeLeft} วินาที`;
            saveToLocalStorage("timeLeft", timeLeft);
        }
    }, 1000);
}

// 📊 แสดงผลลัพธ์
export function showResults() {
    clearInterval(timerInterval);

    const score = loadFromLocalStorage("score");
    const passingScore = 60;
    const resultContainer = document.getElementById("result");
    
    resultContainer.innerHTML = `
        <h2>คะแนนของคุณ: ${score}</h2>
        <p>${score >= passingScore ? "🎉 ผ่านข้อสอบ!" : "❌ ไม่ผ่านข้อสอบ"}</p>
        <button onclick="startQuiz()">เริ่มทำข้อสอบใหม่</button>
    `;

    document.getElementById("quizContainer").classList.add("hidden");
    resultContainer.classList.remove("hidden");
} 