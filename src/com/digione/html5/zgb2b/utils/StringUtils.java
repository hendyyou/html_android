package com.digione.html5.zgb2b.utils;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import android.util.Log;

import com.digione.html5.zgb2b.common.Constants;

/**
 * 字符串操作工具包
 */
public class StringUtils {
	// 过滤HTML标签
	public static final java.util.regex.Pattern HTMLP_PATTERN = Pattern.compile("(<[^>]+>)+", Pattern.CASE_INSENSITIVE);
	// 过滤&***;特殊符号
	public static final java.util.regex.Pattern SPECIAL_PATTERN = Pattern.compile("(&[^;]+;)+", Pattern.CASE_INSENSITIVE);

	public static final String DOT_STRING = "、";
	public static final String BLANK = " ";

	/**
	 * 每三位用逗号隔开的数字转换器
	 */
	private static final DecimalFormat NUMBER_DECIMAL_FORMAT = new DecimalFormat("#,##0.00");;

	/**
	 * 每三位用逗号隔开的金额转换器
	 */
	private static final DecimalFormat MONEY_DECIMAL_FORMAT = new DecimalFormat("¥#,##0.00");

	/**
	 * 将字符串转位日期类型
	 * 
	 * @param sdate
	 * @return
	 */
	public static Date toDate(String sdate) {
		SimpleDateFormat dateFormater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
		try {
			return dateFormater.parse(sdate);
		} catch (ParseException e) {
			return null;
		}
	}

	/**
	 * 判断给定字符串是否空白串。 空白串是指由空格、制表符、回车符、换行符组成的字符串 若输入字符串为null或空字符串，返回true
	 * 
	 * @param input
	 * @return boolean
	 */
	public static boolean isEmpty(String input) {
		if (input == null || "".equals(input))
			return true;

		for (int i = 0; i < input.length(); i++) {
			char c = input.charAt(i);
			if (c != ' ' && c != '\t' && c != '\r' && c != '\n') {
				return false;
			}
		}
		return true;
	}

	/**
	 * 验证号码 手机号 固话均可
	 * */
	public static boolean isPhoneNumberValid(String phoneNumber) {
		boolean isValid = false;
		String expression = "((^(13|14|15|18)[0-9]{9}$)|(^0[1,2]{1}\\d{1}-?\\d{8}$)|(^0[3-9] {1}\\d{2}-?\\d{7,8}$)"
				+ "|(^0[1,2]{1}\\d{1}-?\\d{8}-(\\d{1,4})$)|(^0[3-9]{1}\\d{2}-? \\d{7,8}-(\\d{1,4})$))";
		CharSequence inputStr = phoneNumber;
		Pattern pattern = Pattern.compile(expression);
		Matcher matcher = pattern.matcher(inputStr);

		if (matcher.matches()) {
			isValid = true;
		}

		return isValid;
	}

	// 判断字符串是否为手机号码
	public static boolean isMobileNO(String mobiles) {
		Pattern p = Pattern.compile("^((13[0-9])|(14[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$");
		Matcher m = p.matcher(mobiles);
		Log.i(Constants.TAG, "mobiles=" + mobiles + ",matches=" + m.matches());
		return m.matches();
	}

	/**
	 * 判断是不是一个合法的电子邮件地址
	 * 
	 * @param email
	 * @return
	 */
	public static boolean isEmail(String email) {
		String str = "^([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\\.][A-Za-z]{2,3}([\\.][A-Za-z]{2})?$";
		Pattern p = Pattern.compile(str);
		Matcher m = p.matcher(email);
		return m.matches();
	}

	/**
	 * 字符串转整数
	 * 
	 * @param str
	 * @param defValue
	 * @return
	 */
	public static int toInt(String str, int defValue) {
		try {
			return Integer.parseInt(str);
		} catch (Exception e) {
		}
		return defValue;
	}

	/**
	 * 对象转整数
	 * 
	 * @param obj
	 * @return 转换异常返回 0
	 */
	public static int toInt(Object obj) {
		if (obj == null)
			return 0;
		return toInt(obj.toString(), 0);
	}

