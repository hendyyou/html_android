var accessorylistPage = {
	initialize : function(tabIndex, submitObj) {
		Utils.bindFooterTabEvent("product_accessorylist_page", tabIndex);
		submitObj.productListContentId = "accessorylist_content";
		if (typeof (loadproductList) == "undefined") {
			$.getScript("js/product/load_productlist.js").done(function() {
				loadproductList.initialize(tabIndex, submitObj);
			});
		} else {
			loadproductList.initialize(tabIndex, submitObj);
		}

	}
}
