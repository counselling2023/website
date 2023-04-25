//----------------------------------------------------
var version = dh_editor_utility.getUrlParameter('version');
var prevPage = sessionStorage.getItem("prevPage");
var editor_exceptions = new Array();
var currentPopoverObj = null;
var currentPopoverBtn = null;
var inputTextTimer = null;
var inputTextTime = 700;
var step6LoadCounter = 0;
var search_symbol_list = [];
var myArr = [];
var myFinalSwiperItem = [];
var templateCombObj = {};
var isIconEditHitArea = true;
var iconEditHitAreaStyle = "width: 100%;height:100%;opacity:0;background-color: green;position: absolute;top:0px;left:0px;cursor:pointer;";
iconEditHitAreaStyle += (!isIconEditHitArea) ? 'display:none' : '';
var currentSelectedIndustry = "";
var currentSelectedIndustryIconList = [];
var allGradientSchemaList = [];
var allBestSchemaList = [];
var gradientSchemaReadCounter = 0;
var bestSchemaReadCounter = 0;
var bestColorViewDone = false;
var step6OnLoadFirstSchema = "";
var NOUN_API_LIMIT = (sessionStorage.getItem("icon_limit") && (+(sessionStorage.getItem("icon_limit")) > 0) && (+sessionStorage.getItem("icon_limit"))) || 99;
var MakerJSObj = null;
var allOuterFramesList = [];
var allInnerFramesList = [];
$(function () {
	if (isCurveFetaureInLogoName && (!version)) {
		MakerJSObj = require('makerjs');
	}
	dh_editor_utility.checkForMobileDevice();
	dh_editor_utility.getOSName();
	if (sessionStorage.getItem("currPage") == 6) {
		let step6reload = +(sessionStorage.getItem("step6reload") || 0);
		sessionStorage.setItem("step6reload", step6reload + 1);
	}
	/**
	 * code for checking session storage working or not
	 */
	try {
		sessionStorage.setItem('sessionStorage', 1);
		sessionStorage.removeItem('sessionStorage');
	} catch (e) {
		alert('Your web browser does not support storing settings locally. The most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
		window.location.href = DH.baseURL + '/tools/logo-maker';
		return;
	}
	/**
	 * add utm url with editor 
	 */
	var qrStr = "&";
	var url = window.location.href;
	url = url.split("?")[1];
	var params = url.split('&');
	var editorTimer;
	var loginPopupTimer;
	/**
	 * Array for defining gradient colors and stops
	 */
	var gradientsArray = {
		gold: { name: 'Gold', stops: [{ offset: 0.05, color: '#B68648' }, { offset: 0.95, color: '#FBF3A3' }] },
		silver: { name: 'Silver', stops: [{ offset: 0.05, color: '#6E6F71' }, { offset: 0.95, color: '#ECECEC' }] },
		bronze: { name: 'Bronze', stops: [{ offset: 0.05, color: '#d64000' }, { offset: 0.95, color: '#edc5be' }] },
		blue: { name: 'Blue', stops: [{ offset: 0.05, color: '#2d388a' }, { offset: 0.95, color: '#00aeef' }] },
		bubblegum: { name: 'Bubblegum', stops: [{ offset: 0.05, color: '#fe8dc6' }, { offset: 0.95, color: '#fed1c7' }] },
		graphite: { name: 'Graphite', stops: [{ offset: 0, color: '#51504f' }, { offset: 0.1, color: '#939598' }, { offset: 0.3, color: '#414042' }, { offset: 0.5, color: '#939598' }, { offset: 0.7, color: '#494c50' }, { offset: 0.9, color: '#6d6e71' }, { offset: 1, color: '#414042' }] },
		green: { name: 'Green', stops: [{ offset: 0, color: '#006838' }, { offset: 1, color: '#96cf24' }] },
		platinum: { name: 'Platinum', stops: [{ offset: 0, color: '#786756' }, { offset: 0.33, color: '#847361' }, { offset: 0.67, color: '#a8a49b' }, { offset: 1, color: '#d6d6d6' }] },
		purple: { name: 'Purple', stops: [{ offset: 0, color: '#25235e' }, { offset: 1, color: '#ae4792' }] },
		purpleblue: { name: 'Purple Blue', stops: [{ offset: 0, color: '#6d7cff' }, { offset: 1, color: '#ff51ff' }] },
		rose: { name: 'Rose', stops: [{ offset: 0, color: '#914d3c' }, { offset: 0.1, color: '#b37362' }, { offset: 0.3, color: '#fcc5b3' }, { offset: 0.5, color: '#f7b7a6' }, { offset: 1, color: '#945f50' }] },
		sand: { name: 'Sand', stops: [{ offset: 0, color: '#ffb295' }, { offset: 1, color: '#fedac6' }] },
		yellow: { name: 'Yellow', stops: [{ offset: 0, color: '#e93e3a' }, { offset: 0.1, color: '#ed683c' }, { offset: 0.3, color: '#f3903f' }, { offset: 0.7, color: '#fdc70c' }, { offset: 1, color: '#fff33b' }] },
	}
	var recentColors = [];
	$.each(params, function (index, value) {
		var v = value.split('=');
		if (v[0] != 'logoid' && v[0] != 'editor') qrStr += value + '&';
	});
	qrStr = qrStr.replace(/&$/, '');
	qrStr = qrStr.replace(/\?$/, '');
	if (qrStr == "&") {
		qrStr = "";
	}
	/**
	 * some defaults variable used in whole JS 
	 */
	var svgTagNameSpace = "";
	var showWarning = true;
	var showStep6Anm = (DH.DH_APP_MODE == 'DEVELOPMENT') ? false : true;
	var currCompFontObject;      // current font object
	var currCompFont2Object;      // current font2 object
	var currSloganFontObject     // current slogan object
	var currMonogramFontObject     // current monogram object
	var loadMoreStart = 0;
	var dynamicLogoCounter = 0;
	var jqXHR, jqXHR1;
	var randomPagination = 0;
	var savedPagination = 0;
	var favoritePagination = 0;
	var rangeSliderFlag = false;
	var editorParameters = {};
	var svgWidth = 640;
	var svgHeight = 480;
	var templatesData = [];
	var step6templatesData = [];
	var templatesDataJson;
	var doubleLineTemplatesDataJson = [];
	var onlyMonoTemplateData = [];
	var onlyIconTemplateData = [];
	var onlyDoubleLineTemplateData = [];
	var onlyDoubleLineWithoutFrameTemplateData = [];
	var allTypeTemplateData = [];
	var favoriteJSON = { companyFont: [], sloganFont: [], colorPallete: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [] }, colorVariation: [], symbolVariation: [], containerVariation: [], layoutVariation: [], logoVariation: [] };
	var forSearchSymbol = "Type something above or pick a related term to see symbols";
	var whileSearchingSymbol = "Please wait while we are generating Logos";
	var atLeastOneIsShowTemplateDoubleLineIsOn = false;
	dh_lm_common_utility.getPattrenList(15, 1).then(() => {
		let list = Object.keys(allBgPatternSVGHtml);
		for (let i = 0; i < list.length; i++) {
			if (allBgPatternSVGHtml[list[i]]['svg_data'] == "") {
				dh_editor_utility.getSvgHtml(allBgPatternSVGHtml[list[i]].svg_url).then((bgSVGHTML) => {
					if (bgSVGHTML) {
						allBgPatternSVGHtml[list[i]]['svg_data'] = bgSVGHTML;
					}
				});
			}

		}
	});
	/**
	 * fetch all templates initally 
	 */
	$.ajax({
		url: DH.baseURL + '/logoMakerAjax.php',
		type: 'POST',
		data: { action: 'templates', type_id: 0 },
		async: false,
		success: function (json) {
			var json = dh_editor_utility.getValidJsonParseObj(json);
			if (json && json.status === "error" && json.err_type === "csrf") {
				$("#logomaker_icon_expired").modal('show');
				return
			}
			var i = 0;
			var j = 0;
			templatesDataJson = json.data.templates;
			$.each(json.data.templates, function (k, v) {
				v.template_code.template_id = v.template_id;
				v.template_code.template_db_id = v.template_id;
				v.template_code.template_direction = v.template_direction;
				v.template_code.is_double_line_company_text = v.is_double_line_company_text;
				v.template_code.isdbLineCompanyText = "0";
				if (isCurveFetaureInLogoName && MakerJSObj && v.is_curve_company_text == 1) {
					v.template_code.isSupportCurveText = v.is_curve_company_text;
				}
				// if (v.is_show == 1 && (v.is_equal == 0)) {
				var withDoubleTextTemplate = JSON.parse(JSON.stringify(templatesDataJson[k]));
				var withDoubleTextTemplateCode = JSON.parse(JSON.stringify(withDoubleTextTemplate.template_code));
				withDoubleTextTemplateCode.text1 = Object.assign({}, withDoubleTextTemplateCode.text);
				withDoubleTextTemplateCode.text2 = Object.assign({}, withDoubleTextTemplateCode.text);
				withDoubleTextTemplateCode.updates.text1 = {};
				withDoubleTextTemplateCode.updates.text2 = {};
				if (withDoubleTextTemplateCode.hasOwnProperty("text")) {
					delete withDoubleTextTemplateCode["text"];
				}
				if (withDoubleTextTemplateCode.updates.hasOwnProperty("text")) {
					delete withDoubleTextTemplateCode.updates["text"];
				}
				withDoubleTextTemplateCode.isdbLineCompanyText = "1";
				withDoubleTextTemplateCode.text1.field = "text1"
				withDoubleTextTemplateCode.text2.field = "text2";
				withDoubleTextTemplateCode.template_db_id = v.template_code.template_id + ".1";
				withDoubleTextTemplate.template_code = withDoubleTextTemplateCode;
				doubleLineTemplatesDataJson.push(withDoubleTextTemplate);
				if (v.is_show == 0) {
					onlyDoubleLineTemplateData.push(withDoubleTextTemplateCode);
					if (v.is_frame == 0) {
						onlyDoubleLineWithoutFrameTemplateData.push(withDoubleTextTemplateCode);
					}
				}
				if (v.is_show == 1) {
					templatesData[i++] = v.template_code; //withoutDoubleTextTemplateCode
					step6templatesData[j++] = v.template_code;//withoutDoubleTextTemplateCode
					if (v.is_double_line_company_text == 1) {
						step6templatesData[j++] = withDoubleTextTemplateCode;
						atLeastOneIsShowTemplateDoubleLineIsOn = true;
					}
					if (atLeastOneIsShowTemplateDoubleLineIsOn) {
						templatesData[i++] = withDoubleTextTemplateCode;
					}
				}
				// }
				if (v.is_icon == 1) {
					onlyIconTemplateData.push(v.template_code);
					if (v.is_double_line_company_text == 1) {
						onlyIconTemplateData.push(withDoubleTextTemplateCode);
					}
				}
				if (v.is_mono == 1) {
					onlyMonoTemplateData.push(v.template_code);

				}
				allTypeTemplateData.push(v.template_code);
				allTypeTemplateData.push(withDoubleTextTemplateCode);
			});

			if (designStyleLogic) {
				step6templatesData = step6templatesData.sort((a, b) => ((+a.isEqual) > (+b.isEqual) ? 1 : -1));
			}
			if (version === "vd3" || version === "vd4") {
				let counter = 0;
				fetchCom(counter);
				function fetchCom(p_nCounter) {
					let masterTemplate = step6templatesData[p_nCounter];
					let comList = [];
					$.each(step6templatesData, function (k, v) {
						if (masterTemplate.isIcon == 1 && v.isIcon == masterTemplate.isIcon && v.isFrame == masterTemplate.isFrame && v.isEqual == masterTemplate.isEqual && v.is_double_line_company_text == masterTemplate.is_double_line_company_text && v.isIconFrame == masterTemplate.isIconFrame && masterTemplate["template_id"] != v["template_id"] && masterTemplate["template_db_id"] != v["template_db_id"]) {
							comList.push(v);
						}
					});
					counter = counter + 1;
					if (comList && comList.length > 0) {
						templateCombObj[masterTemplate["template_db_id"]] = comList;
					}
					if (counter < step6templatesData.length) {
						fetchCom(counter);
					} else {
					}
				}
			}


		},
		fail: function () {
			if (DH.DH_APP_MODE !== 'PRODUCTION') {
				dh_utility_common.alert({ type: 'error', message: 'There is some problem in logoMakerAjax.php which action is templates' });
			}
		},
		error: function () {
			if (DH.DH_APP_MODE !== 'PRODUCTION') {
				dh_utility_common.alert({ type: 'error', message: 'There is some problem in logoMakerAjax.php which action is templates' });
			}
		}
	});

	/**
	 * constants for the defualt templates
	 */
	var constantVars = {
		targets: { 2: 'logo', 7: 'logo', 8: 'logo', 9: 'slogan', 10: 'slogan', 3: 'background', 12: 'background', 13: 'logoColor', 14: 'sloganColor', 15: 'symbolColor', 16: 'containerColor' },
		colors: { 'bgColor': '#000000', 'bgColorFamily': '', 'mainTextColor': '#ffffff', 'mainTextFamily': '', 'sloganTextColor': '#ffffff', 'sloganTextFamily': '', 'iconColor': '#ffffff', 'iconFamily': '', 'frameColor': '#ffffff', 'frameFamily': '', 'iconFrameColor': '#ffffff', 'iconFrameFamily': '' },
		SVGWIDTH: svgWidth,
		SVGHEIGHT: svgHeight,
		VIEWBOXWIDTH: 640,
		VIEWBOXHEIGHT: 480,
		CONTAINERWIDTH: parseInt(this.SVGWIDTH / 0.7),
		CONTAINERHEIGHT: parseInt(this.SVGHEIGHT / 0.7),
		MINX: (this.SVGWIDTH - this.CONTAINERWIDTH) / 2,
		MINY: (this.SVGHEIGHT - this.CONTAINERHEIGHT) / 2,
		MAXX: ((this.SVGWIDTH - this.CONTAINERWIDTH) / 2) + this.CONTAINERWIDTH,
		MAXY: ((this.SVGHEIGHT - this.CONTAINERHEIGHT) / 2) + this.CONTAINERHEIGHT,
		FRAMERATIO: 210,
		SPACING: {
			'logoTextSlider': 82,
			'logoLetterSpacing': 1,
			'sloganTextSize': 50,
			'sloganLetterSpacing': 0,
			'textSloganDistSlider': 10,
			'logoSizeSlider': 150,
			'iconDistanceSlider': 10,
			'monogramTextSize': 150,
			'frameSizeSlider': 50
		},
		ORIGINAL_SPACING: {
			'logoTextSlider': 82,
			'logoLetterSpacing': 1,
			'sloganTextSize': 50,
			'sloganLetterSpacing': 0,//28,//9,//25,//6,
			'textSloganDistSlider': 10,
			'logoSizeSlider': 150,
			'iconDistanceSlider': 10,
			'frameSizeSlider': 50,
			'monogramTextSize': 150,
			'isJustChangeSloganLetterSpacing': false
		}
	}
	/**
	 *  start common logo make function 
	 */
	var logoMakerFunction = {
		objSet: [],
		/* Favorite listing record */
		// code by Tushar	
		resetFavoriteJson: function () {
			favoriteJSON.companyFont = [];
			favoriteJSON.sloganFont = [];
			favoriteJSON.colorPallete = [];
			favoriteJSON.colorVariation = [];
			favoriteJSON.symbolVariation = [];
			favoriteJSON.containerVariation = [];
			favoriteJSON.layoutVariation = [];
			favoriteJSON.logoVariation = [];
			lEditor.setSession('favoriteJSON', dh_editor_utility.getValidJsonStringifyObj(favoriteJSON));
		},

		addToFavoriteJson: function (type, subtype, val, lid) {
			var isExist = 0;
			if (typeof favoriteJSON[type][subtype] !== 'undefined') {
				for (var i = 0; i < favoriteJSON[type][subtype].length; i++) {
					if (favoriteJSON[type][subtype][i].val == val) {
						isExist = 1;
					}
				}
			}
			if (isExist == 0) {
				favoriteJSON[type][subtype].push({ lid: lid, val: val });
			}
			lEditor.setSession('favoriteJSON', dh_editor_utility.getValidJsonStringifyObj(favoriteJSON));
		},

		removeToFavoriteJson: function (type, subtype, val) {
			for (var i = 0; i < favoriteJSON[type][subtype].length; i++) {
				if (favoriteJSON[type][subtype][i].val === val) {
					favoriteJSON[type][subtype].splice(i, 1);
				}
			}
			lEditor.setSession('favoriteJSON', dh_editor_utility.getValidJsonStringifyObj(favoriteJSON));
		},

		isExistInFavoriteJson: function (type, subtype, val) {
			if (typeof favoriteJSON[type][subtype] !== 'undefined') {
				for (var i = 0; i < favoriteJSON[type][subtype].length; i++) {
					if (favoriteJSON[type][subtype][i].val === val) {
						return favoriteJSON[type][subtype][i].lid;
					}
				}
			}
			return false;
		},

		updateLogoIdJson: function (type, subtype, val, logoId) {
			if (logoId > 0) {
				for (var i = 0; i < favoriteJSON[type][subtype].length; i++) {
					if (favoriteJSON[type][subtype][i].val === val) {
						favoriteJSON[type][subtype][i].lid = logoId;
						lEditor.setSession('favoriteJSON', dh_editor_utility.getValidJsonStringifyObj(favoriteJSON));
					}
				}
			}
		},

		removeLogoIdJson: function (logoId) {
			var type = '';
			var subtype = '';
			for (var i = 0; i < Object.keys(favoriteJSON).length; i++) {
				type = Object.keys(favoriteJSON)[i];
				for (var j = 0; j < Object.keys(favoriteJSON[Object.keys(favoriteJSON)[i]]).length; j++) {
					subtype = Object.keys(favoriteJSON[Object.keys(favoriteJSON)[i]])[j];
					for (var k = 0; k < favoriteJSON[type][subtype].length; k++) {
						if (favoriteJSON[type][subtype][k].lid == logoId) {
							favoriteJSON[type][subtype].splice(k, 1);
							lEditor.setSession('favoriteJSON', dh_editor_utility.getValidJsonStringifyObj(favoriteJSON));
							$("[data-logo-id=" + logoId + "]").removeClass('active');
						}
					}
				}
			}
		},
		/* Favorite listing record End */

		/**
		 * for getting Ranodm number (any) 
		 */
		genRandomId: function getRandomNumbers() {
			var array = new Uint32Array(1);
			var cryptoObj = window.crypto || window.msCrypto;
			cryptoObj.getRandomValues(array);
			return array[0];
		},
		/**
		 * getting initial character of  logoname
		 * @param {*} logoName 
		 */
		genMonoGramText: function (logoName, p_bIsCustom) {
			var monogram = "";
			var res = logoName.split(" ");
			var i = 0;
			if (p_bIsCustom) {
				monogram = logoName.charAt(0).toUpperCase();
			} else {
				$.each(res, function (k, v) {
					if (v != "") {
						if (i < 4) {
							monogram += v.charAt(0).toUpperCase();
						}
						i++;
					}
				});
			}
			return monogram;
		},
		/**
		 * 
		 * @param {*} p_nValue 
		 */
		setSliderForSloganLetterSpacing: function (p_nValue) {
			// constantVars.SPACING.sloganLetterSpacing = p_nValue;
			lEditor.setSession('sloganLetterSpacing', p_nValue);
			$(".sloganLetterSpacing").slider("option", "value", p_nValue);
			$(".sloganLetterSpacing").parents('.rangeSlider').find('.rangeSliderValue').val(p_nValue);
		},
		/**
		 * 
		 * @param {*} p_nValue 
		 */
		resetLogoTextSlider: function (p_nValue) {
			if ($(".logoTextSlider").length) {
				$(".logoTextSlider").slider("option", "value", p_nValue);
				$(".logoTextSlider").parents('.rangeSlider').find('.rangeSliderValue').val(p_nValue);
			}
		},
		/**
		 * 
		 * @param {*} p_nValue 
		 */
		resetLogoTextLetterSpacingSlider: function (p_nValue) {
			if ($(".logoLetterSpacing").length) {
				$(".logoLetterSpacing").slider("option", "value", p_nValue);
				$(".logoLetterSpacing").parents('.rangeSlider').find('.rangeSliderValue').val(p_nValue);
			}
		},
		/**
		/**
		 * 
		 * @param {*} type 
		 */
		resetSlider: function (type, p_bIsChangeJSONValue = false) {
			switch (type) {
				case "logoTextSlider":
					constantVars.SPACING.logoTextSlider = constantVars.ORIGINAL_SPACING.logoTextSlider;
					lEditor.setSession('logoTextSlider', constantVars.SPACING.logoTextSlider);
					logoMakerFunction.resetLogoTextSlider(constantVars.SPACING.logoTextSlider);

					break;
				case "logoLetterSpacing":
					constantVars.SPACING.logoLetterSpacing = constantVars.ORIGINAL_SPACING.logoLetterSpacing;
					lEditor.setSession('logoLetterSpacing', constantVars.SPACING.logoLetterSpacing);
					logoMakerFunction.resetLogoTextLetterSpacingSlider(constantVars.SPACING.logoLetterSpacing);
					break;

				case "sloganTextSize":
					constantVars.SPACING.sloganTextSize = constantVars.ORIGINAL_SPACING.sloganTextSize;
					lEditor.setSession('sloganTextSize', constantVars.SPACING.sloganTextSize);
					$(".sloganTextSize").slider("option", "value", constantVars.SPACING.sloganTextSize);
					$(".sloganTextSize").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.sloganTextSize);
					if (p_bIsChangeJSONValue) {
						lEditor.currentLogo.generate.sloganTextSize = constantVars.SPACING.sloganTextSize;
					}
					break;
				case "sloganLetterSpacing":
					constantVars.SPACING.sloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
					lEditor.setSession('sloganLetterSpacing', constantVars.SPACING.sloganLetterSpacing);
					$(".sloganLetterSpacing").slider("option", "value", constantVars.SPACING.sloganLetterSpacing);
					$(".sloganLetterSpacing").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.sloganLetterSpacing);
					if (p_bIsChangeJSONValue) {
						lEditor.currentLogo.generate.sloganLetterSpacing = constantVars.SPACING.sloganLetterSpacing;
					}
					break;
				case "textSloganDistSlider":
					constantVars.SPACING.textSloganDistSlider = constantVars.ORIGINAL_SPACING.textSloganDistSlider;
					lEditor.setSession('textSloganDistSlider', constantVars.SPACING.textSloganDistSlider);
					$(".textSloganDistSlider").slider("option", "value", constantVars.SPACING.textSloganDistSlider);
					$(".textSloganDistSlider").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.textSloganDistSlider);
					if (p_bIsChangeJSONValue) {
						lEditor.currentLogo.generate.textSloganDistSlider = constantVars.SPACING.textSloganDistSlider;
					}
					lEditor.currentLogo.generate.templatePath.lastTextDistance = 0;
					lEditor.currentLogo.generate.templatePath.iconShiftDueToSloganDistance = 0;
					break;

				case "logoSizeSlider":
					constantVars.SPACING.logoSizeSlider = constantVars.ORIGINAL_SPACING.logoSizeSlider;
					lEditor.setSession('logoSizeSlider', constantVars.SPACING.logoSizeSlider);
					$(".logoSizeSlider").slider("option", "value", constantVars.SPACING.logoSizeSlider);
					$(".logoSizeSlider").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.logoSizeSlider);
					if (p_bIsChangeJSONValue) {
						lEditor.currentLogo.generate.logoSizeSlider = constantVars.SPACING.logoSizeSlider;
					}
					break;
				case "iconDistanceSlider":
					constantVars.SPACING.iconDistanceSlider = constantVars.ORIGINAL_SPACING.iconDistanceSlider;
					lEditor.setSession('iconDistanceSlider', constantVars.SPACING.iconDistanceSlider);
					$(".iconDistanceSlider").slider("option", "value", constantVars.SPACING.iconDistanceSlider);
					$(".iconDistanceSlider").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.iconDistanceSlider);
					if (p_bIsChangeJSONValue) {
						lEditor.currentLogo.generate.iconDistanceSlider = constantVars.SPACING.iconDistanceSlider;
					}
					lEditor.currentLogo.generate.templatePath.lastSymbolXDistance = 0;
					lEditor.currentLogo.generate.templatePath.lastSymbolYDistance = 0;
					break;
				case "frameSizeSlider":
					constantVars.SPACING.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;
					lEditor.setSession('frameSizeSlider', constantVars.SPACING.frameSizeSlider);
					$(".frameSizeSlider").slider("option", "value", constantVars.SPACING.frameSizeSlider);
					$(".frameSizeSlider").parents('.rangeSlider').find('.rangeSliderValue').val(constantVars.SPACING.frameSizeSlider);
					break;
				case 'logoCurveSlider':
					break;
			}
		},
		/**
		 * check combination is avail or not in array  ( for step - 6 )
		 * @param {*} obj 
		 * @param {*} combination 
		 */
		isUniqueComination: function (obj, combination) {
			var isUnique = true;
			if (obj.length < 1) {
				return true;
			}
			$.each(obj, function (k, v) {
				if (logoMakerFunction.isEqualArray(v, combination)) {
					isUnique = false;
				}
			});
			return isUnique;
		},
		/**
		 * for getting random value  from intervals  
		 * @param {*} min 
		 * @param {*} max 
		 */
		randomIntFromInterval: function (min, max) {
			max = max - 1;
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		/**
		 * getting random array for step-6
		 * @param {*} arr 
		 */
		getRandomCombination: function (arr) {
			var random = [];
			$.each(arr, function (k, v) {
				random.push(logoMakerFunction.randomIntFromInterval(0, v));
			});
			return random;
		},
		/**
		 * used chroma js for getting shades of any color
		 * @param {*} colorCode 
		 */
		getShadesOfColor: function (colorCode) {
			var colorList = [];
			var steps = 10;
			var dimColor = [];
			var darkColor = [];
			var chromaColor = chroma(colorCode);
			var i = 0;
			var j = 0;
			dimColor[i++] = chromaColor.brighten(j);
			for (; i < steps;) {
				j = j + 0.5;
				dimColor[i++] = chromaColor.brighten(j);
				if (i == 10) continue;
				dimColor[i++] = chromaColor.darken(j);

			}
			colorList = darkColor.concat(dimColor);
			return colorList;
		},
		/**
		 * getting final logo Template which one save
		 * @param {\} logoObj 
		 */
		getFinalLogoTemplate: function (logoObj, savetime) {
			if (typeof logoObj.templatePath.iconFrameBox === 'undefined') {
				logoObj.templatePath.iconFrameBox = {};
				logoObj.templatePath.iconFrameBox.x = 0;
				logoObj.templatePath.iconFrameBox.y = 0;
				logoObj.templatePath.iconFrameBoxScale = 1;

				logoObj.templatePath.updates.iconFrameBox = {};
				logoObj.templatePath.updates.iconFrameBox.x = 0;
				logoObj.templatePath.updates.iconFrameBox.y = 0;
				logoObj.templatePath.updates.iconFrameBox.scale = 1;
			}
			var idKey = logoMakerFunction.genRandomId();
			var getSVGTag = logoMakerFunction.getDynamicSvgTag();
			var template = null;
			if (getSVGTag != "") {
				template = getSVGTag;
			} else {
				template = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';
			}

			template += '<rect x="0px" y="0px" width="100%" height="100%" fill="{{svgColor}}"/>';
			if (logoObj.bgPattern) {
				template += dh_lm_common_utility.appendPatternInLogo(logoObj.bgPattern, uniqClassNameForPattern);
			}
			template += '<g class="logo-container-box logoContainerBox" transform="scale({{logoContainerScale}}) translate({{logoContainerX}},{{logoContainerY}})">';

			if (logoObj.templatePath.isFrame == 1) {
				template += '<g class="container_1" transform="scale({{frameScale}}) translate({{frameX}},{{frameY}})"  fill="{{frameFill}}">{{frameHtml}}</g>';
			}
			template += '<g class="containerBody" transform="scale({{containerBodyScale}}) translate({{containerBodyX}},{{containerBodyY}})" >';
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template += '<g class="sampleIconBox" transform="scale({{iconFrameBoxScale}}) translate({{iconFrameBoxX}},{{iconFrameBoxY}})">';
				if (logoObj.templatePath.isIconFrame == 1) {
					template += '<g class="iconFrame" transform="scale({{iconFrameScale}}) translate({{iconFrameX}},{{iconFrameY}})"  fill="{{iconFrameFill}}">{{iconFrameHtml}}</g>';
				}
				template += '<g class="sampleIcons_1" transform="scale({{iconScale}}) translate({{iconX}},{{iconY}})" fill="{{iconFill}}">{{iconHtml}}</g>';
				template += '</g>';
			}
			template += '<g class="sampleTexts_1" transform="scale({{textAndSloganScale}}) translate({{textAndSloganX}},{{textAndSloganY}})">';

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template += '<g class="logo--name svgLogoName_1 logoNameBox1" transform="scale({{text1Scale}}) translate({{text1X}},{{text1Y}})" fill="{{text1Fill}}">{{text1Html}}</g>';

				template += '<g class="logo--name svgLogoName_2 logoNameBox2" transform="scale({{text2Scale}}) translate({{text2X}},{{text2Y}})" fill="{{text2Fill}}">{{text2Html}}</g>';
			} else {
				template += '<g class="logo--name svgLogoName_1 logoNameBox" transform="scale({{textScale}}) translate({{textX}},{{textY}})" fill="{{textFill}}">{{textHtml}}</g>';
			}

			template += '<g id="" class="logo--name svgSloganText_1 sloganBox" transform="scale({{sloganScale}}) translate({{sloganX}},{{sloganY}})" fill="{{sloganFill}}">{{sloganHtml}}</g>';
			template += '</g>';
			template += '</g>';
			template += '</g>';
			template += '</svg>';

			if (logoObj.textGradient != "") {
				logoObj.mainTextColor = 'url(#textGradient' + idKey + ')';
			}
			if ((logoObj.templatePath.isDBLineCompanyText == "yes") && (logoObj.text2Gradient != "")) {
				logoObj.mainText2Color = 'url(#text2Gradient' + idKey + ')';
			}

			if (logoObj.sloganGradient != "") {
				logoObj.sloganTextColor = 'url(#sloganGradient' + idKey + ')';
			}
			if (logoObj.frameGradient != "") {
				logoObj.frameColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.iconFrameGradient != "") {
				logoObj.iconFrameColor = 'url(#iconFrameGradient' + idKey + ')';
			}
			if (logoObj.iconGradient != "") {
				logoObj.iconColor = 'url(#iconGradient' + idKey + ')';
			}
			if (logoObj.frameFilledGradient != "" && logoObj.templatePath.frameType == "filled") {
				logoObj.frameFilledColor = 'url(#frameGradient' + idKey + ')';
			}

			//apply gradients to the template

			template = this.applyGradientToTemplate(template, logoObj, idKey);


			template = template.replace("{{svgColor}}", logoObj.bgColor);

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1Html}}", logoObj.logoPath1);
				template = template.replace("{{text2Html}}", logoObj.logoPath2);

				template = template.replace("{{text1Fill}}", logoObj.mainTextColor);
				template = template.replace("{{text2Fill}}", logoObj.mainText2Color);

			} else {
				template = template.replace("{{textHtml}}", logoObj.logoPath);
				template = template.replace("{{textFill}}", logoObj.mainTextColor);
			}


			template = template.replace("{{sloganHtml}}", logoObj.sloganPath);
			template = template.replace("{{sloganFill}}", logoObj.sloganTextColor);

			template = template.replace("{{frameHtml}}", logoObj.framePath);

			if (logoObj.templatePath.frameType == "filled") {
				//	alert(logoObj.frameFilledColor);
				template = template.replace("{{frameFill}}", logoObj.frameFilledColor);
			} else {
				template = template.replace("{{frameFill}}", logoObj.frameColor);
			}
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				let iconSVGPath = dh_lm_common_utility.removeFillFromIconSvg(logoObj.iconPath, logoObj.iconColor);
				template = template.replace("{{iconHtml}}", iconSVGPath);
				template = template.replace("{{iconFill}}", logoObj.iconColor);
				template = template.replace("{{iconX}}", logoObj.templatePath.icon.x);
				template = template.replace("{{iconY}}", logoObj.templatePath.icon.y);
				template = template.replace("{{iconScale}}", logoObj.templatePath.icon.scale);

				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameBoxX}}", logoObj.templatePath.iconFrameBox.x);
				template = template.replace("{{iconFrameBoxY}}", logoObj.templatePath.iconFrameBox.y);
				template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBox.scale);
			}
			if (logoObj.templatePath.isIconFrame == 1) {
				template = template.replace("{{iconFrameHtml}}", logoObj.iconFramePath);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameX}}", logoObj.templatePath.iconFrame.x);
				template = template.replace("{{iconFrameY}}", logoObj.templatePath.iconFrame.y);
				template = template.replace("{{iconFrameScale}}", logoObj.templatePath.iconFrame.scale);
			}

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1X}}", logoObj.templatePath.text1.x);
				template = template.replace("{{text1Y}}", logoObj.templatePath.text1.y);
				template = template.replace("{{text1Scale}}", logoObj.templatePath.text1.scale);

				template = template.replace("{{text2X}}", logoObj.templatePath.text2.x);
				template = template.replace("{{text2Y}}", logoObj.templatePath.text2.y);
				template = template.replace("{{text2Scale}}", logoObj.templatePath.text2.scale);
			} else {
				template = template.replace("{{textX}}", logoObj.templatePath.text.x);
				template = template.replace("{{textY}}", logoObj.templatePath.text.y);
				template = template.replace("{{textScale}}", logoObj.templatePath.text.scale);
			}



			template = template.replace("{{sloganX}}", logoObj.templatePath.slogan.x);
			template = template.replace("{{sloganY}}", logoObj.templatePath.slogan.y);
			template = template.replace("{{sloganScale}}", logoObj.templatePath.slogan.scale);

			template = template.replace("{{textAndSloganX}}", logoObj.templatePath.textAndSlogan.x);
			template = template.replace("{{textAndSloganY}}", logoObj.templatePath.textAndSlogan.y);
			template = template.replace("{{textAndSloganScale}}", logoObj.templatePath.textAndSlogan.scale);

			template = template.replace("{{containerBodyX}}", logoObj.templatePath.containerBody.x);
			template = template.replace("{{containerBodyY}}", logoObj.templatePath.containerBody.y);
			template = template.replace("{{containerBodyScale}}", logoObj.templatePath.containerBody.scale);

			template = template.replace("{{logoContainerX}}", logoObj.templatePath.logoContainer.x);
			template = template.replace("{{logoContainerY}}", logoObj.templatePath.logoContainer.y);
			template = template.replace("{{logoContainerScale}}", logoObj.templatePath.logoContainer.scale);

			template = template.replace("{{frameX}}", logoObj.templatePath.frame.x);
			template = template.replace("{{frameY}}", logoObj.templatePath.frame.y);
			template = template.replace("{{frameScale}}", logoObj.templatePath.frame.scale);

			if (savetime) {
				let tempDiv = document.createElement('div');
				tempDiv.innerHTML = template;
				let svg = tempDiv.querySelector('svg');
				svg.removeAttribute('width');
				svg.removeAttribute('height');
				svg.removeAttribute('x');
				svg.removeAttribute('y');
				template = tempDiv.innerHTML;
			}

			return template;

		},
		/**
		 * 
		 * @param {*} type 
		 */
		getGradientStops: function (type) {
			var stops = '';
			var gradientStops = gradientsArray[type] ? gradientsArray[type].stops : [];

			stops = gradientStops.reduce((accm, item) => {
				return accm + '<stop offset="' + item.offset + '" stop-color="' + item.color + '" />';
			}, '');

			return stops;
		},
		/**
		 * 
		 * @param {*} template 
		 * @param {*} logoObj 
		 * @param {*} idKey 
		 */
		applyGradientToTemplate: function (template, logoObj, idKey) {
			if (!logoObj.textGradient || logoObj.textGradient == '') {
				template = template.replace("{{textGradient}}", '');
			}
			else {
				var stops = this.getGradientStops(logoObj.textGradient);
				template = template.replace("{{textGradient}}", '<defs><linearGradient id="textGradient' + idKey + '">' + stops + '</linearGradient></defs>');
			}
			// Company text2 gradient section
			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				if (!logoObj.text2Gradient || logoObj.text2Gradient == '') {
					template = template.replace("{{text2Gradient}}", '');
				}
				else {
					var stops = this.getGradientStops(logoObj.text2Gradient);
					template = template.replace("{{text2Gradient}}", '<defs><linearGradient id="text2Gradient' + idKey + '">' + stops + '</linearGradient></defs>');
				}
			}

			//Slogan text gradient section
			if (!logoObj.sloganGradient || logoObj.sloganGradient == '') {
				template = template.replace("{{sloganGradient}}", '');
			}
			else {
				var stops = this.getGradientStops(logoObj.sloganGradient);

				template = template.replace("{{sloganGradient}}", '<defs><linearGradient id="sloganGradient' + idKey + '">' + stops + '</linearGradient></defs>');
			}
			// Frame gradient section
			if (logoObj.templatePath.frameType == "filled") {
				if (!logoObj.frameFilledGradient || logoObj.frameFilledGradient == '') {
					template = template.replace("{{frameGradient}}", '');
				}
				else {
					var stops = this.getGradientStops(logoObj.frameFilledGradient);

					template = template.replace("{{frameGradient}}", '<defs><linearGradient id="frameGradient' + idKey + '">' + stops + '</linearGradient></defs>');
				}
			}
			else {
				if (!logoObj.frameGradient || logoObj.frameGradient == '') {
					template = template.replace("{{frameGradient}}", '');
				}
				else {
					var stops = this.getGradientStops(logoObj.frameGradient);

					template = template.replace("{{frameGradient}}", '<defs><linearGradient id="frameGradient' + idKey + '">' + stops + '</linearGradient></defs>');
				}
			}

			if (!logoObj.iconFrameGradient || logoObj.iconFrameGradient == '') {
				template = template.replace("{{iconFrameGradient}}", '');
			}
			else {
				var stops = this.getGradientStops(logoObj.iconFrameGradient);

				template = template.replace("{{iconFrameGradient}}", '<defs><linearGradient id="iconFrameGradient' + idKey + '">' + stops + '</linearGradient></defs>');
			}

			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				if (!logoObj.iconGradient || logoObj.iconGradient == '') {
					template = template.replace("{{iconGradient}}", '');
				}
				else {
					var stops = this.getGradientStops(logoObj.iconGradient);

					template = template.replace("{{iconGradient}}", '<defs><linearGradient id="iconGradient' + idKey + '">' + stops + '</linearGradient></defs>');
				}
			}

			return template;
		},
		/**
		 * updated svg by single type as frame, company name, iconframe , slogan name 
		 * @param {*} currLogo 
		 * @param {*} $for 
		 * @param {*} idKey 
		 */
		generateLogoTemplateByOption: function (currLogo, $for, idKey, p_oCurrContainerBodyObj, p_oCurrLogoContainerObj, p_sActionType = "") {
			if ($for != 'frame') {
				currLogo = updateCurrLogoObject(currLogo);
			} else {
				if (typeof currLogo.generate.templatePath.updates.frame === "undefined") {
					currLogo.generate.templatePath.updates.frame = {};
				}
			}
			var logoObj = currLogo.generate;
			if (typeof logoObj.templatePath.iconFrameBox === 'undefined') {
				logoObj.templatePath.iconFrameBox = {};
				logoObj.templatePath.iconFrameBox.x = 0;
				logoObj.templatePath.iconFrameBox.y = 0;
				logoObj.templatePath.iconFrameBoxScale = 1;

				logoObj.templatePath.updates.iconFrameBox = {};
				logoObj.templatePath.updates.iconFrameBox.x = 0;
				logoObj.templatePath.updates.iconFrameBox.y = 0;
				logoObj.templatePath.updates.iconFrameBox.scale = 1;
			}

			if (p_sActionType === "addOuterContainer" || p_sActionType === "palettsColorVariation") {
				if (logoObj.templatePath.frameType == "filled") {
					if (logoObj.bgColor === logoObj.frameFilledColor) {
						var filledFrameColorList = logoMakerFunction.getFilledFrameColor(logoObj);
						if (filledFrameColorList[1]) {
							logoObj.frameFilledColor = "";
							logoObj.frameFilledGradient = "";
							if (filledFrameColorList[0]) {
								// gradient
								logoObj.frameFilledGradient = filledFrameColorList[1];
							} else {
								logoObj.frameFilledColor = filledFrameColorList[1];
							}
							logoObj.textGradient = "";
							logoObj.text2Gradient = "";
							logoObj.sloganGradient = "";
							logoObj.iconGradient = "";
							logoObj.frameGradient = ""; // outline frame
							logoObj.iconFrameGradient = "";

							logoObj.mainTextColor = logoObj.bgColor;
							logoObj.mainText2Color = logoObj.bgColor;
							logoObj.sloganTextColor = logoObj.bgColor;
							logoObj.iconColor = logoObj.bgColor;

							logoObj.frameColor = logoObj.bgColor;
							logoObj.iconFrameColor = logoObj.bgColor;

						}
					}
					else if
						(
						(logoObj.bgColor !== logoObj.frameFilledColor) &&
						(!gradientsArray[logoObj.frameFilledColor]) &&
						(
							(logoObj.frameFilledColor === logoObj.mainTextColor) ||
							(logoObj.frameFilledColor === logoObj.mainText2Color) ||
							(logoObj.frameFilledColor === logoObj.sloganTextColor) ||
							(logoObj.frameFilledColor === logoObj.iconColor)
						)
					) {
						let frmFilledColor = lEditor.currentLogo.generate.frameFilledColor;
						logoObj.frameFilledGradient = "";
						logoObj.frameFilledColor = logoObj.bgColor;
						logoObj.bgColor = frmFilledColor;
					} else {

					}
				}
			}
			var obj = {};
			var getSVGTag = logoMakerFunction.getDynamicSvgTag();
			var template = null;
			if (getSVGTag != "") {
				template = getSVGTag;
			} else {
				template = '<svg version="1.1" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';
			}

			template += '<rect x="0px" y="0px" width="100%" height="100%" fill="{{svgColor}}"/>';
			template += '<g class="logo-container-box logoContainerBox" transform="scale({{logoContainerScale}}) translate({{logoContainerX}},{{logoContainerY}})">';
			if (logoObj.templatePath.isFrame == 1) {
				template += '<g class="container_1" transform="scale({{frameScale}}) translate({{frameX}},{{frameY}})"  fill="{{frameFill}}">{{frameHtml}}</g>';
			}
			template += '<g class="containerBody" transform="scale({{containerBodyScale}}) translate({{containerBodyX}},{{containerBodyY}})" >';
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template += '<g class="sampleIconBox" transform="scale({{iconFrameBoxScale}}) translate({{iconFrameBoxX}},{{iconFrameBoxY}})">';
				if (logoObj.templatePath.isIconFrame == 1) {
					template += '<g class="iconFrame" transform="scale({{iconFrameScale}}) translate({{iconFrameX}},{{iconFrameY}})"  fill="{{iconFrameFill}}">{{iconFrameHtml}}</g>';
				}
				template += '<g class="sampleIcons_1" transform="scale({{iconScale}}) translate({{iconX}},{{iconY}})" fill="{{iconFill}}">{{iconHtml}}</g>';
				template += '</g>';
			}
			template += '<g class="sampleTexts_1" transform="scale({{textAndSloganScale}}) translate({{textAndSloganX}},{{textAndSloganY}})">';

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template += '<g class="logo--name svgLogoName_1 logoNameBox1" transform="scale({{text1Scale}}) translate({{text1X}},{{text1Y}})" fill="{{text1Fill}}">{{text1Html}}</g>';

				template += '<g class="logo--name svgLogoName_2 logoNameBox2" transform="scale({{text2Scale}}) translate({{text2X}},{{text2Y}})" fill="{{text2Fill}}">{{text2Html}}</g>';
			} else {
				template += '<g class="logo--name svgLogoName_1 logoNameBox" transform="scale({{textScale}}) translate({{textX}},{{textY}})" fill="{{textFill}}">{{textHtml}}</g>';
			}

			template += '<g id="" class="logo--name svgSloganText_1 sloganBox" transform="scale({{sloganScale}}) translate({{sloganX}},{{sloganY}})" fill="{{sloganFill}}">{{sloganHtml}}</g>';
			template += '</g>';
			template += '</g>';
			template += '</g>';
			template += '</svg>';

			if (logoObj.textGradient != "") {
				logoObj.mainTextColor = 'url(#textGradient' + idKey + ')';
			}

			if ((logoObj.templatePath.isDBLineCompanyText == "yes") && (logoObj.text2Gradient != "")) {
				logoObj.mainText2Color = 'url(#text2Gradient' + idKey + ')';
			}
			if (logoObj.sloganGradient != "") {
				logoObj.sloganTextColor = 'url(#sloganGradient' + idKey + ')';
			}
			if (logoObj.frameGradient != "") {
				logoObj.frameColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.iconGradient != "") {
				logoObj.iconColor = 'url(#iconGradient' + idKey + ')';
			}
			if (logoObj.iconFrameGradient != "") {
				logoObj.iconFrameColor = 'url(#iconFrameGradient' + idKey + ')';
			}
			if (logoObj.frameFilledGradient != "" && logoObj.templatePath.frameType == "filled") {
				logoObj.frameFilledColor = 'url(#frameGradient' + idKey + ')';
			}

			//apply gradient to template
			template = this.applyGradientToTemplate(template, logoObj, idKey);
			template = template.replace("{{svgColor}}", logoObj.bgColor);

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1Html}}", logoObj.logoPath1);
				template = template.replace("{{text2Html}}", logoObj.logoPath2);

				template = template.replace("{{text1Fill}}", logoObj.mainTextColor);
				template = template.replace("{{text2Fill}}", logoObj.mainText2Color);
			} else {
				template = template.replace("{{textHtml}}", logoObj.logoPath);
				template = template.replace("{{textFill}}", logoObj.mainTextColor);
			}
			template = template.replace("{{sloganHtml}}", logoObj.sloganPath);
			template = template.replace("{{sloganFill}}", logoObj.sloganTextColor);
			template = template.replace("{{frameHtml}}", logoObj.framePath);
			if (logoObj.templatePath.frameType == "filled") {
				template = template.replace("{{frameFill}}", logoObj.frameFilledColor);
			} else {
				template = template.replace("{{frameFill}}", logoObj.frameColor);
			}
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				let iconSVGPath = dh_lm_common_utility.removeFillFromIconSvg(logoObj.iconPath, logoObj.iconColor);
				template = template.replace("{{iconHtml}}", iconSVGPath);
				template = template.replace("{{iconFill}}", logoObj.iconColor);
				template = template.replace("{{iconX}}", logoObj.templatePath.icon.x);
				template = template.replace("{{iconY}}", logoObj.templatePath.icon.y);
				template = template.replace("{{iconScale}}", logoObj.templatePath.icon.scale);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameBoxX}}", logoObj.templatePath.iconFrameBox.x);
				template = template.replace("{{iconFrameBoxY}}", logoObj.templatePath.iconFrameBox.y);
				if (logoObj.templatePath.isIconFrame == 1) {
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBox.scale);
				} else {
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBoxScale);
				}
			}
			if (logoObj.templatePath.isIconFrame == 1) {
				template = template.replace("{{iconFrameHtml}}", logoObj.iconFramePath);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameX}}", logoObj.templatePath.iconFrame.x);
				template = template.replace("{{iconFrameY}}", logoObj.templatePath.iconFrame.y);
				template = template.replace("{{iconFrameScale}}", logoObj.templatePath.iconFrame.scale);
			}
			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1X}}", logoObj.templatePath.text1.x);
				template = template.replace("{{text1Y}}", logoObj.templatePath.text1.y);
				template = template.replace("{{text1Scale}}", logoObj.templatePath.text1.scale);
				template = template.replace("{{text2X}}", logoObj.templatePath.text2.x);
				template = template.replace("{{text2Y}}", logoObj.templatePath.text2.y);
				template = template.replace("{{text2Scale}}", logoObj.templatePath.text2.scale);
			} else {
				template = template.replace("{{textX}}", logoObj.templatePath.text.x);
				template = template.replace("{{textY}}", logoObj.templatePath.text.y);
				template = template.replace("{{textScale}}", logoObj.templatePath.text.scale);
			}
			template = template.replace("{{sloganX}}", logoObj.templatePath.slogan.x);
			template = template.replace("{{sloganY}}", logoObj.templatePath.slogan.y);
			template = template.replace("{{sloganScale}}", logoObj.templatePath.slogan.scale);

			template = template.replace("{{textAndSloganX}}", logoObj.templatePath.textAndSlogan.x);
			template = template.replace("{{textAndSloganY}}", logoObj.templatePath.textAndSlogan.y);
			template = template.replace("{{textAndSloganScale}}", logoObj.templatePath.textAndSlogan.scale);

			template = template.replace("{{containerBodyX}}", logoObj.templatePath.containerBody.x);
			template = template.replace("{{containerBodyY}}", logoObj.templatePath.containerBody.y);
			template = template.replace("{{containerBodyScale}}", logoObj.templatePath.containerBody.scale);

			template = template.replace("{{logoContainerX}}", logoObj.templatePath.logoContainer.x);
			template = template.replace("{{logoContainerY}}", logoObj.templatePath.logoContainer.y);
			template = template.replace("{{logoContainerScale}}", logoObj.templatePath.logoContainer.scale);

			template = template.replace("{{frameX}}", logoObj.templatePath.frame.x);
			template = template.replace("{{frameY}}", logoObj.templatePath.frame.y);

			if (logoObj.templatePath.frame.scale) {
				template = template.replace("{{frameScale}}", logoObj.templatePath.frame.scale);
			} else {
				template = template.replace("{{frameScale}}", 1);
			}
			$("#templateGenerator").html(template);
			let sloganTxt = lEditor.getSession("sloganText");
			if ($for == 'frame') {
				if (logoObj.templatePath.isFrame == 1) {

					if (logoObj.templatePath.isEqual == 1 && logoObj.templatePath.sloganSetAsPerText == 1 && logoMakerFunction.checkTemplateIsEqualCondition(logoObj) && p_sActionType == "addOuterContainer") {
						var textGSloganWidthDiff = 1;
						var sloganGTextWidthDiff = 1;
						var isEqualCaseTextWidth;
						if (logoObj.templatePath.isDBLineCompanyText == "yes") {
							isEqualCaseTextWidth = Math.max(parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width), parseInt($('#templateGenerator  .svgLogoName_2').get(0).getBBox().width))
						} else {
							isEqualCaseTextWidth = parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width);
						}
						var isEqualCaseSloganWidth = parseInt($('#templateGenerator  .svgSloganText_1').get(0).getBBox().width);
						if (isEqualCaseTextWidth > isEqualCaseSloganWidth) {
							textGSloganWidthDiff = (isEqualCaseTextWidth / isEqualCaseSloganWidth);
						} else {
							sloganGTextWidthDiff = (isEqualCaseSloganWidth / isEqualCaseTextWidth);
						}
						if (logoObj.templatePath.isDBLineCompanyText == "yes") {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text1.x = obj.x;
							logoObj.templatePath.updates.text1.y = obj.y;
							logoObj.templatePath.updates.text1.scale = obj.scale;

							obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text2.x = obj.x;
							logoObj.templatePath.updates.text2.y = obj.y;
							logoObj.templatePath.updates.text2.scale = obj.scale;
						} else {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text.x = obj.x;
							logoObj.templatePath.updates.text.y = obj.y;
							logoObj.templatePath.updates.text.scale = obj.scale;
						}
						obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', textGSloganWidthDiff);
						logoObj.templatePath.updates.slogan.x = obj.x;
						logoObj.templatePath.updates.slogan.y = obj.y;
						logoObj.templatePath.updates.slogan.scale = obj.scale;

					} else {
						if (lEditor.currentLogo.generate.textSloganDistSlider > constantVars.ORIGINAL_SPACING.textSloganDistSlider && (lEditor.currentLogo.generate.templatePath.isIcon == 1 || lEditor.currentLogo.generate.templatePath.isMono == 1) && (p_sActionType == "addOuterContainer")) {
							obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
							logoObj.templatePath.updates.slogan.x = obj.x;
							logoObj.templatePath.updates.slogan.y = obj.y;
							logoObj.templatePath.updates.slogan.scale = obj.scale;
						} else {
							if (p_sActionType == 'addOuterContainer' && (lEditor.currentLogo.generate.isArc == 1)) {

								obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
								logoObj.templatePath.updates.text.x = obj.x;
								logoObj.templatePath.updates.text.y = obj.y;
								logoObj.templatePath.updates.text.scale = obj.scale;

								if (sloganTxt && sloganTxt.length > 0) {
									obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', (0));
									logoObj.templatePath.updates.slogan.x = obj.x;
									logoObj.templatePath.updates.slogan.y = obj.y;
									logoObj.templatePath.updates.slogan.scale = obj.scale;
								}
							}

						}

					}

					if (p_sActionType == "addOuterContainer") {
						if ((logoObj.templatePath.isIcon == 1) || (logoObj.templatePath.isMono == 1)) {
							if (logoObj.templatePath.isIconFrame == 1) {
								obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
								logoObj.templatePath.updates.iconFrameBox.x = obj.x;
								logoObj.templatePath.updates.iconFrameBox.y = obj.y;
								logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
							} else {
								obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'icon');

								logoObj.templatePath.updates.icon.x = obj.x;
								logoObj.templatePath.updates.icon.y = obj.y;
								logoObj.templatePath.updates.icon.scale = obj.scale;
							}
						}
					}

					obj = updateGroupSize($('#templateGenerator  .container_1'), logoObj.templatePath, 'frame', 0);
					logoObj.templatePath.updates.frame.x = obj.x;
					logoObj.templatePath.updates.frame.y = obj.y;
					logoObj.templatePath.updates.frame.scale = obj.scale;
					if (p_oCurrContainerBodyObj) {
						obj = updateGroupSizeByLastValue($('#templateGenerator  .containerBody'), p_oCurrContainerBodyObj)
					} else {
						obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
					}
					logoObj.templatePath.updates.containerBody.x = obj.x;
					logoObj.templatePath.updates.containerBody.y = obj.y;
					logoObj.templatePath.updates.containerBody.scale = obj.scale;

					if (p_oCurrLogoContainerObj) {
						obj = updateGroupSizeByLastValue($('#templateGenerator  .logoContainerBox'), p_oCurrLogoContainerObj)
					} else {
						obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
					}
					logoObj.templatePath.updates.logoContainer.x = obj.x;
					logoObj.templatePath.updates.logoContainer.y = obj.y;
					logoObj.templatePath.updates.logoContainer.scale = obj.scale;
				}
			}

			if ($for == 'logoName' || $for == "logoName2" || $for == "logoName1") {
				if (logoObj.templatePath.isEqual == 1) {
					switch (p_sActionType) {
						case "logoNameFont":
							if (logoObj.templatePath.sloganSetAsPerText == 1) {
								var textGSloganWidthDiff = 1;
								var sloganGTextWidthDiff = 1;
								if (logoMakerFunction.checkTemplateIsEqualCondition(logoObj)) {
									var isEqualCaseTextWidth = 0;
									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										isEqualCaseTextWidth = Math.max(parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width), parseInt($('#templateGenerator  .svgLogoName_2').get(0).getBBox().width))
									} else {
										isEqualCaseTextWidth = parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width);
									}

									var isEqualCaseSloganWidth = parseInt($('#templateGenerator  .svgSloganText_1').get(0).getBBox().width);
									if (isEqualCaseTextWidth > isEqualCaseSloganWidth) {
										textGSloganWidthDiff = (isEqualCaseTextWidth / isEqualCaseSloganWidth);
									} else {
										sloganGTextWidthDiff = (isEqualCaseSloganWidth / isEqualCaseTextWidth);
									}

									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text1.x = obj.x;
										logoObj.templatePath.updates.text1.y = obj.y;
										logoObj.templatePath.updates.text1.scale = obj.scale;

										obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text2.x = obj.x;
										logoObj.templatePath.updates.text2.y = obj.y;
										logoObj.templatePath.updates.text2.scale = obj.scale;
									} else {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text.x = obj.x;
										logoObj.templatePath.updates.text.y = obj.y;
										logoObj.templatePath.updates.text.scale = obj.scale;
									}

									obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', textGSloganWidthDiff);
									logoObj.templatePath.updates.slogan.x = obj.x;
									logoObj.templatePath.updates.slogan.y = obj.y;
									logoObj.templatePath.updates.slogan.scale = obj.scale;
								} else {
									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
										logoObj.templatePath.updates.text1.x = obj.x;
										logoObj.templatePath.updates.text1.y = obj.y;
										logoObj.templatePath.updates.text1.scale = obj.scale;

										obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
										logoObj.templatePath.updates.text2.x = obj.x;
										logoObj.templatePath.updates.text2.y = obj.y;
										logoObj.templatePath.updates.text2.scale = obj.scale;
									} else {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
										logoObj.templatePath.updates.text.x = obj.x;
										logoObj.templatePath.updates.text.y = obj.y;
										logoObj.templatePath.updates.text.scale = obj.scale;
									}

									obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
									logoObj.templatePath.updates.slogan.x = obj.x;
									logoObj.templatePath.updates.slogan.y = obj.y;
									logoObj.templatePath.updates.slogan.scale = obj.scale;

									obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
									logoObj.templatePath.updates.textAndSlogan.x = obj.x;
									logoObj.templatePath.updates.textAndSlogan.y = obj.y;
									logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;
								}
							}
							else {
								if (logoObj.templatePath.isDBLineCompanyText == "yes") {
									obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
									logoObj.templatePath.updates.text1.x = obj.x;
									logoObj.templatePath.updates.text1.y = obj.y;
									logoObj.templatePath.updates.text1.scale = obj.scale;

									obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
									logoObj.templatePath.updates.text2.x = obj.x;
									logoObj.templatePath.updates.text2.y = obj.y;
									logoObj.templatePath.updates.text2.scale = obj.scale;
								} else {
									obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
									logoObj.templatePath.updates.text.x = obj.x;
									logoObj.templatePath.updates.text.y = obj.y;
									logoObj.templatePath.updates.text.scale = obj.scale;
								}

								obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
								logoObj.templatePath.updates.slogan.x = obj.x;
								logoObj.templatePath.updates.slogan.y = obj.y;
								logoObj.templatePath.updates.slogan.scale = obj.scale;

								obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
								logoObj.templatePath.updates.textAndSlogan.x = obj.x;
								logoObj.templatePath.updates.textAndSlogan.y = obj.y;
								logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;
							}
							if (logoObj.templatePath.isFrame == 1) {
								obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
								logoObj.templatePath.updates.containerBody.x = obj.x;
								logoObj.templatePath.updates.containerBody.y = obj.y;
								logoObj.templatePath.updates.containerBody.scale = obj.scale;
							} else {
								obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
								logoObj.templatePath.updates.logoContainer.x = obj.x;
								logoObj.templatePath.updates.logoContainer.y = obj.y;
								logoObj.templatePath.updates.logoContainer.scale = obj.scale;
							}
							break;
						case "logoLetterSpacing":
						case "logoTextSlider":
						case "logoNameChange":
						default:
							if (logoObj.templatePath.isDBLineCompanyText == "yes") {
								obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
								logoObj.templatePath.updates.text1.x = obj.x;
								logoObj.templatePath.updates.text1.y = obj.y;
								logoObj.templatePath.updates.text1.scale = obj.scale;

								obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
								logoObj.templatePath.updates.text2.x = obj.x;
								logoObj.templatePath.updates.text2.y = obj.y;
								logoObj.templatePath.updates.text2.scale = obj.scale;
							} else {
								obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
								logoObj.templatePath.updates.text.x = obj.x;
								logoObj.templatePath.updates.text.y = obj.y;
								logoObj.templatePath.updates.text.scale = obj.scale;
							}
							break;
					}
				} else {
					if (logoObj.templatePath.isDBLineCompanyText == "yes") {
						obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
						logoObj.templatePath.updates.text1.x = obj.x;
						logoObj.templatePath.updates.text1.y = obj.y;
						logoObj.templatePath.updates.text1.scale = obj.scale;

						obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
						logoObj.templatePath.updates.text2.x = obj.x;
						logoObj.templatePath.updates.text2.y = obj.y;
						logoObj.templatePath.updates.text2.scale = obj.scale;
					} else {
						obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
						logoObj.templatePath.updates.text.x = obj.x;
						logoObj.templatePath.updates.text.y = obj.y;
						logoObj.templatePath.updates.text.scale = obj.scale;
					}
					if (p_sActionType == "logoNameFont") {
						obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
						logoObj.templatePath.updates.slogan.x = obj.x;
						logoObj.templatePath.updates.slogan.y = obj.y;
						logoObj.templatePath.updates.slogan.scale = obj.scale;

						obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
						logoObj.templatePath.updates.textAndSlogan.x = obj.x;
						logoObj.templatePath.updates.textAndSlogan.y = obj.y;
						logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;

						if (logoObj.templatePath.isFrame == 1) {
							obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
							logoObj.templatePath.updates.containerBody.x = obj.x;
							logoObj.templatePath.updates.containerBody.y = obj.y;
							logoObj.templatePath.updates.containerBody.scale = obj.scale;
						} else {
							obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
							logoObj.templatePath.updates.logoContainer.x = obj.x;
							logoObj.templatePath.updates.logoContainer.y = obj.y;
							logoObj.templatePath.updates.logoContainer.scale = obj.scale;
						}
					}
				}
			}

			if ($for == 'sloganName') {
				if (logoObj.templatePath.isEqual == 1) {
					switch (p_sActionType) {
						case "sloganNameFont":
							if (logoObj.templatePath.sloganSetAsPerText == 1) {
								; var textGSloganWidthDiff = 1;
								var sloganGTextWidthDiff = 1;
								if (logoMakerFunction.checkTemplateIsEqualCondition(logoObj)) {
									var isEqualCaseTextWidth = 0;
									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										isEqualCaseTextWidth = Math.max(parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width), parseInt($('#templateGenerator  .svgLogoName_2').get(0).getBBox().width))
									} else {
										isEqualCaseTextWidth = parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width);
									}

									var isEqualCaseSloganWidth = parseInt($('#templateGenerator  .svgSloganText_1').get(0).getBBox().width);
									if (isEqualCaseTextWidth > isEqualCaseSloganWidth) {
										textGSloganWidthDiff = (isEqualCaseTextWidth / isEqualCaseSloganWidth);
									} else {
										sloganGTextWidthDiff = (isEqualCaseSloganWidth / isEqualCaseTextWidth);
									}

									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text1.x = obj.x;
										logoObj.templatePath.updates.text1.y = obj.y;
										logoObj.templatePath.updates.text1.scale = obj.scale;

										obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text2.x = obj.x;
										logoObj.templatePath.updates.text2.y = obj.y;
										logoObj.templatePath.updates.text2.scale = obj.scale;
									} else {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', sloganGTextWidthDiff);
										logoObj.templatePath.updates.text.x = obj.x;
										logoObj.templatePath.updates.text.y = obj.y;
										logoObj.templatePath.updates.text.scale = obj.scale;
									}

									obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', textGSloganWidthDiff);
									logoObj.templatePath.updates.slogan.x = obj.x;
									logoObj.templatePath.updates.slogan.y = obj.y;
									logoObj.templatePath.updates.slogan.scale = obj.scale;
									if (logoObj.templatePath.isFrame == 1) {
									} else {
										obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
										logoObj.templatePath.updates.logoContainer.x = obj.x;
										logoObj.templatePath.updates.logoContainer.y = obj.y;
										logoObj.templatePath.updates.logoContainer.scale = obj.scale;
									}
								} else {
									if (logoObj.templatePath.isDBLineCompanyText == "yes") {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
										logoObj.templatePath.updates.text1.x = obj.x;
										logoObj.templatePath.updates.text1.y = obj.y;
										logoObj.templatePath.updates.text1.scale = obj.scale;

										obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
										logoObj.templatePath.updates.text2.x = obj.x;
										logoObj.templatePath.updates.text2.y = obj.y;
										logoObj.templatePath.updates.text2.scale = obj.scale;

									} else {
										obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
										logoObj.templatePath.updates.text.x = obj.x;
										logoObj.templatePath.updates.text.y = obj.y;
										logoObj.templatePath.updates.text.scale = obj.scale;
									}

									obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
									logoObj.templatePath.updates.slogan.x = obj.x;
									logoObj.templatePath.updates.slogan.y = obj.y;
									logoObj.templatePath.updates.slogan.scale = obj.scale;
									if (logoObj.templatePath.isFrame == 1) {
									} else {
										obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
										logoObj.templatePath.updates.logoContainer.x = obj.x;
										logoObj.templatePath.updates.logoContainer.y = obj.y;
										logoObj.templatePath.updates.logoContainer.scale = obj.scale;
									}
								}
							} else {

								if (logoObj.templatePath.isDBLineCompanyText == "yes") {
									obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
									logoObj.templatePath.updates.text1.x = obj.x;
									logoObj.templatePath.updates.text1.y = obj.y;
									logoObj.templatePath.updates.text1.scale = obj.scale;

									obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
									logoObj.templatePath.updates.text2.x = obj.x;
									logoObj.templatePath.updates.text2.y = obj.y;
									logoObj.templatePath.updates.text2.scale = obj.scale;

								} else {
									obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
									logoObj.templatePath.updates.text.x = obj.x;
									logoObj.templatePath.updates.text.y = obj.y;
									logoObj.templatePath.updates.text.scale = obj.scale;
								}

								obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
								logoObj.templatePath.updates.slogan.x = obj.x;
								logoObj.templatePath.updates.slogan.y = obj.y;
								logoObj.templatePath.updates.slogan.scale = obj.scale;
								if (logoObj.templatePath.isFrame == 1) {
								} else {
									obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
									logoObj.templatePath.updates.logoContainer.x = obj.x;
									logoObj.templatePath.updates.logoContainer.y = obj.y;
									logoObj.templatePath.updates.logoContainer.scale = obj.scale;
								}
							}
							if (logoObj.templatePath.isFrame == 1) {
								obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
								logoObj.templatePath.updates.containerBody.x = obj.x;
								logoObj.templatePath.updates.containerBody.y = obj.y;
								logoObj.templatePath.updates.containerBody.scale = obj.scale;
							} else {

								obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
								logoObj.templatePath.updates.logoContainer.x = obj.x;
								logoObj.templatePath.updates.logoContainer.y = obj.y;
								logoObj.templatePath.updates.logoContainer.scale = obj.scale;
							}
							break;
						case "sloganLetterSpacing":
						case "sloganTextSize":
						case "sloganNameChange":
							obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', logoObj.templatePath.updates.slogan.scale);
							logoObj.templatePath.updates.slogan.x = obj.x;
							logoObj.templatePath.updates.slogan.y = obj.y;
							logoObj.templatePath.updates.slogan.scale = obj.scale;
							break;
						default:
							obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
							logoObj.templatePath.updates.slogan.x = obj.x;
							logoObj.templatePath.updates.slogan.y = obj.y;
							logoObj.templatePath.updates.slogan.scale = obj.scale;
							break;
					}
				} else {
					if (p_sActionType == "sloganNameFont") {

						if (logoObj.templatePath.isDBLineCompanyText == "yes") {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
							logoObj.templatePath.updates.text1.x = obj.x;
							logoObj.templatePath.updates.text1.y = obj.y;
							logoObj.templatePath.updates.text1.scale = obj.scale;

							obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
							logoObj.templatePath.updates.text2.x = obj.x;
							logoObj.templatePath.updates.text2.y = obj.y;
							logoObj.templatePath.updates.text2.scale = obj.scale;
						} else {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
							logoObj.templatePath.updates.text.x = obj.x;
							logoObj.templatePath.updates.text.y = obj.y;
							logoObj.templatePath.updates.text.scale = obj.scale;
						}

					}
					obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
					logoObj.templatePath.updates.slogan.x = obj.x;
					logoObj.templatePath.updates.slogan.y = obj.y;
					logoObj.templatePath.updates.slogan.scale = obj.scale;

					if (p_sActionType == "sloganNameFont") {
						if (logoObj.templatePath.isFrame == 1) {
						} else {
							obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
							logoObj.templatePath.updates.logoContainer.x = obj.x;
							logoObj.templatePath.updates.logoContainer.y = obj.y;
							logoObj.templatePath.updates.logoContainer.scale = obj.scale;
						}
					}
				}
			}

			if ((logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) && $for == "icon") {
				if (logoObj.templatePath.sloganSetAsPerText == 1) {
					var textGSloganWidthDiff = 1;
					var sloganGTextWidthDiff = 1;
					if (logoMakerFunction.checkTemplateIsEqualCondition(logoObj)) {
						var isEqualCaseTextWidth;
						if (logoObj.templatePath.isDBLineCompanyText == "yes") {
							isEqualCaseTextWidth = Math.max(parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width), parseInt($('#templateGenerator  .svgLogoName_2').get(0).getBBox().width));
						} else {
							isEqualCaseTextWidth = parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width);
						}
						var isEqualCaseSloganWidth = parseInt($('#templateGenerator  .svgSloganText_1').get(0).getBBox().width);
						if (isEqualCaseTextWidth > isEqualCaseSloganWidth) {
							textGSloganWidthDiff = (isEqualCaseTextWidth / isEqualCaseSloganWidth);
						} else {
							sloganGTextWidthDiff = (isEqualCaseSloganWidth / isEqualCaseTextWidth);
						}

						if (logoObj.templatePath.isDBLineCompanyText == "yes") {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text1.x = obj.x;
							logoObj.templatePath.updates.text1.y = obj.y;
							logoObj.templatePath.updates.text1.scale = obj.scale;

							obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text2.x = obj.x;
							logoObj.templatePath.updates.text2.y = obj.y;
							logoObj.templatePath.updates.text2.scale = obj.scale;
						} else {
							obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', sloganGTextWidthDiff);
							logoObj.templatePath.updates.text.x = obj.x;
							logoObj.templatePath.updates.text.y = obj.y;
							logoObj.templatePath.updates.text.scale = obj.scale;
						}


						obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', textGSloganWidthDiff);
						logoObj.templatePath.updates.slogan.x = obj.x;
						logoObj.templatePath.updates.slogan.y = obj.y;
						logoObj.templatePath.updates.slogan.scale = obj.scale;
					}
				} else {

					if (logoObj.templatePath.isDBLineCompanyText == "yes") {
						obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', 0);
						logoObj.templatePath.updates.text1.x = obj.x;
						logoObj.templatePath.updates.text1.y = obj.y;
						logoObj.templatePath.updates.text1.scale = obj.scale;

						obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', 0);
						logoObj.templatePath.updates.text2.x = obj.x;
						logoObj.templatePath.updates.text2.y = obj.y;
						logoObj.templatePath.updates.text2.scale = obj.scale;
					} else {
						obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', 0);
						logoObj.templatePath.updates.text.x = obj.x;
						logoObj.templatePath.updates.text.y = obj.y;
						logoObj.templatePath.updates.text.scale = obj.scale;
					}

					obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
					logoObj.templatePath.updates.slogan.x = obj.x;
					logoObj.templatePath.updates.slogan.y = obj.y;
					logoObj.templatePath.updates.slogan.scale = obj.scale;
				}

				//
				if ((logoObj.templatePath.tempType == "right" || logoObj.templatePath.tempType == "left") && ((p_sActionType == "changeSymbol") || (p_sActionType == "changemongram"))) {
					logoObj.templatePath.lastSymbolXDistance = undefined
				}
				if ((logoObj.templatePath.tempType == "center") && ((p_sActionType == "changeSymbol") || (p_sActionType == "changemongram"))) {
					logoObj.templatePath.lastSymbolYDistance = undefined
				}
				obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
				logoObj.templatePath.updates.textAndSlogan.x = obj.x;
				logoObj.templatePath.updates.textAndSlogan.y = obj.y;
				logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;


				if (logoObj.templatePath.isIconFrame == 1) {
					obj = updateGroupSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, 'icon', 0);
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;
				} else {
					if (p_sActionType == "changeSymbol") {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'icon');
					}
					else if (p_sActionType == "changemongram") {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'icon');
					}
					else {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'icon');
					}


					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;
				}

				if (logoObj.templatePath.isIconFrame == 1) {
					// obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', constantVars.SPACING.logoSizeSlider);
					// logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					// logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					// logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
					if (p_sActionType == "changeSymbol") {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
					}
					else if (p_sActionType == "changemongram") {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
					}
					else {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');
					}

					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				} else {
					obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				}

				if ((p_sActionType == "changeSymbol" || p_sActionType == "changemongram") && (constantVars.SPACING.logoSizeSlider != constantVars.ORIGINAL_SPACING.logoSizeSlider)) {
					obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
				} else {
					if (p_oCurrContainerBodyObj) {
						obj = updateGroupSizeByLastValue($('#templateGenerator  .containerBody'), p_oCurrContainerBodyObj)
					} else {
						obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
					}
				}
				logoObj.templatePath.updates.containerBody.x = obj.x;
				logoObj.templatePath.updates.containerBody.y = obj.y;
				logoObj.templatePath.updates.containerBody.scale = obj.scale;

				if (p_oCurrLogoContainerObj) {
					obj = updateGroupSizeByLastValue($('#templateGenerator  .logoContainerBox'), p_oCurrLogoContainerObj)
				} else {
					obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
				}
				logoObj.templatePath.updates.logoContainer.x = obj.x;
				logoObj.templatePath.updates.logoContainer.y = obj.y;
				logoObj.templatePath.updates.logoContainer.scale = obj.scale;
			}
			if ($for == "containerBody") {
				obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
				logoObj.templatePath.updates.containerBody.x = obj.x;
				logoObj.templatePath.updates.containerBody.y = obj.y;
				logoObj.templatePath.updates.containerBody.scale = obj.scale;
			}
			if (logoObj.templatePath.tempType == 'left' || logoObj.templatePath.tempType == 'right' || $.trim(logoObj.iconPath) == "") {
				if (logoObj.templatePath.isFrame == 1 && $for == "frame") {
					if (p_sActionType == "addOuterContainer") {
					} else {
						obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', 0);
						logoObj.templatePath.updates.slogan.x = obj.x;
						logoObj.templatePath.updates.slogan.y = obj.y;
						logoObj.templatePath.updates.slogan.scale = obj.scale;

						obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
						logoObj.templatePath.updates.textAndSlogan.x = obj.x;
						logoObj.templatePath.updates.textAndSlogan.y = obj.y;
						logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;

						obj = updateGroupSize($('#templateGenerator  .container_1'), logoObj.templatePath, 'frame', 0);
						logoObj.templatePath.updates.frame.x = obj.x;
						logoObj.templatePath.updates.frame.y = obj.y;
						logoObj.templatePath.updates.frame.scale = obj.scale;

						if (p_oCurrLogoContainerObj) {
							obj = updateGroupSizeByLastValue($('#templateGenerator  .logoContainerBox'), p_oCurrLogoContainerObj)
						} else {
							obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
						}
						logoObj.templatePath.updates.logoContainer.x = obj.x;
						logoObj.templatePath.updates.logoContainer.y = obj.y;
						logoObj.templatePath.updates.logoContainer.scale = obj.scale;
					}

				}
				// if (($for == 'logoName' || $for == 'sloganName') && (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1)) {
				if (($for == 'logoName' || $for == 'logoName1' || $for == 'logoName2' || $for == 'sloganName')) {

					if (logoObj.templatePath.lastTextDistance) {

					} else {
						obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
						logoObj.templatePath.updates.textAndSlogan.x = obj.x;
						logoObj.templatePath.updates.textAndSlogan.y = obj.y;
						logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;
					}
				}

			}
			if (logoObj.templatePath.tempType == 'center') {

				if (p_sActionType == "sloganLetterSpacing" || p_sActionType == "logoLetterSpacing") {

				} else {
					if (lEditor.currentLogo.generate.iconDistanceSlider > constantVars.ORIGINAL_SPACING.iconDistanceSlider && (lEditor.currentLogo.generate.templatePath.isIcon == 1 || lEditor.currentLogo.generate.templatePath.isMono == 1)) {
					} else {
						if (($for == "logoName") && (p_sActionType == "slider")) {

						} else {
							if (logoObj.templatePath.lastTextDistance) {

							} else {
								obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
								logoObj.templatePath.updates.textAndSlogan.x = obj.x;
								logoObj.templatePath.updates.textAndSlogan.y = obj.y;
								logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;
							}
						}
					}
				}
			}

			if ($for == "iconFrame" || $for == "frame") {
				if (logoObj.templatePath.isIconFrame == 1) {
					if (p_sActionType != "addOuterContainer") {
						if (p_sActionType == "changeIconFrameContainer") {
							obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
						} else {
							obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');
						}


						logoObj.templatePath.updates.iconFrameBox.x = obj.x;
						logoObj.templatePath.updates.iconFrameBox.y = obj.y;
						logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
					}


				}
			}
			if (($for == "sloganName") && (p_sActionType == "remove_slogan") && ((lEditor.currentLogo.generate.templatePath.isMono == 1) || (lEditor.currentLogo.generate.templatePath.isIcon == 1))) {
				if (logoObj.templatePath.isIconFrame == 1) {
					obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');
				} else {
					obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
				}
				logoObj.templatePath.updates.iconFrameBox.x = obj.x;
				logoObj.templatePath.updates.iconFrameBox.y = obj.y;
				logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
			}

			if ((($for == "logoName") || ($for == "logoName1") || ($for == "logoName2")) && (lEditor.currentLogo.generate.templatePath.isMono == 1) && (p_sActionType == "logoTextEdit" || p_sActionType == "logoText1Edit" || p_sActionType == "logoText2Edit" || p_sActionType == "undo_redo_logoName" || p_sActionType == "undo_redo_logoName1" || p_sActionType == "undo_redo_logoName2")) {
				if (lEditor.currentLogo.generate.templatePath.isIconFrame == 1) {
					obj = updateGroupSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, 'icon', 0);
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;

					obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');

					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				} else {
					obj = updateGroupSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, 'icon', 0);
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;

					obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				}
			}
			var currentTab = parseInt(lEditor.getSession('targetlink'));
			switch ($for) {
				case "logoName":
					if (currentTab === 8) {
						logoObj.logoTextSlider = constantVars.ORIGINAL_SPACING.logoTextSlider;
						logoObj.logoLetterSpacing = constantVars.ORIGINAL_SPACING.logoLetterSpacing;
					}
					break;

				case "sloganName":
					if (currentTab === 10) {
						logoObj.sloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
						logoObj.sloganTextSize = constantVars.ORIGINAL_SPACING.sloganTextSize;
						logoObj.textSloganDistSlider = constantVars.ORIGINAL_SPACING.textSloganDistSlider;
					}
					break;
				case "icon":
				case "containerBody":
					if (currentTab === 39 || currentTab === 32) {
						logoObj.logoSizeSlider = constantVars.ORIGINAL_SPACING.logoSizeSlider;
						logoObj.iconDistanceSlider = constantVars.ORIGINAL_SPACING.iconDistanceSlider;
					}
					break;

				case "frame":
					if (currentTab === 42) {
						logoObj.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;
					}
					break;
			}
			template = $("#templateGenerator").html();
			$("#templateGenerator").html('');
			return { 'logoObj': logoObj, 'html': template };
		},
		/**
		 * 
		 */
		checkSpecialCondition: function () {
			var sloganName = lEditor.getSession('sloganText');
			var logoName = lEditor.getSession('logoname');
			if (logoName.length > 20 || sloganName.length > 25) {
				return true;
			}
			return false;
		},
		/**
		 * 
		 * @param {*} templatePath 
		 */
		checkTemplateIsEqualCondition: function (p_oGenerate) {
			var sloganName = lEditor.getSession('sloganText');
			var logoText = lEditor.getSession('logoname');
			var logoTextList = lEditor.getLogoTextList(p_oGenerate.splitLogoName);
			var logoNameLength;
			if (p_oGenerate.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
				logoNameLength = Math.max(logoTextList[0].length, logoTextList[1].length);
				if (p_oGenerate.templatePath.isEqual == 1 && sloganName && (sloganName != "") && (sloganName.length >= 9) && (logoNameLength >= (sloganName.length)) && (logoNameLength <= 35)) {
					return true;
				}
			} else {
				logoNameLength = logoText.length;
				if (p_oGenerate.templatePath.isEqual == 1 && sloganName && (sloganName != "") && (sloganName.length >= 9) && (logoNameLength >= sloganName.length) && (logoNameLength <= 35)) {
					return true;
				}
			}
			return false;
		},
		/**
		 * 
		 */
		getDynamicSvgTag: function () {
			if (svgTagNameSpace == "") {
				if (lEditor.iconNameSpaceList && lEditor.iconNameSpaceList.length > 0) {
					svgTagNameSpace = '<svg version="1.1" dynamicNameSpace xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';

					var nameSpaceStr = "";
					lEditor.iconNameSpaceList.forEach(function (item, index) {
						item = item.replace('^', '="');
						if (index == 0) {
							nameSpaceStr += item + '"';
						} else {
							nameSpaceStr += ' ' + item + '"';
						}
					});
					svgTagNameSpace = svgTagNameSpace.replace("dynamicNameSpace", nameSpaceStr);
				}
			}
			return svgTagNameSpace;
		},
		/**
		 * generate new logo templage in single manner
		 * @param {*} logoObj 
		 * @param {*} idKey 
		 * @param {*} p_nLogoTextSlider 
		 * @param {*} p_nLogoLetterSpacing 
		 */
		generateLogoTemplate: function (logoObj, idKey, p_nLogoTextSlider = null, p_nLogoLetterSpacing = null, p_oCurrContainerBodyObj, isSetSlogan = true, p_sActionName) {
			if (typeof idKey === "undefined") {
				idKey = "";
			}
			if (typeof logoObj.templatePath.iconFrameBox === 'undefined') {
				logoObj.templatePath.iconFrameBox = {};
				logoObj.templatePath.iconFrameBox.x = 0;
				logoObj.templatePath.iconFrameBox.y = 0;
				logoObj.templatePath.iconFrameBoxScale = 1;
				logoObj.templatePath.updates.iconFrameBox = {};
				logoObj.templatePath.updates.iconFrameBox.x = 0;
				logoObj.templatePath.updates.iconFrameBox.y = 0;
				logoObj.templatePath.updates.iconFrameBox.scale = 1;
			}
			if (p_sActionName === "step6genration" || p_sActionName === "dynamicLogoVariations" || p_sActionName === "layoutVariations") {
				if (logoObj.templatePath.frameType == "filled") {
					if (logoObj.bgColor === logoObj.frameFilledColor) {
						var filledFrameColorList = logoMakerFunction.getFilledFrameColor(logoObj);
						if (filledFrameColorList[1]) {
							logoObj.frameFilledColor = "";
							logoObj.frameFilledGradient = "";
							if (filledFrameColorList[0]) {
								// gradient
								logoObj.frameFilledGradient = filledFrameColorList[1];
							} else {
								logoObj.frameFilledColor = filledFrameColorList[1];
							}
							logoObj.textGradient = "";
							logoObj.text2Gradient = "";
							logoObj.sloganGradient = "";
							logoObj.iconGradient = "";
							logoObj.frameGradient = ""; // outline frame
							logoObj.iconFrameGradient = "";

							logoObj.mainTextColor = logoObj.bgColor;
							logoObj.mainText2Color = logoObj.bgColor;
							logoObj.sloganTextColor = logoObj.bgColor;
							logoObj.iconColor = logoObj.bgColor;

							logoObj.frameColor = logoObj.bgColor;
							logoObj.iconFrameColor = logoObj.bgColor;

						}
					}
					else if
						(
						(p_sActionName === "layoutVariations") &&
						(logoObj.bgColor !== logoObj.frameFilledColor) &&
						(!gradientsArray[logoObj.frameFilledColor]) &&
						(
							(logoObj.frameFilledColor === logoObj.mainTextColor) ||
							(logoObj.frameFilledColor === logoObj.mainText2Color) ||
							(logoObj.frameFilledColor === logoObj.sloganTextColor) ||
							(logoObj.frameFilledColor === logoObj.iconColor)
						)
					) {
						let frmFilledColor = lEditor.currentLogo.generate.frameFilledColor;
						logoObj.frameFilledGradient = "";
						logoObj.frameFilledColor = logoObj.bgColor;
						logoObj.bgColor = frmFilledColor;
					}
				}
			}
			var result = {};
			var obj = {};
			var getSVGTag = logoMakerFunction.getDynamicSvgTag();
			var template = null;
			if (getSVGTag != "") {
				template = getSVGTag;
			} else {
				template = '<svg version="1.1" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';
			}
			template += '<rect x="0px" y="0px" width="100%" height="100%" fill="{{svgColor}}"/>';
			if (logoObj.bgPattern) {
				template += dh_lm_common_utility.appendPatternInLogo(logoObj.bgPattern, uniqClassNameForPattern);
			}
			template += '<g class="logo-container-box logoContainerBox">';
			if (logoObj.templatePath.isFrame == 1) {
				template += '<g class="container_1" transform="scale(1)" fill="{{frameFill}}">{{frameHtml}}</g>';
			}
			template += '<g class="containerBody">';
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template += '<g class="sampleIconBox" transform="scale({{iconFrameBoxScale}}) translate({{iconFrameBoxX}},{{iconFrameBoxY}})">';
				if (logoObj.templatePath.isIconFrame == 1) {
					template += '<g class="iconFrame" transform="scale({{iconFrameScale}}) translate({{iconFrameX}},{{iconFrameY}})"  fill="{{iconFrameFill}}">{{iconFrameHtml}}</g>';
				}
				template += '<g class="sampleIcons_1" transform="scale({{iconScale}}) translate({{iconX}},{{iconY}})" fill="{{iconFill}}">{{iconHtml}}</g>';
				template += '</g>';
			}
			template += '<g class="sampleTexts_1">';

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template += '<g class="logo--name svgLogoName_1 logoNameBox1" transform="scale(1)" fill="{{text1Fill}}">{{text1Html}}</g>';

				template += '<g class="logo--name svgLogoName_2 logoNameBox2" transform="scale(1)" fill="{{text2Fill}}">{{text2Html}}</g>';
			} else {
				template += '<g class="logo--name svgLogoName_1 logoNameBox" transform="scale(1)" fill="{{textFill}}">{{textHtml}}</g>';
			}

			template += '<g id="" class="logo--name svgSloganText_1 sloganBox" transform="scale(1)" fill="{{sloganFill}}">{{sloganHtml}}</g>';
			template += '</g>';
			template += '</g>';
			template += '</g>';
			template += '</svg>';


			if (logoObj.textGradient != "") {
				logoObj.mainTextColor = 'url(#textGradient' + idKey + ')';
			}
			if ((logoObj.templatePath.isDBLineCompanyText == "yes") && logoObj.text2Gradient != "") {
				logoObj.mainText2Color = 'url(#text2Gradient' + idKey + ')';

			}
			if (logoObj.sloganGradient != "") {
				logoObj.sloganTextColor = 'url(#sloganGradient' + idKey + ')';
			}
			if (logoObj.frameGradient != "" && logoObj.templatePath.frameType == "outline") {
				logoObj.frameColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.frameFilledGradient != "" && logoObj.templatePath.frameType == "filled") {
				logoObj.frameFilledColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.iconFrameGradient != "") {
				logoObj.iconFrameColor = 'url(#iconFrameGradient' + idKey + ')';
			}
			if (logoObj.iconGradient != "") {
				logoObj.iconColor = 'url(#iconGradient' + idKey + ')';
			}

			template = this.applyGradientToTemplate(template, logoObj, idKey);

			template = template.replace("{{svgColor}}", logoObj.bgColor);

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1Html}}", logoObj.logoPath1);
				template = template.replace("{{text2Html}}", logoObj.logoPath2);

				template = template.replace("{{text1Fill}}", logoObj.mainTextColor);
				template = template.replace("{{text2Fill}}", logoObj.mainText2Color);
			} else {
				template = template.replace("{{textHtml}}", logoObj.logoPath);
				template = template.replace("{{textFill}}", logoObj.mainTextColor);
			}
			template = template.replace("{{sloganHtml}}", logoObj.sloganPath);
			template = template.replace("{{sloganFill}}", logoObj.sloganTextColor);
			template = template.replace("{{frameHtml}}", logoObj.framePath);
			if (logoObj.templatePath.frameType == "filled") {
				template = template.replace("{{frameFill}}", logoObj.frameFilledColor);
			} else {
				if (p_sActionName == "layoutVariations") {
				}
				template = template.replace("{{frameFill}}", logoObj.frameColor);
			}

			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				let iconSVGPath = dh_lm_common_utility.removeFillFromIconSvg(logoObj.iconPath, logoObj.iconColor);
				template = template.replace("{{iconHtml}}", iconSVGPath);
				template = template.replace("{{iconScale}}", logoObj.templatePath.iconScale ? logoObj.templatePath.iconScale : 1);

				template = template.replace("{{iconX}}", logoObj.templatePath.iconX ? logoObj.templatePath.iconX : 0);
				template = template.replace("{{iconY}}", logoObj.templatePath.iconY ? logoObj.templatePath.iconY : 0);


				if (p_sActionName == "layoutVariations" || p_sActionName == "monogramVariations") {
				}

				template = template.replace("{{iconFill}}", logoObj.iconColor);

				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameBoxX}}", logoObj.templatePath.iconFrameBox.x);
				template = template.replace("{{iconFrameBoxY}}", logoObj.templatePath.iconFrameBox.y);
				if (logoObj.templatePath.isIconFrame == 1) {
					if (logoObj.templatePath.iconFrameBox.scale) {
						template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBox.scale);
					} else {
						template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBoxScale);
					}

				} else {
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBoxScale);
				}

			}
			if (logoObj.templatePath.isIconFrame == 1) {
				template = template.replace("{{iconFrameHtml}}", logoObj.iconFramePath);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameY}}", logoObj.templatePath.iconFrame.x);
				template = template.replace("{{iconFrameX}}", logoObj.templatePath.iconFrame.y);
				template = template.replace("{{iconFrameScale}}", logoObj.templatePath.iconFrame.scale ? logoObj.templatePath.iconFrame.scale : 1);

			}

			$("#templateGenerator").html(template);

			var sloganObj;
			if (isSetSlogan) {
				if (typeof logoObj.sloganFontObject !== 'undefined' && typeof logoObj.sloganFontObject !== 'string') {
					sloganObj = logoObj.sloganFontObject;
				} else {
					sloganObj = currSloganFontObject;
				}
			}

			var slogan = null;
			var isSloganLSAlreadySet = false;
			if (isSetSlogan) {
				var isEqualCaseSloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
				var sloganText = lEditor.getSession('sloganText');
				var sloganNameLength = sloganText.length;
				var logoNameLength = 0;
				var IsEqualCondition = false;
				var logoText = lEditor.getSession('logoname');
				var logoTextList = lEditor.getLogoTextList(logoObj.splitLogoName);
				if (logoObj.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
					logoNameLength = Math.max(logoTextList[0].length, logoTextList[1].length);
					if (logoObj.templatePath.isEqual == 1 && sloganText && (sloganText != "") && (sloganNameLength >= 9) && (logoNameLength >= (sloganNameLength)) && (logoNameLength <= 35 && logoObj.templatePath.sloganSetAsPerText == 1)) {
						IsEqualCondition = true;
					}
				} else {

					logoNameLength = logoText.length;
					if (logoObj.templatePath.isEqual == 1 && sloganText && (sloganText != "") && (sloganNameLength >= 9) && (logoNameLength >= sloganNameLength) && (logoNameLength <= 35 && logoObj.templatePath.sloganSetAsPerText == 1)) {
						IsEqualCondition = true;
					}
				}
				if (IsEqualCondition) {
					if (logoNameLength >= sloganNameLength) {
						if (sloganNameLength >= 20) {
							isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength) / 2;
						} else {
							isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
						}
						logoObj.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
						isSloganLSAlreadySet = true;
						if (p_sActionName == "outerContainerRemove" || p_sActionName == "innerContainerRemove" || p_sActionName == "symbolOrMonoPlacing") {
							logoMakerFunction.setSliderForSloganLetterSpacing(isEqualCaseSloganLetterSpacing);
						}
					} else if (sloganNameLength >= logoNameLength) {
						if (sloganNameLength / 2 < logoNameLength) {
							isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
							logoObj.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
							if (p_sActionName == "outerContainerRemove" || p_sActionName == "innerContainerRemove" || p_sActionName == "symbolOrMonoPlacing") {
								logoMakerFunction.setSliderForSloganLetterSpacing(isEqualCaseSloganLetterSpacing);
							}
							isSloganLSAlreadySet = true;
						}
					}
				}
				if (lEditor.getSession('sloganText') && sloganObj) {
					slogan = sloganObj.getPath(lEditor.getSession('sloganText'), 0, 0, constantVars.ORIGINAL_SPACING.sloganTextSize, { 'letterSpacing': parseFloat(isEqualCaseSloganLetterSpacing) });
				}
			}


			if (p_nLogoTextSlider) {
				logoObj.logoTextSlider = p_nLogoTextSlider;
			} else {
				logoObj.logoTextSlider = constantVars.SPACING.logoTextSlider;
			}
			if (p_nLogoLetterSpacing) {
				logoObj.logoLetterSpacing = p_nLogoLetterSpacing;
			} else {
				logoObj.logoLetterSpacing = constantVars.SPACING.logoLetterSpacing;
			}

			if (!isSloganLSAlreadySet) {
				logoObj.sloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
				if (p_sActionName == "outerContainerRemove" || p_sActionName == "innerContainerRemove") {
					logoMakerFunction.resetSlider("sloganLetterSpacing");
				}
			} else {
				// if(isSloganLSAlreadySet && isSetSlogan){
				// 	logoObj.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
				// 	logoMakerFunction.setSliderForSloganLetterSpacing(isEqualCaseSloganLetterSpacing);
				// }

			}

			logoObj.sloganTextSize = constantVars.ORIGINAL_SPACING.sloganTextSize;
			logoObj.textSloganDistSlider = constantVars.ORIGINAL_SPACING.textSloganDistSlider;
			if (p_sActionName == "outerContainerRemove" || p_sActionName == "innerContainerRemove") {
				logoMakerFunction.resetSlider("sloganTextSize");
			}

			logoObj.logoSizeSlider = constantVars.ORIGINAL_SPACING.logoSizeSlider;
			logoObj.iconDistanceSlider = constantVars.ORIGINAL_SPACING.iconDistanceSlider;

			logoObj.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;

			if (p_sActionName == "innerContainerRemove") {
				logoMakerFunction.resetSlider("logoSizeSlider");
				logoMakerFunction.resetSlider("iconDistanceSlider");
				logoMakerFunction.resetSlider("frameSizeSlider");
			}
			else if (p_sActionName == "outerContainerRemove") {
				logoMakerFunction.resetSlider("logoSizeSlider");
			}

			if (slogan) {
				logoObj.sloganPath = slogan.toSVG();
				$('#templateGenerator  .svgSloganText_1').html(logoObj.sloganPath);
			}
			// manage spacing
			var textGSloganWidthDiff = 1;
			var sloganGTextWidthDiff = 1;
			if (logoMakerFunction.checkTemplateIsEqualCondition(logoObj) && logoObj.templatePath.sloganSetAsPerText == 1) {
				var isEqualCaseTextWidth = 0;
				if (logoObj.templatePath.isDBLineCompanyText == "yes") {
					isEqualCaseTextWidth = Math.max(parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width), parseInt($('#templateGenerator  .svgLogoName_2').get(0).getBBox().width))
				} else {
					isEqualCaseTextWidth = parseInt($('#templateGenerator  .svgLogoName_1').get(0).getBBox().width);
				}
				var isEqualCaseSloganWidth = parseInt($('#templateGenerator  .svgSloganText_1').get(0).getBBox().width);
				if (isEqualCaseTextWidth > isEqualCaseSloganWidth) {
					textGSloganWidthDiff = (isEqualCaseTextWidth / isEqualCaseSloganWidth);
				} else {
					sloganGTextWidthDiff = (isEqualCaseSloganWidth / isEqualCaseTextWidth);
				}
			}
			if (logoObj.templatePath.isDBLineCompanyText == "yes") {

				obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text1', sloganGTextWidthDiff);
				logoObj.templatePath.updates.text1.x = obj.x;
				logoObj.templatePath.updates.text1.y = obj.y;
				logoObj.templatePath.updates.text1.scale = obj.scale;

				obj = updateGroupSize($('#templateGenerator  .svgLogoName_2'), logoObj.templatePath, 'text2', sloganGTextWidthDiff);
				logoObj.templatePath.updates.text2.x = obj.x;
				logoObj.templatePath.updates.text2.y = obj.y;
				logoObj.templatePath.updates.text2.scale = obj.scale;
			} else {
				obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', (sloganGTextWidthDiff));
				logoObj.templatePath.updates.text.x = obj.x;
				logoObj.templatePath.updates.text.y = obj.y;
				logoObj.templatePath.updates.text.scale = obj.scale;
			}
			obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', (textGSloganWidthDiff));
			logoObj.templatePath.updates.slogan.x = obj.x;
			let maintainIconGapDueToCurve = 0;
			if ((logoObj.isArc == 1)) {
				let sloganTxt = lEditor.getSession("sloganText");
				const [slogaYInCurveCase, iconGapDueToCurve] = logoMakerFunction.setSloganYInCurveLogo(logoObj, obj);
				if (sloganTxt && sloganTxt.length > 0) {
					logoObj.templatePath.updates.slogan.y = slogaYInCurveCase;
				} else {
					logoObj.templatePath.updates.slogan.y = obj.y;
				}
				maintainIconGapDueToCurve = iconGapDueToCurve;
				maintainIconGapDueToCurve += logoObj.iconDistanceSlider || 0;
			}
			else {
				logoObj.templatePath.updates.slogan.y = obj.y;
			}
			logoObj.templatePath.updates.slogan.scale = obj.scale;

			obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
			logoObj.templatePath.updates.textAndSlogan.x = obj.x;
			logoObj.templatePath.updates.textAndSlogan.y = obj.y;
			logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;


			if (logoObj.templatePath.isIconFrame == 1) {
				obj = updateGroupSize($('#templateGenerator  .iconFrame'), logoObj.templatePath, 'iconFrame', 0);
				logoObj.templatePath.updates.iconFrame.x = obj.x;
				logoObj.templatePath.updates.iconFrame.y = obj.y;
				logoObj.templatePath.updates.iconFrame.scale = obj.scale;
			}

			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				if (logoObj.templatePath.isIconFrame == 1) {
					obj = updateGroupSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, 'icon', 0);
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;
				} else {
					if (p_sActionName == "monogramVariations" || p_sActionName == "layoutVariations" ||
						p_sActionName == "dynamicLogoVariations" || p_sActionName == "addNewSymbol" || p_sActionName == "addInnerContainer") {

						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'icon');
					} else {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'icon');
					}
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;
				}
				if (logoObj.templatePath.isIconFrame == 1) {
					// obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
					if (p_sActionName == "monogramVariations" || p_sActionName == "layoutVariations" ||
						p_sActionName == "dynamicLogoVariations" || p_sActionName == "addNewSymbol" || p_sActionName == "addInnerContainer") {

						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
					} else {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');
					}
					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;

				} else {
					obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				}
			}
			if (logoObj.templatePath.isFrame == 1) {
				obj = updateGroupSize($('#templateGenerator  .container_1'), logoObj.templatePath, 'frame', 0);
				logoObj.templatePath.updates.frame.x = obj.x;
				logoObj.templatePath.updates.frame.y = obj.y;
				logoObj.templatePath.updates.frame.scale = obj.scale;
			}

			if ((logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) && (logoObj.isArc == 1) && (logoObj.arcValue <= 0)) {
				let newY = (maintainIconGapDueToCurve) / (logoObj.templatePath.updates.iconFrameBox.scale);
				logoObj.templatePath.updates.iconFrameBox.y += newY;
				logoObj.maintainIconGapDueToCurve = newY;
			}

			if (p_sActionName === "step6genration" && (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) && (logoObj.isArc == 1)) {
				logoObj.templatePath.updates.textAndSlogan.y += logoObj.iconDistanceSlider || 0;
			}

			if (p_oCurrContainerBodyObj) {
				obj = updateGroupSizeByLastValue($('#templateGenerator  .containerBody'), p_oCurrContainerBodyObj);

			} else {
				obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody');

			}
			logoObj.templatePath.updates.containerBody.x = obj.x;
			logoObj.templatePath.updates.containerBody.y = obj.y;
			logoObj.templatePath.updates.containerBody.scale = obj.scale;

			obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
			logoObj.templatePath.updates.logoContainer.x = obj.x;
			logoObj.templatePath.updates.logoContainer.y = obj.y;
			logoObj.templatePath.updates.logoContainer.scale = obj.scale;

			template = $("#templateGenerator").html();
			$("#templateGenerator").html('');
			return { 'logoObj': logoObj, 'html': template };

		},
		/**
		 * 
		 * @param {*} logoObj 
		 * @param {*} idKey 
		 * @param {*} p_sActionName 
		 * @returns 
		 */
		generateLogoTemplateForArcLogo: function (logoObj, idKey, $for, p_sActionName) {
			let consoleTxt = '%c generateLogoTemplateForArcLogo ';
			if (typeof idKey === "undefined") {
				idKey = "";
			}

			if (typeof logoObj.templatePath.iconFrameBox === 'undefined') {
				logoObj.templatePath.iconFrameBox = {};
				logoObj.templatePath.iconFrameBox.x = 0;
				logoObj.templatePath.iconFrameBox.y = 0;
				logoObj.templatePath.iconFrameBoxScale = 1;
				logoObj.templatePath.updates.iconFrameBox = {};
				logoObj.templatePath.updates.iconFrameBox.x = 0;
				logoObj.templatePath.updates.iconFrameBox.y = 0;
				logoObj.templatePath.updates.iconFrameBox.scale = 1;
			}
			if (p_sActionName === "step6genration" || p_sActionName === "dynamicLogoVariations" || p_sActionName === "layoutVariations" || p_sActionName === "addOuterContainer") {
				if (logoObj.templatePath.frameType == "filled") {
					if (logoObj.bgColor === logoObj.frameFilledColor) {
						var filledFrameColorList = logoMakerFunction.getFilledFrameColor(logoObj);
						if (filledFrameColorList[1]) {
							logoObj.frameFilledColor = "";
							logoObj.frameFilledGradient = "";
							if (filledFrameColorList[0]) {
								// gradient
								logoObj.frameFilledGradient = filledFrameColorList[1];
							} else {
								logoObj.frameFilledColor = filledFrameColorList[1];
							}
							logoObj.textGradient = "";
							logoObj.text2Gradient = "";
							logoObj.sloganGradient = "";
							logoObj.iconGradient = "";
							logoObj.frameGradient = ""; // outline frame
							logoObj.iconFrameGradient = "";

							logoObj.mainTextColor = logoObj.bgColor;
							logoObj.mainText2Color = logoObj.bgColor;
							logoObj.sloganTextColor = logoObj.bgColor;
							logoObj.iconColor = logoObj.bgColor;

							logoObj.frameColor = logoObj.bgColor;
							logoObj.iconFrameColor = logoObj.bgColor;

						}
					}
					else if
						(
						(p_sActionName === "layoutVariations") &&
						(logoObj.bgColor !== logoObj.frameFilledColor) &&
						(!gradientsArray[logoObj.frameFilledColor]) &&
						(
							(logoObj.frameFilledColor === logoObj.mainTextColor) ||
							(logoObj.frameFilledColor === logoObj.mainText2Color) ||
							(logoObj.frameFilledColor === logoObj.sloganTextColor) ||
							(logoObj.frameFilledColor === logoObj.iconColor)
						)
					) {
						let frmFilledColor = lEditor.currentLogo.generate.frameFilledColor;
						logoObj.frameFilledGradient = "";
						logoObj.frameFilledColor = logoObj.bgColor;
						logoObj.bgColor = frmFilledColor;
					}
				}
			}
			var obj = {};
			var getSVGTag = logoMakerFunction.getDynamicSvgTag();
			var template = null;
			if (getSVGTag != "") {
				template = getSVGTag;
			} else {
				template = '<svg version="1.1" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';
			}

			template += '<rect x="0px" y="0px" width="100%" height="100%" fill="{{svgColor}}"/>';
			template += '<g class="logo-container-box logoContainerBox">';
			if (logoObj.templatePath.isFrame == 1) {
				template += '<g class="container_1" transform="scale(1)" fill="{{frameFill}}">{{frameHtml}}</g>';
			}
			template += '<g class="containerBody">';
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template += '<g class="sampleIconBox" transform="scale({{iconFrameBoxScale}}) translate({{iconFrameBoxX}},{{iconFrameBoxY}})">';
				if (logoObj.templatePath.isIconFrame == 1) {
					template += '<g class="iconFrame" transform="scale({{iconFrameScale}}) translate({{iconFrameX}},{{iconFrameY}})"  fill="{{iconFrameFill}}">{{iconFrameHtml}}</g>';
				}
				template += '<g class="sampleIcons_1" transform="scale({{iconScale}}) translate({{iconX}},{{iconY}})" fill="{{iconFill}}">{{iconHtml}}</g>';
				template += '</g>';
			}
			template += '<g class="sampleTexts_1">';
			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template += '<g class="logo--name svgLogoName_1 logoNameBox1" transform="scale(1)" fill="{{text1Fill}}">{{text1Html}}</g>';

				template += '<g class="logo--name svgLogoName_2 logoNameBox2" transform="scale(1)" fill="{{text2Fill}}">{{text2Html}}</g>';
			} else {
				template += '<g class="logo--name svgLogoName_1 logoNameBox" transform="scale(1)" fill="{{textFill}}">{{textHtml}}</g>';
			}

			template += '<g id="" class="logo--name svgSloganText_1 sloganBox" transform="scale(1)" fill="{{sloganFill}}">{{sloganHtml}}</g>';
			template += '</g>';
			template += '</g>';
			template += '</g>';
			template += '</svg>';

			if (logoObj.textGradient != "") {
				logoObj.mainTextColor = 'url(#textGradient' + idKey + ')';
			}
			if ((logoObj.templatePath.isDBLineCompanyText == "yes") && logoObj.text2Gradient != "") {
				logoObj.mainText2Color = 'url(#text2Gradient' + idKey + ')';

			}
			if (logoObj.sloganGradient != "") {
				logoObj.sloganTextColor = 'url(#sloganGradient' + idKey + ')';
			}
			if (logoObj.frameGradient != "" && logoObj.templatePath.frameType == "outline") {
				logoObj.frameColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.frameFilledGradient != "" && logoObj.templatePath.frameType == "filled") {
				logoObj.frameFilledColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.iconFrameGradient != "") {
				logoObj.iconFrameColor = 'url(#iconFrameGradient' + idKey + ')';
			}
			if (logoObj.iconGradient != "") {
				logoObj.iconColor = 'url(#iconGradient' + idKey + ')';
			}

			template = this.applyGradientToTemplate(template, logoObj, idKey);

			template = template.replace("{{svgColor}}", logoObj.bgColor);
			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1Html}}", logoObj.logoPath1);
				template = template.replace("{{text2Html}}", logoObj.logoPath2);

				template = template.replace("{{text1Fill}}", logoObj.mainTextColor);
				template = template.replace("{{text2Fill}}", logoObj.mainText2Color);
			} else {
				template = template.replace("{{textHtml}}", logoObj.logoPath);
				template = template.replace("{{textFill}}", logoObj.mainTextColor);
			}

			template = template.replace("{{sloganHtml}}", logoObj.sloganPath);
			template = template.replace("{{sloganFill}}", logoObj.sloganTextColor);
			template = template.replace("{{frameHtml}}", logoObj.framePath);

			if (logoObj.templatePath.frameType == "filled") {
				template = template.replace("{{frameFill}}", logoObj.frameFilledColor);
			} else {
				template = template.replace("{{frameFill}}", logoObj.frameColor);
			}

			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				let iconSVGPath = dh_lm_common_utility.removeFillFromIconSvg(logoObj.iconPath, logoObj.iconColor);
				template = template.replace("{{iconHtml}}", iconSVGPath);
				template = template.replace("{{iconScale}}", logoObj.templatePath.iconScale ? logoObj.templatePath.iconScale : 1);

				template = template.replace("{{iconX}}", logoObj.templatePath.iconX ? logoObj.templatePath.iconX : 0);
				template = template.replace("{{iconY}}", logoObj.templatePath.iconY ? logoObj.templatePath.iconY : 0);

				template = template.replace("{{iconFill}}", logoObj.iconColor);

				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameBoxX}}", logoObj.templatePath.iconFrameBox.x);
				template = template.replace("{{iconFrameBoxY}}", logoObj.templatePath.iconFrameBox.y);
				if (logoObj.templatePath.isIconFrame == 1) {
					if (logoObj.templatePath.iconFrameBox.scale) {
						template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBox.scale);
					} else {
						template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBoxScale);
					}
				} else {
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBoxScale);
				}
			}
			if (logoObj.templatePath.isIconFrame == 1) {
				template = template.replace("{{iconFrameHtml}}", logoObj.iconFramePath);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameY}}", logoObj.templatePath.iconFrame.x);
				template = template.replace("{{iconFrameX}}", logoObj.templatePath.iconFrame.y);
				template = template.replace("{{iconFrameScale}}", logoObj.templatePath.iconFrame.scale ? logoObj.templatePath.iconFrame.scale : 1);
			}

			$("#templateGenerator").html(template);

			if ((logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) && $for == "icon") {
				if ((logoObj.templatePath.tempType == "right" || logoObj.templatePath.tempType == "left") && ((p_sActionName == "changeSymbol") || (p_sActionName == "changemongram"))) {
					logoObj.templatePath.lastSymbolXDistance = undefined
				}
				if ((logoObj.templatePath.tempType == "center") && ((p_sActionName == "changeSymbol") || (p_sActionName == "changemongram"))) {
					logoObj.templatePath.lastSymbolYDistance = undefined
				}
			}

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				// in next phase will do
			} else {
				obj = updateGroupSize($('#templateGenerator  .svgLogoName_1'), logoObj.templatePath, 'text', (1));
				logoObj.templatePath.updates.text.x = obj.x;
				logoObj.templatePath.updates.text.y = obj.y;
				logoObj.templatePath.updates.text.scale = obj.scale;
			}

			obj = updateGroupSize($('#templateGenerator  .svgSloganText_1'), logoObj.templatePath, 'slogan', (1));
			logoObj.templatePath.updates.slogan.x = obj.x;
			let maintainIconGapDueToCurve = 0;
			if ((logoObj.isArc == 1)) {
				let sloganTxt = lEditor.getSession("sloganText");
				const [slogaYInCurveCase, iconGapDueToCurve] = logoMakerFunction.setSloganYInCurveLogo(logoObj, obj);
				if (sloganTxt && sloganTxt.length > 0) {
					logoObj.templatePath.updates.slogan.y = slogaYInCurveCase;
				} else {
					logoObj.templatePath.updates.slogan.y = obj.y;
				}
				maintainIconGapDueToCurve = iconGapDueToCurve;
				// maintainIconGapDueToCurve += logoObj.iconDistanceSlider || 0;
			}
			else {
				logoObj.templatePath.updates.slogan.y = obj.y;
			}
			logoObj.templatePath.updates.slogan.scale = obj.scale;

			obj = updateGroupSize($('#templateGenerator  .sampleTexts_1'), logoObj.templatePath, 'textAndSlogan', 0);
			logoObj.templatePath.updates.textAndSlogan.x = obj.x;
			logoObj.templatePath.updates.textAndSlogan.y = obj.y;
			logoObj.templatePath.updates.textAndSlogan.scale = obj.scale;

			if (logoObj.templatePath.isIconFrame == 1) {
				obj = updateGroupSize($('#templateGenerator  .iconFrame'), logoObj.templatePath, 'iconFrame', 0);
				logoObj.templatePath.updates.iconFrame.x = obj.x;
				logoObj.templatePath.updates.iconFrame.y = obj.y;
				logoObj.templatePath.updates.iconFrame.scale = obj.scale;
			}

			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				if (logoObj.templatePath.isIconFrame == 1) {
					obj = updateGroupSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, 'icon', 0);
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;
				} else {
					if (p_sActionName == "monogramVariations" || p_sActionName == "layoutVariations" ||
						p_sActionName == "dynamicLogoVariations" || p_sActionName == "addNewSymbol" || p_sActionName == "addInnerContainer") {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'icon');
					}
					else if ($for == "icon" && (p_sActionName == "changemongram" || p_sActionName == "changeSymbol")) {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'icon');
					}
					else {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIcons_1'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'icon');
					}
					logoObj.templatePath.updates.icon.x = obj.x;
					logoObj.templatePath.updates.icon.y = obj.y;
					logoObj.templatePath.updates.icon.scale = obj.scale;
				}
				if (logoObj.templatePath.isIconFrame == 1) {
					if (p_sActionName == "monogramVariations" || p_sActionName == "layoutVariations" ||
						p_sActionName == "dynamicLogoVariations" || p_sActionName == "addNewSymbol" || p_sActionName == "addInnerContainer") {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
					}
					else if ($for == "icon" && (p_sActionName == "changemongram" || p_sActionName == "changeSymbol")) {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
					}
					else if ($for == "iconFrame" && (p_sActionName == "changeIconFrameContainer")) {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.ORIGINAL_SPACING.logoSizeSlider, 'iconFrameBox');
					}
					else if ($for == 'frame' && (p_sActionName == "addOuterContainer")) {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');
					}
					else {
						obj = updateCurrentIconSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, constantVars.SPACING.logoSizeSlider, 'iconFrameBox');
					}
					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				} else {
					obj = updateGroupSize($('#templateGenerator  .sampleIconBox'), logoObj.templatePath, 'iconFrameBox', 0);
					logoObj.templatePath.updates.iconFrameBox.x = obj.x;
					logoObj.templatePath.updates.iconFrameBox.y = obj.y;
					logoObj.templatePath.updates.iconFrameBox.scale = obj.scale;
				}
			}
			if (logoObj.templatePath.isFrame == 1) {
				obj = updateGroupSize($('#templateGenerator  .container_1'), logoObj.templatePath, 'frame', 0);
				logoObj.templatePath.updates.frame.x = obj.x;
				logoObj.templatePath.updates.frame.y = obj.y;
				logoObj.templatePath.updates.frame.scale = obj.scale;
			}

			if ((logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) && (logoObj.isArc == 1) && (logoObj.arcValue <= 0)) {
				let newY = (maintainIconGapDueToCurve) / (logoObj.templatePath.updates.iconFrameBox.scale);
				logoObj.templatePath.updates.iconFrameBox.y += newY;
				logoObj.maintainIconGapDueToCurve = newY;
			}


			if ((logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) && $for == "icon") {
				if ((p_sActionName == "changeSymbol" || p_sActionName == "changemongram") && (constantVars.SPACING.logoSizeSlider != constantVars.ORIGINAL_SPACING.logoSizeSlider)) {
					obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody', 0);
				} else {
					obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody');
				}
			} else {
				obj = updateGroupSize($('#templateGenerator  .containerBody'), logoObj.templatePath, 'containerBody');
			}

			logoObj.templatePath.updates.containerBody.x = obj.x;
			logoObj.templatePath.updates.containerBody.y = obj.y;
			logoObj.templatePath.updates.containerBody.scale = obj.scale;

			obj = updateGroupSize($('#templateGenerator  .logoContainerBox'), logoObj.templatePath, 'logoContainer', 0);
			logoObj.templatePath.updates.logoContainer.x = obj.x;
			logoObj.templatePath.updates.logoContainer.y = obj.y;
			logoObj.templatePath.updates.logoContainer.scale = obj.scale;

			template = $("#templateGenerator").html();
			$("#templateGenerator").html('');
			return { 'logoObj': logoObj, 'html': template };
		},
		/**
		 * compare two array 
		 * @param {*} fst 
		 * @param {*} scnd 
		 */
		isEqualArray: function (fst, scnd) {
			var equal = true;
			$.each(fst, function (k, v) {
				if (v != scnd[k]) {
					equal = false;
				}
			});
			return equal;
		},
		getFilledFrameColor: function (logoObj) {
			var colorList = [];
			if (logoObj.textGradient) {
				colorList.push(logoObj.textGradient);
			} else {
				colorList.push(logoObj.mainTextColor);
			}
			if (logoObj.sloganGradient) {
				colorList.push(logoObj.sloganGradient);
			} else {
				colorList.push(logoObj.sloganTextColor);
			}
			if (logoObj.iconGradient) {
				colorList.push(logoObj.iconGradient);
			} else {
				colorList.push(logoObj.iconColor);
			}
			let frameFilledColorTheme = (logoObj.frameFilledColor.indexOf("#") !== -1) ? dh_editor_utility.lightOrDark(logoObj.frameFilledColor) : logoObj.frameFilledGradient;

			var i = 0;
			let themeType = "";
			let newFilledFrameColor = "";
			let isGraident = 0;
			while (i < colorList.length) {
				themeType = (colorList[i].indexOf("#") !== -1) ? dh_editor_utility.lightOrDark(colorList[i]) : colorList[i];
				if (frameFilledColorTheme !== themeType) {
					newFilledFrameColor = colorList[i];
					if (newFilledFrameColor.indexOf("#") === -1) {
						isGraident = 1;
					}
					break;
				}
				i++;
			}
			if (newFilledFrameColor === "" && frameFilledColorTheme === themeType && isGraident === 0) {
				newFilledFrameColor = dh_editor_utility.shuffleTheArray([...colorList]).pop();
			}
			return [isGraident, newFilledFrameColor]
		},
		setSloganYInCurveLogo: function (logoObj, obj) {
			const logoNameBox = $('#templateGenerator  .svgLogoName_1').get(0).getBBox();
			const sloganBox = $('#templateGenerator  .svgSloganText_1').get(0).getBBox();
			let curveTextCenterWidth = logoObj.curveTextCenterWidth;
			let curveTextActualPathHeight = logoObj.curveTextActualPathHeight;
			let textCurveGap = logoNameBox.height - curveTextActualPathHeight;
			let logoActualWidth = (logoNameBox.width - ((logoNameBox.width * (+logoObj.arcValue)) / 100));
			let logoActualHeight = (logoNameBox.height - ((logoNameBox.height * (+logoObj.arcValue)) / 100));
			let iconGapDueToCurve = 0;
			let sloganY;
			if (logoObj.arcValue < 0) {
				iconGapDueToCurve = logoNameBox.height - curveTextActualPathHeight;
				sloganY = obj.y;
				return [sloganY, (iconGapDueToCurve)];
			}

			let logonameLength = lEditor.getSession("logoname").length
			let sloganTextLength = dh_editor_utility.removeMultipleSpaces(lEditor.getSession("sloganText")).length;
			if (sloganTextLength <= 0) {
				sloganY = obj.y;
				return [sloganY, (iconGapDueToCurve)];
			}

			let scaleForCurve;
			if (curveTextCenterWidth < sloganBox.width) {
				scaleForCurve = curveTextCenterWidth / sloganBox.width;
			} else {
				scaleForCurve = sloganBox.width / curveTextCenterWidth;
			}
			let num = scaleForCurve + "";
			let num1 = num.split(".");
			scaleForCurve = +(num1[1].charAt(0));
			scaleForCurve = scaleForCurve / 10;
			if ((sloganBox.width >= logoNameBox.width) || (sloganBox.width >= (curveTextCenterWidth * 2))) {
				sloganY = obj.y;
			} else {
				if ((sloganTextLength > logonameLength) && (curveTextCenterWidth <= sloganBox.width)) {
					sloganY = obj.y - (textCurveGap * scaleForCurve);
				} else {
					sloganY = obj.y - (textCurveGap * 0.9);
				}

				sloganY += constantVars.ORIGINAL_SPACING.textSloganDistSlider;

			}
			return [sloganY, iconGapDueToCurve];
		},
	}
	/**
	 * New code ends here
	 */
	$('[data-toggle="tooltip"]').tooltip();
	// editors related functios
	var lEditor = (function () {
		var obj = {};
		currentStep = 1;
		obj.bgPattren = [];
		obj.objIconSearch = 0;
		obj.start_pairedfont = 1;
		obj.owl = {};
		obj.objIconPage = 1;
		obj.iconSerachPageIndex = 1;
		obj.currentIconSearchName = "";
		obj.nextIconSearch = true;
		obj.sampleIconArr = [];
		obj.searchIconArr = [];
		obj.currentLogo = {};
		obj.logoTempArr = [];
		obj.swiperLogoTempArr = [];
		obj.randomSliderSet = [];
		obj.fontsArray = [];
		obj.industryIconStartIndex = 0;
		obj.industryIconEndIndex = 5;
		obj.iconSVGData = {};
		obj.step7SearchIconData = {};
		obj.step7SearchIconPage = 1;
		obj.logoStyleImgTemplateIdList = [];
		obj.logoStyleImgTemplateCodeList = [];
		obj.logoStyleImgUniqTemplateCodeList = [];
		obj.logoStyleImgTemplateIdRepeatList = {};
		obj.logoStyleImgBgSchemaTypeRepeatList = {};
		obj.designLogoStyles = [];
		obj.sliderData = {
			frames: [],
			iconsId: [],
			copOriginalIcons: {},
			originalIcons: [],
			icons: [],
			textWithFonts: [],
			sloganWithFonts: [],
			templates: templatesData,
			nounIconData: []
		};
		obj.iconNameSpaceList = [];
		obj.setSession = function (key, value) {
			try {
				sessionStorage.setItem(key, value);
			}
			catch (e) {
				editor_exceptions.push(e);
			}
		}

		obj.getSession = function (key) {
			return sessionStorage.getItem(key);
		}
		obj.indusType = obj.getSession('industryType');
		obj.budgetShowType = obj.getSession('budgetShowType');

		obj.cleanSession = function (key) {
			sessionStorage.removeItem(key);
		}
		obj.currentFontFamily = function () {

		}
		/**
		 * Top header Menus of editors
		 */
		obj.showNav = function (targetNav) {
			var menuStep = $(targetNav).parents('.menuSteps').data('menuid');
			var targetAttr = $(targetNav).data('option');
			switch (menuStep) {

				case 1: {
					$('.menu_' + menuStep + ' li').removeClass('active');
					$(targetNav).parent('li').addClass('active');
					$('.commonEditSection').addClass('hidden');
					$(targetAttr).removeClass('hidden');
					$('.previewSection').removeClass('hidden');
					if (targetAttr != '') {
						$('.menu_2').removeClass('hidden');
					} else {
						$('.menu_2').addClass('hidden');
					}
					break;
				}
				case 2: {
					var subMenuStep = $(targetNav).parents('.commonEditSection').data('submenuid');
					var parentLink = obj.getSession('parentlink');
					if (parentLink != 3) {
						$('.submenu_' + subMenuStep + ' li').removeClass('active');
						$(targetNav).parent('li').addClass('active');
					}

					$('.submenu_' + subMenuStep + ' .logoSettings').addClass('hidden');
					$(targetAttr).removeClass('hidden');
					break;
				}

			}
		}

		obj.checkEditColorMenu2 = function () {

			$(".submenu_3").find('[class^="subMenu"]').parent('li').removeClass('active');
			$(".submenu_3").find('[class^="subMenu"]').parent('li').addClass('disabled');

			$(".submenu_3").find(".subMenu-12").parent('li').removeClass('disabled');
			$(".submenu_3").find(".subMenu-13").parent('li').removeClass('disabled');
			$(".submenu_3").find(".subMenu-26").parent('li').removeClass('disabled');

			if (lEditor.currentLogo.sloganName && lEditor.currentLogo.sloganName !== "" && lEditor.currentLogo.sloganName !== '') {
				$(".submenu_3").find(".subMenu-14").parent('li').removeClass('disabled');
			}
			if (lEditor.currentLogo.generate.templatePath.isIcon == 1 || lEditor.currentLogo.generate.templatePath.isMono == 1) {
				$(".submenu_3").find(".subMenu-15").parent('li').removeClass('disabled');
			}
			if ((lEditor.currentLogo.generate.templatePath.isIcon == 1 || lEditor.currentLogo.generate.templatePath.isMono == 1) && lEditor.currentLogo.generate.templatePath.isIconFrame == 1) {
				$(".submenu_3").find(".subMenu-43").parent('li').removeClass('disabled');
			}
			if (lEditor.currentLogo.generate.templatePath.isFrame == 1) {
				$(".submenu_3").find(".subMenu-16").parent('li').removeClass('disabled');
			}

		}

		obj.editLogoSteps = function () {
			var getLink, parentLink, colorDataType;

			getLink = obj.getSession('targetlink');
			parentLink = obj.getSession('parentlink');
			var defaultLink = obj.getSession('defaultlink');

			colorDataType = obj.getSession('colorDataType');
			obj.currentLogo = dh_editor_utility.getValidJsonParseObj(obj.getSession('currentLogo'));
			obj.currentFontFamily();
			$('.textFontFamily a, .sloganFontFamily a').removeClass('active');
			$('.editTags').val('');

			if (typeof jqXHR !== 'undefined') {
				jqXHR.abort();

			}
			if (typeof jqXHR1 !== 'undefined') {
				jqXHR1.abort();
			}

			if (getLink == 'undefined' || getLink == null) {
				getLink = 1;
			}

			if (getLink == 2 && defaultLink == null && parentLink == null) {
				$('.subMenu-7').trigger('click');
			}

			if (parentLink == 'undefined' || parentLink == null) {
				parentLink = getLink;
			}
			if (getLink == 12) {
				$('.mobileColorpicker').addClass('bgcolor');
			}
			else {
				$('.mobileColorpicker').removeClass('bgcolor');
			}
			getLink = parseInt(getLink);
			showEditOuterContainer(getLink);
			showEditInnerContainer(getLink);
			switch (getLink) {

				case 1: {
					$('.topParent-2').trigger('click');
					$('.previewSection').removeClass('hidden');
					$('.editFinalLogo, .editLogoSlider').addClass('hidden');
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.menu_2').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					$('[data-toggle="tooltip"]').tooltip();
					$('.finaLogoInner').html('');
					break;
				}
				case 2: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					obj.previewColors();
					obj.previewLogo();
					disableOption();
					if (rangeSliderFlag) {
						var frameSlider = obj.getSession('frameSizeSlider');
						$(".frameSizeSlider").slider("option", "value", frameSlider);
					}
					// $('.subMenu-7').trigger('click');
					break;
				}

				case 3: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					obj.previewColors();
					obj.previewLogo();
					disableOption();
					break;
				}

				case 4: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}
				case 5: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					obj.previewColors();
					obj.previewLogo();
					if (parseInt(obj.currentLogo.generate.templatePath.isIcon) == 1) {
						isIconAvail();
					}
					else if (parseInt(obj.currentLogo.generate.templatePath.isMono) == 1) {
						isMonoAvail();
					}
					else {
						console.log("cccccccccccccccccc");
					}
					break;
				}

				case 6: {
					$('.editFinalLogo, .currentLogoBox, .previewSection').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					obj.previewColors();
					obj.previewLogo();
					if (rangeSliderFlag) {
						var frameSlider = obj.getSession('frameSizeSlider');
						$(".frameSizeSlider").slider("option", "value", frameSlider);
					}
					$('.submenu_2').addClass('hidden');
					break;
				}

				case 7: {

					$('.editFinalLogo, .currentLogoBox, .previewSection').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					disableOption();
					break;
				}

				case 8: {
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					// var objs = $('.textFontFamily a:first-child');
					var objs = $('.textFontFamily').find('a[data-fontfamily="bubbly"]');
					$('.textFontFamily a').removeClass('active');
					objs.addClass('active');
					editorParameters = {};
					editorParameters.obj = objs;
					editorParameters.fors = 'logo';
					loadMoreStart = 0;
					logoByfontFamily(editorParameters);
					break;
				}

				case 9: {
					$('.editFinalLogo, .currentLogoBox, .previewSection').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					if (rangeSliderFlag) {
						var frameSlider = obj.getSession('textSloganDistSlider');
						$(".textSloganDistSlider").slider("option", "value", frameSlider);
					}
					// var sloganText = lEditor.getSession('sloganText');
					// if (sloganText == '') {
					// 	updateLogoText(constantVars.targets[lEditor.getSession('targetlink')], '', getSliderValue('sloganTextSize'), getSliderValue('sloganLetterSpacing'), '');
					// }
					disableOption();
					break;
				}
				case 10: {
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					// var objs = $('.sloganFontFamily a:first-child');
					var objs = $('.sloganFontFamily').find('a[data-fontfamily="bubbly"]');
					// $('.sloganFontFamily').removeClass('active');
					$('.sloganFontFamily a').removeClass('active');
					$(objs).addClass('active');
					editorParameters = {};
					editorParameters.obj = objs;
					editorParameters.fors = 'slogan';
					loadMoreStart = 0;
					logoByfontFamily(editorParameters);

					break;
				}
				case 11: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					obj.getCurrentLogo();
					if (rangeSliderFlag) {
						var frameSlider = obj.getSession('textSloganDistSlider');
						$(".textSloganDistSlider").slider("option", "value", frameSlider);
					}
					disableOption();
					break;
				}
				case 12: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}
				case 13: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 14: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 15: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 16: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 17: {

					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}

				case 18: {

					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}

				case 19: {

					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}
				case 20: {
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					break;
				}
				case 21: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					break;
				}
				case 22: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					break;
				}
				case 23: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					logoByContainer();
					obj.getCurrentLogo();
					obj.previewColors();
					obj.previewLogo();
					break;
				}
				case 24: {
					if (obj.currentLogo.generate.templatePath.isFrame == 0 || $(".containerOptions").hasClass('active')) {
						$('.previewSection').addClass('hidden');
						$('.editFinalLogo').addClass('hidden');
						$('.editLogoSlider').removeClass('hidden');
						loadMoreStart = 0;
						logoByContainer();
					} else {
						$('.editFinalLogo').removeClass('hidden');
						$('.editLogoSlider').addClass('hidden');
						obj.getCurrentLogo();
					}
					break;
				}

				case 25: {
					obj.setSession('targetlink', 2);
					obj.setSession('parentlink', 2);
					break;
				}

				case 26: {
					$('.colorPaletteButton').addClass('active');
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					editorParameters = {};
					editorParameters.id = 0;
					loadMoreStart = 0;
					$('.finalogoSlider').html('');
					palettsColorVariation(editorParameters);
					break;
				}
				case 27: {

					$('.editFinalLogo, .previewSection, editSymbolsSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox, .symbolVariations').removeClass('hidden');
					onSymbolSearchClick();

					break;
				}
				case 28: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider, .previewSection').addClass('hidden');
					obj.getCurrentLogo();
					break;
				}
				case 29: {
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					loadMoreStart = 0;
					getLayoutVariations();

					break;
				}
				case 30: {
					$('.editFinalLogo, .previewSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
					loadMoreStart = 0;
					obj.generateDynamicLogoVariations();
					break;
				}
				case 31: {

					$('.editFinalLogo, .currentLogoBox, .previewSection').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					$('.submenu_2').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					isIconAvail();
					break;
				}
				case 32: {

					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					loadMoreStart = 0;
					isMonoAvail();

					break;
				}

				case 34: {
					obj.setSession('targetlink', 2);
					obj.setSession('parentlink', 2);
					break;
				}

				case 39: {

					$('.editFinalLogo, .previewSection, editMonoSection').addClass('hidden');
					$('.editLogoSlider, .currentLogoBox, .monoVariations').removeClass('hidden');
					loadMoreStart = 0;
					$('.editMonogramText').val(lEditor.getMonogramText(true));
					lEditor.getMonogramVariations("");
					break;
				}
				case 40: {
					if (obj.currentLogo.generate.templatePath.isIconFrame == 0 || $(".innerContainerOptions").hasClass('active')) {
						$('.editFinalLogo, .previewSection').addClass('hidden');
						$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
						loadMoreStart = 0;
						logoByIconContainer();
					} else {
						$('.editFinalLogo, .previewSection, .currentLogoBox').removeClass('hidden');
						$('.editLogoSlider').addClass('hidden');
						obj.getCurrentLogo();
					}
					break;
				}
				case 41: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					logoByIconContainer();
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 42: {
					$('.editLogoSlider').removeClass('hidden');
					$('.editFinalLogo, .previewSection').addClass('hidden');
					loadMoreStart = 0;
					logoByContainer();
					break;
				}
				case 43: {
					$('.editFinalLogo, .currentLogoBox').removeClass('hidden');
					$('.editLogoSlider').addClass('hidden');
					obj.previewColors();
					obj.previewLogo();
					obj.getCurrentLogo();
					break;
				}
				case 44: {
					$('.editLogoSlider').removeClass('hidden');
					// $('.editFinalLogo, .currentLogoBox, .previewSection').addClass('hidden');
					$('.editFinalLogo, .previewSection').addClass('hidden');
					loadMoreStart = 0;
					logoByIconContainer();
					break;
				}

			}

			if ((parentLink == 3 || parentLink == 5 || parentLink == 6 || parentLink == 30) && getLink == 2) {
				getLink = "undefined";
				obj.setSession('targetlink', getLink);
			}

			$('.topParent-' + parentLink).parent('li').addClass('active');
			$('.topParent-' + getLink).parent('li').addClass('active');
			if (parentLink != 3) {
				$('[class^="subMenu"]').parent('li').removeClass('active');
				$('.subMenu-' + getLink).parent('li').addClass('active');
			}
			// $('[class^="subMenu"]').addClass('hidden');
			$('.subMenu-' + defaultLink).parent('li').addClass('active');
			$('[class^="subChild"]').addClass('hidden');
			$('.menu_2, .submenu_' + parentLink + ', .subChild-' + getLink + ', .subChild-' + defaultLink).removeClass('hidden');

			obj.checkEditColorMenu2();

			if (parentLink == 3) {
				if (colorDataType === 'undefined' || colorDataType == null) {
					obj.setSession('colorDataType', 'background');
					colorDataType = "background";

					if (getLink == 13 || getLink == 14 || getLink == 15 || getLink == 43 || getLink == 16) {
						obj.setSession('colorDataType', 'foreground');
						colorDataType = "foreground";
					}
				}

				if (colorDataType == 'background' || colorDataType == 'colorVar') {
					$('[class^="subMenu"]').parent('li').removeClass('active');
					$('.subMenu-' + getLink).parent('li').addClass('active');
					$('.subMenu-' + defaultLink).parent('li').addClass('active');
				}

				if (colorDataType == 'foreground') {
					$('[class^="subMenu"]').parent('li').removeClass('active');
					$('.subMenu-' + getLink).parent('li').addClass('active');
					if (getLink == 13 || getLink == 14 || getLink == 15 || getLink == 43 || getLink == 16) {
						if ($('.subMenu-' + getLink).parent('li').hasClass('disabled') && $('.subMenu-' + getLink).parent('li').hasClass('active')) {
							$('.subMenu-' + getLink).parent('li').removeClass('active');
							$(".logoEditOptions").find(".subChild-" + getLink).addClass("hidden");
						}
					}
				}
			}



			if (($(".subChild-" + getLink).length) || ($(".subChild-" + defaultLink).length)) {
				let subChildNum;
				if (defaultLink && defaultLink != "undefined") {
					subChildNum = defaultLink;
				} else {
					subChildNum = getLink;
				}
				switch (colorDataType) {
					case "background":
						updateColorPickerValue(lEditor.currentLogo.generate.bgColor, false, "", 0);
						break;
					case "foreground":
						switch (subChildNum) {
							case 13:
								updateColorPickerValue(lEditor.currentLogo.generate.mainTextColor, false, "", 0);
								break;
							case 14:
								updateColorPickerValue(lEditor.currentLogo.generate.sloganTextColor, false, "", 0);
								break;
							case 15:
								updateColorPickerValue(lEditor.currentLogo.generate.iconColor, false, "", 0);
								break;
							case 43:
								updateColorPickerValue(lEditor.currentLogo.generate.iconFrameColor, false, "", 0);
								break;
							case 16:
								if (lEditor.currentLogo.generate.templatePath.frameType === "filled") {
									updateColorPickerValue(lEditor.currentLogo.generate.frameFilledColor, false, "", 0);
								} else {
									updateColorPickerValue(lEditor.currentLogo.generate.frameColor, false, "", 0);
								}
								break;
						}
						break;
				}

			}

			checkFrame(getLink);
			checkIconFrame();

			if (getLink == 42) {
				$('.subMenu-24').parent('li').addClass('active');
				$(getLink).parent('li').removeClass('active');
			}

			if (getLink == 44) {
				$('.subMenu-40').parent('li').addClass('active');
				$(getLink).parent('li').removeClass('active');
			}

			if (defaultLink == 1 && getLink == 1) {
				$('body').addClass('preview-header');
				$('.menu_2').addClass('hidden')
			} else {
				$('body').removeClass('preview-header');
				$('html, body').animate({ scrollTop: 0 });

			}

			$('.commonClrDiv a').removeClass('active');
			if (getLink != 27) {
				addEditOptions("all");
			}
			if (getLink == 27) {
				$('.editSymbolsSection').addClass('hidden');
				$('.symbolVariations, .subChild-31').removeClass('hidden');
				$('.subMenu-31').parent('li').addClass('active');
			}
			if (getLink == 39) {
				$('.editMonoSection').addClass('hidden');
				$('.monoVariations, .subChild-32').removeClass('hidden');
				$('.subMenu-32').parent('li').addClass('active');
			}


			clearOutlineBox();
			obj.showMultiLineTextTools(lEditor.currentLogo);
			createTempHint();

		}
		obj.showMultiLineTextTools = function (p_oCurrentLogo) {
			if (p_oCurrentLogo && p_oCurrentLogo.generate) {
				var parentDiv = null;
				if (p_oCurrentLogo.generate.templatePath.isDBLineCompanyText == "yes") {

					if ($('.subMenu-7').parent("li").hasClass("active")) {
						parentDiv = $('.subChild-7').find(".company-text-box");
						parentDiv.find('.single-line-company-text').addClass("hidden");
						parentDiv.find('.remove--margin').addClass("hidden");
						parentDiv.find('.double-line-company-text').removeClass("hidden");
						parentDiv.find('.company-text-dd').text(p_oCurrentLogo.logoName);
						parentDiv.addClass('double-line-container');

						parentDiv = null;

						parentDiv = $('.subChild-7').find(".company-text-fs-box");
						parentDiv.find('.single-line-company-text').addClass("hidden");
						parentDiv.find('.remove--margin').addClass("hidden");
						parentDiv.find('.double-line-company-text').removeClass("hidden");
						parentDiv.addClass('double-line-container');

						parentDiv = null;

						parentDiv = $('.subChild-7').find(".company-text-ls-box");
						parentDiv.find('.single-line-company-text').addClass("hidden");
						parentDiv.find('.remove--margin').addClass("hidden");
						parentDiv.find('.double-line-company-text').removeClass("hidden");
						parentDiv.addClass('double-line-container');
						//edit logo name
					}
					else if ($('.subMenu-13').parent("li").hasClass("active")) {
						parentDiv = $('.subChild-13').find(".company-text-color-box");
						parentDiv.removeClass("hidden");
						parentDiv.attr("last_selected", "");
						// color
					}

					else if ($('.subMenu-8').parent("li").hasClass("active")) {
						parentDiv = $('.subChild-8').find(".company-text-font-box");
						parentDiv.removeClass("hidden");
						parentDiv.attr("last_selected", "");
						// font case
					}
					$(".editCompanyName.templateText").val(dh_editor_utility.removeMultipleSpaces(lEditor.getSession("logoname")));
				} else {
					parentDiv = $('.subChild-7').find(".company-text-box");
					parentDiv.find('.single-line-company-text').removeClass("hidden");
					parentDiv.find('.remove--margin').removeClass("hidden");
					parentDiv.find('.double-line-company-text').addClass("hidden");
					parentDiv.removeClass('double-line-container');

					parentDiv = null;

					parentDiv = $('.subChild-7').find(".company-text-fs-box");
					parentDiv.find('.single-line-company-text').removeClass("hidden");
					parentDiv.find('.remove--margin').removeClass("hidden");
					parentDiv.find('.double-line-company-text').addClass("hidden");
					parentDiv.removeClass('double-line-container');

					parentDiv = null;

					parentDiv = $('.subChild-7').find(".company-text-ls-box");
					parentDiv.find('.single-line-company-text').removeClass("hidden");
					parentDiv.find('.remove--margin').removeClass("hidden");
					parentDiv.find('.double-line-company-text').addClass("hidden");
					parentDiv.removeClass('double-line-container');

					parentDiv = null;
					parentDiv = $('.subChild-8').find(".company-text-font-box");
					parentDiv.addClass("hidden");
					parentDiv.attr("last_selected", "");

					parentDiv = null;
					parentDiv = $('.subChild-13').find(".company-text-color-box");
					parentDiv.addClass("hidden");
					parentDiv.attr("last_selected", "");
				}
			}

			currentPopoverObj = null;

		}
		$(".show-db-line-edit-popover").parent().click(function () {
			var show_popup_for = $(this).children(".show-db-line-edit-popover").attr("show_popup_for")
			if (currentPopoverBtn) {
				currentPopoverBtn.removeClass('off');
				currentPopoverBtn = null;
			}
			$(this).addClass('off');
			if (currentPopoverObj) {
				if (currentPopoverObj.length && (currentPopoverObj.attr("pop_over_shown") === "true")) {
					currentPopoverObj.popover('hide');
					currentPopoverObj.attr('pop_over_shown', 'false');
				}
			}

			currentPopoverObj = null;
			currentPopoverBtn = $(this);
			switch (show_popup_for) {
				case "edit_text":
					$('#edit_the_lines_text_dd').popover('show');
					$('#edit_the_lines_text_dd').attr('pop_over_shown', 'true');
					currentPopoverObj = $('#edit_the_lines_text_dd');
					break;
				case "edit_fs":
					$('#edit_the_lines_fs_dd').popover('show');
					$('#edit_the_lines_fs_dd').attr('pop_over_shown', 'true');
					currentPopoverObj = $('#edit_the_lines_fs_dd');
					break;
				case "edit_ls":
					$('#edit_the_lines_ls_dd').popover('show');
					$('#edit_the_lines_ls_dd').attr('pop_over_shown', 'true');
					currentPopoverObj = $('#edit_the_lines_ls_dd');
					break;
				case "change_font":
					$('#edit_the_lines_font_change_dd').popover('show');
					$('#edit_the_lines_font_change_dd').attr('pop_over_shown', 'true');
					currentPopoverObj = $('#edit_the_lines_font_change_dd');
					break;
				case "change_color":
					$('#edit_the_lines_color_change_dd').popover('show');
					$('#edit_the_lines_color_change_dd').attr('pop_over_shown', 'true');
					currentPopoverObj = $('#edit_the_lines_color_change_dd');
					break;
			}

		});
		obj.modifyLogoProperties = function (propName) {
			if (version == "v6" || version == "vd2" || version == "vd4") {
				$(".step6-preview-section").find('.finalogo--inner-wait').removeClass("hidden");
				$(".step6-preview-section").find('.finaLogoInner').addClass("hidden");
				$(".step6-preview-section").find('.flex-container').addClass("hidden");
				$('.logo-bottom-strip .bottom-right .common-btn').addClass("disabled");
			}
			var companyName = lEditor.getSession('logoname');
			var logoTextList = lEditor.getLogoTextList(companyName);
			var sloganName = lEditor.getSession('sloganText');

			var tempLogoArray1 = JSON.parse(JSON.stringify(obj.logoTempArr));
			var tempLogoArray = [];
			$.each(tempLogoArray1, function (k, v) {
				var item = tempLogoArray1[k];
				if (item.generate.templatePath.template_db_id == item.generate.templatePath.template_id) {
					tempLogoArray.push(v);
				} else {
					if (logoTextList.length > 0 && logoTextList.length == 2 && (item.generate.templatePath.template_db_id == item.generate.templatePath.template_id + ".1")) {
						tempLogoArray.push(v);
					}
				}
			});
			if (version) {
				if (tempLogoArray.length > 2) {
					if ((tempLogoArray.length % 2) == 1) {
						tempLogoArray.pop();
						// add this condition because make 2 sets of logo
					}
				}
			} else {
				if (tempLogoArray.length > 3) {
					let modulas1 = tempLogoArray.length % 3;
					if (modulas1 > 0) {
						while (modulas1 > 0) {
							tempLogoArray.pop();
							modulas1--;
						}
					}
				}
			}
			var promiseArray = [];
			$('.sliderContainer').html('');
			var previewStyle = "pointer-events:auto";

			var templateIdStyle = getTempStyle();
			var templateHint = "";

			var isPairedFont = 0;
			var pairedFontId = "";
			let btnHideClass = "";
			if (!dh_editor_utility.isMobileDevice && version == "") {
				btnHideClass = "hide_logoSlide_overlay";
			}
			for (let index = 0; index < tempLogoArray.length; index++) {

				var item = tempLogoArray[index];
				promiseArray.push((function (index, item) {
					return new Promise((resolve, reject) => {
						var logoHtml;
						var returnObj
						switch (propName) {
							case "logoname":
								obj.modifiedLogoTextAtStep6(item, logoTextList, companyName, function (p_sType) {
									if (p_sType == "yes") {
										item.logoName1 = logoTextList[0];
										item.logoName2 = logoTextList[1];
										item.logoName = logoTextList[0] + " " + logoTextList[1];
									} else {
										item.logoName = companyName;
									}
									obj.modifiedMonogramAtStep6(item, function () {
										item.generate.templatePath.sloganSetAsPerText = 0;

										if (logoMakerFunction.checkTemplateIsEqualCondition(item.generate)) {
											item.generate.templatePath.sloganSetAsPerText = 1;
										}
										obj.modifiedSloganAtStep6(item, companyName, sloganName, logoTextList, false, function (p_bValue) {
											returnObj = logoMakerFunction.generateLogoTemplate(item.generate, item.idKey, null, null, null, p_bValue, "");
											item.generate.sloganFontObject = "";
											isPairedFont = item.pairedFontId ? 1 : 0;
											templateHint = dh_lm_common_utility.showLogoAdminIds(item.generate.templatePath, "", item.fId, item.cpId, item.sfId, item.frmId, item.iconFrameId, item.monofId, false, isPairedFont, item.pairedFontId);

											if (version == "v6") {

												logoHtml = '<div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="preview--btn overlay-preview" style=' + previewStyle + '></div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + index + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div><div class="icons-edit icons-preview iconEdit" data-id="' + index + '" data-type="edit" data-logo-id="0"><span class="preview--btn" style=' + previewStyle + '>Preview logo</span><span class="edit--btn">Edit logo</span></div></div></div><div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
											} else {

												logoHtml = '<div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '" ><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + index + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div ' + btnHideClass + '"><div class="icons-edit icons-preview iconEdit edit--btn" data-id="' + index + '" data-type="edit" data-logo-id="0"><span class="edit--btn"><span class="edit--btn"></span>Edit logo</span></div><div class="icons-edit icons-purchase" data-id="' + dynamicLogoCounter + '" data-type="purchase"><span class="purchase--btn"><span class="purchase--btn"></span>Purchase</span></div><div class="iconEditHitArea" style="' + iconEditHitAreaStyle + '"></div></div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';

											}
											item = updateCurrLogoObject(item);
											resolve({
												item: item
												, logoHtml: logoHtml
											});
										});
									});
								})
								break;
							case "sloganText":
								obj.modifiedSloganAtStep6(item, companyName, sloganName, logoTextList, true, function (isEqualCaseSloganLetterSpacing) {
									returnObj = logoMakerFunction.generateLogoTemplate(item.generate, item.idKey, null, null, null, false, "");
									isPairedFont = item.pairedFontId ? 1 : 0;
									templateHint = dh_lm_common_utility.showLogoAdminIds(item.generate.templatePath, sloganName, item.fId, item.cpId, item.sfId, item.frmId, item.iconFrameId, item.monofId, false, isPairedFont, item.pairedFontId);

									if (version == "v6") {

										logoHtml = '<div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="preview--btn overlay-preview" style=' + previewStyle + '></div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + index + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div><div class="icons-edit icons-preview iconEdit" data-id="' + index + '" data-type="edit" data-logo-id="0"><span class="preview--btn" style=' + previewStyle + '>Preview logo</span><span class="edit--btn">Edit logo</span></div></div></div><div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
									} else {
										logoHtml = '<div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '" ><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + index + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div ' + btnHideClass + '"><div class="icons-edit icons-preview iconEdit edit--btn" data-id="' + index + '" data-type="edit" data-logo-id="0"><span class="edit--btn"><span class="edit--btn"></span>Edit logo</span></div><div class="icons-edit icons-purchase" data-id="' + dynamicLogoCounter + '" data-type="purchase"><span class="purchase--btn"><span class="purchase--btn"></span>Purchase</span></div><div class="iconEditHitArea" style="' + iconEditHitAreaStyle + '"></div></div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
									}
									if (isEqualCaseSloganLetterSpacing != -1) {
										item.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
									}
									item = updateCurrLogoObject(item);
									resolve({
										item: item
										, logoHtml: logoHtml
									});

								});
								break;
						}
					});
				}(index, item))
				);
			}
			Promise.all(promiseArray).then(results => {
				var tempArray = [];
				for (let index = 0; index < results.length; index++) {
					$(".sliderContainer").append(results[index].logoHtml);
					tempArray.push(results[index].item);
					if (version === "") {
						dh_utility_common.changeBg();
					}
				}
				obj.logoTempArr = tempArray;
				dynamicLogoCounter = (tempArray.length);
				if (version == "v6" || version == "vd2" || version == "vd4") {
					higlightLogoSlides(true, null);
					previewLogoAtStep6(0, true, 0);
				}
			});
		}

		obj.newModifyLogoProperties = function (propName) {
			if (version == "v6" || version == "vd2" || version == "vd4") {
				$(".step6-preview-section").find('.finalogo--inner-wait').removeClass("hidden");
				$(".step6-preview-section").find('.finaLogoInner').addClass("hidden");
				$(".step6-preview-section").find('.flex-container').addClass("hidden");
				$('.logo-bottom-strip .bottom-right .common-btn').addClass("disabled");
			}
			var companyName = lEditor.getSession('logoname');
			var logoTextList = lEditor.getLogoTextList(companyName);
			var sloganName = lEditor.getSession('sloganText');

			var tempLogoArray1 = JSON.parse(JSON.stringify(obj.logoTempArr));
			var tempLogoArray = [];
			$.each(tempLogoArray1, function (k, v) {
				var item = tempLogoArray1[k];
				if (item.generate.templatePath.template_db_id == item.generate.templatePath.template_id) {
					tempLogoArray.push(v);
				} else {
					if (logoTextList.length > 0 && logoTextList.length == 2 && (item.generate.templatePath.template_db_id == item.generate.templatePath.template_id + ".1")) {
						tempLogoArray.push(v);
					}
				}
			});
			if (version) {
				if (tempLogoArray.length > 2) {
					if ((tempLogoArray.length % 2) == 1) {
						tempLogoArray.pop();
						// add this condition because make 2 sets of logo
					}
				}
			} else {
				if (tempLogoArray.length > 3) {
					let modulas1 = tempLogoArray.length % 3;
					if (modulas1 > 0) {
						while (modulas1 > 0) {
							tempLogoArray.pop();
							modulas1--;
						}
					}
				}
			}
			if (!tempLogoArray.length) {
				return;
			}
			$('.sliderContainer').html('');
			var previewStyle = "pointer-events:auto";
			var templateIdStyle = getTempStyle();
			var templateHint = "";
			var isPairedFont = 0;
			let btnHideClass = "";
			if (!dh_editor_utility.isMobileDevice && version == "") {
				btnHideClass = "hide_logoSlide_overlay";
			}
			allLogoList = [];

			function showProcessLogo(p_aAllLogoList, isEqualCaseSloganLetterSpacing) {
				var tempArray = [];
				for (let index = 0; index < p_aAllLogoList.length; index++) {
					let logoHtml = '';
					let item = p_aAllLogoList[index].updatedItem;
					let returnObj;
					returnObj = logoMakerFunction.generateLogoTemplate(item.generate, item.idKey, null, null, null, p_aAllLogoList[index].isSetSlogan, "");
					if (propName === 'logoname') {
						item.generate.sloganFontObject = "";
					}
					isPairedFont = item.pairedFontId ? 1 : 0;
					templateHint = dh_lm_common_utility.showLogoAdminIds(item.generate.templatePath, "", item.fId, item.cpId, item.sfId, item.frmId, item.iconFrameId, item.monofId, false, isPairedFont, item.pairedFontId, "", item.styleImgId);
					if (version == "v6") {
						logoHtml = '<div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '" data-index="' + index + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="preview--btn overlay-preview" style=' + previewStyle + '></div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + index + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div><div class="icons-edit icons-preview iconEdit" data-id="' + index + '" data-type="edit" data-logo-id="0"><span class="preview--btn" style=' + previewStyle + '>Preview logo</span><span class="edit--btn">Edit logo</span></div></div></div><div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
					} else {
						logoHtml = '<div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '" data-index="' + index + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + index + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div ' + btnHideClass + '"><div class="icons-edit icons-preview iconEdit edit--btn" data-id="' + index + '" data-type="edit" data-logo-id="0"><span class="edit--btn"><span class="edit--btn"></span>Edit logo</span></div><div class="icons-edit icons-purchase" data-id="' + dynamicLogoCounter + '" data-type="purchase"><span class="purchase--btn"><span class="purchase--btn"></span>Purchase</span></div><div class="iconEditHitArea" style="' + iconEditHitAreaStyle + '"></div></div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
					}
					item = updateCurrLogoObject(item);
					if (propName === 'sloganText') {
						if (isEqualCaseSloganLetterSpacing != -1) {
							item.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
						}
					}
					$(".sliderContainer").append(logoHtml);
					if (item.generate.isArc == 1) {
						$('.sliderContainer .logos--boxes[data-index="' + index + '"] .svgSloganText_1').attr('transform', "scale(" + item.generate.templatePath.slogan.scale + ") translate(" + item.generate.templatePath.slogan.x + "," + (item.generate.templatePath.slogan.y) + ")");
						if ((item.generate.templatePath.isIcon == 1) || (item.generate.templatePath.isMono == 1)) {
							$('.sliderContainer .logos--boxes[data-index="' + index + '"] .sampleIconBox').attr('transform', "scale(" + item.generate.templatePath.iconFrameBox.scale + ") translate(" + item.generate.templatePath.iconFrameBox.x + "," + (item.generate.templatePath.iconFrameBox.y) + ")");
						}
					}
					tempArray.push(item);
					if (version === "") {
						dh_utility_common.changeBg();
					}
				}
				obj.logoTempArr = tempArray;
				dynamicLogoCounter = (tempArray.length);
				if (version == "v6" || version == "vd2" || version == "vd4") {
					higlightLogoSlides(true, null);
					previewLogoAtStep6(0, true, 0);
				}
			}
			function processLogo(tempLogoArray) {
				var item = tempLogoArray.shift();
				if (propName === 'logoname') {
					obj.modifiedLogoTextAtStep6(item, logoTextList, companyName, function (p_sType) {
						if (p_sType == "yes") {
							item.logoName1 = logoTextList[0];
							item.logoName2 = logoTextList[1];
							item.logoName = logoTextList[0] + " " + logoTextList[1];
						} else {
							item.logoName = companyName;
						}
						obj.modifiedMonogramAtStep6(item, function () {
							item.generate.templatePath.sloganSetAsPerText = 0;
							if (logoMakerFunction.checkTemplateIsEqualCondition(item.generate)) {
								item.generate.templatePath.sloganSetAsPerText = 1;
							}
							obj.modifiedSloganAtStep6(item, companyName, sloganName, logoTextList, false, function (p_bValue) {
								allLogoList.push({ "updatedItem": item, "isSetSlogan": p_bValue })
								if (tempLogoArray.length) {
									processLogo(tempLogoArray);
								} else {
									showProcessLogo(allLogoList, null);
								}
							});
						});
					});
				} else {
					if (sloganName.length > maxSloganNameLengthForCurve) {
						obj.modifiedLogoTextAtStep6(item, logoTextList, companyName, function (p_sType) {
							if (p_sType == "yes") {
								item.logoName1 = logoTextList[0];
								item.logoName2 = logoTextList[1];
								item.logoName = logoTextList[0] + " " + logoTextList[1];
							} else {
								item.logoName = companyName;
							}
							obj.modifiedSloganAtStep6(item, companyName, sloganName, logoTextList, true, function (isEqualCaseSloganLetterSpacing) {
								allLogoList.push({ "updatedItem": item, "isSetSlogan": false })
								if (tempLogoArray.length) {
									processLogo(tempLogoArray);
								} else {
									showProcessLogo(allLogoList, isEqualCaseSloganLetterSpacing);
								}
							});
						});
					} else {
						obj.modifiedSloganAtStep6(item, companyName, sloganName, logoTextList, true, function (isEqualCaseSloganLetterSpacing) {
							allLogoList.push({ "updatedItem": item, "isSetSlogan": false })
							if (tempLogoArray.length) {
								processLogo(tempLogoArray);
							} else {
								showProcessLogo(allLogoList, isEqualCaseSloganLetterSpacing);
							}
						});
					}

				}
			}
			processLogo(tempLogoArray);
		}
		/**
		 * 
		 */
		obj.removeSloganInSwiperCase = function () {
			if (version == "v6" || version == "vd2" || version == "vd4") {
				$(".step6-preview-section").find('.finalogo--inner-wait').removeClass("hidden");
				$(".step6-preview-section").find('.finaLogoInner').addClass("hidden");
				$(".step6-preview-section").find('.flex-container').addClass("hidden");
				$('.logo-bottom-strip .bottom-right .common-btn').addClass("disabled");
			}
			let finalArr = [];
			let finalSwiperItem = [];
			var templateIdStyle = getTempStyle();
			var previewStyle = "pointer-events:auto";
			if (obj.swiperLogoTempArr && obj.swiperLogoTempArr.length > 0) {
				$(".sliderContainer").html("");
				obj.swiperLogoTempArr.forEach(function (swiperLogo, p_nLogoIndex) {
					let finalStr = "";
					var eachSwiperItem = [];
					if (swiperLogo && swiperLogo.length > 0) {
						let counter = 0;
						swiperLogo.forEach(function (singleLogo, p_nSwiperLogoIndex) {
							var item = singleLogo;
							item.sloganName = "";
							item.generate.sloganPath = "";
							let returnObj = logoMakerFunction.generateLogoTemplate(item.generate, item.idKey, null, null, null, false, "");
							let templateHint = dh_lm_common_utility.showLogoAdminIds(item.generate.templatePath, "", item.fId, item.cpId, item.sfId, item.frmId, item.iconFrameId, item.monofId);
							finalStr = finalStr + obj.getSwiperSlideDiv(item, templateIdStyle, templateHint, p_nLogoIndex, p_nSwiperLogoIndex, returnObj);
							item = updateCurrLogoObject(item);
							counter++;
							eachSwiperItem.push(item);
							if (counter === swiperLogo.length) {
								finalArr.push(finalStr);
								finalSwiperItem.push(eachSwiperItem);
							}
						});
					}
				});
			}
			if (finalArr && finalArr.length > 0) {
				finalArr.forEach(function (p_sHtml, p_sIndex) {
					let sliderId = "step_six_slider_list" + p_sIndex;
					let slickElement = obj.getSwiperContainerDiv(p_sHtml, sliderId);
					$(".sliderContainer").append(slickElement);
					obj.initSwiper("." + sliderId);
					if (document.querySelector("." + sliderId + " .swiper-button-next")) {
						document.querySelector("." + sliderId + " .swiper-button-next").removeAttribute("style");
					}
					if (document.querySelector("." + sliderId + " .swiper-button-prev")) {
						document.querySelector("." + sliderId + " .swiper-button-prev").removeAttribute("style");
					}
				});
				obj.swiperLogoTempArr = finalSwiperItem;
				dynamicLogoCounter = (finalSwiperItem.length);
				if (version == "v6" || version == "vd2" || version == "vd4") {
					higlightLogoSlides(true, null);
					previewLogoAtStep6(0, true, 0);
				}
			}
		}
		/**
		 * 
		 * @param {*} p_nLogoIndex 
		 * @param {*} propName 
		 */
		obj.modifiedLogoName = function (p_nLogoIndex, propName) {
			if (version == "v6" || version == "vd2" || version == "vd4") {
				$(".step6-preview-section").find('.finalogo--inner-wait').removeClass("hidden");
				$(".step6-preview-section").find('.finaLogoInner').addClass("hidden");
				$(".step6-preview-section").find('.flex-container').addClass("hidden");
				$('.logo-bottom-strip .bottom-right .common-btn').addClass("disabled");
			}
			var companyName = lEditor.getSession('logoname');
			var logoTextList = lEditor.getLogoTextList(companyName);
			var sloganName = lEditor.getSession('sloganText');
			if (p_nLogoIndex === 0) {
				myArr = [];
				myFinalSwiperItem = [];
				$(".sliderContainer").html('');
			}
			var templateIdStyle = getTempStyle();
			if (obj.swiperLogoTempArr && obj.swiperLogoTempArr.length > 0) {
				let logoIndex = p_nLogoIndex;
				let swiperLogo = obj.swiperLogoTempArr[logoIndex];
				if (swiperLogo && swiperLogo.length > 0) {
					let swiperIndex = 0
					let item = swiperLogo[swiperIndex];
					var finalStr = "";
					var eachSwiperItem = [];
					obj.modifiedLogoTextAtStep6(item, logoTextList, companyName, function (p_sType) {
						let firstLogoPath1 = "";
						let firstLogoPath2 = "";
						let firstLogoPath = "";
						let sloganSetAsPerText;
						if (p_sType == "yes") {
							item.logoName1 = logoTextList[0];
							item.logoName2 = logoTextList[1];
							item.logoName = logoTextList[0] + " " + logoTextList[1];
							firstLogoPath1 = item.generate.logoPath1;
							firstLogoPath2 = item.generate.logoPath2;
						} else {
							item.logoName = companyName;
							firstLogoPath = item.generate.logoPath;
						}
						obj.modifiedMonogramAtStep6(item, function () {
							item.generate.templatePath.sloganSetAsPerText = 0;
							sloganSetAsPerText = 0;
							if (logoMakerFunction.checkTemplateIsEqualCondition(item.generate)) {
								item.generate.templatePath.sloganSetAsPerText = 1;
								sloganSetAsPerText = 1
							}
							obj.modifiedSloganAtStep6(item, companyName, sloganName, logoTextList, false, function (p_bValue) {
								item.generate.sloganFontObject = "";
								returnObj = logoMakerFunction.generateLogoTemplate(item.generate, item.idKey, null, null, null, p_bValue, "");
								templateHint = dh_lm_common_utility.showLogoAdminIds(item.generate.templatePath, "", item.fId, item.cpId, item.sfId, item.frmId, item.iconFrameId, item.monofId);
								finalStr = finalStr + obj.getSwiperSlideDiv(item, templateIdStyle, templateHint, logoIndex, swiperIndex, returnObj);
								item = updateCurrLogoObject(item);
								eachSwiperItem.push(item);
								swiperIndex = swiperIndex + 1;
								for (var i = swiperIndex; i < swiperLogo.length; i++) {
									item = null;
									item = swiperLogo[i];
									if (p_sType == "yes") {
										item.logoName1 = logoTextList[0];
										item.logoName2 = logoTextList[1];
										item.logoName = logoTextList[0] + " " + logoTextList[1];
										item.generate.logoPath1 = firstLogoPath1;
										item.generate.logoPath2 = firstLogoPath2;
									} else {
										item.logoName = companyName;
										item.generate.logoPath = firstLogoPath;
									}
									item.generate.templatePath.sloganSetAsPerText = sloganSetAsPerText;
									item.generate.sloganFontObject = "";
									returnObj = logoMakerFunction.generateLogoTemplate(item.generate, item.idKey, null, null, null, p_bValue, "");
									templateHint = dh_lm_common_utility.showLogoAdminIds(item.generate.templatePath, "", item.fId, item.cpId, item.sfId, item.frmId, item.iconFrameId, item.monofId);
									finalStr = finalStr + obj.getSwiperSlideDiv(item, templateIdStyle, templateHint, logoIndex, swiperIndex, returnObj);
									item = updateCurrLogoObject(item);
									eachSwiperItem.push(item);
								}
								logoIndex++;
								myArr.push(finalStr);
								myFinalSwiperItem.push(eachSwiperItem);
								obj.createAllSwiperLogo(logoIndex, obj.swiperLogoTempArr, propName);

							})
						});
					});
				}
			}
		}
		/**
		 * 
		 * @param {*} p_nLogoIndex 
		 * @param {*} propName 
		 */
		obj.modifiedSloganName = function (p_nLogoIndex, propName) {
			if (version == "v6" || version == "vd2" || version == "vd4") {
				$(".step6-preview-section").find('.finalogo--inner-wait').removeClass("hidden");
				$(".step6-preview-section").find('.finaLogoInner').addClass("hidden");
				$(".step6-preview-section").find('.flex-container').addClass("hidden");
				$('.logo-bottom-strip .bottom-right .common-btn').addClass("disabled");
			}
			var sloganName = lEditor.getSession('sloganText');
			var companyName = lEditor.getSession('logoname');
			var logoTextList = lEditor.getLogoTextList(companyName);
			if (p_nLogoIndex === 0) {
				myArr = [];
				myFinalSwiperItem = [];
				$(".sliderContainer").html('');
			}
			var templateIdStyle = getTempStyle();
			if (obj.swiperLogoTempArr && obj.swiperLogoTempArr.length > 0) {
				let logoIndex = p_nLogoIndex;
				let swiperLogo = obj.swiperLogoTempArr[logoIndex];
				if (swiperLogo && swiperLogo.length > 0) {
					let swiperIndex = 0
					let item = swiperLogo[swiperIndex];
					var finalStr = "";
					var eachSwiperItem = [];
					var firstLogoSloganPath = "";
					obj.modifiedSloganAtStep6(item, companyName, sloganName, logoTextList, true, function (isEqualCaseSloganLetterSpacing) {
						returnObj = logoMakerFunction.generateLogoTemplate(item.generate, item.idKey, null, null, null, false, "");
						templateHint = dh_lm_common_utility.showLogoAdminIds(item.generate.templatePath, sloganName, item.fId, item.cpId, item.sfId, item.frmId, item.iconFrameId, item.monofId);
						firstLogoSloganPath = item.generate.sloganPath;
						finalStr = finalStr + obj.getSwiperSlideDiv(item, templateIdStyle, templateHint, logoIndex, swiperIndex, returnObj);
						if (isEqualCaseSloganLetterSpacing != -1) {
							item.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
						}
						item = updateCurrLogoObject(item);
						eachSwiperItem.push(item);
						swiperIndex = swiperIndex + 1;
						for (var i = swiperIndex; i < swiperLogo.length; i++) {
							item = null;
							item = swiperLogo[i];
							item.generate.sloganPath = firstLogoSloganPath;
							item.sloganName = sloganName;
							returnObj = logoMakerFunction.generateLogoTemplate(item.generate, item.idKey, null, null, null, false, "");
							templateHint = dh_lm_common_utility.showLogoAdminIds(item.generate.templatePath, "", item.fId, item.cpId, item.sfId, item.frmId, item.iconFrameId, item.monofId);
							finalStr = finalStr + obj.getSwiperSlideDiv(item, templateIdStyle, templateHint, logoIndex, swiperIndex, returnObj);
							if (isEqualCaseSloganLetterSpacing != -1) {
								item.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
							}
							item = updateCurrLogoObject(item);
							eachSwiperItem.push(item);
						}
						logoIndex++;
						myArr.push(finalStr);
						myFinalSwiperItem.push(eachSwiperItem);
						obj.createAllSwiperLogo(logoIndex, obj.swiperLogoTempArr, propName);

					});
				}
			}
		}
		/**
		 * 
		 * @param {*} item 
		 * @param {*} templateIdStyle 
		 * @param {*} templateHint 
		 * @param {*} logoIndex 
		 * @param {*} swiperIndex 
		 * @param {*} returnObj 
		 * @returns 
		 */
		obj.getSwiperSlideDiv = function (item, templateIdStyle, templateHint, logoIndex, swiperIndex, returnObj) {
			if (version === "vd2" || version === "vd4") {
				let previewStyle = "pointer-events:auto";
				return '<div class="swiper-slide"><div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '" data-cpId ="' + item.cpId + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-swiper-index="' + swiperIndex + '" data-id="' + logoIndex + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><div class="icons-edit icons-preview iconEdit edit--btn" data-swiper-index="' + swiperIndex + '" data-id="' + logoIndex + '" data-type="edit" data-logo-id="0"><span class="preview--btn" style=' + previewStyle + '>Preview logo</span><span class="edit--btn">Edit logo<span class="edit--btn"></span></span></div></div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div></div>';
			} else {
				return '<div class="swiper-slide"><div class="logos--boxes" data-sfId ="' + item.sfId + '" data-fId ="' + item.fId + '" data-frmId ="' + item.frmId + '" data-cpId ="' + item.cpId + '" data-cpId ="' + item.cpId + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-swiper-index="' + swiperIndex + '" data-id="' + logoIndex + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><div class="icons-edit icons-preview iconEdit edit--btn" data-swiper-index="' + swiperIndex + '" data-id="' + logoIndex + '" data-type="edit" data-logo-id="0"><span class="edit--btn"><span class="edit--btn"></span>Edit logo</span></div><div class="icons-edit icons-purchase" data-swiper-index="' + swiperIndex + '" data-id="' + logoIndex + '" data-type="purchase"><span class="purchase--btn"><span class="purchase--btn"></span>Purchase</span></div></div><div class="svg--slide" style="background-color:' + item.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div></div>';
			}
		}
		/**
		 * 
		 * @param {*} logoIndex 
		 * @param {*} swiperLogoTempArr 
		 * @param {*} p_sType 
		 */
		obj.createAllSwiperLogo = function (logoIndex, swiperLogoTempArr, p_sType) {
			if (logoIndex < swiperLogoTempArr.length) {
				switch (p_sType) {
					case "logoname":
						obj.modifiedLogoName(logoIndex, "logoname");
						break;
					case "sloganText":
						obj.modifiedSloganName(logoIndex, "sloganText");
						break;
				}
			} else {
				if (myArr && myArr.length > 0) {
					myArr.forEach(function (p_sHtml, p_sIndex) {
						let sliderId = "step_six_slider_list" + p_sIndex;
						let slickElement = obj.getSwiperContainerDiv(p_sHtml, sliderId);
						$(".sliderContainer").append(slickElement);
						obj.initSwiper("." + sliderId);
						if (document.querySelector("." + sliderId + " .swiper-button-next")) {
							document.querySelector("." + sliderId + " .swiper-button-next").removeAttribute("style");
						}
						if (document.querySelector("." + sliderId + " .swiper-button-prev")) {
							document.querySelector("." + sliderId + " .swiper-button-prev").removeAttribute("style");
						}
					});
				}
				obj.swiperLogoTempArr = myFinalSwiperItem;
				dynamicLogoCounter = (myFinalSwiperItem.length);
				myArr = [];
				myFinalSwiperItem = [];
				if (version == "v6" || version == "vd2" || version == "vd4") {
					higlightLogoSlides(true, null);
					previewLogoAtStep6(0, true, 0);
				}
			}
		}
		/**
		 * 
		 * @param {*} p_sHtml 
		 * @param {*} sliderId 
		 * @returns 
		 */
		obj.getSwiperContainerDiv = function (p_sHtml, sliderId) {
			return '<div class="step-six-slider common-sliders">\
			<div class="swiper-container step-six-slider-list '+ sliderId + '">\<div class="swiper-wrapper">' + p_sHtml + '</div>\
			<div class="swiper-button-next logo-slider-next arrow-common" style="opacity: .35;pointer-events: none;"><svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 185.343 185.343" style="enable-background:new 0 0 185.343 185.343;" xml:space="preserve"><path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175 l74.352-74.347L44.114, 18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934 c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"></path></svg></div>\
			<div class="swiper-button-prev logo-slider-prev arrow-common" style="opacity: .35;pointer-events: none;"><svg version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 185.343 185.343" style="enable-background:new 0 0 185.343 185.343;" xml:space="preserve"><path d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175 l74.352-74.347L44.114, 18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934 c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z"></path></svg></div>\
			</div></div>';
		}
		/**
		 * 
		 */
		obj.modifiedLogoTextAtStep6 = function (item, logoTextList, companyName, p_fCallBack) {
			var logo;
			if ((item.generate.templatePath.isDBLineCompanyText == "yes") && logoTextList.length > 0 && logoTextList.length == 2) {
				opentype.load(item.generate.textFontType, function (err, font) {
					logo = font.getPath(logoTextList[0], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': constantVars.ORIGINAL_SPACING.logoLetterSpacing });
					item.generate.logoPath1 = logo.toSVG();
					item.logoName1 = logoTextList[0];
					opentype.load(item.generate.text2FontType, function (err, font) {
						logo = null;
						logo = font.getPath(logoTextList[1], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': constantVars.ORIGINAL_SPACING.logoLetterSpacing });
						item.generate.logoPath2 = logo.toSVG();
						item.logoName2 = logoTextList[1];
						item.logoName = logoTextList[0] + " " + logoTextList[1];
						if (p_fCallBack) {
							p_fCallBack("yes");
						}
					});
				});
			} else {
				opentype.load(item.generate.textFontType, function (err, font) {
					if (item.generate.isArc == 1) {
						const [curvePath, curveModel] = curveLogo.createText(font, companyName, constantVars.ORIGINAL_SPACING.logoTextSlider, constantVars.ORIGINAL_SPACING.logoLetterSpacing, item.generate.arcValue);
						if (curvePath) {
							curveLogo.updateJSON(curvePath, curveModel, item.generate, null);
						} else {
							logo = font.getPath(companyName, 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': constantVars.ORIGINAL_SPACING.logoLetterSpacing });
							item.generate.logoPath = logo.toSVG();
							curveLogo.deleteCorveFromJSON(item);
						}
					} else {
						logo = font.getPath(companyName, 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': constantVars.ORIGINAL_SPACING.logoLetterSpacing });
						item.generate.logoPath = logo.toSVG();
						item.logoName = companyName;
					}
					if (p_fCallBack) {
						p_fCallBack("no");
					}
				});
			}
		}
		/**
		 * 
		 */
		obj.modifiedMonogramAtStep6 = function (item, p_fCallBack) {
			var logo;
			if (item.generate.templatePath.isMono == 1) {
				opentype.load(item.generate.fontName, function (err, monoFont) {
					var monoText = lEditor.getMonogramText(false);
					lEditor.setMonogramText(monoText);
					var monoPath = monoFont.getPath(monoText, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);
					item.generate.iconPath = monoPath.toSVG();
					if (p_fCallBack) {
						p_fCallBack();
					}
				});
			} else {
				if (p_fCallBack) {
					p_fCallBack();
				}
			}
		}
		/**
		 * 
		 */
		obj.modifiedSloganAtStep6 = function (item, companyName, sloganName, logoTextList, isChangeSlogan, p_fCallBack) {
			if (sloganName && sloganName.length > 0) {
				opentype.load(item.generate.sloganFontType, function (err, font) {
					if (isChangeSlogan) {
						var isEqualCaseSloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
						item.generate.templatePath.sloganSetAsPerText = 0;
						if (logoMakerFunction.checkTemplateIsEqualCondition(item.generate)) {
							var logoNameLength;
							if (item.generate.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
								logoNameLength = Math.max(logoTextList[0].length, logoTextList[1].length);
							} else {
								logoNameLength = companyName.length;
							}
							var sloganNameLength = sloganName.length;
							if (logoNameLength >= sloganNameLength) {
								if (sloganNameLength >= 20) {
									isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength) / 2;
								} else {
									isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
								}
								item.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
								item.generate.templatePath.sloganSetAsPerText = 1;
							} else if (sloganNameLength >= logoNameLength) {
								if (sloganNameLength / 2 < logoNameLength) {
									isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
									item.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
									item.generate.templatePath.sloganSetAsPerText = 1;
								}
							}
						}
						var logo = font.getPath(sloganName, 0, 0, constantVars.ORIGINAL_SPACING.sloganTextSize, { 'letterSpacing': parseFloat(isEqualCaseSloganLetterSpacing) });
						item.sloganName = sloganName;
						item.generate.sloganPath = logo.toSVG();
						if (p_fCallBack) {
							p_fCallBack(isEqualCaseSloganLetterSpacing);
						}
					} else {
						item.generate.sloganFontObject = font;
						if (p_fCallBack) {
							p_fCallBack(true);
						}
					}
				});
			} else {
				if (isChangeSlogan) {
					item.sloganName = sloganName;
					item.generate.sloganPath = "";
				}
				if (p_fCallBack) {
					p_fCallBack(-1);
				}
			}
		}
		/**
		 * 
		 */
		obj.activateSelectedColors = function () {
			var colorBoxes = $('.color-selection.colorContainer .color');

			colorBoxes.removeClass('active');
			obj.refreshSelectedColorBox();
		}

		obj.refreshSelectedColorBox = function () {
			var selectedColors = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('sampleColor'));
			if (selectedColors) {
				var selectedColorBox = $('.color-container .icons-container .colorContainerBoxes');

				selectedColorBox.removeClass('multi-gradient');
				$('.color-section .color-text')[selectedColors.length > 0 ? 'hide' : 'show']();
				selectedColorBox[selectedColors.length > 0 ? 'show' : 'hide']();

				for (let index = 0; index < selectedColors.length; index++) {
					$('.color-selection.colorContainer .color[data-sampleColorId="' + selectedColors[index].samplecolorid + '"]').addClass('active');
				}
				for (let index = 0; index < selectedColorBox.length; index++) {
					if (selectedColors[selectedColors.length - 1 - index]) {
						var item = $('.color-selection.colorContainer .color[data-sampleColorId="' + selectedColors[index].samplecolorid + '"]');
						$(selectedColorBox[index]).addClass('active');
						$(selectedColorBox[index]).attr('data-sampleColorId', selectedColors[index].samplecolorid);
						if (selectedColors[index].samplecolorid == -1) {
							selectedColorBox[index].style.background = 'transparent';
							$(selectedColorBox[index]).addClass('multi-gradient');
						}
						else {
							selectedColorBox[index].style.background = item.attr('data-sampleColor');
							$(selectedColorBox[index]).removeClass('multi-gradient');
						}
					}
					else if (selectedColorBox[index]) {
						$(selectedColorBox[index]).removeClass('active');
						selectedColorBox[index].style.background = '#ffffff';
						$(selectedColorBox[index]).removeAttr('data-sampleColorId');
					}
				}
				if (selectedColors.length > 3) {
					$('.color-selection-info').show();
					$('.color-selection-info').html('+ ' + (selectedColors.length - 3) + ' more');
				}
				else {
					$('.color-selection-info').hide();
					$('.color-selection-info').html('');
				}
			}
		}
		/**
		 * 
		 */
		obj.getLogoTextList = function (p_sLogoName) {
			if (p_sLogoName != " " && p_sLogoName) {
				p_sLogoName = dh_editor_utility.removeMultipleSpaces(p_sLogoName);

				var logoNameList = [];
				if (p_sLogoName.indexOf("*") != -1) {
					logoNameList = p_sLogoName.split("*");
					return [logoNameList[0], logoNameList[1]];
				} else {
					logoNameList = p_sLogoName.split(" ");
					var firstPart;
					var lastPart;
					if (logoNameList.length >= DBLineWrapCaseVal) {
						if (logoNameList[0].length > logoNameList[logoNameList.length - 1].length) {
							var firstSpaceIndex = p_sLogoName.indexOf(" ");
							if (p_sLogoName.indexOf(" ") != -1) {
								firstPart = p_sLogoName.substr(0, firstSpaceIndex);
								lastPart = p_sLogoName.substr(firstSpaceIndex + 1);
								return [firstPart, lastPart];
							}
						} else {
							var lastSpaceIndex = p_sLogoName.lastIndexOf(" ");
							if (lastSpaceIndex != -1) {
								firstPart = p_sLogoName.substr(0, lastSpaceIndex);
								lastPart = p_sLogoName.substr(lastSpaceIndex + 1);
								return [firstPart, lastPart];
							}
						}
					} else if (logoNameList.length == 2) {
						return [logoNameList[0], logoNameList[1]];
					}
				}
			}
			return [];
		}
		/**
		 * for generating dynamic logos for step - 6   	
		 */
		obj.generateDynamicLogos = async function (isLoadMoreClick, p_fCallBack) {
			obj.enabledIconMonoCheckBox(false);
			var colorsJson;
			if (step6templatesData.length == 0) {
				dh_editor_utility.forceConsoleAtStaging("templatesData:=" + JSON.stringify(step6templatesData));
			}
			var sloganFont;
			loadMoreStart++;
			randomPagination++;
			var limit = 10;
			if (loadMoreStart == 1) {
				randomPagination = loadMoreStart;
				lEditor.logoTempArr = [];
				lEditor.logoSlider('final', 1);
			}
			$('.step_6 .load-more-anim').addClass('loading');
			let btnHideClass = "";
			if (!dh_editor_utility.isMobileDevice) {
				btnHideClass = "hide_logoSlide_overlay";
			}
			let isUserSelecedColor = obj.palletsAI();

			obj.getSliderDataIcons(false, function () {
				var savedColors = dh_editor_utility.getValidJsonParseObj(obj.getSession('sampleColor'));
				var sessionColors = [];
				if (savedColors && savedColors.length) {
					$.each(savedColors, function (k, v) {
						if (v.samplecolorid > -1) {
							sessionColors.push(v.samplecolorid);
						}
					});
				}
				var fonts = [];
				var sloganFonts = [];
				var monoFonts = [];
				var iconFrames = [];
				var iconFrames = [];
				var frames = [];
				var pellets;
				var pairedFonts = {};
				pairedFonts["fonts"] = [];
				pairedFonts["sloganFonts"] = [];
				var requiredLength;
				if (version) {
					requiredLength = 10;
				} else {
					requiredLength = displayLogoLength;
				}

				let isRandomPallets = true;
				var sloganText = obj.getSession('sloganText');
				var payLoadData = {};
				var isHardCode = false;
				var color_schema_id = +sessionStorage.getItem("cs_id");
				var isColorSchemaInSeq = +sessionStorage.getItem("seq");
				if (DH.DH_APP_MODE !== 'PRODUCTION' && isColorSchemaInSeq === 1 && version === "") {
					isRandomPallets = false;
					sessionColors = [];
				} else {
					if (DH.DH_APP_MODE !== 'PRODUCTION' && color_schema_id > 0 && version === "") {
						isHardCode = true;
						requiredLength = 10;
					}
				}
				if (isHardCode) {
					payLoadData = { action: 'randomData', start: randomPagination, color_schema_id: color_schema_id };
					// need to delete this condition after some time. it's just for graphic designer
				} else {
					if (sloganText && sloganText !== "" && version === '') {
						payLoadData = { action: 'randomData', colors: sessionColors, start: randomPagination, isRandomPallets: isRandomPallets || '', limit: requiredLength, start_pairedfont: lEditor.start_pairedfont }
					} else {
						payLoadData = { action: 'randomData', colors: sessionColors, start: randomPagination, isRandomPallets: isRandomPallets || '', limit: requiredLength }
					}
					// light_dark logic
					if (pelletsDisplay.light_dark == 1 && (currentRunningSchema === "light_dark")) {
						payLoadData = {};
						payLoadData = { action: 'randomData', colors: sessionColors, start: randomPagination, light_dark: 1, limit: requiredLength, start_pairedfont: lEditor.start_pairedfont }
					}
					else if (pelletsDisplay.light_only == 1 && (currentRunningSchema === "light_only")) {
						payLoadData = {};
						payLoadData = { action: 'randomData', colors: sessionColors, start: randomPagination, light_only: 1, limit: requiredLength, start_pairedfont: lEditor.start_pairedfont }
					}
					else if (pelletsDisplay.dark_only == 1 && (currentRunningSchema === "dark_only")) {
						payLoadData = {};
						payLoadData = { action: 'randomData', colors: sessionColors, start: randomPagination, dark_only: 1, limit: requiredLength, start_pairedfont: lEditor.start_pairedfont }
					}
				}
				jqXHR = $.ajax({
					url: DH.baseURL + '/logoMakerAjax.php',
					type: 'POST',
					data: payLoadData,
					success: function (json) {
						var json = dh_editor_utility.getValidJsonParseObj(json);
						if (json.data.pairedFonts && Object.keys(json.data.pairedFonts).length) {
							Object.keys(json.data.pairedFonts).forEach(function (k, v) {
								if (json.data.pairedFonts[k]["logoFonts"]) {
									json.data.pairedFonts[k]["logoFonts"]["pair_id"] = k;
									pairedFonts["fonts"].push(json.data.pairedFonts[k]["logoFonts"]);
								}
								if (json.data.pairedFonts[k]["sloganFonts"]) {
									json.data.pairedFonts[k]["sloganFonts"]["pair_id"] = k;
									pairedFonts["sloganFonts"].push(json.data.pairedFonts[k]["sloganFonts"]);
								}
							});
							lEditor.start_pairedfont++;
						}
						$.each(json.data.logoFonts, function (k, v) {
							fonts.push(v);
						});
						$.each(json.data.monoFonts, function (k, v) {
							monoFonts.push(v);
						});
						$.each(json.data.sloganFonts, function (k, v) {
							sloganFonts.push(v);
						});
						$.each(json.data.iconFrames, function (k, v) {
							iconFrames.push(v);
						});
						$.each(json.data.frames, function (k, v) {
							frames.push(v);
						});
						let allFrameList = dh_editor_utility.shuffleTheArray([...frames]);

						if (showBothTypeFrame) {
							if (allFrameList.length) {
								let allFilledFrameList = [];
								let allOutlineFrameList = [];
								$.each(allFrameList, function (k, v) {
									if (v.type == "outline") {
										allOutlineFrameList.push(v)
									}
									if (v.type == "filled") {
										allFilledFrameList.push(v)
									}
								});
								let fcnt = 0;
								allFrameList = [];
								while (fcnt < frames.length) {
									if (fcnt % 2 === 0) {
										allFilledFrameList.length && allFrameList.push(allFilledFrameList.pop())
									} else {
										allOutlineFrameList.length && allFrameList.push(allOutlineFrameList.pop())
									}
									fcnt++;
								}
							}
						}
						if (isHardCode) {
							let p = 0;
							pellets = [];
							if (json.data.pellets.length) {
								while (p < requiredLength) {
									pellets[p] = json.data.pellets[0];
									p++;
								}
							} else {
								alert("Color scheam id " + color_schema_id + " not exist");
								return;
							}

						} else {
							pellets = json.data.pellets;
							let consoleTxt = "";
							let logicPelletsList = obj.runPelletsDisplayLogic(requiredLength, [...json.data.pellets]);
							if (logicPelletsList && logicPelletsList.length === requiredLength) {
								pellets = [];
								pellets = [...logicPelletsList];
								consoleTxt = "%c pellets  are showing using " + currentRunningSchema + " color schema";

							} else {
								consoleTxt = "%c pellets are showing using same as live default logic";
							}
						}
						colorsJson = json.data.pellets;
						if (pellets.length < requiredLength) {
							randomPagination = 0;
							if (pellets.length == 0) {
								obj.generateDynamicLogos(false, null);
							}
						} else {
							if (pellets.length > requiredLength) {
								pellets = pellets.slice(0, requiredLength);
							}
						}

						var logoText = obj.getSession('logoname');
						var logoTextList = obj.getLogoTextList(obj.getSession('logoname'));
						var templates = [];
						var icons = obj.sliderData.icons;
						var iconsId = obj.sliderData.iconsId;
						var isIconTemplate = 0;
						$.each(icons, function (keee, veee) {
							if (veee != "") {
								isIconTemplate = 1;
							}
						});
						if (step6templatesData.length === 0 && loadMoreStart == 1) {
							if (DH.DH_APP_MODE !== 'PRODUCTION') {
								dh_utility_common.alert({ type: 'error', message: 'There is some problem in logoMakerAjax.php which action is templates and due to this we are unable to get step6templatesData' });
							}
							$("#logomaker_icon_expired").modal('show');
						}
						let isSymbolExist = 1;
						if (step6templatesData.length == 1) {
							templates = step6templatesData;
						} else {
							if (icons.length == 0 || isIconTemplate == 0) {
								isSymbolExist = 0;
								$.each(step6templatesData, function (k, v) {
									if (v.isIcon == 0) {
										if (v.template_db_id == v.template_id) {
											templates.push(v);
										} else {
											if (logoTextList.length > 0 && logoTextList.length == 2 && (v.template_db_id == v.template_id + ".1")) {
												templates.push(v);
											}
										}
									}
								});
							} else {
								if (logoTextList.length > 0 && logoTextList.length == 2) {
									templates = step6templatesData;
								} else {
									$.each(step6templatesData, function (k, v) {
										if (v.template_db_id == v.template_id) {
											templates.push(v);
										}
									});
								}
							}
						}
						if ($('.step_6 .symbol-container .iconContainerBoxes img').length) {
						} else {
							obj.showIconCheckBox(false);
						}
						let randomTemplateList = [];
						if (isSymbolExist) {
							randomTemplateList = lEditor.runTemplateDisplayLogic(logoText, requiredLength, isUserSelecedColor);
						}
						var arr = [];
						arr[0] = fonts.length; // text
						arr[1] = frames.length;
						arr[2] = icons.length;
						arr[3] = templates.length;
						arr[4] = pellets.length;
						arr[5] = sloganFonts.length;
						arr[6] = iconFrames.length;
						arr[7] = monoFonts.length;
						obj.randomSliderSet = [];
						var monoTemplate = 0;
						// as per below logic in inshow templates only one mono template will be on
						if (templates.length == 1) {
							for (i = 0; i < pellets.length; i++) {
								var comb = logoMakerFunction.getRandomCombination(arr);
								if (logoMakerFunction.isUniqueComination(obj.randomSliderSet, comb)) {
									obj.randomSliderSet.push(comb);
								}
							}
						} else {
							for (i = 0; i < pellets.length; i++) {
								isCond = true;
								while (isCond) {
									var comb = logoMakerFunction.getRandomCombination(arr);
									if (logoMakerFunction.isUniqueComination(obj.randomSliderSet, comb)) {
										if (templates[comb[3]].isMono == 1) {
											obj.randomSliderSet.push(comb);
											isCond = false;
											monoTemplate++;
										} else {
											if (templates[comb[3]].isMono == 0) {
												obj.randomSliderSet.push(comb);
												isCond = false;
											}
										}
									}
								}
							}
						}

						var i = 0;
						obj.randomSliderSet = obj.randomSliderSet.map((a) => ({ sort: Math.random(), value: a })).sort((a, b) => a.sort - b.sort).map((a) => a.value);
						var fontLoader = 0;

						// loaderShow();
						var j = (loadMoreStart - 1) * limit;
						var randomSlideArray = [];

						var templateIdStyle = getTempStyle();
						let totalPatternAllowed = 0;
						const randomSliderKeys = Object.keys(obj.randomSliderSet);
						for (let i = 0; i < randomSliderKeys.length; i++) {
							let k = randomSliderKeys[i];
							let v = obj.randomSliderSet[k];
							randomSlideArray.push(new Promise((success, failure) => {
								v[0] = fontLoader++;
								var logoTemp = {
									logoPath: "",
									logoPath1: "",
									logoPath2: "",
									sloganPath: "",
									framePath: "",
									iconFramePath: "",
									iconPath: "",
									templatePath: "",
									bgColor: ""
								};
								var promiseArr = [];
								promiseArr.push(new Promise((resolve, reject) => {
									if (randomTemplateList[k]["style_image_details"] && randomTemplateList[k]["style_image_details"]["text_font"] && randomTemplateList[k]["style_image_details"]["text_font"] != "") {
										opentype.load(randomTemplateList[k]["style_image_details"]["text_font"], function (err, font) {
											if (err) {
												console.error(randomTemplateList[k]["style_image_details"]["text_font"] + ' Font could not be loaded: ' + err);
											} else {
												resolve({ font: font, type: 'company_name' });
											}
										});
									}
									else if (pairedFonts.fonts.length && pairedFonts.fonts[k] && pairedFonts.fonts[k].link && pairedFonts.sloganFonts.length && pairedFonts.sloganFonts[k] && pairedFonts.sloganFonts[k].link) {
										opentype.load(pairedFonts.fonts[k].link, function (err, font) {
											if (err) {
												console.error(pairedFonts.fonts[k].link + ' Font could not be loaded: ' + err);
											} else {
												resolve({ font: font, type: 'company_name', link: pairedFonts.fonts[k].link, id: pairedFonts.fonts[k].id, pair_id: pairedFonts.fonts[k].pair_id });
											}

										});
									} else {
										if (fonts[v[0]].link && fonts[v[0]].link != "") {
											opentype.load(fonts[v[0]].link, function (err, font) {
												if (err) {
													console.error(fonts[v[0]].link + ' Font could not be loaded: ' + err);
												} else {
													resolve({ font: font, type: 'company_name' });
												}
											});
										}
									}
								}));
								promiseArr.push(new Promise((resolve, reject) => {
									if (randomTemplateList[k]["style_image_details"] && randomTemplateList[k]["style_image_details"]["slogan_font"] && randomTemplateList[k]["style_image_details"]["slogan_font"] != "") {
										opentype.load(randomTemplateList[k]["style_image_details"]["slogan_font"], function (err, font) {
											if (err) {
												console.error(randomTemplateList[k]["style_image_details"]["slogan_font"] + ' Font could not be loaded: ' + err);
											} else {
												resolve({ font: font, type: 'slogan' });
											}
										});
									}
									else if (pairedFonts.fonts.length && pairedFonts.fonts[k] && pairedFonts.fonts[k].link && pairedFonts.sloganFonts.length && pairedFonts.sloganFonts[k] && pairedFonts.sloganFonts[k].link) {
										opentype.load(pairedFonts.sloganFonts[k].link, function (err, font) {
											if (err) {
												console.error(pairedFonts.sloganFonts[k].link + ' Font could not be loaded: ' + err);
											} else {
												resolve({ font: font, type: 'slogan', link: pairedFonts.sloganFonts[k].link, id: pairedFonts.sloganFonts[k].id, pair_id: pairedFonts.fonts[k].pair_id });
											}

										});
									} else {
										if (sloganFonts[v[5]].link && sloganFonts[v[5]].link != "") {
											opentype.load(sloganFonts[v[5]].link, function (err, font) {
												if (err) {
													console.error(sloganFonts[v[5]].link + ' Font could not be loaded: ' + err);
												} else {
													resolve({ font: font, type: 'slogan' });
												}
											});
										}
									}
								}));
								promiseArr.push(new Promise((resolve, reject) => {
									if (randomTemplateList[k]["style_image_details"] && randomTemplateList[k]["style_image_details"]["mono_font"] && randomTemplateList[k]["style_image_details"]["mono_font"] != "") {
										opentype.load(randomTemplateList[k]["style_image_details"]["mono_font"], function (err, font) {
											if (err) {
												console.error(randomTemplateList[k]["style_image_details"]["mono_font"] + ' Font could not be loaded: ' + err);
											} else {
												resolve({ font: font, type: 'monofont' });
											}
										});
									}
									else if (monoFonts[v[7]].link && monoFonts[v[7]].link != "") {
										opentype.load(monoFonts[v[7]].link, function (err, font) {
											if (err) {
												console.error(monoFonts[v[7]].link + ' Font could not be loaded: ' + err);
											} else {
												resolve({ font: font, type: 'monofont' });
											}

										});
									}
								}));
								Promise.all(promiseArr).then(newFonts => {
									var logo = null;
									let isDesignStyleLogo = 0;
									let style_image_details = null;
									let style_image_id = "";
									if (randomTemplateList.length >= requiredLength && randomTemplateList[k]) {
										if (randomTemplateList[k]["template_code"]) {
											logoTemp.templatePath = randomTemplateList[k]["template_code"];
											isDesignStyleLogo = 1;
											style_image_details = randomTemplateList[k]["style_image_details"];
											style_image_id = randomTemplateList[k]["id"];
										} else {
											logoTemp.templatePath = randomTemplateList[k];
										}
									} else {
										logoTemp.templatePath = templates[v[3]];
									}

									if (logoTextList.length == 2 && logoTemp.templatePath.text1 && logoTemp.templatePath.text2 && logoTemp.templatePath.updates.text1 && logoTemp.templatePath.updates.text2) {
										logo = newFonts[0].font.getPath(logoTextList[0], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
										logoTemp.logoPath1 = logo.toSVG();

										logo = null;
										logo = newFonts[0].font.getPath(logoTextList[1], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
										logoTemp.logoPath2 = logo.toSVG();
										logoTemp.templatePath.isDBLineCompanyText = "yes";
									} else {
										let isCurveLogoCreate = null;
										if (isDesignStyleLogo && style_image_details && style_image_details.isArc == "1" && style_image_details.arc_dir) {
											isCurveLogoCreate = curveLogo.letsDecideCurveLogoCreate(logoTemp.templatePath, logoText, sloganText, loadMoreStart, "design_style_logo", style_image_details.arc_dir);
										} else {
											if (!isDesignStyleLogo) {
												isCurveLogoCreate = curveLogo.letsDecideCurveLogoCreate(logoTemp.templatePath, logoText, sloganText, loadMoreStart);
											}
											else {
												console.log('%c may be do somthng in futuer here ', 'background: #222; color: #bada55; font-size: 20px');
											}
										}
										if (isCurveLogoCreate) {
											const [curvePath, curveModel] = curveLogo.createText(newFonts[0].font, logoText, constantVars.ORIGINAL_SPACING.logoTextSlider, constantVars.ORIGINAL_SPACING.logoLetterSpacing, defaultCurveValue);
											if (curvePath) {
												curveLogo.updateJSON(curvePath, curveModel, logoTemp, defaultCurveValue);
												logoTemp.isArc = 1;
											} else {
												logo = newFonts[0].font.getPath(logoText, 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
												logoTemp.logoPath = logo.toSVG();
											}
											logoTemp.templatePath.isDBLineCompanyText = "no";
										} else {
											logo = newFonts[0].font.getPath(logoText, 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
											logoTemp.logoPath = logo.toSVG();
											logoTemp.templatePath.isDBLineCompanyText = "no";
										}
									}
									if (logoTextList.length > 0 && logoTextList.length == 2) {
										logoTemp.splitLogoName = logoTextList[0] + "*" + logoTextList[1];
									}
									var logoNameLength = 0;
									if (logoTemp.templatePath.isDBLineCompanyText == "yes") {
										logoNameLength = Math.max(logoTextList[0].length, logoTextList[1].length)
									} else {
										logoNameLength = logoText.length;
									}
									var sloganNameLength = sloganText.length;
									var isEqualCaseSloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
									logoTemp.templatePath.sloganSetAsPerText = 0;

									var IsEqualCondition = false;
									if (logoTemp.templatePath.isDBLineCompanyText == "yes") {
										if (logoTemp.templatePath.isEqual == 1 && sloganText && (sloganText != "") && (sloganNameLength >= 9) && (logoNameLength >= (sloganNameLength)) && (logoNameLength <= 35)) {
											IsEqualCondition = true;
										}
									} else {
										if (logoTemp.templatePath.isEqual == 1 && sloganText && (sloganText != "") && (sloganText.length >= 9) && (logoText.length >= sloganText.length) && (logoText.length <= 35)) {
											IsEqualCondition = true;
										}
									}

									if (IsEqualCondition) {
										if (logoNameLength >= sloganNameLength) {
											if (sloganNameLength >= 20) {
												isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength) / 2;
											} else {
												isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
											}
											logoTemp.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
											logoTemp.templatePath.sloganSetAsPerText = 1;
										} else if (sloganNameLength >= logoNameLength) {
											if (sloganNameLength / 2 < logoNameLength) {
												isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
												logoTemp.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
												logoTemp.templatePath.sloganSetAsPerText = 1;
											}
										}
									}
									if (sloganText && sloganText != "") {
										var slogan = newFonts[1].font.getPath(sloganText, 0, 0, constantVars.ORIGINAL_SPACING.sloganTextSize, { 'letterSpacing': parseFloat(isEqualCaseSloganLetterSpacing) });
										sloganFont = newFonts[1].font;
										logoTemp.sloganPath = slogan.toSVG()
									}
									var monoText;
									if (isDesignStyleLogo && style_image_details) {
										if (style_image_details["mono_text"] === "single") {
											monoText = lEditor.getMonogramText(false, true);
										} else {
											monoText = lEditor.getMonogramText(false, false);
										}
									} else {
										if (loadMoreStart % 2 === 0) {
											monoText = lEditor.getMonogramText(false, false);
										} else {
											let monoRandomNum = Math.round(Math.random() * loadMoreStart);
											if (isCustomMONO && (monoRandomNum % 2 === 0)) {
												monoText = lEditor.getMonogramText(false, true);
											} else {
												monoText = lEditor.getMonogramText(false, false);
											}

										}
									}
									var monoPath = newFonts[2].font.getPath(monoText, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);
									monoFont = newFonts[2].font;
									logoTemp.monogramText = monoText;
									let templateIsFrame = false;
									logoTemp.templatePath.frame_width = "";
									logoTemp.templatePath.frame_height = "";
									logoTemp.templatePath.frameShapeName = "";
									logoTemp.templatePath.frmId = "";
									let currentFrame = {};
									// let palletIndex = isRandomPallets ? pellets[v[4]] : pellets[i];
									let palletIndex = pellets[i];
									if (logoTemp.templatePath.isFrame == 1) {
										if (isDesignStyleLogo && style_image_details.outer_frame) {
											if (style_image_details.outer_frame.type) {
												currentFrame = lEditor.getOuterFrameForDesignStyleLogo(style_image_details.outer_frame.type, style_image_details.outer_frame.shape);
												if (!currentFrame) {
													currentFrame = lEditor.getOuterFrameForDesignStyleLogo(style_image_details.outer_frame.type);
												}
											} else {
												currentFrame = frames[v[1]];
												// fail safe
											}
										}
										if ((!currentFrame) || (!Object.keys(currentFrame).length)) {
											if (showBothTypeFrame && allFrameList.length) {
												currentFrame = allFrameList.shift();
											} else {
												currentFrame = frames[v[1]];
											}
										}
										logoTemp.framePath = currentFrame.svg;
										logoTemp.templatePath.frameType = currentFrame.type;
										logoTemp.templatePath.frameOverlap = currentFrame.isOverlap;
										if (currentFrame.frame_width) logoTemp.templatePath.frame_width = currentFrame.frame_width;
										if (currentFrame.frame_height) logoTemp.templatePath.frame_height = currentFrame.frame_height;
										if (currentFrame.shape) logoTemp.templatePath.frameShapeName = currentFrame.shape;
										templateIsFrame = true;
										logoTemp.templatePath.frmId = currentFrame.id;
									} else {
										logoTemp.framePath = "";
										logoTemp.templatePath.frameType = "";
										logoTemp.templatePath.frameOverlap = "";
									}
									let templateIsIconFrame = false;
									if (logoTemp.templatePath.isIconFrame == 1) {
										let currentIconFrame = {};
										if (isDesignStyleLogo && style_image_details.inner_frame) {
											currentIconFrame = lEditor.getInnerFrameForDesignStyleLogo(style_image_details.inner_frame.type, style_image_details.inner_frame.shape);
											if (currentIconFrame) {
												logoTemp.iconFramePath = currentIconFrame.svg;
											} else {
												currentIconFrame = lEditor.getInnerFrameForDesignStyleLogo(style_image_details.inner_frame.type);
												if (currentIconFrame) {
													logoTemp.iconFramePath = currentIconFrame.svg;
												} else {
													logoTemp.iconFramePath = iconFrames[v[6]].svg;
												}
											}
										} else {
											logoTemp.iconFramePath = iconFrames[v[6]].svg;
										}
										templateIsIconFrame = true;
									} else {
										logoTemp.iconFramePath = "";
									}
									let templateIsMono = false;
									var searchIconsId = "";
									if (typeof logoTemp.templatePath.isMono != "undefined" && logoTemp.templatePath.isMono == 1) {

										logoTemp.iconPath = monoPath.toSVG();
										templateIsMono = true;

									} else if (logoTemp.templatePath.isIcon == 1) {
										logoTemp.iconPath = icons[v[2]];
										searchIconsId = iconsId[v[2]];
									} else {
										logoTemp.iconPath = "";
									}

									logoTemp.templateType = v[3];
									if (useOriginalColorsOfDesignLogo && isDesignStyleLogo && style_image_details && (!isUserSelecedColor) && (loadMoreStart == 1)) {
										style_image_details.bg_color && (palletIndex.bg_color = style_image_details.bg_color);
										if (style_image_details.text_color) {
											if (style_image_details.text_color.includes("_gradient")) {
												palletIndex.text_color = style_image_details.text_color.replace("_gradient", "").trim();
											} else {
												palletIndex.text_color = style_image_details.text_color;
											}
											palletIndex.slogan_color = palletIndex.text_color;
											palletIndex.icon_color = palletIndex.text_color;
											palletIndex.filled_frame_color = style_image_details.bg_color;
											palletIndex.frame_color = palletIndex.text_color;
											palletIndex.icon_frame_color = palletIndex.text_color;
										}
										if (style_image_details.slogan_color) {
											if (style_image_details.slogan_color.includes("_gradient")) {
												palletIndex.slogan_color = style_image_details.slogan_color.replace("_gradient", "").trim();
											} else {
												palletIndex.slogan_color = style_image_details.slogan_color;
											}
										}
										if (style_image_details.icon && style_image_details.icon.color) {
											if (style_image_details.icon.color.includes("_gradient")) {
												palletIndex.icon_color = style_image_details.icon.color.replace("_gradient", "").trim();
											} else {
												palletIndex.icon_color = style_image_details.icon.color;
											}
										}
										if (style_image_details.outer_frame.color && style_image_details.outer_frame.type === "filled") {
											if (style_image_details.outer_frame.color.includes("_gradient")) {
												palletIndex.filled_frame_color = style_image_details.outer_frame.color.replace("_gradient", "").trim();
											} else {
												palletIndex.filled_frame_color = style_image_details.outer_frame.color;
											}
										}
										if (style_image_details.outer_frame.type === "outline") {
											if (style_image_details.outer_frame.color.includes("_gradient")) {
												palletIndex.frame_color = style_image_details.outer_frame.color.replace("_gradient", "").trim();
											} else {
												palletIndex.frame_color = style_image_details.outer_frame.color;
											}
										}
										if (style_image_details.inner_frame.color) {
											if (style_image_details.inner_frame.color.includes("_gradient")) {
												palletIndex.icon_frame_color = style_image_details.inner_frame.color.replace("_gradient", "").trim();
											} else {
												palletIndex.icon_frame_color = style_image_details.inner_frame.color;
											}
										}
									} else {

									}
									logoTemp.bgColor = palletIndex.bg_color;
									logoTemp.mainTextColor = "";
									logoTemp.mainText2Color = "";
									logoTemp.sloganTextColor = "";
									logoTemp.iconColor = "";
									logoTemp.frameColor = "";
									logoTemp.frameFilledColor = "";
									logoTemp.textGradient = "";
									logoTemp.text2Gradient = "";
									logoTemp.sloganGradient = "";
									logoTemp.iconGradient = "";
									logoTemp.frameGradient = "";
									logoTemp.frameFilledGradient = "";
									logoTemp.iconFrameColor = "";
									logoTemp.iconFrameGradient = "";

									var idKey = logoMakerFunction.genRandomId();

									if (gradientsArray[palletIndex.text_color]) {
										logoTemp.textGradient = palletIndex.text_color;
										if (logoTemp.templatePath.isDBLineCompanyText == "yes") {
											logoTemp.text2Gradient = palletIndex.text_color;
										}
									}
									else {
										logoTemp.mainTextColor = palletIndex.text_color;
										if (logoTemp.templatePath.isDBLineCompanyText == "yes") {
											logoTemp.mainText2Color = palletIndex.text_color;
										}
									}

									if (gradientsArray[palletIndex.slogan_color]) {
										logoTemp.sloganGradient = palletIndex.slogan_color;
									}
									else {
										logoTemp.sloganTextColor = palletIndex.slogan_color;
									}

									if (gradientsArray[palletIndex.icon_color]) {
										logoTemp.iconGradient = palletIndex.icon_color;
									}
									else {
										logoTemp.iconColor = palletIndex.icon_color;
									}

									if (gradientsArray[palletIndex.frame_color]) {
										logoTemp.frameGradient = palletIndex.frame_color;
										logoTemp.iconFrameGradient = palletIndex.frame_color;
									}
									else {
										logoTemp.frameColor = palletIndex.frame_color;
										logoTemp.iconFrameColor = palletIndex.frame_color;
									}

									if (gradientsArray[palletIndex.filled_frame_color]) {
										logoTemp.frameFilledGradient = palletIndex.filled_frame_color;
									}
									else {
										logoTemp.frameFilledColor = palletIndex.filled_frame_color;
									}

									if (isDesignStyleLogo) {
										if (!palletIndex.icon_frame_color) {
											palletIndex.icon_frame_color = palletIndex.frame_color;
										}
										if (gradientsArray[palletIndex.icon_frame_color]) {
											logoTemp.iconFrameGradient = palletIndex.icon_frame_color;
										}
										else {
											logoTemp.iconFrameColor = palletIndex.icon_frame_color;
										}
									}
									logoTemp.idKey = idKey;
									// logoTemp.fontName = monoFonts[v[7]].link;
									let companyNameFontLink;
									let companyNameFontId;
									let sloganFontLink;
									let sloganFontId;
									let isPairedFont = 0;
									let pairedFontId = "";
									let monoFontLink;
									let monoFontId;

									if (randomTemplateList[k]["style_image_details"] && randomTemplateList[k]["style_image_details"]["slogan_font"] && randomTemplateList[k]["style_image_details"]["slogan_font"] != "") {
										if (randomTemplateList[k]["style_image_details"]["text_font"] && randomTemplateList[k]["style_image_details"]["slogan_font"]) {
											isPairedFont = 1;
										}
										sloganFontLink = randomTemplateList[k]["style_image_details"]["slogan_font"];
										sloganFontId = randomTemplateList[k]["style_image_details"]["slogan_font_id"];
									}
									else if (newFonts[1].link) {
										if (newFonts[0].link && newFonts[1].link) {
											isPairedFont = 1;
										}
										sloganFontLink = newFonts[1].link;
										sloganFontId = newFonts[1].id;
									} else {
										sloganFontLink = sloganFonts[v[5]].link;
										sloganFontId = sloganFonts[v[5]].id;
									}
									logoTemp.sloganFontType = sloganFontLink;
									if (randomTemplateList[k]["style_image_details"] && randomTemplateList[k]["style_image_details"]["text_font"] && randomTemplateList[k]["style_image_details"]["text_font"] != "") {
										companyNameFontLink = randomTemplateList[k]["style_image_details"]["text_font"];
										companyNameFontId = randomTemplateList[k]["style_image_details"]["text_font_id"];
										pairedFontId = randomTemplateList[k]["style_image_details"]["text_font_id"];
									}
									else if (newFonts[0].link) {
										companyNameFontLink = newFonts[0].link;
										companyNameFontId = newFonts[0].id;
										pairedFontId = newFonts[0].pair_id;
									} else {
										companyNameFontLink = fonts[v[0]].link;
										companyNameFontId = fonts[v[0]].id;
									}
									if (randomTemplateList[k]["style_image_details"] && randomTemplateList[k]["style_image_details"]["mono_font"] && randomTemplateList[k]["style_image_details"]["mono_font"] != "") {
										monoFontLink = randomTemplateList[k]["style_image_details"]["mono_font"];
										monoFontId = randomTemplateList[k]["style_image_details"]["mono_font_id"];
									}
									else {
										monoFontLink = monoFonts[v[7]].link;
										monoFontId = monoFonts[v[7]].id;
									}

									logoTemp.textFontType = companyNameFontLink;
									logoTemp.text2FontType = companyNameFontLink;

									logoTemp.sloganFontObject = sloganFont;
									logoTemp.fontName = monoFontLink;
									let isPatternInBg = 0;

									async function makepatterninlogo() {
										let shouldMakePattren = Math.random() > 0.5;

										const keys = Object.keys(allBgPatternSVGHtml);
										let index = keys[Math.floor(Math.random() * keys.length)];
										if (allBgPatternSVGHtml[index].svg_data == "" && totalPatternAllowed < maxPatternForEachLoadMore && shouldMakePattren) {
											allBgPatternSVGHtml[index].svg_data = "loading";
											allBgPatternSVGHtml[index].svg_data = await dh_editor_utility.getSvgHtml(allBgPatternSVGHtml[index].svg_url);
										}
										if (shouldMakePattren && UsePatternInBG && totalPatternAllowed < maxPatternForEachLoadMore && allBgPatternSVGHtml[index].svg_data != "loading" && allBgPatternSVGHtml[index].svg_data != "") {
											totalPatternAllowed++;
											let lightOrDark = dh_editor_utility.lightOrDark(logoTemp.bgColor);
											let fillColor = logoTemp.bgColor == '#000000' ? '#ffffff' : dh_editor_utility.colorShade(logoTemp.bgColor, (lightOrDark == "light" ? -100 : 100));
											let color = (logoTemp.bgPattern && logoTemp.bgPattern.fillcolor) ? logoTemp.bgPattern.fillcolor : fillColor;//pattrenDefaultValue.fillColor;//v.text_color;
											let bgPattern = dh_lm_common_utility.makeBgPattern(allBgPatternSVGHtml[index].svg_data,
												color,
												pattrenDefaultValue.opacity,
												pattrenDefaultValue.rotation,
												pattrenDefaultValue.scale,
												pattrenDefaultValue.distance,
												index);
											if (bgPattern) {
												logoTemp.bgPattern = {};
												logoTemp.bgPattern.id = bgPattern.id;
												logoTemp.bgPattern.width = bgPattern.width;
												logoTemp.bgPattern.height = bgPattern.height;
												logoTemp.bgPattern.fillcolor = color;
												logoTemp.bgPattern.opacity = pattrenDefaultValue.opacity;
												logoTemp.bgPattern.rotation = pattrenDefaultValue.rotation;
												logoTemp.bgPattern.scale = pattrenDefaultValue.scale;
												logoTemp.bgPattern.distance = pattrenDefaultValue.distance;
												logoTemp.bgPattern.pattern = bgPattern.pattern;
												logoTemp.bgPattern.isRepeat = allBgPatternSVGHtml[index]["isRepeat"];
												logoTemp.bgPattern.svg_url = allBgPatternSVGHtml[index]["svg_url"];
												isPatternInBg = 1
											}
										}

										let firstLogoList = obj.createStep6LogoData(logoTemp, idKey, logoTextList, sloganFontId, companyNameFontId, templateIsFrame, currentFrame.id, palletIndex.color_id, templateIsIconFrame, iconFrames[v[1]].id, templateIsMono, monoFontId, isEqualCaseSloganLetterSpacing, searchIconsId, pairedFontId, style_image_id);

										let first_logoTemp = firstLogoList[0];
										let first_dObj = firstLogoList[1];

										var templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.templatePath, sloganText, companyNameFontId, palletIndex.color_id, sloganFontId, currentFrame.id, iconFrames[v[1]].id, monoFontId, false, isPairedFont, pairedFontId, palletIndex.schema_type, style_image_id, isPatternInBg, index);

										var previewStyle = "pointer-events:auto";
										if (!isLoadMoreClick) {
											previewStyle = "pointer-events:none";

										}
										var divider1 = 3;
										if (version) {
											divider1 = 2;
										}
										if ((i + 1) == pellets.length && pellets.length % divider1 == 1) {
										} else {
											switch (version) {
												case "v6":

													// solved iPhone step6 issue
													slickElement = '<div class="logos--boxes" data-sfId ="' + sloganFonts[v[5]].id + '" data-fId ="' + fonts[v[0]].id + '" data-frmId ="' + frames[v[1]].id + '" data-cpId ="' + palletIndex.color_id + '" data-cpId ="' + palletIndex.color_id + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="preview--btn overlay-preview" style=' + previewStyle + '></div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + dynamicLogoCounter + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div><div class="icons-edit icons-preview iconEdit" data-id="' + dynamicLogoCounter + '" data-type="edit" data-logo-id="0"><span class="preview--btn" style=' + previewStyle + '>Preview logo</span><span class="edit--btn">Edit logo</span></div></div></div><div><div class="svg--slide" style="background-color:' + logoTemp.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + logoMakerFunction.getFinalLogoTemplate(first_dObj.generate) + '</div></div></div></div>';
													break;
												case "vd1":
												case "vd2":
												case "vd3":
												case "vd4":
													let ac = colorsJson.slice();
													let av = obj.removePlate(ac, "color_id", palletIndex.color_id);
													slickElement = obj.makeSingletSwiperLogo(logoTextList, templateIsFrame, templateIsIconFrame, iconFrames[v[1]].id, templateIsMono, monoFonts[v[0]].id, isEqualCaseSloganLetterSpacing, searchIconsId, sloganFonts[v[5]].id, fonts[v[0]].id, frames[v[1]].id, palletIndex.color_id, templateIdStyle, templateHint, dynamicLogoCounter, first_logoTemp, first_dObj, av, ((version == "vd2" || version == "vd4") ? previewStyle : ""));
													break;
												default:
													slickElement = '<div class="logos--boxes" data-sfId ="' + sloganFonts[v[5]].id + '" data-fId ="' + fonts[v[0]].id + '" data-frmId ="' + frames[v[1]].id + '" data-cpId ="' + palletIndex.color_id + '" data-cpId ="' + palletIndex.color_id + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-id="' + dynamicLogoCounter + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div ' + btnHideClass + '"><div class="icons-edit icons-preview iconEdit edit--btn" data-id="' + dynamicLogoCounter + '" data-type="edit" data-logo-id="0"><span class="edit--btn"><span class="edit--btn"></span>Edit logo</span></div><div class="icons-edit icons-purchase" data-id="' + dynamicLogoCounter + '" data-type="purchase"><span class="purchase--btn"><span class="purchase--btn"></span>Purchase</span></div><div class="iconEditHitArea" style="' + iconEditHitAreaStyle + '"></div></div><div class="svg--slide" style="background-color:' + logoTemp.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + logoMakerFunction.getFinalLogoTemplate(first_dObj.generate) + '</div></div></div></div>';
													break;
											}
											$(".sliderContainer").append(slickElement);
										}
										obj.logoTempArr.push(first_dObj);
										dynamicLogoCounter++;
										i++;
										if (i == pellets.length) {
										}
										dh_utility_common.changeBg();
										success();
									}
									makepatterninlogo();

								});
							}));

						}
						Promise.all(randomSlideArray).then(() => {
							$('.step_6 .load-more-anim').removeClass('hidden');
							$('.step_6 .load-more-anim').removeClass('fixed');
							$('.step_6 .load-more-anim .loadMoreGenerate').removeClass('animate');
							$('.step_6 .load-more-anim').removeClass('loading');
							$('.ste-6-strip-apply').removeClass('active');
							$('.loadMoreGenerate').removeClass('activating');
							if (isHardCode) {
								$('.step_6 .load-more-anim').addClass('hidden');
							}
							if ((!showStep6Anm) || isLoadMoreClick) {
								var i = dynamicLogoCounter;
								let cnt = 0;
								if (version === "vd1" || version === "vd2" || version === "vd3" || version === "vd4") {
									while (i--) {
										cnt++;
										if (cnt <= 10) {
											let swiperDiv = '.step_six_slider_list' + i;
											obj.initSwiper(swiperDiv);
											if (document.querySelector(swiperDiv + " .swiper-button-next")) {
												document.querySelector(swiperDiv + " .swiper-button-next").removeAttribute("style");
											}
											if (document.querySelector(swiperDiv + " .swiper-button-prev")) {
												document.querySelector(swiperDiv + " .swiper-button-prev").removeAttribute("style");
											}
										} else {
											break;
										}
									}
								}
							}
							if (p_fCallBack) {
								p_fCallBack();
							}
							if ($('.step_6 .symbol-container .iconContainerBoxes img').length) {
								obj.showIconCheckBox(true);
							}
							if (templateDisplay.only_monogram == 1) {
								obj.showMonoCheckBox(true);
							}
							setTimeout(() => {
								obj.enabledIconMonoCheckBox(true);
							}, 500);
						});
						lEditor.getBestColorSchema(6);
					}
				});
			});
		}
		/**
		 * 
		 * @param {*} logoTextList 
		 * @param {*} templateIsFrame 
		 * @param {*} templateIsIconFrame 
		 * @param {*} iconFrames 
		 * @param {*} templateIsMono 
		 * @param {*} monoFonts 
		 * @param {*} isEqualCaseSloganLetterSpacing 
		 * @param {*} searchIconsId 
		 * @param {*} sloganFonts 
		 * @param {*} fonts 
		 * @param {*} frames 
		 * @param {*} pellets 
		 * @param {*} templateIdStyle 
		 * @param {*} templateHint 
		 * @param {*} dynamicLogoCounter 
		 * @param {*} first_logoTemp 
		 * @param {*} first_dObj 
		 * @returns 
		 */
		obj.makeSingletSwiperLogo = function (logoTextList, templateIsFrame, templateIsIconFrame, iconFrames, templateIsMono, monoFonts, isEqualCaseSloganLetterSpacing, searchIconsId, sloganFonts, fonts, frames, pellets, templateIdStyle, templateHint, dynamicLogoCounter, first_logoTemp, first_dObj, p_aColorJSONList, previewStyle) {
			let logoObjList = [];
			let finalStr = "";

			templateHint = dh_lm_common_utility.showLogoAdminIds(first_logoTemp.templatePath, obj.getSession('sloganText'), fonts, '@', sloganFonts, frames, iconFrames, monoFonts);

			finalStr += obj.getSwiperLogo(sloganFonts, fonts, frames, pellets, templateIdStyle, templateHint, dynamicLogoCounter, first_logoTemp, first_dObj, 0, previewStyle);
			logoObjList.push(first_dObj);
			let nextTemp = null
			if (templateCombObj && Object.keys(templateCombObj).length > 0) {
				if (version === "vd3" || version === "vd4") {
					let ab = templateCombObj[first_logoTemp.templatePath.template_db_id];
					if (ab) {
						templateIdStyle = getTempStyle("gray");
						ab = dh_editor_utility.shuffleTheArray(ab);
						let abind = -1;
						if (first_logoTemp.templatePath.isDBLineCompanyText == "yes") {
							for (let b = 0; b < ab.length; b++) {
								if (ab[b].template_db_id.indexOf(".1") != -1) {
									abind = b;
									break;
								}
							}
							if (abind != -1) {
								nextTemp = ab[abind];
							}
						} else {
							for (let b = 0; b < ab.length; b++) {
								if (ab[b].template_db_id.indexOf(".1") == -1) {
									abind = b;
									break;
								}
							}
							if (abind != -1) {
								nextTemp = ab[abind];
							}
						}
					}
				}
			}
			for (var k = 0; k < p_aColorJSONList.length; k++) {
				let new_logoTemp = { ...first_logoTemp };
				var new_idKey = logoMakerFunction.genRandomId();
				new_logoTemp.idKey = new_idKey;
				if (version === "vd3" || version === "vd4") {
					if (nextTemp && (k % 2 == 0)) {
						new_logoTemp.templatePath = nextTemp;
						if (first_logoTemp.templatePath.isDBLineCompanyText == "yes") {
							new_logoTemp.templatePath.isDBLineCompanyText = "yes";
						}
						var isFrameExist = first_logoTemp.templatePath.isFrame;
						if (isFrameExist == 1) {
							new_logoTemp.templatePath.frame_width = first_logoTemp.templatePath.frame_width;
							new_logoTemp.templatePath.frame_height = first_logoTemp.templatePath.frame_height;
							new_logoTemp.templatePath.frameShapeName = first_logoTemp.templatePath.frameShapeName;
							new_logoTemp.templatePath.frmId = first_logoTemp.templatePath.frmId;
						}
						new_logoTemp.templatePath.sloganSetAsPerText = first_logoTemp.templatePath.sloganSetAsPerText;
					}
				}

				new_logoTemp.bgColor = p_aColorJSONList[k]["bg_color"];
				let textColor = p_aColorJSONList[k]["text_color"];
				if (gradientsArray[textColor]) {
					new_logoTemp.textGradient = textColor;
					if (new_logoTemp.templatePath.isDBLineCompanyText == "yes") {
						new_logoTemp.text2Gradient = textColor;
					}
				}
				else {
					new_logoTemp.mainTextColor = textColor;
					if (new_logoTemp.templatePath.isDBLineCompanyText == "yes") {
						new_logoTemp.mainText2Color = textColor;
					}
				}

				let sloganColor = p_aColorJSONList[k]["slogan_color"];
				if (gradientsArray[sloganColor]) {
					new_logoTemp.sloganGradient = sloganColor;
				}
				else {
					new_logoTemp.sloganTextColor = sloganColor;
				}

				let iconColor = p_aColorJSONList[k]["icon_color"];
				if (gradientsArray[iconColor]) {
					new_logoTemp.iconGradient = iconColor;
				}
				else {
					new_logoTemp.iconColor = iconColor;
				}

				let frameColor = p_aColorJSONList[k]["frame_color"];
				if (gradientsArray[frameColor]) {
					new_logoTemp.frameGradient = frameColor;
					new_logoTemp.iconFrameGradient = frameColor;
				}
				else {
					new_logoTemp.frameColor = frameColor;
					new_logoTemp.iconFrameColor = frameColor;
				}

				let frameFilledColor = p_aColorJSONList[k]["filled_frame_color"];
				if (gradientsArray[frameFilledColor]) {
					new_logoTemp.frameFilledGradient = frameFilledColor;
				}
				else {
					new_logoTemp.frameFilledColor = frameFilledColor;
				}

				let secondLogoList = obj.createStep6LogoData(new_logoTemp, new_idKey, logoTextList, sloganFonts, fonts, templateIsFrame, frames, p_aColorJSONList[k]["color_id"], templateIsIconFrame, iconFrames, templateIsMono, monoFonts, isEqualCaseSloganLetterSpacing, searchIconsId);

				let second_logoTemp = secondLogoList[0];
				let second_dObj = secondLogoList[1];

				templateHint = dh_lm_common_utility.showLogoAdminIds(second_logoTemp.templatePath, obj.getSession('sloganText'), fonts, '@', sloganFonts, frames, iconFrames, monoFonts);

				finalStr += obj.getSwiperLogo(sloganFonts, fonts, frames, p_aColorJSONList[k]["color_id"], templateIdStyle, templateHint, dynamicLogoCounter, second_logoTemp, second_dObj, (k + 1), previewStyle);
				logoObjList.push(second_dObj);
			}

			obj.swiperLogoTempArr[dynamicLogoCounter] = logoObjList;

			let sliderId = "step_six_slider_list" + dynamicLogoCounter;
			let slickElement = obj.getSwiperContainerDiv(finalStr, sliderId);
			return slickElement;
		}
		/**
		 * 
		 * @param {*} array 
		 * @param {*} property 
		 * @param {*} value 
		 * @returns 
		 */
		obj.removePlate = function (array, property, value) {
			let newArr = array;
			let i = newArr.length,
				j,
				cur;
			while (i--) {
				cur = newArr[i];
				if (cur[property] === value) {
					newArr.splice(i, 1);
				}
			}
			return newArr;
		}
		/**
		 * 
		 * @param {*} sloganFonts 
		 * @param {*} fonts 
		 * @param {*} frames 
		 * @param {*} pellets 
		 * @param {*} templateIdStyle 
		 * @param {*} templateHint 
		 * @param {*} dynamicLogoCounter 
		 * @param {*} logoTemp 
		 * @param {*} dObj 
		 * @returns 
		 */
		obj.getSwiperLogo = function (sloganFonts, fonts, frames, pellets, templateIdStyle, templateHint, dynamicLogoCounter, logoTemp, dObj, swiperIndex, previewStyle) {
			let ac;
			if (templateHint.indexOf("@") !== -1) {
				templateHint = templateHint.replace("@", pellets + "");
			}
			switch (version) {
				case "vd1":
				case "vd3":
					ac = '<div class="swiper-slide"><div class="logos--boxes" data-sfId ="' + sloganFonts + '" data-fId ="' + fonts + '" data-frmId ="' + frames + '" data-cpId ="' + pellets + '" data-cpId ="' + pellets + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-swiper-index="' + swiperIndex + '" data-id="' + dynamicLogoCounter + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><div class="icons-edit icons-preview iconEdit edit--btn" data-swiper-index="' + swiperIndex + '" data-id="' + dynamicLogoCounter + '" data-type="edit" data-logo-id="0"><span class="edit--btn"><span class="edit--btn"></span>Edit logo</span></div><div class="icons-edit icons-purchase" data-swiper-index="' + swiperIndex + '" data-id="' + dynamicLogoCounter + '" data-type="purchase"><span class="purchase--btn"><span class="purchase--btn"></span>Purchase</span></div></div><div class="svg--slide" style="background-color:' + logoTemp.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + logoMakerFunction.getFinalLogoTemplate(dObj.generate) + '</div></div></div></div></div>';
					break;
				case "vd2":
				case "vd4":
					ac = '<div class="swiper-slide"><div class="logos--boxes" data-sfId ="' + sloganFonts + '" data-fId ="' + fonts + '" data-frmId ="' + frames + '" data-cpId ="' + pellets + '" data-cpId ="' + pellets + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav" data-toggle="tooltip" title="Add to favorites" data-type="favorite" data-swiper-index="' + swiperIndex + '" data-id="' + dynamicLogoCounter + '" data-logo-id="0"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><div class="icons-edit icons-preview iconEdit edit--btn" data-swiper-index="' + swiperIndex + '" data-id="' + dynamicLogoCounter + '" data-type="edit" data-logo-id="0"><span class="preview--btn" style=' + previewStyle + '>Preview logo</span><span class="edit--btn">Edit logo<span class="edit--btn"></span></span></div></div><div class="svg--slide" style="background-color:' + logoTemp.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + logoMakerFunction.getFinalLogoTemplate(dObj.generate) + '</div></div></div></div></div>';
					break;
				default:
					break;
			}
			return ac;
		}
		/**
		 * 
		 * @param {*} logoTemp 
		 * @param {*} idKey 
		 * @param {*} logoTextList 
		 * @param {*} sloganFonts 
		 * @param {*} fonts 
		 * @param {*} templateIsFrame 
		 * @param {*} frames 
		 * @param {*} pellets 
		 * @param {*} templateIsIconFrame 
		 * @param {*} iconFrames 
		 * @param {*} templateIsMono 
		 * @param {*} monoFonts 
		 * @param {*} isEqualCaseSloganLetterSpacing 
		 * @param {*} searchIconsId 
		 * @returns 
		 */
		obj.createStep6LogoData = function (logoTemp, idKey, logoTextList, sloganFonts, fonts, templateIsFrame, frames, pellets, templateIsIconFrame, iconFrames, templateIsMono, monoFonts, isEqualCaseSloganLetterSpacing, searchIconsId, pairedFontId, p_sStyleImageId) {
			let returnObj = logoMakerFunction.generateLogoTemplate(logoTemp, idKey, null, null, null, false, "step6genration");
			let logoTemp1 = returnObj.logoObj;
			logoTemp1.sloganFontObject = "";
			logoTemp1.monogram = obj.getSession('monogram');

			var dObj = {};
			dObj.generate = logoTemp1;
			dObj.logoName = obj.getSession('logoname');
			if (logoTemp1.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
				dObj.logoName1 = logoTextList[0];
				dObj.logoName2 = logoTextList[1];
			}
			dObj.budgetType = obj.getSession('budgetType');
			dObj.budgetId = obj.getSession('budgetId') ? ((obj.getSession('budgetId') === "undefined") ? "" : obj.getSession('budgetId')) : "";
			dObj.budgetVal = obj.getSession('budgetVal') ? obj.getSession('budgetVal') : "";
			dObj.sloganName = obj.getSession('sloganText');
			dObj.industryId = obj.getSession('industryId');
			dObj.industryName = obj.getSession('extraIndustry') ? obj.getSession('extraIndustry') : "";
			dObj.search_industry_id = obj.getSession('search_industry_id') || "";
			dObj.currencyId = obj.getSession('currencyId');
			dObj.idKey = idKey;
			dObj.sfId = sloganFonts;
			dObj.fId = fonts;
			dObj.frmId = templateIsFrame ? frames : "";
			dObj.cpId = pellets;
			dObj.styleImgId = p_sStyleImageId;
			if (pairedFontId) {
				dObj.pairedFontId = pairedFontId;
			}

			dObj.iconFrameId = templateIsIconFrame ? iconFrames : "";
			dObj.monofId = templateIsMono ? monoFonts : "";
			dObj.generate.sloganLetterSpacing = isEqualCaseSloganLetterSpacing;
			if (searchIconsId != "") {
				dObj.iconId = searchIconsId;
			}
			dObj = updateCurrLogoObject(dObj);
			return [logoTemp, dObj];
		}
		/* -------------------------------------------------------------------------------------------- */
		// for update monogram text
		obj.setMonogramText = function (monogram) {
			obj.setSession('monogram', monogram);
		}

		// for getting monogram text
		obj.getMonogramText = function (p_bCheckSession, p_bIsCustom) {
			if (p_bCheckSession && (!p_bIsCustom)) {
				var sessionMonogGram = lEditor.getSession("monogram");
				if (sessionMonogGram) {
					return sessionMonogGram;
				}
			}
			var logoText = obj.getSession('logoname');
			return logoMakerFunction.genMonoGramText(logoText, p_bIsCustom);
		}
		/* -------------------------------------------------------------------------------------------- */

		// for getting dynamic logo variation in Editor section 
		obj.generateDynamicLogoVariations = function (p_fCallBack) {
			var sloganFont;
			loadMoreStart++;
			randomPagination++;
			var dObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			var limit = 10;
			if (loadMoreStart == 1) {
				randomPagination = loadMoreStart;
				lEditor.logoTempArr = [];
				lEditor.logoSlider('final', 1);
				if ($('.iconBlank').length) {
					$('.iconBlank').hide().remove();
				}
				$('.finalogoSlider').append('<div class="icons-blank result-option iconBlank">' + whileSearchingSymbol + '</div>');
			}
			var templateIdStyle = getTempStyle();

			obj.getSliderDataIcons(true, function () {
				if (obj.sliderData.icons.length == 0 && dObj.generate.iconPath != "") {
					obj.sliderData.icons.push(dObj.generate.iconPath);
					if (obj.sliderData.iconsId.length == 0 && dObj.iconId != "" && dObj.iconId) {
						obj.sliderData.iconsId.push(dObj.iconId);
					}
				}
				var sessionColors = [];
				var fonts = [];
				var monoFonts = [];
				var sloganFonts = [];
				var frames = [];
				var iconFrames = [];
				var pellets;
				jqXHR = $.ajax({

					url: DH.baseURL + '/logoMakerAjax.php',
					type: 'POST',
					data: { action: 'randomData', colors: sessionColors, start: randomPagination },
					//async: false,
					success: function (json) {
						var json = dh_editor_utility.getValidJsonParseObj(json);
						$.each(json.data.logoFonts, function (k, v) {
							fonts.push(v);
						});
						$.each(json.data.sloganFonts, function (k, v) {
							sloganFonts.push(v);
						});
						$.each(json.data.monoFonts, function (k, v) {
							monoFonts.push(v);
						});
						$.each(json.data.frames, function (k, v) {
							frames.push(v);
						});
						$.each(json.data.iconFrames, function (k, v) {
							iconFrames.push(v);
						});
						pellets = json.data.pellets;

						if (pellets.length < 10) {
							randomPagination = 0;
							if (pellets.length == 0) {
								obj.generateDynamicLogoVariations();
							}
						}

						var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
						var splitLogoName = currLogo.generate.splitLogoName;
						var logoText = obj.getSession('logoname');

						var logoTextList;
						if (splitLogoName && currLogo.logoName1 && currLogo.logoName2) {
							logoTextList = obj.getLogoTextList(splitLogoName);
						} else {
							splitLogoName = currLogo.logoName;
							logoTextList = obj.getLogoTextList(currLogo.logoName);
						}
						var templates = [];
						var icons = obj.sliderData.icons;
						var iconsId = obj.sliderData.iconsId;
						var isIconTemplate = 0;
						if (iconsId.length > 0) {
							$.each(icons, function (keee, veee) {
								if (veee != "") {
									isIconTemplate = 1;
								}
							});
						}
						if (obj.sliderData.templates.length == 1) {
							templates = obj.sliderData.templates;
						} else {
							if (icons.length == 0 || isIconTemplate == 0) {
								$.each(obj.sliderData.templates, function (k, v) {
									if (v.isIcon == 0) {
										if (v.template_db_id == v.template_id) {
											templates.push(v);
										} else {
											if (logoTextList.length > 0 && logoTextList.length == 2 && (v.template_db_id == v.template_id + ".1")) {
												templates.push(v);
											}
										}
									}
								});

							} else {
								if (logoTextList.length > 0 && logoTextList.length == 2) {
									templates = obj.sliderData.templates;
								} else {
									$.each(obj.sliderData.templates, function (k, v) {
										if (v.template_db_id == v.template_id) {
											templates.push(v);
										}
									});
								}
							}
						}
						var monoText = lEditor.getMonogramText(true);
						var sloganText = obj.getSession('sloganText');
						var slides = [];
						var arr = [];
						arr[0] = fonts.length; // text
						arr[1] = frames.length;
						arr[2] = icons.length;
						arr[3] = templates.length;
						arr[4] = pellets.length;
						arr[5] = sloganFonts.length;
						arr[6] = iconFrames.length;
						arr[7] = monoFonts.length;

						obj.randomSliderSet = [];
						var monoTemplate = 0;

						if (templates.length == 1) {
							for (i = 0; i < pellets.length; i++) {
								var comb = logoMakerFunction.getRandomCombination(arr);
								if (logoMakerFunction.isUniqueComination(obj.randomSliderSet, comb)) {
									obj.randomSliderSet.push(comb);
								}
							}
						} else {
							//--------
							for (i = 0; i < pellets.length; i++) {
								isCond = true;
								while (isCond) {
									var comb = logoMakerFunction.getRandomCombination(arr);
									if (logoMakerFunction.isUniqueComination(obj.randomSliderSet, comb)) {
										if (templates[comb[3]].isMono == 1) {
											obj.randomSliderSet.push(comb);
											isCond = false;
											monoTemplate++;
										} else {
											if (templates[comb[3]].isMono == 0) {
												obj.randomSliderSet.push(comb);
												isCond = false;
											}
										}
									}
								}
							}

						}


						var i = 0;
						obj.randomSliderSet = obj.randomSliderSet.map((a) => ({ sort: Math.random(), value: a })).sort((a, b) => a.sort - b.sort).map((a) => a.value);
						var randomObjLength = obj.randomSliderSet.length;
						var fontLoader = 0;

						var j = parseInt((loadMoreStart - 1) * limit);
						var randomSlideArray = [];
						$.each(obj.randomSliderSet, function (k, v) {
							randomSlideArray.push(new Promise((success, failure) => {
								var monoPath = "";
								v[0] = fontLoader++;
								var logoTemp = {
									logoPath: "",
									logoPath1: "",
									logoPath2: "",
									sloganPath: "",
									framePath: "",
									iconFramePath: "",
									iconPath: "",
									templatePath: "",
									bgColor: "",
								};

								var promiseArr = [];

								promiseArr.push(new Promise((resolve, reject) => {
									if (fonts[v[0]].link == "" && DH.DH_APP_MODE == 'DEVELOPMENT') {
										alert("Please disabled this font id " + fonts[v[0]].id + "in local admintest");
									}
									opentype.load(fonts[v[0]].link, function (err, font) {
										resolve(font);
									});
								}));
								promiseArr.push(new Promise((resolve, reject) => {
									opentype.load(sloganFonts[v[5]].link, function (err, font) {
										resolve(font);
									});

								}));
								promiseArr.push(new Promise((resolve, reject) => {
									opentype.load(monoFonts[v[7]].link, function (err, font) {
										resolve(font);
									});

								}));
								Promise.all(promiseArr).then(newFonts => {
									var logo = null;
									logoTemp.templatePath = templates[v[3]];

									if (logoTextList.length == 2 && logoTemp.templatePath.text1 && logoTemp.templatePath.text2 && logoTemp.templatePath.updates.text1 && logoTemp.templatePath.updates.text2) {
										logo = newFonts[0].getPath(logoTextList[0], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
										logoTemp.logoPath1 = logo.toSVG();

										logo = null;
										logo = newFonts[0].getPath(logoTextList[1], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
										logoTemp.logoPath2 = logo.toSVG();
										logoTemp.templatePath.isDBLineCompanyText = "yes";
										logoTemp.splitLogoName = splitLogoName;

									} else {
										if (logoText != '' && newFonts[0]) {
											logo = newFonts[0].getPath(logoText, 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider);
											logoTemp.logoPath = logo.toSVG();
										}
										else {
											logoTemp.logoPath = '<path d="M 0 0 l 1 0" stroke="white" stroke-width="0" fill ="none" />';
										}
										logoTemp.templatePath.isDBLineCompanyText = "no";
										logoTemp.splitLogoName = "";

									}
									// if (logoTextList.length > 0 && logoTextList.length == 2) {

									// }else{
									// 	logoTemp.splitLogoName = "";
									// }


									var slogan = newFonts[1].getPath(sloganText, 0, 0, constantVars.ORIGINAL_SPACING.sloganTextSize);
									var monoPath = newFonts[2].getPath(monoText, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);

									//logoTemp.logoPath = logo.toSVG();
									sloganFont = newFonts[1];

									logoTemp.sloganPath = slogan.toSVG()
									monoFont = newFonts[2];

									let templateIsFrame = false;
									if (logoTemp.templatePath.isFrame == 1) {
										logoTemp.framePath = frames[v[1]].svg;
										logoTemp.templatePath.frameType = frames[v[1]].type;
										logoTemp.templatePath.frameOverlap = frames[v[1]].isOverlap;
										logoTemp.templatePath.frame_width = frames[v[1]].frame_width;
										logoTemp.templatePath.frame_height = frames[v[1]].frame_height;
										logoTemp.templatePath.frameShapeName = frames[v[1]].shape;
										logoTemp.templatePath.frmId = frames[v[1]].id;
										templateIsFrame = true;
									} else {
										logoTemp.framePath = "";
										logoTemp.templatePath.frameType = "";
										logoTemp.templatePath.frameOverlap = "";
										logoTemp.templatePath.frame_width = "";
										logoTemp.templatePath.frame_height = "";
										logoTemp.templatePath.frameShapeName = "";
										logoTemp.templatePath.frmId = "";
									}
									let templateIsIconFrame = false;
									if (logoTemp.templatePath.isIconFrame == 1) {
										logoTemp.iconFramePath = iconFrames[v[6]].svg;
										templateIsIconFrame = true;
									} else {
										logoTemp.iconFramePath = "";
									}
									let templateIsMono = false;
									var searchIconsId = "";
									if (typeof logoTemp.templatePath.isMono != "undefined" && logoTemp.templatePath.isMono == 1) {

										logoTemp.iconPath = monoPath.toSVG();
										templateIsMono = true;

									} else if (logoTemp.templatePath.isIcon == 1) {
										logoTemp.iconPath = icons[v[2]];
										searchIconsId = iconsId[v[2]];
									} else {
										logoTemp.iconPath = "";
									}
									logoTemp.templateType = v[3];
									if (logoMakerFunction.checkTemplateIsEqualCondition(logoTemp)) {
										logoTemp.templatePath.sloganSetAsPerText = 1;
									} else {
										logoTemp.templatePath.sloganSetAsPerText = 0;
									}
									logoTemp.bgColor = pellets[v[4]].bg_color;
									logoTemp.mainTextColor = "";
									logoTemp.mainText2Color = "";
									logoTemp.sloganTextColor = "";
									logoTemp.iconColor = "";
									logoTemp.frameColor = "";
									logoTemp.frameFilledColor = "";
									logoTemp.textGradient = "";
									logoTemp.text2Gradient = "";
									logoTemp.sloganGradient = "";
									logoTemp.iconGradient = "";
									logoTemp.frameGradient = "";
									logoTemp.frameFilledGradient = "";
									logoTemp.iconFrameColor = "";
									logoTemp.iconFrameGradient = "";
									var idKey = logoMakerFunction.genRandomId();

									if (gradientsArray[pellets[v[4]].text_color]) {
										logoTemp.textGradient = pellets[v[4]].text_color;
										logoTemp.text2Gradient = pellets[v[4]].text_color;
									}
									else {
										logoTemp.mainTextColor = pellets[v[4]].text_color;
										if (logoTemp.templatePath.isDBLineCompanyText == "yes") {
											logoTemp.mainText2Color = pellets[v[4]].text_color;
										}
									}

									if (gradientsArray[pellets[v[4]].slogan_color]) {
										logoTemp.sloganGradient = pellets[v[4]].slogan_color;
									}
									else {
										logoTemp.sloganTextColor = pellets[v[4]].slogan_color;
									}

									if (gradientsArray[pellets[v[4]].icon_color]) {
										logoTemp.iconGradient = pellets[v[4]].icon_color;
									}
									else {
										logoTemp.iconColor = pellets[v[4]].icon_color;
									}

									if (gradientsArray[pellets[v[4]].frame_color]) {
										logoTemp.frameGradient = pellets[v[4]].frame_color;
										logoTemp.iconFrameGradient = pellets[v[4]].frame_color;
									}
									else {
										logoTemp.frameColor = pellets[v[4]].frame_color;
										logoTemp.iconFrameColor = pellets[v[4]].frame_color;
									}

									if (gradientsArray[pellets[v[4]].filled_frame_color]) {
										logoTemp.frameFilledGradient = pellets[v[4]].filled_frame_color;
									}
									else {
										logoTemp.frameFilledColor = pellets[v[4]].filled_frame_color;
									}

									logoTemp.idKey = idKey;

									logoTemp.fontName = monoFonts[v[7]].link;
									logoTemp.sloganFontType = sloganFonts[v[5]].link;
									logoTemp.textFontType = fonts[v[0]].link;
									logoTemp.text2FontType = fonts[v[0]].link;
									logoTemp.sloganFontObject = sloganFont;
									returnObj = logoMakerFunction.generateLogoTemplate(logoTemp, idKey, constantVars.ORIGINAL_SPACING.logoTextSlider, constantVars.ORIGINAL_SPACING.logoLetterSpacing, null, true, "dynamicLogoVariations");
									logoTemp = returnObj.logoObj;
									logoTemp.sloganFontObject = "";

									dObj.generate = logoTemp;
									dObj.logoName = obj.getSession('logoname');
									if (logoTemp.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
										dObj.logoName1 = logoTextList[0];
										dObj.logoName2 = logoTextList[1];
									} else {
										dObj.logoName1 = "";
										dObj.logoName2 = "";
									}
									dObj.budgetType = obj.getSession('budgetType');
									dObj.budgetId = obj.getSession('budgetId');
									dObj.budgetVal = obj.getSession('budgetVal');
									dObj.sloganName = obj.getSession('sloganText');
									dObj.industryId = obj.getSession('industryId');
									dObj.industryName = obj.getSession('extraIndustry');
									dObj.search_industry_id = obj.getSession('search_industry_id') || "";
									dObj.currencyId = obj.getSession('currencyId');

									dObj.sfId = sloganFonts[v[5]].id;
									dObj.fId = fonts[v[0]].id;
									dObj.frmId = templateIsFrame ? frames[v[1]].id : "";
									dObj.cpId = pellets[v[4]].color_id;
									dObj.iconFrameId = templateIsIconFrame ? iconFrames[v[1]].id : "";
									dObj.monofId = templateIsMono ? monoFonts[v[0]].id : "";
									if (searchIconsId != "") {
										dObj.iconId = searchIconsId;
									}
									dObj = updateCurrLogoObject(dObj);
									if ((i + 1) == pellets.length && pellets.length % 2 == 1) {
										console.log("nothing");
									} else {
										var templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.templatePath, sloganText, fonts[v[0]].id, pellets[v[4]].color_id, sloganFonts[v[5]].id, frames[v[1]].id, iconFrames[v[1]].id, monoFonts[v[0]].id);
										slickElement = '<div class="logos--boxes" data-sfId ="' + sloganFonts[v[5]].id + '" data-fId ="' + fonts[v[0]].id + '" data-frmId ="' + frames[v[1]].id + '" data-cpId ="' + pellets[v[4]].color_id + '" data-cpId ="' + pellets[v[4]].color_id + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo"  data-id="' + (j) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + logoTemp.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + logoMakerFunction.getFinalLogoTemplate(dObj.generate) + '</div></div></div></div>';
										$(".finalogoSlider").append(slickElement);
									}
									obj.logoTempArr[j++] = dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(dObj));

									i++;
									if (i == pellets.length) {
										if ($('.load--more--class').length) {
											$('.load--more--class').remove();
										}
										$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreDynamicGenerate load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More Logos</span></a></div> ');
										if (p_fCallBack) {
											p_fCallBack();
										}
									}
									if (i == 1) {
										if ($('.iconBlank').length) {
											$('.iconBlank').hide().remove();
										}
										if ($('.load--more--class').length) {
											$('.load--more--class').remove();
										}
									}
									// loaderHide();
									dh_utility_common.changeBg();
									if (p_fCallBack) {
										p_fCallBack();
									}
								});
							}));
						});
					}
				});
			});
		},
			/* --------------------------------------------------------------------------------------------------- */
			// for updating font object for company name and slogan name 
			obj.updateFontsObject = function (type, p_oobj = null) {
				return new Promise((resolve, reject) => {
					switch (type) {
						case "logo":
							if (p_oobj) {
								opentype.load(p_oobj.textFontType, function (err, font) {
									currCompFontObject = font;
									resolve();
								});
							} else {
								opentype.load(obj.currentLogo.generate.textFontType, function (err, font) {
									currCompFontObject = font;
									resolve();
								});
							}
							break;
						case "logoName2":
							if (p_oobj) {
								if (p_oobj.text2FontType && (p_oobj.text2FontType != "")) {
									opentype.load(p_oobj.text2FontType, function (err, font) {
										currCompFont2Object = font;
										resolve();
									});
								} else {
									resolve();
								}
							} else {
								if (obj.currentLogo.generate.text2FontType && (obj.currentLogo.generate.text2FontType != "")) {
									opentype.load(obj.currentLogo.generate.text2FontType, function (err, font) {
										currCompFont2Object = font;
										resolve();
									});
								} else {
									resolve();
								}
							}
							break;
						case "slogan":
							if (p_oobj) {
								opentype.load(p_oobj.sloganFontType, function (err, font) {
									currSloganFontObject = font;
									resolve();
								});
							} else {
								opentype.load(obj.currentLogo.generate.sloganFontType, function (err, fnt) {
									currSloganFontObject = fnt;
									resolve();
								});
							}
							break;
						case "mono":
							if (p_oobj) {
								opentype.load(p_oobj.fontName, function (err, font) {
									currMonogramFontObject = font;
									resolve();
								});
							} else {
								opentype.load(obj.currentLogo.generate.fontName, function (err, monofont) {
									currMonogramFontObject = monofont;
									resolve();
								});
							}
							break;
					}

				});
			}

		/* Current Steps Cases */

		obj.showStep = function () {
			$(".after_load_more").hide();
			step6LoadCounter = 0;
			if (typeof DH != 'undefined' && typeof DH.isLogged != 'undefined' && parseInt(DH.isLogged) > 0) {
				$('.step-holder').addClass('loggedin');
			}
			var anim;
			if (obj.getSession('currPage') === null || obj.getSession('currPage') === "null" || obj.getSession('currPage') === "" || obj.getSession('currPage') === "undefined") {
				this.currentStep = 2;
			} else {
				this.currentStep = obj.getSession('currPage');
			}
			this.currentStep = parseInt(this.currentStep);
			currPage = parseInt(this.currentStep);

			$('.getStarted').removeClass('c-1 c-2 c-3 c-4');
			$('.btnSkip').removeClass('skip-synmbols skip-visulcolor');
			$(".step-holder").addClass('hidden');
			$(".step_" + currPage).removeClass('hidden');
			$(".backButton").attr("data-link", "");

			if ($("body").hasClass('fullheight')) {
				$("body").css("overflow", "auto");
				$("body").removeClass('fullheight');
			}

			if (currPage == 5 || currPage == 6) {
				var selectedDesignStyles = dh_editor_utility.getValidJsonParseObj(obj.getSession('sampleImage'));
				if (designStyleLogic && selectedDesignStyles) {
					let desingStyleIdList = [];
					$.each(selectedDesignStyles, function (k, v) {
						v.sampleid && desingStyleIdList.push(v.sampleid);
					});
					desingStyleIdList.length && lEditor.getLogoDesignStylesData(desingStyleIdList);
				}
			} else {
				lEditor.designLogoStyles = [];
			}
			if (currPage == 2) {
				lEditor.cleanSession('logo_styles');
			}			
			switch (currPage) {
				case 1: {
				}
				case 2: {
					$('.init-focus').focus();
					$('.footer-strip, .top--buttons, .startButton,  .topRightButtons, .lEditorHeader,.loginOption').removeClass('hidden');
					$('.footer-strip-content .btn-white, .topLeftButtons, .topActionBtn, .buyNowBtn, .downloadFilesBtn').addClass('hidden');
					var getSampleImage = dh_editor_utility.getValidJsonParseObj(obj.getSession('sampleImage'));
					var boxLength = 0;
					if (getSampleImage !== null) {
						$.each(getSampleImage, function (k, v) {
							$("[data-sampleid='" + v.sampleid + "']").addClass('active');
							boxLength++;
						});
					}
					if ($('#design_styles .design_layput').length) {
						$('#design_styles .design_layput.active').prependTo('#design_styles');
					}

					obj.progressBar(boxLength);
					$('.getStarted').addClass('c-1');
					document.body.classList.add('skip-btn-exists');
					break;
				}
				case 3: {
					var boxLength = 0;
					$('.init-focus').focus();
					$('.footer-strip, .backButton, .startButton, .topLeftButtons, .topRightButtons, .lEditorHeader,.loginOption').removeClass('hidden');
					$('.footer-strip-content .progress, .footer-strip-content .btn-green, .topActionBtn, .buyNowBtn, .downloadFilesBtn').addClass('hidden');
					$('.footer-strip-content .btn-white').removeClass('hidden');

					var sampleClr = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('sampleColor'));
					$('.sampleColor_1').removeClass('active');
					if (sampleClr == '' || sampleClr == 'undefined' || sampleClr == null || jQuery.isEmptyObject(sampleClr)) {
						boxLength = 0;
					} else {
						$.each(sampleClr, function (k, v) {
							$("[data-samplecolorid='" + v.samplecolorid + "']").addClass('active');
						});
						boxLength = 1;
					}
					obj.skipBtn(boxLength);
					$('.getStarted').addClass('c-2');
					$('.btnSkip').addClass('skip-visulcolor');
					document.body.classList.remove('skip-btn-exists');
					break;
				}

				case 4: {
					lEditor.currentIconSearchName = "";
					$(".step-holder-mid .iconsParentDiv").removeAttr("slug");
					$(".step_6 .iconsParentDiv").removeAttr("slug");
					$('.step_4  input:first').focus();
					$('.footer-strip, .backButton, .startButton, .topLeftButtons, .topRightButtons, .lEditorHeader,.loginOption').removeClass('hidden');
					$('.footer-strip-content .progress, .footer-strip-content .btn-white, .topActionBtn, .buyNowBtn, .downloadFilesBtn').addClass('hidden');
					$('.footer-strip-content .btn-green').removeClass('hidden');
					var logoText = dh_editor_utility.removeMultipleSpaces(obj.getSession('logoname'));
					var sloganText = dh_editor_utility.removeMultipleSpaces(obj.getSession('sloganText'));
					var industryName = obj.getSession('industryId');
					var extraIndustry = obj.getSession('extraIndustry');
					var budgetType = obj.getSession('budgetType');
					var budgetId = obj.getSession('budgetId');
					var extraBudget = obj.getSession('budgetVal');
					if (industryName == 2010) {
						$('.extra--industry').show();
						$('.extraIndustry').val(extraIndustry);
					}
					if (obj.budgetShowType == 1) {

						if (budgetType == 2) {
							$('#budgetSelected').html('Custom').attr('data-value', 'custom');
							$('.extra--budget').show();
							$('#extraBudget').val(extraBudget);
						} else {
							$('#budgetSelected').html($('[data-value=' + budgetId + ']').html()).attr('data-value', budgetId);
						}
					}

					if (sloganText != null || logoText != null) {
						$('#sloganText').val(sloganText);
						$('#logoname2').val(logoText);
						$('.industryName').val(industryName);
						$('.footer-strip-content .btn-green').removeClass('disable-button');
					}
					$('.getStarted').addClass('c-3');
					$(".step_5_extra").removeClass("hidden");
					$(".step_5_holder_top, .step_5_holder_mid").addClass("hidden");
					if (lEditor.getSession("industryText") && lEditor.getSession("industryText") !== "" && lEditor.getSession("industryText") !== "undefined") {
						$("#select2-industryName-container").text(lEditor.getSession("industryText"));
					}
					if (industryName) {
						$("#industryName option[value='" + industryName + "']").attr('selected', true);
					}
					break;
				}

				case 5: {
					//debugger;
					lEditor.currentIconSearchName = "";
					$(".step-holder-mid .iconsParentDiv").removeAttr("slug");
					$(".step_6 .iconsParentDiv").removeAttr("slug");
					obj.cleanSession("step6reload");
					getIconsAsperIndustrySelected("nonEditor");
					obj.hideIconMonoCheckBox();
					sessionStorage.setItem("prevPage", 5);
					if (lottie) {
						lottie.destroy();
					}
					$('.step_5  input:first').focus();
					if ($('#aniBG').length) {
						$('#aniBG').css('display', 'none')
					}
					if ($('#animation_box').length) {
						$('#animation_box').css('display', 'none')
					}
					$('.footer-strip, .backButton, .startButton, .topLeftButtons, .topRightButtons, .lEditorHeader, .loginOption').removeClass('hidden');
					$('.footer-strip-content .progress, .footer-strip-content .btn-green, .topActionBtn, .buyNowBtn, .downloadFilesBtn').addClass('hidden');
					$('.footer-strip-content .btn-white').removeClass('hidden');
					var industryName = obj.getSession('industryId');
					if (version == 'v4' && typeof industryName != 'undefined' && industryName != '') {
						//debugger;
						getRecomIconListing();
						break;
					}
					else {
						//debugger;
						if (obj.indusType == 1) {
							getIconTagListingNew();
							var sampleArr = dh_editor_utility.getValidJsonParseObj(obj.getSession('sampleIcon'));
							var boxLength = 0;
							obj.sampleIconArr = [];
							if (typeof sampleArr != 'undefined' && sampleArr != null) {
								if (sampleArr.si != null && !$.isEmptyObject(sampleArr.si)) {
									obj.sampleIconArr = sampleArr.si;
									boxLength = 1;
								}
							}
						} else {
							//	getIconTagListing();
							getIconTagListingNew();
							var sampleArr = dh_editor_utility.getValidJsonParseObj(obj.getSession('sampleIcon'));
							var boxLength = 0;
							obj.sampleIconArr = [];
							if (typeof sampleArr != 'undefined' && sampleArr != null) {
								if (sampleArr.si != null && !$.isEmptyObject(sampleArr.si)) {
									obj.sampleIconArr = sampleArr.si;
									boxLength = 1;
								}
							}
						}
						obj.iconsData(1);
						obj.addSelectedIcon("no_click");
						$('.getStarted').addClass('c-4');
						let lastSymbolPart = +(lEditor.getSession("symbol_part"));
						switch (lastSymbolPart) {
							case 2:
								$(".step_5_extra").addClass("hidden");
								$(".step_5_holder_top, .step_5_holder_mid").removeClass("hidden");
								lEditor.setSession('symbol_part', "2");
								break;
							case 1:
							default:
								$(".step_5_extra").removeClass("hidden");
								$(".step_5_holder_top, .step_5_holder_mid").addClass("hidden");
								lEditor.setSession('symbol_part', "1");
								//lEditor.cleanSession('sampleIcon');
								lEditor.cleanSession('search_symbol_list');
								lEditor.sampleIconArr = [];
								if (search_symbol_list.length > 0) {
									$('.btnSkip').addClass('hidden');
									$('.getStarted').removeClass('hidden');
								} else {
									$('.btnSkip').removeClass('hidden');
									$('.getStarted').addClass('hidden');
								}
								//$('.symbol-container .iconContainerBoxes').html('');
								break;
						}
						$('.btnSkip').addClass('skip-synmbols');
						break;
					}

					break;
				}

				case 6: {
					lEditor.currentIconSearchName = "";
					if (designStyleLogic) {
						lEditor.getAllOuterFrameByType("filled");
						lEditor.getAllInnerFrameByType("outline");
					}
					$(".step_6 .iconsParentDiv").html("");
					$('.iconBlank').removeClass('hidden').text(forSearchSymbol);

					$(".step-holder-mid .iconsParentDiv").removeAttr("slug");
					$(".step_6 .iconsParentDiv").removeAttr("slug");
					if (lottie) {
						lottie.destroy();
					}
					if (prevPage == 7) {
						if ($('.stripContainer').length > 0) {
							$('.bot-padding').css('padding-bottom', $('.stripContainer').innerHeight() + 'px');
							var extendTime = 7;
							var seconds = new Date().getSeconds();
							var miliseconds = seconds + extendTime * 1000;
							setTimeout(function () {
								strip();
							}, miliseconds);
							function strip() {
								if (($(window).scrollTop() > 100)) {
									$('.stripContainer').fadeIn(200);
								}
								else {
									$(window).scroll(function () {
										if ($(window).scrollTop()) {
											$('.stripContainer').fadeIn(200);
										}
									});
								}
							}
						}
					}
					$('.step_6').css('display', "none");
					loadMoreStart = 0;
					dynamicLogoCounter = 0;


					$('.editCompanyName').val(obj.getSession('logoname'));
					$('.editSloganName').val(obj.getSession('sloganText'));

					obj.activateSelectedColors();
					var sampleArr = dh_editor_utility.getValidJsonParseObj(obj.getSession('sampleIcon'));
					var boxLength = 0;
					obj.sampleIconArr = [];
					if (typeof sampleArr != 'undefined' && sampleArr != null) {
						if (sampleArr.si != null && !$.isEmptyObject(sampleArr.si)) {
							obj.sampleIconArr = sampleArr.si;
							boxLength = 1;
						}
					}
					obj.addSelectedIcon("no_click");
					let isAnm = true;
					if (showStep6Anm) {
						$('.lEditorHeader').addClass('hide');
						$('.pages-content-top.container-fluid').css('background-color', '#fff');
						if (version == "v6" || version == "vd2" || version == "vd4") {
							$("body").css("overflow", "hidden");
						}

						if (prevPage != 7) {

							if (!$('#aniBG').length) {
								var aniBG = document.createElement('div');
								aniBG.id = "aniBG";
								aniBG.style.position = "absolute";
								aniBG.style.height = "100%";
								aniBG.style.width = "100%";
								aniBG.style.backgroundColor = "#ffffff";
								$('.main-body').append(aniBG);
							} else {
								$('#aniBG').css('display', 'block');
								var aniBG = $('#aniBG')[0];
							}
							if (!$('#animation_box').length) {
								var aniDiv = document.createElement('div');
								aniDiv.id = "animation_box";

								aniDiv.style.width = "100%";
								aniDiv.style.paddingTop = "60px";
								$('.main-body').append(aniDiv);


							} else {
								$('#animation_box').css('display', 'block')
								var aniDiv = $('#animation_box')[0];
							}


							var params = {
								container: document.getElementById('animation_box'),
								renderer: 'svg',
								loop: false,
								autoplay: true,
								animationData: animationData,
								rendererSettings: {
									scaleMode: 'noScale'

								}

							};

							anim = lottie.loadAnimation(params);

							anim.onComplete = () => {
								if (version == "v6" || version == "vd2" || version == "vd4") $("body").addClass('fullheight');
								$('.step_6').css('display', "block");
								$('.lEditorHeader').removeClass('hide');
								$('.pages-content-top.container-fluid').css('background-color', 'transparent');
								aniDiv.style.display = 'none';
								aniBG.style.display = 'none';
								if ($('.stripContainer').length > 0) {
									$('.bot-padding').css('padding-bottom', $('.stripContainer').innerHeight() + 'px');
									var extendTime = 7;
									var seconds = new Date().getSeconds();
									var miliseconds = seconds + extendTime * 1000;
									setTimeout(function () {
										strip();
									}, miliseconds);
									function strip() {
										if (($(window).scrollTop() > 100)) {
											$('.stripContainer').fadeIn(200);
										}
										else {
											$(window).scroll(function () {
												if ($(window).scrollTop()) {
													$('.stripContainer').fadeIn(200);
												}
											});
										}
									}
								}
								let i = dynamicLogoCounter;
								let cnt = 0;
								if (version === "vd1" || version === "vd2" || version === "vd3" || version === "vd4") {
									while (i--) {
										cnt++;
										if (cnt <= 10) {
											let swiperDiv = '.step_six_slider_list' + i;
											obj.initSwiper(swiperDiv);
											if (document.querySelector(swiperDiv + " .swiper-button-next")) {
												document.querySelector(swiperDiv + " .swiper-button-next").removeAttribute("style");
											}
											if (document.querySelector(swiperDiv + " .swiper-button-prev")) {
												document.querySelector(swiperDiv + " .swiper-button-prev").removeAttribute("style");
											}
										} else {
											break;
										}
									}
								}
								if (DH.isLogged == 0 && DH.userId == 0 && version != "v6" && version != "vd2" && version != "vd4") {
									clearTimeout(loginPopupTimer);
									if (window.location && window.location.href && window.location.href.indexOf("version=") === -1) {
										// nothing
									} else {
										loginPopupTimer = setTimeout(function () {
											userLoginPopup();
											$('body').addClass('logo-modal-unset');
										}, 2500);
									}
									document.getElementsByClassName("main-body")[0].removeChild(aniBG);
									document.getElementsByClassName("main-body")[0].removeChild(aniDiv);

									return;
								} else {
									document.getElementsByClassName("main-body")[0].removeChild(aniBG);
									document.getElementsByClassName("main-body")[0].removeChild(aniDiv);
									if (version == "v6" || version == "vd2" || version == "vd4") {
										if (DH.isLogged == 0 && DH.userId == 0) {
											loginPopupTimer = setTimeout(function () {
												userLoginPopup();
												$('body').addClass('logo-modal-unset');
											}, 250);
										}
									}
								}
							}
						} else {
							isAnm = false;
							$('.step_6').css('display', "block");
							if (version == "v6" || version == "vd2" || version == "vd4") $("body").addClass('fullheight');
							sessionStorage.setItem("prevPage", 6);
							$('.lEditorHeader').removeClass('hide');
							$('.pages-content-top.container-fluid').css('background-color', 'transparent');
						}
					} else {
						if (version == "v6" || version == "vd2" || version == "vd4") {
							$("body").css("overflow", "hidden");
							$("body").addClass('fullheight');
						}
						$('.step_6').css('display', "block");
						sessionStorage.setItem("prevPage", 6);
					}
					step6SelectedLogoSlides = null;
					obj.cleanSession("currentLogo");
					obj.cleanSession("monogram");
					obj.cleanSession("searchicon");
					obj.cleanSession("rand_data");
					obj.start_pairedfont = 1;
					obj.generateDynamicLogos(false, function () {
						if (version == "v6" || version == "vd2" || version == "vd4") {
							higlightLogoSlides(true, null);
							previewLogoAtStep6(0, true, 0);
							if (!showStep6Anm) {
								if (DH.isLogged == 0 && DH.userId == 0) {
									loginPopupTimer = setTimeout(function () {
										userLoginPopup();
										$('body').addClass('logo-modal-unset');
									}, 300);
								}
							}
						}
						if (!isAnm) {
							let i = dynamicLogoCounter;
							let cnt = 0;
							if (version === "vd1" || version === "vd2" || version === "vd3" || version === "vd4") {
								while (i--) {
									cnt++;
									if (cnt <= 10) {
										let swiperDiv = '.step_six_slider_list' + i;
										obj.initSwiper(swiperDiv);
										if (document.querySelector(swiperDiv + " .swiper-button-next")) {
											document.querySelector(swiperDiv + " .swiper-button-next").removeAttribute("style");
										}
										if (document.querySelector(swiperDiv + " .swiper-button-prev")) {
											document.querySelector(swiperDiv + " .swiper-button-prev").removeAttribute("style");
										}
									} else {
										break;
									}
								}
							}
						}
					});

					$('.footer-strip, .topActionBtn, .buyNowBtn, .downloadFilesBtn').addClass('hidden');
					$('.backButton, .startButton, .topLeftButtons, .topRightButtons, .lEditorHeader,.loginOption').removeClass('hidden');
					break;
				}


				case 7: {
					obj.cleanSession("step6reload");
					$(".colorpicker_close").hide();
					$('.editMonogramText').val(obj.getMonogramText(true));
					$(".backButton").attr("data-link", sessionStorage.getItem('backLink'));

					var currTargetLink = lEditor.getSession('targetlink');

					//currTargetLink:=6
					//parentlink:=2
					if (currTargetLink == 29) {
						currTargetLink = lEditor.setSession('targetlink', 2);
					}

					if ((currTargetLink == 32 || currTargetLink == 39) && lEditor.getSession('parentlink') == 5) {
						lEditor.setSession('targetlink', 2);
						lEditor.setSession('parentlink', 'undefined');
						lEditor.setSession('defaultlink', 0);
					}
					if ((currTargetLink == 5) && lEditor.getSession('parentlink') == "undefined") {
						lEditor.setSession('targetlink', 2);
						lEditor.setSession('parentlink', 'undefined');
						lEditor.setSession('defaultlink', 0);
					}

					if ((currTargetLink == 6) && lEditor.getSession('parentlink') == 2) {
						lEditor.setSession('targetlink', 2);
						lEditor.setSession('parentlink', 'undefined');
						lEditor.setSession('defaultlink', 0);
					}

					if (lEditor.getSession("coming_from") && (lEditor.getSession("coming_from") == "step6_edit")) {
						lEditor.setSession('parentlink', 2);
						lEditor.setSession('targetlink', 7);
						lEditor.setSession('defaultlink', 0);
						lEditor.cleanSession("coming_from");
						// forcefully set when come from step6 
					}

					$('.topActionBtn').css('display', 'inline-block');
					$('.startButton, .topLeftButtons, .topRightButtons, .buyNowBtn, .topActionBtn, .lEditorHeader,.loginOption, .tutorialVid, .tutorBtn, .leditorLogo').removeClass('hidden');
					$('.leditorLogo').addClass('mob')
					$('.favOption, .leditorLogo ~ img').addClass('hidden');
					$('.leditorLogo ~ img').addClass('desktop');
					if (currTargetLink == null || currTargetLink == 'undefined') {
						// currTargetLink = lEditor.setSession('targetlink', 2);
					}

					obj.currentLogo = dh_editor_utility.getValidJsonParseObj(obj.getSession('currentLogo'));
					var sessionFav = dh_editor_utility.getValidJsonParseObj(obj.getSession('favoriteJSON'));

					if (lEditor.getSession('isEditable') == 1) {
						$('.editCompanyName').attr('disabled', true);
						$('.le--buy-now.downloadFilesBtn').removeClass('hidden');
						$('.le--buy-now.buyNowBtn').addClass('hidden');
					}
					else {
						$('.editCompanyName').removeAttr('disabled');
						$('.le--buy-now.buyNowBtn').removeClass('hidden');
						$('.le--buy-now.downloadFilesBtn').addClass('hidden');
					}

					if (sessionFav !== null) {
						favoriteJSON = sessionFav;
					}
					obj.updateFontsObject('logo').then(_ => {
						obj.updateFontsObject('logoName2').then(_ => {
							obj.updateFontsObject('slogan').then(_ => {
								return obj.updateFontsObject('mono')
							});
						});
					}).then(_ => {
						if (currTargetLink == 29) {
							obj.setSession('targetlink', 2);
							$('.subMenu-29').parent('li').removeClass('active');
						}
						obj.editLogoSteps();

						/* Layout Section Start */

						$('.layoutSection li').each(function () {
							var layoutOption = $(this).find('a').data('option');
							var tmpType = obj.currentLogo.generate.templateType;
							if (layoutOption == tmpType) {
								$('.layoutSection li').removeClass('active');
								$(this).addClass('active');
							}
						});

						/*  Layout Section End */

						/*  container Section Start */


						if (currTargetLink == 24) {
							$('.subMenu-24').trigger('click');
							obj.getCurrentLogo();
						}
						if (currTargetLink == 40) {
							$('.subMenu-40').trigger('click');
							obj.getCurrentLogo();
						}
						if (currTargetLink == 23) {
							$('.containerSection li').removeClass('active');
							$('.editFinalLogo').removeClass('hidden');
							$('.containerOptions').removeClass('active')
							obj.setSession('targetlink', 6);
							obj.getCurrentLogo();
						}


						if (currTargetLink == 42) {
							$('.subMenu-24').trigger('click');
							obj.setSession('targetlink', 6);
							obj.getCurrentLogo();
						}
						if (currTargetLink == 44) {
							$('.subMenu-40').trigger('click');
							obj.setSession('targetlink', 6);
							obj.getCurrentLogo();
						}

						if (currTargetLink == 5) {
							$(".step-holder").addClass('hidden');
							$(".step_" + currPage).removeClass('hidden');

						}

						if (currTargetLink == null || currTargetLink == 'undefined' || currTargetLink == 1) {
							obj.previewColors();
							obj.previewLogo();
						} else {
							//$('.logoImages').html('');
						}

						/* === container Section End ===*/

						/* === Logo Section Start ===*/
						$('.editCompanyName').val(obj.getSession('logoname'));
						// $('.editSloganName').val(obj.getSession('sloganText'));

						/* === Logo Section End ===*/

						obj.getCurrentLogo();


						/****************Update Sliders Value********************/
						$("#templateGenerator").html('');
						var html = logoMakerFunction.getFinalLogoTemplate(obj.currentLogo.generate);
						$("#templateGenerator").html(html);
						/*	if($('#templateGenerator .sampleIcons_1').length > 0){
							constantVars.SPACING.logoSizeSlider = parseInt($('#templateGenerator .sampleIcons_1').get(0).getBBox().width * obj.currentLogo.generate.templatePath.icon.scale * obj.currentLogo.generate.templatePath.containerBody.scale * obj.currentLogo.generate.templatePath.logoContainer.scale);
							lEditor.setSession('logoSizeSlider',constantVars.SPACING.logoSizeSlider);
						}else{
							lEditor.setSession('logoSizeSlider',100);
						}*/
						$("#templateGenerator").html('');
						/**************************************************/
						if (!recentColors.length) {
							loadRecentColors();
						}
					})
					break;
				}


			}

		}
		/**
		 * 
		 * @param {*} p_oObj 
		 */
		obj.initSwiper = function (p_oObj) {
			var swiper1 = new Swiper(p_oObj, {
				slidesPerView: 1,
				slidesPerGroup: 1,
				noSwiping: true,
				noSwipingClass: 'swiper-container',
				breakpoints: {
					490: {
						slidesPerView: 1,
						slidesPerGroup: 1,
					},
					991: {
						slidesPerView: 1,
						slidesPerGroup: 1,
					},

				},
				navigation: {
					nextEl: '.swiper-button-next.logo-slider-next',
					prevEl: '.swiper-button-prev.logo-slider-prev',
				},
				nextButton: '.swiper-button-next.logo-slider-next',
				prevButton: '.swiper-button-prev.logo-slider-prev',
				onClick: function (swiper) {
					if (version === "vd2" || version == "vd4") {
						var currentIndex = swiper.realIndex;
						let numid = +($(".step6-preview-section").find('.finaLogoInner').attr('currentid'));
						//previewLogoAtStep6(numid, false, currentIndex);
					}
				},
			});
		}

		obj.imgLength = function () {
			currPage = parseInt(this.currentStep);
			return boxLength = $(".step_" + currPage + ' .active').length;
		}

		/* progress bar */
		// progress bar for step 2 
		obj.progressBar = function (boxLength) {
			if (boxLength <= 4) {
				$('.footer-strip-content .progress-bar').css({ 'width': parseInt(boxLength * 20 > 100 ? 100 : boxLength * 20) + '%' });
				$('.footer-strip-content .progress').removeClass('hidden');
				$('.footer-strip-content .btn-green').addClass('hidden').css('float', 'right');
				$('.footer-strip-content .btn-white').addClass('hidden');
				$('.footer-strip-content .progress .progress-style, .footer-strip-content .progress .progress-percentage').removeClass('hidden');
				if (canSkipLogoStyleStep) {
					if (boxLength == 0) {
						$('.footer-strip-content .btnSkip').removeClass('hidden');
						document.body.classList.add('skip-btn-exists');
					}
					else {
						document.body.classList.remove('skip-btn-exists');
					}
				}
			}
			else {
				$('.footer-strip-content .progress').addClass('hidden');
				$('.footer-strip-content .btn-white').addClass('hidden');
				$('.footer-strip-content .btn-green').removeClass('hidden').css('float', 'none');
			}
			if (boxLength >= 1) {
				$('.progressBarText').text(boxLength + ' of 5').removeClass('hidden');
				$('.footer-strip-content .btn-green').removeClass('hidden');
				$('.footer-strip-content .progress').css('float', 'left');
				$('.footer-strip-content .progress').removeClass('bar-progress');
				$('.footer-strip-content .progress .progress-style, .footer-strip-content .progress .progress-percentage').addClass('hidden');
				$('.footer-strip-content .progress').removeClass('mob-progress');
			} else {
				$('.progressBarText').addClass('hidden').text('');
			}

		}
		/* skip button */

		obj.skipBtn = function (boxLength) {
			//var b = obj.getSession('currPage');
			//debugger;
			if (boxLength > 0) {
				$('.footer-strip-content .btn-white').addClass('hidden');
				$('.footer-strip-content .btn-green').removeClass('hidden');
				if (typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5' && version == 'v4') {
					$('.iconContainerDiv .getStarted').removeClass('hidden');
					$('.iconContainerDiv .btnSkip').addClass('hidden');

				}
			}
			else {
				$('.footer-strip-content .btn-white').removeClass('hidden');
				$('.footer-strip-content .btn-green').addClass('hidden');
				if (typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5' && version == 'v4') {
					$('.iconContainerDiv .getStarted').addClass('hidden');
					$('.iconContainerDiv .btnSkip').removeClass('hidden');
				}
			}

		}

		/* New button */

		obj.startNew = function () {
			sessionStorage.clear();
			lEditor.currentStep = 1;
			$('.step-holder, .footer-strip, .topButtons, .lEditorHeader').addClass('hidden');
			$('.step_1, #root_header').removeClass('hidden');
			$('#logoname, #logoname2, #sloganText').val('');
			$('.le-imageLayout, .common-nav li').removeClass('active');
			$('.hide--icons').remove();
			$('.iconContainerBoxes').html('');
			$('.le--close').trigger('click');

		}

		// using for NOUN API 
		obj.iconsData = function (target) {
			$('.load_more_showIconsDiv').parent().hide();
			if (target && target.closest) {
				if (target.closest('.step_5').length > 0) {
					var input = target.closest('.step_5').find('input.tag_input');
				}
				else {
					if ($(window).width() < 991) {
						var input = target.closest('.mobile-selection').find('.logo-search-form input');
					}
					else {
						var input = target.closest('.edit-strip').find('.logo-search-form input');
					}
				}
				var tagValue = dh_editor_utility.removeMultipleSpaces($(input).val());//$.trim($(input).val());
				if (tagValue == "") {
					$(".step_5_holder_mid").css("pointer-events", 'auto');
					$(".step_6 .symbolContainer").css("pointer-events", 'auto');
					return false;
				}
				if (tagValue.toLowerCase() == obj.objIconSearch.toLowerCase()) {
					obj.objIconPage++;
				} else {
					obj.objIconSearch = tagValue;
					obj.objIconPage = 1;

				}
				//debugger;
				$(".step_5_holder_mid").css("pointer-events", 'none');
				$(".step_6 .symbolContainer").css("pointer-events", 'none');
				obj.ajaxIconsResponse(tagValue);
			}
		}
		// using for NOUN API 
		obj.editIconsData = function () {
			var tagValue = $.trim($('.editTags').val());
			if (tagValue == "") {
				return false;
			}
			if (tagValue == obj.objIconSearch) {
				obj.objIconPage++;
			} else {
				obj.objIconSearch = tagValue;
				obj.objIconPage = 1;
			}
			lEditor.setSession('iconValue', tagValue);
			obj.ajaxEditIconsResponse(tagValue);

		}

		// using for NOUN API 
		obj.ajaxIconsResponse = function (iconSlug) {
			var is_recommended_fetch = false;
			var iconSlugIndustry = '';
			if (version == 'v4') {
				var industryName = obj.getSession('extraIndustry');
				var iconSlugIndustry = getSlugNew(industryName);
				if (iconSlugIndustry == iconSlug) {
					is_recommended_fetch = true;
				}

			}
			obj.nextIconSearch = true;
			var offset = 0;
			var limit;
			if (DH.DH_APP_MODE == 'PRODUCTION') {
				limit = NOUN_API_LIMIT;
			} else {
				limit = obj.getSession("icon_limit") ? (+obj.getSession("icon_limit")) : NOUN_API_LIMIT;
			}
			$('.loadMoreIcons').hide();
			$('.searchIcon').html('<img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" />');
			// if (obj.objIconPage == 1) {
			// 	$('.loadMoreIcons').hide();
			// 	$('.searchIcon').html('<img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" />');
			// } else {
			// 	offset = (obj.objIconPage * limit);
			// 	$('.showIconsDiv .loadMoreIcons').show();
			// }
			if (iconSlug === obj.currentIconSearchName) {

			} else {
				obj.iconSerachPageIndex = 1;
			}
			obj.currentIconSearchName = iconSlug;
			let p_sHitFor = "";
			if (obj.currentStep == 5) {
				p_sHitFor = "pick_own_icon";
			}
			else if (obj.currentStep == 6) {
				p_sHitFor = "step6_add_symbol";
			}
			var payloadData = { action: 'api', type: 'nonEditor', slug: iconSlug, limit: limit, action_type: 'icon_tags', slug_tags: 1, page: obj.iconSerachPageIndex, calltype: iconSlug, hitfor: p_sHitFor };
			//calltype is here used for to handle global abort request
			//{ action: 'api', type: 'nonEditor', slug: iconSlug, industry_id: lEditor.getSession('industryId'), version: version, offset: offset, limit: limit, action_type: 'icon_tags', calltype: iconSlug }
			$('.load_more_showIconsDiv').parent().hide();
			jqXHR = $.ajax({
				url: DH.baseURL + '/dh_ajax.php',
				type: 'POST',
				data: payloadData,
				dataType: "json",
				beforeSend: function () {

				},
				success: function (res) {
					$(".step_5_holder_mid").css("pointer-events", 'auto');
					$(".step_6 .symbolContainer").css("pointer-events", 'auto');
					if (res.status == 0) {
						$('.searchIcon').html('Search');
						obj.nextIconSearch = false;
						obj.iconSerachPageIndex = 1;
						return false;
					}
					obj.iconSerachPageIndex++;
					if (res.more_icons == 0) {
						obj.nextIconSearch = false;
						obj.iconSerachPageIndex = 1;
					}
					if (res.nxt_search == 0) { //i.e no data available
						$('.searchIcon').html('Search');
						obj.nextIconSearch = false;
						obj.iconSerachPageIndex = 1;
						$('.loadMoreIcons').hide();
						if (obj.objIconPage == 1) {
							$('.iconsImages, .iconsHint').remove();
							$('.loadMoreIcons').hide();
							$('.iconBlank').removeClass('hidden').text('No result found');
							$('.startIcoSection').addClass('hidden');
							$('.iconsContainerBox, .brickImage').removeClass('hidden');
							$('.flipIconTag').addClass('hidden');
							//obj.nextIconSearch = true;  
							$('.iconsParentDiv').attr('slug', iconSlug);
						}
						if (version == 'v4' && res.nxt_search == 0) {
							//$('.iconsContainerBox, .brickImage').addClass('hidden');
							$('.showIconsDiv .loadMoreIconsV2').remove();
							// debugger;
						}
						return false;
					}
					if (res.nxt_search == 1 && res.more_icons == 0 && version == 'v4') {
						$('.showIconsDiv .loadMoreIconsV2').remove();
					}
					if (obj.objIconPage == 1) {
						$('.iconsImages, .iconsHint').remove();
						//obj.nextIconSearch = true;
					}
					// if (res.nxt_search == 1 || res.more_icons == 0) {

					$('.iconBlank, .startIcoSection').addClass('hidden');
					$('.iconsContainerBox, .brickImage').removeClass('hidden');
					if (version == 'v4') {
						$('.brickImage').addClass('hidden');
					}
					$('.flipIconTag').addClass('hidden');
					if (version == 'v4' && obj.objIconPage == 1 && typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5') {

						$rec_cls = "";
						if (is_recommended_fetch) {
							$rec_cls = "disabled active";
						}

						if (obj.getSession('extraIndustry') != '') {
							$('.icons-hint').append('<a class=" icons-hint-button iconsHint recommend_tag ' + $rec_cls + ' "  data-recommended = "1" data-slug="' + iconSlugIndustry + '">Recommended</a>');
							if (is_recommended_fetch) {
								$('.icons-hint').append('<a class="icons-hint-button iconsHint browse_cat_slug" data-slug="browse_categories" >Browse More Tags <i class="icon icon-plus"></i></a>');
							}


						}
					}

					// var tagArray = [];
					$.each(res.tags, function (key, val) {
						var inputValue = $.trim($('#tags').val());
						inputValue = inputValue.toLowerCase();
						var iconText = $.trim(val.name.toLowerCase());
						var activeClass = '';
						var tagDisp = '';
						if (inputValue == iconText) {
							activeClass = 'active';
						}
						if (typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5') {
							if (version == 'v4' && is_recommended_fetch) {
								tagDisp = 'hidden';
							}
							if (iconSlugIndustry.toLowerCase() != val.slug) {
								// if (val.name != "" && tagArray.indexOf(val.name) == -1) {
								if (val.name != "") {
									$('.icons-hint').append('<a class="icons-hint-button iconsHint ' + tagDisp + ' ' + activeClass + '" data-slug="' + val.slug + '">' + val.name + '</a>');

								}
							}

						}
						else {
							// if (val.name != "" && tagArray.indexOf(val.name) == -1) {
							if (val.name != "") {
								$('.icons-hint').append('<a class="icons-hint-button iconsHint ' + tagDisp + ' ' + activeClass + '" data-slug="' + val.slug + '">' + val.name + '</a>');

							}
						}
						// tagArray.push(val.name);
					});

					$.each(res.icons, function (key, val) {

						$('.iconsParentDiv').append('<a class="icons-images iconsImages" data-pngurl="' + val.url + '" data-svgurl="' + val.icon_url + '" data-id = "' + val.id + '"><img src="' + val.url + '" class="selectedIcons" /></a>');

					});
					if ($('.iconsParentDiv a').length) {
						$('.iconsParentDiv').attr('slug', iconSlug);
						if (res.more_icons == 1) {
							if (lEditor.currentStep == 5) {
								$('.step-holder-mid .iconsParentDiv').append('<div style="text-align: center;padding: 20px 0;"><button class="common-btn btn-green btn-continue load_more_showIconsDiv" style="">Load More</button></div>');
							}
							if (lEditor.currentStep == 6) {
								$('.step_6 .iconsParentDiv').append('<div style="text-align: center;padding: 20px 0;"><button class="common-btn btn-green btn-continue load_more_showIconsDiv" style="">Load More</button></div>');
							}
						}
					}
					$('.loadMoreIcons').hide();
					$('.searchIcon').html('Search');

					if (version == 'v4') {
						if ((res.nxt_search != 0 && res.more_icons == 1)) {
							//Remove existing load more icon button
							$('.showIconsDiv .loadMoreIconsV2').remove();
							$('.showIconsDiv').append('<div class="text-center"><button class="common-btn btn-white load-fewmore loadMoreIconsV2" data-more-icons ="' + res.more_icons + '" >Load A Few More</button></div>');
							$('.showIconsDiv').off('scroll');
							//debugger;
						}
						else {
							$('.showIconsDiv').off('scroll');
							if (obj.objIconPage == 1 && typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5') {
								var bb = $('.step_5 .iconsParentDiv').find('.iconsImages').length;
								//debugger;
								if ($('.step_5 .iconsParentDiv').find('.iconsImages').length > 33 && screen.width >= 800) {
									$('.showIconsDiv .loadMoreIconsV2').remove();
									$('.showIconsDiv').append('<div class="text-center"><button class="common-btn btn-white load-fewmore loadMoreIconsV2" data-more-icons ="' + res.more_icons + '" >Load A Few More</button></div>');
									//debugger;
								}
								else {
									//debugger;
									$('.step_5 .showIconsDiv .loadMoreIconsV2').addClass('hidden');

								}

							}
							//$('.showIconsDiv .loadMoreIconsV2').remove();
						}
						//hide old
						if (obj.objIconPage == 1 && typeof obj.getSession('currPage') != 'undefined' && obj.getSession('currPage') == '5') {

							if ($('.iconsParentDiv').find('.iconsImages').length > 33 && screen.width >= 800) {
								$('.iconsParentDiv .iconsImages:gt(' + 32 + ')').addClass('hidden');
								//debugger;
							}

						}
					}
				},
				fail: function () {
					$('.searchIcon').html('Search');
					$(".step_5_holder_mid").css("pointer-events", 'auto');
					$(".step_6 .symbolContainer").css("pointer-events", 'auto');
				},
				error: function () {
					$('.searchIcon').html('Search');
					$(".step_5_holder_mid").css("pointer-events", 'auto');
					$(".step_6 .symbolContainer").css("pointer-events", 'auto');
				}
			});
		}

		obj.searchAjaxIconsResponse = function (iconSlug, limit, p_sType, p_sHitFor) {
			if (iconSlug) {
				iconSlug = getSlugNew(iconSlug);
			}
			var payloadData = null;
			if (p_sType === "nonEditor") {
				payloadData = { action: 'api', type: 'nonEditor', slug: iconSlug, limit: limit, action_type: 'icon_tags', slug_tags: 0, calltype: iconSlug, hitfor: p_sHitFor };
			} else if (p_sType === "default_icon") {
				payloadData = { action: 'api', slug: iconSlug, limit: 10, action_type: 'default_icons', calltype: iconSlug, hitfor: p_sHitFor };
			} else {
				payloadData = { action: 'api', type: 'nonEditor', slug: iconSlug, limit: NOUN_API_LIMIT, action_type: 'icon_tags', calltype: iconSlug, hitfor: p_sHitFor }
			}
			//calltype is here used for to handle global abort request
			//	data: { action: 'api', type: 'nonEditor', slug: iconSlug, industry_id: lEditor.getSession('industryId'), version: version, offset: 0, limit: 100, action_type: 'icon_tags', calltype: iconSlug },
			return new Promise((resolve, reject) => {
				jqXHR = $.ajax({
					url: DH.baseURL + '/dh_ajax.php',
					type: 'POST',
					data: payloadData,
					dataType: "json",
					beforeSend: function () {
					},
					success: function (res) {
						if (res.status == 1) {
							resolve(res.icons);
						} else {
							reject();
						}
					},
					fail: function () {
						reject();
					},
					error: function () {
						reject();
					},
				});
			});
		}

		// for getting variation of monogram 
		obj.getMonogramVariations = function (p_sLabel, p_fCallBack) {
			var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			var currContainerBodyObj = currLogo.generate.templatePath.updates.containerBody;
			var isFrameExist = currLogo.generate.templatePath.isFrame;
			var templateDirection = 0;
			if (currLogo.generate.templatePath.isIcon == 1) {
				templateDirection = currLogo.generate.templatePath.template_direction;
			}
			var monogram = (p_sLabel && p_sLabel != "") ? p_sLabel : lEditor.getMonogramText(true);
			var limit = 10;
			loadMoreStart++;
			jqXHR = $.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: { action: 'monograms', start: loadMoreStart },
				async: true,
				success: function (json) {
					json = dh_editor_utility.getValidJsonParseObj(json);
					if (json.status == 0) {

					} else {

						var fontList = json.monograms;

						var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
						var generateType = "old";
						if (logoTemp.generate.templatePath.isMono == 0) {
							generateType = "new";
						}
						var type = 'icon';
						var i = 0;

						if (loadMoreStart == 1) {
							lEditor.logoTempArr = [];
							lEditor.logoSlider('final', 1);
						}
						var j = (loadMoreStart - 1) * limit;

						var fontListLength = fontList.length;
						// $('.load--more--class').remove();
						if (fontListLength == 0) {
							return false;
						}
						var templateIdStyle = getTempStyle();

						$.each(fontList, function (k, v) {

							opentype.load(v.font_link, function (err, font) {
								try {
									if (err) {
										alert('Font could not be loaded: ' + v.font_link + ' -- ' + err);
									} else {
										if (generateType == "old") {
										} else {
											var isMono = 1;
											var isIcon = 0;
											var isFrame = 0;
											var isIconFrame = 0;
											var isEqual = 0;
											if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
												isFrame = logoTemp.generate.templatePath.isFrame;
											}

											if (typeof logoTemp.generate.templatePath.isIconFrame !== "undefined") {
												isIconFrame = logoTemp.generate.templatePath.isIconFrame;
											}
											if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
												isEqual = logoTemp.generate.templatePath.isEqual;
											}
											var isDBLineCompanyText = "no";
											if (logoTemp.generate.templatePath.isDBLineCompanyText && (logoTemp.generate.templatePath.isDBLineCompanyText == "yes")) {
												isDBLineCompanyText = logoTemp.generate.templatePath.isDBLineCompanyText;
											}
											var getTemplateList = getTemplatesByType(templateDirection, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText);
											var templates = getTemplateList[0];
											logoTemp.generate.templatePath = templates[0];
											if (getTemplateList[1].length > 1) {
												var templatesDir = getTemplateList[1];
												logoTemp.generate.templatePath.template_direction = templatesDir[0];
											}
											if (getTemplateList[2].length > 1) {
												var templatesId = getTemplateList[2];
												logoTemp.generate.templatePath.template_id = templatesId[0];
											}
										}
										var icon = font.getPath(monogram, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);
										logoTemp.generate.iconPath = icon.toSVG();

										var idKey = logoMakerFunction.genRandomId();
										logoTemp.generate.idKey = idKey;
										//	if(currObj.generate.templatePath.isFrame==1){
										logoTemp.monofId = v.font_id;
										logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
										logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
										if (currLogo.generate.templatePath.isFrame == 1) {
											logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;

											logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;

											logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;

											logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
										}

										logoTemp.generate.fontName = v.font_link;
										logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
										if (currLogo.generate.templatePath.isDBLineCompanyText && currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
											logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
										}
										//	}
										var returnObj = null;
										if (generateType == "old") {
											if (currLogo.generate.isArc == 1) {
												returnObj = logoMakerFunction.generateLogoTemplateForArcLogo(logoTemp.generate, idKey, type, "changemongram");
											} else {
												returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, null, null, "changemongram");
												logoTemp.generate = returnObj.logoObj;
												if (isFrameExist == 1) {
													returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, 'containerBody', idKey);
												} else {
													returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, 'containerBody', idKey, currContainerBodyObj);
												}
											}
										} else {
											if ((currLogo.generate.isArc == 1) && (logoTemp.generate.templatePath.isSupportCurveText != 1)) {
												let logo = currCompFontObject.getPath(currLogo.logoName, 0, 0, currLogo.generate.logoTextSlider, { 'letterSpacing': currLogo.generate.logoLetterSpacing });
												logoTemp.generate.logoPath = logo.toSVG();
												delete logoTemp.generate.isArc;
												delete logoTemp.generate.arcValue;
												delete logoTemp.generate.curveTextActualPathHeight;
												delete logoTemp.generate.curveTextCenterWidth;
											}
											if (isFrameExist == 1) {
												returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "monogramVariations");
											} else {
												returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, currContainerBodyObj, true, "monogramVariations");
											}
										}
										let originalReturnObj = Object.assign({}, returnObj);
										logoTemp.generate = returnObj.logoObj;
										currObj = updateCurrLogoObject(logoTemp);

										lEditor.logoTempArr[j] = dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(currObj));

										var templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

										let monoLogoIndex = j++;

										slickElement = '<div class="logos--boxes" data-index="' + (monoLogoIndex) + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay  gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="monogram-update" data-id="' + (monoLogoIndex) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + currObj.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';

										$(".finalogoSlider").append(slickElement);

										if (originalReturnObj.logoObj.isArc == 1 && originalReturnObj.logoObj.templatePath.isSupportCurveText == 1) {
											$('.finalogoSlider .logos--boxes[data-index="' + monoLogoIndex + '"] .svgSloganText_1').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.slogan.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.slogan.x + "," + (originalReturnObj.logoObj.templatePath.updates.slogan.y) + ")");

											if ((originalReturnObj.logoObj.templatePath.isIcon == 1) || (originalReturnObj.logoObj.templatePath.isMono == 1)) {
												$('.finalogoSlider .logos--boxes[data-index="' + monoLogoIndex + '"] .sampleIconBox').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.x + "," + (originalReturnObj.logoObj.templatePath.updates.iconFrameBox.y) + ")");
											}
										}

										dh_utility_common.changeBg();
										i++;
										if (json.pagination == 1 && i == fontListLength) {
											if ($('.load--more--class').length) {
												$('.load--more--class').remove();
											}
											$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreMonograms load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
											if (p_fCallBack) {
												p_fCallBack();
											}
										} else {
											if ($('.load--more--class').length) {
												$('.load--more--class').remove();
											}
											if (json.pagination == 0) {
												if (p_fCallBack) {
													p_fCallBack();
												}
											}
										}
									}

								} catch (e) {
								}
							});
						});

					}
				}
			});
		}

		obj.showIconVariationLogo = async function (p_fCallBack) {
			if (obj.step7SearchIconData.icons && obj.step7SearchIconData.icons.length > 0) {
				let p_aIconList = obj.step7SearchIconData.icons.splice(0, 6);
				if (p_aIconList && p_aIconList.length > 0) {
					var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
					var isFrameExist = currLogo.generate.templatePath.isFrame;
					var isDBLineCompanyText = "no";
					var splitLogoName = "";
					if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
						isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
					}
					var templateDirection = 0;
					if (currLogo.generate.templatePath.isMono == 1) {
						templateDirection = currLogo.generate.templatePath.template_direction;
					}
					if (currLogo.generate.splitLogoName) {
						splitLogoName = currLogo.generate.splitLogoName;
					}

					var templateIdStyle = getTempStyle();
					var svgUrls = [];
					$.each(p_aIconList, function (key, val) {
						var svgObj = new Object();
						svgObj.id = val.id;
						svgObj.svgurl = val.icon_url;
						svgObj.pngurl = val.url;
						svgUrls.push(svgObj);
					});

					var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
					var currContainerBodyObj = logoTemp.generate.templatePath.updates.containerBody;

					var generateType = "old";
					if (logoTemp.generate.templatePath.isIcon == 0) {
						generateType = "new";
					}
					var type = 'icon';
					var i = 0;
					loadMoreStart++;
					var j = (loadMoreStart - 1) * p_aIconList.length;
					var json = await obj.getStep7IconSVG(svgUrls);
					if (json && json.length && json[0].icons) {
						if ($('.iconBlank').length) {
							$('.iconBlank').remove();
						}
						$('.icons-search-box, .icons-search-box-button').css("pointer-events", "auto");
						if (loadMoreStart == 1) {
							$('.editSearchButton').html('Search');
						}

						$.each(json[0].icons, function (k, v) {
							if (v != "") {
								let originalSVGStr = obj.sliderData.copOriginalIcons[k];
								let vaildSVG = dh_editor_utility.getValidSvgHtml("<svg>" + v + "</svg>", "logomaker", dh_editor_utility.removeMultipleSpaces(originalSVGStr));
								vaildSVG && (logoTemp.generate.iconPath = vaildSVG);
							}
							logoTemp.iconId = k;
							var idKey = logoMakerFunction.genRandomId();
							logoTemp.generate.idKey = idKey;
							logoTemp.generate.iconName = lEditor.getSession("iconValue");
							if (generateType == "old") {
								logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
								var returnObj;
								if (currLogo.generate.isArc == 1) {
									returnObj = logoMakerFunction.generateLogoTemplateForArcLogo(logoTemp.generate, idKey, type, 'changeSymbol');
								} else {
									returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, currContainerBodyObj, null, "changeSymbol");
								}
							} else {
								var isIcon = 1;
								var isMono = 0;
								var isFrame = 0;
								var isIconFrame = 0;
								var isEqual = 0;

								if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
									isFrame = logoTemp.generate.templatePath.isFrame;
								}
								if (typeof logoTemp.generate.templatePath.isIconFrame !== "undefined") {
									isIconFrame = logoTemp.generate.templatePath.isIconFrame;
								}
								if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
									isEqual = logoTemp.generate.templatePath.isEqual;
								}

								var templates = getTemplatesByType(templateDirection, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText)[0];
								logoTemp.generate.templatePath = templates[0];
								logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
								logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
								logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;

								if (currLogo.generate.templatePath.isFrame == 1) {
									logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;
									logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;
									logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;
									logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
								}
								logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
								var returnObj = null;
								if (isFrameExist == 1) {
									if (isDBLineCompanyText == "yes") {
										var logoTextList = lEditor.getLogoTextList(splitLogoName);

										var logo1 = currCompFontObject.getPath(logoTextList[0], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': parseFloat(constantVars.SPACING.logoLetterSpacing) });
										logoTemp.generate.logoPath1 = logo1.toSVG();

										var logo2 = currCompFontObject.getPath(logoTextList[1], 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': parseFloat(constantVars.SPACING.logoLetterSpacing) });
										logoTemp.generate.logoPath2 = logo2.toSVG();

										returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, constantVars.ORIGINAL_SPACING.logoTextSlider, null, null, true, "addNewSymbol");

									} else {
										if ((currLogo.generate.isArc == 1) && (logoTemp.generate.templatePath.isSupportCurveText != 1)) {
											let logo = currCompFontObject.getPath(lEditor.getSession("logoname"), 0, 0, constantVars.ORIGINAL_SPACING.logoTextSlider, { 'letterSpacing': parseFloat(constantVars.SPACING.logoLetterSpacing) });
											logoTemp.generate.logoPath = logo.toSVG();
											delete logoTemp.generate.isArc;
											delete logoTemp.generate.arcValue;
											delete logoTemp.generate.curveTextActualPathHeight;
											delete logoTemp.generate.curveTextCenterWidth;
										}
										returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, constantVars.ORIGINAL_SPACING.logoTextSlider, null, null, true, "addNewSymbol");
									}
								} else {
									if ((currLogo.generate.isArc == 1) && (logoTemp.generate.templatePath.isSupportCurveText != 1)) {
										let logo = currCompFontObject.getPath(lEditor.getSession("logoname"), 0, 0, currLogo.generate.logoTextSlider, { 'letterSpacing': parseFloat(currLogo.generate.logoLetterSpacing) });
										logoTemp.generate.logoPath = logo.toSVG();
										delete logoTemp.generate.isArc;
										delete logoTemp.generate.arcValue;
										delete logoTemp.generate.curveTextActualPathHeight;
										delete logoTemp.generate.curveTextCenterWidth;
									}
									returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, currContainerBodyObj, true, "addNewSymbol");
								}
							}

							logoTemp.generate = returnObj.logoObj;
							currObj = updateCurrLogoObject(logoTemp);
							obj.logoTempArr[j] = dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(currObj));
							let originalReturnObj = Object.assign({}, returnObj);
							var templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

							let jIndex = j++;
							slickElement = '<div class="logos--boxes" data-index="' + (jIndex) + '"><div class="item logo--slides logoSlides" style="background-color:' + currObj.generate.bgColor + ';"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="icon" data-id="' + (jIndex) + '"><span>Update to this</span></a></div><div class="svg--slide"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';

							$(".finalogoSlider").append(slickElement);

							if (originalReturnObj.logoObj.isArc == 1 && originalReturnObj.logoObj.templatePath.isSupportCurveText == 1) {
								$('.finalogoSlider .logos--boxes[data-index="' + jIndex + '"] .svgSloganText_1').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.slogan.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.slogan.x + "," + (originalReturnObj.logoObj.templatePath.updates.slogan.y) + ")");

								$('.finalogoSlider .logos--boxes[data-index="' + jIndex + '"] .sampleIconBox').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.x + "," + (originalReturnObj.logoObj.templatePath.updates.iconFrameBox.y) + ")");
							}

							dh_utility_common.changeBg();
							i++;
							if ((i === p_aIconList.length) && (obj.step7SearchIconData.icons.length > 0 || (obj.step7SearchIconData.more_icons == 1))) {
								if ($('.load--more--class').length) {
									$('.load--more--class').remove();
								}
								$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreEditorIcons load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
							}
							else {
								if ($('.load--more--class').length) {
									$('.load--more--class').remove();
								}
							}
							if (i === p_aIconList.length) {
								if (p_fCallBack) {
									p_fCallBack();
								}
							}
							$('.finaLogoInner').html('');
						});
					} else {
						if ($('.iconBlank').length) {
							$('.iconBlank').remove();
						}
						if (loadMoreStart == 1) {
							$('.finalogoSlider').html('<div class="result-option noResultFound text-center no-icon-result">No Result Found.</div>');
							$('.editSearchButton').html('Search');
						}
						$('.icons-search-box, .icons-search-box-button').css("pointer-events", "auto");
					}
				}
			}
		}
		// using for NOUN API 
		obj.ajaxEditIconsResponse = async function (iconSlug, p_fCallBack) {
			let lastIconList = [];
			if (obj.step7SearchIconData.icons && obj.step7SearchIconData.icons.length && loadMoreStart !== 0) {
				lastIconList = [...obj.step7SearchIconData.icons];
			}
			obj.step7SearchIconData = {};
			if (loadMoreStart == 0) {
				lEditor.logoTempArr = [];
				lEditor.logoSlider('final', 0);
				$('.editSearchButton').html('<img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" />');
			}
			obj.step7SearchIconData = await obj.serachIconAtStep7(iconSlug);
			if (obj.step7SearchIconData.icons && obj.step7SearchIconData.icons.length) {
				if (obj.step7SearchIconData.icons.length > 1) {
					if (lastIconList.length) {
						obj.step7SearchIconData.icons = [...lastIconList, ...obj.step7SearchIconData.icons];
					}
					let twoArrangeMod = obj.step7SearchIconData.icons.length % 2;
					if (twoArrangeMod > 0) {
						obj.step7SearchIconData.icons.splice(0, 1);
					}
				} else {
					if (lastIconList.length) {
						obj.step7SearchIconData.icons = [...lastIconList, ...obj.step7SearchIconData.icons];
						let twoArrangeMod = obj.step7SearchIconData.icons.length % 2;
						if (twoArrangeMod > 0) {
							obj.step7SearchIconData.icons.splice(0, 1);
						}
					}
				}
				$('.editTags').attr("lastSearchIcon", iconSlug);
				obj.showIconVariationLogo(p_fCallBack);
			} else {
				if (loadMoreStart == 0) {
					$('.editSearchButton').html('Search');
					$('.icons-search-box, .icons-search-box-button').css("pointer-events", "auto");
					$('.finalogoSlider').html('<div class="result-option noResultFound text-center no-icon-result">No Result Found.</div>');
					$('.editTags').val("");
					lEditor.cleanSession('iconValue');
				}
			}
		}

		// using for NOUN API  
		obj.selectedIcons = function (objIcon) {
			let isIconAlreadyExist = 0;
			obj.sampleIconArr.forEach(function (iconObj) {
				if (iconObj.id == objIcon.id) {
					isIconAlreadyExist = 1;
				}
			});
			if (isIconAlreadyExist) {
				return;
			}
			if ($.inArray(objIcon, obj.sampleIconArr) < 0) {
				for (var i = 0; i < 5; i++) {
					if (typeof obj.sampleIconArr[i] === 'undefined' || obj.sampleIconArr[i].pngurl == null) {
						obj.sampleIconArr[i] = objIcon;
						break;
					}
				}
			}
			return obj.sampleIconArr;
		}

		// using for NOUN API 
		obj.addSelectedIcon = function (p_sAction) {
			var boxLength = 0;
			var isCountFive = true;

			$('.symbol-container .iconContainerBoxes').html('');
			$('.symbol-container .iconEditContainerBoxes').html('');
			for (var i = 0, length = obj.sampleIconArr.length; i < length; i++) {
				boxLength = 1;
				$('.symbol-container .iconContainerBoxes[data-containerbox="' + (i + 1) + '"]').html('<img src="' + obj.sampleIconArr[i].pngurl + '" /><span class="delete-icon"><img class="icon-remove" src="' + DH.getAssetImgUrl('logo-maker/close.svg') + '"></span>');
				$('.symbol-container .iconEditContainerBoxes[data-containerbox="' + (i + 1) + '"]').html('<img src="' + obj.sampleIconArr[i].pngurl + '" /><span class="delete-icon" data-placement="bottom"><img class="icon-remove" src="' + DH.getAssetImgUrl('logo-maker/close.svg') + '"></span>');
			}
			if ((obj.sampleIconArr.length == 5) && (lEditor.currentStep == 5) && (p_sAction === "click")) {
				$('.step_5 .iconSection').append('<div class="hide--icons"><span>You can select upto 5 symbols. Please remove selected symbols from above if you want to add more.</span></div>');
				$('.iconSection').css('box-shadow', 'none');
			}
			else if ((obj.sampleIconArr.length == 5) && (lEditor.currentStep == 6) && (p_sAction === "click")) {
				$('.step_6 .iconSection').append('<div class="hide--icons"><span>You can select upto 5 symbols. Please remove selected symbols from above if you want to add more.</span></div>');
			}
			obj.setSession('sampleIcon', dh_editor_utility.getValidJsonStringifyObj({ "si": obj.sampleIconArr }));
			$('.symbol-section .symbol-text')[obj.sampleIconArr.length > 0 ? 'hide' : 'show']();
			$('.symbol-section .icons-container')[obj.sampleIconArr.length > 0 ? 'show' : 'hide']();
			obj.skipBtn(boxLength);
			if (lEditor.currentStep == 6) {
				lEditor.unCheckMonoCheckBox();
			}
		}

		// using for NOUN API 
		obj.removeSelectedIcon = function (i) {
			if (obj.sampleIconArr[i]) {
				var iconId = obj.sampleIconArr[i].id;
				$('.showIconsDiv [data-id="' + iconId + '"]').removeClass('active');
				$('.editShowIconsDiv [data-id="' + iconId + '"]').removeClass('active');
				obj.sampleIconArr.splice(i, 1);
				obj.setSession('sampleIcon', dh_editor_utility.getValidJsonStringifyObj({ "si": obj.sampleIconArr }));
				obj.setSession('search_symbol_list', dh_editor_utility.getValidJsonStringifyObj({ "si": obj.sampleIconArr }));
				$('.hide--icons').remove();
			}
		}

		// using for NOUN API 
		obj.getSliderDataIcons = function (p_bSerachArr, callback) {
			obj.sliderData.icons = [];
			obj.sliderData.iconsId = [];
			var icons = dh_editor_utility.getValidJsonParseObj(obj.getSession('sampleIcon'));
			if (p_bSerachArr && obj.getSession('searchicon')) {
				icons = null;
				icons = dh_editor_utility.getValidJsonParseObj(obj.getSession('searchicon'));
			}
			if (typeof icons === 'undefined' || icons == null || icons.si === "" || (icons.si && icons.si.length === 0)) {
				icons = { "si": [] };
				sessionStorage.setItem('sampleIcon', dh_editor_utility.getValidJsonStringifyObj({ "si": [] }));
			}
			if (icons.si && icons.si.length === 0 && (currentSelectedIndustryIconList.length || obj.getSession('defaultIcon'))) {
				if (currentSelectedIndustryIconList && currentSelectedIndustryIconList.length) {
					if (currentSelectedIndustryIconList.length > 5) {
						icons.si = currentSelectedIndustryIconList.slice(obj.industryIconStartIndex, obj.industryIconEndIndex);
						if (obj.industryIconEndIndex === currentSelectedIndustryIconList.length) {
							obj.industryIconStartIndex = 0;
							obj.industryIconEndIndex = 5;
						} else {
							obj.industryIconStartIndex = obj.industryIconStartIndex + 5;
							obj.industryIconEndIndex = obj.industryIconEndIndex + 5;
							if (obj.industryIconEndIndex > currentSelectedIndustryIconList.length) {
								obj.industryIconEndIndex = currentSelectedIndustryIconList.length;
							}
						}
					} else {
						icons.si = Array.from(currentSelectedIndustryIconList);
					}
				} else {
					icons = dh_editor_utility.getValidJsonParseObj(obj.getSession('defaultIcon'));
				}
			}
			var svgUrls = [];
			obj.sliderData.icons = [];
			obj.sliderData.iconsId = [];
			obj.sliderData.nounIconData = [];
			$.each(icons.si, function (k, v) {
				if (obj.iconSVGData[v.id] && obj.iconSVGData[v.id]["svg"]) {
					obj.sliderData.icons.push(obj.iconSVGData[v.id]["svg"]);
					obj.sliderData.iconsId.push(v.id);
					obj.sliderData.nounIconData.push({ 'id': v.id, 'svg': obj.iconSVGData[v.id]["svg"] });
				} else {
					var svgObj = new Object();
					svgObj.id = v.id;
					svgObj.svgurl = v.svgurl;
					svgUrls.push(svgObj);
				}
			});
			if (svgUrls.length) {
				jqXHR = $.ajax({
					url: DH.baseURL + '/dh_ajax.php',
					type: 'POST',
					data: { action: 'svg', 'icons': svgUrls },
					//async: false,
					success: function (json) {
						var json = dh_editor_utility.getValidJsonParseObj(json);
						if (json[0].originalicons) {
							obj.sliderData.copOriginalIcons = json[0].originalicons
							var index = 0;
							$.each(json[0].originalicons, function (k1, v1) {
								obj.sliderData.originalIcons.push(v1);
							});
							obj.findIconNameSpace();
						}
						if (json[0].icons) {
							$.each(json[0].icons, function (k, v) {
								if (v != "") {
									let originalSVGStr = obj.sliderData.copOriginalIcons[k];
									var vaildSVG = dh_editor_utility.getValidSvgHtml("<svg>" + v + "</svg>", "logomaker", dh_editor_utility.removeMultipleSpaces(originalSVGStr));
									obj.sliderData.icons.push(vaildSVG);
									obj.sliderData.iconsId.push(k);
									obj.sliderData.nounIconData.push({ 'id': k, 'svg': vaildSVG });
									if (obj.iconSVGData) {
										obj.iconSVGData[k] = {};
										obj.iconSVGData[k]["svg"] = vaildSVG;
									}
								}
							});
						}

						callback();
					},
					fail: function () {
						callback();
					},
					error: function () {
						callback();
					}
				});
			} else {
				callback();
			}
		}
		obj.findIconNameSpace = function () {
			try {
				var currPage = lEditor.currentStep;
				// var edit_in_new_tab = lEditor.getSession('edit_in_new_tab');
				if ((currPage == 5 || currPage == 6) && (obj.sliderData.originalIcons.length > 0) && ((obj.sliderData.originalIcons[0] === "false") || (obj.sliderData.originalIcons[0] === false) || (obj.sliderData.originalIcons[0] === ""))) {
					$("#logomaker_icon_expired").modal('show');
					dh_editor_utility.forceConsoleAtLive("icon is expired so on refreshing we remove the icon and reload the page");
					return;
				}
			} catch (err) {
				dh_editor_utility.forceConsoleAtLive("something went wrong in showIconExpiredPopup ", err);
			}
			var iconNameSpaceList = [];
			if (obj.sliderData.originalIcons && obj.sliderData.originalIcons.length > 0 && obj.sliderData.icons.length > 0) {

				if ((obj.sliderData.originalIcons[0] === "false") || (obj.sliderData.originalIcons[0] === false) || (obj.sliderData.originalIcons[0] === "")) {
					return;
				}
				$.each(obj.sliderData.originalIcons, function (k, v) {
					if (obj.sliderData.originalIcons[k]) {
						obj.sliderData.originalIcons[k] = obj.sliderData.originalIcons[k].replace("<svg", "<svg id=svgid" + (k + 1));
						var ab = "<div>" + obj.sliderData.originalIcons[k] + "</div>";
						if ($(ab).find("#svgid" + (k + 1)).attr("xmlns")) {
							iconNameSpaceList.push("xmlns^" + $(ab).find("#svgid" + (k + 1)).attr("xmlns"));
						}
						if ($(ab).find("#svgid" + (k + 1)).attr("xmlns:xlink")) {
							iconNameSpaceList.push("xmlns:xlink^" + $(ab).find("#svgid" + (k + 1)).attr("xmlns:xlink"));
						}
						if ($(ab).find("#svgid" + (k + 1)).attr("xmlns:svg")) {
							iconNameSpaceList.push("xmlns:svg^" + $(ab).find("#svgid" + (k + 1)).attr("xmlns:svg"));
						}
					}
				});
				var jsonObject = iconNameSpaceList.map(JSON.stringify);

				var uniqueSet = new Set(jsonObject);
				obj.iconNameSpaceList = Array.from(uniqueSet).map(JSON.parse);
			}
		}
		// for setting default Logo 	
		obj.setDefaultLogo = function (object, generate, p_fCallBack) {
			var currLogo = dh_editor_utility.getValidJsonParseObj(obj.getSession('currentLogo'));
			$.each(object, function (k, v) {
				currLogo[k] = object[k];
			});
			$.each(generate, function (k, v) {
				currLogo.generate[k] = generate[k];
			});

			obj.currentLogo = currLogo;
			obj.setSession('currentLogo', dh_editor_utility.getValidJsonStringifyObj(currLogo));
			if (p_fCallBack) {
				p_fCallBack();
			}

		}

		// for lgoo slider ( initially use owl now removed
		obj.logoSlider = function (type, isNew) {
			$(".sliderContainer").html('');
			if (isNew == 1) {
				$(".finalogoSlider").html('');
			}
			if (isNew == 1) {
				if (type == "final") {
					$(".finalogoSlider").html('<div class="owl-carousel logoSlider logo--slider owl-theme"></div>');
				} else if (type == "step6") {
					$(".sliderContainer").html('<div class="owl-carousel logoSlider logo--slider owl-theme"></div>');
				}
			}
		}
		obj.validateJSON = (currentJSON, p_oDataAnalysisObj) => {
			var tempJSON = JSON.parse(JSON.stringify(currentJSON));
			if (p_oDataAnalysisObj) {
				tempJSON.data_analysis = p_oDataAnalysisObj;
			}
			var getSampleImage = dh_editor_utility.getValidJsonParseObj(obj.getSession('sampleImage'));
			if (getSampleImage && !tempJSON["design_styles"]) {
				tempJSON["design_styles"] = {};
				tempJSON["design_styles"] = getSampleImage;
			}

			return tempJSON;
		}
		// for saving logo
		obj.saveDefaultLogo = function (key, p_sType, p_sGeTargetLink) {
			var currLogo = obj.logoTempArr[key];
			let oldLogoObj = obj.currentLogo; // last logo object
			let newLogoObj = currLogo; // new selected logo object
			var parentDiv = null;
			var workFor = null;
			switch (p_sType) {
				case "icon":
					currLogo.generate.logoSizeSlider = constantVars.SPACING.logoSizeSlider;
					currLogo.generate.iconDistanceSlider = constantVars.SPACING.iconDistanceSlider;
					currLogo.generate.textSloganDistSlider = constantVars.SPACING.textSloganDistSlider;
					switch (p_sGeTargetLink) {
						case 31:
							// if (currLogo.generate.templatePath.isEqual == 1) {
							// 	logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							// }
							if (currLogo.generate.templatePath.isIcon == 1) {
								editorUndoRedo.setUndoActData(SYMBOL_ADD, oldLogoObj, newLogoObj);
							}
							if (typeof currLogo.generate.templatePath.sloganSetAsPerText != "undefined" && currLogo.generate.templatePath.sloganSetAsPerText == 1) {
								logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							}
							if (newLogoObj.generate.templatePath.isDBLineCompanyText == "yes") {
								if (newLogoObj.generate.hasOwnProperty("logoText1Slider")) {
									delete newLogoObj.generate["logoText1Slider"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText2Slider")) {
									delete newLogoObj.generate["logoText2Slider"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText1LetterSpacing")) {
									delete newLogoObj.generate["logoText1LetterSpacing"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText2LetterSpacing")) {
									delete newLogoObj.generate["logoText2LetterSpacing"];
								}
							}
							break;
						case 27:
							if ((currLogo.generate.templatePath.isIcon == 1) && (obj.currentLogo.generate.templatePath.isIcon == 1)) {
								editorUndoRedo.setUndoActData(SYMBOL_CHANGE, oldLogoObj, newLogoObj);
							}
							break;
					}
					break;
				case "monogram-update":
					switch (p_sGeTargetLink) {
						case 32:
							// if (currLogo.generate.templatePath.isEqual == 1) {
							// 	logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							// }
							if (currLogo.generate.templatePath.isMono == 1) {
								editorUndoRedo.setUndoActData(MONOGRAM_ADD, oldLogoObj, newLogoObj);
							}
							if (typeof currLogo.generate.templatePath.sloganSetAsPerText != "undefined" && currLogo.generate.templatePath.sloganSetAsPerText == 1) {
								logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							}
							break;
						case 39:
							currLogo.generate.logoSizeSlider = constantVars.SPACING.logoSizeSlider;
							if ((currLogo.generate.templatePath.isMono == 1) && (obj.currentLogo.generate.templatePath.isMono == 1)) {
								editorUndoRedo.setUndoActData(MONOGRAM_CHANGE, oldLogoObj, newLogoObj);
								lEditor.setMonogramText($('.editMonogramText').val());
							}
							break;
					}
					break;
				case undefined:
					if (p_sGeTargetLink === 30) {
						currLogo.generate.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;
						editorUndoRedo.setUndoActData(GENERATE_MORE_LOGOS, oldLogoObj, newLogoObj);

						if (typeof currLogo.generate.templatePath.sloganSetAsPerText != "undefined" && currLogo.generate.templatePath.sloganSetAsPerText == 1) {
							logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
						}

						if (newLogoObj.generate.templatePath.isDBLineCompanyText == "yes") {
							if (newLogoObj.generate.hasOwnProperty("logoText1Slider")) {
								delete newLogoObj.generate["logoText1Slider"];
							}
							if (newLogoObj.generate.hasOwnProperty("logoText2Slider")) {
								delete newLogoObj.generate["logoText2Slider"];
							}
							if (newLogoObj.generate.hasOwnProperty("logoText1LetterSpacing")) {
								delete newLogoObj.generate["logoText1LetterSpacing"];
							}
							if (newLogoObj.generate.hasOwnProperty("logoText2LetterSpacing")) {
								delete newLogoObj.generate["logoText2LetterSpacing"];
							}
						}
					}
					break;
				case "color":
					switch (p_sGeTargetLink) {
						case 29:
							// if (currLogo.generate.templatePath.isEqual == 1) {
							// 	logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							// }
							currLogo.generate.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;
							editorUndoRedo.setUndoActData(LAYOUT_VARIATIONS, oldLogoObj, newLogoObj);
							if (typeof currLogo.generate.templatePath.sloganSetAsPerText != "undefined" && currLogo.generate.templatePath.sloganSetAsPerText == 1) {
								logoMakerFunction.setSliderForSloganLetterSpacing(currLogo.generate.sloganLetterSpacing);
							}
							break;
						case 3:
						case 12:
							editorUndoRedo.setUndoActData(EDIT_COLORS_BG, oldLogoObj, newLogoObj);
							break;
						case 13:
							parentDiv = $('.subChild-13').find(".company-text-color-box");
							workFor = parentDiv.attr("last_selected");
							switch (workFor) {
								case "dd-ct-color-line1":
									editorUndoRedo.setUndoActData(EDIT_COLORS_LOGO_TEXT1, oldLogoObj, newLogoObj);
									break;
								case "dd-ct-color-line2":
									editorUndoRedo.setUndoActData(EDIT_COLORS_LOGO_TEXT2, oldLogoObj, newLogoObj);
									break;
								case "dd-ct-color-overall":
								default:
									editorUndoRedo.setUndoActData(EDIT_COLORS_LOGO_TEXT, oldLogoObj, newLogoObj);
									break;
							}
							break;
						case 14:
							editorUndoRedo.setUndoActData(EDIT_COLORS_SLOGAN_TEXT, oldLogoObj, newLogoObj);
							break;
						case 15:
							editorUndoRedo.setUndoActData(EDIT_COLORS_SYMBOL, oldLogoObj, newLogoObj);
							break;
						case 43:
							editorUndoRedo.setUndoActData(EDIT_COLORS_INNER_CONTAINER, oldLogoObj, newLogoObj);
							break;
						case 16:
							editorUndoRedo.setUndoActData(EDIT_COLORS_OUTER_CONTAINER, oldLogoObj, newLogoObj);
							break;
						case 26:
							editorUndoRedo.setUndoActData(EDIT_COLORS_VARIATIONS, oldLogoObj, newLogoObj);
							break
					}
					break;
				case "frame":
					switch (p_sGeTargetLink) {
						case 24:
							if (currLogo.generate.templatePath.isFrame == 1) {
								editorUndoRedo.setUndoActData(OUTER_CONTAINER_ADD, oldLogoObj, newLogoObj);
							}
							break;
						case 42:
							currLogo.generate.frameSizeSlider = constantVars.ORIGINAL_SPACING.frameSizeSlider;
							currLogo.generate.logoSizeSlider = constantVars.ORIGINAL_SPACING.logoSizeSlider;
							currLogo.generate.textSloganDistSlider = constantVars.ORIGINAL_SPACING.textSloganDistSlider;
							if ((currLogo.generate.templatePath.isFrame == 1) && (obj.currentLogo.generate.templatePath.isFrame == 1)) {
								editorUndoRedo.setUndoActData(OUTER_CONTAINER_CHANGE, oldLogoObj, newLogoObj);
							}
							break;
						case 40:
							if (currLogo.generate.templatePath.isIconFrame == 1) {
								editorUndoRedo.setUndoActData(INNER_CONTAINER_ADD, oldLogoObj, newLogoObj);

							}
							break;
						case 44:
							if ((currLogo.generate.templatePath.isIconFrame == 1) && (obj.currentLogo.generate.templatePath.isIconFrame == 1)) {
								editorUndoRedo.setUndoActData(INNER_CONTAINER_CHANGE, oldLogoObj, newLogoObj);
								currLogo.generate.logoSizeSlider = constantVars.ORIGINAL_SPACING.logoSizeSlider;
							}
							break;
					}
					break;
				case "logo":
					switch (p_sGeTargetLink) {
						case 8:
							logoMakerFunction.resetSlider("logoTextSlider");
							logoMakerFunction.resetSlider("logoLetterSpacing");
							// logoMakerFunction.resetSlider("sloganTextSize");
							if (newLogoObj.generate.templatePath.isEqual == 1 && newLogoObj.generate.templatePath.sloganSetAsPerText == 1) {
								logoMakerFunction.setSliderForSloganLetterSpacing(newLogoObj.generate.sloganLetterSpacing);
							} else {
								// logoMakerFunction.resetSlider("sloganLetterSpacing");
							}

							if (newLogoObj.generate.templatePath.isDBLineCompanyText == "yes") {
								if (newLogoObj.generate.hasOwnProperty("logoText1Slider")) {
									delete newLogoObj.generate["logoText1Slider"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText2Slider")) {
									delete newLogoObj.generate["logoText2Slider"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText1LetterSpacing")) {
									delete newLogoObj.generate["logoText1LetterSpacing"];
								}
								if (newLogoObj.generate.hasOwnProperty("logoText2LetterSpacing")) {
									delete newLogoObj.generate["logoText2LetterSpacing"];
								}
							}
							parentDiv = $('.subChild-8').find(".company-text-font-box");
							workFor = parentDiv.attr("last_selected");
							$('.subChild-8').find(".company-text-font-box").attr("last_selected", "");
							switch (workFor) {
								case "dd-ct-font-line1":
									editorUndoRedo.setUndoActData(LOGO_FONT1_CHANGE, oldLogoObj, newLogoObj);
									break;
								case "dd-ct-font-line2":
									editorUndoRedo.setUndoActData(LOGO_FONT2_CHANGE, oldLogoObj, newLogoObj);
									break;
								case "dd-ct-font-overall":
								default:
									editorUndoRedo.setUndoActData(LOGO_FONT_CHANGE, oldLogoObj, newLogoObj);
									break;
							}
							break;
					}
					break;
				case "slogan":
					switch (p_sGeTargetLink) {
						case 10:
							// logoMakerFunction.resetSlider("logoTextSlider");
							// logoMakerFunction.resetSlider("logoLetterSpacing");
							logoMakerFunction.resetSlider("sloganTextSize");
							if (newLogoObj.generate.templatePath.isEqual == 1 && newLogoObj.generate.templatePath.sloganSetAsPerText == 1) {
								logoMakerFunction.setSliderForSloganLetterSpacing(newLogoObj.generate.sloganLetterSpacing);
							} else {
								logoMakerFunction.resetSlider("sloganLetterSpacing");
							}
							// onTextSloganDistanceSlide($('.textSloganDistSlider'), oldLogoObj.generate.textSloganDistSlider, true);
							currLogo.generate.textSloganDistSlider = oldLogoObj.generate.textSloganDistSlider;
							editorUndoRedo.setUndoActData(SLOGAN_FONT_CHANGE, oldLogoObj, newLogoObj);
							break;
					}
					break;
			}

			var dataAnalysisObj = dh_editor_utility.getDataAnalsyis(currLogo, false);
			obj.setSession('currentLogo', dh_editor_utility.getValidJsonStringifyObj(currLogo));
			obj.currentLogo = currLogo;
			if (currLogo.generate.isArc == 1) {
				showCurveSlider(true);
			} else {
				showCurveSlider(false);
			}

			var logoId = obj.getCurrentLogoId();
			var logoJSONObj = obj.validateJSON(obj.currentLogo, dataAnalysisObj)
			const curr_logo_blob = new Blob([JSON.stringify(logoJSONObj)], {
				type: "application/json;charset=utf-8"
			});
			const svg_logo_blob = new Blob([logoMakerFunction.getFinalLogoTemplate(obj.currentLogo.generate, true)], { type: 'image/svg+xml' });
			dh_lm_save.saveAction(logoId, curr_logo_blob, svg_logo_blob, null, null, false, false, JSON.stringify(dataAnalysisObj), JSON.stringify(dh_editor_utility.createLogging("on saveDefaultLogo"))).then((p_oJSON) => {
				let json = dh_editor_utility.getValidJsonParseObj(p_oJSON);
				if (json.status == 0) {
					obj.alertMessages('error', json.msg);
				} else {
					obj.alertMessages('success', json.msg);
					obj.setCurrentLogoId(json.data.logo_id);
				}
				dh_editor_utility.clearException();
			});
		}

		// gor getting svg of current logoo
		obj.getCurrentLogo = function () {
			var html = logoMakerFunction.getFinalLogoTemplate(obj.currentLogo.generate);
			$('.finaLogoInner').html('<div class="svg--slide" style="background-color:' + obj.currentLogo.generate.bgColor + '; "><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + html + '</div></div>');

			if (!(typeof obj.getSession('boundary') == "undefined" || obj.getSession('boundary') == null)) {
				var boundary = dh_editor_utility.getValidJsonParseObj(obj.getSession('boundary'));
				$('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + boundary.width + 'px; height:' + boundary.height + 'px; border:1px solid lime; left:' + boundary.left + 'px; z-index:11; top:' + boundary.top + 'px"></div>');

			}
		}

		// for showing preiview page
		obj.previewLogo = function (p_sStepType, p_oCurrentLogo, p_oParent) {
			//$("html, body").animate({ scrollTop: 0 });
			var currLogo = null;
			if (p_sStepType == "step6") {
				currLogo = p_oCurrentLogo;
				if (currLogo != null) {
					p_oParent.find('.previewLogoBox, .cardBG').css({ 'background-color': currLogo.generate.bgColor });
					p_oParent.find('.bagSvgBG svg g').attr('fill', currLogo.generate.bgColor);
					p_oParent.find('.logoImages').each(function () {
						p_oParent.find(this).html(logoMakerFunction.getFinalLogoTemplate(currLogo.generate));
					});
					if (currLogo.generate.templatePath.frameType == 'filled') {
						p_oParent.find('.logoImages').removeClass('noFilled');
					}
					else {
						p_oParent.find('.logoImages').addClass('noFilled');
					}
				}
			} else {
				currLogo = dh_editor_utility.getValidJsonParseObj(obj.getSession('currentLogo'));
				if (currLogo != null) {
					$('.previewLogoBox, .cardBG').css({ 'background-color': currLogo.generate.bgColor });
					$('.bagSvgBG svg g').attr('fill', currLogo.generate.bgColor);
					$('.logoImages').each(function () {
						$(this).html(logoMakerFunction.getFinalLogoTemplate(currLogo.generate));
					});
					if (currLogo.generate.templatePath.frameType == 'filled') {
						$('.logoImages').removeClass('noFilled');
					}
					else {
						$('.logoImages').addClass('noFilled');
					}
				}
			}
		}

		// for getting current logo id	
		obj.getCurrentLogoId = function () {
			return obj.getSession('currLogoId');
		}

		// for setting current logo id
		obj.setCurrentLogoId = function (logoId) {
			obj.setSession('currLogoId', logoId);
		}

		// function for showing logo colors in preview page	
		obj.previewColors = function (p_sStepType, p_oCurrentLogo, p_oParent) {
			var currLogo = null;
			var previewColorsPlatesDiv = null;
			if (p_sStepType == "step6") {
				currLogo = p_oCurrentLogo;
				previewColorsPlatesDiv = p_oParent.find('.previewColorsPlates');
			} else {
				currLogo = dh_editor_utility.getValidJsonParseObj(obj.getSession('currentLogo'));
				previewColorsPlatesDiv = $('.previewColorsPlates');
			}
			previewColorsPlatesDiv.html('');
			previewColorsPlatesDiv.append('<div class="palette-desc"><div class="box box2 shadow"><div class="palette-head">Color Palette</div><div class="palette-para">Included in premium</div></div></div>');
			var arr = {};

			if (currLogo != null) {
				if (currLogo.generate.templatePath.isIconFrame == 1) {
					arr.iconFrame = { head: 'Inner Container', color: currLogo.generate.iconFrameColor, gradientType: currLogo.generate.iconFrameGradient };
				}

				if (currLogo.generate.templatePath.isFrame == 1) {
					if (currLogo.generate.templatePath.frameType == "filled") {
						arr.frame = { head: 'Filled Container', color: currLogo.generate.frameFilledColor, gradientType: currLogo.generate.frameFilledGradient };
					} else {
						arr.frame = { head: 'Container', color: currLogo.generate.frameColor, gradientType: currLogo.generate.frameGradient };
					}
				}


				if (currLogo.generate.templatePath.isIcon == 1) {
					arr.icon = { head: 'Symbol', color: currLogo.generate.iconColor, gradientType: currLogo.generate.iconGradient };
				}
				if (currLogo.generate.templatePath.isMono == 1) {
					arr.mono = { head: 'Monogram', color: currLogo.generate.iconColor, gradientType: currLogo.generate.iconGradient };
				}

				if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
					if (currLogo.logoName1 != "") {
						arr.main = { head: 'Company Name', color: currLogo.generate.mainTextColor, gradientType: currLogo.generate.textGradient };
					}
					if (currLogo.logoName2 != "") {
						arr.main = { head: 'Company Name', color: currLogo.generate.mainText2Color, gradientType: currLogo.generate.text2Gradient };
					}
				} else {
					if (currLogo.logoName != "") {
						arr.main = { head: 'Company Name', color: currLogo.generate.mainTextColor, gradientType: currLogo.generate.textGradient };
					}
				}


				if (currLogo.sloganName != "") {
					arr.slogan = { head: 'Slogan', color: currLogo.generate.sloganTextColor, gradientType: currLogo.generate.sloganGradient };
				}

				arr.bg = { head: 'Background', color: currLogo.generate.bgColor, gradientType: '' };
				var colorPalette = {};
				var colorArr = [];
				var currColor = "";
				var i = j = k = 0;
				$.each(arr, function (k, v) {
					currColor = typeof v.gradientType == 'undefined' || v.gradientType == "" ? v.color : v.gradientType;
					if ($.inArray(currColor, colorArr) == -1) {
						colorArr.push(currColor);
					}
				});

				$.each(colorArr, function (k, v) {
					var ver = v;

					if (!gradientsArray[v]) {
						ver = v.substr(1);
					}
					colorPalette[ver] = [];
					$.each(arr, function (ke, ve) {

						currColor = typeof ve.gradientType == 'undefined' || ve.gradientType == "" ? ve.color : ve.gradientType;
						if (currColor == v) {
							colorPalette[ver].push('<span>' + ve.head + '</span>');
						}
					});
				});

				$.each(colorPalette, function (k, v) {
					if (gradientsArray[k]) {
						var colorObj = gradientsArray[k]
						var style = getGradientStyle(k);

						previewColorsPlatesDiv.append('<div class="preview-color-container"><div class="preview-bg" style="background:' + style + '"></div><div class="preview-color--boxes"><div class="color--boxes-center"><p class="color--name">' + colorObj.name + '</p><p>' + v.join(', ') + '</p></div></div></div>');
					}
					else {
						previewColorsPlatesDiv.append('<div class="preview-color-container"><div class="preview-bg" style="background-color:#' + k + ';"></div><div class="preview-color--boxes"><div class="color--boxes-center"><p class="color--name">#' + k + '</p><p>' + v.join(', ') + '</p></div></div></div>');

					}
				});
				$(".preview-color-container").wrapAll("<div class='pallet-wrap'></div>");
				if (p_sStepType == "step6") {
					if (p_oParent.find('.preview-color-container').length <= 4) {
						p_oParent.find('.preview-image-container-palete').addClass('mob-color-palete');
					} else {
						p_oParent.find('.preview-image-container-palete').removeClass('mob-color-palete');
					}
				} else {
					if ($('.preview-color-container').length <= 4) {
						$('.preview-image-container-palete').addClass('mob-color-palete');
					} else {
						$('.preview-image-container-palete').removeClass('mob-color-palete');
					}
				}
			}
			return colorPalette;

		}

		// for showing aler messages 	
		obj.alertMessages = function (type, msg) {
			var stripHeight = 0;
			if ($('.avail_offer').length > 0) {
				stripHeight = $('.avail_offer').height();
			}

			switch (type) {

				case 'success': {
					$('.step_7').append('<div class="commonNotification common-notification"><div class="spin circle notif notif-success"><div class="notify--text">' + msg + '</div></div></div>');
					break;
				}
				case 'error': {
					$('.step_7').append('<div class="commonNotification common-notification"><div class="spin circle notif notif-danger"><a href="javascript:;" class="iconCheck icons-check"> </a><div class="notify--text">' + msg + '</div></div></div>');
					break;
				}
				case 'warning': {
					$('.step_7').append('<div class="commonNotification common-notification"><div class="alert alert-warning text-left"><a href="javascript:;" class="iconCheck icons-check"> </a><div class="notify--text">' + msg + '</div></div></div>');
					break;
				}
			}
			setTimeout(function () { $('.commonNotification').addClass('active').css('top', stripHeight + 60 + "px"); }, 500);
			setTimeout(function () { $('.commonNotification .notif-success .notify--text').html('Saved'); }, 850);
			setTimeout(function () { $('.commonNotification').remove(); }, 3000);
		}

		obj.enabledIconMonoCheckBox = function (p_bValue) {
			if (!lEditor.step6ReloadCheck()) {
				if (p_bValue) {
					$(".step_6 .only_symbol_filter #symbol_only").removeClass("disabled");
					$(".step_6 .only_mono_filter #monogram_only").removeClass("disabled");
					$(".step_6 .only_symbol_filter").css("pointer-events", "auto");
					$(".step_6 .only_mono_filter").css("pointer-events", "auto");
					$(".step_6 .only_symbol_filter").css("opacity", 1);
					$(".step_6 .only_mono_filter").css("opacity", 1);
				} else {
					$(".step_6 .only_symbol_filter #symbol_only").addClass("disabled");
					$(".step_6 .only_mono_filter #monogram_only").addClass("disabled");
					$(".step_6 .only_symbol_filter").css("pointer-events", "none");
					$(".step_6 .only_mono_filter").css("pointer-events", "none");

					$(".step_6 .only_symbol_filter").css("opacity", 0.5);
					$(".step_6 .only_mono_filter").css("opacity", 0.5);
				}
			}
		}
		obj.hideIconMonoCheckBox = function () {
			if (!lEditor.step6ReloadCheck()) {
				$(".step_6 .only_symbol_filter").addClass("hidden");
				$(".step_6 .only_mono_filter").addClass("hidden");
				$(".step_6 .only_symbol_filter").removeClass("alerts_border");
				$(".step_6 .only_mono_filter").removeClass("alerts_border");

				obj.unCheckMonoCheckBox();
				obj.unCheckIconCheckBox();
			}
		}
		obj.showIconCheckBox = function (p_bValue) {
			if (lEditor.step6ReloadCheck()) {
				$(".step_6 .only_symbol_filter").addClass("hidden");
				$(".step_6 .only_symbol_filter").removeClass("alerts_border");
			} else {
				if (p_bValue) {
					if (templateDisplay.only_symbol == 1) {
						$(".step_6 .only_symbol_filter").removeClass("hidden");
						$(".step_6 .only_symbol_filter").addClass("alerts_border");
					}
				} else {
					$(".step_6 .only_symbol_filter").addClass("hidden");
					$(".step_6 .only_symbol_filter").removeClass("alerts_border");
					obj.unCheckIconCheckBox();
				}
			}
		}
		obj.showMonoCheckBox = function () {
			if (lEditor.step6ReloadCheck()) {
				$(".step_6 .only_mono_filter").addClass("hidden");
				$(".step_6 .only_mono_filter").removeClass("alerts_border");
			} else {
				$(".step_6 .only_mono_filter").removeClass("hidden");
				$(".step_6 .only_mono_filter").addClass("alerts_border");
			}

		}
		obj.unCheckMonoCheckBox = function () {
			if (!lEditor.step6ReloadCheck()) {
				document.querySelector(".step_6 .only_mono_filter #monogram_only")["checked"] = false;
			}
		}
		obj.unCheckIconCheckBox = function () {
			if (!lEditor.step6ReloadCheck()) {
				document.querySelector(".step_6 .only_symbol_filter #symbol_only")["checked"] = false;
			}
		}
		obj.getBestColorSchema = function (p_nCurrentStep) {
			if (pelletsDisplay.best_color == 1 && (!allBestSchemaList.length)) {
				function grabSchema() {
					allBestSchemaList = [];
					let payLoadData = { action: 'randomData', best_colors: 1, limit: 100 }
					$.ajax({
						url: DH.baseURL + '/logoMakerAjax.php',
						type: 'POST',
						data: payLoadData,
					}).done(function (json) {
						json = json && dh_editor_utility.getValidJsonParseObj(json);
						if (json && json.status == 1 && json.data && json.data.pellets && json.data.pellets.length) {
							let allPalletsList = dh_editor_utility.shuffleTheArray([...json.data.pellets]);
							let lightPelletList = [];
							let darkPelletList = [];
							$.each(allPalletsList, function (k, v) {
								if (v.schema_type == "1") {
									lightPelletList.push(v)
								}
								if (v.schema_type == "2") {
									darkPelletList.push(v)
								}
							});

							if (lightPelletList.length > darkPelletList.length) {
								lightPelletList = lightPelletList.slice(0, darkPelletList.length);
							} else {
								darkPelletList = darkPelletList.slice(0, lightPelletList.length);
							}
							allPalletsList = [...lightPelletList, ...darkPelletList];
							if (lightPelletList.length === darkPelletList.length && (lightPelletList.length + darkPelletList.length) == allPalletsList.length) {
								$.each(allPalletsList, function (k, v) {
									if (k % 2 === 0) {
										allBestSchemaList.push(lightPelletList.pop());
									} else {
										allBestSchemaList.push(darkPelletList.pop());
									}
								});
							}
						}
						lEditor.getGradientSchema();
					}).fail(function (jqXHR, exception) {
						lEditor.getGradientSchema();
					}).error(function (jqXHR, exception) {
						lEditor.getGradientSchema();
					}).always(function () {
					});
				}
				if ((lEditor.currentStep != 6) && (!p_nCurrentStep)) {
					grabSchema();
				} else {
					if (p_nCurrentStep == 6) {
						grabSchema();
					}
				}
			} else {
				lEditor.getGradientSchema();
			}
		}
		obj.getGradientSchema = function () {
			if (pelletsDisplay.only_gradient == 1 && (!allGradientSchemaList.length)) {
				let payLoadData = { action: 'randomData', gradient: 1, limit: 100 }
				$.ajax({
					url: DH.baseURL + '/logoMakerAjax.php',
					type: 'POST',
					data: payLoadData,
				}).done(function (json) {
					json = json && dh_editor_utility.getValidJsonParseObj(json);
					if (json && json.status == 1 && json.data && json.data.pellets && json.data.pellets.length) {
						allGradientSchemaList = [];
						allGradientSchemaList = dh_editor_utility.shuffleTheArray(json.data.pellets);
					}
				}).fail(function (jqXHR, exception) {
				}).error(function (jqXHR, exception) {
				}).always(function () {
				});
			} else {
			}
		}
		obj.runTemplateDisplayLogic = function (p_sLogoName, requiredLength, p_bIsUserSelecedColor) {
			let randomTemplateList = [];
			let isRunDefaultLogic = false;
			if (lEditor.step6ReloadCheck()) {
				isRunDefaultLogic = true;
			}
			let clonestep6templatesData = [];

			let logoTextListLength = lEditor.getLogoNamePartsLength(p_sLogoName);
			let specialDBLineTemplateList = [];
			let cnt = 0;
			let specialDBTemplateRequired = (requiredLength / 2) + 2;
			specialDBLineCase = false;
			let isDesignStyleLogic = false;
			if (!isRunDefaultLogic) {
				if ((logoTextListLength >= DBLineWrapCaseVal) && (p_sLogoName.length > maxLogoNameLengthForCurve) && (loadMoreStart > 2 && (loadMoreStart % 2 !== 0))) {
					specialDBLineCase = true;
				}
				if (specialDBLineCase && logoTextListLength >= DBLineWrapCaseVal) {
					if (logoTextListLength >= 5) {
						clonestep6templatesData = dh_editor_utility.shuffleTheArray([...onlyDoubleLineWithoutFrameTemplateData]);
					} else {
						clonestep6templatesData = dh_editor_utility.shuffleTheArray([...onlyDoubleLineTemplateData]);
					}

					if (document.querySelector("#monogram_only")["checked"] && templateDisplay.only_monogram == 1) {
						$.each(clonestep6templatesData, function (k, v) {
							if (v.isMono == 1 && (cnt < specialDBTemplateRequired)) {
								specialDBLineTemplateList.push(v);
								cnt++;
							}
						});
					}
					else if (document.querySelector("#symbol_only")["checked"] && templateDisplay.only_symbol == 1 && $('.step_6 .symbol-container .iconContainerBoxes img').length) {
						$.each(clonestep6templatesData, function (k, v) {
							if (v.isIcon == 1 && (cnt < specialDBTemplateRequired)) {
								specialDBLineTemplateList.push(v);
								cnt++;
							}
						});
					}
					else {
						specialDBLineTemplateList = clonestep6templatesData.slice(0, specialDBTemplateRequired);
						// here fetching doubleline template form all template list . here there is no mean of is_show = 1 and is_double_line_company_text = 1
					}
				}
				clonestep6templatesData = [];
			}
			if (document.querySelector("#symbol_only")["checked"] || document.querySelector("#monogram_only")["checked"] && !isRunDefaultLogic) {
				if (document.querySelector("#symbol_only")["checked"] && templateDisplay.only_symbol == 1 && $('.step_6 .symbol-container .iconContainerBoxes img').length) {
					clonestep6templatesData = dh_editor_utility.shuffleTheArray([...onlyIconTemplateData]);

					if (specialDBLineCase && logoTextListLength >= DBLineWrapCaseVal) {
						$.each(clonestep6templatesData, function (k, v) {
							if (logoTextListLength >= 5) {
								if ((v.template_db_id == v.template_id) && (v.isFrame == 0) && (v.is_double_line_company_text == 0)) {
									randomTemplateList.push(v);
								}
							} else {
								if ((v.template_db_id == v.template_id) && (v.is_double_line_company_text == 0)) {
									randomTemplateList.push(v);
								}
							}
						});
					} else {
						if (logoTextListLength >= 2) {
							randomTemplateList = clonestep6templatesData.slice(0, (requiredLength));

						} else {
							// single line case
							$.each(clonestep6templatesData, function (k, v) {
								if ((v.template_db_id == v.template_id) && (v.is_double_line_company_text == 0)) {
									randomTemplateList.push(v);
								}
							});
						}
					}
					// this case run only when user added symbol
					// here fetching symbol template form all template list . here there is no mean of is_show = 1
				}
				if (document.querySelector("#monogram_only")["checked"] && templateDisplay.only_monogram == 1) {
					clonestep6templatesData = dh_editor_utility.shuffleTheArray([...onlyMonoTemplateData]);
					if (specialDBLineCase && logoTextListLength >= DBLineWrapCaseVal) {
						if (logoTextListLength >= 5) {
							$.each(clonestep6templatesData, function (k, v) {
								if ((v.template_db_id == v.template_id) && (v.isFrame == 0) && (v.is_double_line_company_text == 0)) {
									randomTemplateList.push(v);
								}
							});
						} else {
							$.each(clonestep6templatesData, function (k, v) {
								if ((v.template_db_id == v.template_id) && (v.is_double_line_company_text == 0)) {
									randomTemplateList.push(v);
								}
							});
						}
					} else {
						if (logoTextListLength >= 2) {
							randomTemplateList = clonestep6templatesData.slice(0, (requiredLength));
						} else {
							// single line case
							$.each(clonestep6templatesData, function (k, v) {
								if ((v.template_db_id == v.template_id) && (v.is_double_line_company_text == 0)) {
									randomTemplateList.push(v);
								}
							});
						}
					}
					// here fetching monogram template form all template list . here there is no mean of is_show = 1
				}
			} else {
				let maxIconTemplate = 0;
				let iconTemplateCnt = 0;
				let maxMonoTemplate = 0;
				let monoTemplateCnt = 0;
				let maxNormalTemplate = 0;
				let normalTemplateCnt = 0;
				let styleLogicDataList = (lEditor.isDesignStyleLogicRun()) ? lEditor.runTemplateDisplayAsPerDesignStyle(p_bIsUserSelecedColor, requiredLength) : [];
				if (styleLogicDataList && styleLogicDataList.length && styleLogicDataList[0].length) {
					randomTemplateList = [...styleLogicDataList[0]];
					clonestep6templatesData = [...styleLogicDataList[1]];
					iconTemplateCnt = styleLogicDataList[2];
					monoTemplateCnt = styleLogicDataList[3];
					normalTemplateCnt = styleLogicDataList[4];
					isDesignStyleLogic = true;
					if (randomTemplateList.length === requiredLength) {
						return dh_editor_utility.shuffleTheArray(randomTemplateList);
					}
					if (iconTemplateCnt > templateDisplay.user_search_symbol.iconTypeTemplate) {
						maxIconTemplate = iconTemplateCnt;
						let restTypeTemplates = requiredLength - maxIconTemplate;
						maxMonoTemplate = Math.round(restTypeTemplates / 2);
						maxNormalTemplate = restTypeTemplates - maxMonoTemplate;
					}
					else if (monoTemplateCnt > templateDisplay.user_search_symbol.monoTypeTemplate) {
						maxMonoTemplate = monoTemplateCnt;
						let restTypeTemplates = requiredLength - maxMonoTemplate;
						maxIconTemplate = Math.round(restTypeTemplates / 2);
						maxNormalTemplate = restTypeTemplates - maxIconTemplate;
					}
					else if (normalTemplateCnt > templateDisplay.user_search_symbol.normalTypeTemplate) {
						maxNormalTemplate = normalTemplateCnt;
						let restTypeTemplates = requiredLength - maxNormalTemplate;
						maxIconTemplate = Math.round(restTypeTemplates / 2);
						maxMonoTemplate = restTypeTemplates - maxIconTemplate;
					} else {
						if ($('.step_6 .symbol-container .iconContainerBoxes img').length) {
							// user choose symbol
							maxIconTemplate = templateDisplay.user_search_symbol.iconTypeTemplate;
							maxMonoTemplate = templateDisplay.user_search_symbol.monoTypeTemplate;
							maxNormalTemplate = templateDisplay.user_search_symbol.normalTypeTemplate;
						} else {
							// default symbol case
							let defaultIconList = JSON.parse(sessionStorage.getItem('defaultIcon'));
							if (defaultIconList && defaultIconList.si && defaultIconList.si.length > 0) {
								maxIconTemplate = templateDisplay.default_symbol.iconTypeTemplate;
								maxMonoTemplate = templateDisplay.default_symbol.monoTypeTemplate;
								maxNormalTemplate = templateDisplay.default_symbol.normalTypeTemplate;
							}
						}
					}
				} else {
					clonestep6templatesData = ([...step6templatesData]);
					if ($('.step_6 .symbol-container .iconContainerBoxes img').length) {
						// user choose symbol
						maxIconTemplate = templateDisplay.user_search_symbol.iconTypeTemplate;
						maxMonoTemplate = templateDisplay.user_search_symbol.monoTypeTemplate;
						maxNormalTemplate = templateDisplay.user_search_symbol.normalTypeTemplate;
					} else {
						// default symbol case
						let defaultIconList = JSON.parse(sessionStorage.getItem('defaultIcon'));
						if (defaultIconList && defaultIconList.si && defaultIconList.si.length > 0) {
							maxIconTemplate = templateDisplay.default_symbol.iconTypeTemplate;
							maxMonoTemplate = templateDisplay.default_symbol.monoTypeTemplate;
							maxNormalTemplate = templateDisplay.default_symbol.normalTypeTemplate;
						}
					}
				}


				$.each(clonestep6templatesData, function (k, v) {
					if (logoTextListLength >= 2) {
						if (specialDBLineCase && logoTextListLength >= DBLineWrapCaseVal && !isRunDefaultLogic) {
							// only single line support template
							if (logoTextListLength >= 5) {
								if ((v.template_db_id == v.template_id) && (v.isFrame == 0) && (v.is_double_line_company_text == 0)) {
									randomTemplateList.push(v);
								}
							} else {
								if ((v.template_db_id == v.template_id) && (v.is_double_line_company_text == 0)) {
									randomTemplateList.push(v);
								}
							}
						} else {
							if (v.isIcon == 1 && v.isMono == 0 && iconTemplateCnt < maxIconTemplate) {
								randomTemplateList.push(v);
								iconTemplateCnt++;
							}
							if (v.isMono == 1 && v.isIcon == 0 && monoTemplateCnt < maxMonoTemplate) {
								randomTemplateList.push(v);
								monoTemplateCnt++;
							}
							if (v.isIcon == 0 && v.isMono == 0 && normalTemplateCnt < maxNormalTemplate) {
								randomTemplateList.push(v);
								normalTemplateCnt++;
							}
						}
					} else {
						// only single line support template
						if (v.isIcon == 1 && v.isMono == 0 && iconTemplateCnt < maxIconTemplate && v.template_db_id == v.template_id) {
							randomTemplateList.push(v);
							iconTemplateCnt++;
						}
						if (v.isMono == 1 && v.isIcon == 0 && monoTemplateCnt < maxMonoTemplate && v.template_db_id == v.template_id) {
							randomTemplateList.push(v);
							monoTemplateCnt++;
						}
						if (v.isIcon == 0 && v.isMono == 0 && normalTemplateCnt < maxNormalTemplate && v.template_db_id == v.template_id) {
							randomTemplateList.push(v);
							normalTemplateCnt++;
						}
					}
				});
			}
			if (specialDBLineCase && logoTextListLength >= DBLineWrapCaseVal && specialDBLineTemplateList.length > 0 && randomTemplateList.length > 0 && !isRunDefaultLogic && (!isDesignStyleLogic)) {
				let ramaining = requiredLength - specialDBLineTemplateList.length;
				let rand1 = randomTemplateList.slice(0, ramaining);
				if (rand1.length > 0) {
					randomTemplateList = [];
					randomTemplateList = [...rand1, ...specialDBLineTemplateList];
				}
			}
			return dh_editor_utility.shuffleTheArray(randomTemplateList);
		}
		obj.runPelletsDisplayLogic = function (requiredLength, p_aOriginalPelletsList) {
			let pellets = [];
			if ((pelletsDisplay.only_gradient == 1) && allGradientSchemaList.length && currentRunningSchema === "only_gradient") {
				if (gradientSchemaReadCounter === 0) {
					pellets = [];
					pellets = allGradientSchemaList.slice(gradientSchemaReadCounter, (gradientSchemaReadCounter + requiredLength));
					gradientSchemaReadCounter = gradientSchemaReadCounter + requiredLength
				} else {
					if ((gradientSchemaReadCounter + requiredLength) <= allGradientSchemaList.length) {
						pellets = [];
						pellets = allGradientSchemaList.slice(gradientSchemaReadCounter, (gradientSchemaReadCounter + requiredLength));
						gradientSchemaReadCounter = gradientSchemaReadCounter + requiredLength;
					} else {
						gradientSchemaReadCounter = 0;
					}
				}
			}
			else if ((pelletsDisplay.best_color == 1) && allBestSchemaList.length && currentRunningSchema === "best_color") {
				if (bestSchemaReadCounter === 0) {
					pellets = [];
					pellets = allBestSchemaList.slice(bestSchemaReadCounter, (bestSchemaReadCounter + requiredLength));
					bestSchemaReadCounter = bestSchemaReadCounter + requiredLength
				} else {
					if ((bestSchemaReadCounter + requiredLength) <= allBestSchemaList.length) {
						pellets = [];
						pellets = allBestSchemaList.slice(bestSchemaReadCounter, (bestSchemaReadCounter + requiredLength));
						bestSchemaReadCounter = bestSchemaReadCounter + requiredLength;
					} else {
						bestSchemaReadCounter = 0;
						bestColorViewDone = true;
					}
				}
			}
			else if (currentRunningSchema === "light_dark") {
				p_aOriginalPelletsList = dh_editor_utility.shuffleTheArray(p_aOriginalPelletsList);
				let lightPelletList = [];
				let darkPelletList = [];
				$.each(p_aOriginalPelletsList, function (k, v) {
					if (v.schema_type == "1") {
						lightPelletList.push(v)
					}
					if (v.schema_type == "2") {
						darkPelletList.push(v)
					}
				});
				if (lightPelletList.length === darkPelletList.length && (lightPelletList.length + darkPelletList.length) == requiredLength) {
					pellets = [];
					$.each(p_aOriginalPelletsList, function (k, v) {
						if (k % 2 === 0) {
							pellets.push(lightPelletList.pop());
						} else {
							pellets.push(darkPelletList.pop());
						}
					});
				}
			}
			else if (currentRunningSchema === "default" && show_light_dark_in_default_schema) {
				p_aOriginalPelletsList = dh_editor_utility.shuffleTheArray(p_aOriginalPelletsList);
				let lightPelletList = [];
				let darkPelletList = [];
				$.each(p_aOriginalPelletsList, function (k, v) {
					if (v.schema_type == "1") {
						lightPelletList.push(v)
					}
					if (v.schema_type == "2") {
						darkPelletList.push(v)
					}
				});
				if (lightPelletList.length === darkPelletList.length && (lightPelletList.length + darkPelletList.length) == requiredLength) {
					pellets = [];
					$.each(p_aOriginalPelletsList, function (k, v) {
						if (k % 2 === 0) {
							pellets.push(lightPelletList.pop());
						} else {
							pellets.push(darkPelletList.pop());
						}
					});
				}
			}
			return pellets;
		}
		obj.getLogoNamePartsLength = function (p_sLogoName) {
			if (p_sLogoName) {
				return p_sLogoName.split(" ").length
			}
		}
		obj.palletsAI = function () {
			let isUserSelecedColor = false;
			if (lEditor.step6ReloadCheck()) {
				currentRunningSchema = "default";
				return;
			}
			if (lEditor.getSession('sampleColor')) {
				let sampleClr = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('sampleColor'));
				if (sampleClr && sampleClr.length > 0) {
					const multiColorIndex = sampleClr.findIndex(item => item.samplecolorid == -1);
					if (multiColorIndex === 0) {
						// mean multicolor
					} else {
						isUserSelecedColor = true;
					}
				}
			}
			let loadMoreStartValue = "%c Load more counter is " + loadMoreStart;
			currentRunningSchema = "default";
			if (isUserSelecedColor) {

			} else {
				if (lEditor.isDesignStyleLogicRun() && lEditor.logoStyleImgBgSchemaTypeRepeatList && Object.keys(lEditor.logoStyleImgBgSchemaTypeRepeatList).length) {
					let onlyDarkSchemaCnt = +(lEditor.logoStyleImgBgSchemaTypeRepeatList["dark"] || 0);
					let onlyLightSchemaCnt = +(lEditor.logoStyleImgBgSchemaTypeRepeatList["light"] || 0);
					if (onlyDarkSchemaCnt === onlyLightSchemaCnt) {
						currentRunningSchema = "light_dark";
					} else {
						if (onlyDarkSchemaCnt > onlyLightSchemaCnt) {
							if ((onlyDarkSchemaCnt / 2) >= onlyLightSchemaCnt) {
								currentRunningSchema = "dark_only";
							} else {
								currentRunningSchema = "light_dark";
							}
						} else {
							if ((onlyLightSchemaCnt / 2) >= onlyDarkSchemaCnt) {
								currentRunningSchema = "light_only";
							} else {
								currentRunningSchema = "light_dark";
							}
						}
					}
					step6OnLoadFirstSchema = "desing_logic_schema";
				} else {
					if (designStyleLogic && (step6OnLoadFirstSchema === "desing_logic_schema")) {
						if (loadMoreStart <= 7) {
							currentRunningSchema = "only_gradient";
						} else {
							if (!bestColorViewDone) {
								currentRunningSchema = "best_color";
							}
						}
					} else {
						if (loadMoreStart === 1) {
							currentRunningSchema = "light_dark";
							step6OnLoadFirstSchema = "light_dark";
							// when first time step6 load
						} else {
							if (loadMoreStart > 2) {
								if (step6OnLoadFirstSchema === "default") {
									if (loadMoreStart <= 5) {
										currentRunningSchema = "light_dark";
									} else if (loadMoreStart <= 7) {
										currentRunningSchema = "only_gradient";
									} else {
										if (!bestColorViewDone) {
											currentRunningSchema = "best_color";
										}
									}
								} else {
									if (loadMoreStart <= 4) {
										currentRunningSchema = "only_gradient";
									} else {
										if (!bestColorViewDone) {
											currentRunningSchema = "best_color";
										}
									}
								}
							} else {
								if (step6OnLoadFirstSchema === "light_dark") {
									currentRunningSchema = "light_dark";
								}
								// on second load more we are keeping same as last schema;
							}

						}
					}
				}
			}
			return isUserSelecedColor;
		}
		obj.step6ReloadCheck = function () {
			let _b = false;
			let step6reload = +(lEditor.getSession("step6reload") || 0);
			if (step6reload >= maxStep6ReloadCnt) {
				_b = true;
			}
			if (designStyleLogic) {
				_b = false;
			}
			return _b;
		}
		obj.storeStep6RandomLogic = function () {
			let randObj = {};
			randObj.currentRunningSchema = currentRunningSchema;
			randObj.step6ReloadCnt = +(lEditor.getSession("step6reload") || 0);
			randObj.only_monogram = document.querySelector("#monogram_only")["checked"];
			randObj.only_symbol = document.querySelector("#symbol_only")["checked"];
			randObj.step6LoadMoreCnt = loadMoreStart;
			lEditor.setSession('rand_data', JSON.stringify(randObj));
		}
		obj.serachIconAtStep7 = function (iconSlug) {
			let offset = 0;
			return new Promise(function (resolve, reject) {
				jqXHR = $.ajax({
					url: DH.baseURL + '/dh_ajax.php',
					type: 'POST',
					data: { action: 'api', action_type: 'icon_tags', type: 'nonEditor', slug: iconSlug, offset: offset, limit: NOUN_API_LIMIT, hitfor: 'step7_add_symbol', page: obj.step7SearchIconPage },
					dataType: "json",
					beforeSend: function () { },
					success: function (res) {
						if (res) {
							if (res.status == 1) {
								resolve(dh_editor_utility.shuffleTheArray(res));
							} else {
								resolve({});
							}
						} else {
							resolve([]);
						}
					},
					fail: function () {
						resolve({});
					},
					error: function () {
						resolve({});
					}
				});
			});
		}
		obj.getStep7IconSVG = function (svgUrls) {
			return new Promise(function (resolve, reject) {
				jqXHR1 = $.ajax({
					url: DH.baseURL + '/dh_ajax.php',
					type: 'POST',
					data: { action: 'svg', 'icons': svgUrls },
					// async: false,
					success: function (json) {
						if (json) {
							json = dh_editor_utility.getValidJsonParseObj(json);
							if (json[0].originalicons) {
								obj.sliderData.copOriginalIcons = json[0].originalicons;
								$.each(json[0].originalicons, function (k1, v1) {
									obj.sliderData.originalIcons.push(v1);
								});
								obj.findIconNameSpace();
							}
							resolve(json);
						} else {
							resolve({});
						}
					},
					fail: function () {
						resolve({});
					},
					error: function () {
						resolve({});
					}
				});
			});
		}
		obj.getUserSelectedDesignStyles = function (p_aDesignStyleList) {
			obj.flushDesignStyleLogic();
			function getDir(p_sPosition) {
				if (!p_sPosition) {
					return "";
				}
				let template_direction = "";
				switch (p_sPosition.toLowerCase()) {
					case "center":
						template_direction = "0";
						break;
					case "left":
						template_direction = "1";
						break;
					case "right":
						template_direction = "2";
						break;
					case "down":
						template_direction = "4";
						break;
				}
				return template_direction;
			}
			let isEqualText = false;
			var logoText = dh_editor_utility.removeMultipleSpaces($('#logoname2').val()) || lEditor.getSession('logoname');
			var sloganName = dh_editor_utility.removeMultipleSpaces($('#sloganText').val()) || lEditor.getSession('sloganText');
			let logoTextList = obj.getLogoTextList(logoText);
			let logoNameLength = logoText.length;
			if (sloganName && (sloganName != "") && (sloganName.length >= 9) && (logoNameLength >= sloganName.length) && (logoNameLength <= 35)) {
				isEqualText = true;
			}
			if (p_aDesignStyleList.length) {
				let filterStyle = [...p_aDesignStyleList];
				if (filterStyle.length) {
					filterStyle.forEach(function (el) {
						el["logo_style_alt"] && delete el["logo_style_alt"];
						el["logo_style_code"] && delete el["logo_style_code"];
						el["logo_style_image"] && delete el["logo_style_image"];
						let isIcon = "0";
						let isMono = "0";
						let isEqual = "0";
						let isFrame = "0";
						let isIconFrame = "0";
						let template_direction = "";
						let isArc = "0";
						let styleImgDetails = el["style_image_details"];
						let isDBLineCompanyText = "0";
						if (styleImgDetails) {
							if (styleImgDetails["isIcon"] == "1") {
								if (dh_editor_utility.removeMultipleSpaces(styleImgDetails["icon"]["position"]) && dh_editor_utility.removeMultipleSpaces(styleImgDetails["icon"]["color"])) {
									isIcon = "1";
									template_direction = getDir(styleImgDetails["icon"]["position"]);
								}
							}
							if (styleImgDetails["isMono"] == "1") {
								if (dh_editor_utility.removeMultipleSpaces(styleImgDetails["icon"]["position"]) && dh_editor_utility.removeMultipleSpaces(styleImgDetails["icon"]["color"])) {
									isMono = "1";
									template_direction = getDir(styleImgDetails["icon"]["position"]);
								}
							}
							if (styleImgDetails["isFrame"] == "1") {
								isFrame = "1";
							}
							if (styleImgDetails["isIconFrame"] == "1") {
								isIconFrame = "1";
							}
							if (dh_editor_utility.removeMultipleSpaces(styleImgDetails["isEqual"]) == "1") {
								if (isEqualText) {
									isEqual = "1";
								}
							}
							if (styleImgDetails["isArc"] == "1") {
								if (dh_editor_utility.removeMultipleSpaces(styleImgDetails["arc_dir"]) != "") {
									isArc = "1";
								}
							}
							if (styleImgDetails["isDBLineCompanyText"] == "1") {

								if (logoTextList && logoTextList.length === 2) {
									isDBLineCompanyText = "1";
								}
							}
							if (allTypeTemplateData && allTypeTemplateData.length > 0) {
								let filterTemplates;
								if (template_direction && ((isIcon == "1") || (isMono == "1"))) {
									filterTemplates = allTypeTemplateData.filter(function (el) {
										let _b = true;
										if (isArc == "1") {
											_b = (el["isSupportCurveText"] == isArc)
										}
										if (
											(el["isIcon"] == isIcon) &&
											(el["isMono"] == isMono) &&
											(el["isFrame"] == isFrame) &&
											(el["isIconFrame"] == isIconFrame) &&
											(el["isdbLineCompanyText"] == isDBLineCompanyText) &&
											(_b) &&
											(el["isEqual"] == isEqual) &&
											(el["template_direction"] == template_direction)) {
											return true;
										}
									});
								} else {
									filterTemplates = allTypeTemplateData.filter(function (el) {
										let _b = true;
										if (isArc == "1") {
											_b = (el["isSupportCurveText"] == isArc)
										}
										if (
											(el["isIcon"] == isIcon) &&
											(el["isMono"] == isMono) &&
											(el["isFrame"] == isFrame) &&
											(el["isIconFrame"] == isIconFrame) &&
											(el["isdbLineCompanyText"] == isDBLineCompanyText) &&
											(_b) &&
											(el["isEqual"] == isEqual)) {
											return true;
										}
									});
								}
								if (filterTemplates && filterTemplates.length) {
									el["template_code"] = filterTemplates[0];
									if (styleImgDetails["isArc"] == "1") {
										el["design_logic_template_id"] = filterTemplates[0]["template_db_id"] + "_" + styleImgDetails["arc_dir"];
									} else {
										el["design_logic_template_id"] = filterTemplates[0]["template_db_id"];
									}
								}
							}
						}
					});
					let bgSchemaTypeList = [];
					let logoStyleImgTemplateDLList = [];
					let logoStyleImgUniqTemplateDLList = [];
					filterStyle.forEach(function (el) {
						if (el["template_code"] && el["design_logic_template_id"]) {
							lEditor.logoStyleImgTemplateIdList.push(el["template_code"]["template_db_id"]);
							lEditor.logoStyleImgTemplateCodeList.push(el);
							if (!logoStyleImgUniqTemplateDLList.includes(el["design_logic_template_id"])) {
								logoStyleImgUniqTemplateDLList.push(el["design_logic_template_id"]);
								lEditor.logoStyleImgUniqTemplateCodeList.push(el);
							}
							logoStyleImgTemplateDLList.push(el["design_logic_template_id"]);
							el["style_image_details"] && bgSchemaTypeList.push(dh_editor_utility.lightOrDark(el["style_image_details"]["bg_color"]))
						}
					});

					logoStyleImgTemplateDLList.forEach(function (i) { lEditor.logoStyleImgTemplateIdRepeatList[i] = (lEditor.logoStyleImgTemplateIdRepeatList[i] || 0) + 1; });

					bgSchemaTypeList.forEach(function (i) { lEditor.logoStyleImgBgSchemaTypeRepeatList[i] = (lEditor.logoStyleImgBgSchemaTypeRepeatList[i] || 0) + 1; });

				} else {
					console.log("something went wrong in filter the styles");
				}

			}
			else {
				console.log("something went wrong in styles id");
			}
		}
		obj.runTemplateDisplayAsPerDesignStyle = function (p_bIsUserSelecedColor, requiredLength) {
			let randomTemplateList = [];
			let iconTemplateCnt = 0;
			let monoTemplateCnt = 0;
			let normalTemplateCnt = 0;
			let clonestep6templatesData = [...step6templatesData];
			clonestep6templatesData.forEach(function (el, index) {
				if (lEditor.logoStyleImgTemplateIdList.includes(el.template_db_id)) {
					clonestep6templatesData.splice(index, 1);
				}
			});

			if (lEditor.logoStyleImgTemplateCodeList && lEditor.logoStyleImgTemplateCodeList.length && loadMoreStart == 1 && (!p_bIsUserSelecedColor)) {
				randomTemplateList = [];
				randomTemplateList = [...lEditor.logoStyleImgTemplateCodeList];
				lEditor.logoStyleImgTemplateCodeList.forEach(function (ft) {
					if (ft["template_code"]) {
						if ((ft["template_code"]["isIcon"] == "1")) {
							iconTemplateCnt++;
						}
						else if ((ft["template_code"]["isMono"] == "1")) {
							monoTemplateCnt++;
						} else {
							normalTemplateCnt++
						}
					}
				});
			}
			else if (lEditor.logoStyleImgUniqTemplateCodeList && lEditor.logoStyleImgUniqTemplateCodeList.length) {
				randomTemplateList = [];
				lEditor.logoStyleImgUniqTemplateCodeList.forEach(function (ft) {
					randomTemplateList.push(ft);
					if (ft["template_code"]) {
						if ((ft["template_code"]["isIcon"] == "1")) {
							iconTemplateCnt++;
						}
						else if ((ft["template_code"]["isMono"] == "1")) {
							monoTemplateCnt++;
						} else {
							normalTemplateCnt++
						}
					}
					// let tempId = ft["design_logic_template_id"];
					// if (tempId && lEditor.logoStyleImgTemplateIdRepeatList && lEditor.logoStyleImgTemplateIdRepeatList[tempId] >= 2 && (lEditor.logoStyleImgTemplateCodeList.length < (requiredLength / 2))) {
					// 	randomTemplateList.push(ft);
					// 	if (ft["template_code"]) {
					// 		if ((ft["template_code"]["isIcon"] == "1")) {
					// 			iconTemplateCnt++;
					// 		}
					// 		else if ((ft["template_code"]["isMono"] == "1")) {
					// 			monoTemplateCnt++;
					// 		} else {
					// 			normalTemplateCnt++
					// 		}
					// 	}
					// }
				});
			}

			return [randomTemplateList, clonestep6templatesData, iconTemplateCnt, monoTemplateCnt, normalTemplateCnt,]
		}
		obj.getAllOuterFrameByType = function (p_sFrameType) {
			let payLoadData = { action: 'all_frames', type: p_sFrameType }
			$.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: payLoadData,
			}).done(function (json) {
				json = json && dh_editor_utility.getValidJsonParseObj(json);
				if (json && json.status == 1 && json.data && json.data.frames && json.data.frames.length) {
					allOuterFramesList = dh_editor_utility.shuffleTheArray([...allOuterFramesList, ...json.data.frames]);
				}
				if (p_sFrameType === "filled") {
					lEditor.getAllOuterFrameByType("outline");
				}
			}).fail(function (jqXHR, exception) {
			}).error(function (jqXHR, exception) {
			}).always(function () {
			});
		}
		obj.getOuterFrameForDesignStyleLogo = function (p_sFrameType, p_sFrameShape) {
			let kIndex = -1;
			if (allOuterFramesList && allOuterFramesList.length) {
				for (let k = 0; k < allOuterFramesList.length; k++) {
					if (p_sFrameShape) {
						if ((allOuterFramesList[k]["frame_type"] === p_sFrameType) && (allOuterFramesList[k]["frame_shape"] === p_sFrameShape)) {
							kIndex = k;
							break;
						}
					} else {
						if ((allOuterFramesList[k]["frame_type"] === p_sFrameType)) {
							kIndex = k;
							break;
						}
					}
				}
			}
			if (kIndex !== -1 && allOuterFramesList && allOuterFramesList.length) {
				let fr = {};
				fr.svg = allOuterFramesList[kIndex]["frame_svg"];
				fr.type = allOuterFramesList[kIndex]["frame_type"];
				fr.shape = allOuterFramesList[kIndex]["frame_shape"];
				fr.isOverlap = allOuterFramesList[kIndex]["frame_overlap"];
				fr.frame_width = allOuterFramesList[kIndex]["frame_width"];
				fr.frame_height = allOuterFramesList[kIndex]["frame_height"];
				fr.id = allOuterFramesList[kIndex]["frame_id"];
				return fr;
			}
			return null;
		}
		obj.getAllInnerFrameByType = function (p_sFrameType) {
			let payLoadData = { action: 'alliconframes', type: p_sFrameType }
			$.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: payLoadData,
			}).done(function (json) {
				json = json && dh_editor_utility.getValidJsonParseObj(json);
				if (json && json.status == 1 && json.data && json.data.frames && json.data.frames.length) {
					allInnerFramesList = dh_editor_utility.shuffleTheArray([...allInnerFramesList, ...json.data.frames]);
				}
			}).fail(function (jqXHR, exception) {
			}).error(function (jqXHR, exception) {
			}).always(function () {
			});
		}
		obj.getInnerFrameForDesignStyleLogo = function (p_sIconFrameType, p_sIconFrameShape) {
			let kIndex = -1;
			if (allInnerFramesList && allInnerFramesList.length) {
				for (let k = 0; k < allInnerFramesList.length; k++) {
					if (p_sIconFrameShape) {
						if ((allInnerFramesList[k]["icon_frame_type"] === p_sIconFrameType) && (allInnerFramesList[k]["icon_frame_shape"] === p_sIconFrameShape)) {
							kIndex = k;
							break;
						}
					} else {
						if ((allInnerFramesList[k]["icon_frame_type"] === p_sIconFrameType)) {
							kIndex = k;
							break;
						}
					}
				}
			}
			if (kIndex !== -1 && allInnerFramesList && allInnerFramesList.length) {
				let fr = {};
				fr.svg = allInnerFramesList[kIndex]["icon_frame_svg"];
				fr.type = allInnerFramesList[kIndex]["icon_frame_type"];
				fr.shape = allInnerFramesList[kIndex]["icon_frame_shape"];
				fr.id = allInnerFramesList[kIndex]["icon_frame_id"];
				return fr;
			}
			return null;
		}
		obj.getLogoDesignStylesData = function (p_aDesignIdList) {
			if (lEditor.designLogoStyles.length) {
				return;
			}
			let logo_styles = lEditor.getSession("logo_styles");
			if (logo_styles) {
				let logo_styles_list = JSON.parse(logo_styles);
				lEditor.designLogoStyles = logo_styles_list;
				obj.getUserSelectedDesignStyles(logo_styles_list);
				return;
			}
			let payLoadData = { action: 'styles', style_ids: p_aDesignIdList }
			$.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: payLoadData,
			}).done(function (json) {
				json = json && dh_editor_utility.getValidJsonParseObj(json);
				if (json && json.status == 1 && json.data && json.data.styles && json.data.styles.length) {
					lEditor.designLogoStyles = [...json.data.styles];
					lEditor.cleanSession('logo_styles');
					lEditor.setSession("logo_styles", JSON.stringify(json.data.styles));
					obj.getUserSelectedDesignStyles(json.data.styles);
				}
			}).fail(function (jqXHR, exception) {
			}).error(function (jqXHR, exception) {
			}).always(function () {
			});
		}
		obj.flushDesignStyleLogic = function () {
			lEditor.logoStyleImgTemplateIdList = [];
			lEditor.logoStyleImgTemplateCodeList = [];
			lEditor.logoStyleImgUniqTemplateCodeList = [];
			lEditor.logoStyleImgTemplateIdRepeatList = {};
			lEditor.logoStyleImgBgSchemaTypeRepeatList = {};
		}
		obj.isDesignStyleLogicRun = function () {
			let _b = false;
			var selectedDesignStyles = dh_editor_utility.getValidJsonParseObj(obj.getSession('sampleImage'));
			if (designStyleLogic && selectedDesignStyles && lEditor.logoStyleImgTemplateCodeList && (loadMoreStart <= maxLoadMoreForDesignLogic)) {
				_b = true;
			}
			return _b;
		}
		return obj;
	})();
	/**
	 * load the recent colors on the basis of user previous selections
	 */
	function loadRecentColors() {
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'GET',
			data: { action: 'recent_colors' },
			dataType: "json",
			success: function (res) {
				if (res.status == 1) {
					recentColors = res.data;
					refreshRecentColorBox();
				}
			}
		});
	}
	/**
	 * save recent colors as user selects any color
	 * @param {*} color 
	 */
	function saveRecentColor(color) {
		$.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'GET',
			data: { action: 'save_recent_colors', color: color },
			dataType: "json"
		});
	}
	/* editor bottom strip js */
	$('.getCurrentLogo').click(function (e) {
		e.stopImmediatePropagation();
		if ($(this).parents('.currentLogoContainer').hasClass('active')) {
			return;
		} else {
			$('.logoTab').removeClass('active');
			$('[data-tab=".currentLogoTab"]').addClass('active');
			$('.logosTabBox').removeClass('tabActive');
			$('.currentLogoTab').addClass('tabActive');
		}
		$('body,html').css({ "overflow": "hidden", "height": "100%" });
		$(this).removeClass('getCurrentLogo');
		$('.currentLogoContainer').addClass('active');
		$('.closeCurrentLogo, .expandLogo').show();

		var returnObj = logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate);
		$('.innerlogo').html('<div class="svg--slide" style="background-color:' + lEditor.currentLogo.generate.bgColor + '; "><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit setCurrentLogoDiv"><span>Update to this</span></a></div><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj + '<div class="bgOutlineBox bg-outline-box"></div></div></div>');
		dh_utility_common.changeBg();
	});
	$('body').on('click', '.currentLogoContainer.active, .closeCurrentLogo, .expandLogo', function (e) {
		if ((!$(e.target).closest('.logosTabBox').length)) {
			$('body,html').css({ "overflow": "auto", "height": "auto" });
			$('.logoBottomDiv').addClass('getCurrentLogo');
			$(this).removeClass('active');
			$('.logosTabBox').removeClass('tabActive');
			$('.logoTab').removeClass('active');
			$('.logoTab:first').addClass('active');
			$('.closeCurrentLogo, .expandLogo').hide();
			$('.innerlogo').html('');
		}
	});
	$('.logoTab').click(function (e) {
		e.stopImmediatePropagation();
		var dataTarget = $(this).data('tab');
		if (dataTarget == ".shareTab") {
			$('.shareButton').trigger('click');
			return false;
		}

		if (dataTarget == ".savedLogoTab") {
			savedPagination = 0;
			$('.savedLogo').html('');
			getSavedLogoListing();
		}
		if (dataTarget == ".favoriteLogoTab") {
			favoritePagination = 0;
			$('.favoriteLogo').html('');
			getFavoriteLogoListing();
		}
		$('body,html').css({ "overflow": "hidden", "height": "100%" });
		$('.currentLogoContainer').addClass('active');
		$('.logoTab').removeClass('active');
		$(this).addClass('active');
		$('.closeCurrentLogo, .expandLogo').show();
		$('.logosTabBox').removeClass('tabActive');
		$(dataTarget).addClass('tabActive');
		var returnObj = logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate);
		$('.innerlogo').html('<div class="svg--slide" style="background-color:' + lEditor.currentLogo.generate.bgColor + '; "><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit setCurrentLogoDiv"><span>Update to this</span></a></div><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj + '<div class="bgOutlineBox bg-outline-box"></div></div></div>');
		dh_utility_common.changeBg();
	});

	$('.currentLogoContainer').on('click', '.setCurrentLogoDiv', function () {
		$('.currentLogoContainer').removeClass('active');
		$('.logoTab').removeClass('active');
		$('.logosTabBox').removeClass('tabActive');
		$('.menu_1 ul li').removeClass('active');
		$('.logoTab:first-child').addClass('active');
		$('.commonEditSection').addClass('hidden');
		lEditor.setSession('targetlink', 2);
		lEditor.setSession('defaultlink', 7);
		lEditor.setSession('parentlink', 'undefined');
		$('body').removeAttr('style');
		$('.closeCurrentLogo, .expandLogo').hide();
		lEditor.editLogoSteps();
		$('body,html').css({ "overflow": "auto", "height": "auto" });
	});

	$('.containerSection a.subMenu-42').click(function (e) {
		$(this).parent('li').removeClass('active');
		$(this).parent('li').addClass('hidden');
		$('.cancelFrameContainer').parent('li').removeClass('hidden');
		$(".containerOptions").addClass('active');
		$('.containerFrameSlider').removeClass('hidden');

	});
	/**
	 * for checking frame available or not and set menu accordingly
	 * @param {*} p_nGetLink 
	 */
	function checkFrame(p_nGetLink) {
		var currLogo = lEditor.currentLogo;
		var isFrame = currLogo.generate.templatePath.isFrame;
		if (isFrame == 0) {
			+
				$('.subMenu-23, .subMenu-42').parent('li').addClass('hidden');
			$('.subMenu-24').text('Add Outer Container');
			$('.containerFrameSlider').addClass('hidden');
			$(".containerOptions").addClass('active');
			$('.cancelFrameContainer').parent('li').addClass('hidden');
			$('.subMenu-42').parents('ul').removeClass('flex');

		} else {
			$('.subMenu-24').text('Edit Outer Container');
			$('.containerFrameSlider').removeClass('hidden');

			$('.cancelFrameContainer').parent('li').addClass('hidden');
			$('.subMenu-42').parents('ul').addClass('flex');

			if ($(".containerOptions").hasClass('active')) {
				$('.subMenu-42').parent('li').addClass('hidden');
				$('.containerFrameSlider').addClass('hidden');
				$('.cancelFrameContainer').parent('li').removeClass('hidden');
				$('.subMenu-42').parents('ul').removeClass('flex');
			}
			$('.frameSizeSlider').removeClass('disabled');

			if (p_nGetLink === 42) {
				$('.subMenu-23, .subMenu-42').parent('li').addClass('hidden');
			} else {
				$('.subMenu-23, .subMenu-42').parent('li').removeClass('hidden');
			}

		}

	}
	/**
	 * 
	 * @param {*} getLink 
	 */
	function showEditOuterContainer(getLink) {
		var isFrame = lEditor.currentLogo.generate.templatePath.isFrame;
		if (isFrame == 0) {
			$('.subMenu-23').parent('li').addClass('hidden');
			$('.subMenu-42').parent('li').addClass('hidden');
			$('.subMenu-42').parents('ul').removeClass('flex');

			$('.subMenu-24').text('Add Outer Container');

			$(".containerOptions").addClass('active');

			$('.cancelFrameContainer').parent('li').removeClass('hidden');

			$('.containerFrameSlider').addClass('hidden');

		} else {
			if (getLink == 42) {
				$('.subMenu-23').parent('li').addClass('hidden');
				$('.subMenu-42').parent('li').addClass('hidden');
				$('.subMenu-42').parents('ul').removeClass('flex');
				$(".containerOptions").addClass('active');
				$('.cancelFrameContainer').parent('li').removeClass('hidden');
				$('.containerFrameSlider').addClass('hidden');

			} else {
				$('.subMenu-23').parent('li').removeClass('hidden');
				$('.subMenu-42').parent('li').removeClass('hidden');
				$('.subMenu-42').parents('ul').addClass('flex');

				$('.subMenu-24').text('Edit Outer Container');

				$(".containerOptions").removeClass('active');

				$('.cancelFrameContainer').parent('li').addClass('hidden');

				$('.containerFrameSlider').removeClass('hidden');
			}

		}
	}
	$('.containerSection a.subMenu-44').click(function (e) {
		$(this).parent('li').removeClass('active');
		$(this).parent('li').addClass('hidden');
		$('.cancelIconFrameContainer').parent('li').removeClass('hidden');
		$(".innerContainerOptions").addClass('active');
	});
	/**
	 * 
	 * @param {*} getLink 
	 */
	function showEditInnerContainer(getLink) {
		var isIconFrame = lEditor.currentLogo.generate.templatePath.isIconFrame;
		if (isIconFrame == 0) {
			$('.subMenu-40').text('Add Inner Container');

			$('.subMenu-41').parent('li').addClass('hidden');
			$('.subMenu-44').parent('li').addClass('hidden');

			$(".innerContainerOptions").addClass('active');

			$('.cancelIconFrameContainer').parent('li').removeClass('hidden');
		} else {
			if (getLink === 44) {
				$('.subMenu-41').parent('li').addClass('hidden');
				$('.subMenu-44').parent('li').addClass('hidden');

				$(".innerContainerOptions").addClass('active');

				$('.cancelIconFrameContainer').parent('li').removeClass('hidden');

			} else {
				$('.subMenu-40').text('Edit Inner Container');

				$('.subMenu-41').parent('li').removeClass('hidden');
				$('.subMenu-44').parent('li').removeClass('hidden');

				$(".innerContainerOptions").removeClass('active');

				$('.cancelIconFrameContainer').parent('li').addClass('hidden');
			}
		}
	}
	/**
	 * for checking icon frame available or not and set menu accordingly
	 */
	function checkIconFrame() {
		var currLogo = lEditor.currentLogo;
		var isIconFrame = currLogo.generate.templatePath.isIconFrame;

		if (isIconFrame == 0) {
			$('.subMenu-41, .subMenu-44').parent('li').addClass('hidden');
			$('.subMenu-40').text('Add Inner Container');
			$('.containerInnerFrameSlider').addClass('hidden');
			$(".innerContainerOptions").addClass('active');
			$('.cancelIconFrameContainer').parent('li').addClass('hidden');

		} else {
			$('.subMenu-40').text('Edit Inner Container');
			$('.containerInnerFrameSlider').removeClass('hidden');
			$('.subMenu-41, .subMenu-44').parent('li').removeClass('hidden');
			$('.cancelIconFrameContainer').parent('li').addClass('hidden');
			if ($(".innerContainerOptions").hasClass('active')) {
				$('.subMenu-44').parent('li').addClass('hidden');
				$('.containerInnerFrameSlider').addClass('hidden');
				$('.cancelIconFrameContainer').parent('li').removeClass('hidden');
				$('.subMenu-41').parent('li').addClass('hidden');
			}
			$('.frameSizeSlider').removeClass('disabled');


		}

	}
	$('.top-menu-click li a').on("mousedown", function (e) {
		lEditor.setSession('lastTargetlink', lEditor.getSession("targetlink"));
		lEditor.setSession('lastParentlink', lEditor.getSession("parentlink"));
		hideAllPopover();
	});


	$('.top-menu-click li a').click(function (e) {
		e.stopImmediatePropagation();

		var targetLink = $(this).data('target');
		var parentLink = $(this).data('parent');
		var dataType = $(this).data('type');

		lEditor.setSession('targetlink', targetLink);
		lEditor.setSession('parentlink', parentLink);
		lEditor.setSession('colorDataType', dataType);

		lEditor.showNav($(this));
		var defaultKeys = { 1: 1, 2: 7, 3: 12, 4: 17, 5: 0, 6: 0, 11: 0 };
		if (typeof lEditor.currentLogo.generate.templatePath.isMono != 'undefiend' && lEditor.currentLogo.generate.templatePath.isMono != null && lEditor.currentLogo.generate.templatePath.isMono == 1) {
			defaultKeys[5] = 32;
		}
		if (typeof lEditor.currentLogo.generate.templatePath.isIcon != 'undefiend' && lEditor.currentLogo.generate.templatePath.isIcon != null && lEditor.currentLogo.generate.templatePath.isIcon == 1) {
			defaultKeys[5] = 31;
		}
		lEditor.setSession('defaultlink', defaultKeys[targetLink]);
		lEditor.editLogoSteps();

	});
	// for edit monogram 
	$('.editMonogram').on('click', function () {
		var editMonogramInputText = $('.editMonogramText').val();
		lastMonogramText = lEditor.getMonogramText(true);
		if (editMonogramInputText === "") {
			var logoText = lEditor.getSession('logoname');
			var MadeMonoGram = logoMakerFunction.genMonoGramText(logoText);
			$('.editMonogramText').val(MadeMonoGram);
			var sessionMonogGram = lEditor.getSession("monogram");
			if ((MadeMonoGram === sessionMonogGram) && sessionMonogGram) {
				return;
			}
		} else if (editMonogramInputText === lastMonogramText) {
			console.log("already displayed " + editMonogramInputText);
			return;
		}
		loadMoreStart = 0;
		// lEditor.setMonogramText($('.editMonogramText').val());
		lEditor.getMonogramVariations($('.editMonogramText').val());
	});
	// function called on onload	
	if (lEditor.getSession("edit_from") && lEditor.getSession("edit_from") == "favorite" || lEditor.getSession("edit_from") == "saved" || lEditor.getSession("edit_from") == "purchased") {
		console.log("coming from " + lEditor.getSession("edit_from"));
	} else {
		lEditor.showStep();
	}

	/**
	 * for edit monogram 
	 */
	$('.icons-selection-container').on('click', '.iconsHint', function () {
		//Added for version 2
		if ($(this).hasClass('browse_cat_slug')) {
			$('.iconsHint:not(.recommend_tag)').removeClass('hidden');
			$(this).hide();
			return;
		}
		$(".step_5_holder_mid .showIconsDiv").scrollTop(0);
		$('.icons-search-bar .error-text').hide();
		var slug = $(this).data('slug');
		var text = $(this).text();
		if (text.toLowerCase() == 'recommended') {
			text = slug.charAt(0).toUpperCase() + slug.slice(1);
		}
		$('#tags').val(text);
		lEditor.objIconPage = 1;
		lEditor.iconSerachPageIndex = 1;
		lEditor.objIconSearch = slug;
		// lEditor.setSession('iconValue', slug);
		$(".step_5_holder_mid").css("pointer-events", 'none');
		$(".step_6 .symbolContainer").css("pointer-events", 'none');
		lEditor.ajaxIconsResponse(slug, lEditor.objIconPage);
	});

	$('body').on('click', '.startIcoTab', function (e) {
		var target = $(e.target);
		var slug = $(this).data('tag');
		var searchBtn = target.closest('.step-holder').find('.logo-search-form .searchIcon');

		$('.icons-search-bar .error-text').hide();
		$('.startIcoTab').addClass('disabled');
		$('#tags').addClass('active');
		$('#tags').focus().click().val(slug);
		lEditor.objIconSearch = "";

		searchBtn.trigger('click');
	});
	$('#tags').on('input', function () {
		if ($(this).val() == '' || $(this).val() == null) {
			$(this).removeClass('active');
		}
	});
	$(".step_5_extra #symbol_keyword_text").tagsinput({
		maxTags: 5
	});
	/**
	 * 
	 */
	$(".step_5_extra #symbol_keyword_text").on('itemAdded', function (event) {
		search_symbol_list.push(event.item)
		$('.btnSkip').addClass('hidden');
		$('.getStarted').removeClass('hidden');
		if (search_symbol_list.length === 5) {
			$(".step_5_extra .symbol_keyword .change-input-placeholder").attr('placeholder', '');
		}
	});
	/**
	 * 
	 */
	$(".step_5_extra #symbol_keyword_text").on('itemRemoved', function (event) {
		if (search_symbol_list && search_symbol_list.length > 0) {
			const index = search_symbol_list.indexOf(event.item);
			if (index > -1) {
				search_symbol_list.splice(index, 1);
			}
			if (search_symbol_list.length === 0) {
				$('.btnSkip').removeClass('hidden');
				$('.getStarted').addClass('hidden');
			} else {
			}
			if (search_symbol_list.length < 5) {
				let changeInpPlaceHolder = $(".step_5_extra .symbol_keyword .change-input-placeholder");
				if (changeInpPlaceHolder.attr('placeholder') == "") {
					changeInpPlaceHolder.attr('placeholder', $(".step_5_extra #symbol_keyword_text").attr('placeholder'));
				}
			}
		}
	});

	$(".step_5_extra .pick_own_symbol span").on('click', function () {
		var sampleArr = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('sampleIcon'));
		if (sampleArr && sampleArr.si && sampleArr.si.length > 0) {
			$('.btnSkip').addClass('hidden');
			$('.getStarted').removeClass('hidden');
		} else {
			$('.btnSkip').removeClass('hidden');
			$('.getStarted').addClass('hidden');
		}
		$(".step_5_extra").addClass("hidden");
		$(".step_5_holder_top, .step_5_holder_mid").removeClass("hidden");
		lEditor.setSession('symbol_part', "2");
	});

	$(".step_5_holder_top .pick_symbol_for_me span").on('click', function () {
		if (search_symbol_list.length > 0) {
			$('.btnSkip').addClass('hidden');
			$('.getStarted').removeClass('hidden');
		} else {
			$('.btnSkip').removeClass('hidden');
			$('.getStarted').addClass('hidden');
		}
		$(".step_5_extra").removeClass("hidden");
		$(".step_5_holder_top, .step_5_holder_mid").addClass("hidden");
		lEditor.setSession('symbol_part', "1");
	});

	$('body').on('click', '.hintIcoTab', function (e) {
		var target = $(e.target);
		var slug = $(this).data('tag');
		if ($(window).width() < 991) {
			var searchBtn = target.closest('.mobile-selection').find('.logo-search-form .searchIcon');
			$('#mobile-icontags').addClass('active');
			$('#mobile-icontags').focus().click().val(slug);
		}
		else {
			var searchBtn = target.closest('.edit-strip').find('.logo-search-form .searchIcon');

			$('#icontags').addClass('active');
			$('#icontags').focus().click().val(slug);
		}
		$(this).addClass('active');
		$(this).parent().siblings().find('.hintIcoTab').removeClass('active');
		$(this).parent().siblings().removeClass('active');
		lEditor.objIconSearch = "";
		searchBtn.trigger('click');
	});

	$('body').on('click', '#symbol_only', function (e) {
		lEditor.unCheckMonoCheckBox();
		$('.step_6 .load-more-anim').addClass('fixed');
		$('.step_6 .load-more-anim .loadMoreGenerate').addClass('animate');
	});
	$('body').on('click', '#monogram_only', function (e) {
		lEditor.unCheckIconCheckBox();
		$('.step_6 .load-more-anim').addClass('fixed');
		$('.step_6 .load-more-anim .loadMoreGenerate').addClass('animate');
	});
	$('#icontags, #mobile-icontags').on('input', function () {
		if ($(this).val() == '' || $(this).val() == null) {
			$(this).removeClass('active');
		}
	});

	$('.brickImage').click(function () {
		$(this).addClass('hidden');
		$('.flipIconTag').removeClass('hidden');
		$('.startIcoTab').removeClass('disabled');
		$('.iconsContainerBox').addClass('hidden');
		$('.startIcoSection').removeClass('hidden');
		$('.iconsImages').remove();
		$('#tags').removeClass('active');
		$('#tags').val('');
	});

	$('body').on('click', '.searchIcon', function (e) {
		e.stopPropagation();


		$(".step_5_holder_mid .showIconsDiv").scrollTop(0);
		var target = $(e.target);
		var input = target.closest('.logo-search-form').find('input');
		lEditor.objIconSearch = "";
		lEditor.objIconPage = 1;
		lEditor.iconSerachPageIndex = 1;
		var iconValue = dh_editor_utility.removeMultipleSpaces($(input).val());
		if (iconValue == '') {
			$('.step_5 .error-text').html("Symbol name is required.");
			$('.step_5 .error-text').show();
			if (lEditor.currentStep == 6) {
				$(".step_6 .iconsParentDiv").html('');
				$(".step_6 .iconsParentDiv").removeAttr('slug');
				lEditor.currentIconSearchName = "";
				$(".step_6 .symbolContainer .icons-selection-container .bricks .hintIcoTab").removeClass('active');
			}
			$('.iconBlank').removeClass('hidden').text(forSearchSymbol);
			return;
		}
		let iconValueWithNoSpace = iconValue.split(/\s/).join('');
		if (iconValueWithNoSpace.length < 2) {
			$('.step_6 .error-text').html("min 2 character required");
			$('.step_6 .error-text').show();
			$('.iconBlank').removeClass('hidden').text('min 2 character required');
			if (lEditor.currentStep == 6) {
				$(".step_6 .iconsParentDiv").html('');
				$(".step_6 .iconsParentDiv").removeAttr('slug');
				lEditor.currentIconSearchName = "";
				$(".step_6 .symbolContainer .icons-selection-container .bricks .hintIcoTab").removeClass('active');
			}
			return;
		}
		if (lEditor.currentIconSearchName && iconValue && lEditor.currentIconSearchName.toLowerCase() === iconValue.toLowerCase()) {
			return;
		}
		if (lEditor.currentStep == 5) {
			if ($(".step-holder-mid .iconsParentDiv").attr("slug") && $(".step-holder-mid .iconsParentDiv").attr("slug").toLowerCase() === iconValue.toLowerCase()) {
				console.log(iconValue + " keyword related icons already displayed");
				return;
			}
		}
		if (lEditor.currentStep == 6) {
			if ($(".step_6 .iconsParentDiv").attr("slug") && $(".step_6 .iconsParentDiv").attr("slug").toLowerCase() === iconValue.toLowerCase()) {
				console.log(iconValue + " keyword related icons already displayed");
				return;
			}
		}
		lEditor.iconsData(target);
	});


	$('body').on('click', '.editSearchButton', function (e) {
		onSymbolSearchClick();
	});

	function onSymbolSearchClick() {
		var iconInputTextVal = dh_editor_utility.removeMultipleSpaces($('.editTags').val());

		let iconValueWithNoSpace = iconInputTextVal.split(/\s/).join('');
		if (iconValueWithNoSpace.length < 3 && iconInputTextVal.length) {
			$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">min 3 character required</div>');
			return;
		}

		if ($('.finalogoSlider').children().length > 0 && $(".logos--boxes").length > 0 && $(".owl-carousel").length === 0 && (iconInputTextVal != "" && (iconInputTextVal == dh_editor_utility.removeMultipleSpaces($('.editTags').attr("lastSearchIcon"))))) {
			dh_editor_utility.forceConsoleAtStaging("no need to search icon " + iconInputTextVal + "! it's already displaying");
			return;
		}
		var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var lastSearchIcon = "";

		if (currLogo.generate.iconName && currLogo.generate.iconName != "") {
			lastSearchIcon = currLogo.generate.iconName;
			if (iconInputTextVal === "") {
				$('.editTags').val(lastSearchIcon);
			} else {
				lastSearchIcon = iconInputTextVal;
			}
		} else {
			lastSearchIcon = dh_editor_utility.removeMultipleSpaces($('.editTags').val());
		}

		if (lastSearchIcon == "" && iconInputTextVal == "") {
			if ($('.iconBlank').length) {
				$('.iconBlank').text(forSearchSymbol);
			} else {
				$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + forSearchSymbol + '</div>');
			}
			$('.editTags').val("");
			return;
		}
		if ($('.iconBlank').length) {
			$('.iconBlank').text(whileSearchingSymbol);
		} else {
			$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + whileSearchingSymbol + '</div>');
		}
		$('.icons-search-box, .icons-search-box-button').css("pointer-events", "none");
		lEditor.step7SearchIconPage = 1;
		loadMoreStart = 0;
		lEditor.editIconsData();
	}
	$('.tags').keyup(function (e) {
		if ($('.tags').val() != '') {
			$('.error-text').hide();
		}
	});

	$('body').on('click', '.iconContainerBoxes', function (e) {
		if ($(this).children().length === 0) {
			return;
		}
		lEditor.removeSelectedIcon($(this).index());
		lEditor.addSelectedIcon("click");
		$('.step_6 .load-more-anim').addClass('fixed');
		$('.step_6 .load-more-anim .loadMoreGenerate').addClass('animate');
		$('.ste-6-strip-apply').addClass('active');
		if (!$('.step_6 .symbol-container .iconContainerBoxes img').length) {
			lEditor.showIconCheckBox(false);
		}
	});

	$('body').on('click', '.iconEditContainerBoxes', function (e) {
		lEditor.removeSelectedIcon($(this).index());
		lEditor.addSelectedIcon("click");
	});
	$('body').on('click', '.iconsImages', function (e) {
		var iconName = $(this).data();
		let returnVal = lEditor.selectedIcons(iconName);
		if (!returnVal) {
			lEditor.addSelectedIcon("click");
			return;
		} else {
			$(this).addClass('active');
			lEditor.addSelectedIcon("click");
		}
		$('.step_6 .load-more-anim').addClass('fixed');
		$('.step_6 .load-more-anim .loadMoreGenerate').addClass('animate');
		$('.ste-6-strip-apply').addClass('active')
	});

	$('body').on('click', '.loadMoreIconsV2', function (e) {
		var target = $(e.target);
		if (typeof lEditor.getSession('currPage') != 'undefined' && lEditor.getSession('currPage') == '5') {
			if ($('.iconsParentDiv .iconsImages.hidden').length) {
				$('.iconsParentDiv .iconsImages').removeClass('hidden');
				if ($(this).data('more-icons') == '0') {
					$(this).addClass('hidden');
				}
			}
			else {
				$('.showIconsDiv .loadMoreIconsV2').html('<div class="text-center"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></div>');
				lEditor.iconsData(target);
			}
		}

	});
	$('.step_6').on('click', '.logo-bottom-strip .bottom-right .common-btn.btn-edit', function (e) {
		var numId = parseInt($(".step6-preview-section").find('.finaLogoInner').attr("currentid"));
		if (version === "vd2" || version == "vd4") {
			let swiperIndex = parseInt($(".step6-preview-section").find('.finaLogoInner').attr("swiper_currentid"));
			afterLoginEditLogoFromStep6(numId, "edit", 0, swiperIndex);
		} else {
			afterLoginEditLogoFromStep6(numId, "edit", 0);
		}

	});
	$('.step_6').on('click', '.logo-bottom-strip .bottom-right .common-btn.btn-buy', function (e) {
		jumpOnBuyFromStep6(null, null);
	});
	function higlightLogoSlides(p_bFirstTimeLoad, p_oThis) {
		if (p_bFirstTimeLoad) {
			step6SelectedLogoSlides = $(".step6-left-section").find(".step6-logo-section").find(".logo--slides").first();
		} else {
			step6SelectedLogoSlides = p_oThis.closest(".logo--slides");
		}
		step6SelectedLogoSlides.addClass("logo-selected");
	}
	//Current Logo Data JS Start
	$('.step_6').on('click', '.iconEdit .preview--btn', function (e) {
		var numId = parseInt($(this).parents('.logo--slides').find('.iconEdit').data('id'));
		let swiperIndex = +($(this).parents('.logo--slides').find('.iconEdit').data('swiper-index'));
		if (version === "vd2" || version == "vd4") {
			//
			if ((parseInt($(".step6-preview-section").find('.finaLogoInner').attr("currentid")) == numId) && (parseInt($(".step6-preview-section").find('.finaLogoInner').attr("swiper_currentid")) == swiperIndex)) {
				console.log("same id click in swiper case");
				return;
			}
		} else {
			if (parseInt($(".step6-preview-section").find('.finaLogoInner').attr("currentid")) == numId) {
				console.log("same id click");
				return;
			}
		}

		$(".step6-whole-section").css("pointer-events", "none");
		if (step6SelectedLogoSlides) {
			step6SelectedLogoSlides.removeClass("logo-selected");
			step6SelectedLogoSlides = null;
		}
		higlightLogoSlides(false, $(this));
		if (version === "vd2" || version == "vd4") {
			previewLogoAtStep6(numId, false, swiperIndex);
		} else {
			previewLogoAtStep6(numId, false);
		}

	});
	/**
	 * 
	 */
	function initPopOver() {
		$('.btnNewPopover').on('shown.bs.popover', function () {
			$(this).addClass('popover-open');
			var show_popup_for = $(this).find('span').attr("show_popup_for");
			switch (show_popup_for) {
				case "edit_text":
					var line1Div = $(".dd-ct-line1.templateText");
					line1Div.on('blur', onLinesTextBlur);
					line1Div.on('input', onLinesTextInput);
					line1Div.on('keydown', onLinesTextKeyDown);
					line1Div.val(lEditor.currentLogo.logoName1);

					var line2Div = $(".dd-ct-line2.templateText");
					line2Div.on('blur', onLinesTextBlur);
					line2Div.on('input', onLinesTextInput);
					line2Div.on('keydown', onLinesTextKeyDown);
					line2Div.val(lEditor.currentLogo.logoName2);

					$('.lines-font-case').on("click", onLinesTextFontCase);

					if (lEditor.getSession('isEditable') == 1) {
						line1Div.attr('disabled', true);
						line2Div.attr('disabled', true);
						line1Div.css("background-color", "#d3d3d3");
						line2Div.css("background-color", "#d3d3d3");

					}
					break;
				case "edit_fs":
					setupLinesFSSlider();
					break;
				case "edit_ls":
					setupLinesLSSlider();
					break;
				case "change_font":
					setupFontChangeDropDown();
					break;
				case "change_color":
					setupColorChangeDropDown();
					break;
			}

			$("body").on("click", '.btnPopCancel', function () {
				hideAllPopover();
			});
		});
		// when popover's content is hidden
		$('.btnNewPopover').on('hide.bs.popover', function () {
			$(this).removeClass('popover-open');
			var show_popup_for = $(this).find('span').attr("show_popup_for");
			switch (show_popup_for) {
				case "edit_text":
					var line1Div = $(".dd-ct-line1.templateText");
					line1Div.on('blur');
					line1Div.on('input');
					line1Div.on('keydown');
					var line2Div = $(".dd-ct-line2.templateText");
					line2Div.on('blur');
					line2Div.on('input');
					line2Div.on('keydown');
					$('.lines-font-case').off("click");
					break;
				case "edit_fs":
					break;
				case "edit_ls":
					break;
				case "change_font":
					$('.dd-change-font-btn').off("click");
					break;
				case "change_color":
					$('.dd-change-color-btn').off("click");
					break;
			}
			$(".btnPopCancel").off("click");
			clearTimeout(inputTextTimer);
		});
	}
	initPopOver();
	/**
	 * 
	 */
	function hideAllPopover() {
		if ($('#edit_the_lines_text_dd').length && ($('#edit_the_lines_text_dd').attr("pop_over_shown") === "true")) {
			$('#edit_the_lines_text_dd').popover('hide');
			$('#edit_the_lines_text_dd').attr('pop_over_shown', 'false');
		}

		if ($('#edit_the_lines_fs_dd').length && ($('#edit_the_lines_fs_dd').attr("pop_over_shown") === "true")) {
			$('#edit_the_lines_fs_dd').popover('hide');
			$('#edit_the_lines_fs_dd').attr('pop_over_shown', 'false');
		}


		if ($('#edit_the_lines_ls_dd').length && ($('#edit_the_lines_ls_dd').attr("pop_over_shown") === "true")) {
			$('#edit_the_lines_ls_dd').popover('hide');
			$('#edit_the_lines_ls_dd').attr('pop_over_shown', 'false');
		}

		if ($('#edit_the_lines_font_change_dd').length && ($('#edit_the_lines_font_change_dd').attr("pop_over_shown") === "true")) {
			$('#edit_the_lines_font_change_dd').popover('hide');
			$('#edit_the_lines_font_change_dd').attr('pop_over_shown', 'false');
		}

		if ($('#edit_the_lines_color_change_dd').length && ($('#edit_the_lines_color_change_dd').attr("pop_over_shown") === "true")) {
			$('#edit_the_lines_color_change_dd').popover('hide');
			$('#edit_the_lines_color_change_dd').attr('pop_over_shown', 'false');
		}
		if (currentPopoverBtn) {
			currentPopoverBtn.removeClass('off');
			currentPopoverBtn = null;
		}
		clearTimeout(inputTextTimer);
	}
	/**
	 * 
	 * @param {*} e 
	 */
	function onLinesTextBlur(e) {
		clearTimeout(inputTextTimer);
	}
	/**
	 * 
	 */
	function onLinesTextKeyDown() {
		clearTimeout(inputTextTimer);
		var workFor = $(this).attr("work-for");
		var lastText = "";
		var currentText = "";
		switch (workFor) {
			case "dd-ct-line1":
				type = "logoName1";
				lastText = dh_editor_utility.removeMultipleSpaces(lEditor.currentLogo.logoName1);
				break;
			case "dd-ct-line2":
				type = "logoName2";
				lastText = dh_editor_utility.removeMultipleSpaces(lEditor.currentLogo.logoName2);
				break;
		}
		inputTextTimer = setTimeout(function () {
			currentText = dh_editor_utility.removeMultipleSpaces($("." + workFor + ".templateText").val());
			if (currentText === lastText) {
				console.log("no need logo name1 or name2");
				return;
			}
			onLogoNameTextInput(type);
		}, inputTextTime)
	}
	/**
	 * 
	 */
	function onLinesTextInput() {
		var type = "";
		var workFor = $(this).attr("work-for");
		switch (workFor) {
			case "dd-ct-line1":
				type = "logoName1";
				if (dh_editor_utility.removeMultipleSpaces($(this).val()) === dh_editor_utility.removeMultipleSpaces(lEditor.currentLogo.logoName1)) {
					console.log("no need logo name1");
					return;
				}
				break;
			case "dd-ct-line2":
				type = "logoName2";
				if (dh_editor_utility.removeMultipleSpaces($(this).val()) === dh_editor_utility.removeMultipleSpaces(lEditor.currentLogo.logoName2)) {
					console.log("no need logo name2");
					return;
				}
		}
		updateTextOnInput(type);
	}
	/**
	 * 
	 * @param {*} e 
	 */
	function onLinesTextFontCase(e) {
		e.stopImmediatePropagation();
		var textCase = $(this).text();
		textCase = textCase.toLowerCase();
		var workFor = $(this).attr("work-for");
		var originalUpdateText = "";
		var updateText = "";
		switch (workFor) {
			case "dd-ct-line1":
				originalUpdateText = $('.dd-ct-line1.templateText').val();
				break;
			case "dd-ct-line2":
				originalUpdateText = $('.dd-ct-line2.templateText').val();
				break;
		}
		updateText = originalUpdateText;
		switch (textCase) {
			case 'caps':
				updateText = toCapitalize(updateText.toLowerCase());
				break;
			case 'up':
				updateText = updateText.toUpperCase();
				break;
			case 'low':
				updateText = updateText.toLowerCase();
				break;
		}
		if (originalUpdateText === updateText) {
			console.log("no need to convert logo");
			return;
		}
		if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
			lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
		}
		var logoTextFS = lEditor.currentLogo.generate.logoTextSlider;
		var logoTextLS = lEditor.currentLogo.generate.logoLetterSpacing;

		switch (workFor) {
			case "dd-ct-line1":
				if (lEditor.currentLogo.generate.logoText1Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText1Slider;
				}
				if (lEditor.currentLogo.generate.logoText1LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText1LetterSpacing;
				}
				updateLogoText("logoName1", textCase, logoTextFS, logoTextLS, 'layout');
				break;
			case "dd-ct-line2":
				if (lEditor.currentLogo.generate.logoText2Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText2Slider;
				}
				if (lEditor.currentLogo.generate.logoText2LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText2LetterSpacing;
				}
				updateLogoText("logoName2", textCase, logoTextFS, logoTextLS, 'layout');
				break;
		}
	}
	/**
	 * 
	 */
	function setupLinesFSSlider() {
		var overallTextFS = parseFloat(lEditor.currentLogo.generate.logoTextSlider);
		$('.logoOverallLinesFSSlider').slider({
			value: overallTextFS,
			min: 10,
			max: 100,
			stop: function (event, ui) {
				if ($('.logoOverallLinesFSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT_FS, editorUndoRedo.ltsOldLogoObj, editorUndoRedo.ltsNewLogoObj);
				}
				$('.logoOverallLinesFSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.ltsOldLogoObj = null;
				editorUndoRedo.ltsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoOverallLinesFSSlider').attr("sliding", "yes");
				onTextFontSizeSlide($(this), ui.value);
			}
		});
		updateLinesFSSlider("logoOverallLinesFSSlider", overallTextFS);
		//------------------------------------------------------------
		var line1TextFS = (lEditor.currentLogo.generate.logoText1Slider) ? parseFloat(lEditor.currentLogo.generate.logoText1Slider) : overallTextFS;
		$('.logoLine1FSSlider').slider({
			value: line1TextFS,
			min: 10,
			max: 100,
			stop: function (event, ui) {
				if ($('.logoLine1FSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT1_FS, editorUndoRedo.ltsOldLogoObj, editorUndoRedo.ltsNewLogoObj);
				}
				$('.logoLine1FSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.ltsOldLogoObj = null;
				editorUndoRedo.ltsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoLine1FSSlider').attr("sliding", "yes");
				onTextFontSizeSlide($(this), ui.value);
			}
		});
		updateLinesFSSlider("logoLine1FSSlider", line1TextFS);
		//---------------------------------------------------
		var line2TextFS = (lEditor.currentLogo.generate.logoText2Slider) ? parseFloat(lEditor.currentLogo.generate.logoText2Slider) : overallTextFS;
		$('.logoLine2FSSlider').slider({
			value: line2TextFS,
			min: 10,
			max: 100,
			stop: function (event, ui) {
				if ($('.logoLine2FSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT2_FS, editorUndoRedo.ltsOldLogoObj, editorUndoRedo.ltsNewLogoObj);
				}
				$('.logoLine2FSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.ltsOldLogoObj = null;
				editorUndoRedo.ltsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoLine2FSSlider').attr("sliding", "yes");
				onTextFontSizeSlide($(this), ui.value);
			}
		});
		updateLinesFSSlider("logoLine2FSSlider", line2TextFS);
	}
	/**
	 * 
	 */
	function setupLinesLSSlider() {
		var overallTextLS = parseFloat(lEditor.currentLogo.generate.logoLetterSpacing);
		$('.logoOverallLinesLSSlider').slider({
			value: overallTextLS,
			min: 1,
			step: 0.5,
			max: 10,
			stop: function (event, ui) {
				if ($('.logoOverallLinesLSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT_LS, editorUndoRedo.llsOldLogoObj, editorUndoRedo.llsNewLogoObj);
				}
				$('.logoOverallLinesLSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.llsOldLogoObj = null;
				editorUndoRedo.llsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoOverallLinesLSSlider').attr("sliding", "yes");
				onTextLetterSpacingSlide($(this), ui.value);
			}
		});
		updateLinesLSSlider("logoOverallLinesLSSlider", overallTextLS);
		var line1TextLS = parseFloat(lEditor.currentLogo.generate.logoText1LetterSpacing) ? parseFloat(lEditor.currentLogo.generate.logoText1LetterSpacing) : overallTextLS;
		$('.logoLine1LSSlider').slider({
			value: line1TextLS,
			min: 1,
			step: 0.5,
			max: 10,
			stop: function (event, ui) {
				if ($('.logoLine1LSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT1_LS, editorUndoRedo.llsOldLogoObj, editorUndoRedo.llsNewLogoObj);
				}
				$('.logoLine1LSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.llsOldLogoObj = null;
				editorUndoRedo.llsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoLine1LSSlider').attr("sliding", "yes");
				onTextLetterSpacingSlide($(this), ui.value);
			}
		});
		updateLinesLSSlider("logoLine1LSSlider", line1TextLS);

		var line2TextLS = parseFloat(lEditor.currentLogo.generate.logoText2LetterSpacing) ? parseFloat(lEditor.currentLogo.generate.logoText2LetterSpacing) : overallTextLS;

		$('.logoLine2LSSlider').slider({
			value: line2TextLS,
			min: 1,
			step: 0.5,
			max: 10,
			stop: function (event, ui) {
				if ($('.logoLine2LSSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT2_LS, editorUndoRedo.llsOldLogoObj, editorUndoRedo.llsNewLogoObj);
				}
				$('.logoLine2LSSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.llsOldLogoObj = null;
				editorUndoRedo.llsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoLine2LSSlider').attr("sliding", "yes");
				onTextLetterSpacingSlide($(this), ui.value);
			}
		});
		updateLinesLSSlider("logoLine2LSSlider", line2TextLS);
	}
	/**
	 * 
	 */
	function setupFontChangeDropDown() {
		$('.dd-change-font-overall-text').text(lEditor.currentLogo.logoName);
		$('.dd-change-font-line1-text').text(lEditor.currentLogo.logoName1);
		$('.dd-change-font-line2-text').text(lEditor.currentLogo.logoName2);
		$('.dd-change-font-btn').on("click", onLinesTextFontChange);
		var lastSelValue = $('.subChild-8').find(".company-text-font-box").attr("last_selected");
		if (lastSelValue && lastSelValue != "") {
			$(".dd-change-font-btn[work-for='" + lastSelValue + "']").addClass('active');
		} else {
			$('.dd-change-font-overall-text').addClass('active');
		}
	}
	/**
	 * 
	 * @param {*} e 
	 */
	function onLinesTextFontChange(e) {
		$(".dd-change-font-btn").removeClass("active");
		$(this).addClass('active');
		var objs = $('.textFontFamily a:first');
		$('.commonFont a').removeClass('active');
		$(objs).addClass('active');
		$('.subChild-8').find(".company-text-font-box").attr("last_selected", $(this).attr("work-for"));
		editorParameters = {};
		editorParameters.obj = objs;
		editorParameters.fors = 'logo';
		loadMoreStart = 0;
		logoByfontFamily(editorParameters);
	}
	/**
	 * 
	 */
	function setupColorChangeDropDown() {
		$('.dd-change-color-overall-text').text(lEditor.currentLogo.logoName);
		$('.dd-change-color-line1-text').text(lEditor.currentLogo.logoName1);
		$('.dd-change-color-line2-text').text(lEditor.currentLogo.logoName2);
		$('.dd-change-color-btn').on("click", onLinesTextColorChange);
		var lastSelValue = $('.subChild-13').find(".company-text-color-box").attr("last_selected");
		if (lastSelValue && lastSelValue != "") {
			$(".dd-change-color-btn[work-for='" + lastSelValue + "']").addClass('active');
		} else {
			$('.dd-change-color-overall-text').addClass('active');
		}
	}
	/**
	 * 
	 * @param {*} e 
	 */
	function onLinesTextColorChange(e) {
		$(".dd-change-color-btn").removeClass("active");
		$(this).addClass('active');
		$('.subChild-13').find(".company-text-color-box").attr("last_selected", $(this).attr("work-for"));
		switch ($(this).attr("work-for")) {
			case "dd-ct-color-line1":
			case "dd-ct-color-overall":
				editorParameters = {};
				$('.commonClrDiv a').removeClass('active');
				$(".editLogoSlider").addClass("hidden");
				$(".editFinalLogo, .previewSection").removeClass("hidden");
				updateColorPickerValue(lEditor.currentLogo.generate.mainTextColor, false, "", 0);
				$('.finalogoSlider').html('');
				break;
			case "dd-ct-color-line2":
				editorParameters = {};
				$('.commonClrDiv a').removeClass('active');
				$(".editLogoSlider").addClass("hidden");
				$(".editFinalLogo, .previewSection").removeClass("hidden");
				updateColorPickerValue(lEditor.currentLogo.generate.mainText2Color, false, "", 0);
				$('.finalogoSlider').html('');
				break;
		}
	}
	/**
	 * 
	 * @param {*} p_nNum 
	 */
	function previewLogoAtStep6(p_nNum, p_bFirstTimeLoad, p_nSwiperIndex) {
		// alert("1111")
		var currentPreviewLogo;
		if (version === "vd2" || version == "vd4") {
			currentPreviewLogo = lEditor.swiperLogoTempArr[p_nNum][p_nSwiperIndex];
		} else {
			currentPreviewLogo = lEditor.logoTempArr[p_nNum];
		}

		var html = logoMakerFunction.getFinalLogoTemplate(currentPreviewLogo.generate);
		$(".step6-preview-section").find('.finaLogoInner').html('<div class="svg--slide" style="background-color:' + currentPreviewLogo.generate.bgColor + '; "><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + html + '</div></div>');

		$(".logo-bottom-strip").find('.bottom-logo-img').html('<div class="svg--slide" style="background-color:' + currentPreviewLogo.generate.bgColor + '; "><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + html + '</div></div>');

		$(".step6-preview-section").find('.finaLogoInner').attr('currentid', p_nNum);

		if (version === "vd2" || version == "vd4") {
			$(".step6-preview-section").find('.finaLogoInner').attr('swiper_currentid', p_nSwiperIndex);
		}

		lEditor.previewColors("step6", currentPreviewLogo, $(".step6-preview-section"));
		lEditor.previewLogo("step6", currentPreviewLogo, $(".step6-preview-section"));
		if ($(".step6-preview-section").scrollTop() > 150) {
			$(".step6-preview-section").animate({
				scrollTop: 0
			}, { duration: 'fast', easing: 'linear' });
		}
		if (p_bFirstTimeLoad) {
			$(".step6-preview-section").find('.finalogo--inner-wait').addClass("hidden");
			$(".step6-preview-section").find('.finaLogoInner').removeClass("hidden");
			$(".step6-preview-section").find('.flex-container').removeClass("hidden");
			$(".logo-bottom-strip").removeClass("hidden");
			$(".preview--btn").css("pointer-events", "auto");
			$('.logo-bottom-strip .bottom-right .common-btn').removeClass("disabled");
			if ($('.bottomStripLogo').length > 0) {
				var bottomspace = $('.bottomStripLogo').height() + 15;
				$('.paddingForStrip').css('padding-bottom', bottomspace);
			}
		} else {
			$(".step6-whole-section").css("pointer-events", "auto");
		}
	}

	if (version == "v6" || version == "vd2" || version == "vd4") {
		$('.step_6').on('click', '.iconEdit .edit--btn', function (e) {
			afterLoginEditLogoFromStep6(parseInt($(this).parents('.logo--slides').find('.iconEdit').data('id')), $(this).parents('.logo--slides').find('.iconEdit').data('type'), $(this).parents('.logo--slides').find('.iconEdit').attr('data-logo-id'), (+($(this).parents('.logo--slides').find('.iconEdit').data('swiper-index'))));
		});
	} else {
		$('.step_6').on('click', '.iconEdit.edit--btn', function (e) {

			if (version === "vd1" || version === "vd3") {
				afterLoginEditLogoFromStep6(parseInt($(this).parents('.logo--slides').find('.iconEdit').data('id')), $(this).parents('.logo--slides').find('.iconEdit').data('type'), $(this).parents('.logo--slides').find('.iconEdit').attr('data-logo-id'), (+$(this).parents('.logo--slides').find('.iconEdit').data('swiper-index')));
			} else {
				afterLoginEditLogoFromStep6(parseInt($(this).parents('.logo--slides').find('.iconEdit').data('id')), $(this).parents('.logo--slides').find('.iconEdit').data('type'), $(this).parents('.logo--slides').find('.iconEdit').attr('data-logo-id'));
			}

		});
		$('.step_6').on('click', '.iconEditHitArea', function (e) {
			let that = $(this).parents('.logo--slides').find('.iconEdit.edit--btn');
			if (!that) {
				return;
			}
			if (version === "vd1" || version === "vd3") {
				afterLoginEditLogoFromStep6(parseInt(that.parents('.logo--slides').find('.iconEdit').data('id')), that.parents('.logo--slides').find('.iconEdit').data('type'), that.parents('.logo--slides').find('.iconEdit').attr('data-logo-id'), (+that.parents('.logo--slides').find('.iconEdit').data('swiper-index')));
			} else {
				afterLoginEditLogoFromStep6(parseInt(that.parents('.logo--slides').find('.iconEdit').data('id')), that.parents('.logo--slides').find('.iconEdit').data('type'), that.parents('.logo--slides').find('.iconEdit').attr('data-logo-id'));
			}
		});
		$('.step_6').on('click', '.icons-purchase', function (e) {
			let that = $(this).parents('.logo--slides').find('.iconEdit.edit--btn');
			let id = +(that.parents('.logo--slides').find('.iconEdit').data('id'));
			let swiperIndex = +(that.parents('.logo--slides').find('.iconEdit').data('swiper-index'));
			jumpOnBuyFromStep6(id, swiperIndex);
		});
	}
	/**
	 * 
	 * @param {*} p_nDataId parents
	 * @param {*} p_sDataType 
	 * @param {*} p_sDataLdogoI 
	 */
	function afterLoginEditLogoFromStep6(p_nDataId, p_sDataType, p_sDataLogoId, p_nSwiperIndex) {
		if (DH.isLogged == 0 && DH.userId == 0) {
			clearTimeout(loginPopupTimer);
			userLoginPopup(function () {
				fromStep6EditLogo(p_nDataId, p_sDataType, p_sDataLogoId, p_nSwiperIndex);
			});
		} else {
			fromStep6EditLogo(p_nDataId, p_sDataType, p_sDataLogoId, p_nSwiperIndex);
		}
	}
	/**
	 * 
	 * @param {*} p_nDataId 
	 * @param {*} p_sDataType 
	 * @param {*} p_sDataLogoId 
	 */
	function fromStep6EditLogo(p_nDataId, p_sDataType, p_sDataLogoId, p_nSwiperIndex) {
		lEditor.currentLogo = {};
		if (version === "vd1" || version === "vd2" || version === "vd3" || version === "vd4") {
			lEditor.currentLogo = lEditor.swiperLogoTempArr[p_nDataId][p_nSwiperIndex];
		} else {
			lEditor.currentLogo = lEditor.logoTempArr[p_nDataId];
		}


		lEditor.currentStep = 7;
		sessionStorage.setItem("prevPage", 7);
		if (lEditor.currentLogo.generate && lEditor.currentLogo.generate.sloganFontObject != '') {
			lEditor.currentLogo.generate.sloganFontObject = '';
		}

		lEditor.storeStep6RandomLogic();

		var dataAnalysisObj = dh_editor_utility.getDataAnalsyis(lEditor.currentLogo, true);
		lEditor.setSession('currentLogo', dh_editor_utility.getValidJsonStringifyObj(lEditor.currentLogo));
		lEditor.setSession('currPage', lEditor.currentStep);
		lEditor.setSession('coming_from', "step6_edit");

		// lEditor.setSession('edit_in_new_tab', "yes");
		var type = p_sDataType
		var curLogoId = p_sDataLogoId
		let selLogoIconId = lEditor.currentLogo["iconId"];
		if (lEditor.sampleIconArr && lEditor.sampleIconArr.length > 0) {
			for (let k = 0; k < lEditor.sampleIconArr.length; k++) {
				if (lEditor.sampleIconArr[k] && (+lEditor.sampleIconArr[k]["id"]) === (+lEditor.currentLogo["iconId"])) {
					lEditor.searchIconArr = [];
					lEditor.cleanSession('searchicon');
					lEditor.searchIconArr.push(lEditor.sampleIconArr[k]);
					lEditor.setSession('searchicon', dh_editor_utility.getValidJsonStringifyObj({ "si": lEditor.searchIconArr }));
					break;
				}
			}
		}
		var logoJSONObj = lEditor.validateJSON(lEditor.currentLogo, dataAnalysisObj);
		const curr_logo_blob = new Blob([JSON.stringify(logoJSONObj)], {
			type: "application/json;charset=utf-8"
		});
		const svg_logo_blob = new Blob([logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate, true)], { type: 'image/svg+xml' });
		dh_lm_save.saveAction(curLogoId, curr_logo_blob, svg_logo_blob, null, null, true, true, JSON.stringify(dataAnalysisObj), JSON.stringify(dh_editor_utility.createLogging("step_6 on click"))).then((p_oJSON) => {
			$('#loadere').hide();
			let json = dh_editor_utility.getValidJsonParseObj(p_oJSON);
			if (json.status == 0) {
				if (json.session === 0) {
					//location.reload(true);
					userLoginPopup(function () {
						fromStep6EditLogo(p_nDataId, p_sDataType, p_sDataLogoId);
					});
					// session timeout case
				}
			} else {
				lEditor.showStep();
				$('.step_6 .logoSlider').trigger("destroy.owl.carousel");
				$('.step_6 .owl-carousel').remove();
				lEditor.setCurrentLogoId(json.data.logo_id);
				if (type == 'purchase') {
					window.location.href = DH.baseURL + '/tools/logo-maker/payment?logoid=' + json.data.logo_id * 11 + "" + qrStr;
				} else {
					window.location.href = DH.baseURL + '/tools/logo-maker?editor=' + json.data.logo_id * 11 + "" + qrStr;
				}
				// var newUrl = DH.baseURL + '/tools/logo-maker?editor=' + json.data.logo_id * 11 + "" + qrStr;
				// window.open(newUrl, '_blank');
			}
			dh_editor_utility.clearException();
		});

	}
	//Current Logo Data JS End
	$('.flipIconTag').click(function () {
		getIconTagListing(0);
	});
	$('body').on('keypress', '#mobile-icontags', function (e) {
		const target = $(e.target);
		const key = e.which;
		const button = target.closest('.logo-search-form').find('button');

		if (key == 13) {
			button.trigger('click');
		}

	});
	$('#editLogoNameText').focus(function (e) {
		var textVal = dh_editor_utility.removeMultipleSpaces($(this).val());
		$(this).attr("lastvalue", textVal);
	});
	$('#editLogoNameText').blur(function (e) {
		$(this).attr("lastvalue", " ");
	});
	$('#editLogoNameText').on('keyup', function (e) {
		// step 6 textfiled
		var key = e.which;

		if (key == 13) {
			e.stopPropagation();
			return;
		}
		var textVal = dh_editor_utility.removeMultipleSpaces($(this).val());
		if (textVal == '') {
			$(this).val(lEditor.getSession('logoname'));
			return false;
		}
		lEditor.setSession('logoname', textVal);
		clearTimeout(editorTimer);
		editorTimer = setTimeout(function () {
			if (version == "vd1" || version == "vd2" || version == "vd3" || version == "vd4") {
				lEditor.modifiedLogoName(0, "logoname");
			} else {
				// lEditor.modifyLogoProperties("logoname");
				lEditor.newModifyLogoProperties("logoname");
			}
		}, 1500);
	});

	$('#editSloganNameText').on('keyup', function (e) {
		var key = e.which;

		if (key == 13) {
			e.stopPropagation();
			return;
		}
		var sloganText = dh_editor_utility.removeMultipleSpaces($(this).val());
		if (dh_editor_utility.removeMultipleSpaces(lEditor.getSession('sloganText')) == "" && sloganText == "") {
			$('#editSloganNameText').prop("value", "");
			return;
		}
		if (sloganText == "") {
			$('#editSloganNameText').prop("value", "");
			// return;
		}
		lEditor.setSession('sloganText', sloganText);
		clearTimeout(editorTimer);
		editorTimer = setTimeout(function () {
			if (version == "vd1" || version == "vd2" || version == "vd3" || version == "vd4") {
				lEditor.modifiedSloganName(0, "sloganText");
			} else {
				// lEditor.modifyLogoProperties("sloganText");
				lEditor.newModifyLogoProperties("sloganText");
			}
		}, 1500);
	});

	$('.color-selection.colorContainer .system-color').click(function (e) {
		const target = $(e.target);
		const colorId = $(target).attr('data-samplecolorid');
		let selectedColors = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('sampleColor'));
		const index = selectedColors.findIndex(item => item.samplecolorid == colorId);
		const colorBoxes = $('.color-selection.colorContainer .color');

		if (index > -1) {
			selectedColors.splice(index, 1);
			target.removeClass('active');
		}
		else {
			const multiColorIndex = selectedColors.findIndex(item => item.samplecolorid == -1);

			if (colorId == -1 || multiColorIndex > -1) {
				selectedColors = [{ samplecolorid: colorId }];
			}
			else {
				selectedColors.unshift({ samplecolorid: colorId });
			}
		}
		lEditor.setSession('sampleColor', dh_editor_utility.getValidJsonStringifyObj(selectedColors));


		colorBoxes.removeClass('active');
		lEditor.refreshSelectedColorBox();
		$('.step_6 .load-more-anim').addClass('fixed');
		$('.step_6 .load-more-anim .loadMoreGenerate').addClass('animate');
		$('.ste-6-strip-apply').addClass('active');
	});

	$('body').on('click', '.color-section .icons-container-box.colorContainerBoxes .delete-icon', function (e) {
		const target = $(e.target);
		const selectedColors = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('sampleColor'));
		const sampleColorId = target.closest('.colorContainerBoxes').attr('data-samplecolorid');

		if (sampleColorId) {
			const index = selectedColors.findIndex(item => item.samplecolorid == sampleColorId);
			const systemColor = $('.color-selection.colorContainer .system-color[data-samplecolorid="' + sampleColorId + '"]');

			selectedColors.splice(index, 1);
			lEditor.setSession('sampleColor', dh_editor_utility.getValidJsonStringifyObj(selectedColors));
			lEditor.refreshSelectedColorBox();
			target.removeClass('active');
			systemColor.removeClass('active');
			$('.step_6 .load-more-anim').addClass('fixed');
			$('.step_6 .load-more-anim .loadMoreGenerate').addClass('animate');
			$('.ste-6-strip-apply').addClass('active');
		}
	});

	$('.getStarted').click(async function (e) {
		var lPage1 = lEditor.getSession('currPage');
		let symbolPart = lEditor.getSession("symbol_part");

		if (!symbolPart) {
			symbolPart = 1;
		}
		if (lPage1 == 5 && search_symbol_list && search_symbol_list.length > 0 && (symbolPart == 1)) {
			let sampleList = [];
			$(this).prop('disabled', true);
			$(this).find(".wait_loading").removeClass("hidden");
			$(".backButton, .step_5_extra .symbol_keyword").css("pointer-events", "none");
			const status = await Promise.all(search_symbol_list.map(async function (p_sSearch, index) {
				let iconResponse = await lEditor.searchAjaxIconsResponse(p_sSearch, NOUN_API_LIMIT, "nonEditor", "pick_for_me_icon");
				iconResponse = dh_editor_utility.shuffleTheArray(iconResponse);
				if (iconResponse) {
					switch (search_symbol_list.length) {
						case 1:
							(iconResponse[0] && sampleList.push(getIconData(iconResponse[0])));
							(iconResponse[1] && sampleList.push(getIconData(iconResponse[1])));
							(iconResponse[2] && sampleList.push(getIconData(iconResponse[2])));
							(iconResponse[3] && sampleList.push(getIconData(iconResponse[3])));
							(iconResponse[4] && sampleList.push(getIconData(iconResponse[4])));
							break;
						case 2:
							(iconResponse[0] && sampleList.push(getIconData(iconResponse[0])));
							(iconResponse[1] && sampleList.push(getIconData(iconResponse[1])));
							if (index === search_symbol_list.length - 1) {
								(iconResponse[2] && sampleList.push(getIconData(iconResponse[2])));
							}
							break;
						case 3:
							(iconResponse[0] && sampleList.push(getIconData(iconResponse[0])));
							if (index === search_symbol_list.length - 1) {
								(iconResponse[1] && sampleList.push(getIconData(iconResponse[1])));
								(iconResponse[2] && sampleList.push(getIconData(iconResponse[2])));
							}
							break;
						case 4:
							(iconResponse[0] && sampleList.push(getIconData(iconResponse[0])));
							if (index === search_symbol_list.length - 1) {
								(iconResponse[1] && sampleList.push(getIconData(iconResponse[1])));
							}
							break;
						case 5:
							(iconResponse[0] && sampleList.push(getIconData(iconResponse[0])));
							break;
					}
				}
			}))
				.catch(e => {
					$(this).prop('disabled', false);
					$(this).find(".wait_loading").addClass("hidden");
					$(".backButton, .step_5_extra .symbol_keyword").css("pointer-events", "auto");
				});

			if (sampleList && sampleList.length > 0) {
				sampleList = dh_editor_utility.shuffleTheArray(sampleList);
				lEditor.cleanSession("search_symbol_list");
				lEditor.setSession('search_symbol_list', dh_editor_utility.getValidJsonStringifyObj({ "si": sampleList }));
				lEditor.cleanSession("sampleIcon");
				lEditor.setSession('sampleIcon', dh_editor_utility.getValidJsonStringifyObj({ "si": sampleList }));
				$(this).prop('disabled', false);
				$(this).find(".wait_loading").addClass("hidden");
				$(".backButton, .step_5_extra .symbol_keyword").css("pointer-events", "auto");
			}
			lEditor.currentStep++;
			lEditor.setSession('currPage', lEditor.currentStep);
			$("html, body").animate({ scrollTop: 0 });
			lEditor.showStep();

		}
		else {
			sessionData();
			$("html, body").animate({ scrollTop: 0 });
			$(this).trigger("blur");
		}

	});

	function getIconData(iconResponse) {
		let icObj = {};
		icObj["id"] = iconResponse["id"];
		icObj["pngurl"] = iconResponse["url"];
		icObj["svgurl"] = iconResponse["icon_url"];
		return icObj;
	}

	$('.backButton').click(function (e) {
		var currentPage = parseInt(lEditor.getSession('currPage'));
		lEditor.currentStep--;
		if (lEditor.currentStep == 6) {
			window.location.href = $(this).attr('data-link');
			return
		}
		lEditor.setSession('currPage', lEditor.currentStep);
		$("html, body").animate({ scrollTop: 0 });
		$('.hide--icons').remove();
		$('#tags').val('');
		$('.commonFont a').removeClass('active');
		$('.startIcoSection').removeClass('hidden');
		$('.startIcoTab').removeClass('disabled');
		$('.loadMoreIcons, .iconsContainerBox, .brickImage').addClass('hidden');
		$('.flipIconTag').removeClass('hidden');
		lEditor.showStep();
	});

	$('.btnSkip').click(function (e) {
		var currentPage = parseInt(lEditor.getSession('currPage'));
		lEditor.currentStep++;
		lEditor.setSession('currPage', lEditor.currentStep);
		let lastSymbolPart = +(lEditor.getSession("symbol_part"));
		if (currentPage == 3) {
			lEditor.setSession('sampleColor', dh_editor_utility.getValidJsonStringifyObj([]));
		} else if (currentPage == 5 && (lastSymbolPart == 2)) {
			lEditor.sampleIconArr = [];
			lEditor.setSession('sampleIcon', dh_editor_utility.getValidJsonStringifyObj({ "si": '' }));
		}
		else if ((currentPage == 2)) {
			lEditor.cleanSession('sampleImage');
			lEditor.cleanSession('logo_styles');
			lEditor.flushDesignStyleLogic();
			step6OnLoadFirstSchema = "";
		}
		$("html, body").animate({ scrollTop: 0 });
		lEditor.showStep();
	});

	$('.startButton').click(function (e) {
		lEditor.startNew();

	});
	$('.editCompanyName').val(lEditor.getSession('logoname'));

	/* Step Two JS */
	$('body').on('click', '.le-imageLayout', function () {
		var boxLength = lEditor.imgLength();
		if (boxLength == 0) {
			$('.footer-strip-content .progress').css('float', 'none');
			$('.footer-strip-content .progress').addClass('mob-progress');
		}
		switch (lEditor.currentStep) {
			case 2: {
				lEditor.progressBar(boxLength);
				break;
			}
			case 5:
			case 3: {
				lEditor.skipBtn(boxLength);
				break;
			}
		}

	});

	$('.editShowIconsDiv').scroll(function (e) {
		var element = e.target;
		if ((element.scrollHeight - element.scrollTop) === element.clientHeight) {
			if (lEditor.nextIconSearch == true) {
				lEditor.editIconsData();
			}
		}
	});

	$('.showIconsDiv').scroll(function (e) {
		var element = e.target;
		if ((element.scrollHeight - element.scrollTop) === element.clientHeight) {
			if (lEditor.nextIconSearch == true) {
				lEditor.iconsData($(element));
			}
		}
	});

	$("body").on("click", '.load_more_showIconsDiv', function () {
		if (lEditor.nextIconSearch == true) {
			lEditor.iconsData($(".load_more_showIconsDiv"));
		}
	});
	function setupSliders(objGenerate) {
		// company name font size slider code
		$('.logoTextSlider').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'logoTextSlider'),
			min: 10,
			max: 100,
			stop: function (event, ui) {
				if ($('.logoTextSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT_FS, editorUndoRedo.ltsOldLogoObj, editorUndoRedo.ltsNewLogoObj);
				}
				$('.logoTextSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.ltsOldLogoObj = null;
				editorUndoRedo.ltsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoTextSlider').attr("sliding", "yes");
				onTextFontSizeSlide($(this), ui.value);
			}
		});
		// company name letter spacing slider code 
		$('.logoLetterSpacing').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'logoLetterSpacing'),
			min: 1,
			step: 0.5,
			max: 10,
			stop: function (event, ui) {
				if ($('.logoLetterSpacing').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.setUndoActData(LOGO_TEXT_LS, editorUndoRedo.llsOldLogoObj, editorUndoRedo.llsNewLogoObj);
				}
				$('.logoLetterSpacing').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.llsOldLogoObj = null;
				editorUndoRedo.llsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.logoLetterSpacing').attr("sliding", "yes");
				onTextLetterSpacingSlide($(this), ui.value);
			}
		});
		// slogan name font size slider code	
		$('.sloganTextSize').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'sloganTextSize'),
			min: 10,
			max: 100,
			stop: function (event, ui) {
				if ($('.sloganTextSize').attr('sliding') === "yes") {
					// logoMakerFunction.resetSlider("textSloganDistSlider", true);
					saveSliderData();
					editorUndoRedo.setUndoActData(SLOGAN_TEXT_FS, editorUndoRedo.stsOldLogoObj, editorUndoRedo.stsNewLogoObj);
				}
				$('.sloganTextSize').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.stsOldLogoObj = null;
				editorUndoRedo.stsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.sloganTextSize').attr("sliding", "yes");
				onSloganFontSizeSlide($(this), ui.value);
			}
		});
		// slogan letter spacing slider code 	
		$('.sloganLetterSpacing').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'sloganLetterSpacing'),
			min: 0,
			max: 100,
			stop: function (event, ui) {
				if ($('.sloganLetterSpacing').attr('sliding') === "yes") {
					// logoMakerFunction.resetSlider("textSloganDistSlider", true);
					saveSliderData();
					editorUndoRedo.setUndoActData(SLOGAN_TEXT_LS, editorUndoRedo.slsOldLogoObj, editorUndoRedo.slsNewLogoObj);
				}
				$('.sloganLetterSpacing').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.slsOldLogoObj = null;
				editorUndoRedo.slsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				constantVars.ORIGINAL_SPACING.isJustChangeSloganLetterSpacing = true;
				$('.sloganLetterSpacing').attr("sliding", "yes");
				onSloganLetterSpacingSlide($(this), ui.value);
			}
		});
		// slider code for distance between text and slogan 
		$('.textSloganDistSlider').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'textSloganDistSlider'),
			min: 0,
			max: 100,
			stop: function (event, ui) {
				if ($('.textSloganDistSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.tsdsNewLogoObj = null;
					editorUndoRedo.tsdsNewLogoObj = lEditor.currentLogo;
					editorUndoRedo.setUndoActData(TEXT_SLOGAN_DS, editorUndoRedo.tsdsOldLogoObj, editorUndoRedo.tsdsNewLogoObj);
				}
				$('.textSloganDistSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.tsdsOldLogoObj = null;
				editorUndoRedo.tsdsOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.textSloganDistSlider').attr("sliding", "yes");
				onTextSloganDistanceSlide($(this), ui.value);
			}
		});
		// logo icon size slider code
		$('.logoSizeSlider').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'logoSizeSlider'),
			min: 25,
			max: 300,
			stop: function (event, ui) {
				if ($('.logoSizeSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.lssNewLogoObj = null;
					if (lEditor.currentLogo.generate.templatePath.isIcon == 1) {
						editorUndoRedo.lssNewLogoObj = Object.assign({}, lEditor.currentLogo);
						editorUndoRedo.setUndoActData(SYMBOL_SIZE, editorUndoRedo.lssOldLogoObj, editorUndoRedo.lssNewLogoObj);
					} else if (lEditor.currentLogo.generate.templatePath.isMono == 1) {
						editorUndoRedo.lssNewLogoObj = Object.assign({}, lEditor.currentLogo);
						editorUndoRedo.setUndoActData(MONOGRAM_SIZE, editorUndoRedo.lssOldLogoObj, editorUndoRedo.lssNewLogoObj);
					}
				}
				$('.logoSizeSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.lssOldLogoObj = null;
				editorUndoRedo.lssOldLogoObj = Object.assign({}, dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo')));;
			},
			slide: function (event, ui) {
				$('.logoSizeSlider').attr("sliding", "yes");
				onSymbolSizeSlide($(this), ui.value);
			}
		});
		// slider code for icon distance ( up down left right )
		$('.iconDistanceSlider').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'iconDistanceSlider'),
			min: 0,
			max: 100,
			stop: function (event, ui) {
				if ($('.iconDistanceSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.idsNewLogoObj = null;
					if (lEditor.currentLogo.generate.templatePath.isIcon == 1) {
						editorUndoRedo.idsNewLogoObj = Object.assign({}, lEditor.currentLogo);
						editorUndoRedo.setUndoActData(SYMBOL_DS, editorUndoRedo.idsOldLogoObj, editorUndoRedo.idsNewLogoObj);
					} else if (lEditor.currentLogo.generate.templatePath.isMono == 1) {
						editorUndoRedo.idsNewLogoObj = Object.assign({}, lEditor.currentLogo);
						editorUndoRedo.setUndoActData(MONOGRAM_DS, editorUndoRedo.idsOldLogoObj, editorUndoRedo.idsNewLogoObj);
					}
				}
				$('.iconDistanceSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.idsOldLogoObj = null;
				editorUndoRedo.idsOldLogoObj = Object.assign({}, dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo')));
			},
			slide: function (event, ui) {
				$('.iconDistanceSlider').attr("sliding", "yes");
				onSymbolDistanceSlide($(this), ui.value);
			}
		});
		// slider code for outer frame size 
		$('.frameSizeSlider').slider({
			value: getSliderBarValueFirstTime(objGenerate.generate, 'frameSizeSlider'),
			min: 1,
			max: 50,
			stop: function (event, ui) {
				if ($('.frameSizeSlider').attr('sliding') === "yes") {
					saveSliderData();
					editorUndoRedo.fssNewLogoObj = null;
					editorUndoRedo.fssNewLogoObj = lEditor.currentLogo;
					editorUndoRedo.setUndoActData(OUTER_CONTAINER_SIZE, editorUndoRedo.fssOldLogoObj, editorUndoRedo.fssNewLogoObj);
				}
				$('.frameSizeSlider').attr("sliding", "no");
			},
			start: function (event, ui) {
				editorUndoRedo.fssOldLogoObj = null;
				editorUndoRedo.fssOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			},
			slide: function (event, ui) {
				$('.frameSizeSlider').attr("sliding", "yes");
				onOuterFrameSizeSlide($(this), ui.value)
			}
		});
		// slider code for company text curve
		if (objGenerate.generate.isArc == 1) {
			showCurveSlider(true);
			$('.logoCurveSlider').slider({
				value: getSliderBarValueFirstTime(objGenerate.generate, 'logoCurveSlider'),
				min: logoNameCurveSliderMinValue,
				max: logoNameCurveSliderMaxValue,
				stop: function (event, ui) {
					if ($('.logoCurveSlider').attr('sliding') === "yes") {
						saveSliderData();
						editorUndoRedo.setUndoActData(LOGO_TEXT_CURVE, editorUndoRedo.ltcOldLogoObj, editorUndoRedo.ltcNewLogoObj);
					}
					$('.logoCurveSlider').attr("sliding", "no");
				},
				start: function (event, ui) {
					editorUndoRedo.ltcOldLogoObj = null;
					editorUndoRedo.ltcOldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
				},
				slide: function (event, ui) {
					$('.logoCurveSlider').attr("sliding", "yes");
					onTextCurveSizeSlide($(this), ui.value);
				}
			});
		} else {
			showCurveSlider(false);
		}
	}
	function showCurveSlider(p_bValue) {
		if (p_bValue) {
			$('.step_7 .menu_2 .logoCurveSliderParent').removeClass('hidden');
		} else {
			$('.step_7 .menu_2 .logoCurveSliderParent').addClass('hidden');
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} p_bIsSaveData 
	 */
	function onOuterFrameSizeSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			lEditor.setSession('frameSizeSlider', p_nSliderValue);
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			constantVars.SPACING.frameSizeSlider = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.frameSizeSlider);
		} else {
			clearOutlineBox();
			clearOutline();
			var currLogo = lEditor.currentLogo;
			rangeSliderFlag = true;
			var size = constantVars.ORIGINAL_SPACING.frameSizeSlider - p_nSliderValue;
			var obj = updateFrameSize($('.finaLogoInner .container_1'), size * -1);
			currLogo.generate.templatePath.updates.frame.x = obj.x;
			currLogo.generate.templatePath.updates.frame.y = obj.y;
			currLogo.generate.templatePath.updates.frame.scale = obj.scale;
			lEditor.setSession('frameSizeSlider', p_nSliderValue);
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			constantVars.SPACING.frameSizeSlider = p_nSliderValue;
			currLogo.generate.frameSizeSlider = p_nSliderValue;
			currLogo = updateCurrLogoObject(currLogo);
			lEditor.setDefaultLogo(currLogo, currLogo.generate);
			var currLogo = lEditor.currentLogo;
		}
	}
	/**
	 * 
	 * @param {*} p_sClassName 
	 * @param {*} p_nSliderValue 
	 */
	function updateLinesFSSlider(p_sClassName, p_nSliderValue) {
		switch (p_sClassName) {
			case "logoOverallLinesFSSlider":
				if ($('.dd-ct-overall-fs-slider').length) {
					$('.dd-ct-overall-fs-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-overall-fs-slider').find(".logoOverallLinesFSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
			case "logoLine1FSSlider":
				if ($('.dd-ct-line1-fs-slider').length) {
					$('.dd-ct-line1-fs-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-line1-fs-slider').find(".logoLine1FSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
			case "logoLine2FSSlider":
				if ($('.dd-ct-line2-fs-slider').length) {
					$('.dd-ct-line2-fs-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-line2-fs-slider').find(".logoLine2FSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
		}
	}
	/**
	 * 
	 * @param {*} p_sClassName 
	 * @param {*} p_nSliderValue 
	 */
	function updateLinesLSSlider(p_sClassName, p_nSliderValue) {
		switch (p_sClassName) {
			case "logoOverallLinesLSSlider":
				if ($('.dd-ct-overall-ls-slider').length) {
					$('.dd-ct-overall-ls-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-overall-ls-slider').find(".logoOverallLinesLSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
			case "logoLine1LSSlider":
				if ($('.dd-ct-line1-ls-slider').length) {
					$('.dd-ct-line1-ls-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-line1-ls-slider').find(".logoLine1LSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
			case "logoLine2LSSlider":
				if ($('.dd-ct-line2-ls-slider').length) {
					$('.dd-ct-line2-ls-slider').find('.rangeSliderValue').val(p_nSliderValue);
					$('.dd-ct-line2-ls-slider').find(".logoLine2LSSlider").slider("option", "value", p_nSliderValue);
				}
				break;
		}
	}
	/**
	 * 
	 * @param {*} p_nSliderValue 
	 */
	function updateText1FontSizeSlider(p_nSliderValue) {

	}
	/**
	 * 
	 * @param {*} p_nSliderValue 
	 */
	function updateText2FontSizeSlider(p_nSliderValue) {
	}
	/**
	 * 
	 * @param {*} p_nSliderValue 
	 */
	function updateText1LetterSpacingSlider(p_nSliderValue) {
		$('.dd-ct-line1-ls-slider').find('.rangeSliderValue').val(p_nSliderValue);
		$('.dd-ct-line1-ls-slider').find(".logoTextSlider").slider("option", "value", p_nSliderValue);
	}
	/**
	 * 
	 * @param {*} p_nSliderValue 
	 */
	function updateText2LetterSpacingSlider(p_nSliderValue) {
		$('.dd-ct-line2-ls-slider').find('.rangeSliderValue').val(p_nSliderValue);
		$('.dd-ct-line2-ls-slider').find(".logoTextSlider").slider("option", "value", p_nSliderValue);
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onTextFontSizeSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('logoTextSlider', p_nSliderValue);
			constantVars.SPACING.logoTextSlider = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.logoTextSlider);
		} else {
			clearOutlineBox();
			clearOutline();
			if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
				lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
			}
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			var logoTextLS = lEditor.currentLogo.generate.logoLetterSpacing;
			var workFor = p_oThis.attr("work-for");
			switch (workFor) {
				case "dd-ct-line1":
					if (lEditor.currentLogo.generate.logoText1LetterSpacing) {
						logoTextLS = lEditor.currentLogo.generate.logoText1LetterSpacing;
					}
					lEditor.currentLogo.generate.logoText1Slider = p_nSliderValue;
					updateLogoText('logoName1', '', p_nSliderValue, logoTextLS, 'slider', 'logoTextSlider');

					break;
				case "dd-ct-line2":
					if (lEditor.currentLogo.generate.logoText2LetterSpacing) {
						logoTextLS = lEditor.currentLogo.generate.logoText2LetterSpacing;
					}
					lEditor.currentLogo.generate.logoText2Slider = p_nSliderValue;
					updateLogoText('logoName2', '', p_nSliderValue, logoTextLS, 'slider', 'logoTextSlider');
					break;
				default:
					lEditor.setSession('logoTextSlider', p_nSliderValue);
					constantVars.SPACING.logoTextSlider = p_nSliderValue;
					lEditor.currentLogo.generate.logoTextSlider = p_nSliderValue;
					if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
						lEditor.currentLogo.generate.logoText1Slider = p_nSliderValue;
						lEditor.currentLogo.generate.logoText2Slider = p_nSliderValue;
						updateLinesFSSlider("logoLine1FSSlider", p_nSliderValue);
						updateLinesFSSlider("logoLine2FSSlider", p_nSliderValue);
					}
					updateLogoText('logoName', '', p_nSliderValue, getSliderValue('logoLetterSpacing'), 'slider', "logoTextSlider");
					break;
			}
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onTextLetterSpacingSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('logoLetterSpacing', p_nSliderValue);
			constantVars.SPACING.logoLetterSpacing = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.logoLetterSpacing);
		} else {
			clearOutlineBox();
			clearOutline();
			if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
				lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
			}
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			var logoTextFS = lEditor.currentLogo.generate.logoTextSlider;
			var workFor = p_oThis.attr("work-for");
			switch (workFor) {
				case "dd-ct-line1":
					if (lEditor.currentLogo.generate.logoText1Slider) {
						logoTextFS = lEditor.currentLogo.generate.logoText1Slider;
					}
					lEditor.currentLogo.generate.logoText1LetterSpacing = p_nSliderValue;
					updateLogoText('logoName1', '', logoTextFS, p_nSliderValue, 'slider', "logoLetterSpacing");

					break;
				case "dd-ct-line2":
					logoTextFS;
					if (lEditor.currentLogo.generate.logoText2Slider) {
						logoTextFS = lEditor.currentLogo.generate.logoText2Slider;
					}
					lEditor.currentLogo.generate.logoText2LetterSpacing = p_nSliderValue;
					updateLogoText('logoName2', '', logoTextFS, p_nSliderValue, 'slider', "logoLetterSpacing");
					break;
				default:
					lEditor.currentLogo.generate.logoLetterSpacing = p_nSliderValue;
					lEditor.setSession('logoLetterSpacing', p_nSliderValue);
					constantVars.SPACING.logoLetterSpacing = p_nSliderValue;
					if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
						lEditor.currentLogo.generate.logoText1LetterSpacing = p_nSliderValue;
						lEditor.currentLogo.generate.logoText2LetterSpacing = p_nSliderValue;

						updateLinesLSSlider("logoLine1LSSlider", p_nSliderValue);
						updateLinesLSSlider("logoLine2LSSlider", p_nSliderValue);
					}
					updateLogoText('logoName', '', getSliderValue('logoTextSlider'), p_nSliderValue, 'slider', "logoLetterSpacing");
					break;
			}
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onSloganFontSizeSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('sloganTextSize', p_nSliderValue);
			constantVars.SPACING.sloganTextSize = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.sloganTextSize);
		} else {
			clearOutlineBox();
			clearOutline();
			if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
				lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
			}
			lEditor.currentLogo.generate.sloganTextSize = p_nSliderValue;
			updateLogoText('slogan', '', p_nSliderValue, getSliderValue('sloganLetterSpacing'), 'slider', "sloganTextSize");
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('sloganTextSize', p_nSliderValue);
			constantVars.SPACING.sloganTextSize = p_nSliderValue;
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onSloganLetterSpacingSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('sloganLetterSpacing', p_nSliderValue);
			constantVars.SPACING.sloganLetterSpacing = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.sloganLetterSpacing);
		} else {
			clearOutlineBox();
			clearOutline();
			if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
				lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
			}
			lEditor.currentLogo.generate.sloganLetterSpacing = p_nSliderValue;
			updateLogoText('slogan', '', getSliderValue('sloganTextSize'), p_nSliderValue, 'slider', "sloganLetterSpacing");
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('sloganLetterSpacing', p_nSliderValue);
			constantVars.SPACING.sloganLetterSpacing = p_nSliderValue;
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} p_bIsSaveData 
	 */
	function onTextSloganDistanceSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('textSloganDistSlider', p_nSliderValue);
			constantVars.SPACING.textSloganDistSlider = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.textSloganDistSlider);
		} else {
			clearOutlineBox();
			clearOutline();
			var currVal = getSliderValue('textSloganDistSlider');
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('textSloganDistSlider', p_nSliderValue);
			constantVars.SPACING.textSloganDistSlider = p_nSliderValue;
			lEditor.currentLogo.generate.textSloganDistSlider = p_nSliderValue;
			var updatedVal = p_nSliderValue - currVal;
			var currLogo = lEditor.currentLogo;
			rangeSliderFlag = true;

			var bbox = $('.svgSlideContent  .svgLogoName_1').get(0).getBBox();
			currLogo.generate.templatePath.updates.slogan.y = parseFloat(currLogo.generate.templatePath.slogan.y) + parseFloat(updatedVal);

			updatedVal = updatedVal * currLogo.generate.templatePath.updates.slogan.scale;

			if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
				currLogo.generate.templatePath.lastTextDistance = p_nSliderValue;///2;
			} else {
				currLogo.generate.templatePath.lastTextDistance = p_nSliderValue;
			}

			if (currLogo.generate.templatePath.isIconFrame == 1) {
				currLogo.generate.templatePath.iconShiftDueToSloganDistance = p_nSliderValue * currLogo.generate.templatePath.updates.slogan.scale;
			} else {
				currLogo.generate.templatePath.iconShiftDueToSloganDistance = undefined;
			}


			let isIconOrMonoShifting = false;
			if (currLogo.generate.templatePath.isIcon == 1 || currLogo.generate.templatePath.isMono == 1) {
				if ((currLogo.generate.templatePath.icon.yType === "up" || currLogo.generate.templatePath.slogan.yType === "up") && currLogo.generate.templatePath.textAndSlogan.yType === "down") {
					currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) + parseFloat(updatedVal / currLogo.generate.templatePath.updates.iconFrameBox.scale)
					isIconOrMonoShifting = true;
				}
			}
			currLogo = updateCurrLogoObject(currLogo);
			lEditor.setDefaultLogo(currLogo, currLogo.generate);
			var currLogo = lEditor.currentLogo;
			$('.svgSloganText_1').attr('transform', "scale(" + currLogo.generate.templatePath.slogan.scale + ") translate(" + parseFloat(currLogo.generate.templatePath.slogan.x) + "," + parseFloat(currLogo.generate.templatePath.slogan.y) + ")");
			if (isIconOrMonoShifting) {
				$('.sampleIconBox').attr('transform', "scale(" + currLogo.generate.templatePath.iconFrameBox.scale + ") translate(" + currLogo.generate.templatePath.iconFrameBox.x + "," + currLogo.generate.templatePath.iconFrameBox.y + ")");
			}
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onSymbolSizeSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.setSession('logoSizeSlider', p_nSliderValue);
			constantVars.SPACING.logoSizeSlider = p_nSliderValue;
			p_oThis.slider("option", "value", constantVars.SPACING.logoSizeSlider);
		} else {
			clearOutlineBox();
			clearOutline();
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			var currLogo = Object.assign({}, lEditor.currentLogo);
			// if (currLogo.generate.templatePath.isMono == 1) {
			// 	constantVars.SPACING.monogramTextSize = p_nSliderValue;
			// 	constantVars.ORIGINAL_SPACING.monogramTextSize = p_nSliderValue;
			// } else {
			var updatedVal = p_nSliderValue;

			currLogo = Object.assign({}, updateCurrLogoObject(currLogo));
			if (currLogo.generate.templatePath.isIconFrame == 1) {
				// var obj = updateGroupSize($('.finaLogoInner  .sampleIconBox'), currLogo.generate.templatePath, 'iconFrameBox', p_nSliderValue / constantVars.ORIGINAL_SPACING.logoSizeSlider);
				// currLogo.generate.templatePath.updates.iconFrameBox.x = obj.x;
				// currLogo.generate.templatePath.updates.iconFrameBox.y = obj.y;
				// currLogo.generate.templatePath.updates.iconFrameBox.scale = obj.scale;

				var obj = updateCurrentIconSize($('.finaLogoInner .sampleIconBox'), currLogo.generate.templatePath, p_nSliderValue, 'iconFrameBox');
				currLogo.generate.templatePath.updates.iconFrameBox.x = obj.x;
				currLogo.generate.templatePath.updates.iconFrameBox.y = obj.y;
				currLogo.generate.templatePath.updates.iconFrameBox.scale = obj.scale;

			} else {
				var obj = updateCurrentIconSize($('.finaLogoInner .sampleIcons_1'), currLogo.generate.templatePath, updatedVal, 'icon');
				currLogo.generate.templatePath.updates.icon.x = obj.x;
				currLogo.generate.templatePath.updates.icon.y = obj.y;
				currLogo.generate.templatePath.updates.icon.scale = obj.scale;
			}

			lEditor.setSession('logoSizeSlider', p_nSliderValue);
			constantVars.SPACING.logoSizeSlider = p_nSliderValue;
			currLogo.generate.logoSizeSlider = p_nSliderValue;
			var currLogo1 = Object.assign({}, updateCurrLogoObject(currLogo));
			lEditor.setDefaultLogo(currLogo1, currLogo1.generate);
			// }
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onSymbolDistanceSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			lEditor.setSession('iconDistanceSlider', p_nSliderValue);
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			p_oThis.slider("option", "value", p_nSliderValue);
			constantVars.SPACING.iconDistanceSlider = p_nSliderValue;
		} else {
			clearOutlineBox();
			clearOutline();
			var currVal = getSliderValue('iconDistanceSlider');
			lEditor.setSession('iconDistanceSlider', p_nSliderValue);
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			constantVars.SPACING.iconDistanceSlider = p_nSliderValue;
			lEditor.currentLogo.generate.iconDistanceSlider = p_nSliderValue;
			var updatedVal = p_nSliderValue - currVal;
			var currLogo = Object.assign({}, lEditor.currentLogo);
			switch (currLogo.generate.templatePath.tempType) {
				case "center":
					if ((currLogo.generate.templatePath.iconFrameBox.yType === "up") || (currLogo.generate.templatePath.iconFrameBox.yType === "down")) {
						currLogo.generate.templatePath.lastSymbolYDistance = p_nSliderValue;
					}

					var textCond1 = false;
					var textCond2 = false;
					var textCond3 = false;
					if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
						if ((currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text1.yType === "down") && (currLogo.generate.templatePath.slogan.yType === "up")) {
							textCond1 = true;
						} else if ((currLogo.generate.templatePath.icon.yType === "down" || currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text1.yType === "up")) {
							textCond2 = true;
						}
						else if ((currLogo.generate.templatePath.icon.yType === "up" || currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text1.yType === "down")) {
							textCond3 = true;
						}
					} else {
						if ((currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text.yType === "down") && (currLogo.generate.templatePath.slogan.yType === "up")) {
							textCond1 = true;
						}
						else if ((currLogo.generate.templatePath.icon.yType === "down" || currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text.yType === "up")) {
							textCond2 = true;
						}
						else if ((currLogo.generate.templatePath.icon.yType === "up" || currLogo.generate.templatePath.icon.yType === "center") && (currLogo.generate.templatePath.text.yType === "down")) {
							textCond3 = true;
						}
					}
					if (textCond1) {
						if (currLogo.generate.templatePath.template_direction == 0) {
							currLogo.generate.templatePath.updates.textAndSlogan.y = parseFloat(currLogo.generate.templatePath.textAndSlogan.y) + parseFloat(updatedVal);
							currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) - parseFloat(updatedVal);
						} else {
							currLogo.generate.templatePath.updates.textAndSlogan.y = parseFloat(currLogo.generate.templatePath.textAndSlogan.y) - parseFloat(updatedVal);
							currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) + parseFloat(updatedVal);
						}
					}
					else if (textCond2) {
						currLogo.generate.templatePath.updates.textAndSlogan.y = parseFloat(currLogo.generate.templatePath.textAndSlogan.y) + parseFloat(updatedVal);
						currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) - parseFloat(updatedVal);
					}
					else if (textCond3) {
						currLogo.generate.templatePath.updates.textAndSlogan.y = parseFloat(currLogo.generate.templatePath.textAndSlogan.y) - parseFloat(updatedVal);
						currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) + parseFloat(updatedVal);
					} else {
						currLogo.generate.templatePath.updates.textAndSlogan.y = parseFloat(currLogo.generate.templatePath.textAndSlogan.y) + parseFloat(updatedVal);
						currLogo.generate.templatePath.updates.iconFrameBox.y = parseFloat(currLogo.generate.templatePath.iconFrameBox.y) - parseFloat(updatedVal);
					}
					break;

				case "left":
					currLogo.generate.templatePath.updates.textAndSlogan.x = parseFloat(currLogo.generate.templatePath.textAndSlogan.x) + parseFloat(updatedVal);
					currLogo.generate.templatePath.updates.iconFrameBox.x = parseFloat(currLogo.generate.templatePath.iconFrameBox.x) - parseFloat(updatedVal);
					currLogo.generate.templatePath.lastSymbolXDistance = p_nSliderValue;
					break;

				case "right":
					currLogo.generate.templatePath.updates.textAndSlogan.x = parseFloat(currLogo.generate.templatePath.textAndSlogan.x) - parseFloat(updatedVal);
					currLogo.generate.templatePath.updates.iconFrameBox.x = parseFloat(currLogo.generate.templatePath.iconFrameBox.x) + parseFloat(updatedVal);
					currLogo.generate.templatePath.lastSymbolXDistance = p_nSliderValue;
					break;

			}
			currLogo.generate.iconDistanceSlider = p_nSliderValue;
			var currLogo1 = Object.assign({}, updateCurrLogoObject(currLogo));
			lEditor.setDefaultLogo(currLogo1, currLogo1.generate);
			var currLogo2 = Object.assign({}, lEditor.currentLogo);
			$('.sampleTexts_1').attr('transform', "scale(" + currLogo2.generate.templatePath.textAndSlogan.scale + ") translate(" + currLogo2.generate.templatePath.textAndSlogan.x + "," + currLogo2.generate.templatePath.textAndSlogan.y + ")");
			$('.sampleIconBox').attr('transform', "scale(" + currLogo2.generate.templatePath.iconFrameBox.scale + ") translate(" + currLogo2.generate.templatePath.iconFrameBox.x + "," + currLogo2.generate.templatePath.iconFrameBox.y + ")");
			// lEditor.previewColors();
			// lEditor.previewLogo();
		}
	}
	/**
	 * 
	 * @param {*} p_oThis 
	 * @param {*} p_nSliderValue 
	 * @param {*} isUpdateSlider 
	 */
	function onTextCurveSizeSlide(p_oThis, p_nSliderValue, isUpdateSlider = false) {
		if (isUpdateSlider) {
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			p_oThis.slider("option", "value", p_nSliderValue);
			lEditor.currentLogo.generate.arcValue = p_nSliderValue;
		} else {
			clearOutlineBox();
			clearOutline();
			p_oThis.parents('.rangeSlider').find('.rangeSliderValue').val(p_nSliderValue);
			lEditor.currentLogo.generate.arcValue = p_nSliderValue;
			var logoTextLS = lEditor.currentLogo.generate.logoLetterSpacing;
			var logoTextFS = lEditor.currentLogo.generate.logoTextSlider;
			updateLogoText('logoName', '', logoTextFS, logoTextLS, 'slider', "logoCurveSlider");
		}
	}
	/**
	 * 
	 * @param {*} dataGenerateObj 
	 * @param {*} key 
	 */
	function getSliderBarValueFirstTime(dataGenerateObj, key) {
		var value;
		switch (key) {
			case "logoTextSlider":
				if (typeof dataGenerateObj.logoTextSlider !== 'undefined') {
					value = dataGenerateObj.logoTextSlider;
					lEditor.setSession('logoTextSlider', value);
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
				}
				else {
					value = constantVars.SPACING[key];
				}
				constantVars.SPACING.logoTextSlider = value;
				break;

			case "logoLetterSpacing":
				if (typeof dataGenerateObj.logoLetterSpacing !== 'undefined') {
					value = dataGenerateObj.logoLetterSpacing;
					lEditor.setSession('logoLetterSpacing', value);
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
				}
				else {
					value = constantVars.SPACING[key];
				}
				constantVars.SPACING.logoLetterSpacing = value;
				break;

			case "sloganTextSize":
				if (typeof dataGenerateObj.sloganTextSize !== 'undefined') {
					value = dataGenerateObj.sloganTextSize;
					lEditor.setSession('sloganTextSize', value);
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
				}
				else {
					value = constantVars.SPACING[key];
				}
				constantVars.SPACING.sloganTextSize = value;
				break;
			case "sloganLetterSpacing":
				if (typeof dataGenerateObj.sloganLetterSpacing !== 'undefined') {
					value = dataGenerateObj.sloganLetterSpacing;
					lEditor.setSession('sloganLetterSpacing', value);
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
				}
				else {
					value = constantVars.SPACING[key];
				}
				constantVars.SPACING.sloganLetterSpacing = value;
				break;

			case "textSloganDistSlider":
				if (typeof dataGenerateObj.textSloganDistSlider !== 'undefined') {
					value = dataGenerateObj.textSloganDistSlider;
					lEditor.setSession('textSloganDistSlider', value);
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
				}
				else {
					value = constantVars.SPACING[key];
				}
				constantVars.SPACING.textSloganDistSlider = value;
				break;

			case "logoSizeSlider":
				if (typeof dataGenerateObj.logoSizeSlider !== 'undefined') {
					value = dataGenerateObj.logoSizeSlider;
					lEditor.setSession('logoSizeSlider', value);
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
				}
				else {
					value = constantVars.SPACING[key];
				}
				constantVars.SPACING.logoSizeSlider = value;
				break;

			case "iconDistanceSlider":
				if (typeof dataGenerateObj.iconDistanceSlider !== 'undefined') {
					value = dataGenerateObj.iconDistanceSlider;
					lEditor.setSession('iconDistanceSlider', value);
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
				}
				else {
					value = constantVars.SPACING[key];
				}
				constantVars.SPACING.iconDistanceSlider = value;
				break;

			case "frameSizeSlider":
				if (typeof dataGenerateObj.frameSizeSlider !== 'undefined') {
					value = dataGenerateObj.frameSizeSlider;
					lEditor.setSession('frameSizeSlider', value);
				}
				else if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
					value = lEditor.getSession(key);
				}
				else {
					value = constantVars.SPACING[key];
				}
				constantVars.SPACING.frameSizeSlider = value;
				break;
			case "logoCurveSlider":
				value = dataGenerateObj.arcValue;
				break;
		}
		$('.' + key).parents('.rangeSlider').find('.rangeSliderValue').val(value);
		return value;
	}
	/**
	 * 
	 * @param {*} key 
	 */
	function getSliderValue(key) {
		var value = constantVars.SPACING[key];
		if (!(lEditor.getSession(key) == null || lEditor.getSession(key) == 'undefined')) {
			value = lEditor.getSession(key);
		}
		return value;
	}
	/*==== Common Setting JS ====*/
	/**
	 * calculation of update current icon size 
	 * @param {*} object 
	 * @param {*} dimension 
	 * @param {*} size 
	 * @param {*} type 
	 */
	function updateCurrentIconSize(object, dimension, size, type, isSetLastSymbolXDistance = true) {
		var bbox = object.get(0).getBBox();
		var x = dimension[type].x;
		var y = dimension[type].y
		var obj = {};
		size = Number(size);
		dimension[type].scale = Number(dimension[type].scale);

		var scale = Number( /* dimension[type].scale + */ size / (bbox.width > bbox.height ? bbox.width : bbox.height));  // * dimension[type].scale * dimension['containerBody'].scale * dimension['logoContainer'].scale ;

		// if (isSetLastSymbolXDistance) {
		// 	console.log("dimension.lastSymbolXDistance:=" + dimension.lastSymbolXDistance);
		// }


		if (dimension[type].xType == 'left') {
			if (type == "iconFrameBox") {
				// x = Number((constantVars.SVGWIDTH * dimension[type].widthStart / 100) / scale - bbox.width - bbox.x);
				if (dimension.isMono == 1) {

					x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - bbox.x);
				} else {
					// x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - (bbox.width / 2) - bbox.x);
					x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - bbox.x);
				}

				if (type == "iconFrameBox" && dimension.lastSymbolXDistance != undefined && isSetLastSymbolXDistance) {
					x = x + dimension.lastSymbolXDistance;
				}
			} else {
				// x = Number((constantVars.SVGWIDTH * dimension[type].widthStart / 100) / scale - bbox.x * scale);
				if (dimension.isMono == 1) {

					x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - bbox.x);
				} else {
					// x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - (bbox.width / 2) - bbox.x);
					x = Number((constantVars.SVGWIDTH * (dimension[type].widthStart) / 100) / scale - bbox.x);
				}
			}
		}
		if (dimension[type].xType == 'center') {
			x = Number(((constantVars.SVGWIDTH * dimension[type].widthPercent / 100) + (constantVars.SVGWIDTH * dimension[type].widthStart / 100)) / (2 * scale) - ((bbox.width) / 2) - bbox.x);
		}
		if (dimension[type].xType == 'right') {
			x = Number((constantVars.SVGWIDTH * dimension[type].widthStart / 100) + (constantVars.SVGWIDTH * dimension[type].widthPercent / 100) / scale - bbox.width - bbox.x);
			if (type == "iconFrameBox" && dimension.lastSymbolXDistance != undefined && isSetLastSymbolXDistance) {
				x = x - dimension.lastSymbolXDistance;
			}
		}


		if (dimension[type].yType == 'up') {
			var ab = 0;
			if ((dimension.iconShiftDueToSloganDistance) != undefined) {
				if (parseInt(dimension.iconShiftDueToSloganDistance) > 0) {
					ab = dimension.iconShiftDueToSloganDistance;

				}
			}
			y = Number(((constantVars.SVGHEIGHT * dimension[type].heightStart / 100) + ab) / scale - bbox.y);
			if (type == "iconFrameBox" && dimension.lastSymbolYDistance != undefined) {
				y = y + dimension.lastSymbolYDistance;
			}

		}
		if (dimension[type].yType == 'center') {
			y = Number((constantVars.SVGHEIGHT * dimension[type].heightStart / 100 + constantVars.SVGHEIGHT * dimension[type].heightPercent / 100) / (2 * scale) - bbox.height / 2 - bbox.y);
			// y = y -200;
		}
		if (dimension[type].yType == 'down') {
			y = Number(((constantVars.SVGHEIGHT * dimension[type].heightStart / 100) + (constantVars.SVGHEIGHT * dimension[type].heightPercent / 100)) / scale - (bbox.height) - bbox.y);
			if (type == "iconFrameBox" && dimension.lastSymbolYDistance != undefined) {
				y = y - dimension.lastSymbolYDistance;
			}
		}

		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		obj = { 'x': x, 'y': y, 'scale': scale };
		return obj;
	}

	/*==== Font case Js ====*/
	/**
	 * for chanign compnay name font and slogan name font
	 */
	$('.companyFontCase').click(function (e) {
		e.stopImmediatePropagation();
		var textCase = $(this).text();
		textCase = textCase.toLowerCase();
		var originalUpdateText = "";
		var updateText = "";

		switch (constantVars.targets[lEditor.getSession('targetlink')]) {
			case "slogan":
				originalUpdateText = $('.editSloganName').val();
				updateText = originalUpdateText;
				switch (textCase) {
					case 'normal': {
						updateText = updateText;
						break;
					}
					case 'caps': {
						updateText = toCapitalize(updateText.toLowerCase());
						break;
					}
					case 'up': {
						updateText = updateText.toUpperCase();
						break;
					}
					case 'low': {
						updateText = updateText.toLowerCase();
						break;
					}

				}
				if (originalUpdateText === updateText) {
					console.log("no need to convert slogan");
					return;
				}
				if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
					lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
				}
				updateLogoText(constantVars.targets[lEditor.getSession('targetlink')], textCase, getSliderValue('sloganTextSize'), getSliderValue('sloganLetterSpacing'), '');
				break;
			case "logo":
				originalUpdateText = $('.editCompanyName').val();

				updateText = originalUpdateText;
				switch (textCase) {
					case 'normal': {
						updateText = updateText;
						break;
					}
					case 'caps': {
						updateText = toCapitalize(updateText.toLowerCase());
						break;
					}
					case 'up': {
						updateText = updateText.toUpperCase();
						break;
					}
					case 'low': {
						updateText = updateText.toLowerCase();
						break;
					}

				}
				if (originalUpdateText === updateText) {
					console.log("no need to convert logo");
					return;
				}
				if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
					lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
				}
				updateLogoText("logoName", textCase, getSliderValue('logoTextSlider'), getSliderValue('logoLetterSpacing'), 'layout');
				break;
		}
	});
	/*=== Change Text on Keyup===*/
	$('.templateText.editCompanyName').keydown(function () {
		clearTimeout(inputTextTimer);
		inputTextTimer = setTimeout(function () {
			if (dh_editor_utility.removeMultipleSpaces($('.templateText.editCompanyName').val()) === dh_editor_utility.removeMultipleSpaces(lEditor.getSession('logoname'))) {
				console.log("no need logo name");
				return;
			}
			onLogoNameTextInput("");
		}, inputTextTime)
	});
	//-------------- changing slogan---------------------  
	$('.templateText.editSloganName').keydown(function () {
		clearTimeout(inputTextTimer);
		inputTextTimer = setTimeout(function () {
			if (dh_editor_utility.removeMultipleSpaces($('.templateText.editSloganName').val()) === dh_editor_utility.removeMultipleSpaces(lEditor.getSession('sloganText'))) {
				console.log("no need sloganText name");
				return;
			}
			onLogoNameTextInput("");
		}, inputTextTime)
	});
	//--------------
	$('.templateText').blur(function (e) {
		clearTimeout(inputTextTimer);
	});
	$('.templateText').on('input', function (e) {
		var type = "";
		if ($(this).hasClass("editSloganName")) {
			type = "slogan";
			if (dh_editor_utility.removeMultipleSpaces($(this).val()) === dh_editor_utility.removeMultipleSpaces(lEditor.getSession('sloganText'))) {
				console.log("no need slogan");
				return;
			}
		} else {
			type = "logo";
			if (dh_editor_utility.removeMultipleSpaces($(this).val()) === dh_editor_utility.removeMultipleSpaces(lEditor.getSession('logoname'))) {
				console.log("no need logo name");
				return;
			}
		}
		if (lEditor.currentLogo.generate.isArc == 1) {

		} else {
			updateTextOnInput(type);
		}
	});
	/**
	 * 
	 * @param {*} p_sType 
	 */
	function updateTextOnInput(p_sType) {
		var fs = 0;
		var ls = 0;
		var svgPath = null;
		var el = null;
		var updatedText;
		var obj;
		var updatedSvgValue = null;
		switch (p_sType) {
			case "logo":
			case "logoName":
				updatedText = dh_editor_utility.removeMultipleSpaces($(".editCompanyName.templateText").val());
				if (updatedText.length == 0) {
					$('.templateText.editCompanyName').val(lEditor.getSession('logoname').charAt(0));
					return;
				}
				fs = parseFloat(lEditor.currentLogo.generate.logoTextSlider);
				ls = parseFloat(lEditor.currentLogo.generate.logoLetterSpacing);

				svgPath = currCompFontObject.getPath(updatedText, 0, 0, fs, { 'letterSpacing': ls });
				el = $('.finaLogoInner .svgLogoName_1');
				el.html(svgPath.toSVG());
				obj = updateGroupSize(el, lEditor.currentLogo.generate.templatePath, 'text', 0);
				updatedSvgValue = "scale(" + obj.scale + ") translate(" + obj.x + "," + obj.y + ")";
				el.attr("transform", updatedSvgValue);
				break;
			case "logoName1":
				updatedText = dh_editor_utility.removeMultipleSpaces($(".dd-ct-line1.templateText").val());
				if (updatedText.length == 0) {
					$(".dd-ct-line1.templateText").val(lEditor.currentLogo.logoName1.charAt(0));
					return;
				}
				fs = parseFloat(lEditor.currentLogo.generate.logoTextSlider);
				ls = parseFloat(lEditor.currentLogo.generate.logoLetterSpacing);
				if (lEditor.currentLogo.generate.logoText1Slider) {
					fs = parseFloat(lEditor.currentLogo.generate.logoText1Slider);
				}
				if (lEditor.currentLogo.generate.logoText1LetterSpacing) {
					ls = parseFloat(lEditor.currentLogo.generate.logoText1LetterSpacing);
				}
				svgPath = currCompFontObject.getPath(updatedText, 0, 0, fs, { 'letterSpacing': ls });
				el = $('.finaLogoInner .svgLogoName_1');
				el.html(svgPath.toSVG());
				obj = updateGroupSize(el, lEditor.currentLogo.generate.templatePath, 'text1', 0);
				updatedSvgValue = "scale(" + obj.scale + ") translate(" + obj.x + "," + obj.y + ")";
				el.attr("transform", updatedSvgValue);
				var changeLogoName = updatedText + " " + lEditor.currentLogo.logoName2;
				$('.company-text-dd').text(changeLogoName);
				break;
			case "logoName2":
				updatedText = dh_editor_utility.removeMultipleSpaces($(".dd-ct-line2.templateText").val());
				if (updatedText.length == 0) {
					$(".dd-ct-line2.templateText").val(lEditor.currentLogo.logoName2.charAt(0));
					return;
				}
				fs = parseFloat(lEditor.currentLogo.generate.logoTextSlider);
				ls = parseFloat(lEditor.currentLogo.generate.logoLetterSpacing);
				if (lEditor.currentLogo.generate.logoText2Slider) {
					fs = parseFloat(lEditor.currentLogo.generate.logoText2Slider);
				}
				if (lEditor.currentLogo.generate.logoText2LetterSpacing) {
					ls = parseFloat(lEditor.currentLogo.generate.logoText2LetterSpacing);
				}
				svgPath = currCompFontObject.getPath(updatedText, 0, 0, fs, { 'letterSpacing': ls });
				el = $('.finaLogoInner .svgLogoName_2');
				el.html(svgPath.toSVG());
				obj = updateGroupSize(el, lEditor.currentLogo.generate.templatePath, 'text2', 0);
				updatedSvgValue = "scale(" + obj.scale + ") translate(" + obj.x + "," + obj.y + ")";
				el.attr("transform", updatedSvgValue);
				var changeLogoName = lEditor.currentLogo.logoName1 + " " + updatedText;
				$('.company-text-dd').text(changeLogoName);
				break;
			case "slogan":
				fs = parseFloat(lEditor.currentLogo.generate.sloganTextSize);
				ls = parseFloat(lEditor.currentLogo.generate.sloganLetterSpacing);
				updatedText = dh_editor_utility.removeMultipleSpaces($(".editSloganName.templateText").val());
				svgPath = currSloganFontObject.getPath(updatedText, 0, 0, fs, { 'letterSpacing': ls });
				el = $('.finaLogoInner .svgSloganText_1');
				el.html(svgPath.toSVG());
				obj = updateGroupSize(el, lEditor.currentLogo.generate.templatePath, 'slogan', 0);
				updatedSvgValue = "scale(" + obj.scale + ") translate(" + obj.x + "," + obj.y + ")";
				el.attr("transform", updatedSvgValue);

				el = $('.finaLogoInner .sampleTexts_1');
				obj = updateGroupSize(el, lEditor.currentLogo.generate.templatePath, 'textAndSlogan', 0);
				updatedSvgValue = "scale(" + obj.scale + ") translate(" + obj.x + "," + obj.y + ")";
				el.attr("transform", updatedSvgValue);
				break;
		}
	}
	/**
	 * 
	 */
	function onLogoNameTextInput(p_sType = "", p_sLogoText) {
		lEditor.currentLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		let checkType = p_sType;
		if (checkType == "") {
			checkType = constantVars.targets[lEditor.getSession('targetlink')];
		}
		var logoTextFS = lEditor.currentLogo.generate.logoTextSlider;
		var logoTextLS = lEditor.currentLogo.generate.logoLetterSpacing;
		switch (checkType) {
			case "slogan":
				if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
					lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
				}
				updateLogoText(checkType, '', getSliderValue('sloganTextSize'), getSliderValue('sloganLetterSpacing'), 'sloganTextEdit');
				break;
			case "undo_redo_slogan":
				updateLogoText(checkType, '', lEditor.currentLogo.generate.sloganTextSize, lEditor.currentLogo.generate.sloganLetterSpacing, "");
				break;
			case "logo":
				if (dh_editor_utility.removeMultipleSpaces($('.editCompanyName').val()) == '') {
					$('.editCompanyName').val(lEditor.getSession('logoname'));
					return false;
				}
				if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
					lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
				}
				updateLogoText(checkType, '', getSliderValue('logoTextSlider'), getSliderValue('logoLetterSpacing'), 'logoTextEdit');
				break;
			case "logoName1":

				if (dh_editor_utility.removeMultipleSpaces($('.dd-ct-line1.templateText').val()) == '') {
					$('.dd-ct-line1.templateText').val(lEditor.currentLogo.logoName1);
					return false;
				}
				if (lEditor.currentLogo.generate.logoText1Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText1Slider;
				}
				if (lEditor.currentLogo.generate.logoText1LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText1LetterSpacing;
				}
				updateLogoText("logoName1", '', logoTextFS, logoTextLS, 'logoText1Edit');
				break;
			case "logoName2":
				if (dh_editor_utility.removeMultipleSpaces($('.dd-ct-line2.templateText').val()) == '') {
					$('.dd-ct-line2.templateText').val(lEditor.currentLogo.logoName2);
					return false;
				}
				if (lEditor.currentLogo.generate.logoText2Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText2Slider;
				}
				if (lEditor.currentLogo.generate.logoText2LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText2LetterSpacing;
				}
				updateLogoText("logoName2", '', logoTextFS, logoTextLS, 'logoText2Edit');
				break;
			case "undo_redo_logoName":
				updateLogoText("logo", '', lEditor.currentLogo.generate.logoTextSlider, lEditor.currentLogo.generate.logoLetterSpacing, 'undo_redo_logoName');
				break;
			case "undo_redo_logoName1":
				if (lEditor.currentLogo.generate.logoText1Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText1Slider;
				}
				if (lEditor.currentLogo.generate.logoText1LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText1LetterSpacing;
				}
				updateLogoText("logoName1", '', logoTextFS, logoTextLS, 'undo_redo_logoName1', '', p_sLogoText);
				break;
			case "undo_redo_logoName2":
				if (lEditor.currentLogo.generate.logoText2Slider) {
					logoTextFS = lEditor.currentLogo.generate.logoText2Slider;
				}
				if (lEditor.currentLogo.generate.logoText2LetterSpacing) {
					logoTextLS = lEditor.currentLogo.generate.logoText2LetterSpacing;
				}
				updateLogoText("logoName2", '', logoTextFS, logoTextLS, 'undo_redo_logoName2', '', p_sLogoText);
				break;
		}
		if (p_sType !== "") {
			editorUndoRedo.showBlocker(false);
		}
	}
	$('.removeSloganText').on('click', function (e) {
		if (dh_editor_utility.removeMultipleSpaces($('#editSloganNameText').val()) != '') {
			$('#editSloganNameText').val('');
			lEditor.setSession('sloganText', '');
			if (version == "vd1" || version == "vd2" || version == "vd3" || version == "vd4") {
				lEditor.removeSloganInSwiperCase();
			} else {
				// lEditor.modifyLogoProperties("sloganText");
				lEditor.newModifyLogoProperties("sloganText");
			}
		}
	});
	/**
	 * remove sloagn name
	 */
	$('.removeSlogan').on('click', function (e) {
		$(this).addClass('hidden');
		onRemoveSlogan();
	});

	function onRemoveSlogan() {
		$('.editSloganName').val('');
		lEditor.setSession('sloganText', '');
		if (lEditor.currentLogo.generate.templatePath.isEqual == 1 && typeof lEditor.currentLogo.generate.templatePath.sloganSetAsPerText != "undefined" && lEditor.currentLogo.generate.templatePath.sloganSetAsPerText == 1) {
			lEditor.currentLogo.generate.templatePath.sloganSetAsPerText = 0;
		}

		logoMakerFunction.resetSlider("textSloganDistSlider", true);
		updateLogoText(constantVars.targets[lEditor.getSession('targetlink')], '', getSliderValue('sloganTextSize'), getSliderValue('sloganLetterSpacing'), 'remove_slogan', "remove_slogan");
	}
	// Change font family
	$('body').on('click', '.commonFont a', function (e) {
		$('.commonFont a').removeClass('active');
		$(this).addClass('active');
		editorParameters = {};
		editorParameters.obj = $(this);
		editorParameters.fors = constantVars.targets[lEditor.getSession('targetlink')];
		loadMoreStart = 0;
		logoByfontFamily(editorParameters);
	});
	//Change layout Section
	$('.layoutSection').on('click', 'li a', function (e) {
		var dataOption = parseInt($(this).data('option'));
		var currLogo = lEditor.currentLogo;
		currLogo.generate.templateType = dataOption;
		currLogo.generate.templatePath = lEditor.sliderData.templates[dataOption];
		if (dataOption == 2) {
			currLogo.generate.iconPath = "";
		}
		lEditor.getCurrentLogo();
	});
	/**
	 * Change Frame Section
	 */
	function sessionData() {
		switch (lEditor.currentStep) {

			case 1: {
				lEditor.currentStep = 2;
				break;
			}
			case 2: {
				var sampleImage = {};
				var arr = [];
				lEditor.cleanSession('sampleImage');
				$('.step_2 .active').each(function () {
					arr.push($(this).data());
				});
				sampleImage = arr;
				if (sampleImage.length != 0) {
					lEditor.setSession('sampleImage', dh_editor_utility.getValidJsonStringifyObj(sampleImage));
					lEditor.currentStep = 3;
				}

				break;
			}
			case 3: {
				var sampleColor = [];
				lEditor.cleanSession('sampleColor');
				$('.step_3 .active').each(function () {
					sampleColor.push($(this).data());
				});
				lEditor.setSession('sampleColor', dh_editor_utility.getValidJsonStringifyObj(sampleColor))
				lEditor.currentStep = 4;
				break;
			}

			case 4: {

				var logoName = dh_editor_utility.removeMultipleSpaces($('#logoname2').val())
				var sloganText = dh_editor_utility.removeMultipleSpaces($('#sloganText').val());
				var industryName = $('#industryName').val();
				var industryText = $('#industryName').text();


				if (industryName) {
					currentSelectedIndustry = $('#industryName option[value="' + industryName + '"]').text();
					if (!currentSelectedIndustry) {
						currentSelectedIndustry = "";
					}
				}

				if (industryName == 2010) {
					var extraIndustry = $('#extraIndustry').val();
					var industryText = $('#extraIndustry').text();
				} else {
					var extraIndustry = $('#search_industry').val();
					var industryText = $('#search_industry').val();
					if (document.querySelector(".select_industry li.active")) {
						lEditor.setSession("search_industry_id", document.querySelector(".select_industry li.active a").getAttribute("data-ind-id"));
					}
				}

				if (lEditor.budgetShowType == 1) {
					sessionStorage.removeItem('budgetType');
					sessionStorage.removeItem('budgetVal');
					sessionStorage.removeItem('budgetId');
					var budgetId = $('#budgetSelected').data('value');
					var budgetType = 1;
					if (budgetId == 'custom') {
						budgetType = 2;
						lEditor.setSession('budgetVal', $('#extraBudget').val());
					} else {
						lEditor.setSession('budgetId', budgetId);
					}
					lEditor.setSession('budgetType', budgetType);

				}
				if (typeof extraIndustry != 'undefined' && (extraIndustry.toLowerCase() == 'wedding service' || extraIndustry.toLowerCase() == 'wedding-service')) {
					extraIndustry = 'wedding';
				}
				if (currentSelectedIndustry) {
					lEditor.setSession('extraIndustry', currentSelectedIndustry);
					lEditor.setSession('industryText', currentSelectedIndustry);
				}

				lEditor.setSession('logoname', logoName);
				lEditor.setSession('industryId', industryName);

				var getLogoName = lEditor.getSession('logoname');
				lEditor.setSession('sloganText', sloganText);
				if (getLogoName == "" || getLogoName == null || getLogoName == "undefined") {
					$(".error-text").show();
					$('.le-s-logoName').addClass('has-error');
				} else {
					$(".error-text").hide();
					$('.le-s-logoName').removeClass('has-error');
					lEditor.currentStep = 5;
					lEditor.iconsData();
				}
				break;
			}
			case 5: {
				var boxLength = 0;
				lEditor.setSession('sampleIcon', dh_editor_utility.getValidJsonStringifyObj({ "si": lEditor.sampleIconArr }));
				lEditor.currentStep = 6;

				break;
			}
			case 6: {
				lEditor.currentStep = 7;
				break;
			}

			case 7: {

				break;
			}
		}

		lEditor.setSession('currPage', lEditor.currentStep);
		lEditor.showStep();
	}
	//Change Frame Section
	$('.containerShapeList').change(function () {

		loadMoreStart = 0;
		logoByContainer();
	});

	$('.containerTypeList').change(function () {
		loadMoreStart = 0;
		logoByContainer();
	});


	$('.containerIconShapeList').change(function () {
		loadMoreStart = 0;
		logoByIconContainer();
	});

	$('.containerIconTypeList').change(function () {
		loadMoreStart = 0;
		logoByIconContainer();
	});
	////////////////////////////////////////////////////////////////////////
	$('body').click(function (e) {
		var targetLen = $(e.target).closest('.containerOptions').length;
		if (targetLen == 0) {
			$('.containerOptions').removeClass('open');
			$('.containerOptions button').removeClass(' btn-purple');
		}
	});
	// Change Color Section
	$('.colorsVariant a').click(function (e) {
		$('.finalogoSlider').html('');
		editorParameters = {};
		editorParameters.id = $(this).data('id');
		editorParameters.color = $(this).data('color');
		loadMoreStart = 0;
		updateColorPickerValue(editorParameters.color, true, "", 0);
		fixedColorVariation(editorParameters);
		$('.commonClrDiv a').removeClass('active');
		$(this).addClass('active');
		$('.previewSection').addClass('hidden');
	});

	$('.colorPaletteButton, .colorPaletteVariants a').click(function (e) {
		$('.finalogoSlider').html('');
		editorParameters = {};
		editorParameters.id = $(this).data('id');
		loadMoreStart = 0;
		palettsColorVariation(editorParameters);
		$('.commonClrDiv a, .colorPaletteButton').removeClass('active');
		$(this).addClass('active');
	});
	$('.colorPicker .colorPickerInput').blur(function (e) {
		console.log("colorPickerInput blur");
	});
	$('.colorPicker .colorPickerInput').focus(function (e) {
		if (dh_editor_utility.removeMultipleSpaces($(this).val()) !== "") {
			$(this).attr("currentVal", $(this).val());
		}
	});
	$('.colorPicker .colorPickerInput').on('input', function (e) {
		console.log("colorPicker colorPickerInput");
	});

	$('.colorPicker .input-group-addon').on('click', function (e) {
		var currentTabTargetLink = lEditor.getSession("targetlink");
		if (currentTabTargetLink == 3 || currentTabTargetLink == "undefined") {
			currentTabTargetLink = 12;
		}
		var inputParentDiv = $(".subChild-" + currentTabTargetLink);
		if (dh_editor_utility.removeMultipleSpaces(inputParentDiv.find('.colorPicker .colorPickerInput').val()) == "") {
			if ($('.finaLogoInner').children().length > 0) {
				$('.colorPicker .input-group-addon').attr("isopen", "yes");
				inputParentDiv.find('.colorPicker .colorPickerInput').val(inputParentDiv.find('.colorPicker .colorPickerInput').attr("currentVal"));
				$(".editFinalLogo").removeClass("hidden");
				$(".editLogoSlider").addClass("hidden");
			} else {

			}
		} else {
			$('.colorPicker .input-group-addon').attr("isopen", "yes");
		}
		var picker = $(this).closest('.colorPicker');
		var colorVal = picker.colorpicker('getValue');
		picker.colorpicker('setValue', colorVal);

	});

	$('.colorPicker').on('colorpickerUpdate', function (e) {
		if ($('.colorPicker .input-group-addon').attr("isopen") == "yes") {
			$('.colorPicker .input-group-addon').attr("isopen", "no");
			return;
		}
		var colorVal = $(this).colorpicker('getValue');
		$('.commonClrDiv a').removeClass('active');
		$('.previewSection').addClass('hidden');

		lEditor.logoSlider('final', 1);
		try {
			colorVariation(colorVal);
			updateColorPickerValue(colorVal, true, "", 0);
		} catch (e) {
			// $('.finaLogoInner').html('');
			$('.colorNotFound').remove();
			$('.editLogoSlider').removeClass('hidden');
			$('.editFinalLogo').addClass('hidden');
			$(".finalogoSlider").html('<div class="result-option colorNotFound">Not a valid Color code !</div>');
		}
	});
	/**
	 * Handling color gradients items click
	 */
	$('.foil--variations.commonClrDiv').click(function (e) {
		var color = $(this).attr('color');
		var targetLink = lEditor.getSession('targetlink');
		var picker = $(this).closest('.colorPicker');
		if (color) {
			$('.commonClrDiv a').removeClass('active');
			$(this).find('a').addClass('active');
			colorGradient(color);
			addRecentColor(targetLink);
			updateColorPickerValue(color, false, "", 0);
		}
		$('.previewSection').removeClass('hidden');
		lEditor.previewColors();
		lEditor.previewLogo();

	});
	/**
	 *  Edit Symbol Section
	 */

	$('.editFinalLogo').click(function (e) {
		e.stopImmediatePropagation();
		hideAllPopover();
	});

	function disableStep7Page(p_bValue) {
		if (p_bValue) {
			$('.step_7').css("pointer-events", "none");
		} else {
			$('.step_7').css("pointer-events", "auto");
		}

	}
	//svg js
	function getOulineJson(className) {
		if ($(".finaLogoInner ." + className).length < 1) {
			return { width: 0, height: 0, left: 0, top: 0 };
		}
		var currBBox = $(".finaLogoInner ." + className)[0].getBoundingClientRect();
		var widths = currBBox.width + 20;
		var heights = currBBox.height;
		heights = 20 + heights;

		var wid = parseFloat(widths);
		var height = parseFloat(heights);
		var divLeft = parseInt($('.svgSlideContent').offset().left);
		var divHeight = parseInt($('.svgSlideContent').offset().top);
		var left = parseInt($(".finaLogoInner ." + className).offset().left) - divLeft - 10;
		var top = parseInt($(".finaLogoInner ." + className).offset().top) - divHeight - 10;

		return { width: wid, height: height, left: left, top: top };
	}

	function updateOutlineStats() {
		var jsonObj = {};

		var currentLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var currLogo = currentLogo.generate;
		if (currLogo.templatePath.isFrame != 0) {
			jsonObj.frame = getOulineJson('container_1');
		}

		if (currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			jsonObj.text = getOulineJson('logoNameBox1');
			if (!(currentLogo.logoName2 == "" || currentLogo.logoName2 == null || typeof (currentLogo.logoName2) === "undefined")) {
				jsonObj.text2 = getOulineJson('logoNameBox2');
			}
		} else {
			if (!(currentLogo.logoName == "" || currentLogo.logoName == null || typeof (currentLogo.logoName) === "undefined")) {
				jsonObj.text = getOulineJson('logoNameBox');
			}
		}


		if (!(currentLogo.sloganName == "" || currentLogo.sloganName == null || typeof (currentLogo.sloganName) === "undefined")) {
			jsonObj.slogan = getOulineJson('sloganBox');
		}

		if ((currLogo.templatePath.isIcon != 0) || (currLogo.templatePath.isMono != 0)) {
			jsonObj.icon = getOulineJson('sampleIcons_1');
		}


		if ((currLogo.templatePath.isIconFrame != 0)) {
			jsonObj.iconFrame = getOulineJson('iconFrame');
		}

		jsonObj.backGround = getOulineJson('svgSlideContent svg');

		return jsonObj;
	}
	$('.editFinalLogo').on('mouseover', '.finaLogoInner svg', function (e) {
		var jsonObj = updateOutlineStats();
		var widForBg = parseFloat(jsonObj.backGround.width) - 40;
		var heightForBg = parseFloat(jsonObj.backGround.height) - 40;
		var leftForBg = 10;
		var topForBg = 10;
		var currentLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var currLogo = currentLogo.generate;

		$('.svgBoderOutline').remove();
		if (currLogo.templatePath.isFrame != 0) {
			$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forContainer" style="width:' + jsonObj.frame.width + 'px; height:' + jsonObj.frame.height + 'px; border:1px solid transparent; z-index:7; opacity:0; left:' + jsonObj.frame.left + 'px; top:' + jsonObj.frame.top + 'px"></div>');
		}

		if (!(currentLogo.logoName == "" || currentLogo.logoName == null || typeof (currentLogo.logoName) === "undefined")) {
			$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forText1" style="width:' + jsonObj.text.width + 'px; height:' + jsonObj.text.height + 'px; border:1px solid transparent;  opacity:0; z-index:8; left:' + jsonObj.text.left + 'px; top:' + jsonObj.text.top + 'px"></div>');
			if (jsonObj.text2) {
				$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forText2" style="width:' + jsonObj.text2.width + 'px; height:' + jsonObj.text2.height + 'px; border:1px solid transparent;  opacity:0; z-index:8; left:' + jsonObj.text2.left + 'px; top:' + jsonObj.text2.top + 'px"></div>');
			}
		}

		if (!(currentLogo.sloganName == "" || currentLogo.sloganName == null || typeof (currentLogo.sloganName) === "undefined")) {
			$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forSlogan" style="width:' + jsonObj.slogan.width + 'px; height:' + jsonObj.slogan.height + 'px; border:1px solid transparent;  opacity:0; z-index:9; left:' + jsonObj.slogan.left + 'px; top:' + jsonObj.slogan.top + 'px"></div>');
		}

		if ((currLogo.templatePath.isIconFrame != 0)) {

			$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forIconFrame" style="width:' + jsonObj.iconFrame.width + 'px; height:' + jsonObj.iconFrame.height + 'px; border:1px solid transparent; opacity:0; z-index:10; left:' + jsonObj.iconFrame.left + 'px; top:' + jsonObj.iconFrame.top + 'px"></div>');
		}
		if (currLogo.templatePath.isIcon != 0 || currLogo.templatePath.isMono != 0) {
			$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forIcon" style="width:' + jsonObj.icon.width + 'px; height:' + jsonObj.icon.height + 'px; border:1px solid transparent; opacity:0; z-index:10; left:' + jsonObj.icon.left + 'px; top:' + jsonObj.icon.top + 'px"></div>');
		}

		$('.svgSlideContent').append('<div class="svgBoderOutline svg-ouline--box svg--outline forbackGround" style="width:' + widForBg + 'px; height:' + heightForBg + 'px; border:1px solid transparent; opacity:0; z-index:6; left:' + leftForBg + 'px; top:' + topForBg + 'px"></div>');
	});

	$('.editFinalLogo').on('mouseenter', '.finaLogoInner .svgBoderOutline', function (e) {
		e.stopImmediatePropagation();
		var jsonObj = updateOutlineStats();
		var widForBg = parseFloat(jsonObj.backGround.width) - 40;
		var heightForBg = parseFloat(jsonObj.backGround.height) - 40;
		var leftForBg = 10;
		var topForBg = 10;
		var classAttr = $(this).attr('class');
		$('.editFinalLogo .svgBoder').remove();
		if ($(this).hasClass('forContainer')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.frame.width + 'px; height:' + jsonObj.frame.height + 'px; border:1px solid #6495ed; left:' + jsonObj.frame.left + 'px; top:' + jsonObj.frame.top + 'px"></div>');
		}
		else if ($(this).hasClass('forText1')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.text.width + 'px; height:' + jsonObj.text.height + 'px; border:1px solid #6495ed; left:' + jsonObj.text.left + 'px; top:' + jsonObj.text.top + 'px"></div>');
		}
		else if ($(this).hasClass('forText2')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.text2.width + 'px; height:' + jsonObj.text2.height + 'px; border:1px solid #6495ed; left:' + jsonObj.text2.left + 'px; top:' + jsonObj.text2.top + 'px"></div>');
		}
		else if ($(this).hasClass('forSlogan')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.slogan.width + 'px; height:' + jsonObj.slogan.height + 'px; border:1px solid #6495ed; left:' + jsonObj.slogan.left + 'px; top:' + jsonObj.slogan.top + 'px"></div>');
		}
		else if ($(this).hasClass('forIconFrame')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.iconFrame.width + 'px; height:' + jsonObj.iconFrame.height + 'px; border:1px solid #6495ed; left:' + jsonObj.iconFrame.left + 'px; top:' + jsonObj.iconFrame.top + 'px"></div>');
		}
		else if ($(this).hasClass('forIcon')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + jsonObj.icon.width + 'px; height:' + jsonObj.icon.height + 'px; border:1px solid #6495ed; left:' + jsonObj.icon.left + 'px; top:' + jsonObj.icon.top + 'px"></div>');
		}

		else if ($(this).hasClass('forbackGround')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoder svg--outline" style="width:' + widForBg + 'px; height:' + heightForBg + 'px; border:1px solid #6495ed; left:' + leftForBg + 'px; top:' + topForBg + 'px"></div>');
		}

	});

	$('.editFinalLogo').on('click', '.finaLogoInner .svgBoderOutline', function (e) {

		e.stopImmediatePropagation();
		var targetLink, defaultlink, left, top, wid, height;
		var jsonObj = updateOutlineStats();
		var targetLink = lEditor.getSession('targetlink');
		var parentLink = lEditor.getSession('parentlink');

		jsonObj.backGround.width = parseFloat(jsonObj.backGround.width) - 40;
		jsonObj.backGround.height = parseFloat(jsonObj.backGround.height) - 40;
		jsonObj.backGround.top = 10;
		jsonObj.backGround.left = 10;
		var boundary = {};

		var classAttr = $(this).attr('class');
		$('.editFinalLogo .svgBoderActive').remove();

		if ($(this).hasClass('forContainer')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.frame.width + 'px; height:' + jsonObj.frame.height + 'px; border:1px solid lime; left:' + jsonObj.frame.left + 'px; z-index:11; top:' + jsonObj.frame.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-16').trigger('click');
				//var getSessionDft = $('[data-target="16"').offset().left;
				//$('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-6').trigger('click');
				lEditor.setSession('defaultlink', 24);

				// var getSessionDft = $('.topParent-6').offset().left;
				// $('.tabel-menu-1').stop().animate({scrollLeft : getSessionDft }); 
			}

			boundary = jsonObj.frame;

		}
		else if ($(this).hasClass('forText1')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.text.width + 'px; height:' + jsonObj.text.height + 'px; border:1px solid lime; left:' + jsonObj.text.left + 'px; z-index:11; top:' + jsonObj.text.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-13').trigger('click');
				// var getSessionDft = $('[data-target="13"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-2').trigger('click');

				// var getSessionDft = $('[data-target="7"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });

				// var getSessionTgt = $('.topParent-2').offset().left - 30;
				//$('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });
			}

			boundary = jsonObj.text;

		}
		else if ($(this).hasClass('forText2')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.text2.width + 'px; height:' + jsonObj.text2.height + 'px; border:1px solid lime; left:' + jsonObj.text2.left + 'px; z-index:11; top:' + jsonObj.text2.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-13').trigger('click');
				// var getSessionDft = $('[data-target="13"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-2').trigger('click');

				// var getSessionDft = $('[data-target="7"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });

				// var getSessionTgt = $('.topParent-2').offset().left - 30;
				//$('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });
			}
			boundary = jsonObj.text2;
		}
		else if ($(this).hasClass('forSlogan')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.slogan.width + 'px; height:' + jsonObj.slogan.height + 'px; border:1px solid lime; left:' + jsonObj.slogan.left + 'px; z-index:11; top:' + jsonObj.slogan.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-14').trigger('click');
				// var getSessionDft = $('[data-target="14"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-2').trigger('click');
				lEditor.setSession('defaultlink', 9);
				lEditor.setSession('targetlink', 9);

				//  var getSessionDft = $('[data-target="9"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });

				//  var getSessionTgt = $('.topParent-2').offset().left - 30;
				//  $('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });
			}

			boundary = jsonObj.slogan;

		}

		else if ($(this).hasClass('forIcon')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.icon.width + 'px; height:' + jsonObj.icon.height + 'px; border:1px solid lime; left:' + jsonObj.icon.left + 'px; z-index:11; top:' + jsonObj.icon.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-15').trigger('click');
				//  var getSessionDft = $('[data-target="15"').offset().left;
				// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-5').trigger('click');
				//  var getSessionTgt = $('[data-target="5"]').offset().left - 30;
				// $('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });

			}
			boundary = jsonObj.icon;

		}
		else if ($(this).hasClass('forIconFrame')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.iconFrame.width + 'px; height:' + jsonObj.iconFrame.height + 'px; border:1px solid lime; left:' + jsonObj.iconFrame.left + 'px; z-index:11; top:' + jsonObj.iconFrame.top + 'px"></div>');
			if (parseInt(targetLink) == 3 || parseInt(parentLink) == 3) {
				$('.subMenu-43').trigger('click');
				//  var getSessionDft = $('[data-target="43"').offset().left;
				//$('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });
			}
			else {
				$('.topParent-6').trigger('click');
				lEditor.setSession('defaultlink', 40);

				// var getSessionTgt = $('[data-target="5"]').offset().left;
				//  $('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });

			}
			boundary = jsonObj.iconFrame;

		}
		else if ($(this).hasClass('forbackGround')) {
			$(this).parents('.svgSlideContent').append('<div class="svgBoderActive svg--outline" style="width:' + jsonObj.backGround.width + 'px; height:' + jsonObj.backGround.height + 'px; border:1px solid lime; left:' + jsonObj.backGround.left + 'px; z-index:11; top:' + jsonObj.backGround.top + 'px"></div>');
			$('.topParent-3').trigger('click');

			// var getSessionDft = $('[data-target="12"').offset().left;
			// $('.subMenuSection .table-menu').stop().animate({scrollLeft : getSessionDft });

			// var getSessionTgt = $('.topParent-3').offset().left - 30;
			// $('.tabel-menu-1').stop().animate({scrollLeft : getSessionTgt });

			boundary = jsonObj.backGround;

		}


		lEditor.setSession('boundary', dh_editor_utility.getValidJsonStringifyObj(boundary));
		lEditor.editLogoSteps();

	});

	$('.editFinalLogo').on('mouseleave', '.svgBoderOutline', function (e) {
		$('.editFinalLogo .svgBoder').remove();
	});

	$('.editFinalLogo').on('mouseleave', '.svgSlideContent', function (e) {
		$('.editFinalLogo .svgBoderOutline').remove();
	});

	$('body').click(function (e) {
		if ($('.editFinalLogo .svgBoderActive').length) {
			$('.editFinalLogo .svgBoderActive').remove();
		}
	});

	function clearOutlineBox() {
		lEditor.cleanSession('boundary');

	}

	function clearOutline() {
		$('.svgBoderActive').remove();
	}
	/*=== For too long text ===*/
	$(".editTags").on('paste keyup input', function () {
	});

	$("#logoname2").on('paste keyup input', function () {
		var inp_txt = $(this).val().trim();
		var inp_len = inp_txt.length;

		if (inp_len >= 17) {
			$(".error-text1").show();
			$(".error-text").hide();
			$('.le-s-logoName').addClass('has-warning').removeClass('has-success has-error');
		}
		else if (inp_len == 0) {
			$(".error-text").show();
			$(".error-text1").hide();
			$('.le-s-logoName').addClass('has-error').removeClass('has-success has-warning');

		}
		else {
			$(".error-text1").hide();
			$(".error-text").hide();
			$('.le-s-logoName').addClass('has-success').removeClass('has-error has-warning');
		}
	});

	$("#sloganText").on('paste keyup', function () {
		var getLength = $(this).val().length;
		if (getLength >= 30) {
			$(".error-text2").show();
			$('.le-s-sloganName').addClass('has-warning');
		}
		else {
			$(".error-text2").hide();
			$('.le-s-sloganName').removeClass('has-warning');
		}
	});

	/*=== For too long text ===*/
	/*=== Set Default Section ===*/

	$('body').on('click', '.setDefaultLogo', function (e) {
		var type = $(this).data('type');
		hideAllPopover();
		var getTargetLink = parseInt(lEditor.getSession('targetlink'));
		let logocurid = $(this).data('id');
		switch (type) {
			case "frame":
				if (getTargetLink !== 44) {
					logoMakerFunction.resetSlider("frameSizeSlider");
				}
				if (getTargetLink === 40) {
					logoMakerFunction.resetSlider("logoSizeSlider");
					logoMakerFunction.resetSlider("iconDistanceSlider");

					logoMakerFunction.resetSlider("sloganTextSize");
					logoMakerFunction.resetSlider("sloganLetterSpacing");
					logoMakerFunction.resetSlider("textSloganDistSlider");
				}
				if (getTargetLink === 24) {
					logoMakerFunction.resetSlider("textSloganDistSlider");
				}
				if (getTargetLink === 44) {
					logoMakerFunction.resetSlider("logoSizeSlider")
				}
				if (getTargetLink === 42) {
					logoMakerFunction.resetSlider("logoSizeSlider");
					logoMakerFunction.resetSlider("textSloganDistSlider")
				}
				break;

			case "color":
				//getTargetLink:=3
				//getTargetLink:=13
				//getTargetLink:=14
				//getTargetLink:=15
				//getTargetLink:=43
				//getTargetLink:=26
				//getTargetLink:=16

				if (getTargetLink == 29) {
					logoMakerFunction.resetSlider("sloganTextSize");
					logoMakerFunction.resetSlider("sloganLetterSpacing");
					logoMakerFunction.resetSlider("textSloganDistSlider");
					logoMakerFunction.resetSlider("logoSizeSlider");
					logoMakerFunction.resetSlider("iconDistanceSlider");
					logoMakerFunction.resetSlider("frameSizeSlider");
				}

				// if (getTargetLink !== 14 && getTargetLink !== 3) {
				// 	logoMakerFunction.resetSlider("sloganTextSize");
				// 	logoMakerFunction.resetSlider("sloganLetterSpacing");
				// 	logoMakerFunction.resetSlider("textSloganDistSlider");
				// }


				// if (getTargetLink !== 15) {
				// 	logoMakerFunction.resetSlider("logoSizeSlider");
				// 	logoMakerFunction.resetSlider("iconDistanceSlider");
				// }
				// if (getTargetLink !== 16 && getTargetLink !== 26) {
				// 	logoMakerFunction.resetSlider("frameSizeSlider");
				// }
				break;

			case "logo":
				if (getTargetLink == 8) {
					// logoMakerFunction.resetSlider("logoTextSlider");
					// logoMakerFunction.resetSlider("logoLetterSpacing");
				} else {
					logoMakerFunction.resetSlider("logoTextSlider");
					logoMakerFunction.resetSlider("logoLetterSpacing");
				}
				break;

			case "slogan":
				if (getTargetLink == 10) {

				} else {
					logoMakerFunction.resetSlider("sloganTextSize");
					logoMakerFunction.resetSlider("sloganLetterSpacing");
					logoMakerFunction.resetSlider("textSloganDistSlider");
				}

				break;
			case "monogram-update":
				logoMakerFunction.resetSlider("iconDistanceSlider");
				if (getTargetLink !== 39) {
					logoMakerFunction.resetSlider("frameSizeSlider");
					logoMakerFunction.resetSlider("logoSizeSlider");
				}
				if (getTargetLink === 32) {
					logoMakerFunction.resetSlider("sloganTextSize");
					logoMakerFunction.resetSlider("sloganLetterSpacing");
					logoMakerFunction.resetSlider("textSloganDistSlider");
				}
				if (getTargetLink == 39) {
					logoMakerFunction.resetSlider("logoSizeSlider");
				}
				break;

			case "icon":
				if (getTargetLink === 27) {
					logoMakerFunction.resetSlider("logoSizeSlider");
					logoMakerFunction.resetSlider("iconDistanceSlider");
					logoMakerFunction.resetSlider("textSloganDistSlider");
				}
				else if (getTargetLink === 31) {
					if (lEditor.currentLogo.generate.templatePath.isFrame == 1) {
						logoMakerFunction.resetSlider("logoTextSlider");
					}
					logoMakerFunction.resetSlider("sloganTextSize");
					logoMakerFunction.resetSlider("sloganLetterSpacing");
					logoMakerFunction.resetSlider("textSloganDistSlider");
					logoMakerFunction.resetSlider("frameSizeSlider");
					logoMakerFunction.resetSlider("logoSizeSlider");
				}
				if (lEditor.searchIconArr && lEditor.searchIconArr.length > 0 && lEditor.searchIconArr[logocurid]) {
					lEditor.cleanSession('searchicon');
					lEditor.setSession('searchicon', dh_editor_utility.getValidJsonStringifyObj({ "si": lEditor.searchIconArr[logocurid] }));
				}
				break;

			case undefined:
				logoMakerFunction.resetSlider("logoTextSlider");
				logoMakerFunction.resetSlider("logoLetterSpacing");

				logoMakerFunction.resetSlider("sloganTextSize");
				logoMakerFunction.resetSlider("sloganLetterSpacing");

				logoMakerFunction.resetSlider("textSloganDistSlider");

				logoMakerFunction.resetSlider("logoSizeSlider");
				logoMakerFunction.resetSlider("iconDistanceSlider");

				logoMakerFunction.resetSlider("frameSizeSlider");
				break;

		}

		lEditor.saveDefaultLogo($(this).data('id'), type, getTargetLink);
		if (type == 'logo') {
			lEditor.updateFontsObject('logo');
			lEditor.updateFontsObject('logoName2');
		} else if (type == 'slogan') {
			lEditor.updateFontsObject('slogan');
		}
		var tempLogoId = $(this).parents('.logoSlides').find('.iconFav').attr('data-logo-id');
		if (tempLogoId > 0) {
			lEditor.setCurrentLogoId(tempLogoId);
		}
		$('.setDefaultLogo').removeClass('active');
		$(this).addClass('active');
		lEditor.alertMessages('success', 'Saving');


		if (type == 'color') {
			addRecentColor(getTargetLink);
			$('.previewSection').removeClass('hidden');
			lEditor.previewColors();
			lEditor.previewLogo();

		}

		if (type == undefined) {
			// case when we go in generate more logos and click on update to this button


		}

		switch (getTargetLink) {
			case 8: {
				$('.topParent-2').trigger('click');
				break;
			}
			case 10: {
				$('.topParent-2').trigger('click');
				lEditor.setSession('defaultlink', 9);
				lEditor.setSession('targetlink', 9);
				break;
			}
			case 42:
			case 24: {
				$('.topParent-6').trigger('click');
				lEditor.setSession('targetlink', 6);
				lEditor.setSession('defaultlink', 24);
				$(".containerOptions").removeClass('active');
				break;
			}
			case 44:
			case 40: {
				$('.topParent-6').trigger('click');
				lEditor.setSession('targetlink', 6);
				lEditor.setSession('defaultlink', 40);
				$(".innerContainerOptions").removeClass('active');
				break;
			}
			case 29: {

				lEditor.setSession('targetlink', 1);
				$('.topParent-2').trigger('click');
				break;
			}
			case 30: {
				$('.topParent-2').trigger('click');
				break;
			}
			case 26: {
				$('.topParent-2').trigger('click');
				break;
			}
			case 3: {
				$('.topParent-3').trigger('click');
				break;
			}
			case 5:
			case 27: {
				$('.subMenu-31').trigger('click');
				break;
			}
			case 39:
			case 32: {
				$('.subMenu-32').trigger('click');
				$('.previewSection').removeClass('hidden');
				break;
			}
			case 13:
			case 14:
			case 15:
			case 16: {
				$('.topParent-3').trigger('click');
				lEditor.setSession('defaultlink', 12);
				break;
			}
		}

		if (type == undefined) {
			// logoMakerFunction.resetSildersNew("companyname");
			// logoMakerFunction.resetSildersNew("companyslogan");
			lEditor.updateFontsObject('logo')
				.then(_ => {
					lEditor.updateFontsObject('logoName2').then(_ => {
						lEditor.updateFontsObject('slogan').then(_ => {
							lEditor.updateFontsObject('mono').then(_ => {
								lEditor.editLogoSteps();
							});
						});
					});
				})
		} else {
			lEditor.editLogoSteps();
		}
	});

	$('.iconClose').click(function (e) {
		$('.commonNotification').removeClass('active');
	});

	$('.removeIcon').click(function (e) {
		var currLogo = lEditor.currentLogo;
		currLogo.generate.iconPath = "";
		currLogo.generate.templatePath.isIcon = 0;
		var returnObj = logoMakerFunction.generateLogoTemplate(currLogo.generate);
		lEditor.setDefaultLogo(currLogo, currLogo.generate);
		lEditor.getCurrentLogo();

	});


	/*=== Buy Now Button ====*/
	$('.buyNowBtn, .previewPurchase, .previewGetstarted').click(function (e) {
		e.stopImmediatePropagation();
		if (DH.isLogged == 0 && DH.userId == 0) {
			clearTimeout(loginPopupTimer);
			userLoginPopup();
			$('body').addClass('logo-modal-unset');
			return;
		}
		if (lEditor.currentStep == 7) {
			let curr_logo = { ...lEditor.currentLogo };
			let alertMSG = "";
			if (curr_logo && curr_logo.generate.bgColor) {
				if ((curr_logo.generate.templatePath.isFrame == 1) && (curr_logo.generate.templatePath.frameType == "filled")) {
					if (curr_logo.generate.bgColor === curr_logo.generate.frameFilledColor) {
						alertMSG = "In your Logo frame color is mix with background color.";
					}
				} else {
					if ((curr_logo.generate.bgColor === curr_logo.generate.mainTextColor) ||
						(curr_logo.generate.bgColor === curr_logo.generate.mainText2Color) ||
						(curr_logo.generate.bgColor === curr_logo.generate.iconColor) ||
						(curr_logo.generate.bgColor === curr_logo.generate.frameColor)) {
						alertMSG = "In your Logo other elements color is mix with background color.";
					}
				}
			}
			if (alertMSG) {
				dh_utility_common.alert({ type: 'error', message: alertMSG });
				$('#loadere').show();
				setTimeout(() => {
					goForPurchase(null, null);
				}, 3000);
			} else {
				$('#loadere').show();
				goForPurchase(null, null);
			}
		} else {
			$('#loadere').show();
			goForPurchase(null, null);
		}
	});
	/**
	 * 
	 */
	function jumpOnBuyFromStep6(currentid, swiperIndex) {
		if (DH.isLogged == 0 && DH.userId == 0) {
			clearTimeout(loginPopupTimer);
			userLoginPopup(function () {
				goForPurchase(currentid, swiperIndex);
			});
			$('body').addClass('logo-modal-unset');
			return;
		} else {
			goForPurchase(currentid, swiperIndex);
		}
	}
	function goForPurchase(p_nCurrentid, p_nSwiperIndex) {
		showWarning = false;
		if (lEditor.currentStep == 6) {
			var selectedLogo;
			var numId;
			var swiperIndex;
			if (p_nCurrentid) {
				numId = p_nCurrentid;
			} else {
				if (p_nCurrentid == 0) {
					numId = p_nCurrentid;
				} else {
					numId = parseInt($(".step6-preview-section").find('.finaLogoInner').attr("currentid"));
				}
			}
			if (p_nSwiperIndex) {
				swiperIndex = p_nSwiperIndex;
			} else {
				if (p_nSwiperIndex == 0) {
					swiperIndex = p_nSwiperIndex;
				} else {
					swiperIndex = parseInt($(".step6-preview-section").find('.finaLogoInner').attr("swiper_currentid"));
				}
			}
			if (version === "vd2" || version == "vd4" || version === "vd1" || version == "vd3") {
				selectedLogo = lEditor.swiperLogoTempArr[numId][swiperIndex];
			} else {
				selectedLogo = lEditor.logoTempArr[numId];
			}

			lEditor.storeStep6RandomLogic();

			var dataAnalysisObj = dh_editor_utility.getDataAnalsyis(selectedLogo, false);
			dataAnalysisObj.buyFrom = lEditor.currentStep;
			var logoJSONObj = lEditor.validateJSON(selectedLogo, dataAnalysisObj);
			const curr_logo_blob = new Blob([JSON.stringify(logoJSONObj)], {
				type: "application/json;charset=utf-8"
			});
			const svg_logo_blob = new Blob([logoMakerFunction.getFinalLogoTemplate(selectedLogo.generate, true)], { type: 'image/svg+xml' });
			dh_lm_save.saveAction(0, curr_logo_blob, svg_logo_blob, null, null, true, true, JSON.stringify(dataAnalysisObj), JSON.stringify(dh_editor_utility.createLogging("at step_6 on purchase click"))).then((p_oJSON) => {
				let json = dh_editor_utility.getValidJsonParseObj(p_oJSON);
				if (json.status == 0) {
					dh_utility_common.alert({ type: 'error', message: 'Cannot purchase selected logo.' });
				} else {
					var retLogoId = json.data.logo_id;
					let purchaseUrl = DH.baseURL + '/tools/logo-maker/payment?logoid=' + (parseInt(retLogoId) * 11);
					if (version == '') {
						purchaseUrl += '&utm_source=logo_maker_purchase_button&utm_medium=logo_maker_payment_button&utm_campaign=logo_maker_purchase_button&utm_term=purchase';
					}
					window.location.href = purchaseUrl;
				}
				dh_editor_utility.clearException();
			});
		} else {
			if (lEditor.getCurrentLogoId() == 'undefined') {
			} else {
				var logoId = lEditor.getCurrentLogoId();
				logoId = parseInt(logoId) * 11;
				window.location.href = DH.baseURL + '/tools/logo-maker/payment?logoid=' + logoId;
			}
		}
	}

	$('.downloadFilesBtn').click(function () {
		if (lEditor.getCurrentLogoId() != 'undefined') {
			var logoId = lEditor.getCurrentLogoId();
			logoId = parseInt(logoId) * 11;

			window.location = DH.baseURL + '/my-logos/files/' + logoId;
		}
	});


	Array.prototype.containObject = function (obj) {
		var i = this.length;
		while (i--) {
			if (this[i] === obj) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 
	 * @param {*} p_sType 
	 */
	function addEditOptions(p_sType) {
		switch (p_sType) {
			case "icon":
				$('.iconVsTextSlider').removeClass('disabled');
				$('[data-option=".symbolContainer"]').text('Edit Symbol');
				$('[data-option=".symbolVariations"]').text('Change Symbol');
				$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
				break;
			case "mono":
				$('.iconVsTextSlider').removeClass('disabled');
				$('[data-option=".monogramContainer"]').text('Edit Monogram');
				$('[data-option=".monoVariations"]').text('Change Monogram');
				$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
				break;
			case "outer_frame":
				$('.frameSizeSlider').removeClass('disabled');
				break;
			case "all":
				var currentLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
				var currLogo = currentLogo.generate;
				if (currLogo.templatePath.isIcon != 1) {
					$('.iconVsTextSlider').addClass('disabled');
					$('[data-option=".symbolContainer"]').text('Add Symbol');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').addClass('disabled');
				} else {
					$('.iconVsTextSlider').removeClass('disabled');
					$('[data-option=".symbolContainer"]').text('Edit Symbol');
					$('[data-option=".symbolVariations"]').text('Change Symbol');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
				}

				if (currLogo.templatePath.isMono != 1) {
					$('.iconVsTextSlider').addClass('disabled');
					$('[data-option=".monogramContainer"]').text('Add Monogram');
				} else {
					$('.iconVsTextSlider').removeClass('disabled');
					$('[data-option=".monogramContainer"]').text('Edit Monogram');
					$('[data-option=".monoVariations"]').text('Change Monogram');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
				}

				if (currLogo.templatePath.isMono != 1 && currLogo.templatePath.isIcon != 1) {
					$(".subMenu-40").parent().addClass('disabled');
				} else {
					$(".subMenu-40").parent().removeClass('disabled');

				}
				if (currLogo.templatePath.isFrame != 1) {
					$('.frameSizeSlider').addClass('disabled');

				} else {
					$('.frameSizeSlider').removeClass('disabled');
				}
				break;
		}
	}
	// logo listing by icon frames   

	function logoByIconContainer(p_fCallBack) {
		var limit = 10;
		var dataOption = $('.containerSection li.active a').data('frame');
		var currLogo = lEditor.currentLogo;
		var currContainerBodyObj = currLogo.generate.templatePath.updates.containerBody;
		var isFrameExist = currLogo.generate.templatePath.isFrame;
		if (dataOption == 'none') {

			var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			let oldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));

			currLogo.iconFrameId = "";
			currLogo.generate.iconFramePath = "";
			currLogo.generate.templatePath.isIconFrame = 0;
			lEditor.getCurrentLogo();
			lEditor.setDefaultLogo(currLogo, currLogo.generate);

			var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));


			var isIcon = 0;
			var isMono = 0;
			var isFrame = 0;
			var isIconFrame = 0;
			var isEqual = 0;
			if (typeof logoTemp.generate.templatePath.isIcon !== "undefined") {
				isIcon = logoTemp.generate.templatePath.isIcon;
			}
			if (typeof logoTemp.generate.templatePath.isMono !== "undefined") {
				isMono = logoTemp.generate.templatePath.isMono;
			}
			if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
				isFrame = logoTemp.generate.templatePath.isFrame;
			}
			if (typeof logoTemp.generate.templatePath.isIconFrame !== "undefined") {
				isIconFrame = logoTemp.generate.templatePath.isIconFrame;
			}
			if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
				isEqual = logoTemp.generate.templatePath.isEqual;
			}
			var isFrameExist = logoTemp.generate.templatePath.isFrame;
			var type = 0;

			var isDBLineCompanyText = "no";
			if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes") {
				isDBLineCompanyText = logoTemp.generate.templatePath.isDBLineCompanyText;
			}
			switch (logoTemp.generate.templatePath.iconFrame.type) {
				case "center":
					switch (logoTemp.generate.templatePath.iconFrame.yType) {
						case "up":
							type = 4;
							break;
						case "down":
							type = 0;
							break;
					}
					break;
				case "left":
					type = 1;
					break;
				case "right":
					type = 2;
					break;
			}

			var templates = getTemplatesByType(type, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText)[0];

			$.each(templates, function (k, v) {
				logoTemp.generate.templatePath = v;
				logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
				logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
				logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
				logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;

				if (oldLogoObj.generate.isArc == 1 && logoTemp.generate.templatePath.isSupportCurveText != 1) {
					let logo1 = currCompFontObject.getPath(logoTemp.logoName, 0, 0, logoTemp.generate.logoTextSlider, { 'letterSpacing': parseFloat(logoTemp.generate.logoLetterSpacing) });
					logoTemp.generate.logoPath = logo1.toSVG();
					delete logoTemp.generate.isArc;
					delete logoTemp.generate.arcValue;
					delete logoTemp.generate.curveTextActualPathHeight;
					delete logoTemp.generate.curveTextCenterWidth;

				}


				if (isFrameExist == 1) {
					logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;
					logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;
					logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;
					logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
				}
				var idKey = logoMakerFunction.genRandomId();
				logoTemp.generate.idKey = idKey;
				//var returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, currContainerBodyObj, true, "innerContainerRemove"); comment to solved DW-2015
				var returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "innerContainerRemove");
				let originalReturnObj = Object.assign({}, returnObj);
				logoTemp.generate = returnObj.logoObj;
				$('.finaLogoInner').html('<div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj.html + '<div class="bgOutlineBox bg-outline-box"></div></div>');

				if (originalReturnObj.logoObj.isArc == 1 && originalReturnObj.logoObj.templatePath.isSupportCurveText == 1) {
					$('.finaLogoInner .logoContainerBox .svgSloganText_1').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.slogan.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.slogan.x + "," + (originalReturnObj.logoObj.templatePath.updates.slogan.y) + ")");
					if ((originalReturnObj.logoObj.templatePath.isIcon == 1) || (originalReturnObj.logoObj.templatePath.isMono == 1)) {
						$('.finaLogoInner .logoContainerBox .sampleIconBox').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.x + "," + (originalReturnObj.logoObj.templatePath.updates.iconFrameBox.y) + ")");
					}
				}

				currObj = updateCurrLogoObject(logoTemp);
				lEditor.setDefaultLogo(currObj, currObj.generate, function () {
					let newLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
					editorUndoRedo.setUndoActData(INNER_CONTAINER_REMOVE, oldLogoObj, newLogoObj)
				});
			});
			addEditOptions("all");
			$('#saveIcon').trigger('click');
		}

		if (dataOption == 'inner') {
			var frameList = [];

			var i = 0;

			var type = 'iconFrame';
			loadMoreStart++;

			if (loadMoreStart == 1) {
				lEditor.logoTempArr = [];
				lEditor.logoSlider('final', 1);
			}

			var j = (loadMoreStart - 1) * 10;

			jqXHR = $.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: { action: 'iconframes', 'type': $('.containerIconTypeList').val(), 'shape': $('.containerIconShapeList').val(), start: loadMoreStart },
				async: true,
				success: function (json) {
					// $('.load--more--class').remove();
					json = dh_editor_utility.getValidJsonParseObj(json);
					if (json.status == 0) {

					} else {
						var frameList = json.data.frames;
						var frameLength = frameList.length;
						if (frameLength == 0) {
							return false;
						}
						var templateIdStyle = getTempStyle();

						$.each(frameList, function (k, v) {
							var tempType = "new";
							var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
							logoTemp.iconFrameId = v.icon_frame_id;
							logoTemp.generate.iconFramePath = v.icon_frame_svg;
							if (logoTemp.generate.templatePath.isIconFrame == 1) {
								logoTemp.generate.templatePath.sloganSetAsPerText = logoTemp.generate.templatePath.sloganSetAsPerText;
								tempType = "old";
							} else {
								var isMono = 0;
								var isIcon = 0;
								var isFrame = 0;
								var isIconFrame = 1;
								var isEqual = 0;
								var frameType = "";
								var frameOverlap = "";
								var frame_width = "";
								var frame_height = "";
								var frameShapeName = "";
								var frmId = "";
								var templateDirection = "";
								var sloganSetAsPerText = 0;
								if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
									isFrame = logoTemp.generate.templatePath.isFrame;  // have tobechange
								}
								if (typeof logoTemp.generate.templatePath.isIcon !== "undefined") {
									isIcon = logoTemp.generate.templatePath.isIcon;
								}
								if (typeof logoTemp.generate.templatePath.isMono !== "undefined") {
									isMono = logoTemp.generate.templatePath.isMono;
								}
								if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
									isEqual = logoTemp.generate.templatePath.isEqual;
								}
								if (logoTemp.generate.templatePath.frameType !== "") {
									frameType = logoTemp.generate.templatePath.frameType;
								}
								if (logoTemp.generate.templatePath.frameOverlap !== "") {
									frameOverlap = logoTemp.generate.templatePath.frameOverlap;
								}
								if (logoTemp.generate.templatePath.frame_width !== "") {
									frame_width = logoTemp.generate.templatePath.frame_width;
								}
								if (logoTemp.generate.templatePath.frame_height !== "") {
									frame_height = logoTemp.generate.templatePath.frame_height;
								}
								if (logoTemp.generate.templatePath.frameShapeName !== "") {
									frameShapeName = logoTemp.generate.templatePath.frameShapeName;
								}
								if (logoTemp.generate.templatePath.frmId !== "") {
									frmId = logoTemp.generate.templatePath.frmId;
								}
								if (typeof logoTemp.generate.templatePath.template_direction !== "undefined") {
									templateDirection = logoTemp.generate.templatePath.template_direction;

								}
								if (typeof logoTemp.generate.templatePath.sloganSetAsPerText !== "undefined") {
									sloganSetAsPerText = logoTemp.generate.templatePath.sloganSetAsPerText;

								}
								var isDBLineCompanyText = "no";
								if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes") {
									isDBLineCompanyText = logoTemp.generate.templatePath.isDBLineCompanyText;
								}
								var templates = getTemplatesByType(templateDirection, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText)[0];
								logoTemp.generate.templatePath = templates[0];
								logoTemp.generate.templatePath.frameType = frameType;
								logoTemp.generate.templatePath.frameOverlap = frameOverlap;
								logoTemp.generate.templatePath.frame_width = frame_width;
								logoTemp.generate.templatePath.frame_height = frame_height;
								logoTemp.generate.templatePath.frameShapeName = frameShapeName;
								logoTemp.generate.templatePath.frmId = frmId;
								logoTemp.generate.templatePath.sloganSetAsPerText = sloganSetAsPerText;
								logoTemp.generate.templatePath.isDBLineCompanyText = isDBLineCompanyText;
							}

							var idKey = logoMakerFunction.genRandomId();
							logoTemp.generate.idKey = idKey;
							var returnObj = null;
							if (tempType == "old") {
								if (currLogo.generate.isArc == 1) {
									returnObj = logoMakerFunction.generateLogoTemplateForArcLogo(logoTemp.generate, idKey, type, "changeIconFrameContainer");
								} else {
									returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, null, null, "changeIconFrameContainer");
								}
								logoTemp.generate = returnObj.logoObj;
							} else {
								returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "addInnerContainer");
								logoTemp.generate = returnObj.logoObj;
							}

							let originalReturnObj = Object.assign({}, returnObj);
							currObj = updateCurrLogoObject(logoTemp);
							lEditor.logoTempArr[j] = dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(currObj));

							var templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);
							let iconFrmIndex = j++;
							slickElement = '<div class="logos--boxes" data-index="' + (iconFrmIndex) + '" data-frmid = "' + v.icon_frame_id + '"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type = "frame" data-id="' + (iconFrmIndex) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
							$(".finalogoSlider").append(slickElement);

							if (originalReturnObj.logoObj.isArc == 1 && originalReturnObj.logoObj.templatePath.isSupportCurveText == 1) {
								$('.finalogoSlider .logos--boxes[data-index="' + iconFrmIndex + '"] .svgSloganText_1').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.slogan.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.slogan.x + "," + (originalReturnObj.logoObj.templatePath.updates.slogan.y) + ")");
								if ((originalReturnObj.logoObj.templatePath.isIcon == 1) || (originalReturnObj.logoObj.templatePath.isMono == 1)) {
									$('.finalogoSlider .logos--boxes[data-index="' + iconFrmIndex + '"] .sampleIconBox').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.x + "," + (originalReturnObj.logoObj.templatePath.updates.iconFrameBox.y) + ")");
								}
							}

							dh_utility_common.changeBg();
							i++;
							if (json.pagination == 1 && i == frameLength) {
								if ($('.load--more--class').length) {
									$('.load--more--class').remove();
								}
								$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreIconFrames load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
								if (p_fCallBack) {
									p_fCallBack();
								}
							} else {
								if (i === 1) {
									if ($('.load--more--class').length) {
										$('.load--more--class').remove();
									}
								}
								if (json.pagination == 0) {
									if (p_fCallBack) {
										p_fCallBack();
									}
								}
							}
							$('.finaLogoInner').html('');
						});
					}
				}
			});
		}
	}

	// logo lisiting by frames
	function logoByContainer(p_fCallBack) {
		var limit = 10;
		var dataOption = $('.containerSection li.active a').data('frame');
		var currLogo = lEditor.currentLogo;
		if (dataOption == 'none') {

			let oldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));

			currLogo.frmId = "";
			currLogo.generate.framePath = "";
			currLogo.generate.templatePath.isFrame = 0;
			currLogo.generate.templatePath.frameType = "";
			currLogo.generate.templatePath.frameOverlap = "";
			currLogo.generate.templatePath.frame_width = "";
			currLogo.generate.templatePath.frame_height = "";
			currLogo.generate.templatePath.frameShapeName = "";
			currLogo.generate.templatePath.frmId = "";
			lEditor.getCurrentLogo();
			lEditor.setDefaultLogo(currLogo, currLogo.generate);

			var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			var isIcon = 0;
			var isMono = 0;
			var isFrame = 0;
			var isIconFrame = 0;
			var isEqual = 0;
			var templateDirection = 0;
			if (typeof logoTemp.generate.templatePath.isIcon !== "undefined") {
				isIcon = logoTemp.generate.templatePath.isIcon;
			}
			if (typeof logoTemp.generate.templatePath.isMono !== "undefined") {
				isMono = logoTemp.generate.templatePath.isMono;
			}
			if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
				isFrame = logoTemp.generate.templatePath.isFrame;
			}
			if (typeof logoTemp.generate.templatePath.isIconFrame !== "undefined") {
				isIconFrame = logoTemp.generate.templatePath.isIconFrame;
			}
			if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
				isEqual = logoTemp.generate.templatePath.isEqual;

			}
			if (typeof logoTemp.generate.templatePath.template_direction !== "undefined") {
				templateDirection = logoTemp.generate.templatePath.template_direction;

			}
			var isFrameExist = logoTemp.generate.templatePath.isFrame;
			var isDBLineCompanyText = "no";
			if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes") {
				isDBLineCompanyText = logoTemp.generate.templatePath.isDBLineCompanyText;
			}

			if (oldLogoObj.generate.templatePath.frameType === "filled") {
				if (oldLogoObj.generate.frameFilledGradient) {
					if (gradientsArray[oldLogoObj.generate.frameFilledGradient]) {
						logoTemp.generate.bgColor = gradientsArray[oldLogoObj.generate.frameFilledGradient]["stops"][0]["color"];
					} else {
					}
				} else {
					logoTemp.generate.bgColor = oldLogoObj.generate.frameFilledColor;
				}
			}
			var templates = getTemplatesByType(templateDirection, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText)[0];
			if (templates.length > 0) {
				$.each(templates, function (k, v) {
					logoTemp.generate.templatePath = v;
					logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
					logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
					if (isFrameExist == 1) {
						logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;
						logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;
						logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;
						logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
					}
					if (oldLogoObj.generate.isArc == 1 && logoTemp.generate.templatePath.isSupportCurveText != 1) {
						let logo1 = currCompFontObject.getPath(logoTemp.logoName, 0, 0, logoTemp.generate.logoTextSlider, { 'letterSpacing': parseFloat(logoTemp.generate.logoLetterSpacing) });
						logoTemp.generate.logoPath = logo1.toSVG();
						delete logoTemp.generate.isArc;
						delete logoTemp.generate.arcValue;
						delete logoTemp.generate.curveTextActualPathHeight;
						delete logoTemp.generate.curveTextCenterWidth;

					}
					logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
					logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
					var idKey = logoMakerFunction.genRandomId();
					logoTemp.generate.idKey = idKey;

					var returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "outerContainerRemove");
					let originalReturnObj = Object.assign({}, returnObj);
					logoTemp.generate = returnObj.logoObj;

					$('.finaLogoInner').html('<div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj.html + '<div class="bgOutlineBox bg-outline-box"></div></div>');

					if (originalReturnObj.logoObj.isArc == 1 && originalReturnObj.logoObj.templatePath.isSupportCurveText == 1) {
						$('.finaLogoInner .logoContainerBox .svgSloganText_1').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.slogan.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.slogan.x + "," + (originalReturnObj.logoObj.templatePath.updates.slogan.y) + ")");
						if ((originalReturnObj.logoObj.templatePath.isIcon == 1) || (originalReturnObj.logoObj.templatePath.isMono == 1)) {
							$('.finaLogoInner .logoContainerBox .sampleIconBox').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.x + "," + (originalReturnObj.logoObj.templatePath.updates.iconFrameBox.y) + ")");
						}
					}
					currObj = updateCurrLogoObject(logoTemp);
					lEditor.setDefaultLogo(currObj, currObj.generate, function () {
						let newLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
						editorUndoRedo.setUndoActData(OUTER_CONTAINER_REMOVE, oldLogoObj, newLogoObj);
					});
					$('#saveIcon').trigger('click');
				});
			} else {
				let newLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
				editorUndoRedo.setUndoActData(OUTER_CONTAINER_REMOVE, oldLogoObj, newLogoObj);
				$('#saveIcon').trigger('click');
			}

		}

		if (dataOption == 'whole') {
			var frameList = [];

			var i = 0;

			var type = 'frame';
			loadMoreStart++;

			if (loadMoreStart == 1) {
				lEditor.logoTempArr = [];
				lEditor.logoSlider('final', 1);
			}

			var j = (loadMoreStart - 1) * 10;

			jqXHR = $.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: { action: 'frames', 'type': $('.containerTypeList').val(), 'shape': $('.containerShapeList').val(), start: loadMoreStart },
				async: true,
				success: function (json) {
					$('.load--more--class').remove();
					json = dh_editor_utility.getValidJsonParseObj(json);
					if (json.status == 0) {

					} else {
						var frameList = json.data.frames;
						var frameLength = frameList.length;
						if (frameLength == 0) {
							return false;
						}
						var templateIdStyle = getTempStyle();
						var templates = getTemplatesByType(lEditor.currentLogo.generate.templatePath.template_direction, lEditor.currentLogo.generate.templatePath.isIcon, lEditor.currentLogo.generate.templatePath.isMono, 1, lEditor.currentLogo.generate.templatePath.isIconFrame, lEditor.currentLogo.generate.templatePath.isEqual, lEditor.currentLogo.generate.templatePath.isDBLineCompanyText)[0];

						$.each(frameList, function (k, v) {
							var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
							logoTemp.generate.templatePath.template_db_id = templates[0].template_db_id;
							logoTemp.generate.templatePath.template_direction = templates[0].template_direction;
							logoTemp.generate.templatePath.template_id = templates[0].template_id;
							if ((currLogo.generate.isArc == 1) && (logoTemp.generate.templatePath.isSupportCurveText != 1)) {
								let logo1 = currCompFontObject.getPath(currLogo.logoName, 0, 0, currLogo.generate.logoTextSlider, { 'letterSpacing': parseFloat(currLogo.generate.logoLetterSpacing) });
								logoTemp.generate.logoPath = logo1.toSVG();
								delete logoTemp.generate.isArc;
								delete logoTemp.generate.arcValue;
								delete logoTemp.generate.curveTextActualPathHeight;
								delete logoTemp.generate.curveTextCenterWidth;
							}
							logoTemp.frmId = v.frame_id;
							logoTemp.generate.templatePath.isFrame = 1;
							logoTemp.generate.framePath = v.frame_svg;
							logoTemp.generate.templatePath.frameType = v.frame_type;
							logoTemp.generate.templatePath.frameOverlap = v.frame_overlap;
							logoTemp.generate.templatePath.frame_width = v.frame_width;
							logoTemp.generate.templatePath.frame_height = v.frame_height;
							logoTemp.generate.templatePath.frmId = v.frame_id;
							logoTemp.generate.templatePath.lastTextDistance = 0;
							logoTemp.generate.templatePath.iconShiftDueToSloganDistance = 0;
							logoTemp.generate.templatePath.frameShapeName = $('.containerShapeList').val();
							if (currLogo.generate.templatePath.isFrame == 1 && currLogo.generate.templatePath.frameType == "filled" && v.frame_type === "outline") {
								if (currLogo.generate.frameFilledGradient) {
									logoTemp.generate.textGradient = currLogo.generate.frameFilledGradient;
									logoTemp.generate.text2Gradient = currLogo.generate.frameFilledGradient;
									logoTemp.generate.sloganGradient = currLogo.generate.frameFilledGradient;
									logoTemp.generate.iconGradient = currLogo.generate.frameFilledGradient;
									logoTemp.generate.frameGradient = currLogo.generate.frameFilledGradient; // outline frame
									logoTemp.generate.iconFrameGradient = currLogo.generate.frameFilledGradient;
								} else {
									logoTemp.generate.mainTextColor = currLogo.generate.frameFilledColor;
									logoTemp.generate.mainText2Color = currLogo.generate.frameFilledColor;
									logoTemp.generate.sloganTextColor = currLogo.generate.frameFilledColor;
									logoTemp.generate.iconColor = currLogo.generate.frameFilledColor;

									logoTemp.generate.frameColor = currLogo.generate.frameFilledColor;
									logoTemp.generate.iconFrameColor = currLogo.generate.frameFilledColor;
								}
							}
							logoTemp.generate.templatePath.sloganSetAsPerText = logoTemp.generate.templatePath.sloganSetAsPerText;
							var idKey = logoMakerFunction.genRandomId();
							logoTemp.generate.idKey = idKey;
							var returnObj;
							if (currLogo.generate.isArc == 1 && logoTemp.generate.templatePath.isSupportCurveText == 1) {
								returnObj = logoMakerFunction.generateLogoTemplateForArcLogo(logoTemp.generate, idKey, type, "addOuterContainer");
							} else {
								returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, null, null, "addOuterContainer");
							}
							let originalReturnObj = Object.assign({}, returnObj);
							logoTemp.generate = returnObj.logoObj;
							currObj = updateCurrLogoObject(logoTemp);
							lEditor.logoTempArr[j] = dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(currObj));

							var templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

							let frmLogoIndex = j++;

							slickElement = '<div class="logos--boxes" data-index="' + frmLogoIndex + '" data-frmid = "' + v.frame_id + '"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type = "frame" data-id="' + (frmLogoIndex) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
							$(".finalogoSlider").append(slickElement);

							if (originalReturnObj.logoObj.isArc == 1 && originalReturnObj.logoObj.templatePath.isSupportCurveText == 1) {
								$('.finalogoSlider .logos--boxes[data-index="' + frmLogoIndex + '"] .svgSloganText_1').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.slogan.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.slogan.x + "," + (originalReturnObj.logoObj.templatePath.updates.slogan.y) + ")");
								if ((originalReturnObj.logoObj.templatePath.isIcon == 1) || (originalReturnObj.logoObj.templatePath.isMono == 1)) {
									$('.finalogoSlider .logos--boxes[data-index="' + frmLogoIndex + '"] .sampleIconBox').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.x + "," + (originalReturnObj.logoObj.templatePath.updates.iconFrameBox.y) + ")");
								}
							}

							dh_utility_common.changeBg();
							i++;
							if (json.pagination == 1 && i == frameLength) {
								$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreFrames load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
								if (p_fCallBack) {
									p_fCallBack();
								}
							} else {
								if (json.pagination == 0) {
									if (p_fCallBack) {
										p_fCallBack();
									}
								}
							}
							$('.finaLogoInner').html('');
						});
					}
				}
			});
		}
	}

	// code for load more 
	$('body').on('click', '.loadMoreFrames', function () {
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		logoByContainer(function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});

	});

	$('body').on('click', '.loadMoreIconFrames', function () {
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		logoByIconContainer(function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});


	$('body').on('click', '.loadMoreEditorIcons', function () {
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		$('.loadMoreEditorIcons, .icons-search-box, .icons-search-box-button').css("pointer-events", "none");
		// lEditor.objIconPage++;
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		if (lEditor.step7SearchIconData.icons && lEditor.step7SearchIconData.icons.length >= 6) {
			lEditor.showIconVariationLogo(function () {
				var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
				$("html, body").animate({
					scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
				}, { duration: 'fast', easing: 'linear' });
			});
		} else {
			let iconSlug = lEditor.getSession('iconValue') || "";
			lEditor.step7SearchIconPage++;
			lEditor.ajaxEditIconsResponse(iconSlug, function () {
				var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
				$("html, body").animate({
					scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
				}, { duration: 'fast', easing: 'linear' });
			});
		}

	});


	$('body').on('click', '.loadMoreDynamicGenerate', function () {
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		lEditor.generateDynamicLogoVariations(function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});

	// logo listing by font families 
	function logoByfontFamily(parameters, p_fCallBack) {

		var workFor = null;
		if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			workFor = $('.subChild-8').find(".company-text-font-box").attr("last_selected");
		}

		var limit = 10;
		var ele = parameters.obj;
		var $for = parameters.fors;
		var categoryId = ele.data('id');
		var letterSpacing = 0;
		var updateText = "";
		loadMoreStart++;

		var templateIdStyle = getTempStyle();

		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'fonts', category_id: categoryId, start: loadMoreStart },
			async: true,
			success: function (json) {
				json = dh_editor_utility.getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					var fontList = json.fonts;
					var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
					var type = "";
					var i = 0;
					var j = (loadMoreStart - 1) * limit;
					if (loadMoreStart == 1) {
						lEditor.logoTempArr = [];
						lEditor.logoSlider('final', 1);
					}
					var currentCompanyText = lEditor.currentLogo.logoName;
					var currentSloganText = lEditor.currentLogo.sloganName;

					var companyTextFS;
					var companyTextLS;

					var companyText1FS;
					var companyText1LS;

					var companyText2FS;
					var companyText2LS;

					var slgoanTextFS
					var slgoanTextLS;
					var logoTextList = lEditor.getLogoTextList(lEditor.currentLogo.generate.splitLogoName);

					if ($for == 'logo') {
						if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
							switch (workFor) {
								case "dd-ct-font-line1":
									companyText1FS = constantVars.ORIGINAL_SPACING.logoTextSlider;
									companyText1LS = parseFloat(constantVars.ORIGINAL_SPACING.logoLetterSpacing);
									break;
								case "dd-ct-font-line2":
									companyText2FS = constantVars.ORIGINAL_SPACING.logoTextSlider;
									companyText2LS = parseFloat(constantVars.ORIGINAL_SPACING.logoLetterSpacing);
									break;
								case "dd-ct-font-overall":
								default:
									companyText1FS = constantVars.ORIGINAL_SPACING.logoTextSlider;
									companyText1LS = parseFloat(constantVars.ORIGINAL_SPACING.logoLetterSpacing);
									companyText2FS = constantVars.ORIGINAL_SPACING.logoTextSlider;
									companyText2LS = parseFloat(constantVars.ORIGINAL_SPACING.logoLetterSpacing);
									break;
							}
						} else {
							companyTextFS = constantVars.ORIGINAL_SPACING.logoTextSlider;
							companyTextLS = parseFloat(constantVars.ORIGINAL_SPACING.logoLetterSpacing);
						}
					} else {
						slgoanTextFS = constantVars.ORIGINAL_SPACING.sloganTextSize;
						slgoanTextLS = parseFloat(constantVars.ORIGINAL_SPACING.sloganLetterSpacing);

					}

					var isEqualCaseSloganLetterSpacing = constantVars.ORIGINAL_SPACING.sloganLetterSpacing;
					if (logoMakerFunction.checkTemplateIsEqualCondition(logoTemp.generate) && logoTemp.generate.templatePath.sloganSetAsPerText == 1) {
						var logoNameLength;
						if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {
							logoNameLength = Math.max(logoTextList[0].length, logoTextList[1].length)
						} else {
							logoNameLength = currentCompanyText.length;
						}
						var sloganNameLength = currentSloganText.length;
						if (logoNameLength >= sloganNameLength) {
							if (sloganNameLength >= 20) {
								isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength) / 2;
							} else {
								isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
							}
						} else if (sloganNameLength >= logoNameLength) {
							if (sloganNameLength / 2 < logoNameLength) {
								isEqualCaseSloganLetterSpacing = (sloganNameLength + logoNameLength);
							}
						}
						slgoanTextLS = isEqualCaseSloganLetterSpacing;
					}


					var fontListLength = fontList.length;
					if (fontListLength == 0) {
						return false;
					}
					var whatChange = "";
					$.each(fontList, function (k, v) {
						opentype.load(v.font_link, function (err, font) {
							try {
								if (err) {
								} else {
									if ($for == 'logo') {
										var logo = null;
										if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes" && logoTextList.length > 0 && logoTextList.length == 2) {

											switch (workFor) {
												case "dd-ct-font-line1":
													logo = font.getPath(logoTextList[0], 0, 0, companyText1FS, { 'letterSpacing': companyText1LS });
													logoTemp.generate.logoPath1 = logo.toSVG();
													logoTemp.generate.textFontType = v.font_link;
													type = "logoName1";
													break;
												case "dd-ct-font-line2":
													logo = font.getPath(logoTextList[1], 0, 0, companyText2FS, { 'letterSpacing': companyText2LS });
													logoTemp.generate.logoPath2 = logo.toSVG();
													logoTemp.generate.text2FontType = v.font_link;
													type = "logoName2";
													break;
												case "dd-ct-font-overall":
												default:
													logo = font.getPath(logoTextList[0], 0, 0, companyText1FS, { 'letterSpacing': companyText1LS });
													logoTemp.generate.logoPath1 = logo.toSVG();
													logo = null;

													logo = font.getPath(logoTextList[1], 0, 0, companyText2FS, { 'letterSpacing': companyText2LS });
													logoTemp.generate.logoPath2 = logo.toSVG();

													logoTemp.generate.textFontType = v.font_link;
													logoTemp.generate.text2FontType = v.font_link;
													type = "logoName";
													break;
											}
										} else {
											if (logoTemp.generate.isArc == 1) {
												const [curvePath, curveModel] = curveLogo.createText(font, currentCompanyText, companyTextFS, companyTextLS, logoTemp.generate.arcValue);
												if (curvePath) {
													curveLogo.updateJSON(curvePath, curveModel, logoTemp.generate, null);
												} else {
													logo = font.getPath(currentCompanyText, 0, 0, companyTextFS, { 'letterSpacing': companyTextLS });
													logoTemp.generate.logoPath = logo.toSVG();
													curveLogo.deleteCorveFromJSON(logoTemp);
												}
											} else {
												logo = font.getPath(currentCompanyText, 0, 0, companyTextFS, { 'letterSpacing': companyTextLS });
												logoTemp.generate.logoPath = logo.toSVG();
											}
											type = "logoName";
											logoTemp.generate.textFontType = v.font_link;
										}
										if (v.font_id) {
											logoTemp.fId = v.font_id;
										}
										whatChange = "logoNameFont"
									} else if ($for == "slogan") {
										var logo = null;
										logo = font.getPath(currentSloganText, 0, 0, slgoanTextFS, { 'letterSpacing': slgoanTextLS });
										logoTemp.generate.sloganFontType = v.font_link;
										logoTemp.generate.sloganPath = logo.toSVG();
										type = "sloganName";
										if (v.font_id) {
											logoTemp.sfId = v.font_id;
										}
										whatChange = "sloganNameFont"
									}
									var idKey = logoMakerFunction.genRandomId();
									logoTemp.generate.idKey = idKey;
									var returnObj;
									if (logoTemp.generate.isArc == 1) {
										returnObj = logoMakerFunction.generateLogoTemplateForArcLogo(logoTemp.generate, idKey, type, whatChange);
									} else {
										returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, null, null, whatChange);
									}
									let originalReturnObj = Object.assign({}, returnObj);
									logoTemp.generate = returnObj.logoObj;

									var templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

									currObj = updateCurrLogoObject(logoTemp);
									lEditor.logoTempArr[j] = dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(currObj));
									slickElement = '<div class="logos--boxes" data-fntid = "' + v.font_id + '" data-index="' + (i) + '"><div class="logo--slides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay  gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="' + $for + '" data-id="' + (j++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + currObj.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
									$(".finalogoSlider").append(slickElement);
									if (originalReturnObj.logoObj.isArc == 1) {
										$('.finalogoSlider .logos--boxes[data-index="' + i + '"] .svgSloganText_1').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.slogan.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.slogan.x + "," + (originalReturnObj.logoObj.templatePath.updates.slogan.y) + ")");

										if ((originalReturnObj.logoObj.templatePath.isIcon == 1) || (originalReturnObj.logoObj.templatePath.isMono == 1)) {
											$('.finalogoSlider .logos--boxes[data-index="' + i + '"] .sampleIconBox').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.x + "," + (originalReturnObj.logoObj.templatePath.updates.iconFrameBox.y) + ")");
										}
									}
									dh_utility_common.changeBg();
									i++;
									if (json.pagination == 1 && i == fontListLength) {
										if ($('.load--more--class').length) {
											$('.load--more--class').remove();
										}
										$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreFonts load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
										if (p_fCallBack) {
											p_fCallBack();
										}
									} else {
										if (i == 1) {
											if ($('.load--more--class').length) {
												$('.load--more--class').remove();
											}
										}
										if (json.pagination == 0) {
											if (p_fCallBack) {
												p_fCallBack();
											}
										}
									}
								}

							} catch (e) {
								//	alert(e);
							}
						});
					});

				}
			}
		});

	}

	// code for pagination 
	$('body').on('click', '.loadMoreFonts', function () {
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		logoByfontFamily(editorParameters, function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});

	$('body').on('click', '.loadMoreMonograms', function () {
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		lEditor.getMonogramVariations($('.editMonogramText').val(), function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});

	$('body').on('click', '.loadMoreVariations', function () {
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		loadMoreStart++;
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		getLayoutVariations(function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});

	function loaderShow() {
		$('.editLogoSlider .loadMoreIcons').show();
		$('.finalogoSlider').hide();
	}

	function loaderHide() {
		$('.editLogoSlider .loadMoreIcons').hide();
		$('.finalogoSlider').show();
		$(".logoSlider").trigger('refresh.owl.carousel');
	}

	// disabling menu itesm
	function disableOption() {
		var currentLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var currLogo = currentLogo.generate;
		var targetlink = lEditor.getSession('targetlink');
		var defaultlink = lEditor.getSession('defaultlink');
		var logoname = lEditor.getSession('logoname');


		if (defaultlink == 7 || targetlink == 7) {
			if (logoname == '') {
				$('.companyName .companyFontCase, .companyName .rangeSlider, .iconVsTextSlider').addClass('disabled');
				$('.subMenu-8, .subMenu-13').parents('li').addClass('disabled');
			} else {
				$('.companyName .companyFontCase, .companyName .rangeSlider, .iconVsTextSlider').removeClass('disabled');
				$('.subMenu-8, .subMenu-13').parents('li').removeClass('disabled');
			}
		}

		eanbledSloganTool();

		if (currLogo.templatePath.isIcon != 1 && currLogo.templatePath.isMono != 1) {

			$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').addClass('disabled');
			$('.subMenu-15').parents('li').addClass('disabled');
			$('.subMenu-15').text("Symbol");
		} else {
			$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
			$('.subMenu-15').parents('li').removeClass('disabled');
			if (currLogo.templatePath.isIcon == 1) {
				$('.subMenu-15').text("Symbol");
			} else {
				$('.subMenu-15').text("Monogram");
			}

		}

		if (currLogo.templatePath.isIconFrame != 1) {
			$('.subMenu-43').parents('li').addClass('disabled');
		} else {
			$('.subMenu-43').parents('li').removeClass('disabled');
		}

		if (currLogo.framePath == '') {
			$('.frameSizeSlider').addClass('disabled');
			$('.subMenu-16').parents('li').addClass('disabled');
		} else {
			$('.frameSizeSlider').removeClass('disabled');
			$('.subMenu-16').parents('li').removeClass('disabled');
		}

	}
	function getTextTransform(p_sText, p_sType) {
		if (p_sText && p_sText !== "") {
			switch (p_sType) {
				case "caps":
					p_sText = toCapitalize(p_sText.toLowerCase());
					break;
				case "up":
					p_sText = p_sText.toUpperCase();
					break;
				case "low":
					p_sText = p_sText.toLowerCase();
					break;
			}
		}
		return p_sText;
	}
	/**
	 * 
	 * @param {*} p_sType 
	 * @param {*} p_sTextTransformCase 
	 * @param {*} p_nFontSize 
	 * @param {*} p_nLetterSpacing 
	 * @param {*} p_sActType 
	 * @param {*} p_sSliderType 
	 * @param {*} p_sLogoText 
	 */
	function updateLogoText(p_sType, p_sTextTransformCase, p_nFontSize, p_nLetterSpacing, p_sActType, p_sSliderType, p_sLogoText) {
		var logoTemp = lEditor.currentLogo;
		var updateLogoText;

		var updateSloganText = dh_editor_utility.removeMultipleSpaces($(".editSloganName.templateText").val());
		p_nFontSize = parseFloat(p_nFontSize);
		p_nLetterSpacing = parseFloat(p_nLetterSpacing);

		var changeLogoName = "";
		switch (p_sType) {
			case "logo":
			case "logoName":
				if (p_sActType == "slider" && ((p_sSliderType == "logoTextSlider") || (p_sSliderType == "logoLetterSpacing"))) {
					updateLogoText = lEditor.currentLogo.logoName;
				} else {
					updateLogoText = dh_editor_utility.removeMultipleSpaces($(".editCompanyName.templateText").val());
					updateLogoText = getTextTransform(updateLogoText, p_sTextTransformCase);
					$(".editCompanyName.templateText").val(updateLogoText);
					lEditor.setSession('logoname', updateLogoText);
				}
				break
			case "slogan":
			case "undo_redo_slogan":
				updateSloganText = getTextTransform(updateSloganText, p_sTextTransformCase);
				$(".editSloganName.templateText").val(updateSloganText);
				lEditor.setSession('sloganText', updateSloganText);
				break;
			case "logoName1":
				if (p_sActType == "slider" && ((p_sSliderType == "logoTextSlider") || (p_sSliderType == "logoLetterSpacing"))) {
					updateLogoText = lEditor.currentLogo.logoName1;
				}
				else if (p_sActType == "undo_redo_logoName1" && p_sLogoText) {
					updateLogoText = p_sLogoText;
				}
				else {
					updateLogoText = dh_editor_utility.removeMultipleSpaces($(".dd-ct-line1.templateText").val());
					updateLogoText = getTextTransform(updateLogoText, p_sTextTransformCase);
					$(".dd-ct-line1.templateText").val(updateLogoText);
					changeLogoName = updateLogoText + " " + logoTemp.logoName2;
					lEditor.setSession('logoname', changeLogoName);
					$('.company-text-dd').text(changeLogoName);
					$(".editCompanyName.templateText").val(changeLogoName);
				}
				break;
			case "logoName2":
				if (p_sActType == "slider" && ((p_sSliderType == "logoTextSlider") || (p_sSliderType == "logoLetterSpacing"))) {
					updateLogoText = lEditor.currentLogo.logoName2;
				}
				else if (p_sActType == "undo_redo_logoName2" && p_sLogoText) {
					updateLogoText = p_sLogoText;
				}
				else {
					updateLogoText = dh_editor_utility.removeMultipleSpaces($(".dd-ct-line2.templateText").val());
					updateLogoText = getTextTransform(updateLogoText, p_sTextTransformCase);
					$(".dd-ct-line2.templateText").val(updateLogoText);
					changeLogoName = logoTemp.logoName1 + " " + updateLogoText;
					lEditor.setSession('logoname', changeLogoName);
					$('.company-text-dd').text(changeLogoName);
					$(".editCompanyName.templateText").val(changeLogoName);
				}
				break;
		}
		disableOption();
		var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		let oldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var lastUndoName = "";
		switch (p_sActType) {
			case "logoTextEdit":
				if (((p_sType == "logo") || (p_sType == "logoName"))) {
					lastUndoName = currLogo.logoName;
				}
				break;
			case "sloganTextEdit":
				if (p_sType == "slogan") {
					lastUndoName = currLogo.sloganName;
				}
				break;
			case "logoText1Edit":
				if (p_sType == "logoName1") {
					lastUndoName = currLogo.logoName1;
				}
				break;
			case "logoText2Edit":
				if (p_sType == "logoName2") {
					lastUndoName = currLogo.logoName2;
				}
				break;
		}

		var logo = null;
		var type;
		var splitLogoName = "";
		switch (p_sType) {
			case "logo":
			case "logoName":
				if (currCompFontObject) {
					var logoTextList = lEditor.getLogoTextList(updateLogoText);
					if ((currLogo.generate.templatePath.isDBLineCompanyText == "yes") && (p_sSliderType == "logoTextSlider") || (p_sSliderType == "logoLetterSpacing") && (currLogo.generate.splitLogoName)) {
						logoTextList = lEditor.getLogoTextList(currLogo.generate.splitLogoName);
					}
					if ((currLogo.generate.templatePath.isDBLineCompanyText == "yes") && logoTextList.length > 0 && logoTextList.length == 2) {
						if (currLogo.generate.logoText1Slider) {
							logo = currCompFontObject.getPath(logoTextList[0], 0, 0, lEditor.currentLogo.generate.logoText1Slider, { 'letterSpacing': p_nLetterSpacing });
						} else {
							logo = currCompFontObject.getPath(logoTextList[0], 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
						}
						logoTemp.generate.logoPath1 = logo.toSVG();
						logo = null;

						if (currLogo.generate.logoText2Slider) {
							logo = currCompFont2Object.getPath(logoTextList[1], 0, 0, currLogo.generate.logoText2Slider, { 'letterSpacing': p_nLetterSpacing });
						} else {
							logo = currCompFont2Object.getPath(logoTextList[1], 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
						}

						logoTemp.generate.logoPath2 = logo.toSVG();

						splitLogoName = logoTextList[0] + "*" + logoTextList[1];
					} else {
						if (logoTemp.generate.isArc == 1) {
							const [curvePath, curveModel] = curveLogo.createText(currCompFontObject, updateLogoText, p_nFontSize, p_nLetterSpacing, logoTemp.generate.arcValue);
							if (curvePath) {
								curveLogo.updateJSON(curvePath, curveModel, logoTemp.generate, null);
							} else {
								logo = currCompFontObject.getPath(updateLogoText, 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
								logoTemp.generate.logoPath = logo.toSVG();
								curveLogo.deleteCorveFromJSON(logoTemp);
							}
						} else {
							logo = currCompFontObject.getPath(updateLogoText, 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
							logoTemp.generate.logoPath = logo.toSVG();
						}
						if (logoTextList.length > 0 && logoTextList.length == 2) {
							splitLogoName = logoTextList[0] + "*" + logoTextList[1];
						} else {
							splitLogoName = "";
						}

					}
				}
				else {
					alert("logo text font not loaded");
				}
				currLogo.logoName = updateLogoText;
				type = "logoName";
				if (p_sActType != 'slider' && logoTemp.generate.templatePath.isIcon == 0 && p_sTextTransformCase == '') {
					var monotext = lEditor.getMonogramText(false);
					lEditor.setMonogramText(monotext);
					var monogramNew = currMonogramFontObject.getPath(monotext, 0, 0, constantVars.SPACING.monogramTextSize)
					logoTemp.generate.iconPath = monogramNew.toSVG();
					logoTemp.generate.monogram = monotext;
				}
				break
			case "slogan":
			case "undo_redo_slogan":
				if (currSloganFontObject) {
					logo = currSloganFontObject.getPath(updateSloganText, 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
					logoTemp.generate.sloganPath = logo.toSVG();
					currLogo.sloganName = updateSloganText;
					type = "sloganName";
				} else {
					alert("slogan text font not loaded");
				}
				break;
			case "logoName1":
				if (currCompFontObject) {
					logo = currCompFontObject.getPath(updateLogoText, 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
					logoTemp.generate.logoPath1 = logo.toSVG();
				} else {
					alert("logoName1 text font not loaded");
				}
				currLogo.logoName1 = updateLogoText;
				currLogo.logoName = updateLogoText + " " + currLogo.logoName2;
				splitLogoName = updateLogoText + "*" + currLogo.logoName2;
				type = "logoName1";
				if (p_sActType == "undo_redo_logoName1" && p_sLogoText) {
					lEditor.setSession('logoname', currLogo.logoName);
					$('.company-text-dd').text(currLogo.logoName);
				}

				if (p_sActType != 'slider' && logoTemp.generate.templatePath.isIcon == 0 && p_sTextTransformCase == '') {
					var monotext = lEditor.getMonogramText(false);
					lEditor.setMonogramText(monotext);
					var monogramNew = currMonogramFontObject.getPath(monotext, 0, 0, constantVars.SPACING.monogramTextSize)
					logoTemp.generate.iconPath = monogramNew.toSVG();
					logoTemp.generate.monogram = monotext;
				}
				break;
			case "logoName2":
				if (currCompFont2Object) {
					logo = currCompFont2Object.getPath(updateLogoText, 0, 0, p_nFontSize, { 'letterSpacing': p_nLetterSpacing });
					logoTemp.generate.logoPath2 = logo.toSVG();
				} else {
					alert("logoName2 text font not loaded");
				}
				currLogo.logoName2 = updateLogoText;
				currLogo.logoName = currLogo.logoName1 + " " + updateLogoText;
				splitLogoName = currLogo.logoName1 + "*" + updateLogoText;
				type = "logoName2";
				if (p_sActType == "undo_redo_logoName2" && p_sLogoText) {
					lEditor.setSession('logoname', currLogo.logoName);
					$('.company-text-dd').text(currLogo.logoName);
				}
				if (p_sActType != 'slider' && logoTemp.generate.templatePath.isIcon == 0 && p_sTextTransformCase == '') {
					var monotext = lEditor.getMonogramText(false);
					lEditor.setMonogramText(monotext);
					var monogramNew = currMonogramFontObject.getPath(monotext, 0, 0, constantVars.SPACING.monogramTextSize)
					logoTemp.generate.iconPath = monogramNew.toSVG();
					logoTemp.generate.monogram = monotext;
				}
				break;
		}
		var returnObj;
		if (((p_sType === "logoName") || (p_sType === "logo") || (p_sType === "slogan")) && logoTemp.generate.isArc == 1) {
			returnObj = logoMakerFunction.generateLogoTemplateForArcLogo(logoTemp.generate, logoTemp.generate.idKey, type, p_sActType);
		} else {
			returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, logoTemp.generate.idKey, null, null, p_sActType);
		}
		logoTemp = returnObj.logoObj;
		currLogo.generate = logoTemp;
		currLogo = updateCurrLogoObject(currLogo);
		$('.finaLogoInner').html('<div class="svg--slide" style="background-color:' + lEditor.currentLogo.generate.bgColor + ';"><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + logoMakerFunction.getFinalLogoTemplate(currLogo.generate) + '<div class="bgOutlineBox bg-outline-box"></div></div></div>');

		let newLogoObj = null;
		lEditor.setDefaultLogo(currLogo, currLogo.generate, function () {
			if (splitLogoName && splitLogoName != "") {
				currLogo.generate.splitLogoName = splitLogoName;
			}
			newLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			if (p_sTextTransformCase !== '') {

				switch (p_sType) {
					case "logo":
					case "logoName":
						editorUndoRedo.setUndoActData(LOGO_TEXT_TRANSFORM, oldLogoObj, newLogoObj);
						break;
					case "logoName1":
						editorUndoRedo.setUndoActData(LOGO_TEXT1_TRANSFORM, oldLogoObj, newLogoObj);
						break;
					case "logoName2":
						editorUndoRedo.setUndoActData(LOGO_TEXT2_TRANSFORM, oldLogoObj, newLogoObj);
						break;
					case "slogan":
						editorUndoRedo.setUndoActData(SLOGAN_TEXT_TRANSFORM, oldLogoObj, newLogoObj);
						break;
				}
			}

			switch (p_sActType) {
				case "logoTextEdit":
					if (((p_sType == "logo") || (p_sType == "logoName"))) {
						editorUndoRedo.setUndoActData(LOGO_TEXT_CHANGE, lastUndoName, dh_editor_utility.removeMultipleSpaces($('.templateText.editCompanyName').val()));
					}
					break;
				case "sloganTextEdit":
					if (p_sType == "slogan") {
						editorUndoRedo.setUndoActData(SLOGAN_TEXT_CHANGE, lastUndoName, dh_editor_utility.removeMultipleSpaces($('.templateText.editSloganName').val()));
					}
					break;
				case "logoText1Edit":
					if (p_sType == "logoName1") {
						editorUndoRedo.setUndoActData(LOGO_TEXT1_CHANGE, lastUndoName, updateLogoText);
					}
					break;
				case "logoText2Edit":
					if (p_sType == "logoName2") {
						editorUndoRedo.setUndoActData(LOGO_TEXT2_CHANGE, lastUndoName, updateLogoText);
					}
					break;
			}
			switch (p_sSliderType) {
				case "logoTextSlider":
					editorUndoRedo.ltsNewLogoObj = null;
					editorUndoRedo.ltsNewLogoObj = newLogoObj;
					break;
				case "logoLetterSpacing":
					editorUndoRedo.llsNewLogoObj = null;
					editorUndoRedo.llsNewLogoObj = newLogoObj;
					break;
				case "sloganTextSize":
					editorUndoRedo.stsNewLogoObj = null;
					editorUndoRedo.stsNewLogoObj = newLogoObj;
					break;
				case "sloganLetterSpacing":
					editorUndoRedo.slsNewLogoObj = null;
					editorUndoRedo.slsNewLogoObj = newLogoObj;
					break;
				case "remove_slogan":
					newLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
					editorUndoRedo.setUndoActData(SLOGAN_REMOVE, oldLogoObj, newLogoObj);
					break;
				case "logoCurveSlider":
					editorUndoRedo.ltcNewLogoObj = null;
					editorUndoRedo.ltcNewLogoObj = newLogoObj;
					break;
			}
		});
		if (p_sActType != "slider") {
			saveSliderData();
		}

	}
	function toCapitalize(p_sString) {
		let stringArray = p_sString.split(" ");
		for (let a = 0; a < stringArray.length; a++) {
			stringArray[a] = stringArray[a].charAt(0).toUpperCase() + stringArray[a].slice(1)
		}
		return stringArray.join(" ");
	}

	function checkStringCase(p_sString) {
		if (p_sString === p_sString.toUpperCase()) {
			return "up";
		}
		else if (p_sString === p_sString.toLowerCase()) {
			return "low";
		}
		else if (p_sString.charAt(0) === p_sString.charAt(0).toUpperCase()) {
			return "caps";
		}
		return "";
	}

	// listing by color gradients 
	function colorGradient(type) {
		var workFor = null;
		if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			workFor = $('.subChild-13').find(".company-text-color-box").attr("last_selected");
		}
		var targetLink = parseInt(lEditor.getSession('targetlink'));
		var colorDataType = lEditor.getSession('colorDataType');
		if (typeof colorDataType === 'undefined') {
			colorDataType = 'background';
		}
		var currLogo = lEditor.currentLogo;
		var oldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var color = '';
		var option;
		switch (colorDataType) {
			case 'foreground': {
				$('.colorSection .subnav li.active').each(function () {
					option = $(this).find('a').data('target');
					switch (option) {
						case 13:
							switch (workFor) {
								case "dd-ct-color-line1":
									currLogo.generate.textGradient = type;
									break;
								case "dd-ct-color-line2":
									currLogo.generate.text2Gradient = type;
									break;
								case "dd-ct-color-overall":
								default:
									currLogo.generate.textGradient = type;
									if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
										currLogo.generate.text2Gradient = type;
									}
									break;
							}
							break;

						case 14:
							currLogo.generate.sloganGradient = type;
							break;

						case 15:
							currLogo.generate.iconGradient = type;
							break;

						case 16:
							if (currLogo.generate.templatePath.frameType == "filled") {
								currLogo.generate.frameFilledGradient = type;
							} else {
								currLogo.generate.frameGradient = type;
							}
							break;

						case 43:
							editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_INNER_CONTAINER, currLogo.generate.iconFrameGradient, type);

							currLogo.generate.iconFrameGradient = type;
							break;

					}
				});
			}
		}
		lEditor.getCurrentLogo();
		// $('.editLogoSlider, .previewSection').addClass('hidden');
		$('.editLogoSlider').addClass('hidden');
		$('.editFinalLogo, .previewSection').removeClass('hidden');

		lEditor.setDefaultLogo(currLogo, currLogo.generate, function () {
			let newLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
			switch (option) {
				case 13:
					var workFor;
					var parentDiv = $('.subChild-13').find(".company-text-color-box");
					workFor = parentDiv.attr("last_selected");
					switch (workFor) {
						case "dd-ct-color-line1":
							editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_LOGO_TEXT1, oldLogoObj, newLogoObj);
							break;
						case "dd-ct-color-line2":
							editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_LOGO_TEXT2, oldLogoObj, newLogoObj);
							break;
						case "dd-ct-color-overall":
						default:
							editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_LOGO_TEXT, oldLogoObj, newLogoObj);
							break;
					}
					break;
				case 14:
					editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_SLOGAN_TEXT, oldLogoObj, newLogoObj);
					break;
				case 15:
					editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_SYMBOL, oldLogoObj, newLogoObj);
					break;
				case 16:
					editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_OUTER_CONTAINER, oldLogoObj, newLogoObj);
					break;
				case 43:
					editorUndoRedo.setUndoActData(EDIT_GRADIENT_COLORS_INNER_CONTAINER, oldLogoObj, newLogoObj);
					break;
			}
		});
		lEditor.previewColors();
		lEditor.previewLogo();
		$('#saveIcon').trigger('click');
	}


	// update item size by center 
	function updateSizeByCenter(object, template, type, size, direction) {
		var dimension = template[type];
		var x = dimension.x;
		var y = dimension.y;
		var oscale = dimension.scale;
		var ratio = oscale / x;
		var scale = 1;

		scale += (size / 100);
		var bbox = object.get(0).getBBox();

		bbox.width = parseFloat(bbox.width);
		bbox.height = parseFloat(bbox.height);
		bbox.x = parseFloat(bbox.x);
		bbox.y = parseFloat(bbox.y);

		var svgWidth = parseFloat(constantVars.SVGWIDTH);
		var svgHeight = parseFloat(constantVars.SVGHEIGHT);
		if (direction == 'right') {
			x = x - size; // ratio;
			y = y - size;
		} else {
			x = x + size; // ratio;
			y = y + size;
		}


		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		obj = { 'x': x, 'y': y, 'scale': scale };
		return obj;
	}

	function updateGroupSizeByLastValue(object, p_oObj) {
		var x = p_oObj.x
		var y = p_oObj.y
		var scale = p_oObj.scale;
		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		var obj1 = { 'x': x, 'y': y, 'scale': scale };
		return obj1;
	}

	// update item zise of SVG ( any ) 
	function updateGroupSize(object, template, type, size) {
		var dimension = template[type];
		let consoleTxt = '%c updateGroupSize ' + type;
		var scale = 1;
		if (type == "frame" && template.isFrame == 0) {
			object.attr('transform', "scale(0) translate(0,0)");
			return { 'x': 0, 'y': 0, 'scale': 0 };
		}

		var bbox = object.get(0).getBBox();
		var x = 0;
		var y = 0;

		var ox = dimension.x;
		var oy = dimension.y;
		var oscale = dimension.scale;

		var obj = {};
		scale = scale + (size / 100);
		if ((type === "slogan" || type === "text" || type === "text1" || type === "text2") && (size != 0)) {
			scale = size;
		}

		if (dimension.field == "logoContainer") {
			// if (type === "logoContainer") {
			// 	console.log("logoContainer width:=" + (bbox.width) + ",,," + (bbox.height));
			// }
			if (template.isFrame == 1) {
				scale = 1;
			} else {

				if (bbox.width >= bbox.height) {
					if (bbox.width >= constantVars.SVGWIDTH) {
						scale = constantVars.SVGWIDTH / bbox.width;
						scale = scale - 0.1;
					} else {
						scale = 0.99;
					}
				} else {
					if (bbox.height >= constantVars.SVGHEIGHT) {
						scale = constantVars.SVGHEIGHT / bbox.height;
						scale = scale - 0.1;
					} else {
						scale = 0.99;
					}
				}
			}
		}

		if (dimension.field == "frame") {
			if (template.isFrame == 0) {
				object.attr('transform', "scale(0) translate(0,0)");
				return { 'x': 0, 'y': 0, 'scale': 0 };
			}
		}

		if (type === "iconFrameBox" && template.isIconFrame == 1 && (template.isIcon == 1 || template.isMono == 1) && size != 0) {
			scale = size;
		}
		//--------------------new----------------------
		if (dimension.field == "containerBody") {

			if (template.isFrame == 1 && (template.frameOverlap == 0 || template.frameOverlap == undefined)) {
				if (template.frame_width && parseInt(template.frame_width) != 0 && template.frame_width != "" && template.frame_height && parseInt(template.frame_height) != 0 && template.frame_height != "") {
					scale = setContentInFrame(template, bbox);;
				} else {
					var frame = $('#templateGenerator .container_1').get(0).getBBox();
					var frameHeight;
					var frameWidth;
					if (lEditor.currentLogo.generate && lEditor.currentLogo.generate.templatePath.frameShapeName && lEditor.currentLogo.generate.templatePath.frameShapeName == "brush") {
						frameHeight = (frame.height / 2) > constantVars.FRAMERATIO ? frame.height / 2 : constantVars.FRAMERATIO;
						frameWidth = (frame.width / 2) > constantVars.FRAMERATIO ? frame.width / 2 : constantVars.FRAMERATIO;
					} else {
						frameHeight = (frame.height / 2) > constantVars.FRAMERATIO ? constantVars.FRAMERATIO : frame.height / 2;
						frameWidth = (frame.width / 2) > constantVars.FRAMERATIO ? constantVars.FRAMERATIO : frame.width / 2;
					}
					scale = setScale(frameWidth, bbox.width, frameHeight, bbox.height);
					//-----------------------------
				}
			} else {
				var container = $('#templateGenerator .containerBody').get(0).getBBox();
				var containerWidth = container.width;
				var containerHeight = container.height;
				// scale = setScale(460, containerWidth, 460, containerHeight) + 0.12;
				scale = setScale(400, containerWidth, 400, containerHeight) + 0.12;
			}
		}
		//--------------------------------------------
		if (dimension.field == "icon") {
			if (template.isIconFrame == 1 && (template.isIcon == 1 || template.isMono == 1)) {
				scale = 100 / (bbox.width);
				if (scale > (100 / bbox.height)) {
					scale = 100 / bbox.height;
				}
			} else {
				console.log("icon scale from 100:=" + scale);
			}
		}
		if (dimension.xType == 'left') {
			x = (constantVars.SVGWIDTH * dimension.widthStart / 100) / scale - bbox.x * scale;
		}
		if (dimension.xType == 'center') {
			x = ((constantVars.SVGWIDTH * dimension.widthPercent / 100) + (constantVars.SVGWIDTH * dimension.widthStart / 100)) / (2 * scale) - ((bbox.width) / 2) - bbox.x;
		}
		if (dimension.xType == 'right') {
			x = (constantVars.SVGWIDTH * dimension.widthStart / 100) + (constantVars.SVGWIDTH * dimension.widthPercent / 100) / scale - bbox.width - bbox.x;
		}

		if (dimension.yType == 'up') {
			y = ((constantVars.SVGHEIGHT * dimension.heightStart / 100)) / scale - bbox.y;
		}
		if (dimension.yType == 'center') {
			y = (constantVars.SVGHEIGHT * dimension.heightStart / 100 + constantVars.SVGHEIGHT * dimension.heightPercent / 100) / (2 * scale) - bbox.height / 2 - bbox.y;
		}
		if (dimension.yType == 'down') {
			y = ((constantVars.SVGHEIGHT * dimension.heightStart / 100) + (constantVars.SVGHEIGHT * dimension.heightPercent / 100)) / scale - (bbox.height) - bbox.y;

			if (type === "text1" && (template.text1) && (template.text2) && (template.isDBLineCompanyText == "yes") && (object.length)) {
				// var ob1 = $('#templateGenerator  .svgLogoName_1');
				// var ob2 = $('#templateGenerator  .svgLogoName_2');
				var ob1 = object;
				var ob2 = object.siblings(".svgLogoName_2");
				if (ob2 && ob1) {
					var bbox1 = ob1.get(0).getBBox();
					var bbox2 = ob2.get(0).getBBox();
					var b1h = bbox1.height;
					var b2h = bbox2.height;
					var gaps = 0;
					if (b1h > b2h) {
						gaps = (b1h - b2h);
					}
					else if (b2h > b1h) {
						gaps = (b2h - b1h);
					}
					gaps = 20;
					y = ((constantVars.SVGHEIGHT * dimension.heightStart / 100) + (constantVars.SVGHEIGHT * dimension.heightPercent / 100)) / scale - (bbox.height + b2h) - (bbox.y) - gaps;
				}
			}
		}
		if ((template.lastTextDistance) != undefined) {
			if (parseInt(template.lastTextDistance) > 0) {
				switch (type) {
					case "slogan":
						y = y + parseInt(template.lastTextDistance);
						break;
					case "textAndSlogan":
						// y = y + parseInt(template.lastTextDistance) / 2;
						y = y + parseInt(template.lastTextDistance);
						break;
				}
			}
		}
		if (template.lastSymbolXDistance != undefined && type == "textAndSlogan") {
			if (parseInt(template.lastSymbolXDistance) > 0) {
				switch (template.tempType) {
					case "left":
						x = x + parseInt(template.lastSymbolXDistance);
						break;
					case "right":
						x = x - parseInt(template.lastSymbolXDistance);
						break;
				}
			}
		}
		if (x < constantVars.MINX || x > constantVars.MAXX) {
			obj = { 'x': ox, 'y': oy, 'scale': oscale };
		}
		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		obj = { 'x': x, 'y': y, 'scale': scale, 'height': bbox.height };
		return obj;
	}
	/**
	 * 
	 * @param {*} template 
	 * @param {*} bbox 
	 */
	function setContentInFrame(template, bbox) {
		var frameDimension;
		var scale = 0;
		var isBool1 = false;
		if (template.isMono == 0 && template.isIcon == 0 && (template.isDBLineCompanyText != "yes")) {
			scale = setScale(parseInt(template.frame_width), bbox.width, parseInt(template.frame_height), bbox.height);
		} else {
			var logoText = lEditor.getSession('logoname');
			if ((template.template_direction == 1 || template.template_direction == 2)) {
				// width case
				frameDimension = parseInt(template.frame_width);
				switch (template.frameShapeName.toLowerCase()) {
					case "rectangle":
						if (template.frmId == 289) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
								frameDimension = frameDimension - 50;
							}
						}
						if (template.frmId == 133) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 30;
							}
						}
						if (template.frmId == 330) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 80;
							}
						}
						if (template.frmId == 363 || template.frmId == 364) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 50;
							}
						}
						if (template.frmId == 269) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 50;
							}
						}
						if (template.frmId == 154 || template.frmId == 253) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 80;
							}
						}

						else if (template.frmId == 127 || template.frmId == 129 || template.frmId == 122) {
							frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
						}
						break;

					case "hexagon":
						if (template.frmId == 3) {
							if ((logoText.length > 14)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 30;
							}
						}
						if (template.frmId == 125) {
							if ((logoText.length > 10)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
								frameDimension = frameDimension - 80;
							}
						}
						break;
					case "octagon":
						if (template.frmId == 156) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 30;
							}
						}
						if (template.frmId == 256) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 80;
							}
						}
						if (template.frmId == 258) {
							if ((logoText.length > 18)) {
								frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
								frameDimension = frameDimension - 50;
							}
						}
						break;
					case "ellipse":
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
						frameDimension = frameDimension - 30;
						break;
					case "square":

						break;
				}
			} else {
				// dir 0 and 4
				// height case
				frameDimension = parseInt(template.frame_height);
				if ((logoText.length > 18)) {
					frameDimension = parseInt(template.frame_width);
				}
				if (template.frmId == 269) {
					if ((logoText.length > 18)) {
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
						frameDimension = frameDimension - 50;
					}
				}
				if (template.frmId == 3) {
					if ((logoText.length > 18)) {
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
						frameDimension = frameDimension - 50;
					}
				}
				// if (template.frmId == 125) {
				// 	if ((logoText.length >= 10)) {
				// 		frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
				// 		frameDimension = frameDimension - 80;
				// 	}

				// }
				if (template.frmId == 156) {
					if ((logoText.length > 18)) {
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
						frameDimension = frameDimension - 50;
					}
				}
				if (template.frmId == 256) {
					if ((logoText.length > 18)) {
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
						frameDimension = frameDimension - 80;
					}
				}
				if (template.frmId == 258) {
					if ((logoText.length > 18)) {
						frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
						frameDimension = frameDimension - 70;
					}
				}
				switch (template.frameShapeName.toLowerCase()) {
					case "rectangle":
						if (template.frmId == 127 || template.frmId == 129 || template.frmId == 122) {
							frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
							isBool1 = true;
						}
						break;
					case "ellipse":
						if ((logoText.length >= 28)) {
							frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height);
							frameDimension = frameDimension - 20;
						} else {
							frameDimension = parseInt(template.frame_width) + parseInt(template.frame_height) / 2;
							frameDimension = frameDimension - 20;
						}
						break;
				}
			}
			if (bbox.width > bbox.height) {
				if (frameDimension > bbox.width) {
					scale = bbox.width / frameDimension;
				} else {
					scale = frameDimension / bbox.width;
				}
			} else {
				if (frameDimension > bbox.height) {
					scale = bbox.height / frameDimension;
				} else {
					scale = frameDimension / bbox.height;
				}
			}
			if (template.frameShapeName.toLowerCase() == "circle") {

			} else {
				if ((scale * bbox.height) > template.frame_height) {
					scale = template.frame_height / bbox.height;
				}
			}
		}
		return scale;
	}
	function setScaleNew(template, p_nFrameWidth, p_nFrameHeight, p_nContentWidth, p_nContentHeight) {
		var scale = 0;
		var gap = 0;
		if (template.frameShapeName.toLowerCase() == "circle") {
			gap = Math.max(p_nFrameWidth, p_nFrameHeight) / 4;
		} else {
			if (p_nFrameWidth >= p_nFrameHeight) {
				gap = (p_nFrameWidth - p_nFrameHeight) / 2;
			} else {
				gap = (p_nFrameHeight - p_nFrameWidth) / 2;
			}
		}
		gap = 0;
		if (p_nContentWidth > p_nContentHeight) {

			if ((p_nFrameWidth) > p_nContentWidth) {
				scale = (p_nContentWidth) / (p_nFrameWidth + gap);
			} else {
				scale = (p_nFrameWidth - gap) / (p_nContentWidth);
			}

			var ab = scale * p_nContentHeight;
			if (ab <= p_nFrameHeight) {
				// sahi hai scaling 
				console.log("scaling sahi hai width ki");
			} else {
				if (p_nFrameHeight > p_nContentHeight) {
					scale = p_nContentHeight / (p_nFrameHeight + gap);
				} else {
					scale = (p_nFrameHeight) / (p_nContentHeight + gap);
				}
			}
		} else {

			if (p_nFrameHeight > p_nContentHeight) {
				scale = p_nContentHeight / (p_nFrameHeight);
			} else {
				scale = (p_nFrameHeight) / (p_nContentHeight + gap);
			}
			var ab = scale * p_nContentWidth;
			if (ab <= p_nFrameWidth) {
				// sahi hai scaling 
				console.log("scaling sahi hai height ki");
			} else {
				if (p_nFrameWidth > p_nContentWidth) {
					scale = (p_nContentWidth) / (p_nFrameWidth + gap);
				} else {
					scale = (p_nFrameWidth) / (p_nContentWidth + gap);
				}
			}

		}
		return scale;
	}
	// update current logo ojgect ( template to main )  
	function updateCurrentLogoSize(object, dimension, size, type) {
		if (type == "frame" && dimension.isFrame == 0) {
			object.attr('transform', "scale(0) translate(0,0)");
			return { 'x': 0, 'y': 0, 'scale': 0 };
		}
		var scale = 1;
		var bbox = object.get(0).getBBox();
		var x = dimension[type].x;
		var y = dimension[type].y
		var obj = {};

		scale = scale + (size / 100);


		if (dimension[type].field == "logoContainer") {
			scale = setScale(constantVars.SVGHWIDTH, bbox.width, constantVars.SVGHEIGHT, bbox.height);
		}
		if (dimension[type].field == "containerBody") {
			scale = setScale(constantVars.FRAMERATIO, bbox.width, constantVars.FRAMERATIO, bbox.height);
			object.attr('transform', "scale(" + scale + ")");
		}
		if (dimension.field == "icon") {
			scale = 100 / bbox.width;
			if (scale > 100 / bbox.height) {
				scale = 100 / bbox.height;
			}
		}

		scale = scale + (size / 100);
		if (dimension.xType == 'left') {
			x = (constantVars.SVGWIDTH * dimension.widthStart / 100) / scale - bbox.x * scale;
		}
		if (dimension.xType == 'center') {
			x = ((constantVars.SVGWIDTH * dimension.widthPercent / 100) + (constantVars.SVGWIDTH * dimension.widthStart / 100)) / (2 * scale) - ((bbox.width) / 2) - bbox.x;
		}
		if (dimension.xType == 'right') {
			x = (constantVars.SVGWIDTH * dimension.widthStart / 100) + (constantVars.SVGWIDTH * dimension.widthPercent / 100) / scale - bbox.width - bbox.x;
		}

		if (dimension.field == "slogan") {
			bboxText = $('#templateGenerator  .svgLogoName_1').get(0).getBBox();
			y = template.updates.text.y + bboxText.height / 2 + 10;
		} else {
			if (dimension.yType == 'up') {
				y = ((constantVars.SVGHEIGHT * dimension.heightStart / 100)) / scale - bbox.y;
			}
			if (dimension.yType == 'center') {
				y = (constantVars.SVGHEIGHT * dimension.heightStart / 100 + constantVars.SVGHEIGHT * dimension.heightPercent / 100) / (2 * scale) - bbox.height / 2 - bbox.y;
			}
			if (dimension.yType == 'down') {
				y = ((constantVars.SVGHEIGHT * dimension.heightStart / 100) + (constantVars.SVGHEIGHT * dimension.heightPercent / 100)) / scale - (bbox.height) - bbox.y;
			}
		}
		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		obj = { 'x': x, 'y': y, 'scale': scale };
		return obj;
	}

	// ( updateing frame size ) 
	function updateFrameSize(object, size) {
		var scale = 1;
		scale += (size / 100);
		var bbox = object.get(0).getBBox();
		bbox.width = parseFloat(bbox.width);
		bbox.height = parseFloat(bbox.height);
		bbox.x = parseFloat(bbox.x);
		bbox.y = parseFloat(bbox.y);
		var svgWidth = parseFloat(constantVars.SVGWIDTH);
		var svgHeight = parseFloat(constantVars.SVGHEIGHT);
		var x = svgWidth / (2 * scale) - ((bbox.width) / 2) - bbox.x;
		if (x < 0 || x > svgWidth) return;
		var y = (svgHeight / (2 * scale)) - ((bbox.height) / 2) - bbox.y;
		if (y < 0 || y > svgHeight) return;
		object.attr('transform', "scale(" + scale + ") translate(" + x + "," + y + ")");
		obj = { 'x': x, 'y': y, 'scale': scale };
		return obj;
	}

	// not in use
	function updateIconVsText(obj1, obj2, size) {
		updateGroupSize(obj1, size * (-1));
		updateGroupSize(obj2, size);
	}

	// not in use
	function updateBetweenDistance(obj1, obj2, distance) {
		var obj1Scale = obj1.data('scale');
		var obj1X = obj1.data('x');
		var obj1Y = obj1.data('y');
		var obj2Scale = obj2.data('scale');
		var obj2X = obj2.data('x');
		var obj2Y = obj2.data('y');

		obj1Y = obj1Y - (distance);
		obj2Y = obj2Y + (distance);

		obj1.attr('transform', "scale(" + obj1Scale + ") translate(" + obj1X + "," + obj1Y + ")");
		obj1.data('x', obj1X);
		obj1.data('y', obj1Y);
		obj2.attr('transform', "scale(" + obj2Scale + ") translate(" + obj2X + "," + obj2Y + ")");
		obj2.data('x', obj2X);
		obj2.data('y', obj2Y);
	}

	// listing by color variation 
	function fixedColorVariation(editorParameters, p_fCallBack) {
		var workFor = null;
		if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			workFor = $('.subChild-13').find(".company-text-color-box").attr("last_selected");
		}
		var colorId = editorParameters.id;
		var colorVal = editorParameters.color;
		var dataOption = colorVal;
		loadMoreStart++;
		var limit = 10;
		var templateIdStyle = getTempStyle();
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'colors', color_id: colorId, start: loadMoreStart },
			async: true,
			success: function (json) {
				json = dh_editor_utility.getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					var colorVariant = json.colors;
					var targetLink = parseInt(lEditor.getSession('targetlink'));
					var colorDataType = lEditor.getSession('colorDataType');
					if (typeof colorDataType === 'undefined') {
						colorDataType = 'background';
					}
					var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
					var i = 0;
					var k = (loadMoreStart - 1) * limit;
					var type = '';

					if (loadMoreStart == 1) {
						lEditor.logoTempArr = [];
						lEditor.logoSlider('final', 1);
					}
					var color = '';
					var colorVariantLength = colorVariant.length;
					// $('.load--more--class').remove();
					if (colorVariantLength == 0) {
						return false;
					}

					var returnObj = {};
					$('.editFinalLogo').addClass('hidden');
					$('.editLogoSlider').removeClass('hidden');
					$.each(colorVariant, function (kee, v) {
						var idKey = logoMakerFunction.genRandomId();
						logoTemp.generate.idKey = idKey;
						switch (colorDataType) {
							case 'background': {
								color = "" + v.cp_code;
								logoTemp.generate.bgColor = color;
								constantVars.colors.bgColorFamily = dataOption;
								returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey);
								break;
							}
							case 'foreground': {
								var j = 0;
								$('.colorSection .subnav li.active').each(function () {
									color = "" + v.cp_code;
									var option = $(this).find('a').data('target');
									switch (option) {
										case 13: {

											switch (workFor) {
												case "dd-ct-color-line1":
													logoTemp.generate.mainTextColor = color;
													logoTemp.generate.textGradient = "";
													break;
												case "dd-ct-color-line2":
													logoTemp.generate.mainText2Color = color;
													logoTemp.generate.text2Gradient = "";
													break;
												case "dd-ct-color-overall":
												default:
													logoTemp.generate.mainTextColor = color;
													logoTemp.generate.mainText2Color = color;
													logoTemp.generate.textGradient = "";
													logoTemp.generate.text2Gradient = "";
													break;
											}
											constantVars.colors.mainTextFamily = dataOption;
											break;
										}
										case 14: {
											logoTemp.generate.sloganTextColor = color;
											logoTemp.generate.sloganGradient = "";
											constantVars.colors.sloganTextFamily = dataOption;
											break;
										}
										case 15: {
											logoTemp.generate.iconColor = color;
											logoTemp.generate.iconGradient = "";
											constantVars.colors.iconFamily = dataOption;
											break;
										}
										case 16: {
											if (logoTemp.generate.templatePath.frameType == "filled") {
												logoTemp.generate.frameFilledColor = color;
												logoTemp.generate.frameGradient = "";
											} else {
												logoTemp.generate.frameColor = color;
												logoTemp.generate.frameGradient = "";
											}
											constantVars.colors.frameFamily = dataOption;
											break;
										}
										case 43: {
											logoTemp.generate.iconFrameColor = color;
											logoTemp.generate.iconFrameGradient = "";
											constantVars.colors.iconFrameFamily = dataOption;
											break;
										}
									}

									returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey);
									j++;
								});
							}
						}
						logoTemp.generate = returnObj.logoObj;
						lEditor.logoTempArr[k] = dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(logoTemp));

						templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

						slickElement = '<div class="logos--boxes" data-cpId = "' + v.cp_id + '"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="color" data-id="' + (k++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
						$(".finalogoSlider").append(slickElement);
						dh_utility_common.changeBg();
						i++;
						if (json.pagination == 1 && i == colorVariantLength) {
							if ($('.load--more--class').length) {
								$('.load--more--class').remove();
							}
							$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreColors load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
							if (p_fCallBack) {
								p_fCallBack();
							}

						} else {
							if (i === 1) {
								if ($('.load--more--class').length) {
									$('.load--more--class').remove();
								}
							}
							if (json.pagination == 0) {
								if (p_fCallBack) {
									p_fCallBack();
								}

							}
						}

					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});
	}

	function addRecentColor(targetLink) {
		var generateObj = lEditor.currentLogo.generate;
		var color;

		switch (parseInt(targetLink)) {
			case 3:
			case 12: {
				color = generateObj.bgColor;
				break;
			}
			case 13: {
				if (generateObj.mainTextColor.indexOf('url') != -1) {
					color = generateObj.textGradient;
				}
				else {
					color = generateObj.mainTextColor;
				}
				break;
			}
			case 14: {
				if (generateObj.sloganTextColor.indexOf('url') != -1) {
					color = generateObj.sloganGradient;
				}
				else {
					color = generateObj.sloganTextColor;
				}
				break;
			}
			case 15: {
				if (generateObj.iconColor.indexOf('url') != -1) {
					color = generateObj.iconGradient;
				}
				else {
					color = generateObj.iconColor;
				}
				break;
			}
			case 16: {
				if (generateObj.frameColor.indexOf('url') != -1) {
					color = generateObj.iconGradient;
				}
				else {
					color = generateObj.frameColor;
				}

				break;
			}
			case 43: {
				if (generateObj.iconFrameColor.indexOf('url') != -1) {
					color = generateObj.iconFrameGradient;
				}
				else {
					color = generateObj.iconFrameColor;
				}
				break;
			}
		}
		if (color) {
			color = color.replace('#', '');
			if (color && recentColors.indexOf(color) == -1) {
				if (recentColors.length == 8) {
					recentColors.unshift(color);
					recentColors.pop();
				}
				else {
					recentColors.unshift(color);
				}
				saveRecentColor(color);
			}
			refreshRecentColorBox();
		}
	}

	function refreshRecentColorBox() {
		let content = recentColors.reduce((accm, color) => {
			if (gradientsArray[color]) {
				return accm += '<a href="javascript:;" class="recent-color gradient-color" style="background:' + getGradientStyle(color) + '" data-color="' + color + '"></a>'
			}
			else {
				return accm += '<a href="javascript:;" class="recent-color" style="background-color:#' + color + '" data-color="#' + color + '"></a>'
			}
		}, '');
		if (recentColors.length === 0) {
			$(".color-title").hide();
		}


		$('.colors--variant.recentColorsBox').html(content);
		$('.recentColorsBox a').on('click', function (e) {
			var color = $(this).data('color');
			var picker = $(this).closest('.colorPicker');

			if (gradientsArray[color]) {
				$('.commonClrDiv a').removeClass('active');
				$(this).find('a').addClass('active');
				colorGradient(color);

				//set the color of the picker
				// if (picker) {
				// 	picker.find('.input-group-addon.color-box i')[0].style.background = getGradientStyle(color);
				// }
				updateColorPickerValue(color, false, "", 0);
			}
			else {
				lEditor.logoSlider('final', 1);
				try {
					colorVariation(color);
					// updateColorPickerValue(color, false, "",0);
					//set the color of the picker
					if (picker) {
						picker.colorpicker('setValue', color);
					}
				} catch (e) {
					// $('.finaLogoInner').html('');
					$('.colorNotFound').remove();
					$('.editLogoSlider').removeClass('hidden');
					$('.editFinalLogo').addClass('hidden');
					$(".finalogoSlider").html('<div class="result-option colorNotFound">Not a valid Color code !</div>');
				}
			}
		});
		if ($(".topParent-2").parent("li").hasClass("active") && $(".subMenu-7").parent("li").hasClass("active") && ((!$(".subChild-7").hasClass("hidden"))) && (!($(".previewSection").hasClass("hidden"))) && (($('.editFinalLogo').hasClass("hidden")))) {
			// $('.editFinalLogo').removeClass("hidden");
		}
	}
	//set the color of the picker
	function updateColorPickerValue(p_sColor, p_bIsNoGradientColor, p_sColorDataType, p_nSubChildNum) {

		let subChildNum;
		var workFor = null;
		if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			workFor = $('.subChild-13').find(".company-text-color-box").attr("last_selected");
		}
		if (lEditor.getSession("defaultLink") && lEditor.getSession("defaultLink") != "undefined") {
			subChildNum = lEditor.getSession("defaultLink");
		} else {
			subChildNum = lEditor.getSession("targetlink");
		}
		let picker = $('.colorpicker-component');
		let gradientColor = "";
		if (picker) {
			let childNum;
			let currentColorDataType;
			if (p_sColorDataType == "") {
				currentColorDataType = lEditor.getSession("colorDataType")
			} else {
				currentColorDataType = p_sColorDataType;
			}
			if (p_nSubChildNum != 0) {
				subChildNum = p_nSubChildNum;
			}
			switch (currentColorDataType) {
				case "background":
					childNum = 0;
					break
				case "foreground":
					switch (parseInt(subChildNum)) {
						case 13:
							childNum = 1;
							if (!p_bIsNoGradientColor) {
								switch (workFor) {
									case "dd-ct-color-line1":
										gradientColor = lEditor.currentLogo.generate.textGradient;
										break;
									case "dd-ct-color-line2":
										gradientColor = lEditor.currentLogo.generate.text2Gradient;
										break;
									case "dd-ct-color-overall":
									default:
										if (lEditor.currentLogo.generate.textGradient && lEditor.currentLogo.generate.textGradient != "") {
											gradientColor = lEditor.currentLogo.generate.textGradient;
										}
										else if (lEditor.currentLogo.generate.text2Gradient && lEditor.currentLogo.generate.text2Gradient != "") {
											gradientColor = lEditor.currentLogo.generate.text2Gradient;
										}
										break;
								}
							}
							break;
						case 14:
							childNum = 2;
							if (!p_bIsNoGradientColor) {
								gradientColor = lEditor.currentLogo.generate.sloganGradient;
							}
							if (p_sColor == "") {
								p_sColor = "#000000";
							}
							break;
						case 15:
							childNum = 3;
							if (!p_bIsNoGradientColor) {
								gradientColor = lEditor.currentLogo.generate.iconGradient;
							}
							if (p_sColor == "") {
								p_sColor = "#000000";
							}
							break;
						case 43:
							childNum = 5;
							if (!p_bIsNoGradientColor) {
								gradientColor = lEditor.currentLogo.generate.iconFrameGradient;
							}
							if (p_sColor == "") {
								p_sColor = "#000000";
							}
							break;
						case 16:
							childNum = 4;
							if (!p_bIsNoGradientColor) {
								if (lEditor.currentLogo.generate.templatePath.frameType === "filled") {
									gradientColor = lEditor.currentLogo.generate.frameFilledGradient;
								} else {
									gradientColor = lEditor.currentLogo.generate.frameGradient;
								}
							}
							if (p_sColor == "") {
								p_sColor = "#000000";
							}
							break;
					}

					break;
			}
			colorBox = picker.find('.input-group-addon.color-box i')[childNum]
			if (gradientColor && gradientColor !== "" && gradientColor !== '') {
				if (gradientsArray[gradientColor]) {
					colorBox.style.background = getGradientStyle(gradientColor);
					picker.find(".colorPickerInput").val(gradientColor + " gradient");
					picker.find(".colorPickerInput").addClass("disabled");
				} else {
					colorBox.style.background = p_sColor;
					picker.find(".colorPickerInput").val(p_sColor);
					picker.find(".colorPickerInput").removeClass("disabled");
				}
			} else {
				colorBox.style.background = p_sColor;
				picker.find(".colorPickerInput").val(p_sColor);
				picker.find(".colorPickerInput").removeClass("disabled");

			}
		}
	}

	// logo listing by color palettes

	function getGradientStyle(color) {
		var stops = gradientsArray[color].stops;
		var content = [];

		stops.forEach(element => {
			content.push(element.color + ' ' + element.offset * 100 + '%');
		});
		return 'linear-gradient(to right, ' + content.join(', ') + ')';
	}

	function palettsColorVariation(editorParameters, p_fCallBack) {
		var colorId = editorParameters.id;
		loadMoreStart++;
		var limit = 10;
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'paletts', color_id: colorId, start: loadMoreStart },
			async: true,
			success: function (json) {
				json = dh_editor_utility.getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					var colorVariant = json.colors;
					var targetLink = parseInt(lEditor.getSession('targetlink'));
					var colorDataType = lEditor.getSession('colorDataType');
					if (typeof colorDataType === 'undefined') {
						colorDataType = 'background';
					}
					var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
					var i = 0;

					var k = (loadMoreStart - 1) * limit;
					var type = '';

					if (loadMoreStart == 1) {
						lEditor.logoTempArr = [];
						lEditor.logoSlider('final', 1);
					}
					var color = '';
					var colorVariantLength = colorVariant.length;
					// $('.load--more--class').remove();
					if (colorVariantLength == 0) {
						return false;
					}

					var returnObj = {};
					$('.editFinalLogo').addClass('hidden');
					$('.editLogoSlider').removeClass('hidden');

					var templateIdStyle = getTempStyle();

					$.each(colorVariant, function (kee, v) {

						var idKey = logoMakerFunction.genRandomId();
						logoTemp.cpId = v.color_id;
						logoTemp.generate.idKey = idKey;


						logoTemp.generate.bgColor = v.bg_color;
						constantVars.colors.bgColorFamily = v.color_parent;

						var textColor = v.text_color;
						var frameColor = v.frame_color;
						var frameFilledColor = v.filled_frame_color;
						var iconFrameColor = v.frame_color;
						var iconColor = v.icon_color;
						var sloganColor = v.slogan_color;

						if (gradientsArray[v.text_color]) {
							logoTemp.generate.mainTextColor = "";
							logoTemp.generate.textGradient = v.text_color;
							textColor = getGradientStyle(v.text_color);

							logoTemp.generate.mainText2Color = "";
							logoTemp.generate.text2Gradient = v.text_color;
						}
						else {
							logoTemp.generate.textGradient = "";
							logoTemp.generate.mainTextColor = v.text_color;

							logoTemp.generate.text2Gradient = "";
							logoTemp.generate.mainText2Color = v.text_color;
						}
						constantVars.colors.mainTextFamily = v.color_parent;

						if (gradientsArray[v.icon_color]) {
							logoTemp.generate.iconColor = "";
							logoTemp.generate.iconGradient = v.icon_color;
							iconColor = getGradientStyle(v.icon_color);
						}
						else {
							logoTemp.generate.iconGradient = "";
							logoTemp.generate.iconColor = v.icon_color;
						}
						constantVars.colors.iconFamily = v.color_parent;

						if (gradientsArray[v.frame_color]) {
							logoTemp.generate.frameColor = "";
							logoTemp.generate.frameGradient = v.frame_color;
							frameColor = getGradientStyle(v.frame_color);
						}
						else {
							logoTemp.generate.frameGradient = "";
							logoTemp.generate.frameColor = v.frame_color;
						}

						if (gradientsArray[v.filled_frame_color]) {
							logoTemp.generate.frameFilledColor = "";
							logoTemp.generate.frameFilledGradient = v.filled_frame_color;
							frameFilledColor = getGradientStyle(v.filled_frame_color);
						}
						else {
							logoTemp.generate.frameFilledGradient = "";
							logoTemp.generate.frameFilledColor = v.filled_frame_color;
						}

						constantVars.colors.frameFamily = v.color_parent;

						if (gradientsArray[v.frame_color]) {
							logoTemp.generate.iconFrameColor = "";
							logoTemp.generate.iconFrameGradient = v.frame_color;
							frameFilledColor = getGradientStyle(v.frame_color);
							v.icon_frame_color = v.frame_color;
						}
						else {
							logoTemp.generate.iconFrameGradient = "";
							logoTemp.generate.iconFrameColor = v.frame_color;
							v.icon_frame_color = v.frame_color;
						}

						constantVars.colors.iconFrameFamily = v.color_parent;

						if (gradientsArray[v.slogan_color]) {
							logoTemp.generate.sloganTextColor = "";
							logoTemp.generate.sloganGradient = v.slogan_color;
							sloganColor = getGradientStyle(v.slogan_color);
						}
						else {
							logoTemp.generate.sloganGradient = "";
							logoTemp.generate.sloganTextColor = v.slogan_color;
						}

						constantVars.colors.sloganTextFamily = v.color_parent;
						returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey, null, null, "palettsColorVariation");
						logoTemp.generate = returnObj.logoObj;
						lEditor.logoTempArr[k] = dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(logoTemp));
						var favoriteStatus = "";
						var toolTxt = "Add to favorites";
						var dataLogoId = 0;
						var subType = $('.colorPaletteButton.active').attr('data-id');
						if (typeof subType === 'undefined') {
							subType = $('.colorPaletteVariants a.active').attr('data-id');
						}
						var favData = logoMakerFunction.isExistInFavoriteJson('colorPallete', subType, k);
						if (favData !== false) {
							favoriteStatus = "active";
							toolTxt = "Remove from favorites";
							dataLogoId = favData;
						}


						let iconColorToolTipText = v.icon_color;
						let iconFrameColorToolTipText = v.icon_frame_color;
						let sloganColorToolTipText = v.slogan_color;
						let textColorToolTipText = v.text_color;
						let bgColorToolTipText = v.bg_color;

						let frameColorToolTipText = "";
						if (logoTemp.generate.templatePath.isFrame != 0 && logoTemp.generate.framePath != "") {
							if (logoTemp.generate.templatePath.frameType == 'outline') {
								frameColorToolTipText = v.frame_color;
							} else {
								frameColorToolTipText = v.filled_frame_color;
							}
						}

						if (logoTemp.generate.templatePath.isFrame == 1 && logoTemp.generate.templatePath.frameType == "filled") {

							bgColorToolTipText = logoTemp.generate.bgColor;

							if (logoTemp.generate.frameFilledGradient) {
								frameFilledColor = getGradientStyle(logoTemp.generate.frameFilledGradient);
								frameColorToolTipText = logoTemp.generate.frameFilledGradient;
							} else {
								frameFilledColor = logoTemp.generate.frameFilledColor;
								frameColorToolTipText = logoTemp.generate.frameFilledColor;
							}

							if (logoTemp.generate.iconGradient) {
								iconColor = getGradientStyle(logoTemp.generate.iconGradient);
								iconColorToolTipText = logoTemp.generate.iconGradient;
							} else {
								iconColor = logoTemp.generate.iconColor;
								iconColorToolTipText = logoTemp.generate.iconColor;
							}

							if (logoTemp.generate.iconFrameGradient) {
								iconFrameColor = getGradientStyle(logoTemp.generate.iconFrameGradient);
								iconFrameColorToolTipText = logoTemp.generate.iconFrameGradient;
							} else {
								iconFrameColor = logoTemp.generate.iconFrameColor;
								iconFrameColorToolTipText = logoTemp.generate.iconFrameColor;
							}
							//sloganColor
							if (logoTemp.generate.sloganGradient) {
								sloganColor = getGradientStyle(logoTemp.generate.sloganGradient);
								sloganColorToolTipText = logoTemp.generate.sloganGradient;
							} else {
								sloganColor = logoTemp.generate.sloganTextColor;
								sloganColorToolTipText = logoTemp.generate.sloganTextColor;
							}

							if (logoTemp.generate.textGradient) {
								textColor = getGradientStyle(logoTemp.generate.textGradient);
								textColorToolTipText = logoTemp.generate.textGradient;
							} else {
								textColor = logoTemp.generate.mainTextColor;
								textColorToolTipText = logoTemp.generate.mainTextColor;
							}

						}

						var templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

						slickElement = '<div class="logos--boxes color-logo-boxes color--variation" data-cpId = "' + v.color_id + '"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logo-favourite iconFav ' + favoriteStatus + '" data-toggle="tooltip" title="" data-type="favorite" data-listType = "colorPallete" data-id="' + (k) + '" data-logo-id="' + dataLogoId + '" data-original-title="' + toolTxt + '"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="color"  data-id="' + (k++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color : ' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div><div class="color-palette-name"><span>' + v.color_name + '</span>';
						slickElement += '<div class="color-palettes">';
						if (logoTemp.generate.templatePath.isFrame != 0 && logoTemp.generate.framePath != "") {
							if (logoTemp.generate.templatePath.frameType == 'outline') {
								slickElement += '<a href="javascript:;" style="background:' + frameColor + '" data-toggle="tooltip" data-html="true" data-original-title="Container Color : ' + frameColorToolTipText + '"></a>';
							} else {
								slickElement += '<a href="javascript:;" style="background:' + frameFilledColor + '" data-toggle="tooltip" data-html="true" data-original-title="Filled Container Color : ' + frameColorToolTipText + '"></a>';
							}
						}
						if (logoTemp.generate.templatePath.isIcon != 0) {
							slickElement += '<a href="javascript:;" style="background:' + iconColor + '" data-toggle="tooltip" data-html="true" data-original-title="Symbol Color : ' + iconColorToolTipText + '"></a>';
						}
						if (logoTemp.generate.templatePath.isMono != 0) {
							slickElement += '<a href="javascript:;" style="background:' + iconColor + '" data-toggle="tooltip" data-html="true" data-original-title="Monogram Color : ' + iconColorToolTipText + '"></a>';
						}
						if (logoTemp.generate.templatePath.isIconFrame != 0) {
							slickElement += '<a href="javascript:;" style="background:' + iconFrameColor + '" data-toggle="tooltip" data-html="true" data-original-title="Inner Container Color : ' + iconFrameColorToolTipText + '"></a>';
						}
						if (logoTemp.sloganName != "") {
							slickElement += '<a href="javascript:;" style="background:' + sloganColor + '" data-html="true" data-toggle="tooltip" data-original-title="Slogan Color : ' + sloganColorToolTipText + '"></a>';
						}
						if (logoTemp.logoName != "") {
							slickElement += '<a href="javascript:;" style="background:' + textColor + '" data-html="true" data-toggle="tooltip" data-original-title="Company Name Color : ' + textColorToolTipText + '"></a>';
						}
						slickElement += '<a href="javascript:;" data-html="true" style="background-color:' + bgColorToolTipText + '" data-toggle="tooltip" data-original-title="Background Color : ' + bgColorToolTipText + '"></a>';
						slickElement += '</div>';
						slickElement + '</div></div>';

						$(".finalogoSlider").append(slickElement);
						dh_utility_common.changeBg();
						i++;
						if (json.pagination == 1 && i == colorVariantLength) {
							if ($('.load--more--class').length) {
								$('.load--more--class').remove();
							}
							$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMorePaletts load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
							if (p_fCallBack) {
								p_fCallBack();
							}
						} else {
							if (i == 1) {
								if ($('.load--more--class').length) {
									$('.load--more--class').remove();
								}
							}

							if (json.pagination == 0) {
								if (p_fCallBack) {
									p_fCallBack();
								}
							}
						}

					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});
	}

	// for pagination 
	$('body').on('click', '.loadMoreColors', function () {
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		fixedColorVariation(editorParameters, function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});

	$('body').on('click', '.loadMorePaletts', function () {
		$('.loadMoreLogosBoxes').css({ 'display': 'inline-block' });
		var scrollLastHeight = $('.step_7').find(".finalogoSlider").height();
		palettsColorVariation(editorParameters, function () {
			var scrollGap = $('.step_7').find(".finalogoSlider").height() - scrollLastHeight;
			$("html, body").animate({
				scrollTop: $('.step_7').find(".finalogoSlider").height() - scrollGap
			}, { duration: 'fast', easing: 'linear' });
		});
	});
	$('body').on('click', '.loadMoreGenerate', function () {
		$(".loadMoreGenerate").addClass('activating');
		var scrollLastHeight = $('.step_6').find(".sliderContainer").height();
		var scrollGap = 0;
		if (version == "v6" || version == "vd2" || version == "vd4") {
			if ($(".step6-logo-section").find(".sliderContainer").width() > $(".step6-logo-section").find(".sliderContainer").height()) {
				scrollLastHeight = $(".step6-logo-section").find(".sliderContainer").width()
			} else {
				scrollLastHeight = $(".step6-logo-section").find(".sliderContainer").height();
			}
		} else {
			scrollLastHeight = $('.step_6').find(".sliderContainer").height();
		}
		let seeMoreChangesClick = false;
		if ($(".load-more-anim .changes-button.animate .step6-loadmore-nochange").css("display") == "none") {
			seeMoreChangesClick = true;
		}
		lEditor.generateDynamicLogos(true, function () {
			if (version == "v6" || version == "vd2" || version == "vd4") {
				if ($(".step6-logo-section").find(".sliderContainer").width() > $(".step6-logo-section").find(".sliderContainer").height()) {
					scrollGap = $(".step6-logo-section").find(".sliderContainer").width() - scrollLastHeight;
					$(".step6-left-section").animate({
						scrollLeft: $(".step6-logo-section").find(".sliderContainer").width() - scrollGap
					}, 'slow');
				} else {
					scrollGap = $(".step6-logo-section").find(".sliderContainer").height() - scrollLastHeight;
					$(".step6-left-section").animate({
						scrollTop: $(".step6-logo-section").find(".sliderContainer").height() - scrollGap
					}, 'fast');
				}
			} else {
				scrollGap = $('.step_6').find(".sliderContainer").height() - scrollLastHeight;
				$("html, body").animate({
					scrollTop: $('.step_6').find(".sliderContainer").height() - scrollGap
				}, 'fast');
			}
			if (!seeMoreChangesClick) {
				step6LoadCounter = step6LoadCounter + 1;
			}

			if (step6LoadCounter === 5) {
				$(".after_load_more").show();
			}
		});
	});

	$('body').on('click', '.edit_brief_btn', function () {
		lEditor.currentStep = lEditor.currentStep - 2;
		lEditor.setSession('currPage', lEditor.currentStep);
		$("html, body").animate({ scrollTop: 0 });
		$('.hide--icons').remove();
		$('#tags').val('');
		$('.startIcoSection').removeClass('hidden');
		$('.startIcoTab').removeClass('disabled');
		$('.loadMoreIcons, .iconsContainerBox, .brickImage').addClass('hidden');
		$('.flipIconTag').removeClass('hidden');
		lEditor.showStep();
	});

	$('body').on('click', '.explore_logo_btn', function () {
		//https://www.designhill.com/launch/logo-design/visual-style
		//https://www.designhill.com/launch/logo-design/visual-style?industry=7360
		let industryId = lEditor.getSession("search_industry_id") || "";
		//var newUrl = DH.baseURL + '/launch/logo-design/visual-style?industry=' + industryId;
		var newUrl = DH.baseURL + '/jobs';
		newUrl += '&utm_source=logo_maker_load_more_script&utm_medium=logo_maker_load_more_script_post_a_project_button&utm_campaign=logo_maker_load_more_script_Post_a_Project_Button&utm_term=post_a_project';
		window.open(newUrl, '_blank');
	});
	// check icon is available or not in logo 
	function isIconAvail() {
		var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var isIcon = currLogo.generate.templatePath.isIcon;
		var editIconVal = lEditor.getSession('iconValue');
		if (isIcon == 0) {
			$('.layoutDisplay').addClass('hidden');
			$('.symbolVariations').removeClass('hidden');
			$('.noResultFound').show();
			loadMoreStart = 0;
			if (editIconVal != null && editIconVal != 'undefined' && editIconVal != '') {
				$('.editFinalLogo, .previewSection').addClass('hidden');
				$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
				lEditor.editIconsData();
			} else {
				$('.editFinalLogo, .previewSection').addClass('hidden')
				$('.editLogoSlider, .currentLogoBox').removeClass('hidden');
			}
			$('.finalogoSlider').html('<div class="icons-blank result-option iconBlank">' + forSearchSymbol + '</div>');
			lEditor.cleanSession('iconValue');

		} else {
			$('.layoutDisplay, .editSymbolsSection').removeClass('hidden');
			$('.symbolVariations').addClass('hidden');
			$('.noResultFound').hide();
		}

	}

	// check monogram is available or not 
	function isMonoAvail() {
		var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var isMono = currLogo.generate.templatePath.isMono;
		if (parseInt(isMono) == 0) {
			$('.layoutDisplay, .cancel--symbol, .editFinalLogo, .previewSection').addClass('hidden');
			$('.monoVariations, .editLogoSlider').removeClass('hidden');
			lEditor.getMonogramVariations("");
		} else if (parseInt(isMono) == 1) {
			$('.layoutDisplay, .editMonoSection, .editFinalLogo').removeClass('hidden');
			$('.monoVariations, .editLogoSlider').addClass('hidden');
		}
	}

	// color listing 

	function colorVariation(colorVal) {
		var workFor = null;
		if (lEditor.currentLogo.generate.templatePath.isDBLineCompanyText == "yes") {
			workFor = $('.subChild-13').find(".company-text-color-box").attr("last_selected");
		}
		lEditor.logoSlider('final', 1);
		var dataOption = colorVal;
		var colorVariant = logoMakerFunction.getShadesOfColor(dataOption);
		var targetLink = parseInt(lEditor.getSession('targetlink'));
		var colorDataType = lEditor.getSession('colorDataType');
		if (typeof colorDataType === 'undefined') {
			colorDataType = 'background';
		}
		lEditor.logoTempArr = [];
		var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var i = 0;
		var k = 0;
		var type = '';
		var color = '';
		var colorVariantLength = colorVariant.length;
		var returnObj = {};
		$('.editFinalLogo').addClass('hidden');
		$('.editLogoSlider').removeClass('hidden');
		$.each(colorVariant, function (k, v) {
			var idKey = logoMakerFunction.genRandomId();
			logoTemp.generate.idKey = idKey;
			switch (colorDataType) {
				case 'background': {
					color = "" + v;

					logoTemp.generate.bgColor = color;
					constantVars.colors.bgColorFamily = dataOption;
					returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey);
					break;
				}
				case 'foreground': {
					var j = 0;
					$('.colorSection .subnav li.active').each(function () {
						color = "" + v;
						var option = $(this).find('a').data('target');
						switch (option) {
							case 13: {
								switch (workFor) {
									case "dd-ct-color-line1":
										logoTemp.generate.mainTextColor = color;
										logoTemp.generate.textGradient = "";
										break;
									case "dd-ct-color-line2":
										logoTemp.generate.mainText2Color = color;
										logoTemp.generate.text2Gradient = "";
										break;
									case "dd-ct-color-overall":
									default:
										logoTemp.generate.mainTextColor = color;
										logoTemp.generate.textGradient = "";
										logoTemp.generate.mainText2Color = color;
										logoTemp.generate.text2Gradient = "";
										break;
								}
								constantVars.colors.mainTextFamily = dataOption;
								break;
							}
							case 14: {
								logoTemp.generate.sloganTextColor = color;
								logoTemp.generate.sloganGradient = "";
								constantVars.colors.sloganTextFamily = dataOption;
								break;
							}
							case 15: {
								logoTemp.generate.iconColor = color;
								logoTemp.generate.iconGradient = "";
								constantVars.colors.iconFamily = dataOption;
								break;
							}
							case 16: {

								if (logoTemp.generate.templatePath.frameType == "filled") {
									logoTemp.generate.frameFilledColor = color;
									logoTemp.generate.frameFilledGradient = "";
								} else {
									logoTemp.generate.frameColor = color;
									logoTemp.generate.frameGradient = "";
								}
								logoTemp.generate.frameColor = color;
								logoTemp.generate.frameGradient = "";
								constantVars.colors.frameFamily = dataOption;
								break;
							}
							case 43: {
								logoTemp.generate.iconFrameColor = color;
								logoTemp.generate.iconFrameGradient = "";
								constantVars.colors.iconFrameFamily = dataOption;
								break;
							}
						}
						returnObj = logoMakerFunction.generateLogoTemplateByOption(logoTemp, type, idKey);
						j++;
					});
				}
			}
			logoTemp.generate = returnObj.logoObj;
			lEditor.logoTempArr[k] = dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(logoTemp));
			$('.colorNotFound').remove();
			slickElement = '<div class="logos--boxes"><div class="item logo--slides logoSlides"><div class="logo-favourite iconFav" data-toggle="tooltip" title="" data-type="favorite" data-id="' + (k) + '" data-logo-id="0" data-original-title="Add to favorites"><i class="icon icon-heart"></i></div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="color" data-id="' + (k++) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color:' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
			$(".finalogoSlider").append(slickElement);
			dh_utility_common.changeBg();
			i++;
		});
	}
	// for setting scale of group in svg
	function setScale(width, currWidth, height, currHeight) {
		var scale = 1;
		var wScale = 1;
		var hScale = 1;
		if (currWidth > width) {
			wScale = 1 * (width / currWidth);
		}
		if (currHeight > height) {
			hScale = 1 * (height / currHeight);
		}
		scale = wScale;
		if (wScale > hScale) {
			scale = hScale;
		}
		if (scale == 0) scale = 1;
		return scale;

	}
	// for updating current object 
	function updateCurrLogoObject(obj) {
		var generate = {};
		generate = $.extend(true, {}, obj);
		if (generate.generate.templatePath.isIcon == 1 || generate.generate.templatePath.isMono == 1) {
			if (typeof generate.generate.templatePath.iconFrameBox !== 'undefined') {
				if (typeof generate.generate.templatePath.iconFrameBox.x !== 'undefined' || generate.generate.templatePath.updates.iconFrameBox.x !== 'undefined') {
					generate.generate.templatePath.iconFrameBox.x = generate.generate.templatePath.updates.iconFrameBox.x;
					generate.generate.templatePath.iconFrameBox.y = generate.generate.templatePath.updates.iconFrameBox.y;
					generate.generate.templatePath.iconFrameBox.scale = generate.generate.templatePath.updates.iconFrameBox.scale;
				}
			}
			if (typeof generate.generate.templatePath.icon.x !== 'undefined') {
				generate.generate.templatePath.icon.x = generate.generate.templatePath.updates.icon.x;
				generate.generate.templatePath.icon.y = generate.generate.templatePath.updates.icon.y;
				generate.generate.templatePath.icon.scale = generate.generate.templatePath.updates.icon.scale;
			}
		}

		if (generate.generate.templatePath.isDBLineCompanyText == "yes") {
			if (typeof generate.generate.templatePath.text1.x !== 'undefined') {
				generate.generate.templatePath.text1.x = generate.generate.templatePath.updates.text1.x;
				generate.generate.templatePath.text1.y = generate.generate.templatePath.updates.text1.y;
				generate.generate.templatePath.text1.scale = generate.generate.templatePath.updates.text1.scale;
			}
			if (typeof generate.generate.templatePath.text2.x !== 'undefined') {
				generate.generate.templatePath.text2.x = generate.generate.templatePath.updates.text2.x;
				generate.generate.templatePath.text2.y = generate.generate.templatePath.updates.text2.y;
				generate.generate.templatePath.text2.scale = generate.generate.templatePath.updates.text2.scale;
			}
		} else {
			if (typeof generate.generate.templatePath.text.x !== 'undefined') {
				generate.generate.templatePath.text.x = generate.generate.templatePath.updates.text.x;
				generate.generate.templatePath.text.y = generate.generate.templatePath.updates.text.y;
				generate.generate.templatePath.text.scale = generate.generate.templatePath.updates.text.scale;
			}
		}


		if (typeof generate.generate.templatePath.slogan.x !== 'undefined') {
			generate.generate.templatePath.slogan.x = generate.generate.templatePath.updates.slogan.x;
			generate.generate.templatePath.slogan.y = generate.generate.templatePath.updates.slogan.y;
			generate.generate.templatePath.slogan.scale = generate.generate.templatePath.updates.slogan.scale;
		}

		if (typeof generate.generate.templatePath.textAndSlogan.x !== 'undefined') {
			generate.generate.templatePath.textAndSlogan.x = generate.generate.templatePath.updates.textAndSlogan.x;
			generate.generate.templatePath.textAndSlogan.y = generate.generate.templatePath.updates.textAndSlogan.y;
			generate.generate.templatePath.textAndSlogan.scale = generate.generate.templatePath.updates.textAndSlogan.scale;
		}

		if (typeof generate.generate.templatePath.containerBody.x !== 'undefined') {
			generate.generate.templatePath.containerBody.x = generate.generate.templatePath.updates.containerBody.x;
			generate.generate.templatePath.containerBody.y = generate.generate.templatePath.updates.containerBody.y;
			generate.generate.templatePath.containerBody.scale = generate.generate.templatePath.updates.containerBody.scale;
		}

		if (typeof generate.generate.templatePath.logoContainer.x !== 'undefined') {
			generate.generate.templatePath.logoContainer.x = generate.generate.templatePath.updates.logoContainer.x;
			generate.generate.templatePath.logoContainer.y = generate.generate.templatePath.updates.logoContainer.y;
			generate.generate.templatePath.logoContainer.scale = generate.generate.templatePath.updates.logoContainer.scale;
		}

		if (generate.generate.templatePath.isIconFrame == 1) {

			if (typeof generate.generate.templatePath.iconFrame.x !== 'undefined' || generate.generate.templatePath.updates.iconFrame.x !== 'undefined') {
				generate.generate.templatePath.iconFrame.x = generate.generate.templatePath.updates.iconFrame.x;
				generate.generate.templatePath.iconFrame.y = generate.generate.templatePath.updates.iconFrame.y;
				generate.generate.templatePath.iconFrame.scale = generate.generate.templatePath.updates.iconFrame.scale;
				//	alert(generate.generate.templatePath.iconFrame.scale);
			}
		}

		if (generate.generate.templatePath.isFrame == 1) {
			if (typeof generate.generate.templatePath.frame.x !== 'undefined' || generate.generate.templatePath.updates.frame.x !== 'undefined') {
				generate.generate.templatePath.frame.x = generate.generate.templatePath.updates.frame.x;
				generate.generate.templatePath.frame.y = generate.generate.templatePath.updates.frame.y;
				generate.generate.templatePath.frame.scale = generate.generate.templatePath.updates.frame.scale;
			}
		}
		return generate;
	}
	// saving logo  
	$('#saveIcon').click(function () {
		$(this).addClass('animated');
		setTimeout(function () { $('.topActionBtn').removeClass('animated'); }, 1500);
		lEditor.currentLogo.currencyId = lEditor.getSession('currencyId');
		var logoId = lEditor.getCurrentLogoId();
		var dataAnalysisObj = dh_editor_utility.getDataAnalsyis(lEditor.currentLogo, false);
		var logoJSONObj = lEditor.validateJSON(lEditor.currentLogo, dataAnalysisObj);
		const curr_logo_blob = new Blob([JSON.stringify(logoJSONObj)], {
			type: "application/json;charset=utf-8"
		});
		const svg_logo_blob = new Blob([logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate, true)], { type: 'image/svg+xml' });
		dh_lm_save.saveAction(logoId, curr_logo_blob, svg_logo_blob, null, null, false, false, JSON.stringify(dataAnalysisObj), JSON.stringify(dh_editor_utility.createLogging("saveIcon click"))).then((p_oJSON) => {
			let json = dh_editor_utility.getValidJsonParseObj(p_oJSON);
			if (json.status == 0) {
				lEditor.alertMessages('error', json.msg);
			} else {
				lEditor.alertMessages('success', json.msg);
				lEditor.setCurrentLogoId(json.data.logo_id);
			}
			dh_editor_utility.clearException();
		});

	});
	// copieng logo 
	$('#copyIcon').click(function () {
		$(this).addClass('animated');
		setTimeout(function () { $('.topActionBtn').removeClass('animated'); }, 1500);
		lEditor.currentLogo.currencyId = lEditor.getSession('currencyId');
		var dataAnalysisObj = dh_editor_utility.getDataAnalsyis(lEditor.currentLogo, false);
		var logoJSONObj = lEditor.validateJSON(lEditor.currentLogo, dataAnalysisObj);
		const curr_logo_blob = new Blob([JSON.stringify(logoJSONObj)], {
			type: "application/json;charset=utf-8"
		});
		const svg_logo_blob = new Blob([logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate, true)], { type: 'image/svg+xml' });
		dh_lm_save.saveAction(0, curr_logo_blob, svg_logo_blob, null, null, false, false, JSON.stringify(dataAnalysisObj), JSON.stringify(dh_editor_utility.createLogging("copyIcon click"))).then((p_oJSON) => {
			json = dh_editor_utility.getValidJsonParseObj(p_oJSON);
			if (json.status == 0) {
				lEditor.alertMessages('error', json.msg);
			} else {
				lEditor.setCurrentLogoId(json.data.logo_id);
				lEditor.alertMessages('success', json.msg);
				$('.savedLogoCount').html('(' + json.data.saved_count + ')');
				$('.favLogoCount').html('(' + json.data.fav_count + ')');
			}
			dh_editor_utility.clearException();
		});
	});
	$('body').on('click', '.confirmDelete', function () {
		var confirmId = $(this).attr('data-logoid');
		var msgBox = $('.favoriteLogoTab .no-favourite');
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'delete', logo_id: confirmId },
			async: false,
			success: function (json) {
				json = dh_editor_utility.getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					$('[data-id="' + confirmId + '"]').parents('.savedLogoLists').remove();
					$('[data-id="' + confirmId + '"]').parents('.favoriteLogoLists').remove();
					$('.savedLogoCount').html('(' + json.saved_count + ')');
					$('.favLogoCount').html('(' + json.favorite_count + ')');
					msgBox[$('.favoriteLogoLists.saved-logo-lists').length == 0 ? 'show' : 'hide']();
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			}
		});
		$('#myModal').modal('hide');
	})

	// removing logo 	
	$('body').on('click', '.removeLogo', function (e) {
		e.stopPropagation();
		var obj = $(this);
		var logoId = $(this).data('id');
		$('.confirmDelete').attr('data-logoid', logoId);
		$('#myModal').modal('show');
	});

	// sharing logo
	$('body').on('click', '.shareButton, .shareLogo', function (e) {
		e.stopPropagation();
		$('#share-modal').modal('show');
		$('.btnCopy').text('Copy');
		lEditor.previewColors();
		lEditor.previewLogo();
	});

	$('.share-modal-popup').on('click', '.shareCommon', function () {
		var getId = $(this).data('id');
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		$(getId).addClass('active');
		$(getId).siblings().removeClass('active');
	});



	$('.loginOption').on('click', function () {
		$('.le--sidenavbar').addClass('focusable');
		$('.li-side--menu').animate({ right: '0px' }, 'fast');
		$('.le--sidenavbar').css({ 'background-color': 'rgba(0,0,0,0.4)', 'z-index': '9999', 'right': '0px' });
		$('body').css('overflow', 'hidden');

	});
	$('body').on('click', '.le--close', function () {
		$('.li-side--menu').animate({ right: '-420px' }, 'fast', function () {
			$('.le--sidenavbar').css('right', '-100%');
			$('body').css('overflow', 'auto');
			$('.le--sidenavbar').removeClass('focusable');
		});

	})
	$('body').on('click', '.le--sidenavbar', function (e) {
		if (!$(e.target).closest('.li-side--menu').length) {
			$('.li-side--menu').animate({ right: '-420px' }, 'fast', function () {
				$('.le--sidenavbar').css('right', '-100%');
				$('body').css('overflow', 'auto');
				$('.le--sidenavbar').removeClass('focusable');
			});
		}
	});

	$('.logoVariations').on('click', function () {
		$('.logoVariationContainer').append('<div class="logo-variation-container logoContainer"></div>');
		$('.logoVariationContainer .sliderContainer').addClass('active');
		$('body').css('overflow', 'hidden');
	});

	$('body').on('click', '.logoContainer, .closeVariation', function (e) {
		if (e.target == this) {
			$('.logoVariationContainer .sliderContainer').removeClass('active');
			setTimeout(function () {
				$('.logoContainer').remove();
				$('body').css('overflow', 'auto');
			}, 300);
		}
	});
	// Open Logo detail from saved and favourite logo section 
	$('body').on('click', '.openLogoDetail', function () {
		var obj = $(this);
		var logoId = $(this).data('id');
		var editorId = logoId * 11;

		window.location.href = DH.baseURL + '/tools/logo-maker?editor=' + editorId;
	});

	$('body').on('click', '.setSaveDefaultLogo', function () {
		var obj = $(this);
		var logoId = $(this).data('id');
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'default_logo', logo_id: logoId },
			async: false,
			success: function (json) {
				json = dh_editor_utility.getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					var logo = json.data.logo;
					lEditor.setCurrentLogoId(logo.logo_id);
					lEditor.setSession('sloganText', logo.logo_slogan);
					lEditor.updateFontsObject('logo');
					lEditor.updateFontsObject('logoName2');
					lEditor.updateFontsObject('slogan');
					lEditor.setSession('logoname', logo.logo_name);
					lEditor.setSession('currentLogo', logo.logo_json);
					$('.commonEditSection').addClass('hidden');
					lEditor.setSession('targetlink', 1);
					lEditor.setSession('parentlink', 0);
					lEditor.setSession('defaultlink', 0);
					$('.table-menu li, .currentLogoContainer,.logoTab').removeClass('active');
					$('.logosTabBox').removeClass('tabActive');
					$('.logoTab:first-child').addClass('active');
					$('.closeCurrentLogo, .expandLogo').hide();
					$('body').css('overflow', 'auto');
					lEditor.editLogoSteps();
					lEditor.previewColors();
					lEditor.previewLogo();
					// $('.editSloganName').val(lEditor.getSession('sloganText'));
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});
	});
	// saving logo after using slidre
	function saveSliderData() {
		var logoId = lEditor.getCurrentLogoId();
		var dataAnalysisObj = dh_editor_utility.getDataAnalsyis(lEditor.currentLogo, false);
		lEditor.setSession('currentLogo', dh_editor_utility.getValidJsonStringifyObj(lEditor.currentLogo));

		var logoJSONObj = lEditor.validateJSON(lEditor.currentLogo, dataAnalysisObj);
		const curr_logo_blob = new Blob([JSON.stringify(logoJSONObj)], {
			type: "application/json;charset=utf-8"
		});
		const svg_logo_blob = new Blob([logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate, true)], { type: 'image/svg+xml' });
		dh_lm_save.saveAction(logoId, curr_logo_blob, svg_logo_blob, null, null, true, false, JSON.stringify(dataAnalysisObj), JSON.stringify(dh_editor_utility.createLogging("on saveSliderData"))).then((p_oJSON) => {
			let json = dh_editor_utility.getValidJsonParseObj(p_oJSON);
			if (json.status == 0) {
				lEditor.alertMessages('error', json.msg);
			} else {
				lEditor.alertMessages('success', json.msg);
				lEditor.setCurrentLogoId(json.data.logo_id);
			}
			dh_editor_utility.clearException();
		});
		lEditor.previewColors();
		lEditor.previewLogo();
	}

	// for pagination 
	$('body').on('click', '.loadMoreSavedLogos', function () {
		getSavedLogoListing();
	});

	$('body').on('click', '.loadMoreFavoriteLogos', function () {
		getFavoriteLogoListing();
	});

	// by tushar 
	function getSavedLogoListing() {
		var htm = "";
		var currLogoId = lEditor.getCurrentLogoId();

		savedPagination++;
		if (savedPagination == 1) {
			$('.savedLogo').append('<div class="loadMoreIcons common--loader text-center"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></div>');
		}
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'listing', start: savedPagination },
			async: true,
			success: function (json) {
				$('.loadMoreIcons').remove();
				json = dh_editor_utility.getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {

					var i = 0;
					$('.loadMoreSavedLogos').parents('.load--more--class').remove();
					if (json.data.logos.length == 0) { return false; }
					$.each(json.data.logos, function (k, v) {
						var closeHtml = '';
						var defaultHtml = '';
						var activeFav = '';
						var favToolTip = 'Add to favorites';
						if (v.logo_is_favorite == 1) {
							activeFav = 'active';
							favToolTip = 'Remove from favorites';
						}
						if (currLogoId != v.logo_id) {
							closeHtml = '<img src="' + DH.getAssetImgUrl('logo-maker/close.svg') + '" class="removeLogo" data-id="' + v.logo_id + '">';
							defaultHtml = '<div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update openLogoDetail" data-id="' + v.logo_id + '"><span>Update to this</span></a></div>';
							dh_utility_common.changeBg();
						}
						$('.savedLogo').append('<div class="savedLogoLists saved-logo-lists" style="background-color:' + v.bg_color + '"><div class="water-mark-img"></div><div class="logo-favourite favLogoIcon ' + activeFav + '" data-placement="bottom" data-toggle="tooltip" title="" data-id="' + v.logo_id + '" data-original-title="' + favToolTip + '"><i class="icon icon-heart"></i></div>' + closeHtml + ' ' + v.logo_svg + ' ' + defaultHtml + '</div>');
						i++;
						if (json.pagination == 1 && i == json.data.logos.length) {
							$('.savedLogo').append('<div class="load--more--class"><a class="loadMoreSavedLogos load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
						}
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});

	};

	// by tushar     
	function userLoginPopup(p_fCallBack) {
		login.openSignupBox(p_fCallBack);
	}

	// restricting back button 
	window.history.pushState('', null, '');
	$(window).on('popstate', function () {
		var page = parseInt(sessionStorage.getItem('currPage'));
		if (page == 7) {
			return true;
		} else if (page == 1 || isNaN(page)) {
			//to resolve jira id DW-9875 in branch DW-9875-revert
			sessionStorage.clear();
			//end here
			history.go(-1);
			return false;
		} else if (page == 2) {
			window.history.pushState('', null, '');
			sessionStorage.setItem('currPage', 1);
			return true;
		} else {

			page = page - 1;
			if (page < 6) {
				$("#logomaker_signup_box").modal('hide');
				$("#logomaker_login_box").modal('hide');
			}
			window.history.pushState('', null, '');
			sessionStorage.setItem('currPage', page);

			lEditor.showStep();
			return false;
		}
		return true;
	});


	$('#industryName').change(function () {
		lEditor.cleanSession('defaultIcon');
		if ($('option:selected', this).val()) {

		} else {
			lEditor.cleanSession("extraIndustry");
			lEditor.cleanSession("industryText");
			currentSelectedIndustry = "";
		}
		if ($(this).val() == 2010) {
			$(".extra--industry").show();
		} else {
			$(".extra--industry").hide();
		}
	});

	// changing template of logo ( left ,right ,down ,up )
	$('.layoutTemplate').click(function (e) {
		e.stopImmediatePropagation();
		var type = $(this).data('option');
		var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		let undoValue;
		if (currLogo.generate.templatePath.isIconFrame === "1") {
			switch (currLogo.generate.templatePath.iconFrame.type) {
				case "center":
					if ((currLogo.generate.templatePath.iconFrame.yType === "up") && (type === 4)) {
						dh_editor_utility.forceConsoleAtStaging("no need to place iconFrame at up and center");
						return;
					}
					else if ((currLogo.generate.templatePath.iconFrame.yType === "down") && (type === 0)) {
						dh_editor_utility.forceConsoleAtStaging("no need to place iconFrame at down and center");
						return;
					}
					break;
				case "left":
					if (type === 1) {
						dh_editor_utility.forceConsoleAtStaging("no need to place iconFrame at left");
						return;
					}
					break;
				case "right":
					if (type === 2) {
						dh_editor_utility.forceConsoleAtStaging("no need to place iconFrame at right");
						return;
					}
					break;
			}
		} else {
			switch (currLogo.generate.templatePath.icon.type) {
				case "center":
					switch (currLogo.generate.templatePath.icon.yType) {
						case "up":
							if (type === 4) {
								dh_editor_utility.forceConsoleAtStaging("no need to place icon at up and center");
								return;
							}
							undoValue = 4;
							break;
						case "down":
							if (type === 0) {
								dh_editor_utility.forceConsoleAtStaging("no need to place icon at down and center");
								return;
							}
							undoValue = 0;
							break;
					}
					break;
				case "left":
					if (type === 1) {
						dh_editor_utility.forceConsoleAtStaging("no need to place icon at left");
						return;
					}
					undoValue = 1;
					break;
				case "right":
					if (type === 2) {
						dh_editor_utility.forceConsoleAtStaging("no need to place icon at right");
						return;
					}
					undoValue = 2;
					break;
			}
		}

		dh_editor_utility.forceConsoleAtStaging("layoutTemplate click type:=" + type);

		onSymbolePlacing(type);
	});

	function checkIconType(p_oIconObj) {
		let undoValue = 0;
		if (p_oIconObj) {
			switch (p_oIconObj.type) {
				case "center":
					switch (p_oIconObj.yType) {
						case "up":
							undoValue = 4;
							break;
						case "down":
							undoValue = 0;
							break;
					}
					break;
				case "left":
					undoValue = 1;
					break;
				case "right":
					undoValue = 2;
					break;
			}
		}
		return undoValue;
	}


	function onSymbolePlacing(type) {
		var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		let oldLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		let isForIcon = currLogo.generate.templatePath.isIcon;
		let isForMonogram = currLogo.generate.templatePath.isMono;


		dh_editor_utility.forceConsoleAtStaging("isForIcon:=" + isForIcon);
		dh_editor_utility.forceConsoleAtStaging("isForMonogram:=" + isForMonogram);


		lEditor.logoTempArr = [];
		lEditor.logoSlider('final', 1);
		var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));

		var isIcon = 0;
		var isMono = 0;
		var isFrame = 0;
		var isIconFrame = 0;
		var isEqual = 0;
		if (typeof logoTemp.generate.templatePath.isIcon !== "undefined") {
			isIcon = logoTemp.generate.templatePath.isIcon;
		}
		if (typeof logoTemp.generate.templatePath.isMono !== "undefined") {
			isMono = logoTemp.generate.templatePath.isMono;
		}
		if (typeof logoTemp.generate.templatePath.isFrame !== "undefined") {
			isFrame = logoTemp.generate.templatePath.isFrame;
		}
		if (typeof logoTemp.generate.templatePath.isIconFrame !== "undefined") {
			isIconFrame = logoTemp.generate.templatePath.isIconFrame;
		}
		if (typeof logoTemp.generate.templatePath.isEqual !== "undefined") {
			isEqual = logoTemp.generate.templatePath.isEqual;
		}

		var actionName = "";

		if (type === 0 || type === 1 || type === 2 || type === 3 || type === 4) {
			logoMakerFunction.resetSlider("logoSizeSlider");
			logoMakerFunction.resetSlider("iconDistanceSlider");
			logoMakerFunction.resetSlider("sloganTextSize");
			logoMakerFunction.resetSlider("sloganLetterSpacing");
			logoMakerFunction.resetSlider("textSloganDistSlider");
			logoMakerFunction.resetSlider("frameSizeSlider");
			actionName = "symbolOrMonoPlacing";
		}

		if (type == 3) {
			$('[data-option=".symbolContainer"]').text('Add Symbol');
			currLogo.monofId = "";
			currLogo.generate.iconPath = "";
			currLogo.generate.iconName = "";
			currLogo.generate.templatePath.isMono = "0";
			currLogo.generate.templatePath.isIcon = "0";
			currLogo.generate.templatePath.isIconFrame = "0";
			currLogo.iconId = "";
			isIcon = 0;
			isMono = 0;
			lEditor.setSession('currentLogo', dh_editor_utility.getValidJsonStringifyObj(currLogo));
			lEditor.setSession('targetlink', 2);
			lEditor.setSession('defaultlink', 7);
			lEditor.setSession('parentlink', 'undefined');
			lEditor.editLogoSteps();
			$('.previewSection').removeClass('hidden');
			$('.topParent-5').parent('li').removeClass('active');
			$('.symbolSection').addClass('hidden');
		} else {
		}
		dh_editor_utility.forceConsoleAtStaging("isIcon:=" + isIcon);
		dh_editor_utility.forceConsoleAtStaging("isMono:=" + isMono);

		var currContainerBodyObj = logoTemp.generate.templatePath.updates.containerBody;
		var isFrameExist = logoTemp.generate.templatePath.isFrame;
		var isDBLineCompanyText = "no";
		if (logoTemp.generate.templatePath.isDBLineCompanyText == "yes") {
			isDBLineCompanyText = logoTemp.generate.templatePath.isDBLineCompanyText;
		}
		var templates = getTemplatesByType(type, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText)[0];
		$.each(templates, function (k, v) {
			logoTemp.generate.templatePath = v;
			logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
			logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
			logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
			if (currLogo.generate.templatePath.isDBLineCompanyText == "yes") {
				logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
			}
			if (isFrameExist == 1) {
				logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;
				logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;
				logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;
				logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
			}
			var idKey = logoMakerFunction.genRandomId();
			logoTemp.generate.idKey = idKey;
			if (type == 3) {
				logoTemp.monofId = "";
				logoTemp.generate.iconPath = "";
				logoTemp.generate.iconName = "";
				logoTemp.iconId = "";
			}
			if (oldLogoObj.generate.isArc == 1 && logoTemp.generate.templatePath.isSupportCurveText != 1) {
				let logo1 = currCompFontObject.getPath(logoTemp.logoName, 0, 0, logoTemp.generate.logoTextSlider, { 'letterSpacing': parseFloat(logoTemp.generate.logoLetterSpacing) });
				logoTemp.generate.logoPath = logo1.toSVG();
				delete logoTemp.generate.isArc;
				delete logoTemp.generate.arcValue;
				delete logoTemp.generate.curveTextActualPathHeight;
				delete logoTemp.generate.curveTextCenterWidth;

			}
			var returnObj = null;
			if (isFrameExist == 1) {
				returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, actionName);
			} else {
				returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, actionName);
			}
			let originalReturnObj = Object.assign({}, returnObj);
			logoTemp.generate = returnObj.logoObj;
			$('.finaLogoInner').html('<div class="svg--slide" style="background-color:' + lEditor.currentLogo.generate.bgColor + ';"><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj.html + '<div class="bgOutlineBox bg-outline-box"></div></div></div>');
			if (originalReturnObj.logoObj.isArc == 1 && originalReturnObj.logoObj.templatePath.isSupportCurveText == 1) {
				$('.finaLogoInner .logoContainerBox .svgSloganText_1').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.slogan.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.slogan.x + "," + (originalReturnObj.logoObj.templatePath.updates.slogan.y) + ")");
				if ((originalReturnObj.logoObj.templatePath.isIcon == 1) || (originalReturnObj.logoObj.templatePath.isMono == 1)) {
					$('.finaLogoInner .logoContainerBox .sampleIconBox').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.x + "," + (originalReturnObj.logoObj.templatePath.updates.iconFrameBox.y) + ")");
				}
			}

			currObj = updateCurrLogoObject(logoTemp);
			lEditor.setDefaultLogo(currObj, currObj.generate, function () {
				let newLogoObj = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));;
				if (type === 3) {
					if (isForIcon == 1) {
						editorUndoRedo.setUndoActData(SYMBOL_REMOVE, oldLogoObj, newLogoObj);
					} else if (isForMonogram == 1) {
						editorUndoRedo.setUndoActData(MONOGRAM_REMOVE, oldLogoObj, newLogoObj);
					}

				} else {
					if (isForIcon == 1) {
						editorUndoRedo.setUndoActData(SYMBOL_POSITION, oldLogoObj, newLogoObj);
					} else if (isForMonogram == 1) {
						editorUndoRedo.setUndoActData(MONOGRAM_POSITION, oldLogoObj, newLogoObj);
					}
				}
			});
		});
		addEditOptions("all");
		lEditor.previewColors();
		lEditor.previewLogo();
		$('#saveIcon').trigger('click');
	}


	$('.cancelSymbol').click(function (e) {
		if (lEditor.currentLogo.generate.templatePath.isIcon == 1) {
			lEditor.setSession('targetlink', 31);
			lEditor.setSession('parentlink', 5);
		} else {
			lEditor.setSession('targetlink', 7);
			lEditor.setSession('parentlink', 2);
			$('.symbolSection').addClass('hidden');
		}

		$('.menuSteps li').removeClass('active');
		lEditor.editLogoSteps();
	});

	$('.cancelMono').click(function (e) {
		if (lEditor.currentLogo.generate.templatePath.isMono == 1) {
			lEditor.setSession('targetlink', 32);
			lEditor.setSession('parentlink', 5);
		} else {
			lEditor.setSession('targetlink', 7);
			lEditor.setSession('parentlink', 2);
			$('.symbolSection').addClass('hidden');
		}
		$('.menuSteps li').removeClass('active');
		$(".logoSection").addClass("hidden");
		lEditor.editLogoSteps();
	});

	$('.cancelFrameContainer').click(function (e) {
		$('.containerOptions').removeClass('active');
		lEditor.setSession('targetlink', 6);
		lEditor.setSession('defaultlink', undefined);
		$('.menuSteps li').removeClass('active');
		lEditor.editLogoSteps();
	});
	$('.cancelIconFrameContainer').click(function (e) {
		$('.innerContainerOptions').removeClass('active');
		lEditor.setSession('targetlink', 6);
		lEditor.setSession('defaultlink', undefined);
		$('.menuSteps li').removeClass('active');
		lEditor.editLogoSteps();
	});


	// 0 => Center, 1 => Left, 2 => Right, 3 => None, 4=> Down
	function getTemplatesByType(type, isIcon, isMono, isFrame, isIconFrame, isEqual, isDBLineCompanyText) {
		var templates = [];
		var templatesDir = [];
		var templatesId = [];
		var fetchTemplatesDataJson = [];
		if (isDBLineCompanyText == "yes") {
			fetchTemplatesDataJson = doubleLineTemplatesDataJson;
		} else {
			fetchTemplatesDataJson = templatesDataJson;
		}

		$.each(fetchTemplatesDataJson, function (k, v) {
			if (typeof v.is_icon_frame == 'undefined' || v.is_icon_frame == null) {
				v.is_icon_frame = 0;
			}
			if (type == 3) {
				isIconFrame = 0;
				// alert();
				if (v.template_direction == type && v.is_frame == isFrame && v.is_icon_frame == isIconFrame && v.is_equal == isEqual) {
					templates.push(v.template_code);
					templatesDir.push(v.template_direction);
					templatesId.push(v.template_id);
				}
			} else {
				// alert(1);
				if (v.template_direction == type && v.is_icon == isIcon && v.is_mono == isMono && v.is_frame == isFrame && v.is_icon_frame == isIconFrame && v.is_equal == isEqual) {
					templates.push(v.template_code);
					templatesDir.push(v.template_direction);
					templatesId.push(v.template_id);
				} else {
					console.log("isme aaya11111111111111");
				}
			}
		});
		return [templates, templatesDir, templatesId];
	}
	// listing of layout variations 
	function getLayoutVariations(p_fCallBack) {
		// lEditor.logoTempArr = [];
		var currLogo = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		var splitLogoName = currLogo.generate.splitLogoName;
		var logoTemp = dh_editor_utility.getValidJsonParseObj(lEditor.getSession('currentLogo'));
		// var currContainerBodyObj = logoTemp.generate.templatePath.updates.containerBody;
		var i = 0;
		var frames = [];
		if (loadMoreStart == 0) {
			lEditor.logoSlider('final', 1);
			lEditor.logoTempArr = [];
		}
		// $('.load--more--class').remove();
		$('.editFinalLogo').addClass('hidden');
		$('.editLogoSlider').removeClass('hidden');
		var templatesDataJsonArray = [];

		var isDBLineTextTemplate = false;
		// var logoText = lEditor.getSession('logoname');
		var logoTextList = lEditor.getLogoTextList(splitLogoName);
		if (logoTextList.length > 0 && logoTextList.length == 2 && (currLogo.generate.templatePath.isDBLineCompanyText == "yes")) {
			isDBLineTextTemplate = true
		}

		var layoutVariationMonogramText = "";
		var fetchTemplatesDataJson = [];
		if (isDBLineTextTemplate) {
			fetchTemplatesDataJson = doubleLineTemplatesDataJson;
		} else {
			fetchTemplatesDataJson = templatesDataJson;
		}
		if (currLogo.generate.templatePath.isIcon == 1) {
			$.each(fetchTemplatesDataJson, function (k, v) {
				if (currLogo.generate.templatePath.isIconFrame == 1) {
					if ((v.template_code.isIcon == 1) && (v.template_code.template_id != currLogo.generate.templatePath.template_id)) {
						templatesDataJsonArray.push(v);
					}
					else if ((v.template_code.isMono == 0) && (v.template_code.isIcon == 0)) {
						templatesDataJsonArray.push(v);
					}
				} else {
					if ((v.template_code.isIcon == 1) && (v.template_code.isIconFrame == 0) && (v.template_code.template_id != currLogo.generate.templatePath.template_id)) {
						templatesDataJsonArray.push(v);
					}
					else if ((v.template_code.isMono == 0) && (v.template_code.isIcon == 0)) {
						templatesDataJsonArray.push(v);
					}
				}
			});
		} else if (currLogo.generate.templatePath.isMono == 1) {
			$.each(fetchTemplatesDataJson, function (k, v) {
				if (currLogo.generate.templatePath.isIconFrame == 1) {
					if ((v.template_code.isMono == 1) && (v.template_code.template_id != currLogo.generate.templatePath.template_id)) {
						templatesDataJsonArray.push(v);
					}
					else if ((v.template_code.isMono == 0) && (v.template_code.isIcon == 0)) {
						templatesDataJsonArray.push(v);
					}
				} else {
					if ((v.template_code.isMono == 1) && (v.template_code.isIconFrame == 0) && (v.template_code.template_id != currLogo.generate.templatePath.template_id)) {
						templatesDataJsonArray.push(v);
					}
					else if ((v.template_code.isMono == 0) && (v.template_code.isIcon == 0)) {
						templatesDataJsonArray.push(v);
					}
				}
			});
		}
		else {
			layoutVariationMonogramText = lEditor.getMonogramText(true);
			$.each(fetchTemplatesDataJson, function (k, v) {
				if (v.template_code.isIcon == 1 && v.template_code.isIconFrame == 0) {
					templatesDataJsonArray.push(v);
				}
				if (v.template_code.isMono == 1 && v.template_code.isIconFrame == 0 && (currCompFontObject || currMonogramFontObject)) {
					templatesDataJsonArray.push(v);
				}
				if ((v.template_code.isMono == 0) && (v.template_code.isIcon == 0) && (v.template_code.template_id != currLogo.generate.templatePath.template_id)) {
					templatesDataJsonArray.push(v);
				}
			});
		}

		if (templatesDataJsonArray.length > 2) {
			if ((templatesDataJsonArray.length % 2) == 1) {
				templatesDataJsonArray.pop();
				// add this condition because make 2 sets of logo
			}
		}

		var templateLength = templatesDataJsonArray.length;

		if (templateLength == 0) {
			alert("templateLength is 0");
		}
		templatesDataJsonArray = dh_editor_utility.shuffleTheArray(templatesDataJsonArray);
		var templateIdStyle = getTempStyle();
		var templateHint = "";
		if (logoTemp.generate.templatePath.isFrame == 0) {

			jqXHR = $.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: { action: 'randomData', start: randomPagination },
				async: true,
				success: function (json) {
					var json = dh_editor_utility.getValidJsonParseObj(json);
					$.each(json.data.frames, function (k, v) {
						frames.push(v);
					});

					for (var i = loadMoreStart; i < templateLength;) {
						logoTemp.generate = { ...currLogo.generate };
						logoTemp.generate.templatePath = templatesDataJsonArray[i].template_code;
						if ((currLogo.generate.isArc == 1) && (logoTemp.generate.templatePath.isSupportCurveText != 1)) {
							let logo1 = currCompFontObject.getPath(currLogo.logoName, 0, 0, currLogo.generate.logoTextSlider, { 'letterSpacing': parseFloat(currLogo.generate.logoLetterSpacing) });
							logoTemp.generate.logoPath = logo1.toSVG();
							delete logoTemp.generate.isArc;
							delete logoTemp.generate.arcValue;
							delete logoTemp.generate.curveTextActualPathHeight;
							delete logoTemp.generate.curveTextCenterWidth;
						}
						if (logoTextList.length == 2 && logoTemp.generate.templatePath.text1 && logoTemp.generate.templatePath.text2 && logoTemp.generate.templatePath.updates.text1 && logoTemp.generate.templatePath.updates.text2) {
							logoTemp.generate.templatePath.isDBLineCompanyText = "yes";
						} else {
							logoTemp.generate.templatePath.isDBLineCompanyText = "no";
						}

						if (logoTemp.generate.templatePath.isIcon == 1 && currLogo.generate.templatePath.isIcon == 0) {
							logoTemp.generate.iconPath = '<path d="M85.141,16.424H14.858L1.46,29.821v3.686L50,83.576l2.43-2.429l0.07,0.041l0.149-0.262L97.774,34.29  l0.765-0.771v-3.698L85.141,16.424z M87.568,26.224l3.598,3.598h-7.195L87.568,26.224z M82.981,21.637l0.899,0.9l-6.412,6.414  l-7.313-7.313H82.981z M70.968,29.821H56.375l7.296-7.296L70.968,29.821z M57.187,21.637l-7.201,7.202l-7.201-7.202H57.187z   M43.596,29.821H28.969l7.314-7.313L43.596,29.821z M17.018,21.637h12.763l-7.01,7.01l-6.381-6.382L17.018,21.637z M12.703,25.95  l3.87,3.871h-7.74L12.703,25.95z M8.832,35.035h12.397l16.732,29.129L8.832,35.035z M47.392,70.116l-20.15-35.082h20.15V70.116z   M52.606,70.536V35.035h20.392L52.606,70.536z M62.594,63.615l16.415-28.581h12.174L62.594,63.615z"></path>';
						}

						var randomFrame = logoMakerFunction.getRandomCombination([frames.length]);
						if (logoTemp.generate.templatePath.isFrame == 1) {
							logoTemp.generate.framePath = frames[randomFrame[0]].svg;
							logoTemp.generate.templatePath.frameType = frames[randomFrame[0]].type;
							logoTemp.generate.templatePath.frameOverlap = frames[randomFrame[0]].isOverlap;
							logoTemp.frmId = frames[randomFrame[0]].id;
							logoTemp.generate.templatePath.frame_width = frames[randomFrame[0]].frame_width;
							logoTemp.generate.templatePath.frame_height = frames[randomFrame[0]].frame_height;
							logoTemp.generate.templatePath.frameShapeName = frames[randomFrame[0]].shape;
							logoTemp.generate.templatePath.frmId = frames[randomFrame[0]].id;
						} else {
							logoTemp.generate.framePath = "";
							logoTemp.generate.templatePath.frameType = "";
							logoTemp.generate.templatePath.frameOverlap = "";
							logoTemp.frmId = "";
							logoTemp.generate.templatePath.frame_width = "";
							logoTemp.generate.templatePath.frame_height = "";
							logoTemp.generate.templatePath.frameShapeName = "";
							logoTemp.generate.templatePath.frmId = "";
						}

						if (logoTemp.generate.templatePath.isMono == 1 && (layoutVariationMonogramText != "")) {
							var monogramSVG = null
							if (currMonogramFontObject) {
								monogramSVG = currMonogramFontObject.getPath(layoutVariationMonogramText, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);
							} else {
								monogramSVG = currCompFontObject.getPath(layoutVariationMonogramText, 0, 0, constantVars.ORIGINAL_SPACING.monogramTextSize);
							}
							logoTemp.generate.iconPath = "";
							logoTemp.generate.iconPath = monogramSVG.toSVG();
						}
						var idKey = logoMakerFunction.genRandomId();
						logoTemp.generate.idKey = idKey;
						logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
						logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;

						var returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "layoutVariations");
						let originalReturnObj = Object.assign({}, returnObj);
						logoTemp.generate = returnObj.logoObj;
						lEditor.logoTempArr[i] = updateCurrLogoObject(dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(logoTemp)));
						templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);
						slickElement = '<div class="logos--boxes color-logo-boxes" data-index="' + (i) + '"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="color"  data-id="' + (i) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color : ' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
						$(".finalogoSlider").append(slickElement);

						if (originalReturnObj.logoObj.isArc == 1 && originalReturnObj.logoObj.templatePath.isSupportCurveText == 1) {
							$('.finalogoSlider .logos--boxes[data-index="' + i + '"] .svgSloganText_1').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.slogan.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.slogan.x + "," + (originalReturnObj.logoObj.templatePath.updates.slogan.y) + ")");
							if ((originalReturnObj.logoObj.templatePath.isIcon == 1) || (originalReturnObj.logoObj.templatePath.isMono == 1)) {
								$('.finalogoSlider .logos--boxes[data-index="' + i + '"] .sampleIconBox').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.x + "," + (originalReturnObj.logoObj.templatePath.updates.iconFrameBox.y) + ")");
							}
						}

						loadMoreStart = i;
						i++;
						if (i % 10 == 0) {
							if ($('.load--more--class').length) {
								$('.load--more--class').remove();
							}
							$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreVariations load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
							if (p_fCallBack) {
								p_fCallBack();
							}
							if (loadMoreStart == templateLength - 1) {
								if ($('.load--more--class').length) {
									$('.load--more--class').remove();
								}
							}
							break;
						} else {
							if ($('.load--more--class').length) {
								$('.load--more--class').remove();
							}
							if (p_fCallBack) {
								p_fCallBack();
							}
						}
						//	}	
					}
				}
			});
		} else {
			//	frames.push({"id":0,"svg":logoTemp.generate.framePath});
			for (var i = loadMoreStart; i < templateLength;) {
				//	if(v.template_code.isIcon == 0){
				logoTemp.generate = { ...currLogo.generate };
				logoTemp.generate.templatePath = templatesDataJsonArray[i].template_code;
				if ((currLogo.generate.isArc == 1) && (logoTemp.generate.templatePath.isSupportCurveText != 1)) {
					let logo1 = currCompFontObject.getPath(currLogo.logoName, 0, 0, currLogo.generate.logoTextSlider, { 'letterSpacing': parseFloat(currLogo.generate.logoLetterSpacing) });
					logoTemp.generate.logoPath = logo1.toSVG();
					delete logoTemp.generate.isArc;
					delete logoTemp.generate.arcValue;
					delete logoTemp.generate.curveTextActualPathHeight;
					delete logoTemp.generate.curveTextCenterWidth;
				}
				if (logoTemp.generate.templatePath.isIcon == 1 && currLogo.generate.templatePath.isIcon == 0) {
					logoTemp.generate.iconPath = '<path d="M85.141,16.424H14.858L1.46,29.821v3.686L50,83.576l2.43-2.429l0.07,0.041l0.149-0.262L97.774,34.29  l0.765-0.771v-3.698L85.141,16.424z M87.568,26.224l3.598,3.598h-7.195L87.568,26.224z M82.981,21.637l0.899,0.9l-6.412,6.414  l-7.313-7.313H82.981z M70.968,29.821H56.375l7.296-7.296L70.968,29.821z M57.187,21.637l-7.201,7.202l-7.201-7.202H57.187z   M43.596,29.821H28.969l7.314-7.313L43.596,29.821z M17.018,21.637h12.763l-7.01,7.01l-6.381-6.382L17.018,21.637z M12.703,25.95  l3.87,3.871h-7.74L12.703,25.95z M8.832,35.035h12.397l16.732,29.129L8.832,35.035z M47.392,70.116l-20.15-35.082h20.15V70.116z   M52.606,70.536V35.035h20.392L52.606,70.536z M62.594,63.615l16.415-28.581h12.174L62.594,63.615z"></path>';
				}
				if (logoTemp.generate.templatePath.isFrame == 1) {
					logoTemp.generate.framePath = currLogo.generate.framePath;
					logoTemp.generate.templatePath.frameType = currLogo.generate.templatePath.frameType;
					logoTemp.frmId = currLogo.frmId;
					logoTemp.generate.templatePath.frameOverlap = currLogo.generate.templatePath.frameOverlap;
					logoTemp.generate.templatePath.frame_width = currLogo.generate.templatePath.frame_width;
					logoTemp.generate.templatePath.frame_height = currLogo.generate.templatePath.frame_height;
					logoTemp.generate.templatePath.frameShapeName = currLogo.generate.templatePath.frameShapeName;
					logoTemp.generate.templatePath.frmId = currLogo.generate.templatePath.frmId;
				} else {
					logoTemp.generate.framePath = "";
					logoTemp.generate.templatePath.frameType = "";
					logoTemp.generate.templatePath.frameOverlap = "";
					logoTemp.frmId = "";
					logoTemp.generate.templatePath.frame_width = "";
					logoTemp.generate.templatePath.frame_height = "";
					logoTemp.generate.templatePath.frameShapeName = "";
					logoTemp.generate.templatePath.frmId = "";
					if (currLogo.generate.templatePath.isFrame == 1 && currLogo.generate.templatePath.frameType === "filled") {
						if (currLogo.generate.frameFilledGradient) {
							if (gradientsArray[currLogo.generate.frameFilledGradient]) {
								logoTemp.generate.bgColor = gradientsArray[currLogo.generate.frameFilledGradient]["stops"][0]["color"];
							} else {
							}
						} else {
							logoTemp.generate.bgColor = currLogo.generate.frameFilledColor;
						}
					}
				}
				logoTemp.generate.templatePath.sloganSetAsPerText = currLogo.generate.templatePath.sloganSetAsPerText;
				if (currLogo.generate.templatePath.isDBLineCompanyText) {
					logoTemp.generate.templatePath.isDBLineCompanyText = currLogo.generate.templatePath.isDBLineCompanyText;
				}

				var idKey = logoMakerFunction.genRandomId();
				logoTemp.generate.idKey = idKey;
				var returnObj = logoMakerFunction.generateLogoTemplate(logoTemp.generate, idKey, null, null, null, true, "layoutVariations");
				let originalReturnObj = Object.assign({}, returnObj);
				logoTemp.generate = returnObj.logoObj;
				lEditor.logoTempArr[i] = updateCurrLogoObject(dh_editor_utility.getValidJsonParseObj(dh_editor_utility.getValidJsonStringifyObj(logoTemp)));

				templateHint = dh_lm_common_utility.showLogoAdminIds(logoTemp.generate.templatePath, logoTemp.sloganName, logoTemp.fId, logoTemp.cpId, logoTemp.sfId, logoTemp.frmId, logoTemp.iconFrameId, logoTemp.monofId);

				slickElement = '<div class="logos--boxes color-logo-boxes" data-index="' + (i) + '"><div class="item logo--slides logoSlides"><div style="' + templateIdStyle + '">' + templateHint + '</div><div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update setDefaultLogo" data-type="color"  data-id="' + (i) + '"><span>Update to this</span></a></div><div class="svg--slide" style="background-color : ' + logoTemp.generate.bgColor + ';"><div class="svg-slide--content TopLogoTemplate"><div class="water-mark-img"></div>' + returnObj.html + '</div></div></div></div>';
				$(".finalogoSlider").append(slickElement);

				if (originalReturnObj.logoObj.isArc == 1 && originalReturnObj.logoObj.templatePath.isSupportCurveText == 1) {
					$('.finalogoSlider .logos--boxes[data-index="' + i + '"] .svgSloganText_1').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.slogan.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.slogan.x + "," + (originalReturnObj.logoObj.templatePath.updates.slogan.y) + ")");
					if ((originalReturnObj.logoObj.templatePath.isIcon == 1) || (originalReturnObj.logoObj.templatePath.isMono == 1)) {
						$('.finalogoSlider .logos--boxes[data-index="' + i + '"] .sampleIconBox').attr('transform', "scale(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.scale + ") translate(" + originalReturnObj.logoObj.templatePath.updates.iconFrameBox.x + "," + (originalReturnObj.logoObj.templatePath.updates.iconFrameBox.y) + ")");
					}
				}

				loadMoreStart = i;
				i++;
				if (i % 10 == 0) {
					if ($('.load--more--class').length) {
						$('.load--more--class').remove();
					}
					$(".finalogoSlider").append('<div class="load--more--class"><a class="loadMoreVariations load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
					if (p_fCallBack) {
						p_fCallBack();
					}
					if (loadMoreStart == templateLength - 1) {
						if ($('.load--more--class').length) {
							$('.load--more--class').remove();
						}
					}
					break;
				} else {
					if ($('.load--more--class').length) {
						$('.load--more--class').remove();
					}
					if (p_fCallBack) {
						p_fCallBack();
					}
				}
			}
			//	});
		}
	}
	// for step -5 ( bricks ) 
	function getIconTagListingNew(p_sSlugName) {
		var industryName = lEditor.getSession('extraIndustry');
		if (!industryName) {
			industryName = 'company';
		}

		if (industryName == "") {
			industryName = 'company';
		}
		if (industryName.toLowerCase() == 'wedding service' || industryName.toLowerCase() == 'wedding-service') {
			industryName = 'wedding';
		}
		if (industryName !== "undefined") {
			industryName = getSlugNew(industryName);

			var htm = '<div class="loadMoreIcons text-center"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></div>';
			$('.start-ico-list').html(htm);
			jqXHR = $.ajax({
				url: DH.baseURL + '/dh_ajax.php',
				type: 'POST',
				data: { action: 'api', action_type: 'tags_only', 'tags_only': 1, slug: (p_sSlugName ? p_sSlugName : industryName), currntStep: lEditor.currentStep },
				success: function (json) {
					json = dh_editor_utility.getValidJsonParseObj(json);
					var i = 0;
					if (Object.keys(json.tags).length) {

						$.each(json.tags, function (k, v) {
							i++;
							if (v.name != "") {
								htm += '<div class="bricks"><div class="start-ico-tab startIcoTab" title="' + v.name + '" data-tag="' + v.name.toLowerCase() + '">' + v.name + '</div></div>';
							}
							if (i == 40) {
								return false;
							}
						});
					} else {
						getIconTagListingNew('company');
					}
					if (htm != "") {
						$('.start-ico-list').html(htm);
					}
					$('.start-ico-list .loadMoreIcons').remove();
					$('.start-ico-list').removeClass('hidden');
					if (sessionStorage.getItem("currPage") == 5) {
						let extraIndustry = sessionStorage.getItem("extraIndustry");
						let tags_val = $("#tags").val();
						if(typeof extraIndustry != "undefined" && extraIndustry!==null && extraIndustry!="" && $.trim(tags_val) == "") {
							$('.start-ico-list .startIcoTab[data-tag="'+extraIndustry.toLowerCase()+'"]').trigger('click');
						}
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$('#loadere').hide();
				}
			});
		}
	};
	async function getIconsAsperIndustrySelected(p_sType) {
		var sampleArr = dh_editor_utility.getValidJsonParseObj(sessionStorage.getItem('sampleIcon'));
		if (sampleArr && sampleArr.si && sampleArr.si.length > 0) {
			return;
		}
		sampleArr = JSON.parse(sessionStorage.getItem('defaultIcon'));
		if (sampleArr && sampleArr.si && sampleArr.si.length > 0) {
			return;
		}
		var currSearchName = currentSelectedIndustry || lEditor.getSession("industryText");
		if (currSearchName || (p_sType === "default_icon")) {
			let sampleList = [];
			let hitFor = "industry_icon"
			if (p_sType === "default_icon") {
				currSearchName = "";
				hitFor = "default_icon"
			}

			try {
				let iconResponse = await lEditor.searchAjaxIconsResponse(currSearchName, NOUN_API_LIMIT, p_sType, hitFor);
				iconResponse = dh_editor_utility.shuffleTheArray(iconResponse);
				if (iconResponse && iconResponse.length) {
					currentSelectedIndustryIconList = [];
					iconResponse.forEach(function (icon, ind) {
						let iconData = getIconData(icon);
						if (ind < 5) {
							sampleList.push(iconData);
							// store only 5 icon
						}
						if (ind < 10) {
							currentSelectedIndustryIconList.push(iconData);
						}
					});
					if (sampleList && sampleList.length > 0) {
						lEditor.cleanSession("defaultIcon");
						lEditor.setSession('defaultIcon', dh_editor_utility.getValidJsonStringifyObj({ "si": sampleList }));
					}
				} else {
					if (p_sType === "nonEditor") {
						getIconsAsperIndustrySelected("default_icon");
						// default symbol case
					}
				}
			} catch (er) {

			}
		} else {
			if (p_sType === "nonEditor") {
				getIconsAsperIndustrySelected("default_icon");
				// default symbol case
			}
		}
	};
	// for getting icon tag listing  
	// for step -5 ( bricks )        
	function getIconTagListing(industryId) {
		if (typeof industryId === 'undefined') {
			var industryId = lEditor.getSession('industryId');
		} else {
			industryId = 0;
		}

		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'tags', industry_id: industryId },
			async: true,
			success: function (json) {
				json = dh_editor_utility.getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {
					var htm = '';
					var i = 0;
					$.each(json.data.tags, function (k, v) {
						i++;
						htm += '<div class="bricks"><div class="start-ico-tab startIcoTab" data-tag="' + v.icontag_tag + '">' + v.icontag_tag + '</div></div>';
						if (i == 40) {
							return false;
						}
					});
					$('.start-ico-list').removeClass('hidden');
					$('.start-ico-list').html(htm);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});
	};
	//Added for version 2 functionality
	function getRecomIconListing() {
		var industryName = lEditor.getSession('extraIndustry');
		if (industryName == "") {
			industryName = 'company';
		}
		if (industryName.toLowerCase() == 'wedding service' || industryName.toLowerCase() == 'wedding-service') {
			industryName = 'wedding';
		}
		industryName = getSlugNew(industryName);
		$('.start-ico-list').html('');
		var slug = industryName;
		var searchBtn = $('.step-holder.step_5 .logo-search-form').find('.searchIcon');
		// lEditor.setSession('iconValue', slug);
		$('.icons-search-bar .error-text').hide();
		$('#tags').addClass('active');
		$('.icons-search-bar .error-text').hide();
		//$('#tags').focus().click().val(slug);
		$('#tags').focus().val(slug);
		lEditor.objIconSearch = "";
		//debugger;
		searchBtn.trigger('click');
	};
	function getSlugNew(str) {
		if (str != '') {
			var regex = /(&amp;|&)(.*)?/gi; //match & in between or end                                
			str = str.replace(regex, "");
		}
		return str.trim();

	}
	/*== favorite - start ==*/
	// code by Tushar
	function getFavoriteLogoListing() {
		var htm = "";
		var currLogoId = lEditor.getCurrentLogoId();

		favoritePagination++;
		if (favoritePagination == 1) {
			$('.favoriteLogo').append('<div class="loadMoreIcons common--loader text-center"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></div>');
		}
		jqXHR = $.ajax({
			url: DH.baseURL + '/logoMakerAjax.php',
			type: 'POST',
			data: { action: 'fav_listing', start: favoritePagination },
			async: true,
			success: function (json) {
				$('.loadMoreIcons').remove();
				json = dh_editor_utility.getValidJsonParseObj(json);
				if (json.status == 0) {

				} else {

					var i = 0;
					var msgBox = $('.favoriteLogoTab .no-favourite');
					$('.loadMoreFavoriteLogos').parents('.load--more--class').remove();
					if (json.data.logos.length == 0) {
						msgBox.show();
						return false;
					}
					msgBox.hide();
					$.each(json.data.logos, function (k, v) {
						var closeHtml = '';
						var defaultHtml = '';
						var activeFav = '';
						var favToolTip = 'Add to favorites';
						if (parseInt(v.logo_is_favorite) == 1) {
							activeFav = 'active';
							favToolTip = 'Remove from favorites';
						}
						if (currLogoId != v.logo_id) {
							closeHtml = '<img src="' + DH.getAssetImgUrl('logo-maker/close.svg') + '" class="removeLogo" data-id="' + v.logo_id + '">';
							defaultHtml = '<div class="logoSlide-overlay gradient-div"><a href="javascript:;" class="icons-edit icons-update openLogoDetail" data-id="' + v.logo_id + '"><span>Update to this</span></a></div>';
							dh_utility_common.changeBg();
						}
						$('.favoriteLogo').append('<div class="favoriteLogoLists saved-logo-lists" style="background-color:' + v.bg_color + '"><div class="water-mark-img"></div><div class="logo-favourite favLogoIcon ' + activeFav + '" data-placement="bottom" data-toggle="tooltip" title="" data-id="' + v.logo_id + '" data-original-title="' + favToolTip + '"><i class="icon icon-heart"></i></div>' + closeHtml + ' ' + v.logo_svg + ' ' + defaultHtml + '</div>');
						i++;
						if (json.pagination == 1 && i == json.data.logos.length) {
							$('.favoriteLogo').append('<div class="load--more--class"><a class="loadMoreFavoriteLogos load--more--button" href="javascript:;"><span class="load--more-shadow"><span class="final--loader loadMoreLogosBoxes" style="display:none;"><img src="' + DH.getAssetImgUrl('logo-maker/loading.svg') + '" /></span>Load More</span></a></div>');
						}
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				//alert(errorThrown);
			}
		});

	};
	// code by Tushar        
	$('.step_6, .step_7').on('click', '.iconFav', function (e) {
		if (DH.isLogged == 0 && DH.userId == 0) {
			clearTimeout(loginPopupTimer);
			userLoginPopup();
			$('body').addClass('logo-modal-unset');
			return;
		}
		var ele = $(this);
		var fav = 1;
		var successMsg = '';
		var errMsg = '';
		var del = 0;
		var curLogoId = $(this).attr('data-logo-id');
		var listType = ele.attr('data-listType');
		// listType  = "colorPallete";
		var subType = '';
		if (ele.hasClass('active')) {
			ele.removeClass('active');
			ele.attr('data-original-title', 'Add to favorites');
			fav = 0;
			del = 1;
			successMsg = 'Logo removed from your favorite list.';
			errMsg = 'Cannot remove selected logo from your favorite list.';
			if (typeof listType !== "undefined") {
				switch (listType) {
					case 'colorPallete': {
						subType = $('.colorPaletteButton.active').attr('data-id');
						if (typeof subType === 'undefined') {
							subType = $('.colorPaletteVariants a.active').attr('data-id');
						}
						logoMakerFunction.removeToFavoriteJson('colorPallete', subType, parseInt(ele.data('id')));
						break;
					}
				}
			}
		} else {
			ele.addClass('active');
			ele.attr('data-original-title', 'Remove from favorites');
			fav = 1;
			del = 0;
			successMsg = 'Logo added in your favorite list.';
			errMsg = 'Cannot add selected logo in your favorite list.';
			if (typeof listType !== "undefined") {
				switch (listType) {
					case 'colorPallete': {
						subType = 0;//$('.colorPaletteButton.active').attr('data-id');
						if (typeof subType === 'undefined') {
							subType = $('.colorPaletteVariants').find('a.active').attr('data-id');
						}
						logoMakerFunction.addToFavoriteJson('colorPallete', subType, parseInt(ele.data('id')), curLogoId);
						break;
					}
				}
			}
		}

		let favicondataid = +($(this).data('id'));
		if ((version === "vd1" || version === "vd2" || version === "vd3" || version === "vd4") && (!listType)) {
			let swiperIndex = +($(this).data('swiper-index'));
			lEditor.currentLogo = lEditor.swiperLogoTempArr[favicondataid][swiperIndex];
		} else {
			lEditor.currentLogo = lEditor.logoTempArr[favicondataid];
		}
		var dataAnalysisObj = dh_editor_utility.getDataAnalsyis(lEditor.currentLogo, false);
		var logoJSONObj = lEditor.validateJSON(lEditor.currentLogo, dataAnalysisObj);
		const curr_logo_blob = new Blob([JSON.stringify(logoJSONObj)], {
			type: "application/json;charset=utf-8"
		});
		const svg_logo_blob = new Blob([logoMakerFunction.getFinalLogoTemplate(lEditor.currentLogo.generate, true)], { type: 'image/svg+xml' });
		dh_lm_save.saveAction(curLogoId, curr_logo_blob, svg_logo_blob, fav, del, true, false, JSON.stringify(dataAnalysisObj), JSON.stringify(dh_editor_utility.createLogging("at step_6 or step_7 iconFav click"))).then((p_oJSON) => {
			let json = dh_editor_utility.getValidJsonParseObj(p_oJSON);
			if (json.status == 0) {
				if (fav == 1) {
					ele.removeClass('active');
				} else {
					ele.addClass('active');
				}
				dh_utility_common.alert({ type: 'error', message: errMsg });
			} else {
				var retLogoId = json.data.logo_id;
				ele.attr('data-logo-id', retLogoId);
				$(".favOption .count").html(json.data.fav_count);
				//only for step 6
				if ($("body").find(".step_6").length === 1 && !$("body").find(".step_6").hasClass("hidden")) {
					if (parseInt(json.data.fav_count) > 0) {
						$(".favOption").removeClass("disabled");
					} else {
						$(".favOption").addClass("disabled");
					}
					if ($(".favOption").hasClass("hidden")) {
						$(".favOption").removeClass("hidden");
					}
				}
				ele.parents('.logo--slides').find('.iconEdit').attr('data-logo-id', retLogoId);
				if (ele.hasClass('active')) {
					if (typeof listType !== "undefined") {
						logoMakerFunction.updateLogoIdJson(listType, subType, parseInt(ele.data('id')), retLogoId);
					}
				}
				dh_utility_common.alert({ type: 'success', message: successMsg });
				$('.savedLogoCount').html('(' + json.data.saved_count + ')');
				$('.favLogoCount').html('(' + json.data.fav_count + ')');
			}
			dh_editor_utility.clearException();
		});
	});
	// code by Tushar        
	$('.step_7').on('click', '.favLogoIcon', function (e) {
		var logoId = $(this).data('id');
		var ele = $(this);
		var favAction = 'add';
		var errMsg = 'Cannot add logo to favorite.';
		var msgBox = $('.favoriteLogoTab .no-favourite');

		if ($(this).hasClass('active')) {
			favAction = 'remove';
			errMsg = 'Cannot remove logo to favorite.';
			ele.removeClass('active');
			ele.attr('data-original-title', 'Add to favorites');
			ele.parents('.favoriteLogoLists').remove();

		} else {
			ele.addClass('active');
			ele.attr('data-original-title', 'Remove from favorites');
		}
		msgBox[$('.favoriteLogoLists.saved-logo-lists').length == 0 ? 'show' : 'hide']();
		$.ajax({
			type: "POST",
			url: DH.baseURL + '/logoMakerAjax.php',
			data: { action: 'add_remove_fav', logo_id: logoId, fav_action: favAction }
		}).done(function (retData) {
			$('#loadere').hide();
			if (retData.status == 'valid') {
				$('.savedLogoCount').html('(' + retData.saved_count + ')');
				$('.favLogoCount').html('(' + retData.favorite_count + ')');
				logoMakerFunction.removeLogoIdJson(logoId);
			} else {
				if (ele.hasClass('active')) {
					ele.removeClass('active');
				} else {
					ele.addClass('active');
				}
				dh_utility_common.alert({ type: 'error', msg: retData.msg });
			}
		}).fail(function () {

		}).always(function () {
			$('#loadere').hide();
		});
	});

	// Load the page and initialize the steps accordingly
	function initPageLoad() {
		lEditor.cleanSession('defaultlink');
		//debugger;
		var crLgId = parseInt(sessionStorage.getItem('currLogoId'));
		var crPg = parseInt(sessionStorage.getItem('currPage'));
		if (crLgId && crLgId > 0 && crPg == 7) {
			$.ajax({
				url: DH.baseURL + '/logoMakerAjax.php',
				type: 'POST',
				data: { action: 'get_logo_data', logo_id: crLgId },
				success: function (response) {
					if (response && response.data) {
						var data = dh_editor_utility.getValidJsonParseObj(response.data.logo_json);
						// //Setting loaded logo as current logo into session
						lEditor.setSession('currentLogo', response.data.logo_json);
						lEditor.setSession('logoname', data.logoName);
						lEditor.setSession('sloganText', data.sloganName);
						lEditor.cleanSession('lastTargetlink');
						lEditor.cleanSession('lastParentlink');
						$('.editSloganName').val(data.sloganName);
						eanbledSloganTool();
						setupSliders(data);
						if (lEditor.getSession("edit_from") && lEditor.getSession("edit_from") == "favorite" || lEditor.getSession("edit_from") == "saved" || lEditor.getSession("edit_from") == "purchased") {
							lEditor.setSession('parentlink', 2);
							lEditor.setSession('targetlink', 7);
							lEditor.setSession('defaultlink', 0);
							lEditor.cleanSession("edit_from");
							lEditor.showStep();
							lEditor.setSession('', (data.search_industry_id || ""));
						}
						editorUndoRedo.createInstance();
					}
				}
			});
		}
		else {
			console.log("initPageLoad2")
			// lEditor.showStep();
		}
	}
	function eanbledSloganTool() {
		var sloganText = lEditor.getSession('sloganText');
		if (sloganText == '') {
			$('.sloganOption .companyFontCase, .sloganOption .rangeSlider').addClass('disabled');
			$('.subMenu-10, .subMenu-14').parents('li').addClass('disabled');
			$('.subMenu-9').text('Add Slogan');
			$('.removeSlogan').addClass('hidden');
			$('.textSloganDistSlider').addClass('disabled');

		} else {
			$('.sloganOption .companyFontCase, .sloganOption .rangeSlider').removeClass('disabled');
			$('.subMenu-10, .subMenu-14').parents('li').removeClass('disabled');
			$('.subMenu-9').text('Edit Slogan');
			$('.removeSlogan').removeClass('hidden');
			$('.textSloganDistSlider').removeClass('disabled');
		}
	}

	// Page load starts 
	initPageLoad();


	/*== favorite - end ==*/

	/* fix header strip */
	function headerFixed() {
		if ($(window).width() > 991) {
			var offerHeight = 0;
			if ($('.avail_offer').length > 0) {
				offerHeight = $('.avail_offer').height();
			}
			$('.lEditorHeader').css('top', offerHeight + 'px');
			$('.step-holder').css('padding-top', offerHeight + 60 + 'px');
			$('.step_6 .fix-padding').css('margin-top', '66px');
			$('#animation_box').css('padding-top', offerHeight + 20 + 'px');
		} else {
			$('.lEditorHeader').css('top', '0px');
			$('.step-holder').css('padding-top', '60px');
			$('.step_6 .fix-padding').css('margin-top', '66px');
		}
	}
	headerFixed();
	$(window).resize(function () {
		headerFixed();
	});
	/**
	 * 
	 */
	let editorUndoRedo = {
		undoRedoObj: null,

		ltsOldLogoObj: null, //logoTextSlider
		ltsNewLogoObj: null,//logoTextSlider

		llsOldLogoObj: null,//logoLetterSpacing
		llsNewLogoObj: null,//logoLetterSpacing

		stsOldLogoObj: null,//sloganTextSize
		stsNewLogoObj: null,//sloganTextSize

		slsOldLogoObj: null,//sloganLetterSpacing
		slsNewLogoObj: null,//sloganLetterSpacing

		tsdOldLogoObj: null,//textSloganDistSlider
		tsdNewLogoObj: null,//textSloganDistSlider

		lssOldLogoObj: null,//logoSizeSlider
		lssNewLogoObj: null,//logoSizeSlider

		idsOldLogoObj: null,//iconDistanceSlider
		idsNewLogoObj: null,//iconDistanceSlider

		fssOldLogoObj: null,//frameSizeSlider
		fssNewLogoObj: null,//frameSizeSlider

		ltcOldLogoObj: null,//textCurveslider
		ltcNewLogoObj: null,//textCurveslider
		/**
		  * 
		  */
		createInstance: function () {
			editorUndoRedo.createEventOnURBtns();
			editorUndoRedo.undoRedoObj = new LM_UNDO_REDO();
			editorUndoRedo.undoRedoObj.init($(".undoIcon"), $(".redoIcon"));
		},
		/**
		 * 
		 */
		createEventOnURBtns: function () {
			$(".undoIcon").bind("click", function (e) {
				e.stopImmediatePropagation();
				editorUndoRedo.doUndoAct();
				if (!$(".redoIcon").hasClass("undo_redo_btn_blink")) {
					$(".redoIcon").addClass("undo_redo_btn_blink");
				}

			});
			$(".redoIcon").bind("click", function (e) {
				e.stopImmediatePropagation();
				editorUndoRedo.doRedoAct();
			});
			$(window).keyup(function (e) {
				if (e.ctrlKey) {
					switch (e.keyCode) {
						case 90:
							editorUndoRedo.doUndoAct();
							break;
						case 89:
							editorUndoRedo.doRedoAct();
							break;
					}
				}
			});
		},
		/**
		 * 
		 * @param {*} p_sActId 
		 * @param {*} p_sUndoActValue 
		 * @param {*} p_sRedoActValue 
		 */
		setUndoActData: function (p_sActId, p_sUndoActValue, p_sRedoActValue) {
			if (!$(".undoIcon").hasClass("undo_redo_btn_blink")) {
				$(".undoIcon").addClass("undo_redo_btn_blink");
			}
			if (editorUndoRedo.undoRedoObj) {
				var undoParentLink;
				var undoTargetLink;
				var redoParentLink;
				var redoTargetLink;
				switch (p_sActId) {
					case LOGO_TEXT_CHANGE:
					case LOGO_TEXT_TRANSFORM:
					case LOGO_TEXT_FS:
					case LOGO_TEXT_LS:
					case LOGO_TEXT_CURVE:
						undoParentLink = 2;
						undoTargetLink = 7;
						redoParentLink = 2;
						redoTargetLink = 7;
						break;

					case LOGO_TEXT1_CHANGE:
					case LOGO_TEXT2_CHANGE:
					case LOGO_TEXT1_FS:
					case LOGO_TEXT2_FS:
					case LOGO_TEXT1_LS:
					case LOGO_TEXT2_LS:
					case LOGO_TEXT1_TRANSFORM:
					case LOGO_TEXT2_TRANSFORM:
						undoParentLink = 2;
						undoTargetLink = 7;
						redoParentLink = 2;
						redoTargetLink = 7;
						break;

					case SLOGAN_TEXT_CHANGE:
					case SLOGAN_REMOVE:
					case SLOGAN_TEXT_TRANSFORM:
					case SLOGAN_TEXT_FS:
					case SLOGAN_TEXT_LS:
					case TEXT_SLOGAN_DS:
						undoParentLink = 2;
						undoTargetLink = 9;
						redoParentLink = 2;
						redoTargetLink = 9;
						break;

					case EDIT_COLORS_BG:
						undoParentLink = 3;
						undoTargetLink = 12;
						redoParentLink = 3;
						redoTargetLink = 12;
						break;

					case EDIT_COLORS_LOGO_TEXT:
					case EDIT_COLORS_LOGO_TEXT1:
					case EDIT_COLORS_LOGO_TEXT2:
					case EDIT_GRADIENT_COLORS_LOGO_TEXT:
					case EDIT_GRADIENT_COLORS_LOGO_TEXT1:
					case EDIT_GRADIENT_COLORS_LOGO_TEXT2:
						undoParentLink = 3;
						undoTargetLink = 13;
						redoParentLink = 3;
						redoTargetLink = 13;
						break;

					case EDIT_COLORS_SLOGAN_TEXT:
					case EDIT_GRADIENT_COLORS_SLOGAN_TEXT:
						undoParentLink = 3;
						undoTargetLink = 14;
						redoParentLink = 3;
						redoTargetLink = 14;
						break;

					case EDIT_COLORS_SYMBOL:
					case EDIT_GRADIENT_COLORS_SYMBOL:
						undoParentLink = 3;
						undoTargetLink = 15;
						redoParentLink = 3;
						redoTargetLink = 15;
						break;

					case EDIT_COLORS_INNER_CONTAINER:
					case EDIT_GRADIENT_COLORS_INNER_CONTAINER:
						undoParentLink = 3;
						undoTargetLink = 43;
						redoParentLink = 3;
						redoTargetLink = 43;
						break;

					case EDIT_COLORS_OUTER_CONTAINER:
					case EDIT_GRADIENT_COLORS_OUTER_CONTAINER:
						undoParentLink = 3;
						undoTargetLink = 16;
						redoParentLink = 3;
						redoTargetLink = 16;
						break;

					case SYMBOL_ADD:
						undoParentLink = "undefined"
						undoTargetLink = 5;
						redoParentLink = 5;
						redoTargetLink = 31;
						break;

					case SYMBOL_REMOVE:
						undoParentLink = 5;
						undoTargetLink = 31;
						redoParentLink = 2;
						redoTargetLink = 7;
						break;

					case SYMBOL_POSITION:
					case SYMBOL_SIZE:
					case SYMBOL_DS:
					case SYMBOL_CHANGE:
						undoParentLink = 5;
						undoTargetLink = 31;
						redoParentLink = 5;
						redoTargetLink = 31;
						break;


					case MONOGRAM_ADD:
						undoParentLink = "undefined"
						undoTargetLink = 5;
						redoParentLink = 5;
						redoTargetLink = 32;
						break;

					case MONOGRAM_REMOVE:
						undoParentLink = 5;
						undoTargetLink = 32;
						redoParentLink = 2;
						redoTargetLink = 7;
						break;

					case MONOGRAM_POSITION:
					case MONOGRAM_SIZE:
					case MONOGRAM_DS:
					case MONOGRAM_CHANGE:
						undoParentLink = 5;
						undoTargetLink = 32;
						redoParentLink = 5;
						redoTargetLink = 32;
						break;

					case OUTER_CONTAINER_ADD:
						undoParentLink = lEditor.getSession("lastParentlink");
						undoTargetLink = lEditor.getSession("lastTargetlink");
						redoParentLink = 6;
						redoTargetLink = 24;
						break;

					case OUTER_CONTAINER_REMOVE:
						undoParentLink = 6;
						undoTargetLink = 24;
						redoParentLink = "undefined"
						redoTargetLink = 6;
						break;

					case OUTER_CONTAINER_SIZE:
					case OUTER_CONTAINER_CHANGE:
						undoParentLink = 6;
						undoTargetLink = 24;
						redoParentLink = 6;
						redoTargetLink = 24;
						break;

					case INNER_CONTAINER_ADD:
						undoParentLink = "undefined";
						undoTargetLink = 6;
						redoParentLink = 6;
						redoTargetLink = 40;
						break;

					case INNER_CONTAINER_REMOVE:
						undoParentLink = 6;
						undoTargetLink = 40;
						redoParentLink = "undefined"
						redoTargetLink = 6;
						break;

					case INNER_CONTAINER_CHANGE:
						undoParentLink = 6;
						undoTargetLink = 40;
						redoParentLink = 6;
						redoTargetLink = 40;
						break;

					case SLOGAN_FONT_CHANGE:
						undoParentLink = 2;
						undoTargetLink = 9;
						redoParentLink = 2;
						redoTargetLink = 9;
						break;

					case LOGO_FONT_CHANGE:
					case LOGO_FONT1_CHANGE:
					case LOGO_FONT2_CHANGE:
					case EDIT_COLORS_VARIATIONS:
					case LAYOUT_VARIATIONS:
					case GENERATE_MORE_LOGOS:
						undoParentLink = lEditor.getSession("lastParentlink");
						undoTargetLink = lEditor.getSession("lastTargetlink");
						redoParentLink = 2;
						redoTargetLink = 7;
						break;
				}

				if ((typeof (p_sUndoActValue) === "string") && (typeof (p_sRedoActValue) === "string")) {
					if (dh_editor_utility.removeMultipleSpaces(p_sUndoActValue) === dh_editor_utility.removeMultipleSpaces(p_sRedoActValue)) {
						console.log("both string are same:=" + p_sUndoActValue + ",,," + p_sUndoActValue.trim() + ",,," + p_sRedoActValue + ",,," + p_sRedoActValue.trim());
					} else {
						editorUndoRedo.undoRedoObj.setUndoAct(p_sActId, p_sUndoActValue, undoParentLink, undoTargetLink, p_sRedoActValue, redoParentLink, redoTargetLink);
					}
				}
				else if ((typeof (p_sUndoActValue) === "object") && (typeof (p_sRedoActValue) === "object")) {
					switch (p_sActId) {
						case MONOGRAM_CHANGE:
							if (p_sUndoActValue.generate.fontName === p_sRedoActValue.generate.fontName) {
								console.log("no need to change for " + MONOGRAM_CHANGE + " because both fontName is same");
								return;
							}
							break;
						case LOGO_FONT_CHANGE:
						case LOGO_FONT1_CHANGE:
							if (p_sUndoActValue.generate.textFontType === p_sRedoActValue.generate.textFontType) {
								console.log("no need to change for " + p_sActId + " because both textFontType is same");
								return;
							}
							break;
						case LOGO_FONT2_CHANGE:
							if (p_sUndoActValue.generate.text2FontType === p_sRedoActValue.generate.text2FontType) {
								console.log("no need to change for " + p_sActId + " because both text2FontType is same");
								return;
							}
							break;
						case SLOGAN_FONT_CHANGE:
							if (p_sUndoActValue.generate.sloganFontType === p_sRedoActValue.generate.sloganFontType) {
								console.log("no need to change for " + SLOGAN_FONT_CHANGE + " because both sloganFontType is same");
								return;
							}
							break;
					}

					if ((p_sActId == MONOGRAM_SIZE) || (p_sActId == SYMBOL_SIZE)) {
						editorUndoRedo.undoRedoObj.setUndoAct(p_sActId, p_sUndoActValue, undoParentLink, undoTargetLink, p_sRedoActValue, redoParentLink, redoTargetLink, p_sUndoActValue.generate.iconDistanceSlider, p_sRedoActValue.generate.iconDistanceSlider);
					} else {
						editorUndoRedo.undoRedoObj.setUndoAct(p_sActId, p_sUndoActValue, undoParentLink, undoTargetLink, p_sRedoActValue, redoParentLink, redoTargetLink);
					}

				}
				else {
					if (p_sUndoActValue == p_sRedoActValue) {
						console.log("both are same:=" + p_sUndoActValue + ",,," + p_sRedoActValue);
					} else {
						editorUndoRedo.undoRedoObj.setUndoAct(p_sActId, p_sUndoActValue, undoParentLink, undoTargetLink, p_sRedoActValue, redoParentLink, redoTargetLink);
					}
				}
			}
		},
		/**
		 * 
		 */
		doUndoAct: function () {
			hideAllPopover();
			if (editorUndoRedo.undoRedoObj) {
				let currentUndoObj = editorUndoRedo.undoRedoObj.getCurrentUndoAct();
				if (currentUndoObj && currentUndoObj.type) {
					editorUndoRedo.showBlocker(true);
					switch (currentUndoObj.type) {
						// Logo name 
						case LOGO_TEXT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							$('.editCompanyName').val(currentUndoObj.undoValue);
							onLogoNameTextInput("undo_redo_logoName");
							break;

						case LOGO_TEXT1_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							onLogoNameTextInput("undo_redo_logoName1", currentUndoObj.undoValue);
							break;

						case LOGO_TEXT2_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							onLogoNameTextInput("undo_redo_logoName2", currentUndoObj.undoValue);
							break;
						case LOGO_TEXT_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT_TRANSFORM);
							break;
						case LOGO_TEXT1_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT1_TRANSFORM);
							break;
						case LOGO_TEXT2_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT2_TRANSFORM);
							break;
						case LOGO_TEXT_FS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT_FS);
							break;
						case LOGO_TEXT1_FS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT1_FS);
							break;
						case LOGO_TEXT2_FS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT2_FS);
							break;
						case LOGO_TEXT_LS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT_LS);
							break;
						case LOGO_TEXT1_LS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT1_LS);
							break;
						case LOGO_TEXT2_LS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT2_LS);
							break;
						case LOGO_TEXT_CURVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_TEXT_CURVE);
							break;
						case LOGO_FONT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, currentUndoObj.prevAct, LOGO_FONT_CHANGE);
							break;

						case LOGO_FONT1_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_FONT1_CHANGE);
							break;

						case LOGO_FONT2_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LOGO_FONT2_CHANGE);
							break;

						// Slogan
						case SLOGAN_TEXT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							$('.editSloganName').val(currentUndoObj.undoValue);
							onLogoNameTextInput("undo_redo_slogan");
							break;
						case SLOGAN_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SLOGAN_REMOVE);
							break;
						case SLOGAN_TEXT_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SLOGAN_TEXT_TRANSFORM);
							break;
						case SLOGAN_TEXT_FS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SLOGAN_TEXT_FS);
							break;
						case SLOGAN_TEXT_LS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);

							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SLOGAN_TEXT_LS);
							break;
						case TEXT_SLOGAN_DS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, TEXT_SLOGAN_DS);
							break;
						case SLOGAN_FONT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SLOGAN_FONT_CHANGE);
							break;

						// Symbol
						case SYMBOL_ADD:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_ADD);
							break;
						case SYMBOL_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_REMOVE);
							break;
						case SYMBOL_POSITION:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_POSITION);
							break;
						case SYMBOL_SIZE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_SIZE, currentUndoObj.hackedUndoValue);
							break;
						case SYMBOL_DS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_DS);
							break;
						case SYMBOL_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, SYMBOL_CHANGE);
							break;

						// Monogram
						case MONOGRAM_ADD:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_ADD);
							break;
						case MONOGRAM_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_REMOVE);
							break;
						case MONOGRAM_POSITION:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_POSITION);
							break;
						case MONOGRAM_SIZE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_SIZE, currentUndoObj.hackedUndoValue);
							break;
						case MONOGRAM_DS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_DS);
							break;
						case MONOGRAM_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, MONOGRAM_CHANGE);
							break;

						// Outer container
						case OUTER_CONTAINER_ADD:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, OUTER_CONTAINER_ADD);
							break;
						case OUTER_CONTAINER_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, OUTER_CONTAINER_REMOVE);
							break;
						case OUTER_CONTAINER_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, OUTER_CONTAINER_CHANGE);
							break;
						case OUTER_CONTAINER_SIZE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, OUTER_CONTAINER_SIZE);
							break;

						// Inner container
						case INNER_CONTAINER_ADD:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, INNER_CONTAINER_ADD);
							break;
						case INNER_CONTAINER_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, INNER_CONTAINER_REMOVE);
							break;
						case INNER_CONTAINER_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, INNER_CONTAINER_CHANGE);
							break;

						// Edit colors
						case EDIT_COLORS_BG:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_BG);
							break;

						case EDIT_COLORS_LOGO_TEXT:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_LOGO_TEXT);
							break;
						case EDIT_COLORS_LOGO_TEXT1:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_LOGO_TEXT1);
							break;
						case EDIT_COLORS_LOGO_TEXT2:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_LOGO_TEXT2);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_LOGO_TEXT);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT1:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_LOGO_TEXT1);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT2:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_LOGO_TEXT2);
							break;

						case EDIT_COLORS_SLOGAN_TEXT:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_SLOGAN_TEXT);
							break;
						case EDIT_GRADIENT_COLORS_SLOGAN_TEXT:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_SLOGAN_TEXT);
							break;

						case EDIT_COLORS_SYMBOL:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_SYMBOL);
							break;
						case EDIT_GRADIENT_COLORS_SYMBOL:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_SYMBOL);
							break;

						case EDIT_COLORS_INNER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_INNER_CONTAINER);
							break;
						case EDIT_GRADIENT_COLORS_INNER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_INNER_CONTAINER);
							break;

						case EDIT_COLORS_OUTER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_OUTER_CONTAINER);
							break;
						case EDIT_GRADIENT_COLORS_OUTER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_GRADIENT_COLORS_OUTER_CONTAINER);
							break;

						case EDIT_COLORS_VARIATIONS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, EDIT_COLORS_VARIATIONS);
							break;
						//--------------------------
						case LAYOUT_VARIATIONS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, LAYOUT_VARIATIONS);
							break;
						//--------------------------
						case GENERATE_MORE_LOGOS:
							editorUndoRedo.showTopMenuTabs(currentUndoObj.undoParentLink, currentUndoObj.undoTargetLink, currentUndoObj.undoValue);
							editorUndoRedo.undoRedoTheLogo(currentUndoObj.undoValue, currentUndoObj.prevAct, GENERATE_MORE_LOGOS);
							break;
					}
				} else {
					console.log("no undo act available");
				}
			}
		},
		/**
		 * 
		 */
		doRedoAct: function () {
			hideAllPopover();
			if (editorUndoRedo.undoRedoObj) {
				let currentRedoObj = editorUndoRedo.undoRedoObj.getCurrentRedoAct();
				if (currentRedoObj && currentRedoObj.type) {
					editorUndoRedo.showBlocker(true);
					switch (currentRedoObj.type) {
						// Logo name
						case LOGO_TEXT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							$('.editCompanyName').val(currentRedoObj.redoValue);
							onLogoNameTextInput("undo_redo_logoName");
							break;
						case LOGO_TEXT1_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							onLogoNameTextInput("undo_redo_logoName1", currentRedoObj.redoValue);
							break;
						case LOGO_TEXT2_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							onLogoNameTextInput("undo_redo_logoName2", currentRedoObj.redoValue);
							break;
						case LOGO_TEXT_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT_TRANSFORM);
							break;
						case LOGO_TEXT1_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT1_TRANSFORM);
							break;
						case LOGO_TEXT2_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT2_TRANSFORM);
							break;
						case LOGO_TEXT_FS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT_FS);
							break;
						case LOGO_TEXT1_FS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT1_FS);
							break;
						case LOGO_TEXT2_FS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT2_FS);
							break;
						case LOGO_TEXT_LS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT_LS);
							break;
						case LOGO_TEXT1_LS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT1_LS);
							break;
						case LOGO_TEXT2_LS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT2_LS);
							break;
						case LOGO_TEXT_CURVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_TEXT_CURVE);
							break;
						case LOGO_FONT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_FONT_CHANGE);
							break;
						case LOGO_FONT1_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_FONT1_CHANGE);
							break;
						case LOGO_FONT2_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LOGO_FONT2_CHANGE);
							break;

						// Slogan
						case SLOGAN_TEXT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							$('.editSloganName').val(currentRedoObj.redoValue);
							onLogoNameTextInput("undo_redo_slogan");
							break;
						case SLOGAN_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SLOGAN_REMOVE);
							break;
						case SLOGAN_TEXT_TRANSFORM:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SLOGAN_TEXT_TRANSFORM);
							break;
						case SLOGAN_TEXT_FS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SLOGAN_TEXT_FS);
							break;
						case SLOGAN_TEXT_LS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);

							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SLOGAN_TEXT_LS);
							break;
						case TEXT_SLOGAN_DS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", TEXT_SLOGAN_DS);
							break;
						case SLOGAN_FONT_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SLOGAN_FONT_CHANGE);
							break;

						// Symbol
						case SYMBOL_ADD:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_ADD);
							break;
						case SYMBOL_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_REMOVE);
							break;
						case SYMBOL_POSITION:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_POSITION);
							break;
						case SYMBOL_SIZE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_SIZE, currentRedoObj.hackedRedoValue);
							break;
						case SYMBOL_DS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_DS);
							break;
						case SYMBOL_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", SYMBOL_CHANGE);
							break;

						// Monogram
						case MONOGRAM_ADD:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_ADD);
							break;
						case MONOGRAM_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_REMOVE);
							break;
						case MONOGRAM_POSITION:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_POSITION);
							break;
						case MONOGRAM_SIZE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_SIZE, currentRedoObj.hackedRedoValue);
							break;
						case MONOGRAM_DS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_DS);
							break;
						case MONOGRAM_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", MONOGRAM_CHANGE);
							break;

						// Outer container
						case OUTER_CONTAINER_ADD:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", OUTER_CONTAINER_ADD);
							break;
						case OUTER_CONTAINER_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", OUTER_CONTAINER_REMOVE);
							break;
						case OUTER_CONTAINER_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", OUTER_CONTAINER_CHANGE);
							break;
						case OUTER_CONTAINER_SIZE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", OUTER_CONTAINER_SIZE);
							break;

						// Inner container
						case INNER_CONTAINER_ADD:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", INNER_CONTAINER_ADD);
							break;
						case INNER_CONTAINER_REMOVE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", INNER_CONTAINER_REMOVE);
							break;
						case INNER_CONTAINER_CHANGE:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", INNER_CONTAINER_CHANGE);
							break;

						// Edit colors
						case EDIT_COLORS_BG:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_BG);
							break;

						case EDIT_COLORS_LOGO_TEXT:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_LOGO_TEXT);
							break;
						case EDIT_COLORS_LOGO_TEXT1:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_LOGO_TEXT1);
							break;
						case EDIT_COLORS_LOGO_TEXT2:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_LOGO_TEXT2);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_LOGO_TEXT);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT1:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_LOGO_TEXT1);
							break;
						case EDIT_GRADIENT_COLORS_LOGO_TEXT2:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_LOGO_TEXT2);
							break;

						case EDIT_COLORS_SLOGAN_TEXT:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_SLOGAN_TEXT);
							break;
						case EDIT_GRADIENT_COLORS_SLOGAN_TEXT:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_SLOGAN_TEXT);
							break;

						case EDIT_COLORS_SYMBOL:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_SYMBOL);
							break;
						case EDIT_GRADIENT_COLORS_SYMBOL:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_SYMBOL);
							break;

						case EDIT_COLORS_INNER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_INNER_CONTAINER);
							break;
						case EDIT_GRADIENT_COLORS_INNER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_INNER_CONTAINER);
							break;

						case EDIT_COLORS_OUTER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_OUTER_CONTAINER);
							break;
						case EDIT_GRADIENT_COLORS_OUTER_CONTAINER:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_GRADIENT_COLORS_OUTER_CONTAINER);
							break;

						case EDIT_COLORS_VARIATIONS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", EDIT_COLORS_VARIATIONS);
							break;
						//-------------------
						case LAYOUT_VARIATIONS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", LAYOUT_VARIATIONS);
							break;
						//-------------------
						case GENERATE_MORE_LOGOS:
							editorUndoRedo.showTopMenuTabs(currentRedoObj.redoParentLink, currentRedoObj.redoTargetLink, currentRedoObj.redoValue);
							editorUndoRedo.undoRedoTheLogo(currentRedoObj.redoValue, "redo", GENERATE_MORE_LOGOS);
							break;
					}
				} else {
					console.log("no redo act available");
				}
			}
		},
		/**
		 * 
		 * @param {*} p_nParentLink 
		 * @param {*} p_nTargetlink 
		 * @param {*} p_oUndoRedoObj 
		 */
		showTopMenuTabs: function (p_nParentLink, p_nTargetlink, p_oUndoRedoObj) {
			$('.previewSection').removeClass('hidden');
			$('.editFinalLogo').removeClass('hidden');
			$('.editLogoSlider').addClass('hidden');

			if (p_nParentLink != "undefined" || p_nTargetlink != "undefined") {
				if (p_nParentLink == "undefined" && p_nTargetlink == 30) {
					p_nParentLink = 2;
					p_nTargetlink = 7;
					// generate more logos case
				}
				else if (p_nParentLink == "undefined" && p_nTargetlink == 29) {
					p_nParentLink = 2;
					p_nTargetlink = 7;
					// layout variations case
				}
				else if (p_nParentLink == 5 && p_nTargetlink == 31) {
					if (p_oUndoRedoObj.generate.templatePath.isIcon == 1) {
					} else {
						p_nTargetlink = undefined;
					}
					// add or search symbol case
				}
				else if (p_nParentLink == 5 && p_nTargetlink == 32) {
					if (p_oUndoRedoObj.generate.templatePath.isMono == 1) {
					} else {
						p_nTargetlink = undefined;
					}
					// add or search monogram case
				}
				else if (p_nParentLink == 6 && p_nTargetlink == 24) {
					if (p_oUndoRedoObj.generate.templatePath.isFrame == 1) {
					} else {
						p_nTargetlink = undefined;
					}
					// add outer container case
				}
				else if (p_nParentLink == 6 && p_nTargetlink == 40) {
					if (p_oUndoRedoObj.generate.templatePath.isIconFrame == 1) {
					} else {
						p_nTargetlink = undefined;
					}
					// add inner container case
				}
				else if (p_nParentLink == 2 && p_nTargetlink == 8) {
					p_nTargetlink = undefined;
					// change compnay name fonts case
				}
				else if (p_nParentLink == 2 && p_nTargetlink == 10) {
					p_nTargetlink = undefined;
					// change slogan fonts case
				}
				else if (p_nParentLink == 3 && p_nTargetlink == 26) {
					p_nTargetlink = undefined;
					// color variations case
				}
				else if (p_nParentLink == 2 && p_nTargetlink == 2) {
					p_nTargetlink = 7;
				}
				else if (p_nParentLink == "undefined" && p_nTargetlink == 2) {
					p_nParentLink = p_nTargetlink;
					p_nTargetlink = 7;
					// edit name and slogan case
				}
				else if (p_nParentLink == "undefined" && p_nTargetlink == 3) {
					p_nParentLink = p_nTargetlink;
					p_nTargetlink = 12;
					// edit colors case
				}
				else if (p_nParentLink == "undefined" && p_nTargetlink != "undefined") {
					p_nParentLink = p_nTargetlink;
					p_nTargetlink = undefined;
				}
				else if (p_nParentLink != "undefined" && p_nTargetlink == "undefined") {
					// alert("not possible case");
				}
			} else {
				p_nParentLink = 2;
				p_nTargetlink = 7;
			}

			if (p_nParentLink == null && p_nTargetlink == null) {
				p_nParentLink = 2;
				p_nTargetlink = 7;
			}


			lEditor.setSession("parentlink", p_nParentLink);
			lEditor.setSession("targetlink", p_nTargetlink);
			lEditor.setSession("defaultlink", undefined);

			var parentDiv = $('.subChild-13').find(".company-text-color-box");
			parentDiv.addClass("hidden");

			let parentClass = ".topParent-" + p_nParentLink;
			let menu1Div = $(".menu_1").find(parentClass);
			if (menu1Div) {
				$(".menu_1").find('[class^="topParent"]').parent('li').removeClass('active');
				menu1Div.parent('li').addClass('active');
				// top menu end here
				let menu2Div = $(".menu_2").find('.subMenuSection');
				if (menu2Div) {
					menu2Div.find('[class^="submenu"]').addClass('hidden');
					let menu2_submenu_class = ".submenu_" + p_nParentLink;
					let menu2_submenu_div = menu2Div.find(menu2_submenu_class);
					if (menu2_submenu_div) {
						menu2_submenu_div.removeClass('hidden');
					}
					let menu2_submenu_subnav_div = menu2_submenu_div.find(".subnav");
					if (menu2_submenu_subnav_div) {
						menu2_submenu_subnav_div.find('[class^="subMenu"]').parent('li').removeClass('active');
						let menu2_submenu_subnav_subMenu_class = ".subMenu-" + p_nTargetlink;
						let menu2_submenu_subnav_subMenu_div = menu2_submenu_subnav_div.find(menu2_submenu_subnav_subMenu_class);
						if (menu2_submenu_subnav_subMenu_div) {
							menu2_submenu_subnav_subMenu_div.parent('li').addClass('active');
						}
					}
					let menu2_submenu_logo_edit_option_div = menu2_submenu_div.find(".logo-edit--option");
					menu2_submenu_logo_edit_option_div.find('[class^="subChild"]').addClass('hidden');

					let menu2_logo_edit_option_div = menu2Div.find(".logo-edit--option");
					menu2_logo_edit_option_div.find('[class^="subChild"]').addClass('hidden');

					if (p_nParentLink == 2 || p_nParentLink == 5 || p_nParentLink == 6) {
						let menu2_submenu_logo_edit_option_subchild_class = ".subChild-" + p_nTargetlink;
						let menu2_submenu_logo_edit_option_subchild_div = menu2_submenu_logo_edit_option_div.find(menu2_submenu_logo_edit_option_subchild_class);
						if (menu2_submenu_logo_edit_option_subchild_div) {
							menu2_submenu_logo_edit_option_subchild_div.removeClass('hidden');
						}
					} else if (p_nParentLink == 3) {
						let menu2_logo_edit_option_subchild_class = ".subChild-" + p_nTargetlink;
						let menu2_logo_edit_option_subchild_div = menu2_logo_edit_option_div.find(".logo--inner").find(menu2_logo_edit_option_subchild_class);
						if (menu2_logo_edit_option_subchild_div) {
							menu2_logo_edit_option_subchild_div.removeClass('hidden');
						}
					}
					lEditor.showMultiLineTextTools(p_oUndoRedoObj);
				}
			}
		},
		/**
		 * 
		 * @param {*} p_sType 
		 */
		showTopMenuEditTabs: function (p_sType, p_oUndoRedoobj) {
			switch (p_sType) {
				case "icon_yes":
					$('.layoutDisplay, .editSymbolsSection').removeClass('hidden');
					$('.layoutDisplay').removeClass('active');
					$('.symbolVariations').addClass('hidden');
					$('[data-option=".symbolContainer"]').text('Edit Symbol');
					$('[data-option=".symbolVariations"]').text('Change Symbol');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
					break;
				case "icon_no":
					$('.layoutDisplay, .editSymbolsSection').addClass('hidden');
					$('.symbolVariations').removeClass('hidden');
					$('[data-option=".symbolContainer"]').text('Add Symbol');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').addClass('disabled');
					break;

				case "mono_yes":
					$('.layoutDisplay, .editMonoSection').removeClass('hidden');
					$('.layoutDisplay').removeClass('active');
					$('.monoVariations').addClass('hidden');
					$('[data-option=".monogramContainer"]').text('Edit Monogram');
					$('[data-option=".monoVariations"]').text('Change Monogram');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').removeClass('disabled');
					break;
				case "mono_no":
					$('.layoutDisplay, .editMonoSection').addClass('hidden');
					$('.monoVariations').removeClass('hidden');
					$('[data-option=".monogramContainer"]').text('Add Monogram');
					$('.iconDistanceSlider, .iconVsTextSlider, .logoSizeSlider').addClass('disabled');
					break;

				case "outer_frame_yes":
					$('.subMenu-23').parent('li').removeClass('hidden');
					$('.subMenu-23').parent('li').removeClass('active');
					$('.subMenu-42').parent('li').removeClass('active');
					$('.subMenu-42').parent('li').removeClass('hidden');
					$('.subMenu-42').parents('ul').addClass('flex');
					$('.subMenu-24').text('Edit Outer Container');
					$(".containerOptions").removeClass('active');
					$('.cancelFrameContainer').parent('li').addClass('hidden');
					$('.containerFrameSlider').removeClass('hidden');
					$('.frameSizeSlider').removeClass('disabled');
					break;
				case "outer_frame_no":
					$('.subMenu-23').parent('li').addClass('hidden');
					$('.subMenu-42').parent('li').addClass('hidden');
					$('.subMenu-42').parents('ul').removeClass('flex');
					$('.subMenu-24').text('Add Outer Container');
					$(".containerOptions").addClass('active');
					$('.cancelFrameContainer').parent('li').removeClass('hidden');
					$('.containerFrameSlider').addClass('hidden');
					break;

				case "inner_frame_yes":
					$('.subMenu-40').text('Edit Inner Container');
					$('.subMenu-40').parent('li').removeClass('disabled');

					$('.subMenu-41').parent('li').removeClass('hidden');
					$('.subMenu-41').parent('li').removeClass('active');

					$('.subMenu-44').parent('li').removeClass('hidden');
					$('.subMenu-44').parent('li').removeClass('active');

					$(".innerContainerOptions").removeClass('active');
					$('.cancelIconFrameContainer').parent('li').addClass('hidden');
					break;
				case "inner_frame_no":
					$('.subMenu-40').text('Add Inner Container');
					if (p_oUndoRedoobj.generate.templatePath.isIcon == 1 || p_oUndoRedoobj.generate.templatePath.isMono == 1) {

					} else {
						$('.subMenu-40').parent('li').addClass('disabled');
					}
					$('.subMenu-41').parent('li').addClass('hidden');
					$('.subMenu-44').parent('li').addClass('hidden');
					$(".innerContainerOptions").addClass('active');
					$('.cancelIconFrameContainer').parent('li').removeClass('hidden');
					break;
			}
		},
		/**
		 * 
		 */
		dieUndoRedo: function () {
			if (editorUndoRedo.undoRedoObj) {
				editorUndoRedo.undoRedoObj.die();
			}
		},
		/**
		 * 
		 * @param {*} p_oUndoRedoObj 
		 * @param {*} p_sPrevAct 
		 * @param {*} p_sType 
		 */
		undoRedoTheLogo: function (p_oUndoRedoObj, p_sPrevAct, p_sType = "", p_sHackedValue) {
			let sloganText = null;
			lEditor.updateFontsObject("logo", p_oUndoRedoObj.generate)
				.then(_ => {
					if (p_oUndoRedoObj.generate.templatePath.isDBLineCompanyText == "yes") {
						lEditor.updateFontsObject("logoName2", p_oUndoRedoObj.generate).then(_ => {
							sloganText = lEditor.getSession('sloganText');
							if (sloganText && sloganText !== "" && sloganText !== " ") {
								lEditor.updateFontsObject("slogan", p_oUndoRedoObj.generate)
									.then(_ => {
										if (p_oUndoRedoObj.generate.templatePath.isMono == 1) {
											lEditor.updateFontsObject("mono", p_oUndoRedoObj.generate)
												.then(_ => {
													editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
												});
										} else {
											editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
										}
									});
							}
							else {
								if (p_oUndoRedoObj.generate.templatePath.isMono == 1) {
									lEditor.updateFontsObject("mono", p_oUndoRedoObj.generate)
										.then(_ => {
											editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
										});
								} else {
									editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
								}
							}
						});
					} else {
						sloganText = lEditor.getSession('sloganText');
						if (sloganText && sloganText !== "" && sloganText !== " ") {
							lEditor.updateFontsObject("slogan", p_oUndoRedoObj.generate)
								.then(_ => {
									if (p_oUndoRedoObj.generate.templatePath.isMono == 1) {
										lEditor.updateFontsObject("mono", p_oUndoRedoObj.generate)
											.then(_ => {
												editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
											});
									} else {
										editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
									}
								});
						}
						else {
							if (p_oUndoRedoObj.generate.templatePath.isMono == 1) {
								lEditor.updateFontsObject("mono", p_oUndoRedoObj.generate)
									.then(_ => {
										editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
									});
							} else {
								editorUndoRedo.generateUndoRedoLogoTemplate(p_sType, p_oUndoRedoObj, p_sPrevAct, p_sHackedValue);
							}
						}
					}

				});
		},
		/**
		 * 
		 * @param {*} $for 
		 * @param {*} p_oUndoRedoobj 
		 * @param {*} p_sPrevAct 
		 */
		generateUndoRedoLogoTemplate: function ($for, p_oUndoRedoobj, p_sPrevAct, p_sHackedValue) {
			let currLogo = p_oUndoRedoobj;
			let logoTemp = null;
			var changeLogoName;
			switch ($for) {
				case LOGO_TEXT_TRANSFORM:
					currLogo.logoName = p_oUndoRedoobj.logoName;
					lEditor.setSession("logoname", currLogo.logoName);
					$('.editCompanyName').val(currLogo.logoName);
					break;
				case LOGO_TEXT1_TRANSFORM:
					currLogo.logoName1 = p_oUndoRedoobj.logoName1;
					changeLogoName = currLogo.logoName1 + " " + p_oUndoRedoobj.logoName2;
					lEditor.setSession('logoname', changeLogoName);
					$('.company-text-dd').text(changeLogoName);
					break;
				case LOGO_TEXT2_TRANSFORM:
					currLogo.logoName2 = p_oUndoRedoobj.logoName2;
					changeLogoName = p_oUndoRedoobj.logoName1 + " " + currLogo.logoName2;
					lEditor.setSession('logoname', changeLogoName);
					$('.company-text-dd').text(changeLogoName);
					break;
				case SLOGAN_REMOVE:
					currLogo.sloganName = p_oUndoRedoobj.sloganName;
					lEditor.setSession("sloganText", currLogo.sloganName);
					$('.editSloganName').val(currLogo.sloganName);
					break;
				case SLOGAN_TEXT_TRANSFORM:
					currLogo.sloganName = p_oUndoRedoobj.sloganName;
					lEditor.setSession("sloganText", currLogo.sloganName);
					$('.editSloganName').val(currLogo.sloganName);
					break;
				default:
					break;
			}

			if (($for == MONOGRAM_SIZE) || ($for == SYMBOL_SIZE) && p_sHackedValue) {
				currLogo.generate.iconDistanceSlider = p_sHackedValue;
			}

			let returnObj = editorUndoRedo.updateUndoRedoLogoTemplateByOption(p_oUndoRedoobj, p_oUndoRedoobj.idKey);
			logoTemp = returnObj.logoObj;
			currLogo.generate = logoTemp;

			$('.finaLogoInner').html('<div class="svg--slide" style="background-color:' + p_oUndoRedoobj.generate.bgColor + ';"><div class="svg-slide--content svgSlideContent"><div class="water-mark-img"></div>' + returnObj.html + '<div class="bgOutlineBox bg-outline-box"></div></div></div>');

			currLogo = updateCurrLogoObject(currLogo);
			lEditor.setDefaultLogo(currLogo, currLogo.generate);

			var parentlink = parseInt(lEditor.getSession("parentlink"));
			var targetlink = parseInt(lEditor.getSession("targetlink"));
			var prevAct = p_sPrevAct;
			if (prevAct == "redo") {
				prevAct = $for;
			}
			switch (parseInt(lEditor.getSession("parentlink"))) {
				case 3: // Edit Colors
					switch (parseInt(lEditor.getSession("targetlink"))) {
						case 12:
							updateColorPickerValue(p_oUndoRedoobj.generate.bgColor, false, "background", 0);
							$(".submenu_3").find(".subMenu-12").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "background");
							break;
						case 13:
							$(".submenu_3").find(".subMenu-13").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "foreground");
							var parentDiv = $('.subChild-13').find(".company-text-color-box");
							if ((prevAct == EDIT_COLORS_LOGO_TEXT1) || ((prevAct == EDIT_GRADIENT_COLORS_LOGO_TEXT1))) {
								if (parentDiv.hasClass("hidden")) {
									parentDiv.removeClass("hidden");
								}
								updateColorPickerValue(p_oUndoRedoobj.generate.mainTextColor, false, "foreground", 13);
								$('.subChild-13').find(".company-text-color-box").attr("last_selected", "dd-ct-color-line1");
							} else if ((prevAct == EDIT_COLORS_LOGO_TEXT2) || (prevAct == EDIT_GRADIENT_COLORS_LOGO_TEXT2)) {
								if (parentDiv.hasClass("hidden")) {
									parentDiv.removeClass("hidden");
								}
								updateColorPickerValue(p_oUndoRedoobj.generate.mainText2Color, false, "foreground", 13);
								$('.subChild-13').find(".company-text-color-box").attr("last_selected", "dd-ct-color-line2");
							} else {
								if (p_oUndoRedoobj.generate.templatePath.isDBLineCompanyText == "yes") {
									if (parentDiv.hasClass("hidden")) {
										parentDiv.removeClass("hidden");
									}
								}
								updateColorPickerValue(p_oUndoRedoobj.generate.mainTextColor, false, "foreground", 13);
							}
							break;
						case 14:
							updateColorPickerValue(p_oUndoRedoobj.generate.sloganTextColor, false, "foreground", 14);
							$(".submenu_3").find(".subMenu-14").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "foreground");
							break;
						case 15:
							updateColorPickerValue(p_oUndoRedoobj.generate.iconColor, false, "foreground", 15);
							$(".submenu_3").find(".subMenu-15").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "foreground");
							break;
						case 43:
							updateColorPickerValue(p_oUndoRedoobj.generate.iconFrameColor, false, "foreground", 43);
							$(".submenu_3").find(".subMenu-43").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "foreground");
							break;
						case 16:
							if (p_oUndoRedoobj.generate.templatePath.frameType === "filled") {
								updateColorPickerValue(p_oUndoRedoobj.generate.frameFilledColor, false, "foreground", 16);
							} else {
								updateColorPickerValue(p_oUndoRedoobj.generate.frameColor, false, "foreground", 16);
							}
							$(".submenu_3").find(".subMenu-16").parent('li').removeClass('disabled');
							lEditor.setSession('colorDataType', "foreground");
							break;
					}
					break;
				case 5: // Symbol
					if (p_oUndoRedoobj.generate.templatePath.isIcon == 1) {
						editorUndoRedo.showTopMenuEditTabs("mono_no", p_oUndoRedoobj);
						editorUndoRedo.showTopMenuEditTabs("icon_yes", p_oUndoRedoobj);
					}
					else if (p_oUndoRedoobj.generate.templatePath.isMono == 1) {
						editorUndoRedo.showTopMenuEditTabs("icon_no", p_oUndoRedoobj);
						editorUndoRedo.showTopMenuEditTabs("mono_yes", p_oUndoRedoobj);
					}
					else {
						editorUndoRedo.showTopMenuEditTabs("icon_no", p_oUndoRedoobj);
						editorUndoRedo.showTopMenuEditTabs("mono_no", p_oUndoRedoobj);
					}
					break;
				case 6: // Container
					if (p_oUndoRedoobj.generate.templatePath.isFrame == 1) {
						editorUndoRedo.showTopMenuEditTabs("outer_frame_yes", p_oUndoRedoobj);
					} else {
						editorUndoRedo.showTopMenuEditTabs("outer_frame_no", p_oUndoRedoobj);
					}
					if (p_oUndoRedoobj.generate.templatePath.isIconFrame == 1) {
						editorUndoRedo.showTopMenuEditTabs("inner_frame_yes", p_oUndoRedoobj);
					} else {
						editorUndoRedo.showTopMenuEditTabs("inner_frame_no", p_oUndoRedoobj);
					}
					break;
			}

			onTextFontSizeSlide($(".logoTextSlider"), p_oUndoRedoobj.generate.logoTextSlider, true);
			onTextLetterSpacingSlide($(".logoLetterSpacing"), p_oUndoRedoobj.generate.logoLetterSpacing, true);
			onSloganFontSizeSlide($(".sloganTextSize"), p_oUndoRedoobj.generate.sloganTextSize, true);
			onSloganLetterSpacingSlide($(".sloganLetterSpacing"), p_oUndoRedoobj.generate.sloganLetterSpacing, true);
			onTextSloganDistanceSlide($('.textSloganDistSlider'), p_oUndoRedoobj.generate.textSloganDistSlider, true);
			onSymbolSizeSlide($(".logoSizeSlider"), p_oUndoRedoobj.generate.logoSizeSlider, true);
			if (($for == MONOGRAM_SIZE) || ($for == SYMBOL_SIZE) && p_sHackedValue) {
				onSymbolDistanceSlide($(".iconDistanceSlider"), p_sHackedValue, true);
			} else {
				onSymbolDistanceSlide($(".iconDistanceSlider"), p_oUndoRedoobj.generate.iconDistanceSlider, true);
			}

			onOuterFrameSizeSlide($('.frameSizeSlider'), p_oUndoRedoobj.generate.frameSizeSlider, true);
			if (p_oUndoRedoobj.generate.isArc == 1) {
				showCurveSlider(true);
				onTextCurveSizeSlide($('.logoCurveSlider'), p_oUndoRedoobj.generate.arcValue, true)
			} else {
				showCurveSlider(false);
			}
			eanbledSloganTool();

			saveSliderData();
			editorUndoRedo.showBlocker(false);
			createTempHint();
		},
		/**
		 * 
		 * @param {*} currLogo 
		 * @param {*} $for 
		 * @param {*} idKey 
		 */
		updateUndoRedoLogoTemplateByOption: function (currLogo, idKey) {
			var logoObj = currLogo.generate;
			var obj = {};

			var getSVGTag = logoMakerFunction.getDynamicSvgTag();
			var template = null;
			if (getSVGTag != "") {
				template = getSVGTag;
			} else {
				template = '<svg version="1.1" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" height="100%" width="100%" x="0px" y="0px" viewBox="0 0 ' + constantVars.VIEWBOXWIDTH + ' ' + constantVars.VIEWBOXHEIGHT + '" xml:space="preserve" preserveAspectRatio="xMidYMid meet" class="">{{textGradient}}{{text2Gradient}}{{sloganGradient}}{{iconGradient}}{{frameGradient}}{{iconFrameGradient}}';
			}

			template += '<rect x="0px" y="0px" width="100%" height="100%" fill="{{svgColor}}"/>';
			template += '<g class="logo-container-box logoContainerBox" transform="scale({{logoContainerScale}}) translate({{logoContainerX}},{{logoContainerY}})">';
			if (logoObj.templatePath.isFrame == 1) {
				template += '<g class="container_1" transform="scale({{frameScale}}) translate({{frameX}},{{frameY}})"  fill="{{frameFill}}">{{frameHtml}}</g>';
			}
			template += '<g class="containerBody" transform="scale({{containerBodyScale}}) translate({{containerBodyX}},{{containerBodyY}})" >';
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				template += '<g class="sampleIconBox" transform="scale({{iconFrameBoxScale}}) translate({{iconFrameBoxX}},{{iconFrameBoxY}})">';
				if (logoObj.templatePath.isIconFrame == 1) {
					template += '<g class="iconFrame" transform="scale({{iconFrameScale}}) translate({{iconFrameX}},{{iconFrameY}})"  fill="{{iconFrameFill}}">{{iconFrameHtml}}</g>';
				}
				template += '<g class="sampleIcons_1" transform="scale({{iconScale}}) translate({{iconX}},{{iconY}})" fill="{{iconFill}}">{{iconHtml}}</g>';
				template += '</g>';
			}
			template += '<g class="sampleTexts_1" transform="scale({{textAndSloganScale}}) translate({{textAndSloganX}},{{textAndSloganY}})">';

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template += '<g class="logo--name svgLogoName_1 logoNameBox1" transform="scale({{text1Scale}}) translate({{text1X}},{{text1Y}})" fill="{{text1Fill}}">{{text1Html}}</g>';

				template += '<g class="logo--name svgLogoName_2 logoNameBox2" transform="scale({{text2Scale}}) translate({{text2X}},{{text2Y}})" fill="{{text2Fill}}">{{text2Html}}</g>';
			} else {
				template += '<g class="logo--name svgLogoName_1 logoNameBox" transform="scale({{textScale}}) translate({{textX}},{{textY}})" fill="{{textFill}}">{{textHtml}}</g>';
			}

			template += '<g id="" class="logo--name svgSloganText_1 sloganBox" transform="scale({{sloganScale}}) translate({{sloganX}},{{sloganY}})" fill="{{sloganFill}}">{{sloganHtml}}</g>';
			template += '</g>';
			template += '</g>';
			template += '</g>';
			template += '</svg>';

			if (logoObj.textGradient != "") {
				logoObj.mainTextColor = 'url(#textGradient' + idKey + ')';
			}

			if (logoObj.templatePath.isDBLineCompanyText == "yes" && logoObj.text2Gradient != "") {
				logoObj.mainText2Color = 'url(#text2Gradient' + idKey + ')';
			}

			if (logoObj.sloganGradient != "") {
				logoObj.sloganTextColor = 'url(#sloganGradient' + idKey + ')';
			}
			if (logoObj.frameGradient != "") {
				logoObj.frameColor = 'url(#frameGradient' + idKey + ')';
			}
			if (logoObj.iconGradient != "") {
				logoObj.iconColor = 'url(#iconGradient' + idKey + ')';
			}
			if (logoObj.iconFrameGradient != "") {
				logoObj.iconFrameColor = 'url(#iconFrameGradient' + idKey + ')';
			}
			if (logoObj.frameFilledGradient != "" && logoObj.templatePath.frameType == "filled") {
				logoObj.frameFilledColor = 'url(#frameGradient' + idKey + ')';
			}

			//apply gradient to template
			template = logoMakerFunction.applyGradientToTemplate(template, logoObj, idKey);

			template = template.replace("{{svgColor}}", logoObj.bgColor);

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1Html}}", logoObj.logoPath1);
				template = template.replace("{{text1Fill}}", logoObj.mainTextColor);

				template = template.replace("{{text2Html}}", logoObj.logoPath2);
				template = template.replace("{{text2Fill}}", logoObj.mainText2Color);
			} else {
				template = template.replace("{{textHtml}}", logoObj.logoPath);
				template = template.replace("{{textFill}}", logoObj.mainTextColor);
			}


			template = template.replace("{{sloganHtml}}", logoObj.sloganPath);
			template = template.replace("{{sloganFill}}", logoObj.sloganTextColor);

			template = template.replace("{{frameHtml}}", logoObj.framePath);
			if (logoObj.templatePath.frameType == "filled") {
				template = template.replace("{{frameFill}}", logoObj.frameFilledColor);
			} else {
				template = template.replace("{{frameFill}}", logoObj.frameColor);
			}
			if (logoObj.templatePath.isIcon == 1 || logoObj.templatePath.isMono == 1) {
				let iconSVGPath = dh_lm_common_utility.removeFillFromIconSvg(logoObj.iconPath, logoObj.iconColor);
				template = template.replace("{{iconHtml}}", iconSVGPath);
				template = template.replace("{{iconFill}}", logoObj.iconColor);
				template = template.replace("{{iconX}}", logoObj.templatePath.icon.x);
				template = template.replace("{{iconY}}", logoObj.templatePath.icon.y);
				template = template.replace("{{iconScale}}", logoObj.templatePath.icon.scale);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);

				template = template.replace("{{iconFrameBoxX}}", logoObj.templatePath.iconFrameBox.x);
				template = template.replace("{{iconFrameBoxY}}", logoObj.templatePath.iconFrameBox.y);
				if (logoObj.templatePath.isIconFrame == 1) {
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBox.scale);
				} else {
					template = template.replace("{{iconFrameBoxScale}}", logoObj.templatePath.iconFrameBoxScale);
				}

			}
			if (logoObj.templatePath.isIconFrame == 1) {
				template = template.replace("{{iconFrameHtml}}", logoObj.iconFramePath);
				template = template.replace("{{iconFrameFill}}", logoObj.iconFrameColor);
				template = template.replace("{{iconFrameX}}", logoObj.templatePath.iconFrame.x);
				template = template.replace("{{iconFrameY}}", logoObj.templatePath.iconFrame.y);
				template = template.replace("{{iconFrameScale}}", logoObj.templatePath.iconFrame.scale);
			}

			if (logoObj.templatePath.isDBLineCompanyText == "yes") {
				template = template.replace("{{text1X}}", logoObj.templatePath.text1.x);
				template = template.replace("{{text1Y}}", logoObj.templatePath.text1.y);
				template = template.replace("{{text1Scale}}", logoObj.templatePath.text1.scale);

				template = template.replace("{{text2X}}", logoObj.templatePath.text2.x);
				template = template.replace("{{text2Y}}", logoObj.templatePath.text2.y);
				template = template.replace("{{text2Scale}}", logoObj.templatePath.text2.scale);
			} else {
				template = template.replace("{{textX}}", logoObj.templatePath.text.x);
				template = template.replace("{{textY}}", logoObj.templatePath.text.y);
				template = template.replace("{{textScale}}", logoObj.templatePath.text.scale);
			}

			template = template.replace("{{sloganX}}", logoObj.templatePath.slogan.x);
			template = template.replace("{{sloganY}}", logoObj.templatePath.slogan.y);
			template = template.replace("{{sloganScale}}", logoObj.templatePath.slogan.scale);

			template = template.replace("{{textAndSloganX}}", logoObj.templatePath.textAndSlogan.x);
			template = template.replace("{{textAndSloganY}}", logoObj.templatePath.textAndSlogan.y);
			template = template.replace("{{textAndSloganScale}}", logoObj.templatePath.textAndSlogan.scale);

			template = template.replace("{{containerBodyX}}", logoObj.templatePath.containerBody.x);
			template = template.replace("{{containerBodyY}}", logoObj.templatePath.containerBody.y);
			template = template.replace("{{containerBodyScale}}", logoObj.templatePath.containerBody.scale);

			template = template.replace("{{logoContainerX}}", logoObj.templatePath.logoContainer.x);
			template = template.replace("{{logoContainerY}}", logoObj.templatePath.logoContainer.y);
			template = template.replace("{{logoContainerScale}}", logoObj.templatePath.logoContainer.scale);

			template = template.replace("{{frameX}}", logoObj.templatePath.frame.x);
			template = template.replace("{{frameY}}", logoObj.templatePath.frame.y);
			template = template.replace("{{frameScale}}", logoObj.templatePath.frame.scale);

			$("#templateGenerator").html(template);

			template = $("#templateGenerator").html();
			$("#templateGenerator").html('');
			return { 'logoObj': logoObj, 'html': template };
		},
		/**
		 * 
		 * @param {*} p_bValue 
		 */
		showBlocker: function (p_bValue) {
			if (p_bValue) {
				$("#click_blocker").show();
			} else {
				$("#click_blocker").hide();
			}
		}
	}
	lEditor.getBestColorSchema(0);
});
/**
 * 
 */
function getTempStyle(p_sColor) {
	var templateIdStyle = "";
	p_sColor = (p_sColor) ? p_sColor : 'rgba(0,0,0,0.5)';
	if ((DH.DH_APP_MODE == 'STAGING') || (DH.DH_APP_MODE == 'DEVELOPMENT') || (DH.userId == dh_logomaker_admin_view) || sessionStorage.getItem("show_hint")) {
		templateIdStyle = 'background-color:' + p_sColor + ';position: absolute;color:cyan;top:0px;left:0px;z-index:9;font-size:9px;padding-left:5px;width:88%';
		if (sessionStorage.getItem("remove_hint")) {
			templateIdStyle = 'display:none';
		}
	} else {
		templateIdStyle = 'display:none';
	}
	return templateIdStyle;
}
/**
 * 
 */
function createTempHint() {
	if ((DH.userId == dh_logomaker_admin_view) && (DH.DH_APP_MODE != 'DEVELOPMENT')) {
		if ($(".editFinalLogo").hasClass("hidden")) {
			dh_editor_utility.forceConsoleAtStaging("no need to create createTempHint");
			return;
		}

		if ($("#finaLogoInnerTemplateHint").length) {
			$("#finaLogoInnerTemplateHint").hide().remove();
		}

		$("<div/>", {
			"id": "finaLogoInnerTemplateHint",
			"style": "position: absolute;width: 425px;height: 100px;top: 300px;left: 10px"
		}).appendTo($(".editFinalLogo"));
		var currLogo = dh_editor_utility.getValidJsonParseObj(sessionStorage.getItem('currentLogo'));
		var templateHint = dh_lm_common_utility.showLogoAdminIds(currLogo.generate.templatePath, currLogo.sloganName, currLogo.fId, currLogo.cpId, currLogo.sfId, currLogo.frmId, currLogo.iconFrameId, currLogo.monofId, true);
		var templateIdStyle = getTempStyle() + "padding:5px";

		$("#finaLogoInnerTemplateHint").html('<div style="' + templateIdStyle + '">' + templateHint + '</div>');
	}
	// Note-
	//In dh_config.inc we add this line define('DH_LOGOMAKER_ADMIN_VIEW_ID', 726324);
	// 726324 is user_id at localhost against mail rahul.verma@relesol.com
	//DH.userId == dh_logomaker_admin_view this condition check DH.userId == 726324
}
if (DH.DH_APP_MODE === 'PRODUCTION') {
	console.log(`%cGreetings from Designhill! 🖖
    Check us out https://www.designhill.com`, "color: #376BFB; font-size: 20px");
	console.log = function () { };
}