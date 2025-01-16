let currentIndex = 0;

async function fetchMonsters() {
    try {
        const response = await fetch("http://localhost:3000/monsters");
        const monsters = await response.json();

        const carousel = document.getElementById("carousel");

        monsters.forEach((monster, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.dataset.index = index;

            card.innerHTML = `
                <img src="${monster.image[0]}" alt="${monster.name[0]}">
                <h3>${monster.name[0]}</h3>
                <p>Type: ${monster.type[0]}</p>
                <p>Threat Level: ${monster.threat_level[0]}</p>
                <p>Weakness: ${monster.weakness[0]}</p>
                <p>Habitat: ${monster.habitat[0]}</p>
                <button onclick="playRoar('${monster.roar[0]}')">Play Roar</button>
            `;

            carousel.appendChild(card);
        });

        updateCarousel(monsters.length);
    } catch (error) {
        console.error("Error fetching monster data:", error);
    }
}

function updateCarousel(totalMonsters) {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {
        const offset = (index - currentIndex + totalMonsters) % totalMonsters;

        // Reset classes and visibility
        card.classList.remove("far-left", "left", "center", "right", "far-right");
        card.style.opacity = "0";
        card.style.transform = "translateX(0) scale(0.8)";

        // Apply classes and styles based on offset
        if (offset === 0) {
            card.classList.add("center");
            card.style.opacity = "1";
            card.style.transform = "translateX(0) scale(1.2)";
        } else if (offset === totalMonsters - 1) {
            card.classList.add("left");
            card.style.opacity = "0.8";
            card.style.transform = "translateX(-150px) scale(0.9)";
        } else if (offset === 1) {
            card.classList.add("right");
            card.style.opacity = "0.8";
            card.style.transform = "translateX(150px) scale(0.9)";
        } else if (offset === totalMonsters - 2) {
            card.classList.add("far-left");
            card.style.opacity = "0.5";
            card.style.transform = "translateX(-300px) scale(0.7)";
        } else if (offset === 2) {
            card.classList.add("far-right");
            card.style.opacity = "0.5";
            card.style.transform = "translateX(300px) scale(0.7)";
        }
    });
}

let audioElement = new Audio();
audioElement.src = 'path_to_roar_sound.mp3';

const volumeSlider = document.getElementById('volumeSlider');
audioElement.volume = volumeSlider.value;

volumeSlider.addEventListener('input', function() {
    audioElement.volume = volumeSlider.value;
});

function playRoar(roarPath) {
    audioElement.src = roarPath;
    audioElement.play();
}

document.getElementById("prev").addEventListener("click", () => {
    const totalMonsters = document.querySelectorAll(".card").length;
    currentIndex = (currentIndex - 1 + totalMonsters) % totalMonsters;
    updateCarousel(totalMonsters);
});

document.getElementById("next").addEventListener("click", () => {
    const totalMonsters = document.querySelectorAll(".card").length;
    currentIndex = (currentIndex + 1) % totalMonsters;
    updateCarousel(totalMonsters);
});

fetchMonsters();