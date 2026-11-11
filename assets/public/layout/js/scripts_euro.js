//Global : odds selection effect
var countme_eu = 1;
function odds() {
	$('.odds_box').click(function (event) {
		if ($(this).hasClass('add')) {
			$(this).removeClass('add');
			countme_eu -= 1;

			if (countme_eu == 0) {
				$('#main_footer').css('display', 'none');
			}
		} else {
			if (countme_eu >= 10) {
				$('.smallpop').css('display', '');
				$('.smallpop').addClass('scroll');
				$(document.documentElement)
					.css('--windowH', $(window).height() + 'px')
					.css('--smallpopH', $('.smallpop').outerHeight(true) + 'px');
				setTimeout(function () {
					$('.smallpop').css('display', 'none');
					$('.smallpop').removeClass('scroll');
				}, 1000);
			} else {
				$(this).addClass('add');
				countme_eu += 1;
				//$(this).siblings(".odds_box").removeClass("add");
				/*sev*/
				//$(this).parent().siblings().find(".odds_box").removeClass("add");
				$('#main_footer').css('display', '');
			}
		}
		$('#sample_footer_pre_bet .count').html(countme_eu);
		backtotop(true);
	});
}

//block background scrolling
//note: 2/6/2021 : dev side is using below code (in SEV event switcher):
function blockScrolling(e) {
	if (['result_iframe'].some((x) => e.target.className.toLowerCase().indexOf(x) > -1)) {
		e.preventDefault();
		return;
	}
}
function popupOn(hideBackground) {
	$('body').addClass('popupOn');
	$('.demoOnly_fixposition > .n_container').addClass('popupOn');

	if (hideBackground) {
		if (!$('.sev_popup').is(':visible')) {
			$('.demoOnly_fixposition > .n_container').css('display', 'none');
			console.log('popupOn + hideBackground: ' + hideBackground);
		}
		//note: 2/6/2021 : dev side is using below code (in SEV event switcher):
		window.removeEventListener('touchmove', blockScrolling, { passive: false });
		//for backup only
		//$('body').unbind('touchmove');
		/*  $("body").bind(
                'touchmove',
                    function (e) {
                        e.preventDefault();
                    }
        ); */
		$('#root > .n_container').css('display', 'none');
	}
	// note: 30/7/21: for sev event switcher background scrolling issue
	// for SFUAT-3868, dev code to add scroll height checking: https://codepen.io/LelandKwong/pen/edAmn

	$('.demoOnly_fixposition.popupOn > .n_container').css('pointer-events', 'none');
}
function popupOff(status = 'normal') {
	console.log('popupOff: ' + status);
	if ((!$('.sev_popup').is(':visible') && !$('#myacctpage').is(':visible')) || status == 'inside_sev') {
		$('.demoOnly_fixposition > .n_container').css('display', '');
		$('body').removeClass('popupOn');
		$('.demoOnly_fixposition').find('.n_container').removeClass('popupOn');
		$('.demoOnly_fixposition > .n_container').css('pointer-events', '');

		if (status != 'inside_sev') {
			if (!$('#root > .n_container').is(':visible')) {
				$('#root > .n_container').css('display', '');
			}
		}
	}
}

function merchantlogo_euro() {
	theme_value = localStorage.getItem('theme');
	if (theme_value == 'bafa') {
		$('.logo img').attr('src', '../merchants/merchant1/images/logo2.png');
	} else {
		$('.logo img').attr('src', '../merchants/merchant1/images/logo.png');
	}
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
	document.getElementById('detect_language').setAttribute('href', '../assets/public/languages/' + language_code + '/layout_euro.min.css');
}

$(document).ready(function () {
	//Global: Check browser =================================================//
	//SFCRQ-2245::JS code for demo only::  for IOS in safari and UC only

	if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
		//  $(".n_balance").html("for ios");
		//SFCRQ-2245:: for demo purposes only:
		// "demoOnly_fixposition" >> class to use for differentiate window.scroll in demo, DEV may ignore this, No CSS attr inside this class
		$('body').addClass('demoOnly_fixposition');
		$('head').append('<link rel="stylesheet" href="../assets/public/layout/css/ios_freezebar.min.css" type="text/css" />');
	} else {
		// $(".n_balance").html("for android");
	}
	//Global: set theme Color =================================================//
	var theme_value;
	setstyleFromstorage();
	function setstyleFromstorage() {
		theme_value = localStorage.getItem('theme');
		if (theme_value === null || theme_value === 'DarkBlue' || theme_value === 'bob' || theme_value === 'wellbet' || theme_value === 'default1') {
			localStorage.setItem('theme', 'default');
			theme_value = 'default';
		}
		document.getElementById('design_view').setAttribute('href', '../assets/themes/colours/' + theme_value + '/theme_euro.min.css');
	}

	/*Global : close popup*/
	$('.popup_window_center').on('click', function (e) {
		if (e.target !== this) return;
		$('.popup_window').hide();
		popupOff();
	});
	ob_listing_header_clicking();

	// Odds Color Setting=================================================//
	detectOddsColor();
});

//Global : Event Listing
/*Event listing: menu*/
$('.er_main_menu > div').click(function (event) {
	$(this).addClass('active');
	$(this).siblings('.m_tab').removeClass('active');
});

$('.el_top_row').click(function (event) {
	if ($(this).find('i').hasClass('icon-fi-arrow-up1')) {
		$(this).next('.el_content_wrp').slideDown();
		$(this).find('i').removeClass('icon-fi-arrow-up1');
		$(this).find('i').addClass('icon-fi-arrow-down1');
	} else {
		$(this).next('.el_content_wrp').slideUp();
		$(this).find('i').removeClass('icon-fi-arrow-down1');
		$(this).find('i').addClass('icon-fi-arrow-up1');
		$(this).addClass('b_line');
	}
});

// Large Bet Insights sticky offsets: measured inside #largebetinsights only, because
// .n_header_main / .euNav_bar_wrp also exist on the page behind the popup. Heights are 0
// while the popup is hidden, so call this after the popup is shown and after its content is loaded.
function updateLbStickyOffsets() {
	var $popup = $('#largebetinsights');
	var headerH = $popup.find('.n_header_main').outerHeight() || 0;
	var subHeaderH = $popup.find('.lb_header').outerHeight() || 0;

	$popup.find('.lb_header').css('top', headerH);
	$popup.find('.lb_top_rw').css('top', headerH + subHeaderH);
	document.documentElement.style.setProperty('--lb_container_h', headerH + subHeaderH + 'px');
}

