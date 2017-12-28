//--------------------------------------------------------------------------------------
function setItem(key, item) {
	 sessionStorage.setItem(key, JSON.stringify(item))
}
function getItem(key){
	try{
		return JSON.parse(sessionStorage.getItem(key) )
	} catch (e) {
		
	}
}
function removeItem (key) {
	 sessionStorage.removeItem(key)
}
function cleanItem (key) {
	 sessionStorage.clean(key)
}



// 开始抽奖
var goLuck = '/xkd_bdts/luck/goLuck'
// 获得已经抽中的用户
var getLuck = '/xkd_bdts/luck/getLuck'
// 保存抽奖
var saveLuck = '/xkd_bdts/luck/saveLuck'



var luckyCount = 1;// 当前选中抽奖总人数
var num = 0;// 当前随机数
//var status = getItem('status') ? getItem('status') : 1;// 当前选中抽奖类型
var status = 1// 当前选中抽奖类型
var objList = []// 请求抽奖用户
var selectedList = []// 显示当前中奖列表
var saveSelectedList = []// 保存中奖列表
var deleteIndex = ''// 当前删除索引
var statusSign = true
var modelSign = ''



//两个数组的坐标对应，后期可以直接连数据库 读取数据
var xinm = [];
var phone = [];
var nametxt = $('.showSelectedUser .userName');
var phonetxt = $('.showSelectedUser .userTel');
var runningCount = 0;//参加人数
var runing = true;
var t;



// 请求抽奖用户信息
function getProjectData(requestUrl,status,callback) {
	$.post(
 		requestUrl,
 		{	
 			status: status,
 		},
 		function(data){
 		if(data.repCode == "S0000"){
 			callback&&callback(data)
 		}else{
 			console.log(data)
 		}
 	})
}
// 获得已经抽中的用户
function getLuckList(requestUrl,status,callback) {
	$.post(
 		requestUrl,
 		{	
 			status: status,
 		},
 		function(data){
 		if(data.repCode == "S0000"){
 			callback&&callback(data)
 		}else{
 			console.log(data)
 		}
 	})
}
// 切换中奖类型
function typeChange(){
	console.log(statusSign)
	
	status = $("#prizeTypeList").val() ? $("#prizeTypeList").val() : 1
	//setItem('status',status)
	getLuckList(getLuck,status,function(data){
		if(data.repCode === "S0000"){
			saveSelectedList =  data.resModel
			$(".luckTotal_wrap .luckTotal").html(saveSelectedList.length)
			saveSelectedModel(saveSelectedList)
			statusSign = true
			selectedList = []
			$('#selectedList').empty()
		}
	})
	
}
// 初始化抽奖保存名单
typeChange()

