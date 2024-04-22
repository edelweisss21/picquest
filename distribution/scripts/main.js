const header = document.querySelector('.header');

const searchInput = document.querySelector('.main__input');
const form = document.querySelector('.form');
const searchBtn = document.querySelector('.search__btn');
const materialBox = document.querySelector('.material__box');
const materialPhotos = document.querySelector('.material__photos');
const sectionPromo = document.querySelector('.promo');

const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append(
	'Authorization',
	'xnvx4sqsq761EvR5OTsPduXjIIyeDk0GEfIs42uMPbgG7KL4715EG3pO'
);

const randomPic = arr => {
	const index = Math.floor(Math.random() * arr.length);
	return (sectionPromo.style.backgroundImage = `url('${arr[index]}')`);
};

const bgArray = [
	'distribution/img/bg.webp',
	'distribution/img/bg-2.webp',
	'distribution/img/bg-3.webp',
	'distribution/img/bg-4.webp',
	'distribution/img/bg-5.webp',
	'distribution/img/bg-6.webp',
	'distribution/img/bg-7.webp',
	'distribution/img/bg-8.webp',
	'distribution/img/bg-9.webp',
	'distribution/img/bg-10.webp',
];

randomPic(bgArray);

const getPicture = async topic => {
	try {
		const query = `https://api.pexels.com/v1/search?query=${topic}&per_page=80`;

		const response = await fetch(query, {
			headers: myHeaders,
		});
		const data = await response.json();

		return data;
	} catch (err) {
		console.error('Error fetching data: ', err);
	}
};

const shuffleArray = arr => {
	if (!arr || arr.length === 0) return [];
	const shuffledArray = [...arr];
	return shuffledArray.sort(() => Math.random() - 0.5);
};

const createImg = ({ img }) => {
	img = shuffleArray(img);

	for (let i = 0; i < img.length; i++) {
		let html = `<div class="material__item">
		<img class="material__img" loading="lazy" src="${img[i].src.portrait}" alt="${img[i].alt}">
		<div class="material__img-title">
			<span>View more details</span>
		</div>
		</div>`;
		materialPhotos.insertAdjacentHTML('beforeend', html);
	}

	materialBox.insertAdjacentElement('afterend', materialPhotos);

	const materialItems = document.querySelectorAll('.material__item');
	materialItems.forEach((item, index) => {
		item.addEventListener('click', () => {
			const photo = img[index];
			const imageUrl = photo.src.large;
			const imageAlt = photo.alt;
			const photographer = photo.photographer;
			const photographerURL = photo.photographer_url;
			const originalPhotoURL = photo.src.original;
			openModalWindow(
				imageUrl,
				imageAlt,
				photographer,
				photographerURL,
				originalPhotoURL
			);
		});
	});
};

const initDefaultPhotos = async () => {
	try {
		const data = await getPicture('cars');

		const defaultPhotos = {
			img: data.photos,
		};

		console.log('data', data);

		createImg(defaultPhotos);
	} catch (err) {
		console.error('Error fetching data: ', err);
	}
};

initDefaultPhotos();

const clearMaterialPhotos = () => {
	materialPhotos.innerHTML = '';
};

const getInfoAboutPhotos = async e => {
	try {
		e.preventDefault();

		topic = searchInput.value.trim();

		const data = await getPicture(topic);

		Photos = {
			img: data.photos,
			results: data.total_results,
		};

		removeHeading();

		clearMaterialPhotos();

		if (Photos.results === 0) {
			throw new Error('We have nothing to show on this topic');
		} else if (topic === '') {
			return initDefaultPhotos();
		}

		const headingHTML = `<h2 class="material__title">${Photos.results} images were found for your query: "<span class="topic">${topic}</span>"</h2>`;

		createImg(Photos);

		console.log('data.photos', data);

		materialPhotos.insertAdjacentHTML('beforebegin', headingHTML);
	} catch (err) {
		const errorHTML = `<h2 class="material__title centered">${err.message}</h2>`;
		materialPhotos.insertAdjacentHTML('beforebegin', errorHTML);
	}
};

const removeHeading = () => {
	const lastTitle = document.querySelector('.material__title');
	if (lastTitle) lastTitle.remove();
};

const modalWindow = document.querySelector('.modal__window');

const openModalWindow = (
	imageUrl,
	imageAlt,
	photographer,
	photographerURL,
	originalPhotoURL
) => {
	const modalWindowContent = document.querySelector('.modal__window-content');
	const modalWindowInner = document.querySelector('.modal__window-inner');
	modalWindow.style.display = 'block';

	modalWindowContent.innerHTML = '';

	const windowUserBox = document.createElement('div');
	windowUserBox.classList.add('window__user-box');

	const contentBox = document.createElement('div');
	contentBox.classList.add('content-box');

	const imgAvatar = document.createElement('img');
	imgAvatar.setAttribute('src', './distribution/img/avatar.svg');
	imgAvatar.setAttribute('alt', 'avatar');

	const imgElement = document.createElement('img');
	imgElement.setAttribute('src', imageUrl);
	imgElement.setAttribute('alt', imageAlt);
	imgElement.setAttribute('loading', 'lazy');
	imgElement.classList.add('img__in-modal');

	const photographerNickname = document.createElement('a');
	photographerNickname.setAttribute('href', photographerURL);
	photographerNickname.setAttribute('target', '_blank');
	photographerNickname.classList.add('photographer__nickname');
	photographerNickname.textContent = photographer;

	const downloadButton = document.createElement('a');
	downloadButton.setAttribute('href', originalPhotoURL);
	downloadButton.setAttribute('download', '');
	downloadButton.classList.add('download-btn');
	downloadButton.textContent = 'Download Image';

	const photoDesc = document.createElement('h2');
	photoDesc.textContent = imageAlt;
	photoDesc.classList.add('photo-desc');

	windowUserBox.append(imgAvatar, photographerNickname, photoDesc);
	contentBox.append(windowUserBox, photoDesc, downloadButton);
	modalWindowContent.append(imgElement, contentBox);

	modalWindowInner.addEventListener('click', e => {
		e.stopPropagation();
	});

	modalWindow.addEventListener('click', function () {
		modalWindow.style.display = 'none';
		document.body.style.overflow = 'auto';
	});

	document.body.style.overflow = 'hidden';
};

const closeModalWindow = () => {
	modalWindow.style.display = 'none';
	document.body.style.overflow = 'auto';
};

const closeBtn = document.getElementById('close-modal');
closeBtn.addEventListener('click', closeModalWindow);

form.addEventListener('submit', getInfoAboutPhotos);
searchBtn.addEventListener('click', getInfoAboutPhotos);
