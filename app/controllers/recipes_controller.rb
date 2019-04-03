class RecipesController < ApplicationController
  before_action :redirect_if_not_logged_in
  before_action :set_recipe, only: %i[show previous next]
  
  def index
    @recipes = Recipe.all
    respond_to do |f|
      f.html
      f.json { render json: @recipes }
    end
  end 

  def new
    @recipe = Recipe.new
  end 

  def create
    @recipe = current_user.recipes.new(recipe_params)
    if @recipe.save
      @recipe.add_ingredients_to_recipe(recipe_ingredients_params)
      redirect_to user_recipe_path(current_user, @recipe)
    else
      render :new 
    end
  end

  def show
    respond_to do |f|
      f.html
      f.json { render json: @recipe }
    end
  end

  def previous
    @previous_recipe = @recipe.previous
    render json: @previous_recipe
  end

  def next
    @next_recipe = @recipe.next
    render json: @next_recipe
  end

  private

  def recipe_params
    params.require(:recipe).permit(:title, :description)
  end

  def recipe_ingredients_params
    params.require(:recipe).permit(recipe_ingredients_attributes: [:quantity, :ingredient_id, ingredient_attributes: [:name]])
  end

  def set_recipe
    @recipe = Recipe.find_by(id: params[:id])
  end
end
