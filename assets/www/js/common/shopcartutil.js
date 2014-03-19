var shopcartUtil = {
    /**
     * 添加登陆用户的指定产品的购物车数据
     *
     * @param cartDataObj
     *            购物车数据对象<br>
     *            vmiProvideId:产品供应商ID<br>
     *            productId:产品ID<br>
     *            quantity:产品数量<br>
     *            shopcartCallback:成功调用后的回调方法<br>
     *            callbackArgObj:回调方法的参数对象<br>
     */
    addCart : function(cartDataObj) {
        Utils.refreshCartCount(0);
        var httpClient = new HttpClient();
        httpClient.post({
            url : Constants.url.ADD_SHOP_CART_039,
            params : {
                vmiProvideId : cartDataObj.vmiProvideId,
                productId : cartDataObj.productId,
                quantity : cartDataObj.quantity
            },
            timeoutForwardCallback : shopcartUtil.addCart,
            timeoutForwardArgObj : cartDataObj,
            intfSuccessCallBack : function(dataObj, msg) {
                var userShopcartData = shopcartUtil.getUserShopcartData();
                if (!userShopcartData) {
                    userShopcartData = {};
                }
                if (userShopcartData[cartDataObj.productId] == null) {
                    userShopcartData[cartDataObj.productId] = {
                        productId : cartDataObj.productId,
                        vmiProvideId : cartDataObj.vmiProvideId,
                        quantity : cartDataObj.quantity
                    };
                } else {
                    userShopcartData[cartDataObj.productId].quantity += cartDataObj.quantity;
                }
                userShopcartData[cartDataObj.productId].vmiProvideId = cartDataObj.vmiProvideId;
                shopcartUtil.setUserShopcartData(userShopcartData);
                if (typeof cartDataObj.shopcartCallback == 'function') {
                    cartDataObj.shopcartCallback(cartDataObj.callbackArgObj);
                }
            }
        });
    },
    /**
     * 编辑登录用户指定产品的购物车数据
     *
     * @param cartDataObj
     *            购物车数据对象<br>
     *            productId:产品ID<br>
     *            quantity:产品数量<br>
     *            shopcartCallback:成功调用后的回调方法<br>
     *            callbackArgObj:回调方法的参数对象<br>
     */
    editCart : function(cartDataObj) {
        Utils.refreshCartCount(0);
        var userShopcartData = shopcartUtil.getUserShopcartData();
        if (!userShopcartData) {
            alert("系统错误，获取不到本地登录用户的购物车信息");
            return;
        }
        var httpClient = new HttpClient();
        httpClient.post({
            url : Constants.url.UPDATE_SHOP_CART_040,
            params : {
                productId : cartDataObj.productId,
                quantity : cartDataObj.quantity
            },
            timeoutForwardCallback : shopcartUtil.editCart,
            timeoutForwardArgObj : cartDataObj,
            intfSuccessCallBack : function(dataObj, msg) {
                userShopcartData[cartDataObj.productId].quantity = cartDataObj.quantity;
                shopcartUtil.setUserShopcartData(userShopcartData);
                if (typeof cartDataObj.shopcartCallback == 'function') {
                    cartDataObj.shopcartCallback(cartDataObj.callbackArgObj);
                }
            }
        });
    },
    /**
     * 删除登录用户的指定产品的购物车数据
     *
     * @param cartDataObj
     *            购物车数据对象<br>
     *            productId:产品ID<br>
     *            shopcartCallback:成功调用后的回调方法<br>
     *            callbackArgObj:回调方法的参数对象<br>
     */
    removeCart : function(cartDataObj) {
        Utils.refreshCartCount(0);
        var userShopcartData = shopcartUtil.getUserShopcartData();
        if (!userShopcartData) {
            alert("系统错误，获取不到本地登录用户的购物车信息");
            return;
        }
        var httpClient = new HttpClient();
        httpClient.post({
            url : Constants.url.REMOVE_SHOP_CART_041,
            params : {
                productId : cartDataObj.productId
            },
            timeoutForwardCallback : shopcartUtil.removeCart,
            timeoutForwardArgObj : cartDataObj,
            intfSuccessCallBack : function(dataObj, msg) {
                userShopcartData[cartDataObj.productId] = null;
                shopcartUtil.setUserShopcartData(userShopcartData);
                // 重新初始化购物车首页数据
                if (typeof cartDataObj.shopcartCallback == 'function') {
                    cartDataObj.shopcartCallback(cartDataObj.callbackArgObj);
                }
            }
        });
    },
    /**
     * 重填登录用户的购物车数据
     *
     * @param cartDataObj
     *            购物车数据对象<br>
     *            shopcartCallback:成功调用后的回调方法<br>
     *            callbackArgObj:回调方法的参数对象<br>
     */
    refillCart : function(cartDataObj) {
        if (!Utils.isLogin()) {
            // 用户没有登录，不做任何处理则返回。
            return;
        }
        Utils.refreshCartCount(0);
        var userShopcartData = shopcartUtil.getUserShopcartData();
        var userCartJsonData = new Array();
        if (userShopcartData) {
            var index = 0;
            for (var productId in userShopcartData) {
                if (userShopcartData[productId] != null) {
                    userCartJsonData[index] = userShopcartData[productId];
                    index++;
                }
            }
        }
        var userCartJsonDataString = JSON.stringify(userCartJsonData);
        console.log("refillCart() userCartJsonDataString:" + userCartJsonDataString);
        var httpClient = new HttpClient();
        httpClient.post({
            url : Constants.url.REFILL_SHOP_CART_046,
            params : {
                editCartJsonString : userCartJsonDataString
            },
            timeoutForwardCallback : shopcartUtil.refillCart,
            timeoutForwardArgObj : cartDataObj,
            showIntfSuccessMsg : false,
            intfSuccessCallBack : function(dataObj, msg) {
                if (userShopcartData) {
                    shopcartUtil.setUserShopcartData(userShopcartData);
                }
                // 调用重填购物车成功后的回调方法
                if (typeof cartDataObj.shopcartCallback == 'function') {
                    cartDataObj.shopcartCallback(cartDataObj.callbackArgObj);
                }
            },
            intfFailureCallBack : function(dataObj, msg, failureCode) {
                Utils.setUserInfo(null);
            },
            httpFailureCallBack : function() {
                Utils.setUserInfo(null);
            }
        });
    },
    /**
     * 清空登陆用户的购物车数据
     */
    clearCart : function() {
        shopcartUtil.setUserShopcartData(null);
    },
    /**
     * 获取登陆用户的购物车数据对象
     *
     * @returns {*} 有购物车数据则返回购物车数据，否则返回false
     */
    getUserShopcartData : function() {
        var userInfo = Utils.getUserInfo();
        if (!userInfo) {
            return false;
        }
        var shopcartDataStr = localStorage.getItem(Constants.argName.local.shopcartInfo);
        console.log('shopcartInfo:' + shopcartDataStr);
        if (shopcartDataStr == null || shopcartDataStr == '') {
            return false;
        } else {
            var shopcartData = $.parseJSON(shopcartDataStr);
            var userShopcartData = shopcartData[userInfo.userId];
            console.log('userId:' + userInfo.userId + ', userShopcartData:' + JSON.stringify(userShopcartData));
            var quantity = 0;
            for (var productId in userShopcartData) {
                if (userShopcartData[productId] != null) {
                    quantity += userShopcartData[productId].quantity;
                }
            }
            if (userShopcartData != null && userShopcartData.length != 0 && quantity > 0) {
                return userShopcartData;
            } else {
                return false;
            }
        }
    },
    /**
     * 设置登录用户的购物车数据
     *
     * @param dataObj
     *            购物车数据<br>
     *            格式： dataObj = { 产品ID : { productId : 产品ID, vmiProvideId : 产品的供应商ID, quantity : 产品数量 } }
     * @returns {number} 用户购物车产品数量
     */
    setUserShopcartData : function(dataObj) {
        var userInfo = Utils.getUserInfo();
        if (!userInfo) {
            Utils.refreshCartCount(0);
            return 0;
        }

        console.log('userId:' + userInfo.userId + ', userShopcartData:' + JSON.stringify(dataObj));
        var shopcartData = {};
        var shopcartDataStr = localStorage.getItem(Constants.argName.local.shopcartInfo);
        console.log('shopcartInfo:' + shopcartDataStr);
        if (shopcartDataStr != null && shopcartDataStr != '') {
            shopcartData = $.parseJSON(shopcartDataStr);
        }

        var quantity = 0;
        if (dataObj != null) {
            for (var productId in dataObj) {
                if (dataObj[productId] != null) {
                    quantity += dataObj[productId].quantity;
                }
            }
            if (quantity == 0) {
                dataObj = null;
            }
        }
        shopcartData[userInfo.userId] = dataObj;
        localStorage.removeItem(Constants.argName.local.shopcartInfo);
        localStorage.setItem(Constants.argName.local.shopcartInfo, JSON.stringify(shopcartData));
        Utils.refreshCartCount(quantity);
        return quantity;
    }

};
