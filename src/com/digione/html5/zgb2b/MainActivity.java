package com.digione.html5.zgb2b;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import com.digione.html5.zgb2b.common.Constants;
import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;

public class MainActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();
        super.appView.clearCache(true);
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        // super.loadUrl("file:///android_asset/www/index.html")
    }


    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case Constants.MsgCode.MOBILE_BESTPAY_ORDERLIST_RETURN: {
                    // 调用JS，处理返回
                    if (null != MainActivity.this.appView) {
                        Bundle argDataBundle = msg.getData();
                        int requestCode = argDataBundle.getInt("requestCode");
                        int resultCode = argDataBundle.getInt("resultCode");
                        String jsString = "bestpayUtil.bestpayReturn(" + requestCode + "," + resultCode + ")";
                        MainActivity.this.appView.sendJavascript(jsString);
                    }
                    break;
                }
                default:
                    break;
            }
        }
    };

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        switch (requestCode) {
            case Constants.BestpayPageId.ORDER_SUCCESS_PAGE_ID:
            case Constants.BestpayPageId.ORDER_LIST_PAGE_ID:
            case Constants.BestpayPageId.ORDER_DETAIL_PAGE_ID: {
                Message message = new Message();
                Bundle argDataBundle = new Bundle();
                argDataBundle.putInt("requestCode", requestCode);
                argDataBundle.putInt("resultCode", resultCode);
                message.what = Constants.MsgCode.MOBILE_BESTPAY_ORDERLIST_RETURN;
                message.setData(argDataBundle);
                mHandler.sendMessage(message);
                break;
            }
        }
    }
}
