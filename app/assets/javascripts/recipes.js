// on document ready run event handling function/s
$(() => {
  clickHandlers()
})

// define event handling function/s
const clickHandlers = () => {
  indexRecipes()
  showRecipe()
  nextButton()
  previousButton()
  submitNewRecipeForm()
}

// access link for View Recipes / Index to be manipulated when clicked
const indexRecipes = () => {
  $('.all_recipes').on('click', (e) => {
    e.preventDefault()
    // temp URL slug to see I'm rendering via this function
    history.pushState(null, null, 'jsRenderedIndex')
    fetch(`/recipes.json`)
      .then(res => res.json())
      .then(data => {
        $('.app_container').html('')
        data.forEach(recipe => {
          let newRecipe = new Recipe(recipe)
          let recipeHtml = newRecipe.formatIndex()
          $('.app_container').append(recipeHtml)
        })
      })
  })
}

// access link for recipe title / Show to be manipulated when clicked
const showRecipe = () => {
  $(document).on('click', '.show_link', function (e) {
    e.preventDefault()
    // temp URL slug to see I'm rendering via this function
    history.pushState(null, null, 'jsRenderedShow')
    fetch(`/recipes/${$(this).attr('data-id')}.json`)
      .then(res => res.json())
      .then(data => {
        let recipeDetails = data
        $('.app_container').html('')
        let newRecipe = new Recipe(recipeDetails)
        let recipeHtml = newRecipe.formatShow()
        $('.app_container').append(recipeHtml)
      })
  })
}

// access link for Next button to be manipulated when clicked
const nextButton = () => {
  $(document).on('click', '.next-recipe-button', function () {
    let id = $(this).attr('data-id')
    fetch(`recipes/${id}/next`)
      .then(res => res.json())
      .then(data => {
        let recipeDetails = data
        $('.app_container').html('')
        let newRecipe = new Recipe(recipeDetails)
        let recipeHtml = newRecipe.formatShow()
        $('.app_container').append(recipeHtml)
      })
  })
}

// access link for Previous button to be manipulated when clicked
const previousButton = () => {
  $(document).on('click', '.previous-recipe-button', function () {
  let id = $(this).attr('data-id')
  fetch(`recipes/${id}/previous`)
    .then(res => res.json())
    .then(data => {
      let recipeDetails = data
      $('.app_container').html('')
      let newRecipe = new Recipe(recipeDetails)
      let recipeHtml = newRecipe.formatShow()
      $('.app_container').append(recipeHtml)
    })
  })
}

// access link for Submit New Recipe button in recipes#new form to be manipulated when clicked/submitted
const submitNewRecipeForm = () => {
  $('#new-recipe-form').on('submit', function (e) {
    e.preventDefault()
    // temp URL slug to see I'm rendering via this function
    history.pushState(null, null, 'jsRenderedShowFromNewRecipeForm')
    let values = $(this).serialize()
    $.post('/recipes', values) 
      .done(function(data) {
        $('.app_container').html('')
        let newRecipe = new Recipe(data)
        let recipeHtml = newRecipe.formatShow()
        $('.app_container').html(recipeHtml)
      });
  });
}

// define JS MO with constructor
function Recipe(recipe) {
  this.id           = recipe.id
  this.title        = recipe.title
  this.description  = recipe.description
  this.user         = recipe.user
  this.ingredients  =recipe.ingredients
  this.recipe_ingredients = recipe.recipe_ingredients
}

// Model prototype function to create the html to render recipes#index with data
Recipe.prototype.formatIndex = function () {
  let recipeHtml = `
    <a href="/recipes/${this.id}" class="show_link" data-id="${this.id}"><h2>${this.title}</h2></a>
  `
  return recipeHtml
}

// Model prototype function to create the html to render recipes#show with data
Recipe.prototype.formatShow = function () {
  let recipeInstance = this
  // ?insert ingredients below description?
  let ingredientsDetails = recipeInstance.ingredients.map(function(ingredient) {
    // let ingredientName = ingredient.name
    return (`
        <li>${ingredient.name}</li>
      `)
  }).join('')

  let recipeHtml = `
    <h2>${this.title}</h2>
    <p>by: <a href="/users/${this.user.id}">${this.user.username}</a></p>
    <p>${this.description}</p>
    <p>Ingredients:</p>
    <ul>${ingredientsDetails}</ul>
    <button class="previous-recipe-button" data-id="${this.id}">Previous</button>
    <button class="next-recipe-button" data-id="${this.id}">Next</button>
  `
  return recipeHtml
}

