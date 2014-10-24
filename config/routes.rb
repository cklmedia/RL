Register::Application.routes.draw do
  root 'users#index'
  resources :users
  #require "api"
  mount RegisterApi::API => '/'
  match '/users/get_register_record/:id&:year&:month&:type',to:'users#get_register_record',via:'get'
end
