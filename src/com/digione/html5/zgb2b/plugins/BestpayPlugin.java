package com.digione.html5.zgb2b.plugins;

import android.content.Intent;
import com.chinatelecom.bestpayclientlite.jar.OrderInfo;
import com.chinatelecom.bestpayclientlite.jar.PayAction;
import com.digione.html5.zgb2b.R;
import com.digione.html5.zgb2b.common.Constants;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class BestpayPlugin extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("changeToBestpay")) {
            changeToBestpay(args.getInt(0), args.getJSONObject(1), callbackContext);
        } else {
            return false;
        }

        return true;
    }

    /**
     * 跳转到手机翼支付
     *
     * @param bestpayOrderBean 手机翼支付JSON对象
     * @param callbackContext  回调上下文
     */
    public synchronized void changeToBestpay(final int pageIdFlag, final JSONObject bestpayOrderBean,
                                             final CallbackContext callbackContext) {
        final CordovaInterface cordova = this.cordova;
        Runnable runnable = new Runnable() {
            public void run() {
                try {
                    String partnerid = bestpayOrderBean.getString("partnerid");
                    String partnername = bestpayOrderBean.getString("partnername");
                    String productno = bestpayOrderBean.getString("productno");
                    String partnerorderid = bestpayOrderBean.getString("partnerorderid");
                    String orderid = bestpayOrderBean.getString("orderid");
                    String txnamount = bestpayOrderBean.getString("txnamount");
                    String rating = bestpayOrderBean.getString("rating");
                    String goodsname = bestpayOrderBean.getString("goodsname");
                    String goodscount = bestpayOrderBean.getString("goodscount");
                    String sig = bestpayOrderBean.getString("sig");

                    // 生成翼支付使用的订单支付信息
                    OrderInfo orderinfo = new OrderInfo(partnerid, partnername, partnerid, partnerid, partnerid, "",
                            productno, partnerorderid, orderid, txnamount, rating, goodsname, goodscount, sig);
                    PayAction payAction = new PayAction();
                    Intent intent = payAction.getIntent(orderinfo, R.raw.bestpayclientlite, cordova.getActivity());
                    if (intent != null) {
                        // 启动翼支付界面
                        switch (pageIdFlag) {
                            case Constants.BestpayPageId.ORDER_SUCCESS_PAGE_ID: {
                                break;
                            }
                            case Constants.BestpayPageId.ORDER_LIST_PAGE_ID: {
                                break;
                            }
                            case Constants.BestpayPageId.ORDER_DETAIL_PAGE_ID: {
                                break;
                            }
                            default: {
                                callbackContext.error("传入不支持的发起支付的页面ID：" + pageIdFlag + "！");
                                return;
                            }
                        }
                        cordova.getActivity().startActivityForResult(intent, pageIdFlag);
                    }
                    callbackContext.success();

                } catch (JSONException e) {
                    e.printStackTrace();
                    callbackContext.error("解析手机翼支付JSON对象出错！");
                }
            }
        };
        cordova.getActivity().runOnUiThread(runnable);
    }

}
