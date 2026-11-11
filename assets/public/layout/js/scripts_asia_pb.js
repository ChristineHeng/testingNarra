/*=============JS file for bet placement only============*/
//SFCRQ-2149: enable to see demo for short content
var shortContent = true;
// block background scrolling in mock
function blockBGscrolling(blockMe) {
	if (blockMe == true) {
		$('body').addClass('popupOn');
		scrolling_disable(document.getElementsByClassName('pb_wrap')[0]);
		$('body').bind('touchmove', function (e) {
			e.preventDefault();
		});
	} else {
		$('body').removeClass('popupOn');
	}
}

function StartPlaceBet() {
	$('.pb_wrap').removeClass('transition');

	/* Backup Only : Part 1/2 : ==== dev please ignore this, keep for backup only */
	/* dynamic single wager: demo: starts*/
	/* important note: to cater auto Height when betcount = 1*/
	/* 1. add css "top: auto" to .pb_wrap*/
	/* 2. get $(".pb_wrap.open").offset().top*/
	/* 3. assign back $(".pb_wrap.open").offset().top value to .pb_wrap (no1)  */

	/* $(".pb_wrap").css("top", "auto");
   
    setTimeout(function () {
        var temp_storeheight_offset = $(".pb_wrap.open").position();
        var temp_storeheight = temp_storeheight_offset.top;
        $(".pb_wrap").css("top", temp_storeheight);
    }, 100);  */
	/* dynamic single wager: demo: end*/
	$('#loading').css('display', 'none');
	$('.pb_footer').css('display', '');
	$('.pb_footer').siblings('n_footer').hide();
	$('.pb_wrap').css('bottom', pb_footer_height);
	$('.pb_wrap').addClass('open');

	//$('.pb_wrap').scrollTop($('.pb_wrap')[0].scrollHeight);
	/*developer note: please don't use the animate method, no animation required, added for mock limitation only, thank you*/
	if (sessionStorage.getItem('enter_tutor_recCS') === null) {
		$('.pb_wrap').animate({ scrollTop: $('.pb_wrap')[0].scrollHeight });
	}
}
function displayLoading() {
	/* SFCRQ-2149: Part 1/1: Only here: dynamic single wager: demo: starts, use 520px fix value: measurement from "single bet - singlet wager"*/
	if (shortContent) {
		$('#single_short').css('display', '');
		$('#single').css('display', 'none');
		var fixHeight = $(window).height() - 555;

		if (fixHeight < 70) {
			fixHeight = 70;
		}

		$('.pb_wrap').css('top', fixHeight);

		if ($('#sample_side_oddsPanel').hasClass('side_bar_shown')) {
			$('.pb_wrap').css('top', 0);
		}

		//[DES-43][Narra][Tutorial Page] Recommended Correct Scores
		if (sessionStorage.getItem('enter_tutor_recCS') == 'yes') {
			$('#single_short').css('display', 'none');
			$('#single').css('display', '');
			$('.pb_wrap').css('top', 70);
			$('#single .betlist_item').slice(3).hide();
			$('#single .betlist_item.total').show();
		}

		console.log('==============$(window).height(): ' + $(window).height());
		console.log('==============fixHeight: ' + fixHeight);
	}
	/* SFCRQ-2149:  Part 1/1: dynamic single wager: demo: end*/

	$('.pb_footer').css('display', '');
	$('.pb_footer').siblings('n_footer').hide();
	$('.pb_wrap').addClass('open');
	$('.n_footer').css('visibility', 'hidden');

	// for demo only
	$('body').css('pointer-events', 'none');

	if (sessionStorage.getItem('promotutorial') == 'step1') {
		StartPlaceBet();
		$('.n_footer').css('visibility', '');
		$('body').css('pointer-events', '');
		$('.pb_content').addClass('prm_pbc_mask');
		$('.prm_pb_mask').show();
		$('.pb_wrap.open').addClass('promo');
		$('.ftr_pb_msk').show();
		$('.pb_footer').addClass('prm_bet_mask');
	}

	$('#mock_cb_trigger_tutorial').click(function () {
		if (sessionStorage.getItem('enterCyberBattle') === 'true') {
			$('.pb_content').addClass('prm_pbc_mask');
			$('.prm_pb_mask').show();
			$('.pb_wrap.open').addClass('promo');
			$('.ftr_pb_msk').show();
			$('.pb_footer').addClass('prm_bet_mask');
		}
	});

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
			$('.betlist_item.total .pb_input_box').addClass('input_focus');
			$('.pb_footer').addClass('footer_overlay');
			$('.pb_footer .pb_button').addClass('disabled');
		}
	}, 2000);
}

