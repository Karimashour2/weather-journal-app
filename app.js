
const apiKey = 'appid=2307287de24a43ce0ae2671424ec2d76&units=imperial';
const url = `https://api.openweathermap.org/data/2.5/weather?${apiKey}&zip=`;
const serverUrl = 'http://localhost:4000/';

let d = new Date();
let currentDate = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();

const generate = async () => {
	const zip = document.getElementById('zip').value;
	const feelings = document.getElementById('feelings').value;
	
	// check if zipcode is entered
	if(!zip) {
		document.getElementById('error').innerHTML = 'Zipcode required!';
		return;
	} 
	document.getElementById('error').innerHTML = '';
	getWeather().then(async (data) => {
		const res = await fetch(serverUrl + 'add', {
			method: 'POST',
			headers: {
			  "Content-Type": "application/json;charset=UTF-8"
			}, body: JSON.stringify({...data, zip, feelings, date: currentDate})});
			
		retrieveData();

	});
}

const btn =  document.getElementById('generate');

btn.addEventListener('click', generate);

const getWeather = async () => {
	const zip = document.getElementById('zip').value;
	const request = await fetch(url + zip);
	return await request.json();
}

const retrieveData = async () =>{
	const request = await fetch(serverUrl + 'all');
	try {
		// Transform into JSON
		const allData = await request.json()
		console.log(allData)
		if(allData.cod !== 200) {
			document.getElementById('error').innerHTML = allData.message;
			document.getElementById('temp').innerHTML = '';
			document.getElementById('content').innerHTML = '';
			document.getElementById("date").innerHTML = '';
			return;
		}
		document.getElementById('temp').innerHTML = Math.round(allData.main.temp)+ ' degrees';
		document.getElementById('content').innerHTML = allData.feelings;
		document.getElementById("date").innerHTML = allData.date;
	}
	catch(error) {
		console.log("error", error);
		// appropriately handle the error
		document.getElementById('error').innerHTML = error;
	}
}
