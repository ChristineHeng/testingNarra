//Fav=======================================//
function myFav() {
	$('.n_fav_off').click(function () {
		$(this).toggleClass('n_fav_off n_fav_on');
		$(this).find('i').toggleClass('icon-fi-n-fav-off icon-fi-n-fav-on');
	});
	$('.n_home_sports .fav').click(function () {
		$(this).toggleClass('n_fav_on');
		$(this).find('i').toggleClass('icon-fi-n-fav-on icon-fi-n-fav-off');
	});
}

$(document).ready(function () {
	//Global: Check browser =================================================//
	var userAgent = window.navigator.userAgent.toLowerCase(),
		safari = /safari/.test(userAgent),
		ios = /iphone|ipod|ipad/.test(userAgent);

	console.log('userAgent: ' + userAgent);

	if (ios) {
		if (safari) {
			//browser
		} else if (!safari) {
			//webview
			$('head').append('<link rel="stylesheet" href="../assets/public/layout/css/ios_apps.min.css" type="text/css" />');
		}
	}

	//[SFCRQ-2266] Fix for window height in iOS 15
	// const appHeight = () => {
	//     const doc = document.documentElement
	//     doc.style.setProperty('--app-height', `${window.innerHeight}px`)
	// }
	// window.addEventListener('resize', appHeight);
	// appHeight();

	// $("body").addClass("iFullH");

	//Event Listing start://
	myFav();
	// asian sev slider position
	var sevSlider = $('.DontCopy_test_sev_filter_menu');
	var sevSlider_Active = $('.DontCopy_test_sev_filter_menu .item_wrap.active');
	var sevSlider_Active_item = $('.DontCopy_test_sev_filter_menu .item_wrap.active .item');
	var pd_left = parseInt(sevSlider_Active_item.css('padding-left'));

	// Slider for Single And Combo Tab******copy from scripts_asia_pb.js
	$('.slider').not('.mr_slider .slider, .ob_menu_slider .slider').css('left', 0);

	$('.slider_wrap .tab_nav_item').on('click', function () {
		if (!$(this).hasClass('disabled')) {
			console.log('here?');
			$(this).siblings('.tab_nav_item').removeClass('active');
			$(this).addClass('active');
			var test_slider_position = $(this).offset().left;
			$('.slider').css('left', test_slider_position);
		}
	});

	$('#test1').click(function () {
		$(this).css('display', 'none');
		$('#test2').css('display', '');
	});
	//Event Listing ends//

	//[SFCRQ-3407][Kiron][Narra] 30 minute prompt out “Refresh” button
	$('.live_refresh .chan_btn').click(function () {
		$(this).parent().hide();
	});
	ob_listing_header_clicking();

	// $(".ob_listing_hdr").click(function () {
	//     const $wrapper = $(this).next(".ob_itm_wrp");
	//     const $icon = $(this).find("i");

	//     if (localStorage.getItem("isFacelift") == "true") {
	//         $icon.toggleClass("fl_rotate")
	//         $wrapper.slideToggle(function () {
	//             console.log("hihihi")

	//             if ($wrapper.is(":visible")) {
	//                 // 当前为展开状态，移除 rd_btm 类并将箭头改为向下
	//                 // $icon.removeClass("icon-fi-arrow-up1").addClass("icon-fi-arrow-down1");
	//                 $(this).prev(".ob_listing_hdr").removeClass("rd_btm");
	//             } else {
	//                 // 当前为折叠状态，添加 rd_btm 类并将箭头改为向上
	//                 // $icon.removeClass("icon-fi-arrow-down1").addClass("icon-fi-arrow-up1");
	//                 $(this).prev(".ob_listing_hdr").addClass("rd_btm");
	//             }
	//         }, 200);
	//     } else {
	//         // 切换 ob_itm_wrp 的显示状态，并在动画完成后执行操作
	//         console.log("beybyebye")
	//         $wrapper.slideToggle(function () {
	//             if ($wrapper.is(":visible")) {
	//                 // 当前为展开状态，移除 rd_btm 类并将箭头改为向下
	//                 $icon.removeClass("icon-fi-arrow-up1").addClass("icon-fi-arrow-down1");
	//                 $(this).prev(".ob_listing_hdr").removeClass("rd_btm");
	//             } else {
	//                 // 当前为折叠状态，添加 rd_btm 类并将箭头改为向上
	//                 $icon.removeClass("icon-fi-arrow-down1").addClass("icon-fi-arrow-up1");
	//                 $(this).prev(".ob_listing_hdr").addClass("rd_btm");
	//             }
	//         });
	//     }
	// });
});

const darkTheme = ['betway', 'dark1', 'dark2', 'default'];
const brightTheme = ['red', 'brown', 'green', 'blue', 'wellbet', 'xinli', 'bafa'];

// Switch Logo =======================================//
function merchantlogo() {
	theme_value = localStorage.getItem('theme');
	if (darkTheme.includes(theme_value)) {
		document.getElementById('logo').setAttribute('src', '../merchants/merchant1/images/logo.png');
	}
	if (brightTheme.includes(theme_value)) {
		document.getElementById('logo').setAttribute('src', '../merchants/merchant1/images/logo2.png');
	}
}
// Switch Themes =======================================//
if (sessionStorage.getItem('enterCyberBattle') === null) {
	sessionStorage.setItem('enterCyberBattle', 'false');
	localStorage.setItem('isCyberBattle', 'false');
}

function getExtraName(view) {
	let enterCyberBattle = sessionStorage.getItem('enterCyberBattle');

	// Ensure enterCyberBattle is not null or undefined before trimming
	if (enterCyberBattle !== null && enterCyberBattle !== undefined) {
		enterCyberBattle = enterCyberBattle.trim();
	} else {
		enterCyberBattle = 'false'; // Default value if not set
	}

	if (view === 'asia') {
		return enterCyberBattle === 'true' ? '_cyberbattle' : '_asia';
	} else if (view === 'cyber') {
		return '_cyber';
	} else if (view === 'euro') {
		return '_euro';
	} else if (view === 'cyberbattle') {
		return '_cyberbattle';
	}

	return '_asia'; // Default fallback
}

function switchThemes(view) {
	function applyTheme(theme_value, view) {
		let extra_name = getExtraName(view);
		localStorage.setItem('theme', theme_value);
		document.getElementById('design_view').setAttribute('href', '../assets/themes/colours/' + theme_value + '/theme' + extra_name + '.min.css');
	}

	$('.sample_themes_content .list, .ts_clr, .theme_dot').on('click', function () {
		let className = this.className.split(' ').find((c) => c.startsWith('theme_') && c !== 'theme_dot');
		let theme = className.replace('theme_', '');
		applyTheme(theme, view);
	});
}

// Switch Languages =======================================//
function languages(view) {
	function applyLanguage(language_code, view) {
		localStorage.setItem('language', language_code);
		let extra_name = getExtraName(view);
		document.getElementById('detect_language').setAttribute('href', '../assets/public/languages/' + language_code + '/layout' + extra_name + '.min.css');
	}

	$('.langEng')
		.off('click')
		.on('click', function () {
			applyLanguage('eng', view);
		});
	$('.langChs')
		.off('click')
		.on('click', function () {
			applyLanguage('chs', view);
		});
	$('.langHi')
		.off('click')
		.on('click', function () {
			applyLanguage('hi', view);
		});
	$('.langId')
		.off('click')
		.on('click', function () {
			applyLanguage('id', view);
		});
	$('.langKor')
		.off('click')
		.on('click', function () {
			applyLanguage('kor', view);
		});
	$('.langPt')
		.off('click')
		.on('click', function () {
			applyLanguage('pt', view);
		});
	$('.langTh')
		.off('click')
		.on('click', function () {
			applyLanguage('th', view);
		});
	$('.langVn')
		.off('click')
		.on('click', function () {
			applyLanguage('vn', view);
		});
	$('.langEs')
		.off('click')
		.on('click', function () {
			applyLanguage('es', view);
		});
	$('.langTr')
		.off('click')
		.on('click', function () {
			applyLanguage('tr', view);
		});
}

// Search ==============================================//
// Recent search==========================/
function recent_search() {
	$('.search_clear').on('click', function () {
		$(this).parent().hide();
		$('.recent_search_wrap').hide();
	});
	$('#sample_dont_copy_search_input_header, #sample_dont_copy_search_input_content').hide();
	$('.search_box_selectLeague').on('input', function () {
		$('#sample_dont_copy_search_input_header, #sample_dont_copy_search_input_content').show();
		$('.search_menu, .recent_search_wrap, .popular_search_wrap, .search_more_btn').hide();
		$('#sample_dont_copy_search_input_content .search_menu').show();
		searchPage_setting();
	});
	$('.search_box_selectLeague').on('keyup', function () {
		if ($('.search_box_selectLeague').val().length === 0) {
			// search_default();
		}
	});
	$('.clear_icon').on('click', function () {
		$('.search_box_selectLeague').val('');
		search_default();
	});
	function search_default() {
		$('#sample_demo_noresult').hide();
		$('#sample_dont_copy_search_input_header, #sample_dont_copy_search_input_content').hide();
		$('.search_menu, .recent_search_wrap, .popular_search_wrap, .search_more_btn').show();
		searchPage_setting();
	}

	$('.search_more_btn').on('click', function () {
		window.location.href = ' el-prof-popular.html';
	});
	searchPage_setting();
}

