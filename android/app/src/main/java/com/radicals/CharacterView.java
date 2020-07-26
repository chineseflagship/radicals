package com.radicals;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import static java.lang.StrictMath.pow;
import static java.lang.StrictMath.sqrt;

//import androidx.core.view.MotionEventCompat;

public class CharacterView extends /*ViewGroup*/RelativeLayout {

    private Context context;
    private String data;
    private WebView myWebView;
    private SimpleDrawingView sdv;
    private Boolean mode = false;

    private String points = "{\"strokes\":[\"M 670 645 Q 763 655 907 643 Q 932 640 938 649 Q 947 662 934 675 Q 903 703 857 724 Q 842 731 815 722 Q 752 707 555 683 Q 444 674 315 654 Q 248 644 145 642 Q 130 642 129 630 Q 129 617 148 602 Q 187 572 237 584 Q 294 600 344 606 L 396 616 Q 481 631 616 640 L 670 645 Z\",\"M 344 606 Q 371 558 360 393 Q 359 387 359 379 Q 344 204 204 76 Q 189 63 186 56 Q 185 49 196 50 Q 235 50 305 123 Q 383 207 403 338 Q 419 420 424 544 Q 428 565 429 576 Q 436 597 415 607 Q 405 613 396 616 L 344 606 Z\",\"M 616 640 Q 646 579 628 257 Q 621 146 614 119 Q 596 65 660 1 Q 661 0 664 -3 Q 677 -4 682 11 Q 695 47 691 80 Q 672 512 687 616 Q 687 626 670 645 L 616 640 Z\"],\"medians\":[[[142,629],[180,615],[212,612],[464,651],[833,687],[890,674],[925,659]],[[351,605],[392,576],[389,418],[367,286],[334,203],[303,154],[245,91],[193,57]],[[623,640],[656,610],[657,232],[650,96],[668,5]]]}";

    private JSONObject object;
    private JSONArray medians;
    private Integer numstrokes, currentstrokeindex;

    private JSONArray currentstroke;
    private Integer numcurrentstrokepoints;
    private JSONArray currentstrokefirstmedian;
    private JSONArray currentstrokelastmedian;
    private Integer firstx, firsty, lastx, lasty;

    {
        try {
            object = new JSONObject(points);
            medians = object.getJSONArray("medians");
            currentstrokeindex = 0;
            numstrokes = object.getJSONArray("medians").length();

            Log.d("cv",String.valueOf(object.getJSONArray("strokes").getString(0)));

        } catch (JSONException e) {
            Log.d("cv", "failed");
            e.printStackTrace();
        }
    }

public CharacterView(Context context) {
        super(context);
        this.context = context;
        init(context);
    }

