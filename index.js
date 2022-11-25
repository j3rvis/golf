require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

//User input sanitizer
app.use(require('sanitize').middleware);

// cors - allow connection from different domains and ports
app.use(cors());

// convert json string to json object (from request)
app.use(express.json());


// mongo here...
const mongoose = require("mongoose");
const { request, response } = require("express");
const mongoDB =
  "mongodb+srv://ac7686:" +
  process.env.PASSWORD +
  "@democluster.6t4fpix.mongodb.net/golf?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database test connected");
});

// Mongoose Scheema and Model here...
// Cards-scheema
const cardSchema = new mongoose.Schema({
  course_id: "string",
  player1_id: "string",
  player2_id: "string",
  player3_id: "string",
  player4_id: "string"
});

//Card-model
const Card = mongoose.model("Card", cardSchema, "cards");

// Routes here...

//Cards-collection routes
app.post("/cards", async (request, response) => {
  const card = new Card({
    course_id: request.body.course_id,
    player1_id: request.body.player1_id,
    player2_id: request.body.player2_id,
    player3_id: request.body.player3_id,
    player4_id: request.body.player4_id

  });
  const savedCard = await card.save();
  response.json(savedCard);
});

app.get("/cards", async (request, response) => {
  const cards = await Card.find({});
  response.json(cards);
});

app.get("/cards/:id", async (request, response) => {
  const card = await Card.findById(request.params.id);
  if (card) response.json(card);
  else response.status(404).end();
});

app.delete("/cards/:id", async (request, response) => {
  const deletedCard = await Card.findByIdAndRemove(request.params.id);
  if (deletedCard) response.json(deletedCard);
  else response.status(404).end();
});

// PUT/UPDATE by id
app.put("/cards/:id", async (request, response) => {
  const updatedCard = await Card.findByIdAndUpdate(
    request.params.id,
    request.body,
    {new: true}
  );
  response.json(updatedCard).end();
});


//------------------------------------------------------------------

//Players-schema
const playerSchema = new mongoose.Schema({
  name: "string",
  club: "string",
  age: "number"
})

//Player-model
const Player = mongoose.model("Player", playerSchema, "players")

//Players-colletion routes
// GET all
app.get("/players", async (request, response) => {
  const players = await Player.find({});
  response.json(players);
});


// GET one
app.get("/players/:id", async (request, response) => {
  const player = await Player.findById(request.params.id);
  if (player) response.json(player);
  else response.status(404).end();
});

// POST
app.post("/players", async (request, response) => {
  const player = new Player({
    name: request.body.name,
    club: request.body.club,
    age: request.body.age
  });
  const savedPlayer = await player.save();
  response.json(savedPlayer);
});

// DELETE
app.delete("/players/:id", async (request, response) => {
  const deletedPlayer = await Player.findByIdAndRemove(request.params.id);
  if (deletedPlayer) response.json(deletedPlayer);
  else response.status(404).end();
});

// PUT/UPDATE by id
app.put("/players/:id", async (request, response) => {
  const updatedPlayer = await Player.findByIdAndUpdate(
    request.params.id,
    request.body,
    {new: true}
  );
  response.json(updatedPlayer).end();
});


//-----------------------------------------------------------------------

//Course-schema
const courseSchema = new mongoose.Schema({
  name: "string",
  holes: "string",
  par: "number"
})

//Player-model
const Course = mongoose.model("Course", courseSchema, "courses")

//Course-collection routes
// GET all
app.get("/courses", async (request, response) => {
  const courses = await Course.find({});
  response.json(courses);
});

// GET one
app.get("/courses/:id", async (request, response) => {
  const course = await Course.findById(request.params.id);
  if (course) response.json(course);
  else response.status(404).end();
});

// POST
app.post("/courses", async (request, response) => {
  const course = new Course({
    name: request.body.name,
    holes: request.body.holes,
    par: request.body.par
  });
  const savedCourse = await course.save();
  response.json(savedCourse);
});

// PUT/UPDATE by id
app.put("/courses/:id", async (request, response) => {
  const updatedCourse = await Course.findByIdAndUpdate(
    request.params.id,
    request.body,
    {new: true}
  );
  response.json(updatedCourse).end();
});

//---------------------------------------------------------------

// app listen port 3000
app.listen(port, () => {
  console.log("Example app listening on port 3000");
});