package com.digione.gdmobile.android.common;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.ComponentName;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.util.Xml;
import com.digione.gdmobile.android.R;
import com.digione.gdmobile.android.bean.UpdateInfoBean;
import com.digione.gdmobile.android.utils.HttpUtil;
import com.digione.gdmobile.android.utils.SystemUtil;
import com.digione.gdmobile.android.utils.ToastUtil;
import org.xmlpull.v1.XmlPullParser;

import java.io.File;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created with IntelliJ IDEA.
 * User: youzh
 * Date: 13-12-13
 * Time: 上午10:35
 */
public final class CheckAppUpdate implements DownLoadTask.DownlaodListener {

    //   private static final String TAG = "SplashActivity";
    private Activity context;

    private AlertDialog alertDialog;
    // 从服务器获取的版本信息
    private UpdateInfoBean mUpdateInfoBean;
    // apk 文件
    private File file;
    // 下载任务
    private DownLoadTask downLoadTask;
    //private RelativeLayout ll_splash;
    // 版本号
    private double clientVersion;
    // 进度条
    private ProgressDialog mProgressDialog;

    private    boolean  hasAppUpdate = false;
    //加载进度
   // private ProgressDialog mLoadProgressDialog;

    /**
     * 进度条当前的值
     */
    private int progressVaue;
    /**
     * 是否设置进度条最大值
     */
    private boolean flag = true;
    private boolean isStop = false;

    public static CheckAppUpdate install = null;
    private  static  Object object = new Object();

    private CheckAppUpdate(Activity context) {
        while (context.getParent() != null) {
            context = context.getParent();
        }
           this.context = context;
    }

    public static CheckAppUpdate getInstall(Activity context) {
        synchronized (object) {
            if (install == null) {
                install = new CheckAppUpdate(context);
            }
            return install;
        }
    }

