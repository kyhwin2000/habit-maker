// 습관 입력 받기
var label1 = Ti.UI.createLabel({
	text:'습관 : ',
	top:10,
	left:10,
	font: {fontSize:24}
}); 
// 텍스트 필드 생성. 키보드 타입 지정.  
var tf1 = Titanium.UI.createTextField({
		color:'#336699',
		height:35,
		top:10,
		left:100,
		width:200,
		keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});
// 엔터 치면 로컬 프로퍼티에 입력받은 약속명 저장 
tf1.addEventListener('return', function()
{
	tf1.blur();
});
Ti.UI.currentWindow.add(label1);    
Ti.UI.currentWindow.add(tf1);
