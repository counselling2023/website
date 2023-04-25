const displayLogoLength = 12;
const templateDisplay = {
    // symbol is mandetory 
    "user_search_symbol": {
        "iconTypeTemplate": 9,
        "monoTypeTemplate": 1,
        "normalTypeTemplate": 2,
    },
    // symbol is mandetory 
    "default_symbol": {
        "iconTypeTemplate": 7,
        "monoTypeTemplate": 2,
        "normalTypeTemplate": 3,
    },
    "only_monogram": 1,
    "only_symbol": 1, // symbol is mandetory 
}
const pelletsDisplay = {
    "only_gradient": 1, // only work if user not selected any color
    "best_color": 1,  // only work if user not selected any color
    "light_dark": 1,
    "light_only": 1,
    "dark_only": 1

}
const pattrenDefaultValue = {
    "opacity": 0.5,
    "scale": 100,
    "rotation": 0.0,
    "distance": 0,
    "fillColor": "#000000"
}


const DBLineWrapCaseVal = 3;
const maxStep6ReloadCnt = 15;

var showBothTypeFrame = 1;
var isCustomMONO = 1
var specialDBLineCase = 0;
var currentRunningSchema = ""; // blank mean default other values are only_gradient/best_color/light_dark

const isCurveFetaureInLogoName = 1;

const positiveCurveValue = 10;
const negativeCurveValue = -10;
var defaultCurveValue = 10;

const logoNameCurveSliderMaxValue = 50;
const logoNameCurveSliderMinValue = -50;


const minLogoNameLengthForCurve = 5;
const maxLogoNameLengthForCurve = 16;
const maxSloganNameLengthForCurve = 18;

const show_light_dark_in_default_schema = 1;

const useIntersectionObserver = 1;
const load_more_text = "Load More Logos";
// ["default", "light_dark"];

//logo_design_style is global variable define in node-789-logo-maker.php
const designStyleLogic = logo_design_style;

const designLogoImgKeyList = ["bg_color", "text_color", "slogan_color", "isEqual", "isIcon", "isMono", "isFrame", "isIconFrame", "isArc", "arc_dir", "isDBLineCompanyText", "icon", "outer_frame", "inner_frame"];

const useOriginalColorsOfDesignLogo = true;
const useLightOrDarkSchemaOfDesignLogo = true;
const canSkipLogoStyleStep = true;
const maxLoadMoreForDesignLogic = 5;

const UsePatternInBG = true;
const uniqClassNameForPattern = "dh_lm_bg_pattern_2907";
const maxPatternForEachLoadMore = 0;// value for creating maximum logo with pattern in background at step 6 earlier it is 3
/**
 * in milisecond
 */
const leftPanelRefreshWaitTime = 1000;
const inputTextWaitTime = 500;
const colorPickerInputWaitTime = 1000;
var allBgPatternSVGHtml = null;
let AllpatternList = null;
/**
 * GradientRotationSliderVlue
 */
const useGradientInBG = true;
const gRSMinValue = 0;//Gradient Rotation Slider Min Value
const gRSMaxValue = 360;//Gradient Rotation Slider Max Value
const gSSMinValue = 0;//Gradient Size Slider Min Value
const gSSMaxValue = 100;//Gradient Size Slider Max Value
