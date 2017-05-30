const yargs = require('yargs');
const axios = require('axios');
const argv = yargs
    .options({
        address: {
            demand: false,
            describe: 'Address',
            alias: 'a',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

if (argv.address === undefined) {
    argv.address = 'Patiala Punjab';
}

var encodedAddress = encodeURIComponent(argv.address);
var geocodeurl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`

axios.get(geocodeurl).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to fetch data');
    }


    var lattitude = response.data.results[0].geometry.location.lat;
    var longitude = response.data.results[0].geometry.location.lng;
    var weatherurl = `https://api.darksky.net/forecast/c1460667d05279d4d2e8e1766386403d/${lattitude},${longitude}`;
    console.log(`Location: ${response.data.results[0].formatted_address}`);
    return axios(weatherurl);
}).then((response) => {
    var temperature = (response.data.currently.temperature - 32) * (5 / 9);
    var apparentTemperature = (response.data.currently.apparentTemperature - 32) * (5 / 9);
    var weatherHumidity = response.data.currently.humidity;
    var climate = response.data.currently.summary;
    console.log('Temperature:', temperature.toFixed(0));
    console.log('Apparent Temperature:', apparentTemperature.toFixed(0));
    console.log(`Humidity: ${weatherHumidity}`);
    console.log(`Current Climate: ${climate}`);
}).catch((e) => {
    if (e.code === 'ENOTFOUND') {
        console.log('Unable to connect to google servers');
    } else {
        console.log(e.message);
    }
});