//--------------------------------------------------------------------------------
// 开始抽奖
function startRunning(startSign){
	modelSign = startSign
	if(statusSign){
		selectedList = []
		selectedListModel(selectedList)
		
		startingFunc()
		cancelIconDiv(false)
		
		status = $("#prizeTypeList").val()
		luckyCount = $("#userNumList").val()
		// 请求抽奖用户信息
		//console.log(status)
		getProjectData(goLuck,status,function(data){
			if(data.repCode === "S0000"){
				objList = data.resModel
				// 已无抽奖人员
				if(objList.length === 0){
					luckyCount = 0
					hintTxtModel("已无抽奖人员！")
					unStartFunc()
					
					
					return
				}
				runningCount = objList.length;//参加人数
				stopRunning()
				statusSign = false
			}
		})
	}else{
		hintSureAgainModel("名单未保存，确定再次抽奖吗？")
	}
	
}
// 停下显示结果
function stopRunning(){
	startRunScreen()
	setTimeout(function(){
		stop();
		showResult();
	},2000)
}
//循环参加名单
function startRunScreen() {
	//console.log(runningCount)
	if(runningCount > 1){
		num = Math.floor(Math.random() * runningCount)
		//console.log(num)
	}else {
		num = 0
	}
	
	nametxt.html(objList[num].uname)
	phonetxt.html(objList[num].mobile)
	t = setTimeout(startRunScreen, 0)
}
//停止跳动
function stop() {
	runningCount = objList.length-1;
	clearInterval(t);
	t = 0;
}
//打印列表
function showResult() {
	//打印中奖者名单
	if(luckyCount <= 0){
		hintTxtModel("投票结束")
	}else{
		selectedList.push(objList[num])
		objList.splice(num, 1)
		selectedListModel(selectedList)
		luckyCount = luckyCount - 1;
		if(objList.length>0){
			if(luckyCount){
				setTimeout(function(){
					stopRunning()	
				},1500)
			}else{
				setTimeout(function(){
					hintTxtModel("抽奖结束！")
					unStartFunc()
					prizeTypeDiv(true)
					
				},1000)
				
			}
		}else{
			hintTxtModel("已无抽奖人员！")
			unStartFunc()
			unSaveFunc()
			prizeTypeDiv(true)
			
			return
		}
		
	}
}
// 保存中奖名单
function saveLuckList(saveSign){
	modelSign = saveSign
	if(!statusSign){
		if(selectedList.length > 0){
			// 数据准备
			var sendIds = []
			var sendStr = ''
			$.each(selectedList, function(index,obj) {
				sendIds.push(obj.id)
			});
			sendStr = sendIds.join(',')
			// 切换按钮状态
			savingFunc()
			// 发起请求
			$.post(
		 		saveLuck,
		 		{	
		 			ids: sendStr,
					status: status
		 		},
		 		function(data){
		 		if(data.repCode == "S0000"){
		 			getLuckList(getLuck,status,function(data){
		 				if(data.repCode === "S0000"){
		 					saveSelectedList =  data.resModel
		 					$(".luckTotal_wrap .luckTotal").html(saveSelectedList.length)
		 					saveSelectedModel(saveSelectedList)
				 			statusSign = true
				 			selectedList = []
				 			$('#selectedList').empty()
				 			// 切换按钮状态
				 			unSaveFunc()
		 				}
		 			})
		 			
		 		}else{
		 			console.log(data)
		 		}
		 	})
		}else{
			hintTxtModel("暂无保存数据")
		}
	}else{
		hintTxtModel("暂无保存数据")
	}
	
}



// 取消提示框
function closeHintModule(){
	$("#hintModule").css("display","none")
	$("#hintModule .sureBtn").css("display","inline-block")
	$("#hintModule .closeBtn").css("display","inline-block")
}
// 提示框
function hintTxtModel(hintTxt){
	$("#hintModule").css("display","block")
	$("#hintModule .sureBtn").css("display","none")
	$("#hintModule .closeBtn").css("display","none")
	$("#hintModule .hintInner").html(hintTxt)
	setTimeout(function(){
		closeHintModule()
	},1300)
}
// 确认框
function hintSureAgainModel(hintTxt){
	$("#hintModule").css("display","block")
	$("#hintModule .hintInner").html(hintTxt)
}



// 再次确认按钮
function sureAgain(){
	if(modelSign === 'startSign'){
		statusSign = true
		startRunning('startSign')
		closeHintModule()
	}else if(modelSign === 'saveSign'){
		statusSign = false
		prizeTypeDiv()
		saveLuckList('saveSign')
		closeHintModule()
	}else if(modelSign === 'deleteSign'){
		selectedList.splice(deleteIndex, 1)
		selectedListModel(selectedList)
		if(selectedList.length <= 0){
			statusSign = true
			prizeTypeDiv()
		}
		closeHintModule()
	}else if(modelSign === 'typeSign'){
		prizeTypeDiv()
		closeHintModule()
	}
}
// 点击保存按钮
function goTrueSaveList(saveSign){
	if(!statusSign){
		modelSign = 'saveSign'
		hintSureAgainModel("确定保存名单吗？")
	}else{
		hintTxtModel("暂无保存数据")
	}
}
// 移除当前中奖者
$("#selectedList").on("click",".group .cancelIcon",function(){
	deleteIndex = $(this).parents(".group").index()
	modelSign = 'deleteSign'
	hintSureAgainModel("确定删除该中奖名单吗？")
})
// 渲染保存名单列表
function saveSelectedModel(arrList){
	$('#saveSelectedList').html(template(
		'saveSelectedListTpl',
		{ saveSelectedList: arrList }
	))
}
// 渲染当前中奖名单列表
function selectedListModel(arrList){
	$('#selectedList').html(template(
		'selectedListTpl',
		{ selectedList: arrList }
	))
}

