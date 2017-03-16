const functions = require('firebase-functions');
const fetch = require('node-fetch');

const timeInTraffic = (req, res) => {
  const origin = req.query.origin || req.body.origin || functions.config().maps.origin || res.send(400)
  const destination = req.query.destination || req.body.destination || functions.config().maps.destination || res.send(400)
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&traffic_model=best_guess&departure_time=now&key=${functions.config().maps.apikey}`

  // Only send this if it's between 4PM - 8PM pacific
  const currentHour = (new Date()).getUTCHours()
  console.log('Time: ' + req.query.time)
  if (currentHour === 23 || currentHour < 3) {
    fetch(url)
      .then(mapsResponse => mapsResponse.json().then(mapsJSON => {
        const duration = mapsJSON.rows[0].elements[0].duration_in_traffic.text
        fetch(functions.config().slack.webhookurl, {
          method: 'POST',
          body: JSON.stringify({text: `Heading home, be there in ${duration}`})
        })
        res.send(duration);
      }))
      .catch(e => {res.error(e)})
  } else {
    res.send(418)
  }
}

exports.timeInTraffic = functions.https.onRequest(timeInTraffic)
