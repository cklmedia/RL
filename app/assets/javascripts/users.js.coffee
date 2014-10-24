$(document).ready ->
  show_time = ->
    now = new Date()
    year = now.getFullYear()
    month = now.getMonth() + 1
    day = now.getDate()
    hours = now.getHours()
    minutes = now.getMinutes()
    seconds = now.getSeconds()
    timeValue = year + "年"
    timeValue += month + "月"
    timeValue += day + "日 "
    timeValue += (if (hours <= 12) then "上午" else "下午")
    timeValue += (if (hours > 12) then hours - 12 else hours)
    timeValue += ((if (minutes < 10) then ":0" else ":")) + minutes
    timeValue += ((if (seconds < 10) then ":0" else ":")) + seconds
    $(".header_p").text timeValue 
  show_time() 
  setInterval show_time, 1000

$(document).ready ->
  now = new Date()
  now_year = now.getFullYear()
  now_month = now.getMonth() + 1
  user_id = $(".user_id_for_caleender").text()
  create_month_register = (id,year,month,type)->
    #获取到课情况
    $.get "/users/get_register_record/"+id+"&" + year+"&"+month+"&"+type, (data) ->
      $(".user_one_month_time").text(data["total_time"])
      #实例对象，初始参数
      $(".jq_calendar").eq(0).jq_calendar
        year: year
        month: month
        infoJson: data["cale"]
      $(".user_infomation").css("height",$(".user_month_cale").height()+32+"px")
      return
  reset_caleender = ->
    $(".cyear option").each ->
      $(this).attr "selected", true if $(this).val() is now_year.toString()
    $(".cmonth option").each ->
      $(this).attr "selected", true if $(this).val() is now_month.toString()

  # 进入show页面初始化日历
  create_month_register user_id,now_year,now_month,"month" if user_id!=""
  # 初始化选择下拉框
  reset_caleender()
  # 按钮相应时间
  $(".jq_calendar_today").click ->
    user_id = $(".user_id_for_caleender").text()
    create_month_register user_id,now_year,now_month,"month"
  # 下拉框相应事件
  $(".cyear,.cmonth").change ->
    user_id = $(".user_id_for_caleender").text()
    year = $(".cyear").val()
    month = $(".cmonth").val()
    create_month_register user_id,year,month,"month"