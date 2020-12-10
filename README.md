# Orinoco #

This is the back end server for Project 6 of the Junior Web Developer path.

### Prerequisites ###

You will need to have Node and `npm` installed locally on your machine.

### Installation ###

Clone this repo. From within the project folder, run `npm install`. You 
can then run the server with `node server`. 
The server should run on `localhost` with default port `3000`. If the
server runs on another port for any reason, this is printed to the
console when the server starts, e.g. `Listening on port 3001`.

### Mandatory ###

Run `ng serve` on frontend file and `nodemon server` on backend file 
`.env` file should be created and filled with :
MONGO_URL_USER=mongodb+srv://User-SoPekocko:Sn0wb0ard@cluster0.zq6kf.mongodb.net/Cluster0?retryWrites=true&w=majority
MONGO_URL_ADMIN=mongodb+srv://Admin-SoPekocko:Sn0wb0ard@cluster0.zq6kf.mongodb.net/Cluster0?retryWrites=true&w=majority
TOKEN_USER=RANDOM_TOKEN_SECRET