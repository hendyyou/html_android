var productDetailPage = {
	initialize : function(tabIndex, detailurl) {
		Utils.bindFooterTabEvent("product_detail_page", tabIndex);
		this.initData(detailurl);
	},
	intervalTag : null,
	timeleave : 0,
	_callbak : function(dataObj) {
		$("#detail_title").text(dataObj.brandName + " " + dataObj.pattern + " " + dataObj.colorSpec);

		var bigPicUrls = dataObj.picList;
		$("#swiperWrapperDiv").empty();
		if (!bigPicUrls) {
			bigPicUrls = [ {
				picId : "nopic",
				picUrl : "img/no_picture.jpg"
			} ];
		}
		for (i = 0; i < bigPicUrls.length; i++) {
			$("#swiperWrapperDiv")
					.append(
							"<div id='wrapdiv_"
									+ i
									+ "' class='swiper-slide' >"
									+ "<a href='#imgdiv_"
									+ bigPicUrls[i].picId
									+ "' data-rel='popup' data-position-to='window' data-transition='fade'>"
									+ "<img height='120px' src='"
									+ bigPicUrls[i].picUrl
									+ "' onerror='Utils.showNoneImage(this)' /></a></div>"
									+
									// 此处是popup的内容部分。即产品大图
									"<div data-role='popup'  id='imgdiv_"
									+ bigPicUrls[i].picId
									+ "'  data-overlay-theme='a' data-theme='d' data-corners='false'>"
									+ "    <a href='#' data-rel='back' data-role='button' data-theme='a' data-icon='delete' data-iconpos='notext' class='ui-btn-right'>Close</a>"
									+ "<img src='" + bigPicUrls[i].picUrl + "' onerror='Utils.showNoneImage(this)' ></div>");
		}

		// 赠品信息
		if (dataObj.giftInfo) {
			$("#product_gift_div").append("<span>" + dataObj.giftInfo + "</span>");
		} else {
			$("#product_gift_div").hide();
		}
		// 产品简介
		if (dataObj.briefInfo) {
			$("#product_spec_div").html("<span>" + dataObj.briefInfo.saleSpec.substring(0, 50) + "...</span>");

		}

		$("#product_spec_div").off("click").on("click", function() {

			var submitObj = {
				configparams : {
					typeId : dataObj.dictId1
				},
				consultparams : {
					targetpage : 1
				},
				briefObj : dataObj.briefInfo,
				productId : dataObj.productId,
				dictId : dataObj.dictId1,
				productTitle : $("#detail_title").text()
			};

			productDetailPage.changeToParameters(submitObj);
		});

		// 供应商信息
		if (dataObj.provNameTitle) {
			$("#product_provide_div").html("<span>" + dataObj.provNameTitle + dataObj.provName + "</span>");
		}

		// 直供价
		if (dataObj.sysCustPriceTitle && dataObj.sysCustPriceTitle != "") {
			$("#product_syscustprice_div").html(
					"<span style='color:#51890a'>" + dataObj.sysCustPriceTitle
							+ (dataObj.sysCustPrice ? Utils.formatMoneyStr(dataObj.sysCustPrice) : "") + "</span>");
		}

		// 零售价
		if (dataObj.advicePriceTitle) {
			$("#product_adviceprice_div").html(
					"<span>" + dataObj.advicePriceTitle + Utils.formatMoneyStr(dataObj.advicePrice) + "</span>");
		}

		// 直供价
		if (dataObj.custPriceTitle && dataObj.IsSpecial == 1) {
			$("#product_custprice_div").show();
			$("#product_custprice_div").html(
					"<span style='color:#FF7430'>" + dataObj.custPriceTitle
							+ (dataObj.custPrice ? Utils.formatMoneyStr(dataObj.custPrice) : "") + "</span>");
		} else if (dataObj.custPriceTitle && dataObj.isSpecial == 0) {
			$("#product_custprice_div").hide();
			$("#product_syscustprice_div").html(
					"<span style='color:#51890a'>" + dataObj.custPriceTitle
							+ (dataObj.custPrice ? Utils.formatMoneyStr(dataObj.custPrice) : "") + "</span>");
		}

		// 活动信息
		if (dataObj.actInfo) {
			$("#product_actinfo_div").show(); // 倒计时
			$("#product_actcontent_div").show(); // 活动内容
			var actSpan = $("#product_actcontent_span");
			actSpan.show(); // 活动内容

			var beginTime = new Date(dataObj.actInfo.nowDateTime.replace("-", "/")).getTime();
			var endTime = new Date(dataObj.actInfo.actEndTime.replace("-", "/")).getTime();
			if (beginTime < endTime) {
				productDetailPage.timeleave = new Date(endTime - beginTime).getTime();
				productDetailPage.intervalTag = setInterval(productDetailPage.showSecondTime, 1000); // 设置定时器函数，每个1000毫秒执行一次
			}

			// 如果有团购活动
			if (dataObj.actInfo.actGroupInfo) {
				actSpan.append(dataObj.actInfo.actGroupInfo.actGroupTips);
			}

			// 如果有产品级活动
			if (dataObj.actInfo.actMainRuleList) {
				for ( var i = 0; i < dataObj.actInfo.actMainRuleList.length; i++) {
					var actItemInfo = dataObj.actInfo.actMainRuleList[i];
					actSpan.append("\n");
					actSpan.append(actItemInfo.actInfo);

				}
			}

			// 如果有订单级活动
			if (dataObj.actInfo.actOrderLevelInfo) {
				actSpan.append("\n");
				actSpan.append(dataObj.actInfo.actOrderLevelInfo.actOrderLevelTitle);
				var actollist = dataObj.actInfo.actOrderLevelInfo.actOrderLevelList;
				for ( var j = 0; j < actollist.length; j++) {
					var actItemInfo = actollist[j];
					actSpan.append("\n");
					actSpan.append(dataObj.actInfo.actOrderLevelInfo.actOrderLevelTitle + actItemInfo.actInfo);
				}
			}

		} else {
			$("#product_actinfo_div").hide(); // 倒计时
			$("#product_actcontent_div").hide(); // 活动内容
			$("#product_actcontent_span").hide(); // 活动内容
		}
		var colorSelect = $("#select-color");
		colorSelect.empty();
		for (k = 0; k < dataObj.colorInfo.colorList.length; k++) {
			var colorObj = dataObj.colorInfo.colorList[k];
			colorSelect.append('<option value="' + colorObj.productId + '" >' + colorObj.titleName + '</option>');
			if (colorObj.productId == dataObj.productId) {
				colorSelect[0].selectedIndex = k;
			}
			colorSelect.selectmenu('refresh');
		}

		if (dataObj.stockCount) {
			$("#product_stock_div").show();
			$("#product_stock_div").html("<span>" + dataObj.stockCountTitle + dataObj.stockCount + " 件");
		} else {
			$("#product_stock_div").hide();
		}

		$("#detailContentDiv").trigger("create");

		colorSelect.change(function() {
			productDetailPage.initData(Constants.url.PRODUCT_DETAIL_034.replace("${id}", colorSelect.val()));
		});

		$("#addCartBtn").off("click").on("click", function() {
			shopcartUtil.addCart({
				productId : dataObj.productId,
				vmiProvideId : dataObj.vmiProvideId,
				quantity : $("#buyCount").val()
			});
		});

		$("#shouCang").off("click").on("click", function() {
			alert("收藏");
		});
		if (bigPicUrls) {
			var mySwiper = new Swiper('.swiper-container', {
				slidesPerView : (bigPicUrls.length < 2 ? bigPicUrls.length : 2)
			});
		}

		console.log($("#detailContentDiv").html());
	},
	initData : function(url) {
		console.log("productDetailPage" + url);
		var detailclient = new HttpClient();
		detailclient.post({
			url : url,
			isCheckTimeout : false,
			intfSuccessCallBack : function(dataObj, msg) {
				productDetailPage._callbak(dataObj);
			},
		});

	},
	showSecondTime : function() {
		productDetailPage.timeleave -= 1000;
		if (productDetailPage.timeleave <= 0 || $("#product_actinfo_div").is(":hidden")) {
			// 时间到，或者该组件不可见（页面已经跳转），则停止倒计时
			clearInterval(productDetailPage.intervalTag);
		}

		var seconds = productDetailPage.timeleave / 1000;
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		var CDay = days;
		var CHour = hours % 24;
		var CMinute = minutes % 60;
		var CSecond = Math.floor(seconds % 60);

		var showTime = days + "天" + CHour + "小时" + CMinute + "分" + CSecond + "秒";
		$("#product_actinfo_div").html("<span style='color:#51890a'>促销信息：还剩" + showTime + "</span>");
	},
	changeToParameters : function(submitObj) {
		console.log("change to productBrief...:");
		Utils.changePageHref({
			pageId : "product_brief_page",
			pageJsCallback : function() {
				productBriefPage.initialize(Constants.tabIndex.PRODUCT, submitObj);
			}
		});
	}
};