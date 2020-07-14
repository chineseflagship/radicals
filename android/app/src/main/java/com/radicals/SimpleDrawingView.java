package com.radicals;

// base code source: https://guides.codepath.com/android/Basic-Painting-with-Views

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;

public class SimpleDrawingView extends View {
    // setup initial color
    private final int paintColor = Color.BLACK;
    // defines paint and canvas
    private Paint drawPaint;
    // stores next circle
    private Path path = new Path();

    private Float firstx, firsty, lastx, lasty;


    public SimpleDrawingView(Context context) {
        super(context);
        setFocusable(true);
        setFocusableInTouchMode(true);
        setupPaint();
    }

    public SimpleDrawingView(Context context, AttributeSet attrs) {
        super(context, attrs);
        setFocusable(true);
        setFocusableInTouchMode(true);
        setupPaint();
    }

    private void setupPaint() {
        // Setup paint with color and stroke styles
        drawPaint = new Paint();
        drawPaint.setColor(paintColor);
        drawPaint.setAntiAlias(true);
        drawPaint.setStrokeWidth(10);
        drawPaint.setStyle(Paint.Style.STROKE);
        drawPaint.setStrokeJoin(Paint.Join.ROUND);
        drawPaint.setStrokeCap(Paint.Cap.ROUND);
    }


    public void clear() {
        Log.d("sdv","clear");
        path.reset();
        postInvalidate();
    }

    public Float getFirstx() { return firstx; }
    public Float getFirsty() { return firsty; }
    public Float getLastx() { return lastx; }
    public Float getLasty() { return lasty; }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.drawPath(path, drawPaint);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        float pointX = event.getX();
        float pointY = event.getY();
        // Checks for the event that occurs
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                path.moveTo(pointX, pointY);
                Log.d("sdv", "x:" + pointX + ". y:" + pointY );
                firstx = pointX;
                firsty = pointY;
                return true;
            case MotionEvent.ACTION_MOVE:
                path.lineTo(pointX, pointY);
                Log.d("sdv", "x:" + pointX + ". y:" + pointY );
                lastx = pointX;
                lasty = pointY;
                break;
            case MotionEvent.ACTION_UP:
                Log.d("sdv", "Touch up in view");

            default:
                return false;
        }




        // Force a view to draw again
        postInvalidate();
        return true;
    }
}