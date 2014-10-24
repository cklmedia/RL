(function($){
	$.fn.jq_calendar=function(options){

        var obj=this;
		var defaults={
			infoJson:{}
		}
		var opts = $.extend(defaults, options);
		var infoJson=opts.infoJson;
		var now=new Date();
		var nowY=now.getFullYear();
		var nowM=now.getMonth()+1;
		
		//获取农历函数
		var CalendarData = new Array(100);
		var madd = new Array(12);
		var tgString = "甲乙丙丁戊己庚辛壬癸";
		var dzString = "子丑寅卯辰巳午未申酉戌亥";
		var numString = "一二三四五六七八九十";
		var monString = "正二三四五六七八九十冬腊";
		var weekString = "日一二三四五六";
		var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
		var cYear, cMonth, cDay, TheDate;
		CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
		madd[0] = 0;
		madd[1] = 31;
		madd[2] = 59;
		madd[3] = 90;
		madd[4] = 120;
		madd[5] = 151;
		madd[6] = 181;
		madd[7] = 212;
		madd[8] = 243;
		madd[9] = 273;
		madd[10] = 304;
		madd[11] = 334;
		
		function GetBit(m, n) {
		    return (m >> n) & 1;
		}
		function e2c() {
		    TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
		    var total, m, n, k;
		    var isEnd = false;
		    var tmp = TheDate.getYear();
		    if (tmp < 1900) {
		        tmp += 1900;
		    }
		    total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
		
		    if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
		        total++;
		    }
		    for (m = 0; ; m++) {
		        k = (CalendarData[m] < 0xfff) ? 11 : 12;
		        for (n = k; n >= 0; n--) {
		            if (total <= 29 + GetBit(CalendarData[m], n)) {
		                isEnd = true; break;
		            }
		            total = total - 29 - GetBit(CalendarData[m], n);
		        }
		        if (isEnd) break;
		    }
		    cYear = 1921 + m;
		    cMonth = k - n + 1;
		    cDay = total;
		    if (k == 12) {
		        if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
		            cMonth = 1 - cMonth;
		        }
		        if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
		            cMonth--;
		        }
		    }
		}
		
		function GetcDateString() {
		    var tmp = "";
		    if (cMonth < 1) {
		        tmp += "(闰)";
		        tmp += monString.charAt(-cMonth - 1);
		    } else {
		        tmp += monString.charAt(cMonth - 1);
		    }
		    tmp += "月";
		    tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
		    if (cDay % 10 != 0 || cDay == 10) {
		        tmp += numString.charAt((cDay - 1) % 10);
		    }
		    return tmp;
		}
		
		function GetLunarDay(solarYear, solarMonth, solarDay) {
		    //solarYear = solarYear<1900?(1900+solarYear):solarYear;
		    if (solarYear < 1921 || solarYear > 2020) {
		        return "";
		    } else {
		        solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
		        e2c(solarYear, solarMonth, solarDay);
		        return GetcDateString();
		    }
		}
		
		//获取农历日期
		function GetCNDate(y,m,d) {
		    return GetLunarDay(y,m,d);
		} 
        
		//获取月份天数
		function getDaysInMonth(year,month){
		      var month = parseInt(month,10);
		      var temp = new Date(year,month,0);
		      // console.log(temp)
		      return temp.getDate();
		}
		
		//获取星期几
		function getDayOfWeek(y,m,d){
			var day=new Date(y,m-1,d);
			var week=day.getDay();
			return week;
			
		}
		
		//获取Json数据长度
		function getJsonLength(jsonData){
			var jsonLength = 0;
			for(var item in jsonData)
				jsonLength++;
			return jsonLength;
		}		
		
		//日期Li列表
		function monthList(y,m){
			// console.log("日期Li列表")
			// 获取当前月份的第一天星期
			var dayFirst=getDayOfWeek(y,m,1);
			// 获取月份天数
			var daysInMonth=getDaysInMonth(y,m);
			// 获取当前月份的最后星期
			var dayLast=getDayOfWeek(y,m,daysInMonth);

			var monthDayArr=new Array();

			var yList=mList=retrunStr=dayListStr=str="";
			
			//日期前置空白填充
			for(i=0;i<dayFirst;i++){
			   monthDayArr[i]=new Array();
			   monthDayArr[i]["day"]="";
			   monthDayArr[i]["cnday"]="";
			   monthDayArr[i]["info"]="";
			}
			// console.log(daysInMonth.toString()+"月份天数")
			//月份数字填充
			for(i=0;i<daysInMonth;i++){
				// console.log("月份数字填充")
				// 初始时间class当前月份的第一天例如2014-10-1
				var liClass=y+"-"+m+"-"+(i+1);
				// 获取农历
				var CNDate=GetCNDate(y,m,i+1);
				//传过来的info信息
				var dayInfoJson=infoJson[liClass];
				var infoStr="";
				if(dayInfoJson){
					jsonLen=getJsonLength(dayInfoJson);
					for(j=0;j<jsonLen;j++){
						infoStr+=' <a class="calendar_info_type'+(parseInt(dayInfoJson[j]["type"])+1)+'" info="'+dayInfoJson[j]["info"]+'">'
						+dayInfoJson[j]["name"]+'</a>';
					}
					
				}

				monthDayArr[i+dayFirst]=new Array();
				monthDayArr[i+dayFirst]["day"]=i+1;
			    monthDayArr[i+dayFirst]["cnday"]=CNDate;
				monthDayArr[i+dayFirst]["info"]=infoStr;
			}
			
			//后置填充
			for(i=0;i<7-dayLast-1;i++){
			    var j=dayFirst+daysInMonth;
				monthDayArr[j+i]=new Array();
				monthDayArr[j+i]["day"]="";
			    monthDayArr[j+i]["cnday"]="";
				monthDayArr[j+i]["info"]="";
		    }			
			
			//日期列表
			for(i=0;i<monthDayArr.length;i++){
				//var CNDate=GetCNDate(y,m,d)
				var d=monthDayArr[i]["day"];
				if(d==""){
				   d=0;	
				}
				var liClass=y+"-"+m+"-"+d;
				
				var str='		 <li class="'+liClass+'">'+
						'			<div class="calendar_info">'+
										monthDayArr[i]["info"]+
						'			</div>'+
						'			<font><b>'+monthDayArr[i]["day"]+'</b><i>'+monthDayArr[i]["cnday"]+'</i></font>'+
						'		 </li>';
				dayListStr+=str;
			}
			
			// for(i=2014;i<=2020;i++){
			//     yList+='<option>'+i+'</option>';
			// }
			// for(i=1;i<=12;i++){
			// 	mList+='<option>'+i+'</option>'
			// }
			
			var  boxStr='  <div class="jq_calendar_head">'+
			'	 <span class="jq_calendar_head_l"></span>'+
			'	 <span class="jq_calendar_head_c"><h1>'+y+"-"+m+'</h1></span>'+
			'	 <span class="jq_calendar_head_r">'+        
			'	 </span>'+
			'	 <div class="clear"></div>'+          
			'  </div>'+
			'  <div class="jq_calendar_body">'+
			'	  <ul class="jq_calendar_body_top">'+
			'		 <li>星期日</li>'+  
			'		 <li>星期一</li>'+
			'		 <li>星期二</li>'+
			'		 <li>星期三</li>'+
			'		 <li>星期四</li>'+
			'		 <li>星期五</li>'+
			'		 <li>星期六</li>'+
			'		 <div class="clear"></div>'+           
			'	  </ul>'+
			'	  <ul class="calendar_day_list">'+
			         dayListStr+
			'		 <div class="clear"></div>'+
			'	  </ul>'+
			'	  <div class="clear"></div>'+
			'  </div>'+
			'  <div class="clear"></div>';
			
			return boxStr;
		}

        //初始化日历插件
        function initCalendar(y,m){
			 obj.html(monthList(y,m));
			 //Info 提示信息显示		 
			 obj.find(".calendar_info>a").hover(function(){			   
				    $(this).append('<div class="calendar_info_show">'+$(this).attr("info")+'</div>');
					$(".calendar_info_show").hide().fadeIn();
				 },function(){
					$(".calendar_info_show").remove();				 
			 })
			 
			 //"今天"Button绑定事件
			 // $(".jq_calendar_today").click(function(){
				//  initCalendar(nowY,nowM)				 
			 // })
			 
			 // $(".cyear,.cmonth").change(function(){
				//  year=obj.find(".cyear").val();
				//  month=obj.find(".cmonth").val();
				//  initCalendar(year,month);	
			 // })
			 
		}
		
        var now=new Date();
		var initY=now.getFullYear();
		var initM=now.getMonth()+1;

		if(opts.year){
			initY=opts.year;
		}
		if(opts.year){
			initM=opts.month;
		}
		initCalendar(initY,initM);

	};
	
})(jQuery);