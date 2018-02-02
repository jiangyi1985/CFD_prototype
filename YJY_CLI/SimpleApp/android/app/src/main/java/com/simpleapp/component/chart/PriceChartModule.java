package com.simpleapp.component.chart;

import android.graphics.Color;
import android.util.Log;
import android.view.MotionEvent;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.github.mikephil.charting.components.Description;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.listener.ChartTouchListener;
import com.github.mikephil.charting.listener.OnChartGestureListener;
import com.simpleapp.component.chart.base.IChartDrawer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Neko on 2018/1/29.
 */

public class PriceChartModule extends SimpleViewManager<PriceChart> {

    private static final String REACT_CLASS = "RCTPriceChart";

    private ChartDrawerConstants.CHART_TYPE mChartType = ChartDrawerConstants.CHART_TYPE.today;

    int textColor = ChartDrawerConstants.CHART_TEXT_COLOR;
    int borderColor = ChartDrawerConstants.CHART_BORDER_COLOR;
    int preCloseColor = ChartDrawerConstants.CHART_BORDER_COLOR;
    int chartOffsetLeft = 0;
    int chartOffsetRight = 0;
    int chartOffsetTop = 0;
    int chartOffsetBottom = 0;


    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected PriceChart createViewInstance(ThemedReactContext reactContext) {
        PriceChart chart = new PriceChart(reactContext);
        chart.setDrawGridBackground(false);
        chart.setDragEnabled(true);
        chart.setScaleEnabled(true);
        chart.setTouchEnabled(true);
        chart.getLegend().setEnabled(false);
        chart.setDoubleTapToZoomEnabled(false);

        chart.setDragDecelerationEnabled(true); //???
        chart.setHighlightPerDragEnabled(true); //???

        chart.setScaleXEnabled(true);
        chart.setScaleMinima(0.5f,1.0f);
        chart.setScaleYEnabled(false);

        chart.setExtraOffsets(chartOffsetLeft,chartOffsetTop,chartOffsetRight,chartOffsetBottom);
        //chart.setViewPortOffsets(0,0,15,15);
        //chart.setExtraRightOffset(0);

        chart.getAxisLeft().removeAllLimitLines();
        chart.getAxisRight().removeAllLimitLines();
        chart.getXAxis().removeAllLimitLines();
        chart.getAxisLeft().setDrawLimitLinesBehindData(false);
        chart.getAxisRight().setDrawLimitLinesBehindData(false);
        chart.getXAxis().setDrawLimitLinesBehindData(false);
        chart.getAxisLeft().setDrawGridLines(false);
        chart.getAxisRight().setDrawGridLines(false);
        chart.getXAxis().setDrawGridLines(false);
        chart.getAxisLeft().setAxisLineColor(borderColor);
        chart.getAxisRight().setAxisLineColor(borderColor);
        chart.getXAxis().setAxisLineColor(borderColor);
        chart.getAxisLeft().setTextColor(textColor);
        chart.getAxisRight().setTextColor(textColor);
        chart.getXAxis().setTextColor(textColor);
        chart.getXAxis().setTextSize(8f);

        chart.setBorderWidth(0.5f);

        chart.getAxisLeft().setSpaceTop(10);
        chart.getAxisLeft().setSpaceBottom(10);
        chart.getAxisRight().setSpaceTop(10);
        chart.getAxisRight().setSpaceBottom(10);
        chart.setDragDecelerationEnabled(false);//设置拖拽后放开,无惯性移动。
        chart.setDragEnabled(false);
        //chart.setExtraLeftOffset(15);
        chart.setOnChartGestureListener(new OnChartGestureListener() {
            @Override
            public void onChartGestureStart(MotionEvent me, ChartTouchListener.ChartGesture lastPerformedGesture) {

            }

            @Override
            public void onChartGestureEnd(MotionEvent me, ChartTouchListener.ChartGesture lastPerformedGesture) {

            }

            @Override
            public void onChartLongPressed(MotionEvent me) {

            }

            @Override
            public void onChartDoubleTapped(MotionEvent me) {

            }

            @Override
            public void onChartSingleTapped(MotionEvent me) {
                Log.d("","Chart onChartSingleTapped!!!");
//                if(!MainActivity.isLandscape()){
//                    LogicData.getInstance().sendChartClickedToRN();
//                }
            }

            @Override
            public void onChartFling(MotionEvent me1, MotionEvent me2, float velocityX, float velocityY) {

            }

            @Override
            public void onChartScale(MotionEvent me, float scaleX, float scaleY) {

            }

            @Override
            public void onChartTranslate(MotionEvent me, float dX, float dY) {

            }
        });

        return chart;
    }