function eventListing_linkage() {
	/*event listing header menu linkage*/
	$('#featured_tab').click(function () {
		window.location.href = 'index.html';
	});

	$('#obAllBoost_tab, #demoOnlyLuckyEPage').click(function () {
		window.location.href = 'all-odds-boost.html';
	});

	/* $("#fav_tab").click(function () {
        window.location.href = "el_no_fav.html";
    }); */

	$('#soccer_tab').click(function () {
		window.location.href = 'el_soccer.html';
		localStorage.removeItem('soccerTab');
	});

	$('#racing_tab').click(function () {
		window.location.href = 'el_racing.html';
	});

	$('#favorite_tab').click(function () {
		window.location.href = 'el_favorite.html';
	});

	$('#insights_tab').click(function (e) {
		if (e.target.classList.contains('new_tag')) {
			return;
		}
		$('#largebetinsights').show();
		updateLbStickyOffsets();
		popupOn(true);
		backtotop(true);
	});

	$('#basketball_tab').click(function () {
		window.location.href = 'el_basketball.html';
	});

	$('#cricket_tab').click(function () {
		window.location.href = 'el_cricket.html';
	});

	$('#tennis_tab').click(function () {
		window.location.href = 'el_tennis.html';
	});

	$('#table_tennis_tab').click(function () {
		window.location.href = 'el_table_tennis.html';
	});

	$('#baseball_tab').click(function () {
		window.location.href = 'el_no_event.html';
	});

	$('#icehockey_tab').click(function () {
		window.location.href = 'el_icehockey.html';
	});

	$('#volleyball_tab').click(function () {
		window.location.href = 'el_volleyball.html';
	});

	$('#badminton_tab').click(function () {
		window.location.href = 'el_badminton.html';
	});

	$('#baseball_tab').click(function () {
		window.location.href = 'el_baseball.html';
	});

	$('#virtual_tab').click(function () {
		window.location.href = 'el_virtual_sports_landing.html';
	});

	$('#american_football_tab').click(function () {
		window.location.href = 'el_american_football.html';
	});

	$('#rugby_tab').click(function () {
		window.location.href = 'el_rugby.html';
	});

	$('#snooker_tab').click(function () {
		window.location.href = 'el_snooker.html';
	});

	$('#cyber_sport_tab').click(function () {
		window.location.href = 'el_cyber_sport.html';
	});

	$('#esports_tab').click(function () {
		window.location.href = 'el_esport.html';
	});

	$('#virtual_tab').click(function () {
		window.location.href = 'el_virtual_sports_landing.html';
	});

	$('#slider_outright').click(function () {
		window.location.href = 'el_soccer_outright.html';
	});

	$('#slider_leagues').click(function () {
		window.location.href = 'el_soccer_league.html';
	});

	$('#soccerfifa_tab, #fifa_world_cup_tab, #winter_olympics_tab').click(function () {
		window.location.href = 'el_soccer.html';
		localStorage.setItem('soccerTab', this.id);
	});
	/*  $(".outright_row").click(function () {
         window.location.href = "el_outright_league_select.html";
     }); */
}
function eventListing(haveSEV = true, sports = 'soccer', pagetype = 'main') {
	merchantlogo_euro();

	if (haveSEV == false) {
		$('#demoOnly_global_pop_item_euro').load('_global_pop_item.html', function () {
			allfrom_global_pop_item();
		});
	}
	/*header icons click effect*/
	$('.er_main_menu > div').click(function (event) {
		$(this).siblings('.m_tab').removeClass('active');
		$(this).addClass('active');
	});

	/*Favorites on and off*/
	$('#fav_tab').click(function () {
		$('.el_content_wrp').find('.n_fav_off').removeClass().addClass('n_fav_on');
		$('.el_content_wrp').find('.icon-fi-n-fav-off').removeClass('icon-fi-n-fav-off').addClass('icon-fi-n-fav-on');
	});

	$('#slider_tournaments').hide();
	var main_HeaderHeight = 40;

	// Customization for Sticky Header : Demo Only: starts
	$('#el_stickymenu').load('_elstickymenu.html', function () {
		var main_stickygrp_HeaderHeight = $('#el_stickymenu').outerHeight();
		var el_grp_HeaderHeight = $('.el_grp_header').outerHeight();

		const SPORT_UI = {
			soccer: {
				tab: '#soccer_tab',
				info: { icon: 'icon-fi-title-s1', text: 'Soccer: In-Play' },
			},
			racing: {
				tab: '#racing_tab',
				info: { icon: 'icon-fi-title-s1001', text: 'Racing: In-play' },
			},
			cybersport: {
				tab: '#cyber_sport_tab',
				info: { icon: 'icon-fi-title-cyber-soccer', text: 'Cyber Sport: In-play' },
				on: () => $('.sm_slider').show(),
			},
			basketball: {
				tab: '#basketball_tab',
				info: { icon: 'icon-fi-title-s2', text: 'Basketball: In-play' },
			},
			esports: {
				tab: '#esports_tab',
				info: { icon: 'icon-fi-title-esports', text: 'Esports: In-play' },
			},
			cricket: {
				tab: '#cricket_tab',
				info: { icon: 'icon-fi-title-s13', text: 'Cricket: In-play' },
			},
			tennis: {
				tab: '#tennis_tab',
				info: { icon: 'icon-fi-title-s3', text: 'Tennis: In-play' },
			},
			tabletennis: {
				tab: '#table_tennis_tab',
				info: { icon: 'icon-fi-title-s36', text: 'Table Tennis: In-play' },
			},
			icehockey: {
				tab: '#icehockey_tab',
				info: { icon: 'icon-fi-title-s25', text: 'Ice Hockey: In-play' },
			},
			volleyball: {
				tab: '#volleyball_tab',
				info: { icon: 'icon-fi-title-s40', text: 'Volleyball: In-play' },
			},
			badminton: {
				tab: '#badminton_tab',
				info: { icon: 'icon-fi-title-s7', text: 'Badminton: In-play' },
			},
			baseball: {
				tab: '#baseball_tab',
				info: { icon: 'icon-fi-title-s8', text: 'Baseball: In-play' },
			},
			american_football: {
				tab: '#american_football_tab',
				info: { icon: 'icon-fi-title-s19', text: 'American Football: In-play' },
			},
			rugby: {
				tab: '#rugby_tab',
				info: { icon: 'icon-fi-title-s31', text: 'Rugby: In-play' },
			},
			snooker: {
				tab: '#snooker_tab',
				info: { icon: 'icon-fi-title-s34', text: 'Snooker / Pool: In-play' },
			},
			virtual: {
				tab: '#virtual_tab',
			},
			fav: {
				tab: '#fav_tab',
			},

			featured: {
				tab: '#featured_tab',
				on: () => $('.fltr_grp').hide(),
			},

			euro: {
				on: () => {
					$('.m_tab').hide();
					$('.v_split').hide();
					$('#fav_tab').show().next('.v_split').show();
					$('#soccer_tab').show().addClass('active');
				},
			},
		};

		const setSportPanel = (sports) => {
			$('.m_tab').show().removeClass('active');
			$('.v_split').show();
			$('.fltr_grp').show();
			$('.sm_slider').hide();
			$('.sport_info').empty();

			const cfg = SPORT_UI[sports];
			if (!cfg) return;

			if (cfg.tab) $(cfg.tab).addClass('active');

			if (cfg.info) {
				$('.sport_info').html(`<i class="${cfg.info.icon} icon"></i> ${cfg.info.text}`);
			}
			cfg.on?.();
		};

		setSportPanel(sports);

		// other panels
		if (pagetype == 'wthmarkets') {
			$('.sub_menu_panel').css('display', '');
			if (localStorage.getItem('isSoccerFifa') === 'true') {
				$('.see_all').show();
			} else {
				$('.see_all').hide();
			}
			$('.see_all').next('.v_split').hide();
			$('#all_tab').hide();
			$('#all_tab').next('.v_split').hide();
			$('.m_tab').find('sup').hide();
			eventListing_linkage();
			$('.el_header.n_sticky').css('top', '');
			const soccerTab = localStorage.getItem('soccerTab');
			if (soccerTab) {
				$('#' + soccerTab).addClass('active');
				switch (soccerTab) {
					case 'winter_olympics_tab':
						$('#demoOnly_sportsheader .sport_info').html('<img class="big_comp_img" src="../assets/public/layout/images/euro_winter_olympics.png">2026 Winter Olympics');
						$('#test_fifa_el_header').html('<div class="sport_info"><i class="icon-fi-title-s1 icon"></i>Soccer</div><div class="see_all"><i class="icon-fi-pin"></i><span class="comp_count">13</span><i class="icon-fi-arrow-up1"></i></div>');
						$('.nav_bar li:eq(1)').text('Olympics - Soccer');
						$('.el_grp_header .name').text('2026 Winter Olympics - Soccer Men Division');
						$('#test_fifa_el_header, #test_fifa_el_header .see_all, #olympics_switch, #olympics_switch .popular_itm').show();
						break;

					case 'fifa_world_cup_tab':
						$('#demoOnly_sportsheader .sport_info').html('<img class="big_comp_img" src="../assets/public/layout/images/euro_fifa_world_cup.png">FIFA World Cup 2026');
						$('#test_fifa_el_header').html('<div class="sport_info">FIFA World Cup 2026: In-Play</div><div class="see_all"><span class="comp_count">13</span><i class="icon-fi-arrow-up1"></i></div>');
						$('.nav_bar li:eq(1)').text('FIFA World Cup 2026 - Soccer');
						$('.el_grp_header .name').text('FIFA World Cup 2026');
						$('#olympics_switch .popular_itm').hide();
						$('#test_fifa_el_header, #test_fifa_el_header .see_all, #olympics_switch, #popular_itm_soccer').show();
						break;

					case 'soccerfifa_tab':
					default:
						$('#demoOnly_sportsheader .sport_info').html('FIFA Club World Cup');
						break;
				}
				$('#soccer_tab').removeClass('active');
				$('.el_header .fltr_grp, #el_nav_slider, #el_nav_slider3, .el_content_wrp .el_items:not(:first-child), .outright_row').hide();
			}
		} else if (pagetype == 'main') {
			$('#all_tab').hide();
			$('#all_tab').next('.v_split').hide();
			$('.m_tab').find('sup').hide();
			eventListing_linkage();
		} else if (pagetype == 'euro') {
			$('#demoOnly_header_euro').css('display', '');
			$('.el_header').css('display', 'none');
			$('.sub_menu_panel').css('display', '');
			$('.sub_menu_panel .nav_bar').css('display', 'none');
		} else if (pagetype == 'inplay') {
			$('#demoOnly_header_early').css('display', '');
			$('.sub_menu_panel').css('display', 'none');
			$('.see_all').hide();
			$('.see_all').next('.v_split').hide();
			$('#featured_tab').css('display', 'none');
			$('.sport_info').html('<i class="icon-fi-title-s1 icon"></i> Soccer: In-Play');
		} else if (pagetype == 'today') {
			$('#demoOnly_header_today').css('display', '');
			$('.sub_menu_panel').css('display', 'none');
			$('.see_all').hide();
			$('#featured_tab').css('display', 'none');
			$('.sport_info').html('<i class="icon-fi-title-s1 icon"></i> Soccer: Today');
		} else if (pagetype == 'virtualmain') {
			$('.see_all').hide();
			$('.see_all').next('.v_split').hide();
			$('#all_tab').hide();
			$('#all_tab').next('.v_split').hide();
			$('.m_tab').find('sup').hide();
			$('.el_header').css('display', 'none');
			eventListing_linkage();
		} else if (pagetype == 'noevent') {
			$('.see_all').hide();
			$('.see_all').next('.v_split').hide();
			$('#all_tab').hide();
			$('#all_tab').next('.v_split').hide();
			$('.el_header').hide();
			$('.m_tab').find('sup').hide();
			eventListing_linkage();
		}

		if (pagetype == 'main') {
			$('.el_header.n_sticky').css('top', main_stickygrp_HeaderHeight + 40 - 34);
			$('.el_grp_header').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight);
			$('.bet_type_wrp').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight + el_grp_HeaderHeight);
		} else {
			main_stickygrp_HeaderHeight = $('#el_stickymenu').outerHeight();
			$('.el_grp_header').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight);
			$('.bet_type_wrp').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight + el_grp_HeaderHeight);
		}

		if (pagetype == 'kiron') {
			$('.see_all').hide();
			$('.ob_listing_hdr, .ob_wrp, #mock_demo_pinned_competition_euro, .outright_row.n_sticky').hide();
			$('.sub_menu_panel').css('display', '');
			$('#el_nav_slider').hide();
			$('.sport_info').html('<i class="icon-fi-title-s39 icon"></i> Virtual Soccer League');
			$('.nav_bar').html('<li onclick="(function(){window.location.href=\'index.html\'})();">Home<i class="icon-fi-arrow-right"></i></li><li onclick="(function(){window.location.href =\'el_virtual_sports_landing.html\'})();">Virtual Sports : Kiron<i class="icon-fi-arrow-right"></i></li><li>Virtual Soccer League</li>');

			var main_stickygrp_HeaderHeight = $('#el_stickymenu').outerHeight();
			var el_grp_HeaderHeight = $('.el_grp_header').outerHeight();
			var el_grp_vrHeader = $('.vr_timer').outerHeight();
			$('.vr_timer').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight);
			$('.el_grp_header').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight + el_grp_vrHeader);
			$('.bet_type_wrp').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight + el_grp_vrHeader + el_grp_HeaderHeight);
			eventListing_linkage();
		} else if (pagetype == 'betradar') {
			$('.see_all').hide();
			$('.ob_listing_hdr, .ob_wrp, #mock_demo_pinned_competition_euro, .outright_row.n_sticky').hide();
			$('.sub_menu_panel').css('display', '');
			$('#el_nav_slider').hide();
			$('.sport_info').html('<i class="icon-fi-title-s39 icon"></i> Virtual Soccer League');
			$('.nav_bar').html('<li onclick="(function(){window.location.href=\'index.html\'})();">Home<i class="icon-fi-arrow-right"></i></li><li onclick="(function(){window.location.href =\'el_virtual_sports_landing.html\'})();">Virtual Sports : Betradar<i class="icon-fi-arrow-right"></i></li><li>Virtual Soccer League</li>');

			// 26 = hard code to fix html loading sequences issue, dev may ignore
			var el_grp_vrHeader = 28;
			var main_stickygrp_HeaderHeight = $('#el_stickymenu').outerHeight();
			var el_grp_HeaderHeight = $('.el_grp_header').outerHeight();
			$('.virtual_sports_header').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight);
			$('.el_grp_header').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight + el_grp_vrHeader);
			$('.bet_type_wrp').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight + el_grp_vrHeader + el_grp_HeaderHeight);
			eventListing_linkage();
		} else if (pagetype == 'sportsdraw') {
			$('.see_all').hide();
			$('.sub_menu_panel').css('display', '');
			$('#el_nav_slider').show();
			$('.n_sports_menu').html('<div class="item_wrap active"> <div class="item">Germany Bundesliga 1993/94-2021</div></div><div class="slider"></div>');
			$('.sport_info').html('<i class="icon-fi-title-s39 icon"></i> Sportsdraw : Today');
			$('.nav_bar').html('<li onclick="(function(){window.location.href=\'index.html\'})();">Home<i class="icon-fi-arrow-right"></i></li><li onclick="(function(){window.location.href =\'el_virtual_sports_landing.html\'})();">Virtual Sports : IM<i class="icon-fi-arrow-right"></i></li><li>Germany Bundesliga 1993/94-2021</li>');
			// 26 = hard code to fix html loading sequences issue, dev may ignore
			// var el_grp_vrHeader = 26;
			var main_stickygrp_HeaderHeight = $('#el_stickymenu').outerHeight();
			var el_grp_HeaderHeight = $('.el_grp_header').outerHeight();
			var vr_timerHeight = $('.vr_timer').outerHeight();
			// $(".virtual_sports_header").css("top", main_HeaderHeight + main_stickygrp_HeaderHeight);
			$('.vr_timer').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight);
			$('.el_grp_header').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight + vr_timerHeight);
			$('.bet_type_wrp').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight + vr_timerHeight + el_grp_HeaderHeight);
			eventListing_linkage();
		} else if (pagetype == 'league') {
			$('.sub_menu_panel').css('display', '');
			$('.see_all').hide();
			$('.see_all').next('.v_split').hide();
			$('#all_tab').hide();
			$('#all_tab').next('.v_split').hide();
			$('.m_tab').find('sup').hide();
			$('#el_nav_slider .item_wrap').removeClass('active');
			$('#slider_leagues').addClass('active');
			eventListing_linkage();
			el_league_pagesetting();
		} else if (pagetype == 'outright') {
			$('.sub_menu_panel').css('display', '');
			$('.see_all').hide();
			$('.see_all').next('.v_split').hide();
			$('#all_tab').hide();
			$('#all_tab').next('.v_split').hide();
			$('.m_tab').find('sup').hide();

			$('.sport_info').html('<i class="icon-fi-title-s1 icon"></i> Soccer: Outright');
			$('#el_nav_slider .item_wrap').removeClass('active');
			$('#slider_outright').addClass('active');
			eventListing_linkage();

			var main_stickygrp_HeaderHeight = $('#el_stickymenu').outerHeight();
			var el_grp_HeaderHeight = $('.el_grp_header').outerHeight();

			// Outright: Page 1
			$('#outright_content_1').load('_el_outright_selectleague.html', function () {
				$('.outright_row').click(function () {
					$('.dev_dontCopy_demo_toggle_outright').show();
					$('#outright_content_1').hide();
					$('#outright_content_2').show();
				});
				pinClick('.el_items', '#outright_content_1');
				$('#outright_content_1 .el_top_row').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight);
			});
			// Outright: Page 2
			$('#outright_content_2').load('_el_outright_eventlisting.html', function () {
				$('#outright_content_2 .el_top_row').css('top', main_HeaderHeight + main_stickygrp_HeaderHeight);
			});
		} else if (pagetype == 'soccerfifa') {
			$('.sub_menu_panel').css('display', '');
			$('#el_nav_slider, #el_nav_slider3, .nav_bar').hide();
			$('#el_nav_slider_soccer_fifa').show();
			eventListing_linkage();
		}

		myfunc($('#el_nav_slider'));
		myfunc($('#el_nav_slider_soccer_fifa .slider_wrap_flexi'));
		//[SFCRQ-3478][Euro] Sports Panel and Bottom Panel UX Change: start
		$('.el_top_panel').unwrap();

		var elTopPanelHeight = $('.el_top_panel').outerHeight();
		var erMainMenuHeight = $('.er_main_menu').outerHeight(); //70px
		var elHeaderHeight = $('.el_header').outerHeight(); //34px
		var elGrpHeaderHeight = 34; //$(".el_grp_header").outerHeight(), can't get data on el_racing.html
		var obHeaderHeight = $('.ob_listing_hdr').outerHeight();
		var elTopRowHeight = 34; //$(".el_top_row.n_sticky").outerHeight(), can't get data on el_soccer_outright.html
		var virtualSportsHeader = 26;
		var vrTimerHeight = $('.vr_timer').outerHeight(); //28px
		const elHeaderGrpHeight = $('.el_header_grp').outerHeight();

		if ($('.sub_menu_panel').is(':visible')) {
			var subMenuPanelHeight = $('.sub_menu_panel').outerHeight();
		} else {
			var subMenuPanelHeight = 0;
		}

		$('.el_top_panel').css('top', main_HeaderHeight);
		$('.el_header_grp').css('top', main_HeaderHeight + elTopPanelHeight);

		function scrollSticky(updateNavClass = true) {
			// Virtual pages update several sticky top values together. Remove the Euro
			// navReset transition so those values do not trail the current scroll direction.
			if (window.location.href.indexOf('virtual') > -1) {
				$('.el_header, .sub_menu_panel, .virtual_sports_header, .n_iframe_kiron, .n_iframe_betradar, .btn_row, .n_info_msg, .vr_timer, .el_grp_header, .bet_type_wrp').each(function () {
					this.style.setProperty('transition', 'none', 'important');
				});
			}
			// Set the class ourselves during scroll handling, before touching any top values -
			// this keeps the virtual sticky stack in sync with the current direction.
			if (updateNavClass) {
				$('body').removeClass('navReset').addClass('navScroll');
			}
			// el_header_grp is hidden while scrolling down, so don't reserve its height here
			var elHeaderTopPx = main_HeaderHeight + elTopPanelHeight;
			setImportantTop($('.el_header'), elHeaderTopPx);
			// $(".sub_menu_panel").css("top", main_HeaderHeight + elTopPanelHeight + 40);
			// $(".ob_listing_hdr").css("top", main_HeaderHeight + elTopPanelHeight )
			if (window.location.href.indexOf('virtual') === -1) {
				if (window.location.href.indexOf('2021') === -1) {
					$('.el_header + .sub_menu_panel').css('top', main_HeaderHeight + elTopPanelHeight + elHeaderHeight);
					$('.el_grp_header').css('top', main_HeaderHeight + elTopPanelHeight + elHeaderHeight + subMenuPanelHeight);
					$('.bet_type_wrp').css('top', main_HeaderHeight + elTopPanelHeight + elHeaderHeight + subMenuPanelHeight + elGrpHeaderHeight);
				} else {
					//el_euro_cup_2021.html
					$('.sub_menu_panel').css('top', main_HeaderHeight + elTopPanelHeight);
					$('.el_grp_header').css('top', main_HeaderHeight + elTopPanelHeight + subMenuPanelHeight);
					$('.bet_type_wrp').css('top', main_HeaderHeight + elTopPanelHeight + subMenuPanelHeight + elGrpHeaderHeight);
				}
				$('.el_top_row.n_sticky').css('top', main_HeaderHeight + elTopPanelHeight + elHeaderHeight + subMenuPanelHeight); //sample shown in el_soccer_outright.html
				$('.el_content_wrp.n_sticky').css('top', main_HeaderHeight + elTopPanelHeight + elHeaderHeight + subMenuPanelHeight + elTopRowHeight); //sample shown in el_soccer_outright.html
				$('.sub_menu_panel').css('top', main_HeaderHeight + elTopPanelHeight + elHeaderHeight);
			} else {
				setImportantTop($('.sub_menu_panel'), main_HeaderHeight + elTopPanelHeight + elHeaderHeight);
				var scrollStickyNaturalBaseTop = main_HeaderHeight + elTopPanelHeight + elHeaderHeight + subMenuPanelHeight;
				applyVirtualPinnedSticky(scrollStickyNaturalBaseTop);
			}
		}

		function setImportantTop($el, topPx) {
			$el.each(function () {
				this.style.setProperty('top', topPx + 'px', 'important');
			});
		}

		// While pinned, kiron/betradar's iframe + the header row stacked below it moves along with
		// sub_menu_panel (naturalBaseTop is sub_menu_panel's own current top + its height), same as
		// while unpinned - pinning only keeps them visually stuck via n_sticky/position:sticky, it
		// doesn't freeze their top value.
		function applyVirtualPinnedSticky(naturalBaseTop) {
			var pinBtn = $('.pin_wrp .n_visualization_btn, .btn_row .n_visualization_btn:has(.icon-fi-sev-pin)');
			if (window.location.href.indexOf('betradar') > -1) {
				//el_virtual_betradar_soccer.html
				var betradarPinned = pinBtn.hasClass('pin');
				var $betradarIframe = $('.n_iframe_betradar');
				var $betradarExtraPinRow = $betradarIframe.next('.btn_row');
				var $betradarExtraPinButton = $betradarExtraPinRow.find('.n_visualization_btn:has(.icon-fi-sev-pin)');

				// height must be measured AFTER n_sticky is applied, since that class can change the
				// iframe's layout (e.g. static/relative -> fixed); measuring before it left a gap between
				// the pinned iframe's real bottom edge and the vr_timer/el_grp_header/bet_type_wrp stack.
				$betradarIframe.toggleClass('n_sticky', betradarPinned);
				var betradarPinnedHeight = betradarPinned ? $betradarIframe.outerHeight() : 0;
				var betradarExtraPinIsPinned = $betradarExtraPinButton.hasClass('pin');
				var betradarExtraPinRowHeight = betradarExtraPinIsPinned ? $betradarExtraPinRow.outerHeight() : 0;

				$betradarExtraPinRow.toggleClass('n_sticky', betradarExtraPinIsPinned).css({
					position: betradarExtraPinIsPinned ? 'sticky' : '',
					top: betradarExtraPinIsPinned ? naturalBaseTop + betradarPinnedHeight : '',
				});
				if (betradarPinned) {
					var betradarStackTop = naturalBaseTop + betradarPinnedHeight + betradarExtraPinRowHeight;

					setImportantTop($betradarIframe, naturalBaseTop);
					setImportantTop($('.virtual_sports_header'), naturalBaseTop + betradarPinnedHeight);
					setImportantTop($('.el_grp_header'), betradarStackTop);
					setImportantTop($('.bet_type_wrp'), betradarStackTop + elGrpHeaderHeight);
					// .navReset .el_grp_header/.bet_type_wrp carry a "transition: top 0.3s linear" in the
					// compiled CSS; suppress it so direction changes snap instantly, matching el_header/
					// sub_menu_panel's own (transition-free) instant snap instead of a delayed glide.
					// n_iframe_betradar is deliberately left out here - it has its own navReset transition
					// (see _sev.scss), being tested as a fix for the gap below the pinned iframe.
					$('.el_grp_header')
						.add('.bet_type_wrp')
						.each(function () {
							this.style.setProperty('transition', 'none', 'important');
						});
				} else {
					$betradarIframe.css('top', '');
					$('.virtual_sports_header').css('top', naturalBaseTop);
					setImportantTop($('.el_grp_header'), naturalBaseTop);
					setImportantTop($('.bet_type_wrp'), naturalBaseTop + elGrpHeaderHeight);
					$('.el_grp_header')
						.add('.bet_type_wrp')
						.each(function () {
							this.style.removeProperty('transition');
						});
				}
			} else {
				//el_virtual_kiron_sports.html or el_virtual_sportsdraw.html
				var isKironPage = window.location.href.indexOf('kiron') > -1;
				var kironPinned = isKironPage && pinBtn.hasClass('pin');
				var $kironIframe = $('.n_iframe_kiron');
				var $kironExtraPinRow = $kironIframe.next('.btn_row');
				var $kironExtraPinButton = $kironExtraPinRow.find('.n_visualization_btn:has(.icon-fi-sev-pin)');
				var $kironInfoMsg = $('.n_info_msg');

				// height must be measured AFTER n_sticky is applied, since that class can change the
				// iframe's layout (e.g. static/relative -> fixed); measuring before it left a gap between
				// the pinned iframe's real bottom edge and the vr_timer/el_grp_header/bet_type_wrp stack.
				if (isKironPage) {
					$kironIframe.toggleClass('n_sticky', kironPinned);
				}
				var kironPinnedHeight = kironPinned ? $kironIframe.outerHeight() : 0;
				var kironExtraPinIsPinned = $kironExtraPinButton.hasClass('pin');
				var kironExtraPinRowHeight = kironExtraPinIsPinned ? $kironExtraPinRow.outerHeight() : 0;
				var kironInfoVisible = $kironInfoMsg.is(':visible');
				var kironInfoIsSticky = kironPinned && kironInfoVisible;

				$kironExtraPinRow.toggleClass('n_sticky', kironExtraPinIsPinned).css({
					position: kironExtraPinIsPinned ? 'sticky' : '',
					top: kironExtraPinIsPinned ? naturalBaseTop + kironPinnedHeight : '',
				});
				$kironInfoMsg.toggleClass('n_sticky', kironInfoIsSticky);
				var kironInfoHeight = kironInfoIsSticky ? $kironInfoMsg.outerHeight() : 0;

				if (kironPinned) {
					setImportantTop($kironIframe, naturalBaseTop);
					var kironInfoTop = naturalBaseTop + kironPinnedHeight + kironExtraPinRowHeight;
					var kironTimerTop = kironInfoTop + kironInfoHeight;
					$kironInfoMsg.css('top', kironInfoIsSticky ? kironInfoTop : '');
					setImportantTop($('.vr_timer'), kironTimerTop);
					setImportantTop($('.el_grp_header'), kironTimerTop + vrTimerHeight);
					setImportantTop($('.bet_type_wrp'), kironTimerTop + vrTimerHeight + elGrpHeaderHeight);
				} else {
					if (isKironPage) {
						$kironIframe.css('top', '');
					}
					$kironInfoMsg.css('top', '');
					$('.vr_timer').css('top', naturalBaseTop);
					setImportantTop($('.el_grp_header'), naturalBaseTop + vrTimerHeight);
					setImportantTop($('.bet_type_wrp'), naturalBaseTop + vrTimerHeight + elGrpHeaderHeight);
				}
			}
		}

		function resetSticky(updateNavClass = true) {
			if (window.location.href.indexOf('virtual') > -1) {
				$('.el_header, .sub_menu_panel, .virtual_sports_header, .n_iframe_kiron, .n_iframe_betradar, .btn_row, .n_info_msg, .vr_timer, .el_grp_header, .bet_type_wrp').each(function () {
					this.style.setProperty('transition', 'none', 'important');
				});
			}
			// See the matching comment in scrollSticky() - set the class ourselves during scroll
			// handling before touching any top values, so the virtual stack snaps together.
			if (updateNavClass) {
				$('body').removeClass('navScroll').addClass('navReset');
			}
			var elHeaderTopPx = main_HeaderHeight + elTopPanelHeight + elHeaderGrpHeight;
			setImportantTop($('.el_header'), elHeaderTopPx);
			if (window.location.href.indexOf('virtual') === -1) {
				if (window.location.href.indexOf('2021') === -1) {
					$('.el_header + .sub_menu_panel').css('top', main_HeaderHeight + elTopPanelHeight + erMainMenuHeight + elHeaderHeight);
					$('.el_grp_header').css('top', main_HeaderHeight + elTopPanelHeight + erMainMenuHeight + elHeaderHeight + subMenuPanelHeight);
					$('.bet_type_wrp').css('top', main_HeaderHeight + elTopPanelHeight + erMainMenuHeight + elHeaderHeight + subMenuPanelHeight + elGrpHeaderHeight);
				} else {
					//el_euro_cup_2021.html
					$('.sub_menu_panel').css('top', main_HeaderHeight + elTopPanelHeight + erMainMenuHeight);
					$('.el_grp_header').css('top', main_HeaderHeight + elTopPanelHeight + erMainMenuHeight + subMenuPanelHeight);
					$('.bet_type_wrp').css('top', main_HeaderHeight + elTopPanelHeight + erMainMenuHeight + subMenuPanelHeight + elGrpHeaderHeight);
				}
				$('.el_top_row.n_sticky').css('top', main_HeaderHeight + elTopPanelHeight + erMainMenuHeight + elHeaderHeight + subMenuPanelHeight); //sample shown in el_soccer_outright.html
				$('.el_content_wrp.n_sticky').css('top', main_HeaderHeight + elTopPanelHeight + erMainMenuHeight + elHeaderHeight + subMenuPanelHeight + elTopRowHeight); //sample shown in el_soccer_outright.html
				$('.sub_menu_panel').css('top', main_HeaderHeight + elTopPanelHeight + elHeaderHeight + elHeaderGrpHeight);
			} else {
				setImportantTop($('.sub_menu_panel'), main_HeaderHeight + elTopPanelHeight + elHeaderGrpHeight + elHeaderHeight);
				// elHeaderGrpHeight already reserves el_header_grp's full height; erMainMenuHeight measures
				// essentially the same bar and would double-count it, so it's deliberately left out here
				// (unlike the non-virtual branch above, which has no elHeaderGrpHeight term of its own).
				var resetStickyNaturalBaseTop = main_HeaderHeight + elTopPanelHeight + elHeaderGrpHeight + elHeaderHeight + subMenuPanelHeight;
				applyVirtualPinnedSticky(resetStickyNaturalBaseTop);
			}
		}
		// Calculate the initial sticky positions without adding either navigation state class.
		scrollSticky(false);

		// Direction is tracked locally so the virtual sticky stack can update from the
		// same scroll event that changes navScroll/navReset.
		var stickyLastScrollTop = $(window).scrollTop();
		function headerSticky(currentScrollTop) {
			var st = currentScrollTop !== undefined ? currentScrollTop : $(window).scrollTop();
			if (st > stickyLastScrollTop) {
				scrollSticky();
			} else {
				resetSticky();
			}
			stickyLastScrollTop = st <= 0 ? 0 : st;
		}
		$(window).scroll(function () {
			headerSticky($(this).scrollTop());
		});
		$('.demoOnly_fixposition .n_container').scroll(function () {
			headerSticky($(this).scrollTop());
		});
		$('.popup_overWrap').scroll(function () {
			headerSticky($(this).scrollTop());
		});
		//[SFCRQ-3478][Euro] Sports Panel and Bottom Panel UX Change: end
		Cyber_Sport();
	});
	// Customization for Sticky Header : Demo Only: ends

	// Collapse and Expand of Header
	//Event Listing
	$('.el_header').each(function () {
		$(this).on('click', function () {
			$(this).find('i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
			if ($(this).attr('id') === 'test_fifa_el_header') {
				$(this).nextUntil('.el_header', '.el_grp_wrp, .bet_type_wrp').toggle();
			} else {
				$(this).nextUntil('.el_header').toggle();
			}
			$(this).toggleClass('n_sticky');
		});
	});

	$('.el_grp_header').each(function () {
		$(this).on('click', function (e) {
			if ($('.tut_tennis_mask').is(':visible') || e.target.classList.contains('icon-fi-pin')) {
				return;
			}
			$(this).find('i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
			$(this).parent().find('.bet_type_wrp, .el_grp_wrp').toggle();
			$(this).toggleClass('n_sticky');
		});
	});
}

//Racing ONLY
function rc_drpdn_sample() {
	$('.content_lf_rt').click(function () {
		var el = $(this);
		$('.content_lf_rt .icon-fi-close').each(function () {
			if ($(el).is($(this).closest('.content_lf_rt'))) return;
			$(this).addClass('icon-fi-add-circle').removeClass('icon-fi-close');
			$(this).closest('.content_lf_rt').find('.content_pop_drpdn').hide();
		});
		$(this).find('i').toggleClass('icon-fi-add-circle icon-fi-close');
		$(this).find('.content_pop_drpdn').toggle();
	});
}

function el_nav_slider() {
	var sevSlider = $('#el_nav_slider');

	if (haveSlider) {
		var sevSlider_Active = $('#el_nav_slider .item_wrap.active');
		var sevSlider_position = sevSlider_Active.offset().left - sevSlider.offset().left + sevSlider.scrollLeft();
		$('#el_nav_slider .slider').css('left', sevSlider_position);
		$('#el_nav_slider .slider').css('width', sevSlider_Active.width());

		$('#el_nav_slider .item_wrap').click(function () {
			$('#el_nav_slider .item_wrap').removeClass('active');
			$(this).addClass('active');
			sevSlider_position = $(this).offset().left - sevSlider.offset().left + sevSlider.scrollLeft();
			$('#el_nav_slider .slider').css('width', $(this).width());
			$('#el_nav_slider .slider').css('left', sevSlider_position);
		});
	}
}

function featured_seeAll() {
	$('#all_soccer').click(function () {
		window.location.href = 'el_soccer.html';
	});
	$('#all_basketball').click(function () {
		window.location.href = 'el_basketball.html';
	});
	$('#all_tennis').click(function () {
		window.location.href = 'el_tennis.html';
	});
	$('#all_financial_bets').click(function () {
		window.location.href = 'el_financial_bets.html';
	});
}

function sideMenu_allSports() {
	myFav();
	$('#side_tab_soccer').click(function (e) {
		if (e.target.className == 'icon-fi-n-fav-on' || e.target.className == 'icon-fi-n-fav-off') {
			return;
		} else {
			window.location.href = 'el_soccer.html';
			$(this).find('.n_fav_off').removeClass().addClass('n_fav_on');
			$(this).find('.icon-fi-n-fav-off').removeClass('icon-fi-n-fav-off').addClass('icon-fi-n-fav-on');
		}
	});
	$('#side_tab_basketball').click(function (e) {
		if (e.target.className == 'icon-fi-n-fav-on' || e.target.className == 'icon-fi-n-fav-off') {
			return;
		} else {
			window.location.href = 'el_basketball.html';
			$(this).find('.n_fav_off').removeClass().addClass('n_fav_on');
			$(this).find('.icon-fi-n-fav-off').removeClass('icon-fi-n-fav-off').addClass('icon-fi-n-fav-on');
		}
	});
	$('#side_tab_tennis').click(function (e) {
		if (e.target.className == 'icon-fi-n-fav-on' || e.target.className == 'icon-fi-n-fav-off') {
			return;
		} else {
			window.location.href = 'el_tennis.html';
			$(this).find('.n_fav_off').removeClass().addClass('n_fav_on');
			$(this).find('.icon-fi-n-fav-off').removeClass('icon-fi-n-fav-off').addClass('icon-fi-n-fav-on');
		}
	});
	$('#side_tab_financial_bets').click(function (e) {
		if (e.target.className == 'icon-fi-n-fav-on' || e.target.className == 'icon-fi-n-fav-off') {
			return;
		} else {
			window.location.href = 'el_financial_bets.html';
			$(this).find('.n_fav_off').removeClass().addClass('n_fav_on');
			$(this).find('.icon-fi-n-fav-off').removeClass('icon-fi-n-fav-off').addClass('icon-fi-n-fav-on');
		}
	});
	$('#side_tab_table_tennis').click(function (e) {
		if (e.target.className == 'icon-fi-n-fav-on' || e.target.className == 'icon-fi-n-fav-off') {
			return;
		} else {
			window.location.href = 'el_table_tennis.html';
			$(this).find('.n_fav_off').removeClass().addClass('n_fav_on');
			$(this).find('.icon-fi-n-fav-off').removeClass('icon-fi-n-fav-off').addClass('icon-fi-n-fav-on');
		}
	});
	$('#side_tab_baseball').click(function (e) {
		if (e.target.className == 'icon-fi-n-fav-on' || e.target.className == 'icon-fi-n-fav-off') {
			return;
		} else {
			window.location.href = 'el_no_event.html';
			$(this).find('.n_fav_off').removeClass().addClass('n_fav_on');
			$(this).find('.icon-fi-n-fav-off').removeClass('icon-fi-n-fav-off').addClass('icon-fi-n-fav-on');
		}
	});
}

// Event Listing : League: demo only: revisit for cleanup: starts
function el_league_pagesetting() {
	SettingDemoPage1_league();
	myfunc($('#el_nav_slider'));

	$('#el_league_content_1').load('_el_soccer_league.html', function () {});

	function SettingDemoPage1_league() {
		$('.dev_dontCopy_demo_toggle, .dev_dontCopy_demo_toggle2, #el_league_content_2, #el_league_content_3, #outright_content_2, .dev_dontCopy_demo_slider2, #slider_tournaments').hide();
		$('#el_league_content_1, .dev_dontCopy_demo_slider1, #slider_leagues').show();
		$('.er_main_menu +.el_header .sport_info').html('<i class="icon-fi-title-s1 icon"></i> Soccer : Leagues');
	}
}
// Event Listing : League: demo only: revisit for cleanup: ends

function myfunc(myslider) {
	// demo only - one time script
	var myslider = myslider;
	var myslider_Active = myslider.find('.item_wrap.active');
	var mySlider_position = myslider_Active.offset().left - myslider.offset().left + myslider.scrollLeft();
	console.log('mySlider_position: ' + mySlider_position);
	myslider.find('.slider').css('left', mySlider_position);
	myslider.find('.slider').css('width', myslider_Active.width());

	myslider.find('.item_wrap').click(function () {
		$(this).addClass('active');
		$(this).siblings('.item_wrap').removeClass('active');
		mySlider_position = $(this).offset().left - myslider.offset().left + myslider.scrollLeft();

		myslider.find('.slider').css('left', mySlider_position);
		myslider.find('.slider').css('width', $(this).width());
	});

	$('#demolink_league').click(function () {
		SettingDemoPage1_league();
	});
}

//Global : Shared Popup : for item in header ==============================//
function allfrom_global_pop_item() {
	// Global : click to show my account*/
	// Global : Demo For Main Loading Page: Z-index Must On Top Everything*/
	$('.dontcoopythisclass_sample_button_myacct').on('click', function () {
		$('.footer_main').hide();
		$('#sample_loading').css('display', '');
		setTimeout(function () {
			$('#sample_loading').css('display', 'none');

			// My Acct Info ============
			$('#myacctpage').css('display', '');
			popupOn(true);
			$('.btn_backtop').removeClass('btn_backtop_popup');
		}, 1000);
	});
	/*Global : click to show completed results*/
	$('.dontcoopythisclass_sample_button_results').on('click', function () {
		$('#completedresults').css('display', '');

		popupOn(true);
		backtotop(true);
		$('.btn_backtop').addClass('btn_backtop_popup');
		scrolling_disable(document.getElementsByClassName('popup_overWrap')[0]);

		//add in sticky header: demo only
		//$(".n_header.n_sticky").css("top", 0);
		$('#demoonly_sample2').css('top', $('#demoonly_sample1').outerHeight()).css('z-index', 5); //border-bottom being overwriten
		$('#demoonly_sample3').css('top', $('#demoonly_sample1').outerHeight() + $('#demoonly_sample2').outerHeight());
		var demoonly_sample4 = $('#demoonly_sample1').outerHeight() + $('#demoonly_sample2').outerHeight() + $('#demoonly_sample3').outerHeight();
		// remove  + $("#demoonly_sample3").outerHeight()
		$('.n_grp_header.n_sticky').css('top', demoonly_sample4);
		//cp_table_width();
		//calculate the top rahr
		var hrheigh = $('.remove_arrow').find('.completedresult_item_table_header').outerHeight() + $('.remove_arrow .completedresult_item_table_content_wrap').find('.completedresult_item_table_col').first().outerHeight();
		$('.remove_arrow .cp_tb_main').css('--rahr', hrheigh + 'px');
	});
	/*Global : click to show annoucements*/
	$('.n_annoucement_text marquee').click(function () {
		$('#popup_sample').css('display', '');
		popupOn();
		scrolling_disable(document.getElementsByClassName('popup_overWrap')[0]);
	});
	$('#sample_btn_close').click(function () {
		$('#popup_sample').css('display', 'none');
		popupOff();
	});
	/*Global : Close Popup by black bg*/
	$('.popup_window_center').on('click', function (e) {
		if (e.target !== this) return;
		$('.popup_window').hide();

		popupOff();

		backtotop();
		$('.btn_backtop').removeClass('btn_backtop_popup');
	});
	/*Global : My Bet Popup*/
	$('.demoOnlyDontCopt_betslip').click(function () {
		$('#demomybet').show();
		popupOn(true);
		backtotop(true);
		$('.footer_main').hide();
		$('.bet_summary').show();

		var sampleHeaderTallHeight = 44; //dev side please use dynamic if possible
		var filterHeight = sampleHeaderTallHeight + $('#demo_test_menuheight').outerHeight();
		$('.n_menu_slider.n_sticky').css('top', sampleHeaderTallHeight);
		$('.filter_Bettrade.n_sticky').css('top', filterHeight);
		$('#sample_open_settle_bets .filter_group').css('top', filterHeight);
	});
	$('.demoOnlyDontCopt_betslipPanel').click(function () {
		$('#demomybet').addClass('demomybetPanel');
	});
	/*Global : Pref Popup*/
	$('#demobtn_pref').on('click', function () {
		$('#demoprefsetting').css('display', '');
	});
	/*Global : FAQ Popup*/
	$('#demobtn_faq').on('click', function () {
		$('#demofaq').css('display', '');
		// load here to prevent messy JS lists in JS console
		$('#demoIframe').attr('src', 'https://7xc9b5.skylgl.com/cn/general-betting-rules-cn');
	});
	/*Global : Device Info Popup*/
	$('#demobtn_deviceinfo').on('click', function () {
		$('#demodeviceInfo').css('display', '');
	});
}

// SEV: starts =================================== *************************************//
var device_height = $(window).height();
var device_width = $(window).width();
var iframeRatio = device_width * (322.25 / 520); /*ratio from betradar*/
var limitHeight_prematch = 0;
var pin = false;
var page = 'home';
var alert_loading = false;
var alert_sev = false;

function iframeStats() {
	var allHeaderHeight_stats = $('.n_sev_view .n_header').outerHeight() + $('.euSev_header').outerHeight() + $('.sample_mock_dev_can_delete_main').outerHeight();
	var total = device_height - allHeaderHeight_stats;
	$('#iframe_statistics').css('height', total);
}

function Slider_Setting(market, checkVisual) {
	var sevSlider = $('.eu_sevSlider');

	if (sevSlider.hasClass('thinner_slider')) {
		calc_shorter_sevSlider_width();
	} else {
		//SEV Slider : Active effect
		var sevSlider_Active = sevSlider.find('.item_wrap.active');
		var sevSlider_position = sevSlider_Active.offset().left - sevSlider.offset().left + sevSlider.scrollLeft();

		sevSlider.find('.slider').css('left', sevSlider_position);
		sevSlider.find('.slider').css('width', sevSlider_Active.width());
	}

	//SEV Slider : Top Value
	var n_header = $('.n_sev_view  .n_header').outerHeight();
	var euSev_header = $('.euSev_header').outerHeight();
	var sevSliderAuto = $('#demo_sample_dashboard_scenarios').outerHeight();
	console.log('slider setting: n_header: ' + n_header);

	if (page != 'home') {
		if (pin) {
			sevSliderAuto = $('#demo_sample_dashboard_scenarios').outerHeight();
			//SFSSR-6505
			//sevSlider.removeClass("noVisual");

			//part3 fix stream top issue
			// if ($(".n_info_msg").is(':visible')) {
			//     sevSliderAuto += $(".n_info_msg").outerHeight();
			// }
			$('.sample_mock_dev_can_delete_main').css('z-index', '');
		} else {
			sevSliderAuto = 0;
			$('.sample_mock_dev_can_delete_main').css('z-index', '0');
			//SFSSR-6505
			//sevSlider.addClass("noVisual");
		}
	} else {
		$('.sample_mock_dev_can_delete_main').css('z-index', '');
		//SFSSR-6505
		//sevSlider.removeClass("noVisual");
	}

	function prematchScroll(thisItem) {
		if (page == 'home') {
			if (alert_sev && lastScrollTop != 0) {
				lastScrollTop = thisItem.scrollTop();
				alert_sev = false;
			} else {
				if (thisItem.scrollTop() > lastScrollTop && !alert_loading) {
					//console.log("=================================================hereeeeeeeeeee");

					alert_loading = true;
					$('.eu_teamGrp img').css('display', 'none');
					$('#demo_sample_dashboard_scenarios').css('height', 'auto');
					$('#demo_sample_dashboard_scenarios').addClass('s_fadeOut');
					setTimeout(function () {
						$('#demo_sample_dashboard_scenarios').removeClass('s_fadeOut').addClass('s_fadeIn');
					}, 1);
					setTimeout(function () {
						$('#demo_sample_dashboard_scenarios').removeClass('s_fadeIn');
					}, 200);
					$('.sample_mock_dev_can_delete_main').css('z-index', '');
					$('.dont_copy_sev_icon_global').hide();
					Slider_Setting();

					lastScrollTop = thisItem.scrollTop();
					alert_sev = true;
				} else {
					//console.log("up ");

					if (thisItem.scrollTop() <= lastScrollTop && alert_loading) {
						$('.eu_teamGrp img').css('display', '');
						$('#demo_sample_dashboard_scenarios').css('height', iframeRatio);
						$('.sample_mock_dev_can_delete_main').css('z-index', '0');
						$('.dont_copy_sev_icon_global').show();
						alert_loading = false;
						lastScrollTop = limitHeight_prematch;
					}
				}
			}
		}
	}
	if (market == 'prematch') {
		sevSliderAuto = 0;
		$('.sample_mock_dev_can_delete_main').css('z-index', '0');

		lastScrollTop = limitHeight_prematch;
		$('.demoOnly_fixposition')
			.find('.sev_popup')
			.scroll(function () {
				prematchScroll($(this));
			});
		$(window).scroll(function () {
			prematchScroll($(this));
		});
	}

	if (checkVisual == 'noVisual') {
		sevSliderAuto = 0;
	}

	var sevSlider_Top = n_header + euSev_header + sevSliderAuto;
	console.log('slider setting: sevSlider_Top: ' + sevSlider_Top + '= n_header:' + n_header + ' euSev_header:' + euSev_header + ' sevSliderAuto:' + sevSliderAuto);

	//euro-part 3 add
	if ($('.dont_copy_h2h_stats').is(':visible')) {
		$('.dont_copy_h2h_stats').css('top', sevSlider_Top);
		sevSlider_Top = sevSlider_Top + $('.dont_copy_h2h_stats').outerHeight();
	}
	//part3 fix the h2h sticky height
	if ($('.n_pin_dev_can_delete').hasClass('active')) {
		if ($('.n_info_dev_can_delete').hasClass('info')) {
			//2024-10-13 info to be pinned
			$('.n_info_msg').addClass('n_sticky');
			//$(".n_info_msg").css("top", sevSlider_Top);
			//sevSlider.css("top", sevSlider_Pinned_withInfo_Top);
			//sevSlider_stats.css("top", sevSlider_Pinned_withInfo_Top);
		} else {
			//part3 info to be pinned
			$('.n_info_msg').removeClass('n_sticky');
			//sevSlider.css("top", sevSlider_Pinned_Top);
			//sevSlider_stats.css("top", sevSlider_Pinned_Top);
			$('.n_info_msg').css('top', 'unset');
		}
	}
	//part3 sticky issue fix
	//$(".n_info_msg").css("top", $(".n_sev_view").outerHeight() + $(".sample_mock_dev_can_delete_main").outerHeight());
	if ($('.n_info_msg').is(':visible')) {
		$('.n_info_msg').css('top', sevSlider_Top);
		sevSlider_Top = sevSlider_Top + $('.n_info_msg').outerHeight();
	}

	$('.sample_mock_dev_can_delete_main').css('top', $('.n_sev_view').outerHeight());
	//$(".n_info_msg").css("top", $(".n_sev_view").outerHeight() + $(".sample_mock_dev_can_delete_main").outerHeight());

	$('.DontCopy_test_sev_filter_menu').css('top', sevSlider_Top);

	//euro part2 add
	if (!$('.n_pin_dev_can_delete').hasClass('active')) {
		$('.dont_copy_h2h_stats').css('top', '');
		$('.sample_mock_dev_can_delete_main').css('top', '');
		$('.n_info_msg').css('top', '');
		$('.DontCopy_test_sev_filter_menu').css('top', n_header + euSev_header);
	} else {
		if ($('.dont_copy_iconStats').hasClass('active')) {
			$('.DontCopy_test_sev_filter_menu').css('top', sevSlider_Top);
		}
		$('.sample_mock_dev_can_delete_main').addClass('n_sticky');
		$('.sample_mock_dev_can_delete_main').css('top', $('.n_sev_view').outerHeight());
	}
}

function SEV_Setting(haveSlider, market, checkVisual) {
	var sevSlider = $('.eu_sevSlider');
	console.log('enter slider setting');

	if (haveSlider) {
		Slider_Setting(market, checkVisual);
		if ($('.eu_sevSlider').hasClass('thinner_slider')) {
			calc_shorter_sevSlider_width();
		} else {
			$('.eu_sevSlider .item_wrap').click(function () {
				$('.eu_sevSlider .item_wrap').removeClass('active');
				$(this).addClass('active');
				sevSlider_position = $(this).offset().left - sevSlider.offset().left + sevSlider.scrollLeft();
				$('.eu_sevSlider .slider').css('width', $(this).width());
				$('.eu_sevSlider .slider').css('left', sevSlider_position);
			});
		}
	}
}

function SEV_icons(market) {
	if (market == 'prematch') {
		$('.dont_copy_lsBtn').css('display', 'none');

		// if virtual sports
		var URI = window.location.pathname.split('/').pop();
		var subStr = URI.match('el_(.*)');
		var sportstype = subStr[1];
		if (sportstype.includes('virtual')) {
			$('.sev_popup .n_visualization_btn').css('display', 'none');
		}
	}
	// trigger pin & unpin
	$('.n_pin_dev_can_delete').click(function () {
		/*  pin = !pin;
        $(".n_info_msg").toggleClass("n_sticky");
        $(".n_pin_dev_can_delete").toggleClass("active"); */

		//part2 fix unpin not working issue
		if ($(this).hasClass('active')) {
			$('.n_info_msg').removeClass('n_sticky');
			$('.n_pin_dev_can_delete').removeClass('active');
			$('.eu_h2h.dont_copy_h2h_stats').removeClass('n_sticky');
			$('.n_visualization_wrap.sample_mock_dev_can_delete_main').removeClass('n_sticky');
			//$(".n_sports_menu.slider_wrap_flexi.eu_sevSlider").removeClass("n_sticky");
			pin = false;
		} else {
			$('.n_info_msg').addClass('n_sticky');
			$('.n_pin_dev_can_delete').addClass('active');
			$('.eu_h2h.dont_copy_h2h_stats').addClass('n_sticky');
			$('.n_visualization_wrap.sample_mock_dev_can_delete_main').addClass('n_sticky');
			//$(".n_sports_menu.slider_wrap_flexi.eu_sevSlider").addClass("n_sticky");
			$('.DontCopy_test_sev_filter_menu').addClass('n_sticky');
			pin = true;
		}
		Slider_Setting();
	});

	// trigger info
	$('.n_info_dev_can_delete').click(function () {
		//part3 info to be pinned
		if ($(this).hasClass('info')) {
			$(this).removeClass('active info');
			$('.n_info_msg').hide();
		} else {
			$(this).addClass('active info');
			$('.n_info_msg').show();
		}

		Slider_Setting();
	});

	//[SFCRQ-2720][Euro View Mobile] To implement new handling for message pop up
	$('.dont_copy_channel').click(function () {
		$('.chan_popup').show();
		$('.dont_copy_sev_icon_global').hide();
	});
	$('.chan_popup').on('click', function () {
		$('.chan_popup').hide();
		$('.dont_copy_sev_icon_global').show();
	});
	$('.chan_btn')
		.not('#dont_copy_channel_popup')
		.on('click', function () {
			$('.chan_btn').removeClass('active');
			$(this).addClass('active').parents('.n_visualization_wrap').find('.dont_copy_channel div').text($(this).text());
		});
	$('#dont_copy_channel_popup').on('click', function () {
		$('.n_visualization_wrap').css('z-index', 4);
		$('.smallpop').show();
		$('.smallpop .smallpop_wrp_inner').text('There are no other channels available at the moment');
		$('.dont_copy_sev_icon_global').hide();

		setTimeout(function () {
			$('.n_visualization_wrap').css('z-index', 3);
			$('.smallpop').hide();
			$('.smallpop .smallpop_wrp_inner').text('最多可选择10个投注项');
			$('.dont_copy_sev_icon_global').show();
		}, 5000);
	});

	$('#dont_copy_bet_error_popup').on('click', function () {
		$('.bet_error_wrap').show();

		setTimeout(function () {
			$('.bet_error_wrap').hide();
		}, 5000);
	});

	// trigger volume
	$('.dont_copy_voice').click(function () {
		$(this).find('i').toggleClass('icon-fi-eu-voice-on icon-fi-eu-voice-mute');
		$(this).toggleClass('volume');
	});

	function toggle_videoORvisual(thisBtn, thisPanel, offPanel, market) {
		if (!thisPanel.is(':visible')) {
			page = 'visual_live';

			if (!offPanel.is(':visible')) {
				// first load from main page
				pin = true;
				$('.n_info_msg').addClass('n_sticky');
				$('.n_pin_dev_can_delete').addClass('active');
				Slider_Setting();
			}
			//$(window).scrollTop(0);

			thisBtn.addClass('active');
			//part2
			//thisBtn.siblings(".n_visualization_btn:not('.dont_copy_iconStats')").removeClass("active");
			thisBtn.siblings('.n_visualization_btn').removeClass('active');
			offPanel.css('display', 'none');
			thisPanel.css('display', '');

			if (thisPanel.is('#open_live_streaming')) {
				$('.eu_Itop, .sev_IconLft, .dont_copy_channel:not(.DemoOnlyDevDontCopyEsportsBtn), .dont_copy_voice').css('display', '');

				var iframe_url = 'https://sports-web-stg-ls.inplaymatrix.com:4650/livestreaming/index?video=https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8';
				$('.iframeVideo_nonclickable').attr('src', iframe_url);
			} else {
				$('.dont_copy_channel:not(.DemoOnlyDevDontCopyEsportsBtn), .dont_copy_voice').css('display', 'none');
				$('.eu_Itop, .sev_IconLft').css('display', '');
			}
			if (market == 'live') {
				$('#demo_sample_dashboard_scenarios').css('height', iframeRatio + 'px');
				// iframeStats();
				$('.dont_copy_sev_icon_global').removeClass('euSev_icn_relative');

				console.log('wh here: iframeRatio:::::::::::' + iframeRatio);
			}
			Slider_Setting();
		} else {
			page = 'home';
			thisBtn.removeClass('active');
			offPanel.css('display', 'none');
			thisPanel.css('display', 'none');

			pin = false;
			$('.n_info_msg').removeClass('n_sticky');
			$('.n_pin_dev_can_delete').removeClass('active');

			$('.eu_Itop, .sev_IconLft, .dont_copy_channel, .dont_copy_voice').css('display', 'none');

			if (thisBtn.hasClass('demoEsLs')) {
				$('.eu_Ibtm').show();
				$('.eu_Itop').removeClass('esVsBtn');
				$('.DemoOnlyDevDontCopyEsportsBtn').hide();
			}

			if (market == 'live') {
				$('#demo_sample_dashboard_scenarios').css('height', '');
				//iframeStats();
				$('.dont_copy_sev_icon_global').addClass('euSev_icn_relative');
			}
			Slider_Setting();
		}
	}
	// trigger live stream
	$('.n_sev_top .dont_copy_lsBtn').on('click', function () {
		//h2h sev panel

		if ($(this).hasClass('demoEsLs')) {
			$('.eu_Ibtm').hide();
			$('.eu_Itop').addClass('esVsBtn');
			$('.DemoOnlyDevDontCopyEsportsBtn').show();
		} else {
			$('.DemoOnlyDevDontCopyEsportsBtn').hide();
			$('.chan_indi.DemoOnlyDevDontCopyEsportsBtn').css('display', 'none');
		}
		$('#euro_sev_h2h_widnow').hide();
		$('.dont_copy_h2h_stats').hide();
		toggle_videoORvisual($(this), $('#open_live_streaming'), $('#open_visualization'), market);
	});

	// trigger visualization
	$('.n_sev_top .dont_copy_vBtn').on('click', function () {
		//h2h sev panel
		$('#euro_sev_h2h_widnow').hide();
		$('.dont_copy_h2h_stats').hide();
		toggle_videoORvisual($(this), $('#open_visualization'), $('#open_live_streaming'), market);
	});

	// trigger statistic
	$('.dont_copy_iconStats').on('click', function () {
		//when buttton is active, don't run the logic
		if ($(this).hasClass('er_trigger') && !$(this).hasClass('active')) {
			$(this).addClass('grey_out');
			$('.smallpop').find('.smallpop_wrp_inner').html('Statistics is currently not available for this event.');
			$('.smallpop').show();

			setTimeout(function () {
				$('.smallpop').hide();
				$('.dont_copy_iconStats').removeClass('grey_out');
				$('.dont_copy_iconStats').removeClass('er_trigger');
			}, 2000);
			return;
		} else {
			if (!$(this).hasClass('active')) {
				$(this).addClass('er_trigger');
			}
		}
		$('.n_tab_nav_withBG .tab_nav_item').click(function () {
			$('.n_tab_nav_withBG .tab_nav_item').removeClass('active');
			$(this).addClass('active');
		});
		//h2h sev panel
		if ($('#euro_sev_h2h_widnow').is(':visible')) {
			$(this).removeClass('active');
			$('#euro_sev_h2h_widnow, .dont_copy_h2h_stats, sample_short_content, .sev_IconLft').hide();
			$('.n_sports_menu.slider_wrap_flexi.eu_sevSlider, .n_sev_item_content_wrap, .btn_backtop, .n_pin_dev_can_delete, #main_footer').show();
			if (market == 'live') {
				$('#demo_sample_dashboard_scenarios').css('height', '');
				$('.dont_copy_sev_icon_global').addClass('euSev_icn_relative');
			}
			$('#sev_content .thinner_slider .slider').css('width', '');
			$('#sev_content .thinner_slider .slider').css('left', '8px');
			calc_shorter_sevSlider_width();
			popupOff();
			backtotop();
		} else {
			$(this).addClass('active');
			$('.n_sports_menu.slider_wrap_flexi.eu_sevSlider, #euro_sev_h2h_widnow, .n_sev_item_content_wrap, .dont_copy_h2h_stats, .eu_Itop, .n_pin_dev_can_delete, .sev_IconLft, .sev_IconRgt, .sev_IconRgt > .dont_copy_iconStats').show();
			$('#open_live_streaming, #open_visualization, #sample_short_content, .btn_backtop, #main_footer').hide();
			$('#demo_sample_dashboard_scenarios').css('height', iframeRatio + 'px');
			$('.dont_copy_sev_icon_global').removeClass('euSev_icn_relative');
			$('.eu_h2h.dont_copy_h2h_stats').addClass('n_sticky');
			$('.dont_copy_lsBtn').removeClass('active');
			$('.dont_copy_vBtn').removeClass('active');
			$('.n_content_wrap_wth_bcktop').css('padding-bottom', 0);
			popupOn();
		}
		Slider_Setting();
	});
}
function blockScrolingSEV() {
	$('.sev_popup').on('scroll touchmove mousewheel', function (e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	});
}
function SEV_comp() {
	/**general**/
	var sev_click_comp = false;
	$('#DontCopyDev_worldcup_prematch').click(function () {
		sev_click_comp = !sev_click_comp;
	});

	/*standardize popup and toolti: start*/
	infoPop('.euTable_side');
	/*standardize popup and toolti: end*/

	$('#dont_copy_sev_click, .euNav_bar_wrp .euTable_side, #demo_sev_cricket_live, #demo_sev_cricket_liveMore, #demo_sev_cricket_liveScroll').click(function (e) {
		if ($(e.target).closest('.info_wrp').length) {
			return;
		}

		if (!sev_click_comp) {
			$('body').addClass('popupOn');
			$('.n_sev_view').css('z-index', '2');
			$('body.euro').addClass('drpWrp');
			blockScrolingSEV();
		} else {
			$('body').removeClass('popupOn');
			$('.n_sev_view').css('z-index', '1');
			$('body.euro').removeClass('drpWrp');
			$('#sev_testing1').show();
			$('#sev_testing2').hide();
			$('.sev_popup').unbind('scroll touchmove mousewheel');
		}
		var URL2 = window.location.pathname.split('/').pop();
		//var subStr = URL2.match("el_(.*)");
		var sportstype = URL2;
		var thisDrp = $('.drpDown');

		if (sportstype.includes('soccer')) {
			thisDrp = $('#drpDown_prematch');
		} else if (sportstype.includes('basketball')) {
			thisDrp = $('#drpDown_basketball');
		} else if (sportstype.includes('tennis')) {
			thisDrp = $('#drpDown_tennis');
		} else if (sportstype.includes('cricket')) {
			thisDrp = $('#drpDown_cricket');
		} else if (sportstype.includes('icehockey')) {
			thisDrp = $('#drpDown_icehockeylive');
		} else if (sportstype.includes('volleyball')) {
			thisDrp = $('#drpDown_volleyball');
		} else if (sportstype.includes('badminton')) {
			thisDrp = $('#drpDown_badminton');
		} else if (sportstype.includes('baseball')) {
			thisDrp = $('#drpDown_baseball');
		} else if (sportstype.includes('american_football')) {
			thisDrp = $('#drpDown_american_football');
		} else if (sportstype.includes('rugby')) {
			thisDrp = $('#drpDown_rugby');
		} else {
			thisDrp = $('#drpDown_soccerlive');
		}
		// $(".drpBG").toggle();
		// thisDrp.toggle();
		// attention!! dev need help to add below line to pass value into css for calculation
		let nSevViewH = $('.n_sev_view').outerHeight();
		$('.drpBG').css('--nSevViewH', `${nSevViewH}px`).toggle();
		thisDrp.css('--nSevViewH', `${nSevViewH}px`).toggle();

		//$(".sev_popup").toggleClass("popupOn");
		$('.eventListingRefresh').css('z-index', '1');

		$(this).find('i').not('.n_indicator i').not('.icon-fi-info').toggleClass('icon-fi-arrow-up1 icon-fi-arrow-down1');
		sev_click_comp = !sev_click_comp;

		//baseball handling
		$('#drpDown_baseball .euTable_wrp').click(function () {
			$('.mock_eu_baseball_innings').hide();
			$('.mock_eu_baseball_runs').show();
			$('.sample_mock_dev_can_delete_main').css('top', $('.n_sev_view').outerHeight());
			$('.DontCopy_test_sev_filter_menu').css('top', $('.n_sev_view').outerHeight() + $('.sample_mock_dev_can_delete_main').outerHeight());
			$('body').removeClass('popupOn');
			$('.n_sev_view').css('z-index', '1');
			$('.sev_popup, body, .popup_overWrap.n_body').removeClass('popupOn');
			$('body.euro').removeClass('drpWrp');
			$('#dont_copy_sev_click').find('i').removeClass('icon-fi-arrow-down1').addClass('icon-fi-arrow-up1');
			$('#sev_testing1').show();
			$('#sev_testing2').hide();
			sev_click_comp = false;
			$('.sev_popup').unbind('scroll touchmove mousewheel');
			$('.drpBG').css('--nSevViewH', `${nSevViewH}px`).toggle();
			thisDrp.css('--nSevViewH', `${nSevViewH}px`).toggle();
			sev_click_comp = false;
		});
	});
	/* $(".sev_popup").click(function (e) {
        if (e.target == this) {
            popupOff();
            $(".n_sev_view").css("z-index", "1");
            $(".drpDown, .drpBG").hide();
            $(".sev_popup, body, .popup_overWrap.n_body").removeClass("popupOn");
            $("#dont_copy_sev_click").find("i").removeClass("icon-fi-arrow-down1").addClass("icon-fi-arrow-up1");
            $("#sev_testing1").show();
            $("#sev_testing2").hide();
            sev_click_comp = false;
            $(".sev_popup").unbind('scroll touchmove mousewheel');
        }
    }); */
	$('.drpBG').click(function (e) {
		$('body').removeClass('popupOn');
		$('.n_sev_view').css('z-index', '1');
		$('.drpDown, .drpBG').hide();
		$('.sev_popup, body, .popup_overWrap.n_body').removeClass('popupOn');
		$('body.euro').removeClass('drpWrp');
		$('#dont_copy_sev_click').find('i').removeClass('icon-fi-arrow-down1').addClass('icon-fi-arrow-up1');
		$('#sev_testing1').show();
		$('#sev_testing2').hide();
		sev_click_comp = false;
		$('.sev_popup').unbind('scroll touchmove mousewheel');
	});
	$('#demo_sev_cricket_live').click(function () {
		hideCricket();
		$('.demo_sev_cricket_live').show();
	});
	$('#demo_sev_cricket_liveMore').click(function () {
		hideCricket();
		$('.demo_sev_cricket_liveMore').show();
	});
	$('#demo_sev_cricket_liveScroll').click(function () {
		hideCricket();
		$('.demo_sev_cricket_liveScroll').show();
		$('.euSev_header').addClass('rpo');
	});
}

function SEV_Group(sev_HTMLContent, haveSlider, sev_mainPage, sevHeader, market, checkVisual) {
	$('#sample_footer_pre_bet .count').html(countme_eu);
	function enterSEV() {
		$('.sev_popup').show();

		if (market == 'prematch') {
			//limitHeight_prematch =  iframeRatio - $("#demo_sample_dashboard_scenarios").outerHeight() ;
			limitHeight_prematch = $('.n_sev_view').outerHeight() + $('#demo_sample_dashboard_scenarios').outerHeight() - $('.eu_sevSlider').outerHeight() - 8;
			$('#demo_sample_dashboard_scenarios').css('height', iframeRatio + 'px');
		}

		$(window).scrollTop(0);
		$('.demoOnly_fixposition').find('.sev_popup').scrollTop(0);

		SEV_Setting(true, market, checkVisual);
		odds();

		backtotop();
		$('body>.n_container:first-child').css('display', 'none');
		$('body>.n_container:first-child').css('pointer-events', 'none');
	}

	// Click to SEV Page
	$('.content_lf, .n_btn_sev').click(function (e) {
		var exception = $('.n_fav_off, .n_fav_on, .iconPop .n_indicator, .info_wrp');
		if ($(e.target).closest(exception).length) {
			return;
		} else {
			enterSEV();
		}
	});

	$(window).on('click', function (event) {
		if (!$(event.target).closest('.iconPop .n_indicator').length) {
			$('.iconPop .n_indicator').removeClass('active');
		}
	});

	$('.iconPop .n_indicator').click(function () {
		$('.iconPop .n_indicator').removeClass('active');
		$(this).addClass('active');
	});

	//click event listener added to the parent container to avoid "betslip_header" & "betslip_detail_bottom" being trigger click event too
	$('.msgPopCont').on('click', '.betlist_item', function (e) {
		if (e.target.closest('.n_indicator') || e.target.closest('.info_wrp')) {
			return;
		}
		$('#demomybet').hide();
		popupOff();
		enterSEV();
	});

	//wh note: sev restucture start here
	$('#demoOnly_global_pop_item_euro').load('_global_pop_item.html', function () {
		if (sev_mainPage != '' && sev_mainPage != undefined) {
			var d2 = $.get(sev_mainPage);
			var d3 = $.get(sevHeader);
			//to test on Cyber PES: _sev_statistic_slider_worldcup.html
			// _sev_statistic_slider.html
			var d4 = $.get('_sev_statistic_slider.html');
			var d6 = $.get('_sev_scoreboard_global_live.html');
			//to test on volleyball: _sev_scoreboard_volleyball_prematch.html
			//to test on remove na: _sev_scoreboard_global_prematch_removena.html
			//to test on Cyber PES prematch: _sev_scoreboard_worldcup_prematch.html
			// _sev_scoreboard_global_prematch
			var d7 = $.get('_sev_scoreboard_global_prematch.html');
			var d8 = $.get('_sev_dashboard_innerpage_shared.html');
			//to test on Cyber PES prematch: _sev_icon_worldcup.html
			// _sev_icon_global.html
			var d9 = $.get('_sev_icon_global.html');
			var d10 = $.get('_sev_header_comp.html');

			if (sev_HTMLContent != '') {
				var d5 = $.get(sev_HTMLContent);
			}

			$.when(d2, d3, d4, d5, d6, d7, d8, d9, d10).done(function (data2, data3, data4, data5, data6, data7, data8, data9, data10) {
				$('.sev_popup').append(data2[0]);
				$('.sample_mock_dev_can_delete_main').append(data8[0]);
				$('#sev_comp').append(data10[0]);
				//remove extra div
				$('.drpDown').unwrap();

				if (sev_HTMLContent != '') {
					$('#sev_all').empty().append(data5[0]);
				}

				//SEV : check if needed prematch "Banner"
				if (market == 'live') {
					$('#demo_sample_dashboard_scenarios').empty().append(data6[0]);
				} else if (market == 'prematch') {
					$('#demo_sample_dashboard_scenarios').empty().append(data7[0]);
				}

				$('.dont_copy_sev_icon_global').empty().append(data9[0]);
				// $(".dont_copy_stats_slider").empty().append(data4[0]);
				$('#dont_copy_sev_header').append(data3[0]);

				merchantlogo_euro();
				allfrom_global_pop_item();
				SEV_comp();
				SEV_icons(market);

				//header
				$('#dont_copy_league_selection').click(function () {
					$('#sev_testing1').hide();
					$('#sev_testing2').show();
				});

				$('#dont_copy_sev_header .nav_bar:first-child').click(function () {
					window.location.href = 'index.html';
				});

				$('#sample_only_dontcopy_closeSEV').click(function () {
					$('.sev_popup').hide();
					backtotop();
					$('body>.n_container:first-child').css('display', '');
					$('body>.n_container:first-child').css('pointer-events', '');
				});

				//h2h sev panel
				$('#euro_sev_h2h_widnow').hide();
				$('.dont_copy_h2h_stats').load('_sev_h2h_statistic.html');
				$('.dont_copy_h2h_stats').hide();

				//part2
				//default active pin button
				$('.n_pin_dev_can_delete').addClass('active');
			});
		}
	});

	var expand = 0;
	$('.mock_sev_collapse_expand_btn').click(function () {
		if (expand == 0) {
			$('.bet_type .bt_content').slideUp();
			$('.bet_type .bt_subHeader').slideUp();
			$('.bet_type .n_sev_special_subheader').slideUp();
			$(this).find('.icon-fi-arrow-up-incircle').addClass('fl_rotate');
			$('.bet_type .n_sev_header, .bet_type .n_sev_special_subheader').find('.icon-fi-arrow-up1').addClass('fl_rotate');
			$('.bet_type').each(function () {
				if ($(this).find('.n_sev_header').length === 0) {
					$(this).slideUp();
				}
			});
			expand = 1;
		} else {
			$('.bet_type .bt_content').slideDown();
			$('.bet_type .bt_subHeader').slideDown();
			$('.bet_type .n_sev_special_subheader').slideDown();
			$(this).find('.icon-fi-arrow-up-incircle').removeClass('fl_rotate');
			$('.bet_type .n_sev_header, .bet_type .n_sev_special_subheader').find('.icon-fi-arrow-up1').removeClass('fl_rotate');
			$('.bet_type').each(function () {
				if ($(this).find('.n_sev_header').length === 0) {
					$(this).slideDown();
				}
			});
			expand = 0;
		}
	});

	$('.int_wrp .n_indicator').click(function () {
		$(this).addClass('active');
	});

	/*standardize popup and toolti: start*/
	infoPop('.bet_type');
	/*standardize popup and toolti: end*/
}

// SEV: ends =================================== *************************************//

// Back to Top : Demo for Position =================================================//
function backtotop(resetScrollPosition = false) {
	var defaultBottomHeight = -(38 + 8);

	if (resetScrollPosition == true) {
		$('#toTop').removeClass('show');
		$('#toTop').css('bottom', defaultBottomHeight);
	}

	$('.n_content_wrap_wth_bcktop').each(function () {
		if ($(this).is(':visible')) {
			var haveRef = $(this).hasClass('with_ref');
			var haveFooter = $(document).find('#main_footer');
			var haveFooter_seen = $('#main_footer').is(':visible');
			var footerHeight = 44;

			if (haveRef) {
				//8px: padding from design file
				//38px: button size
				//16px: gap between button
				var paddingBottom = 8 + 38 * 2 + 16;
				var bottomposition = 8 + 38 + 16;
				var bottomposition_ref = 8;
				if (haveFooter && haveFooter_seen) {
					paddingBottom += footerHeight;
					bottomposition += footerHeight;
					bottomposition_ref += footerHeight;
				}
				$('#favRefresh').addClass('show');
				$('#favRefresh').css('bottom', bottomposition_ref);
				$(this).css('padding-bottom', paddingBottom);
				toTopButton(bottomposition);
				console.log(haveRef, paddingBottom);
			} else {
				$('#favRefresh').removeClass('show');
				$('#favRefresh').css('bottom', defaultBottomHeight);
				var paddingBottom = 8 + 38;
				var bottomposition = 8;
				if (haveFooter && haveFooter_seen) {
					paddingBottom += 44;
					bottomposition += 44;
				}
				$(this).css('padding-bottom', paddingBottom);
				console.log(haveRef, paddingBottom);

				toTopButton(bottomposition);
			}
		}
	});

	function toTopButton(now) {
		$(window).scroll(function () {
			toTopButton_position(now, $(this));
		});
		$('.demoOnly_fixposition .n_container').scroll(function () {
			toTopButton_position(now, $(this));
		});
		$('.popup_overWrap').scroll(function () {
			toTopButton_position(now, $(this));
		});
	}

	function toTopButton_position(now, scrolldiv) {
		// 5 > for demo only, please ignore the demo and follow actual requirement
		if (scrolldiv.scrollTop() > 5) {
			$('#toTop').addClass('show');
			$('#toTop').css('bottom', now);
		} else {
			$('#toTop').removeClass('show');
			$('#toTop').css('bottom', defaultBottomHeight);
		}
	}
	$('#toTop').click(function () {
		$('html, body').animate(
			{
				scrollTop: 0,
			},
			1000,
		);

		$('.demoOnly_fixposition .n_container').animate(
			{
				scrollTop: 0,
			},
			1000,
		);
	});

	// Back to Top : Ref button=======//
	function RemoveClass() {
		$('#favRefresh i').removeClass('rotate-fwd');
	}
	$('#favRefresh').on('click', function () {
		$('#favRefresh i').addClass('rotate-fwd');
		setTimeout(RemoveClass, 1000);
	});

	//[SFCRQ - 3478][Euro] Sports Panel and Bottom Panel UX Change: start
	if (window.location.href.indexOf('virtual') === -1) {
		var last_scroll_top = 0;

		$(window).scroll(function () {
			var st = $(this).scrollTop();
			if (st > last_scroll_top) {
				$('body').addClass('navScroll').removeClass('navReset');
			} else {
				$('body').removeClass('navScroll').addClass('navReset');
			}

			last_scroll_top = st <= 0 ? 0 : st;
		});
		$('.demoOnly_fixposition .n_container').scroll(function () {
			var st = $(this).scrollTop();
			if (st > last_scroll_top) {
				$('body').addClass('navScroll').removeClass('navReset');
			} else {
				$('body').removeClass('navScroll').addClass('navReset');
			}

			last_scroll_top = st <= 0 ? 0 : st;
		});
	}
	//$(".popup_overWrap").scroll(function () {
	//    var st = $(this).scrollTop();
	//    if (st > last_scroll_top) {
	//        $("body").addClass("navScroll").removeClass("navReset");
	//    } else {
	//        $("body").removeClass("navScroll").addClass("navReset");
	//    }

	//    last_scroll_top = st <= 0 ? 0 : st;
	//});
	//[SFCRQ-3478][Euro] Sports Panel and Bottom Panel UX Change: end
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

/*-----------------------------bet placement: start-----------------------------------------*/
function blockBGscrolling(blockMe) {
	if (blockMe == true) {
		scrolling_disable(document.getElementsByClassName('pb_content')[0]);
		/* $("body").bind(
            'touchmove',
            function (e) {
                e.preventDefault();
            }
        ); */
		popupOn();
	} else {
		//$("body.euro").removeClass("popupOn");
		popupOff();
	}
}

function StartPlaceBet() {
	$('#loading').css('display', 'none');
	$('.pb_footer').css('display', '');
	$('.pb_footer').siblings('n_footer').hide();
	$('.pb_content').css('bottom', pb_footer_height);

	/* setTimeout(function () {
        $("#thistest").removeClass("handi");
        $("#thistest").addClass("handi change");
        $(".count").text($("#thistest").attr('class'));
        $("#testtest2").addClass("down");
    }, 2000);
 */

	/* SFCRQ-2150: Part 3/3: dynamic single wager: demo: starts*/
	if (shortContent) {
		//1. mock scenario for : 1 event only
		$('#single_short').find('.keypad_wrap').show();
		$('#sample_footer_input_single').hide();

		pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);
		$('.pb_content').css('bottom', pb_footer_height);
	}
	/* SFCRQ-2150:  Part 3/3: dynamic single wager: demo: end*/

	//$('.pb_content').scrollTop($('.pb_content')[0].scrollHeight);
	/*developer note: please don't use the animate method, no animation required, added for mock limitation only, thank you*/
	$('.pb_content').animate({
		scrollTop: $('.pb_content')[0].scrollHeight,
	});
}

function displayLoading_short() {
	$('#single').css('display', 'none');
	$('#single_short').css('display', '');

	/* SFCRQ-2150: Part 2/3: dynamic single wager: demo: starts*/
	var fixHeight = $(window).height() - 420;
	$('.footer_main').css('top', fixHeight);
	/* SFCRQ-2150: Part 2/3: dynamic single wager: demo: ends*/

	$('.pb_footer').css('display', '');
	$('.pb_footer').siblings('n_footer').hide();
	$('.pb_content').addClass('open');
	$('.n_footer').css('visibility', 'hidden');

	// for demo only
	$('body').css('pointer-events', 'none');

	setTimeout(function () {
		StartPlaceBet();
		$('.n_footer').css('visibility', '');
		$('body').css('pointer-events', '');
	}, 2000);
}
function displayLoading() {
	$('.pb_footer').css('display', '');
	$('.pb_footer').siblings('n_footer').hide();
	$('.pb_content').addClass('open');
	$('.n_footer').css('visibility', 'hidden');

	// for demo only
	$('body').css('pointer-events', 'none');

	setTimeout(function () {
		StartPlaceBet();
		//$("#single").css("display", "");
		$('.n_footer').css('visibility', '');
		$('body').css('pointer-events', '');

		//[DES-43][Narra][Tutorial Page] Recommended Correct Scores
		if (sessionStorage.getItem('enter_tutor_recCS') == 'yes') {
			$('body').addClass('rec_zIndex popupOn');
			$('#dont_copy_tutor_betslip').show();
			$('#tutor_rcd_bet').parent().css('position', 'relative');
			$('#tutor_rcd_bet').addClass('highlighted');
			$('#tutor_rcd_bet .rec_float, .details .dot_box, #dont_copy_link_to_tutor_betslip1').show();
			$('#sample_footer_pre_bet, .pb_footer').addClass('footer_overlay');
		}
	}, 2000);
}

// Recalculate Height
var showLoading = true;
var windowHeight = $(window).outerHeight();

/* SFCRQ-2150: Part 1/3: dynamic single wager: demo: set true for demo*/
var shortContent = false;

function calculateHeightSetting(transition) {
	notch_bottomgap = getComputedStyle(document.getElementsByClassName('pb_content')[0])
		.getPropertyValue('--sab')
		.replace(/[^-\d\.]/g, '');
	normal_footer_height = parseFloat(notch_bottomgap);
	pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);

	if (transition == true) {
		blockBGscrolling(true);
		if ($('#main_footer').hasClass('on')) {
			//open footer with animation
			if (shortContent) {
				displayLoading_short();
				showLoading = false;
			} else {
				if (showLoading == true) {
					displayLoading();
					showLoading = false;
				} else {
					StartPlaceBet();
				}
			}
		} else {
			//close footer with animation
			$('.pb_footer').css('display', 'none');
			$('.pb_footer').siblings('n_footer').show();
			setTimeout(function () {
				$('.footer_main').removeClass('transition');
				$('#main_footer').removeClass('on-transition');
			}, 400);
		}
	} else {
		blockBGscrolling(true);
		if ($('#main_footer').hasClass('on')) {
			$('.pb_footer').css('display', '');
			$('.pb_footer').siblings('n_footer').hide();
			$('.pb_content').css('bottom', pb_footer_height);
		} else {
			$('.pb_footer').css('display', 'none');
			$('.pb_footer').siblings('n_footer').show();
			$('.pb_content').css('bottom', normal_footer_height);
		}
	}
	if ($('.pb_content').outerHeight() < windowHeight * 0.5) {
		$('#combo_step1').css('max-height', '50vh');
	}
}

