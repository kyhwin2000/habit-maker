var osname = Ti.Platform.osname,
	version = Ti.Platform.version,
	scrHeight = Ti.Platform.displayCaps.platformHeight,
	scrWidth = Ti.Platform.displayCaps.platformWidth;


/* 변수 선언 */  
var tileWidth = scrWidth/7;
var date = new Date();
var datesOnMonth = new Array(31,31,28,31,30,31,30,31,31,30,31,30,31);
var days = new Array('일','월','화','수','목','금','토');

// 오늘 날짜를 변수에 저장
var currentYear = date.getFullYear();
var currentMonth = date.getMonth()+1;
var currentDate = date.getDate();
//alert('오늘은 '+currentYear+'년 '+currentMonth+'월 '+currentDate+'일이다.');


// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'습관 목록',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});

var label1 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 1',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});
win1.add(label1);

var data = [
		{title:"매일 코딩", hasChild:true, color:'red', selectedColor:'#fff'},
		{title:"매일 운동", hasChild:true, color:'red', selectedColor:'#fff'},
		{title:"매일 독서", hasChild:true, color:'red', selectedColor:'#fff'},
		{title:"매일 신문", hasChild:true, color:'red', selectedColor:'#fff'},
		{title:"매일 편지", hasChild:true, color:'red', selectedColor:'#fff'}
];
/*
// create table view
for (var i = 0; i < data.length; i++ ) { 
	data[i].color = '#000'; 
	data[i].font = {fontWeight:'bold'}
};

var row = Ti.UI.createTableViewRow({
		className:'habits',
		selectedBackgroundColor:'white',
		height:30
});
var Progress = Ti.UI.createLabel({
	color:'#576996',
   	font:{fontFamily:'Arial', fontSize:24, fontWeight:'bold'},
   	text:'34 %',
   	left:240, top: 6,
   	width:200, height: 30
}); 
row.add(Progress);
data.push(row);
var tableview = Titanium.UI.createTableView({
	data:data
});

tableview.addEventListener('click',function(e){
	tab1.open(win2);
});
win1.add(tableview);
*/

// generate random number, used to make each row appear distinct for this example
function randomInt(max){
  return Math.floor(Math.random() * max) + 1;
}

// var IMG_BASE = 'https://github.com/appcelerator/titanium_mobile/raw/master/demos/KitchenSink/Resources/images/';
var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;

var tableData = [];

for (var i=1; i<=20; i++){
  var row = Ti.UI.createTableViewRow({
    className:'habits', // used to improve table performance
    selectedBackgroundColor:'white',
    rowIndex:i, // custom property, useful for determining the row during events
    height:60
  });
  
  var habitName = Ti.UI.createLabel({
    color:'#576996',
    font:{fontFamily:'Arial', fontSize:defaultFontSize+6, fontWeight:'bold'},
    text:'habit'+i,
    left:10, top: 20,
    width:200, height: 30
  });
  row.add(habitName);
  
  var habitProgress = Ti.UI.createLabel({
    color:'#999',
    font:{fontFamily:'Arial', fontSize:defaultFontSize, fontWeight:'normal'},
    text:randomInt(100) + ' % 진행',
    left:240, top:20,
    width:200, height:20
  });
  row.add(habitProgress);
  tableData.push(row);
}

var tableView = Ti.UI.createTableView({
  backgroundColor:'white',
  data:tableData
});

tableView.addEventListener('click',function(e){
	tab1.open(win2);
});

win1.add(tableView);
win1.open();

var inputWindow = Ti.UI.createWindow({
	title: '습관 입력',
	backgroundColor:'#fff',
	url: 'inputWindow.js'
});

// 내비게이션 바에 추가 버튼 만들기
var addEvent = Titanium.UI.createButton({ title:'추가' });
win1.rightNavButton = addEvent;
addEvent.addEventListener('click', function()
{
	//tab1.open(win3);
	tab1.open(inputWindow);
});

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'습관 달력',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Tab 2',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);



//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  


// open tab group
tabGroup.open();

/* 달력 알고리즘 */

// 서기 1년 1월 1일~ y년 m월 d일까지의 경과된 날수 파악하기 
var calculateDate = function(y,m,d){
	var t1,t2,tot;
	var a;
	// 서기 1년 1월 1일~y-1년 12월 31일까지 경과된 날수
    t1= (y-1)*365 + parseInt((y-1)/4) - parseInt((y-1)/100)  + parseInt((y-1)/400);
    // y년 1월 1일 ~ m-1월 말일까지의 경과된 날수 
    // y년이 윤년이면 2월달의 날 수를 하루 더해줌(29일로 만듬)
    if( y%4==0 && y%100!=0 || y%400==0 ) {
    	datesOnMonth[2] = 29;
    }
    t2=0;
    for(a=1;a<m;a++){
    	t2+=datesOnMonth[a];
    }
          
    /* 서기 1년 1월 1일~ y년 m월 d일까지의 경과된 날수 */
    tot = parseInt(t1 + t2 + d);
    return(tot);
}
//alert('오늘은 서기 1년 1월 1일부터 '+calculateDate(currentYear,currentMonth,currentDate)+'번째 날짜이다.');

