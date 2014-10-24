class RegisterRecord < ActiveRecord::Base
  belongs_to :user
  scope :sort, ->  {order(register_time: :desc)}

  scope :select_one_month, ->(y,m){
  	begin_d = Time.parse("#{y}-#{m}-01")
  	end_d = Time.parse(Date.new(y.to_i,m.to_i,-1).to_s+" 23:59:59")
  	where("register_time between '#{begin_d}' and '#{end_d}'")
  }
  
  scope :select_now_week, ->{
    begin_d = Time.now.beginning_of_week
    end_d = Time.now.end_of_week
    where("register_time between '#{begin_d}' and '#{end_d}'")
  }

  scope :select_user, -> (id){where(user_id: id)}

  def get_action
  	if self.status == 1
  		"到岗"
  	else
  		"离岗"
  	end
  end

  def self.get_last_register(id,type)
    r = RegisterRecord.select_user(id).last
    r = RegisterRecord.create(user_id:id,status:0,register_time:r.register_time+4.hour) if (Time.now - r.register_time) >= 12.hour && r.status == 1
    if type == "status"
      r.status
    else
      r.register_time.strftime("%Y-%m-%d"" %H:%M")
    end
  end
  
end
