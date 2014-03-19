var productConsultingPage = {
	_initObj : null,
	initialize : function(tabIndex, submitOjbect) {
		Utils.bindFooterTabEvent("product_consulting_page", tabIndex);
		this._initObj = submitOjbect;
		$("#consulting_title").text(submitOjbect.title);
		if (!Utils.isLogin()) {
			Utils.changeToUserLogin(productConsultingPage.initData);
		} else {
			productConsultingPage.initData();
		}

	},
	initData : function() {

		$("#consulsubmit_btn").off("click").on("click", function() {

			var curLength = $("#consulting_area").val().length;
			if (curLength > 150) {
				Utils.drawToast("咨询长度不能超过150字", 2500);
				return;
			}

			var consunltinghttpClient = new HttpClient();
			consunltinghttpClient.post({
				url : Constants.url.COUSULTING_CREATE_033.replace("${id}", productConsultingPage._initObj.productId),
				params : {
					question : $("#consulting_area").val()
				},
				isCheckTimeout : false,
				intfSuccessCallBack : function(dataObj, msg) {
					navigator.app.backHistory();
					productBriefPage._CONSULT_ISLOADED = false;
					productBriefPage.showConsultTab();
				}
			});

		});
	}
}