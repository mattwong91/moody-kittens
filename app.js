let kittens = []
let maxAffection = 5
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  // Supress page reload
  event.preventDefault()

  // Obtain reference to target, Create a kitten object
  let form = event.target
  // Check for same name kitten
  if(kittens.find(currentKitten => currentKitten.name == form.name.value)){
    form.reset()
    throw new Error("This kitten already exists.")
  }
  let kitten = {
    id: generateId(),
    name: form.name.value,
    mood: "tolerant",
    affection: 3
  }

  // If entering first kitten, reveal the release kittens button
  if(kittens.length == 0){
    document.getElementById("release-button").classList.remove("hidden")
  }

  // Add kitten to kittens array, Save kittens, Reset the form
  kittens.push(kitten)
  saveKittens()
  form.reset()
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens 
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  drawKittens()
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let savedKittens = JSON.parse(window.localStorage.getItem("kittens"))
  if(savedKittens.length != 0){
    kittens = savedKittens
    getStarted()
    document.getElementById("release-button").classList.remove("hidden")
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let template = ""
  let kittensElement = document.getElementById("kittens")

  kittens.forEach(kitten => {
    // Set some styling and images to use for specific cases
    let imageName = ""
    let moodStyle = ""
    switch(kitten.mood){
      case "tolerant":
        imageName = "tolerant-cat.png"
        moodStyle = "kitten tolerant"
        break;
      case "angry":
        imageName = "angry-cat.png"
        moodStyle = "kitten angry"
        break;
      case "happy":
        imageName = "happy-cat.png"
        moodStyle = "kitten happy"
        break;
      case "gone":
        imageName = "gone-cat.png"
        moodStyle = "kitten gone"
    }
    // Set the template
    template += `
    <div class="card p-1 m-1 ${moodStyle}">
      <div class = "d-flex space-between">
        <span class="name-font">${kitten.name}</span>
        <span>${kitten.mood.toUpperCase()}</span>
      </div>
      <p>
        <img src="images/${imageName}" alt="">
      </p>
      <div class="d-flex space-around">
        <button id="catnip" onclick="catnip('${kitten.id}')">Catnip</button>
        <button id="pet" onclick="pet('${kitten.id}')">Pet</button>
      </div>
    </div>
    `
  })
  
  // Assign the template to the element
  kittensElement.innerHTML = template
}


/**
 * Find the kitten in the array by its id
 * @param {string} id 
 * @return {Kitten}
 */
function findKittenById(id) {
  let index = kittens.findIndex(kitten => kitten.id == id)
  if(index == -1){
    throw new Error("Invalid cat ID")
  }
  return kittens[index]
}


/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .5 
 * increase the kittens affection
 * otherwise decrease the affection
 * @param {string} id 
 */
function pet(id) {
  let kitten = findKittenById(id)
  if(Math.random() > 0.5){
    kitten.affection++
    if(kitten.affection > maxAffection){
      kitten.affection =  maxAffection
    }
  }else{
    kitten.affection--
    if(kitten.affection < 0){
      kitten.affection = 0
    }
  }
  
  setKittenMood(kitten)
  saveKittens()
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * @param {string} id
 */
function catnip(id) {
  let kitten = findKittenById(id)
  kitten.mood = "tolerant"
  kitten.affection = 5

  saveKittens()
}

/**
 * Sets the kittens mood based on its affection
 * @param {Kitten} kitten 
 */
function setKittenMood(kitten) {
  let affection = kitten.affection
  switch(affection){
    case 0:
      kitten.mood = "gone"
      break;
    case 1:
      kitten.mood = "angry"
      break;
    case 2:
    case 3:
      kitten.mood = "tolerant"
      break;
    case 4:
    case 5:
      kitten.mood = "happy"
      break;
  }
  saveKittens()
}

/**
 * Removes all of the kittens from the array
 * remember to save this change
 */
function clearKittens(){
  kittens = []
  saveKittens()
  document.getElementById("release-button").classList.add("hidden")
}

/**
 * Removes the welcome content and should probably draw the 
 * list of kittens to the page. Good Luck
 */
function getStarted() {
  document.getElementById("welcome").remove();
  console.log('Good Luck, Take it away')
  drawKittens()
}


// --------------------------------------------- No Changes below this line are needed

/**
 * Defines the Properties of a Kitten
 * @typedef {{id:sting, name: string, mood: string, affection: number}} Kitten
 */


/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return Math.floor(Math.random() * 10000000) + "-" + Math.floor(Math.random() * 10000000)
}

loadKittens();
