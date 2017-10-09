// Retrieves information within the keys.js file.
// keys.js contains twitter keys
var keys = require('./keys.js');

// variables for the different entities of the app
var fs = require('fs');
var prompt = require('prompt');
var Twitter = require('twitter')
var Spotify = require('node-spotify-api');
var request = require('request');


//variable containing plebian task option
var userInput = "";

//varibale containing plebian song or movie request
var userSelection = "";

//Variables for the specific options plebian can choose from
var theTweets = "my-tweets";
var music = "spotify-this-song";
var movies = "movie-this";


//Start Prompt
prompt.message = "Please type one of the following options: my-tweets, spotify-this-song, movie-this";

prompt.start();

	prompt.get({
		properties: {
		 userInput: {
		  description: 'What do you choose?'
			}
		}
	}, function(err, result){
		userInput = result.userInput; //based on what the user inputs different things are done

		//if user enters tweets it will run the myTwitter function
		if(userInput == theTweets){
			litTweets();
		} 
		//if the user enters spotify-this-song it will prompt you and ask for the song you want to look up and then it will run the mySpotify function based on those results. if the user doesnt enter a song it defaults to whats my age again and gets that information
		else if(userInput == music){
			prompt.get({
				properties: {
				 userSelection: {
				  description: 'What song do you want to look up?'
					}
				}
			}, function(err, result){

				if(result.userSelection === ""){
					userSelection = "what's my age again";
				} else{
					userSelection = result.userSelection;
				}
				mySpotify(userSelection);
			});
		} 
		// if the user selects movie it will prompt the user to state what movie they want to look up and then it will get that information from omdb api if the prompt is left blank the function will default and look up Mr Nobody and reutrn that information
		else if(userInput == movies){
			prompt.get({
				properties: {
				 userSelection: {
				  description: 'What movie do you want to look up?'
					}
				}
			}, function(err, result){
				if(result.userSelection === ""){
					userSelection = "Mr. Nobody";
				} else{
					userSelection = result.userSelection;
				}
				myMovies(userSelection);
			});
		};
	});

function litTweets(){

	//this assigns the variable client to get the information from the twitterKeys variable set above so we can access twitters information
	var client = new Twitter(keys);

	//object containing parameters for twitter call further in code
	var params = {
	screen_name: "nodejs"};

	client.get('statuses/user_timeline', params, function(error,tweets,response){
		if (!error) {
      	for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].created_at);
        console.log("");
        console.log(tweets[i].text);
      	}
	  }
	});
};

function mySpotify(userSelection){

	var spotify = new Spotify({
  	id: "a03f6dd425e74a9b9f4fab37fc80b1ab",
  	secret: "56f5b6999f3246c98174372d39810c82"});

	//this starts the search within spotify for the track and the query based on the userselection set in the if/else statement above.  if there is an error it throws the error and continues getting the information.  
	spotify.search({type: 'track', query: userSelection}, 
		function(err, data) {
	    if (err) {console.log("Error occurred: " + err);
        return;}
	    //this sets the variable music to get the initial information from the object, just so it's easier to call in the for loop below
		var music = data.tracks.items;
		//this loops through the object that we get from spotify and logs the following info
      	for (var i = 0; i < music.length; i++) {
	        console.log(i);
	        console.log("song name: " + music[i].name);
	        console.log("preview song: " + music[i].preview_url);
	        console.log("album: " + music[i].album.name);
	        console.log("====================================");
	      }
	});
} 

function myMovies(userSelection){
	

	//use request to access the omdb api and input the type variable that is defined above as the movie we are searching for
	request('http://www.omdbapi.com/?t='+userSelection+"&y=&plot=full&tomatoes=true&apikey=40e9cece", 
		function (error, response, body) {
		if (!error && response.statusCode === 200){
		//JSON.parse the body of the result and store it in the variable json for easier access
		json = JSON.parse(body);
		//console.log each of the different things we need to get from the omdb api and add a title for each item and use the colors npm to make the title name a different color than the result for better user access
		console.log('Title: ' + json.Title);
		console.log('Year: ' + json.Year);
		console.log('Country: ' + json.Country);
		console.log('Language: ' + json.Language);
		console.log('Actors: ' + json.Actors);
		console.log('Plot: ' + json.Plot);
		console.log('imdbRating: ' + json.imdbRating);
		console.log('Rotten Tomatoes Rating: ' + json.tomatoRating);
		}
	});
}

function appendFile(dataToAppend){

	//Output all that happens into a log.txt file
	fs.appendFile("log.txt", dataToAppend , function(err){

		//If an error happens while trying to write to the file
		if (err){
			return console.log(err);
		}
	});
}
