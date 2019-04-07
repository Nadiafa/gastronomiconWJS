// on document ready run event handling function/s
$(() => {
  clickHandlers()
})

const clickHandlers = () => {
  indexRecipes()
  showRecipe()
  nextButton()
  previousButton()
  submitNewRecipeForm()
}

// View Recipes link for Index
const indexRecipes = () => {
  $('#all-recipes').on('click', (e) => {
    e.preventDefault()
    // temp URL slug to see I'm rendering via this function
    history.pushState(null, null, 'jsRenderedIndex')
    // history.pushState(null, null, 'all-recipes')
    fetch(`/recipes.json`)
      .then(res => res.json())
      .then(data => {
        $('#app-container').html('')
        data.forEach(recipe => {
          let newRecipe = new Recipe(recipe)
          let recipeHtml = newRecipe.formatIndex()
          $('#app-container').append(recipeHtml)
        })
      })
  })
}

// recipe title link for Show
const showRecipe = () => {
  $(document).on('click', '.show-link', function (e) {
    e.preventDefault()
    let id = $(this).attr('data-id')
    // temp URL slug to see I'm rendering via this function
    history.pushState(null, null, 'jsRenderedShow')
    // history.pushState(null, null, `recipe-${id}`)
    fetch(`/recipes/${id}.json`)
      .then(res => res.json())
      .then(data => {
        let recipeDetails = data
        $('#app-container').html('')
        let newRecipe = new Recipe(recipeDetails)
        let recipeHtml = newRecipe.formatShow()
        $('#app-container').append(recipeHtml)
      })
  })
}

// Next button
const nextButton = () => {
  $(document).on('click', '.next-recipe-button', function () {
    let id = $(this).attr('data-id')
    fetch(`recipes/${id}/next`)
      .then(res => res.json())
      .then(data => {
        let recipeDetails = data
        $('#app-container').html('')
        let newRecipe = new Recipe(recipeDetails)
        let recipeHtml = newRecipe.formatShow()
        $('#app-container').append(recipeHtml)
      })
  })
}

// Previous button
const previousButton = () => {
  $(document).on('click', '.previous-recipe-button', function () {
  let id = $(this).attr('data-id')
  fetch(`recipes/${id}/previous`)
    .then(res => res.json())
    .then(data => {
      let recipeDetails = data
      $('#app-container').html('')
      let newRecipe = new Recipe(recipeDetails)
      let recipeHtml = newRecipe.formatShow()
      $('#app-container').append(recipeHtml)
    })
  })
}

// Cretate Recipe button in recipes#new form dynamic resource submission
const submitNewRecipeForm = () => {
  $('#new-recipe-form').on('submit', function (e) {
    e.preventDefault()
    // temp URL slug to see I'm rendering via this function
    history.pushState(null, null, 'jsRenderedShowFromNewRecipeForm')
    // history.pushState(null, null, `${this.id}`)
    let values = $(this).serialize()
    $.post('/recipes', values) 
      .done(function(data) {
        $('#app-container').html('')
        let newRecipe = new Recipe(data)
        let recipeHtml = newRecipe.formatShow()
        $('#app-container').html(recipeHtml)
      });
  });
}

// JS MO constructor
function Recipe(recipe) {
  this.id           = recipe.id
  this.title        = recipe.title
  this.description  = recipe.description
  this.user         = recipe.user
  this.ingredients  =recipe.ingredients
  this.recipe_ingredients = recipe.recipe_ingredients
}

// html for recipes#index
Recipe.prototype.formatIndex = function () {
  let recipeHtml = `
    <a href="/recipes/${this.id}" class="show-link" data-id="${this.id}"><h2>${this.title}</h2></a>
  `
  return recipeHtml
}

// html for recipes#show
Recipe.prototype.formatShow = function () {
  let recipeInstance = this
  let ingredientsDetails = recipeInstance.ingredients.map(function(ingredient) {
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

