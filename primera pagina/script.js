/**
 * Script de Endurecimiento Frontend Pro (Client-Side Hardening)
 * Implementa defensas avanzadas de seguridad en el navegador.
 */
(function () {
    'use strict';

    // 1. Protección avanzada contra Clickjacking (Anti-Iframe)
    if (window.self !== window.top) {
        try {
            window.top.location = window.self.location;
        } catch (e) {
            console.error("Seguridad: Intento de framing externo bloqueado.");
            // Si el navegador bloquea el cambio por políticas de seguridad, ocultamos el contenido
            document.documentElement.style.display = 'none';
        }
    }

    // Función para blindar los enlaces externos
    function secureExternalLinks(root = document) {
        const externalLinks = root.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(link => {
            const currentRel = link.getAttribute('rel') || '';
            const needsNoopener = !currentRel.includes('noopener');
            const needsNoreferrer = !currentRel.includes('noreferrer');

            if (needsNoopener || needsNoreferrer) {
                link.setAttribute('rel', `${currentRel} noopener noreferrer`.trim());
            }
        });
    }

    // 2. Prevención automática y dinámica de Tabnabbing
    document.addEventListener('DOMContentLoaded', () => {
        secureExternalLinks();

        // Observer: Protege también enlaces que se creen dinámicamente con JS más adelante
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Asegurar que sea un Elemento HTML
                        if (node.tagName === 'A' && node.target === '_blank') {
                            secureExternalLinks(node.parentNode);
                        } else if (node.querySelectorAll) {
                            secureExternalLinks(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    // 3. Alerta de seguridad profesional en la consola (Protección contra Self-XSS)
    if (window.console && window.console.log) {
        const securityHeader = "%c¡Alto ahí! 🛡️";
        const securityStyle = "color: #ff4444; font-size: 22px; font-weight: bold; text-shadow: 1px 1px 0px #000;";
        const securityBody = "%cEsta es una función para desarrolladores de sistemas. Si alguien te pidió que copiaras y pegaras algo aquí para obtener dinero, premios o hackear una cuenta, es un fraude conocido como Self-XSS y buscan robar tu información.";
        const bodyStyle = "font-size: 13px; color: #a0a0a0; line-height: 1.5;";

        console.log(securityHeader, securityStyle);
        console.log(securityBody, bodyStyle);
    }
})();