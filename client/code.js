const fectch_address_players = 'http://localhost:3000/players'
//const fectch_address = 'http://172.21.7.31:8080/todos'

function init() {
    let select_player = document.getElementById('select_player')
    let option = document.createElement('option')
    option.innerHTML = 'Ladataan pelaajia...'
    select_player.appendChild(option)
    loadPlayers()
}

async function loadPlayers() {
    let response = await fetch(fectch_address_players)
    let players = await response.json()
    console.log(players)
    showPlayers(players)
}

async function createPlayerSelectItem(player){
    let option = document.createElement('option')
    let option_attr = document.createAttribute('id')
    option_attr.value = player._id
    option.setAttributeNode(option_attr)
    let name = document.createTextNode(player.name)
    option.appendChild(name)
    return option
}

function showPlayers(players) {
    let select_player = document.getElementById('select_player')

    // no players
    if (players.length === 0) {
        select_player.firstChild.innerHTML = 'Ei pelaajia';
      } else {    
        players.forEach(player => {
            let option = createPlayerSelectItem(player)     
            console.log(option)   
            select_player.appendChild(option)
        })
        select_player.firstChild.innerHTML = '';
      }
}