    public CharacterView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
//        init(context);
    }

    public CharacterView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init(context);
    }

    private boolean isCorrect() {

        if (currentstrokeindex == numstrokes) {
            return false;
        }

        {
            try {

                currentstroke = medians.getJSONArray(currentstrokeindex);
                numcurrentstrokepoints = currentstroke.length();

                currentstrokefirstmedian = currentstroke.getJSONArray(0);
                currentstrokelastmedian = currentstroke.getJSONArray(numcurrentstrokepoints-1);

                firstx = currentstrokefirstmedian.getInt(0);
                firsty = currentstrokefirstmedian.getInt(1);
                firsty = (-1 * (firsty - 900));
                lastx = currentstrokelastmedian.getInt(0);
                lasty = currentstrokelastmedian.getInt(1);
                lasty = (-1 * (lasty - 900));


//            Log.d("cv",  String.valueOf(firstx));
//            Log.d("cv",  String.valueOf(firsty));
//            Log.d("cv",  String.valueOf(lastx));
//            Log.d("cv",  String.valueOf(lasty));

//            Log.d("cv",  String.valueOf(medians.get(0)));
//            Log.d("cv", object.toString());
//            Log.d("cv", String.valueOf(object.getJSONArray("medians")));
//            Log.d("cv", String.valueOf(object.getJSONArray("medians").length()/2));

            } catch (JSONException e) {
                Log.d("cv", "failed");
                e.printStackTrace();
            }
        }

        //            Log.d("cv",  String.valueOf(sdv.getFirstx()*(1024.0/800)));
        //            Log.d("cv",  String.valueOf(sdv.getFirsty()*(1024.0/800)));
        //            Log.d("cv",  String.valueOf(sdv.getLastx()*(1024.0/800)));
        //            Log.d("cv",  String.valueOf(sdv.getLasty()*(1024.0/800)));

        double frameSize = 1000;

        double xDiff1 = firstx - sdv.getFirstx() * (1024.0 /frameSize);
        double yDiff1 = firsty - sdv.getFirsty()*(1024.0/frameSize);
        double xDiff3 = lastx - sdv.getLastx()*(1024.0/frameSize);
        double yDiff3 = lasty - sdv.getLasty()*(1024.0/frameSize);
//            Log.d("cv",  String.valueOf(firstx - sdv.getFirstx()*(1024.0/800)));
//            Log.d("cv",  String.valueOf(firsty - sdv.getFirsty()*(1024.0/800)));
//            Log.d("cv",  String.valueOf(lastx - sdv.getLastx()*(1024.0/800)));
//            Log.d("cv",  String.valueOf(lasty - sdv.getLasty()*(1024.0/800)));

        double firstDiff = sqrt(pow(xDiff1, 2) + pow(yDiff1, 2));
        double secondDiff = sqrt( pow(xDiff3, 2) + pow(yDiff3, 2));

        Log.d("cv",  String.valueOf(firstDiff));
        Log.d("cv",  String.valueOf(secondDiff));

        // based off Oliver's code (ios)
//        return (firstDiff < 80 && secondDiff < 100);
        return (firstDiff < 150 && secondDiff < 150);


    }

    // https://gist.github.com/bramus/1536b9ec32dc9a02e417ff63e2a2e4ce#file-events-ui-md
    private void dispatchOnEnd() {
        Log.d("cv", "receivenativeevent called");
        WritableMap event = Arguments.createMap();

        ReactContext reactContext = (ReactContext)getContext();

        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                "onEnd",
                event
        );
    }

    public void setData(String data) {
        Log.d("cv","settingdata");
        this.data = data;
//        Log.d("cv", this.data);
        drawFullChara();
    }

    public void setPoints(String points) {
        this.points = points;

        {
            try {
                object = new JSONObject(points);
                medians = object.getJSONArray("medians");
                currentstrokeindex = 0;
                numstrokes = object.getJSONArray("medians").length();

                Log.d("cv",String.valueOf(object.getJSONArray("strokes").getString(0)));

            } catch (JSONException e) {
                Log.d("cv", "failed");
                e.printStackTrace();
            }
        }
    }

    public void setQuiz(Boolean mode) {
        Log.d("cv", "mode: " + mode);
        this.mode = mode;
        sdv.setEnabled(mode);
    }

    public void drawFullChara() {
        myWebView.loadDataWithBaseURL(null, this.data, "text/html", "utf-8", null);
    }

    private void init(Context context) {
        Log.d("cv","init");

        LayoutInflater inflater = (LayoutInflater)
                context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        inflater.inflate(R.layout.character_view, this);

        // layout is inflated, assign local variables to components
        myWebView = (WebView) findViewById(R.id.webview);
        sdv = (SimpleDrawingView) findViewById(R.id.simpleDrawingView1);

    }

    public String drawChara() {
        String s = "";
        s = s +  " <svg version=\"1.1\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "  <g transform=\"scale(1, -1) translate(0, -900)\">\n" +
            "    <style type=\"text/css\">\n" +
            "\n";

//        for (int i = 0; i < currentstrokeindex; i++) {
//            s = s + "        @keyframes keyframes" + i + " {\n" +
//                "          from {\n" +
//                "            stroke: blue;\n" +
//                "            stroke-dashoffset: 1051;\n" +
//                "            stroke-width: 128;\n" +
//                "          }\n" +
//                "          77% {\n" +
//                "            animation-timing-function: step-end;\n" +
//                "            stroke: blue;\n" +
//                "            stroke-dashoffset: 0;\n" +
//                "            stroke-width: 128;\n" +
//                "          }\n" +
//                "          to {\n" +
//                "            stroke: black;\n" +
//                "            stroke-width: 1024;\n" +
//                "          }\n" +
//                "        }\n" +
//                "        #make-me-a-hanzi-animation-" + i + " {\n" +
//                "          animation: keyframes" + i +" 1.1053059895833333s both;\n" +
//                "          animation-delay: " + i + "s;\n" +
//                "          animation-timing-function: linear;\n" +
//                "        }\n" +
//                "\n";
//        }


        s = s + "    </style>\n" +
            "\n";

        for (int i = 0; i < currentstrokeindex; i++) {
            try {
                s = s + "<path d=\"" +
                    object.getJSONArray("strokes").getString(i)
//                    + "\" fill=\"lightgray\"></path>\"";
                    + "\" fill=\"black\">";
                if (i == currentstrokeindex) {
                    s = s + "<animate id=\"animation1\"\n" +
                        "             attributeName=\"opacity\"\n" +
                        "             from=\"0\" to=\"1\" dur=\"1s\"\n" +
                        "             begin=\"0s;animation2.end\" />\n";
                }
                s = s + "</path>\"";
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

//        for (int i = 0; i < currentstrokeindex; i++) {
//            try {
//                s = s + "      <clipPath id=\"make-me-a-hanzi-clip-"+ i + "\">\n"
//                    + "       <path d=\""
//                    + object.getJSONArray("strokes").getString(i)
//                    + "\"></path>\n"
//                    + "      </clipPath>\n"
//                    + "\n" + "      <path clip-path=\"url(#make-me-a-hanzi-clip-" + i + ")\" d=\"";
//                for (int j = 0; j < medians.getJSONArray(i).length(); j++) {
//                    if (j == 0) {
//                        s = s + "M " + medians.getJSONArray(i).getJSONArray(j).getInt(0) + " "
//                            + medians.getJSONArray(i).getJSONArray(j).getInt(1);
//                    } else {
//                        s = s + " L " + medians.getJSONArray(i).getJSONArray(j).getInt(0) + " "
//                            + medians.getJSONArray(i).getJSONArray(j).getInt(1);
//                    }
//                }
//                s = s + "\" fill=\"none\" id=\"make-me-a-hanzi-animation-" + i +"\" stroke-dasharray=\"780 1560\" stroke-linecap=\"round\"></path>\n";
//            } catch (JSONException e) {
//                e.printStackTrace();
//            }
//        }

        s = s + "\n" +
            "  </g>\n" +
            "</svg>";

        return s;
    }

    public String drawHint() {
        String s = "";
        s = s +  " <svg version=\"1.1\" viewBox=\"0 0 1024 1024\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "  <g transform=\"scale(1, -1) translate(0, -900)\">\n" +
            "    <style type=\"text/css\">\n" +
            "\n";

        for (int i = 0; i <= currentstrokeindex; i++) {
            s = s + "        @keyframes keyframes" + i + " {\n" +
                "          from {\n" +
                "            stroke: ";
            if (i == currentstrokeindex) {
                s = s + "red;\n";
            } else {
                s = s + "blue;\n";
            }
            s = s +    "            stroke-dashoffset: 1051;\n" +
                "            stroke-width: 128;\n" +
                "          }\n" +
                "          77% {\n" +
                "            animation-timing-function: step-end;\n" +
                "            stroke: ";
            if (i == currentstrokeindex) {
                s = s + "red;\n";
            } else {
                s = s + "blue;\n";
            }
            s = s +    "            stroke-dashoffset: 0;\n" +
                "            stroke-width: 128;\n" +
                "          }\n" +
                "          to {\n" +
                "            stroke: ";
            if (i == currentstrokeindex) {
                s = s + "clear;\n";
            } else {
                s = s + "black;\n";
            }
            s = s +    "            stroke-width: 1024;\n" +
                "          }\n" +
                "        }\n" +
                "        #make-me-a-hanzi-animation-" + i + " {\n" +
                "          animation: keyframes" + i + " 1.1053059895833333s both;\n" +
                "          animation-delay: " + i + "s;\n" +
                "          animation-timing-function: linear;\n" +
                "        }\n" +
                "\n";
        }


        s = s + "    </style>\n" +
            "\n";

        for (int i = 0; i < currentstrokeindex; i++) {
            try {
                s = s + "<path d=\"" +
                    object.getJSONArray("strokes").getString(i)
//                    + "\" fill=\"lightgray\"></path>\"";
                    + "\" fill=\"black\"></path>\"";
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        for (int i = 0; i <= currentstrokeindex; i++) {
            if (i == currentstrokeindex) {
                try {
                    s = s + "      <clipPath id=\"make-me-a-hanzi-clip-" + i + "\">\n"
                        + "       <path d=\""
                        + object.getJSONArray("strokes").getString(i)
                        + "\"></path>\n"
                        + "      </clipPath>\n"
                        + "\n" + "      <path clip-path=\"url(#make-me-a-hanzi-clip-" + i + ")\" d=\"";
                    for (int j = 0; j < medians.getJSONArray(i).length(); j++) {
                        if (j == 0) {
                            s = s + "M " + medians.getJSONArray(i).getJSONArray(j).getInt(0) + " "
                                + medians.getJSONArray(i).getJSONArray(j).getInt(1);
                        } else {
                            s = s + " L " + medians.getJSONArray(i).getJSONArray(j).getInt(0) + " "
                                + medians.getJSONArray(i).getJSONArray(j).getInt(1);
                        }
                    }
                    s = s + "\" fill=\"none\" id=\"make-me-a-hanzi-animation-" + i + "\" stroke-dasharray=\"780 1560\" stroke-linecap=\"round\"></path>\n";
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }

        s = s + "\n" +
            "  </g>\n" +
            "</svg>";

        return s;
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent ev) {

        if  (!mode) {
            return false;
        }

        if (ev.getAction() == MotionEvent.ACTION_UP) {
            Log.d("cv", "Touch up ");

            if (isCorrect()) {
                currentstrokeindex = currentstrokeindex + 1;
                Log.d("cv", "correct");
//                Log.d("cv", drawChara());
                myWebView.loadDataWithBaseURL(null, drawChara(), "text/html", "utf-8", null);
                if (numstrokes == currentstrokeindex) {
                    currentstrokeindex = 0;
                    dispatchOnEnd();
                }

            } else {
                Log.d("cv", "incorrect");
                Log.d("cv", String.valueOf(currentstrokeindex));
                myWebView.loadDataWithBaseURL(null, drawHint(), "text/html", "utf-8", null);

//                Log.d("cv", drawHint());

            }

            sdv.clear();
            //reload();

//            onReceiveNativeEvent();
            // send on finishing current character
//            dispatchOnEnd();

            return true;
        }

        // goes to child ontouch event
        return false;
    }


    /**
     * Any layout manager that doesn't scroll will want this.
     */
    @Override
    public boolean shouldDelayChildPressedState() {
        return false;
    }

}
