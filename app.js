const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let playlist = $('.play-list');
let currentSongName = $('.dashboard-content__name-song');
let currentSongImage = $('.dashboard__img');
let audio = $('#audio');
let currentSongIndex = 0;
let mainController = $('.mainController');
let nextBtn = $('.next-btn');
let prevBtn = $('.prev-btn');
let randomBtn = $('.random-btn');
let loopBtn = $('.loop-btn');
let imgWidth = currentSongImage.offsetWidth;
let imgHeight = currentSongImage.offsetHeight;
let progress = $('.progress');
let isRandom = false;
let isLoop = false;
let isPlay = true;

const app = {
	songs: [
		{
			name: 'Cưới Thôi',
			singer: 'Masew',
			image: './img/cuoithoi.jpg',
			path: './music/CuoiThoi.mp3',
		},
		{
			name: '10 000 hours',
			singer: 'Justin Bieber',
			image: './img/10000 hours.jpg',
			path: './music/10_000 Hours .mp3',
		},
		{
			name: 'Beautiful Mistakes',
			singer: 'Maroon 5',
			image: './img/BeautifulMistakes.jpg',
			path: './music/BeautifulMistakes.mp3',
		},
		{
			name: 'Darkside',
			singer: 'Alan Walker',
			image: './img/Darkside.jpg',
			path: './music/Darkside.mp3',
		},
		{
			name: 'Good 4 U',
			singer: 'Olivia Rodrigo',
			image: './img/Good4U.jpg',
			path: './music/Good4U.mp3',
		},
		{
			name: 'Happy For You',
			singer: 'Lukas Graham feat Vũ',
			image: './img/HappyForYou.jpg',
			path: './music/HappyForYou.mp3',
		},
		{
			name: 'I Love You 3000',
			singer: 'Stephanie Poetri',
			image: './img/ILoveYou3000.jpg',
			path: './music/ILoveYou3000.mp3',
		},
		{
			name: 'Like My Father',
			singer: 'Jax',
			image: './img/LikeMyFather.jpg',
			path: './music/LikeMyFather-jax.mp3',
		},
		{
			name: 'Memories',
			singer: 'Maroon 5',
			image: './img/Memories.jpg',
			path: './music/Memories.mp3',
		},
		{
			name: 'Mood',
			singer: 'Maroon 5',
			image: './img/Mood.jpg',
			path: './music/Mood.mp3',
		},
		{
			name: 'Mười Năm',
			singer: 'Đen Vâu',
			image: './img/MuoiNam.jpg',
			path: './music/MuoiNam.mp3',
		},
	],
	handles: function () {
		// scroll play list
		playlist.onscroll = function () {
			let newImgWidth = imgWidth - playlist.scrollTop;
			let newImgHeight = imgHeight - playlist.scrollTop;
			currentSongImage.style.width = newImgWidth > 0 ? newImgWidth + 'px' : 0;
			currentSongImage.style.height =
				newImgHeight > 0 ? newImgHeight + 'px' : 0;
		};
		// click play button
		mainController.addEventListener('click', function () {
			mainController.classList.toggle('pause');
			mainController.classList.toggle('play');
			if (mainController.classList.contains('pause')) {
				audio.pause();
				imgAnimation.pause();
			} else {
				audio.play();
				imgAnimation.play();
			}
		});

		// rotate the img dashboard

		let imgAnimation = currentSongImage.animate(
			[{ transform: 'rotate(360deg)' }],
			{
				duration: 10000,
				iterations: Infinity,
			}
		);
		imgAnimation.play();

		// click progress bar
		progress.oninput = function () {
			seekTime = (audio.duration / 100) * progress.value;
			audio.currentTime = seekTime;
		};
		// auto updateProgress
		app.autoUpdateProgress();
		// click prev button
		prevBtn.onclick = function () {
			app.prevSong();
			app.loadCurrentSong();
		};
		// click next button
		nextBtn.onclick = function () {
			app.nextSong();
			app.loadCurrentSong();
		};
		// click random button
		randomBtn.onclick = function () {
			isRandom = !isRandom;
			randomBtn.classList.toggle('btn--active');
		};
		// click loop button
		loopBtn.onclick = function () {
			isLoop = !isLoop;
			loopBtn.classList.toggle('btn--active');
		};
		// click at play list
		playlist.onclick = (e) => {
			const songElement = e.target.closest('.song');
			currentSongIndex = songElement.dataset.index;
			app.loadCurrentSong();
			app.activeCurrentSongInPlaylist();
		};
	},
	renderer: function () {
		let html = this.songs.map(function (song, index) {
			return `<li class="song ${
				index == currentSongIndex ? 'song--active' : ''
			}" data-index="${index}">
					<div class="song__thumb" style="background-image: url('${song.image}')"></div>
					<div class="song__content">
						<h3 class="song-name">${song.name}</h3>
						<span class="song-artist">${song.singer}</span>
					</div>
					<div class="song__more"><i class="fad fa-ellipsis-h"></i></div>
				</li>`;
		});
		playlist.innerHTML = html.join('');
	},

	loadCurrentSong: function () {
		let currentSong = this.songs[currentSongIndex];
		currentSongName.innerHTML = currentSong.name;
		currentSongImage.style.backgroundImage = `url('${currentSong.image}')`;
		audio.src = `${currentSong.path}`;
		audio.play();
	},

	nextSong: function () {
		currentSongIndex++;
		if (currentSongIndex >= app.songs.length) {
			currentSongIndex = 0;
		}
		app.activeCurrentSongInPlaylist();
	},

	prevSong: function () {
		currentSongIndex--;
		if (currentSongIndex < 0) {
			currentSongIndex = app.songs.length - 1;
		}
		app.activeCurrentSongInPlaylist();
	},

	autoNext: function () {
		audio.addEventListener('ended', function () {
			if (!isLoop) {
				if (isRandom) {
					app.randomSong();
				} else app.nextSong();
			}
			app.loadCurrentSong();
			app.activeCurrentSongInPlaylist();
		});
	},

	autoUpdateProgress: function () {
		audio.ontimeupdate = function () {
			let progressValue = (audio.currentTime / audio.duration) * 100;
			app.updateProgress(progressValue);
		};
	},
	activeCurrentSongInPlaylist: function () {
		$('.song.song--active').classList.remove('song--active');
		let listSong = $$('.song');
		listSong.forEach(function (song, index) {
			if (index == currentSongIndex) {
				song.classList.add('song--active');
			}
		});
	},
	updateProgress: function (updateValue) {
		progress.value = updateValue;
	},
	randomSong: function () {
		let newCurrentSongIndex;
		do {
			newCurrentSongIndex = Math.floor(Math.random() * this.songs.length);
		} while (newCurrentSongIndex == currentSongIndex);
		currentSongIndex = newCurrentSongIndex;
	},

	start: function () {
		this.renderer();
		this.loadCurrentSong();
		this.handles();
		this.autoNext();
	},
};

app.start();
