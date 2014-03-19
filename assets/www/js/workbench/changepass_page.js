var workbenchChangepassPage = {
    initialize : function(tabIndex) {
        Utils.bindFooterTabEvent("workbench_changepass_page", tabIndex);

        workbenchChangepassPage.initData();

        $("#workbench_changepass_commit").off("click").on("click", function() {
            // 判断输入数据是否正确
            var workbench_changepass_old_password = $.trim($("#workbench_changepass_old_password").val());
            if (workbench_changepass_old_password == '') {
                Utils.drawToast("请输入原密码");
                $("#workbench_changepass_old_password").focus();
                return;
            }
            var workbench_changepass_new_password = $.trim($("#workbench_changepass_new_password").val());
            if (workbench_changepass_new_password == '') {
                Utils.drawToast("请输入新密码");
                $("#workbench_changepass_new_password").focus();
                return;
            }
            var workbench_changepass_confirm_password = $.trim($("#workbench_changepass_confirm_password").val());
            if (workbench_changepass_confirm_password == '') {
                Utils.drawToast("请输入确认密码");
                $("#workbench_changepass_confirm_password").focus();
                return;
            }
            if (workbench_changepass_old_password == workbench_changepass_new_password) {
                Utils.drawToast("请输入新密码不能与原密码相同");
                $("#workbench_changepass_new_password").focus();
                return;
            }
            if (workbench_changepass_new_password != workbench_changepass_confirm_password) {
                Utils.drawToast("请输入新密码与确认密码不一致");
                $("#workbench_changepass_new_password").focus();
                return;
            }

            var httpClient = new HttpClient();
            httpClient.post({
                url : Constants.url.PASSWORD_UP_004,
                params : {
                    oldPassword : workbench_changepass_old_password,
                    newPassword : workbench_changepass_new_password
                },
                intfSuccessCallBack : function(dataObj, msg) {
                    // 切换到我的直供首页
                    Utils.changeToWorkbenchIndex();
                }
            });

        });
    },

    initData : function() {
        console.log("workbenchChangepassPage");
        $('#workbench_changepass_old_password').val('').trigger('refresh');
        $('#workbench_changepass_new_password').val('').trigger('refresh');
        $('#workbench_changepass_confirm_password').val('').trigger('refresh');
    }
};
