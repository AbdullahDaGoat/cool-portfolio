document.addEventListener("DOMContentLoaded", function() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval = null;
    const h1Element = document.querySelector("h1");
    const loader = document.querySelector(".loader");
    const content = document.querySelector(".content");

    // Initially hide content
    content.style.opacity = "-0";

    // Fade in loader with a delay
    setTimeout(() => {
        loader.style.transition = "opacity 1s";
        loader.style.opacity = "1";
    }, 500); // Adjusted delay and duration for fade in

    // Start hacker effect when DOM content is loaded
    let iteration = 0;
    
    clearInterval(interval);
    
    interval = setInterval(() => {
        h1Element.innerText = h1Element.innerText
            .split("")
            .map((letter, index) => {
                if(index < iteration) {
                    return h1Element.dataset.value[index];
                }
                
                return letters[Math.floor(Math.random() * 26)]
            })
            .join("");
        
        if(iteration >= h1Element.dataset.value.length) { 
            clearInterval(interval);
            
            // Fade out loader and fade in content after hacker effect ends
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
                content.style.transition = "opacity 0.5s";
                content.style.opacity = "1";
            }, 1000); // Adjusted delay for fade out and display change
        }
        
        iteration += 1 / 3;
    }, 30); // Adjusted interval for slower hacker effect
});
