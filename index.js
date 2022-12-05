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
//HUOM!! Vaatii vielä pelaajien tulosten kirjaamisen
const cardSchema = new mongoose.Schema({
  date: "string",
  course_id: "string",
  player1_id: "string",
  player2_id: "string",
  player3_id: "string",
  player4_id: "string",
  player1_s1: "string",
  player1_s2: "string",
  player1_s3: "string",
  player1_s4: "string",
  player1_s5: "string",
  player1_s6: "string",
  player1_s7: "string",
  player1_s8: "string",
  player1_s9: "string",
  player1_s10: "string",
  player1_s11: "string",
  player1_s12: "string",
  player1_s13: "string",
  player1_s14: "string",
  player1_s15: "string",
  player1_s16: "string",
  player1_s17: "string",
  player1_s18: "string",
  player2_s1: "string",
  player2_s2: "string",
  player2_s3: "string",
  player2_s4: "string",
  player2_s5: "string",
  player2_s6: "string",
  player2_s7: "string",
  player2_s8: "string",
  player2_s9: "string",
  player2_s10: "string",
  player2_s11: "string",
  player2_s12: "string",
  player2_s13: "string",
  player2_s14: "string",
  player2_s15: "string",
  player2_s16: "string",
  player2_s17: "string",
  player2_s18: "string",
  player3_s1: "string",
  player3_s2: "string",
  player3_s3: "string",
  player3_s4: "string",
  player3_s5: "string",
  player3_s6: "string",
  player3_s7: "string",
  player3_s8: "string",
  player3_s9: "string",
  player3_s10: "string",
  player3_s11: "string",
  player3_s12: "string",
  player3_s13: "string",
  player3_s14: "string",
  player3_s15: "string",
  player3_s16: "string",
  player3_s17: "string",
  player3_s18: "string",
  player4_s1: "string",
  player4_s2: "string",
  player4_s3: "string",
  player4_s4: "string",
  player4_s5: "string",
  player4_s6: "string",
  player4_s7: "string",
  player4_s8: "string",
  player4_s9: "string",
  player4_s10: "string",
  player4_s11: "string",
  player4_s12: "string",
  player4_s13: "string",
  player4_s14: "string",
  player4_s15: "string",
  player4_s16: "string",
  player4_s17: "string",
  player4_s18: "string"
});

//Card-model
const Card = mongoose.model("Card", cardSchema, "cards");

// Routes here...

//Cards-collection routes
app.post("/cards", async (request, response) => {
  const card = new Card({
    date: request.body.date,
    course_id: request.body.course_id,
    player1_id: request.body.player1_id,
    player2_id: request.body.player2_id,
    player3_id: request.body.player3_id,
    player4_id: request.body.player4_id,
    player1_s1: request.body.player1_s1,
    player1_s2: request.body.player1_s2,
    player1_s3: request.body.player1_s3,
    player1_s4: request.body.player1_s4,
    player1_s5: request.body.player1_s5,
    player1_s6: request.body.player1_s6,
    player1_s7: request.body.player1_s7,
    player1_s8: request.body.player1_s8,
    player1_s9: request.body.player1_s9,
    player1_s10: request.body.player1_s10,
    player1_s11: request.body.player1_s11,
    player1_s12: request.body.player1_s12,
    player1_s13: request.body.player1_s13,
    player1_s14: request.body.player1_s14,
    player1_s15: request.body.player1_s15,
    player1_s16: request.body.player1_s16,
    player1_s17: request.body.player1_s17,
    player1_s18: request.body.player1_s18,
    player2_s1: request.body.player2_s1,
    player2_s2: request.body.player2_s2,
    player2_s3: request.body.player2_s3,
    player2_s4: request.body.player2_s4,
    player2_s5: request.body.player2_s5,
    player2_s6: request.body.player2_s6,
    player2_s7: request.body.player2_s7,
    player2_s8: request.body.player2_s8,
    player2_s9: request.body.player2_s9,
    player2_s10: request.body.player2_s10,
    player2_s11: request.body.player2_s11,
    player2_s12: request.body.player2_s12,
    player2_s13: request.body.player2_s13,
    player2_s14: request.body.player2_s14,
    player2_s15: request.body.player2_s15,
    player2_s16: request.body.player2_s16,
    player2_s17: request.body.player2_s17,
    player2_s18: request.body.player2_s18,
    player3_s1: request.body.player3_s1,
    player3_s2: request.body.player3_s2,
    player3_s3: request.body.player3_s3,
    player3_s4: request.body.player3_s4,
    player3_s5: request.body.player3_s5,
    player3_s6: request.body.player3_s6,
    player3_s7: request.body.player3_s7,
    player3_s8: request.body.player3_s8,
    player3_s9: request.body.player3_s9,
    player3_s10: request.body.player3_s10,
    player3_s11: request.body.player3_s11,
    player3_s12: request.body.player3_s12,
    player3_s13: request.body.player3_s13,
    player3_s14: request.body.player3_s14,
    player3_s15: request.body.player3_s15,
    player3_s16: request.body.player3_s16,
    player3_s17: request.body.player3_s17,
    player3_s18: request.body.player3_s18,
    player4_s1: request.body.player4_s1,
    player4_s2: request.body.player4_s2,
    player4_s3: request.body.player4_s3,
    player4_s4: request.body.player4_s4,
    player4_s5: request.body.player4_s5,
    player4_s6: request.body.player4_s6,
    player4_s7: request.body.player4_s7,
    player4_s8: request.body.player4_s8,
    player4_s9: request.body.player4_s9,
    player4_s10: request.body.player4_s10,
    player4_s11: request.body.player4_s11,
    player4_s12: request.body.player4_s12,
    player4_s13: request.body.player4_s13,
    player4_s14: request.body.player4_s14,
    player4_s15: request.body.player4_s15,
    player4_s16: request.body.player4_s16,
    player4_s17: request.body.player4_s17,
    player4_s18: request.body.player4_s18
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
  h1: "number",
  h2: "number",
  h3: "number",
  h4: "number",
  h5: "number",
  h6: "number",
  h7: "number",
  h8: "number",
  h9: "number",
  h10: "number",
  h11: "number",
  h12: "number",
  h13: "number",
  h14: "number",
  h15: "number",
  h16: "number",
  h17: "number",
  h18: "number"
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
    h1: request.body.h1, 
    h2: request.body.h2,
    h3: request.body.h3,
    h4: request.body.h4,
    h5: request.body.h5,
    h6: request.body.h6,
    h7: request.body.h7,
    h8: request.body.h8,
    h9: request.body.h9, 
    h10: request.body.h10, 
    h11: request.body.h11, 
    h12: request.body.h12, 
    h13: request.body.h13, 
    h14: request.body.h14, 
    h15: request.body.h15, 
    h16: request.body.h16, 
    h17: request.body.h17,
    h18: request.body.h18
  });
  const savedCourse = await course.save();
  response.json(savedCourse);
});

// DELETE
app.delete("/courses/:id", async (request, response) => {
  const deletedCourse = await Course.findByIdAndRemove(request.params.id);
  if (deletedCourse) response.json(deletedCourse);
  else response.status(404).end();
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