function searchPage_setting() {
	//demo sticky, dev please use dynamic value
	var searchpage_mainheader = $('.n_header_search').outerHeight();
	var searchHead_lvl1 = searchpage_mainheader + $('#sample_dont_copy_search_input_header').outerHeight();
	var searchHead_lvl2 = searchHead_lvl1 + $('.search_head').outerHeight();

	var searchHead_lvl2_asia = searchHead_lvl1 + 30;

	//Euro view
	$('#sample_dont_copy_search_input_header').css('top', searchpage_mainheader);
	$('.search_head').css('top', searchHead_lvl1);
	//$(".search_menu").css("top", searchHead_lvl2);

	if (localStorage.getItem('isCyberBattle') === 'true') {
		$('body:not(.euro) .search_menu').css('top', 40);
	} else {
		$('body:not(.euro) .search_menu').css('top', searchpage_mainheader);
		$('.search_menu').css('top', searchHead_lvl2);
	}

	//Asia view
	//note: if league container have diff height, cant use CSS sticky, please change to reactSticky for "league_title_list"
	$('.league_title_list').css('top', searchHead_lvl1);
}

// Results =============================================/
function CompletedRessule_opentimeline() {
	$('.link_to_goal_timeline').load('../html_public/_popup_results_completed_goal_timeline.html', function () {
		$('.link_to_goal_timeline').hide();

		$('.goal_timeline_icon, .demoOnlyStatisticPopup').on('click', function (ev) {
			$('.link_to_goal_timeline, .link_to_goal_timeline .popup_window').show();
			$('body').addClass('popupOn');
			scrolling_disable(document.getElementsByClassName('popup_fullpage')[0]);
		});

		$('.link_to_goal_timeline .close_icon').on('click', function (ev) {
			$('body').removeClass('popupOn');
			window.removeEventListener(
				'touchmove',
				(ev) => {
					$('.tab').html('xxx');
				},
				{ passive: false },
			);
			$('.link_to_goal_timeline').hide();
		});
	});
}

// SEV =================================================//
var sev_HTMLContent = '';
var haveSlider = true;

// scrollable Menu =================================================//
function scrollable_menu() {
	function scrollHorizontally(e) {
		e = window.event || e;
		var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
		document.getElementById('menu_scroll').scrollLeft -= delta * 40;
		e.preventDefault();
	}
	if (document.getElementById('menu_scroll').addEventListener) {
		// IE9, Chrome, Safari, Opera
		document.getElementById('menu_scroll').addEventListener('mousewheel', scrollHorizontally, false);
		// Firefox
		document.getElementById('menu_scroll').addEventListener('DOMMouseScroll', scrollHorizontally, false);
	} else {
		// IE 6/7/8
		document.getElementById('menu_scroll').attachEvent('onmousewheel', scrollHorizontally);
	}
	let el = document.querySelector('#menu_scroll');
	let x = 0,
		y = 0,
		top = 0,
		left = 0;
	let draggingFunction = (e) => {
		document.addEventListener('mouseup', () => {
			document.removeEventListener('mousemove', draggingFunction);
		});
		el.scrollLeft = left - e.pageX + x;
		el.scrollTop = top - e.pageY + y;
	};
	el.addEventListener('mousedown', (e) => {
		e.preventDefault();
		y = e.pageY;
		x = e.pageX;
		top = el.scrollTop;
		left = el.scrollLeft;
		document.addEventListener('mousemove', draggingFunction);
	});
}

function scrollable_olympics_menu(id) {
	function scrollHorizontally(e) {
		e = window.event || e;
		var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
		document.getElementById(id).scrollLeft -= delta * 40;
		e.preventDefault();
	}
	if (document.getElementById(id).addEventListener) {
		// IE9, Chrome, Safari, Opera
		document.getElementById(id).addEventListener('mousewheel', scrollHorizontally, false);
		// Firefox
		document.getElementById(id).addEventListener('DOMMouseScroll', scrollHorizontally, false);
	} else {
		// IE 6/7/8
		document.getElementById(id).attachEvent('onmousewheel', scrollHorizontally);
	}
	let el = document.querySelector('#' + id);
	let x = 0,
		y = 0,
		top = 0,
		left = 0;
	let draggingFunction = (e) => {
		document.addEventListener('mouseup', () => {
			document.removeEventListener('mousemove', draggingFunction);
		});
		el.scrollLeft = left - e.pageX + x;
		el.scrollTop = top - e.pageY + y;
	};
	el.addEventListener('mousedown', (e) => {
		e.preventDefault();
		y = e.pageY;
		x = e.pageX;
		top = el.scrollTop;
		left = el.scrollLeft;
		document.addEventListener('mousemove', draggingFunction);
	});
}

// Kiron Event Listing ============================//
function kironStreaming() {
	$('.n_info_msg').hide();
}

//Personalized Annoucement Project:shared==========================/
function personalized_annoucement_shared() {
	$('#sample_public_annoucement').hide();
	$('#sample2_public_annoucement').click(function () {
		$('#sample_public_annoucement').show();
		$('#sample_personalized_annoucement').hide();
	});
	$('#sample2_personalized_annoucement').click(function () {
		$('#sample_personalized_annoucement').show();
		$('#sample_public_annoucement').hide();
	});
	$('.tab_group .tab').click(function () {
		$('.tab_group .tab').removeClass('active');
		$(this).addClass('active');
	});

	let drag = false;
	var previous_x_position = 0;
	$('.personalized_annoucement_wrap').on('mousedown touchstart', function (e) {
		drag = false;
		touch = undefined;
		if (e.originalEvent.touches) {
			touch = e.originalEvent.touches[0];
		}
		previous_x_position = e.pageX == undefined ? touch.pageX : e.pageX;
	});
	$('.personalized_annoucement_wrap').on('mousemove touchmove', function (e) {
		drag = true;
		touch = undefined;
		if (e.originalEvent.touches) {
			touch = e.originalEvent.touches[0];
		}
	});
	$('.personalized_annoucement_wrap').on('mouseup touchend', function (e) {
		if (drag == true) {
			e.preventDefault();
			var x_position = e.pageX == undefined ? touch.pageX : e.pageX;

			console.log('x_position: ' + x_position);
			console.log('previous_x_position: ' + previous_x_position);
			if (previous_x_position < x_position) {
				$(this).removeClass('swipe_dlt');
			} else {
				$(this).siblings('.personalized_annoucement_wrap').removeClass('swipe_dlt');
				$(this).addClass('swipe_dlt');
			}
		} else {
			if (!$(this).hasClass('swipe_dlt')) {
				//window.location.href = "annoucements-personalized.html";
				console.log($('#myannouce_details').length);
				$('#myannouce_details').show();
			}
		}
	});
	$('.personalized_annoucement_wrap.highlighted').unbind('mousemove touchmove');
	$('.btn_dlt').on('click', function () {
		var thisItem = $(this).parent();
		thisItem.removeClass('swipe_dlt').addClass('swipe_dlt_complete animated_dlt');
		setTimeout(function () {
			thisItem.hide();
		}, 500);
	});
}
//Personalized Annoucement Project end==========================/
//DES-40 Recommended correct score: start
function betslip_rcd() {
	$('#sample_dont_copy_popup_rmd_bet').show();
	$('.popup_top_wrp').addClass('slideOut');
	$('.countdown_icn circle').addClass('animated');

	//var countdownNumber = document.getElementsByClassName("countdown_number")[0];
	//var countdown = 3;
	//countdownNumber.textContent = countdown;
	//setInterval(function () {
	//    countdown = --countdown <= 0 ? 3 : countdown;
	//    countdownNumber.textContent = countdown;
	//}, 1000);

	setTimeout(function () {
		$('.countdown_number').text('2');
	}, 1000);

	setTimeout(function () {
		$('.countdown_number').text('1');
	}, 2000);

	setTimeout(function () {
		$('.countdown_icn circle').removeClass('animated');
		$('.countdown_icn').hide();
		$('.popup_top_wrp')
			.removeClass('slideOut')
			.addClass('slideIn')
			.delay(300)
			.queue(function (next) {
				$('#sample_dont_copy_popup_rmd_bet').hide();
				$('.popup_top_wrp').removeClass('slideIn');
				next();
			});
	}, 3000);

	setTimeout(function () {
		$('.countdown_icn').show();
		$('.countdown_number').text('3');
	}, 3300);
}
//DES-40 Recommended correct score: end

