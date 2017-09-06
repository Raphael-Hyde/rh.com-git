$("#projects-btn").click(function() {
    $('html, body').animate({
        scrollTop: $("#portfolio-section").offset().top
    }, 750);
});


/* /// ON:SCROLL PROGRESS BAR /// */

$(window).load(function(){
  $(window).scroll(function() {
    var wintop = $(window).scrollTop(), docheight = $('article').height(), winheight = $(window).height();
    console.log(wintop);
    var totalScroll = (wintop/(docheight-winheight))*100;
    console.log("total scroll" + totalScroll);
    $(".progressBar").css("width",totalScroll+"%");
  });

});

/* /// END : ON:SCROLL PROGRESS BAR /// */


$("#roe-phase-1").click(function() {
    $('html, body').animate({
        scrollTop: $("#roe-phase1").offset().top
    }, 750);
});

$("#roe-phase-2").click(function() {
    $('html, body').animate({
        scrollTop: $("#roe-phase2").offset().top
    }, 750);
});

$("#roe-phase-3").click(function() {
    $('html, body').animate({
        scrollTop: $("#roe-phase3").offset().top
    }, 750);
});

$("#roe-phase-4").click(function() {
    $('html, body').animate({
        scrollTop: $("#roe-phase4").offset().top
    }, 750);
});

$("#roe-phase-5").click(function() {
    $('html, body').animate({
        scrollTop: $("#roe-phase5").offset().top
    }, 750);
});

$("#roe-timeline-btn").click(function() {
    $('html, body').animate({
        scrollTop: $("#roe-timeline").offset().top
    }, 750);
});