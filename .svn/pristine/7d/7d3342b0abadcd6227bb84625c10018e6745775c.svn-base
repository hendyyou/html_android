var pretap = $("#sort_sail");
var productListPage = {
	initialize : function(tabIndex, submitObj) {
		Utils.bindFooterTabEvent("product_productlist_page", tabIndex);
		// 加载独立的产品列表div。submitObj是请求网络所带的参数，详见classify_phone_page.js创建该obj范例。
		submitObj.productListContentId = "productlist_content";
		if (typeof (loadproductList) == "undefined") {
			$.getScript("js/product/load_productlist.js").done(function() {
				loadproductList.initialize(tabIndex, submitObj);
			});
		} else {
			loadproductList.initialize(tabIndex, submitObj);
		}

		$("#sort_sail").off("tap").on(
				"tap",
				function() {
					submitObj.params.orderBy = "rankingsale";
					if ($('#sort_sail').attr('data-icon') == 'arrow-d') {// 如果之前是降序的，则按升序请求一次数据，并改变图标箭头的方向
						$('#sort_sail').attr('data-icon', 'arrow-u').trigger('create').find('.ui-icon').removeClass(
								'ui-icon-arrow-d').addClass('ui-icon-arrow-u');
						submitObj.params.sortType = "asc";
						loadproductList.initData(submitObj);
					} else {
						$('#sort_sail').attr('data-icon', 'arrow-d').trigger('create').find('.ui-icon').removeClass(
								'ui-icon-arrow-u').addClass('ui-icon-arrow-d');
						submitObj.params.sortType = "desc";
						loadproductList.initData(submitObj);
					}
					;

				});
		$("#sort_price").off("tap").on(
				"tap",
				function() {
					submitObj.params.orderBy = "price";
					if ($('#sort_price').attr('data-icon') == 'arrow-d') {// 如果之前是降序的，则按升序请求一次数据，并改变图标箭头的方向
						$('#sort_price').attr('data-icon', 'arrow-u').trigger('create').find('.ui-icon').removeClass(
								'ui-icon-arrow-d').addClass('ui-icon-arrow-u');
						submitObj.params.sortType = "asc";
						loadproductList.initData(submitObj);
					} else {
						$('#sort_price').attr('data-icon', 'arrow-d').trigger('create').find('.ui-icon').removeClass(
								'ui-icon-arrow-u').addClass('ui-icon-arrow-d');
						submitObj.params.sortType = "desc";
						loadproductList.initData(submitObj);
					}
					;

				});

		$("#sort_time").off("tap").on(
				"tap",
				function() {
					submitObj.params.orderBy = "marketTime";
					if ($('#sort_time').attr('data-icon') == 'arrow-d') {// 如果之前是降序的，则按升序请求一次数据，并改变图标箭头的方向
						$('#sort_time').attr('data-icon', 'arrow-u').trigger('create').find('.ui-icon').removeClass(
								'ui-icon-arrow-d').addClass('ui-icon-arrow-u');
						submitObj.params.sortType = "asc";
						loadproductList.initData(submitObj);
					} else {
						$('#sort_time').attr('data-icon', 'arrow-d').trigger('create').find('.ui-icon').removeClass(
								'ui-icon-arrow-u').addClass('ui-icon-arrow-d');
						submitObj.params.sortType = "desc";
						loadproductList.initData(submitObj);
					}
					;

				});
	}
}
