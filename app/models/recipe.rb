class Recipe < ApplicationRecord
  validates :title, presence: true
  
  belongs_to :user
  has_many :recipe_ingredients
  has_many :ingredients, through: :recipe_ingredients

  accepts_nested_attributes_for :recipe_ingredients, :ingredients

  scope :recent, -> { order("created_at DESC").limit(3) }

  def add_ingredients_to_recipe(params)
    params[:recipe_ingredients_attributes].each do |k, v|
      if v[:ingredient_attributes][:name].present?
        ingredient_name = v[:ingredient_attributes][:name].capitalize
        new_ingredient = Ingredient.find_or_create_by(name: ingredient_name)
      elsif v[:ingredient_id].present?
        new_ingredient = Ingredient.find_by(id: v[:ingredient_id])
      end
      if v[:quantity].present?
        RecipeIngredient.create(quantity: v[:quantity], ingredient_id: new_ingredient.id, recipe_id: self.id )
      end
    end
  end

  def previous
    recipe = Recipe.where(["id < ?", id]).last
    recipe ? recipe : Recipe.last
  end

  def next
    recipe = Recipe.where(["id > ?", id]).first
    recipe ? recipe : Recipe.first
  end 
end
