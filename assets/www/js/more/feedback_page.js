var moreFeedbackPage = {
    initialize : function(tabIndex) {
        Utils.bindFooterTabEvent("more_feedback_page", tabIndex);

        if (!Utils.isLogin()) {
            Utils.changeToUserLogin(moreFeedbackPage.initData);
        } else {
            moreFeedbackPage.initData();
        }

        $("#more_feedback_create").off("click").on("click", function() {
            // 判断输入数据是否正确
            var more_feedback_type = $("#more_feedback_type").val();
            if (more_feedback_type == '') {
                Utils.drawToast("请选择反馈类型");
                $("#more_feedback_type").focus();
                return;
            }
            var more_feedback_content = $.trim($("#more_feedback_content").val());
            if (more_feedback_content == '') {
                Utils.drawToast("请输入反馈内容");
                $("#more_feedback_content").focus();
                return;
            }

            var httpClient = new HttpClient();
            httpClient.post({
                url : Constants.url.ADD_FREEBACK_027,
                params : {
                    "feedback.type" : more_feedback_type,
                    "feedback.content" : more_feedback_content
                },
                intfSuccessCallBack : function(dataObj, msg) {
                    // 执行回调方法
                    Utils.changeToMoreIndex();
                }
            });
        });
    },

    initData : function() {
        console.log("moreFeedbackPage");
    }
};
