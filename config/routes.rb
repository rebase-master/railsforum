Temp::Application.routes.draw do

  root :to => "topics#index", via: [:get]
  resources :topics do
    member do
      get :delete
    end
    resources :comments do
      member do
        get :delete
      end
    end
  end
end
