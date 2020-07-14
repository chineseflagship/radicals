package com.radicals;

import android.util.Log;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class CharacterViewManager extends ViewGroupManager<CharacterView> {

    public static final String REACT_CLASS = "CharacterView";


    @Override
    public @Nullable Map getExportedCustomDirectEventTypeConstants() {
        Log.d("cv","bubble called");
        return MapBuilder.of(
                "onEnd",
                MapBuilder.of("registrationName", "onEnd")
        );
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected CharacterView createViewInstance(ThemedReactContext reactContext) {
        CharacterView cv = new CharacterView(reactContext);
        return cv;
    }

    @ReactProp(name="data")
    public void setCharacterViewData(CharacterView cv, String data) {
        Log.d("cvmanager", "setdatacalled");
        cv.setData(data);
    }

    @ReactProp(name="points")
    public void setCharacterViewPoints(CharacterView cv, String points) {
        Log.d("cvmanager", "setdatacalled");
        cv.setPoints(points);
    }

    @ReactProp(name="quiz")
    public void setCharacterViewMode(CharacterView cv, Boolean mode) {
        cv.setQuiz(mode);
    }

}

// 6/5/20: code below works; need to test above for viewgroup

//public class CharacterViewManager extends SimpleViewManager<SimpleDrawingView> {
//    public static final String REACT_CLASS = "CharacterView";
//
//    @Nonnull
//    @Override
//    public String getName() {
//        return REACT_CLASS;
//    }
//
//    @Nonnull
//    @Override
//    protected /*CharacterView*/SimpleDrawingView createViewInstance(ThemedReactContext reactContext) {
//        SimpleDrawingView cv = new SimpleDrawingView(reactContext);
//        return cv;
//    }

//    @ReactProp(name="data")
//    public void setCanvasData(SimpleDrawingView cv, String data) {
//        cv.setData(data);
//    }

//}