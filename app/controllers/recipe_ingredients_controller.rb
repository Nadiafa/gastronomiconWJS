class RecipeIngredientsController < ApplicationController
  
  def new
    @recipe = Recipe.find_by(id: params[:recipe_id])
    @recipe_ingredient = RecipeIngredient.new(recipe_id: params[:recipe_id])
  end

  def create
    set_ingredient
    @recipe_ingredient = RecipeIngredient.new(recipe_ingredients_params)
    @recipe_ingredient.ingredient_id = @ingredient.id
    if @recipe_ingredient.save
      redirect_to recipe_path(@recipe_ingredient.recipe_id)
    else
      render :new 
    end
  end

  def set_ingredient
    @ingredient = Ingredient.find_or_create_by(name: params[:recipe_ingredient][:ingredient_attributes][:name].capitalize)
  end 
  
  private

  def ingredients_params
    params.require(:recipe_ingredient).permit(ingredient_attributes: [:name])
  end
  def recipe_ingredients_params
    params.require(:recipe_ingredient).permit(:ingredient_id, :recipe_id, :quantity)
  end
end 