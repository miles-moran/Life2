let size = 40;
let rows = Array();
let interval;

function Locale(x, y) {
    this.x = x;
    this.y = y;
    this.occupant = null;
}

function Photos(locale){
    this.type = "photos";
    this.absorbtionRate = 3;
    this.energy = 1;
    this.locale = locale;
    this.birthThreshhold = 7;
    this.energyTax = 0;
    this.sexualMaturity = 3;
    this.age = 0;
}

function Predator(locale){
    this.type = "predator";
    this.absorbtionRate = 0;
    this.energy = 10;
    this.locale = locale;
    this.birthThreshhold = 10;
    this.energyTax = .5;
    this.sexualMaturity = 3;
    this.age = 0;
    this.hunting = false;
    this.following = false;
}

function Apex(locale){
    this.type = "apex";
    this.absorbtionRate = 0;
    this.energy = 10;
    this.locale = locale;
    this.birthThreshhold = 10;
    this.energyTax = .5;
    this.sexualMaturity = 3;
    this.age = 0;
    this.hunting = false;
    this.following = false;
}
  

function generateWorld() {
    for (y = 0; y < size; y++){
        let row = Array();
        for (x = 0; x < size; x++){
            let locale = new Locale(x, y);
            row.push(locale);
        }
        rows.push(row);
    }
}

function calculateDistance(x, y, sx, sy){
    let a = x - sx;
    let b = y - sy;
    let c = a * a + b * b;
    return c
}

function displayWorld() {
    document.getElementById("frame").innerHTML = "";
    for (let r = 0; r < rows.length; r++){
        let row = document.createElement("div");
        row.classList.add("row");
        for (let c = 0; c < rows[r].length; c++){
            let locale = document.createElement("span");
            locale.classList.add("locale");
            locale.addEventListener("mouseover", function() {
                hover(event);
            });
            if (rows[r][c].occupant != null){
                locale.classList.add(rows[r][c].occupant.type);
            }
            locale.row = r;
            locale.column = c;
            row.appendChild(locale);
        }
        document.getElementById("frame").appendChild(row);
    }
}

function hover(e){
    data = document.getElementById("data");
    data.innerHTML = "";
    x = e.target.column;
    y = e.target.row;
    cord = "(" + x + ", " + y + ")";
    occupant = rows[y][x].occupant;
    cordEl = document.createElement("span");
    cordEl.innerHTML = cord;
    occupantEl = document.createElement("span");
    
    energyEl = document.createElement("div");
    ageEl = document.createElement("div");
    if (occupant){
        occupantEl.innerHTML = " - " + occupant.type;
        energyEl.innerHTML = "Energy: " + occupant.energy;
        ageEl.innerHTML = "Age: " + occupant.age;
    }
    dataHeader = document.createElement("div");
    dataHeader.appendChild(cordEl);
    dataHeader.appendChild(occupantEl);
    data.appendChild(dataHeader);
    data.appendChild(energyEl);
    data.appendChild(ageEl);
    
}
function chance(chance) {
    return Math.floor(Math.random() * chance); 
}

function findLife(){
    let life = Array()
    for (let r = 0; r < rows.length; r++){
        for (let c = 0; c < rows[r].length; c++){
            if (rows[r][c].occupant != null){
                life.push(rows[r][c].occupant);
            }
        }
    }
    return life;
}

function generateLife(){
    for (let r = 0; r < rows.length; r++){
        for (let c = 0; c < rows[r].length; c++){
            if (rows[r][c].occupant == null){
                if (chance(100) == 0){
                    rows[r][c].occupant = new Photos(rows[r][c]);
                } else if (chance(500) == 0){
                    rows[r][c].occupant = new Predator(rows[r][c]);
                } else if (chance(1000) == 0){
                    rows[r][c].occupant = new Apex(rows[r][c]);
                }
            }
        }
    }
}

function vacateLocale(x, y){
    rows[y][x].occupant = null;
}

function tick(){
    console.log("Tick");
    photosynthesize();
    energyTax();
    matingSeason();
    moveMovers();
    age();
    displayWorld();
}

function energyTax(){
    let life = findLife();
    for (let i = 0; i < life.length; i++){
        if (life[i].type == "predator"){
        }
        life[i].energy = life[i].energy - life[i].energyTax;
        if (life[i].energy < 0){
            vacateLocale(life[i].locale.x, life[i].locale.y);
        }
    }
}

function photosynthesize(){
    let life = findSpecies("photos");
    for (let i = 0; i < life.length; i++){
        life[i].energy = life[i].energy + life[i].absorbtionRate;
        console.log("test");
    }
}

function birth(life, locale){
    if (life.type == "photos"){
        locale.occupant = new Photos(locale);
    } else if (life.type == "predator"){
        locale.occupant = new Predator(locale);
    }
    life.energy = life.energy - life.birthThreshhold;
}

function matingSeason(){
    let life = findLife();
    for (let i = 0; i < life.length; i++){
        if (life[i].energy >= life[i].birthThreshhold){
            let neighbors = getNeighbors(life[i].locale.x, life[i].locale.y, 1);
            for (let n = 0; n < neighbors.length; n++){
                if (neighbors[n]){
                    if (neighbors[n].occupant == null){
                        birth(life[i], neighbors[n]);
                        break;
                    }
                }
            }
        }
    }
}