//cyber sport
function Cyber_Sport() {
	/*Slider Select Effect*/
	var slider = $('.sm_slider');
	var slider_Active = $('.sm_slider .item_wrap.active');
	var slider_position = slider_Active.offset().left - slider.offset().left + slider.scrollLeft();
	$('.sm_slider .slider').css('left', slider_position);
	$('.sm_slider .slider').css('width', slider_Active.width());

	$('.sm_slider .item_wrap').click(function () {
		$('.sm_slider .item_wrap').removeClass('active');
		$(this).addClass('active');
		slider_position = $(this).offset().left - slider.offset().left + slider.scrollLeft();
		$('.sm_slider .slider').css('width', $(this).width());
		$('.sm_slider .slider').css('left', slider_position);
	});
}

//snooker
/* function cp_table_width() {
	var headerbgwidth = $(".demoOnlyDevDontcopy_header_width").parent().get(0).scrollWidth;
	$(".demoOnlyDevDontcopy_header_width").width(headerbgwidth);
	$(".demoOnlyDevDontcopy_table_split_line").width(headerbgwidth);
} */

// dark mode filter
function elFilterBar(theme) {
	var curTheme = localStorage.getItem('theme');

	if (curTheme == 'betway') {
		$('.theme_betway:not(.list)').show();
	} else if (curTheme !== 'betway') {
		$('.theme_betway:not(.list)').hide();
	}

	if (curTheme == 'wellbet') {
		$('.theme_wellbet:not(.list)').show();
	} else if (curTheme !== 'wellbet') {
		$('.theme_wellbet:not(.list)').hide();
	}

	if (darkTheme.includes(curTheme)) {
		$('.dnSlide input').prop('checked', true);
		$('.nightTheme').show();
		$('.dayTheme').hide();
		$('.dayTxt').hide();
		$('.nightTxt').show();
		$('.lbl').removeClass('text_end');
	}
	if (brightTheme.includes(curTheme)) {
		$('.dnSlide input').prop('checked', false);
		$('.nightTheme').hide();
		$('.dayTheme').show();
		$('.nightTxt').hide();
		$('.dayTxt').show();
		$('.lbl').addClass('text_end');
	}

	$('.theme_dot').empty();
	$('.ts_clr.theme_' + curTheme).html('<i class="icon-fi-ok"></i>');

	$('.dnSlide input').click(function () {
		$('.dayTheme').toggle();
		$('.nightTheme').toggle();
		$('.lbl').toggleClass('text_end');
		$('.lbl span').toggle();
	});

	var tickIndicator = '<i class="icon-fi-ok"></i>';
	switchThemes(theme);

	$('.theme_dot').click(function () {
		$('.theme_dot').empty();
		$(this).html(tickIndicator);

		if ($(this).attr('id') !== 'betway') {
			$('.theme_betway:not(.list)').hide();
		}

		if ($(this).attr('id') !== 'wellbet') {
			$('.theme_wellbet:not(.list)').hide();
		}
	});

	$('.filter_itm_wrp div').click(function () {
		if (!$(this).hasClass('filter_itm_t')) {
			$(this).parent().find('div').removeClass('active');
			$(this).addClass('active');
		}
	});
}

function ob_sort_eff(eventobj, displayobj) {
	$(eventobj).removeClass('active');
	$(displayobj).hide();


	$(eventobj).off('click').on('click', function () {
		$(this).toggleClass('active');
		$(displayobj).toggle();
	});
}

function ob_listing_header_clicking() {
	$('.ob_listing_hdr:not(.ob_listing_hdr_t2)')
		.off('click')
		.on('click', function () {
			const $wrapper = $(this).next('.ob_itm_wrp');
			const $icon = $(this).find('i');

			if (localStorage.getItem('isFacelift') == 'true') {
				if ($(this).hasClass('ob_el_hdr')) {
					$wrapper.slideToggle(200);
					$icon.toggleClass('fl_rotate');
					$(this).toggleClass('rd_btm');
				} else {
					$(this).next('.ob_wrp').slideToggle(200);
					$(this).find('.ob_listing_hdr_l i').toggleClass('fl_rotate');
				}
			} else {
				if ($wrapper.is(':visible')) {
					// when it's extended
					$wrapper.hide();
					$icon.removeClass('icon-fi-arrow-up1').addClass('icon-fi-arrow-down1');
					$(this).addClass('rd_btm');
				} else {
					$wrapper.show();
					$icon.removeClass('icon-fi-arrow-down1').addClass('icon-fi-arrow-up1');
					$(this).removeClass('rd_btm');
				}
			}
		});

	$('.ob_toggle')
		.off('click')
		.on('click', function () {
			const $wrapper = $('.ob_listing_hdr').next('.ob_itm_wrp');
			const $icon = $('.ob_listing_hdr').find('i');

			if (window.location.href.includes('/html_asia')) {
				$('.ob_toggle').find('i').toggleClass('fl_rotate');
				if ($('.ob_listing_hdr').hasClass('ob_el_hdr')) {
					$wrapper.slideToggle(200);
					$icon.toggleClass('fl_rotate');
					$('.ob_listing_hdr').toggleClass('rd_btm');
				} else {
					$('.ob_listing_hdr').next('.ob_wrp').slideToggle(200);
					$('.ob_listing_hdr').find('.ob_listing_hdr_l i').toggleClass('fl_rotate');
				}
			} else {
				$('.ob_toggle').find('i').toggleClass('icon-fi-arrow-up1 icon-fi-arrow-down1');
				if ($wrapper.is(':visible')) {
					// when it's extended
					$wrapper.hide();
					$icon.removeClass('icon-fi-arrow-up1').addClass('icon-fi-arrow-down1');
					$('.ob_listing_hdr').addClass('rd_btm');
				} else {
					$wrapper.show();
					$icon.removeClass('icon-fi-arrow-down1').addClass('icon-fi-arrow-up1');
					$('.ob_listing_hdr').removeClass('rd_btm');
				}
			}
		});
}

function rememberLastStake() {
	$('.pb_rmb_ls_l i').click(function () {
		//only asia and cyber to add class pb_rmb_ls_t
		$('.n_footer.pb_footer').addClass('pb_rmb_ls_t');
	});
}

const stakeMultiplier = () => {
	$('.stk_multiplier')
		.on('mousedown touchstart', function (e) {
			$this = $(this);
			e.stopPropagation();
			if ($this.hasClass('disabled')) {
				return;
			} else {
				timeoutid = setTimeout(function () {
					$this.addClass('active');
				}, 0);
				$(this).addClass('active');
			}
		})
		.on('mouseup touchend', function (e) {
			e.stopPropagation();
			$this = $(this);
			clearTimeout(timeoutid);
			timeoutid = setTimeout($this.removeClass('active'), 300);
			clearTimeout(timeoutid);
		});
};

function triggerRls() {
	$('#triggerRls').click(function () {
		$('#rememberLastStakePopup').show();
	});

	$('#rememberLastStakePopup .btn, #rememberLastStakePopup i').click(function () {
		$('#rememberLastStakePopup').hide();
	});
}

function cyberChangeTheme() {
	var theme_value = localStorage.getItem('theme');
	if (theme_value == 'red' || theme_value == 'blue' || theme_value == 'green' || theme_value == 'brown' || theme_value == 'bafa' || theme_value == 'wellbet' || theme_value == 'xinli') {
		$('.fl_menu_i img').each(function () {
			var src = $(this).attr('src');
			if (src.includes('_bright')) {
				$(this).attr('src', src.replace('_bright', '_dark'));
			}
		});
	} else {
		$('.fl_menu_i img').each(function () {
			var src = $(this).attr('src');
			if (src.includes('_dark')) {
				$(this).attr('src', src.replace('_dark', '_bright'));
			}
		});
	}
}

// Trigger SEV Cricket Live Scoreboard
function hideCricket() {
	$('#sample_tw, #sample_tw_pin, .euSev_header').removeClass('rpo');
	$('.demo_sev_cricket_live').hide();
	$('.demo_sev_cricket_liveMore').hide();
	$('.demo_sev_cricket_liveScroll').hide();
}

// Odds Color Setting
if (sessionStorage.getItem('oddsColorValue') === null) {
	sessionStorage.setItem('oddsColorValue', 'gURD');
}

