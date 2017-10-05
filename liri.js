// Retrieves information within the keys.js file.
// keys.js contains twitter keys
var keys = require('./keys.js');
var twitKey = keys.twitterKeys;

// variables for the different entities of the app
var fs = require('fs');
var prompt = require('prompt');
var twit = require('twitter');
var spot = require('spotify');
var request = require('request');

//variable containing plebian task option
var plebInput = "";

//varibale containing plebian song or movie request
var userChoice = "";

//Variables for the specific options plebian can choose from
var theTweets = "tweets";
var music = "spotify-this-song";
var movies = "movie";

//Start Prompt
prompt.message = "Please type one of the following options: tweets, spotify-this-song, movie";

prompt.start();

	prompt.get({
		properties: {
			plebInput: {
				description: 'What do you choose?'
			}
		}
	}, function(err, result){
		plebInput = result.userInput; //based on what the user inputs different things are done

		//if user enters tweets it will run the myTwitter function
		if(plebInput == theTweets){
			myTwitter();
		} 
		//if the user enters spotify-this-song it will prompt you and ask for the song you want to look up and then it will run the mySpotify function based on those results. if the user doesnt enter a song it defaults to whats my age again and gets that information
		else if(plebInput == music){
			prompt.get({
				properties: {
					userChoice: {
						description: 'What song do you want to look up?'
					}
				}
			}, function(err, result){

				if(result.userChoice === ""){
					userChoice = "what's my age again";
				} else{
					userChoice = result.userChoice;
				}
				mySpotify(userChoice);
			});
		} 
		// if the user selects movie it will prompt the user to state what movie they want to look up and then it will get that information from omdb api if the prompt is left blank the function will default and look up Mr Nobody and reutrn that information
		else if(plebInput == movies){
			prompt.get({
				properties: {
					userChoice: {
						description: 'What movie do you want to look up?'
					}
				}
			}, function(err, result){
				if(result.userChoice === ""){
					userChoice = "Mr. Nobody";
				} else{
					userChoice = result.userChoice;
				}
				myMovies(userChoice);
			});
		};
	});



