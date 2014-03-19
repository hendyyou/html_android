package com.digione.html5.zgb2b.plugins;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.DialogInterface.OnCancelListener;
import android.util.Log;

public class LoadingDialog extends CordovaPlugin {

	private ProgressDialog loadingDialog = null;
	private int dialogCount = 0; // 动画对话框的个数

	public LoadingDialog() {

	}

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if (action.equals("loadingStart")) {
			this.loadingStart(args.getString(0), args.getString(1));
		} else if (action.equals("loadingStop")) {
			this.loadingStop(args.getBoolean(0));
		} else {
			return false;
		}

		// Only alert and confirm are async.
		callbackContext.success();
		return true;
	}

	/**
	 * Show the spinner.
	 * 
	 * @param title
	 *            Title of the dialog
	 * @param message
	 *            The message of the dialog
	 */
	public synchronized void loadingStart(final String title, final String message) {
		final CordovaInterface cordova = this.cordova;
		Runnable runnable = new Runnable() {
			public void run() {
				if (LoadingDialog.this.loadingDialog == null || !LoadingDialog.this.loadingDialog.isShowing()) {
					LoadingDialog.this.loadingDialog = ProgressDialog.show(cordova.getActivity(), title, message, true,
							false, new OnCancelListener() {
								@Override
								public void onCancel(DialogInterface dialog) {
									LoadingDialog.this.dialogCount--;
									Log.d("LoadingDialog", "onCancel dialogCount:" + LoadingDialog.this.dialogCount);
								}
							});
					LoadingDialog.this.loadingDialog.setCancelable(true);
					LoadingDialog.this.loadingDialog.setCanceledOnTouchOutside(false);
				}
				LoadingDialog.this.dialogCount++;
				Log.d("LoadingDialog", "loadingStart dialogCount:" + LoadingDialog.this.dialogCount);
			}
		};
        cordova.getActivity().runOnUiThread(runnable);
	}

	/**
	 * Stop spinner.
	 */
	public synchronized void loadingStop(final boolean closeAll) {
		if (closeAll) {
			this.dialogCount = 0;
		} else {
			this.dialogCount--;
		}
		Log.d("LoadingDialog", "loadingStop dialogCount:" + this.dialogCount);
		if (this.dialogCount <= 0 && this.loadingDialog != null) {
			this.loadingDialog.dismiss();
			this.loadingDialog = null;
			this.dialogCount = 0;
		}
	}
}
