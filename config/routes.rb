Rails.application.routes.draw do
  
  # get request for omniauth / find or create user and initiate session
  get '/auth/:provider/callback', to: 'sessions#create'

  # redirect '/' to a home/welcome page
  root 'application#home'
  
  # signup / create a user
  get '/signup', to: 'users#new'
  
  # login & logout / create & destroy a session
  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  get '/logout', to: 'sessions#destroy'
  
  # users / user/index / user/new
  resources :users, except: [:indexq, :new]
  
  # recipes / recipe/new / recipe/show nested into the current user
  resources :users, only: [] do 
    resources :recipes, only: [:new, :show]
  end 

  # recipes / only for index, create and show
  resources :recipes, only: [:index, :create]
  
  get '/recipes/:id/next', to: 'recipes#next'


  resources :recipes, only: [:show] do
    resources :ingredients, only: [:show]
    resources :recipe_ingredients, only: :new
  end

  resources :recipe_ingredients, only: :create
end
