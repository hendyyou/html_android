var moreAboutPage = {
    initialize : function(tabIndex) {
        Utils.bindFooterTabEvent("more_about_page", tabIndex);

        moreAboutPage.initData();

    },

    initData : function() {
        console.log("moreAboutPage");
    }
};
