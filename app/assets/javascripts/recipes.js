// on document ready run event handling function/s
$(() => {
  clickHandlers()
})

// define event handling function/s
const clickHandlers = () => {
  // access link to be manupulated when clicked
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

// Model prototype function to create the html to render with data
Recipe.prototype.formatIndex = function () {
  // MAY remove the username and/or description to have it dynamically rendered by clicking the title link
  let recipeHtml = `
    <a href="/recipes/${this.id}" class="show_link" data-id="${this.id}"><h1>${this.title}</h1></a>
    <p>${this.description}</p>
    <p>by: <a href="/users/${this.user.id}">${this.user.username}</a></p>
  `
  return recipeHtml
}