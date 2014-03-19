var workbenchIndexPage = {
    initialize : function(tabIndex) {
        Utils.bindFooterTabEvent("workbench_index_page", tabIndex);

        if (!Utils.isLogin()) {
            Utils.changeToUserLogin(workbenchIndexPage.initData);
        } else {
            workbenchIndexPage.initData();
        }

        $("#workbench_index_logout").off("click").on("click", function() {
            Utils.logout(Utils.changeToHomeIndex);
        });

        $("#workbench_allorder").off("click").on("click", function() {
            Utils.changePageHref({
                pageId : "workbench_orderlist_page",
                pageJsCallback : function() {
                    workbenchOrderlistPage.initialize(Constants.tabIndex.WORKBENCH,
                        Constants.orderSelectType.currentMonthOrder);
                }
            });
        });
        $("#workbench_needpayorder").off("click").on("click", function() {
            Utils.changePageHref({
                pageId : "workbench_orderlist_page",
                pageJsCallback : function() {
                    workbenchOrderlistPage.initialize(Constants.tabIndex.WORKBENCH,
                        Constants.orderSelectType.pendingPayOrder);
                }
            });
        });
        $("#workbench_favorite").off("click").on("click", function() {
            Utils.changePageHref({
                pageId : "workbench_favorite_page",
                pageJsCallback : function() {
                    workbenchFavoritePage.initialize(Constants.tabIndex.WORKBENCH);
                }
            });
        });
        $("#workbench_address").off("click").on("click", function() {
            Utils.changePageHref({
                pageId : "workbench_address_page",
                pageJsCallback : function() {
                    workbenchAddressPage.initialize(Constants.tabIndex.WORKBENCH);
                }
            });
        });
        $("#workbench_changepass").off("click").on("click", function() {
            Utils.changePageHref({
                pageId : "workbench_changepass_page",
                pageJsCallback : function() {
                    workbenchChangepassPage.initialize(Constants.tabIndex.WORKBENCH);
                }
            });
        });

    },

    initData : function() {
        console.log("workbenchIndexPage");
        var userInfo = Utils.getUserInfo();
        $("#workbench_index_username").html(userInfo.userName).trigger("refresh");
        $("#workbench_index_custlevel").html(userInfo.levelName).trigger("refresh");
        $("#workbench_index_lasttime").html(userInfo.lastLoginTime).trigger("refresh");
    }
};
