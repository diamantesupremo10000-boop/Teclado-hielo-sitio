document.addEventListener("DOMContentLoaded", () => {
    
    // Selecciona todos los contenedores de video
    const videoSections = document.querySelectorAll(".short-video");

    /**
     * Envía un comando (play/pause) a un iframe de YouTube.
     * @param {HTMLIFrameElement} iframe - El elemento iframe al que se enviará el mensaje.
     * @param {string} command - El comando de la API ('playVideo' o 'pauseVideo').
     */
    function postYouTubeMessage(iframe, command) {
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(JSON.stringify({
                "event": "command",
                "func": command,
                "args": []
            }), "*"); // Se usa '*' por simplicidad, en producción se debe usar el dominio de YouTube
        }
    }

    /**
     * Función callback para el IntersectionObserver.
     * Se dispara cuando un video entra o sale de la vista.
     */
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const videoIframe = entry.target.querySelector("iframe");
            
            if (entry.isIntersecting) {
                // El video está en la vista
                entry.target.classList.add("is-active"); // Activa el pulso de neón
                postYouTubeMessage(videoIframe, "playVideo");
            } else {
                // El video salió de la vista
                entry.target.classList.remove("is-active"); // Desactiva el pulso
                postYouTubeMessage(videoIframe, "pauseVideo");
            }
        });
    };

    // Configuración del IntersectionObserver
    // Se activa cuando el 80% del video es visible
    const observerOptions = {
        root: document.getElementById("shorts-feed"), // El contenedor de scroll
        threshold: 0.8 
    };

    // Crear y adjuntar el observador
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    videoSections.forEach(section => {
        observer.observe(section);
    });
});
