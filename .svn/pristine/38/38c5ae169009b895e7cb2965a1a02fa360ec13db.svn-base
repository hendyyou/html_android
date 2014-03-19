var loginPageApp = {
    _loginName : Utils.getUrlParam("loginName"),

    _password : Utils.getUrlParam("password"),

    _forwardCallback : function(argObj) {
    },

    _forwardArgObj : {},

    initialize : function(forwardCallback, forwardArgObj) {
        $("#global_loginName").val(loginPageApp._loginName ? loginPageApp._loginName : "18038190880");
        $("#global_password").val(loginPageApp._password ? loginPageApp._password : "123456");
        $("#global_loginBtn").off("click").on("click", loginPageApp.loginBtnClick);
        loginPageApp._forwardCallback = forwardCallback;
        loginPageApp._forwardArgObj = forwardArgObj;
    },

    _loginSucceeCallBack : function(argObj) {
        // 返回上一个页面
        navigator.app.backHistory();
        // 执行回调方法
        if (typeof loginPageApp._forwardCallback == 'function') {
            var intervalCounter = setInterval(function() {
                loginPageApp._forwardCallback(argObj);
                clearInterval(intervalCounter);
            }, 500);
        }
    },

    loginBtnClick : function() {
        // 判断输入数据是否正确
        var global_loginName = $.trim($("#global_loginName").val());
        if (global_loginName == '') {
            Utils.drawToast("请输入登陆名");
            $("#global_loginName").focus();
            return;
        }
        var global_password = $.trim($("#global_password").val());
        if (global_password == '') {
            Utils.drawToast("请输入密码");
            $("#global_password").focus();
            return;
        }

        var httpClient = new HttpClient();
        httpClient.post({
            url : Constants.url.LOGIN_001,
            params : {
                loginName : global_loginName,
                password : global_password
            },
            isCheckTimeout : false,
            intfSuccessCallBack : function(dataObj, msg) {
                // 设置本地用户数据
                Utils.setUserInfo(dataObj);
                // 重填用户的购物车数据
                shopcartUtil.refillCart({
                    shopcartCallback : loginPageApp._loginSucceeCallBack,
                    callbackArgObj : loginPageApp._forwardArgObj
                });
            },
            showIntfFailureMsg : false,
            intfFailureCallBack : function(dataObj, msg, failureCode) {
                if (failureCode == "07") {
                    // 用户已经登录，无需再次登录
                    // 设置本地用户数据
                    Utils.setUserInfo(dataObj);
                    // 重填用户的购物车数据
                    shopcartUtil.refillCart({
                        shopcartCallback : loginPageApp._loginSucceeCallBack,
                        callbackArgObj : loginPageApp._forwardArgObj
                    });
                } else {
                    Utils.drawToast(msg);
                }
            }
        });
    }

};