    private Handler mHandler = new Handler() {
        public void handleMessage(android.os.Message msg) {
            switch (msg.what) {
                case Constants.MsgCode.APK_DOWN_ERROR:
                    mProgressDialog.dismiss();
                    ToastUtil.showToast(context, R.string.down_error, ToastUtil.LENGTH_SHORT);
                    // gotoHome();
                    stop();
                    break;
                case Constants.MsgCode.SHOW_UPDATE_DIALOG:
                    LogCustom.d("更新版本提示");
                    String title = context.getString(R.string.update_hint);
                    String hintMsg = context.getString(R.string.update_hint_msg);
                    if (mUpdateInfoBean != null) {
                        hintMsg = mUpdateInfoBean.getDesc();
                    }
                    AlertDialog.Builder builder = new AlertDialog.Builder(context)
                            .setTitle(title).setMessage(hintMsg)
                            .setCancelable(false)
                             .setPositiveButton(context.getString(R.string.yes), new DialogInterface.OnClickListener() {
                                 @Override
                                 public void onClick(DialogInterface dialog, int which) {
                                     LogCustom.d("开始下载更新apk");
                                     downApk();
                                 }
                             });

                    if (mUpdateInfoBean.isForce()) {// 要求强制更新
                        builder.setNegativeButton(context.getString(R.string.no_update_quit), new DialogInterface.OnClickListener() {
                          @Override
                          public void onClick(DialogInterface dialog, int which) {
                              LogCustom.d("要求强制更新");
                              android.os.Process.killProcess(android.os.Process.myPid());
                              System.exit(0);
                          }
                      });

                    } else {
                        builder.setNegativeButton(context.getString(R.string.no), new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                LogCustom.d("不更新,stop");
                                //gotoHome();
                                stop();
                            }
                        });
                    }
                    if (!isStop) {
                        builder.show();
                    }
                    break;
                case Constants.MsgCode.SHOW_NO_NETWORK:
                    AlertDialog.Builder build = new AlertDialog.Builder(context);
                    build.setMessage(context.getString(R.string.no_network_hint));
                    build.setPositiveButton(context.getString(R.string.setting_network), new DialogInterface.OnClickListener() {

                            @Override
                            public void onClick(DialogInterface mDialogInterface, int which) {
                                Intent intent = null;
                                // 判断手机系统的版本 即API大于10 就是3.0或以上版本
                                if (android.os.Build.VERSION.SDK_INT > 10) {
                                    intent = new Intent( android.provider.Settings.ACTION_WIRELESS_SETTINGS);
                                } else {
                                    intent = new Intent();
                                    ComponentName component = new ComponentName("com.android.settings",
                                                                                "com.android.settings" +".WirelessSettings");
                                    intent.setComponent(component);
                                    intent.setAction("android.intent.action.VIEW");
                                }
                                context.startActivity(intent);
                                android.os.Process.killProcess(android.os.Process.myPid());
                                System.exit(0);
                            }
                        });
                    build.setNegativeButton(context.getString(R.string.cancel), new DialogInterface.OnClickListener() {

                        @Override
                        public void onClick(DialogInterface mDialogInterface, int which) {
                            if (alertDialog != null) {
                                alertDialog.dismiss();
                                android.os.Process.killProcess(android.os.Process.myPid());
                                System.exit(0);
                            }
                        }
                    });
                    alertDialog = build.create();
                    alertDialog.show();
                default:
                    break;
            }
        } ;
    };

    // 取消下载
    private DialogInterface.OnCancelListener proDialogCancelListener = new DialogInterface.OnCancelListener() {

        @Override
        public void onCancel(DialogInterface dialog) {
            downLoadTask.cancel();
            LogCustom.e(" 取消下载");
            stop();
        }
    };

    @Override
    public void update(int total, int len, int threadid) {
        if (flag) {
            mProgressDialog.setMax(total);
            flag = false;
        }
        progressVaue += len;
        mProgressDialog.setProgress(progressVaue);
    }

    /**
     * 安装Apk
     */
    private void installApk() {
        if (file.exists()) {
            LogCustom.d(file.getName() + " path=" + file.getPath());
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
            context.startActivity(intent);
            context.overridePendingTransition(R.anim.zoomin, R.anim.zoomout);
            context.finish();
            android.os.Process.killProcess(android.os.Process.myPid());
        }
    }

    @Override
    public void downLoadFinish(int totalSucess) {
        mProgressDialog.dismiss();
        if (totalSucess == Constants.THREADCOUNT) {
            installApk();
        } else {
            Message.obtain(mHandler, Constants.MsgCode.APK_DOWN_ERROR).sendToTarget();
        }
    }

    @Override
    public void downLoadError(int type) {
        // Message.obtain(handler, DOWN_ERROR).sendToTarget();
    }

    /**
     * 初始化进度条
     */
    private void initProgressDialog() {
        mProgressDialog = new ProgressDialog(context);// 进度条初始化

        if (mUpdateInfoBean != null) {
            mProgressDialog.setCancelable(mUpdateInfoBean.isForce());
        }

        mProgressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        mProgressDialog.setMessage(context.getString(R.string.downning));
        mProgressDialog.show();
        mProgressDialog.setOnCancelListener(proDialogCancelListener);
    }

    /**
     * 从服务器下载新的Apk
     */
    private void downApk() {
        initProgressDialog();
        //mLoadProgressDialog.dismiss();
        // mProgressBar.setVisibility(View.GONE);
        if (SystemUtil.getSdcardStauts()) {

            String url = mUpdateInfoBean.getUrl();
            if (url != null && !url.equals("")) {
                LogCustom.d("url=" + url);
                String filename = url.substring(url.lastIndexOf("/") + 1);
                String path = Environment.getExternalStorageDirectory() + "/Download";

                // 判断目录是否存在，不存在就创建
                File pathFile = new File(path);
                if (!pathFile.exists()) {
                    pathFile.mkdir();
                }

                file = new File(path, filename);
                // 下载
                downLoadTask = new DownLoadTask(mUpdateInfoBean.getUrl(), file.getAbsolutePath(), Constants.THREADCOUNT);
                // 下载监听
                downLoadTask.setListener(this);
                // 线程池管理
                ThreadPoolManager.getInstance().addTask(downLoadTask);
            }

        } else {
            ToastUtil.showToast(context, context.getString(R.string.sdcard_not_exit), ToastUtil.LENGTH_SHORT);
            mProgressDialog.dismiss();
            // gotoHome();
            stop();
        }
    }


    public boolean hasUpdate() {
        // while (true) {

        new  Thread(){
            @Override
            public void run() {
                super.run();
                try {
                    clientVersion = getClientVersion();
                    if (HttpUtil.isHasNetwork(context)) {
                        String path = context.getResources().getString(R.string.update_config_url);
                        URL url = new URL(path);
                        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                        conn.setConnectTimeout(5000);
                        InputStream is = conn.getInputStream();
                        mUpdateInfoBean = getUpdateInfo(is);

                        if (mUpdateInfoBean != null && mUpdateInfoBean.getVersion() > 0) {
                            double v = mUpdateInfoBean.getVersion();
                            LogCustom.d("服务器版本 ：" + v+",app版本："+clientVersion);
                            if (clientVersion >= v) {
                                // gotoHome();
                                //  stop();
                                hasAppUpdate = false;
                            } else {
                                // Message.obtain(mHandler, Constants.MsgCode.SHOW_UPDATE_DIALOG).sendToTarget();
                                //   break;
                                hasAppUpdate = true;
                            }
                        }
                    } else {
                        // gotoHome();
                        //stop();
                        hasAppUpdate = false;
                        mHandler.sendEmptyMessage(Constants.MsgCode.SHOW_NO_NETWORK);
                        LogCustom.d("网络有问题，请检查网络");
                        //  break;
                    }
                } catch (Exception e) {
                    LogCustom.e("网络检查出现异常", e);
                    //gotoHome();
                    hasAppUpdate = false;
                }
          /*  if (!isStop) {
                break;
            }*/
                // }
            }
        }.start();
        return  hasAppUpdate;
    }

    /**
     * 获取当前应用的版本号
     *
     * @return
     * @throws android.content.pm.PackageManager.NameNotFoundException
     *
     */
    private double getClientVersion() throws PackageManager.NameNotFoundException {
        PackageManager packageManager = context.getPackageManager();
        PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
        return Double.valueOf(packageInfo.versionName);
    }

    /**
     * 解析升级xml文件
     *
     * @param is
     * @return UpdateInfoBean
     * @throws Exception
     */
    private UpdateInfoBean getUpdateInfo(InputStream is) throws Exception {
        UpdateInfoBean updateInfo = new UpdateInfoBean();
        XmlPullParser parser = Xml.newPullParser();
        parser.setInput(is, "UTF-8");
        int type = parser.getEventType();
        while (type != XmlPullParser.END_DOCUMENT) {
            switch (type) {
                case XmlPullParser.START_TAG:
                    if ("version".equals(parser.getName())) {
                        String version = parser.nextText().trim();
                        updateInfo.setVersion(version);
                    } else if ("url".equals(parser.getName())) {
                        String url = parser.nextText().trim();
                        updateInfo.setUrl(url);
                    } else if ("force".equals(parser.getName())) {
                        boolean force = Boolean.valueOf(parser.nextText().trim());
                        updateInfo.setForce(force);
                    } else if ("desc".equals(parser.getName())) {
                        String desc = parser.nextText().trim();
                        updateInfo.setDesc(desc);
                    }
                    break;
            }
            type = parser.next();
        }
        return updateInfo;
    }

    public  void stop() {
        isStop = true;
        mHandler.removeMessages(Constants.MsgCode.APK_DOWN_ERROR);
        mHandler.removeMessages(Constants.MsgCode.SHOW_UPDATE_DIALOG);
        //mLoadProgressDialog.dismiss();
        if (downLoadTask != null) {
            downLoadTask.cancel();
            downLoadTask = null;
        }
        if (mProgressDialog != null) {
            mProgressDialog.dismiss();
            mProgressDialog = null;
        }
        file = null;
        LogCustom.e("检查更新已完成");
    }

    public void start() {
        isStop = false;
        Message.obtain(mHandler, Constants.MsgCode.SHOW_UPDATE_DIALOG).sendToTarget();
       /* try {
            LogCustom.e("检查更新开始");
            isStop = false;
            // 客户端版本
            clientVersion = getClientVersion();
            //clientVersionTV.setText(clientVersionTV.getText().toString() + clientVersion);
        } catch (PackageManager.NameNotFoundException e) {
            LogCustom.e("获取版本错误", e);
            //	clientVersionTV.setText(1.0 + "");
        }
        ThreadPoolManager.getInstance().addTask(this);*/
        //initLoadProgressDialog();
    }

}
