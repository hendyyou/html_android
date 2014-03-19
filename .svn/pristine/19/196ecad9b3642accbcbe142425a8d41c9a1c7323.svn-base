var workbenchAddressPage = {
    _currentAddressObj : "",
    _addressListObj : "",
    _operTypeDef : {
        add : 1,
        update : 2
    },
    _lastProvinceId : 0,
    _lastCityId : 0,

    initialize : function(tabIndex, shopcartConsId, successCallBack) {
        Utils.bindFooterTabEvent("workbench_address_page", tabIndex);

        workbenchAddressPage.initData(shopcartConsId);

        $("#workbench_address_info_province").off("change").on("change", function() {
            var provinceId = $("#workbench_address_info_province").val();
            console.log('provinceId:' + provinceId + ', workbenchAddressPage._lastProvinceId:' +
                workbenchAddressPage._lastProvinceId);
            if (provinceId == null || provinceId == workbenchAddressPage._lastProvinceId) {
                return;
            }
            workbenchAddressPage._initCitySelect(provinceId);
            workbenchAddressPage._lastProvinceId = provinceId;
        });

        $("#workbench_address_info_city").off("change").on("change", function() {
            var cityId = $("#workbench_address_info_city").val();
            console.log('cityId:' + cityId + ', workbenchAddressPage._lastCityId:' +
                workbenchAddressPage._lastCityId);
            if (cityId == null || cityId == workbenchAddressPage._lastCityId) {
                return;
            }
            workbenchAddressPage._initCountySelect(cityId);
            workbenchAddressPage._lastCityId = cityId;
        });

        $("#workbench_address_oper_update").off("click").on("click", function() {
            workbenchAddressPage._operAddress({
                operType : workbenchAddressPage._operTypeDef.update,
                consId : shopcartConsId,
                callBack : successCallBack
            });
        });

        $("#workbench_address_oper_create").off("click").on("click", function() {
            workbenchAddressPage._operAddress({
                operType : workbenchAddressPage._operTypeDef.add,
                consId : shopcartConsId,
                callBack : successCallBack
            });
        });
    },

    initData : function(shopcartConsId) {
        console.log("workbenchAddressPage");

        // 获取物流商数据
        workbenchAddressPage._initLogisticsSelect();

        // 获取省份数据
        workbenchAddressPage._initProvinceSelect();

        // 清空原有地址数据
        workbenchAddressPage._fillAddressListDiv(null);
        workbenchAddressPage._fillAddressInfoDiv(null);
        // 获取收货地址
        var addressHttpClient = new HttpClient();
        addressHttpClient.post({
            url : Constants.url.DELIVERY_ADDR_LIST_022,
            timeoutForwardCallback : workbenchAddressPage.initData,
            timeoutForwardArgObj : shopcartConsId,
            showIntfSuccessMsg : false,
            intfSuccessCallBack : function(dataObj, msg) {
                if (dataObj == null || dataObj.length == 0) {
                    Utils.drawToast('查询不到收货地址数据');
                }
                workbenchAddressPage._fillAddressListDiv(dataObj, shopcartConsId);
            }
        });
    },

    _fillAddressListDiv : function(dataListObj, shopcartConsId) {
        var workbench_address_list_div = $('#workbench_address_list_div');
        workbench_address_list_div.empty();

        workbenchAddressPage._addressListObj = dataListObj;
        if (dataListObj == null || dataListObj.length == 0) {
            // 没有收货地址数据，使用用户信息填充
            var userInfo = Utils.getUserInfo();
            workbenchAddressPage._currentAddressObj = {
                city : userInfo.cityId,
                county : userInfo.areaId,
                province : userInfo.zoneId,
                consigneed : userInfo.userName,
                consMobile : userInfo.custMobile,
                consAddress : userInfo.custConsAddress
            };
        } else {
            // 有收货地址数据
            var isJudgeConsId = true;
            if (typeof shopcartConsId == 'undefined' || shopcartConsId <= 0) {
                isJudgeConsId = false;
            }
            var isDefaultFound = false;
            var dataItemObj = null;
            var addressListForm = $('<form></form>');
            var addressListFieldset = $('<fieldset data-role="controlgroup"></fieldset>');
            for (var i = 0; i < dataListObj.length; i++) {
                dataItemObj = dataListObj[i];
                // 填充列表
                var addressListItemInputId = 'workbench_address_list_radio_' + dataItemObj.consId;
                var addressListItemInput = $('<input type="radio" name="workbench_address_list_radio">');
                addressListItemInput.attr('id', addressListItemInputId).val(dataItemObj.consId);
                // 设置默认选项
                if (isJudgeConsId) {
                    if (shopcartConsId == dataItemObj.consId) {
                        isDefaultFound = true;
                        workbenchAddressPage._currentAddressObj = $.extend(true, {}, dataItemObj);
                        addressListItemInput.attr('checked', true);
                    }
                } else {
                    if (1 == dataItemObj.isdefault) {
                        isDefaultFound = true;
                        workbenchAddressPage._currentAddressObj = $.extend(true, {}, dataItemObj);
                        addressListItemInput.attr('checked', true);
                    }
                }
                var addressListItemLabel = $('<label></label>').attr('for',
                    addressListItemInputId).html(dataItemObj.consigneed + '&nbsp&nbsp' + dataItemObj.fullConsAddress);

                addressListFieldset.append(addressListItemInput, addressListItemLabel);

            }
            addressListForm.append(addressListFieldset);
            if (!isDefaultFound) {
                workbenchAddressPage._currentAddressObj = $.extend(true, {}, dataListObj[0]);
            }

            workbench_address_list_div.append(addressListForm);
            console.log('html:' + workbench_address_list_div.html());

            workbench_address_list_div.trigger('create');

            // 设置事件
            $('input[name="workbench_address_list_radio"]').off("change").on("change",
                workbenchAddressPage._addressListCheckedChange);
        }

        // 填充收货地址信息
        workbenchAddressPage._fillAddressInfoDiv(workbenchAddressPage._currentAddressObj);

    },

    _fillAddressInfoDiv : function(dataItemObj) {
        var workbench_address_info_div = $('#workbench_address_info_div');
        if (dataItemObj == null) {
            $('#workbench_address_info_consigneed').val('').trigger('refresh');
            $('#workbench_address_info_cons_mobile').val('').trigger('refresh');
            $('#workbench_address_info_province').val('').trigger('refresh');
            $('#workbench_address_info_city').val('').trigger('refresh');
            $('#workbench_address_info_county').val('').trigger('refresh');
            $('#workbench_address_info_cons_address').val('').trigger('refresh');
            $('#workbench_address_info_shop_name').val('').trigger('refresh');
            $('#workbench_address_info_logistics').val('').trigger('refresh');
        } else {
            $('#workbench_address_info_consigneed').val(dataItemObj.consigneed).trigger('refresh');
            $('#workbench_address_info_cons_mobile').val(dataItemObj.consMobile).trigger('refresh');
            $('#workbench_address_info_province').val(dataItemObj.province).trigger('refresh');
            $('#workbench_address_info_province').change();
            $('#workbench_address_info_city').val(dataItemObj.city).trigger('refresh');
            $('#workbench_address_info_city').change();
            $('#workbench_address_info_county').val(dataItemObj.county).trigger('refresh');
            $('#workbench_address_info_county').change();
            $('#workbench_address_info_cons_address').val(dataItemObj.consAddress).trigger('refresh');
            $('#workbench_address_info_shop_name').val(dataItemObj.shopName).trigger('refresh');
            $('#workbench_address_info_logistics').val(dataItemObj.logisticsId).trigger('refresh');
            $('#workbench_address_info_logistics').change();
        }
        workbench_address_info_div.trigger('refresh');
    },

    _initLogisticsSelect : function() {
        var workbench_address_info_logistics = $('#workbench_address_info_logistics');
        workbench_address_info_logistics.empty();
        var logisticsHttpClient = new HttpClient();
        logisticsHttpClient.post({
            url : Constants.url.LOAD_LOGISTICS_021,
            showIntfSuccessMsg : false,
            intfSuccessCallBack : function(dataObj, msg) {
                for (var i = 0; i < dataObj.length; i++) {
                    var selectOption = $('<option value="' + dataObj[i].provideId + '">' + dataObj[i].provName +
                        '</option>');
                    if (workbenchAddressPage._currentAddressObj != "" &&
                        workbenchAddressPage._currentAddressObj.logisticsId == dataObj[i].provideId) {
                        selectOption.attr('selected', true);
                    }
                    workbench_address_info_logistics.append(selectOption);
                }
                $('#workbench_address_info_logistics').trigger('create');
            }
        });
    },

    _initProvinceSelect : function() {
        var workbench_address_info_province = $('#workbench_address_info_province');
        workbench_address_info_province.empty();
        var provinceHttpClient = new HttpClient();
        provinceHttpClient.post({
            url : Constants.url.LOAD_PROVINCE_013,
            showIntfSuccessMsg : false,
            intfSuccessCallBack : function(dataObj, msg) {
                for (var i = 0; i < dataObj.length; i++) {
                    var selectOption = $('<option value="' + dataObj[i].areaId + '">' + dataObj[i].areaName + '</option>');
                    if (workbenchAddressPage._currentAddressObj != "" &&
                        workbenchAddressPage._currentAddressObj.province == dataObj[i].areaId) {
                        selectOption.attr('selected', true);
                    }
                    workbench_address_info_province.append(selectOption);
                }
                $('#workbench_address_info_province').trigger('create');
                if (workbenchAddressPage._currentAddressObj) {
                    workbench_address_info_province.change();
                }
            }
        });
    },

    _initCitySelect : function(province) {
        var workbench_address_info_city = $('#workbench_address_info_city');
        workbench_address_info_city.empty();
        var cityHttpClient = new HttpClient();
        cityHttpClient.post({
            url : Constants.url.LOAD_AREA_014.replace("${id}", province),
            showIntfSuccessMsg : false,
            intfSuccessCallBack : function(dataObj, msg) {
                for (var i = 0; i < dataObj.length; i++) {
                    var selectOption = $('<option value="' + dataObj[i].areaId + '">' + dataObj[i].areaName + '</option>');
                    if (workbenchAddressPage._currentAddressObj != "" &&
                        workbenchAddressPage._currentAddressObj.city == dataObj[i].areaId) {
                        selectOption.attr('selected', true);
                    }
                    workbench_address_info_city.append(selectOption);
                }
                $('#workbench_address_info_city').trigger('create');
                if (workbenchAddressPage._currentAddressObj) {
                    workbench_address_info_city.change();
                }
            }
        });
    },

    _initCountySelect : function(city) {
        var workbench_address_info_county = $('#workbench_address_info_county');
        workbench_address_info_county.empty();
        var countyHttpClient = new HttpClient();
        countyHttpClient.post({
            url : Constants.url.LOAD_AREA_014.replace("${id}", city),
            showIntfSuccessMsg : false,
            intfSuccessCallBack : function(dataObj, msg) {
                for (var i = 0; i < dataObj.length; i++) {
                    var selectOption = $('<option value="' + dataObj[i].areaId + '">' + dataObj[i].areaName + '</option>');
                    if (workbenchAddressPage._currentAddressObj != "" &&
                        workbenchAddressPage._currentAddressObj.county == dataObj[i].areaId) {
                        selectOption.attr('selected', true);
                    }
                    workbench_address_info_county.append(selectOption);
                }
                $('#workbench_address_info_county').trigger('create');
                if (workbenchAddressPage._currentAddressObj) {
                $('#workbench_address_info_county').change();
                }
            }
        });
    },
    /**
     * 操作收货信息
     *
     * @param operObj
     *            操作对象<br>
     *            operType:操作类型。<br>
     *            consId:购物车收货信息ID。<br>
     *            callBack:购物车回调方法。<br>
     * @private
     */
    _operAddress : function(operObj) {
        var consigneedValue = $.trim($('#workbench_address_info_consigneed').val());
        if (consigneedValue == null || consigneedValue == '') {
            Utils.drawToast('请输入收货人');
            $('#workbench_address_info_consigneed').focus();
            return;
        }
        var consMobileValue = $.trim($('#workbench_address_info_cons_mobile').val());
        if (consMobileValue == null || consMobileValue == '') {
            Utils.drawToast('请输入手机号码');
            $('#workbench_address_info_cons_mobile').focus();
            return;
        }
        var provinceIdText = $('#workbench_address_info_province  option:selected').text();
        var provinceIdValue = $('#workbench_address_info_province').val();
        if (provinceIdValue == null || provinceIdValue == '') {
            Utils.drawToast('请选择省份');
            $('#workbench_address_info_province').focus();
            return;
        }
        var cityIdText = $('#workbench_address_info_city  option:selected').text();
        var cityIdValue = $('#workbench_address_info_city').val();
        if (cityIdValue == null || cityIdValue == '') {
            Utils.drawToast('请选择城市');
            $('#workbench_address_info_city').focus();
            return;
        }
        var countryIdText = $('#workbench_address_info_county  option:selected').text();
        var countryIdValue = $('#workbench_address_info_county').val();
        if (countryIdValue == null || countryIdValue == '') {
            Utils.drawToast('请选择县区');
            $('#workbench_address_info_county').focus();
            return;
        }
        var consAddressValue = $.trim($('#workbench_address_info_cons_address').val());
        if (consAddressValue == null || consAddressValue == '') {
            Utils.drawToast('请输入详细地址');
            $('#workbench_address_info_cons_address').focus();
            return;
        }
        var shopNameValue = $.trim($('#workbench_address_info_shop_name').val());
        var logisticsIdText = $('#workbench_address_info_logistics  option:selected').text();
        var logisticsIdValue = $('#workbench_address_info_logistics').val();
        if (logisticsIdValue == null || logisticsIdValue == '') {
            Utils.drawToast('请选择物流商');
            $('#workbench_address_info_logistics').focus();
            return;
        }

        var postUrl = Constants.url.ADD_DELIVERY_024;
        var postParams = {
            "custConsignee.consigneed" : consigneedValue,
            "custConsignee.consAddress" : consAddressValue,
            "custConsignee.consMobile" : consMobileValue,
            "custConsignee.provinceId" : provinceIdValue,
            "custConsignee.cityId" : cityIdValue,
            "custConsignee.countryId" : countryIdValue,
            "logisticsId" : logisticsIdValue
        };
        if (shopNameValue != '') {
            postParams["custConsignee.shopName"] = shopNameValue;
        }
        if (operObj.operType == workbenchAddressPage._operTypeDef.update) {
            if (typeof workbenchAddressPage._currentAddressObj.consId == 'undefined') {
                Utils.drawToast('请使用新增按钮');
                return;
            }
            postUrl = Constants.url.UPDATE_DELIVERY_025;
            postParams["custConsignee.consId"] = workbenchAddressPage._currentAddressObj.consId;
        }
        var httpClient = new HttpClient();
        httpClient.post({
            url : postUrl,
            params : postParams,
            timeoutForwardCallback : workbenchAddressPage._operAddress,
            timeoutForwardArgObj : operObj,
            intfSuccessCallBack : function(dataObj, msg) {
                // 返回上一个页面
                navigator.app.backHistory();
                if (operObj.consId != null) {
                    // 设置数据
                    var addressObj = {
                        consId : dataObj.consId,
                        shopName : shopNameValue,
                        consigneed : consigneedValue,
                        fullConsAddress : provinceIdText + cityIdText + countryIdText + consAddressValue,
                        consAddress : consAddressValue,
                        consMobile : consMobileValue,
                        province : provinceIdValue,
                        provinceName : provinceIdText,
                        city : cityIdValue,
                        cityName : cityIdText,
                        county : countryIdValue,
                        countyName : countryIdText,
                        logisticsId : logisticsIdValue,
                        logisticsName : logisticsIdText
                    };
                    $.extend(true, workbenchAddressPage._currentAddressObj, addressObj);
                    var shopcartAddressObj = {
                        consId : dataObj.consId,
                        consignee : consigneedValue,
                        consAddress : provinceIdText + cityIdText + countryIdText + consAddressValue,
                        consMobile : consMobileValue
                    };
                    // 执行回调方法
                    if (typeof operObj.callBack == 'function') {
                        var intervalCounter = setInterval(function() {
                            operObj.callBack(shopcartAddressObj);
                            clearInterval(intervalCounter);
                        }, 500);
                    }
                }
            }
        });
    },

    _addressListCheckedChange : function() {
        var selectConsId = $('input[name="workbench_address_list_radio"]:checked').val();
        for (var i = 0; i < workbenchAddressPage._addressListObj.length; i++) {
            if (selectConsId == workbenchAddressPage._addressListObj[i].consId) {
                workbenchAddressPage._currentAddressObj = $.extend(true, {}, workbenchAddressPage._addressListObj[i]);
                workbenchAddressPage._fillAddressInfoDiv(workbenchAddressPage._currentAddressObj);
                break;
            }
        }
    }
};
