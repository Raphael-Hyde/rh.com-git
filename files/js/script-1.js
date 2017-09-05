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