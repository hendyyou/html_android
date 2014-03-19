var workbenchOrderlistPage = {
    _selectType : Constants.orderSelectType.currentMonthOrder,
    _orderListObj : "",
    _orderCurrentPage : 0,
    _orderPageCount : 0,
    _currentOrderId : 0,
    initialize : function(tabIndex, selectType) {
        Utils.bindFooterTabEvent("workbench_orderlist_page", tabIndex);

        if (typeof selectType == 'undefined') {
            selectType = Constants.orderSelectType.currentMonthOrder;
        }
        workbenchOrderlistPage._selectType = selectType;
        workbenchOrderlistPage.initData();


        $("#workbench_orderlist_type_current").off("click").on("click", function() {
            workbenchOrderlistPage._selectType = Constants.orderSelectType.currentMonthOrder;
            workbenchOrderlistPage.initData();
        });

        $("#workbench_orderlist_type_previous").off("click").on("click", function() {
            workbenchOrderlistPage._selectType = Constants.orderSelectType.previousMonthOrder;
            workbenchOrderlistPage.initData();
        });

    },

    initData : function() {
        console.log("workbenchOrderlistPage");

        if (workbenchOrderlistPage._selectType == Constants.orderSelectType.pendingPayOrder) {
            $('#workbench_orderlist_title').html('待付款订单');
            $('#workbench_orderlist_navbar').hide();
        } else {
            $('#workbench_orderlist_title').html('全部订单');
            if (workbenchOrderlistPage._selectType == Constants.orderSelectType.currentMonthOrder) {
                $('#workbench_orderlist_type_current').addClass('ui-btn-active');
                $('#workbench_orderlist_type_previous').removeClass('ui-btn-active');
            } else if (workbenchOrderlistPage._selectType == Constants.orderSelectType.previousMonthOrder) {
                $('#workbench_orderlist_type_current').removeClass('ui-btn-active');
                $('#workbench_orderlist_type_previous').addClass('ui-btn-active');
            }
            $('#workbench_orderlist_navbar').show();
        }

        $("#workbench_orderlist_content_div").empty();
        workbenchOrderlistPage._queryOrderList(1);

    },
    _queryOrderList : function(targetPage) {
        var httpClient = new HttpClient();
        httpClient.post({
            url : Constants.url.ORDER_LIST_026.replace("${id}", workbenchOrderlistPage._selectType),
            params : {
                targetpage : targetPage
            },
            timeoutForwardCallback : workbenchOrderlistPage.initData,
            showIntfSuccessMsg : false,
            intfSuccessCallBack : function(dataObj, msg) {
                if (dataObj == null || dataObj.length == 0) {
                    Utils.drawToast('查询不到订单数据');
                    return;
                }
                workbenchOrderlistPage._orderCurrentPage = dataObj.currentPage;
                workbenchOrderlistPage._orderPageCount = dataObj.pageCount;
                if (workbenchOrderlistPage._orderCurrentPage == 1) {
                    $("#workbench_orderlist_content_div").empty();
                    workbenchOrderlistPage._orderListObj = dataObj.list;
                } else {
                    var listCount = dataObj.list.length;
                    for (var i = 0; i < listCount; i++) {
                        workbenchOrderlistPage._orderListObj.push(dataObj.list[i]);
                    }
                }
                // 填充订单列表数据
                workbenchOrderlistPage._fillOrderListDiv(dataObj.list);
            }
        });
    },
    /**
     * 填充订单列表块
     *
     * @param orderListObj
     *             查询结果的订单列表数据对象
     * @private
     */
    _fillOrderListDiv : function(orderListObj) {
        var workbench_orderlist_content_div = $("#workbench_orderlist_content_div");
        if (orderListObj == null || orderListObj.length == 0) {
            return;
        }
        var orderCount = orderListObj.length;
        for (var i = 0; i < orderCount; i++) {
            workbenchOrderlistPage._appendOrderItemToList(workbench_orderlist_content_div, orderListObj[i], i);
        }
        workbench_orderlist_content_div.trigger("create");
    },
    /**
     * 添加订单项到订单列表块
     *
     * @param orderListDiv
     *             订单列表块
     * @param orderInfoObj
     *             订单信息数据对象
     * @param index
     *             订单信息数据索引
     * @private
     */
    _appendOrderItemToList : function(orderListDiv, orderInfoObj, index) {
        var orderInfoDivId = 'workbench_orderlist_order_' + index;
        var orderInfoDiv = $('<div></div>').attr('id', orderInfoDivId);

        var orderInfoBriefDivId = orderInfoDivId + '_brief-' + orderInfoObj.orderId;
        var orderInfoBriefDiv = $('<div></div>').attr('id', orderInfoBriefDivId);
        // 订单编号
        var orderNoP = $('<p>订单编号：</p>');
        var orderNoSpan = $('<span></span>').html(orderInfoObj.orderNo);
        orderNoP.append(orderNoSpan);
        // 订单金额
        var orderTotalAmountP = $('<p>订单金额：</p>');
        var orderTotalAmountSpan = $('<span></span>').html('<strong>' + Utils.formatMoneyStr(orderInfoObj.orderTotalAmount) +
            '</strong>');
        orderTotalAmountP.append(orderTotalAmountSpan);
        // 下单时间
        var orderTimeP = $('<p>下单时间：</p>');
        var orderTimeSpan = $('<span></span>').html(orderInfoObj.orderTime);
        orderTimeP.append(orderTimeSpan);

        orderInfoBriefDiv.append(orderNoP, orderTotalAmountP, orderTimeP);
        orderInfoDiv.append(orderInfoBriefDiv);

        // 分割线块
        var orderSplitLineDiv = $('<div></div>');
        orderInfoDiv.append(orderSplitLineDiv);

        // 订单产品列表块
        var productListObj = orderInfoObj.list;
        var productListCount = productListObj.length;
        for (var i = 0; i < productListCount; i++) {
            workbenchOrderlistPage._appendProductItemToOrder(orderInfoDiv, productListObj[i], i, orderInfoDivId);
        }

        var orderInfoBottomDiv = $('<div class="ui-grid-a"></div>');
        // 左边状态显示块
        var orderInfoBottomLeftDiv = $('<div class="ui-block-a"></div>');
        // 订单状态
        var orderInfoBottomLeftStatusP = $('<p>订单状态：</p>');
        var orderInfoBottomLeftStatusSpan = $('<span></span>').html('<strong>' + orderInfoObj.orderListStatus + '</strong>');
        orderInfoBottomLeftStatusP.append(orderInfoBottomLeftStatusSpan);
        orderInfoBottomLeftDiv.append(orderInfoBottomLeftStatusP);

        // 右边操作块
        var orderInfoBottomRightDiv = $('<div class="ui-block-b"></div>');
        orderInfoBottomDiv.append(orderInfoBottomLeftDiv, orderInfoBottomRightDiv);
        orderInfoDiv.append(orderInfoBottomDiv);

        orderListDiv.append(orderInfoDiv);

        if (orderInfoObj.isCanPay == 1 || orderInfoObj.isCanCancel == 1 || orderInfoObj.isCanCancelPay == 1) {
            var orderInfoBottomRightOperDiv = $('<div class="ui-grid-a"></div>');

            var orderInfoBottomRightOperLeftDiv = $('<div class="ui-block-a"></div>');
            var orderInfoBottomRightOperRightDiv = $('<div class="ui-block-b"></div>');
            orderInfoBottomRightOperDiv.append(orderInfoBottomRightOperLeftDiv, orderInfoBottomRightOperRightDiv);

            orderInfoBottomRightDiv.append(orderInfoBottomRightOperDiv);

            if (orderInfoObj.isCanPay == 1) {
                // 付款
                var orderInfoBottomRightOperLeftPayId = orderInfoDivId + '_pay_a-' + orderInfoObj.orderId;
                var orderInfoBottomRightOperLeftPay = $('<a href="#" data-role="button">付款</a>').attr('id',
                    orderInfoBottomRightOperLeftPayId);
                orderInfoBottomRightOperLeftDiv.append(orderInfoBottomRightOperLeftPay);
                // 付款的事件
                orderInfoBottomRightOperLeftPay.off("click").on("click", function() {
                    bestpayUtil.payOrder("workbench_orderlist_page", orderInfoObj.orderId);
                });
            }
            if (orderInfoObj.isCanCancel == 1 || orderInfoObj.isCanCancelPay == 1) {
                // 取消订单
                var orderInfoBottomRightOperRightCancelId = orderInfoDivId + '_cancel_a-' + orderInfoObj.orderId;
                var orderInfoBottomRightOperRightCancel = $('<a href="#" data-role="button" data-inline="true">取消订单</a>').attr('id',
                    orderInfoBottomRightOperRightCancelId);
                orderInfoBottomRightOperRightDiv.append(orderInfoBottomRightOperRightCancel);

                // 取消订单的事件
                orderInfoBottomRightOperRightCancel.off("click").on("click", function() {
                    if (confirm('您确定取消该订单吗？')) {
                        var httpClient = new HttpClient();
                        httpClient.post({
                            url : Constants.url.ORDER_CANCEL_030.replace("${id}", orderInfoObj.orderId),
                            intfSuccessCallBack : function(dataObj, msg) {
                                for (var i = 0; i < workbenchOrderlistPage._orderListObj.length; i++) {
                                    if (workbenchOrderlistPage._orderListObj[i].orderId == dataObj.orderId) {
                                        workbenchOrderlistPage._orderListObj[i] = dataObj;
                                        break;
                                    }
                                }
                                // 更新当前操作订单数据
                                orderNoSpan.html(dataObj.orderNo);
                                orderTotalAmountSpan.html('<strong>' + Utils.formatMoneyStr(dataObj.orderTotalAmount) +
                                    '</strong>');
                                orderTimeSpan.html(dataObj.orderTime);
                                orderInfoBottomLeftStatusSpan.html('<strong>' + dataObj.orderListStatus + '</strong>');
                                if (dataObj.isCanPay != 1) {
                                    orderInfoBottomRightOperLeftDiv.empty();
                                }
                                if (dataObj.isCanCancel != 1 && dataObj.isCanCancelPay != 1) {
                                    orderInfoBottomRightOperRightDiv.empty();
                                }
                                orderInfoDiv.trigger('refresh');
                            }
                        });
                    }
                });
            }
        }

        orderInfoDiv.off("click").on("click", function() {
            Utils.changePageHref({
                pageId : "workbench_orderdetail_page",
                pageJsCallback : function() {
                    workbenchOrderdetailPage.initialize(Constants.tabIndex.WORKBENCH, orderInfoObj.orderId);
                }
            });
        });
    },
    /**
     * 添加产品项到供应商项
     *
     * @param orderInfoDiv
     *             供应商项块
     * @param productInfoObj
     *             产品信息数据对象
     * @param index
     *             产品信息数据索引
     * @param orderInfoDivId
     *             供应商项块ID
     * @private
     */
    _appendProductItemToOrder : function(orderInfoDiv, productInfoObj, index, orderInfoDivId) {
        var productInfoDivId = orderInfoDivId + '_' + index;
        var productInfoDiv = $('<div></div>').attr('id', productInfoDivId);

        // 产品描述块
        var productBriefInfoDivId = productInfoDivId + '_brief_';
        var productBriefInfoDiv = $('<div data-role="fieldcontain"></div>').attr('id', productBriefInfoDivId);
        var productBriefInfoFieldset = $('<fieldset data-role="controlgroup"></fieldset>');
        // 产品图片
        productBriefInfoFieldset.append('<legend><img alt="" src="' + productInfoObj.picPath5Url +
            '" onerror="Utils.showNoneImage(this)"></legend>');
        // 产品长名称
        var productBriefNameStr = productInfoObj.brandName + '&nbsp' + productInfoObj.pattern + '&nbsp' +
            productInfoObj.colorSpec;
        productBriefInfoFieldset.append('<p><strong>' + productBriefNameStr + '</strong></p>');

        productBriefInfoDiv.append(productBriefInfoFieldset);

        productInfoDiv.append(productBriefInfoDiv);

        orderInfoDiv.append(productInfoDiv);

        // 产品点击跳转到产品详情页面的事件
        productBriefInfoDiv.off("click").on("click", function() {
            Utils.changePageHref({
                pageId : "product_detail_page",
                pageJsCallback : function() {
                    productDetailPage.initialize(Constants.tabIndex.SHOPCART, productInfoObj.productId);
                }
            });
        });
    }

};