	/**
	 * 对象转整数
	 * 
	 * @param obj
	 * @return 转换异常返回 0
	 */
	public static long toLong(String obj) {
		try {
			return Long.parseLong(obj);
		} catch (Exception e) {
		}
		return 0;
	}

	/**
	 * 字符串转布尔值
	 * 
	 * @param b
	 * @return 转换异常返回 false
	 */
	public static boolean toBool(String b) {
		try {
			return Boolean.parseBoolean(b);
		} catch (Exception e) {
		}
		return false;
	}

	/**
	 * 转化数字，每三位用逗号隔开，最后保留两位小数点(重载支持String，double，int三种类型)
	 * 
	 * @param num
	 *            数字
	 * @return 每三位用逗号隔开数字字符串
	 */
	public static String formatNumber(Double num) {
		if (num == null) {
			return "";
		}
		return NUMBER_DECIMAL_FORMAT.format(num);
	}

	/**
	 * 转化数字，每三位用逗号隔开，最后保留两位小数点(重载支持String，double，int三种类型)
	 * 
	 * @param num
	 *            数字
	 * @return 每三位用逗号隔开数字字符串
	 */
	public static String formatNumber(int num) {
		return NUMBER_DECIMAL_FORMAT.format(num);
	}

	/**
	 * 转化数字，每三位用逗号隔开，最后保留两位小数点(重载支持String，double，int三种类型)
	 * 
	 * @param num
	 *            数字
	 * @return 每三位用逗号隔开数字字符串
	 */
	public static String formatNumber(String num) {
		if (num == null || "".equals(num)) {
			return "";
		}
		Double tempNum = null;
		try {
			tempNum = Double.valueOf(num);
		} catch (NumberFormatException e) {
			Log.e(Constants.TAG, e.getMessage());
			e.printStackTrace();
			return "";
		}
		return NUMBER_DECIMAL_FORMAT.format(tempNum);
	}

	/**
	 * 转换数字为带中文¥的两位小数的金额
	 * 
	 * @param amount
	 *            金额
	 * @return 带中文¥的金额
	 */
	public static String formatMoney(Double amount) {
		if (null == amount) {
			return "¥0.00";
		}
		return MONEY_DECIMAL_FORMAT.format(amount);
	}

	/**
	 * 转换数字为带中文¥的两位小数的金额
	 * 
	 * @param amount
	 *            金额
	 * @return 带中文¥的金额
	 */
	public static String formatMoney(int amount) {
		return MONEY_DECIMAL_FORMAT.format(amount);
	}

	/**
	 * 转换数字为带中文¥的两位小数的金额
	 * 
	 * @param amount
	 *            金额
	 * @return 带中文¥的金额
	 */
	public static String formatMoney(long amount) {
		return MONEY_DECIMAL_FORMAT.format(amount);
	}

	/**
	 * 转换数字为带中文¥的两位小数的金额
	 * 
	 * @param amount
	 *            金额
	 * @return 带中文¥的金额
	 */
	public static String formatMoney(String amount) {
		if (null == amount || "".equals(amount)) {
			return "¥0.00";
		}
		String tempAmountString = amount;
		if (amount.indexOf("￥") != -1) {
			tempAmountString = amount.substring(amount.indexOf("￥") + "￥".length());
		}
		if (amount.indexOf("¥") != -1) {
			tempAmountString = amount.substring(amount.indexOf("¥") + "¥".length());
		}
		Double tempAmount = null;
		try {
			tempAmount = Double.valueOf(tempAmountString);
		} catch (NumberFormatException e) {
			Log.e(Constants.TAG, e.getMessage());
			e.printStackTrace();
			return "";
		}
		return MONEY_DECIMAL_FORMAT.format(tempAmount);
	}

	public static final String relpaceHtmlTag(String input) {

		java.util.regex.Matcher m_html = null;
		m_html = HTMLP_PATTERN.matcher(input);
		String htmlStr = m_html.replaceAll(DOT_STRING); // 过滤html标签
		// 去掉&...;类型的符号
		m_html = SPECIAL_PATTERN.matcher(htmlStr);
		htmlStr = m_html.replaceAll(BLANK); // 过滤html标签
		return htmlStr;

	}

}