// Recalculate Height
var showLoading = true;
function calculateHeightSetting(transition) {
	notch_bottomgap = getComputedStyle(document.getElementsByClassName('pb_wrap')[0])
		.getPropertyValue('--sab')
		.replace(/[^-\d\.]/g, '');
	normal_footer_height = $('.n_footer').outerHeight() - parseFloat(notch_bottomgap);
	pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);

	if (transition == true) {
		if ($('#main_footer').hasClass('on')) {
			//open footer with animation
			if (showLoading == true) {
				displayLoading();
				showLoading = false;
				//StartPlaceBet();
			} else {
				StartPlaceBet();
			}
			blockBGscrolling(true);

			//wh: add for demo: open with animation
			$('.pb_wrap').show();
			$('.pb_footer').show();

			$('.pb_wrap').addClass('transition');
			$('.pb_footer').addClass('transition');

			setTimeout(function () {
				$('.pb_wrap').removeClass('close');
				$('.pb_footer').removeClass('close');
				$('.pb_wrap').addClass('open');
				$('.pb_footer').addClass('open');
			}, 50);
			setTimeout(function () {
				$('.pb_wrap').removeClass('transition');
				$('.pb_footer').removeClass('transition');
			}, 100);
		} else {
			$('.pb_wrap').addClass('transition');
			$('.pb_footer').addClass('transition');

			//wh: add for demo: close with animation\
			setTimeout(function () {
				$('.pb_wrap').addClass('close');
				$('.pb_wrap').removeClass('open');
				$('.pb_footer').siblings('n_footer').show();
				$('.pb_wrap').css('bottom', normal_footer_height);
			}, 5);
			setTimeout(function () {
				$('.pb_footer').addClass('close');
				$('.pb_footer').removeClass('open');
			}, 10);
			setTimeout(function () {
				$('.pb_wrap').removeClass('transition');
				$('.pb_wrap').hide();

				$('.pb_footer').removeClass('transition');
				$('.pb_footer').hide();
			}, 100);
			blockBGscrolling(false);
		}
	} else {
		blockBGscrolling(true);
		if ($('#main_footer').hasClass('on')) {
			$('.pb_footer').css('display', '');
			$('.pb_footer').siblings('n_footer').hide();
			$('.pb_wrap').css('bottom', pb_footer_height);
		} else {
			$('.pb_footer').css('display', 'none');
			$('.pb_footer').siblings('n_footer').show();
			$('.pb_wrap').css('bottom', normal_footer_height);
		}
	}
	$('.pb_wrap').removeClass('scroll_up');
}

