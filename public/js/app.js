const weatherForm = document.querySelector('form');
const searchEle = document.querySelector('input');
const message = document.querySelector('#message');

weatherForm.addEventListener('submit', (e) => {
	e.preventDefault();
	message.textContent = 'Loading...';
	const location = searchEle.value;
	fetch('/weather?address=' + location).then((response) => {
		response.json().then((data) => {
			if (data.error) return (message.textContent = data.error);
			message.textContent =
				data.location +
				'\nIt is currently ' +
				data.description +
				' with a temperature of ' +
				data.temperature +
				', but it feels like ' +
				data.feelslike +
				'.';
		});
	});
});
