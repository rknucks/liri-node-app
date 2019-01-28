require("dotenv").config();

// Importing files 
const fs = require("fs");
const keys = require('./keys.js');
const request = require('request');
const moment = require('moment');
    moment().format();
const Spotify = require('node-spotify-api');



const liriDo = process.argv[2];
const input = process.argv[3];

function commands (liriDo, input){
switch (liriDo) {
    case "concert-this":
    concertThis(input);
    break;

    case "spotify-this-song":
    getSong(input);
    break;

    case "movie-this":
    movieThis(input);
    break;

    case "do-what-it-says":
    getWhatever();
    break;

    //If user doesn't enter input, this is the default message on console
    default:
      console.log("No input recieved, please enter one of the following commands: 'spotify-this-song', 'movie-this', 'concert this', 'do-what-it-says' followed by 'your search'.");
    }
}

//concert-this function... bands in town api
function concertThis(band) {
    //If the user doesn't type a movie in, the console will show information for the movie 'Mr. Nobody.'
        if (!band) {
           console.log("No band or artist was entered.  Please enetr a band name");
        }  else 
            
    // Request to the bands-in-town API for specific artist
    var queryUrl = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";

    
    console.log(queryUrl);
        
    
    request(queryUrl, function(error, response, body) {

        // If no errors (if it works)
        if (!error && response.statusCode === 200) {
            

            
            let artistObject = JSON.parse(body);
            let artistResult  = 
            "------------------------------ begin ------------------------------" + "\r\n" +
            
            "Venue name " + artistObject.venue.name+"\r\n"+
            "Venue location " + artistObject.venue.city+"\r\n"+
            "Date of Event " +  moment(artistObject.datetime).format("MM/DD/YYYY")+"\r\n"+
            "------------------------------ end ------------------------------" + "\r\n";
            console.log(artistResult);
        };
    });
    };
	//Spotify-this-song function
function getSong(songName) {
    
    let spotify = new Spotify(keys.spotify);
    
    //If no song is provided, use "The Sign" 
        if (!songName) {
            songName = "The Sign";
        };        

        console.log(songName);

       
        spotify.search({ type: 'track', query: songName, limit: 10  }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } 
            console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url); 
            
            //Creates a variable to save text into log.txt file
            var logSong = "Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name +
            "\nAlbum Name: " + data.tracks.items[0].album.name + "\nPreview Link: " + data.tracks.items[0].preview_url + "\n";
            
            //Appends text to log.txt file
            fs.appendFile('log.txt', logSong, function (err) {
                if (err) throw err;
              });
            
            logResults(data);
        });
};

//movie-this function... OMDB api
function movieThis(movieName) {
    //If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
        if (!movieName) {
            movieName = "mr nobody";
        }
            
    // Request to the OMDB API for specific movie
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy";

    
    console.log(queryUrl);

    //OMDB API to get movie info
    request(queryUrl, function(error, response, body) {

        // If no errors (if it works)
        if (!error && response.statusCode === 200) {
            let movieObject = JSON.parse(body);

            //This is data that shows in the terminal
            let movieResults = 
            "------------------------------ begin ------------------------------" + "\r\n" +
            "Title: " + movieObject.Title+"\r\n"+
            "Year: " + movieObject.Year+"\r\n"+
            "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
            "Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
            "Country: " + movieObject.Country+"\r\n"+
            "Language: " + movieObject.Language+"\r\n"+
            "Plot: " + movieObject.Plot+"\r\n"+
            "Actors: " + movieObject.Actors+"\r\n"+
            "------------------------------ end ------------------------------" + "\r\n";
            console.log(movieResults);

            //Appends results to txt file
            fs.appendFile('log.txt', movieResults, function (err) {
                if (err) throw err;
              });
              console.log("Saved!");
              logResults(response);
        } 
        else {
			console.log("Error :"+ error);
			return;
		}
    });
};

//Function for do-what-it-says
function getWhatever(){
    //Reads text in random.txt file
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        else {
        console.log(data);

        //creates a variable for data in random.txt
        var randomData = data.split(",");
        
        commands(randomData[0], randomData[1]);
        }
        console.log("test" + randomData[0] + randomData[1]);
    });
};

//Function to log results from the other functions
function logResults(data){
    fs.appendFile("log.txt", data, function(err) {
      if (err)
          throw err;
    });
  };

  commands(liriDo, input);











        
