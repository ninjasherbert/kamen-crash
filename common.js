let score_perfect = 0;
let score_bad = 0;

function updateScore() {
	document.getElementById("score_perfect").textContent = score_perfect;
	document.getElementById("score_bad").textContent = score_bad;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class CrashHelper {
	constructor() {
		this.score_perfect = 0;
		this.score_bad = 0;

		<div id="score">Perfect: <span id="score_perfect">0</span><br />Bad: <span id="score_bad">0</span></div>
		this.$score = document.createElement("div");
		this.$score.setAttribute("id", "score");

		this.$score_perfect_wrapper = document.createElement("div");
		this.$score_perfect = document.createElement("span");
		this.$score_perfect_wrapper.append("Perfect: ", this.$score_perfect);
		this.$score_bad_wrapper = document.createElement("div");
		this.$score_bad = document.createElement("span");
		this.$score_bad_wrapper.append("Bad: ", this.$score_bad);

		this.$score.append(this.$score_perfect_wrapper, this.$score_bad_wrapper);

		document.body.append(this.$score);
	}
}

class Circle {
	constructor() {
		this.play = true;
		this.size = 600;
		this.currentSize;
		this.duration = 1500;
		this.progress;
		this.failTimer = setTimeout(() => {
			this.end("bad");
		}, this.duration);

		const x = getRandomInt(this.size, window.innerWidth - this.size);
		const y = getRandomInt(this.size, window.innerHeight - this.size);

		this.wrapper = document.createElement("div");
		this.wrapper.classList.add("circle");
		this.inner = document.createElement("div");
		this.inner.classList.add("inner");
		this.outer = document.createElement("div");
		this.outer.classList.add("outer");
		this.key = document.createElement("div");
		this.key.classList.add("key");
		this.wrapper.append(this.inner, this.outer, this.key);
		this.wrapper.style.top = y + "px";
		this.wrapper.style.left = x + "px";
		document.body.append(this.wrapper);
		this.animate();
		this.setKeydown();
	}

	setKeydown() {
		const keys = ['Q', 'W', 'E', 'R', 'A', 'S', 'D', 'F'];
		const randomKey = keys[Math.floor(Math.random() * keys.length)];
		this.key.textContent = randomKey;
		document.addEventListener('keydown', (event) => {
			if (event.key.toUpperCase() === randomKey) {
				this.catch();
			}
		});
	}

	catch() {
		if (!this.play) return;

		if (this.currentSize <= 350 && this.currentSize >= 280) {
			this.end("perfect");
		} else {
			this.end("bad");
		}
	}

	end(result = "bad") {
		this.play = false;
		clearTimeout(this.failTimer);

		this.result = document.createElement("div");
		this.result.classList.add("result");
		this.wrapper.append(this.result);

		if (result == "perfect") {
			this.wrapper.classList.add("perfect");
			this.result.textContent = "Perfect";
			score_perfect++;
		} else {
			this.wrapper.classList.add("bad");
			this.result.textContent = "Bad";
			score_bad++;
		}
		updateScore();
		// this.wrapper.style.animation = "fadeOut 0.5s";
		setTimeout(() => {
			this.wrapper.style.transition = "opacity 0.5s";
			this.wrapper.style.opacity = "0";
		}, 500);
		setTimeout(() => {
			this.wrapper.remove();
		}, 1000);
	}

	shrink(timestamp) {
		if (!this.play) return;
		if (!this.startTimestamp) this.startTimestamp = timestamp;
		this.progress = (timestamp - this.startTimestamp) / this.duration;
		this.currentSize = this.size - (this.size * Math.min(this.progress, 1));
		this.outer.style.width = this.currentSize + "px";
		this.outer.style.height = this.currentSize + "px";
		if (this.progress < 1) {
			this.animationId = requestAnimationFrame((timestamp) => this.shrink(timestamp));
		}
	}
	animate() {
		this.animationId = requestAnimationFrame((timestamp) => this.shrink(timestamp));
	}
}

setTimeout(() => {
	new Circle();
	setInterval(() => {
		new Circle();
		if (getRandomInt(0, 2) == 0) {
			setTimeout(() => {
				new Circle();
			}, 250);
		}
	}, 5800);
}, 1000);