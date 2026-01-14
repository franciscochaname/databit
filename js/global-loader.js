// js/global-loader.js
(function() {
    // El "../" significa: salir de la carpeta 'public' para encontrar 'css' y 'js'
    const styles = [
        '../css/vendor/bootstrap.min.css', 
        '../css/main.css',
        '../css/auth.css'
    ];

    const scripts = [
        '../js/vendor/bootstrap.bundle.min.js',
        '../js/vendor/sweetalert2.js'
    ];

    // Inyectar Estilos
    styles.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    });

    // Inyectar Scripts
    scripts.forEach(url => {
        const script = document.createElement('script');
        script.src = url;
        script.async = false; 
        document.head.appendChild(script);
    });

    console.log("📂 Cargando recursos desde carpetas externas (../)");
})();