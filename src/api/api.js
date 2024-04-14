const url = 'https://spotify23.p.rapidapi.com/search/?q=Runaway&type=tracks&offset=0&limit=3&numberOfTopResults=3';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'ad3ec5a369mshf5f01f7b784ff09p1a3634jsnf1989bcc621e',
		'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}