const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const https = require("https");
const { log } = require("console");

                    // If user not specified any movie name then all this movies details in the varible will be shown //
const movies = ["Christopher", "Ravanasura", "Chor Nikal Ke Bhaaga", "Thiruvin Kural", "Jung_E", "Mission Majnu", "Custody", "Server Sundaram", "Server Sundaram", "Virupaksha", "My Fault", "IB71", "Takkar", "Dasara", "Ponniyin Selvan: II", "Waltair Veerayya", "Bholaa", "Kranti","Vaathi", "Extraction 2"];
                    //For Authentication, with these api keys or any other api keys added newly to this variable can access data
const apiKeys = ["5701759b", "3949138h", "9823746s", "43984783r"]

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let movieData = "";
let moviesData = {};

                                                  // Requests Targetting all Moives //

app.get("/movies/:key", function(req, res){

    apik = req.params.key;
                // Validating wether the user entered api key present in our data or not 
    if(apiKeys.includes(apik)){
                // If the user entered api key is available, we will further proceed
    for(var i=0;i<movies.length;i++){
        // It will iterate upto length of the array times and url will be changed every time and movie name is added last to it.
        let url = "https://www.omdbapi.com/?apikey=5701759b&t="+movies[i];

        https.get(url, function(response){
            
            response.on("data", function(data){

                movieData = JSON.parse(data);
                let obj = {
                    Title: movieData.Title,
                    Year: movieData.Year,
                    Released: movieData.Released,
                    Runtime: movieData.Runtime,
                    Genre: movieData.Genre,
                    Director: movieData.Director,
                    Actors: movieData.Actors,
                    Language: movieData.Language,
                }
                moviesData[movieData.Title] = obj;
                movieData = 0;
                obj = {};
            });
        })
    }
    res.send(moviesData);
}
else{
    // If the user entered api key is wrong
    // Send Error 401 message
    res.send("401 Unauthorized Access");
}
});

                            // Requests Targetting a Specific Moive //

app.get("/movies/:movieName/:key", function(req, res){

    apik = req.params.key;
                  // Validating wether the user entered api key present in our data or not 

    if(apiKeys.includes(apik)){
                // If the user entered api key is available, we will further proceed

    user_entered_movie = req.params.movieName;
    let url = "https://www.omdbapi.com/?apikey=5701759b&t="+user_entered_movie;
    https.get(url, function(response){

        const chunks = []
        response.on("data", function(chunk){
            chunks.push(chunk);
        });

        response.on("end", function () {
            const data = Buffer.concat(chunks)
            movieData = JSON.parse(data)
            let obj = {
                Title: movieData.Title,
                Year: movieData.Year,
                Released: movieData.Released,
                Runtime: movieData.Runtime,
                Genre: movieData.Genre,
                Director: movieData.Director,
                Actors: movieData.Actors,
                Language: movieData.Language,
            }

            res.send(JSON.stringify(obj));

          });
    });
}
else{
        // If the user entered api key is wrong
        // return 401 message
    res.send("401 Unauthorized Access");
}
});


app.listen(3000, function(){
    console.log("Sever is running on port 3000");
});