function detectOddsColor() {
	var oddsColorValue = sessionStorage.getItem('oddsColorValue');
	var isGreenUpRedDown = oddsColorValue !== 'rUGD';
	var selectedText = isGreenUpRedDown ? 'Green Up / Red Down' : 'Red Up / Green Down';

	$('.demoOnlyDevDontCopy_greenUpRedDown, .demoOnlyDevDontCopy_redUpGreenDown').removeClass('active');
	$('#sample_fltr_odds_color').text(selectedText);
	$('#fltr_odds_color').val(selectedText);

	if (isGreenUpRedDown) {
		$('body').removeClass('odds_reversed');
		$('.demoOnlyDevDontCopy_greenUpRedDown').addClass('active');
		$('.selectbox_title > .odds_arrow_grp i:first-child').removeClass('odds-down').addClass('odds-up');
		$('.selectbox_title > .odds_arrow_grp i:last-child').removeClass('odds-up').addClass('odds-down');
	} else {
		$('body').addClass('odds_reversed');
		$('.demoOnlyDevDontCopy_redUpGreenDown').addClass('active');
		$('.selectbox_title > .odds_arrow_grp i:first-child').removeClass('odds-up').addClass('odds-down');
		$('.selectbox_title > .odds_arrow_grp i:last-child').removeClass('odds-down').addClass('odds-up');
	}
}
function oddsColor() {
	function hideOddsColorPopup($target) {
		var $popup = $target.closest('.ob_st_popup');
		if ($popup.length) {
			$popup.hide();
			$popup.closest('.selectbox_title').children('i').removeClass('fl_rotate');
		}
	}

	$('.demoOnlyDevDontCopy_greenUpRedDown')
		.off('click.oddsColor')
		.on('click.oddsColor', function (e) {
			e.stopPropagation();
			sessionStorage.setItem('oddsColorValue', 'gURD');
			detectOddsColor();
			hideOddsColorPopup($(this));
		});
	$('.demoOnlyDevDontCopy_redUpGreenDown')
		.off('click.oddsColor')
		.on('click.oddsColor', function (e) {
			e.stopPropagation();
			sessionStorage.setItem('oddsColorValue', 'rUGD');
			detectOddsColor();
			hideOddsColorPopup($(this));
		});
	$('#fltr_odds_color')
		.off('change.oddsColor')
		.on('change.oddsColor', function () {
			sessionStorage.setItem('oddsColorValue', $(this).val() === 'Red Up / Green Down' ? 'rUGD' : 'gURD');
			detectOddsColor();
		});
	detectOddsColor();
}

function movePinToPinnedPosition($currentWrapper, $lastPinned, $container, moveWrapper) {
	const currentIndex = $currentWrapper.index();
	const lastPinnedIndex = $lastPinned.index();

	if ($lastPinned.length) {
		if (currentIndex !== lastPinnedIndex + 1) {
			moveWrapper(() => $currentWrapper.insertAfter($lastPinned));
		}
	} else if (currentIndex > 0) {
		moveWrapper(() => $container.prepend($currentWrapper));
	}
}

function pinClick(wrapperclass, containerclass) {
	$(wrapperclass + ' .icon-fi-pin').click(function () {
		const $pin = $(this);
		const $currentWrapper = $pin.closest(wrapperclass);
		const $container = $pin.closest(containerclass);
		const $lastPinned = $container.find('.icon-fi-pin.active').closest(wrapperclass).last();
		const currentIndex = $currentWrapper.index();
		const lastPinnedIndex = $lastPinned.index();
		const isNowActive = !$pin.hasClass('active');

		const moveWrapper = (target) => {
			$currentWrapper.slideUp(200, function () {
				target();
				$currentWrapper.slideDown(200);
			});
		};

		if (isNowActive) {
			movePinToPinnedPosition($currentWrapper, $lastPinned, $container, moveWrapper);
		} else if (currentIndex !== lastPinnedIndex) {
			moveWrapper(() => $currentWrapper.insertAfter($lastPinned));
		}
		$pin.toggleClass('active');
	});
}

function pinClickToPinned(wrapperclass, containerclass, pinnedWrapperclass, pinnedListSelector) {
	const pinSelector = wrapperclass + ' .icon-fi-pin, [data-clone-header] .icon-fi-pin';
	if (!pinnedWrapperclass) {
		return;
	}
	$(pinSelector).off('click');
	$(containerclass)
		.off('click.pinClickToPinned', pinSelector)
		.on('click.pinClickToPinned', pinSelector, function () {
			const $pin = $(this);
			const $headerClone = $pin.closest('[data-clone-header]');
			const $eventWrap = $pin.closest(wrapperclass);
			const cloneId = $eventWrap.attr('data-clone');
			const headerCloneId = $headerClone.attr('data-clone-header');
			const originalId = headerCloneId || cloneId || $eventWrap.data('id');
			const $container = $pin.closest(containerclass);
			const $pinnedWrap = $container.find(pinnedWrapperclass).first();
			let $pinnedList = pinnedListSelector ? $pinnedWrap.children(pinnedListSelector).first() : $pinnedWrap.children('.fl_event_live_wrp, .el_content_wrp').first();
			if (!$pinnedList.length) {
				$pinnedList = pinnedListSelector ? $pinnedWrap.nextAll(pinnedListSelector).first() : $pinnedWrap.nextAll('.fl_event_live_wrp, .el_content_wrp').first();
			}
			const splitPinnedHeader = ($pinnedWrap.hasClass('fl_el_h') && $pinnedWrap.hasClass('pinned')) || $pinnedWrap.is('#mock_demo_pinned_competition_euro');
			const pinnedHeaderSelector = $pinnedWrap.is('#mock_demo_pinned_competition_euro') ? '.el_grp_header' : '.fl_comp_h';
			if (splitPinnedHeader) {
				$pinnedList.css('display', 'contents');
			}

			if (!$pinnedWrap.length || !$pinnedList.length || !originalId) {
				return;
			}

			const triggerPinnedUpdate = () => {
				$(document).trigger('pinClickToPinned:update');
				setTimeout(() => $(document).trigger('pinClickToPinned:update'), 60);
				setTimeout(() => $(document).trigger('pinClickToPinned:update'), 220);
			};
			const updatePinnedCount = () => {
				$pinnedWrap.find('.comp_count').first().text($pinnedList.children(wrapperclass).length);
				triggerPinnedUpdate();
			};
			const $original = $container.find(`${wrapperclass}[data-id="${originalId}"]`).not('[data-clone]').first();

			if (headerCloneId || cloneId) {
				const $removeHeader = $pinnedList.find(`[data-clone-header="${originalId}"]`);
				const $removeContent = $pinnedList.find(`${wrapperclass}[data-clone="${originalId}"]`);
				$removeHeader.add($removeContent).slideUp(200, function () {
					$(this).remove();
					$original.find('.icon-fi-pin').removeClass('active');
					updatePinnedCount();
				});
				return;
			}

			if ($pin.hasClass('active')) {
				const $cloneToRemove = $pinnedList.find(`${wrapperclass}[data-clone="${originalId}"]`);
				const $headerToRemove = $pinnedList.find(`[data-clone-header="${originalId}"]`);
				$headerToRemove.add($cloneToRemove).slideUp(200, function () {
					$(this).remove();
					updatePinnedCount();
				});
				$pin.removeClass('active');
				return;
			}

			const $clone = $eventWrap.clone(true, true);
			$clone.attr('data-clone', originalId);
			$clone.find('.icon-fi-pin').addClass('active');
			if (splitPinnedHeader) {
				const $pinnedHeaderClone = $clone.children(pinnedHeaderSelector).first().clone(true, true);
				$pinnedHeaderClone.attr('data-clone-header', originalId).addClass('pinned_comp_header');
				$pinnedHeaderClone.find('.icon-fi-pin').addClass('active');
				$pinnedHeaderClone.off('click').on('click.pinHeaderClone', function (e) {
					if (e.target.classList.contains('icon-fi-pin')) {
						return;
					}
					const $contentClone = $(this).next(`${wrapperclass}[data-clone="${originalId}"]`);
					$(this).find('.icon-fi-arrow-up1').toggleClass('fl_rotate');
					if ($pinnedWrap.is('#mock_demo_pinned_competition_euro')) {
						$contentClone.find('.bet_type_wrp, .el_grp_wrp').slideToggle(200);
					} else {
						$contentClone.find('.fl_evnt_grp, .fl_nav, .fl_score_rw, .fl_mt_wrp, .fl_tips, .fl_tub').slideToggle(200);
					}
					triggerPinnedUpdate();
				});
				$clone.children(pinnedHeaderSelector).first().remove();
				$pinnedList.append($pinnedHeaderClone);
			}
			$pinnedList.append($clone);
			$clone.css({
				overflow: '',
				height: '',
				paddingTop: '',
				paddingBottom: '',
				marginTop: '',
				marginBottom: '',
			});
			$pin.addClass('active');
			updatePinnedCount();
		});
}

function pinClone(wrapperclass, containerclass, pinnedclass, nextclass, iseuro = false) {
	$(wrapperclass + ' .icon-fi-pin').click(function () {
		const eventWrap = $(this).closest(wrapperclass);
		const originalId = eventWrap.data('id');
		const $targetLiveWrap = $(this).closest(containerclass).find(pinnedclass).nextAll(nextclass).first();
		if ($(this).hasClass('active')) {
			const $clone = eventWrap.clone(true, true);
			$clone.attr('data-clone', originalId);
			$targetLiveWrap.append($clone);
			$clone.css({
				overflow: '',
				height: '',
				paddingTop: '',
				paddingBottom: '',
				marginTop: '',
				marginBottom: '',
			});
		} else {
			const $original = $(`[data-id="${originalId}"]`);
			if (eventWrap.attr('data-clone')) {
				const $originalPin = $original.find('.icon-fi-pin');
				eventWrap.slideUp(200, function () {
					$(this).remove();
					$originalPin.trigger('click');
				});
			} else {
				const $cloneToRemove = $targetLiveWrap.find(`[data-clone="${originalId}"]`);
				$cloneToRemove.slideUp(200, function () {
					$(this).remove();
				});
			}
		}
		if (iseuro) {
			if ($('#mock_demo_pinned_competition_euro').nextAll('.el_content_wrp').first().children('.el_items').length > 0) {
				$('#mock_demo_pinned_competition_euro_header').show();
			} else {
				$('#mock_demo_pinned_competition_euro_header').hide();
			}
		}
	});
}