$(document).ready(function () {
	var transition = false;
	var statusNOW = 'single';
	var notch_bottomgap = getComputedStyle(document.getElementsByClassName('pb_wrap')[0])
		.getPropertyValue('--sab')
		.replace(/[^-\d\.]/g, '');
	var normal_footer_height = $('.n_footer').outerHeight() + parseFloat(notch_bottomgap) - 2;
	var pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);
	var firstload = true;

	$('#combo').hide();
	$('#acceptodds_options .icon-fi-options').show();
	$('.combo_details').hide();
	$('.pb_wrap').css('bottom', normal_footer_height);
	$('.pb_content .slider_wrap').css('top', $('.n_footer_combo').outerHeight());
	$('.slider').not('.mr_slider .slider, .ob_menu_slider .slider').css('left', 0);
	// .thinner_slider slide width will not stay at left when document on load
	var thinner_slider = $('.DontCopy_test_sev_filter_menu .item_wrap.active .item');
	var pd_left = parseInt(thinner_slider.css('padding-left'));
	$('.thinner_slider .slider').css('left', pd_left);
	//$(".pb_wrap").hide();

	//wh: add for demo: set default position for animation
	$('.pb_wrap').css('bottom', normal_footer_height);
	$('.pb_wrap').addClass('close').hide();

	//$(".n_footer_combo.clone").css("bottom", normal_footer_height);
	// alert(":notch_bottomgap : " + notch_bottomgap);
	// alert(":normal_footer_height : " + normal_footer_height);

	backtotopv2();

	if (sessionStorage.getItem('promotutorial') == 'step1') {
		$('#main_footer').addClass('on');
		calculateHeightSetting(true);
	}

	// Toggle Combo Panel in Footer: Open
	$('.n_footer_combo.clone').on('click', function (e) {
		if (e.target.closest('.mask_button')) {
			return;
		}
		pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);
		//$(".pb_wrap").show();
		$(this).hide();

		// to display loading first, so set the bottom to zero.
		if (firstload == true) {
			$('.pb_wrap').css('bottom', 0);
		}
		$(this).parent().addClass('on');
		$('.footer_arrow i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');

		calculateHeightSetting(true);

		if (localStorage.getItem('isCyberBattle') === 'true') {
			const replaceVsInTextNodes = (root) => {
				root.querySelectorAll('span').forEach((sp) => {
					if (sp.textContent.trim().toLowerCase() === 'vs') sp.textContent = ' - ';
				});

				const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
				const nodes = [];
				while (walker.nextNode()) nodes.push(walker.currentNode);

				nodes.forEach((n) => {
					n.nodeValue = n.nodeValue.replace(/\s+vs\s+/g, ' - ');
				});
			};

			document.querySelectorAll('.betlist_item').forEach(replaceVsInTextNodes);
		}
	});
	$('.chat_bet_btn:not(.demoOnlyUncleBorisError), .chat_bet_desc .odds_box').click(function () {
		// clone from $(".n_footer_combo.clone").on("click", function () { });
		pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);

		// to display loading first, so set the bottom to zero.
		if (firstload == true) {
			$('.pb_wrap').css('bottom', 0);
		}
		$('.n_footer_combo.clone').parent().addClass('on');
		$('.footer_arrow i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
		calculateHeightSetting(true);
		$('.footer_main').addClass('chat_placebet');
	});

	$('.icon_rec:not(#tutor_icon_rec)').on('click', function () {
		pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);
		// to display loading first, so set the bottom to zero.
		$('.n_footer_combo.clone').hide();
		if (firstload == true) {
			$('.pb_wrap').css('bottom', 0);
		}
		$('.footer_main').addClass('on rec_zIndex');
		$('.footer_arrow i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
		calculateHeightSetting(true);
	});

	// Toggle Combo Panel in Footer: Close
	$('.pb_wrap .n_footer_combo').on('click', function (e) {
		if (e.target.closest('.info_wrp')) {
			return;
		}

		pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);

		$(this).parent().parent().removeClass('on rec_zIndex');
		$('.footer_arrow i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');

		//$(".pb_wrap").hide();

		$('.n_footer_combo.clone').show();

		calculateHeightSetting(true);
		$('.footer_main').removeClass('chat_placebet');
		if ($('.chat_frame').hasClass('open')) {
			$('body').addClass('popupOn');
		}
	});

	// Toggle Keypad
	$('.pb_input_wrp .pb_input_box').on('click', function () {
		if (!$(this).closest('.betlist_item').hasClass('disabled')) {
			$(this).closest('.bet_item_content').find('.keypad_wrap').show();
			$(this).closest('.bet_item_content').find('.alert_msg').toggle();
			$(this).addClass('input_focus');
		}
	});

	// Delete Item
	$('.remove.icn').on('click', function () {
		$(this).closest('.betlist_item').addClass('animated fadeOutLeft');
		$(this)
			.closest('.betlist_item')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
				$(this).remove();
			});
	});

	// Odds Change Notification
	$('.odds_change_actions .btn').on('click', function () {
		$('.odds_change_actions').hide();
		$('.pb_footer_actions.post').find('.pb_button').removeClass('disabled');
		/* for mock sample*/
		$(this).closest('.bet_item_content').find('.down').removeClass('down');
		$(this).closest('.bet_item_content').find('.arrow').hide();
		$(this).closest('.bet_item_content').find('.failed').text('投注成功，投注编号：2011171304363306');
		$(this).closest('.bet_item_content').find('.failed').addClass('success').removeClass('failed');

		//[DES-43][Narra][Tutorial Page] Recommended Correct Scores
		var placeBetHeight = 292; //sample only, don't copy this value

		if (sessionStorage.getItem('enter_tutor_recCS') == 'yes') {
			$('body').addClass('rec_zIndex popupOn');
			$('#single_placebet_ing .betlist_item').slice(1).hide();
			$('#dont_copy_link_to_tutor_betslip2').show().css('height', placeBetHeight);
			$('.pb_wrap').css('top', placeBetHeight);
		}
	});

	// Odds Change Notification : Click To Accept
	$('#actions_step2 #button_demoonly_accept').click(function () {
		$('#actions_step3').show();
		$('#actions_step2').hide();
		$('#actions_step1').hide();
		$('#combo_step2 .alert_msg').hide();
		$('#combo_step2 .betstatus.success').show();
		calculateHeightSetting();
	});

	// Slider for Single And Combo Tab
	$('.slider_wrap .tab_nav_item').on('click', function () {
		if (!$(this).hasClass('disabled')) {
			$(this).siblings('.tab_nav_item').removeClass('active');
			$(this).addClass('active');
			var test_slider_position = $(this).offset().left;
			localStorage.getItem('webcyberbattle') === 'true' ? $('.slider').css('left', test_slider_position - $('.cb_main').offset().left) : $('.slider').css('left', test_slider_position);
		}
	});

	// Click Single Tab
	$('#btn_single').on('click', function () {
		if (!$(this).hasClass('disabled')) {
			statusNOW = 'single';
			console.log('statusNOW: ' + statusNOW);

			$('#single').show();
			$('#single_short').hide();
			$('#single').siblings('.bet_item_wrap').hide();
			// $('.icon-fi-options').hide();
			$('.combo_details').hide();
			$('.combo_details #combo_step2').hide();
			$('.combo_details #combo_step1').hide();
			$('#parlay').hide();
			calculateHeightSetting();
		}
	});

	// Click Combo Tab
	$('#btn_combo').on('click', function () {
		if (statusNOW != 'combo') {
			statusNOW = 'combo';
			console.log('statusNOW: ' + statusNOW);

			$('#combo').show();
			$('#combo').siblings('.bet_item_wrap').hide();

			$('.icon-fi-options').show();
			$('.combo_details').show();
			calculateHeightSetting();
		}
	});

	// Click parlay Tab [DES-905]
	// hide parlay Tab [DES-1292]
	// $("#btn_parlay").on("click", () => {
	//     console.log("click!");
	//     if (statusNOW != "parlay") {
	//         statusNOW = "parlay"

	//         $(".icon-fi-options").hide()
	//         $(".combo_details").hide()
	//         // [DES-905]
	//         $("#parlay").show()
	//         $("#parlay").siblings(".bet_item_wrap").hide()
	//         // END [DES-905]
	//         calculateHeightSetting()
	//     }
	// });

	const obTutTrigger3 = () => {
		pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);

		$('.n_footer_combo.clone').hide();
		$('.pb_wrap').show().toggleClass('close open').css('overflow', 'hidden');
		$('.loading_item').hide();
		$('#obTut3, #obTutMsk3, #obTutMsk3a').show();
		$('#actions_step1 .pb_button .pb_seperator, #actions_step1 .pb_button .pb_fb_itm:nth-child(3)').hide();
		$('.n_footer_combo.clone').parent().addClass('on');
		$('.footer_arrow i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
		calculateHeightSetting();
		$('#parlay').show();
		$('#parlay').siblings('.bet_item_wrap').hide();
		$('#btn_parlay').addClass('active').siblings().removeClass('active');
		$('.slider').css('left', $('#btn_parlay').offset().left);
		$('.tab_nav_3').addClass('highlighted');
		if ($('body').hasClass('fl')) {
			$('.tutorialMockNewArrow').show();
		} else {
			$('.tutorialMockOldArrow').show();
		}
	};

	const obtutClose = () => {
		window.location.reload();
		sessionStorage.setItem('ob_p2', 'end');
		sessionStorage.removeItem('ob_p1');
		sessionStorage.removeItem('ob_p2');
	};
	sessionStorage.getItem('ob_p2') == 'false' && obTutTrigger3();
	$('#obTutBtn3').click(() => obtutClose());

	// Click Show More In Combo Tab
	$('.showmore').click(function () {
		notch_bottomgap = getComputedStyle(document.getElementsByClassName('pb_wrap')[0])
			.getPropertyValue('--sab')
			.replace(/[^-\d\.]/g, '');

		if (statusNOW == 'combo_step2') {
			$('.combo_details #combo_step1').hide();
			$('.combo_details #combo_step2').toggle();
		} else if (statusNOW == 'combo') {
			$('.combo_details #combo_step2').hide();
			$('.combo_details #combo_step1').toggle();
		}

		$('.pb_wrap').css('bottom', $('.pb_footer').outerHeight() - notch_bottomgap);
	});

	// Accept Odds Options In Combo Tab
	$('#acceptodds_options').click(function () {
		// if (statusNOW == 'combo' || statusNOW == 'combo_step2') {
		// 	$('#acceptodds_options_popup').css('display', '');
		// 	$('body').addClass('popupOn');
		// 	$('body').bind('touchmove', function (e) {
		// 		e.preventDefault();
		// 	});
		// }

		$('#acceptodds_options_popup').css('display', '');
		$('body').addClass('popupOn');
		$('body').bind('touchmove', function (e) {
			e.preventDefault();
		});
	});

	// Combo Popup Tutorial
	$('.icn_combo').click(function () {
		$('#combo_pop_tutorial').css('display', '');
		$('body').addClass('popupOn');
		$('body').bind('touchmove', function (e) {
			e.preventDefault();
		});
	});

	// Pre Place Bet : Click to Place Bet
	$('#actions_step1 .pb_button').click(function () {
		console.log('statusNOW??? ' + statusNOW);

		if (statusNOW == 'combo' || statusNOW == 'combo_step2') {
			statusNOW = 'combo_step2';

			$('#actions_step1').hide();
			$('#actions_step2').show();

			$('#combo_placebet_ing').show();
			$('#combo_placebet_ing').siblings('.bet_item_wrap').hide();

			$('#combo_step2').show();
			$('#combo_step1').hide();
			$('#combo_step2 .alert_msg').show();
			$('#combo_step2 .betstatus.success').hide();

			$('#btn_single').addClass('disabled');
		} else {
			statusNOW = 'single_step2';
			$('#actions_step3').show();
			$('#actions_step1').hide();

			$('#single_placebet_ing').show();
			$('#single_placebet_ing').siblings('.bet_item_wrap').hide();

			$('#btn_combo').addClass('disabled');
			$('.pb_footer_details').hide();

			if ($('.odds_change_actions').is(':visible')) {
				$('.pb_footer_actions.post').find('.pb_button').addClass('disabled');
			}
		}
		$('#pb_status_demo_only').html('(投注中)');
		calculateHeightSetting();
	});

	// Post Place Bet : Retain Selection or OK
	$('#actions_step3 .pb_button').click(function () {
		notch_bottomgap = getComputedStyle(document.getElementsByClassName('pb_wrap')[0])
			.getPropertyValue('--sab')
			.replace(/[^-\d\.]/g, '');

		$('.combo_details .bet_item_wrap').hide();
		//$(".pb_wrap").css("top", 80);
		$('.pb_footer').siblings('n_footer').show();
		$('.pb_wrap').removeClass('open').addClass('close').hide();
		$('.pb_footer').removeClass('open').addClass('close').hide();
		$('.pb_wrap').css('bottom', normal_footer_height - notch_bottomgap);
		$('.pb_wrap .n_footer_combo').parent().parent().toggleClass('on');
		$('#pb_status_demo_only').html('余额 RMB 1500.00 &nbsp;<i class="icon-fi-arrow-up1 "></i>');

		/* reset all to step1*/
		$('#combo_step1, #actions_step1').show();
		$('#combo_step2, #actions_step2').hide();
		$('#combo_step2, #actions_step3').hide();

		$('#single, #combo').show();
		$('#single_short').hide();
		$('#single_placebet_ing, #combo_placebet_ing').hide();
		$('#btn_single, #btn_combo').removeClass('disabled');

		calculateHeightSetting();
		betslip_rcd();
		sidemenu_close();

		//[DES-43][Narra][Tutorial Page] Recommended Correct Scores
		if (sessionStorage.getItem('enter_tutor_recCS') == 'yes') {
			$('body').removeClass('rec_zIndex popupOn');
			$('#single_placebet_ing .betlist_item').show();
			$('#dont_copy_link_to_tutor_betslip2').hide().css('height', '');
			$('.pb_wrap').css('top', '');
			sessionStorage.removeItem('enter_tutor_recCS');
		}

		$('.footer_main').removeClass('chat_placebet');
	});

	/*===================tutorial==============================*/
	/*  if ($('body').hasClass('tutor')) {
         $("#link_tutorial_placebet").appendTo(".pb_wrap");
         $(".pb_content").show();
         $(".pb_content").not("#link_tutorial_placebet").hide();
         $(".n_footer_combo.v2").find(".count").text("0");
 
         $("#sample_step1").click(function () {
             $(".n_footer_combo.v2").find(".count").text("1");
         });
 
         $("#sample_step2").click(function () {
             $(".n_footer_combo.v2").find(".count").text("2");
         });
     } */

	function el() {
		if ($('body').hasClass('el')) {
			$('#sample_step3').on('click', function () {
				$('body').toggleClass('el pb');
				pb();
				$(this).hide();
				$('.el_info').hide();

				// Toggle Combo Panel in Footer: Open
				pb_footer_height = $('.pb_footer').outerHeight() - parseFloat(notch_bottomgap);
				$('.pb_wrap').show();
				$('.n_footer_combo.clone').hide();
				$('.n_footer_combo.clone').parent().addClass('on');
				$('.footer_arrow i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
				showLoading = false;
				calculateHeightSetting(true);

				var containerH = $('.pb_wrap').outerHeight();
				var n_footer_comboH = $('.n_footer_combo').outerHeight();
				var tabNav = $('#link_tutorial_placebet .tab_nav').outerHeight();
				var pb_contentH = $('#link_tutorial_placebet').outerHeight();
				var resultH = containerH - n_footer_comboH - tabNav;

				if (pb_contentH > resultH) {
					$('.pb_wrap').addClass('tutor_stickB');
				} else {
					$('.pb_wrap').removeClass('tutor_stickB');
				}
			});
		}
	}

	function pb() {
		if ($('body').hasClass('pb')) {
			$('.n_footer_combo').removeClass('highlighted dot_tb');
			$('.tab_nav').addClass('highlighted dot_tb');
			$('.tab_nav .mask_text').show();

			setTimeout(function () {
				$('.betlist_item.total').addClass('highlighted');
				$('.betlist_item.total .mask_text').show();
			}, 500);

			setTimeout(function () {
				$('.pb_button').addClass('highlighted');
				$('.pb_button .mask_text').show();
				/*tutorial used only (part 6/6): start*/
				/* $('.pb_button').append('<div class="mask_text">Klik di sini untuk bertaruh</div>'); */
				/*tutorial used only (part 6/6): end*/
			}, 1000);

			setTimeout(function () {
				$('#sample_step4').show();
				$('#sample_step4').click(function () {
					//window.location.replace("el-prof-soccer-today.html");
					window.location.href = 'el-prof-soccer-live.html';
				});
			}, 1500);
		} else {
			$('.n_footer_combo').addClass('highlighted dot_tb');
			$('.tab_nav').removeClass('highlighted dot_tb');
			$('.betlist_item.total').removeClass('highlighted');
			$('.pb_button').removeClass('highlighted');
			$('#sample_step4').hide();
		}
	}
	//el();

	var lastScrollTop = 0;
	$('.pb_wrap').scroll(function () {
		var pbHeight = ($(window).height() - $(this).find('.pb_content .tab_nav').offset().top - $(this).find('.pb_content .tab_nav').height() - ($(window).height() - $('.n_footer.pb_footer').offset().top)) * 0.5;
		var st = $(this).scrollTop();
		if (st > lastScrollTop && st > pbHeight) {
			$(this).removeClass('scroll_up');
		} else if (st < lastScrollTop && st < pbHeight) {
			$(this).addClass('scroll_up');
		}
		lastScrollTop = st;
	});

	$('.radioItm').click(function () {
		if (!$(this).hasClass('active')) {
			$('.radioItm').removeClass('active');
			$(this).addClass('active');
		}
	});

	$('#demoOnly_pb_promo_mask').click(function () {
		sessionStorage.setItem('promotutorial', 'step2');
		$('.pb_content').removeClass('prm_pbc_mask');
		$('.prm_pb_mask').hide();
		$('.pb_wrap.open').removeClass('promo');
		$('.ftr_pb_msk').hide();
		window.location.href = 'index.html';
		$('.pb_footer').removeClass('prm_bet_mask');
	});

	stakeMultiplier();

	//bet slip popup height with short and long content
	// to fix: Uncaught TypeError: $(...).on(...) is not a function, wrap it in a DOM-ready function: $(function() {});
	$(function () {
		$('.betslip_popup').click(function (e) {
			var shortViewHeight = $(window).height() - 555;
			var highViewHeight = 70;

			if ($(this).text() === 'High') {
				$('.pb_wrap').css('top', highViewHeight);
				$(this).text('Short');
			} else {
				$('.pb_wrap').css('top', shortViewHeight);
				$(this).text('High');
			}
			e.stopPropagation();
		});
	});

	localStorage.getItem('isCyberBattle') === 'true' && localStorage.getItem('theme') === 'default1' && $('.fl_loading_wrp').addClass('cb_gradient_load_ring').find($('.fl_load_ring > div:last-child')).show();
});

function ssPlaceBet() {
	setTimeout(function () {
		$('#mock_ss_bet_add, .ss_tml_btn').on('click', function () {
			if ($(this).hasClass('disabled')) return;
			$(this).addClass('add');
			$('.pb_wrap').css('bottom', 0);
			pb_footer_height = $('.pb_footer').outerHeight();
			$('.n_footer_combo.clone').parent().addClass('on');
			$('.footer_arrow i').toggleClass('icon-fi-arrow-down1 icon-fi-arrow-up1');
			calculateHeightSetting(true);
		});
	}, 100);

	$('#mock_ss_bet_error_count').on('click', function () {
		$('#demoOnlyBetCount.smallpop').show();
		setTimeout(function () {
			$('#demoOnlyBetCount.smallpop').hide();
		}, 3000);
	});

	$('#mock_ss_bet_error_unavailable').on('click', function () {
		$('#demoOnlyUnvailable.smallpop').show();
		setTimeout(function () {
			$('#demoOnlyUnvailable.smallpop').hide();
		}, 3000);
	});
}
