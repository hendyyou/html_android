// =========================== 手机翼支付公用方法定义部分 ===========================
var bestpayUtil = {
    /**
     * 生成手机翼支付的支付订单
     *
     * @param pageId 页面ID
     * @param orderId 订单ID
     */
    payOrder : function(pageId, orderId) {
        var httpClient = new HttpClient();
        httpClient.post({
            url : Constants.url.MAKE_BESTPAY_ORDER_047.replace("${id}", orderId),
            timeoutForwardCallback : bestpayUtil.payOrder,
            timeoutForwardArgObj : orderId,
            intfSuccessCallBack : function(dataObj, msg) {
                var pageIdFlag = 0;
                if (pageId == "shopcart_ordersuccess_page") {
                    pageIdFlag = Constants.bestpayPageIdFlag.orderSuccessPage;
                } else if (pageId == "workbench_orderlist_page") {
                    pageIdFlag = Constants.bestpayPageIdFlag.orderListPage;
                } else if (pageId == "workbench_orderdetail_page") {
                    pageIdFlag = Constants.bestpayPageIdFlag.orderDetailPage;
                }
                // 调用手机翼支付插件
                cordova.exec(function() {
                    localStorage.removeItem(Constants.argName.local.bestpayOrderId);
                    localStorage.setItem(Constants.argName.local.bestpayOrderId, orderId);
                }, function(message) {
                    Utils.drawToast(message);
                }, 'BestpayPlugin', 'changeToBestpay', [ pageIdFlag, dataObj ]);
            }
        });
    },
    /**
     * 手机翼支付返回处理
     *
     * @param pageIdFlag 页面ID标识
     * @param resultCode 操作结果编号
     */
    bestpayReturn : function(pageIdFlag, resultCode) {
        var bestpayOrderId;
        if (pageIdFlag == Constants.bestpayPageIdFlag.orderSuccessPage ||
            pageIdFlag == Constants.bestpayPageIdFlag.orderListPage) {
            // 切换页面到订单详情页面
            if (resultCode == 2) {
                // 不做任何处理
                console.log("从翼支付apk返回，用户点击了返回键放弃支付，业务管理平台此笔订单仍可支付");
            } else {
                if (resultCode == 0) {
                    console.log("从翼支付apk返回，处理订单，从平台获取发货信息并通知用户");
                } else if (resultCode == 1) {
                    console.log("从翼支付apk返回，支付情况未知，第三方客户端需从支付应用平台获取交易和发货信息");
                } else {
                    console.log("从翼支付apk返回");
                }
                bestpayOrderId = localStorage.getItem(Constants.argName.local.bestpayOrderId);
                Utils.changePageHref({
                    pageId : "workbench_orderdetail_page",
                    pageJsCallback : function() {
                        if (pageIdFlag == Constants.bestpayPageIdFlag.orderSuccessPage) {
                            workbenchOrderdetailPage.initialize(Constants.tabIndex.SHOPCART, bestpayOrderId);
                        } else {
                            workbenchOrderdetailPage.initialize(Constants.tabIndex.WORKBENCH, bestpayOrderId);
                        }
                    }
                });
            }
        } else if (pageIdFlag == Constants.bestpayPageIdFlag.orderDetailPage) {
            // 重新刷新页面数据
            if (resultCode == 2) {
                // 不做任何处理
                console.log("从翼支付apk返回，用户点击了返回键放弃支付，业务管理平台此笔订单仍可支付");
            } else {
                if (resultCode == 0) {
                    console.log("从翼支付apk返回，处理订单，从平台获取发货信息并通知用户");
                } else if (resultCode == 1) {
                    console.log("从翼支付apk返回，支付情况未知，第三方客户端需从支付应用平台获取交易和发货信息");
                } else {
                    console.log("从翼支付apk返回");
                }
                bestpayOrderId = localStorage.getItem(Constants.argName.local.bestpayOrderId);
                workbenchOrderdetailPage.initData(bestpayOrderId);
            }
        } else {
            var tipMsg = "传入不支持的发起支付的页面ID：" + pageIdFlag + "！";
            console.log(tipMsg);
            Utils.drawToast(tipMsg);
        }
    }

};
