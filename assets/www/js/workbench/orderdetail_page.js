var workbenchOrderdetailPage = {
    _currentOrderId : 0,
    /**
     * 初始化订单详情页
     * @param tabIndex 当前Tab的索引
     * @param orderId  订单ID
     */
    initialize : function(tabIndex, orderId) {
        Utils.bindFooterTabEvent("workbench_orderdetail_page", tabIndex);

        workbenchOrderdetailPage._currentOrderId = orderId;
        workbenchOrderdetailPage.initData(orderId);
    },
    /**
     * 初始化订单详情页数据
     * @param orderId 订单ID
     */
    initData : function(orderId) {
        console.log("workbench_orderdetail_page");

        if (orderId != null) {
            workbenchOrderdetailPage._currentOrderId = orderId;
        }
        workbenchOrderdetailPage._fillOrderDetailDiv(null);

        var httpClient = new HttpClient();
        httpClient.post({
            url : Constants.url.ORDER_DETAIL_028.replace("${id}", workbenchOrderdetailPage._currentOrderId),
            timeoutForwardCallback : workbenchOrderdetailPage.initData,
            showIntfSuccessMsg : false,
            intfSuccessCallBack : function(dataObj, msg) {
                // 填充订单列表数据
                workbenchOrderdetailPage._fillOrderDetailDiv(dataObj);
            }
        });
    },
    /**
     * 填充订单列表块
     *
     * @param orderListObj
     *             购物车首页的订单列表数据对象
     * @private
     */
    _fillOrderDetailDiv : function(dataObj) {
        var orderPayDetailInfoDiv = $("#workbench_orderdetail_pay_detail_info_div");
        orderPayDetailInfoDiv.empty();
        var orderSendListDiv = $("#workbench_orderdetail_send_list_div");
        orderSendListDiv.empty();
        var orderOperDiv = $("#workbench_orderdetail_oper_div");
        orderOperDiv.empty();
        if (dataObj == null) {
            $("#workbench_orderdetail_order_status").html("").trigger("refresh");
            $("#workbench_orderdetail_pay_status").html("").trigger("refresh");
            $("#workbench_orderdetail_order_no").html("").trigger("refresh");

            $("#workbench_orderdetail_product_price").html("").trigger("refresh");
            $("#workbench_orderdetail_act_price").html("").trigger("refresh");
            $("#workbench_orderdetail_trans_cost").html("").trigger("refresh");
            $("#workbench_orderdetail_order_amount").html("").trigger("refresh");

            $("#workbench_orderdetail_consignee").html("").trigger("refresh");
            $("#workbench_orderdetail_cons_mobile").html("").trigger("refresh");
            $("#workbench_orderdetail_cons_address").html("").trigger("refresh");
            $("#workbench_orderdetail_logistics_name").html("").trigger("refresh");

            $("#workbench_orderdetail_invoice_type").html("").trigger("refresh");
            return;
        }

        $("#workbench_orderdetail_order_status").html(dataObj.orderDetailStatus).trigger("refresh");
        $("#workbench_orderdetail_pay_status").html('（' + dataObj.orderPayStatus + '）').trigger("refresh");
        $("#workbench_orderdetail_order_no").html(dataObj.orderNo).trigger("refresh");

        var orderPriceInfo = dataObj.orderPriceInfo;
        $("#workbench_orderdetail_product_price").html(Utils.formatMoneyStr(orderPriceInfo.totalProductPrice)).trigger("refresh");
        $("#workbench_orderdetail_act_price").html(Utils.formatMoneyStr(orderPriceInfo.totalActPrice)).trigger("refresh");
        $("#workbench_orderdetail_trans_cost").html(Utils.formatMoneyStr(orderPriceInfo.totalTransCost)).trigger("refresh");
        $("#workbench_orderdetail_order_amount").html('<strong>' + Utils.formatMoneyStr(orderPriceInfo.totalOrderAmount) +
            '</strong>').trigger("refresh");

        var logisticsInfo = dataObj.logisticsInfo;
        $("#workbench_orderdetail_consignee").html(logisticsInfo.consignee).trigger("refresh");
        $("#workbench_orderdetail_cons_mobile").html(logisticsInfo.consMobile).trigger("refresh");
        $("#workbench_orderdetail_cons_address").html(logisticsInfo.consAddress).trigger("refresh");
        $("#workbench_orderdetail_logistics_name").html(logisticsInfo.logisticsName).trigger("refresh");

        $("#workbench_orderdetail_invoice_type").html(dataObj.invoiceTypeText).trigger("refresh");

        var i = 0;
        // 支付明细
        orderPayDetailInfoDiv.append($('<p></p>').html('支付明细'));
        var bookPayList = dataObj.payDetailInfo.bookPayList;
        if (bookPayList != null && bookPayList.length > 0) {
            var bookPayListCount = bookPayList.length;
            for (i = 0; i < bookPayListCount; i++) {
                if (bookPayList[i].bookPayCount == null) {
                    orderPayDetailInfoDiv.append($('<p></p>').html(bookPayList[i].bookPayTitle + '：' +
                        Utils.formatMoneyStr(bookPayList[i].bookPayAmount)));
                } else {
                    orderPayDetailInfoDiv.append($('<p></p>').html(bookPayList[i].bookPayTitle + '：' +
                        Utils.formatMoneyStr(bookPayList[i].bookPayAmount * bookPayList[i].bookPayCount)));
                }
            }
        }
        var offlinePay = dataObj.payDetailInfo.offlinePay;
        if (offlinePay != null) {
            orderPayDetailInfoDiv.append($('<p></p>').html(offlinePay.offlinePayTitle + '：' +
                Utils.formatMoneyStr(offlinePay.offlinePayAmount)));
        }
        var onlinePay = dataObj.payDetailInfo.onlinePay;
        if (onlinePay != null) {
            orderPayDetailInfoDiv.append($('<p></p>').html(onlinePay.onlinePayTitle + '：' +
                Utils.formatMoneyStr(onlinePay.onlinePayAmount)));
        }
        var orderPayId = 'workbench_orderdetail_pay_' + dataObj.orderId;
        var needPayDiv = $('<div class="ui-grid-a"></div>');

        var needPayAmountDiv = $('<div class="ui-block-a"></div>');
        needPayAmountDiv.append($('<p></p>').html('您还需为订单支付：<strong>' + Utils.formatMoneyStr(orderPriceInfo.needPayAmount) +
            '</strong>'));

        var needPayOperDiv = $('<div class="ui-block-b"></div>');
        var needPayOperPay = $('<a href="#" data-role="button" data-inline="true">付款</a>');
        if (dataObj.isCanPay == 1) {
            needPayOperPay.attr('id', orderPayId);
            needPayOperDiv.append(needPayOperPay);
        }

        needPayDiv.append(needPayAmountDiv, needPayOperDiv);

        orderPayDetailInfoDiv.append(needPayDiv);

        if (dataObj.isCanPay == 1) {
            // 在线支付的事件
            needPayOperPay.off("click").on("click", workbenchOrderdetailPage._orderPay);
        }

        orderPayDetailInfoDiv.trigger("create");

        // 发货单信息
        var sendList = dataObj.sendList;
        var sendListCount = sendList.length;
        for (i = 0; i < sendListCount; i++) {
            workbenchOrderdetailPage._appendSendItemToOrder(orderSendListDiv, sendList[i], i);
        }
        orderSendListDiv.trigger("create");

        // 订单操作块
        if (dataObj.isCanPay == 1 || dataObj.isCanCancel == 1 || dataObj.isCanCancelPay == 1) {
            var orderOperGridDivId = 'workbench_orderdetail_order_oper_div_grid';
            var orderOperGridDiv = $('<div class="ui-grid-a"></div>').attr('id', orderOperGridDivId);

            var orderOperLeftDiv = $('<div class="ui-block-a"></div>');

            var orderOperRightDiv = $('<div class="ui-block-b"></div>');

            orderOperGridDiv.append(orderOperLeftDiv, orderOperRightDiv);

            orderOperDiv.append(orderOperGridDiv);

            if (dataObj.isCanPay == 1) {
                var orderOperRightPayId = orderOperGridDivId + '_pay_' + dataObj.orderId;
                var orderOperRightPay = $('<a href="#" data-role="button" data-inline="true">付款</a>').attr('id',
                    orderOperRightPayId);
                orderOperRightDiv.append(orderOperRightPay);

                // 在线支付的事件
                orderOperRightPay.off("click").on("click", workbenchOrderdetailPage._orderPay);
            }
            if (dataObj.isCanCancel == 1 || dataObj.isCanCancelPay == 1) {
                var orderOperRightCancelId = orderOperGridDivId + '_cancel_' + dataObj.orderId;
                var orderOperRightCancel = $('<a href="#" data-role="button" data-inline="true">订单取消</a>').attr('id',
                    orderOperRightCancelId);
                orderOperRightDiv.append(orderOperRightCancel);

                // 订单取消的事件
                orderOperRightCancel.off("click").on("click", workbenchOrderdetailPage._orderCancel);
            }

            orderOperDiv.trigger("create");

        }

    },
    /**
     * 添加发货单项到订单项
     *
     * @param orderSendListDiv
     *             订单项块
     * @param sendInfoObj
     *             发货单信息数据对象
     * @param index
     *             发货单信息数据索引
     * @param orderInfoDivId
     *             订单项块ID
     * @private
     */
    _appendSendItemToOrder : function(orderSendListDiv, sendInfoObj, index) {
        var sendInfoDivId = 'workbench_orderdetail_send_' + index;
        var sendInfoDiv = $('<div></div>').attr('id', sendInfoDivId);
        sendInfoDiv.append($('<p></p>').html('<strong>发货单号：' + sendInfoObj.sendId + '（' + sendInfoObj.sendStatusName +
            '）</strong>'));
        if (sendInfoObj.logisticsSend.orderEms != null) {
            sendInfoDiv.append($('<p></p>').html('运单号：' + sendInfoObj.logisticsSend.orderEms));
        } else {
            sendInfoDiv.append($('<p></p>').html('运单号：'));
        }
        orderSendListDiv.append(sendInfoDiv);

        var i = 0;
        // 发货单产品列表
        var provideInfoListObj = sendInfoObj.list;
        var provideCount = provideInfoListObj.length;
        for (i = 0; i < provideCount; i++) {
            workbenchOrderdetailPage._appendProvideItemToSend(sendInfoDiv, provideInfoListObj[i], i, sendInfoDivId);
        }

        // 发货单赠品
        var giftListObj = sendInfoObj.giftList;
        if (giftListObj != null && giftListObj.length > 0) {
            var giftInfoDivId = sendInfoDivId + '_gift';
            var giftInfoDiv = $('<div></div>').attr('id', giftInfoDivId);
            giftInfoDiv.append($('<p></p>').html('附赠品信息：'));
            var giftInfoLineStr = "";
            var giftListObjCount = giftListObj.length;
            for (i = 0; i < giftListObjCount; i++) {
                giftInfoLineStr = giftListObj[i].brandName + '&nbsp' + giftListObj[i].pattern + '&nbsp' +
                    giftListObj[i].colorSpec + '&nbsp数量：' + giftListObj[i].quantity;
                giftInfoDiv.append($('<p></p>').html(giftInfoLineStr));
            }
            sendInfoDiv.append(giftInfoDiv);
        }

        // 订单费用块
        var sendPriceInfoObj = sendInfoObj.priceInfo;
        var sendPriceInfoDiv = $('<div></div>');
        // 产品数量
        var sendPriceInfoProductPriceP = $('<p><span>+产品费用：</span></p>');
        var sendPriceInfoProductPriceSpan = $('<span></span>').html(sendPriceInfoObj.totalPrice);
        sendPriceInfoProductPriceP.append(sendPriceInfoProductPriceSpan);
        // 产品单价
        var sendPriceInfoActPriceP = $('<p><span>-优惠：</span></p>');
        var sendPriceInfoActPriceSpan = $('<span></span>').html(Utils.formatMoneyStr(sendPriceInfoObj.transCost));
        sendPriceInfoActPriceP.append(sendPriceInfoActPriceSpan);
        // 产品优惠
        var sendPriceInfoTransCostP = $('<p><span>+运费：</span></p>');
        var sendPriceInfoTransCostSpan = $('<span></span>').html(Utils.formatMoneyStr(sendPriceInfoObj.actPrice));
        sendPriceInfoTransCostP.append(sendPriceInfoTransCostSpan);
        // 产品优惠
        var sendPriceInfoTotalAmountP = $('<p><span>小计：</span></p>');
        var sendPriceInfoTotalAmountSpan = $('<span></span>').html('<strong>' +
            Utils.formatMoneyStr(sendPriceInfoObj.sendTotalAmount) + '</strong>');
        sendPriceInfoTotalAmountP.append(sendPriceInfoTotalAmountSpan);

        sendPriceInfoDiv.append(sendPriceInfoProductPriceP, sendPriceInfoActPriceP, sendPriceInfoTransCostP,
            sendPriceInfoTotalAmountP);

        sendInfoDiv.append(sendPriceInfoDiv);

    },
    /**
     * 添加供应商项到发货单项
     *
     * @param sendInfoDiv
     *             发货单块
     * @param provideInfoObj
     *             供应商信息数据对象
     * @param index
     *             供应商信息数据索引
     * @param sendInfoDivId
     *             发货单块ID
     * @private
     */
    _appendProvideItemToSend : function(sendInfoDiv, provideInfoObj, index, sendInfoDivId) {
        var provideInfoDivId = sendInfoDivId + '_provide_' + index;
        var provideInfoDiv = $('<div></div>').attr('id', provideInfoDivId);
        provideInfoDiv.append($('<p></p>').html('供应商：' + provideInfoObj.provName));
        sendInfoDiv.append(provideInfoDiv);

        var productInfoListObj = provideInfoObj.list;
        var productCount = productInfoListObj.length;
        for (var i = 0; i < productCount; i++) {
            workbenchOrderdetailPage._appendProductItemToProvide(provideInfoDiv, productInfoListObj[i], i, provideInfoDivId);
        }
    },
    /**
     * 添加产品项到供应商项
     *
     * @param provideInfoDiv
     *             供应商项块
     * @param productInfoObj
     *             产品信息数据对象
     * @param index
     *             产品信息数据索引
     * @param provideInfoDivId
     *             供应商项块ID
     * @private
     */
    _appendProductItemToProvide : function(provideInfoDiv, productInfoObj, index, provideInfoDivId) {
        var productInfoDivId = provideInfoDivId + '_' + index;
        var productInfoDiv = $('<div></div>').attr('id', productInfoDivId);

        provideInfoDiv.append(productInfoDiv);

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
        // 产品数量
        var productBriefInfoP = $('<p></p>');
        var productBriefInfoQuantitySpan = $('<span>数量：</span>').append(productInfoObj.quantity);
        // 产品单价
        var productBriefInfoCurrentPriceSpan = $('<span>单价：</span>').append(Utils.formatMoneyStr(productInfoObj.currentPrice));
        // 产品优惠
        var productBriefInfoActPriceSpan = $('<span>优惠：</span>').append(Utils.formatMoneyStr(productInfoObj.actPrice));

        var productBriefInfoNbspSpan = $('<span>&nbsp</span>');

        productBriefInfoP.append(productBriefInfoQuantitySpan, productBriefInfoNbspSpan, productBriefInfoCurrentPriceSpan,
            productBriefInfoNbspSpan, productBriefInfoActPriceSpan);

        productBriefInfoFieldset.append(productBriefInfoP);

        productBriefInfoDiv.append(productBriefInfoFieldset);

        productInfoDiv.append(productBriefInfoDiv);

        // 产品点击跳转到产品详情页面的事件
        productBriefInfoDiv.off("click").on("click", function() {
            Utils.changePageHref({
                pageId : "product_detail_page",
                pageJsCallback : function() {
                    productDetailPage.initialize(Constants.tabIndex.SHOPCART, productInfoObj.productId);
                }
            });
        });
    },
    /**
     * 生成手机翼支付的支付订单
     *
     * @private
     */
    _orderPay : function() {
        bestpayUtil.payOrder("workbench_orderdetail_page", workbenchOrderdetailPage._currentOrderId);
    },
    /**
     * 订单取消
     * @private
     */
    _orderCancel : function() {
        if (confirm('您确定取消该订单吗？')) {
            var httpClient = new HttpClient();
            httpClient.post({
                url : Constants.url.ORDER_CANCEL_030.replace("${id}", workbenchOrderdetailPage._currentOrderId),
                timeoutForwardCallback : workbenchOrderdetailPage._orderCancel,
                intfSuccessCallBack : function(dataObj, msg) {
                    // 填充订单列表数据
                    workbenchOrderdetailPage.initData();
                }
            });
        }
    }

};