function getNeighbors(x, y, d){
    let neighbors = Array();
    let direction = Array();
    for (let i = -d; i <= d; i++){
        direction.push(i);
    }
    for (let i in direction){
        for (let j in direction){
            if (direction[i] != 0 || direction[j] != 0){
                let newY = parseInt(direction[i]) + parseInt(y);
                let newX = parseInt(direction[j]) + parseInt(x);
                try {
                    neighbors.push(rows[newY][newX]);
                } catch {

                }
            }
        }
    }
    return neighbors;
}

function moveMovers(){
    let predators = findSpecies("predator");
    for (let i = 0; i < predators.length; i++){
        moveWithVision(predators[i], 5);
    }
}

function move(life){
    let neighbors = getNeighbors(life.locale.x, life.locale.y, 1);
    if (neighbors.length > 0){
        let destination = neighbors[chance(neighbors.length)];
        if (destination != null){
            let oldX = life.locale.x;
            let oldY = life.locale.y;
            if (destination.occupant){
                consume(life, destination.occupant);
            }
            life.locale = destination;
            destination.occupant = life;
            vacateLocale(oldX, oldY);
            } else {
                move(life);
            }
        }
    }

function consume(hunter, prey){
    hunter.energy += prey.energy;
}

function age(){
    let life = findLife();
    for (let i = 0; i < life.length; i++){
        life[i].age++;
    }
}

function ring(locale, distance){
    let ring = Array();
    let neighbors = getNeighbors(locale.x, locale.y, distance);
    for (let i = 0; i < neighbors.length; i++){
        if (neighbors[i] != null){
            if (Math.abs(locale.x-neighbors[i].x) == distance || Math.abs(locale.y-neighbors[i].y) == distance){
                ring.push(neighbors[i]);
            }
        }
    }
    return ring;
}

function moveWithVision(life, depth){
   for (let i = 0; i <= depth; i++){
        let r = ring(life.locale, i);
        for (let j = 0; j < r.length; j++){
            if (r[j].occupant && r[j].occupant.type == "photos"){
                r[j].occupant.hunting = true;
                let neighbors = getNeighbors(life.locale.x, life.locale.y, 1);
                let nDistances = Array();
                for (let k = 0; k < neighbors.length; k++){
                    if (neighbors[k] != null){
                        if (neighbors[k].occupant == null || (neighbors[k].occupant != null && neighbors[k].occupant.type == "photos")){
                            nDistances.push(calculateDistance(neighbors[k].x, neighbors[k].y, r[j].x, r[j].y));
                        } else {
                            nDistances.push(1000);
                        }
                    }
                }
                let destination = neighbors[findMinIndex(nDistances)];
                if (destination != null){
                    let oldX = life.locale.x;
                    let oldY = life.locale.y;
                    if (destination.occupant && destination.occupant != "predator"){
                        consume(life, destination.occupant);
                    }
                    life.locale = destination;
                    destination.occupant = life;
                    vacateLocale(oldX, oldY);
                    return;
                }
            }
        }
   }
   if(followWithVision(life, depth)){
       return;
   }
   life.hunting = false;
   move(life);   
}
function followWithVision(life, depth){
    for (let i = 0; i <= 10; i++){
         let r = ring(life.locale, i);
         for (let j = 0; j < r.length; j++){
             if (r[j].occupant && r[j].occupant.type == "predator" && r[j].occupant.hunting == true){
                 let neighbors = getNeighbors(life.locale.x, life.locale.y, 1);
                 let nDistances = Array();
                 for (let k = 0; k < neighbors.length; k++){
                     if (neighbors[k] != null){
                         if (neighbors[k].occupant == null){
                             nDistances.push(calculateDistance(neighbors[k].x, neighbors[k].y, r[j].x, r[j].y));
                         } else {
                             nDistances.push(1000);
                         }
                     }
                 }
                 let destination = neighbors[findMinIndex(nDistances)];
                 if (destination != null){
                     let oldX = life.locale.x;
                     let oldY = life.locale.y;
                     life.locale = destination;
                     destination.occupant = life;
                     vacateLocale(oldX, oldY);
                     return true;
                 }
             }
         }
    }
    return false;
 }

function findMinIndex(nums){
    let min = 0;
    for (let i = 0; i < nums.length; i++){
        if (nums[i] < nums[min]){
            min = i;
        }
    }
    return min;
}

function findSpecies(species){
    let life = Array()
    for (let r = 0; r < rows.length; r++){
        for (let c = 0; c < rows[r].length; c++){
            if (rows[r][c].occupant != null){
                if (rows[r][c].occupant.type == species){
                    life.push(rows[r][c].occupant);
                }
            }
        }
    }
    return life;
}

function play(){
    interval = setInterval(tick, 500); // Time in milliseconds
}

function pause(){
    clearInterval(interval);
}

function bigBang(){
    generateWorld();
    generateLife();
    displayWorld();
}

bigBang();
