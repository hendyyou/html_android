/**
 * 组装出一个产品列表，可被任何页面独立调用。
 */
var loadproductList = {
	_tabIndex : Constants.tabIndex.PRODUCT,
	_productListContentId : "",
	submitObject : null,
	initialize : function(tabIndex, submitObj) {
		if (typeof submitObj.productListContentId == 'undefined') {
			alert('submitObj.productListContentId不能为空!');
			return;
		}
		loadproductList.submitObject = submitObj;
		loadproductList._productListContentId = submitObj.productListContentId;
		Utils.appendHtml(loadproductList._productListContentId, "include/global_productlist_div.html");
		$("#list_title").text(submitObj.listTitle);
		loadproductList._tabIndex = tabIndex;
		this.initData(submitObj);
	},
	_callbak : function(dataObj) {
		// 根据返回的网络数据组装产品列表
		if (dataObj == null || dataObj.length == 0) {
			Utils.drawToast('查询不到产品数据');
			return;
		}
		var listView = $("#" + loadproductList._productListContentId + " #g_productlist");
		if (dataObj.currentPage == 1) {
			listView.empty();
		} else if ($('#addmore')) {
			$('#addmore').remove();
		}
		var dataListObj = dataObj.list;
		var dataListObjCount = dataListObj.length;
		for ( var i = 0; i < dataListObjCount; i++) {
			var listItem = $('<li></li>');
			var listItemA = $('<a href="#" onclick=loadproductList.changeToDetail("' + dataListObj[i].productDetailUrl
					+ '")> </a>');
			listItem.append(listItemA);

			var listItemAImg = $('<img style="height:123px;" src="'
					+ (dataListObj[i].picPath1Url.trim() == "" ? "img/no_picture" : dataListObj[i].picPath1Url)
					+ '" onerror="Utils.showNoneImage(this)">');
			var listItemATitle = $('<h2></h2>').html(
					dataListObj[i].brandName + "&nbsp;" + dataListObj[i].pattern + "&nbsp;" + dataListObj[i].colorSpec);
			var listItemASpec = $('<p></p>').html(dataListObj[i].saleSpec);
			listItemA.append(listItemAImg, listItemATitle, listItemASpec);

			if (dataObj.list[i].custPriceTitle != null && dataListObj[i].isSpecial == 1) {
				// 有CustPriceTitle 是促销价和直供价
				listItemA.append($("<p><span style='color:#FF7430'>促销价：" + Utils.formatMoneyStr(dataListObj[i].custPrice)
						+ "</span>&nbsp;&nbsp;<span style='color:#51890a'>直供价："
						+ Utils.formatMoneyStr(dataListObj[i].sysCustPrice) + "</span></p>"));
			} else {
				// 否则是直供价和零售价
				listItemA.append($("<p><span style='color:#51890a'>直供价："
						+ (dataListObj[i].custPrice == null ? '未登录' : Utils.formatMoneyStr(dataListObj[i].custPrice))
						+ '</span>&nbsp;&nbsp;零售价：' + Utils.formatMoneyStr(dataObj.list[i].advicePrice) + '</p>'));
			}
			listView.append(listItem);
		}

		if (dataObj.currentPage < dataObj.pageCount) {
			listView.append('<li id="addmore" data-icon="false"><a class="text-center">更多...</a></li>');
		}

		if (dataObj.currentPage == 1) {
			$("#" + loadproductList._productListContentId).trigger('create');
		}
		listView.listview('refresh');

		if (dataObj.currentPage < dataObj.pageCount) {
			$("#addmore").show();
			$("#addmore").off("click").on("click", function() {
				loadproductList.submitObject.params.targetpage = (++dataObj.currentPage);
				loadproductList.initData(loadproductList.submitObject);
			});
		}

		console.log(listView.html());
	},

	initData : function(submitObj) {
		var httpClient = new HttpClient();
		httpClient.post({
			url : Constants.url.PRODUCT_SEARCH_020,
			params : submitObj.params,
			isCheckTimeout : false,
			intfSuccessCallBack : function(dataObj, msg) {
				loadproductList._callbak(dataObj);
			}
		});

	},
	changeToDetail : function(url) {
		console.log("productDetailUrl:" + url);
		Utils.changePageHref({
			pageId : "product_detail_page",
			pageJsCallback : function() {
				productDetailPage.initialize(loadproductList._tabIndex, url);
			}
		});
	}
};