/*chatbot*/
$(document).ready(function () {
	const fileName = window.location.pathname.split('/').pop().toLowerCase();
	const isCyberBattleView = fileName.includes('cyberbattle') || sessionStorage.getItem('enterCyberBattle') === 'true' || localStorage.getItem('isCyberBattle') === 'true';
	const shouldShow = (fileName.includes('el') || fileName.includes('popular')) && !isCyberBattleView;

	const interval = setInterval(function () {
		const $chat = $('.uncle_boris');
		if ($chat.length > 0) {
			if (shouldShow) {
				$chat
					.removeClass('hide')
					.show()
					.load('_chatbot.html', function () {
						const $viewportMeta = $("meta[name='viewport']");
						if ($viewportMeta.length) {
							let content = $viewportMeta.attr('content');
							if (!content.includes('interactive-widget=resizes-content')) {
								content += ', interactive-widget=resizes-content';
								$viewportMeta.attr('content', content);
							}
						}
					});
			} else {
				$chat.empty().hide();
				$('#demoOnlyUncleBorisError').hide();
			}
			clearInterval(interval);
		}
	}, 100);
});

function liveScoreDetails() {
	$('.score_det')
		.find('.n_indicator')
		.click(function () {
			$(this).addClass('active');
		});
}

// results carousel
// const imgSrcArray = []
// function vanillaShowCarousel() {
// 	$("#demoPopUpOnlyDevDontCopy, #demoPopupNoImg").off("click").on("click", function () {
// 		const isEuro = localStorage.getItem("isswitchedtoeuro") === "true"
// 		const isAsia = localStorage.getItem("isswitchedtoasia") === "true"
// 		$(document.documentElement)
// 			.css("--windowH", $(window).height() + "px");

// 		const btn = $(this).attr('id')

// 		$("#demoOnly_results_pop_carousel").load("../html_public/_results_carousel.html", function () {
// 			$(this).show();
// 			$(".carousel").show();
// 			resCloseCarousel();

// 			if(btn === "demoPopupNoImg") {
// 				// console.log()
// 				// console.log("this")
// 				$(".msg_wrap").show();
// 				$(".carousel_window_wrp, .carousel_list_wrp").hide();
// 			} else if (btn === "demoPopUpOnlyDevDontCopy") {

// 				imgSrcArray.length = 0

// 				// create random dummy data if click on view all
// 				const currentLength = imgSrcArray.length
// 				const randomInt = Math.floor(Math.random() * (16 - 5 + 1) + 5)

// 				$(this).addClass("active");
// 				for (let j = 1; j < randomInt; j++) {
// 					imgSrcArray.push({
// 						"imgSrc": "../assets/public/layout/images/results_ss/screenshot.png",
// 						"index": currentLength + j,
// 						"isSelected": j === 1 ? true : false
// 					})
// 				}

// 				const carouselImgElement = imgSrcArray.map((src) => `<div class="carousel_img_itm ${src.isSelected ? "active" : ""}" id=${"s" + src.index}><img src=${src.imgSrc}></img></div>`)
// 				const carouselListElement = imgSrcArray.map((src) => `<div class="carousel_list_itm ${src.isSelected ? "active" : ""}" id=${src.index}><img src=${src.imgSrc}><i class="icon-fi-view"></i></div>`)

// 				// $(".carousel_list").html(carouselListElement)
// 				// $(".carousel_img_slider").html(carouselImgElement)
// 				$(".carousel_list").html(carouselListElement.join(''));
// 				$(".carousel_img_track").html(carouselImgElement.join(''));

// 				$(".carousel_list")[0].scrollWidth > $(".carousel_list_outer").outerWidth() ? $(".carousel_list").addClass("overflow") : $(".carousel_list").removeClass("overflow")
// 				resScrollImgListtoActive()
// 				resShowCurrentbyThumbnails()
// 				resToggleToSelectedImg()
// 				resToggleText()
// 				resHandlePrevNext()
// 			}

// 		})
// 		// listSliderScroll($(".carousel_list"))
// 	})
// }

// function resToggleToSelectedImg() {
// 	$(".carousel_list").off('click').on('click', '.carousel_list_itm', function (e) {
// 		e.preventDefault()
// 		$(this).addClass("active").siblings().removeClass("active")

// 		const newImgObjArr = imgSrcArray.map((obj) => {
// 			return obj.index === ($(".carousel_list_itm.active").index() + 1)
// 				? { ...obj, isSelected: true }
// 				: { ...obj, isSelected: false }
// 		})

// 		imgSrcArray.length = 0
// 		imgSrcArray.push.apply(imgSrcArray, newImgObjArr)

// 		resShowImg($(this))
// 	}).on('dragstart', (e) => e.preventDefault())
// }

// function resShowImg(curActiveIdx) {
// 	if (curActiveIdx.attr("id") != imgSrcArray.map((obj) => obj.isSelected ? obj.index : '')) {
// 		$(".carousel_img_itm").removeClass("active")
// 		$(`#s${curActiveIdx.attr("id")}`).addClass("active")

// 		resShowCurrentbyThumbnails()
// 	}
// 	resToggleText()
// 	resScrollImgListtoActive()
// }

// function resToggleText() {
// 	let currentImg = imgSrcArray.map((src) => src.isSelected ? src.index : "")

// 	$(".carousel_pg_total").html(`Photo by ${imgSrcArray.length}`)
// 	$(".carousel_pg_count").html(`${currentImg.filter(n => n)} of ${imgSrcArray.length}`)
// }

// function resShowCurrentbyThumbnails() {
// 	const $active = $(".carousel_img_itm.active");
// 	const $track = $(".carousel_img_track");
// 	const $viewport = $(".carousel_img_wrp");

// 	if (!$active.length) { resCheckBtnStat(); return; }

// 	const viewportW = $viewport.innerWidth();
// 	const itemLeft = $active[0].offsetLeft;
// 	const itemW = $active.outerWidth(true);

// 	let target = itemLeft - (viewportW - itemW) * 0.5;

// 	const max = Math.max(0, $track[0].scrollWidth - viewportW);
// 	target = Math.min(Math.max(0, target), max);

// 	$track.css("transform", `translateX(${-target}px)`);

// 	resCheckBtnStat();
// }

// function resCloseCarousel() {
// 	$(".carousel_wrp").click(function (e) {
// 		e.stopPropagation();
// 	})

// 	$(".carousel, .carousel_close > *").on('click', function () {
// 		const isEuro = localStorage.getItem("isswitchedtoeuro") === "true"
// 		$(".carousel").hide()
// 		isEuro && $("#demoOnly_results_pop_carousel").hide();
// 		$(".carousel_img_slider").html("")
// 		$(".carousel_list").html("")
// 		$(".carousel_pg_total").html("")
// 		$(".carousel_pg_count").html("")
// 	})
// }

// function resHandlePrevNext() {
// 	// click nav
// 	$(".carousel_nav").off("click").on("click", function () {
// 		const dir = $(this).hasClass("prev")
// 			? "left"
// 			: "right"

// 		resSlideToImage(dir)
// 	})

// 	// drag slider
// 	let startX = 0
// 	let isDragging = false
// 	$(".carousel_img_itm").on('dragstart', (e) => e.preventDefault())

// 	$(".carousel_img_slider").off("mousedown touchstart").on("mousedown touchstart", function (e) {
// 		isDragging = true
// 		startX = e.pageX || e.originalEvent.touches[0].pageX
// 	})

// 	$(".carousel_img_slider").on("mouseup touchend", function (e) {
// 		if (!isDragging) return
// 		isDragging = false

// 		const endX = e.pageX || e.changedTouches[0].pageX

// 		const dragDirection = endX - startX
// 		if (dragDirection > 50) {
// 			resSlideToImage("left")
// 		} else if (dragDirection < -50) {
// 			resSlideToImage("right")
// 		}
// 	})

// 	$(".carousel_img_slider").on("mousemove touchmove", function (e) {
// 		if (!isDragging) return

// 		e.preventDefault()
// 	})
// }

// function resScrollImgListtoActive() {
// 	let $slider = $(".carousel_list")
// 	let $curActive = $(".carousel_list_itm.active")

// 	let scrollDistoActive = $curActive.position().left + $slider.scrollLeft() - (($slider.width() - $curActive.outerWidth(true)) * 0.5) - ($slider.parent().outerWidth(true) - $slider.parent().width())

// 	if ($slider.hasClass("overflow"))
// 		$slider.animate({
// 			scrollLeft: scrollDistoActive
// 		})
// }

// function resCheckBtnStat() {
// 	let cur = imgSrcArray.find((itm) => itm.isSelected === true)