/* UI 그리기 */

// 월 이름 표기하기 
var monthName = Ti.UI.createLabel({
	text: currentYear+'년 '+currentMonth+'월',
	top:50, left:scrWidth/2-60,
	textAlign:'center',
	font: { fontSize: 24 } 
});
win2.add(monthName);
	
// 이전 달, 다음 달 버튼 만들기 
var previousMonth = Ti.UI.createImageView({
	image:'left-arrow.png',
	top:50, left:0,
});
win2.add(previousMonth);

var nextMonth = Ti.UI.createImageView({
	image:'right-arrow.png',
	top:50, left:scrWidth-60,
});
win2.add(nextMonth);

//이전 달, 다음 달 버튼 액션 지정하기	
previousMonth.addEventListener('click',function(e){
	if(currentMonth>1 && currentMonth<=12){
		currentMonth--;
	} else if(currentMonth<=1){
		currentYear--;
		currentMonth+=11;
		//alert("넘겨주는 년도는 "+currentYear+" 넘겨주는 달은 "+currentMonth);
	}
	drawCalendar(currentYear,currentMonth);
});

nextMonth.addEventListener('click',function(e){
	if(currentMonth>=1 && currentMonth<12){
		currentMonth++;
	} else if(currentMonth>=12){
		currentYear++;
		currentMonth-=11;
	} 
	drawCalendar(currentYear,currentMonth);
});

// 요일 헤더 표기하기 
var dayName = new Array(7);
for(var d=0;d<7;d++){
	dayName[d] = Ti.UI.createLabel({
		backgroundColor: 'gray',
		color: 'white',
	    text: days[d],
	    textAlign: 'center',
	    top: 100,
	    left: 0+d*tileWidth,
	    width: tileWidth, 
	    height: 30
	})
	win2.add(dayName[d]);	
};

/* 달력 그리기 */

var drawCalendar = function(y,m){ 
	var tile = new Array(42);
	var start = calculateDate(y,m,1)%7;
	//alert('이번 달 1일은 '+(start+1)+'번째 칸이다.');
	//alert('이번 달 말일은 '+datesOnMonth[m]+'일이다.');
	
	//월 이름 표기하기
	monthName.setText(y+'년 '+m+'월');
	
	//타일 생성 
	for(var i=0;i<tile.length;i++){
		if(i>=start && i<=(datesOnMonth[m]+(start-1))){
			if(i==currentDate-start+3){
				tile[i] = Ti.UI.createButton({
				title:i-start+1,
				top:130,
				left:0+i*tileWidth,
				width:tileWidth,
				height:30,
				backgroundColor:'white',
				color:'blue'
				});
			} else {
				tile[i] = Ti.UI.createButton({
				title:i-start+1,
				top:130,
				left:0+i*tileWidth,
				width:tileWidth,
				height:30,
				backgroundColor:'white',
				color:'black'
				});
			}	
		} else if(i<start){
			tile[i] = Ti.UI.createButton({
				title:datesOnMonth[m-1]-(start-i)+1,
				top:130,
				left:0+i*tileWidth,
				width:tileWidth,
				height:30,
				backgroundColor:'white',
				color:'gray'
			});
		} else {
			tile[i] = Ti.UI.createButton({
				title:i-(datesOnMonth[m]+(start-1)),
				top:130,
				left:0+i*tileWidth,
				width:tileWidth,
				height:30,
				backgroundColor:'white',
				color:'gray'
			});
		}
			
		//타일 위치 조정
		if(i>=7 && i<14) { 
			tile[i].setTop(tile[i].getTop()+30);
			tile[i].setLeft(tile[i].getLeft()-tileWidth*7);
		} else if(i>=14 && i<21){
			tile[i].setTop(tile[i].getTop()+60);
			tile[i].setLeft(tile[i].getLeft()-tileWidth*14);
		} else if(i>=21 && i<28){
			tile[i].setTop(tile[i].getTop()+90);
			tile[i].setLeft(tile[i].getLeft()-tileWidth*21);
		} else if(i>=28 && i<35){
			tile[i].setTop(tile[i].getTop()+120);
			tile[i].setLeft(tile[i].getLeft()-tileWidth*28);
		} else if(i>=35){
			tile[i].setTop(tile[i].getTop()+150);
			tile[i].setLeft(tile[i].getLeft()-tileWidth*35);
		}
		//타일 탭 이벤트 설정
		tile[i].addEventListener('click',function(e){
			this.backgroundColor = '#FEF9BF';
			this.color = '#008E00';
			var check = Ti.UI.createImageView({
				image:'/checkmark.png'
			});
			this.add(check);
		});
		//타일을 뷰에 더하기 
		win2.add(tile[i]);	
	}
};
drawCalendar(currentYear,currentMonth);

