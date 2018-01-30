package com.simpleapp.component.chart;

import android.content.Context;

import com.github.mikephil.charting.charts.CombinedChart;

/**
 * Created by Neko on 2018/1/29.
 */

/**
 * @author <a href="mailto:sam@tradehero.mobi"> Sam Yu </a>
 */
public class PriceChart extends CombinedChart {
//    public boolean isAcutal = false;

    public PriceChart(Context context) {
        super(context);
    }

//    public PriceChart(Context context, AttributeSet attrs) {
//        super(context, attrs);
//    }
//
//    public PriceChart(Context context, AttributeSet attrs, int defStyle) {
//        super(context, attrs, defStyle);
//    }
//
//    @Override
//    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
//        MeasureSpecAssertions.assertExplicitMeasureSpec(widthMeasureSpec, heightMeasureSpec);
//
//        setMeasuredDimension(
//                MeasureSpec.getSize(widthMeasureSpec),
//                MeasureSpec.getSize(heightMeasureSpec));
//    }
//
//    @Override
//    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
//        // No-op since UIManagerModule handles actually laying out children.
//    }
//
//    @Override
//    public void requestLayout() {
//        // No-op, terminate `requestLayout` here, UIManagerModule handles laying out children and
//        // `layout` is called on all RN-managed views by `NativeViewHierarchyManager`
//    }
//
////    @Override
////    public void computeScroll(){
////        return;
////    }
//
//
////    public void setIsActual(boolean isActual){
////        this.isAcutal = isActual;
////    }
//
////    @Override
////    protected void init() {
////        super.init();
//////
//////        mAxisRendererLeft = new ReactYAxisRenderer(mViewPortHandler, mAxisLeft, mLeftAxisTransformer);
//////        ((ReactYAxisRenderer)mAxisRendererLeft).setBackgroundColor(Color.rgb(240, 240, 240)); // light
//////        mAxisRendererRight = new ReactYAxisRenderer(mViewPortHandler, mAxisRight, mRightAxisTransformer);
//////        ((ReactYAxisRenderer)mAxisRendererRight).setBackgroundColor(Color.rgb(240, 240, 240)); // light
////
////        mXAxisRenderer = new ReactXAxisRenderer(mViewPortHandler, mXAxis, mLeftAxisTransformer);
////        //((ReactXAxisRenderer)mXAxisRenderer).setBackgroundColor(Color.rgb(240, 240, 240)); // light
////    }
//
//    @Override
//    protected void onDraw(Canvas canvas) {
//        super.onDraw(canvas);
////        if (mXAxis.isDrawLimitLinesBehindDataEnabled())
////            mXAxisRenderer.renderLimitLines(canvas);
//
//    }
//
////    public void setGridBackgroundColor(int color) {
////        super.setGridBackgroundColor(color);
//////        ((ReactYAxisRenderer)mAxisRendererRight).setBackgroundColor(color);
//////        ((ReactYAxisRenderer)mAxisRendererLeft).setBackgroundColor(color);
//////        ((ReactXAxisRenderer)mXAxisRenderer).setBackgroundColor(color);
////    }
//
////    @Override
////    public void setData(CombinedData data) {
////        mData = null;
////        mRenderer = null;
////        super.setData(data);
////        mRenderer = new ReactCombinedChartRenderer(this, mAnimator, mViewPortHandler);
////        mRenderer.initBuffers();
////    }
//
////
////    @Override
////    protected void drawGridBackground(Canvas c) {
////        super.drawGridBackground(c);
////
////        if (mDrawGridBackground) {
////
////            // draw the grid background
////            RectF new_Background = new RectF(mViewPortHandler.getContentRect());
////            new_Background.left = mViewPortHandler.getContentRect().right;
////            new_Background.right = c.getWidth();
////            c.drawRect(new_Background, mGridBackgroundPaint);
////        }
////
////        if (mDrawBorders) {
////            c.drawRect(mViewPortHandler.getContentRect(), mBorderPaint);
////        }
////    }
//
    int[] gradientColors;
    public void setGradientColors(int[] colors){
        gradientColors = colors;
    }

    public int[] getGradientColors(){
        return gradientColors;
    }

    int dataSetColor;

    public void setDataSetColor(int color){
        dataSetColor = color;
    }

    public int getDataSetColor(){
        return dataSetColor;
    }

//
//
////
////    public void setXAxisPaddingLeft(int value){
////        ((ReactXAxisRenderer)mXAxisRenderer).setHorizontalPaddingLeft(value);
////    }
////
////    public void setXAxisPaddingRight(int value){
////        ((ReactXAxisRenderer)mXAxisRenderer).setHorizontalPaddingRight(value);
////    }

//    protected int preCloseColor = 0;
//    public void setPreCloseColor(int value){
//        preCloseColor = value;
//        invalidate();
//    }
//
//    public int getPreCloseColor(){
//        return preCloseColor;
//    }
//
    boolean isLandspace = false;
    public boolean isLandspace(){
        return isLandspace;
    }
    public void setOritentation(boolean isLandspace){
        this.isLandspace = isLandspace;
    }

    private boolean isPrivate = false;
    public boolean isPrivate(){return isPrivate;}
    public void setIsPrivate(boolean isPrivate){
        this.isPrivate = isPrivate;
    }
}
