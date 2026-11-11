//DES-27 POC: recalculate height
// function calcHeight_fs() {
//     fs_notch_bottomgap = getComputedStyle(document.getElementsByClassName("side_float_content")[0]).getPropertyValue("--sab").replace(/[^-\d\.]/g, '');
//     windowHeight = window.innerHeight;
//     fs_sidecontent_height = windowHeight - $(".n_footer").outerHeight() + parseFloat(fs_notch_bottomgap) + 2; //plus 2 due to border top & bottom for slider menu
//     $(".side_float_content").css("height", fs_sidecontent_height + "px");
// }

//Global: popup==================================================//
function popupOn() {
	$('body').addClass('popupOn');
}
function popupOff(status = 'normal') {
	$('body').removeClass('popupOn');
	$('#root > .n_container').css('display', '');
}

//Global: set language =================================================//
var language_code;
setLanguageFromstorage();
function setLanguageFromstorage() {
	language_code = localStorage.getItem('language');
	if (language_code === null) {
		localStorage.setItem('language', 'eng');
		language_code = 'eng';
	}
	if (window.location.pathname.includes('cyberbattle') || sessionStorage.getItem('enterCyberBattle') === 'true') {
		document.getElementById('detect_language').setAttribute('href', '../assets/public/languages/' + language_code + '/layout_cyberbattle.min.css');
	} else {
		document.getElementById('detect_language').setAttribute('href', '../assets/public/languages/' + language_code + '/layout_asia.min.css');
	}
}

function loadAsiaSelectPopupData(callback) {
	var $selectFilter = $('#selectfilter');
	var $selectLeague = $('#selectleague');
	var loadingCount = 0;

	function done() {
		loadingCount -= 1;
		if (loadingCount <= 0 && typeof callback === 'function') {
			callback();
		}
	}

	if ($selectFilter.length && !$.trim($selectFilter.html())) {
		loadingCount += 1;
		$selectFilter.load('_popup_selectfilter.html', done);
	}

	if ($selectLeague.length && !$.trim($selectLeague.html())) {
		loadingCount += 1;
		$selectLeague.load('_popup_selectleague.html', function () {
			$(document.documentElement)
				.css('--nLeagueHdr', $('#mock_selectleague_header').outerHeight(true) + 'px')
				.css('--nLeagueFtr', $('#selectleague_footer').outerHeight(true) + 'px');
			done();
		});
	}

	if (!loadingCount && typeof callback === 'function') {
		callback();
	}
}

function isCyberbattleView() {
	return window.location.pathname.toLowerCase().includes('cyberbattle') || sessionStorage.getItem('enterCyberBattle') === 'true' || localStorage.getItem('isCyberBattle') === 'true';
}

function syncAsiaFooterControls(context) {
	var $context = $(context || document);
	var isCyberBattle = sessionStorage.getItem('enterCyberBattle') === 'true';
	var $refresh = $context.find('#refresh').add($context.filter('#refresh'));
	var $aiPlaybook = $context.find('#ai_playbook_home').add($context.filter('#ai_playbook_home'));

	$refresh.toggle(isCyberBattle);
	$refresh.find('.n_refresh_wrap').toggle(isCyberBattle);
	$aiPlaybook.toggle(!isCyberBattle);
}

function isAiPlaybookStandalonePath() {
	return /\/ai_(leaderboard_strategies|strategy_details)\.html$/i.test(window.location.pathname);
}

function resetAiPlaybookDemoStateOnReload() {
	var navigationEntries = performance && performance.getEntriesByType ? performance.getEntriesByType('navigation') : [];
	var isReload = navigationEntries && navigationEntries.length ? navigationEntries[0].type === 'reload' : performance && performance.navigation && performance.navigation.type === 1;

	if (!isAiPlaybookStandalonePath() || !isReload) {
		return;
	}

	sessionStorage.removeItem('aiPlaybookCopiedStrategies');
	sessionStorage.removeItem('aiPlaybookStoppedStrategies');
	sessionStorage.removeItem('aiPlaybookStrategyDetailsState');
	sessionStorage.removeItem('aiPlaybookLeaderboardMenu');
}

resetAiPlaybookDemoStateOnReload();

function filterCyberbattleMybetContent(context) {
	if (!isCyberbattleView()) {
		return;
	}

	var $context = context ? $(context) : $(document);
	var $wrappers = $context.find('.evnt_cancel_wrp');
	var $tags = $context.find('.betslip_tag');

	if ($context.hasClass && $context.hasClass('evnt_cancel_wrp')) {
		$wrappers = $wrappers.add($context);
	}

	if ($context.hasClass && $context.hasClass('betslip_tag')) {
		$tags = $tags.add($context);
	}

	$wrappers.each(function () {
		var $wrapper = $(this);
		var $eventCancel = $wrapper.children('.evnt_cancel').first();

		if ($eventCancel.length) {
			$eventCancel.insertBefore($wrapper);
		}

		$wrapper.remove();
	});

	$tags.remove();
}

