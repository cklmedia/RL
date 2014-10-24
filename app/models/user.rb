class User < ActiveRecord::Base
  # 上传图片
  mount_uploader :user_avatar, UserAvatarUploader

  has_many :register_records,:dependent => :destroy


  def last_register
  	self.register_records.last	
  end

  def get_time(id,y,m,type)
  	j = 1
  	total_time = i = 0
  	records = RegisterRecord.select_user(id)
  	if type == "month"
  	  records = records.select_one_month(y,m)
  	elsif type == "week"
  	  records = records.select_now_week
  	end
  	(records.length/2).times do 
	  total_time += records[j].register_time - records[i].register_time
	  i += 2
	  j += 2
	end
  	total_time/3600
  end

  def self.get_sort_user_by_time(y,m,type)
   times = {}
    User.all.each do |r|
      # 初始化hash，以user.id为key，时间为value
      times[r.id] = [r,r.get_time(r.id,y,m,type)]
    end
    # 对hash排序，结果为二维数组，再反转为倒序
    Hash[times.sort_by { |id, a| a[1] }.reverse].map { |key,value| value[0]}
  end

  def self.get_sort_time_arr(y,m,type)
    times = []
    User.all.each_with_index do |r,i|
        # 初始化hash，以user.id为key，时间为value
        times[i] = r.get_time(r.id,y,m,type)
    end
    times.sort { |x,y| y <=> x }
  end
end
