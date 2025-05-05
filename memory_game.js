let isGameActive = true;
let isSequenceActive = false;
let level = 1;
const maxLevel = 4;
let sequence = [];
let userInput = [];

const images = [
	"https://i.pinimg.com/736x/44/d1/c6/44d1c6a9fd049729a4892a3f64de5efc.jpg",
	"https://i.pinimg.com/736x/ba/07/01/ba0701b2cf97c112b52ca74a4659321e.jpg",
	"https://i.pinimg.com/736x/c6/87/69/c68769bbbc8974279a3f8f3a34044505.jpg",
	"https://i.pinimg.com/736x/8e/86/77/8e8677f4219ec0819bae84096782ca1c.jpg",
	"https://i.pinimg.com/736x/5d/0c/75/5d0c759fba5552911a27224829bf1715.jpg",
	"https://i.pinimg.com/736x/35/a3/ee/35a3eeec908ef2594336d2157739bf48.jpg",
	"https://i.pinimg.com/736x/6f/58/84/6f58840c04f950435984d75eb03a197c.jpg",
	"https://i.pinimg.com/736x/31/6d/a9/316da90c00367290ff663a70f15bd55e.jpg"
];

const startButton = document.getElementById("startButton");
const imageBox = document.getElementById("imageBox");
const resultDisplay = document.getElementById("resultDisplay");
const buttonPanel = document.getElementById("buttonPanel");
const sequenceDisplay = document.getElementById("sequenceDisplay");
const levelDisplay = document.getElementById("levelDisplay");

startButton.onclick = startLevel;

function startLevel() {
    if (!isGameActive) return;

    isSequenceActive = true;

    startButton.style.display = "none";
    imageBox.classList.remove("hidden");
    resultDisplay.textContent = "";
    buttonPanel.innerHTML = "";
    sequenceDisplay.innerHTML = "";
    levelDisplay.textContent = level;
    userInput = [];

    const shuffledImages = images.sort(() => 0.5 - Math.random());
    sequence = shuffledImages.slice(0, level);

    showSequence(sequence, 0);
}

function showSequence(seq, index) {
    if (index >= seq.length) {
        setTimeout(() => {
            imageBox.classList.add("hidden");
            sequenceDisplay.textContent = "Ընտրիր պատկերները ճիշտ հերթականությամբ։";
            isSequenceActive = false;
            renderButtons();
        }, 500);
        return;
    }

    const img = document.createElement("img");
    img.src = seq[index];
    img.style.opacity = "0";
    img.style.transition = "opacity 0.4s ease";
    sequenceDisplay.innerHTML = "";
    sequenceDisplay.appendChild(img);

    setTimeout(() => {
        img.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        img.style.opacity = "0";
        setTimeout(() => {
            showSequence(seq, index + 1);
        }, 400);
    }, 1500);
}

function renderButtons() {
    if (!isGameActive || isSequenceActive) return;

    const options = [...sequence];

    while (options.length < 6) {
        const rand = images[Math.floor(Math.random() * images.length)];
        if (!options.includes(rand)) options.push(rand);
    }

    const shuffled = options.sort(() => 0.5 - Math.random());

    shuffled.forEach((imgUrl) => {
        const btn = document.createElement("button");
        btn.className = "image-button";
        btn.style.backgroundImage = `url('${imgUrl}')`;
        btn.disabled = false;

        btn.onclick = () => {
            if (!isGameActive || btn.disabled) return;

            if (btn.classList.contains("selected")) {
                btn.classList.remove("selected");
                const index = userInput.indexOf(imgUrl);
                if (index > -1) userInput.splice(index, 1);
            } else {
                btn.classList.add("selected");
                userInput.push(imgUrl);
            }

            if (userInput.length === sequence.length) {
                checkResult();
            }
        };

        buttonPanel.appendChild(btn);
    });
}

function checkResult() {
    if (!isGameActive) return;

    const correct = sequence.every((val, index) => val === userInput[index]);

    if (correct) {
        resultDisplay.textContent = "✔️ Ճիշտ է։ Հաջորդ փուլ։";
        level++;
        if (level > maxLevel) {
            resultDisplay.textContent = "🏆 Շնորհավորում ենք, ավարտեցիր խաղը։";
            setTimeout(() => {
                resetGame();
            }, 2000);
        } else {
            setTimeout(startLevel, 2000);
        }
    } else {
        resultDisplay.textContent = "❌ Սխալ։ Խաղը սկսվում է սկզբից։";
        level = 1;
        setTimeout(() => {
            resetGame();
        }, 2000);
    }
}

function resetGame() {
    if (!isGameActive) return;

    isGameActive = false;
    level = 1;
    sequence = [];
    userInput = [];

    sequenceDisplay.innerHTML = "";
    buttonPanel.innerHTML = "";
    levelDisplay.textContent = "1";
    resultDisplay.textContent = "";
    startButton.style.display = "inline-block";
    startButton.disabled = false;

    setTimeout(() => {
        isGameActive = true;
    }, 2000);
}
