const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let playList = $('.play-list');
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

const app = {
	songs: [
		{
			name: 'Cưới Thôi',
			singer: 'Masew',
			image: '../img/cuoithoi.jpg',
			path: './music/CuoiThoi.mp3',
		},
		{
			name: '10 000 hours',
			singer: 'Justin Bieber',
			image: '../img/10000 hours.jpg',
			path: './music/10_000 Hours .mp3',
		},
		{
			name: 'Beautiful Mistakes',
			singer: 'Maroon 5',
			image: '../img/BeautifulMistakes.jpg',
			path: './music/BeautifulMistakes.mp3',
		},
		{
			name: 'Darkside',
			singer: 'Alan Walker',
			image: '../img/Darkside.jpg',
			path: './music/Darkside.mp3',
		},
		{
			name: 'Good 4 U',
			singer: 'Olivia Rodrigo',
			image: '../img/Good4U.jpg',
			path: './music/Good4U.mp3',
		},
		{
			name: 'Happy For You',
			singer: 'Lukas Graham feat Vũ',
			image: '../img/HappyForYou.jpg',
			path: './music/HappyForYou.mp3',
		},
		{
			name: 'I Love You 3000',
			singer: 'Stephanie Poetri',
			image: '../img/ILoveYou3000.jpg',
			path: './music/ILoveYou3000.mp3',
		},
		{
			name: 'Like My Father',
			singer: 'Jax',
			image: '../img/LikeMyFather.jpg',
			path: './music/LikeMyFather-jax.mp3',
		},
		{
			name: 'Memories',
			singer: 'Maroon 5',
			image: '../img/Memories.jpg',
			path: './music/Memories.mp3',
		},
		{
			name: 'Mood',
			singer: 'Maroon 5',
			image: '../img/Mood.jpg',
			path: './music/Mood.mp3',
		},
		{
			name: 'Mười Năm',
			singer: 'Đen Vâu',
			image: '../img/MuoiNam.jpg',
			path: './music/MuoiNam.mp3',
		},
	],
	handles: function () {
		// scroll play list
		playList.onscroll = function () {
			let newImgWidth = imgWidth - playList.scrollTop;
			let newImgHeight = imgHeight - playList.scrollTop;
			currentSongImage.style.width = newImgWidth > 0 ? newImgWidth + 'px' : 0;
			currentSongImage.style.height =
				newImgHeight > 0 ? newImgHeight + 'px' : 0;
		};
		// click play button
		mainController.addEventListener('click', function () {
			mainController.classList.toggle('pause');
			mainController.classList.toggle('play');
			if (mainController.classList.contains('pause')) audio.pause();
			else audio.play();
		});

		// click progress bar
		progress.onclick = function () {
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
			if (!isRandom) {
				isRandom = true;
				randomBtn.classList.add('btn--active');
			} else {
				isRandom = false;
				randomBtn.classList.remove('btn--active');
			}
		};
		// click loop button
		loopBtn.onclick = function () {
			if (!isLoop) {
				isLoop = true;
				loopBtn.classList.add('btn--active');
			} else {
				isLoop = false;
				loopBtn.classList.remove('btn--active');
			}
		};
		// click at play list
		let listSong = playList.querySelectorAll('.song');
		listSong.forEach(function (song, index) {
			song.onclick = function () {
				currentSongIndex = index;
				app.currentSongInPlaylist(listSong);
				app.loadCurrentSong();
			};
		});
	},
	renderer: function () {
		let html = this.songs.map(function (song) {
			return `<li class="song">
					<div class="song__thumb" style="background-image: url('${song.image}')"></div>
					<div class="song__content">
						<h3 class="song-name">${song.name}</h3>
						<span class="song-artist">${song.singer}</span>
					</div>
					<div class="song__more"><i class="fad fa-ellipsis-h"></i></div>
				</li>`;
		});
		playList.innerHTML = html.join('');
	},

	loadCurrentSong: function () {
		let currentSong = this.songs[currentSongIndex];
		currentSongName.innerHTML = currentSong.name;
		currentSongImage.style.backgroundImage = `url('${currentSong.image}')`;
		audio.src = `${currentSong.path}`;
		audio.play();
	},

	nextSong: function () {
		currentSongIndex += 1;
		if (currentSongIndex >= app.songs.length) {
			currentSongIndex = 0;
		}
	},

	prevSong: function () {
		currentSongIndex -= 1;
		if (currentSongIndex < 0) {
			currentSongIndex = app.songs.length - 1;
		}
	},

	autoNext: function () {
		audio.addEventListener('ended', function () {
			if (!isLoop) {
				if (isRandom) {
					app.randomSong();
				} else app.nextSong();
			}
			app.loadCurrentSong();
		});
	},

	autoUpdateProgress: function () {
		audio.ontimeupdate = function () {
			let progressValue = (audio.currentTime / audio.duration) * 100;
			app.updateProgress(progressValue);
		};
	},

	updateProgress: function (updateValue) {
		progress.value = updateValue;
	},
	currentSongInPlaylist: function (listSong) {
		listSong.forEach(function (song) {
			song.classList.remove('song--active');
		});
		listSong[currentSongIndex].classList.add('song--active');
	},
	randomSong: function () {
		newCurrentSongIndex = Math.floor(Math.random() * 10);
		if (currentSongIndex === newCurrentSongIndex) {
			currentSongIndex = newCurrentSongIndex + 1;
		} else currentSongIndex = newCurrentSongIndex;
	},

	start: function () {
		this.loadCurrentSong();
		this.renderer();
		this.handles();
		this.autoNext();
		console.log(this.listSong);
	},
};

app.start();
