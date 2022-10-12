var express = require("express")
var app = express()
var bodyParser = require("body-parser")
const axios = require("axios");
const API_KEY = process.env.API_KEY;
const request = require('request');
require('dotenv').config();

app.use(bodyParser.json()) 
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
) 


app.post("/new-message", function(req, res) {
	const { message } = req.body
	// if (!message || message.text.toLowerCase().indexOf("marco") < 0) {
	// 	return res.end()
	// }

	const title=message.text;

    request(`http://www.omdbapi.com/?t=${title}&apikey=5ee02ed2`, function (error, response, body) {
		if(error) {

			console.error('error:', error);
			axios
			.post(
				`https://api.telegram.org/bot${API_KEY}/sendMessage`,
				{
					chat_id: message.chat.id,
					text: `No movie found`,
				}
			)
			.then((response) => {
				
				console.log("Message posted")
				res.end("ok")
			})
			.catch((err) => {
		
				console.log("Error :", err)
				res.end("Error :" + err)
			});

		}else{
			console.log('statusCode:', response && response.statusCode); 
			console.log('body:',body); 

			const data = JSON.parse(body);

			if(data.Response==='False'){

				axios
			.post(
				`https://api.telegram.org/bot${API_KEY}/sendMessage`,
				{
					chat_id: message.chat.id,
					text: `No movie found`,
				}
			)
			.then((response) => {
				
				console.log("Message posted")
				res.end("ok")
			})
			.catch((err) => {
		
				console.log("Error :", err)
				res.end("Error :" + err)
			});

			}else{
				axios
				.post(
					`https://api.telegram.org/bot${API_KEY}/sendMessage`,
					{
						chat_id: message.chat.id,
						text: `Title: ${data.Title}
							   Year:  ${data.Year}
							   Released:${data.Released}
							   Runtime:${data.Runtime}
							   Genre:${data.Genre}
							   Director:${data.Director}
							   Writer:${data.Writer}
							   Actors:${data.Actors}
							   Country:${data.Country}
							   Language:${data.Language}
								---------------------------------------------------------------------------------------
							   Plot:${data.Plot}
								---------------------------------------------------------------------------------------							Poster:${data.Poster}
							  `,
					}
				)
				.then((response) => {
					
					console.log("Message posted")
					res.end("ok")
				})
				.catch((err) => {
			
					console.log("Error :", err)
					res.end("Error :" + err)
				});
			}

		}
      });







	
});
app.listen(3000, function() {
	console.log("Telegram app listening on port 3000!")
})