// 	if (cur.index === 1) {
// 		if (cur.index === 1 && imgSrcArray.length === 1) {
// 			$(".carousel_nav").addClass("disabled")
// 		} else {
// 			$(".carousel_nav.prev").addClass("disabled")
// 			$(".carousel_nav.next").removeClass("disabled")
// 		}
// 	} else if (cur.index === imgSrcArray.length) {
// 		$(".carousel_nav.next").addClass("disabled")
// 		$(".carousel_nav.prev").removeClass("disabled")
// 	} else {
// 		$(".carousel_nav.prev").removeClass("disabled")
// 		$(".carousel_nav.next").removeClass("disabled")
// 	}
// }

// function resSlideToImage(dir) {
// 	let $imgItm = $(".carousel_list_itm")
// 	let $curImg = $(".carousel_list_itm.active")
// 	let prevIdx = $curImg.index() - 1
// 	let nextIdx = $curImg.index() + 1

// 	if (dir === "left" && prevIdx < 0) return
// 	if (dir === "right" && nextIdx >= imgSrcArray.length) return

// 	let newIdx = dir === "left" ? prevIdx : nextIdx

// 	$imgItm.removeClass("active")
// 	$imgItm.eq(newIdx).addClass("active")

// 	const updatedImgObjArr = imgSrcArray.map((obj) => {
// 		return obj.index === newIdx + 1
// 			? { ...obj, isSelected: true }
// 			: { ...obj, isSelected: false }
// 	})

// 	imgSrcArray.length = 0
// 	imgSrcArray.push.apply(imgSrcArray, updatedImgObjArr)

// 	resShowImg($imgItm.eq(newIdx))
// }

let currentStep = 1;
function classicRetirementNotice() {
	$('#demo_retirement_notice').click(function () {
		$('#popup_retirement_notice').show();
	});
	$('#popup_retirement_notice_close').click(function () {
		$('#popup_retirement_notice').hide();
	});
	$('#popup_retirement_notice_switch').click(function () {
		$('#popup_retirement_notice').hide();
		sessionStorage.setItem('enterClassicRetirementTut', 'true');
		window.location.href = '../html_asia/index.html';
	});
	if (sessionStorage.getItem('enterClassicRetirementTut') === null) {
		sessionStorage.setItem('enterClassicRetirementTut', 'false');
	}
	$('.cr_wrp_close').click(function () {
		sessionStorage.setItem('enterClassicRetirementTut', 'false');
		$('.cr_outer_wrp').hide();
		$('body').removeClass('popupOn');
	});
	$('#classic_retirement_trigger').click(function () {
		currentStep = 1;
		renderStep();
		sessionStorage.setItem('enterClassicRetirementTut', 'true');
		$('.cr_outer_wrp').show();
		$('body').addClass('popupOn');
	});
	$('.cr_wrp_btn_nx').click(function () {
		if (currentStep < steps.length) {
			currentStep++;
			renderStep();
		} else {
			$('.cr_outer_wrp').hide();
			sessionStorage.setItem('enterClassicRetirementTut', 'false');
		}
	});
	$('.cr_wrp_btn_prev').click(function () {
		if (currentStep > 1) {
			currentStep--;
			renderStep();
		}
	});
}

const steps = [
	{
		ttl: 'Selecione seu esporte para começar',
		text: 'Trang chính giúp bạn truy cập nhanh vào tất cả các môn thể thao có sẵn. Duyệt và bắt đầu khám phá các trận đấu ngay lập tức.',
	},
	{
		ttl: 'Mira todos los eventos en vivo y venideros',
		text: 'Consulta todos los eventos próximos y en directo y las apuestas con cuotas y mercados claros.',
	},
	{
		ttl: '경기 내용을 더 깊게 확인하세요',
		text: 'Mira los resultados en vivo, estadísticas y los marcadores de apuestas del partido.',
	},
	{
		ttl: 'Gerencie seu bilhete de aposta com facilidade',
		text: 'Consulta tus pronósticos, establece la cantidad y realiza tu apuesta con solo unos clics.',
	},
];

function renderStep() {
	if (sessionStorage.getItem('enterClassicRetirementTut') === 'false') {
		$('.cr_outer_wrp').hide();
		$('body').removeClass('popupOn');
	} else {
		$('.cr_outer_wrp').show();
		$('body').addClass('popupOn');
	}
	$('.cr_wrp_ttl').html(steps[currentStep - 1].ttl);
	$('.cr_wrp_t').html(steps[currentStep - 1].text);
	$('.cr_wrp_img img').attr('src', '../assets/public/layout/images/classic_retirement/' + localStorage.getItem('language') + '/cr' + currentStep + '.png');
	if (currentStep === 1) {
		$('.cr_wrp_btn_prev').hide();
	} else {
		$('.cr_wrp_btn_prev').show();
	}
	if (currentStep === 4) {
		$('.cr_wrp_btn_nx').html('Finish');
		$('.cr_wrp_btn_prev').hide();
		$('body').removeClass('popupOn');
	} else {
		$('.cr_wrp_btn_nx').html('Next');
	}
}

/*standardize popup and tooltip: start*/
function infoPop(parentSelector) {
	if (typeof parentSelector !== 'string') return;

	parentSelector = parentSelector.trim();
	if (!parentSelector.length) return;

	if (!infoPop.parentSelectors) {
		infoPop.parentSelectors = [];
	}

	if (infoPop.parentSelectors.indexOf(parentSelector) === -1) {
		infoPop.parentSelectors.push(parentSelector);
	}

	var clickSelector = parentSelector + ' .info_wrp';

	var infoClickHandler = function (e) {
		e.stopPropagation();

		var el = $(this);
		var container = el.closest(parentSelector);
		if (!container.length) return;

		var infoTxt = el.find('.info_txt').first();
		var isActive = el.hasClass('active');

		// Reset all
		container.find('.info_wrp').removeClass('active');
		container.find('.info_txt').removeClass('left right');

		// Toggle off if already active OR no content
		if (isActive || !infoTxt.length) return;

		el.addClass('active');

		// Reset position classes
		infoTxt.removeClass('left right');

		// ✅ NEW: Respect explicit direction (same as hover logic)
		if (el.hasClass('info_left') || el.hasClass('info_right')) {
			return;
		}

		// Auto position only for top / bottom tooltip variants
		if (!el.hasClass('info_top') && !el.hasClass('info_bottom')) return;

		var containerRect = container[0].getBoundingClientRect();
		var iconRect = el[0].getBoundingClientRect();
		var containerMidX = containerRect.left + containerRect.width / 2;
		var iconMidX = iconRect.left + iconRect.width / 2;

		if (iconMidX > containerMidX) {
			infoTxt.addClass('right');
		} else {
			infoTxt.addClass('left');
		}
	};

	// Delegated binding (safe for dynamic content)
	$(document).off('click.infoPop', clickSelector).on('click.infoPop', clickSelector, infoClickHandler);

	// Bind closer in DOM for better priority
	$(parentSelector).off('click.infoPop', '.info_wrp').on('click.infoPop', '.info_wrp', infoClickHandler);

	// Bind outside click once
	if (infoPop.outsideBound) return;
	infoPop.outsideBound = true;

	$(document)
		.off('click.infoPopOutside')
		.on('click.infoPopOutside', function (e) {
			if ($(e.target).closest('.info_wrp').length) return;

			var selectors = infoPop.parentSelectors.join(', ');
			if (!selectors.length) return;

			$(selectors).find('.info_wrp').removeClass('active');
			$(selectors).find('.info_txt').removeClass('left right');
		});

	if (!infoPop.scrollBound) {
		infoPop.scrollBound = true;
		if (window.location.href.includes('/html_asia')) {
			$('#root > .n_container').off('scroll.infoPopScroll').on('scroll.infoPopScroll', closeCompletedResultInfo);
		}
		//christine check
		if (window.location.href.includes('/html_euro')) {
			$('#completedresults').off('scroll.infoPopScroll').on('scroll.infoPopScroll', closeCompletedResultInfo);
		}
	}

	function closeCompletedResultInfo() {
		if (infoPop.parentSelectors.indexOf('.completedresult_item') === -1) return;
		$('.completedresult_item').find('.info_wrp').removeClass('active');
		$('.completedresult_item').find('.info_txt').removeClass('left right');
	}
}
/*standardize popup and tooltip: end*/

