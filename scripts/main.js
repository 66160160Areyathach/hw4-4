import { showResults, startQuiz } from "./quiz.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startQuiz").addEventListener("click", startQuiz);
    document.getElementById("submitQuiz").addEventListener("click", showResults);
}); 