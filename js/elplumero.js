/* El Plumero — flipbook con StPageFlip */

// 10 fotos (páginas 1-10)
var _photos = [
	'parque patricios magazine-01',
	'parque patricios magazine-02',
	'parque patricios magazine-03',
	'parque patricios magazine-04',
	'parque patricios magazine-05',
	'parque patricios magazine-06',
	'parque patricios magazine-07',
	'parque patricios magazine-08',
	'parque patricios magazine-09',
	'parque patricios magazine-10'
];

// Construcción del array de imágenes para StPageFlip
var photoUrls = _photos.map(function(name) {
	return 'pics/' + name + '.jpg';
});

function loadApp() {
	var container = document.querySelector('.sj-book');

	// Inicializar StPageFlip
	var pageFlip = new St.PageFlip(container, {
		width: 400,      // ancho de una página
		height: 533,     // alto de una página
		size: 'fixed',
		minWidth: 400,
		maxWidth: 400,
		minHeight: 533,
		maxHeight: 533,
		maxShadowOpacity: 0,
		showCover: false,  // NO mostrar portada sola
		mobileScrollSupport: false,
		swipeDistance: 30,
		clickEventForward: true,
		usePortrait: false,
		startPage: 0,
		drawShadow: false,
		flippingTime: 800,
		useMouseEvents: true,
		autoSize: false
	});

	// Cargar las imágenes
	pageFlip.loadFromImages(photoUrls);

	// Forzar que no haya sombras después de cargar
	pageFlip.on('flip', function(e) {
		// Intentar ocultar sombras en cada flip
	});

	// Event listeners para teclado
	document.addEventListener('keydown', function(e) {
		if (e.keyCode === 37) { // flecha izquierda
			pageFlip.flipPrev();
		}
		if (e.keyCode === 39) { // flecha derecha
			pageFlip.flipNext();
		}
	});

	// Mostrar el canvas
	document.getElementById('canvas').style.visibility = 'visible';
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', loadApp);
} else {
	loadApp();
}
