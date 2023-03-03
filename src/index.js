
const BASE_URL = 'http://localhost:3000'

let addToy = false;
let toyDataArr = []
const toyCollection = document.getElementById('toy-collection')
const addToyForm = document.getElementById('form')
addToyForm.addEventListener('submit', (event) => {
  event.preventDefault()
  addNewToy()
})


// Intialise ---------------------------------
getToys()

// ----------------------------------------

function getToys(){
  fetch(BASE_URL + '/toys')
  .then((resp) => resp.json())
  .then((data) => {
    toyDataArr = data
    for(toy of toyDataArr){
      renderToy(toy)
    }
  })
}

function renderToy(toy){
  const newToyCard = document.createElement('div')
  const newToyId = toy.id

  const newToyName = document.createElement('h2')
  newToyName.textContent = toy.name
  newToyCard.appendChild(newToyName)

  const newToyImg = document.createElement('img')
  newToyImg.src = toy.image
  newToyImg.classList.add('toy-avatar')
  newToyCard.appendChild(newToyImg)
  
  let newToyLikes = document.createElement('p')
  newToyLikes.textContent = `${toy.likes} Likes`
  newToyLikes.id = (newToyId)
  newToyCard.appendChild(newToyLikes)

  const newToyLikeBtn = document.createElement('button')
  newToyLikeBtn.textContent = 'Like'
  newToyLikeBtn.addEventListener('click', () => incrementToyLikes(newToyId))
  newToyCard.appendChild(newToyLikeBtn)

  const newToyDeleteBtn = document.createElement('button')
  newToyDeleteBtn.textContent = 'Delete'
  newToyDeleteBtn.addEventListener('click', () => deleteToy(newToyId))
  newToyCard.appendChild(newToyDeleteBtn)

  newToyCard.classList.add('card')
  toyCollection.appendChild(newToyCard)
}


function incrementToyLikes(toyId){
  const index = toyDataArr.findIndex(toy => toy.id === toyId)
  toyDataArr[index].likes += 1
  toylikes = document.getElementById(toyId)
  toylikes.textContent = (`${toyDataArr[index].likes} Likes`)
  fetch(BASE_URL + `/toys/${toyId}`,{
    method:'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      likes: toyDataArr[index].likes
    })
  })
}

function addNewToy(){
  const newToy = {}
  newToy.id = (toyDataArr.length + 1)
  newToy.name = addToyForm[0].value
  newToy.image = addToyForm[1].value
  newToy.likes = 0
  toyDataArr.push(newToy)
  fetch(BASE_URL + `/toys`,{
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
      'accept' : 'application/json',
    },
    body: JSON.stringify({
        id: null,
        name: newToy.name,
        image: newToy.image,
        likes: newToy.likes,
    })
  })
  .then(resp => resp.json())
  .catch(error => console.error(`POST ERROR ${error}`))
  renderToy(newToy)
}

function deleteToy(toyId){
  const index = toyDataArr.findIndex(toy => toy.id === toyId)
  toyDataArr.splice(index, 1)
  toyCollection.children[index].remove()
  fetch(BASE_URL + `/toys/${toyId}`,{
    method: 'DELETE'
  })
}



document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