$(document).ready(function () {
	filterCyberbattleMybetContent();
	$(document)
		.off('ajaxComplete.cyberbattleMybetFilter')
		.on('ajaxComplete.cyberbattleMybetFilter', function () {
			filterCyberbattleMybetContent();
		});
	$(window)
		.off('pageshow.aiPlaybookSevRestore')
		.on('pageshow.aiPlaybookSevRestore', function () {
			restoreAiPlaybookSev();
		});

	//replace currency
	//$('#root').html($('#root').html().replace('GAMERSTAKE','RMB'));

	/* console.log ('This device has at least ' + navigator.deviceMemory + ' GiB of RAM.'); */

	//Global: set windows height
	/*  $(".n_balance").html("test");
	 const appHeight = () => {
		 const doc = document.documentElement
		 doc.style.setProperty('--app-height', `${window.innerHeight}px`)
	 }
	 window.addEventListener('resize', appHeight)
	 appHeight() */

	//Global: Check browser =================================================//
	//SFCRQ-2267::JS code for demo only

	if (/CriOS/i.test(navigator.userAgent) && /iphone|ipod|ipad/i.test(navigator.userAgent)) {
		//$(".n_balance").html(navigator.userAgent);
	} else {
		//$(".n_balance").html(navigator.userAgent);
		if (navigator.userAgent.includes('iPhone')) {
			//$(".n_balance").html("for safari");
			//SFCRQ-2267:: for demo purposes only: CR suspended
			// "demoOnly_fixposition" >> class to use for differentiate window.scroll in demo, DEV may ignore this, No CSS attr inside this class
			$('body').addClass('demoOnly_fixposition');
			$('head').append('<link rel="stylesheet" href="../assets/public/layout/css/ios_freezebar.min.css" type="text/css" />');
		}
	}
	//Global: Check browser: for backup only =================================================//
	var userAgent = window.navigator.userAgent.toLowerCase(),
		safari = /safari/.test(userAgent),
		ios = /iphone|ipod|ipad/.test(userAgent);

	if (ios) {
		if (safari) {
			//browser
		} else if (!safari) {
			//webview
			$('head').append('<link rel="stylesheet" href="../assets/public/layout/css/ios_apps.min.css" type="text/css" />');
		}
	}

	//Global: set layout =================================================//
	const layout = localStorage.getItem('iscurrentsimpleview');
	if (!layout || layout == null) {
		localStorage.setItem('iscurrentsimpleview', 'false');
	}

	$('#slct_layout').on('change', function () {
		if ($(this).val() == '1') {
			$('#sample_mock_setting').text('Professional');
		} else {
			$('#sample_mock_setting').text('Beginner');
		}
	});
	$('#samplemock_save_pref').click(function () {
		if (localStorage.getItem('isFacelift') === 'true') {
			if ($('#slct_layout_ob_st_rw').find('.ob_st_rw.active').text() == 'Professional') {
				// sessionStorage.setItem('layout', 'professional');
				localStorage.setItem('iscurrentsimpleview', 'false');
			} else {
				// sessionStorage.setItem('layout', 'beginner');
				localStorage.setItem('iscurrentsimpleview', 'true');
			}
			if (sessionStorage.getItem('enterCyberBattle') === 'true') {
				if (localStorage.getItem('iscurrentsimpleview') == 'false') {
					window.location.href = 'el-prof-soccer-todaycyberbattle.html';
				} else {
					window.location.href = 'el-begin-soccer-todayCyberBattle.html';
				}
			} else {
				if (localStorage.getItem('webcyberbattle') === 'true') {
					cyberbattleBackFunction();
				} else {
					history.back();
				}
			}
		} else {
			if ($('#slct_layout').val() == '1') {
				// sessionStorage.setItem('layout', 'professional');
				localStorage.setItem('iscurrentsimpleview', 'false');
			} else {
				// sessionStorage.setItem('layout', 'beginner');
				localStorage.setItem('iscurrentsimpleview', 'true');
			}
		}
	});

	if (performance.navigation.type === 1) {
		if (localStorage.getItem('webcyberbattle') === 'true' && sessionStorage.getItem('enterCyberBattle') === 'true') {
			window.location.href = 'webcyberbattle.html';
		}
	}

	//Global: set theme Color =================================================//
	setstyleFromstorage();
	function setstyleFromstorage() {
		var theme_value = '';
		theme_value = localStorage.getItem('theme');
		if (theme_value === null || theme_value === 'DarkBlue') {
			localStorage.setItem('theme', 'default');
			theme_value = 'default';
		}

		if (window.location.pathname.includes('cyberbattle') || sessionStorage.getItem('enterCyberBattle') === 'true') {
			document.getElementById('design_view').setAttribute('href', '../assets/themes/colours/' + theme_value + '/theme_cyberbattle.min.css');
		} else {
			document.getElementById('design_view').setAttribute('href', '../assets/themes/colours/' + theme_value + '/theme_asia.min.css');
		}
	}

	//Detect sports type for cyber battle view =================================================//
	var cyber_sportsType;
	cyber_sportsType = sessionStorage.getItem('cyberSportsType');
	if (cyber_sportsType === null) {
		// set default sports type
		sessionStorage.setItem('cyberSportsType', 'fifa');
		cyber_sportsType = 'fifa';
	}

	$('#fifa').click(function () {
		sessionStorage.setItem('cyberSportsType', 'fifa');
	});
	$('#pes').click(function () {
		sessionStorage.setItem('cyberSportsType', 'pes');
	});
	$('#nba2k').click(function () {
		sessionStorage.setItem('cyberSportsType', 'nba2k');
	});
	$('#cba2k').click(function () {
		sessionStorage.setItem('cyberSportsType', 'cba2k');
	});
	$('#cs1').click(function () {
		sessionStorage.setItem('cyberSportsType', 'cs1');
	});
	$('#cs2').click(function () {
		sessionStorage.setItem('cyberSportsType', 'cs2');
	});
	$('#cs3').click(function () {
		sessionStorage.setItem('cyberSportsType', 'cs3');
	});
	$('#cs13').click(function () {
		sessionStorage.setItem('cyberSportsType', 'cs13');
	});

	//Global: Back to Last page =================================================//
	$('.n_back')
		.off('click')
		.on('click', function () {
			if (sessionStorage.getItem('enterCyberBattle') !== 'true') {
				if (!$(this).find('.n_back_link').is('#closepopup_mybet , #close_sev_popup')) {
					sessionStorage.setItem('page', 'back');
					if ($(this).has('#backtomain')) {
						window.location.href = 'index.html';
					} else {
						window.history.back();
					}
				}
			}
		});

	// Completed Result: abandon reason popup =================================================//
	$('.aband_reason_wrap').hide();
	$('.result_cancel').click(function () {
		$('.aband_reason_wrap').show(0);
		setTimeout(function () {
			$('.aband_reason_wrap').hide();
		}, 5000);
	});
	$(document).on('click', function (e) {
		if (!$(e.target).hasClass('result_cancel')) {
			if ($(e.target).closest('.aband_reason').length === 0) {
				$('.aband_reason_wrap').hide();
			}
		}
	});

	//Global Footer=================================================//
	function RemoveClass() {
		$('#refresh').find('.n_refresh_wrap').removeClass('rotate');
		$('#favRefresh').find('i').removeClass('rotate-fwd');
		$('#lbRefresh').find('i').removeClass('rotate-fwd');
	}
	$('#refresh').click(function () {
		$(this).find('.n_refresh_wrap').addClass('rotate');
		setTimeout(RemoveClass, 1000);
	});
	$('#favRefresh').click(function () {
		$(this).find('i').addClass('rotate-fwd');
		setTimeout(RemoveClass, 1000);
	});
	$('#lbRefresh').click(function () {
		$(this).find('i').addClass('rotate-fwd');
		setTimeout(RemoveClass, 1000);
	});
	$('#index').click(function () {
		window.location.href = 'index.html';
	});
	$('#results').click(function () {
		checkCyberbattlePage('result-live.html');
	});
	$('#promo_home i').click(function () {
		checkCyberbattlePage('promo.html');
	});
	$('#betslips').click(function () {
		$('.n_footer_combo.clone').addClass('no_bm');
		$('#mybet').show();
		popupOn();
		$('#main_footer').hide();
		$('#toTop').css('bottom', -52);
		$('#toTop').removeClass('show');
		$('#toTop').addClass('btn_backtop_popup');
	});
	$('#select_competition_btn_sev').click(function () {
		loadAsiaSelectPopupData();
		$('#selectfilter').show();
		popupOn();
		$('#competition_filter').hide();
		$('#time_range_selectfilter_mock').hide();
		scrolling_disable(document.getElementsByClassName('popup_overWrap')[0]);
	});
	$('#betslips_home').click(function () {
		$('#mybet').show();
		$('.bet_summary').addClass('w_footer').show();
		popupOn();
		$('#toTop').css('bottom', -52);
		$('#toTop').removeClass('show');
		$('#toTop').addClass('btn_backtop_popup');

		// customization for footer
		$('.footer_main').addClass('n_footer_pop');
		$('.footer_main .item').removeClass('active');
		$(this).addClass('active');
		$('#index i').removeClass('icon-fi-n-home-active').addClass('icon-fi-n-home');
		$('#results i').removeClass('icon-fi-n-results-active').addClass('icon-fi-n-results');
		$('#search i').removeClass('icon-fi-n-search-active').addClass('icon-fi-n-search');
		$('#myfav i').removeClass('icon-fi-n-myfav-active').addClass('icon-fi-n-myfav');
		$('#betslips_home i').removeClass('icon-fi-n-betlist').addClass('icon-fi-n-betlist-active');
		// $("#closepopup_mybet").hide();
	});

	$('#search').click(function () {
		window.location.href = 'search.html';
	});

	$(document)
		.off('click.myfav', '#myfav')
		.on('click.myfav', '#myfav', function () {
			checkCyberbattlePage('el-prof-favorites.html');
		});

	$('#popular_home').click(function () {
		if ($('body').hasClass('fl')) {
			window.location.href = 'popular-home2.html';
		} else {
			window.location.href = 'popular-home.html';
		}
	});

	$(document)
		.off('click.aiPlaybookHome', '#ai_playbook_home')
		.on('click.aiPlaybookHome', '#ai_playbook_home', function () {
			openAiPlaybookHome();
		});

	// Global Popup Windows =================================================//
	$('.popup_window_center, .sample_class_dev_pls_remove').on('click', function (e) {
		if (e.target !== this) return;
		var releaseAiPlaybookNestedPopup = $('.devDontCopy_stop_copying').is(':visible');
		var $aiPlaybookPopup = getActiveAiPlaybookPage();
		var keepAiPlaybookBodyPopupOn = releaseAiPlaybookNestedPopup && $aiPlaybookPopup.is(':visible');

		$('.popup_window').hide();

		if (releaseAiPlaybookNestedPopup) {
			releaseAiPlaybookPageNestedPopupOn($aiPlaybookPopup);
		}

		if (!$(this).parent().is('#acceptodds_options_popup') && !keepAiPlaybookBodyPopupOn) {
			popupOff();
			$('#toTop').removeClass('btn_backtop_popup');
			document.ontouchmove = function (e) {
				return true;
			};
		}
	});

	// Odds Color Setting=================================================//
	detectOddsColor();
	// no longer in used: start
	// $('.n_event_listing_header').click(function (e) {
	// 	if (e.target.classList.contains('icon-fi-joystick')) {
	// 		return;
	// 	}
	// 	$(this).find('.icon i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
	// 	$(this).next().toggle();
	// 	$(this).parent().find('.disclaimer').next().toggle();
	// });
	// no longer in used: end
	$('.vr_timer').click(function () {
		if ($('body').hasClass('fl')) {
			$(this).closest('.vr_timer').find('.vr_timer_arrow').toggleClass('fl_rotate');
			$(this).next().slideToggle(200);
		} else {
			$(this).find('i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
			$(this).next().toggle();
		}
	});
	backtotopv2();
	clickBalPromo();
	if (localStorage.getItem('isFacelift') == 'true') {
		if (window.location.href.indexOf('html_cyber') == -1) {
			$('body').addClass('fl');
		}
	}
	if (localStorage.getItem('isFacelift') == 'false') {
		$('body').removeClass('fl');
	}

	ob_listing_header_clicking();
	asiaFacelift();

	//facelift linkage
	localStorage.setItem('isFacelift', 'true');
	if (window.location.href.indexOf('html_cyber') == -1) {
		$('body').addClass('fl');
	}
	localStorage.setItem('isFirstFl', 'true');
	matchSliderWidth();
});

function indexTutorial() {
	var $promoMask = $('#promo_mask');
	var $promoMaskButton = $('#demoOnly_promo_mask');
	var $promoFooterMask = $promoMaskButton.closest('.footer_main').find('.footer_mask').not('.fltr_ftr_msk');
	var aiPlaybookTutorialMaskSelector = '> .bg_mask, > .aiPB_mask_btn, .strat_card_grp > .bg_mask, .strat_card_grp > .aiPB_mask_btn, .strat_dtl_grp > .bg_mask, .strat_dtl_grp > .aiPB_mask_btn, .strat_dtl_cont > .strat_dtl_cont_wrp > .bg_mask, .strat_dtl_cont > .strat_dtl_cont_wrp > .aiPB_mask_btn';
	var aiPlaybookTutorialStep3HighlightedSelector = '.strat_dtl_tab_grp, .ai_graph, .sd_cont:first, .sd_cont:eq(1) > .sd_box_hdr';
	var aiPlaybookTutorialHighlightedSelector = '.strat_card_wrp, .strat_dtl_tab_grp, .sd_cont:has(.aiPB_tut_step4), ' + aiPlaybookTutorialStep3HighlightedSelector;

	//step1
	$('#promo_tutorial_mock').click(function () {
		var $aiPlaybookPopup = getAiPlaybookPages();

		sessionStorage.removeItem('aiPlaybookTutorial');
		$('#ai_playbook_tutorial, #ai_playbook_home .ai_tutor').hide();
		$aiPlaybookPopup.removeClass('popupOn').hide().find(aiPlaybookTutorialMaskSelector).hide();
		$aiPlaybookPopup.find('.ai_tutor').hide();
		$aiPlaybookPopup.find(aiPlaybookTutorialHighlightedSelector).removeClass('highlighted');
		$promoMask.attr('id', 'promo_mask').addClass('prm_mask');
		$promoMaskButton.attr('id', 'demoOnly_promo_mask').removeClass('aiPB_mask_btn').addClass('prm_msk_btn');
		$('.footer_main').removeClass('aiPB_footer_mask').addClass('prm_footer_msk');
		$('.footer_main .ftr_tab_mask').hide();
		$promoMask.show();
		$promoMaskButton.show();
		$promoFooterMask.show();
		$('#promo_home').addClass('highlighted');
		$('#ai_playbook_home').removeClass('highlighted');
		$('#promo_home .new_tag').hide();
		sessionStorage.setItem('promotutorial', 'step1');
	});

	$promoMaskButton.click(function () {
		if ($(this).hasClass('aiPB_mask_btn')) {
			return;
		}

		if (sessionStorage.getItem('promotutorial') == 'step3') {
			//step5
			$('.footer_main').addClass('prm_bet_mask');
			$promoMask.hide();
			$promoMaskButton.hide();
			if (sessionStorage.getItem('enterCyberBattle') === 'true') {
				$('#myacctpage').addClass('cbWrp');
				$('#myacctpage')
					.empty()
					.load('_popup_myaccountCyberBattle.html', function () {
						$('#promo_act_mask').show();
						$('.n_content_wrap_v').addClass('prm_acc_msk');
					});
			}
			$('#myacctpage').show();
			$('.n_content_wrap_v').addClass('prm_acc_msk');
			$('#promo_act_mask').show();
			$('.promo_drpd').hide();
			sessionStorage.setItem('promotutorial', 'step4');
		} else if (sessionStorage.getItem('promotutorial') == 'step2') {
			//step4
			$('.footer_main').removeClass('prm_bet_mask');
			$('#mybet').hide();
			$promoMask.show();
			$promoMaskButton.show();
			$('.footer_main').removeClass('prm_footer_msk');
			$('.n_header_main').addClass('prm_header_msk');
			$('.promo_drpd').show();
			$('.item').removeClass('highlighted');
			$promoFooterMask.show();
			$('#promo_home .new_tag').hide();
			$('#promo_sb_mask').hide();
			$('.col_div2').removeClass('prm_tl_mask');
			$('#test_promotion_betslip_bet_amount_inner').removeClass('prm_bet_mask');
			sessionStorage.setItem('promotutorial', 'step3');
		} else if (sessionStorage.getItem('promotutorial') == 'step4') {
			//step6 - close tutorial
			$('.n_content_wrap_v').removeClass('prm_acc_msk');
			$('#promo_act_mask').hide();
			$('#myacctpage').hide();
			$('#mybet').hide();
			$('.n_header_main').removeClass('prm_header_msk');
			$promoFooterMask.hide();
			$('#promo_home .new_tag').show();
			$('.footer_main').removeClass('prm_bet_mask');
			if (sessionStorage.getItem('enterCyberBattle') === 'true') {
				window.location.href = 'el-prof-soccer-todaycyberbattle.html';
			}
			sessionStorage.removeItem('promotutorial');
		} else {
			//step2
			$promoMask.hide();
			$promoMaskButton.hide();
			if ($('body').hasClass('fl')) {
				if (sessionStorage.getItem('enterCyberBattle') === 'true') {
					window.location.href = 'el-prof-soccer-todaycyberbattle.html';
				} else {
					window.location.href = 'el-prof-soccer-today.html';
				}
			} else {
				window.location.href = 'el-prof-soccer-today.html';
			}
		}
	});

	//step3
	if (sessionStorage.getItem('promotutorial') == 'step2') {
		$('#mybet').show();
		$('#mybet').load('_popup_mybet_settled.html', function () {
			$('.col_div2').addClass('prm_tl_mask');
			$('#test_promotion_betslip_bet_amount_inner').addClass('prm_bet_mask');
			$('#promo_sb_mask').show();
		});
		$('.footer_main').addClass('prm_bet_mask');
	}
}

function promoTimer(min, sec) {
	var minutes = min;
	var seconds = sec;
	$('.prmTimeWrp.min .prmTime').text(minutes);
	$('.prmTimeWrp.sec .prmTime').text(seconds);
	$(document.documentElement)
		.css('--timeMin', min * 60 + 1 + 's')
		.css('--timeSec', sec + 1 + 's');
	var interval = setInterval(function () {
		if (minutes <= 0 && seconds <= 1) {
			clearInterval(interval);
			$('.prmTimeWrp.sec').addClass('done');
		}
		--seconds;
		minutes = seconds < 0 ? --minutes : minutes;
		seconds = seconds < 0 ? 59 : seconds;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		if (minutes <= 0) {
			$('.prmTimeWrp.min').addClass('done');
		}
		if (minutes >= 0 && seconds >= 0) {
			$('.prmTimeWrp.min .prmTime').text(minutes);
			$('.prmTimeWrp.sec .prmTime').text(seconds);
		}
	}, 1000);
}

function esportsTutorial() {
	sessionStorage.setItem('esports_tut', 'false');
	//Esports Tutorial Page 1
	$('#dontcopy_newtag_esports2').click(function () {
		$('#es_bmsk, #es_msk_btn').show();
		$('#sports_switch2').addClass('es_bgmsk1');
	});

	//Esports Tutorial Page 2
	$('#es_msk_btn').click(function () {
		$('#sports_switch2').removeClass('es_bgmsk1').addClass('es_bgmsk2');
		$('.n_home_sports').addClass('es_bgmsk2');

		//Esports Tutorial Page 3
		$('#es_msk_btn').click(function () {
			$('#es_bmsk').hide();
			$('#es_bgmsk2').removeClass('es_bgmsk2');
			$('.n_home_sports').removeClass('es_bgmsk2');
			if ($('body').hasClass('fl')) {
				window.location.href = 'el-prof-lol-today.html';
			} else {
				window.location.href = 'el-prof-lol-today.html';
			}
			sessionStorage.setItem('esports_tut', 'true');
		});
	});
}

// Back to Top : NEW//
function backtotop_haveRef(thisDIV, footerMenuHeight) {
	if (thisDIV.scrollTop()) {
		$('#toTop').addClass('show');
		$('#toTop').css('bottom', footerMenuHeight + float_btn_Height + padding_between_floating_button_in_favpage);
	} else {
		$('#toTop').removeClass('show');
		$('#toTop').css('bottom', -footerMenuHeight);
	}
}
function backtotop_noRef(thisDIV, footerMenuHeight) {
	if (thisDIV.scrollTop()) {
		$('#toTop').addClass('show');
		$('#toTop').css('bottom', footerMenuHeight);
	} else {
		$('#toTop').removeClass('show');
		$('#toTop').css('bottom', -footerMenuHeight);
	}
}
var float_btn_Height = 38; //fix value
var padding_between_floating_button_in_favpage = 16;
function backtotopv2() {
	var haverefresh = $('.eventListingRefresh').hasClass('btn_float_ref');
	var betplacementPanel_height = $('.n_footer_combo').outerHeight();
	var newfooterValue = ($('.n_footer').eq(0).is(':visible') ? $('.n_footer').eq(0).outerHeight() : 50) + betplacementPanel_height + 4;
	var footerMenuHeight = newfooterValue === undefined ? 0 : newfooterValue;
	const luckyEightActionBarHeight = $('.le_action_bar').outerHeight() ?? 0; // lucky eight action bar height
	var paddingBottom = footerMenuHeight + float_btn_Height + luckyEightActionBarHeight + 'px';

	if (haverefresh) {
		// for asia view: fav page only
		float_btn_Height = float_btn_Height;
		$('#favRefresh').css('bottom', footerMenuHeight);

		$(window).scroll(function () {
			backtotop_haveRef($(this), footerMenuHeight);
		});
		$('.demoOnly_fixposition .n_container').scroll(function () {
			backtotop_haveRef($(this), footerMenuHeight);
		});
		paddingBottom = footerMenuHeight + float_btn_Height * 2 + padding_between_floating_button_in_favpage + 'px';
	} else {
		$(window).scroll(function () {
			backtotop_noRef($(this), footerMenuHeight);
		});
		$('.demoOnly_fixposition .n_container').scroll(function () {
			backtotop_noRef($(this), footerMenuHeight);
		});
		$('.popup_overWrap').scroll(function () {
			backtotop_noRef($(this), footerMenuHeight);
		});
	}

	//[SFCRQ-3477][Asian] Sports Panel and Bottom Panel UX Change: start
	var lastScrollTop = 0;

	$(window).scroll(function () {
		var st = $(this).scrollTop();

		if (st > lastScrollTop) {
			$('body').addClass('navScroll').removeClass('navReset');
			setTimeout(function () {
				var footerOffset = $('.footer_main').offset();
				if (!$('.ai_playbook:visible .devDontCopy_aiPB_footer').length && footerOffset && $(window).height() - footerOffset.top <= 20) {
					$('.n_footer').removeClass('newtag');
				}
			}, 300);
		} else {
			$('body').removeClass('navScroll').addClass('navReset');
			$('.n_footer').addClass('newtag');
		}

		lastScrollTop = st <= 0 ? 0 : st;
	});
	$('.n_container, .sev_popup, .popup_overWrap').scroll(function () {
		var st = $(this).scrollTop();
		if (st > lastScrollTop) {
			$('body').addClass('navScroll').removeClass('navReset');
			setTimeout(function () {
				var footerOffset = $('.footer_main').offset();
				var betSummaryOffset = $('.bet_summary').offset();
				var betSummaryTop = betSummaryOffset ? betSummaryOffset.top : 0;
				if (!$('.ai_playbook:visible .devDontCopy_aiPB_footer').length && footerOffset && $(window).height() - footerOffset.top - betSummaryTop <= 20) {
					$('.n_footer').removeClass('newtag');
				}
			}, 315);
		} else {
			$('body').removeClass('navScroll').addClass('navReset');
			$('.n_footer').addClass('newtag');
		}

		lastScrollTop = st <= 0 ? 0 : st;
	});
	//[SFCRQ-3477][Asian] Sports Panel and Bottom Panel UX Change: end

	$('.n_content_wrap_wth_bcktop').css('padding-bottom', paddingBottom);
	$('.popup_overWrap  .n_content_wrap_wth_bcktop').css('padding-bottom', '');
	$('#toTop').click(function () {
		///SFSSR-5180
		/* var items = document.getElementsByClassName("n_sticky");
		for (var i=0; i < items.length; i++) {
			items[i].classList.remove('n_sticky');
		} */
		$('html, body').animate({ scrollTop: 0 }, 1000);
		/*   window.scrollTo({
			 top: 0,
			 left: 0,
			 behavior: 'smooth'
		   }); */
	});
	$('.demoOnly_fixposition #toTop').click(function () {
		$('.demoOnly_fixposition .n_container').animate({ scrollTop: 0 }, 1000);
	});
}

// Large Bet Insights floating buttons: #lbRefresh's bottom offset depends on whether
// the betslip combo panel (.n_footer_combo.v2.clone) is visible underneath the popup.
// #toTop follows the same scroll-driven .show pattern as backtotop_noRef elsewhere —
// only its bottom-when-shown value differs here (combo-aware instead of footer-height-
// aware), so this has to run on every scroll of #largebetinsights, not just once.
function updateLbFloatingButtons(scrollTop) {
	var comboVisible = $('.n_footer_combo.v2.clone').is(':visible');
	var toTopShown = !!scrollTop;
	var lbBottom = comboVisible ? 56 : 8;
	var toTopBottom = comboVisible ? 100 : 52;

	$('#lbRefresh').css('bottom', lbBottom);

	if (toTopShown) {
		$('#toTop').addClass('show');
		$('#toTop').css('bottom', toTopBottom);
	} else {
		$('#toTop').removeClass('show');
		$('#toTop').css('bottom', -toTopBottom);
	}

	// .lb_wrp padding-bottom only needs to clear the higher of the two buttons —
	// toTop always sits above lbRefresh when both are shown, so its bottom+height
	// already covers lbRefresh underneath it:
	// 1. lbRefresh alone            -> lbBottom + float_btn_Height
	// 2. lbRefresh + toTop          -> toTopBottom + float_btn_Height
	// 3. lbRefresh + combo visible  -> lbBottom (higher, 56) + float_btn_Height
	// 4. lbRefresh + toTop + combo  -> toTopBottom (higher, 100) + float_btn_Height
	var lbWrpPadding = (toTopShown ? toTopBottom : lbBottom) + float_btn_Height;

	$('.lb_wrp').css('padding-bottom', lbWrpPadding + 'px');
}

// Large Bet Insights sticky offsets: measured inside #largebetinsights only, because
// .n_header_sports also exists on other pages/popups. Heights are 0 while the popup is
// hidden, so call this after the popup is shown and after its content is loaded.
function updateLbStickyOffsets() {
	var $popup = $('#largebetinsights');
	var headerH = $popup.find('.n_header_sports').outerHeight() || 0;
	var subHeaderH = $popup.find('.lb_header:visible, .lb_menu_cover:visible').first().outerHeight() || 0;

	$popup.find('.lb_header, .lb_menu_cover').css('top', headerH);
	$popup.find('.lb_top_rw').css('top', headerH + subHeaderH);
	document.documentElement.style.setProperty('--lb_container_h', headerH + subHeaderH + 'px');
}

// Block BG Scroll =================================================//
function scrolling_disable(classname) {
	// scrolling popup
	// var _overlay = document.getElementsByClassName("popup_overWrap")[0];
	var _overlay = classname;
	var _clientY = null; // remember Y position on touch start
	_overlay.addEventListener(
		'touchstart',
		function (event) {
			if (event.targetTouches.length === 1) {
				// detect single touch
				_clientY = event.targetTouches[0].clientY;
			}
		},
		false,
	);
	_overlay.addEventListener(
		'touchmove',
		function (event) {
			if (event.targetTouches.length === 1) {
				// detect single touch
				disableRubberBand(event);
			}
		},
		false,
	);

	function disableRubberBand(event) {
		var clientY = event.targetTouches[0].clientY - _clientY;
		if (_overlay.scrollTop === 0 && clientY > 0) {
			// element is at the top of its scroll
			event.preventDefault();
		}
		if (isOverlayTotallyScrolled() && clientY < 0) {
			//element is at the top of its scroll
			event.preventDefault();
		}
	}
	function isOverlayTotallyScrolled() {
		return _overlay.scrollHeight - _overlay.scrollTop <= _overlay.clientHeight;
	}
}
// block popup bg scroll = from DEV
function blockPopup() {
	// window.scrollTo(0, parseInt(scrollY || '0') * -1);
	/* $('#popup_place_bet,.popup_window_center').bind('touchstart click', function(e){

	   if($(e.target).attr('class').includes("popup_window_center")){
			e.preventDefault();
			e.stopPropagation();
			return
	   }
	});  */
}
// // Slider =================================================//
// function flexiSlider(slider_id) {
// 	var test_slider_width = $(slider_id + ' .item_wrap.active').width() + 'px';
// 	var test_slider_position = $(slider_id + ' .item_wrap.active').offset().left - $(slider_id).offset().left + $(slider_id).scrollLeft();

// 	$(slider_id + ' .slider').css('left', test_slider_position);

// 	console.log(test_slider_position)
// 	$(slider_id + ' .slider').css('width', test_slider_width);
// 	$(slider_id + ' .item_wrap').click(function () {
// 		$(slider_id + ' .item_wrap').removeClass('active');
// 		$(this).addClass('active');
// 		var test1 = $(this).outerWidth() + 'px';
// 		var test_slider_position = $(slider_id + ' .item_wrap.active').offset().left - $(slider_id).offset().left + $(slider_id).scrollLeft();
// 		$(slider_id + ' .slider').css('width', test1);
// 		$(slider_id + ' .slider').css('left', test_slider_position);
// 	});
// }
// LOGO =================================================//

function sliderFunction(slider_id, isPopular) {
	$(slider_id + ' .slider').css('width', $(slider_id + ' .popular_itm.active').width());
	$(slider_id + ' .slider').css('left', $(slider_id + ' .popular_itm.active').offset().left + $(slider_id).scrollLeft());
	$(slider_id + ' .popular_itm').click(function () {
		$(slider_id + ' .popular_itm').removeClass('active');
		$(this).addClass('active');
		$(slider_id + ' .slider').css('width', $(slider_id + ' .popular_itm.active').width());
		$(slider_id + ' .slider').css('left', $(slider_id + ' .popular_itm.active').offset().left + $(slider_id).scrollLeft());
		if ($(this).offset().left + $(this).outerWidth() > $(window).width()) {
			$(slider_id).scrollLeft($(slider_id).scrollLeft() + $(this).offset().left + $(this).outerWidth() - $(window).width());
		} else if ($(this).offset().left < 0) {
			$(slider_id).scrollLeft($(slider_id).scrollLeft() + $(this).offset().left);
		}

		if (isPopular) {
			if ($(this).hasClass('olympics')) {
				$(slider_id + ' .slider').addClass('olympics');
				$('#s60, #s58, #s8, #s25, #s13, #s19, #s34, #s51').hide();
			} else {
				$(slider_id + ' .slider').removeClass('olympics');
				$('#s60, #s58, #s8, #s25, #s13, #s19, #s34, #s51').show();
			}
		}
	});
}

// sports Menu =================================================//
function submenu_link() {
	localStorage.setItem('isSoccerFifa', 'false');
	const pageMap = {
		s1: {
			beginner: () => {
				if (sessionStorage.getItem('markettype') === 'outright') {
					return 'el-prof-outright.html';
				} else if (sessionStorage.getItem('markettype') === 'oddsboost') {
					return 'all-odds-boost.html';
				}
				return sessionStorage.getItem('enterCyberBattle') === 'true' ? 'el-begin-soccer-todayCyberBattle.html' : 'el-begin-soccer-today.html';
			},
			professional: () => {
				if (sessionStorage.getItem('enterCyberBattle') === 'true') {
					return 'el-prof-soccer-todaycyberbattle.html';
				} else {
					if (sessionStorage.getItem('markettype') === 'early') {
						return 'el-prof-soccer-early.html';
					} else if (sessionStorage.getItem('markettype') === 'outright') {
						return 'el-prof-outright.html';
					} else if (sessionStorage.getItem('markettype') === 'oddsboost') {
						return 'all-odds-boost.html';
					}
				}
				return localStorage.getItem('iscurrentsimpleview') === 'true' ? 'el-begin-soccer-today.html' : 'el-prof-soccer-today.html';
			},
		},
		s52: {
			beginner: 'el-begin-virtual-kiron.html',
			professional: 'el-prof-virtual-kiron.html',
		},
		s53: {
			beginner: 'el-begin-virtual-kiron.html',
			professional: 'el-prof-virtual-betradar.html',
		},
		s571: {
			beginner: 'el-begin-virtual-sportsdraw.html',
			professional: 'el-prof-virtual-sportsdraw.html',
		},
		cs1: {
			beginner: 'el-begin-soccer-today.html',
			professional: 'el-prof-soccer-today.html',
		},
		cs3: {
			beginner: 'el-begin-tennis-today.html',
			professional: 'el-prof-tennis-today.html',
		},
		s63: {
			beginner: null,
			professional: 'el-prof-lol-today.html',
		},
		s64: {
			beginner: null,
			professional: 'el-prof-lol-today.html',
		},
		s65: {
			beginner: null,
			professional: 'el-prof-lol-today.html',
		},
		s66: {
			beginner: null,
			professional: 'el-prof-lol-today.html',
		},
		s60: {
			default: 'el-marble-magic-live.html',
		},
		swp: {
			beginner: () => {
				return sessionStorage.getItem('enterCyberBattle') === 'true' ? 'el-begin-soccer-todayCyberBattle.html' : 'el-begin-soccer-today.html';
			},
			professional: () => {
				if (sessionStorage.getItem('enterCyberBattle') === 'true') {
					return 'el-prof-soccer-todaycyberbattle.html';
				}
				return localStorage.getItem('iscurrentsimpleview') == 'true' ? 'el-begin-soccer-today.html' : 'el-prof-soccer-today.html';
			},
		},
	};

	if (window.location.href.includes('el-prof-cyber-sport.html')) {
		$('#cyber_sport').addClass('active');
	}

	$(document).on('click', '[id]', function (e) {
		if ($(e.target).closest('.devDontCopySA_leaderboard_btn, .devDontCopySA_strategies_btn').length) {
			return;
		}

		const id = $(this).attr('id'); // Get clicked element's ID
		const targetClass = $(e.target).attr('class');

		// Prevent navigation if the target has specific classes
		if (targetClass && (targetClass.includes('icon-fi-n-fav-on') || targetClass.includes('icon-fi-n-fav-off'))) {
			e.stopPropagation();
			const $parent = $(this).closest('.item');
			const $container = $parent.parent();
			if (targetClass.includes('icon-fi-n-fav-on')) {
				// For fav-off: Move to top
				$parent.slideUp(200, function () {
					$(this).prependTo($container).hide().slideDown(200); // Move to top & slide down smoothly
				});
			} else if (targetClass.includes('icon-fi-n-fav-off')) {
				// For fav-on: Move to bottom
				$parent.slideUp(200, function () {
					$(this).appendTo($container).hide().slideDown(200); // Move to bottom & slide down smoothly
				});
			}
			return;
		}
		if (id === 's60' && $(e.target).hasClass('new_tag')) {
			return;
		}
		if (pageMap[id]) {
			const layout = localStorage.getItem('iscurrentsimpleview') === 'true' ? 'beginner' : 'professional';
			let url;
			if (pageMap[id][layout]) {
				url = typeof pageMap[id][layout] === 'function' ? pageMap[id][layout]() : pageMap[id][layout];
			} else if (pageMap[id]['default']) {
				url = typeof pageMap[id]['default'] === 'function' ? pageMap[id]['default']() : pageMap[id]['default'];
			} else {
				$('#popup_sample').show();
				popupOn(false);
				return;
			}
			checkCyberbattlePage(url);
		}
	});
}

let pageHistory = [];
function cyberbattleWebLoadPage(page) {
	$.ajax({
		url: page,
		method: 'GET',
		success: function (data) {
			$('.cb_main').html(data);
			filterCyberbattleMybetContent('.cb_main');
			pageHistory.push({ content: data, url: page });
			history.pushState({ pageContent: data, pageUrl: page }, '', page);
			clickBalPromo();
		},
		error: function () {
			alert('Error loading page: ' + page);
		},
	});
}

function checkCyberbattlePage(page) {
	if (localStorage.getItem('webcyberbattle') === 'true' && sessionStorage.getItem('enterCyberBattle') === 'true') {
		cyberbattleWebLoadPage(page);
	} else {
		window.location.href = page;
	}
}

function cyberbattleBackButton() {
	if (localStorage.getItem('webcyberbattle') === 'true' && sessionStorage.getItem('enterCyberBattle') === 'true') {
		$(window).on('popstate', function () {
			cyberbattleBackFunction();
		});
	}
	$('.mock_cb_n_back_link').click(function (e) {
		e.stopPropagation();
		if (localStorage.getItem('webcyberbattle') === 'true') {
			cyberbattleBackFunction();
		} else {
			history.back();
		}
	});
}

function cyberbattleBackFunction() {
	pageHistory.pop();
	const secondToLastPage = pageHistory[pageHistory.length - 1];
	const secondToLastPageContent = secondToLastPage && secondToLastPage.content;
	const secondToLastPageUrl = secondToLastPage && secondToLastPage.url;
	if (secondToLastPageContent && secondToLastPageUrl) {
		history.pushState(
			{
				pageContent: secondToLastPageContent,
				pageUrl: secondToLastPageUrl,
			},
			'',
			secondToLastPageUrl,
		);
		$('.cb_main').html(secondToLastPageContent);
		filterCyberbattleMybetContent('.cb_main');
	}
}

function clickBalPromo() {
	$('.bal_promo').click(function (e) {
		if (e.target.closest('.promo_drpd_itm')) {
			$('.promo_drpd_tt').toggle();
		} else {
			$(this).find('.promo_arrow').toggleClass('moving_down moving_up');
			$(this).find('i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
			$('.promo_drpd').toggle();
			$('.promo_drpd_tt').hide();
		}
	});
}

// SEV =================================================//
function info_trigger() {
	if ($('.n_info_dev_can_delete').hasClass('info')) {
		if ($('.s_iframe').hasClass('showLoop')) {
			$('.n_info_dev_can_delete').addClass('info');
			$('.n_info_msg').show();
		} else {
			$('.n_info_dev_can_delete').removeClass('info');
			$('.n_info_msg').hide();
			$('.mr_sel_wrp').css('top', $('.n_header').outerHeight() + $('.mr_tracks_slider').outerHeight() + $('.s_iframe').outerHeight());
		}
	}
}

var showLoopTimeout;
var closeLoopTimeout;
function visualization_btn() {
	$('.s_iframe, .n_iframe_betradar').removeClass('showOut').addClass('showLoop');

	showLoopTimeout = setTimeout(function () {
		$('.s_iframe, .n_iframe_betradar').removeClass('showLoop').addClass('closeLoop');
		//part3 remove auto hide info
		//info_trigger();
	}, 5000);
	closeLoopTimeout = setTimeout(function () {
		$('.s_iframe, .n_iframe_betradar').removeClass('closeLoop');
	}, 5500);
}

function liveStreaming_btn() {
	showLoopTimeout = setTimeout(function () {
		$('.s_iframe, .n_iframe_betradar').removeClass('showLoop').addClass('closeLoop');
		//part3 remove auto hide info
		//info_trigger();
	}, 5000);
	closeLoopTimeout = setTimeout(function () {
		$('.s_iframe, .n_iframe_betradar').removeClass('closeLoop');
	}, 5500);
	// if (window.location.href.indexOf("el-marble-magic-live") < 0) {
	$('.s_iframe, .n_iframe_betradar').removeClass('showOut').addClass('showLoop');
	// }
}

var dashboardHeightByRatio;
var pin_on = false;
var info_on = false;
var channel_on = false;
var page = 'home';
var SEV_stickyHeigtht = 0;
var scenario_first_load = 0;
var scenarioA = 0;
var scrolledPositionFinal = 0;
var sevSlider_Top;
// Pin and Info
function SEV_Pin_AndInfo() {
	if ($('.n_sev_view.prematch').is(':visible')) {
		SEV_stickyHeigtht = $('.n_sev_view.prematch').outerHeight();
	} else {
		SEV_stickyHeigtht = dashboardHeightByRatio;
	}
	if (pin_on) {
		// $("header").removeClass("cls_header");
		$('.n_sev_view, .s_iframe').addClass('n_sticky');
		$('#sev_inlinePage').find('.cls_menu_list_fw_wrap').addClass('n_sticky');
		$('.n_info_msg').addClass('n_sticky');
		if (info_on) {
			SEV_stickyHeigtht += $('.n_info_msg').outerHeight();
		}
		$('.n_sev_view, .s_iframe').css('top', 0);
		$('.n_sev_view.prematch').css('top', 4);
		$('.n_info_msg').css('top', dashboardHeightByRatio);
		$('#sev_inlinePage').find('.cls_menu_list_fw_wrap').css('top', SEV_stickyHeigtht);
	} else {
		//$("header").addClass("cls_header");
		$('.n_sev_view, .s_iframe').removeClass('n_sticky');
		$('#sev_inlinePage').find('.cls_menu_list_fw_wrap').removeClass('n_sticky');
		$('.n_info_msg').removeClass('n_sticky');
		$('.n_sev_view, .s_iframe').css('top', '');
		$('.n_sev_view.prematch').css('top', '');
		$('.n_info_msg').css('top', '');
		$('#sev_inlinePage').find('.cls_menu_list_fw_wrap').css('top', '');
	}
}

function SEV_Group(sev_HTMLContent, haveSlider) {
	SEV_header_SelectEvent();
	/* SEV Demo Script*/
	$(window).scrollTop(0);
	$('.demoOnly_fixposition').find('.sev_popup').scrollTop(0);
	var sev_Banner_Frame = $('.n_visualization_wrap');
	var sevSlider = $('.DontCopy_test_sev_filter_menu');
	var sevSlider_stats = $('.DontCopy_test_sev_filter_menu_statistic');
	$('.not_live_yet_wrap, .chan_error_wrp').hide();
	/*Slider Select Effect*/
	if (haveSlider) {
		if ($('.DontCopy_test_sev_filter_menu .n_menu_cover .n_sports_menu').hasClass('thinner_slider')) {
			var sevSlider_Active = $('.DontCopy_test_sev_filter_menu').find('.item_wrap.active').first();
			var sevSlider_Active_item = $('.DontCopy_test_sev_filter_menu').find('.item_wrap.active .item').first();
			var pd_left = parseInt(sevSlider_Active_item.css('padding-left'));
			var pd_right = parseInt(sevSlider_Active_item.css('padding-right'));
			var total_padding = pd_left + pd_right;
			var width_no_padding = sevSlider_Active.width() - total_padding;
			var sevSlider_position = sevSlider_Active.offset().left - sevSlider.offset().left + sevSlider.scrollLeft() + pd_left;
			$('.DontCopy_test_sev_filter_menu .slider').css('width', width_no_padding);
			$('.DontCopy_test_sev_filter_menu .slider').css('left', sevSlider_position);

			$('.DontCopy_test_sev_filter_menu').on('click.itemwrap', '.item_wrap', function () {
				$('.DontCopy_test_sev_filter_menu .item_wrap').removeClass('active');
				$(this).addClass('active');
				var sevSlider_Active_item = $(this).find('.item');
				var pd_left = parseInt(sevSlider_Active_item.css('padding-left'));
				var pd_right = parseInt(sevSlider_Active_item.css('padding-right'));
				var total_padding = pd_left + pd_right;
				var width_no_padding = $(this).width() - total_padding;
				if (localStorage.getItem('webcyberbattle') === 'true') {
					sevSlider_position = $(this).offset().left + $(this).closest('.n_sports_menu').scrollLeft() + pd_left - $('.cb_main').offset().left;
				} else {
					sevSlider_position = $(this).offset().left + $(this).closest('.n_sports_menu').scrollLeft() + pd_left;
				}
				$('.DontCopy_test_sev_filter_menu .slider').css('width', width_no_padding);
				$('.DontCopy_test_sev_filter_menu .slider').css('left', sevSlider_position);

				if ($(this).hasClass('ob_active')) {
					$('.DontCopy_test_sev_filter_menu .slider').addClass('ob_active');
				} else {
					$('.DontCopy_test_sev_filter_menu .slider').removeClass('ob_active');
				}
			});
		} else {
			var sevSlider_Active = $('.DontCopy_test_sev_filter_menu .item_wrap.active');
			var sevSlider_position = sevSlider_Active.offset().left - sevSlider.offset().left + sevSlider.scrollLeft();
			$('.DontCopy_test_sev_filter_menu .slider').css('left', sevSlider_position);
			$('.DontCopy_test_sev_filter_menu .slider').css('width', sevSlider_Active.width());
			$('.DontCopy_test_sev_filter_menu .item_wrap').click(function () {
				$('.DontCopy_test_sev_filter_menu .item_wrap').removeClass('active');
				$(this).addClass('active');
				sevSlider_position = $(this).offset().left - sevSlider.offset().left + sevSlider.scrollLeft();
				$('.DontCopy_test_sev_filter_menu .slider').css('width', $(this).width());
				$('.DontCopy_test_sev_filter_menu .slider').css('left', sevSlider_position);
			});
		}
	}

	SEV_BT_function();
	SEV_BT_fav();

	/*SEV Slider Sticky Position*/
	var sev_Banner_Frame_InnerBottom_Height = $('.n_sev_bottom').outerHeight();
	if (sev_Banner_Frame_InnerBottom_Height == null) {
		sev_Banner_Frame_InnerBottom_Height = 0;
	}

	//var sevSlider_Top = sev_Banner_Frame.outerHeight() - sev_Banner_Frame_InnerBottom_Height;
	var sevSlider_Top = $('#sample_tw_pin').outerHeight();
	var sevSlider_Pinned_Top = sevSlider_Top;
	var sevSlider_Pinned_withInfo_Top = sevSlider_Top;
	sevSlider.css('top', sevSlider_Top);
	sevSlider_stats.css('top', sevSlider_Top);
	sevSlider.css('z-index', 5);

	$('.n_sev_view').addClass('n_sticky');
	sevSlider.addClass('n_sticky');

	if ($('#sample_side_oddsPanel').hasClass('side_bar_shown')) {
		sevSlider.css('top', 0);
	}

	/*SEV: starts*/
	var page = 'home';
	var device_width = $(window).width();
	var iframeRatio = device_width * (322.25 / 520); /*ratio from betradar*/
	var iframeRatio = device_width * (257.95 / 363); /*ratio from betradar with footer*/

	$('.s_iframe, .n_sev_top').css('height', iframeRatio + 'px');
	if (localStorage.getItem('webcyberbattle') === 'true') {
		$('.n_sev_top').css('height', 480 * (257.95 / 363) + 'px');
	}
	$('.s_iframe').hide();
	$('.n_info_msg').hide();
	//$("#sample_tw_pin .n_back").css("visibility", "hidden");
	$('#sample_tw_pin .n_back, #sample_tw_pin .evnt_id').hide();

	function havePinned() {
		$('.s_iframe').css('top', $('.n_header_sev').outerHeight());

		if (page == 'home') {
			sevSlider_Pinned_Top = $('.cb_filter_itm.autoPin').hasClass('active') && $('.cb_sev_view').outerHeight();
		}
		if (page == 'live' || page == 'visual' || page == 'h2h') {
			sevSlider_Pinned_Top = sev_Banner_Frame.outerHeight() + $('.s_iframe').outerHeight();
		}
		if (page == 'h2h') {
			sevSlider_Pinned_Top = ev_Banner_Frame.outerHeight() + $('.s_iframe').outerHeight() + $('.new_h2h_wrp').outerHeight();

			$('.new_h2h_wrp').css('top', sevSlider_Pinned_Top - $('.new_h2h_wrp').outerHeight());
		}
		sevSlider_Pinned_withInfo_Top = sevSlider_Pinned_Top;
		sevSlider.css('top', sevSlider_Pinned_Top);
		sevSlider_stats.css('top', sevSlider_Pinned_Top);

		if ($('.n_info_dev_can_delete').hasClass('info')) {
			$('.n_info_msg').css('top', sevSlider_Pinned_Top);
			//part3 when pin, info also pinned
			sevSlider.css('top', sevSlider_Pinned_withInfo_Top + $('.n_info_msg').outerHeight());
			sevSlider_stats.css('top', sevSlider_Pinned_withInfo_Top + $('.n_info_msg').outerHeight());
		}
	}
	function noPin() {
		if (page == 'home') {
			sevSlider_Top = $('.cb_filter_itm.autoPin').hasClass('active') ? $('.n_header_sev').outerHeight() : $('#sample_tw_pin:visible').outerHeight();
		}
		if (page == 'live' || page == 'visual' || page == 'h2h') {
			sevSlider_Top = sev_Banner_Frame.outerHeight();
		}
		if (sessionStorage.getItem('enterCyberBattle') === 'true' && $('.cb_filter_itm.autoPin').hasClass('active')) {
			$('.n_header_sev').show();
		}
		sevSlider.css('top', sevSlider_Top);
		sevSlider_stats.css('top', sevSlider_Top);
		$('.new_h2h_wrp').css('top', 'unset');
		$('.s_iframe').css('top', 'unset');
		$('.n_info_msg').css('top', 'unset');
	}

	//change view to statistic/ SEV
	$('.n_visualization_horizontal_wrap .devDontCopy_stats_icon').click(function () {
		//stats button trigger error msg popup
		if ($(this).hasClass('er_trigger')) {
			$(this).addClass('grey_out');
			$(this).removeClass('active');
			$('.smallpop').find('.smallpop_wrp_inner').html('Statistics is currently not available for this event.');
			$('.smallpop').show();

			setTimeout(function () {
				$('.smallpop').hide();
				$('.n_visualization_horizontal_wrap .devDontCopy_stats_icon').removeClass('grey_out');
				$('.n_visualization_horizontal_wrap .devDontCopy_stats_icon').addClass('active');
				$('.n_visualization_horizontal_wrap .devDontCopy_stats_icon').removeClass('er_trigger');
			}, 2000);
			return;
		} else {
			$(this).addClass('er_trigger');
		}

		var contentminheight = $(window).outerHeight() - 5 - $('.sev_compact').outerHeight() - $('.n_sports_menu').outerHeight() - $('#main_footer').outerHeight();
		sevSlider_stats.show();
		//$("#sample_dev_dont_copy_stats").show();
		//$("#sample_dev_dont_copy_stats").siblings(".n_visualization_btn").hide();
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			/*  $("#sample_dev_dont_copy_stats").hide();
			 $("#sample_dev_dont_copy_stats").siblings(".n_visualization_btn").show(); */
			$('.DontCopy_test_sev_filter_menu').show();
			$('#sev_stats_container_sample').css('display', 'none');
			$('.n_sev_item_content_wrap').css('display', '');
			$('body').removeClass('n_body_stats');
		} else {
			$(this).addClass('active');
			$('.DontCopy_test_sev_filter_menu').hide();
			$('#sev_stats_container_sample').css('display', '');
			$('.n_sev_item_content_wrap').css('display', 'none');
			$('body').addClass('n_body_stats');
			var iframeHeight = $(window).outerHeight() - $('.n_sev_view').outerHeight() - $('.DontCopy_test_sev_filter_menu_statistic').outerHeight() - 98;
			$('#iframe_statistics').css('height', iframeHeight);
		}
		//h2h
		$('.DontCopy_test_sev_filter_menu_statistic').hide();
		$('.n_sev_item_content_wrap').css('display', 'block');
		$('.n_sev_view').css('z-index', 5);
		$('#sev_stats_container_sample').hide();
		$('.new_h2h_wrp').show();
		$('.s_iframe').show();
		$('.s_sev_top').hide();
		$('.DontCopy_test_sev_filter_menu').show();
		$('#open_H2H_window').show();
		page = 'h2h'; // split from 'page=home'
		$('.n_visualization_horizontal_wrap, .s_nav_btn_wrp').hide();
		$('.n_visualization_vertical_btm_wrap').removeClass('withfooter');
	});

	// DES-519: show stat when click on world cup stat icon
	$('.n_visualization_horizontal_wrap .DontCopy_world_cup').click(function () {
		var contentminheight = $(window).outerHeight() - 5 - $('.sev_compact').outerHeight() - $('.n_sports_menu').outerHeight() - $('#main_footer').outerHeight();
		sevSlider_stats.show();
		$('.DontCopy_world_cup').hide();
		$('.DontCopy_worldcup_chanindi').show();
		$('.DontCopy_test_sev_filter_menu').hide();
		$('.sev_inner_world_cup_stat').show();
		$('#sev_stats_container_sample').css('display', 'none');
		$('.n_sev_item_content_wrap').css('display', 'none');
		$('body').addClass('n_body_stats');
		$('.DontCopy_test_sev_filter_menu_statistic').hide();
		$('.DontCopy_world_cup_stat').show();
		$('.DontCopyDev_today').show();
		// show different tab content for world cup stat icon
		var sevSlider_Active = $('.DontCopy_world_cup_stat .item_wrap.active');
		var sevSlider_Active_item = $('.DontCopy_world_cup_stat .item_wrap.active .item');
		var pd_left = parseInt(sevSlider_Active_item.css('padding-left'));
		var pd_right = parseInt(sevSlider_Active_item.css('padding-right'));
		var total_padding = pd_left + pd_right;
		var width_no_padding = sevSlider_Active.width() - total_padding;
		var sevSlider_position = sevSlider_Active.offset().left - sevSlider.offset().left + sevSlider.scrollLeft() + pd_left;
		$('.DontCopy_world_cup_stat .n_sports_menu .slider').css('left', sevSlider_position);
		$('.DontCopy_world_cup_stat .n_sports_menu .slider').css('width', width_no_padding);
		$('.DontCopy_world_cup_stat .n_sports_menu .item_wrap').click(function () {
			$('.DontCopy_world_cup_stat .n_sports_menu .item_wrap').removeClass('active');
			$('.tab_nav .tab_nav_item').removeClass('active');
			$('.DontCopyDev_schedule, .DontCopyDev_standings, .DontCopyDev_history').hide();
			$('.DontCopyDev_today, .DontCopyDev_group_stage, .DontCopyDev_knockout_stage, .DontCopyDev_all').hide();
			$(this).addClass('active');
			var tab = $(this).text().trim().toLowerCase();
			$('.DontCopyDev_' + tab).show();
			if (tab == 'schedule') {
				$(".tab_nav .tab_nav_item:contains('Today')").addClass('active');
				$('#world_cup_stats_container_sample').show();
				$('.DontCopyDev_today').show();
				$('.DontCopyDev_group_stage').hide();
				$('.DontCopyDev_all').hide();
			} else if (tab == 'standings') {
				$(".tab_nav .tab_nav_item:contains('Group Stage')").addClass('active');
				$('#world_cup_stats_container_sample').show();
				$('.DontCopyDev_today').hide();
				$('.DontCopyDev_group_stage').show();
				$('.DontCopyDev_all').hide();
			} else if (tab == 'history') {
				$(".tab_nav .tab_nav_item:contains('All')").addClass('active');
				$('#world_cup_stats_container_sample').show();
				$('.DontCopyDev_today').hide();
				$('.DontCopyDev_group_stage').hide();
				$('.DontCopyDev_knockout_stage').hide();
				$('.DontCopyDev_all').show();
			}
			var sevSlider_Active_item = $(this).find('.item');
			var pd_left = parseInt(sevSlider_Active_item.css('padding-left'));
			var pd_right = parseInt(sevSlider_Active_item.css('padding-right'));
			var total_padding = pd_left + pd_right;
			var width_no_padding = $(this).width() - total_padding;
			sevSlider_position = $(this).offset().left - sevSlider.offset().left + sevSlider.scrollLeft() + pd_left;
			$('.DontCopy_world_cup_stat .n_sports_menu .slider').css('left', sevSlider_position);
			$('.DontCopy_world_cup_stat .n_sports_menu .slider').css('width', width_no_padding);
		});
		$('.DontCopy_world_cup_stat .tab_nav .tab_nav_item').click(function () {
			$('.DontCopy_world_cup_stat .tab_nav .tab_nav_item').removeClass('active');
			$('.DontCopyDev_today, .DontCopyDev_group_stage, .DontCopyDev_knockout_stage, .DontCopyDev_all').hide();
			$(this).addClass('active');
			$('#world_cup_stats_container_sample').show();
			var tab = $(this).text().toLowerCase().replace(/ /g, '_');
			$('.DontCopyDev_' + tab).show();
		});
	});

	$('.DontCopy_worldcup_chanindi').click(function () {
		sevSlider_stats.hide();
		$('.DontCopy_world_cup').show();
		$('.DontCopy_worldcup_chanindi').hide();
		$('.DontCopy_test_sev_filter_menu').show();
		$('.sev_inner_world_cup_stat').hide();
		$('#sev_stats_container_sample').css('display', 'none');
		$('.n_sev_item_content_wrap').css('display', '');
		$('body').removeClass('n_body_stats');
		$('.DontCopy_world_cup_stat').hide();
		$('.schedule_team_wrp').hide();
	});

	//trigger stats & volume
	$('.n_volume_dev_can_delete').click(function () {
		$(this).find('i').toggleClass('icon-fi-voice-on icon-fi-voice-mute');
		$(this).toggleClass('volume');
	});

	// trigger pin & unpin - change $(".n_pin_dev_can_delete").hasClass("pin") ? true : havePinned(), noPin(); to if else logic
	$('.n_pin_dev_can_delete').click(function () {
		if (!$(this).hasClass('pin')) {
			$(this).find('i').addClass('pinned');
			$(this).addClass('pin');
			$('.s_iframe').addClass('n_sticky');
			$('.n_info_msg').addClass('n_sticky');
			$('.new_h2h_wrp').addClass('n_sticky');
			havePinned();
		} else {
			$(this).find('i').removeClass('pinned');
			$(this).removeClass('pin');
			$('.s_iframe').removeClass('n_sticky');
			$('.n_info_msg').removeClass('n_sticky');
			$('.new_h2h_wrp').removeClass('n_sticky');
			noPin();
		}
	});

	//trigger info
	$('.n_info_dev_can_delete').click(function () {
		$(this).toggleClass('info');
		$('.n_info_msg').toggle();
		if ($('.n_pin_dev_can_delete').hasClass('pin')) {
			if ($('.n_info_dev_can_delete').hasClass('info')) {
				$('.n_info_msg').css('top', sevSlider_Pinned_Top);
				sevSlider.css('top', sevSlider_Pinned_withInfo_Top);
				sevSlider_stats.css('top', sevSlider_Pinned_withInfo_Top);
			} else {
				sevSlider.css('top', sevSlider_Pinned_Top);
				sevSlider_stats.css('top', sevSlider_Pinned_Top);
				$('.n_info_msg').css('top', 'unset');
			}
		}
	});
	$('#visualization_btn').click(function () {
		$('.s_iframe').show();
		$('#open_visualization').show();
		$('#open_live_streaming').hide();
		$('.n_info_msg').hide();
		$('.n_sev_bottom').hide();
		$('.n_sev_top').hide();
		$('.n_sev_view').css('z-index', 5);
		page = 'visual';
	});
	var sample_live_toggle = false;
	$('#live_streaming_btn').click(function () {
		if (sample_live_toggle === false) {
			$('.s_iframe').show();
			$('#open_visualization').hide();
			$('#open_live_streaming').show();
			$('.n_info_msg').hide();
			$('.n_sev_bottom').hide();
			$('.n_sev_top').hide();
			$('.n_sev_view').css('z-index', 5);
			page = 'live';
			sample_live_toggle = true;
		} else {
			//$('.not_live_yet_wrap').show(0).delay(3000).hide(0);
			//[SFCRQ-2719][Asian View Mobile] To implement new handling for message pop up
			$('.smallpop').show();
			$('.smallpop .smallpop_wrp_inner').text('赛事暂未开始');

			setTimeout(function () {
				$('.smallpop').hide();
				$('.smallpop .smallpop_wrp_inner').text('最多可选择10个投注项');
			}, 3000);
			sample_live_toggle = false;
		}
	});
	$('#open_visualization img').click(function (e) {
		if (e.target.classList[0] == 'n_visualization_btn') {
			return;
		}
		clearTimeout(showLoopTimeout);
		clearTimeout(closeLoopTimeout);
		visualization_btn();
	});
	$('#open_live_streaming video, #open_live_streaming .n_sev_media_restricted_wrap, #open_live_streaming iframe').click(function () {
		$('.n_visualization_vertical_btm_wrap, .n_visualization_horizontal_wrap, .s_nav_btn_wrp').show();
		clearTimeout(showLoopTimeout);
		clearTimeout(closeLoopTimeout);
		liveStreaming_btn();
	});
	window.focus();
	window.addEventListener('blur', () => {
		setTimeout(() => {
			if (document.activeElement.tagName === 'IFRAME' && document.activeElement.className == 'result_iframe') {
				clearTimeout(showLoopTimeout);
				clearTimeout(closeLoopTimeout);
				liveStreaming_btn();
				window.focus();
			}
		});
	});

	//Channel button
	//var sample_channel_toggle = false;
	//$(".sampleMockOnly_channel").click(function () {
	//    if (sample_channel_toggle == false) {
	//        $(".chan_popup").show();
	//        $(".s_iframe").removeClass("showLoop").addClass("showStay");
	//        sample_channel_toggle = true;
	//    } else {
	//        $('.s_iframe').addClass("overflowUnset");
	//        $('.chan_error_wrp').show();
	//        sevSlider.addClass("chan_zIndex");
	//        setTimeout(function () {
	//            $('.s_iframe').removeClass("overflowUnset");
	//            $('.chan_error_wrp').hide();
	//            sevSlider.removeClass("chan_zIndex");
	//        }, 5000);
	//        sample_channel_toggle = false;
	//    }
	//});

	//[SFCRQ-2719][Asian View Mobile] To implement new handling for message pop up
	$('.sampleMockOnly_channel').click(function () {
		$('.chan_popup').show();
		$('.s_iframe').removeClass('showLoop closeLoop').addClass('showStay');
	});
	$('.chan_popup').on('click', function () {
		$('.chan_popup').hide();
		$('.s_iframe').removeClass('showStay').addClass('showOut');
	});
	$('.chan_btn')
		.not('#dont_copy_channel_popup')
		.on('click', function () {
			$('.chan_btn').removeClass('active');
			$(this).addClass('active').parents('.n_iframe_visualization').find('.chan_indi div').text($(this).text());
		});
	$('#dont_copy_channel_popup').on('click', function () {
		$('.smallpop').show();
		$('.smallpop .smallpop_wrp_inner').text('There are no other channels available at the moment');

		setTimeout(function () {
			$('.smallpop').hide();
			$('.smallpop .smallpop_wrp_inner').text('最多可选择10个投注项');
		}, 5000);
	});

	$('#dont_copy_bet_error_popup').on('click', function () {
		$('.bet_error_wrap').show();

		setTimeout(function () {
			$('.bet_error_wrap').hide();
		}, 5000);
	});

	/*switching between visualization and live stream: start*/
	$('.s_nav_left .s_nav_btn').click(function () {
		$('#open_visualization').addClass('slide_to_left');
		$('#open_live_streaming').addClass('slide_to_right');
		clearTimeout(showLoopTimeout);
		clearTimeout(closeLoopTimeout);
		visualization_btn();

		setTimeout(function () {
			$('#open_visualization').show().removeClass('slide_to_left');
		}, 30);
		if ($('#open_live_streaming').find('.n_pin_dev_can_delete').hasClass('pin')) {
			$('#open_visualization').find('.n_pin_dev_can_delete').addClass('pin');
			$('#open_visualization').find('.n_pin_dev_can_delete i').addClass('pinned');
		} else {
			$('#open_visualization').find('.n_pin_dev_can_delete').removeClass('pin');
			$('#open_visualization').find('.n_pin_dev_can_delete i').removeClass('pinned');
		}
	});
	$('.s_nav_right .s_nav_btn').click(function () {
		$('#open_visualization').addClass('slide_to_left');
		$('#open_live_streaming').addClass('slide_to_right');
		clearTimeout(showLoopTimeout);
		clearTimeout(closeLoopTimeout);
		liveStreaming_btn();

		setTimeout(function () {
			$('#open_live_streaming').show().removeClass('slide_to_right');
		}, 30);
		if ($('#open_visualization').find('.n_pin_dev_can_delete').hasClass('pin')) {
			$('#open_live_streaming').find('.n_pin_dev_can_delete').addClass('pin');
			$('#open_live_streaming').find('.n_pin_dev_can_delete i').addClass('pinned');
		} else {
			$('#open_live_streaming').find('.n_pin_dev_can_delete').removeClass('pin');
			$('#open_live_streaming').find('.n_pin_dev_can_delete i').removeClass('pinned');
		}
	});
	/*switching between visualization and live stream: start*/
	$('.demoOnly_dontCopy_close').click(function () {
		page = 'home';
		$('.n_sev_view').css('z-index', 1);
		$('.s_iframe').hide();
		$('#open_visualization').removeClass('slide_to_left');
		$('#open_live_streaming').removeClass('slide_to_right');
		$('.s_iframe').removeClass('showLoop closeLoop showOut');
		$('.n_info_msg').hide();
		$('.n_sev_bottom').show(); // show back visual/live stream button
		$('.s_iframe').removeClass('n_sticky');
		$('.s_iframe').css('top', 'unset');
		$('.n_pin_dev_can_delete').removeClass('pin');
		$('.n_pin_dev_can_delete').css('top', 'unset');
		//$(".n_pin_dev_can_delete").find("i").replaceWith('<i class="icon-fi-n-unpin"></i>');
		$('.n_info_dev_can_delete').removeClass('info');
		$('.n_info_msg').removeClass('n_sticky');
		$('.n_info_msg').css('top', 'unset');
		//$("#sample_chan_indi").addClass("chan_wrp");
		//$(".chan_indi").show();
		$('.n_sev_top').show();
		sevSlider.css('top', sevSlider_Top);
		sevSlider_stats.css('top', sevSlider_Top);
		//h2h
		$('.DontCopy_test_sev_filter_menu_statistic').hide();
		$('.n_sev_item_content_wrap').show();
		$('#sev_stats_container_sample').hide();
		$('.new_h2h_wrp').hide();
		$('.s_iframe').hide();
		$('.s_sev_top').show();
		$('.DontCopy_test_sev_filter_menu').show();
		$('#open_H2H_window').hide();
		$('.n_visualization_horizontal_wrap').show();
	});
	//inside load content starts
	function SEV_insideLoadContent() {
		$('#toTop').click(function () {
			$('html, body').animate({ scrollTop: 0 }, 1000);
		});
		$('.demoOnly_fixposition #toTop').click(function () {
			$('.demoOnly_fixposition .n_container').animate({ scrollTop: 0 }, 1000);
		});
		var scrolledPositionFinal = localStorage.getItem('isCyberBattle') === 'true' && $('.cb_filter_itm.autoPin').hasClass('active') ? iframeRatio - $('.cb_hdr_sev').outerHeight() - $('.n_header_sev').outerHeight() - $('.DontCopy_test_sev_filter_menu').outerHeight() : $('.n_sev_view').outerHeight() - sevSlider_Top;
		// dumb way to prevent overloaded
		var scenario_first_load = 0;
		var scenarioA = 0;
		if (scenario_first_load == 0) {
			$('#sev_content').css('will-change', 'auto');
			if (page == 'home') {
				$('.sev_compact').css('z-index', -1);
				$('.n_content_wrap_wth_bcktop').addClass('n_sticky');
				$('.n_content_wrap_wth_bcktop').css('z-index', 2);
			} else {
				$('.n_content_wrap_wth_bcktop').css('z-index', 0);
				$('.n_content_wrap_wth_bcktop').removeClass('n_sticky');
			}
			scenario_first_load = 1;

			var n_sports_menu_w;
			if (localStorage.getItem('webcyberbattle') === 'true' && sessionStorage.getItem('enterCyberBattle') === 'true') {
				n_sports_menu_w = 480 - $('.mock_sev_collapse_expand_btn').outerWidth(true) + 'px';
			} else {
				n_sports_menu_w = $(window).width() - $('.mock_sev_collapse_expand_btn').outerWidth(true) + 'px';
			}
			$('.n_sev_slider.w_sld_new').css('width', n_sports_menu_w);
		}
		function prematchScroll(thisDIV) {
			if (thisDIV.scrollTop() >= scrolledPositionFinal) {
				if (scenarioA == 0) {
					$('.n_content_wrap_wth_bcktop').removeClass('n_sticky');
					const startTime = performance.now();
					if (localStorage.getItem('isCyberBattle') === 'true') {
						$('.cb_filter_wrp').css({
							'z-index': -1,
							top: -40,
							position: 'fixed',
						});
						$('#sample_tw_pin:visible #sample_tw_top').hide();
						if ($('.cb_filter_itm.autoPin').hasClass('active')) {
							$('.n_header_sev').show();
							if (!$('.n_pin_dev_can_delete').hasClass('pin')) {
								$('.n_sev_top').css('height', 0);
							} else {
								$('.n_sev_top').css('height', iframeRatio + 'px');
							}
						} else {
							$('.n_header_sev').hide();
							$('.n_sev_top').css('height', $('#sample_tw_pin:visible').outerHeight());
						}
					} else {
						$('.n_header_sev').hide();
						$('.n_sev_top').css('height', $('.evnt_id').length > 0 ? $('#sample_tw_pin').outerHeight() + $('.evnt_id').outerHeight() : $('#sample_tw_pin').outerHeight());
					}
					if (page == 'home') {
						$('.n_content_wrap_wth_bcktop').css('z-index', 0); //des 109
						$('.sev_compact').css('z-index', 2);
						//reflow
						$('#sev_content').css('margin-top', scrolledPositionFinal);
						/* wh sev*/
						var contentminheight = $(window).outerHeight() - 5 - $('.sev_compact').outerHeight() - $('.n_sports_menu').outerHeight() - $('.footer_main').outerHeight();
						console.log('=====$(".footer_main").outerHeight(): ' + $('.footer_main').outerHeight());
						$('#sev_content').css('min-height', contentminheight);
						//here $(".n_sev_period").html() =
						$('#sample_tw_top').hide();
						$('#sample_tw_pin .n_back, #sample_tw_pin .evnt_id').show();
						$('#sample_tw_pin .n_team_top, #sample_tw_pin .n_team_bottom').addClass('s_fadeIn');
						$('#sample_tw_pin .n_team_top, #sample_tw_pin .n_team_bottom').removeClass('s_fadeOut');
						$('#sample_tw, .n_sev_bottom, .s_score_wrp').hide();
					}
					scenarioA = 1;
					// Do the normal stuff for this function
					const duration = performance.now() - startTime;
					console.log(`A: someMethodIThinkMightBeSlow took ${duration}ms`);
					$('.promo_drpd').hide();
					$('.promo_arrow').removeClass('moving_up').addClass('moving_down');
				}
			} else {
				if (scenarioA == 1) {
					if (localStorage.getItem('isCyberBattle') === 'true') {
						$('.cb_filter_wrp').css({
							'z-index': 0,
							top: 0,
							position: 'relative',
						});
					}
					if (page == 'home') {
						const startTimeB = performance.now();
						$('.sev_compact').css('z-index', -1);
						$('.n_sev_view').css('z-index', 1);
						$('#sev_content').css('min-height', '');
						$('.n_content_wrap_wth_bcktop').css('z-index', 2); //109
						$('.n_sev_top').css('height', iframeRatio + 'px');
						$('#sev_content').css('margin-top', '');
						$('#sample_tw, .n_sev_bottom, .s_score_wrp, .n_header_sev').show();
						$('#sample_tw_top').show();
						$('#sample_tw_pin .n_back, #sample_tw_pin .evnt_id').hide();
						$('#sample_tw_pin .n_team_top, #sample_tw_pin .n_team_bottom').removeClass('s_fadeIn');
						$('#sample_tw_pin .n_team_top, #sample_tw_pin .n_team_bottom').addClass('s_fadeOut');
						$('.n_content_wrap_wth_bcktop').addClass('n_sticky');
						const durationB = performance.now() - startTimeB;
						console.log(`B: someMethodIThinkMightBeSlow took ${durationB}ms`);
					}
					scenario_first_load = 0;
					scenarioA = 0;
				}
			}
			$('#toTop').addClass('show');
			if ($('.n_pin_dev_can_delete').hasClass('pin')) {
				havePinned();
			} else {
				noPin();
			}
		}
		$(window).scroll(function () {
			prematchScroll($(this));
		});
		$('.demoOnly_fixposition')
			.find('.sev_popup')
			.scroll(function () {
				prematchScroll($(this));
			});
		setTimeout(function () {
			// timeout for demo only, dev please ignore
			$('.odds_box').on('click', function () {
				oddscount($(this).parent(), $(this), 'sev');
				$('.n_footer_combo.v2').show();
			});
		}, 100);
	}
	//inside load content ends
	if (sev_HTMLContent != '') {
		$('#sev_all').load(sev_HTMLContent, function () {
			SEV_insideLoadContent();
		});
	} else {
		SEV_insideLoadContent();
	}
	$('#close_sev_popup').on('click', function () {
		$('#toTop').removeClass('btn_backtop_popup');
		// for fav page
		$('.n_footer').html('<div class="item" id="index"><div class="icon"><i class="icon-fi-n-home"></i></div>主页</div><div class="item" id="betslips_home"> <div class="icon"><i class="icon-fi-n-betlist"></i></div>注单 </div><div class="item" id="results"> <div class="icon"><i class="icon-fi-n-results"></i></div>赛果 </div><div class="item" id="search"> <div class="icon"><i class="icon-fi-n-search"></i></div>搜索 </div><div class="item active" id="myfav"> <div class="icon"><i class="icon-fi-n-myfav-active"></i></div>收藏 (100) </div>');
		//other event listing
		$('#main_footer').load('../html_asia/_footer_eventlisting.html', function () {});
		$('.sev_popup').hide();
		$('body').addClass('animated n_slideBack');
		$('body').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
			$('body').removeClass('animated n_slideBack');
		});
		$('body').removeClass('n_popupOn');
		$('body > .n_container').show();
		$('body > .n_container').css('pointer-events', '');
		$('#toTop').removeClass('btn_backtop_popup');
	});

	$('.int_wrp .n_indicator').click(function () {
		$(this).addClass('active');
		$(this).closest('.n_team_wrap').css('content-visibility', 'visible');
	});

	$('.int_wrp .info_wrp').click(function () {
		$(this).closest('.n_team_wrap').css('content-visibility', 'visible');
	});

	$('.n_sev_header .n_indicator').click(function (e) {
		e.stopPropagation();
		$(this).addClass('active');
	});

	/*standardize popup and toolti: start*/
	infoPop('.bet_type');
	/*standardize popup and toolti: end*/
}
// SEV header event selector ============================//
function SEV_header_SelectEvent_toogle() {
	$('.list_box_wrap.loading').hide();
	$('.n_header_sev >.title, .n_header_sev >.s_title_wrp').toggleClass('selected');
	$('.n_header_sev >.title, .n_header_sev >.s_title_wrp').find('.event_selection_expand i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
	$('body').toggleClass('n_popupOn');
}
function SEV_header_SelectEvent() {
	$('.n_header_sev >.title, .n_header_sev >.s_title_wrp').click(function () {
		SEV_header_SelectEvent_toogle();
		if ($(this).hasClass('selected')) {
			$('.list_box_wrap:not(.loading)').show().removeClass('slideIn').addClass('slideOut');
			$('.event_selection_dropdown').show();
		} else {
			$('.list_box_wrap:not(.loading)').removeClass('slideOut').addClass('slideIn');
			setTimeout(function () {
				$('.event_selection_dropdown').hide();
			}, 300);
		}
	});

	$('.event_selection_wrap').on('click', function (e) {
		if (e.target !== this) {
			return;
		} else {
			$('.list_box_wrap:not(.loading)').removeClass('slideOut').addClass('slideIn');
			SEV_header_SelectEvent_toogle();
			setTimeout(function () {
				$('.event_selection_dropdown').hide();
			}, 300);
		}
	});

	$('.list_box_wrap:not(.loading)').scroll(function () {
		var scroll = $('.list_box_wrap:not(.loading)').scrollTop();
		if (scroll > 0) {
			$('.scroll_icon_wrap').addClass('hide');
		} else {
			$('.scroll_icon_wrap').removeClass('hide');
		}
		//scroll > 0 ? true : $('.scroll_icon_wrap').addClass("hide"), $('.scroll_icon_wrap').removeClass("hide");
	});
}

// Events: Event Listing ============================//
var myHeight = [];
var headerHeight;
function eventlisting() {
	var lastScrollLeft = 0;
	$('.n_event_listing .odds_grp').scroll(function () {
		var documentScrollLeft = $(this).scrollLeft();
		if (lastScrollLeft !== documentScrollLeft) {
			$(this).parents('.n_event_listing').find('.odds_grp').scrollLeft($(this).scrollLeft());
			lastScrollLeft = documentScrollLeft;
		}
	});
	$('.iconPop .n_indicator').click(function () {
		$('.iconPop .n_indicator').removeClass('active');
		$(this).addClass('active');
	});
	$('.int_wrp .n_indicator').click(function () {
		$(this).addClass('active');
	});
}

// Bet placement actions ******************************//
var betcount = 2;
function oddscount(thisArea, thisItem, type) {
	if (thisArea.find('.add').length) {
		if (type == 'prof') {
			thisArea.removeClass('add');
		}
		//else if (type == "begin") {
		//    thisItem.find(".odds").removeClass("add");
		//}
		else if (type == 'begin') {
			thisItem.removeClass('add');
		} else if (type == 'sev') {
			thisItem.removeClass('add');
		} else if (type == 'cftg') {
			thisItem.removeClass('add');
		}

		betcount -= 1;
	} else {
		if (betcount >= 10) {
			$('.smallpop').css('display', '');
			/* mock only, real scenario for X sec please follow requirement*/
			setTimeout(function () {
				$('.smallpop').css('display', 'none');
			}, 1000);
		} else {
			if (type == 'prof') {
				thisItem.html('<span class="add">' + thisItem.text() + '</div>');
			}
			//else if (type == "begin") {
			//    thisItem.find(".odds").addClass("add");
			//}
			else if (type == 'begin') {
				thisItem.addClass('add');
			} else if (type == 'sev') {
				thisItem.addClass('add');
			} else if (type == 'cftg') {
				thisItem.addClass('add');
			}

			betcount += 1;
		}
	}
	$('.n_footer_combo.v2 .count').text(betcount);
}

// Main Event Listing ============================//
function OverallEventListing(market, sevfile) {
	submenu_link();
	$('.sev_popup').hide();
	loadAiPlaybookShells(document);

	$('.event_selection_dropdown').load('../html_asia/_popup_sev_dropdown_eventselection.html', function () {});

	eventlisting();
	$('#mybet').load('_popup_mybet_unsettled.html', function () {
		$('#mybet').on('scroll', function () {
			$(this).find('.info_wrp').removeClass('active');
		});
	});
	$('#largebetinsights').load('_popup_largebet_insights.html');
	$('#dragcb').load('_popup_dragcb.html');
	loadAsiaSelectPopupData();
	$('#main_footer').load('../html_asia/_footer_eventlisting.html', function () {
		syncAsiaFooterControls(this);
		restoreAiPlaybookSev();
	});

	//[SFCRQ-3477][Asian] Sports Panel and Bottom Panel UX Change: start
	var headerHeight = $('.n_header').outerHeight(); //40px
	var EventListingHeaderHeight = $('.n_event_listing_header').outerHeight(); //27px
	var sportsPanelHeight = $('.el_header_grp').outerHeight(); //64px
	var virtualSportsHeader = 27;
	var vrTimerHeight = $('.vr_timer').outerHeight(); //31px
	var SFrameHeight = 204;

	$('.n_sticky').each(function (index) {
		$('.el_header_grp').css('top', headerHeight);

		function scrollSticky() {
			if (window.location.href.indexOf('virtual') === -1) {
				if ($('.n_event_listing_header').prev('.ob_listing_hdr')) {
					$('.n_event_listing_header').css('top', headerHeight + 1);
				} else {
					$('.n_event_listing_header').css('top', headerHeight);
				}

				// racing
				if (window.location.href.indexOf('el-prof-racing-today') > -1) {
					if ($('.s_iframe').hasClass('n_sticky')) {
						$('.el_header_grp').css('top', headerHeight);
						$('.n_event_listing_header').css('top', headerHeight + sportsPanelHeight + $('.s_iframe').outerHeight());
						$('.rac_sev_wrp').css('top', headerHeight + sportsPanelHeight);
					} else {
						$('.el_header_grp').css('top', '');
						$('.n_event_listing_header').css('top', headerHeight);
						$('.rac_sev_wrp').css('top', '');
					}
				} else {
					$('.n_event_listing_header').css('top', headerHeight);
					//odds boost
					$('.ob_listing_hdr').css('top', headerHeight);
					$('.n_grp_header').css('top', headerHeight + EventListingHeaderHeight);
					$('.lv2').css('top', headerHeight + EventListingHeaderHeight); //sample shown in el-prof-favorites.html or el-prof-soccer-live.html
					$('.lv3 .n_sticky').css('top', headerHeight + EventListingHeaderHeight * 2); //sample shown in el-prof-favorites.html or el-prof-soccer-live.html
				}
			} else if (window.location.href.indexOf('soccer') > -1) {
				//el-prof-virtual-soccer-today.html
				$('.virtual_sports_header').css('top', headerHeight);
			} else if (window.location.href.indexOf('kiron') === -1 && window.location.href.indexOf('betradar') === -1) {
				if (sessionStorage.getItem('enterCyberBattle') === 'true') {
					$('.vr_timer').css('top', 0);
				} else {
					$('.vr_timer').css('top', headerHeight);
				}
			}
			//pin from unpin, menu jumping issue
			// if (!$('.rac_sev_wrp').find('.n_pin_dev_can_delete').hasClass('pin')) {
			// 	$('.cls_el_mainmenu_wrp').removeClass('no_jump');
			// }
		}

		function resetSticky() {
			if (window.location.href.indexOf('virtual') === -1) {
				if (window.location.href.indexOf('el-prof-racing-today') > -1) {
					if ($('.s_iframe').hasClass('n_sticky')) {
						$('.el_header_grp').css('top', headerHeight);
						$('.n_event_listing_header').css('top', headerHeight + sportsPanelHeight + $('.s_iframe').outerHeight());
						$('.rac_sev_wrp').css('top', headerHeight + sportsPanelHeight);
					} else {
						$('.el_header_grp').css('top', '');
						$('.n_event_listing_header').css('top', headerHeight);
						$('.rac_sev_wrp').css('top', '');
					}
				} else {
					if ($('.evnt_flt_wrp').is(':visible')) {
						$('.n_event_listing_header').css('top', headerHeight);
					} else {
						$('.n_event_listing_header').css('top', headerHeight + sportsPanelHeight);
					}
					$('.ob_listing_hdr').css('top', headerHeight + sportsPanelHeight);
					$('.n_grp_header').css('top', headerHeight + EventListingHeaderHeight + sportsPanelHeight); //sample shown in el-prof-outright.html
					$('.lv2').css('top', headerHeight + EventListingHeaderHeight + sportsPanelHeight); //sample shown in el-prof-favorites.html or el-prof-soccer-live.html
					$('.lv3 .n_sticky').css('top', headerHeight + EventListingHeaderHeight * 2 + sportsPanelHeight); //sample shown in el-prof-favorites.html or el-prof-soccer-live.html
				}
			} else if (window.location.href.indexOf('soccer') > -1) {
				//el-prof-virtual-soccer-today.html
				$('.virtual_sports_header').css('top', headerHeight + sportsPanelHeight);
			} else if (window.location.href.indexOf('kiron') === -1 && window.location.href.indexOf('betradar') === -1) {
				//el-prof-virtual-sportsdraw.html
				$('.vr_timer').css('top', headerHeight + sportsPanelHeight);
			}
		}
		scrollSticky();
		function headerSticky() {
			if ($('body').hasClass('navReset')) {
				resetSticky();
			} else {
				scrollSticky();
			}
		}
		$(window).scroll(function () {
			headerSticky();
		});
		$('.n_container').scroll(function () {
			headerSticky();
		});
	});
	//[SFCRQ-3477][Asian] Sports Panel and Bottom Panel UX Change: end
	/*event Listing: Sticky header: end*/

	// Bet Placement
	$('.odds_wrap .odds').on('click', function () {
		oddscount($(this).find('span'), $(this), 'prof');
		$('.n_footer_combo.v2').show();
	});
	//$(".odds_btn").on("click", function () {
	//    oddscount($(this).find("span"), $(this), "begin");
	//});
	// no longer in used: start
	// $('.odds_btn').on('click', function () {
	// 	oddscount($(this), $(this), 'begin');
	// });
	// no longer in used: end
	$('.odds_box').on('click', function () {
		oddscount($(this), $(this), 'cftg');
	});

	// Combo popup
	$('.custom_radio_grp').on('click', function () {
		$(this).addClass('active');
		$(this).siblings('.custom_radio_grp').removeClass('active');
	});
}

//Lucky Draw Promotion ============================//
function promo() {
	$('.promo_banner').click(function () {
		checkCyberbattlePage('promo-luckydraw.html');
	});
}

function promoFooter() {
	$('#main_footer').load('../html_asia/_footer_eventlisting.html', function () {
		$('.n_footer').hide();
		$('#n_footer_mock_promo').show();
		$('.n_footer_combo').hide();
	});
}

function promoRcd() {
	$('#promoAvailable').click(function () {
		checkCyberbattlePage('promo-free-record.html');
	});

	$('#promoHistory').click(function () {
		sessionStorage.setItem('promoRecord', 'history');
		checkCyberbattlePage('promo-free-record.html');
	});
}

//SEV content : start//
function SEV_BT_function() {
	var expand = 0;
	if (localStorage.getItem('isFacelift') === 'true') {
		$('.n_sev_header.n_sev_header_fav').click(function (e) {
			if ($(e.target).closest('.icon-fi-n-fav-off, .icon-fi-n-fav-on, .icon-fi-pin, .icon-fi-cashout, .icon-fi-title-s201, .info_wrp').length) {
				return;
			}
			$(this).next('.bet_type_body').slideToggle(200);
			$(this).find('i').toggleClass('fl_rotate');
		});
	}

	$('.mock_sev_collapse_expand_btn').click(function () {
		if (localStorage.getItem('isFacelift') === 'true') {
			$(this).find('i').toggleClass('fl_rotate');
			$('.bet_type .n_sev_header.n_sev_header_fav').find('i').toggleClass('fl_rotate');
			$('.bet_type .n_sev_header.n_sev_header_fav').next('.bet_type_body').slideToggle(200);
		} else {
			if (expand == 0) {
				$('.bet_type .n_sev_content').slideUp();
				$('.bet_type .n_sev_subheader').slideUp();
				$('.bet_type .obt_show_more_less').slideUp();
				$('.bet_type .n_sev_special_subheader').slideUp();
				$('.bet_type .n_sev_special_header').slideUp();
				$(this).find('i').toggleClass('icon-fi-arrow-down-incircle icon-fi-arrow-up-incircle');
				$('.bet_type .n_sev_header').find('i').addClass('icon-fi-arrow-up1').removeClass('icon-fi-arrow-down1');
				expand = 1;
			} else {
				$('.bet_type .n_sev_content').slideDown();
				$('.bet_type .n_sev_subheader').slideDown();
				$('.bet_type .obt_show_more_less').slideDown();
				$('.bet_type .n_sev_special_subheader').slideDown();
				$('.bet_type .n_sev_special_header').slideDown();
				$(this).find('i').toggleClass('icon-fi-arrow-down-incircle icon-fi-arrow-up-incircle');
				$('.bet_type .n_sev_header').find('i').addClass('icon-fi-arrow-down1').removeClass('icon-fi-arrow-up1');
				expand = 0;
			}
		}
	});
	pinClick('.bet_type', '.n_sev_item_content_wrap');
	/* function hideAllTabs(){
		$("#sample_sev_main").hide();
		$("#sample_sev_others").hide();
		$("#sample_sev_corner").hide();
		$("#sample_sev_booking").hide();
		$("#sample_sev_special").hide();
		$("#sample_short_content").hide();
	}
	$("#tabSoccerMain").click(function(){
		$("#sample_sev_main").show();
		$("#sample_sev_others").show();
		$("#sample_sev_corner").show();
		$("#sample_sev_booking").show();
		$("#sample_sev_special").show();
	});
	$("#tabSoccerOthers").click(function(){
		hideAllTabs();
		$("#sample_sev_others").show();
	});
	$("#tabSoccerCorner").click(function(){
		hideAllTabs();
		$("#sample_sev_corner").show();
	});
	$("#tabSoccerBooking").click(function(){
		hideAllTabs();
		$("#sample_sev_booking").show();
	});
	$("#tabSoccerSpecial").click(function(){
		hideAllTabs();
		$("#sample_sev_special").show();
	});
	$("#tabSoccerTestingShortContent").click(function(){
		hideAllTabs();
		$("#sample_short_content").show();
		$("#sample_short_content").unwrap();
	}); */
}
//SEV content : end//

//SEV fav
function SEV_BT_fav() {
	$('.fav').click(function () {
		$(this).toggleClass('n_fav_on n_fav_off');
		$(this).find('i').toggleClass('icon-fi-n-fav-on icon-fi-n-fav-off');
	});
}

// Cyber Battle Script Control Sports Type
function detectSportsType() {
	if (sessionStorage.getItem('cyberSportsType') == 'fifa') {
		$('#fifa').addClass('active');
		$('.n_visualization_wrap').attr('class', 'n_visualization_wrap').addClass('fifa');
	}
	if (sessionStorage.getItem('cyberSportsType') == 'pes') {
		$('#pes').addClass('active');
		$('.n_visualization_wrap').attr('class', 'n_visualization_wrap').addClass('pes');
	}
	if (sessionStorage.getItem('cyberSportsType') == 'nba2k') {
		$('#nba2k').addClass('active');
		$('.n_visualization_wrap').attr('class', 'n_visualization_wrap').addClass('nba2k');
	}
	if (sessionStorage.getItem('cyberSportsType') == 'cba2k') {
		$('#cba2k').addClass('active');
		$('.n_visualization_wrap').attr('class', 'n_visualization_wrap').addClass('cba2k');
	}
}

//DES-45 Standalone Odds Panel & Popup Bet Slip: start
function sidemenu_close() {
	if ($('#main_footer').hasClass('fs_footer')) {
		$('#main_footer').removeClass('fs_footer');
		$('.popup_side_wrp').removeClass('side_bar_shown');
		popupOff();
		$('.n_footer_combo.clone').show();
	}
}
//DES-45 Standalone Odds Panel & Popup Bet Slip: end

//Racing start============================/
function rc_drpdn_sample() {
	$('.content_lf_rt').unbind('click');
	$('.content_lf_rt').click(function () {
		var el = $(this);
		$('.content_lf_rt .icon-fi-close').each(function () {
			if ($(el).is($(this).closest('.content_lf_rt'))) return;
			$(this).addClass('icon-fi-add-circle').removeClass('icon-fi-close');
			$(this).closest('.content_lf_rt').find('.content_pop_drpdn').hide();
		});

		$(el).find('i').toggleClass('icon-fi-add-circle icon-fi-close');
		$(el).find('.content_pop_drpdn').toggle();
	});
}
//Racing end============================/

function SnkScroll(outerDiv, innerDiv, leftArrow, rightArrow) {
	if ($(outerDiv).find(innerDiv).length === 0) {
		return;
	}
	var innerWidth = $(outerDiv).find(innerDiv)[0].scrollWidth;
	var outerWidth = $(outerDiv).width();
	var arrowWidth = $(outerDiv).find(leftArrow).width();
	var gap = innerWidth - (outerWidth - arrowWidth * 2) - 5;

	$(outerDiv).bind('touchmove', function () {
		//console.log("scrollleft: "+ $(outerDiv).find(innerDiv)[0].scrollLeft + ", gap: " + gap + ", innerWidth: " + innerWidth +",outerWidth: "+outerWidth + ", $(outerDiv).find(innerDiv)" + $(outerDiv).find(innerDiv)[0].scrollWidth);
		// if not able to capture the width intially, capture the width one more time when start dragging
		if (innerWidth === 0 && outerWidth === 0) {
			innerWidth = $(outerDiv).find(innerDiv)[0].scrollWidth;
			outerWidth = $(outerDiv).width();
			arrowWidth = $(outerDiv).find(leftArrow).width();
			gap = innerWidth - (outerWidth - arrowWidth * 2) - 5;
		}

		if ($(outerDiv).find(innerDiv)[0].scrollLeft >= gap) {
			$(outerDiv).find(leftArrow).removeClass('snk_disable');
			$(outerDiv).find(rightArrow).addClass('snk_disable');
		} else if ($(outerDiv).find(innerDiv)[0].scrollLeft < 2) {
			$(outerDiv).find(leftArrow).addClass('snk_disable');
			$(outerDiv).find(rightArrow).removeClass('snk_disable');
		} else {
			if ($(outerDiv).find(leftArrow).hasClass('snk_disable')) {
				$(outerDiv).find(leftArrow).removeClass('snk_disable');
			}
			if ($(outerDiv).find(rightArrow).hasClass('snk_disable')) {
				$(outerDiv).find(rightArrow).removeClass('snk_disable');
			}
		}
	});
}

function scrollAd() {
	if ($('.el_ad_inner').length === 0) return;

	var width = $('.el_ad_inner img').outerWidth(true) + 4;
	var scrollWidth = $('.el_ad_inner')[0].scrollWidth - $('.el_ad_inner')[0].clientWidth - 4;
	$('.arrow_left').addClass('snk_disable');

	$('.arrow_left').on('click', function () {
		var originalScrollLeft = $('.el_ad_inner').scrollLeft();
		var newScrollLeft = originalScrollLeft - width;
		$('.el_ad_inner').scrollLeft(newScrollLeft);
		if (newScrollLeft <= 0) {
			$(this).addClass('snk_disable');
		}
		if (newScrollLeft < scrollWidth) {
			$('.arrow_right').removeClass('snk_disable');
		}
	});

	$('.arrow_right').on('click', function () {
		var originalScrollLeft = $('.el_ad_inner').scrollLeft();
		var newScrollLeft = originalScrollLeft + width;
		$('.el_ad_inner').scrollLeft(newScrollLeft);
		if (newScrollLeft >= scrollWidth) {
			$(this).addClass('snk_disable');
		}
		if (newScrollLeft > 0) {
			$('.arrow_left').removeClass('snk_disable');
		}
	});
}

function calculateBalWidth() {
	$(document.documentElement).css('--nBalW', $('.n_balance').outerWidth() + 'px');
}

function marbleRunTutorial() {
	//tutorial 1
	$('#mock_trigger_mr_tutorial').click(function () {
		$('#mr_mask').show();
		$('.mr_tut1').show();
		$('#s60').addClass('mr_tutms_1');
		$('body').addClass('popupOn');
		$('#mr_msk_btn1').show();
	});

	$('#mr_msk_btn1').click(function () {
		$('#mr_mask').hide();
		$('.mr_tut1').hide();
		$('#s60').removeClass('mr_tutms_1');
		$('body').removeClass('popupOn');
		$('#mr_msk_btn1').hide();
	});

	//tutorial2-4
	$('#mock_trigger_mr_tutorial2').click(function () {
		$('.mr_stream_overlay span, .mr_alert_banner, .el_header_grp.n_sticky, .n_footer_combo.v2.clone, .n_footer.padding_fix, .n_header.n_header_sports, #mock_fl_menu').hide();
		$('#mr_mask2, .mr_mask2, .mr_tut2, .mr_tut3, .mr_tut_track_live_arr, .mr_tut4_desc, #mr_liveTrack_tutorial .mr_tut4, #mr_msk_btn2').show();
		$('.rac_sev_wrp, .mr_sel_wrp, .mr_tracks_slider, .mrWithFooter, #mrSwitch3, .track_bar, .mr_stream_overlay, #mr_liveTrack_tut').addClass('mr_tutms_2');
		$('#tracks2').addClass('active');
		$('#tracks2').find('.tracks_title').hide();
		$('#tracks2').find('.expend_name').show();
		$('.track_bar').css('top', 'unset');
		$('#mr_liveTrack_tutorial .mr_ev_hdr').css('top', 'unset');
		$('#mr_liveTrack_tutorial .mr_ct.col_2').css('position', 'relative');
		$('.mr_ev_card_ct').hide();
		$('#mr_liveTrack_tutorial .mr_ev_card_ct').show();
		$('#mr_tut4_ev_card').find('.mr_ev_card_ct').show();
		$('#mr_tut4_ev_card').find('.mr_slider').addClass('mr_tutms_2');
		$('#mr_tut4_ev_card .mr_ev_hdr').find('i').removeClass('icon-fi-arrow-down1').addClass('icon-fi-arrow-up1');
		$('.s_iframe').css('height', '190px');
		$('body').addClass('popupOn');
		$('.mr_tracks_slider.pinned').css('top', 'unset');
	});

	// var iframeRatio = $(window).width() * (322.25 / 520); /*ratio from betradar*/
	var iframeRatio = $(window).width() * (257.95 / 363); /*ratio from betradar with footer*/
	$('#mr_msk_btn2').click(function () {
		$('.mr_stream_overlay span, .el_header_grp.n_sticky, .n_footer_combo.v2.clone, .n_footer.padding_fix, .n_header.n_header_sports, #mock_fl_menu').show();
		$('#mr_mask2, .mr_mask2, .mr_tut2, .mr_tut3, .mr_tut4, #mr_msk_btn2').hide();
		$('.rac_sev_wrp, .mr_sel_wrp, .mr_tracks_slider, .mrWithFooter, #mrSwitch3, .mr_stream_overlay, #mr_liveTrack_tut').removeClass('mr_tutms_2');
		$('#tracks2').removeClass('active');
		$('#tracks2').find('.tracks_title').show();
		$('#tracks2').find('.expend_name').hide();
		$('.s_iframe').css('height', iframeRatio + 'px');
		$('body').removeClass('popupOn');
		$('.mr_tracks_slider.pinned').css('top', '');
	});

	//tutorial 4
	$('#mock_trigger_mr_tutorial4').click(function () {
		$('#mock_mr_tutorial4 .mr_tut_wrp').show();
		$('#mr_mask5').show();
		$('.footer_main.n_footer_pop').hide();
		$('#mock_mr_tutorial4').addClass('mr_tutms_5');
		$('#mock_mr_tutorial4 .betslip_replay').addClass('active');
		$('#mock_mr_tutorial4 .betslip_replay i').addClass('icon-fi-minus-circle').removeClass('icon-fi-add-circle');
		$('body').addClass('popupOn');
		$('#mr_msk_btn5').show();
		$('.mr_tut5').show();
		$('#mybet').scrollTop($('#mock_mr_tutorial4').offset().top - 10);
	});

	$('#mr_msk_btn5').click(function () {
		$('#mr_mask5').hide();
		$('.footer_main.n_footer_pop').show();
		$('#mock_mr_tutorial4').removeClass('mr_tutms_5');
		$('#mock_mr_tutorial4 .betslip_replay').removeClass('active');
		$('#mock_mr_tutorial4 .mr_tut_wrp').hide();
		$('#mock_mr_tutorial4 .betslip_replay i').removeClass('icon-fi-minus-circle').addClass('icon-fi-add-circle');
		$('body').removeClass('popupOn');
		$('#mr_msk_btn5').hide();
		$('.mr_tut5').hide();
	});
}

function headerSliderScroll() {
	var slider = $('.menu_slider.header_slider');
	slider.on('scroll', function () {
		var maxScroll = slider[0].scrollWidth - slider.outerWidth();
		if (maxScroll <= 0) {
			slider.find('.gradient_right').hide();
		}
		var scrollLeft = slider.scrollLeft();
		if (scrollLeft <= 10) {
			$(this).closest('.n_container').find('.gradient_left').hide();
		} else {
			$(this).closest('.n_container').find('.gradient_left').show();
		}
		if (scrollLeft >= maxScroll - 10) {
			slider.find('.gradient_right').hide();
		} else {
			slider.find('.gradient_right').show();
		}
	});
}

function playerTutorial() {
	$('#demo_mock_trigger_player_tut').click(function () {
		$('.ply_mask, .ply_desc, #ply_btn').show();
		$(this).addClass('tut_ply');
		$('.w_sld_new .slider, .w_sld_new').addClass('tut_ply');
	});

	$('#ply_btn').click(function () {
		$('.ply_mask, .ply_desc, #ply_btn').hide();
		$('#demo_mock_trigger_player_tut').removeClass('tut_ply');
		$('.w_sld_new .slider, .w_sld_new').removeClass('tut_ply');
	});
}

function detectCyberBattle() {
	if (window.location.pathname.includes('cyberbattle') || sessionStorage.getItem('enterCyberBattle') === 'true') {
		if (localStorage.getItem('theme') == 'default') {
			localStorage.setItem('theme', 'default1');
		}
		switchThemes('cyberbattle');
		languages('cyberbattle');
		$('#myacctpage').addClass('cbWrp');
		$('#myacctpage').empty().load('_popup_myaccountCyberBattle.html');
	} else {
		$('#myacctpage').load('_popup_myaccount.html');
	}
}

function asiaFacelift() {
	$('.asiaFacelift').click(function () {
		localStorage.setItem('isFacelift', 'true');
		$('body').addClass('fl');
		localStorage.setItem('isFirstFl', 'true');
		matchSliderWidth();
	});
	$('.custom_radio_grp.asiaFacelift').click(function () {
		detectCyberBattle();
	});
	$('.list.asiaFacelift').click(function () {
		sessionStorage.setItem('enterCyberBattle', 'true');
		localStorage.setItem('isCyberBattle', 'true');
		window.location.href = localStorage.getItem('iscurrentsimpleview') == 'true' ? 'el-begin-soccer-todayCyberBattle.html' : 'el-prof-soccer-todaycyberbattle.html';
		sessionStorage.setItem('firstEnterCyberBattle', 'true');
		detectCyberBattle();
		localStorage.setItem('webcyberbattle', 'false');
	});
	$('.asiaDefault').click(function () {
		localStorage.setItem('isFacelift', 'false');
		$('body').removeClass('fl');
		$('#myacctpage').load('_popup_myaccount.html');
		matchSliderWidth();
		$('#myacctpage').hide();
		$('#popup_demoLegacylRemoval').show();
	});
	$('#popup_demoLegacylRemoval_confirm').click(function () {
		location.reload();
	});
	$('#popup_demoLegacylRemoval_cancel').click(function () {
		$('#popup_demoLegacylRemoval').hide();
	});
	$('.demoOnlyDevDontCopy_exitCyberBattle').click(function (e) {
		if (e.target.classList.contains('switch')) {
			return;
		}
		if ($(this).attr('id') !== 'asian_view') {
			localStorage.setItem('isFacelift', 'false');
		}
		if (localStorage.getItem('theme') === 'default1') {
			localStorage.setItem('theme', 'default');
		}
		sessionStorage.setItem('enterCyberBattle', 'false');
		localStorage.setItem('isCyberBattle', 'false');
		// location.reload(); // Reload page to reflect the changes
	});

	$('#select_ui').click(function () {
		$('#select_ui_popup').show();
		$('#select_ui_popup .custom_radio_grp, #select_ui_popup .custom_radio_grp .bullet').removeClass('active');
		if (localStorage.getItem('isFacelift') === 'true') {
			$('#select_ui_popup .asiaFacelift').addClass('active');
		} else {
			$('#select_ui_popup .asiaDefault .bullet, #select_ui_popup .asiaDefault').addClass('active');
		}
		$('body').addClass('popupOn');
		$('body').bind('touchmove', function (e) {
			e.preventDefault();
		});
	});

	$('#select_ui_popup .custom_radio_grp').click(function () {
		$('#select_ui_popup').hide();
		popupOff();
	});
}

//slider change to active tab
function activeTabSlider() {
	$('.demoOnly_activeTabSlider').click(function () {
		$(this).parent().find('.slider').remove();
		$(this).parent().addClass('activeTabSlider');
	});
}

// [DES-970] Cyber Tennis Tutorial
function tennisTutorials() {
	$('.tut_tennis_btn').click(function (event) {
		event.stopPropagation();
		$('.n_container').addClass('tut_tennis');
		$('.tut_tennis_wrap').find('.tut_tennis_up').addClass('highlighted');
		$('.tut_tennis_mask.bg_mask').removeClass('bg_mask_hide');
		$('.tut_tennis_cont').removeClass('tut_tennis_cont_off');
		$('.tut_tennis_mask_btn.mask_button').removeClass(' tennis_msk_btn');
		$('.fl_comp_popular, #mock_ob, #test_sports_menu, .fl_el_h.pinned').hide();
	});

	$('.tennis_msk_btn').click(function () {
		$('.n_container').removeClass('tut_tennis');
		$('.tut_tennis_wrap').find('.tut_tennis_up').removeClass('highlighted');
		$('.tut_tennis_mask.bg_mask').addClass('bg_mask_hide');
		$('.tut_tennis_cont').addClass('tut_tennis_cont_off');
		$('.tut_tennis_mask_btn.mask_button').addClass(' tennis_msk_btn');
		$('.fl_comp_popular, #mock_ob, #test_sports_menu, .fl_el_h.pinned').show();
	});
}
// END [DES-970] Cyber Tennis Tutorial

function flEventListing() {
	const triggerPinnedStickyUpdate = () => {
		$(document).trigger('pinClickToPinned:update');
		setTimeout(() => $(document).trigger('pinClickToPinned:update'), 60);
		setTimeout(() => $(document).trigger('pinClickToPinned:update'), 220);
	};

	$('.fl_mt_sld').each(function () {
		$(this).closest('.fl_mt_wrp').find('.fl_mt_prev').addClass('disabled');
	});
	$('.fl_score_det').each(function () {
		$(this).closest('.fl_score_rw').find('.fl_mt_prev').addClass('disabled');
	});
	$('.fl_mt_itm').click(function () {
		if ($(this).hasClass('el_mt_period')) {
			$(this).toggleClass('active');
			$('.period_table').toggleClass('hide');
			return;
		}

		$('.period_time').click(function () {
			$('.period_time').removeClass('n_highlight');
			$(this).addClass('n_highlight');
		});

		$(this).addClass('active').siblings().removeClass('active');
		$(this).siblings().find('.icon-fi-arrow-down1').removeClass('fl_rotate');
		$(this).find('.icon-fi-arrow-down1').addClass('fl_rotate');
		$(this).closest('.fl_mt_wrp').find('.fl_mt_nx').addClass('fl_mt_close').text('x').removeClass('disabled');

		if ($(this).hasClass('DontCopyDev_menu_corner')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.DontCopyDev_corner').removeClass('hide');
		} else if ($(this).hasClass('DontCopyDev_menu_penalty')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.DontCopyDev_penalty').removeClass('hide');
		} else if ($(this).hasClass('DontCopyDev_menu_cs')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.DontCopyDev_cs').removeClass('hide');
		} else if ($(this).hasClass('DontCopyDev_menu_ou')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.DontCopyDev_ou').removeClass('hide');
		} else if ($(this).hasClass('DontCopyDev_menu_tg')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.DontCopyDev_tg').removeClass('hide');
		} else if ($(this).hasClass('DontCopyDev_menu_ng')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.DontCopyDev_ng').removeClass('hide');
		} else if ($(this).hasClass('DontCopyDev_menu_15mins')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.DontCopyDev_15mins').removeClass('hide');
		} else if ($(this).hasClass('DontCopyDev_menu_quarter')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.DontCopyDev_quarter').removeClass('hide');
		} else if ($(this).hasClass('DontCopyDev_menu_set_main')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.DontCopyDev_set_main').removeClass('hide');
		} else if ($(this).hasClass('DontCopyDev_menu_set_cs')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.DontCopyDev_set_cs').removeClass('hide');
		}
	});
	$('.fl_mt_wrp .fl_mt_prev').click(function () {
		let fl_mt_sld = $(this).closest('.fl_mt_wrp').find('.fl_mt_sld');
		fl_mt_sld.animate({ scrollLeft: fl_mt_sld.scrollLeft() - 200 }, 200);
	});
	$('.fl_mt_wrp .fl_btn.fl_mt_nx').click(function () {
		if ($(this).hasClass('fl_mt_close')) {
			$(this).closest('.fl_mt_wrp').find('.fl_slider_grp').addClass('hide');
			$(this).closest('.fl_mt_wrp').find('.fl_mt_itm').removeClass('active');
			$(this).closest('.fl_mt_wrp').find('.fl_mt_itm .icon-fi-arrow-down1').removeClass('fl_rotate');
			$(this).removeClass('fl_mt_close').html('<i class="icon-fi-angle-right"></i>');
			let fl_mt_sld = $(this).closest('.fl_mt_wrp').find('.fl_mt_sld');
			if (fl_mt_sld.scrollLeft() >= fl_mt_sld.get(0).scrollWidth - fl_mt_sld.get(0).clientWidth) {
				$(this).addClass('disabled');
			}
		} else {
			let fl_mt_sld = $(this).closest('.fl_mt_wrp').find('.fl_mt_sld');
			fl_mt_sld.animate({ scrollLeft: fl_mt_sld.scrollLeft() + 200 }, 200);
		}
	});
	$('.fl_score_rw .fl_mt_prev').click(function () {
		let fl_score_det = $(this).closest('.fl_score_rw').find('.fl_score_det');
		fl_score_det.animate({ scrollLeft: fl_score_det.scrollLeft() - 200 }, 200);
	});
	$('.fl_score_rw .fl_mt_nx').click(function () {
		let fl_score_det = $(this).closest('.fl_score_rw').find('.fl_score_det');
		fl_score_det.animate({ scrollLeft: fl_score_det.scrollLeft() + 200 }, 200);
	});
	$('.fl_score_det').scroll(function () {
		var scrollableWidth = $(this).get(0).scrollWidth - $(this).get(0).clientWidth - 1;
		if ($(this).scrollLeft() >= scrollableWidth) {
			$(this).closest('.fl_score_rw').find('.fl_mt_nx').addClass('disabled');
		} else if ($(this).scrollLeft() <= 0) {
			$(this).closest('.fl_score_rw').find('.fl_mt_prev').addClass('disabled');
		} else {
			$(this).closest('.fl_score_rw').find('.fl_mt_prev, .fl_mt_nx').removeClass('disabled');
		}
	});
	$('.fl_mt_sld').scroll(function () {
		var scrollableWidth = $(this).get(0).scrollWidth - $(this).get(0).clientWidth;
		if ($(this).scrollLeft() >= scrollableWidth) {
			$(this).closest('.fl_mt_wrp').find('.fl_mt_nx').addClass('disabled');
		} else if ($(this).scrollLeft() <= 0) {
			$(this).closest('.fl_mt_wrp').find('.fl_mt_prev').addClass('disabled');
		} else {
			$(this).closest('.fl_mt_wrp').find('.fl_mt_prev, .fl_mt_nx').removeClass('disabled');
		}
	});
	$('.fl_comp_h').click(function (e) {
		if (e.target.classList.contains('icon-fi-pin')) {
			return;
		}
		$(this).find('.icon-fi-arrow-up1').toggleClass('fl_rotate');
		$(this).closest('.fl_event_grp_wrp').find('.fl_evnt_grp, .fl_nav, .fl_score_rw, .fl_mt_wrp, .fl_tips, .fl_tub, .fl_tub_n').slideToggle(200);
		$(this).closest('.fl_event_grp_wrp').find('.fl_tub_b').hide();
		$(this).closest('.fl_event_grp_wrp').find('.fl_tub_n .icon-fi-full-up').addClass('fl_rotate');
		triggerPinnedStickyUpdate();
		if (sessionStorage.getItem('enterCyberBattle') === 'true') {
			$(this).toggleClass('active');
		}
	});
	$('.fl_el_h').click(function (e) {
		$(this).find('.icon-fi-full-up').toggleClass('fl_rotate');
		$(this).next().find('.fl_event_grp_wrp').find('.icon-fi-arrow-up1').toggleClass('fl_rotate');
		$(this).next().find('.fl_event_grp_wrp').find('.fl_evnt_grp, .fl_nav, .fl_score_rw, .fl_mt_wrp, .fl_tips, .fl_tub, .fl_tub_n').slideToggle(200);
		$(this).next().find('.fl_event_grp_wrp').find('.fl_tub_b').hide();
		$(this).next().find('.fl_event_grp_wrp').find('.fl_tub_n .icon-fi-full-up').addClass('fl_rotate');
		triggerPinnedStickyUpdate();
		if (sessionStorage.getItem('enterCyberBattle') === 'true') {
			$(this).toggleClass('active');
		}
	});
	$('.fl_odds_wrp').click(function () {
		$(this).addClass('add');
		$('.n_footer_combo.v2').show();
	});

	$('#myfav').show();
	pinClick('.fl_event_grp_wrp', '.fl_event_live_wrp');

	$('.mr_bettype_hd:not(.newCol3 .mr_bettype_hd)').on('click', function (e) {
		if ($(e.target).closest('.mr_order, .icon-fi-pin').length) return;
		$(this).find('.icon-fi-arrow-up1').toggleClass('fl_rotate');
		$(this).siblings('.mr_title_info, .col_2').slideToggle(200);
	});
	$('.newCol3 .mr_bettype_hd').on('click', function (e) {
		if ($(e.target).closest('.mr_order, .icon-fi-pin').length) return;
		$(this).find('.icon-fi-arrow-up1').toggleClass('fl_rotate');
		$(this).siblings('.mr_hd_t2, .mr_ev_ct_wrp').slideToggle(200);
	});
}

function swipeEventListing() {
	let startX = 0,
		endX = 0;
	let isMouseDown = false;
	$('.fl_evnt_grp_r').on('touchstart mousedown', function (event) {
		if (event.type === 'mousedown') {
			isMouseDown = true;
			startX = event.clientX;
		} else {
			const touch = (event.touches && event.touches[0]) || (event.originalEvent && event.originalEvent.touches && event.originalEvent.touches[0]);
			if (touch) {
				startX = touch.clientX;
			}
		}
	});
	$('.fl_evnt_grp_r').on('touchend mouseup', function (event) {
		if (event.type === 'mouseup') {
			if (!isMouseDown) {
				return;
			}
			isMouseDown = false;
			endX = event.clientX;
		} else {
			const touch = (event.changedTouches && event.changedTouches[0]) || (event.originalEvent && event.originalEvent.changedTouches && event.originalEvent.changedTouches[0]);
			if (touch) {
				endX = touch.clientX;
			}
		}
		const distanceX = endX - startX;
		if ($(this).closest('.fl_mt_wrp').length > 0) {
			return;
		}
		const threshold = 50;
		const targetDivSwipe = $(this)
			.closest('.fl_event_grp_wrp')
			.find('.fl_evnt_grp_r .fl_evnt_content .fl_bet_itm_grp')
			.filter(function () {
				return $(this).closest('.fl_mt_wrp').length === 0;
			});
		if (targetDivSwipe.length <= 3) {
			return;
		}
		$(this).closest('.fl_event_grp_wrp').find('.fl_nav .dot').removeClass('active');
		if (distanceX < -threshold) {
			targetDivSwipe.css({
				transform: 'translateX(-100%)',
				transition: 'transform 0.3s ease-out',
			});
			$(this).closest('.fl_event_grp_wrp').find('.fl_nav .dot:last-child').addClass('active');
		} else if (distanceX > threshold) {
			targetDivSwipe.css({
				transform: 'translateX(0)',
				transition: 'transform 0.3s ease-out',
			});
			$(this).closest('.fl_event_grp_wrp').find('.fl_nav .dot:first-child').addClass('active');
		}
	});
	$('body').on('mouseleave', function () {
		isMouseDown = false;
	});
}

/* ========= CYBERBATTLE ========= */

function cbPinned() {
	$('.s_iframe').css('top', $('.n_header_sev').outerHeight());
	if (page == 'live' || page == 'visual' || page == 'h2h') {
		sevSlider_Pinned_Top = sev_Banner_Frame.outerHeight() + $('.s_iframe').outerHeight();
	}
	sevSlider_Pinned_withInfo_Top = sevSlider_Pinned_Top;
	sevSlider.css('top', sevSlider_Pinned_Top);
	sevSlider_stats.css('top', sevSlider_Pinned_Top);
	if ($('.n_info_dev_can_delete').hasClass('info')) {
		$('.n_info_msg').css('top', sevSlider_Pinned_Top);
		//part3 when pin, info also pinned
		sevSlider.css('top', sevSlider_Pinned_withInfo_Top + $('.n_info_msg').outerHeight());
		sevSlider_stats.css('top', sevSlider_Pinned_withInfo_Top + $('.n_info_msg').outerHeight());
	}
	$('.DontCopy_test_sev_filter_menu').addClass('n_sticky').css('top', $('.cb_sev_view').outerHeight());
}

function cbUnpinned() {
	$('.DontCopy_test_sev_filter_menu').css('top', 40);
}

function cbSEVCarousel() {
	const carouselList = [];
	const carouselThumbnails = [];
	handlePrevNext();
	$('.cb_sev_view').addClass('n_sticky');
	$('.cb_carousel_itm').each(function (index) {
		carouselList.push({
			id: index,
			content: $(this),
		});
	});
	$('.cb_filter_itm').each(function (index) {
		carouselThumbnails.push({
			id: index,
			content: $(this),
			isSelected: $(this).hasClass('active') ? true : false,
		});
	});
	$('.cb_filter_itm')
		.off('click')
		.on('click', function () {
			$(this).addClass('active').siblings().removeClass('active');
			$('.cb_carousel_itm').eq($(this).index()).addClass('active').siblings().removeClass('active');

			if ($(this).hasClass('autoPin')) {
				$('.n_pin_dev_can_delete').addClass('pin');
			} else {
				$('.n_pin_dev_can_delete').removeClass('pin');
			}
			const updatedThumbnails = carouselThumbnails.map((thumbnail) => {
				return $(this).index() === thumbnail.id
					? {
							...thumbnail,
							isSelected: true,
						}
					: {
							...thumbnail,
							isSelected: false,
						};
			});
			carouselThumbnails.length = 0;
			carouselThumbnails.push.apply(carouselThumbnails, updatedThumbnails);
			cbCarouselSlideItm();
		});

	function cbCarouselSlideItm() {
		const $track = $('.cb_carousel_track');
		const $items = $('.cb_carousel_itm');
		const activeIdx = $('.cb_carousel_itm.active').index();
		const itemWidth = $items.outerWidth(true);
		const offset = -(activeIdx * itemWidth); // move left to center current
		$track.css('transform', `translateX(${offset}px)`);
	}

	function handlePrevNext() {
		$('.cb_dashboard_carousel')
			.off('mousedown touchstart')
			.on('mousedown touchstart', function (e) {
				isDragging = true;
				startX = e.pageX || e.originalEvent.touches[0].pageX;
			});
		$('.cb_dashboard_carousel').on('mouseup touchend', function (e) {
			if (!isDragging) return;
			isDragging = false;
			const endX = e.pageX || e.changedTouches[0].pageX;
			const dragDirection = endX - startX;
			if (dragDirection > 50) {
				slideToImage('left');
			} else if (dragDirection < -50) {
				slideToImage('right');
			}
		});
		$('.cb_dashboard_carousel').on('mousemove touchmove', function (e) {
			if (!isDragging) return;

			e.preventDefault();
		});
	}

	function slideToImage(dir) {
		let $dashboardItm = $('.cb_carousel_itm');
		let $curItm = $('.cb_carousel_itm.active');
		let prevIdx = $curItm.index() - 1;
		let nextIdx = $curItm.index() + 1;
		if (dir === 'left' && prevIdx < 0) return;
		if (dir === 'right' && nextIdx >= carouselThumbnails.length) return;
		let newIdx = dir === 'left' ? prevIdx : nextIdx;
		$dashboardItm.removeClass('active');
		$dashboardItm.eq(newIdx).addClass('active');
		const updatedThumbnails = carouselThumbnails.map((thumbnail) => {
			return newIdx === thumbnail.id ? { ...thumbnail, isSelected: true } : { ...thumbnail, isSelected: false };
		});
		carouselThumbnails.length = 0;
		carouselThumbnails.push.apply(carouselThumbnails, updatedThumbnails);
		showImg($dashboardItm.eq(newIdx));
	}

	function showImg(curActiveIdx) {
		if (curActiveIdx.index() != carouselThumbnails.map((thumbnail) => (thumbnail.isSelected ? thumbnail.index : ''))) {
			$('.cb_filter_itm').removeClass('active');
			$('.cb_filter_itm').eq(curActiveIdx.index()).addClass('active');
		}
		cbCarouselSlideItm();
	}

	function cb_visualization_btn($this) {
		$this.closest($('.cb_carousel_itm')).removeClass('showOut').addClass('showLoop');

		showLoopTimeout = setTimeout(function () {
			$this.closest($('.cb_carousel_itm')).removeClass('showLoop').addClass('closeLoop');
		}, 5000);
		closeLoopTimeout = setTimeout(function () {
			$this.closest($('.cb_carousel_itm')).removeClass('closeLoop');
		}, 5500);
	}

	function cb_livestreaming_btn($this) {
		showLoopTimeout = setTimeout(function () {
			$this.closest($('.cb_carousel_itm')).removeClass('showLoop').addClass('closeLoop');
		}, 5000);
		closeLoopTimeout = setTimeout(function () {
			$this.closest($('.cb_carousel_itm')).removeClass('closeLoop');
		}, 5500);

		$this.closest($('.cb_carousel_itm')).removeClass('showOut').addClass('showLoop');
	}

	$('.n_iframe_visualization').click(function () {
		if ($(this).attr('id') === 'cb_open_live_streaming') {
			cb_livestreaming_btn($(this));
		}
		if ($(this).attr('id') === 'cb_open_visualization') {
			cb_visualization_btn($(this));
		}
	});
}

function cbWebScroll(element) {
	var clicked = false,
		clickX;
	$(element).on({
		mousemove: function (e) {
			clicked && updateScrollPos(e);
		},
		mousedown: function (e) {
			clicked = true;
			clickX = e.pageX;
		},
		mouseup: function () {
			clicked = false;
		},
	});
	function updateScrollPos(e) {
		$(element).scrollLeft($(element).scrollLeft() + (clickX - e.pageX));
	}
}

function cbDetectSports(targetSport) {
	localStorage.setItem('isCbPm', 'false');
	const sportsList = [
		{ id: 's55', name: 'basketball' },
		{ id: 's67', name: 'tennis' },
		{ id: 's54', name: 'soccer' },
		{ id: 's59', name: 'cricket' },
	];
	$('.sev_popup').show();
	$('body > .n_container').css('pointer-events', 'none');
	$('body > .n_container').css('display', 'none');

	$('#link_to_sev').load('_sev_mainpage_cybercricket.html', function () {
		$('.n_footer')
			.not('.pb_footer')
			.load('../html_asia/_footer_innerfooter_sev.html', function () {
				$('#index').hide();
				const { name: sportName, id: sportId } = sportsList.find((sport) => sport.name === targetSport) || {};

				$(`.cb_scoreboard_wrp.demoOnlyDevDontUseSb_${sportName}`).show().prependTo($('.cb_carousel_itm.demoOnlyScoreboard'));
				$(`.cb_scoreboard_wrp.demoOnlyDevDontUseSb_${targetSport}`).show();
				console.log(sportName + '  ....   ' + targetSport);
				sportsList.forEach(({ name }) => {
					if (name !== sportName) {
						$(`.cb_scoreboard_wrp.demoOnlyDevDontUseSb_${name}`).hide();
					}
				});

				$('.fl_s_title_img').attr('src', `../assets/public/layout/images/icon/icon_${sportId}.png`);
			});
	});
}

function matchSliderWidth() {
	const $items = $('.n_home_wrp .item');
	const $slider = $('.n_home_slider');
	if (!$('body').hasClass('fl')) {
		$slider.css('max-width', 'unset');
		return;
	}
	if (!$items.length || !$slider.length) return;
	const rowTop = $items.first()[0].getBoundingClientRect().top;
	// Count how many items are on the first row
	let itemsInRow = 0;
	$items.each(function () {
		const top = this.getBoundingClientRect().top;
		if (Math.abs(top - rowTop) < 2) {
			itemsInRow++;
		}
	});
	// const itemWidth = 350;
	// const gap = 8;
	// const totalWidth = itemWidth * itemsInRow + gap * (itemsInRow - 1);
	// $slider.css('max-width', totalWidth + 'px');
}

function calculatePrefContentPop() {
	$(document.documentElement)
		.css('--nPopupHeaderH', $('.customize_fast_bet .n_popup_header').outerHeight(true) + 'px')
		.css('--nPopupBtnH', $('.customize_fast_bet .n_popup_button_wrap').outerHeight(true) + 'px');
}

//live race tracker
function initProgressBar() {
	// clean all tracker active status
	$('.tracker_container .step, .tracker_container .step_box').removeClass('active');
	$('.tracker_container .tracker_line_fill').css('width', '0');

	// only run tracker if data-progress > 0
	$('.tracker_container')
		.filter(function () {
			return Number($(this).data('progress')) > 0;
		})
		.each(function () {
			const $container = $(this);
			const $fill = $container.find('.demo_tracker_fill');
			const $steps = $container.find('.step');

			const target = Number($container.data('progress'));
			const animationDuration = 2000;

			// progress bar animation
			$fill.css('width', target + '%');

			// step activation
			$steps.each(function () {
				const $step = $(this);
				const stepPercent = Number($step.attr('data-percent'));

				if (stepPercent <= target) {
					const delay = (stepPercent / target) * animationDuration;

					setTimeout(() => {
						$step.addClass('active');

						const $box = $step.next('.step_box');
						if ($box.length) $box.addClass('active');
					}, delay);
				}
			});
		});
}

// MM tracker left panel
function openPanel() {
	$('.track_left_panel').addClass('expanded').show();
	$('#track_left_panel_mask').show();
}

function closePanel() {
	$('.track_left_panel').removeClass('expanded');
	$('#track_left_panel_mask').hide();
}

function ssSEV() {
	$('.n_sports_menu .item_wrap').click(function (e) {
		if ($(this).attr('id') === 'mock_ss_scenario_insight') {
			$('#sev_all .n_sev_item_content_wrap > div').hide();
			$('#mock_ss_live').show();
		} else if ($(this).attr('id') === 'mock_ss_scenario_analyze') {
			$('#sev_all .n_sev_item_content_wrap > div').hide();
			$('#mock_ss_analyzing').show();
		} else if ($(this).attr('id') === 'mock_ss_scenario_no_insight') {
			$('#sev_all .n_sev_item_content_wrap > div').hide();
			$('#mock_ss_no_insight').show();
		} else {
			$('#sev_all .n_sev_item_content_wrap > div').show();
			$('.mock_ss_analyzing, .ss_wrap, #mock_ss_live').hide();
		}
	});
}

function headerLoad(callback) {
	$('#mock_menu_tab').load('_popup_menu_tab.html', function () {
		headerSliderScroll();
		calculateBalWidth();
		//follow n_header's properties
		$(this).css({
			position: 'sticky',
			top: '0',
			'z-index': '8',
		});
		$('#switch_early').click(function () {
			window.location.href = 'el-prof-soccer-early.html';
		});
		$('#switch_popular').click(function () {
			window.location.href = 'popular-home.html';
		});
		$('#switch_outright').click(function () {
			window.location.href = 'el-prof-outright.html';
		});
		$('#switch_soccer').click(function () {
			if (sessionStorage.getItem('enterCyberBattle') === 'true') {
				window.location.href = 'el-prof-soccer-todaycyberbattle.html';
			} else {
				window.location.href = 'el-prof-soccer-today.html';
			}
		});
		if (window.location.pathname.indexOf('early') !== -1) {
			$('#switch_early').addClass('active');
		} else if (window.location.pathname.indexOf('outright') !== -1) {
			$('#switch_outright').addClass('active');
		} else if (window.location.pathname.indexOf('popular') !== -1) {
			$('#switch_popular').addClass('active');
		} else {
			$('#switch_soccer').addClass('active');
		}
		var slider = $('.menu_slider.header_slider');
		slider.scrollLeft(slider.find('.menu_tab.active').offset().left - slider.find('.menu_tab.active').width());
		$('#backtomain')
			.off('click')
			.on('click', function () {
				window.location.href = 'index.html';
			});

		if (typeof callback === 'function') {
			callback();
		}
	});
}

function flMenuLoad() {
	$('#mock_ob').load('_popup_ob.html', function () {
		$('#demoAllBoostPage').click(function (e) {
			e.stopPropagation();
			window.location.href = 'all-odds-boost.html';
		});
		const ftTut1 = () => {
			$('.fltr_tut1, .fltr_ftr_msk, #demoOnlyFltrTutMsk').toggle();
			$('.n_footer').css({ overflow: 'visible' });
			$('.n_footer_combo').hide();
			$('.fltr_tut1').parent('.item').addClass('highlighted dot_box').css({
				zIndex: 1000003,
			});

			$('#fltrMskBtn1').on('click', () => {
				$('.fltr_tut1, .fltr_popup, #demoOnlyFltrTutMsk, .fltr_ftr_msk, .fltr_grp_msk').toggle();
				$('.n_footer').css({ overflow: 'hidden' });
				$('.fltr_tut1').parent('.item').removeClass('highlighted dot_box').css({
					zIndex: 9,
				});

				$('.fltr_grp_wrp').addClass('show');
				$('.fltr_tut2').show();
				$('.filterOddsColor').parents('.fltr_grp_itm').addClass('dot_box highlighted');
				$('.filterOddsColor .ob_st_popup').show().parents('.selectbox_title .icon-fi-angle-down').toggleClass('fl_rotate');
			});

			$('#fltrMskBtn2').on('click', () => {
				$('.fltr_tut1, .fltr_popup, #demoOnlyFltrTutMsk, .fltr_ftr_msk, .fltr_grp_msk').hide();
				$('.fltr_grp_wrp').removeClass('show');
				$('.fltr_tut2').hide();
				$('.filterOddsColor').parents('.fltr_grp_itm').removeClass('dot_box highlighted');
				$('.filterOddsColor .ob_st_popup').hide().parents('.selectbox_title .icon-fi-angle-down').removeClass('fl_rotate');
				$('.n_footer_combo').show();
			});
		};

		$('#demoOnlyFTTrigger').on('click', () => {
			ftTut1();
		});
	});
	$('#mock_fl_menu').load('_popup_fl_menu.html', function () {
		//follow fl_menu_wrp's properties
		$(this).css({
			position: 'sticky',
			top: '40px',
			'z-index': '6',
		});
		if (window.location.pathname.indexOf('favorites') !== -1) {
			$('.n_sport_type').show();
			$('.fl_comp').hide();
		} else if (window.location.pathname.indexOf('early') !== -1) {
			$('.n_menu_cover').show();
			flexiSlider('#test_sports_menu');
		} else if (window.location.pathname.indexOf('popular') !== -1) {
			$('.fl_comp').hide();
		} else if (window.location.pathname.indexOf('marble-magic') !== -1) {
			$('.fl_menu_t').removeClass('active');
			$('.fl_menu_t img[src*="s60"]').closest('.fl_menu_t').addClass('active');
			$('.fl_comp').hide();
			$('.n_menu_cover').remove();
		} else if (window.location.pathname.indexOf('today') !== -1) {
			$('.n_sport_type').hide();
			$('.fl_comp, .n_menu_cover').show();
			flexiSlider('#test_sports_menu');
		} else {
			$('.n_sport_type, .n_menu_cover').hide();
			$('.fl_comp').show();
		}

		const sportsList = [
			{ id: 's2', name: 'basketball' },
			{ id: 's3', name: 'tennis' },
			{ id: 's6', name: 'athletics' },
			{ id: 's7', name: 'badminton' },
			{ id: 's8', name: 'baseball' },
			{ id: 's13', name: 'cricket' },
			{ id: 's19', name: 'american_football' },
			{ id: 's25', name: 'icehockey' },
			{ id: 's31', name: 'rugby' },
			{ id: 's34', name: 'snooker' },
			{ id: 's35', name: 'swimming' },
			{ id: 's36', name: 'tabletennis' },
			{ id: 's40', name: 'volleyball' },
			{ id: 's42', name: 'weightlifting' },
			{ id: 'skabaddi', name: 'kabaddi' },
			{ id: 's54', name: 'soccer' },
			{ id: 's55', name: 'basketball' }, // is actually cyberbasketball, but layout share with basketball
			{ id: 's67', name: 'tennis' }, // is actually cybertennis, but layout shar ewith tennis
			{ id: 's59', name: 'cricket' }, // is actually cybercricket, but layout share with cricket
		];
		$('.fl_menu_t').on('click', function () {
			const imgSrc = $(this).find('img').attr('src');
			if (imgSrc && imgSrc.includes('s1.png')) {
				if (sessionStorage.getItem('enterCyberBattle') === 'true') {
					window.location.href = 'el-prof-soccer-todaycyberbattle.html';
				} else {
					window.location.href = 'el-prof-soccer-today.html';
				}
			} else if (imgSrc && imgSrc.includes('s60.png')) {
				window.location.href = 'el-marble-magic-live.html';
			} else {
				$('.sev_popup').show();
				$('body > .n_container').css('pointer-events', 'none');
				$('body > .n_container').css('display', 'none');
				const fileName = imgSrc.slice(imgSrc.lastIndexOf('/') + 1);
				const result = fileName.slice(5, fileName.lastIndexOf('.'));
				const { name: sportName, id: sportId } = sportsList.find((sport) => sport.id === result) || {};
				if (!sportName) {
					$('.sev_popup').hide();
					$('body > .n_container').css({ pointerEvents: '', display: '' });
					return;
				}
				$('#link_to_sev').load(`_sev_mainpage_${sportName}.html`, function () {
					$('.n_footer').not('.pb_footer').load('../html_asia/_footer_innerfooter_sev.html');
					if (sportName !== 'kabaddi') {
						$('.s_title_wrp .icon').hide();
						$('.s_title_wrp .fl_s_title_img').remove();
						$('.s_title_wrp').prepend(`<img class="fl_s_title_img" />`);
						$('.fl_s_title_img').attr('src', `../assets/public/layout/images/icon/icon_${sportId}.png`);
					}
				});
			}
		});

		$('#demoPopularHide').on('click', function () {
			$('.fl_comp_popular').hide();
		});

		$('#demoCollapseOddsBanner').on('click', function () {
			$('.ob_listing_hdr_l').trigger('click');
		});

		$('#demoPrefTutor').on('click', function () {
			$('body').addClass('rec_zIndex popupOn');
			$('#dont_copy_tutor_pref').show();
		});

		$('#demoRecCSBetslip').on('click', function () {
			sessionStorage.setItem('enter_tutor_recCS', 'yes');
		});

		$('#demoRecCSPopM').on('click', function () {
			$('body').addClass('rec_zIndex popupOn');
			$('#sample_dont_copy_popup_rmd_bet').show();
			$('.popup_top_wrp').addClass('highlighted');
			$('#sample_dont_copy_popup_rmd_bet .tutor_recCS').show();
		});

		$('.fl_comp_t').on('click', function () {
			$('.fl_comp_t').removeClass('active');
			$(this).toggleClass('active');

			var targetEvent = $(this).text().trim();
			var matchFound = false;

			$('.fl_event_grp_wrp').each(function () {
				var titleText = $(this).find('.fl_comp_h_t').text().trim();
				if (targetEvent === 'All' || titleText.includes(targetEvent)) {
					matchFound = true;
					return false;
				}
			});

			$('.fl_event_grp_wrp').each(function () {
				var titleText = $(this).find('.fl_comp_h_t').text().trim();
				if (targetEvent === 'All') {
					$(this).show();
				} else if (matchFound && titleText.includes(targetEvent)) {
					$(this).show();
				} else if (matchFound) {
					$(this).hide();
				} else {
					$(this).show();
				}
			});
		});
		ssTutorial();
		$('#demoOnlyLuckyEPage').click(function () {
			window.location.href = 'all-odds-boost.html';
		});
	});
}

function ssTutorial() {
	$('#mock_test_ss_tut').click(function () {
		$('.mock_fl_tips_testing, .fl_menu, .fl_comp_popular').addClass('ss_tut');
		$('.ss_tut .rec_arrow, .ss_tut .dot_box, .bg_mask.ss_tut, .ai_tips_el').show();
		$('.uncle_boris, .ob_listing_hdr, .ob_wrp, .fl_comp_t.le_t').hide();
		$('#mock_fl_menu').css('z-index', '1000003');
	});

	$('#ssTutBtn').click(function () {
		$('.ss_tut .rec_arrow, .ss_tut .dot_box, .bg_mask.ss_tut, .ai_tips_el').hide();
		$('.mock_fl_tips_testing, .fl_menu, .fl_comp_popular').removeClass('ss_tut');
		$('.uncle_boris, .ob_listing_hdr, .ob_wrp, .fl_comp_t.le_t').show();
		$('#mock_fl_menu').css('z-index', '6');
	});

	$('#mock_test_ss_tut2').click(function () {
		$('.n_menu_cover, .n_sports_menu, .cover_btn, .slider_bg, .n_footer_combo.clone, .n_footer').addClass('ss_tut');
		$('.mock_ss_tut3, .ss_mask3, #ssTutBtn2').show();
		$('.n_sev_view').css('z-index', 1);
		$('.uncle_boris, #insight .new_tag').hide();
	});

	$('#ssTutBtn2').click(function () {
		$('.mock_ss_tut3, .ss_mask3, #ssTutBtn2').hide();
		$('.n_menu_cover, .n_sports_menu, .cover_btn, .slider_bg, .n_footer_combo.clone, .n_footer').removeClass('ss_tut');
		$('.n_sev_view').css('z-index', '');
		$('.uncle_boris, #insight .new_tag').show();
	});
}

function uncleBorisEL() {
	$('.fl_tubt .icon-fi-full-up').click(function () {
		$(this).toggleClass('fl_rotate');
		$(this).closest('.fl_tub').find('ul').toggle();
		$(this).closest('.fl_tub').find('.ss_tml_btn').toggle();
		$(this).closest('.fl_tub').toggleClass('active');
	});
	setTimeout(function () {
		$('.ss_tml_btn').on('click', function () {
			$(this).addClass('add');
			$('.pb_wrap').css('bottom', 0);
			pb_footer_height = $('.pb_footer').outerHeight();
			$('.n_footer_combo.clone').parent().addClass('on');
			$('.footer_arrow i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
			calculateHeightSetting(true);
		});
	}, 100);
}

function lbMenu() {
	$('.lb_menu_itm')
		.off('click.lbMenu')
		.on('click.lbMenu', function () {
			var $menuItem = $(this);
			var $lbPopup = $menuItem.closest('#largebetinsights');

			$menuItem.closest('.lb_menu_cover').find('.lb_menu_itm').removeClass('active');
			$menuItem.addClass('active');

			if (!$lbPopup.length) {
				return;
			}

			// large bet
			$lbPopup.find('.lb_wrp, .lb_top_rw').hide();

			if ($menuItem.is('#mock_cover_largebet')) {
				$lbPopup.find('#mock_insights_largebets, .lb_top_rw').show();
				$lbPopup.find('#mock_cover_prematch, #mock_cover_live').hide();
				$lbPopup.find('.lb_exp').removeClass('w_padding').html('<i class="icon-fi-info"></i>Discover popular high-stake selections from other players.');
			}

			if ($menuItem.is('#mock_cover_prematch')) {
				$lbPopup.find('#mock_insights_prematch').show();
				$lbPopup.find('.lb_exp').addClass('w_padding').html('<i class="icon-fi-info"></i>Soccer pre-match tips with recommended selections and analysis.');
			}

			if ($menuItem.is('#mock_cover_live')) {
				$lbPopup.find('#mock_insights_live').show();
				$lbPopup.find('.lb_exp').addClass('w_padding').html('<i class="icon-fi-info"></i>Soccer live tips with recommended selections and analysis.');
			}
		});
}

function setTipsToggleText($target, text) {
	$target
		.contents()
		.filter(function () {
			return this.nodeType === 3 && $.trim(this.nodeValue).length;
		})
		.first()
		.replaceWith(text);
}

function tipsT() {
	function getTipsToggleText($tipsToggle) {
		return $.trim(
			$tipsToggle
				.contents()
				.filter(function () {
					return this.nodeType === 3 && $.trim(this.nodeValue).length;
				})
				.first()
				.text(),
		);
	}

	function resetTipsToggle($tipsToggle) {
		var currentText = getTipsToggleText($tipsToggle);
		var usesReadMoreText = currentText === 'Read More' || currentText === 'Read Less';

		$tipsToggle.find('.icon-fi-full-up').addClass('fl_rotate');
		setTipsToggleText($tipsToggle, usesReadMoreText ? 'Read More ' : 'View ');
	}

	$('.tips_t')
		.off('click.tipsT')
		.on('click.tipsT', function () {
			var $tipsTitle = $(this);
			var $tipsWrap = $tipsTitle.closest('.tips_btm');
			var $tipsBody = $tipsWrap.find('.tips_b');
			var willShow = !$tipsBody.is(':visible');
			var $tipsToggle = $tipsTitle.find('.tips_t_r');
			var currentText = getTipsToggleText($tipsToggle);
			var usesReadMoreText = currentText === 'Read More' || currentText === 'Read Less';
			var $tipsContainer = $tipsWrap.closest('[data-strategy-details-group], .lb_wrp, .sd_grp, .n_content_wrap_wth_bcktop, .popup_overWrap, body');
			var $otherTips = $tipsContainer.find('.tips_btm').not($tipsWrap);

			if (willShow) {
				$otherTips.find('.tips_b:visible').stop(true, true).slideUp(200);
				$otherTips.find('.tips_t_r').each(function () {
					resetTipsToggle($(this));
				});
			}

			$tipsToggle.find('.icon-fi-full-up').toggleClass('fl_rotate', !willShow);
			$tipsBody.stop(true, true)[willShow ? 'slideDown' : 'slideUp'](200);
			setTipsToggleText($tipsToggle, usesReadMoreText ? (willShow ? 'Read Less ' : 'Read More ') : willShow ? 'Hide ' : 'View ');
		});
}

// ai playbook: start
var aiPlaybookPaths = {
	leaderboardStrategies: 'ai_leaderboard_strategies.html',
	strategyDetails: 'ai_strategy_details.html',
	popups: '_popup_ai_module.html',
	graph: '_ai_graph.html',
	// graphPreview reuses the same markup as graph — initAiGraphInstance(root, true)
	// hides the grid/axis/tooltip/dot chrome and crops the viewBox for the mini version
	graphPreview: '_ai_graph.html',
	footer: '_footer_eventlisting.html .n_footer.padding_fix',
};

var aiPlaybookOriginStorageKey = 'aiPlaybookOrigin';
var aiPlaybookSevRestoreStorageKey = 'aiPlaybookSevRestore';

function isAsiaAiPlaybookContext() {
	return !isCyberbattleView();
}

function getAiPlaybookOrigin() {
	if (!isAsiaAiPlaybookContext()) {
		return null;
	}

	try {
		return JSON.parse(sessionStorage.getItem(aiPlaybookOriginStorageKey) || 'null');
	} catch (error) {
		sessionStorage.removeItem(aiPlaybookOriginStorageKey);
		return null;
	}
}

function rememberAiPlaybookOrigin() {
	if (!isAsiaAiPlaybookContext()) {
		return;
	}

	var pageName = window.location.pathname.split('/').pop() || 'index.html';
	var isLandingPage = pageName === 'index.html';
	var isEventListing = /^el-.+\.html$/i.test(pageName);
	var isSev = isEventListing && $('.sev_popup:visible').length > 0;

	var origin = {
		pageType: isLandingPage ? 'landing' : isSev ? 'sev' : isEventListing ? 'event-listing' : 'other',
		url: window.location.href,
	};

	if (isSev) {
		origin.sevMarkup = $('#link_to_sev').html();
		origin.sevScrollTop = $('.sev_popup').scrollTop();
		var $sevSlider = $('#link_to_sev .DontCopy_test_sev_filter_menu .slider').first();
		var $sevSliderMenu = $('#link_to_sev .DontCopy_test_sev_filter_menu .n_sports_menu').first();
		var $sevActiveTab = $sevSliderMenu.find('.item_wrap.active').first();
		if ($sevSlider.length) {
			origin.sevSliderState = {
				left: $sevSlider.css('left'),
				width: $sevSlider.css('width'),
			};
		}
		if ($sevSliderMenu.length) {
			origin.sevSliderScrollLeft = $sevSliderMenu.scrollLeft();
			origin.sevActiveTabIndex = $sevActiveTab.index();
		}
	}

	sessionStorage.setItem(aiPlaybookOriginStorageKey, JSON.stringify(origin));
}

function clearAiPlaybookOrigin() {
	sessionStorage.removeItem(aiPlaybookOriginStorageKey);
}

function restoreAiPlaybookSevSliderState($sevContent, restoreData) {
	var $sevSliderContainer = $sevContent.find('.DontCopy_test_sev_filter_menu').first();
	var $sevSlider = $sevSliderContainer.find('.slider').first();
	var $sevSliderMenu = $sevSliderContainer.find('.n_sports_menu').first();
	var $popularTab = $sevSliderMenu
		.find('.item_wrap')
		.filter(function () {
			return $.trim($(this).children('.item').first().text()).toLowerCase() === 'popular';
		})
		.first();
	var $activeTab = $popularTab.length ? $popularTab : $sevSliderMenu.find('.item_wrap.active').first();

	if (!$sevSlider.length || !$activeTab.length) {
		return false;
	}

	$sevSliderMenu.find('.item_wrap').removeClass('active');
	$activeTab.addClass('active');
	if (restoreData.sevSliderScrollLeft !== undefined) {
		$sevSliderMenu.scrollLeft(restoreData.sevSliderScrollLeft);
	}

	// Reuse the same item handler that positions the slider when SEV is entered.
	$activeTab.trigger('click');
	var sliderLeft = parseFloat($sevSlider.css('left'));
	var sliderWidth = parseFloat($sevSlider.css('width'));

	if (isFinite(sliderLeft) && sliderLeft > 0 && isFinite(sliderWidth) && sliderWidth > 0) {
		return true;
	}

	sliderLeft = $activeTab.offset().left - $sevSliderContainer.offset().left + $sevSliderContainer.scrollLeft();
	sliderWidth = $activeTab.width();

	if ($sevSliderMenu.hasClass('thinner_slider')) {
		var $activeTabItem = $activeTab.children('.item').first();
		var paddingLeft = parseFloat($activeTabItem.css('padding-left')) || 0;
		var paddingRight = parseFloat($activeTabItem.css('padding-right')) || 0;

		sliderLeft += paddingLeft;
		sliderWidth -= paddingLeft + paddingRight;
	}

	if (isFinite(sliderLeft) && sliderLeft > 0 && isFinite(sliderWidth) && sliderWidth > 0) {
		$sevSlider.css({ left: sliderLeft, width: sliderWidth });
		return true;
	}

	if (restoreData.sevSliderState && parseFloat(restoreData.sevSliderState.left) > 0) {
		$sevSlider.css({
			left: restoreData.sevSliderState.left,
			width: restoreData.sevSliderState.width,
		});
		return true;
	}

	return false;
}

function restoreAiPlaybookSev() {
	if (!isAsiaAiPlaybookContext()) {
		return;
	}

	var restoreData;

	try {
		restoreData = JSON.parse(sessionStorage.getItem(aiPlaybookSevRestoreStorageKey) || 'null');
	} catch (error) {
		sessionStorage.removeItem(aiPlaybookSevRestoreStorageKey);
		return;
	}

	if (!restoreData || !restoreData.sevMarkup) {
		return;
	}

	var $sevPopup = $('.sev_popup').first();
	var $sevContent = $('#link_to_sev').first();

	if (!$sevPopup.length || !$sevContent.length) {
		return;
	}

	if (!$sevPopup.is(':visible') || !$.trim($sevContent.html())) {
		var restoredSevMarkup = restoreData.sevMarkup.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
		$sevContent.html(restoredSevMarkup);
		$sevPopup.show();
		$('body > .n_container').css({ pointerEvents: 'none', display: 'none' });
		SEV_Group('', true);
	}

	var restoreSliderAttempts = 0;
	function restoreSevSliderWhenPositioned() {
		restoreSliderAttempts += 1;
		if (!restoreAiPlaybookSevSliderState($sevContent, restoreData) && restoreSliderAttempts < 12) {
			window.requestAnimationFrame(restoreSevSliderWhenPositioned);
		}
	}
	window.requestAnimationFrame(restoreSevSliderWhenPositioned);
	window.setTimeout(restoreSevSliderWhenPositioned, 500);
	$('.n_footer')
		.not('.pb_footer')
		.load('../html_asia/_footer_innerfooter_sev.html', function () {
			syncAsiaFooterControls(this);
		});
	$sevPopup.scrollTop(restoreData.sevScrollTop || 0);
	sessionStorage.removeItem(aiPlaybookSevRestoreStorageKey);
}

function goBackFromAiPlaybookPage() {
	var origin = getAiPlaybookOrigin();

	if (!origin) {
		return false;
	}

	if (origin.pageType === 'sev' && origin.sevMarkup) {
		sessionStorage.setItem(aiPlaybookSevRestoreStorageKey, JSON.stringify(origin));
	}

	clearAiPlaybookOrigin();
	window.history.back();
	return true;
}

function getAiPlaybookPath(name) {
	return aiPlaybookPaths[name] || name;
}

function goAiPlaybookPage(name) {
	window.location.href = getAiPlaybookPath(name);
}

function loadAiPlaybookShells(root) {
	var $root = $(root || document);
	var $leaderboardStrategies = $root.find('.devDontCopy_leaderboard_strategies').add($root.filter('.devDontCopy_leaderboard_strategies'));
	var $strategyDetails = $root.find('.devDontCopy_strategy_details').add($root.filter('.devDontCopy_strategy_details'));
	var $popups = $root.find('.devDontCopy_aiPB_popup').add($root.filter('.devDontCopy_aiPB_popup'));

	$popups.load(getAiPlaybookPath('popups'));
}

function getAiPlaybookPages() {
	return $('.devDontCopy_leaderboard_strategies, .devDontCopy_strategy_details');
}

function getActiveAiPlaybookPage() {
	var $activePage = getAiPlaybookPages().filter(':visible').first();

	return $activePage.length ? $activePage : $('.devDontCopy_leaderboard_strategies');
}

function getAiPlaybookScrollLockTarget() {
	var aiPlaybookScroll = $('.aiPB_popup.popupOn:visible .strat_scroll').first()[0];

	if (aiPlaybookScroll) {
		return aiPlaybookScroll;
	}

	return document.getElementsByClassName('popup_overWrap')[0] || document.body;
}

function isAiPlaybookStandalonePage(root) {
	return $(root).is('body, .n_container');
}

function getAiPlaybookCopiedStrategies() {
	var raw = sessionStorage.getItem('aiPlaybookCopiedStrategies');

	try {
		return raw ? JSON.parse(raw) : {};
	} catch (e) {
		return {};
	}
}

function setAiPlaybookCopiedStrategies(copiedStrategies) {
	sessionStorage.setItem('aiPlaybookCopiedStrategies', JSON.stringify(copiedStrategies || {}));
}

function getAiPlaybookStoppedStrategies() {
	var raw = sessionStorage.getItem('aiPlaybookStoppedStrategies');

	try {
		return raw ? JSON.parse(raw) : {};
	} catch (e) {
		return {};
	}
}

function setAiPlaybookStoppedStrategies(stoppedStrategies) {
	sessionStorage.setItem('aiPlaybookStoppedStrategies', JSON.stringify(stoppedStrategies || {}));
}

function getAiPlaybookStrategyCardIndex($card) {
	var $cards = $('.devDontCopy_leaderboard_strategies .strat_card_wrp');
	var index = $cards.index($card);

	return index >= 0 ? index : undefined;
}

function getAiPlaybookCurrentStrategyState() {
	var raw = sessionStorage.getItem('aiPlaybookStrategyDetailsState');

	try {
		return raw ? JSON.parse(raw) : null;
	} catch (e) {
		return null;
	}
}

function getAiPlaybookStrategyDirectText($element, removeSelector) {
	var $copy = $element && $element.length ? $element.clone() : $();

	if (!$copy.length) {
		return '';
	}

	if (removeSelector) {
		$copy.find(removeSelector).remove();
	}

	return $.trim($copy.text()).replace(/\s+/g, ' ');
}

function getAiPlaybookStrategyData($source) {
	var $sourceRoot = $($source);
	var $matchInfo = $sourceRoot.find('.strat_match_info').first();
	var $betSelection = $matchInfo.find('.strat_bet_sel').first();
	var $nestedName = $betSelection.find('.strat_bet_sel_name').first();
	var $riskLevel = $matchInfo.find('.strat_risk_lvl_wrp .strat_risk_lvl').first();
	var $legacyRisk = $sourceRoot.find('.strat_hdr .strat_name').first();
	var $riskWrapper = $riskLevel.closest('.strat_risk_lvl_wrp');
	var $betDetail = $matchInfo.find('.strat_bet_dtl').first();
	var $strategyValue = $sourceRoot.find('.strat_value').first();
	var riskClasses = ($riskLevel.attr('class') || '') + ' ' + ($legacyRisk.attr('class') || '');
	var riskTypeClass = $.grep(riskClasses.split(/\s+/), function (className, index, classes) {
		return (className === 'strat_con' || className === 'strat_bal' || className === 'strat_agg') && $.inArray(className, classes) === index;
	}).join(' ');

	if (!$matchInfo.length) {
		return null;
	}

	var riskLabel = $riskWrapper.length
		? getAiPlaybookStrategyDirectText($riskWrapper, '.strat_risk_lvl')
		: getAiPlaybookStrategyDirectText($legacyRisk);

	if (!riskLabel && riskTypeClass) {
		riskLabel = riskTypeClass === 'strat_bal' ? 'Balanced' : riskTypeClass === 'strat_agg' ? 'Aggressive' : 'Conservative';
	}

	return {
		strategyName: $nestedName.length ? $.trim($nestedName.text()) : getAiPlaybookStrategyDirectText($betSelection, '.new_tag'),
		riskClass: riskTypeClass,
		riskLabel: riskLabel,
		betDetail: getAiPlaybookStrategyDirectText($betDetail, '.strat_risk_lvl_wrp, .strat_followers'),
		valueText: getAiPlaybookStrategyDirectText($strategyValue),
		valueClass: $strategyValue.hasClass('lose') ? 'lose' : $strategyValue.hasClass('win') ? 'win' : '',
	};
}

function applyAiPlaybookStrategyData($targetInfo, strategyData) {
	var $target = $($targetInfo);
	var $targetName = $target.find('.strat_bet_sel').first();
	var $targetRisk = $target.find('.strat_risk_lvl_wrp .strat_risk_lvl').first();
	var $targetDetail = $target.find('.strat_bet_dtl').first();

	if (!$target.length || !strategyData) {
		return;
	}

	if ($targetName.length && strategyData.strategyName) {
		$targetName.text(strategyData.strategyName);
	}

	if ($targetRisk.length && strategyData.riskClass) {
		$targetRisk.removeClass('strat_con strat_bal strat_agg').addClass(strategyData.riskClass);
		$targetRisk
			.closest('.strat_risk_lvl_wrp')
			.contents()
			.filter(function () {
				return this.nodeType === 3;
			})
			.last()
			.each(function () {
				this.nodeValue = this.nodeValue.replace(/\S[\s\S]*?\S|\S/, strategyData.riskLabel || '');
			});
	}

	if (!$targetRisk.length && $targetDetail.length && strategyData.betDetail) {
		$targetDetail.text(strategyData.betDetail);
	}
}

function applyAiPlaybookStrategySummaryData($targetRoot, strategyData) {
	var $target = $($targetRoot);
	var riskClass;
	var riskLabel;

	if (!$target.length || !strategyData) {
		return;
	}

	var $summary = $target.find('.sd_cont[data-strategy-detail-tab="overview"]').filter(function () {
		return $(this).find('.sd_box_hdr').first().find('.icon-fi-summary').length;
	}).first();
	var $lastBetsValue = $summary.find('.sd_box').filter(function () {
		return $(this).find('.icon-fi-last-bets').length;
	}).find('.strat_value').first();
	var $styleValue = $summary.find('.sd_box').filter(function () {
		return $(this).find('.icon-fi-style').length;
	}).find('.strat_value.txt').first();

	riskClass = strategyData.riskClass;
	riskLabel = strategyData.riskLabel || '';

	if (!riskClass && riskLabel) {
		riskClass = riskLabel === 'Balanced' ? 'strat_bal' : riskLabel === 'Aggressive' ? 'strat_agg' : riskLabel === 'Conservative' ? 'strat_con' : '';
	}

	if (!riskLabel && riskClass) {
		riskLabel = riskClass === 'strat_bal' ? 'Balanced' : riskClass === 'strat_agg' ? 'Aggressive' : riskClass === 'strat_con' ? 'Conservative' : '';
	}

	if ($lastBetsValue.length && strategyData.valueText) {
		$lastBetsValue.removeClass('win lose').text(strategyData.valueText);
		if (strategyData.valueClass) {
			$lastBetsValue.addClass(strategyData.valueClass);
		}
	}

	if ($styleValue.length && riskClass) {
		$styleValue.removeClass('strat_con strat_bal strat_agg').addClass(riskClass).text(riskLabel);
	}
}

function getAiPlaybookStrategyStateFromCard($card, options) {
	var settings = $.extend({ activeTab: 'overview', allocationVariant: 'normal', isCopied: false, copyAgainEntry: false }, options || {});
	var $sourceCard = $($card);
	var strategyData = getAiPlaybookStrategyData($sourceCard);

	if (!$sourceCard.length) {
		return null;
	}

	return {
		index: getAiPlaybookStrategyCardIndex($sourceCard),
		activeTab: settings.activeTab,
		allocationVariant: settings.allocationVariant || 'normal',
		isCopied: settings.isCopied === true || $sourceCard.data('aiPlaybookCopied') === true || $sourceCard.find('.ss_tml_btn.done').length > 0,
		copyAgainEntry: settings.copyAgainEntry === true,
		aiImgHtml: $sourceCard.find('.ai_img').first().prop('outerHTML') || '',
		strategyName: strategyData ? strategyData.strategyName : '',
		riskClass: strategyData ? strategyData.riskClass : '',
		riskLabel: strategyData ? strategyData.riskLabel : '',
		betDetail: strategyData ? strategyData.betDetail : '',
		valueText: strategyData ? strategyData.valueText : '',
		valueClass: strategyData ? strategyData.valueClass : '',
	};
}

function saveAiPlaybookStrategyDetailsState($card, options) {
	var state = getAiPlaybookStrategyStateFromCard($card, options);

	if (state) {
		sessionStorage.setItem('aiPlaybookStrategyDetailsState', JSON.stringify(state));
	}

	return state;
}

function isAiPlaybookStrategyStateCopied(state) {
	var copiedStrategies = getAiPlaybookCopiedStrategies();
	var index = state && state.index;

	return index !== undefined && copiedStrategies[index] && copiedStrategies[index].copied === true;
}

function saveAiPlaybookCopiedStrategy($card, allocationVariant) {
	var state = $card && $card.length ? getAiPlaybookStrategyStateFromCard($card, { allocationVariant: allocationVariant }) : getAiPlaybookCurrentStrategyState();
	var copiedStrategies = getAiPlaybookCopiedStrategies();
	var stoppedStrategies = getAiPlaybookStoppedStrategies();

	if (!state || state.index === undefined) {
		return;
	}

	copiedStrategies[state.index] = {
		copied: true,
		allocationVariant: allocationVariant || state.allocationVariant || 'normal',
	};
	if (stoppedStrategies[state.index]) {
		delete stoppedStrategies[state.index];
		setAiPlaybookStoppedStrategies(stoppedStrategies);
	}
	setAiPlaybookCopiedStrategies(copiedStrategies);
	state.isCopied = true;
	state.activeTab = 'allocation';
	state.allocationVariant = copiedStrategies[state.index].allocationVariant;
	sessionStorage.setItem('aiPlaybookStrategyDetailsState', JSON.stringify(state));
}

function setAiPlaybookStrategyButtonCopied($button) {
	var $targetButton = $($button);

	if (!$targetButton.length) {
		return;
	}

	$targetButton.removeAttr('data-ai-copy-again').removeClass('add disabled stop').addClass('done').html('<i class="icon-fi-ok-circle-bg"></i>Copied');
}

function setAiPlaybookStrategyButtonToppedUp($button) {
	setAiPlaybookStrategyButtonCopied($button);
}

function setAiPlaybookStrategyButtonCopyAgain($button) {
	var $targetButton = $($button);

	if (!$targetButton.length) {
		return;
	}

	$targetButton.attr('data-ai-copy-again', 'true').removeClass('done disabled stop').html('<i class="icon-fi-ai-refresh"></i>Copy');
}

function saveAiPlaybookStoppedStrategy($card) {
	var state = $card && $card.length ? getAiPlaybookStrategyStateFromCard($card, { activeTab: 'overview', isCopied: false, copyAgainEntry: true }) : getAiPlaybookCurrentStrategyState();
	var copiedStrategies = getAiPlaybookCopiedStrategies();
	var stoppedStrategies = getAiPlaybookStoppedStrategies();

	if (!state || state.index === undefined) {
		return;
	}

	if (copiedStrategies[state.index]) {
		delete copiedStrategies[state.index];
		setAiPlaybookCopiedStrategies(copiedStrategies);
	}

	stoppedStrategies[state.index] = {
		stopped: true,
	};
	setAiPlaybookStoppedStrategies(stoppedStrategies);

	state.isCopied = false;
	state.activeTab = 'overview';
	state.allocationVariant = 'normal';
	state.copyAgainEntry = true;
	sessionStorage.setItem('aiPlaybookStrategyDetailsState', JSON.stringify(state));
}

function applyAiPlaybookCopiedStrategies(root) {
	var copiedStrategies = getAiPlaybookCopiedStrategies();
	var $root = $(root || document);

	$root.find('.strat_card_wrp').each(function () {
		var $card = $(this);
		var index = getAiPlaybookStrategyCardIndex($card);
		var copiedState = copiedStrategies[index];

		if (!copiedState || copiedState.copied !== true) {
			return;
		}

		$card.data({
			aiPlaybookCopied: true,
			aiPlaybookAllocationVariant: copiedState.allocationVariant || 'normal',
		});
		if (copiedState.allocationVariant === 'toppedUp') {
			setAiPlaybookStrategyButtonToppedUp($card.find('.strat_row .ss_tml_btn').first());
			return;
		}

		setAiPlaybookStrategyButtonCopied($card.find('.strat_row .ss_tml_btn').first());
	});
}

function applyAiPlaybookStoppedStrategies(root) {
	var stoppedStrategies = getAiPlaybookStoppedStrategies();
	var $root = $(root || document);

	$root.find('.strat_card_wrp').each(function () {
		var $card = $(this);
		var index = getAiPlaybookStrategyCardIndex($card);
		var stoppedState = stoppedStrategies[index];

		if (!stoppedState || stoppedState.stopped !== true) {
			return;
		}

		$card.removeClass('sc_alert').data({
			aiPlaybookCopied: false,
			aiPlaybookAllocationVariant: 'normal',
			aiPlaybookCopyAgainEntry: true,
		});

		if ($card.hasClass('s_tab')) {
			$card.addClass('sc_inactive');
			$card.find('.strat_msg_main').text('Stopped Copying');
			$card.find('.strat_msg_sub').text('Copy strategy again.');
			setAiPlaybookStrategyButtonCopyAgain($card.find('.strat_card_msg .ss_tml_btn').first());
		} else {
			setAiPlaybookStrategyButtonCopyAgain($card.find('.strat_row .ss_tml_btn').first());
		}
	});
}

function closeAiPlaybookPages() {
	var $pages = getAiPlaybookPages();

	$('.aiPB_popup').removeClass('popupOn').hide();
	$pages.removeClass('popupOn').removeData('strategyNestedPopupOn').hide();
}

function prepareAiPlaybookPage($page) {
	setupAiPlaybookFooter($page);
	loadAiGraphTemplates($page);
	initAiGraphWlCopyToggle($page);
	initAiGraphWlTooltip($page);
	initAiGraphWlDays($page);
	initAiGraphWlAxis($page);
	initAiGraphWlPin($page);
	initAiGraphWlInfo($page);
	applyAiPlaybookCopiedStrategies($page);
	applyAiPlaybookStoppedStrategies($page);

	if (typeof initStrategyOverviewToggle === 'function') {
		initStrategyOverviewToggle($page);
	}
}

// demo only: clicking the "Last 100 Bets" summary box cycles the W/L % chart's copy marker:
// hidden -> "Copy started" inside the last 100 bets -> "Copying since" pinned to the left edge -> hidden
function initAiGraphWlCopyToggle(root) {
	var $root = $(root || document);
	var $boxes = $root.find('.sd_box').has('.icon-fi-last-bets').add($root.filter('.sd_box').has('.icon-fi-last-bets'));

	$boxes.off('click.aiGraphWlCopy').on('click.aiGraphWlCopy', function () {
		var $graph = $(this).closest('.strat_dtl_cont_wrp').children('.ai_graph_wl').not('.ai_graph_range');
		var $copy = $graph.find('.ai_graph_wl_copy');

		if (!$copy.length) {
			return;
		}

		if (!$graph.hasClass('copied')) {
			setAiGraphWlCopyMarker($graph, parseInt($copy.attr('data-bet'), 10) || 1, $copy.attr('data-label'));
		} else if (!$copy.hasClass('before')) {
			setAiGraphWlCopyMarker($graph, 0, $copy.attr('data-before-label'));
		} else {
			setAiGraphWlCopyMarker($graph, null);
		}
	});
}

// bet: 1–100 draws the marker line at that bet, 0 or below pins the label to the left edge, null hides it
function setAiGraphWlCopyMarker(graph, bet, label) {
	var $graph = $(graph);
	var $chart = $graph.find('.ai_graph_wl_chart');
	var $copy = $chart.children('.ai_graph_wl_copy');
	var $label = $copy.children('.ai_graph_wl_copy_lbl');
	var points = ($graph.find('.ai_graph_wl_line').first().attr('d') || '').match(/-?[\d.]+,-?[\d.]+/g) || [];
	var betCount = points.length - 1;
	var isBefore = bet !== null && bet < 1;

	$label.removeClass('left');

	if (bet === null || !$copy.length || betCount < 1) {
		$graph.removeClass('copied');
		return;
	}

	if (label) {
		$label.text(label);
	}

	$copy.toggleClass('before', isBefore).css('left', isBefore ? 0 : (Math.min(bet, betCount) / betCount) * 100 + '%');
	$graph.addClass('copied');

	// keep the label inside the chart when the copy started near the right edge
	if (!isBefore && $copy.position().left + $label.outerWidth(true) > $chart.width()) {
		$label.addClass('left');
	}
}

// W/L % chart: the pin keeps the chart on screen while scrolling (Strategy Detail only)
function initAiGraphWlPin(root) {
	var $root = $(root || document);
	var $pins = $root.find('.ai_graph_wl_pin').add($root.filter('.ai_graph_wl_pin'));

	$pins.off('click.aiGraphWlPin').on('click.aiGraphWlPin', function () {
		var $pin = $(this);
		var $graph = $pin.closest('.ai_graph_wl');
		var isPinned = !$pin.hasClass('active');
		var $content = $graph.closest('.ai_content');
		var $stickies = $content.find('.strat_dtl_grp.sticky, .strat_dtl_tab_grp.sticky').filter(':visible');
		var top = 0;

		// stick as high as the page's sticky bars do (just under the page header), covering them
		if ($stickies.length) {
			top = Math.min.apply(
				null,
				$stickies
					.map(function () {
						return parseFloat($(this).css('top')) || 0;
					})
					.get()
			);
		}

		$pin
			.toggleClass('active', isPinned)
			.attr({ 'aria-pressed': String(isPinned), 'aria-label': isPinned ? 'Unpin chart' : 'Pin chart while scrolling' });
		$graph.toggleClass('pinned', isPinned).css('top', isPinned ? top : '');
	});
}

// W/L % chart: the info button opens the "Your W/L %" explanation under the title (My Copy chart)
function initAiGraphWlInfo(root) {
	var $root = $(root || document);
	var $buttons = $root.find('.ai_graph_wl_info').add($root.filter('.ai_graph_wl_info'));

	function closeInfo($button) {
		$button.removeClass('active').attr('aria-expanded', 'false');
		$button.closest('.ai_graph_wl').find('.ai_graph_wl_info_tip').removeClass('active');
	}

	$buttons.off('click.aiGraphWlInfo').on('click.aiGraphWlInfo', function () {
		var $button = $(this);
		var $tip = $button.closest('.ai_graph_wl').find('.ai_graph_wl_info_tip');
		var $hdr = $button.closest('.ai_graph_wl_hdr');
		var position;

		if ($button.hasClass('active')) {
			closeInfo($button);
			return;
		}

		$button.addClass('active').attr('aria-expanded', 'true');
		$tip.addClass('active');

		// open just under the header row (fixed, not tied to the button's height), with the arrow pointing at the icon
		position = $button.position();
		$tip.css('top', $hdr.position().top + $hdr.outerHeight() - 2);
		$tip.children('.ai_graph_wl_info_arrow').css('left', position.left + $button.outerWidth() / 2 - $tip.position().left - 5);
	});

	function closeAllInfo() {
		$('.ai_graph_wl_info.active').each(function () {
			closeInfo($(this));
		});
	}

	// tapping anywhere else closes it
	$(document)
		.off('pointerdown.aiGraphWlInfo')
		.on('pointerdown.aiGraphWlInfo', function (e) {
			if (!$(e.target).closest('.ai_graph_wl_info, .ai_graph_wl_info_tip').length) {
				closeAllInfo();
			}
		});

	// scrolling closes it too; scroll does not bubble, so listen in the capture phase to catch any scrolling container
	if (window.aiGraphWlInfoScrollHandler) {
		document.removeEventListener('scroll', window.aiGraphWlInfoScrollHandler, true);
	}

	window.aiGraphWlInfoScrollHandler = function () {
		if ($('.ai_graph_wl_info.active').length) {
			closeAllInfo();
		}
	};
	document.addEventListener('scroll', window.aiGraphWlInfoScrollHandler, true);
}

// W/L % chart: tap or drag inside the chart to show the guide line, dot and bet tooltip
function initAiGraphWlTooltip(root) {
	var $root = $(root || document);
	var $charts = $root.find('.ai_graph_wl_chart').add($root.filter('.ai_graph_wl_chart'));
	var tipWidth = 104;
	var tipGap = 14;

	$charts.each(function () {
		var $chart = $(this);
		var viewWidth = parseFloat($chart.find('.ai_graph_wl_svg').attr('width')) || 317;
		var $graph = $chart.closest('.ai_graph_wl');
		var $guide = $chart.children('.ai_graph_wl_guide');
		var $dot = $chart.children('.ai_graph_wl_dot');
		var $tip = $chart.children('.ai_graph_wl_tip');
		var $yLabels = $graph.find('.ai_graph_wl_yaxis span');
		var baseY = parseFloat($chart.find('.ai_graph_wl_base').attr('y1')) || 96;
		var axisTop = parseAiGraphWlPercent($yLabels.first().text());
		var axisBottom = parseAiGraphWlPercent($yLabels.last().text());
		var pxPerPercent = (parseFloat($chart.find('.ai_graph_wl_svg').attr('height')) || 128) / (axisTop - axisBottom) || 3.2;
		var points = ($chart.find('.ai_graph_wl_line').first().attr('d') || '').match(/-?[\d.]+,-?[\d.]+/g) || [];
		var days = [];
		var firstBet = 1;
		var isDragging = false;

		points = $.map(points, function (point) {
			var xy = point.split(',');

			return { x: parseFloat(xy[0]), y: parseFloat(xy[1]) };
		});

		if (points.length < 2) {
			return;
		}

		$graph.find('.ai_graph_wl_day').each(function () {
			var count = parseInt($(this).attr('data-bets'), 10) || 0;

			days.push({ date: $(this).attr('data-date') || '', from: firstBet, count: count });
			firstBet += count;
		});

		function getBetSettled(bet) {
			var day;
			var minutes;

			for (var i = 0; i < days.length; i++) {
				day = days[i];

				if (bet < day.from + day.count) {
					// demo only: spread each day's bets between 09:30 and 21:45
					minutes = 570 + Math.round(((bet - day.from) / Math.max(day.count - 1, 1)) * 735);

					return day.date + ' ' + ('0' + Math.floor(minutes / 60)).slice(-2) + ':' + ('0' + (minutes % 60)).slice(-2);
				}
			}

			return '';
		}

		function getBetFromEvent(e) {
			var scale = $chart.width() / viewWidth;
			var x = e.originalEvent.clientX - $chart[0].getBoundingClientRect().left;
			var bet = Math.round(x / scale / (viewWidth / (points.length - 1)));

			return Math.min(Math.max(bet, 1), points.length - 1);
		}

		function showBet(bet) {
			var point = points[bet];
			var scale = $chart.width() / viewWidth;
			var x = point.x * scale;
			var value = (baseY - point.y) / pxPerPercent;
			var isWin = value >= 0;
			var isWon = point.y < points[bet - 1].y;
			var isRight = x - tipGap - tipWidth < 0;
			var settled = getBetSettled(bet);

			$graph.addClass('active');
			$guide.css('left', x);
			$dot.css({ left: x, top: point.y }).toggleClass('win', isWin).toggleClass('lose', !isWin);
			$tip.toggleClass('right', isRight).css({ left: isRight ? x + tipGap : x - tipGap - tipWidth, top: point.y });
			$tip.find('.ai_graph_wl_tip_val')
				.text((isWin ? '+' : '-') + Math.abs(value).toFixed(2) + '%')
				.toggleClass('win', isWin)
				.toggleClass('lose', !isWin);
			$tip.find('.ai_graph_wl_tip_tag').text(isWon ? 'WON' : 'LOST').toggleClass('win', isWon).toggleClass('lose', !isWon);
			$tip.find('.ai_graph_wl_tip_info').text('Bet ' + bet + (settled ? ' · ' + settled : ''));
		}

		$chart
			.off('.aiGraphWlTip')
			.on('pointerdown.aiGraphWlTip', function (e) {
				isDragging = true;

				if (this.setPointerCapture) {
					this.setPointerCapture(e.originalEvent.pointerId);
				}

				// picking a bet replaces the selected date
				clearAiGraphWlDay($graph);
				showBet(getBetFromEvent(e));
			})
			.on('pointermove.aiGraphWlTip', function (e) {
				if (isDragging) {
					showBet(getBetFromEvent(e));
				}
			})
			.on('pointerup.aiGraphWlTip pointercancel.aiGraphWlTip', function () {
				isDragging = false;
			});
	});

	$(document)
		.off('pointerdown.aiGraphWlTip')
		.on('pointerdown.aiGraphWlTip', function (e) {
			if (!$(e.target).closest('.ai_graph_wl_chart').length) {
				$('.ai_graph_wl.active').removeClass('active');
			}
		});

	$(window)
		.off('resize.aiGraphWlTip')
		.on('resize.aiGraphWlTip', function () {
			$('.ai_graph_wl.active').removeClass('active');
		});
}

function parseAiGraphWlPercent(text) {
	return parseFloat(String(text).replace('−', '-').replace(/[^\d.-]/g, '')) || 0;
}

// W/L % chart: fit the x-axis to any bet count (Bet 1 · ¼ · ½ · ¾ · last) and hide day names on narrow day tabs
function initAiGraphWlAxis(root) {
	var $root = $(root || document);
	var $graphs = $root.find('.ai_graph_wl').add($root.filter('.ai_graph_wl'));
	var context = document.createElement('canvas').getContext('2d');

	// width of the text in the day tab's own font; works while the tab is hidden
	function getTextWidth(el, text) {
		var style = window.getComputedStyle(el);

		context.font = style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
		return context.measureText(text).width;
	}

	$graphs.each(function () {
		var $graph = $(this);
		var $svg = $graph.find('.ai_graph_wl_svg');
		var $labels = $graph.find('.ai_graph_wl_bets span');
		var $days = $graph.find('.ai_graph_wl_day');
		var viewWidth = parseFloat($svg.attr('width')) || 317;
		var points = ($svg.find('.ai_graph_wl_line').first().attr('d') || '').match(/-?[\d.]+,-?[\d.]+/g) || [];
		var total = points.length - 1;
		var quarter = total / 4;
		var step = quarter >= 10 ? Math.round(quarter / 5) * 5 : Math.round(quarter);
		var lastShown = 1;

		if (total < 1 || $labels.length < 5) {
			return;
		}

		$labels.first().text('Bet 1');
		$labels.last().text(total);

		// middle labels sit at their bet's position; drop any that would repeat or touch Bet 1 / the last bet
		$labels.slice(1, 4).each(function (i) {
			var bet = step * (i + 1);
			var isShown = bet > lastShown && bet < total;

			$(this)
				.text(bet)
				.css('left', (bet / total) * 100 + '%')
				.toggle(isShown);

			if (isShown) {
				lastShown = bet;
			}
		});

		// a day too narrow for its name and date ("Wed 14") shows only the date ("14"), like the handoff
		$days.each(function () {
			var $day = $(this).removeClass('narrow');
			var $name = $day.children('span');
			var $date = $day.children('b');
			var count = parseInt($day.attr('data-bets'), 10) || 0;
			var dayWidth = (count / total) * viewWidth - 1;
			var gap = parseFloat(window.getComputedStyle(this).columnGap) || 3;

			if (!$name.length || !$date.length) {
				return;
			}

			$day.toggleClass('narrow', getTextWidth($name[0], $name.text()) + gap + getTextWidth($date[0], $date.text()) > dayWidth);
		});
	});
}

// W/L % chart: unselect the selected date (tab, band, line highlight and day card)
function clearAiGraphWlDay(graph) {
	var $graph = $(graph);

	$graph.removeClass('day_active');
	$graph.find('.ai_graph_wl_day').removeClass('active').attr('aria-selected', 'false');
	$graph.find('.ai_graph_wl_band').removeClass('active');
}

// W/L % chart: tap a date to highlight that day's band and line, and show the day card under the chart
function initAiGraphWlDays(root) {
	var $root = $(root || document);
	var $graphs = $root.find('.ai_graph_wl').add($root.filter('.ai_graph_wl'));
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	$graphs.each(function () {
		var $graph = $(this);
		var $chart = $graph.find('.ai_graph_wl_chart');
		var $svg = $chart.find('.ai_graph_wl_svg');
		var $days = $graph.find('.ai_graph_wl_day');
		var $bands = $graph.find('.ai_graph_wl_band');
		var $highlight = $svg.find('.ai_graph_wl_day_hl');
		var $edges = $chart.children('.ai_graph_wl_day_edge');
		var $dots = $chart.children('.ai_graph_wl_day_dot');
		var $card = $graph.children('.ai_graph_wl_card');
		var $yLabels = $graph.find('.ai_graph_wl_yaxis span');
		var viewWidth = parseFloat($svg.attr('width')) || 317;
		var baseY = parseFloat($svg.find('.ai_graph_wl_base').attr('y1')) || 96;
		var axisRange = parseAiGraphWlPercent($yLabels.first().text()) - parseAiGraphWlPercent($yLabels.last().text());
		var pxPerPercent = (parseFloat($svg.attr('height')) || 128) / axisRange || 3.2;
		var points = ($svg.find('.ai_graph_wl_line').first().attr('d') || '').match(/-?[\d.]+,-?[\d.]+/g) || [];
		var days = [];
		var firstBet = 1;

		points = $.map(points, function (point) {
			var xy = point.split(',');

			return { x: parseFloat(xy[0]), y: parseFloat(xy[1]) };
		});

		if (points.length < 2 || !$days.length) {
			return;
		}

		$days.each(function () {
			var $day = $(this);
			var count = parseInt($day.attr('data-bets'), 10) || 0;

			days.push({ name: $.trim($day.children('span').text()), date: $day.attr('data-date') || '', from: firstBet, count: count });
			firstBet += count;
		});

		// the selected day redraws the line at full strength, clipped to that day
		if (!$highlight.children().length) {
			$svg.find('.ai_graph_wl_all').children('.ai_graph_wl_area, .ai_graph_wl_line').each(function () {
				var $path = $(this);
				var isArea = $path.hasClass('ai_graph_wl_area');
				var side = $path.hasClass('lose') ? ' lose' : ' win';

				$path
					.clone()
					.removeAttr('pathLength')
					.attr('class', isArea ? 'ai_graph_wl_day_area' : 'ai_graph_wl_day_line' + side)
					.appendTo($highlight);
			});
		}

		function getDateLabel(day) {
			var parts = day.date.split('/');

			return day.name + ', ' + parseInt(parts[0], 10) + ' ' + (months[parseInt(parts[1], 10) - 1] || '');
		}

		function clearDay() {
			clearAiGraphWlDay($graph);
		}

		function selectDay(index) {
			var day = days[index];
			var startIndex = Math.min(day.from - 1, points.length - 1);
			var endIndex = Math.min(day.from + day.count - 1, points.length - 1);
			var start = points[startIndex];
			var end = points[endIndex];
			var dayValue = (start.y - end.y) / pxPerPercent;
			var won = 0;

			for (var i = startIndex + 1; i <= endIndex; i++) {
				if (points[i].y < points[i - 1].y) {
					won++;
				}
			}

			clearDay();
			$graph.addClass('day_active');
			$days.eq(index).addClass('active').attr('aria-selected', 'true');
			$bands.eq(index).addClass('active');
			$svg.find('.ai_graph_wl_day_clip').attr({ x: start.x, width: end.x - start.x });

			$.each([start, end], function (i, point) {
				var isWin = point.y <= baseY;

				$edges.eq(i).css('left', (point.x / viewWidth) * 100 + '%');
				$dots
					.eq(i)
					.css({ left: (point.x / viewWidth) * 100 + '%', top: point.y })
					.toggleClass('win', isWin)
					.toggleClass('lose', !isWin);
			});

			$card.find('.ai_graph_wl_card_date').text(getDateLabel(day));
			$card.find('.ai_graph_wl_card_range').text('Bet ' + (startIndex + 1) + '–' + endIndex);
			$card.find('.ai_graph_wl_card_total').text(endIndex - startIndex);
			$card.find('.ai_graph_wl_card_won').text(won);
			$card.find('.ai_graph_wl_card_lost').text(endIndex - startIndex - won);
			$card
				.find('.ai_graph_wl_card_val')
				.text((dayValue >= 0 ? '+' : '-') + Math.abs(dayValue).toFixed(2) + '%')
				.toggleClass('win', dayValue >= 0)
				.toggleClass('lose', dayValue < 0);
		}

		$days.off('click.aiGraphWlDay').on('click.aiGraphWlDay', function () {
			var index = $days.index(this);

			if ($(this).hasClass('active')) {
				clearDay();
				return;
			}

			selectDay(index);
		});
	});
}

function getAiPlaybookStrategyDetailContent($tabHeader) {
	var $strategyContent = $tabHeader.closest('.strat_dtl_cont');

	if (!$strategyContent.length) {
		$strategyContent = $tabHeader.closest('.strat_dtl_grp').next('.strat_dtl_cont');
	}

	return $strategyContent;
}

function getAiPlaybookStrategyContentTitle($content) {
	return $.trim($content.children('.sd_box_hdr').first().text()).toLowerCase();
}

function getAiPlaybookStrategyTabKey(tabText) {
	if (tabText.indexOf('overview') !== -1) {
		return 'overview';
	}

	if (tabText.indexOf('allocation') !== -1) {
		return 'allocation';
	}

	if (tabText.indexOf('bet history') !== -1) {
		return 'bet-history';
	}

	return '';
}

function shouldShowAiPlaybookStrategyContent($content, tabText, tabKey) {
	tabKey = tabKey || getAiPlaybookStrategyTabKey(tabText);
	var contentTab = $content.data('strategy-detail-tab');
	var contentTitle = getAiPlaybookStrategyContentTitle($content);

	if (contentTab) {
		return contentTab === tabKey;
	}

	if (tabText.indexOf('overview') !== -1) {
		return contentTitle.indexOf('strategy summary') !== -1 || contentTitle.indexOf('strategy signals') !== -1;
	}

	if (tabText.indexOf('allocation') !== -1) {
		return contentTitle.indexOf('allocation summary') !== -1 || contentTitle.indexOf('activities') !== -1;
	}

	if (tabText.indexOf('bet history') !== -1) {
		return contentTitle.indexOf('bet history') !== -1;
	}

	return false;
}

function limitAiPlaybookAllocationSummaries($contents, $visibleContents, tabKey) {
	var $allocationSummaries;
	var $targetSummary;

	if (tabKey !== 'allocation') {
		return $visibleContents;
	}

	$allocationSummaries = $contents.filter('[data-strategy-detail-tab="allocation"]').filter(function () {
		return getAiPlaybookStrategyContentTitle($(this)).indexOf('allocation summary') !== -1;
	});
	$targetSummary = $allocationSummaries.first();

	$allocationSummaries.hide();

	if ($targetSummary.length) {
		$targetSummary.show();
		return $visibleContents.not($allocationSummaries).add($targetSummary);
	}

	return $visibleContents.not($allocationSummaries);
}

function setAiPlaybookStrategyOverviewTab(root, tabIndex, options) {
	var settings = $.extend({ showOnlySelectedTab: false, removeActiveClass: false }, options || {});
	var $root = $(root || document);
	var $tabHeaders = $root.find('.strat_dtl_tab_grp').add($root.filter('.strat_dtl_tab_grp'));

	if (!$tabHeaders.length) {
		$tabHeaders = $root.prev('.strat_dtl_grp').find('.strat_dtl_tab_grp');
	}

	$tabHeaders.each(function () {
		var $tabHeader = $(this);
		var $tabs = $tabHeader.children('.strat_dtl_tab');
		var $strategyContent = getAiPlaybookStrategyDetailContent($tabHeader);
		var $contents = $strategyContent.children('.strat_dtl_cont_wrp').children('.sd_cont');
		var $graph = $strategyContent.children('.strat_dtl_cont_wrp').children('.ai_graph, .ai_graph_wl');
		var $selectedTab = $tabs.eq(tabIndex);
		var $visibleTabs = $tabs.not('.hide');
		var tabText = $.trim($selectedTab.text()).toLowerCase();
		var tabKey = $selectedTab.data('strategy-detail-tab') || getAiPlaybookStrategyTabKey(tabText);
		var $visibleContents = $();

		if (!$tabs.length) {
			return;
		}

		if (!$visibleTabs.length) {
			$visibleTabs = $tabs;
		}

		if ($selectedTab.hasClass('hide')) {
			$selectedTab = $visibleTabs.first();
			tabIndex = $tabs.index($selectedTab);
			tabText = $.trim($selectedTab.text()).toLowerCase();
			tabKey = $selectedTab.data('strategy-detail-tab') || getAiPlaybookStrategyTabKey(tabText);
		}

		if ($visibleTabs.length <= 1) {
			settings.removeActiveClass = true;
		}

		// each chart shows on its own tab (data-strategy-detail-tab), Overview when not set
		$graph.each(function () {
			$(this).toggle(($(this).data('strategy-detail-tab') || 'overview') === tabKey);
		});
		if ($tabs.length <= 1) {
			$tabs.css('display', '').removeClass('active hide');
			$contents.css('margin-bottom', '');
			$contents.each(function () {
				var $content = $(this);
				var shouldShow = shouldShowAiPlaybookStrategyContent($content, tabText, tabKey);

				$content.toggle(shouldShow);

				if (shouldShow) {
					$visibleContents = $visibleContents.add($content);
				}
			});
			$visibleContents = limitAiPlaybookAllocationSummaries($contents, $visibleContents, tabKey);
			$visibleContents.last().css('margin-bottom', 0);
			return;
		}

		$visibleTabs.css('display', '').removeClass('active');
		$tabs.filter('.hide').css('display', '').removeClass('active');

		if (settings.showOnlySelectedTab) {
			$tabs.addClass('hide').eq(tabIndex).removeClass('hide');
		}

		if (!settings.removeActiveClass) {
			$tabs.eq(tabIndex).addClass('active');
		}

		$contents.css('margin-bottom', '');
		$contents.each(function () {
			var $content = $(this);
			var shouldShow = shouldShowAiPlaybookStrategyContent($content, tabText, tabKey);

			$content.toggle(shouldShow);

			if (shouldShow) {
				$visibleContents = $visibleContents.add($content);
			}
		});

		$visibleContents = limitAiPlaybookAllocationSummaries($contents, $visibleContents, tabKey);
		$visibleContents.last().css('margin-bottom', 0);
	});
}

function setAiPlaybookTutorialOverviewStep(root, step) {
	var $root = $(root || '.devDontCopy_strategy_details');

	if (step === 'step3') {
		setAiPlaybookStrategyOverviewTab($root, 0, {
			showOnlySelectedTab: true,
		});
	}

	if (step === 'step4') {
		$root.find('.strat_dtl_tab_grp').children('.strat_dtl_tab').removeClass('hide').css('display', '');
		setAiPlaybookStrategyOverviewTab($root, 1);
	}
}

function getAiPlaybookTutorialMaskSelector() {
	return '> .bg_mask, > .aiPB_mask_btn, .strat_card_grp > .bg_mask, .strat_card_grp > .aiPB_mask_btn, .strat_dtl_grp > .bg_mask, .strat_dtl_grp > .aiPB_mask_btn, .strat_dtl_cont > .strat_dtl_cont_wrp > .bg_mask, .strat_dtl_cont > .strat_dtl_cont_wrp > .aiPB_mask_btn';
}

function getAiPlaybookTutorialStep3HighlightedSelector() {
	return '.strat_dtl_tab_grp, .ai_graph, .sd_cont:first, .sd_cont:eq(1) > .sd_box_hdr';
}

function detachAiPlaybookTutorialDetailTabs(root) {
	var $root = $(root || '.devDontCopy_strategy_details');
	var copyStrategyDetailTabsSelector = '[data-strategy-detail-tab="allocation"], [data-strategy-detail-tab="bet-history"]';

	$root.find('.strat_dtl_tab_grp').each(function () {
		var $tabHeader = $(this);
		var $tabs = $tabHeader.children(copyStrategyDetailTabsSelector);

		if ($tabs.length) {
			$tabHeader.data('copyStrategyDetailTabs', $tabs.removeClass('active').detach());
		}
	});
}

function getAiPlaybookTutorialHighlightedSelector() {
	return '.strat_card_wrp, .strat_dtl_tab_grp, .sd_cont:has(.aiPB_tut_step4), ' + getAiPlaybookTutorialStep3HighlightedSelector();
}

function clearAiPlaybookTutorialView(root) {
	var $root = $(root || getAiPlaybookPages());

	$root.find(getAiPlaybookTutorialMaskSelector()).hide();
	$root.removeClass('popupOn').find('.ai_tutor').hide();
	$root.find(getAiPlaybookTutorialHighlightedSelector()).removeClass('highlighted');
	$('.footer_main').removeClass('aiPB_footer_mask');
}

function showAiPlaybookTutorialStep2(root) {
	var $leaderboard = $(root || '.devDontCopy_leaderboard_strategies');

	if (!$leaderboard.length) {
		return;
	}

	$leaderboard.addClass('popupOn');
	$leaderboard.find(getAiPlaybookTutorialMaskSelector()).show();
	$leaderboard.find('.ai_tutor').hide();
	$leaderboard.find('.aiPB_tut_step2').show();
	$('.footer_main').addClass('aiPB_footer_mask');
}

function showAiPlaybookTutorialStep3(root) {
	var $details = $(root || '.devDontCopy_strategy_details');

	if (!$details.length) {
		return;
	}

	if ($.isFunction(window.showAiPlaybookCopiedStrategyDetails)) {
		window.showAiPlaybookCopiedStrategyDetails({
			activeTab: 'overview',
			allocationVariant: 'normal',
		});
	}
	setAiPlaybookTutorialOverviewStep($details, 'step3');
	detachAiPlaybookTutorialDetailTabs($details);
	$details.addClass('popupOn');
	$details.find(getAiPlaybookTutorialMaskSelector()).show();
	$details.find('.ai_tutor').hide();
	$details.find('.aiPB_tut_step3').show();
	$details.find(getAiPlaybookTutorialStep3HighlightedSelector()).addClass('highlighted');
	$('.footer_main').addClass('aiPB_footer_mask');
}

function showAiPlaybookTutorialStep4(root) {
	var $details = $(root || '.devDontCopy_strategy_details');

	if (!$details.length) {
		return;
	}

	$details.find(getAiPlaybookTutorialHighlightedSelector()).removeClass('highlighted');
	$details.find('.ai_tutor').hide();
	if ($.isFunction(window.showAiPlaybookCopiedStrategyDetails)) {
		window.showAiPlaybookCopiedStrategyDetails({
			activeTab: 'allocation',
			allocationVariant: 'normal',
		});
	}
	setAiPlaybookTutorialOverviewStep($details, 'step4');
	$details.addClass('popupOn');
	$details.find(getAiPlaybookTutorialMaskSelector()).show();
	$details.find('.aiPB_tut_step4').show();
	$details.find('.strat_dtl_tab_grp').addClass('highlighted');
	$details.find('.sd_cont:has(.aiPB_tut_step4)').addClass('highlighted');
}

function applyAiPlaybookTutorialState() {
	var tutorialStep = sessionStorage.getItem('aiPlaybookTutorial');
	var $leaderboard = $('.devDontCopy_leaderboard_strategies');
	var $details = $('.devDontCopy_strategy_details');

	if (tutorialStep === 'step2') {
		showAiPlaybookTutorialStep2($leaderboard);
	} else if (tutorialStep === 'step3') {
		showAiPlaybookTutorialStep3($details);
	} else if (tutorialStep === 'step4') {
		showAiPlaybookTutorialStep4($details);
	}
}

function handleAiPlaybookTutorialMaskClick($button) {
	var tutorialStep = sessionStorage.getItem('aiPlaybookTutorial');
	var $leaderboard = $('.devDontCopy_leaderboard_strategies');
	var $details = $('.devDontCopy_strategy_details');

	if (tutorialStep === 'step1') {
		$button.attr('id', 'demoOnly_promo_mask').removeClass('aiPB_mask_btn').addClass('prm_msk_btn').hide();
		$('#ai_playbook_home').removeClass('highlighted');
		$('#ai_playbook_home .ai_tutor').hide();
		$('.footer_main .footer_mask, .footer_main .ftr_tab_mask, .fltr_ftr_msk').hide();
		sessionStorage.setItem('aiPlaybookTutorial', 'step2');
		openAiPlaybookHome();
		return;
	}

	if (tutorialStep === 'step2') {
		var $tutorialCard = $leaderboard.find('.strat_card_wrp:has(.aiPB_tut_step2)').first();

		clearAiPlaybookTutorialView($leaderboard);
		if ($tutorialCard.length) {
			saveAiPlaybookStrategyDetailsState($tutorialCard, {
				activeTab: 'overview',
				allocationVariant: $tutorialCard.data('aiPlaybookAllocationVariant') || 'normal',
				isCopied: true,
			});
		}
		sessionStorage.setItem('aiPlaybookTutorial', 'step3');
		goAiPlaybookPage('strategyDetails');
		return;
	}

	if (tutorialStep === 'step3') {
		showAiPlaybookTutorialStep4($details);
		sessionStorage.setItem('aiPlaybookTutorial', 'step4');
		return;
	}

	clearAiPlaybookTutorialView(getAiPlaybookPages());
	setAiPlaybookTutorialOverviewStep($details, 'step4');
	setAiPlaybookHomeIconActive(false);
	$('#selectfilter').hide().find('.fltr_grp_wrp').removeClass('show');
	popupOff();
	sessionStorage.removeItem('aiPlaybookTutorial');
}

function initAiPlaybookTutorialMaskHandler() {
	$(document)
		.off('click.aiPlaybookTutorialMask', '.aiPB_mask_btn')
		.on('click.aiPlaybookTutorialMask', '.aiPB_mask_btn', function () {
			handleAiPlaybookTutorialMaskClick($(this));
		});
}

$(document).ready(function () {
	initAiPlaybookTutorialMaskHandler();
	setTimeout(function () {
		applyAiPlaybookTutorialState();
	}, 0);
});

function showAiPlaybookLeaderboard(options) {
	var settings = $.extend({ popupClass: false, afterShow: null }, options || {});
	var $leaderboardStrategies = $('.devDontCopy_leaderboard_strategies');
	var $strategyDetails = $('.devDontCopy_strategy_details');

	if (!$leaderboardStrategies.length) {
		goAiPlaybookPage('leaderboardStrategies');
		return;
	}

	if (!$leaderboardStrategies.children().length) {
		$leaderboardStrategies.load(getAiPlaybookPath('leaderboardStrategies'), function () {
			showAiPlaybookLeaderboard(settings);
		});
		return;
	}

	$strategyDetails.removeClass('popupOn').hide();
	$leaderboardStrategies.toggleClass('popupOn', settings.popupClass === true).show();
	prepareAiPlaybookPage($leaderboardStrategies);
	popupOn();
	setLeaderboardStrategiesSticky();

	if ($.isFunction(settings.afterShow)) {
		settings.afterShow($leaderboardStrategies);
	}
}

function showAiPlaybookStrategyDetails(options) {
	var settings = $.extend({ popupClass: false, afterShow: null }, options || {});
	var $leaderboardStrategies = $('.devDontCopy_leaderboard_strategies');
	var $strategyDetails = $('.devDontCopy_strategy_details');

	if (!$strategyDetails.length) {
		goAiPlaybookPage('strategyDetails');
		return;
	}

	if (!$strategyDetails.children().length) {
		$strategyDetails.load(getAiPlaybookPath('strategyDetails'), function () {
			showAiPlaybookStrategyDetails(settings);
		});
		return;
	}

	$leaderboardStrategies.removeClass('popupOn').hide();
	$strategyDetails.toggleClass('popupOn', settings.popupClass === true).show();
	prepareAiPlaybookPage($strategyDetails);
	popupOn();
	setAiPlaybookStrategyDetailsSticky($strategyDetails);
	setTimeout(function () {
		setAiPlaybookStrategyDetailsSticky($strategyDetails);
	}, 0);

	if ($.isFunction(window.showAiPlaybookStrategyDetailsPageLoading)) {
		window.showAiPlaybookStrategyDetailsPageLoading($strategyDetails);
	}

	if ($.isFunction(settings.afterShow)) {
		settings.afterShow($strategyDetails);
		setAiPlaybookStrategyDetailsSticky($strategyDetails);
	}
}

function setAiPlaybookPageNestedPopupOn(root) {
	var $page = root ? $(root) : getActiveAiPlaybookPage();
	var $body = $('body');

	if (!$page.length) {
		return;
	}

	$page.data('strategyNestedPopupOn', true);

	if ($body.length && !$body.hasClass('popupOn')) {
		$body.addClass('popupOn').data('aiPlaybookNestedBodyPopupOn', true);
	}
}

function releaseAiPlaybookPageNestedPopupOn(root) {
	var $page = root ? $(root) : getActiveAiPlaybookPage();

	if (!$page.data('strategyNestedPopupOn')) {
		return;
	}

	if (!$('.aiPB_popup:visible').length && !$('.devDontCopy_stop_copying:visible').length) {
		$page.removeClass('popupOn').removeData('strategyNestedPopupOn');

		if ($('body').data('aiPlaybookNestedBodyPopupOn')) {
			$('body').removeClass('popupOn').removeData('aiPlaybookNestedBodyPopupOn');
		}
	}
}

function setLeaderboardStrategiesSticky() {
	var $leaderboardStrategies = $('.devDontCopy_leaderboard_strategies');
	var headerHeight = $leaderboardStrategies.find('.n_header_sports').outerHeight(true) || 0;
	var menuHeight = $leaderboardStrategies.find('.lb_menu_cover').outerHeight(true) || 0;
	var activeBorderHeight = parseFloat($leaderboardStrategies.find('.lb_menu_itm.active').css('border-bottom-width')) || 2;

	$leaderboardStrategies.find('.lb_menu_cover').css({
		top: headerHeight,
	});
	$leaderboardStrategies.find('.lb_top_rw').css({
		top: headerHeight + menuHeight + activeBorderHeight,
	});
}

function setAiPlaybookStrategyDetailsSticky(root) {
	var $root = $(root || '.devDontCopy_strategy_details');
	var $header = $root.find('.n_header').first();
	var $detailGroup = $root.find('.strat_dtl_grp').first();
	var headerHeight = $header.outerHeight(true) || 0;
	var detailGroupHeight = $detailGroup.outerHeight(true) || 0;
	var tabTop;

	if (!$root.is(':visible') || !detailGroupHeight) {
		return 0;
	}

	tabTop = headerHeight + detailGroupHeight;
	$root.find('.strat_dtl_tab_grp.sticky').css('top', tabTop + 'px');

	return tabTop;
}

function initStrategyOverviewToggle(root) {
	var $root = $(root || document);
	var $texts = $root.find('.sd_txt').add($root.filter('.sd_txt'));

	if (!$texts.length) {
		return;
	}

	function getOverviewLineCount(descEl) {
		var range;
		var rects;
		var lineTops = [];

		if (!descEl || !descEl.textContent.trim()) {
			return 0;
		}

		range = document.createRange();
		range.selectNodeContents(descEl);
		rects = range.getClientRects();

		for (var i = 0; i < rects.length; i++) {
			if (
				!lineTops.some(function (top) {
					return Math.abs(top - rects[i].top) < 1;
				})
			) {
				lineTops.push(rects[i].top);
			}
		}

		return lineTops.length;
	}

	function syncOverviewText($text) {
		var $desc = $text.children('.sd_desc').first();
		var descEl = $desc[0];
		var $icon = $text.children('i').first();
		var isExpanded = $text.data('strategyOverviewExpanded') === true;
		var lineCount;

		if (!$desc.length || !$icon.length || !descEl.getClientRects().length) {
			return;
		}

		$desc.removeClass('strat_collapse');
		lineCount = getOverviewLineCount(descEl);

		if (lineCount <= 3) {
			$text.data('strategyOverviewExpanded', false);
			$icon.addClass('hide').removeClass('fl_rotate');
			$desc.removeClass('strat_collapse');
			return;
		}

		$desc.toggleClass('strat_collapse', !isExpanded);
		$icon.removeClass('hide').toggleClass('fl_rotate', !isExpanded);
	}

	$texts.each(function () {
		syncOverviewText($(this));
	});

	$texts.off('click.strategyOverviewToggle').on('click.strategyOverviewToggle', function () {
		var $text = $(this);
		var $desc = $text.children('.sd_desc').first();
		var $icon = $text.children('i').first();
		var willExpand;

		if (!$desc.length || !$icon.length || $icon.hasClass('hide')) {
			return;
		}

		willExpand = $desc.hasClass('strat_collapse');
		$text.data('strategyOverviewExpanded', willExpand);
		$desc.toggleClass('strat_collapse', !willExpand);
		$icon.toggleClass('fl_rotate', !willExpand);
	});

	$(window)
		.off('resize.strategyOverviewToggle')
		.on('resize.strategyOverviewToggle', function () {
			clearTimeout($(window).data('strategyOverviewResizeTimer'));
			$(window).data(
				'strategyOverviewResizeTimer',
				setTimeout(function () {
					initStrategyOverviewToggle(document);
				}, 100),
			);
		});
}

function aiPlaybookTabs(options) {
	var settings = $.extend(
		{
			root: document,
			namespace: 'aiPlaybookTabs',
			tabSelector: '.fl_comp_t',
			cardSelector: '',
			menuSelector: '',
			menuData: '',
			tabData: '',
			savedMenuData: '',
			savedTabTextData: '',
			menuGroups: [],
			tabGroups: [],
			cardMarginProperty: 'margin-bottom',
			tabMarginProperty: 'margin-left',
			beforeTabSync: null,
			beforeMenuSync: null,
			afterSync: null,
		},
		options || {},
	);
	var $root = $(settings.root);

	if (!$root.length) {
		return;
	}

	var $tabs = $root.find(settings.tabSelector);
	var $cards = settings.cardSelector ? $root.find(settings.cardSelector) : $();
	var $menuItems = settings.menuSelector ? $root.find(settings.menuSelector) : $();
	var clickEvent = 'click.' + settings.namespace;

	if (!$tabs.length) {
		return;
	}

	function getData($item, dataName) {
		return dataName ? $item.data(dataName) : undefined;
	}

	function getTabText($tab) {
		return $tab.find('.item').text().trim();
	}

	function findGroup(groups, value) {
		var matchedGroup;

		$.each(groups, function (_, group) {
			if (group.value === value) {
				matchedGroup = group;
				return false;
			}
		});

		return matchedGroup;
	}

	function filterItems($items, filterFn) {
		if (!filterFn) {
			return $items;
		}

		return $items.filter(function () {
			return filterFn($(this));
		});
	}

	function findSavedTab($visibleTabs) {
		var savedTabText = settings.savedTabTextData ? $root.data(settings.savedTabTextData) : '';

		if (!savedTabText) {
			return $();
		}

		return $visibleTabs
			.filter(function () {
				return getTabText($(this)) === savedTabText;
			})
			.first();
	}

	function setEdgeSpacing($visibleTabs, $visibleCards) {
		if (settings.tabMarginProperty) {
			$tabs.css(settings.tabMarginProperty, '');
			$visibleTabs.first().css(settings.tabMarginProperty, 0);
		}

		if (settings.cardMarginProperty && $cards.length) {
			$cards.css(settings.cardMarginProperty, '');
			$visibleCards.last().css(settings.cardMarginProperty, 0);
		}
	}

	function syncTabs($preferredTab) {
		$cards = settings.cardSelector ? $root.find(settings.cardSelector) : $();

		var menuValue = getData($menuItems.filter('.active').first(), settings.menuData);
		var menuGroup = findGroup(settings.menuGroups, menuValue);
		var $visibleTabs = menuGroup ? filterItems($tabs, menuGroup.tabFilter) : $tabs;
		var $baseCards = menuGroup ? filterItems($cards, menuGroup.cardFilter) : $cards;
		var $activeTab = $preferredTab && $preferredTab.length ? $preferredTab : $visibleTabs.filter('.active').first();
		var tabValue;
		var tabGroup;
		var $visibleCards;

		if ($menuItems.length && !menuGroup) {
			$menuItems.first().addClass('active');
			menuValue = getData($menuItems.first(), settings.menuData);
			menuGroup = findGroup(settings.menuGroups, menuValue);
			$visibleTabs = menuGroup ? filterItems($tabs, menuGroup.tabFilter) : $tabs;
			$baseCards = menuGroup ? filterItems($cards, menuGroup.cardFilter) : $cards;
		}

		if ($menuItems.length && menuGroup) {
			$tabs.not($visibleTabs).css('display', 'none').removeClass('active');
			$visibleTabs.css('display', '');
		}

		if (!$activeTab.length || $visibleTabs.index($activeTab[0]) === -1) {
			$activeTab = findSavedTab($visibleTabs);
		}

		if (!$activeTab.length) {
			$activeTab = $visibleTabs.first();
		}

		$tabs.removeClass('active');
		$activeTab.addClass('active');

		tabValue = getData($activeTab, settings.tabData) || getTabText($activeTab);
		tabGroup = findGroup(settings.tabGroups, tabValue);
		$visibleCards = tabGroup ? filterItems($baseCards, tabGroup.cardFilter) : $baseCards;

		$cards.not($visibleCards).css('display', 'none');
		$visibleCards.css('display', '');
		setEdgeSpacing($visibleTabs, $visibleCards);

		if ($.isFunction(settings.afterSync)) {
			settings.afterSync({
				activeTab: $activeTab,
				visibleTabs: $visibleTabs,
				visibleCards: $visibleCards,
				menuGroup: menuGroup,
				tabGroup: tabGroup,
			});
		}
	}

	if ($menuItems.length && settings.savedMenuData) {
		var savedMenu = $root.data(settings.savedMenuData);

		if (savedMenu) {
			$menuItems.removeClass('active');
			$menuItems
				.filter(function () {
					return getData($(this), settings.menuData) === savedMenu;
				})
				.addClass('active');
		}
	}

	$tabs.off(clickEvent).on(clickEvent, function (e) {
		if ($.isFunction(settings.beforeTabSync) && settings.beforeTabSync($(this), syncTabs, e) === false) {
			return;
		}

		syncTabs($(this));
	});

	$menuItems.off(clickEvent).on(clickEvent, function (e) {
		if ($.isFunction(settings.beforeMenuSync) && settings.beforeMenuSync($(this), syncTabs, e) === false) {
			return;
		}

		syncTabs();
	});

	syncTabs();
}

function setupAiPlaybookFooter(root) {
	var $root = $(root || '.devDontCopy_leaderboard_strategies');
	var $footer = $root.find('.devDontCopy_aiPB_footer');

	if (!$footer.length) {
		return;
	}

	$footer.load(getAiPlaybookPath('footer'), function () {
		$footer.find('.item').hide();
		$footer.find('#select_competition_btn, #betslips, #refresh').show();

		$footer
			.find('#select_competition_btn')
			.off('click')
			.on('click.aiPlaybookFooter', function () {
				loadAsiaSelectPopupData(function () {
					$('#selectfilter').show();
					$('.fltr_grp_wrp').addClass('show');
					setAiPlaybookSelectFilterView();
				});
			});

		$footer.find('#betslips').click(function () {
			if (isAiPlaybookStandalonePage($root)) {
				window.location.href = 'index.html';
				return;
			}

			closeAiPlaybookPages();
			setAiPlaybookHomeIconActive(false);
			$('#selectfilter').hide().find('.fltr_grp_wrp').removeClass('show');
			$('#ai_playbook_home').closest('.footer_main').show();
			$('#betslips_home').trigger('click');
		});

		$footer.find('#refresh').click(function () {
			var $refreshWrap = $(this).find('.n_refresh_wrap');

			$refreshWrap.addClass('rotate');
			setTimeout(function () {
				$refreshWrap.removeClass('rotate');
			}, 1000);
		});
	});
}

function setAiPlaybookSelectFilterView() {
	var $selectFilter = $('#selectfilter');
	var $filterWrap = $selectFilter.find('.fltr_grp_wrp');
	var $themeStyle = $selectFilter.find('#fltr_slct_theme').closest('.fltr_grp_itm');
	var $closeButtons = $selectFilter.find('#close_select_filter, #close_select_filter_icon');

	if (!$filterWrap.length) {
		return;
	}

	restoreAiPlaybookSelectFilterView($filterWrap);
	$filterWrap.children().each(function () {
		$(this).data('aiPlaybookPreviousDisplay', this.style.display);
	});
	$filterWrap.children().hide();
	$filterWrap.children('.comp_fltr.ts').show();
	$themeStyle.show();
	$filterWrap.children('.fltr_grp_itm.ts').show();
	$filterWrap.children('#close_select_filter').show();

	$closeButtons.off('click.aiPlaybookSelectFilter').one('click.aiPlaybookSelectFilter', function () {
		setTimeout(function () {
			restoreAiPlaybookSelectFilterView($filterWrap);
		}, 150);
	});
}

function restoreAiPlaybookSelectFilterView($filterWrap) {
	$filterWrap.children().each(function () {
		var $item = $(this);
		var previousDisplay = $item.data('aiPlaybookPreviousDisplay');

		if (previousDisplay === undefined) {
			return;
		}

		this.style.display = previousDisplay;
		$item.removeData('aiPlaybookPreviousDisplay');
	});
}

function setAiPlaybookHomeIconActive(isActive) {
	$('#ai_playbook_home i').toggleClass('icon-fi-aiPB-active', isActive).toggleClass('icon-fi-aiPB', !isActive);
}

function loadAiGraphTemplates(root) {
	var $root = $(root || document);
	var $graphPreview = $root.find('.ai_graph_preview').add($root.filter('.ai_graph_preview'));
	var $graph = $root.find('.ai_graph').add($root.filter('.ai_graph'));

	$graphPreview.each(function () {
		var $preview = $(this);
		var plotCount = parseInt($preview.attr('data-plot-count'), 10) || undefined;
		var sampleEvery = parseInt($preview.attr('data-sample-every'), 10) || undefined;

		$preview.load(getAiPlaybookPath('graphPreview'), function () {
			initAiGraphInstance($preview, true, plotCount, sampleEvery);
		});
	});

	$graph.each(function () {
		var $graphEl = $(this);

		$graphEl.load(getAiPlaybookPath('graph'), function () {
			initAiGraphInstance($graphEl, false);
		});
	});
}

function refreshAiGraphPreviewAlignment(root) {
	var $root = $(root || document);
	var $graphPreview = $root.find('.ai_graph_preview').add($root.filter('.ai_graph_preview'));

	$graphPreview.each(function () {
		var $preview = $(this);
		var plotCount = parseInt($preview.attr('data-plot-count'), 10) || undefined;
		var sampleEvery = parseInt($preview.attr('data-sample-every'), 10) || undefined;

		if ($preview.find('.trend-performance-chart').length) {
			initAiGraphInstance($preview, true, plotCount, sampleEvery);
		}
	});
}

function getTrendPerformanceAxisSettings(maxROI) {
	var safeMaxROI = isFinite(maxROI) ? Math.max(0, maxROI) : 0;
	var interval;

	if (safeMaxROI <= 200) {
		interval = 20;
	} else if (safeMaxROI <= 300) {
		interval = 40;
	} else {
		interval = 50;
		if (safeMaxROI > 500) {
			interval = 100;
		}
	}

	return {
		interval: interval,
		max: Math.max(interval, Math.ceil(safeMaxROI / interval) * interval),
	};
}

function getTrendPerformanceAxisLayout(maxAxisValue, isPreview, measuredLabelWidth) {
	var axisLabelX = 910;
	var defaultPadRight = 846;

	if (isPreview) {
		return {
			padRight: defaultPadRight,
			axisLabelX: axisLabelX,
		};
	}

	var labelWidth = isFinite(measuredLabelWidth) && measuredLabelWidth > 0 ? measuredLabelWidth : String(maxAxisValue).length * 14 + 16;
	var padRight = axisLabelX - labelWidth - 12;

	return {
		padRight: Math.max(700, padRight),
		axisLabelX: axisLabelX,
	};
}

function initAiGraphInstance($root, isPreview, plotCount, sampleEvery) {
	var svg = $root.find('.trend-performance-chart')[0];

	if (!svg) {
		return;
	}

	var section = svg.closest('.trend-performance-card');
	var gradient = svg.querySelector('linearGradient');
	var area = svg.querySelector('#area');
	var line = svg.querySelector('#line');
	var gridLayer = svg.querySelector('#grid-layer');
	var betAxisLayer = svg.querySelector('#bet-axis-layer');
	var cursor = svg.querySelector('#cursor');
	var dot = svg.querySelector('#dot');
	var tooltip = svg.querySelector('#tooltip');
	var tipRect = tooltip ? tooltip.querySelector('rect') : null;
	var tipTitle = svg.querySelector('#tip-title');
	var tipValue = svg.querySelector('#tip-value');
	var tipDate = svg.querySelector('#tip-date');
	var axisTitle = svg.querySelector('.trend-performance-axis-title');
	var heading = section ? section.querySelector('.tp_heading') : null;
	var isMainGraph = !isPreview && $root.hasClass('ai_graph');

	// clear previous render's grid/axis labels so re-running this on the same
	// chart (e.g. toggling the full graph between win/lose demos) doesn't just
	// keep appending duplicates on top of the old ones
	if (gridLayer) {
		gridLayer.innerHTML = '';
	}
	if (betAxisLayer) {
		betAxisLayer.innerHTML = '';
	}

	if (gradient && area) {
		var newId = gradient.getAttribute('id') + '-' + Math.random().toString(36).slice(2);

		gradient.setAttribute('id', newId);
		area.setAttribute('fill', 'url(#' + newId + ')');
	}

	var $strategyValue = $root.closest('.strat_card').find('.strat_value.win, .strat_value.lose').first();
	var isLose = $strategyValue.length ? $strategyValue.hasClass('lose') : section && section.classList.contains('lose');
	if (section && $strategyValue.length) {
		section.classList.remove('win', 'lose');
		section.classList.add(isLose ? 'lose' : 'win');
	}
	var PREVIEW_TOP = 205;

	if (isPreview) {
		if (heading) {
			heading.style.display = 'none';
		}
		if (axisTitle) {
			axisTitle.style.display = 'none';
		}
		if (gridLayer) {
			gridLayer.style.display = 'none';
		}
		if (betAxisLayer) {
			betAxisLayer.style.display = 'none';
		}
		if (tooltip) {
			tooltip.style.display = 'none';
		}
		if (dot) {
			dot.style.display = 'none';
		}
		if (cursor) {
			cursor.style.display = 'none';
		}
		svg.setAttribute('viewBox', '44 ' + PREVIEW_TOP + ' 802 ' + (350 - PREVIEW_TOP));
		svg.setAttribute('preserveAspectRatio', 'none');
		svg.style.width = '100%';
		svg.style.height = '100%';
	}

	var percents = [100, 140, 120, 190, 250, 220, 280, 240, 310, 380, 340, 300, 360, 420, 470, 440, 390, 450, 520, 580, 550, 610, 570, 630, 700, 660, 720, 780, 740, 800, 760, 830, 880, 850, 910, 870, 930, 900, 960, 940, 970, 930, 980, 950, 910, 970, 990, 950, 900, 960, 920, 880, 940, 980, 940, 890, 950, 910, 860, 920, 970, 930, 890, 950, 990, 950, 900, 960, 920, 870, 930, 980, 940, 900, 960, 920, 880, 940, 980, 950, 910, 970, 930, 890, 950, 990, 950, 900, 960, 920, 880, 940, 980, 950, 910, 970, 930, 890, 950, 960];
	var isHalfGraph = !isPreview && plotCount && plotCount < percents.length;
	var graphPercents =
		isHalfGraph && !isMainGraph
			? percents.map(function (p) {
					return p / 10;
				})
			: percents.slice();
	var demoROI = isMainGraph && !isHalfGraph && section ? parseFloat(section.getAttribute('data-demo-roi')) : NaN;
	if (isFinite(demoROI)) {
		graphPercents[graphPercents.length - 1] = demoROI;
	}
	if (isLose) {
		graphPercents = graphPercents.slice().reverse();
	}

	// Takes some of the sharpness off the full graph's line by averaging each bet
	// with its 1 nearest neighbour on either side (a light 3-bet centered moving
	// average). The real per-bet result is kept as "percent" for the tooltip;
	// only "smoothedPercent" (used to draw the FULL graph's line) is touched.
	var SMOOTH_WINDOW = 3;
	var smoothHalf = Math.floor(SMOOTH_WINDOW / 2);
	function smoothedAt(arr, i) {
		var start = Math.max(0, i - smoothHalf);
		var end = Math.min(arr.length - 1, i + smoothHalf);
		var sum = 0,
			count = 0;
		for (var j = start; j <= end; j++) {
			sum += arr[j];
			count++;
		}
		return sum / count;
	}

	var today = new Date();
	var shortMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var trendPerformanceSampleLanguages = ['eng', 'chs', 'vn', 'th', 'pt', 'kor', 'id', 'hi', 'es'];

	function formatLocalizedTrendPerformanceDate(date, language, includeYear, includeTime) {
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var time = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
		var formattedDate;

		switch (language) {
			case 'chs':
				formattedDate = month + '月 ' + day + '日' + (includeYear ? ' ' + year + ' 年' : '');
				break;
			case 'vn':
				formattedDate = 'Tháng ' + month + ' Ngày ' + day + (includeYear ? ' Năm ' + year : '');
				break;
			case 'th':
				formattedDate = 'เดือน ' + month + ' วันที่ ' + day + (includeYear ? ' ปี ' + year : '');
				break;
			case 'pt':
				formattedDate = 'Mês ' + month + ' Dia ' + day + (includeYear ? ' Ano ' + year : '');
				break;
			case 'kor':
				formattedDate = month + '월 ' + day + '일' + (includeYear ? ' ' + year + '년' : '');
				break;
			case 'id':
				formattedDate = 'Bulan ' + month + ' Tanggal ' + day + (includeYear ? ' Tahun ' + year : '');
				break;
			case 'hi':
				formattedDate = 'महीना ' + month + ' दिन ' + day + (includeYear ? ' वर्ष ' + year : '');
				break;
			case 'es':
				formattedDate = 'Mes ' + month + ' Día ' + day + (includeYear ? ' Año ' + year : '');
				break;
			default:
				formattedDate = day + ' ' + shortMonthNames[date.getMonth()] + (includeYear ? ' ' + year : '');
		}

		return includeTime ? formattedDate + ' ' + time : formattedDate;
	}

	function formatTrendPerformanceAxisDate(date, language) {
		return formatLocalizedTrendPerformanceDate(date, language, false, false);
	}

	function formatTrendPerformanceTipDate(date, language) {
		return formatLocalizedTrendPerformanceDate(date, language, true, true);
	}

	function formatTrendPerformanceBetTitle(bet, language) {
		switch (language) {
			case 'es':
				return 'Apuesta #' + bet;
			case 'chs':
				return '第' + bet + '笔投注';
			case 'hi':
				return 'बेट #' + bet;
			case 'id':
				return 'Taruhan #' + bet;
			case 'kor':
				return '베팅 #' + bet;
			case 'pt':
				return 'Aposta #' + bet;
			case 'th':
				return 'เดิมพัน #' + bet;
			case 'vn':
				return 'Cược #' + bet;
			default:
				return 'Bet #' + bet;
		}
	}

	var data = graphPercents.map(function (p, i) {
		var d = new Date(today);
		d.setDate(d.getDate() - (graphPercents.length - 1 - i));
		var sampleLanguage = trendPerformanceSampleLanguages[i % trendPerformanceSampleLanguages.length];
		return {
			bet: i + 1,
			language: sampleLanguage,
			percent: p,
			smoothedPercent: isFinite(demoROI) && p === demoROI ? p : smoothedAt(graphPercents, i),
			dateValue: d,
			axisDate: formatTrendPerformanceAxisDate(d, sampleLanguage),
		};
	});

	var PAD_LEFT = 44,
		TOP = 60,
		BOTTOM = 350;
	// How many bets are actually being drawn. Previews still use data.length as
	// their x-scale denominator; short-preview alignment is applied below.
	var visibleCount = plotCount && plotCount < data.length ? plotCount : data.length;
	var plotData = data.slice(0, visibleCount);
	var maxROI = plotData.reduce(function (max, d) {
		return typeof d.percent === 'number' && isFinite(d.percent) ? Math.max(max, d.percent) : max;
	}, 0);
	var isLast20Graph = isMainGraph && isHalfGraph;
	var axisSettings = isLast20Graph ? { interval: 100, max: 1000 } : isHalfGraph ? { interval: 10, max: 100 } : { interval: 200, max: 1000 };
	var yMin = 0,
		yMax = axisSettings.max;
	var measuredLabelWidth = NaN;
	if (!isPreview && gridLayer) {
		var axisLabelMeasure = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		axisLabelMeasure.setAttribute('class', 'trend-performance-axis-label');
		axisLabelMeasure.style.visibility = 'hidden';
		axisLabelMeasure.textContent = yMax + '%';
		gridLayer.appendChild(axisLabelMeasure);
		if (typeof axisLabelMeasure.getComputedTextLength === 'function') {
			measuredLabelWidth = axisLabelMeasure.getComputedTextLength();
		}
		gridLayer.removeChild(axisLabelMeasure);
	}
	var axisLayout = getTrendPerformanceAxisLayout(yMax, isPreview, measuredLabelWidth);
	var PAD_RIGHT = axisLayout.padRight,
		AXIS_LABEL_X = axisLayout.axisLabelX;
	// Keep the full 100-bet x-scale for Last 20 Bets so bets 21-100 remain empty.
	var xScaleCount = data.length;
	// Short leaderboard previews stay right-aligned unless the amended card layout
	// is active, in which case they use the first x-slots from left to right.
	var isShortPreview = isPreview && visibleCount < data.length;
	var isAmendedPreview = isPreview && $root.closest('.ai_content.ai_amend').length > 0;
	var isRightAlignedShortPreview = isShortPreview && !isAmendedPreview;
	function xFor(i) {
		var xIndex = isRightAlignedShortPreview ? data.length - 1 - i : i;
		return PAD_LEFT + (xIndex / (xScaleCount - 1)) * (PAD_RIGHT - PAD_LEFT);
	}

	function yFor(p) {
		return BOTTOM - ((p - yMin) / (yMax - yMin)) * (BOTTOM - TOP);
	}

	var lineTop = isPreview ? PREVIEW_TOP : TOP;
	function yForLine(p) {
		return BOTTOM - ((p - yMin) / (yMax - yMin)) * (BOTTOM - lineTop);
	}

	if (gridLayer) {
		for (var v = 0; v <= yMax; v += axisSettings.interval) {
			var y = yFor(v);
			var axisLabelValue = isLast20Graph ? v * 2 - yMax : isHalfGraph ? v * 10 : v / 10;
			var gridLineClass = 'trend-performance-grid-line' + (axisLabelValue === 0 && v !== 0 ? ' zero' : '');
			var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			g.innerHTML = '<line x1="' + PAD_LEFT + '" y1="' + y + '" x2="' + PAD_RIGHT + '" y2="' + y + '" class="' + gridLineClass + '"></line>' + '<text x="' + AXIS_LABEL_X + '" y="' + (y + 5) + '" text-anchor="end" class="trend-performance-axis-label">' + axisLabelValue + '%</text>';
			gridLayer.appendChild(g);
		}
	}

	if (betAxisLayer) {
		[0, 19, 39, 59, 79, 99].forEach(function (i) {
			var x = xFor(i);
			var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			t.setAttribute('x', x);
			t.setAttribute('y', 392);
			t.setAttribute('text-anchor', 'middle');
			t.setAttribute('class', 'trend-performance-bet-label');
			t.textContent = data[i].bet;
			betAxisLayer.appendChild(t);
			var dt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			dt.setAttribute('x', x);
			dt.setAttribute('y', 420);
			dt.setAttribute('text-anchor', 'middle');
			dt.setAttribute('class', 'trend-performance-date-label');
			dt.textContent = data[i].axisDate;
			betAxisLayer.appendChild(dt);
		});
	}

	var linePlotData = sampleEvery
		? plotData.filter(function (d) {
				return d.bet % sampleEvery === 0;
			})
		: plotData;

	var points = linePlotData
		.map(function (d) {
			return xFor(d.bet - 1) + ',' + yForLine(isPreview ? d.percent : d.smoothedPercent);
		})
		.join(' ');
	var linePoints = isRightAlignedShortPreview ? points.split(' ').reverse().join(' ') : points;
	if (line) {
		line.setAttribute('points', linePoints);
	}
	if (area) {
		area.setAttribute('points', xFor(0) + ',' + BOTTOM + ' ' + points + ' ' + xFor(visibleCount - 1) + ',' + BOTTOM);
	}

	// Preview cards animate their trend line drawing (and area fill wiping in)
	// on entry. Both preview sizes reveal left-to-right. Uses the Web
	// Animations API (explicit from/to
	// keyframes) instead of a CSS transition - toggling transition:none ->
	// transition:0.8s via inline styles wasn't reliably picked up for this SVG
	// stroke property on this page. The card can still be sitting behind a
	// "page loading" placeholder when this runs (its whole tab/section is
	// display:none), so the animation is deferred until the chart is actually
	// visible - otherwise it plays out fully hidden and you only ever see the
	// finished, already-drawn line once the placeholder clears.
	if (isPreview && (line || area)) {
		var lineLength = line ? line.getTotalLength() : 0;
		if (line) {
			line.style.strokeDasharray = lineLength;
			line.style.strokeDashoffset = lineLength;
		}
		if (area) {
			area.style.clipPath = 'inset(0 100% 0 0)';
		}

		(function waitUntilVisibleThenReveal() {
			var rect = (line || area).getBoundingClientRect();
			if (rect.width > 0 && rect.height > 0) {
				if (line) {
					line.style.strokeDashoffset = '0';
					line.animate([{ strokeDashoffset: lineLength }, { strokeDashoffset: 0 }], { duration: 800, easing: 'ease-out', fill: 'forwards' });
				}
				if (area) {
					var previewStartClip = 'inset(0 100% 0 0)';
					area.style.clipPath = 'inset(0 0 0 0)';
					area.animate([{ clipPath: previewStartClip }, { clipPath: 'inset(0 0 0 0)' }], { duration: 800, easing: 'ease-out', fill: 'forwards' });
				}
			} else {
				requestAnimationFrame(waitUntilVisibleThenReveal);
			}
		})();
	}
	if (isPreview || !cursor || !dot || !tooltip || !tipRect || !tipTitle || !tipValue || !tipDate) {
		return;
	}

	function getTextWidth(textElement) {
		var maxWidth = 0;
		var tspans = textElement.querySelectorAll('tspan');
		if (tspans.length) {
			for (var j = 0; j < tspans.length; j++) {
				maxWidth = Math.max(maxWidth, tspans[j].getComputedTextLength());
			}
			return maxWidth;
		}
		return typeof textElement.getComputedTextLength === 'function' ? textElement.getComputedTextLength() : 0;
	}

	var pinned = false;
	function nearestIndex(svgX) {
		var closest = 0,
			minDist = Infinity;
		plotData.forEach(function (d, i) {
			var dist = Math.abs(xFor(i) - svgX);
			if (dist < minDist) {
				minDist = dist;
				closest = i;
			}
		});
		return closest;
	}

	function svgPointFromEvent(evt) {
		var pt = svg.createSVGPoint();
		pt.x = evt.clientX;
		pt.y = evt.clientY;
		var ctm = svg.getScreenCTM();
		return pt.matrixTransform(ctm.inverse());
	}

	function render(i) {
		var d = data[i];
		var x = xFor(i);
		var y = yFor(d.smoothedPercent);
		cursor.setAttribute('x1', x);
		cursor.setAttribute('x2', x);
		dot.setAttribute('cx', x);
		dot.setAttribute('cy', y);
		tipTitle.textContent = formatTrendPerformanceBetTitle(d.bet, d.language);
		var tooltipROI = isLast20Graph ? d.percent * 2 - yMax : isHalfGraph ? d.percent * 10 : d.percent / 10;
		tipValue.textContent = (tooltipROI >= 0 ? '+' : '') + tooltipROI.toFixed(2) + '%';
		tipValue.classList.remove('win', 'lose');
		if (tooltipROI !== 0) {
			tipValue.classList.add(tooltipROI < 0 ? 'lose' : 'win');
		}
		tipDate.textContent = formatTrendPerformanceTipDate(d.dateValue, d.language);
		var contentWidth = Math.max(getTextWidth(tipTitle), getTextWidth(tipValue), getTextWidth(tipDate));
		var tipW = Math.max(220, Math.ceil(contentWidth + 36)),
			tipH = 120,
			margin = 20;
		tipRect.setAttribute('width', tipW);
		tipRect.setAttribute('height', tipH);
		var tx = x + margin;
		if (tx + tipW > PAD_RIGHT) {
			tx = x - margin - tipW;
		}
		var ty = y - tipH - margin;
		if (ty < TOP - 20) {
			ty = y + margin;
		}
		tooltip.setAttribute('transform', 'translate(' + tx + ' ' + ty + ')');
	}

	function update(evt) {
		if (pinned) {
			return;
		}
		var p = svgPointFromEvent(evt);
		var clampedX = Math.min(Math.max(p.x, PAD_LEFT), xFor(visibleCount - 1));
		render(nearestIndex(clampedX));
	}

	var isPointerDown = false;
	svg.addEventListener('pointerdown', function (evt) {
		isPointerDown = true;
		pinned = false;
		svg.setPointerCapture(evt.pointerId);
		update(evt);
	});
	svg.addEventListener('pointermove', function (evt) {
		if (isPointerDown) {
			update(evt);
		} else if (evt.pointerType === 'mouse') {
			update(evt);
		}
	});
	svg.addEventListener('pointerup', function () {
		isPointerDown = false;
		pinned = true; // click/tap to pin on release
	});
	svg.addEventListener('pointerleave', function () {
		if (!pinned) {
			render(plotData.length - 1);
		}
	});
	render(plotData.length - 1);
}

function openAiPlaybookHome(options) {
	var settings = $.extend({ asPopup: false }, options || {});
	var $landingFooter = $('#ai_playbook_home').closest('.footer_main');
	var $leaderboardStrategies = $('.devDontCopy_leaderboard_strategies');

	if (settings.asPopup !== true && !isAiPlaybookStandalonePage($leaderboardStrategies)) {
		rememberAiPlaybookOrigin();
		if (settings.menu) {
			sessionStorage.setItem('aiPlaybookLeaderboardMenu', settings.menu);
		}
		goAiPlaybookPage('leaderboardStrategies');
		return;
	}

	setAiPlaybookHomeIconActive(true);
	$landingFooter.data('leaderboardStrategiesWasVisible', $landingFooter.is(':visible')).hide();
	showAiPlaybookLeaderboard(settings);
}

function aiPlaybookTutorial() {
	var $aiPlaybookFooter = $('#ai_playbook_home').closest('.footer_main');
	var $aiPlaybookFooterMask = $aiPlaybookFooter.find('.footer_mask').not('.fltr_ftr_msk');
	var $aiPlaybookFooterTutor = $('#ai_playbook_home .ai_tutor');
	var $aiPlaybookBgMask = $('#promo_mask');
	var $aiPlaybookMask = $('#demoOnly_promo_mask');
	var aiPlaybookTutorialMaskSelector = '> .bg_mask, > .aiPB_mask_btn, .strat_card_grp > .bg_mask, .strat_card_grp > .aiPB_mask_btn, .strat_dtl_grp > .bg_mask, .strat_dtl_grp > .aiPB_mask_btn, .strat_dtl_cont > .strat_dtl_cont_wrp > .bg_mask, .strat_dtl_cont > .strat_dtl_cont_wrp > .aiPB_mask_btn';
	var aiPlaybookTutorialStep3HighlightedSelector = '.strat_dtl_tab_grp, .ai_graph, .sd_cont:first, .sd_cont:eq(1) > .sd_box_hdr';
	var aiPlaybookTutorialHighlightedSelector = '.strat_card_wrp, .strat_dtl_tab_grp, .sd_cont:has(.aiPB_tut_step4), ' + aiPlaybookTutorialStep3HighlightedSelector;

	$('#ai_playbook_tutorial')
		.off('click.aiPlaybookTutorial')
		.on('click.aiPlaybookTutorial', function (event) {
			event.stopPropagation();
			sessionStorage.removeItem('promotutorial');
			$('#promo_home .dot_box, #promo_home .rec_arrow').hide();
			$('#promo_home .new_tag').hide();
			$('#promo_home').removeClass('highlighted');
			$('.footer_main').removeClass('prm_footer_msk prm_bet_mask aiPB_footer_mask');
			$aiPlaybookBgMask.hide();
			$('.fltr_ftr_msk').hide();
			$aiPlaybookFooterMask.show();
			$('.footer_main .ftr_tab_mask').show();
			$aiPlaybookBgMask.removeClass('prm_mask').removeAttr('id').show();
			$('#ai_playbook_home').addClass('highlighted');
			$aiPlaybookFooterTutor.show();
			$aiPlaybookMask.removeClass('prm_msk_btn').removeAttr('id').addClass('aiPB_mask_btn').show();
			sessionStorage.setItem('aiPlaybookTutorial', 'step1');
		});

	initAiPlaybookTutorialMaskHandler();
}
// ai playbook: end
