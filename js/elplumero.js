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
	// Manejar video de introducción
	var introVideoContainer = document.getElementById('intro-video-container');
	var introVideo = document.getElementById('intro-video');

	// Cuando termine el video de intro, mostrar la revista
	introVideo.addEventListener('ended', function() {
		hideIntroVideo();
	});

	// Click en el video de intro para saltar a la revista
	introVideo.addEventListener('click', function() {
		hideIntroVideo();
	});
}

function hideIntroVideo() {
	var introVideoContainer = document.getElementById('intro-video-container');

	// Fade out del video de intro
	introVideoContainer.style.opacity = '0';

	setTimeout(function() {
		introVideoContainer.style.display = 'none';
		showMagazine();
	}, 800);
}

var glitchNames = [];

function showMagazine() {
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

	// Mostrar el canvas con transición suave
	var canvas = document.getElementById('canvas');
	var sidebar = document.getElementById('sidebar-right');

	canvas.style.visibility = 'visible';
	canvas.style.opacity = '0';
	sidebar.style.opacity = '0';

	setTimeout(function() {
		canvas.style.opacity = '1';
		sidebar.style.opacity = '1';
	}, 50);

	// Inicializar detección de scroll para ir al video
	initScrollToVideo();

	// Inicializar efecto glitch en los nombres
	initGlitchNames();
}

function initGlitchNames() {
	var names = document.querySelectorAll('#sidebar-right .titulo-principal');

	for (var i = 0; i < names.length; i++) {
		var glitch = new GlitchText(names[i], names[i].textContent);
		glitchNames.push(glitch);
		glitch.start();
	}

	// Detener el efecto glitch después de 5 segundos
	setTimeout(function() {
		for (var i = 0; i < glitchNames.length; i++) {
			glitchNames[i].stop();
		}
	}, 5000);
}

// Función para detectar scroll hacia abajo y mostrar video
function initScrollToVideo() {
	var scrollThreshold = 50;
	var scrollAccumulator = 0;
	var isVideoMode = false;

	// Detectar scroll con la rueda del mouse
	window.addEventListener('wheel', function(e) {
		if (!isVideoMode && e.deltaY > 0) { // scroll hacia abajo - ir al video
			scrollAccumulator += e.deltaY;
			if (scrollAccumulator > scrollThreshold) {
				showVideo();
				isVideoMode = true;
				scrollAccumulator = 0;
			}
		} else if (isVideoMode && e.deltaY < 0) { // scroll hacia arriba - volver a revista
			scrollAccumulator += Math.abs(e.deltaY);
			if (scrollAccumulator > scrollThreshold) {
				hideVideo();
				isVideoMode = false;
				scrollAccumulator = 0;
			}
		} else {
			scrollAccumulator = 0;
		}
	});

	// Detectar gestos táctiles en touchpad/pantalla táctil
	var touchStartY = 0;
	window.addEventListener('touchstart', function(e) {
		touchStartY = e.touches[0].clientY;
	});

	window.addEventListener('touchmove', function(e) {
		var touchEndY = e.touches[0].clientY;
		var diff = touchStartY - touchEndY;

		if (!isVideoMode && diff > 50) { // swipe hacia arriba (scroll down) - ir al video
			showVideo();
			isVideoMode = true;
		} else if (isVideoMode && diff < -50) { // swipe hacia abajo (scroll up) - volver a revista
			hideVideo();
			isVideoMode = false;
		}
	});
}

function showVideo() {
	var videoContainer = document.getElementById('video-container');
	var video = document.getElementById('fashion-video');

	// Mostrar el video inmediatamente
	videoContainer.style.display = 'flex';
	video.style.display = 'block';
	video.play();

	// Agregar event listener para pantalla completa al hacer clic
	video.addEventListener('click', toggleFullscreen);
}

function toggleFullscreen() {
	var video = document.getElementById('fashion-video');

	if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
		// Entrar en pantalla completa
		if (video.requestFullscreen) {
			video.requestFullscreen();
		} else if (video.webkitRequestFullscreen) {
			video.webkitRequestFullscreen();
		} else if (video.mozRequestFullScreen) {
			video.mozRequestFullScreen();
		} else if (video.msRequestFullscreen) {
			video.msRequestFullscreen();
		}
	} else {
		// Salir de pantalla completa
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}
}

function hideVideo() {
	var videoContainer = document.getElementById('video-container');
	var video = document.getElementById('fashion-video');

	// Pausar video
	video.pause();
	video.currentTime = 0;

	// Remover event listener de pantalla completa
	video.removeEventListener('click', toggleFullscreen);

	// Ocultar el video
	videoContainer.style.display = 'none';
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', loadApp);
} else {
	loadApp();
}
