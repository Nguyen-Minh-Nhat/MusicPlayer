const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let playlist = $('.playlist');
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
let isMute = false;
let MUSIC_PLAYER_STORAGE_KEY = 'music-key';

let volumeProgress = $('.volume-progress');

let volumeController = $('.volume');
let volumeValue = 1;
let playlistBtn = $('.playlist-btn');
let dashboard = $('.dashboard');

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
	config: JSON.parse(localStorage.getItem('MUSIC_PLAYER_STORAGE_KEY')) || {},
	setConfig: function (key, value) {
		app.config[key] = value;

		localStorage.setItem(
			'MUSIC_PLAYER_STORAGE_KEY',
			JSON.stringify(this.config)
		);
	},
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
			isPlay = !isPlay;
			app.changeBtnPlay();

			if (isPlay) {
				audio.play();
				imgAnimation.play();
			} else {
				audio.pause();
				imgAnimation.pause();
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
			imgAnimation.play();
		};
		// click next button
		nextBtn.onclick = function () {
			app.nextSong();
			app.loadCurrentSong();
			imgAnimation.play();
		};
		// click random button
		randomBtn.onclick = function () {
			isRandom = !isRandom;
			app.changeStateBtn(randomBtn, isRandom);
			app.setConfig('isRandom', isRandom);
		};
		// click loop button
		loopBtn.onclick = function () {
			isLoop = !isLoop;
			app.changeStateBtn(loopBtn, isLoop);
			app.setConfig('isLoop', isLoop);
		};
		// click at play list
		playlist.onclick = (e) => {
			const songElement = e.target.closest('.song');
			currentSongIndex = songElement.dataset.index;
			app.loadCurrentSong();
			app.activeCurrentSongInPlaylist();
		};
		// change value
		volumeController.onmousedown = (e) => {
			if (isMute) {
				volumeProgress.value = 100;
			} else {
				volumeProgress.value = 0;
			}
			app.changeVolume();
		};
		volumeProgress.oninput = (e) => {
			e.stopPropagation();
			app.changeVolume();
		};
		// click playlist button
		playlistBtn.onclick = function () {
			dashboard.classList.toggle('dashboard--push-up');
			playlist.classList.toggle('playlist--show');
		};
	},

	changeVolume: function () {
		let iconVolume = volumeController.querySelector('i');
		volumeValue = volumeProgress.value / 100;
		audio.volume = volumeValue;
		if (volumeValue === 0) {
			isMute = true;
			iconVolume.classList = 'fal  fa-volume-mute';
		} else {
			isMute = false;
			if (volumeValue <= 0.5) iconVolume.classList = 'fal fa-volume';
			else iconVolume.classList = 'fal  fa-volume-up';
		}
	},
	scrollActiveSong: function () {
		// $('.song.song--active').scrollIntoView({
		// 	behavior: 'smooth',
		// 	block: 'center',
		// });
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
		isLoop = app.config.isLoop;
		isRandom = app.config.isRandom;
		app.changeStateBtn(loopBtn, isLoop);
		app.changeStateBtn(randomBtn, isRandom);
	},

	loadCurrentSong: function () {
		let currentSong = this.songs[currentSongIndex];
		currentSongName.innerHTML = currentSong.name;
		currentSongImage.style.backgroundImage = `url('${currentSong.image}')`;
		audio.src = `${currentSong.path}`;
		audio.play();
		isPlay = true;
		app.scrollActiveSong();
		app.changeBtnPlay();
	},

	changeBtnPlay: function () {
		if (isPlay) {
			mainController.classList.remove('pause');
			mainController.classList.add('play');
		} else {
			mainController.classList.add('pause');
			mainController.classList.remove('play');
		}
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

	changeStateBtn: function (stateKey, stateValue) {
		if (stateValue) {
			stateKey.classList.add('btn--active');
		} else stateKey.classList.remove('btn--active');
	},
	start: function () {
		this.renderer();
		this.loadCurrentSong();
		this.handles();
		this.autoNext();
	},
};

app.start();