function reset_pb_default() {
	$('#sample_footer_status_bet').css('top', '');
	$('#sample_footer_post_bet').css('top', '');
	$('.pb_content').css('top', '');
	$('.betlist_input').removeClass('focus');
	$('.keypad_wrap').hide();
	// [DES-905]
	$('.bs_parlay_eu .keypad_wrap').show();
	// $(".bs_parlay_eu .betlist_input").removeClass("focus");
	$('.bs_parlay_eu .betlist_input').toggleClass('focus');
	$('.bs_parlay_eu.disabled .betlist_input').removeClass('focus');

	if (!shortContent) {
		$('.pb_content').css('top', '');
		$('.footer_main').css('top', '');
	}
}

function sample_footer_placebet() {
	// Toggle Keypad
	$('.betlist_input').on('click', function () {
		$(this).closest('.betlist_item').find('.keypad_wrap').toggle();
		$(this).closest('.betlist_item').find('.alert_msg').toggle();
		$(this).toggleClass('focus');
		calculateHeightSetting();
	});

	// Delete Item
	var singleCount = 5;
	$('.remove.icn').on('click', function () {
		$(this).closest('.betlist_item').addClass('animated fadeOutLeft');
		$(this)
			.closest('.betlist_item')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
				$(this).remove();
			});

		// sample demo: toggle to single selection only
		if ($(this).closest('.bet_item_wrap').is('#single')) {
			singleCount -= 1;
			if (singleCount == 1) {
				var fixHeight = $(window).height() - 420;
				$('.footer_main').css('top', fixHeight);
			}
		}
	});

	// Odds Change Notification
	$('.odds_change_actions .btn').on('click', function () {
		$('.odds_change_actions').hide();
		$('.pb_footer_actions.post').find('.pb_button').removeClass('disabled');
		/* for mock sample*/
		$(this).closest('.betlist_item').find('.down').removeClass('down');
		$(this).closest('.betlist_item').find('.arrow').hide();
		$(this).closest('.betlist_item').find('.failed').text('Bet Successful');
		$(this).closest('.betlist_item').find('.failed').addClass('success').removeClass('failed');
	});
}