    @ReactProp(name = "data")
    public void setData(PriceChart chart, String stockInfoData) {
        if(mChartType!=null&&(mChartType.equals(ChartDrawerConstants.CHART_TYPE.towWeekYield)||mChartType.equals(ChartDrawerConstants.CHART_TYPE.allYield))){
            Log.d("","stockInfoData = " + stockInfoData);
            try{
//                JSONObject plData = new JSONObject(stockInfoData);
                JSONArray plDataArray = new JSONArray(stockInfoData);
                IChartDrawer drawer = ChartDrawerBuilder.createDrawer(mChartType);
                drawer.setTextColor(textColor);
                drawer.setBorderColor(borderColor);
                drawer.setPreCloseColor(preCloseColor);
                if(drawer != null){
                    drawer.draw(chart, null, plDataArray);
                    return;
                }
            }catch (Exception e){

            }
        }else if (chart != null && stockInfoData != null && stockInfoData.length() > 0) {
            try {
                JSONObject stockInfoObject = new JSONObject(stockInfoData);
                if (!stockInfoObject.has("priceData")) {
                    return;
                }

                JSONArray chartDataList = stockInfoObject.getJSONArray("priceData");

                //TODO: If you want to enable Drawer, undo-comment the following lines.
                Log.d("","setData chartType = " + mChartType);
                IChartDrawer drawer = ChartDrawerBuilder.createDrawer(mChartType);
                drawer.setTextColor(textColor);
                drawer.setBorderColor(borderColor);
                drawer.setPreCloseColor(preCloseColor);

                int maxCount = stockInfoObject.getJSONArray("priceData").length();
                chart.setMaxVisibleValueCount(maxCount/2);
                if(drawer != null){
                    drawer.draw(chart, stockInfoObject, chartDataList);
                    return;
                }

            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    @ReactProp(name = "noDataText")
    public void setNoDataText(PriceChart chart, String text) {
        if (chart != null) {
            chart.setNoDataText(text);
        }
    }

    @ReactProp(name = "noDataTextColor")
    public void setNoDataTextColor(PriceChart chart, String color) {
        if (chart != null && color != null) {
            int colorInt = getColor(color);
            chart.setNoDataTextColor(colorInt);
        }
    }


    @ReactProp(name = "drawBackground")
    public void setDrawBackground(PriceChart chart, boolean enabled) {
        if (chart != null) {
            chart.setDrawGridBackground(enabled);
        }
    }

    @ReactProp(name = "backgroundColor")
    public void setBackgroundColor(PriceChart chart, String backgroundColor) {
        if (chart != null) {
            int colorInt = getColor(backgroundColor);
            chart.setGridBackgroundColor(colorInt);
        }
    }

    @ReactProp(name = "lineChartGradient")
    public void setLineChartGradient(PriceChart chart, ReadableArray input){
        if (chart != null && input.size() > 1) {
            int[] colors = new int[input.size()];
            for (int i=0; i < colors.length; i++) {
                String colorStr = input.getString(i);
                colors[i] = getColor(colorStr);
            }
            chart.setGradientColors(colors);
        }
    }

    @ReactProp(name = "dataSetColor")
    public void setDataSetColor(PriceChart chart, String color){
        if (chart != null){
            int colorInt = getColor(color);
            chart.setDataSetColor(colorInt);
        }
    }

//
//    @ReactProp(name = "colorType")
//    public void setColorType(PriceChart chart, int type) {
//        if (type == 1) {
//            ChartDrawerConstants.CHART_BORDER_COLOR = Color.WHITE;
//            ChartDrawerConstants.CHART_LINE_COLOR = Color.WHITE;
//        }
//    }
//
//    @ReactProp(name = "chartType")
//    public void setChartType(PriceChart chart, String type) {
//        ChartDrawerConstants.CHART_TYPE[] allType = ChartDrawerConstants.CHART_TYPE.values();
//        for (int i = 0; i < allType.length; i++) {
//            if (allType[i].getName().equals(type)) {
//                mChartType = allType[i];
//                break;
//            }
//        }
//    }
//
////    @ReactProp(name = "chartIsActual")
////    public void setChartIsActual(PriceChart chart, boolean chartIsActual){
////        chart.setIsActual(chartIsActual);
////        Log.d("ChartIsActual","chartIsActual = " + chartIsActual);
////    }
//
//

    @ReactProp(name = "description")
    public void setDescription(PriceChart chart, String description) {
        if (chart != null) {
            if(chart.getDescription()!= null){
                chart.getDescription().setText(description);
            }else {
                Description newDescription = new Description();
                newDescription.setText(description);
                chart.setDescription(newDescription);
            }
        }
    }

//    @ReactProp(name = "descriptionColor")
//    public void setDescriptionColor(PriceChart chart, int type) {
//        if (chart != null) {
//            chart.setDescriptionColorLRTB(type);
//        }
//    }

    @ReactProp(name = "padding", defaultFloat = 0.0f)
    public void setPadding(PriceChart chart, float padding) {
        if (chart != null) {
            chart.setMinOffset(padding);
        }
    }

    @ReactProp(name = "xAxisPosition")
    public void setXAxisPosition(PriceChart chart, String position) {
        if (chart != null) {
            chart.getXAxis().setPosition(XAxis.XAxisPosition.valueOf(position));
        }
    }

    @ReactProp(name = "XAxisGridColor")
    public void setXAxisGridColor(PriceChart chart, String color) {
        if (chart != null) {
            int colorInt = getColor(color);
            chart.getXAxis().setGridColor(colorInt);
        }
    }
//
////    @ReactProp(name = "xAxisStep", defaultInt = 1)
////    public void setXAxisStep(PriceChart chart, int step) {
////        if (chart != null) {
////            chart.getXAxis().setLabelsToSkip(step - 1);
////        }
////    }

    @ReactProp(name = "xAxisTextSize", defaultFloat = 10.0f)
    public void setXAxisTextSize(PriceChart chart, float size) {
        if (chart != null) {
            chart.getXAxis().setTextSize(size);
        }
    }

    @ReactProp(name = "xAxisDrawLabel")
    public void setXAxisDrawLabel(PriceChart chart, boolean drawEnabled) {
        if (chart != null) {
            chart.getXAxis().setDrawLabels(drawEnabled);
        }
    }

    @ReactProp(name = "leftAxisEnabled", defaultBoolean = true)
    public void setLeftAxisEnabled(PriceChart chart, boolean enabled) {
        if (chart != null) {
            chart.getAxisLeft().setEnabled(enabled);
            //this.setChartPaddingLeft(chart, chartOffsetLeft);
        }
    }
//
//    @ReactProp(name = "leftAxisMaxValue")
//    public void setLeftAxisMaxValue(PriceChart chart, float value) {
//        if (chart != null) {
//            chart.getAxisLeft().setAxisMaxValue(value);
//        }
//    }
//
//    @ReactProp(name = "leftAxisMinValue")
//    public void setLeftAxisMinValue(PriceChart chart, float value) {
//        if (chart != null) {
//            chart.getAxisLeft().setAxisMinValue(value);
//        }
//    }
//
//    @ReactProp(name = "leftAxisPosition")
//    public void setLeftAxisPosition(PriceChart chart, String position) {
//        if (chart != null) {
//            chart.getAxisLeft().setPosition(YAxis.YAxisLabelPosition.valueOf(position));
//        }
//    }


    @ReactProp(name = "xAxisLabelCount")
    public void setXAxisLabelCount(PriceChart chart, int num) {
        if (chart != null) {
            chart.getXAxis().setLabelCount(num, true);
        }
    }
//
//    @ReactProp(name = "leftAxisLabelCount")
//    public void setLeftAxisLabelCount(PriceChart chart, int num) {
//        if (chart != null) {
//            chart.getAxisLeft().setLabelCount(num, true);
//        }
//    }
//
//    @ReactProp(name = "leftAxisTextSize", defaultFloat = 10.0f)
//    public void setLeftAxisTextSize(PriceChart chart, float size) {
//        if (chart != null) {
//            chart.getAxisLeft().setTextSize(size);
//        }
//    }
////
////    @ReactProp(name = "leftAxisDrawLabel")
////    public void setLeftAxisDrawLabel(PriceChart chart, boolean drawEnabled) {
////        if (chart != null) {
////            chart.getAxisLeft().setDrawLabels(drawEnabled);
////            this.setChartPaddingLeft(chart, chartOffsetLeft);
////        }
////    }
//
//    @ReactProp(name = "leftAxisLimitLines")
//    public void setLeftAxisLimitLines(PriceChart chart, ReadableArray lines) {
//        if (chart != null) {
//            for (int i = 0; i < lines.size(); i++) {
//                LimitLine line = new LimitLine(lines.getInt(i));
//                line.setLineColor(Color.GRAY);
//                line.setLineWidth(0.5f);
//                line.enableDashedLine(10f, 0f, 0f);
//                line.setTextSize(0f);
//
//                chart.getAxisLeft().addLimitLine(line);
//            }
//        }
//    }

    @ReactProp(name = "rightAxisEnabled", defaultBoolean = true)
    public void setRightAxisEnabled(PriceChart chart, boolean enabled) {
        if (chart != null) {
            chart.getAxisRight().setEnabled(enabled);
            //this.setChartPaddingRight(chart, chartOffsetRight);
        }
    }
//
//    @ReactProp(name = "rightAxisMaxValue")
//    public void setRightAxisMaxValue(PriceChart chart, float value) {
//        if (chart != null) {
//            chart.getAxisRight().setAxisMaxValue(value);
//        }
//    }
//
//    @ReactProp(name = "rightAxisMinValue")
//    public void setRightAxisMinValue(PriceChart chart, float value) {
//        if (chart != null) {
//            chart.getAxisRight().setAxisMinValue(value);
//        }
//    }
//
//    @ReactProp(name = "rightAxisPosition")
//    public void setRightAxisPosition(PriceChart chart, String position) {
//        if (chart != null) {
//            chart.getAxisRight().setPosition(YAxis.YAxisLabelPosition.valueOf(position));
//        }
//    }
//
//    @ReactProp(name = "rightAxisLabelCount")
//    public void setRightAxisLabelCount(PriceChart chart, int num) {
//        if (chart != null) {
//            chart.getAxisRight().setLabelCount(num, true);
//        }
//    }
//
//    @ReactProp(name = "rightAxisTextSize", defaultFloat = 10.0f)
//    public void setRightAxisTextSize(PriceChart chart, float size) {
//        if (chart != null) {
//            chart.getAxisRight().setTextSize(size);
//        }
//    }
////
////    @ReactProp(name = "rightAxisDrawLabel")
////    public void setRightAxisDrawLabel(PriceChart chart, boolean drawEnabled) {
////        if (chart != null) {
////            chart.getAxisRight().setDrawLabels(drawEnabled);
////            this.setChartPaddingRight(chart, chartOffsetRight);
////        }
////    }

    @ReactProp(name = "drawBorders")
    public void setDrawBorders(PriceChart chart, boolean drawBorders) {
        if (chart != null) {
            chart.setDrawBorders(drawBorders);
        }
    }
//
//    @ReactProp(name = "rightAxisDrawGridLines")
//    public void setRightAxisDrawGridLines(PriceChart chart, boolean drawGridLines) {
//        if (chart != null) {
//            chart.getAxisRight().setDrawGridLines(drawGridLines);
//            chart.getAxisRight().setDrawAxisLine(drawGridLines);
//        }
//    }
//
    @ReactProp(name = "textColor")
    public void setTextColor(PriceChart chart, String color) {
        if (chart != null) {
            int colorInt = getColor(color);
            chart.getAxisLeft().setTextColor(colorInt);
            chart.getAxisRight().setTextColor(colorInt);
            chart.getXAxis().setTextColor(colorInt);
            textColor = colorInt;
        }
    }

    @ReactProp(name = "borderColor")
    public void setBorderColor(PriceChart chart, String color) {
        if (chart != null) {
            int colorInt = getColor(color);
            chart.setBorderColor(colorInt);
            chart.getAxisLeft().setAxisLineColor(colorInt);
            chart.getAxisLeft().setGridColor(colorInt);
            chart.getAxisRight().setAxisLineColor(colorInt);
            chart.getAxisRight().setGridColor(colorInt);
            chart.getXAxis().setAxisLineColor(colorInt);
            borderColor = colorInt;
        }
    }

////    @ReactProp(name = "preCloseColor")
////    public void setPreCloseColor(PriceChart chart, String color) {
////        if (chart != null) {
////            int colorInt = getColor(color);
////            chart.setPreCloseColor(colorInt);
////            preCloseColor = colorInt;
////        }
////    }
//
    @ReactProp(name = "chartPaddingTop")
    public void setChartPaddingTop(PriceChart chart, int padding){
        if (chart != null) {
            //chartOffsetTop = (int)Utils.convertPixelsToDp(padding);
            chartOffsetTop = padding;
            if(chart.getXAxis().isEnabled() && chart.getXAxis().getPosition() == XAxis.XAxisPosition.TOP) {
                chart.getXAxis().setYOffset(chartOffsetTop);
                chart.setExtraTopOffset(0);
            }else {
                chart.setExtraTopOffset(chartOffsetTop);
            }
        }
    }

    @ReactProp(name = "chartPaddingLeft")
    public void setChartPaddingLeft(PriceChart chart, int padding){
        if (chart != null) {
            //chartOffsetLeft = (int)Utils.convertPixelsToDp(padding);
            chartOffsetLeft = padding;
            if(chart.getAxisLeft().isEnabled() && chart.getAxisLeft().isDrawLabelsEnabled()) {
                chart.getAxisLeft().setXOffset(chartOffsetLeft);
                chart.setExtraLeftOffset(0);
            }else {
                chart.setExtraLeftOffset(chartOffsetLeft);
            }
            //chart.setXAxisPaddingLeft(chartOffsetLeft);
        }
    }

    @ReactProp(name = "chartPaddingRight")
    public void setChartPaddingRight(PriceChart chart, int padding){
        if (chart != null) {
            //chartOffsetRight = (int)Utils.convertPixelsToDp(padding);
            chartOffsetRight = padding;
            if(chart.getAxisRight().isEnabled() && chart.getAxisRight().isDrawLabelsEnabled()) {
                chart.getAxisRight().setXOffset(chartOffsetRight);
                chart.setExtraRightOffset(0);
            }else {
                chart.setExtraRightOffset(chartOffsetRight);
            }
            //chart.setXAxisPaddingRight(chartOffsetLeft);
        }
    }

    @ReactProp(name = "chartPaddingBottom")
    public void setChartPaddingBottom(PriceChart chart, int padding){
        if (chart != null) {
            //chartOffsetBottom = (int)Utils.convertPixelsToDp(padding);
            chartOffsetBottom = padding;
            if(chart.getXAxis().isEnabled() && chart.getXAxis().getPosition() == XAxis.XAxisPosition.BOTTOM) {
                chart.getXAxis().setYOffset(chartOffsetBottom);
                chart.setExtraBottomOffset(0);
            }else {
                chart.setExtraBottomOffset(chartOffsetBottom);
            }
        }
    }
//
//
//    @ReactProp(name = "isLandspace")
//    public void setOritentation(PriceChart chart, boolean isLandscape){
//        chart.setOritentation(isLandscape);
//    }
//
//    @ReactProp(name= "chartIsPrivate")
//    public void setIsPrivate(PriceChart chart, boolean isPrivate){
//        Log.d("setIsPrivte",""+isPrivate);
//        chart.setIsPrivate(isPrivate);
//    }

    private int getColor(String colorStr){
        int color = 0;
        if(!colorStr.equalsIgnoreCase("transparent")) {
            color = Color.parseColor(colorStr);
        }
        return color;
    }
}
