package com.simpleapp.component.chart;

/**
 * Created by Neko on 2018/1/29.
 */

/**
 * Created by Neko on 16/9/19.
 */
public class ChartDrawerConstants {
    public static int CHART_BORDER_COLOR = 0xff497bce;
    public static int CHART_LINE_COLOR = 0Xff759de2;
    public static int CHART_LINE_COLOR2 = 0Xff1d4fa2;
    public static int CHART_TEXT_COLOR = 0Xff70a5ff;
    public static int CHART_DATA_SET_COLOR = 0xffffffff;
    public static int CHART_DATA_SET_COLOR2 = 0xff0066cc;//个人收益曲线颜色

    public static int FIVE_MINUTE_POINT_NUMBER = 300;//60s*5
    public static int TEN_MINUTE_POINT_NUMBER = 600;//60s*10
    public static int FIFTEEN_MINUTE_POINT_NUMBER = 900;//60s*15
    public static int ONE_HOUR_POINT_NUMBER = 3600;//60s*10
    public static float LINE_WIDTH = 0.5f; //竖线 分割 ｜分时｜10分钟｜2小时｜5日｜1月｜
    public static float LINE_WIDTH_PRICE = 1.5f; //行情走势曲线线粗

    public static int CANDEL_NEUTRAL = 0xff30c296;//平绿
    public static int CANDEL_DECREASE = 0xff30c296;//跌绿
    public static int CANDEL_INCREASE = 0xffe34b4f;//涨红
    public static String snk = "_M7h4R0!";


    public static int GetMinutePointerNumber(int minute){
        return minute * 60;
    }

    public enum CHART_TYPE {
        todayK("todayK"),
        oneM("1m"),
        fiveM("5m"),
        tenM("10m"),
        fifteenM("15m"),
        twoH("2h"),
        day("day"),

        today("today"),
        hour("60m"),
        week("week"),
        month("month"),
        threeMonth("3month"),
        sixMonth("6month"),

        towWeekYield("2WeekYield"),//2周收益曲线
        allYield("allYield");//全部收益曲线

        private String name;

        public String getName(){
            return name;
        }

        CHART_TYPE(String name) {
            this.name = name;
        }
    }
}
