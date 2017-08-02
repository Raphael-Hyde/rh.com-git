/*-----------------------------------------------------------------------------------

 	Script - All Custom frontend jQuery scripts & functions
 
-----------------------------------------------------------------------------------*/
(function(){
'use strict';

/* do animations if element is visible
------------------------------------------------*/
function animateOnScroll(pagestart) {
	
	/* portfolio animations */
	if (jQuery('.portfolio-animation').length > 0) {
		jQuery('.portfolio-container.portfolio-animation .portfolio-item').not('.animated')
		.filter(function(i, d) {
			return  jQuery(d).visible(true);
		}).each(function(i) {
			var thisItem = jQuery(this);
			//if (this)
			if (jQuery(window).width() > 1024 && !thisItem.hasClass( "animated" )) { 
				var delay = i*150 + 100;  // + 100 is to add a small delay
				if (pagestart && thisItem.data('startposition')) { delay = parseInt(thisItem.data('startposition')) * 200; }
				thisItem.delay(delay).queue(function(){thisItem.addClass('animated'); });
			}
		});
	}
	
	/* hero-animation  */
	jQuery('#hero.hero-animation').not('.animated').addClass('animated');
	
	/* text-animations  */
	if (jQuery('.text-animation').length > 0) {
		jQuery('.text-animation').not('.animated')
		.filter(function(i, d) {
			return  jQuery(d).visible(true);
		}).each(function(i) {
			var thisItem = jQuery(this);
			if (jQuery(window).width() > 1024 && !thisItem.hasClass( "animated" )) { 
				var delay = i*100;
				thisItem.delay(delay).queue(function(){thisItem.addClass('animated');});
			}
		});
	}
	
	/* text-animations  */
	if (jQuery("[class*='do-anim']").length > 0) {
		jQuery("[class*='do-anim']").not('.animated')
		.filter(function(i, d) {
			return  jQuery(d).visible(true);
		}).each(function(i) {
			var thisItem = jQuery(this);
			var delay = i*200 + 100;  // + 150 is to add a small delay
			thisItem.delay(delay).queue(function(){thisItem.addClass('animated');});
		});
	}
	
	
	/* infinite Load for isotope  */
	if( jQuery().isotope ) { 
		jQuery(".load-isotope:not(.loading):not(.disabled) > a[data-method='infiniteload']")
		.filter(function(i, d) {
			return  jQuery(d).visible(false);
		}).each(function() {
			console.log("visible");
			jQuery(this).trigger( "click" );
		});
	}
					
}


/* header Features ()
------------------------------------------------*/
function headerFeatures() {
	
	/* Add small-header class if scrolled */
	if (jQuery(window).scrollTop() > 50) { jQuery("header:not(.not-sticky):not(.transparent):not(.small-header)").addClass("small-header");	
	} else { jQuery("header.small-header:not(.not-sticky):not(.transparent)").removeClass("small-header"); }
	
	/* Add hero-invisible as soon as it's out of the viewport */
	if (jQuery( window ).scrollTop() + 70 > jQuery("#hero").height()) { jQuery('header:not(.not-sticky)').addClass("hero-invisible");
	} else { jQuery('header').removeClass("hero-invisible"); }
	
	/* Show Hide back to top arrow */
	if (jQuery(window).scrollTop() > jQuery(window).height()) { jQuery( '#backtotop' ).addClass("visible");	
	} else { jQuery( '#backtotop' ).removeClass("visible"); }
	
}


/* misc features which need to be regenerated on resize
------------------------------------------------*/
function resizeAdapt() {
	
	/* - Hero / Pagetitle (if pagetitle is taller than hero) - */
	if (jQuery(".hero-full #page-title").length > 0 || jQuery(".hero-big #page-title").length > 0) {
		var hero = jQuery("#hero");
		var pageTitle = jQuery("#hero #page-title");
		var headerHeight = 0;
		if (jQuery("header").hasClass("transparent")) { headerHeight = jQuery("header").height(); } 
		var pageTitleHeight = pageTitle.outerHeight() + parseInt(pageTitle.css('marginTop'),10);
		if (pageTitleHeight+(headerHeight/2) > hero.outerHeight()) {
			var addHeight = headerHeight/2;
			if (pageTitle.hasClass("title-top")) { addHeight = 0; }
			hero.css('height',pageTitleHeight+addHeight-2+'px'); // -2 is for prevend jumping
			pageTitle.addClass('push-bottom');
		} else  {
			hero.css('height','auto');
			pageTitle.removeClass('push-bottom');
		}
	}
	
	/* detach sticky col  */
	if(jQuery().stick_in_parent && jQuery(window).width() < 769) {
		jQuery(".col-sticky").trigger("sticky_kit:detach");
	}
}

/* isotope load more function
------------------------------------------------*/
function isotopeLoadMore(grid,el,url,datas) {
	
	el.parent(".load-isotope").addClass('loading');
	
	if (url === '#' || !url) { url = srvars.ajaxurl }
	var addData = ''; if (datas) { addData = { action:'sr_load_more', o:datas }; }
	jQuery.ajax({
			type:'POST',			// this might lead to issues for html template
			url:url,
			data: addData,
			dataType:"html",
			error: function () {
				el.parent(".load-isotope").addClass("disabled");	
			},
			success: function(response) { 
				//console.log(response);
				if (response) {
					setTimeout(function(){ 
						var items = jQuery( jQuery(response).find('#'+grid.attr('id')).html());
						items.imagesLoaded(function(){
							grid.append( items ).isotope( 'appended', items);
							animateOnScroll(false);
							// init video bg for appended items
							if(jQuery().phatVideoBg) { grid.find('.videobg-section').phatVideoBg(); }
						});
						el.parent(".load-isotope").removeClass('loading');
					},500);
				} else {
					el.parent(".load-isotope").addClass("disabled");	
				}
			}
	});
	
}


jQuery(window).load(function() {	
	
	
	/*---------------------------------------------- 
				S M O O T H   S H O W    (pageloader)
	------------------------------------------------*/
	jQuery("body").addClass("loaded");
	setTimeout(function(){
		jQuery("body").addClass("loading-end");
		animateOnScroll(true);
		headerFeatures();
		
		/* trigger filter if hashtag is active
		------------------------------------------------*/
		if(window.location.hash) {
		  	var filter = window.location.hash.substr(1);
			if ( jQuery('.filter li a[data-slug='+filter+']').length > 0) {
				/*setTimeout(function(){ */jQuery('.filter li a[data-slug='+filter+']').trigger( "click" );/* }, 500);*/
			}
		} 
		
	}, 1500);
	
	
	/*---------------------------------------------- 
				   S M A R T   S C R O L L
	------------------------------------------------*/
	if(jQuery().smartscroll) { 
		jQuery(".smartscroll-grid").smartscroll({
			offsettop: "#pseudo-header"
		});
	}
	
	
	/*---------------------------------------------- 
			   R E S P O N S I V E   N A V
	------------------------------------------------*/
	jQuery('header').on("click", ".menu-toggle", function() {
		// slider burger if position to far away
		if (jQuery(window).width() > 1024 && (!jQuery("header").hasClass("menu-full-center") && !jQuery("header").hasClass("menu-full-columns"))) {
			if (!jQuery('#header').hasClass('menu-is-open')) {
				var offset = jQuery(window).width() - jQuery(this).parent('.menu-actions').offset().left - 340;
				jQuery(this).parent('.menu-actions').css('transform', 'translateX('+offset+'px)');
			} else {
				jQuery(this).parent('.menu-actions').css('transform', 'translateX(0px)');
			}
		}
		// ** making header fixed if header is set to not-fixed
		if (jQuery('#header').hasClass('not-sticky')) { jQuery('html,body').animate({ scrollTop: 0}, 500, 'easeInOutQuart'); }
		setTimeout(function() { jQuery('#header').toggleClass('toggle-sticky');  }, 600);	
		// ** making header fixed if header is set to not-fixed
		if (jQuery('#header').hasClass('menu-is-open')) { jQuery('#main-nav ul.sub-menu').delay(300).slideUp(200, "easeInOutCubic"); }
		jQuery('#header').toggleClass('menu-is-open'); 
		return false;
	});
	
	jQuery('#main-nav').on("click", "li > a", function() {
		var thisItem = jQuery(this); 
		var thisParent = jQuery(this).parent('li'); 
		if (thisItem.siblings('ul').length > 0 && thisItem.siblings('ul').css('display') === 'none') {
			thisItem.siblings('ul').slideDown(400, "easeInOutCubic");
			thisParent.siblings('li').children('ul').slideUp(400, "easeInOutCubic");
			return false;	
		}
	});
	
	
	
	/*---------------------------------------------- 
				 	L A Z Y   L O A D 
	------------------------------------------------*/
	if(jQuery().unveil && jQuery("img.lazy").length > 0) { 
		jQuery("img.lazy").unveil(400);
	}
	
	
	/*---------------------------------------------- 
			I S O T O P E  /  M A S O N R Y 
	------------------------------------------------*/
	if( jQuery().isotope ) { 
	
		/* Call Isotope  
		------------------------------------------------*/	
		jQuery('.isotope-grid').each(function(){
			var $container = jQuery(this);
			var layout = "masonry";
			if ($container.hasClass("fitrows")) { layout = "fitRows"; }
			$container.imagesLoaded( function(){
				$container.isotope({
					layoutMode: layout,
					itemSelector : '.isotope-item',
				});	
			});
			
			setTimeout(function() { $container.isotope( 'layout' ); }, 500);	
		});
					
		
		/* Filter isotope
		------------------------------------------------*/
		jQuery('.filter').on("click", "li a", function() { 
			var thisItem = jQuery(this);
			var parentul = thisItem.parents('ul.filter').data('related-grid');
			if (!parentul) {
				alert('Please specify the dala-related-grid');
			} else {
				thisItem.parents('ul.filter').find('li').removeClass('active');
				thisItem.parent('li').addClass('active');
				var selector = thisItem.attr('data-filter');
				jQuery('#'+parentul).isotope({ filter: selector });
				jQuery('#'+parentul+' .isotope-item').not(selector).removeClass("animated");				
				jQuery('#'+parentul+' .isotope-item'+selector).addClass("animated");
				
				// adding slug hashtag to url
				var slug = thisItem.data('slug');
				if (slug) { 
					window.location.hash = slug; } 
				else {
					history.pushState("", document.title, window.location.pathname + window.location.search);
				}
			}
			return false;
		});
		
		
		/* Load More isotope
		------------------------------------------------*/
		var loadMore = jQuery('.load-isotope:not(.disabled) a');

		loadMore.click(function(){			
			var el = jQuery(this);
			if(el.data("loadpage") === undefined) { el.data("loadpage","2"); }
			else { el.data("loadpage", parseInt(el.data("loadpage"),10)+1); }
			var 	related = el.data('related-grid');
			var 	href = el.attr('href').replace("/2", '/'+el.data("loadpage"));
			href = href.replace("2", el.data("loadpage"));
			var datas = '';
			if(el.data("options") !== undefined && el.data("options")) { datas = el.data('options').replace("paged=2", "paged="+el.data("loadpage")); }
			isotopeLoadMore(jQuery('#'+related),el,href,datas);
			return false;
		});
		
	}
	
	
	
	
	/*---------------------------------------------- 
				   	L I G H T C A S E
	------------------------------------------------*/
	if(jQuery().lightcase) {
		jQuery('a[data-rel^=lightcase]').lightcase({ 
			showSequenceInfo: false, 
			swipe: true, 
			showCaption: true,
			overlayOpacity:0.95,
			maxWidth: 1300,
			maxHeight: 1100,
			shrinkFactor: 1,
			liveResize: true,
			fullScreenModeForMobile: true,
			video: {
				width : 854,
				height : 480
				},
			iframe:{
				width:854,
				height:480,
				allowfullscreen: 1
				}
		});
		
		jQuery('a[data-rel^="lightcase:"]').each(function(index) {
			var el = jQuery(this);
			if(!el.hasClass('lc-trigger') && !el.parents('.isotope-item').hasClass('sr-gallery-item')) {
			var rel = el.data('rel');
            var href = el.attr('href');
			var count = jQuery('a[href="'+href+'"][data-rel="'+rel+'"]').length;
				if(count > 1) {
					jQuery('a[href="'+href+'"][data-rel="'+rel+'"]').not(this).addClass('lc-trigger').attr('data-trigger',index).attr('data-rel','');	
					el.addClass('lc-trigger-'+index);	
				}
			}
        });
		
		jQuery('a.lc-trigger').on("click", function() { 
			jQuery( ".lc-trigger-"+jQuery(this).data('trigger') ).trigger( "click" );
			return false;
		});
		
	}
	
	
	/*---------------------------------------------- 
			    I N L I N E   V I D E O
	------------------------------------------------*/
	jQuery('body').on("click", ".inline-video", function() { 
		var el = jQuery(this);
		var type = el.data('type');
		var video = el.data('videoid');
				
		if (type === 'youtube') { 
		var iframe='<iframe src="http://www.youtube.com/embed/'+video+'?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen ></iframe>';
		} else if (type === 'vimeo') {
		var iframe='<iframe src="https://player.vimeo.com/video/'+video+'?autoplay=1" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>';
		}
		
		el.append('<div class="inline-iframe-container"></div>');
		el.find(".inline-iframe-container").html(iframe+'<div class="close-inline-video"></div>');
		
		setTimeout(function() {
			el.addClass('active');
		}, 1000);
		
		return false;
	});
	
	jQuery('body').on("click", ".close-inline-video", function() { 
		var thisItem = jQuery(this); 
		thisItem.parents( ".inline-video" ).removeClass('active');
		thisItem.parent( ".inline-iframe-container" ).remove();
		return false;
	});
	
	/*---------------------------------------------- 
			R E V O L U T I O N   S L I D E R
	------------------------------------------------*/
	if(jQuery().revolution) {
		jQuery("#hero .revolution-slider").revolution({
			sliderType:"standard",
			sliderLayout:"fullscreen",
			fullScreenAutoWidth:"on",
			fullScreenOffsetContainer:"#pseudo-header",
			delay:9000,
			disableProgressBar:'on',
			navigation: {
				arrows:{ 
					enable:true, 
					style:"dani-nav",
					left:{ h_offset: 25 },
					right:{  h_offset: 25 } 
				},
				bullets:{ 
					enable:false, 
					style:"dani-bullets",
					h_align:"center",
					v_align:"bottom",
					h_offset:0,
					v_offset:25,
					space:7,  
				},
				touch:{
				 	touchenabled:"on",
				 	swipe_treshold : 75,
				 	swipe_min_touches : 1,
				 	drag_block_vertical:false,
				 	swipe_direction:"horizontal"
				}				
			},
			responsiveLevels:[2048,1360,1100,780],			
			gridwidth:[1100,880,680,400],
			gridheight:[700,550,550,450],
			lazyType: 'smart'
		});
		
		jQuery("#hero .revolution-slider").bind("revolution.slide.onchange",function (e,data) {
			if (data.currentslide.hasClass('text-light')) {
				jQuery("#header.transparent").addClass("text-light");
				jQuery("#hero .revolution-slider .dani-nav").addClass("dani-light").removeClass("dani-dark");
				jQuery("#hero .revolution-slider .dani-bullets").addClass("dani-light").removeClass("dani-dark");
			} else {
				jQuery("#header.transparent").removeClass("text-light");
				jQuery("#hero .revolution-slider .dani-nav").addClass("dani-dark").removeClass("dani-light");
				jQuery("#hero .revolution-slider .dani-bullets").addClass("dani-dark").removeClass("dani-light");
			}
		});
		
	}
	
	
	
	/*---------------------------------------------- 
		O W L   S L I D E R & C A R O U S E L
	------------------------------------------------*/
	if(jQuery().owlCarousel) {
		
		jQuery(".owl-slider").owlCarousel({
			items:1,
			stopOnHover : true,
			nav: false,
			navText:false,
			dots: true,
			smartSpeed : 600,			
			singleItem : true,
			autoHeight : true,
			loop: false,
			autoplay: false,
			navRewind: false
		});
		
		jQuery(".owl-carousel").owlCarousel({
			items : 4,
			itemsDesktop:false,
			responsive: { //shop related items
			  480: { items: 1 },
			  768: { items: 2 },
			  },
			autoplay: false,
			autoHeight : true,
			nav: true,
			navText:false,
			dots: true,
			loop: false
		});
				
	}
	
	
	
	/*---------------------------------------------- 
		P R E P A R E   T E X T   A N I M A T I O N
	------------------------------------------------*/
	if(jQuery().lettering) { 
		jQuery(".text-animation").lettering('lines');
	}
	
		
	
	/*---------------------------------------------- 
				   	 P A R A L L A X
	------------------------------------------------*/
	if(jQuery().parallax) { 
		jQuery('.parallax-section').parallax({speed:0.6});
	}
	
	
	/*---------------------------------------------- 
				   F I T   V I D E O S
	------------------------------------------------*/
	if(jQuery().fitVids) { 
		jQuery("body").fitVids();
	}
	
	
	/*---------------------------------------------- 
				   	 V I D E O   B G
	------------------------------------------------*/
	if(jQuery().phatVideoBg) { 
		jQuery('.videobg-section').phatVideoBg();
	}
		
	
	/*---------------------------------------------- 
	 S E L F H O S T E D   A U D I O   +   V I D E O
	------------------------------------------------*/
	if(jQuery().mediaelementplayer) {
		jQuery('audio,video:not(.video-background)').mediaelementplayer();
	}
		
	
	/*---------------------------------------------- 
				S T I C K Y   C O L U M N     (portfolio)
	------------------------------------------------*/
	if(jQuery().stick_in_parent) { 
		setTimeout(function() {
			var stickyOffset = jQuery("header").height() + 50;
			if (jQuery("header").hasClass("not-sticky") && !jQuery("header").hasClass("transparent")) { stickyOffset = jQuery("header").height() + 25; } 
			else if (jQuery("header").hasClass("wrapper") && jQuery("header").hasClass("transparent")) { stickyOffset = jQuery("header").height(); }
			
			jQuery(".col-sticky").stick_in_parent({offset_top:stickyOffset}); 
			if (jQuery(window).width() < 769) { jQuery(".col-sticky").trigger("sticky_kit:detach"); }
		}, 400 );
	}
	
	
	/*---------------------------------------------- 
				        T A B S 
	------------------------------------------------*/	
	jQuery(".tabs:not(.wc-tabs):not(.woocommerce-tabs)").each(function() {
		var thisItem = jQuery(this); 
		thisItem.find('.tab-content').removeClass('active').css('display','none');
		var rel = thisItem.find('.active a').attr('href');
		thisItem.find('.'+rel).addClass('active');
	});
	
	jQuery(".tab-nav:not(.wc-tabs)").on("click", "a", function() { 
		var thisItem = jQuery(this); 
		var parentdiv = thisItem.parents('li').parent('ul').parent('div');
		var rel = thisItem.attr('href');
		
		jQuery(parentdiv).find(".tab-nav li").removeClass("active");
		thisItem.parents('li').addClass("active");
		
		jQuery(parentdiv).find(".tab-container .tab-content").hide().removeClass('active');
		jQuery(parentdiv).find(".tab-container ."+rel).fadeIn(500).addClass('active');
		
		return false;
	});
	
	
	
	/*---------------------------------------------- 
			T O G G L E  &  A C C O R D I O N
	------------------------------------------------*/		
	jQuery(".toggle-item").each(function() {
		if (!jQuery(this).find('.toggle-active').length) { jQuery(this).find('.toggle-inner').slideUp(300); }
		jQuery(this).find('.toggle-active').parent(".toggle-item").siblings('.toggle-item').find('.toggle-inner').slideUp(300);	
		jQuery(this).find('.toggle-active').siblings('.toggle-inner').slideDown(300);							
	});
	
	jQuery(".toggle-item").on("click", ".toggle-title", function() { 
		var thisItem = jQuery(this); 
		var parentdiv = thisItem.parent('div').parent('div');
		var active = thisItem.parent('div').find('.toggle-inner').css('display');
		
		if (jQuery(parentdiv).attr('class') === 'accordion') {
			if (active !== 'none' ) { 
				jQuery(parentdiv).find('.toggle-item .toggle-inner').slideUp(300);
				thisItem.toggleClass('toggle-active');
			} else {
				jQuery(parentdiv).find('.toggle-item .toggle-inner').slideUp(300);
				jQuery(parentdiv).find('.toggle-item .toggle-title').removeClass('toggle-active');
				
				thisItem.toggleClass('toggle-active');
				thisItem.siblings('.toggle-inner').slideDown(300);
			}
		} else {
			thisItem.toggleClass('toggle-active');
			thisItem.siblings('.toggle-inner').slideToggle(300);
		}
		
		return false;
	});
	
	
	
	
	/*---------------------------------------------- 
				   S C R O L L   T O (back to top, scroll down)
	------------------------------------------------*/
	jQuery('body').on('click', '#backtotop,#scrolldown', function() {
		var topPos = 0;
		if (jQuery(this).attr("id") === "scrolldown") { topPos = jQuery("#page-body").offset().top; }
		jQuery('html,body').animate({ scrollTop: topPos}, 1000, 'easeInOutQuart');
		return false;
	});
	
	
	
	/*---------------------------------------------- 
		 O P E N / C L O S E   C A R T
	------------------------------------------------*/
	jQuery('.menu-cart').on("click", ".open-cart", function() { 
		jQuery('.menu-cart-content').addClass('visible');
		return false;
	});
	
	jQuery('.menu-cart-content').on("click", ".close-cart", function() { 
		jQuery('.menu-cart-content').removeClass('visible');
		return false;
	});
	
	
	
	resizeAdapt();
});

jQuery(window).scroll(function() { 
	animateOnScroll(false);
	headerFeatures(); 
});

jQuery(window).resize(function() { 
	resizeAdapt(); 
});


/* Feeds */
jQuery(document).ready(function() { 
		
	/*---------------------------------------------- 
			   D R I B B B L E   F E E D
	------------------------------------------------*/
	if( jQuery(".dribbble-widget").length > 0){
		jQuery('.dribbble-widget').each(function(){
			var $theFeed = jQuery(this);
			var dribbbleUser = $theFeed.data('user');
			var dribbbleCount = $theFeed.data('count');
			var dribbbleToken = $theFeed.data('accesstoken');
		
			if (dribbbleToken) { jQuery.jribbble.setToken(dribbbleToken); } 
			else { jQuery.jribbble.setToken("YOUR CLIENT ACCESS TOKEN"); }
			
			jQuery.jribbble.users(dribbbleUser).shots({'per_page': Number(dribbbleCount)}).then(function(res) {
			  	var html = [];
			  	res.forEach(function(shot) {
					html.push('<div class="shot">');
					html.push('<a href="' + shot.html_url + '" target="_blank">');
					html.push('<img src="' + shot.images.normal + '">');
					html.push('</a></div>');
			  	});
			  	$theFeed.html(html.join(''));
			});
			
		});
	}
		
});

})(jQuery);