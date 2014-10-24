module RegisterApi
  ### API Helper
  module APIHelpers

    def logger
      API.logger
    end

    def validate_auth_key(auth_key)
      return true if AuthKey.where(:key => auth_key).first
      false
    end

  end

  module APIEntities

    class UserInfo < Grape::Entity
      expose :name
      expose :sex
      expose :card
      expose :register_pwd
      expose :user_avatar_url
      expose :register_status do |records, options|
        if !records.register_records.blank?
          RegisterRecord.get_last_register(records.id,"status")
        else
          -1
        end
      end
      expose :last_time do |records, options|
        if !records.register_records.blank?
          RegisterRecord.get_last_register(records.id,"time")
        else
          "-1"
        end
      end
    end

    class User <  Grape::Entity
      expose :success_status, as: :status
      private
        def success_status
          1
        end
      expose :records, using: APIEntities::UserInfo do |records, options|
        r = options[:records]
        r
      end
    end

    class TotalTime < Grape::Entity
      expose :records, using: APIEntities::UserInfo do |records, options|
        options[:records]    
      end
      expose :time, if: lambda { |instance, options| options[:time] } do |instance, options|
        options[:time]
      end
    end

  end

  class API < Grape::API

    prefix "api"
    format :json

    helpers APIHelpers


    get "/get_all_users" do
      users = User.all
      if !users.blank?
        present 1, :with => APIEntities::User, records: users
        return
      else
        return result={"status"=>0,"err_msg"=>"no user be found"}
      end
    end

    post "/post_register" do
      card = params[:card]
      action = params[:action]
      user = User.find_by_card(card)
      RegisterRecord.create!(user:user,status:action,register_time:Time.now)
    end

    get "/get_one_user/:card" do 
      card = params[:card]
      user = User.find_by_card(card)
      present user, :with => APIEntities::UserInfo
    end

    post "/post_user_pwd" do
      pwd = params[:pwd]
      card = params[:card]
      user = User.find_by_card(card)
      user.register_pwd = pwd
      user.save
    end
    
    get "/count_all_user_time/:year/:month/:type" do
      type = params[:type]
      year = params[:year]
      month = params[:month]
      time_arr = User.get_sort_time_arr(year,month,type)
      user_arr = User.get_sort_user_by_time(year,month,type)
      present 1, :with => APIEntities::TotalTime,:time => time_arr,records: user_arr
    end

  end

end