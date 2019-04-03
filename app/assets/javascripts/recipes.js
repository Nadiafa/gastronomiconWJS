// on document ready run event handling function/s
$(() => {
  clickHandlers()
})

// define event handling function/s
const clickHandlers = () => {
  // access link for View Recipes / Index to be manipulated when clicked
  $('.all_recipes').on('click', (e) => {
    e.preventDefault()
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

  // access link for recipe title / Show to be manipulated when clicked
  $(document).on('click', '.show_link', function (e) {
    e.preventDefault()
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
  // MAY remove the username and/or description to have it dynamically rendered by clicking the title link to go to recipes#show
  let recipeHtml = `
    <a href="/recipes/${this.id}" class="show_link" data-id="${this.id}"><h2>${this.title}</h2></a>
    <p>${this.description}</p>
    <p>by: <a href="/users/${this.user.id}">${this.user.username}</a></p>
  `
  return recipeHtml
}

// Model prototype function to create the html to render recipes#show with data
Recipe.prototype.formatShow = function () {
    // will insert ingredients below description
  let recipeHtml = `
    <h2>${this.title}</h2>
    <p>by: <a href="/users/${this.user.id}">${this.user.username}</a></p>
    <p>${this.description}</p>

  `
  return recipeHtml
}