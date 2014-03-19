var homeIndexPage = {
    initialize : function(tabIndex) {
        Utils.bindFooterTabEvent("home_index_page", tabIndex);

        $("#home_test_login").off("click").on("click", function() {
            Utils.getUserInfoFromServer({
                timeoutCallback : homeIndexPage.initData,
                timeoutArgObj : {
                    text : "home_test_login"
                }
            });
            Utils.changeToUserLogin(homeIndexPage.initData);
        });
        $("#home_test_logout").off("click").on("click", function() {
            var headerDiv = $('div[data-role="header"]');
//            alert('headerDiv.height:' + headerDiv.height());
//            alert('headerDiv.outerHeight:' + headerDiv.outerHeight());

            Utils.logout();
        });
        $("#home_test_shopcart_add_phone").off("click").on("click", function() {
            shopcartUtil.addCart({
                productId : 21742,
                vmiProvideId : 161,
                quantity : 2
            });
        });
        $("#home_test_shopcart_add_card").off("click").on("click", function() {
            shopcartUtil.addCart({
                productId : 21535,
                vmiProvideId : 293,
                quantity : 1
            });
        });
        $("#home_test_shopcart_show").off("click").on("click", function() {
            shopcartUtil.refreshCartCount(5)
        });
        $("#home_test_shopcart_hide").off("click").on("click", function() {
            shopcartUtil.refreshCartCount(0);
        });

        this.initData({
            test : "homeIndexPage"
        });
    },

    initData : function(dataObj) {
        console.log("homeIndexPage");
        if (dataObj != null) {
            console.log("homeIndexPage initData() text:" + dataObj.text);
        }
        if (Utils.isLogin()) {

        } else {

        }

    }
};