// 样式控制-------------------------------------------------start
// 未开始抽奖
function unStartFunc(){
	$(".lay_nav .toBtn_wrap .toBtn.startBtn").css("display",'inline-block')
	$(".lay_nav .toBtn_wrap .toBtn.unStartBtn").css("display",'none')
	unStartFuncPrizeTypeList()
	unStartFuncUserNumList()
	unSaveFunc()
}
// 抽奖中
function startingFunc(){
	$(".lay_nav .toBtn_wrap .toBtn.startBtn").css("display",'none')
	$(".lay_nav .toBtn_wrap .toBtn.unStartBtn").css("display",'inline-block')
	savingFunc('保存')
	startingFuncPrizeTypeList()
	startingFuncUserNumList()
}

// 未保存
function unSaveFunc(valTxt){
	var inputTxt = valTxt ? valTxt : '保存中...'
	$(".lay_nav .toBtn_wrap .toBtn.saveBtn").css("display",'inline-block')
	$(".lay_nav .toBtn_wrap .toBtn.unSaveBtn").val(inputTxt)
	$(".lay_nav .toBtn_wrap .toBtn.unSaveBtn").css("display",'none')
}
// 保存中
function savingFunc(valTxt){
	var inputTxt = valTxt ? valTxt : '保存中...'
	$(".lay_nav .toBtn_wrap .toBtn.saveBtn").css("display",'none')
	$(".lay_nav .toBtn_wrap .toBtn.unSaveBtn").css("display",'inline-block')
	$(".lay_nav .toBtn_wrap .toBtn.unSaveBtn").val(inputTxt)
}

// prizeTypeList
// 未开始抽奖
function unStartFuncPrizeTypeList(valTxt){
	var inputTxt = valTxt ? valTxt : '禁止操作中..'
	$(".lay_nav .toBtn_wrap .prizeTypeList").css("display",'inline-block')
	$(".lay_nav .toBtn_wrap .toBtn.prizeTypeBtn").val(inputTxt)
	$(".lay_nav .toBtn_wrap .toBtn.prizeTypeBtn").css("display",'none')
}
// 抽奖中
function startingFuncPrizeTypeList(valTxt){
	var inputTxt = valTxt ? valTxt : '禁止操作中'
	$(".lay_nav .toBtn_wrap .prizeTypeList").css("display",'none')
	$(".lay_nav .toBtn_wrap .toBtn.prizeTypeBtn").css("display",'inline-block')
	$(".lay_nav .toBtn_wrap .toBtn.prizeTypeBtn").val(inputTxt)
}

// userNumList
// 未开始抽奖
function unStartFuncUserNumList(valTxt){
	var inputTxt = valTxt ? valTxt : '禁止操作中..'
	$(".lay_nav .toBtn_wrap .userNumList").css("display",'inline-block')
	$(".lay_nav .toBtn_wrap .toBtn.userNumBtn").val(inputTxt)
	$(".lay_nav .toBtn_wrap .toBtn.userNumBtn").css("display",'none')
}
// 抽奖中
function startingFuncUserNumList(valTxt){
	var inputTxt = valTxt ? valTxt : '禁止操作中'
	$(".lay_nav .toBtn_wrap .userNumList").css("display",'none')
	$(".lay_nav .toBtn_wrap .toBtn.userNumBtn").css("display",'inline-block')
	$(".lay_nav .toBtn_wrap .toBtn.userNumBtn").val(inputTxt)
}
// 
function prizeTypeDiv(sign){
	if(sign){
		$("#prizeTypeDiv").css("display","block")
	}else{
		$("#prizeTypeDiv").css("display","none")
	}
	
}
$("#prizeTypeDiv").click(function(){
	if(!statusSign){
		modelSign = 'typeSign'
		hintSureAgainModel("名单未保存，确定切换抽奖类型吗？")
	}
})
// 关闭图标
function cancelIconDiv(sign){
	if(sign){
		$("#selectedList .group .cancelIcon").css("display","inline-block")
	}else{
		$("#selectedList .group .cancelIcon").css("display","none")
	}
	
}
// 样式控制-------------------------------------------------end