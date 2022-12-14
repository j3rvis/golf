const fectch_address_players = "http://localhost:3000/players";
const fectch_address_courses = "http://localhost:3000/courses";
const fectch_address_scorecards = "http://localhost:3000/cards";


//This function setup elements for default values and tricker queries from database
function init() {
  let select_player = document.getElementById("select_player");
  let option_player = document.createElement("option");
  option_player.innerHTML = "Ladataan pelaajia...";
  select_player.appendChild(option_player);
  loadPlayers();

  let select_course = document.getElementById("select_course");
  let option_course = document.createElement("option");
  option_course.innerHTML = "Ladataan ratoja...";
  select_course.appendChild(option_course);
  loadCourses();

  let select_scorecard = document.getElementById("select_scorecard");
  let option_scorecard = document.createElement("option");
  option_scorecard.innerHTML = "Ladataan kierroskortteja...";
  select_scorecard.appendChild(option_scorecard);
  //--------------------------------------------------------------
  let select_scorecard_course = document.getElementById("select_scorecard_course");
  let option_select_scorecard_course = document.createElement("option");
  option_select_scorecard_course.innerHTML = "Valitse kierroskortti";
  select_scorecard_course.appendChild(option_select_scorecard_course);
  //--------------------------------------------------------------
  let player1 = document.getElementById("player1");
  let option_player1 = document.createElement("option");
  option_player1.innerHTML = "Valitse Pelaaja";
  player1.appendChild(option_player1);
  //--------------------------------------------------------------
  let player2 = document.getElementById("player2");
  let option_player2 = document.createElement("option");
  option_player2.innerHTML = "Valitse Pelaaja";
  player2.appendChild(option_player2);
  //--------------------------------------------------------------
  let player3 = document.getElementById("player3");
  let option_player3 = document.createElement("option");
  option_player3.innerHTML = "Valitse Pelaaja";
  player3.appendChild(option_player3);
  //--------------------------------------------------------------
  let player4 = document.getElementById("player4");
  let option_player4 = document.createElement("option");
  option_player4.innerHTML = "Valitse Pelaaja";
  player4.appendChild(option_player4);
  //--------------------------------------------------------------
  loadScorecards();

  
}

//Players----------------------------------------------------------------------
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------


//This functions function query players database and add eventListeners for UI
async function loadPlayers() {
  let add_player_button = document.getElementById("add_player_button");
  add_player_button.addEventListener("click", addPlayer);
  let edit_player_button = document.getElementById("edit_player_button");
  edit_player_button.addEventListener("click", editPlayer);
  let del_player_button = document.getElementById("del_player_button");
  del_player_button.addEventListener("click", removePlayer);
  let response_all = await fetch(fectch_address_players);
  let players = await response_all.json();
  showPlayers(players);
  // setupScorecardPlayers(players);
}


//Create single option-element and returns it for showPlayers function where its called
async function createPlayerSelectItem(player) {
  let option = document.createElement("option");
  let option_attr = document.createAttribute("id");
  option_attr.value = player._id;
  option.setAttributeNode(option_attr);
  let option_value = document.createAttribute("value");
  option_value.value = player._id;
  option.setAttributeNode(option_value);
  let name = document.createTextNode(player.name);
  option.appendChild(name);
  return option;
}

//Append data for select-element for players also provides data further for player selection in scorecard
function showPlayers(players) {
  let select_player = document.getElementById("select_player");
  // no players
  if (players.length === 0) {
    select_player.firstChild.textContent = "Ei pelaajia";

    let empty_attr = document.createAttribute('id')
    empty_attr.value = 'empty_player'
    select_player.firstChild.setAttributeNode(empty_attr)
  } else {
    players.forEach((player) => {
      Promise.resolve(createPlayerSelectItem(player)).then((value) => {
        select_player.appendChild(value);

      });
    })
    //remove placeholder option
    select_player.removeChild(select_player.firstChild)
    player1_players(players)
    player2_players(players)
    player3_players(players)
    player4_players(players)
  }
}


//Still in development level!!!! This would show player data as info under select player
/* async function showPlayerInfo(id){
  // clearPlayerInfo();
  let player_info = document.getElementById('player_info')
  let response = await fetch(fectch_address_players+'/'+id)
  let player = await response.json()
  let li_name = document.createElement('li')
  li_name.textContent = player.name
  player_info.appendChild(li_name)
  let li_club = document.createElement('li')
  li_club.textContent = player.club
  player_info.appendChild(li_club)
  let li_age = document.createElement('li')
  li_age.textContent =  player.age
  player_info.appendChild(li_age)
}

function clearPlayerInfo(){
  
} */


