class UsersController < ApplicationController

  def index
  	@users=User.all
    @user = User.new
  end

  def show
  	@user = User.find(params[:id])
    @month_rank = get_num_of_sort_time(@user.id,"month")
    @week_rank = get_num_of_sort_time(@user.id,"week")
  end

  def create
    @user = User.new(get_user_params)
  	@user.save
	  redirect_to :back
  end

  def update
    @user = User.find(params[:id])
    @user.update_attributes(get_user_params)
    redirect_to :back
  end

  def destroy
    @user = User.find(params[:id]).delete
    redirect_to :back
  end

  def get_register_record
    @user = User.find(params[:id])
    year = params[:year]
    type = params[:type]
    month = params[:month]
    records = @user.register_records.select_one_month(year,month)
    str = {}
    str["cale"] = {}
    str["total_time"]= @user.get_time(@user.id,year,month,type).round(2).to_s
    records.each do |r|
      str["cale"][r.register_time.strftime("%Y-%m-%d")] = {} if str["cale"][r.register_time.strftime("%Y-%m-%d")] == nil
      span = str["cale"][r.register_time.strftime("%Y-%m-%d")].length
      str["cale"][r.register_time.strftime("%Y-%m-%d")][span] ={
        :type => r.status,
        :name => r.register_time.strftime("%H:%M"),
        :info => r.get_action
      }
    end
    
    render :json => str.to_json
  end

  private
    def get_user_params
      params.require(:user).permit(:name, :card, :sex,:tel,:user_avatar)
    end

    def get_num_of_sort_time(id,type)
      arr = User.get_sort_user_by_time(Time.now.year,Time.now.month,type)
      res = 0
      arr.each_with_index do |v,i|
        if id == v.id
          res = i+1
          break
        end
      end
      res
    end

end
