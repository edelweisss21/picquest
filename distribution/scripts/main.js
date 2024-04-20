const header = document.querySelector('.header');

const searchInput = document.querySelector('.main__input');
const materialBox = document.querySelector('.material__box');
const materialPhotos = document.querySelector('.material__photos');
const sectionPromo = document.querySelector('.promo');

const myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');
myHeaders.append(
	'Authorization',
	'xnvx4sqsq761EvR5OTsPduXjIIyeDk0GEfIs42uMPbgG7KL4715EG3pO'
);

const getPicture = async () => {
	const query = `https://api.pexels.com/v1/search?query=nature&per_page=1000`;

	const response = await fetch(query, {
		headers: myHeaders,
	});
	const data = await response.json();

	return data;
};

const getInfoAboutPhotos = async () => {
	const data = await getPicture();

	const createImg = ({ img }) => {
		img = shuffleArray(img);
		// randomPic(img);

		for (let i = 0; i < img.length; i++) {
			let html = `<div><img class="material__img" src="${img[i].src.portrait}" alt="${img[i].alt}"></div>`;
			materialPhotos.insertAdjacentHTML('beforeend', html);
		}

		materialBox.insertAdjacentElement('afterend', materialPhotos);
	};

	console.log('data', data.photos);

	ImgArr = {
		img: data.photos,
	};

	createImg(ImgArr);
};

const shuffleArray = arr => {
	return arr.sort(() => Math.random() - 0.5);
};

// const randomPic = arr => {
// 	const index = Math.round(Math.random() * arr.length);
// 	return (sectionPromo.style.backgroundImage = `url('${arr[index].src.original}')`);
// };

getInfoAboutPhotos();