function sample_footer_eventlisting() {
	var transition = false;
	var statusNOW = 'single';
	var notch_bottomgap = getComputedStyle(document.getElementsByClassName('footer_main')[0])
		.getPropertyValue('--sab')
		.replace(/[^-\d\.]/g, '');
	var normal_footer_height = parseFloat(notch_bottomgap);
	var pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);
	var firstload = true;

	$('#combo').hide();
	$('.options i').hide();
	$('.combo_details').hide();
	$('.pb_content .slider_wrap').css('top', $('.n_footer_combo').outerHeight());
	backtotop();

	// Toggle Keypad
	$('.betlist_input').on('click', function () {
		$(this).closest('.betlist_item').find('.keypad_wrap').toggle();
		$(this).closest('.betlist_item').find('.alert_msg').toggle();

		$(this).parent().parent().next('.keypad_wrap').toggle();
		$(this).toggleClass('focus');
		calculateHeightSetting();
	});

	// Click Show More In Combo Tab
	$('.showmore').click(function () {
		notch_bottomgap = getComputedStyle(document.getElementsByClassName('footer_main')[0])
			.getPropertyValue('--sab')
			.replace(/[^-\d\.]/g, '');
		$(this).parent().nextAll().toggle();
		$('.keypad_wrap').hide();
		$('.pb_footer_alert_msg').toggle();
		$('.showmore i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
		$('.showmore span').text() === 'Show less combo types' ? $('.showmore span').text('Show more combo types') : $('.showmore span').text('Show less combo types');
		calculateHeightSetting();
	});

	// Toggle Footer
	$('#demo_footer_background').on('click', function (e) {
		if (e.target !== this) {
			return;
		} else {
			$('.footer_main').addClass('transition');
			$('.n_footer_combo').parent().removeClass('on');
			$('#main_footer').removeClass('rec_zIndex');
			$('#demo_footer_background').hide();
			$('#demo_footer_background').removeClass('rec_zIndex');
			$('#sample_arrow_status i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
			reset_pb_default();
			calculateHeightSetting(true);
			$('#main_footer').css('top', '');
		}
	});

	$('.n_footer_combo').on('click', function (e) {
		if (e.target.closest('.info_wrp') || ($('#main_footer').hasClass('on') && e.target.closest('.nav_tab'))) {
			return;
		}

		// to display loading first, so set the bottom to zero.
		if (firstload == true) {
			$('.footer_main.v2').css('bottom', 0);
		}

		$('#main_footer').addClass('on-transition');

		setTimeout(function () {
			$('#main_footer').addClass('transition');
			$('#main_footer').toggleClass('on');
			$('#main_footer').removeClass('rec_zIndex');
			$('#demo_footer_background').toggle();
			$('#demo_footer_background').removeClass('rec_zIndex');
			$('#sample_arrow_status i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
			reset_pb_default();
			calculateHeightSetting(true);
		}, 100);
	});

	$('.icon_rec:not(#tutor_icon_rec)').on('click', function (e) {
		// to display loading first, so set the bottom to zero.
		if (firstload == true) {
			$('.footer_main.v2').css('bottom', 0);
		}

		$('#main_footer').show().addClass('on-transition');

		setTimeout(function () {
			$('#main_footer').addClass('transition');
			$('#main_footer').toggleClass('on rec_zIndex');
			$('#demo_footer_background').toggle();
			$('#demo_footer_background').toggleClass('rec_zIndex');
			$('#sample_arrow_status i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
			reset_pb_default();
			calculateHeightSetting(true);
		}, 100);
	});

	// Click Single Tab
	$('#btn_single').on('click', function () {
		if (!$(this).hasClass('disabled')) {
			statusNOW = 'single';
			console.log('statusNOW: ' + statusNOW);

			if (shortContent) {
				$('.pb_content').css('top', '');
				$('.footer_main').css('top', '');
				$('.footer_main').css('top', '');
			}

			$(this).siblings('.nav_tab').removeClass('active');
			$(this).addClass('active');
			$('#single').show();
			$('.pb_footer_details').show();
			$('#single').siblings('.bet_item_wrap').hide();
			$('.combo_details').hide();
			$('#parlay').hide();
			reset_pb_default();
			calculateHeightSetting();
		}
	});

	// Click Combo Tab
	$('#btn_combo').on('click', function () {
		if (!$(this).hasClass('disabled')) {
			statusNOW = 'combo';
			console.log('statusNOW: ' + statusNOW);

			if (shortContent) {
				$('.pb_content').css('top', '');
				$('.footer_main').css('top', '');
				$('.footer_main').css('top', '');
			}

			$(this).siblings('.nav_tab').removeClass('active');
			$(this).addClass('active');
			$('#combo, .combo_details, .pb_footer_details').show();
			$('#combo').siblings('.bet_item_wrap').hide();
			$('#combo_step_changed,  #combo_step_fail, #combo_step_success, #sample_footer_input_single, #single_placebet_ing').hide();
			reset_pb_default();
			calculateHeightSetting();
		}
	});

	$('#sample_footer_status_bet').on('click', function () {
		$('#sample_footer_post_bet').toggle();
	});

	$('#actions_step1 .pb_button').click(function () {
		console.log('statusNOW??? ' + statusNOW);
		if (statusNOW == 'combo') {
			statusNOW = 'combo_step2';
			$('#sample_footer_post_bet').show().addClass('sub');
			$('#sample_footer_post_bet').siblings('.n_footer_combo').hide();
			$('#sample_single_combo_text_switch').html('Combo Slip (3)<div class="info_wrp info_top"><div class="info_icn"><i class="icon-fi-info"></i></div><div class="info_txt">VND 1 displayed in UI is equivalent to VND 1000 in actual value.</div></div>');
			$('#nav_mybet_combo, #actions_step_combo, #combo_placebet_ing, .pb_footer_total_est, #sample_footer_status_bet, #combo_step_changed, #combo_odds_changed').show();
			$('#nav_mybet_single, .keypad_wrap, .pb_footer .alert_msg, #combo_step1, #combo_step_fail, #combo_step_success').hide();
			$('#actions_step_combo').siblings('.pb_footer_actions').hide();
			$('#combo_placebet_ing').siblings('.bet_item_wrap').hide();
			$('.betlist_input').removeClass('focus');
			$('.pb_content').css('top', $('#sample_footer_status_bet').outerHeight() + $('#sample_footer_post_bet').outerHeight());
			detectComboSub();
		} else {
			statusNOW = 'single';
			$('#sample_footer_post_bet').show().removeClass('sub');
			$('#sample_footer_post_bet').siblings('.n_footer_combo').hide();
			$('#sample_single_combo_text_switch').html('Single (1)<div class="info_wrp info_top"><div class="info_icn"><i class="icon-fi-info"></i></div><div class="info_txt">VND 1 displayed in UI is equivalent to VND 1000 in actual value.</div></div>');
			$('#nav_mybet_single, #actions_step2, #single_placebet_ing, .odds_change_actions, .pb_footer_total_est').show();
			$('#nav_mybet_combo, .keypad_wrap, .pb_footer_details, .pb_footer .alert_msg').hide();
			$('#actions_step2').siblings('.pb_footer_actions').hide();
			$('.betlist_input').removeClass('focus');
			$('#single_placebet_ing').siblings('.bet_item_wrap').hide();
			if ($('.odds_change_actions').is(':visible')) {
				$('.pb_footer_actions.post').find('.pb_button').addClass('disabled');
			}
			detectComboSub();
		}
		calculateHeightSetting();
	});

	// Pre Place Bet : Accept odds change
	$('#actions_step2 .pb_button').click(function () {
		console.log('statusNOW??? ' + statusNOW);
		if (statusNOW == 'combo') {
			statusNOW = 'combo_step2';
			$('#sample_footer_post_bet').show().addClass('sub');
			$('#sample_footer_post_bet').siblings('.n_footer_combo').hide();
			$('#nav_mybet_combo, #actions_step_combo, #combo_placebet_ing, .pb_footer_total_est, #combo_step_changed').show();
			$('#nav_mybet_single, .keypad_wrap, .pb_footer .alert_msg, #combo_step1').hide();
			$('#actions_step3').siblings('.pb_footer_actions').hide();
			$('#actions_step3 .pb_button').removeClass('disabled');
			$('#combo_placebet_ing').siblings('.bet_item_wrap').hide();
			$('.betlist_input').removeClass('focus');
			$('.pb_content').css('top', $('#sample_footer_status_bet').outerHeight() + $('#sample_footer_post_bet').outerHeight());
			$('#sample_footer_status_bet').show().html('The lines, odds or score of one or more of your selections has changed.');
			detectComboSub();
		} else {
			statusNOW = 'single_step2';
			$('#sample_footer_post_bet').show().removeClass('sub');
			$('#sample_footer_post_bet').siblings('.n_footer_combo').hide();
			$('#sample_single_combo_text_switch').html('Single (1)<div class="info_wrp info_top"><div class="info_icn"><i class="icon-fi-info"></i></div><div class="info_txt">VND 1 displayed in UI is equivalent to VND 1000 in actual value.</div></div>');
			$('#nav_mybet_single, #actions_step3, #single_placebet_ing, .odds_change_actions, .pb_footer_total_est').show();
			$('#nav_mybet_combo, .keypad_wrap, .pb_footer_details, .pb_footer .alert_msg').hide();
			$('#actions_step3').siblings('.pb_footer_actions').hide();
			$('.betlist_input').removeClass('focus');
			$('#single_placebet_ing').siblings('.bet_item_wrap').hide();
			if ($('.odds_change_actions').is(':visible')) {
				$('.pb_footer_actions.post').find('.pb_button').addClass('disabled');
			}
			detectComboSub();
		}
		calculateHeightSetting();

		//[DES-43][Narra][Tutorial Page] Recommended Correct Scores
		var placeBetHeight = $('.footer_main').outerHeight();
		var remainingHeight = $(window).height() - placeBetHeight;
		if (sessionStorage.getItem('enter_tutor_recCS') == 'yes') {
			$('body').addClass('rec_zIndex popupOn');
			$('#dont_copy_link_to_tutor_betslip2, #dont_copy_link_to_tutor_betslip2 .dot_box').show();
			$('#dont_copy_link_to_tutor_betslip2').css('height', remainingHeight);
			$('#dont_copy_link_to_tutor_betslip2').css('bottom', placeBetHeight);
			$('.footer_main').css('top', remainingHeight);
		}
	});

	$('#actions_step_combo .pb_button').click(function (e) {
		statusNOW = 'combo_step3';
		if ($(this).attr('class').includes('normal_btn')) {
			$('#combo_step_fail, #actions_step3').show();
			$('#combo_step_changed, #combo_odds_changed, #actions_step_combo').hide();
			$('#sample_footer_status_bet').html('<div>Bet successful<div class="info_wrp info_top"><div class="info_icn"><i class="icon-fi-info"></i></div><div class="info_txt">VND 1 displayed in UI is equivalent to VND 1000 in actual value.</div></div></div>');
		} else {
			$('#combo_step_success, #actions_step3').show();
			$('#combo_step_changed, #combo_odds_changed, #actions_step_combo').hide();
			$('#sample_footer_status_bet').html('<div>Bet successful<div class="info_wrp info_top"><div class="info_icn"><i class="icon-fi-info"></i></div><div class="info_txt">VND 1 displayed in UI is equivalent to VND 1000 in actual value.</div></div></div>');
		}
	});

	// Post Place Bet : Retain Selection or OK
	$('#actions_step3 .pb_button').click(function (e) {
		notch_bottomgap = getComputedStyle(document.getElementsByClassName('footer_main')[0])
			.getPropertyValue('--sab')
			.replace(/[^-\d\.]/g, '');
		console.log('statusNOW>>> ' + statusNOW);

		if (statusNOW == 'combo_step3') {
			statusNOW = 'combo_step4';
			$('#combo').show();
			$('#combo_step1').show();
			$('#combo_step_changed').hide();
		} else {
			statusNOW = 'single_step3';
			$('#single').show();
			$('#sample_footer_input_single').show();
		}
		$('#single_placebet_ing, #combo_placebet_ing, .pb_footer_total_est').hide();
		$('#sample_footer_pre_bet, #actions_step1').show();
		$('#sample_footer_pre_bet').siblings('.n_footer_combo').hide();
		$('#actions_step1').siblings('.pb_footer_actions').hide();
		$('#main_footer').toggleClass('on');
		$('#demo_footer_background').toggle();
		calculateHeightSetting(true);
		detectComboSub();
		betslip_rcd();
		//[DES-43][Narra][Tutorial Page] Recommended Correct Scores
		if (sessionStorage.getItem('enter_tutor_recCS') == 'yes') {
			$('body').removeClass('rec_zIndex popupOn');
			$('#dont_copy_link_to_tutor_betslip2, #dont_copy_link_to_tutor_betslip2 .dot_box').hide();
			$('#dont_copy_link_to_tutor_betslip2').css('height', '');
			$('#dont_copy_link_to_tutor_betslip2').css('bottom', '');
			$('.footer_main').css('top', '');
			sessionStorage.removeItem('enter_tutor_recCS');
		}
	});

	//SFSSR-7284: Combo bet count panel quickly disappear upon opening the floating panel
	function detectComboSub() {
		if ($('.n_footer_combo.sub').is(':visible')) {
			$('#main_footer').addClass('trans_comb');
		} else {
			$('#main_footer').removeClass('trans_comb');
		}
	}
}

/*-----------------------------bet placement: end-----------------------------------------*/
/*-----------------------------my bet: start-----------------------------------------*/
function sample_mybet_switch() {
	if ($('#sample_btn_active_bets').hasClass('active')) {
		$('#sample_open_active_bets').show();
		$('#sample_open_settle_bets').hide();

		if ($('#demomybet').is(':visible')) $('.bet_summary').show();
	} else {
		$('#sample_open_settle_bets').show();
		$('#sample_open_active_bets').hide();
		$('.bet_summary').hide();
	}
}

function sample_mybet() {
	sample_mybet_switch();
	$('.tab_nav_item').click(function () {
		$(this).addClass('active');
		$(this).siblings('.tab_nav_item').removeClass('active');

		var sampleHeaderTallHeight = 44; //dev side please use dynamic if possible
		var filterHeight = sampleHeaderTallHeight + $('#demo_test_menuheight').outerHeight();
		$('.n_menu_slider.n_sticky').css('top', sampleHeaderTallHeight);
		$('.filter_Bettrade.n_sticky').css('top', filterHeight);
		$('#sample_open_settle_bets .filter_group').css('top', filterHeight);
	});
	$('#sample_btn_active_bets, #sample_btn_settle_bets').click(function () {
		sample_mybet_switch();
	});

	$('.betslip_id_wrap').click(function () {
		//$(".smallpop_top").toggle();

		//[SFCRQ-2720][Euro View Mobile] To implement new handling for message pop up
		// $(this).parents(".msgPopCont").find(".msgPopWrp").show().delay(1000).queue(function (next) {
		//     $(this).parents(".msgPopCont").find(".msgPopWrp").hide();
		//     next();
		// });

		//[SFCRQ-4830][Main] To display "Wager ID has been copied!" on top of page (Open/Settled Bets)
		$('.smallpop_top').show();

		setTimeout(function () {
			$('.smallpop_top').hide();
		}, 1000);
	});

	$('.betslip_bottom_button.confirm').click(function () {
		$(this).parent().siblings('.popup_bettrade_wrap').show();
	});

	$('.bettrade_button.confirm').click(function () {
		var self = $(this);
		self.hide().siblings('.bettrade_button.in_progress').show();
		setTimeout(function () {
			self.siblings('.bettrade_button.in_progress').hide();
			self.siblings('.bettrade_button.failed').show();
			self.siblings('.bettrade_button.sold').show();
		}, 3000);
	});

	$('#close_mybet').click(function () {
		$('#demomybet').hide();
		$('.bet_summary').hide();
		$('.footer_main').show();
		popupOff();

		if ($('#demomybet').hasClass('demomybetPanel')) {
			$('#demomybet').removeClass('demomybetPanel');
			$('.footer_main').hide();
		}
	});
}
/*-----------------------------my bet: start-----------------------------------------*/

function fav_tutor_off() {
	$('.leftmenu_wrp').find('.bg_mask').css('display', 'none');
	$('.tutor_box').css('display', 'none');
	$('.highlighted_wrap_leftbox').css('display', 'none');
	$('.n_fav_on, .n_fav_off').removeClass('highlighted');
	$('.leftmenu_wrp').removeClass('tutor');
}

// sev content slider
function calc_shorter_sevSlider_width() {
	var sevSlider = $('#sev_content .n_sports_menu.thinner_slider');
	var sevSlider_Active = $('#sev_content .thinner_slider .item_wrap.active');
	var sevSlider_Active_item = $('#sev_content .thinner_slider .item_wrap.active .item');
	var pd_left = parseInt(sevSlider_Active_item.css('padding-left'));
	var pd_right = parseInt(sevSlider_Active_item.css('padding-right'));
	var total_padding = pd_left + pd_right;
	var width_no_padding = sevSlider_Active.width() - total_padding;
	var sevSlider_position = sevSlider_Active.offset().left - sevSlider.offset().left + sevSlider.scrollLeft() + pd_left;
	$('#sev_content .thinner_slider .slider').css('left', sevSlider_position);
	$('#sev_content .thinner_slider .slider').css('width', width_no_padding);

	$('#sev_content .thinner_slider .item_wrap').click(function () {
		$('#sev_content .thinner_slider .item_wrap').removeClass('active');
		$(this).addClass('active');
		var sevSlider_Active_item = $(this).find('.item');
		var pd_left = parseInt(sevSlider_Active_item.css('padding-left'));
		var pd_right = parseInt(sevSlider_Active_item.css('padding-right'));
		var total_padding = pd_left + pd_right;
		var width_no_padding = $(this).width() - total_padding;
		sevSlider_position = $(this).offset().left - sevSlider.offset().left + sevSlider.scrollLeft() + pd_left;
		$('#sev_content .thinner_slider .slider').css('width', width_no_padding);
		$('#sev_content .thinner_slider .slider').css('left', sevSlider_position);
		if ($(this).hasClass('ob_active')) {
			$('#sev_content .thinner_slider .slider').addClass('ob_active');
		} else {
			$('#sev_content .thinner_slider .slider').removeClass('ob_active');
		}
	});
}

function SnkScroll(outerDiv, innerDiv, leftArrow, rightArrow) {
	if ($(outerDiv).find(innerDiv).length === 0) {
		return;
	}
	var innerWidth = $(outerDiv).find(innerDiv)[0].scrollWidth;
	var outerWidth = $(outerDiv).width();
	var arrowWidth = $(outerDiv).find(leftArrow).width();
	var gap = innerWidth - (outerWidth - arrowWidth * 2) - 5;

	$(outerDiv).bind('touchmove', function () {
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

function sliderFunction(slider_id) {
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
	});
}

function calculateBalWidth() {
	$(document.documentElement).css('--nBalW', $('.n_balance').outerWidth() + 'px');
}

function playerTutorialEuro() {
	$('#demo_mock_trigger_player_tut_euro').click(function () {
		$('.ply_mask').show();
		$('.n_sev_item_content_wrap, .n_sports_menu, .n_sports_menu .slider').addClass('tut_ply');
		$(this).addClass('tut_ply');
		$('#favRefresh').hide();
		$('.sev_popup').css('overflow', 'hidden');
	});

	$('#demoOnly_tutorbtn_player').click(function () {
		$('.ply_mask').hide();
		$('.n_sev_item_content_wrap, .n_sports_menu, .n_sports_menu .slider').removeClass('tut_ply');
		$('#demo_mock_trigger_player_tut_euro').removeClass('tut_ply');
		$('#favRefresh').show();
		$('.sev_popup').css('overflow', '');
	});
}

function esportsTutorial() {
	$('#esports_tab').click(function () {
		$('.esports_mask, .esports_tut1').show();
		$('.euro .el_header_grp').addClass('esports_tut1');
		$(this).addClass('esports_tut1 dot_box highlighted');
		$('#menu_scroll').scrollLeft(580);
	});

	$('#esports_tab2').click(function () {
		$('.esports_mask, .esports_tut2, #esports_desc2').show();
		$('.sub_menu_panel').addClass('esports_tut2');
		$('#el_nav_slider').hide();
		$('.n_sports_menu_es').addClass('esports_tut2 dot_box highlighted');
	});

	$('#demoOnly_esports_btn').click(function () {
		$('.euro .el_header_grp').removeClass('esports_tut1');
		$('#esports_tab').removeClass('esports_tut1 dot_box highlighted');
		$('.sub_menu_panel').removeClass('esports_tut2');
		$('#el_nav_slider').show();
		$('.n_sports_menu_es').removeClass('esports_tut2 dot_box highlighted');
		$('.esports_mask, .esports_tut1, .esports_tut2, #esports_desc2').hide();
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
	$('.tut_tennis_btn').bind('click', function (event) {
		$('.n_container').addClass('tut_tennis');
		$('.tut_tennis_wrap').find('.tut_tennis_up').addClass('highlighted');
		$('.tut_tennis_mask.bg_mask').removeClass('bg_mask_hide');
		$('.tut_tennis_cont').removeClass('tut_tennis_cont_off');
		$('.tut_tennis_mask_btn.mask_button').removeClass(' tennis_msk_btn');
		event.stopPropagation();
	});

	$('.tennis_msk_btn').click(function () {
		$('.n_container').removeClass('tut_tennis');
		$('.tut_tennis_wrap').find('.tut_tennis_up').removeClass('highlighted');
		$('.tut_tennis_mask.bg_mask').addClass('bg_mask_hide');
		$('.tut_tennis_cont').addClass('tut_tennis_cont_off');
		$('.tut_tennis_mask_btn.mask_button').addClass(' tennis_msk_btn');
	});
}
// END [DES-970] Cyber Tennis Tutorial

function toggleSelect() {
	$('.filter_item')
		.off('click')
		.on('click', function () {
			$(this).find('.selectbox_title .betslip_arrow i').toggleClass('icon-fi-angle-down icon-fi-angle-up');
		});
}

function filterTutorial() {
	const ftTut1 = () => {
		$('.fltr_tut1, #demoOnlyFltrTutMsk').show();
		$('.fltr_tut1').closest('.lf_menu').addClass('highlighted dot_box fltr_tut');
		$('.fltr_tut1').closest('.n_header').addClass('fltr_tut');

		$('#fltrMskBtn1').on('click', () => {
			$('.fltr_tut1, #demoOnlyFltrTutMsk').hide();
			$('.fltr_tut1').closest('.lf_menu').removeClass('highlighted dot_box fltr_tut');
			$('.fltr_tut1').closest('.n_header').removeClass('fltr_tut');
			$('#demoOnlyFltrTutMsk2, .fltr_tut2').show();
			showLeftMenu();
			$('#demoOnlyOddsChangeColor').addClass('dot_box highlighted');
		});

		$('#fltrMskBtn2').on('click', () => {
			$('#demoOnlyFltrTutMsk2, .fltr_tut2').hide();
			$('#demoOnlyOddsChangeColor').removeClass('dot_box highlighted');
			hideLeftMenu();
		});
	};

	$('#demoOnlyFTTrigger').on('click', () => {
		ftTut1();
	});
}

function showLeftMenu() {
	$('.leftmenu_wrp').addClass('active');
	$('#demo_leftmenu').css('display', '');
	popupOn();
}

function hideLeftMenu() {
	popupOff();
	$('#demo_leftmenu').css('display', 'none');
	$('.leftmenu_wrp').removeClass('active');
}

function lbTut() {
	$('#mock_trigger_lb_tut').click(function () {
		$('.el_header_grp').addClass('lb_header_grp');
		$('#insights_tab').addClass('lb_tab');
		$('.lb_mask').show();
	});

	$('#demoOnly_lb_btn').click(function () {
		$('.el_header_grp').removeClass('lb_header_grp');
		$('#insights_tab').removeClass('lb_tab');
		$('.lb_mask').hide();
	});
}

// custom dropdown
function initSelectboxPopup(containerSelector) {
	var selectboxSelector = '.filter_group.n_sticky > .filter_item.selectbox_grp';
	var sortSelector = '.ob_sort_wrp';

	$(document)
		.off('click.initDropdown', selectboxSelector)
		.on('click.initDropdown', selectboxSelector, function (e) {
			if ($(e.target).closest('.ob_st_popup, select').length) {
				return;
			}

			var $filterItem = $(this);
			var $filter = $filterItem.closest('.filter_group.n_sticky');
			var $title = $filterItem.children('.selectbox_title');
			var $popup = $title.children('.ob_st_popup');
			var isOpening = !$popup.is(':visible');

			if (!$popup.length) {
				return;
			}

			$filter.children('.filter_item.selectbox_grp').not($filterItem).find('> .selectbox_title > .ob_st_popup').hide();

			$filter.children('.filter_item.selectbox_grp').not($filterItem).find('> .selectbox_title .betslip_arrow i').removeClass('fl_rotate');

			$popup.toggle(isOpening);
			$title.find('.betslip_arrow i').toggleClass('fl_rotate', isOpening);
		})
		.off('click.initDropdown', selectboxSelector + ' .ob_st_rw')
		.on('click.initDropdown', selectboxSelector + ' .ob_st_rw', function (e) {
			e.stopPropagation();

			var $row = $(this);
			var $title = $row.closest('.selectbox_title');

			$row.addClass('active').siblings('.ob_st_rw').removeClass('active');
			$title.children('.selectbox_titlerow').text($row.text());
			$title.children('.ob_st_popup').hide();
			$title.find('.betslip_arrow i').removeClass('fl_rotate');
		})
		.off('click.initDropdown', sortSelector)
		.on('click.initDropdown', sortSelector, function (e) {
			if ($(e.target).closest('.ob_st_popup').length) {
				return;
			}

			var $sort = $(this);
			var $popup = $sort.children('.ob_st_popup');
			var isOpening = !$popup.is(':visible');

			$('.ob_sort_wrp').not($sort).removeClass('active').children('.ob_st_popup').hide();

			$sort.toggleClass('active', isOpening);
			$popup.toggle(isOpening);
		})
		.off('click.initDropdown', sortSelector + ' .ob_st_rw')
		.on('click.initDropdown', sortSelector + ' .ob_st_rw', function (e) {
			e.stopPropagation();

			var $row = $(this);
			var $sort = $row.closest(sortSelector);

			$row.addClass('active').siblings('.ob_st_rw').removeClass('active');
			$sort.removeClass('active').children('.ob_st_popup').hide();
		})
		.off('click.initDropdown', '.bt_dpd_hdr')
		.on('click.initDropdown', '.bt_dpd_hdr', function () {
			$(this).next('.bt_dpd_body').stop(true, true).slideToggle(200);
			$(this).find('i').toggleClass('icon-fi-angle-up icon-fi-angle-down');
		});
}
