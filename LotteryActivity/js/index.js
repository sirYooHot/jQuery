$(function(){
	
	
	prizeTypeList = [
		{
			prizeType: '一等奖',
			status: 1
		},
		{
			prizeType: '二等奖',
			status: 2
		},
		{
			prizeType: '三等奖',
			status: 3
		},
		{
			prizeType: '特等奖',
			status: 4
		},
		{
			prizeType: '董事长现金大奖',
			status: 5
		}
	]
	var userNumList = [
		{
			userNum: 1
		},
		{
			userNum: 2
		},
		{
			userNum: 3
		},
		{
			userNum: 4
		},
		{
			userNum: 5
		},
		{
			userNum: 6
		},
		{
			userNum: 7
		},
		{
			userNum: 8
		},
		{
			userNum: 9
		},
		{
			userNum: 10
		}
	]
	// 选择中奖类型
	$('#prizeTypeList').html(template(
		'prizeTypeListTpl',
		{ prizeTypeList: prizeTypeList }
	))
	// 选择中奖人数
	$('#userNumList').html(template(
		'userNumListTpl',
		{ userNumList: userNumList }
	))
	
	
	
	//
	$("#prizeTypeList").selectpick({
		container: '.prizeTypeList',
		onSelect: function(value,text){
			//alert("这是回调函数，选中的值："+value+" \n选中的下拉框文本："+text);
			typeChange()
		}
	});
	$("#userNumList").selectpick({
		container: '.userNumList',
		onSelect: function(value,text){
			//alert("这是回调函数，选中的值："+value+" \n选中的下拉框文本："+text);
			//typeChange()
		}
	});
})