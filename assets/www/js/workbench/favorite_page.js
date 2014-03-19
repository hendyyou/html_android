var workbenchFavoritePage = {
	initialize : function(tabIndex) {
		Utils.bindFooterTabEvent("workbench_favorite_page", tabIndex);

        workbenchFavoritePage.initData();
	},

	initData : function() {
		console.log("workbenchFavoritePage");
	}
};