//Get data from UI and send it to database as player
async function addPlayer() {
  let newPlayerName = document.getElementById("input_player_name");
  let newPlayerClub = document.getElementById("input_player_club");
  let newPlayerAge = document.getElementById("input_player_age");
  const data = {
    name: newPlayerName.value,
    club: newPlayerClub.value,
    age: newPlayerAge.value,
  };
  //Statement for not allowing adding "empty" players
  if (newPlayerName.value != "") {
    const response = await fetch(fectch_address_players, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let player = await response.json();
    let select_player = document.getElementById("select_player");
    Promise.resolve(createPlayerSelectItem(player)).then((option) => {
      select_player.appendChild(option);
    });
    if(select_player.firstChild.innerHTML == 'Ei pelaajia'){
      let empty_option = document.getElementById('empty_player')
      empty_option.parentNode.removeChild(empty_option)
    }

    newPlayerName.value = "";
    newPlayerClub.value = "";
    newPlayerAge.value = "";
  }
}

//Removes player from database
async function removePlayer() {
  let select_player = document.getElementById("select_player");
  let player_id = select_player.value;
  if(player_id != 'Ei pelaajia'){
  const response = await fetch(fectch_address_players + "/" + player_id, {
    method: "DELETE",
  });
  let responseJson = await response.json();
  let option = document.getElementById(player_id);
  option.parentNode.removeChild(option);
  }
  if (!select_player.hasChildNodes()) {
    let placeholder_option = document.createElement("option");
    placeholder_option.innerHTML = "Ei pelaajia";
    let placeholder_id = document.createAttribute('id')
    placeholder_id.value = 'empty_player';
    placeholder_option.setAttributeNode(placeholder_id)
    select_player.appendChild(placeholder_option);
  }
}


//This function queries data from editable player and change UI to modify data. After User has modified data and press "Tallenna". Data will queried for database.
//This is paired with updatePlayer function
async function editPlayer() {

  //Haetaan tietokannasta valitun pelaajan tiedot
  let select_player = document.getElementById("select_player");
  let player_id = select_player.value;
  let response = await fetch(fectch_address_players+'/'+player_id)
  let player = await response.json()

  //Lukitaan muokattava pelaaja k??ytt??liittym??st??
  let disabled = document.createAttribute("disabled");
  select_player.setAttributeNode(disabled);

  //Muokataan k??ytt??liittym??n lis????-painike -> tallenna-painikkeeksi
  let player_save = document.getElementById("add_player_button");
  player_save.innerHTML = "Tallenna";
  let class_edit = document.createAttribute("class");
  class_edit.value = "edit";
  player_save.setAttributeNode(class_edit);
  player_save.removeEventListener("click", addPlayer)
  player_save.addEventListener("click", updatePlayer)

  //Lis??t????n tietokannasta haetut tiedot input fieldelleille
  let player_name = document.getElementById("input_player_name");
  player_name.value = player.name
  let player_club = document.getElementById("input_player_club");
  player_club.value = player.club
  let player_age = document.getElementById("input_player_age");
  player_age.value = player.age
}

//See editPlayer description
async function updatePlayer(){
  let select_player = document.getElementById('select_player')
  select_player.removeAttribute('disabled')
  let id = select_player.value
  let name = document.getElementById('input_player_name')
  let club = document.getElementById('input_player_club')
  let age = document.getElementById('input_player_age')

  let data = {
    'name': name.value,
    'club': club.value,
    'age': age.value,
  }

  let response = await fetch(fectch_address_players+'/'+id, {
    method: 'PUT',
    headers:{'content-type': 'application/json'},
    body: JSON.stringify(data)
  })

  let response_update = await response.json()
  
  let updatedPlayer = document.getElementById(id)
  updatedPlayer.textContent = response_update.name

  name.value = ''
  club.value = ''
  age.value = '';

  let updateButton = document.getElementById('add_player_button')
  updateButton.textContent = 'Lis????'
  updateButton.removeEventListener("click", updatePlayer)
  updateButton.addEventListener("click", addPlayer)
  updateButton.removeAttribute("class")
}


//Courses-------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

//Query courses from database and provides that data for showCourses function. Also add eventListeners for course-part buttons.
async function loadCourses() {
  let add_button = document.getElementById("add_course_button");
  add_button.addEventListener("click", addCourse);
  let edit_button = document.getElementById("edit_course_button");
  edit_button.addEventListener("click", editCourse);
  let del_button = document.getElementById("del_course_button");
  del_button.addEventListener("click", removeCourse);
  let response = await fetch(fectch_address_courses);
  let courses = await response.json();
  showCourses(courses);
}

//Crete single course option-element for select_course-element
async function createCourseSelectItem(course) {
  let option = document.createElement("option");
  let option_attr = document.createAttribute("id");
  option_attr.value = course._id;
  option.setAttributeNode(option_attr);
  let option_value = document.createAttribute("value");
  option_value.value = course._id;
  option.setAttributeNode(option_value);
  let name = document.createTextNode(course.name);
  option.appendChild(name);
  return option;
}

//Appends queried data for select_course-element and provides it also for coursecard_course_selection
function showCourses(courses) {
  let select_course = document.getElementById("select_course");
  // no courses
  if (courses.length === 0) {
    select_course.firstChild.textContent = "Ei ratoja";
    let empty_attr = document.createAttribute('id')
    empty_attr.value = 'empty_course'
    select_course.firstChild.setAttributeNode(empty_attr)
  } else {
    
    courses.forEach((course) => {
      Promise.resolve(createCourseSelectItem(course)).then((value) => {
        select_course.appendChild(value);
      });
    })
    //remove placeholder option
    select_course.removeChild(select_course.firstChild)
    scorecardCourses(courses)
  }
}


//Get user added data from UI and post it to database as course
async function addCourse() {
  let newCourseName = document.getElementById("input_course_name");
  let newCourseHoles = document.getElementById('holes')
  const data = {
    name: newCourseName.value,
    h1: newCourseHoles.children[1].firstChild.textContent, 
    h2: newCourseHoles.children[2].firstChild.textContent,
    h3: newCourseHoles.children[3].firstChild.textContent,
    h4: newCourseHoles.children[4].firstChild.textContent,
    h5: newCourseHoles.children[5].firstChild.textContent,
    h6: newCourseHoles.children[6].firstChild.textContent,
    h7: newCourseHoles.children[7].firstChild.textContent,
    h8: newCourseHoles.children[8].firstChild.textContent,
    h9: newCourseHoles.children[9].firstChild.textContent, 
    h10: newCourseHoles.children[10].firstChild.textContent, 
    h11:newCourseHoles.children[11].firstChild.textContent, 
    h12: newCourseHoles.children[12].firstChild.textContent, 
    h13: newCourseHoles.children[13].firstChild.textContent, 
    h14: newCourseHoles.children[14].firstChild.textContent, 
    h15: newCourseHoles.children[15].firstChild.textContent, 
    h16: newCourseHoles.children[16].firstChild.textContent, 
    h17: newCourseHoles.children[17].firstChild.textContent,
    h18: newCourseHoles.children[18].firstChild.textContent
  };
  //Ehto, ett?? tyhj???? pelaajaa voi lis??t??
  if (newCourseName.value != "") {
    const response = await fetch(fectch_address_courses, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let course = await response.json();
    let select_course = document.getElementById("select_course");
    Promise.resolve(createCourseSelectItem(course)).then((option) => {
      select_course.appendChild(option);
    });
    if(select_course.firstChild.innerHTML == 'Ei ratoja'){
      let empty_option = document.getElementById('empty_course')
      empty_option.parentNode.removeChild(empty_option)
    }
    newCourseName.value = "";
    newCourseHoles.children[1].firstChild.textContent = "";
    newCourseHoles.children[2].firstChild.textContent = "";
    newCourseHoles.children[3].firstChild.textContent = "";
    newCourseHoles.children[4].firstChild.textContent = "";
    newCourseHoles.children[5].firstChild.textContent = "";
    newCourseHoles.children[6].firstChild.textContent = "";
    newCourseHoles.children[7].firstChild.textContent = "";
    newCourseHoles.children[8].firstChild.textContent = "";
    newCourseHoles.children[9].firstChild.textContent = "";
    newCourseHoles.children[10].firstChild.textContent = "";
    newCourseHoles.children[11].firstChild.textContent = "";
    newCourseHoles.children[12].firstChild.textContent = "";
    newCourseHoles.children[13].firstChild.textContent = "";
    newCourseHoles.children[14].firstChild.textContent = "";
    newCourseHoles.children[15].firstChild.textContent = "";
    newCourseHoles.children[16].firstChild.textContent = "";
    newCourseHoles.children[17].firstChild.textContent = "";
    newCourseHoles.children[18].firstChild.textContent = "";
  }
}



//Removes course from database
async function removeCourse() {
  let select_course = document.getElementById("select_course");
  let course_id = select_course.value;
  if(course_id != 'Ei pelaajia'){
  const response = await fetch(fectch_address_courses + "/" + course_id, {
    method: "DELETE",
  });
  let responseJson = await response.json();
  let option = document.getElementById(course_id);
  option.parentNode.removeChild(option);
  }
  if (!select_course.hasChildNodes()) {
    let placeholder_option = document.createElement("option");
    placeholder_option.innerHTML = "Ei ratoja";
    let placeholder_id = document.createAttribute('id')
    placeholder_id.value = 'empty_course';
    placeholder_option.setAttributeNode(placeholder_id)
    select_course.appendChild(placeholder_option);
  }
}


//This function queries data from editable course and change UI to modify data. After User has modified data and press "Tallenna". Data will queried for database.
//This is paired with updateCourse function
async function editCourse() {

  //Haetaan tietokannasta valitun pelaajan tiedot
  let select_course = document.getElementById("select_course");
  let course_id = select_course.value;
  let response = await fetch(fectch_address_courses+'/'+course_id)
  let course = await response.json()

  //Lukitaan muokattava pelaaja k??ytt??liittym??st??
  let disabled = document.createAttribute("disabled");
  select_course.setAttributeNode(disabled);

  //Muokataan k??ytt??liittym??n lis????-painike -> tallenna-painikkeeksi
  let course_save = document.getElementById("add_course_button");
  course_save.innerHTML = "Tallenna";
  let class_edit = document.createAttribute("class");
  class_edit.value = "edit";
  course_save.setAttributeNode(class_edit);
  course_save.removeEventListener("click", addCourse)
  course_save.addEventListener("click", updateCourse)

  //Lis??t????n tietokannasta haetut tiedot input fieldelleille
  let course_name = document.getElementById("input_course_name");
  course_name.value = course.name
  let course_holes = document.getElementById("holes");
  course_holes.children[1].firstChild.textContent = course.h1
  course_holes.children[2].firstChild.textContent = course.h2
  course_holes.children[3].firstChild.textContent = course.h3
  course_holes.children[4].firstChild.textContent = course.h4
  course_holes.children[5].firstChild.textContent = course.h5
  course_holes.children[6].firstChild.textContent = course.h6
  course_holes.children[7].firstChild.textContent = course.h7
  course_holes.children[8].firstChild.textContent = course.h8
  course_holes.children[9].firstChild.textContent = course.h9
  course_holes.children[10].firstChild.textContent = course.h10
  course_holes.children[11].firstChild.textContent = course.h11
  course_holes.children[12].firstChild.textContent = course.h12
  course_holes.children[13].firstChild.textContent = course.h13
  course_holes.children[14].firstChild.textContent = course.h14
  course_holes.children[15].firstChild.textContent = course.h15
  course_holes.children[16].firstChild.textContent = course.h16
  course_holes.children[17].firstChild.textContent = course.h17
  course_holes.children[18].firstChild.textContent = course.h18
}


//see editCourse
async function updateCourse(){
  let select_course = document.getElementById('select_course')
  select_course.removeAttribute('disabled')
  let id = select_course.value
  let name = document.getElementById('input_course_name')
  let holes = document.getElementById("holes");

  let data = {
    'name': name.value,
    'h1': holes.children[1].firstChild.textContent,
    'h2': holes.children[2].firstChild.textContent,
    'h3': holes.children[3].firstChild.textContent,
    'h4': holes.children[4].firstChild.textContent,
    'h5': holes.children[5].firstChild.textContent,
    'h6': holes.children[6].firstChild.textContent,
    'h7': holes.children[7].firstChild.textContent,
    'h8': holes.children[8].firstChild.textContent,
    'h9': holes.children[9].firstChild.textContent,
    'h10': holes.children[10].firstChild.textContent,
    'h11': holes.children[11].firstChild.textContent,
    'h12': holes.children[12].firstChild.textContent,
    'h13': holes.children[13].firstChild.textContent,
    'h14': holes.children[14].firstChild.textContent,
    'h15': holes.children[15].firstChild.textContent,
    'h16': holes.children[16].firstChild.textContent,
    'h17': holes.children[17].firstChild.textContent,
    'h18': holes.children[18].firstChild.textContent
  }

  let response = await fetch(fectch_address_courses+'/'+id, {
    method: 'PUT',
    headers:{'content-type': 'application/json'},
    body: JSON.stringify(data)
  })

  let response_update = await response.json()
  
  let updatedCourse = document.getElementById(id)
  updatedCourse.textContent = response_update.name

  name.value = ''
  holes.children[1].firstChild.textContent = ""
  holes.children[2].firstChild.textContent = ""
  holes.children[3].firstChild.textContent = ""
  holes.children[4].firstChild.textContent = ""
  holes.children[5].firstChild.textContent = ""
  holes.children[6].firstChild.textContent = ""
  holes.children[7].firstChild.textContent = ""
  holes.children[8].firstChild.textContent = ""
  holes.children[9].firstChild.textContent = ""
  holes.children[10].firstChild.textContent = ""
  holes.children[11].firstChild.textContent = ""
  holes.children[12].firstChild.textContent = ""
  holes.children[13].firstChild.textContent = ""
  holes.children[14].firstChild.textContent = ""
  holes.children[15].firstChild.textContent = ""
  holes.children[16].firstChild.textContent = ""
  holes.children[17].firstChild.textContent = ""
  holes.children[18].firstChild.textContent = ""

  let updateButton = document.getElementById('add_course_button')
  updateButton.textContent = 'Lis????'
  updateButton.removeEventListener("click", updateCourse)
  updateButton.addEventListener("click", addCourse)
  updateButton.removeAttribute("class")
}


//Score card starts here...---------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------



//This function query scorecards from database provides it to showScorecards funtion and add eventlisteners for buttons in scorecard section
async function loadScorecards() {
  let add_scorecard_button = document.getElementById("save_scorecard_button");
  add_scorecard_button.addEventListener("click", addScorecard);
  let edit_scorecard_button = document.getElementById("edit_scorecard_button");
  edit_scorecard_button.addEventListener("click", editScorecard);
  let del_scorecard_button = document.getElementById("del_scorecard_button");
  del_scorecard_button.addEventListener("click", removeScorecard);
  let response_all = await fetch(fectch_address_scorecards);
  let scorecards = await response_all.json();
  showScorecards(scorecards);
}


//Creates single scorecard for scorecard select
async function createScorecardSelectItem(scorecard) {
  let option = document.createElement("option");
  let option_attr = document.createAttribute("id");
  option_attr.value = scorecard._id;
  option.setAttributeNode(option_attr);
  let option_value = document.createAttribute("value");
  option_value.value = scorecard._id;
  option.setAttributeNode(option_value);
  let date_value = document.createTextNode(scorecard.date);
  option.appendChild(date_value);
  return option;
}

//Append queried scorecards to select_scorecard-element as option-elements
function showScorecards(scorecards) {
  let select_scorecard = document.getElementById("select_scorecard");
  // no scorecards
  if (scorecards.length === 0) {
    select_scorecard.firstChild.textContent = "Ei kierroskortteja";
    let empty_attr = document.createAttribute('id')
    empty_attr.value = 'empty_scorecard'
    select_scorecard.firstChild.setAttributeNode(empty_attr)
  } else {
    scorecards.forEach((scorecard) => {
      Promise.resolve(createScorecardSelectItem(scorecard)).then((value) => {
        select_scorecard.appendChild(value);
      });
    })
    //remove placeholder option
    select_scorecard.removeChild(select_scorecard.firstChild)
  }
}


//Append queried courses for "select_course_for_scorecard-element"
//Also add eventlistener for changed value for same element
async function scorecardCourses(courses) {
  let select_scorecard_course = document.getElementById("select_scorecard_course");

  // no courses
  if (courses.length === 0) {
    select_scorecard_course.firstChild.textContent = "Ei ratoja";
    let empty_attr = document.createAttribute('id')
    empty_attr.value = 'empty_course'
    select_scorecard_course.firstChild.setAttributeNode(empty_attr)
  } else {
    
    courses.forEach((course) => {
      Promise.resolve(createCourseSelectItem(course)).then((value) => {
        select_scorecard_course.appendChild(value);
      });
    })
    //remove placeholder option
    // select_scorecard_course.removeChild(select_scorecard_course.firstChild)

    select_scorecard_course.addEventListener("change", () => {
          changePar();
      });
  }
}


//This function queries course data and place it to cells in PAR-row when "select_course_for_scorecard" state changes
async function changePar (){
  let select_scorecard_course = document.getElementById("select_scorecard_course");
  let id = select_scorecard_course.value
  if(id != 'Valitse kierroskortti'){
  let response = await fetch(fectch_address_courses+'/'+id)
  let par = await response.json()
  let scorecard_par = document.getElementById('scorecard_par')
  scorecard_par.children[1].firstChild.textContent = par.h1
  scorecard_par.children[2].firstChild.textContent = par.h2
  scorecard_par.children[3].firstChild.textContent = par.h3
  scorecard_par.children[4].firstChild.textContent = par.h4
  scorecard_par.children[5].firstChild.textContent = par.h5
  scorecard_par.children[6].firstChild.textContent = par.h6
  scorecard_par.children[7].firstChild.textContent = par.h7
  scorecard_par.children[8].firstChild.textContent = par.h8
  scorecard_par.children[9].firstChild.textContent = par.h9
  scorecard_par.children[10].firstChild.textContent = par.h10
  scorecard_par.children[11].firstChild.textContent = par.h11
  scorecard_par.children[12].firstChild.textContent = par.h12
  scorecard_par.children[13].firstChild.textContent = par.h13
  scorecard_par.children[14].firstChild.textContent = par.h14
  scorecard_par.children[15].firstChild.textContent = par.h15
  scorecard_par.children[16].firstChild.textContent = par.h16
  scorecard_par.children[17].firstChild.textContent = par.h17
  scorecard_par.children[18].firstChild.textContent = par.h18
  } else{
    scorecard_par.children[1].firstChild.textContent = ""
  scorecard_par.children[2].firstChild.textContent = ""
  scorecard_par.children[3].firstChild.textContent = ""
  scorecard_par.children[4].firstChild.textContent = ""
  scorecard_par.children[5].firstChild.textContent = ""
  scorecard_par.children[6].firstChild.textContent = ""
  scorecard_par.children[7].firstChild.textContent = ""
  scorecard_par.children[8].firstChild.textContent = ""
  scorecard_par.children[9].firstChild.textContent = ""
  scorecard_par.children[10].firstChild.textContent = ""
  scorecard_par.children[11].firstChild.textContent = ""
  scorecard_par.children[12].firstChild.textContent = ""
  scorecard_par.children[13].firstChild.textContent = ""
  scorecard_par.children[14].firstChild.textContent = ""
  scorecard_par.children[15].firstChild.textContent = ""
  scorecard_par.children[16].firstChild.textContent = ""
  scorecard_par.children[17].firstChild.textContent = ""
  scorecard_par.children[18].firstChild.textContent = ""
  }

}


//This function append players for select element. User can use select element for choosing player1
function player1_players(players){
  let player1 = document.getElementById("player1");
  // no players
  if (players.length === 0) {
    player1.firstChild.textContent = "Ei pelaajia";

    let empty_attr = document.createAttribute('id')
    empty_attr.value = 'empty_player'
    player1.firstChild.setAttributeNode(empty_attr)
  } else {
    players.forEach((player) => {
      Promise.resolve(createPlayerSelectItem(player)).then((value) => {
        player1.appendChild(value);

      });
    })
    //remove placeholder option
    player1.removeChild(player1.firstChild)
  }
}

//This function append players for select element. User can use select element for choosing player2
function player2_players(players){
  let player2 = document.getElementById("player2");
  // no players
  if (players.length === 0) {
    player2.firstChild.textContent = "Ei pelaajia";

    let empty_attr = document.createAttribute('id')
    empty_attr.value = 'empty_player'
    player2.firstChild.setAttributeNode(empty_attr)
  } else {
    players.forEach((player) => {
      Promise.resolve(createPlayerSelectItem(player)).then((value) => {
        player2.appendChild(value);

      });
    })
    //remove placeholder option
    // player2.removeChild(player2.firstChild)
  }
}

//This function append players for select element. User can use select element for choosing player3
function player3_players(players){
  let player3 = document.getElementById("player3");
  // no players
  if (players.length === 0) {
    player3.firstChild.textContent = "Ei pelaajia";

    let empty_attr = document.createAttribute('id')
    empty_attr.value = 'empty_player'
    player3.firstChild.setAttributeNode(empty_attr)
  } else {
    players.forEach((player) => {
      Promise.resolve(createPlayerSelectItem(player)).then((value) => {
        player3.appendChild(value);

      });
    })
    //remove placeholder option
    // player3.removeChild(player3.firstChild)
}
}

//This function append players for select element. User can use select element for choosing player4
function player4_players(players){
  let player4 = document.getElementById("player4");
  // no players
  if (players.length === 0) {
    player4.firstChild.textContent = "Ei pelaajia";

    let empty_attr = document.createAttribute('id')
    empty_attr.value = 'empty_player'
    player4.firstChild.setAttributeNode(empty_attr)
  } else {
    players.forEach((player) => {
      Promise.resolve(createPlayerSelectItem(player)).then((value) => {
        player4.appendChild(value);

      });
    })
    //remove placeholder option
    // player4.removeChild(player4.firstChild)
  }
}

//This function post data from new scorecard to database. New scorecard will be appended to select scorecard instantly after response database have been recieved
//This function will need individual player scores per hole.
async function addScorecard() {
  let date = new Date()
  let date_now =date.toLocaleString();
  let course = document.getElementById("select_scorecard_course")
  let player1 = document.getElementById("player1");
  let player2 = document.getElementById("player2");
  let player3 = document.getElementById("player3");
  let player4 = document.getElementById("player4");
  let player1_score = document.getElementById('scorecard_player1')
  let player2_score = document.getElementById('scorecard_player2')
  let player3_score = document.getElementById('scorecard_player3')
  let player4_score = document.getElementById('scorecard_player4')
  
  const data = {
    date: date_now,
    course_id: course.value,
    player1_id: player1.value,
    player2_id: player2.value,
    player3_id: player3.value,
    player4_id: player4.value,
    player1_s1: player1_score.children[1].firstChild.textContent,
    player1_s2: player1_score.children[2].firstChild.textContent,
    player1_s3: player1_score.children[3].firstChild.textContent,
    player1_s4: player1_score.children[4].firstChild.textContent,
    player1_s5: player1_score.children[5].firstChild.textContent,
    player1_s6: player1_score.children[6].firstChild.textContent,
    player1_s7: player1_score.children[7].firstChild.textContent,
    player1_s8: player1_score.children[8].firstChild.textContent,
    player1_s9: player1_score.children[9].firstChild.textContent,
    player1_s10: player1_score.children[10].firstChild.textContent,
    player1_s11: player1_score.children[11].firstChild.textContent,
    player1_s12: player1_score.children[12].firstChild.textContent,
    player1_s13: player1_score.children[13].firstChild.textContent,
    player1_s14: player1_score.children[14].firstChild.textContent,
    player1_s15: player1_score.children[15].firstChild.textContent,
    player1_s16: player1_score.children[16].firstChild.textContent,
    player1_s17: player1_score.children[17].firstChild.textContent,
    player1_s18: player1_score.children[18].firstChild.textContent,
    player2_s1: player2_score.children[1].firstChild.textContent,
    player2_s2: player2_score.children[2].firstChild.textContent,
    player2_s3: player2_score.children[3].firstChild.textContent,
    player2_s4: player2_score.children[4].firstChild.textContent,
    player2_s5: player2_score.children[5].firstChild.textContent,
    player2_s6: player2_score.children[6].firstChild.textContent,
    player2_s7: player2_score.children[7].firstChild.textContent,
    player2_s8: player2_score.children[8].firstChild.textContent,
    player2_s9: player2_score.children[9].firstChild.textContent,
    player2_s10: player2_score.children[10].firstChild.textContent,
    player2_s11: player2_score.children[11].firstChild.textContent,
    player2_s12: player2_score.children[12].firstChild.textContent,
    player2_s13: player2_score.children[13].firstChild.textContent,
    player2_s14: player2_score.children[14].firstChild.textContent,
    player2_s15: player2_score.children[15].firstChild.textContent,
    player2_s16: player2_score.children[16].firstChild.textContent,
    player2_s17: player2_score.children[17].firstChild.textContent,
    player2_s18: player2_score.children[18].firstChild.textContent,
    player3_s1: player3_score.children[1].firstChild.textContent,
    player3_s2: player3_score.children[2].firstChild.textContent,
    player3_s3: player3_score.children[3].firstChild.textContent,
    player3_s4: player3_score.children[4].firstChild.textContent,
    player3_s5: player3_score.children[5].firstChild.textContent,
    player3_s6: player3_score.children[6].firstChild.textContent,
    player3_s7: player3_score.children[7].firstChild.textContent,
    player3_s8: player3_score.children[8].firstChild.textContent,
    player3_s9: player3_score.children[9].firstChild.textContent,
    player3_s10: player3_score.children[10].firstChild.textContent,
    player3_s11: player3_score.children[11].firstChild.textContent,
    player3_s12: player3_score.children[12].firstChild.textContent,
    player3_s13: player3_score.children[13].firstChild.textContent,
    player3_s14: player3_score.children[14].firstChild.textContent,
    player3_s15: player3_score.children[15].firstChild.textContent,
    player3_s16: player3_score.children[16].firstChild.textContent,
    player3_s17: player3_score.children[17].firstChild.textContent,
    player3_s18: player3_score.children[18].firstChild.textContent,
    player4_s1: player4_score.children[1].firstChild.textContent,
    player4_s2: player4_score.children[2].firstChild.textContent,
    player4_s3: player4_score.children[3].firstChild.textContent,
    player4_s4: player4_score.children[4].firstChild.textContent,
    player4_s5: player4_score.children[5].firstChild.textContent,
    player4_s6: player4_score.children[6].firstChild.textContent,
    player4_s7: player4_score.children[7].firstChild.textContent,
    player4_s8: player4_score.children[8].firstChild.textContent,
    player4_s9: player4_score.children[9].firstChild.textContent,
    player4_s10: player4_score.children[10].firstChild.textContent,
    player4_s11: player4_score.children[11].firstChild.textContent,
    player4_s12: player4_score.children[12].firstChild.textContent,
    player4_s13: player4_score.children[13].firstChild.textContent,
    player4_s14: player4_score.children[14].firstChild.textContent,
    player4_s15: player4_score.children[15].firstChild.textContent,
    player4_s16: player4_score.children[16].firstChild.textContent,
    player4_s17: player4_score.children[17].firstChild.textContent,
    player4_s18: player4_score.children[18].firstChild.textContent
  };
  //Ehto, ett?? tyhj???? pelaajaa voi lis??t??
  if (player1.value != "Valitse Pelaaja" && course != "Valitse kierroskortti") {
    const response = await fetch(fectch_address_scorecards, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let scorecard = await response.json();
    let select_scorecard = document.getElementById("select_scorecard");
    Promise.resolve(createScorecardSelectItem(scorecard)).then((option) => {
      select_scorecard.appendChild(option);
    });
    if(select_scorecard.firstChild.innerHTML == 'Ei kierroskortteja'){
      let empty_option = document.getElementById('empty_scorecard')
      empty_option.parentNode.removeChild(empty_option)
    }
    clearScorecard();

  }
}

//Removes scorecard from database
async function removeScorecard() {
  let select_scorecard = document.getElementById("select_scorecard");
  let scorecard_id = select_scorecard.value;
  if(scorecard_id != 'Ei pelaajia'){
  const response = await fetch(fectch_address_scorecards + "/" + scorecard_id, {
    method: "DELETE",
  });
  let responseJson = await response.json();
  let option = document.getElementById(scorecard_id);
  option.parentNode.removeChild(option);
  }
  if (!select_scorecard.hasChildNodes()) {
    let placeholder_option = document.createElement("option");
    placeholder_option.innerHTML = "Ei kierroskortteja";
    let placeholder_id = document.createAttribute('id')
    placeholder_id.value = 'empty_player';
    placeholder_option.setAttributeNode(placeholder_id)
    select_scorecard.appendChild(placeholder_option);
  }
}



//Edit scorecard

async function editScorecard() {

  //Haetaan tietokannasta valitun kierroskortin tiedot
  let select_scorecard = document.getElementById("select_scorecard");
  let scorecard_id = select_scorecard.value;
  let response = await fetch(fectch_address_scorecards+'/'+scorecard_id)
  let scorecard = await response.json()

  //Lukitaan muokattava kierroskortti k??ytt??liittym??st??
  let disabled = document.createAttribute("disabled");
  select_scorecard.setAttributeNode(disabled);

  //Muokataan k??ytt??liittym??n lis????-painike -> tallenna-painikkeeksi
  let scorecard_save = document.getElementById("save_scorecard_button");
  let class_edit = document.createAttribute("class");
  class_edit.value = "edit";
  scorecard_save.setAttributeNode(class_edit);
  scorecard_save.removeEventListener("click", addScorecard)
  scorecard_save.addEventListener("click", updateScorecard)

  //Lis??t????n tietokannasta haetut tiedot input fieldelleille
  let course = document.getElementById("select_scorecard_course")
  let player1 = document.getElementById("player1");
  let player2 = document.getElementById("player2");
  let player3 = document.getElementById("player3");
  let player4 = document.getElementById("player4");

  course.value = scorecard.course_id
  changePar();
  player1.value = scorecard.player1_id
  player2.value = scorecard.player2_id
  player3.value = scorecard.player3_id
  player4.value = scorecard.player4_id
  changeScorecardScores(scorecard); 
}

//This function 
async function changeScorecardScores (scorecard){
  let scorecard_player1 = document.getElementById('scorecard_player1')
  scorecard_player1.children[1].firstChild.textContent = scorecard.player1_s1
  scorecard_player1.children[2].firstChild.textContent = scorecard.player1_s2
  scorecard_player1.children[3].firstChild.textContent = scorecard.player1_s3
  scorecard_player1.children[4].firstChild.textContent = scorecard.player1_s4
  scorecard_player1.children[5].firstChild.textContent = scorecard.player1_s5
  scorecard_player1.children[6].firstChild.textContent = scorecard.player1_s6
  scorecard_player1.children[7].firstChild.textContent = scorecard.player1_s7
  scorecard_player1.children[8].firstChild.textContent = scorecard.player1_s8
  scorecard_player1.children[9].firstChild.textContent = scorecard.player1_s9
  scorecard_player1.children[10].firstChild.textContent = scorecard.player1_s10
  scorecard_player1.children[11].firstChild.textContent = scorecard.player1_s11
  scorecard_player1.children[12].firstChild.textContent = scorecard.player1_s12
  scorecard_player1.children[13].firstChild.textContent = scorecard.player1_s13
  scorecard_player1.children[14].firstChild.textContent = scorecard.player1_s14
  scorecard_player1.children[15].firstChild.textContent = scorecard.player1_s15
  scorecard_player1.children[16].firstChild.textContent = scorecard.player1_s16
  scorecard_player1.children[17].firstChild.textContent = scorecard.player1_s17
  scorecard_player1.children[18].firstChild.textContent = scorecard.player1_s18

  let scorecard_player2 = document.getElementById('scorecard_player2')
  scorecard_player2.children[1].firstChild.textContent = scorecard.player2_s1
  scorecard_player2.children[2].firstChild.textContent = scorecard.player2_s2
  scorecard_player2.children[3].firstChild.textContent = scorecard.player2_s3
  scorecard_player2.children[4].firstChild.textContent = scorecard.player2_s4
  scorecard_player2.children[5].firstChild.textContent = scorecard.player2_s5
  scorecard_player2.children[6].firstChild.textContent = scorecard.player2_s6
  scorecard_player2.children[7].firstChild.textContent = scorecard.player2_s7
  scorecard_player2.children[8].firstChild.textContent = scorecard.player2_s8
  scorecard_player2.children[9].firstChild.textContent = scorecard.player2_s9
  scorecard_player2.children[10].firstChild.textContent = scorecard.player2_s10
  scorecard_player2.children[11].firstChild.textContent = scorecard.player2_s11
  scorecard_player2.children[12].firstChild.textContent = scorecard.player2_s12
  scorecard_player2.children[13].firstChild.textContent = scorecard.player2_s13
  scorecard_player2.children[14].firstChild.textContent = scorecard.player2_s14
  scorecard_player2.children[15].firstChild.textContent = scorecard.player2_s15
  scorecard_player2.children[16].firstChild.textContent = scorecard.player2_s16
  scorecard_player2.children[17].firstChild.textContent = scorecard.player2_s17
  scorecard_player2.children[18].firstChild.textContent = scorecard.player2_s18

  let scorecard_player3 = document.getElementById('scorecard_player3')
  scorecard_player3.children[1].firstChild.textContent = scorecard.player3_s1
  scorecard_player3.children[2].firstChild.textContent = scorecard.player3_s2
  scorecard_player3.children[3].firstChild.textContent = scorecard.player3_s3
  scorecard_player3.children[4].firstChild.textContent = scorecard.player3_s4
  scorecard_player3.children[5].firstChild.textContent = scorecard.player3_s5
  scorecard_player3.children[6].firstChild.textContent = scorecard.player3_s6
  scorecard_player3.children[7].firstChild.textContent = scorecard.player3_s7
  scorecard_player3.children[8].firstChild.textContent = scorecard.player3_s8
  scorecard_player3.children[9].firstChild.textContent = scorecard.player3_s9
  scorecard_player3.children[10].firstChild.textContent = scorecard.player3_s10
  scorecard_player3.children[11].firstChild.textContent = scorecard.player3_s11
  scorecard_player3.children[12].firstChild.textContent = scorecard.player3_s12
  scorecard_player3.children[13].firstChild.textContent = scorecard.player3_s13
  scorecard_player3.children[14].firstChild.textContent = scorecard.player3_s14
  scorecard_player3.children[15].firstChild.textContent = scorecard.player3_s15
  scorecard_player3.children[16].firstChild.textContent = scorecard.player3_s16
  scorecard_player3.children[17].firstChild.textContent = scorecard.player3_s17
  scorecard_player3.children[18].firstChild.textContent = scorecard.player3_s18

  let scorecard_player4 = document.getElementById('scorecard_player4')
  scorecard_player4.children[1].firstChild.textContent = scorecard.player4_s1
  scorecard_player4.children[2].firstChild.textContent = scorecard.player4_s2
  scorecard_player4.children[3].firstChild.textContent = scorecard.player4_s3
  scorecard_player4.children[4].firstChild.textContent = scorecard.player4_s4
  scorecard_player4.children[5].firstChild.textContent = scorecard.player4_s5
  scorecard_player4.children[6].firstChild.textContent = scorecard.player4_s6
  scorecard_player4.children[7].firstChild.textContent = scorecard.player4_s7
  scorecard_player4.children[8].firstChild.textContent = scorecard.player4_s8
  scorecard_player4.children[9].firstChild.textContent = scorecard.player4_s9
  scorecard_player4.children[10].firstChild.textContent = scorecard.player4_s10
  scorecard_player4.children[11].firstChild.textContent = scorecard.player4_s11
  scorecard_player4.children[12].firstChild.textContent = scorecard.player4_s12
  scorecard_player4.children[13].firstChild.textContent = scorecard.player4_s13
  scorecard_player4.children[14].firstChild.textContent = scorecard.player4_s14
  scorecard_player4.children[15].firstChild.textContent = scorecard.player4_s15
  scorecard_player4.children[16].firstChild.textContent = scorecard.player4_s16
  scorecard_player4.children[17].firstChild.textContent = scorecard.player4_s17
  scorecard_player4.children[18].firstChild.textContent = scorecard.player4_s18

}


async function updateScorecard(){

  let select_scorecard = document.getElementById('select_scorecard')
  select_scorecard.removeAttribute('disabled')
  let id = select_scorecard.value
  let course_id = document.getElementById("select_scorecard_course");
  let player1_id = document.getElementById("player1");
  let player2_id = document.getElementById("player2");
  let player3_id = document.getElementById("player3");
  let player4_id = document.getElementById("player4");
  let player1_score = document.getElementById("scorecard_player1");
  let player2_score = document.getElementById("scorecard_player2");
  let player3_score = document.getElementById("scorecard_player3");
  let player4_score = document.getElementById("scorecard_player4");


  let data = {
    'course_id': course_id.value,
    'player1_id': player1_id.value,
    'player2_id': player2_id.value,
    'player3_id': player3_id.value,
    'player4_id': player4_id.value,
    'player1_s1': player1_score.children[1].firstChild.textContent,
    'player1_s2': player1_score.children[2].firstChild.textContent,
    'player1_s3': player1_score.children[3].firstChild.textContent,
    'player1_s4': player1_score.children[4].firstChild.textContent,
    'player1_s5': player1_score.children[5].firstChild.textContent,
    'player1_s6': player1_score.children[6].firstChild.textContent,
    'player1_s7': player1_score.children[7].firstChild.textContent,
    'player1_s8': player1_score.children[8].firstChild.textContent,
    'player1_s9': player1_score.children[9].firstChild.textContent,
    'player1_s10': player1_score.children[10].firstChild.textContent,
    'player1_s11': player1_score.children[11].firstChild.textContent,
    'player1_s12': player1_score.children[12].firstChild.textContent,
    'player1_s13': player1_score.children[13].firstChild.textContent,
    'player1_s14': player1_score.children[14].firstChild.textContent,
    'player1_s15': player1_score.children[15].firstChild.textContent,
    'player1_s16': player1_score.children[16].firstChild.textContent,
    'player1_s17': player1_score.children[17].firstChild.textContent,
    'player1_s18': player1_score.children[18].firstChild.textContent,
    'player2_s1': player2_score.children[1].firstChild.textContent,
    'player2_s2': player2_score.children[2].firstChild.textContent,
    'player2_s3': player2_score.children[3].firstChild.textContent,
    'player2_s4': player2_score.children[4].firstChild.textContent,
    'player2_s5': player2_score.children[5].firstChild.textContent,
    'player2_s6': player2_score.children[6].firstChild.textContent,
    'player2_s7': player2_score.children[7].firstChild.textContent,
    'player2_s8': player2_score.children[8].firstChild.textContent,
    'player2_s9': player2_score.children[9].firstChild.textContent,
    'player2_s10': player2_score.children[10].firstChild.textContent,
    'player2_s11': player2_score.children[11].firstChild.textContent,
    'player2_s12': player2_score.children[12].firstChild.textContent,
    'player2_s13': player2_score.children[13].firstChild.textContent,
    'player2_s14': player2_score.children[14].firstChild.textContent,
    'player2_s15': player2_score.children[15].firstChild.textContent,
    'player2_s16': player2_score.children[16].firstChild.textContent,
    'player2_s17': player2_score.children[17].firstChild.textContent,
    'player2_s18': player2_score.children[18].firstChild.textContent,
    'player3_s1': player3_score.children[1].firstChild.textContent,
    'player3_s2': player3_score.children[2].firstChild.textContent,
    'player3_s3': player3_score.children[3].firstChild.textContent,
    'player3_s4': player3_score.children[4].firstChild.textContent,
    'player3_s5': player3_score.children[5].firstChild.textContent,
    'player3_s6': player3_score.children[6].firstChild.textContent,
    'player3_s7': player3_score.children[7].firstChild.textContent,
    'player3_s8': player3_score.children[8].firstChild.textContent,
    'player3_s9': player3_score.children[9].firstChild.textContent,
    'player3_s10': player3_score.children[10].firstChild.textContent,
    'player3_s11': player3_score.children[11].firstChild.textContent,
    'player3_s12': player3_score.children[12].firstChild.textContent,
    'player3_s13': player3_score.children[13].firstChild.textContent,
    'player3_s14': player3_score.children[14].firstChild.textContent,
    'player3_s15': player3_score.children[15].firstChild.textContent,
    'player3_s16': player3_score.children[16].firstChild.textContent,
    'player3_s17': player3_score.children[17].firstChild.textContent,
    'player3_s18': player3_score.children[18].firstChild.textContent,
    'player4_s1': player4_score.children[1].firstChild.textContent,
    'player4_s2': player4_score.children[2].firstChild.textContent,
    'player4_s3': player4_score.children[3].firstChild.textContent,
    'player4_s4': player4_score.children[4].firstChild.textContent,
    'player4_s5': player4_score.children[5].firstChild.textContent,
    'player4_s6': player4_score.children[6].firstChild.textContent,
    'player4_s7': player4_score.children[7].firstChild.textContent,
    'player4_s8': player4_score.children[8].firstChild.textContent,
    'player4_s9': player4_score.children[9].firstChild.textContent,
    'player4_s10': player4_score.children[10].firstChild.textContent,
    'player4_s11': player4_score.children[11].firstChild.textContent,
    'player4_s12': player4_score.children[12].firstChild.textContent,
    'player4_s13': player4_score.children[13].firstChild.textContent,
    'player4_s14': player4_score.children[14].firstChild.textContent,
    'player4_s15': player4_score.children[15].firstChild.textContent,
    'player4_s16': player4_score.children[16].firstChild.textContent,
    'player4_s17': player4_score.children[17].firstChild.textContent,
    'player4_s18': player4_score.children[18].firstChild.textContent
  }

  let response = await fetch(fectch_address_scorecards+'/'+id, {
    method: 'PUT',
    headers:{'content-type': 'application/json'},
    body: JSON.stringify(data)
  })

  let response_update = await response.json()

  changePar();
  clearScorecard();

  let updateButton = document.getElementById('save_scorecard_button')
  updateButton.removeEventListener("click", updateScorecard)
  updateButton.addEventListener("click", addScorecard)
  updateButton.removeAttribute("class")

}


function clearScorecard(){
  let course_id = document.getElementById("select_scorecard_course");
  let player1_id = document.getElementById("player1");
  let player2_id = document.getElementById("player2");
  let player3_id = document.getElementById("player3");
  let player4_id = document.getElementById("player4");
  let player1_score = document.getElementById("scorecard_player1");
  let player2_score = document.getElementById("scorecard_player2");
  let player3_score = document.getElementById("scorecard_player3");
  let player4_score = document.getElementById("scorecard_player4");

  course_id.value = "Valitse kierroskortti"
  player1_id.value = "Valitse Pelaaja"
  player2_id.value = "Valitse Pelaaja"
  player3_id.value = "Valitse Pelaaja"
  player4_id.value = "Valitse Pelaaja"

  player1_score.children[1].firstChild.textContent = ""
  player1_score.children[2].firstChild.textContent = ""
  player1_score.children[3].firstChild.textContent = ""
  player1_score.children[4].firstChild.textContent = ""
  player1_score.children[5].firstChild.textContent = ""
  player1_score.children[6].firstChild.textContent = ""
  player1_score.children[7].firstChild.textContent = ""
  player1_score.children[8].firstChild.textContent = ""
  player1_score.children[9].firstChild.textContent = ""
  player1_score.children[10].firstChild.textContent = ""
  player1_score.children[11].firstChild.textContent = ""
  player1_score.children[12].firstChild.textContent = ""
  player1_score.children[13].firstChild.textContent = ""
  player1_score.children[14].firstChild.textContent = ""
  player1_score.children[15].firstChild.textContent = ""
  player1_score.children[16].firstChild.textContent = ""
  player1_score.children[17].firstChild.textContent = ""
  player1_score.children[18].firstChild.textContent = ""
  player2_score.children[1].firstChild.textContent = ""
  player2_score.children[2].firstChild.textContent = ""
  player2_score.children[3].firstChild.textContent = ""
  player2_score.children[4].firstChild.textContent = ""
  player2_score.children[5].firstChild.textContent = ""
  player2_score.children[6].firstChild.textContent = ""
  player2_score.children[7].firstChild.textContent = ""
  player2_score.children[8].firstChild.textContent = ""
  player2_score.children[9].firstChild.textContent = ""
  player2_score.children[10].firstChild.textContent = ""
  player2_score.children[11].firstChild.textContent = ""
  player2_score.children[12].firstChild.textContent = ""
  player2_score.children[13].firstChild.textContent = ""
  player2_score.children[14].firstChild.textContent = ""
  player2_score.children[15].firstChild.textContent = ""
  player2_score.children[16].firstChild.textContent = ""
  player2_score.children[17].firstChild.textContent = ""
  player2_score.children[18].firstChild.textContent = ""
  player3_score.children[1].firstChild.textContent = ""
  player3_score.children[2].firstChild.textContent = ""
  player3_score.children[3].firstChild.textContent = ""
  player3_score.children[4].firstChild.textContent = ""
  player3_score.children[5].firstChild.textContent = ""
  player3_score.children[6].firstChild.textContent = ""
  player3_score.children[7].firstChild.textContent = ""
  player3_score.children[8].firstChild.textContent = ""
  player3_score.children[9].firstChild.textContent = ""
  player3_score.children[10].firstChild.textContent = ""
  player3_score.children[11].firstChild.textContent = ""
  player3_score.children[12].firstChild.textContent = ""
  player3_score.children[13].firstChild.textContent = ""
  player3_score.children[14].firstChild.textContent = ""
  player3_score.children[15].firstChild.textContent = ""
  player3_score.children[16].firstChild.textContent = ""
  player3_score.children[17].firstChild.textContent = ""
  player3_score.children[18].firstChild.textContent = ""
  player4_score.children[1].firstChild.textContent = ""
  player4_score.children[2].firstChild.textContent = ""
  player4_score.children[3].firstChild.textContent = ""
  player4_score.children[4].firstChild.textContent = ""
  player4_score.children[5].firstChild.textContent = ""
  player4_score.children[6].firstChild.textContent = ""
  player4_score.children[7].firstChild.textContent = ""
  player4_score.children[8].firstChild.textContent = ""
  player4_score.children[9].firstChild.textContent = ""
  player4_score.children[10].firstChild.textContent = ""
  player4_score.children[11].firstChild.textContent = ""
  player4_score.children[12].firstChild.textContent = ""
  player4_score.children[13].firstChild.textContent = ""
  player4_score.children[14].firstChild.textContent = ""
  player4_score.children[15].firstChild.textContent = ""
  player4_score.children[16].firstChild.textContent = ""
  player4_score.children[17].firstChild.textContent = ""
  player4_score.children[18].firstChild.textContent = ""
}