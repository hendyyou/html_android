var shopcartIndexPage = {
    _isNeedInputChannelId : false,
    _selectedConsId : -1,
    initialize : function(tabIndex) {
        Utils.bindFooterTabEvent("shopcart_index_page", tabIndex);

        $("#shopcart_index_order_info_div").hide();
        $("#shopcart_index_no_data_div").hide();
        shopcartIndexPage._isNeedInputChannelId = false;
        shopcartIndexPage._selectedConsId = -1;

        if (!Utils.isLogin()) {
            Utils.changeToUserLogin(shopcartIndexPage.initData);
        } else {
            shopcartIndexPage.initData();
        }

        $("#shopcart_index_goto_consignee").off("click").on("click", function() {
            Utils.changePageHref({
                pageId : "workbench_address_page",
                pageJsCallback : function() {
                    workbenchAddressPage.initialize(Constants.tabIndex.SHOPCART, shopcartIndexPage._selectedConsId,
                        shopcartIndexPage.initConsigneeInfoDiv);
                }
            });
        });

        $("#shopcart_index_goto_next").off("click").on("click", function() {
            if (shopcartIndexPage._selectedConsId == -1) {
                Utils.drawToast("未设置收货信息");
                return;
            }
            if (shopcartIndexPage._isNeedInputChannelId) {
                // 切换到渠道信息录入页面
                Utils.changePageHref({
                    pageId : "shopcart_channel_page",
                    pageJsCallback : function() {
                        shopcartChannelPage.initialize(Constants.tabIndex.SHOPCART, shopcartIndexPage._selectedConsId);
                    }
                });
            } else {
                // 切换到购物车确认页面
                Utils.changePageHref({
                    pageId : "shopcart_confirm_page",
                    pageJsCallback : function() {
                        shopcartConfirmPage.initialize(Constants.tabIndex.SHOPCART, shopcartIndexPage._selectedConsId);
                    }
                });
            }
        });

        $("#shopcart_index_nodata_gotoproduct").off("click").on("click", function() {
            Utils.changeToProductIndex();
        });

    },
    /**
     * 初始化购物车首页
     */
    initData : function() {
        console.log("================shopcartIndexPage=============");
        if (shopcartUtil.getUserShopcartData()) {
            // 填充订单列表数据
            shopcartIndexPage._fillOrderListDiv(null);
            // 填充收货信息数据
            shopcartIndexPage.initConsigneeInfoDiv(null);
            // 填充发票信息数据
            shopcartIndexPage._fillInvoiceInfoDiv(null);
            // 有本地购物车数据，调用购物车首页接口
            var httpClient = new HttpClient();
            httpClient.post({
                url : Constants.url.SHOP_CART_INDEX_042,
                timeoutForwardCallback : shopcartIndexPage.initData,
                showIntfSuccessMsg : false,
                intfSuccessCallBack : function(dataObj, msg) {
                    $("#shopcart_index_order_info_div").show();
                    $("#shopcart_index_no_data_div").hide();
                    // 设置数据变量
                    shopcartIndexPage._isNeedInputChannelId = dataObj.isNeedInputChannelId;
                    // 填充订单列表数据
                    shopcartIndexPage._fillOrderListDiv(dataObj.orderList);
                    // 填充收货信息数据
                    shopcartIndexPage.initConsigneeInfoDiv(dataObj.consigneeInfo);
                    // 填充发票信息数据
                    shopcartIndexPage._fillInvoiceInfoDiv(dataObj.invoiceInfo);
                },
                intfFailureCallBack : function(dataObj, msg, failureCode) {
                    if (failureCode == "00") {
                        shopcartUtil.clearCart();
                        $("#shopcart_index_order_info_div").hide();
                        $("#shopcart_index_no_data_div").show();
                    }
                    shopcartIndexPage._isNeedInputChannelId = false;
                    shopcartIndexPage._selectedConsId = -1;
                }
            });
        } else {
            // 没有购物车数据，则自动切换到无购物车的去逛逛页面
            $("#shopcart_index_order_info_div").hide();
            $("#shopcart_index_no_data_div").show();
        }
    },
    /**
     * 初始化收货信息块
     *
     * @param consigneeInfoObj
     *            收货信息数据对象<br>
     *            consId:门店ID<br>
     *            consignee:收货人<br>
     *            consMobile:手机<br>
     *            consAddress:收货地址<br>
     */
    initConsigneeInfoDiv : function(consigneeInfoObj) {
        if (consigneeInfoObj != null) {
            if (consigneeInfoObj.consId != null) {
                shopcartIndexPage._selectedConsId = consigneeInfoObj.consId;
            }
            $("#shopcart_index_consignee").html(consigneeInfoObj.consignee).trigger("refresh");
            $("#shopcart_index_consignee_mobile").html(consigneeInfoObj.consMobile).trigger("refresh");
            $("#shopcart_index_consignee_address").html(consigneeInfoObj.consAddress).trigger("refresh");
        } else {
            $("#shopcart_index_consignee").html("").trigger("refresh");
            $("#shopcart_index_consignee_mobile").html("").trigger("refresh");
            $("#shopcart_index_consignee_address").html("").trigger("refresh");
        }
    },
    /**
     * 填充订单列表块
     *
     * @param orderListObj
     *             购物车首页的订单列表数据对象
     * @private
     */
    _fillOrderListDiv : function(orderListObj) {
        var orderListDiv = $("#shopcart_index_order_list_div");
        orderListDiv.empty();
        if (orderListObj == null) {
            return;
        }
        var orderCount = orderListObj.length;
        for (var i = 0; i < orderCount; i++) {
            shopcartIndexPage._appendOrderItemToList(orderListDiv, orderListObj[i], i);
        }
        orderListDiv.trigger("create");
    },
    /**
     * 填充发票信息块
     *
     * @param invoiceInfoObj
     *             购物车首页的发票信息数据对象
     * @private
     */
    _fillInvoiceInfoDiv : function(invoiceInfoObj) {
        if (invoiceInfoObj != null) {
            $("#shopcart_index_invoice_type_name").html(invoiceInfoObj.invoiceTypeName).trigger("refresh");
        } else {
            $("#shopcart_index_invoice_type_name").html("").trigger("refresh");
        }
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
        var orderInfoDivId = 'shopcart_index_order_' + index;
        var orderInfoDiv = $('<div></div>').attr('id', orderInfoDivId);
        orderInfoDiv.append($('<h2></h2>').html(orderInfoObj.orderTitle));
        orderListDiv.append(orderInfoDiv);

        var provideInfoListObj = orderInfoObj.list;
        var provideCount = provideInfoListObj.length;
        for (var i = 0; i < provideCount; i++) {
            shopcartIndexPage._appendProvideItemToOrder(orderInfoDiv, provideInfoListObj[i], i, orderInfoDivId);
        }
    },
    /**
     * 添加供应商项到订单项
     *
     * @param orderInfoDiv
     *             订单项块
     * @param provideInfoObj
     *             供应商信息数据对象
     * @param index
     *             供应商信息数据索引
     * @param orderInfoDivId
     *             订单项块ID
     * @private
     */
    _appendProvideItemToOrder : function(orderInfoDiv, provideInfoObj, index, orderInfoDivId) {
        var provideInfoDivId = orderInfoDivId + '_' + index;
        var provideInfoDiv = $('<div></div>').attr('id', provideInfoDivId);
        provideInfoDiv.append($('<p></p>').html('供应商：' + provideInfoObj.provName));
        orderInfoDiv.append(provideInfoDiv);

        var productInfoListObj = provideInfoObj.list;
        var productCount = productInfoListObj.length;
        for (var i = 0; i < productCount; i++) {
            shopcartIndexPage._appendProductItemToProvide(provideInfoDiv, productInfoListObj[i], i, provideInfoDivId);
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

        // 产品描述块
        var productBriefInfoDivId = productInfoDivId + '_brief_';
        var productBriefInfoDiv = $('<div data-role="fieldcontain"></div>').attr('id', productBriefInfoDivId);
        var productBriefInfoFieldset = $('<fieldset data-role="controlgroup"></fieldset>');
        // 产品图片
        productBriefInfoFieldset.append('<legend><img alt="" src="' + productInfoObj.productInfo.picPath5Url +
            '" onerror="Utils.showNoneImage(this)"></legend>');
        // 产品长名称
        productBriefInfoFieldset.append('<p><strong>' + productInfoObj.productInfo.brandName + '&nbsp' +
            productInfoObj.productInfo.pattern + '&nbsp' + productInfoObj.productInfo.colorSpec + '</strong></p>');
        // 产品单价
        var productBriefInfoCurrentPriceP = $('<p>单价：</p>');
        var productBriefInfoCurrentPriceSpan = $('<span></span>').attr('id',
            productBriefInfoDivId + '_current_price_span-' + productInfoObj.productInfo.productId);
        productBriefInfoCurrentPriceSpan.html(Utils.formatMoneyStr(productInfoObj.currentPrice));
        productBriefInfoCurrentPriceP.append(productBriefInfoCurrentPriceSpan);
        // 产品费用
        var productBriefInfoTotalPriceP = $('<p>费用：</p>');
        var productBriefInfoTotalPriceSpan = $('<span></span>').attr('id',
            productBriefInfoDivId + '_total_price_span-' + productInfoObj.productInfo.productId);
        productBriefInfoTotalPriceSpan.html(Utils.formatMoneyStr(productInfoObj.totalPrice));
        productBriefInfoTotalPriceP.append(productBriefInfoTotalPriceSpan);

        productBriefInfoFieldset.append(productBriefInfoCurrentPriceP, productBriefInfoTotalPriceP);

        productBriefInfoDiv.append(productBriefInfoFieldset);

        // 产品数量操作块
        var productQuantityInfoDivId = productInfoDivId + '_oper_';
        var productQuantityInfoDiv = $('<div class="ui-grid-a"></div>').attr('id', productQuantityInfoDivId);
        // 产品左侧数量操作块
        var productQuantityInfoLeftDiv = $('<div class="ui-block-a"></div>');
        var productQuantityInfoLeftFieldDiv = $('<div data-role="fieldcontain"></div>');
        var productQuantityInfoLeftFieldInputId = productQuantityInfoDivId + '_input-' +
            productInfoObj.productInfo.productId;
        var productQuantityInfoLeftFieldLabel = $('<label>数量：</label>').attr('for', productQuantityInfoLeftFieldInputId);
        var productQuantityInfoLeftFieldInput = $('<input type="range" min="1" max="999">').attr('id',
                productQuantityInfoLeftFieldInputId).attr('productId',
                productInfoObj.productInfo.productId).val(productInfoObj.quantity);
        productQuantityInfoLeftFieldDiv.append(productQuantityInfoLeftFieldLabel, productQuantityInfoLeftFieldInput);
        productQuantityInfoLeftDiv.append(productQuantityInfoLeftFieldDiv);
        // 产品右侧删除块
        var productQuantityInfoRightDiv = $('<div class="ui-block-b"></div>');
        var productQuantityInfoRightRemoveId = productQuantityInfoDivId + '_a-' + productInfoObj.productInfo.productId;
        var productQuantityInfoRightRemove = $('<a href="#" data-role="button" data-inline="true">删除</a>');
        productQuantityInfoRightRemove.attr('id', productQuantityInfoRightRemoveId).css('float', 'right').attr('productId',
            productInfoObj.productInfo.productId);
        productQuantityInfoRightDiv.append(productQuantityInfoRightRemove);

        productQuantityInfoDiv.append(productQuantityInfoLeftDiv, productQuantityInfoRightDiv);

        console.log('productQuantityInfoDiv html:' + productQuantityInfoDiv.html());

        // 产品级活动信息块
        var productActInfoDiv = $('<div></div>');
        var productActInfoListObj = productInfoObj.itemActInfoList;
        if (productActInfoListObj != null) {
            var productActCount = productActInfoListObj.length;
            for (var i = 0; i < productActCount; i++) {
                productActInfoDiv.append('<p>' + productActInfoListObj[i].actInfo + '</p>');
            }
        }

        productInfoDiv.append(productBriefInfoDiv, productQuantityInfoDiv, productActInfoDiv);

        provideInfoDiv.append(productInfoDiv);

        // 产品点击跳转到产品详情页面的事件
        productBriefInfoDiv.off("click").on("click", function() {
            Utils.changePageHref({
                pageId : "product_detail_page",
                pageJsCallback : function() {
                    productDetailPage.initialize(Constants.tabIndex.SHOPCART, productInfoObj.productInfo.productId);
                }
            });
        });
        // 减少一个订购数量的事件
        // 增加一个订购数量的事件
        // 编辑订购数量的事件
        productQuantityInfoLeftFieldInput.off("slidestop").on("slidestop", function(event, ui) {
            alert('slidestop');
            var inputProductId = productQuantityInfoLeftFieldInput.attr('productId');
            var inputQuantity = ui.value;
            alert('slidestop inputProductId:' + inputProductId + ', inputQuantity:' + inputQuantity);
            shopcartUtil.editCart({
                productId : inputProductId,
                quantity : inputQuantity,
                shopcartCallback : function() {
                    var currentPrice = Utils.moneyStrToDouble(productBriefInfoCurrentPriceSpan.html());
                    productBriefInfoTotalPriceSpan.html(Utils.formatMoneyStr(currentPrice * inputQuantity));
                }
            });
        });
        // 删除事件
        productQuantityInfoRightRemove.off("click").on("click", function() {
            var inputProductId = productQuantityInfoRightRemove.attr('productId');
            shopcartUtil.removeCart({
                productId : inputProductId,
                shopcartCallback : shopcartIndexPage.initData
            });
        });
    }

};
