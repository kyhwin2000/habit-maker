var curWin = Ti.UI.currentWindow;
var habitLabel = new Array();
var statusBar = new Array();
var fullBar = new Array();
var statusLabel = new Array();

var db = Ti.Database.open('habitDB');
var rowRS = db.execute('SELECT * FROM habit');
var i=0;
while (rowRS.isValidRow())
{
  	habitLabel[i] = Ti.UI.createLabel({
  		text:rowRS.fieldByName('name'),
  		top:10+30*i, left:20,
  		height:30
  	});
  	curWin.add(habitLabel[i]);
  	
  	fullBar[i] = Ti.UI.createView({
		backgroundColor:'gray',
		top:10+30*i,left:100,
		width:140,height:30
	});
	curWin.add(fullBar[i]);
	
  	statusBar[i] = Ti.UI.createView({
		backgroundColor:'blue',
		top:10+30*i,left:100,
		width:70,height:30
	});
	curWin.add(statusBar[i]);
	
	statusLabel[i] = Ti.UI.createLabel({
		top:10+30*i,left:260,
		text:rowRS.fieldByName('status')
	});
	curWin.add(statusLabel[i]);
	
  rowRS.next();
  i++;
}
rowRS.close();



	
	