function dayNightTheme(themeSet) {
	var themeSel = localStorage.getItem('theme');

	if (darkTheme.includes(themeSel)) showNight();
	if (brightTheme.includes(themeSel)) showDay();

	$('.lm2_dn_dot').addClass('theme_' + themeSel);
	$('.ts_clr').each(function () {
		let themeClass = this.className.split(' ').find((c) => c.startsWith('theme_') && c !== 'theme_dot');
		let theme = themeClass.replace('theme_', '');
		if (theme === themeSel) {
			$(this).addClass('active');
			if ($(this).find('i.icon-fi-tick').length === 0) {
				$(this).append('<i class="icon-fi-tick"></i>');
			}
		} else {
			$(this).removeClass('active');
			$(this).find('i.icon-fi-tick').remove();
		}
	});

	$('#mock_day').on('click', showDay);
	$('#mock_night').on('click', showNight);

	$(document).on('click', '.ts_clr', function () {
		let className = this.className.split(' ').find((c) => c.startsWith('theme_') && c !== 'theme_dot');
		$('.lm2_dn_dot').removeClass(function (index, className) {
			return (className.match(/(^|\s)theme_\S+/g) || []).join(' ');
		});
		$('.lm2_dn_dot').addClass(className);
		$('.ts_clr').empty().removeClass('active');
		$(this).html('<i class="icon-fi-tick"></i>').addClass('active');
	});

	function showDay() {
		$('#mock_day').addClass('icon-fi-sun-filled').removeClass('icon-fi-sun');
		$('#mock_night').addClass('icon-fi-moon').removeClass('icon-fi-moon-filled');
		$('#mock_day_style').show();
		$('#mock_night_style').hide();
	}

	function showNight() {
		$('#mock_night').addClass('icon-fi-moon-filled').removeClass('icon-fi-moon');
		$('#mock_day').addClass('icon-fi-sun').removeClass('icon-fi-sun-filled');
		$('#mock_night_style').show();
		$('#mock_day_style').hide();
	}
	switchThemes(themeSet);
}

// carousel
const imgSrcArr = [];
let mainSwiper = null;
let thumbsSwiper = null;

function setWindowHeightVar() {
	document.documentElement.style.setProperty('--windowH', `${window.innerHeight}px`);
}

async function loadHtmlInto(mountEl, url) {
	const res = await fetch(url, { cache: 'no-store' });
	if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
	mountEl.innerHTML = await res.text();
}

function destroySwipers() {
	if (mainSwiper) {
		mainSwiper.destroy(true, true);
		mainSwiper = null;
	}
	if (thumbsSwiper) {
		thumbsSwiper.destroy(true, true);
		thumbsSwiper = null;
	}
}

function buildRandomDummyImages() {
	imgSrcArr.length = 0;

	const randomInt = Math.floor(Math.random() * (16 - 5 + 1) + 5);
	for (let j = 1; j < randomInt; j++) {
		imgSrcArr.push({
			imgSrc: '../assets/public/layout/images/results_ss/screenshot.png',
			index: j,
			isSelected: j === 1,
		});
	}
}

function renderSlides(popRoot, items) {
	const trackEl = popRoot.querySelector('.carousel_img_track');
	const thumbsEl = popRoot.querySelector('.carousel_list');
	if (!trackEl || !thumbsEl) return;

	// Main slides (IMPORTANT: swiper-slide)
	trackEl.innerHTML = items
		.map(
			(it) => `
			<div class="swiper-slide carousel_img_itm ${it.isSelected ? 'active' : ''}" id="s${it.index}">
				<img src="${it.imgSrc}">
			</div>
			`,
		)
		.join('');

	// Thumb slides (IMPORTANT: swiper-slide)
	thumbsEl.innerHTML = items
		.map(
			(it) => `
			<div class="swiper-slide carousel_list_itm ${it.isSelected ? 'active' : ''}" id="${it.index}">
				<img src="${it.imgSrc}">
				<i class="icon-fi-view"></i>
			</div>
			`,
		)
		.join('');
}

function updatePagination(popRoot, currentIndex, total) {
	const totalEl = popRoot.querySelector('.carousel_pg_total');
	const countEl = popRoot.querySelector('.carousel_pg_count');

	if (totalEl) totalEl.textContent = `Photo by ${total}`;
	if (countEl) countEl.textContent = `${currentIndex} of ${total}`;
}

function initSwipers(popRoot, initialSlideIndex, total) {
	// console.log(popRoot)
	const mainEl = popRoot.querySelector('.carousel_img_slider');
	const thumbsEl = popRoot.querySelector('.carousel_list_outer');
	const prevBtn = popRoot.querySelector('.carousel_nav.prev');
	const nextBtn = popRoot.querySelector('.carousel_nav.next');

	if (!mainEl || !thumbsEl || !prevBtn || !nextBtn) return;

	// thumbnails
	thumbsSwiper = new Swiper(thumbsEl, {
		slidesPerView: 'auto',
		spaceBetween: 10,
		freeMode: true,
		watchSlidesProgress: true,
		slideToClickedSlide: true,
	});

	// img swiper
	mainSwiper = new Swiper(mainEl, {
		initialSlide: initialSlideIndex,
		spaceBetween: 4,
		navigation: {
			prevEl: prevBtn,
			nextEl: nextBtn,
		},
		thumbs: {
			swiper: thumbsSwiper,
		},
		on: {
			init(sw) {
				updatePagination(popRoot, sw.realIndex + 1, total);
			},
			slideChange(sw) {
				updatePagination(popRoot, sw.realIndex + 1, total);
			},
		},
	});

	// swiper-slide carousel_list_itm swiper-slide-visible swiper-slide-fully-visible swiper-slide-thumb-active
	// swiper-slide carousel_list_itm swiper-slide-visible swiper-slide-fully-visible
}

function wireClose(popRoot, mountEl) {
	const closeBtn = popRoot.querySelector('.carousel_close');
	const panel = popRoot.querySelector('.carousel_wrp');

	const isAsia = window.location.href.includes('/html_asia');
	const isEuro = window.location.href.includes('/html_euro');
	// const isAsia = localStorage.getItem("isswitchedtoasia") !== "false";
	// const isEuro = !isAsia;

	const closePopup = () => {
		destroySwipers();
		popRoot.style.display = 'none';
		if (isEuro) mountEl.style.display = 'none';
	};

	// overwrite handlers (no stacking)
	closeBtn &&
		(closeBtn.onclick = (e) => {
			e.preventDefault();
			closePopup();
		});

	popRoot.onclick = (e) => {
		if (panel && !panel.contains(e.target)) closePopup();
	};
}

// ========= Main entry =========
function showCarousel() {
	const triggerIds = ['demoPopUpOnlyDevDontCopy', 'demoPopupNoImg'];
	const triggers = triggerIds.map((id) => document.getElementById(id)).filter(Boolean);

	// console.log(window.location.href.includes("/html_euro"))

	triggers.forEach((btn) => {
		btn.addEventListener('click', async () => {
			// console.log(window.location.href)
			setWindowHeightVar();

			const btnId = btn.id;

			const isAsia = window.location.href.includes('/html_asia');
			const isEuro = window.location.href.includes('/html_euro');

			const mountEl = isEuro ? document.getElementById('demoOnly_results_pop_carousel') : document.getElementById('demoOnly_results_carousel_pop');
			// demoOnly_results_pop_carousel
			if (!mountEl) return;

			// reset previous
			destroySwipers();
			// after close mountel is still display block blocking click events
			// isEuro && (mountEl.style.display = "none");
			mountEl.innerHTML = '';

			await loadHtmlInto(mountEl, '../html_public/_results-carousel.html');

			const popRoot = mountEl.querySelector('.carousel');
			if (!popRoot) return;

			popRoot.style.display = 'flex';

			isEuro && (mountEl.style.display = 'block');

			wireClose(popRoot, mountEl);

			const msgWrap = popRoot.querySelector('.msg_wrap');
			const windowWrap = popRoot.querySelector('.carousel_window_wrp');
			const listWrap = popRoot.querySelector('.carousel_list_wrp');

			// no img scenario
			if (btnId === 'demoPopupNoImg') {
				if (msgWrap) msgWrap.style.display = 'flex';
				if (windowWrap) windowWrap.style.display = 'none';
				if (listWrap) listWrap.style.display = 'none';

				return;
			}

			// if has img
			if (msgWrap) msgWrap.style.display = 'none';
			if (windowWrap) windowWrap.style.display = 'flex';
			if (listWrap) listWrap.style.display = 'block';

			buildRandomDummyImages();

			renderSlides(popRoot, imgSrcArr);

			const initialSlideIndex = Math.max(
				0,
				imgSrcArr.findIndex((x) => x.isSelected),
			);
			// console.log(popRoot)
			initSwipers(popRoot, initialSlideIndex, imgSrcArr.length);
			updatePagination(popRoot, initialSlideIndex + 1, imgSrcArr.length);
		});
	});
}

