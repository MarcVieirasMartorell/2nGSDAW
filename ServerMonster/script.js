let currentIndex = 0;
let allMonsters = []; // Almacena todos los monstruos para la búsqueda
let isBookMode = false; // Estado inicial: modo carrusel

// Fetch de los datos de monstruos desde el servidor
async function fetchMonsters() {
    try {
        const response = await fetch("http://localhost:3000/monsters");
        allMonsters = await response.json(); // Guardamos los monstruos en una variable global
        renderCarousel(allMonsters); // Renderizamos el carrusel inicial con todos los monstruos
    } catch (error) {
        console.error("Error fetching monster data:", error);
    }
}

// Renderiza el carrusel con los datos de los monstruos
function renderCarousel(monsters) {
    const carousel = document.getElementById("carousel");
    carousel.innerHTML = ""; // Limpiamos el carrusel antes de renderizar

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
}

// Actualiza la posición del carrusel según el índice actual
function updateCarousel(totalMonsters) {
    const cards = document.querySelectorAll(".card");

    if (isBookMode) {
        cards.forEach((card, index) => {
            card.style.opacity = "0"; 
            card.style.transform = "scale(0.8)"; 
    
            card.classList.remove("left-page", "right-page", "far-left", "left", "center", "right", "far-right");
    
            if (index === currentIndex) {
                card.classList.add("left-page");
                card.style.opacity = "1";
                card.style.transform = "translateX(-180px) scale(1)";
            } else if (index === currentIndex + 1 && index < totalMonsters) {
                card.classList.add("right-page");
                card.style.opacity = "1";
                card.style.transform = "translateX(180px) scale(1)";
            }
        });
    }
     else {
        // 🔹 MODO CARRUSEL: Vista normal con efecto de profundidad
        cards.forEach((card, index) => {
            const offset = (index - currentIndex + totalMonsters) % totalMonsters;

            card.classList.remove("far-left", "left", "center", "right", "far-right", "left-page", "right-page");
            card.style.opacity = "0";
            card.style.transform = "translateX(0) scale(0.8)";

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
}


// Filtra y muestra sugerencias basadas en el texto ingresado
function filterSuggestions() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
    const suggestions = document.getElementById("suggestions");

    suggestions.innerHTML = ""; // Limpia las sugerencias

    if (searchInput === "") {
        suggestions.classList.add("hidden");
        return;
    }

    const filteredMonsters = allMonsters.filter(monster =>
        monster.name[0].toLowerCase().includes(searchInput)
    );

    if (filteredMonsters.length > 0) {
        suggestions.classList.remove("hidden");
        filteredMonsters.forEach(monster => {
            const li = document.createElement("li");
            li.textContent = monster.name[0];
            li.addEventListener("click", () => {
                // Actualiza el input con el nombre del monstruo seleccionado
                document.getElementById("searchInput").value = monster.name[0];

                // Encuentra el índice en el array completo
                currentIndex = allMonsters.findIndex(m => m.name[0] === monster.name[0]);

                if (currentIndex !== -1) {
                    updateCarousel(allMonsters.length); // Actualiza el carrusel
                }

                // Oculta las sugerencias
                suggestions.classList.add("hidden");
            });
            suggestions.appendChild(li);
        });
    } else {
        suggestions.classList.add("hidden");
    }
}


// Búsqueda directa mediante botón
function searchMonsters() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const monsterIndex = allMonsters.findIndex(monster =>
        monster.name[0].toLowerCase().includes(searchInput)
    );

    if (monsterIndex !== -1) {
        currentIndex = monsterIndex;
        updateCarousel(allMonsters.length);
    } else {
        alert("Monster not found!");
    }
}

// Manejo del audio de los rugidos
let audioElement = new Audio();
//audioElement.src = 'path_to_roar_sound.mp3'; Deprecated

const volumeSlider = document.getElementById('volumeSlider');
audioElement.volume = volumeSlider.value;

volumeSlider.addEventListener('input', function() {
    audioElement.volume = volumeSlider.value;
});

function playRoar(roarPath) {
    audioElement.src = roarPath;
    audioElement.play();
}

// Eventos de los botones de navegación del carrusel
document.getElementById("searchInput").addEventListener("input", filterSuggestions);
document.getElementById("searchButton").addEventListener("click", searchMonsters);
document.getElementById("prev").addEventListener("click", () => {
    const totalMonsters = document.querySelectorAll(".card").length;
    if (isBookMode) {
        currentIndex = Math.max(0, currentIndex - 2); // Retrocede 2 en modo libro
    } else {
        currentIndex = (currentIndex - 1 + totalMonsters) % totalMonsters; // Retrocede 1 en carrusel
    }
    updateCarousel(totalMonsters);
});

document.getElementById("next").addEventListener("click", () => {
    const totalMonsters = document.querySelectorAll(".card").length;
    if (isBookMode) {
        currentIndex = Math.min(totalMonsters - 2, currentIndex + 2); // Avanza 2 en modo libro
    } else {
        currentIndex = (currentIndex + 1) % totalMonsters; // Avanza 1 en carrusel
    }
    updateCarousel(totalMonsters);
});



document.getElementById("toggleMode").addEventListener("click", () => {
    isBookMode = !isBookMode;
    const bookContainer = document.getElementById("book-container");
    const carouselContainer = document.querySelector(".carousel-container");
    const leftPage = document.querySelector(".left-page");
    const rightPage = document.querySelector(".right-page");

    if (isBookMode) {
        bookContainer.style.bottom = "0px"; // Sube el libro
        carouselContainer.classList.add("book-mode");

        // Aplicar animación de paso de página
        //leftPage.classList.add("flip-left");
        //rightPage.classList.add("flip-right");
    } else {
        bookContainer.style.bottom = "-700px"; // Baja el libro
        carouselContainer.classList.remove("book-mode");

        // Reiniciar animación al salir del modo libro
        ////rightPage.classList.remove("flip-right");
    }
    // Cambiar el texto del botón según el modo actual
    document.getElementById("toggleMode").textContent = isBookMode ? "Modo Carrusel" : "Modo Libro";

    updateCarousel(allMonsters.length); // Actualiza la vista con el nuevo modo
});

// Inicialización
fetchMonsters();
