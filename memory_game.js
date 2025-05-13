// Խաղի վիճակները պահող փոփոխականներ

let isGameActive = true;         // Հուշում է՝ խաղը ակտիվ  է թե ոչ
let isSequenceActive = false;    // Հուշում է՝ հերթականությունը ցուցադրվում է, թե ոչ
let level = 1;
const maxLevel = 4;
let sequence = [];               // Խաղի ընթացքում ցուցադրվող նկարների հաջորդականությունը
let userInput = [];              // Օգտագործողի մուտքագրած հերթականությունը


// Նկարների ցուցակ՝ URL-ներով, որոնք օգտագործվում են խաղում
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

// Ստանում ենք HTML էլեմենտները՝ ID-ներով
const startButton = document.getElementById("startButton");
const imageBox = document.getElementById("imageBox");
const resultDisplay = document.getElementById("resultDisplay");
const buttonPanel = document.getElementById("buttonPanel");
const sequenceDisplay = document.getElementById("sequenceDisplay");
const levelDisplay = document.getElementById("levelDisplay");

// Սեղմելով "Սկսել խաղը" կոճակը՝ սկսում ենք խաղը
startButton.onclick = startGame;

// Հիմնական ֆունկցիան՝ խաղի սկսման համար և փուլերի համար
function startGame() {
	if (!isGameActive) return;

	isSequenceActive = true;  // Խաղի հաջորդականությունը սկսվում է
	startButton.style.display = "none";  // Սկսելու կոճակը թաքցվում է
	imageBox.classList.remove("hidden");
	resultDisplay.textContent = "";  // Մաքրում ենք արդյունքների ցուցադրումը
	buttonPanel.innerHTML = "";  // Մաքրում ենք կոճակների շարքը
	sequenceDisplay.innerHTML = "";
	levelDisplay.textContent = level;
	userInput = [];

	// Խառնում ենք նկարները և վերցնում ենք այնքան, որքան տվյալ մակարդակում պետք է
	const shuffledImages = images.sort(() => 0.5 - Math.random());
	sequence = shuffledImages.slice(0, level);

	// Ցուցադրում ենք այդ հաջորդականությունը
	showSequence(sequence, 0);
}

// Ցուցադրում է հաջորդական նկարները մեկը մյուսի հետևից
function showSequence(seq, index) {
	if (index >= seq.length) {
		setTimeout(() => {
			imageBox.classList.add("hidden");
			sequenceDisplay.textContent = "";
			isSequenceActive = false;
			renderButtons();  // Ցուցադրում ենք ընտրության կոճակները
		}, 500);
		return;
	}

	// Ստեղծում ենք նոր <img> էլեմենտ՝ հաջորդական նկարը
	const img = document.createElement("img");
	img.src = seq[index];
	img.style.opacity = "0";  // Սկզբում նկարը թաքնված է
	img.style.transition = "opacity 0.4s ease";  // Սահուն անցում՝ opacity-ի համար

	sequenceDisplay.innerHTML = "";  // Մաքրում ենք նախորդ կոնտենտը
	sequenceDisplay.appendChild(img);  // Ավելացնում ենք նոր նկարը

	setTimeout(() => {
		img.style.opacity = "1";
	}, 100);

	setTimeout(() => {
		img.style.opacity = "0";
		setTimeout(() => {
			showSequence(seq, index + 1);  // Անցնում ենք հաջորդ նկարին
		}, 400);
	}, 1500);
}

// Ստեղնաշարի վրա նկարների կոճակների ցուցադրում
function renderButtons() {
	if (!isGameActive || isSequenceActive) return;

	const options = [...sequence];

	// Ավելացնում ենք պատահական ուրիշ նկարներ մինչև ընդհանուր լինեն 6
	while (options.length < 6) {
		const rand = images[Math.floor(Math.random() * images.length)];
		if (!options.includes(rand)) options.push(rand);
	}

	// Խառնում ենք բոլոր պատկերները պատահականորեն
	const shuffled = options.sort(() => 0.5 - Math.random());

	shuffled.forEach((imgUrl) => {
		const btn = document.createElement("button");
		btn.className = "image-button";  // Նշում ենք կոճակը որպես պատկերներով կոճակ
		btn.style.backgroundImage = `url('${imgUrl}')`;
		btn.disabled = false;  // Կոճակը ակտիվ չէ

		btn.onclick = ( ) => {
			if (!isGameActive || btn.disabled) return;

			if (btn.classList.contains("selected")) {
				// Եթե արդեն ընտրված էր՝ հանում ենք
				btn.classList.remove("selected");
				const index = userInput.indexOf(imgUrl);
				if (index > -1) userInput.splice(index, 1);
			} else {
				btn.classList.add("selected");
				userInput.push(imgUrl);
			}

			// Եթե օգտատերը ընտրել է այնքան, որքան պետք է՝ ստուգում ենք պատասխանը
			if (userInput.length === sequence.length) {
				checkResult();
			}
		};

		buttonPanel.appendChild(btn);  // Ավելացնում ենք կոճակը շարքին
	});
}

// Ստուգում է՝ օգտատերը ճիշտ է հիշել հաջորդականությունը, թե ոչ
function checkResult() {
	if (!isGameActive) return;

	const correct = sequence.every((val, index) => val === userInput[index]);  // Ստուգում ենք յուրաքանչյուր ընտրությունը՝ համընկնում է արդյոք հաջորդականությանը

	if (correct) {
		resultDisplay.textContent = "✔️ Ճիշտ է։ Հաջորդ փուլ։";
		if (correct) {
			resultDisplay.textContent = "✔️ Ճիշտ է։ Հաջորդ փուլ։";
			level++;
			if (level > maxLevel) {
				resultDisplay.textContent = "🏆 Շնորհավորում ենք, ավարտեցիր";
				setTimeout(() => {
					resetGame();
				}, 2000);
			} else {
				setTimeout(() => {
					startGame();
				}, 2000); // Հետաձգում ենք հաջորդ մակարդակը
			}
		}
	} else {
		resultDisplay.textContent = "❌ Սխալ։ Խաղը սկսվում է սկզբից։";
		level = 1;
		setTimeout(() => {
			resetGame();
		}, 2000);
	}
}

// Վերականգնում է խաղը սկզբնական վիճակին
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

	// 2 վայրկյան հետո նորից հնարավոր է սկսել խաղը
	setTimeout(() => {
		isGameActive = true;
	}, 2000);
}