function toggleBoost() {
	// toggle panels
	$('.ob_tabs .fl_comp_t.le_t')
		.off('click')
		.on('click', function () {
			// console.log('>>>>');
			const $this = $(this);
			const str = $this.attr('id');
			const prefix = 'demoOnlyToggle';
			const type = str.slice(prefix.length);

			$this.addClass('active').siblings().removeClass('active');
			$('.ob_panel').hide();
			$(`#demoOnly${type}`).show();

			// console.log(type, $(".ob_toggle"))
			if (type !== 'LuckyE') {
				$('.ob_toggle').removeClass('disabled');
			} else {
				$('.ob_toggle').addClass('disabled');
			}
		});

	// clover
	function updateClover() {
		var icon = document.querySelector('.le_icon');
		var part = icon && icon.querySelector('.icon-fi-clover.active');
		var figEl = document.querySelector('.le_slxn_figure');
		if (!part || !figEl) return;
		var figText = figEl.closest('.le_figure').textContent;
		var match = figText.match(/(\d+)\s*\/\s*(\d+)/);
		if (!match) return;
		var current = parseInt(match[1], 10);
		var total = parseInt(match[2], 10);
		var angle = total > 0 ? (current / total) * 360 : 0;
		part.style.setProperty('--clover-angle', angle + 'deg');
	}
	updateClover();
	var cloverFigEl = document.querySelector('.le_slxn_figure');
	if (cloverFigEl) {
		new MutationObserver(updateClover).observe(cloverFigEl, { childList: true, characterData: true, subtree: true });
	}

	// toggle leave lucky 8 popup
	$('#demoOnlyToggleLeaveLuckyE')
		.off('click')
		.on('click', function () {
			const popupOri = $('#popup_sample');

			if (window.location.href.includes('/html_asia')) {
				popupOri.find('.n_popup_header').text('Leave Lucky 8?');
				popupOri.find('.betslip_teams_wrap').text('Your current selections will be cleared.');
				popupOri.find('.n_popup_button_wrap').html(`
				<div class="betslip_bottom_button normal_btn">Leave</div>
				<div class="betslip_bottom_button confirm">Confirm</div>
			`);
				popupOri.show();

				popupOri
					.find('.betslip_bottom_button')
					.off('click')
					.on('click', function () {
						popupOri.hide();
					});
			}
			if (window.location.href.includes('/html_euro')) {
				popupOri.find('.n_popup_head').text('Leave Lucky 8?');
				popupOri.find('.n_popup_content').text('Your current selections will be cleared.');
				popupOri.find('.n_popup_bottom.buttons_grps').html(`
				<div class="btn_cancel btn">Leave</div>
				<div class="btn_ok btn">Confirm</div>
			`);
				popupOri.show();

				popupOri
					.find('.btn')
					.off('click')
					.on('click', function () {
						popupOri.hide();
					});
			}
		});

	// toggle no record outside
	$('#demoOnlyToggleNoRecordO')
		.off('click')
		.on('click', function () {
			$('.ob_panel, .ob_tabs, .ob_menu_wrp').hide();
			$('.loading_area').hide();
			$('.general_wrap').show();
			if (window.location.href.includes('/html_euro')) {
				$('.n_content_wrap_wth_bcktop.with_ref').css('padding-bottom', 0);
			}
		});

	$('#demoOnlyToggleNoRecordI')
		.off('click')
		.on('click', function () {
			$('.ob_panel').hide();
			$('.loading_area').hide();
			$('.general_wrap').show();

			if (window.location.href.includes('/html_euro')) {
				$('.n_content_wrap_wth_bcktop.with_ref').css('padding-bottom', 0);
			}
		});
}

function flexiSlider(slider_id) {
	var test_slider_width = $(slider_id + ' .item_wrap.active').width() + 'px';
	var test_slider_position = $(slider_id + ' .item_wrap.active').offset().left - $(slider_id).offset().left + $(slider_id).scrollLeft();

	$(slider_id + ' .slider').css('left', test_slider_position);

	console.log(test_slider_position)
	$(slider_id + ' .slider').css('width', test_slider_width);
	$(slider_id + ' .item_wrap').click(function () {
		$(slider_id + ' .item_wrap').removeClass('active');
		$(this).addClass('active');
		var test1 = $(this).outerWidth() + 'px';
		var test_slider_position = $(slider_id + ' .item_wrap.active').offset().left - $(slider_id).offset().left + $(slider_id).scrollLeft();
		$(slider_id + ' .slider').css('width', test1);
		$(slider_id + ' .slider').css('left', test_slider_position);
	});
}

function toggleRecentWinners() {
	const recWinnersList = [
		{
			slxn: "Arsenal",
			teamName: "Arsenal vs Chelsea",
			competition: "England Premier League",
			results: "2-0"
		},
		{
			slxn: "Manchester United",
			teamName: "Everton vs Manchester United",
			competition: "England Premier League",
			results: "0-1"
		},
		{
			slxn: "Newcastle United",
			teamName: "Newcastle United vs Liverpool",
			competition: "England Premier League",
			results: "1-0"
		},
		{
			slxn: "Lecce",
			teamName: "Venezia vs Lecce",
			competition: "Italy Serie A",
			results: "0-2"
		},
		{
			slxn: "AC Milan",
			teamName: "Juventus vs AC Milan",
			competition: "Italy Serie A",
			results: "0-1"
		},
		{
			slxn: "AS Roma",
			teamName: "AS Roma vs Atalanta",
			competition: "Italy Serie A",
			results: "0-1"
		},
		{
			slxn: "Getafe CF",
			teamName: "Getafe CF vs Racing de Santander",
			competition: "Spain La Liga",
			results: "3-2"
		},
		{
			slxn: "Draw",
			teamName: "Atletico de Madrid vs Villarreal CF",
			competition: "Spain La Liga",
			results: "2-2"
		}
	];

	const recWinnersMarkup = recWinnersList
							.map(({ slxn, teamName, competition, results }) => `
								<div class="lb_i">
									<i class="icon-fi-ok-circle-bg"></i>

									<div class="lb_t_wrp">
										<div class="obp_t">
											<span>${slxn}</span>
											<div class="le_rwp_c_rsts">${results}</div>
										</div>

										<div class="obp_c">
											<span>${teamName}</span>
											<span>${competition}</span>
										</div>
									</div>
								</div>
							`)
							.join('');
	$('.le_rwp_collapsible').html(recWinnersMarkup);
	function setAllRecentWinners(shouldExpand) {
		const $collapsibles = $('.le_rwp_collapsible');
		const animation = shouldExpand ? 'slideDown' : 'slideUp';

		return $collapsibles
			.stop(true, true)
			[animation](200, function () {
				$(this)
					.toggleClass('expanded', shouldExpand)
					.toggleClass('collapsed', !shouldExpand);
			})
			.promise();
	}
	$('#demoRecWinsTg').off('click').on('click', function() {
		$('.ob_panel, .ob_tabs').hide()

		if (localStorage.getItem('isswitchedtoasia') === 'true') {
			$('.n_header .title').html(`<i class="icon-fi-winners"></i>
							Recent Winners`)
		}
		$('.rw_panel').show()
		if (localStorage.getItem('isswitchedtoeuro') === 'true') {
			const $navBar = $('.nav_bar');

			const $lucky8Item = $navBar.children('li').filter(function () {
				return $(this).text().trim() === 'All Boost: Lucky 8';
			}).first();

			if (!$lucky8Item.find('.icon-fi-arrow-right').length) {
				$lucky8Item.append(
					'<i class="icon-fi-arrow-right" aria-hidden="true"></i>'
				);
			}

			const hasRecentWinners = $navBar.children('li').filter(function () {
				return $(this).text().trim() === 'Recent Winners';
			}).length > 0;

			if (!hasRecentWinners) {
				$navBar.append('<li>Recent Winners</li>');
			}
		}
		$('.ob_toggle')
		.removeClass('disabled')
		.off('click')
		.on('click', function () {
			const $toggle = $(this);
			const hasExpandedCard = $('.le_rwp_collapsible.expanded').length > 0;
			const shouldExpand = !hasExpandedCard;

			setAllRecentWinners(shouldExpand).done(function () {
				$('.le_rwp_c_axn > i').toggleClass('fl_rotate', shouldExpand);
				$toggle.find('i').toggleClass('fl_rotate', !shouldExpand);
			});
		});
	})

	$('.le_rwp_c_axn > i').off('click').on('click', function () {
		const $caret = $(this);
		const $target = $caret.closest('.le_rwp_card').find('.le_rwp_collapsible');
		const isExpanded = $target.hasClass('expanded')
		const animation = isExpanded ? 'slideUp' : 'slideDown';

		$target.stop(true, true)[animation](200, function () {
			$(this)
				.toggleClass('expanded', !isExpanded)
				.toggleClass('collapsed', isExpanded);
		});

		$caret.toggleClass('fl_rotate', !isExpanded);
	});
}

// [DES-1926, DES-1927] Large Bet Insights combo
$(function () {
	$(document)
		.off('click.lbCombo', '.lb_combo_t')
		.on('click.lbCombo', '.lb_combo_t', function () {
			var $lbPopup = $(this).closest('#largebetinsights');

			if (!$lbPopup.length) {
				return;
			}

			$lbPopup.find('.lb_exp').removeClass('w_padding').html('<i class="icon-fi-info"></i>Discover popular high-stakes combos across all sports from other players.');
		});

	$(document)
		.off('click.lbShowmore', '.lb_showmore')
		.on('click.lbShowmore', '.lb_showmore', function () {
			var $showmore = $(this);
			var $comboInfo = $showmore.closest('.lb_combo_info');
			var isOpen = $comboInfo.toggleClass('is_open').hasClass('is_open');

			$showmore.attr('aria-expanded', isOpen);
			$showmore
			.contents()
				.filter(function () {
					return this.nodeType === 3;
				})
				.remove();
			$showmore
				.find('i')
				.before(isOpen ? 'Collapse' : 'View remaining 5 selections');

			$showmore.find('i').toggleClass('icon-fi-arrow-up1', isOpen).toggleClass('icon-fi-arrow-down1', !isOpen);
		});
})
