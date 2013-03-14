/* 전역 변수 선언 */  
var osname = Ti.Platform.osname,
	version = Ti.Platform.version,
	scrHeight = Ti.Platform.displayCaps.platformHeight,
	scrWidth = Ti.Platform.displayCaps.platformWidth;

var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;

/* DB 만들기 */
var db = Ti.Database.open('habitDB');
//db.execute('DROP TABLE IF EXISTS habit');
db.execute('CREATE TABLE IF NOT EXISTS habit (id INTEGER PRIMARY KEY, name TEXT, days TEXT, status TEXT)');
db.execute('DELETE FROM habit');

// 초기 데이터 입력 
var chk01Dates = ["2013-1-17","2013-1-19","2013-1-20"];
var Json01String = JSON.stringify(chk01Dates);
//Ti.API.info(JsonString + "  length=" + chk01Dates.length);
var chk02Dates = ["2013-2-2","2013-2-4","2013-2-10"];
var Json02String = JSON.stringify(chk02Dates);

var habit01Array = ['매일 운동',Json01String,'20%'];
db.execute('INSERT INTO habit (name, days, status) VALUES (?, ?, ?)', habit01Array);
var habit02Array = ['매일 코딩',Json02String,'30%'];
db.execute('INSERT INTO habit (name, days, status) VALUES (?, ?, ?)', habit02Array);

/* 기본 UI 구성하기 (윈도우,뷰,탭) */
// this sets the background color of the master UIView (when there are id windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

/*
// create tab group
var tabGroup = Titanium.UI.createTabGroup();
*/

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow();

var win2 = Titanium.UI.createWindow({  
    title:'습관 목록',
    backgroundColor:'#fff'
});
/*
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'습관',
    window:win1
});
*/

/*
//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    url:'win2.js',
    title:'습관 그래프',
    backgroundColor:'#fff'
});
*/
/*
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'보상',
    window:win2
});
*/
//달력 윈도우 만들기  
var win3 = Ti.UI.createWindow({
	url : 'win3.js',
	title: '습관 달력',
	backgroundColor:'#fff'
});

var nav = Titanium.UI.iPhone.createNavigationGroup({
   window: win2
});

/*
//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  

// open tab group
tabGroup.open();
*/

/* 테이블과 DB 연동하기 */
// 테이블 그리기 함수
var makeTable = function(){
	//로컬 DB에서 테이블에 넣을 데이터 가져오기 
	var rows = db.execute('SELECT * FROM habit');
	var tableData = [];
	
	var i = 0;
	while (rows.isValidRow()){
	  var row = Ti.UI.createTableViewRow({
	    className:'habits', // used to improve table performance
	    selectedBackgroundColor:'white',
	    height:60
	  });
	  
	  var habitName = Ti.UI.createLabel({
	    color:'#576996',
	    font:{fontFamily:'Arial', fontSize:defaultFontSize+6, fontWeight:'bold'},
	    text:rows.fieldByName('name'),
	    rowID:i,
	    left:20, top: 20,
	    width:200, height: 30
	  });
	  row.add(habitName);
	  
	  var habitStatus = Ti.UI.createLabel({
	    color:'#999',
	    font:{fontFamily:'Arial', fontSize:defaultFontSize, fontWeight:'normal'},
	    text:rows.fieldByName('status'),
	    left:260, top:20,
	    width:200, height:30
	  });
	  row.add(habitStatus);
	  tableData.push(row);
	  rows.next();
	  i++;
	}
	rows.close();
	// 테이블 뷰 만들기 
	var tableView = Ti.UI.createTableView({
	  backgroundColor:'white',
	  top:50,
	  data:tableData,
	  editable:true,
	  moveable:true
	});	
	win2.add(tableView);
	// 테이블 행 이벤트 
	tableView.addEventListener('click',function(e){
		//어느 행을 찍었는지를 로컬 프로퍼티에 저장
		Ti.App.Properties.setInt('selectedRow',e.source.rowID);
		//Ti.API.info('selected Row Index is '+Ti.App.Properties.getInt('selectedRow'));
		nav.open(win3, {animated:true});
	});
};
makeTable();

// 텍스트 필드 생성. 키보드 타입 지정.  
var tf1 = Titanium.UI.createTextField({
		color:'#336699',
		height:35,
		top:10,
		left:10,
		width:300,
		hintText:'Add an item',
		keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

// 엔터치면 로컬 DB에 새로운 습관이름 저장 
tf1.addEventListener('return', function()
{
	db.execute('INSERT INTO habit (name,days,status) VALUES (?,?,?)',tf1.getValue(),Json02String,"0%");
	tf1.blur();
	makeTable();
	//Ti.API.info(currentFullDate);
});   

win2.add(tf1);
win2.addEventListener('focus',makeTable);

win1.add(nav);
win1.open();
//db.close();

