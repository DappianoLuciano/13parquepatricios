/* Efecto Glitch Text - Vanilla JS */

function GlitchText(element, text) {
	this.element = element;
	this.text = text;
	this.isActive = false;
	this.frameId = null;
	this.displayText = text;

	this.textAlt = [
		text.toUpperCase(),
		text.split("").map(() => String.fromCharCode(33 + Math.random() * 94)).join(""),
		text.split("").map(() => String.fromCharCode(33 + Math.random() * 94)).join("")
	];

	// Crear estructura HTML
	this.element.innerHTML = '';
	this.element.classList.add('TextGlitch');

	this.clip1 = document.createElement('div');
	this.clip1.className = 'TextGlitch-clip';
	this.clip1.innerHTML = `
		<div class="TextGlitch-word"></div>
		<div class="TextGlitch-word TextGlitch-blend TextGlitch-blendA"></div>
		<div class="TextGlitch-word TextGlitch-blend TextGlitch-blendB"></div>
	`;

	this.clip2 = document.createElement('div');
	this.clip2.className = 'TextGlitch-clip';
	this.clip2.innerHTML = `
		<div class="TextGlitch-word"></div>
		<div class="TextGlitch-word TextGlitch-blend TextGlitch-blendA"></div>
		<div class="TextGlitch-word TextGlitch-blend TextGlitch-blendB"></div>
	`;

	this.clip3 = document.createElement('div');
	this.clip3.className = 'TextGlitch-clip';
	this.clip3.innerHTML = `
		<div class="TextGlitch-word"></div>
		<div class="TextGlitch-word TextGlitch-blend TextGlitch-blendA"></div>
		<div class="TextGlitch-word TextGlitch-blend TextGlitch-blendB"></div>
	`;

	this.element.appendChild(this.clip1);
	this.element.appendChild(this.clip2);
	this.element.appendChild(this.clip3);

	this.updateText(text);
}

GlitchText.prototype.randDouble = function(d) {
	return Math.random() * d - d / 2;
};

GlitchText.prototype.randInt = function(n) {
	return Math.floor(Math.random() * n);
};

GlitchText.prototype.randText = function() {
	var txt = Array.from(this.text);
	for (var i = 0; i < 8; i++) {
		var ind = this.randInt(this.text.length);
		txt[ind] = this.textAlt[this.randInt(this.textAlt.length)][ind];
	}
	return txt.join("");
};

GlitchText.prototype.updateText = function(newText) {
	var words = this.element.querySelectorAll('.TextGlitch-word');
	for (var i = 0; i < words.length; i++) {
		words[i].textContent = newText;
	}
};

GlitchText.prototype.addClipCSS = function() {
	var clip1 = this.randDouble(0.1);
	var clip2 = this.randDouble(0.1);

	this.clip1.style.transform = 'translate(' + this.randDouble(0.3) + 'em, 0.02em)';
	this.clip1.style.clipPath = 'inset(0 0 ' + (0.6 + clip1) + 'em 0)';

	this.clip2.style.clipPath = 'inset(' + (0.4 - clip1) + 'em 0 ' + (0.3 - clip2) + 'em 0)';

	this.clip3.style.transform = 'translate(' + this.randDouble(0.3) + 'em, -0.02em)';
	this.clip3.style.clipPath = 'inset(' + (0.7 + clip2) + 'em 0 0 0)';
};

GlitchText.prototype.removeClipCSS = function() {
	this.clip1.style.clipPath = '';
	this.clip1.style.transform = '';
	this.clip2.style.clipPath = '';
	this.clip2.style.transform = '';
	this.clip3.style.clipPath = '';
	this.clip3.style.transform = '';
};

GlitchText.prototype.glitch = function() {
	this.addClipCSS();
	this.displayText = this.randText();
	this.updateText(this.displayText);
	this.element.classList.add('TextGlitch-blended');
};

GlitchText.prototype.unglitch = function() {
	this.removeClipCSS();
	this.displayText = this.text;
	this.updateText(this.displayText);
	this.element.classList.remove('TextGlitch-blended');
};

GlitchText.prototype.frame = function() {
	var self = this;
	self.glitch();

	setTimeout(function() {
		self.unglitch();
	}, 50 + Math.random() * 200);

	self.frameId = setTimeout(function() {
		self.frame();
	}, 250 + Math.random() * 500);
};

GlitchText.prototype.start = function() {
	if (!this.isActive) {
		this.isActive = true;
		this.frame();
	}
};

GlitchText.prototype.stop = function() {
	if (this.isActive) {
		this.isActive = false;
		if (this.frameId) {
			clearTimeout(this.frameId);
			this.frameId = null;
		}
		this.unglitch();
	}
};
