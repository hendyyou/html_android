var productBriefPage = {
	_CONFIG_ISLOADED : false,
	_CONSULT_ISLOADED : false,
	_initObj : null,
	initialize : function(tabIndex, submitObj) {
		Utils.bindFooterTabEvent("product_brief_page", tabIndex);
		$("#product_title").html(submitObj.productTitle);
		this._initObj = submitObj;
		this.initData(submitObj);
		$("#briefContent").trigger("create");

		// 简介
		$("#briefTab").off("tap").on("tap", function() {
			productBriefPage.showBriefTab();
		});
		$("#configTab").off("tap").on("tap", function() {
			productBriefPage.showConfigTab();
		});

		$("#consultTab").off("tap").on("tap", function() {
			productBriefPage.showConsultTab();
		});
	},
	_loadBrief : function(briefObj) { // 根据详情页面带过来的数据，加载简介
		$("#consulting_btn").hide();
		if (productBriefPage._initObj.dictId == 7 && briefObj.saleSpec != null) {

			$("#brief_contentDiv").hide();
			$("#srufing_contentDiv").show();
			$("#srufing_contentDiv").append(
					"<tr><td aligh='right'><nobr>" + briefObj.marketTimeTitle + "</nobr></td>" + "<td>"
							+ briefObj.marketTime + "</td></tr>");
			var specArray = briefObj.saleSpec.split("\n");
			for ( var k = 0; k < specArray.length; k++) {
				if (specArray[k] == null || specArray[k] == "") {
					continue;
				}
				;
				var subspecsStrings = null;
				if (specArray[k].indexOf("：") != -1) {
					subspecsStrings = specArray[k].split("：");
				} else if (specArray[k].indexOf(":") != -1) {
					subspecsStrings = specArray[k].split(":");
				}

				$("#srufing_contentDiv").append(
						"<tr><td aligh='right' ><nobr>" + subspecsStrings[0] + ":</nobr></td>" + "<td>" + subspecsStrings[1]
								+ "</td></tr>");
			}
			return;
		}

		$("#brief_contentDiv").show();
		$("#srufing_contentDiv").hide();
		$("#marketTimeDiv").html("<td>" + briefObj.marketTimeTitle + "</td>" + "<td>" + briefObj.marketTime + "</td>");
		// 主要功能
		$("#mainFunctionDiv").empty();
		$("#mainFunctionDiv").append("<td><nobr>" + briefObj.functionTitle + "</nobr></td>");
		if (briefObj.functionList) {
			var functd = $("<td></td>");
			for ( var i = 0; i < briefObj.functionList.length; i++) {
				var funcpicurl = briefObj.functionList[i].picUrl;
				functd.append("<img  data-inline='true' src='" + funcpicurl + "' >");
			}
			$("#mainFunctionDiv").append(functd);

		}
		// 支持业务
		$("#supportDiv").empty();
		$("#supportDiv").append("<td><nobr>" + briefObj.businessSupportTitle + "</nobr></td>");
		if (briefObj.businessSupportList) {
			var suptd = $("<td></td>");
			for ( var j = 0; j < briefObj.businessSupportList.length; j++) {
				var suppicurl = briefObj.businessSupportList[j].picUrl;
				suptd.append("<img  data-inline='true' src='" + suppicurl + "' >");
			}
			$("#supportDiv").append(suptd);
		}

		$("#saleSpecDiv").html("<td>" + briefObj.saleSpecTitle + "</td><td>" + briefObj.saleSpec + "</td>");
		$("#productLocateDiv").html("<td>" + briefObj.locationTitle + "</td><td>" + briefObj.location + "</td>");
		$("#configSpecDiv").html("<td>" + briefObj.configSpecTitle + "</td><td>" + briefObj.configSpec + "</td>");

	},
	_loadConfig : function(dataObj) { // 根据返回的数据加载规格列表
		$("#config_contentDiv").empty();
		if (dataObj == null || dataObj == "") {
			Utils.drawToast('暂无数据');
			return;
		}
		productBriefPage._CONFIG_ISLOADED = true;
		var configtable = $("<table class='config-table'><tbody></tbody></table>");

		for ( var i = 0; i < dataObj.length; i++) {
			configtable.append("<tr><th align='left' colspan='2'>" + dataObj[i].titleName + "</th><tr>");
			var sublist = dataObj[i].list;
			if (sublist) {
				for ( var j = 0; j < sublist.length; j++) {
					configtable.append("<tr><td>" + sublist[j].specTitle + "</td><td>" + sublist[j].specContent
							+ "</td></tr>");
				}
			}
		}
		$("#config_contentDiv").append(configtable)

		$("#config_contentDiv").trigger("create");

	},
	_loadConsult : function(dataObj) { // 根据返回的数据加载咨询列表
		if (dataObj == null || dataObj == "") {
			Utils.drawToast('暂无数据');
			return;
		}
		productBriefPage._CONSULT_ISLOADED = true;
		var consultListView;
		if (dataObj.currentPage == 1) {
			$("#consult_contentDiv").empty();
		} else if ($('#addmoreconsult').length > 0) {
			$('#addmoreconsult').remove();
		}

		if ($("#consultlistview").length > 0) {
			consultListView = $("#consultlistview");

		} else {
			consultListView = $("<ul  data-role='listview' id='consultlistview' ></ul>");
		}

		var consultlist = dataObj.list;
		if (!consultlist) {
			return;
		}

		for ( var i = 0; i < consultlist.length; i++) {
			var consultitem = $('<li></li> ');
			consultitem.append('<table class="consult-table"><tbody><tr><td>' + consultlist[i].custNo
					+ '</td><td align="right">' + consultlist[i].consultingTime + '</td></tr>'
					+ '<tr><td colspan="2"><img src="img/product/consult_ask.png"><span>'
					+ (consultlist[i].question == null ? "" : consultlist[i].question) + '</span></td></tr>'
					+ '<tr><td colspan="2"><img src="img/product/consult_answer.png"><span>'
					+ (consultlist[i].reply == null ? "" : consultlist[i].reply) + '</span></td></tr></tbody></table>');

			consultListView.append(consultitem);
		}

		if (dataObj.currentPage < dataObj.pageCount) {
			consultListView.append('<li id="addmoreconsult" data-icon="false"><a class="text-center">更多...</a></li>');
		}
		console.log(consultListView.html());
		if (dataObj.currentPage == 1) {
			$("#consult_contentDiv").append(consultListView);
			$("#consult_contentDiv").trigger('create');
		}
		consultListView.listview('refresh');

		if (dataObj.currentPage < dataObj.pageCount) {
			$("#addmoreconsult").show();
			$("#addmoreconsult").off("click").on("click", function() {
				productBriefPage._initObj.consultparams.targetpage = (++dataObj.currentPage);
				productBriefPage._CONSULT_ISLOADED = false;
				productBriefPage.showConsultTab();
			});
		}
	},

	initData : function(submitObj) {
		productBriefPage._loadBrief(submitObj.briefObj);
	},
	showBriefTab : function() { // 切换tab显示简介。
		$("#brief_contentDiv").show();
		$("#consulting_btn").hide();
		if (productBriefPage._initObj.dictId == 7) {
			$("#srufing_contentDiv").show();
			$("#brief_contentDiv").hide();
		} else {
			$("#srufing_contentDiv").hide();
			$("#brief_contentDiv").show();
		}
		$("#config_contentDiv").hide();
		$("#consult_contentDiv").hide();
	},
	showConfigTab : function() {// 切换tab显示规格。若未加载过，则请求网络
		$("#consulting_btn").hide();
		$("#brief_contentDiv").hide();
		$("#srufing_contentDiv").hide();
		$("#config_contentDiv").show();
		$("#consult_contentDiv").hide();
		if (!this._CONFIG_ISLOADED) {
			var confighttpClient = new HttpClient();
			confighttpClient.post({
				url : Constants.url.PRODUCT_SPEC_035.replace("${id}", productBriefPage._initObj.productId), // 规格
				params : productBriefPage._initObj.configparams,
				isCheckTimeout : false,
				intfSuccessCallBack : function(dataObj, msg) {
					productBriefPage._loadConfig(dataObj);
				}
			});
		}
	},
	showConsultTab : function() { // 切换tab显示咨询列表。若未加载过，则请求网络
		$("#consulting_btn").show(); // 显示咨询按钮
		$("#consulting_btn").off("click").on("click", function() {
			console.log("change to consulting...:");
			Utils.changePageHref({
				pageId : "product_consulting_page",
				pageJsCallback : function() {
					var sObj = {
						title : productBriefPage._initObj.productTitle,
						productId : productBriefPage._initObj.productId
					};
					productConsultingPage.initialize(Constants.tabIndex.PRODUCT, sObj);
				}
			});
		});

		$("#brief_contentDiv").hide();
		$("#srufing_contentDiv").hide();
		$("#config_contentDiv").hide();
		$("#consult_contentDiv").show();
		if (!this._CONSULT_ISLOADED) {
			var consulthttpClient = new HttpClient();
			consulthttpClient.post({
				url : Constants.url.COUSULTING_INDEX_032.replace("${id}", productBriefPage._initObj.productId), // 咨询列表
				params : productBriefPage._initObj.consultparams,
				isCheckTimeout : false,
				intfSuccessCallBack : function(dataObj, msg) {
					productBriefPage._loadConsult(dataObj);
				}
			});
		}

	}

};
// JavaScript Document
