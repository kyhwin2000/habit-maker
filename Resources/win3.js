/* 변수 선언 */  
var osname = Ti.Platform.osname,
	version = Ti.Platform.version,
	scrHeight = Ti.Platform.displayCaps.platformHeight,
	scrWidth = Ti.Platform.displayCaps.platformWidth;

var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;

var curWin = Ti.UI.currentWindow;
var tileWidth = scrWidth/7;
var date = new Date();
var datesOnMonth = new Array(31,31,28,31,30,31,30,31,31,30,31,30,31);
var days = new Array('일','월','화','수','목','금','토');

/* db 열기 */ 
var db = Ti.Database.open('habits');
// db 확인 함수 
var checkDB = function() {
	var rowRS = db.execute('SELECT * FROM habit');
	Ti.API.info('Row count: ' + rowRS.rowCount);
	var fieldCount;
	// fieldCount is a property on Android.
	if (Ti.Platform.name === 'android') {
	    fieldCount = rowRS.fieldCount;
	} else {
	    fieldCount = rowRS.fieldCount();
	}
	Ti.API.info('Field count: ' + fieldCount);
	
	while (rowRS.isValidRow()){
	  Ti.API.info('habit ---> name: ' + rowRS.fieldByName('name') +', days: ' + rowRS.fieldByName('days') + ', status: ' + rowRS.fieldByName('status'));
	  rowRS.next();
	}	
}

// 오늘 날짜를 변수에 저장
var currentYear = date.getFullYear();
var currentMonth = date.getMonth()+1;
var currentDate = date.getDate();
//alert('오늘은 '+currentYear+'년 '+currentMonth+'월 '+currentDate+'일이다.');


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

/* 달력 그리기 */

// 월 이름 표기하기 
var monthName = Ti.UI.createLabel({
	text: currentYear+'년 '+currentMonth+'월',
	top:50, left:scrWidth/2-60,
	textAlign:'center',
	font: { fontSize: 24 } 
});
curWin.add(monthName);
	
// 이전 달, 다음 달 버튼 만들기 
var previousMonth = Ti.UI.createImageView({
	image:'left-arrow.png',
	top:50, left:0,
});
curWin.add(previousMonth);

var nextMonth = Ti.UI.createImageView({
	image:'right-arrow.png',
	top:50, left:scrWidth-60,
});
curWin.add(nextMonth);

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
	curWin.add(dayName[d]);	
};

// 달력 그리기 함수 

var drawCalendar = function(y,m){ 
	var tile = new Array(42);
	var start = calculateDate(y,m,1)%7;
	//alert('이번 달 1일은 '+(start+1)+'번째 칸이다.');
	//alert('이번 달 말일은 '+datesOnMonth[m]+'일이다.');
	
	//월 이름 표기하기
	monthName.setText(y+'년 '+m+'월');
	
	//db에서 기 체크된 날짜 확인  
	var rowRS = db.execute('SELECT * FROM habit');
	var selectedRow = Ti.App.Properties.getInt('selectedRow');
	var i = 0;
	while(i!=selectedRow){
		rowRS.next();
		i++;
	}
	var rowDays = rowRS.fieldByName('days');
	Ti.API.info(rowDays);
	
	//체크 표시 이미지 뷰 생성 
	var checked = Ti.UI.createImageView({
		image:'/checkmark.png'
	});

	//타일 생성 
	for(var i=0;i<tile.length;i++){
		if(i>=start && i<=(datesOnMonth[m]+(start-1))){
			// 오늘 날짜 푸른색 표기 
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
		
		//기 체크된 날짜 표시 
		if(tile[i].getTitle() == rowDays){
			tile[i].add(checked);
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
			//체크 표시 이미지 뷰 생성 
			var checked = Ti.UI.createImageView({
				image:'/checkmark.png'
			});
			this.add(checked);
			db.execute('INSERT INTO habit (days) VALUES (?)', this.getTitle());
			checkDB();
		});
		//타일을 뷰에 더하기 
		curWin.add(tile[i]);	
	}
};
drawCalendar(currentYear,currentMonth);