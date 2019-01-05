  $('body').addClass("rtl");
function showDiv(elem){
   if(elem.value == 1){
      document.getElementById('hidden_div').style.display = "block";
   }
   else{
	   document.getElementById('hidden_div').style.display = "none";
   }
}


if($(window).width() >= 450){
 
 function openNav() {
	
  $(".sidenav").css({width: "300px", display: "block"} );
	$(".overlay_div").css("display", "block");
	$(".search_cabs").css("overflow-y", "hidden");
	$('body').addClass('overflow_div pos_rel');
		
}
}
if($(window).width() < 450){
 
 function openNav() {
  $(".sidenav").css({width: "250px", display: "block"} );
	$(".overlay_div").css("display", "block");
	$(".search_cabs").css("overflow-y", "hidden");
	$('body').addClass("overflow_div pos_rel");
	$('html').addClass('overflow_div');
}
}
function closeNav() {
  
	$(".overlay_div").css("display", "none");
	$(".search_cabs").css("overflow-y", "auto");
	$('body').removeClass('overflow_div pos_rel');
	$('html').removeClass("overflow_div");
  $(".sidenav").css({ display: "none"} );
}

$("#spanid").click(function () {
    $(".book_cabs").css("display", "none");
	$(".current_location").css("display", "block");
});
$("#back_search").click(function () {
    $(".book_cabs").css("display", "block");
	$(".current_location").css("display", "none");
});
$("#spanid1").click(function () {
    $(".book_cabs").css("display", "none");
	$(".drop_location").css("display", "block");
});

$("#back_search1").click(function () {
    $(".book_cabs").css("display", "block");
	$(".drop_location").css("display", "none");
});


$(function(){
    $(window).bind("load resize", function(){
        _winHeight = $(window).height();
		_winHeight1 = $(window).height() - 96;
		_navHeight = $(window).height() - 142;
		_mapHeight = $(window).height() - 207;

        // Setting Height
		$('.search_cabs').css({'height':_winHeight + "px"});
		$('.scroll_div').css({'height':_winHeight1 + "px"});
		$('.menus').css({'height':_navHeight + "px"});
		$('.carousel_bg').css({'height':_winHeight + "px"});
		$('.map_height').css({'height':_mapHeight + "px"});
    });
});
 

function validateForm() {
    var x = document.forms["myForm"]["email"].value;
    if (x == "") {
         $(".validation_txt").css("display", "block");
         $(".form-group").css("border-bottom", "1px solid #d22121");
        return false;
    }
	else {
        $(".validation_txt").css("display", "none");
        $(".form-group").css("border-bottom", "1px solid #dbdbdb");
        return false;
    }
	
	
}
function validateForm1() {
    
	var y = document.forms["myForm"]["pwd"].value;
    if (y == "") {
        $(".validation_txt1").css("display", "block");
        $(".form-group").css("border-bottom", "1px solid #d22121");
		
        return false;
    }
	else {
        $(".validation_txt1").css("display", "none");
        $(".form-group").css("border-bottom", "1px solid #dbdbdb");
        return false;
    }
	
	
}

function validateForm2() {
    
	var a = document.forms["myForm"]["mnum"].value;
    if (a == "") {
        $(".validation_txt2").css("display", "block");
        $(".form-group").css("border-bottom", "1px solid #d22121");
		
        return false;
    }
	else {
        $(".validation_txt2").css("display", "none");
        $(".form-group").css("border-bottom", "1px solid #dbdbdb");
        return false;
    }
	
	
}
function validateForm3() {
    
	var z = document.forms["myForm"]["uname"].value;
    if (z == "") {
        $(".validation_txt3").css("display", "block");
        $(".form-group.focus:after").css("background", "red");
        
		
        return false;
    }
	else {
        $(".validation_txt3").css("display", "none");
        $(".form-group").css("border-bottom", "1px solid #dbdbdb");
        return false;
    }
	
	
}
function myAlertBottom(){
  $(".myAlert-bottom").show();
  $(".alert_overlay").show();
  setTimeout(function(){
    $(".myAlert-bottom").hide(); 
  }, 6000);
  setTimeout(function(){
    $(".myAlert-bottom2").show();
  }, 2000);
  setTimeout(function(){
    $(".alert_overlay").hide(); 
	$(".myAlert-bottom2").hide();
	window.location = "onride.html";
  }, 8000);

  
}
function myAlertBottom1(){
  $(".myAlert-bottom4").show();
  $(".alert_overlay").show();
  setTimeout(function(){
    $(".myAlert-bottom4").hide(); 
    window.location = "onride_afterOTP.html";
  }, 3000);
}
function myAlertBottom2(){
  $(".myAlert-bottom3").show();
  $(".alert_overlay").show();
  setTimeout(function(){
    $(".myAlert-bottom3").hide(); 
    window.location = "your_rides.html";
  }, 4000);
}

function rideCompleted() {
    var count=5;
    var counter=setInterval(timer,1000);
        function timer(){
        console.log('a')
            count=count-1;
            if(count==0){
                $(".myAlert-bottom5").show();
                $(".alert_overlay").show();
                setTimeout(function(){
    $(".myAlert-bottom5").hide(); 
    window.location = "payment.html";
  }, 4000);    
                return;
            } 
        }
    }

/*setTimeout(function(){
    $(".alert_subscribe").fadeOut('slow'); 
  }, 6000);*/
/***********************show password******************************/
function ShowPassword() {
    var x = document.getElementById("myPassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
/*******************************************/


  $('.slider-for').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
 
  fade: true,
  infinite: false,
  asNavFor: '.slider-nav'
});
$('.slider-nav').slick({
  slidesToShow: 6,
  slidesToScroll: 1,
  asNavFor: '.slider-for',
  dots: false,
  
  focusOnSelect: true,
  infinite: false,
  responsive: [
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    },
	{
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
	{
      breakpoint: 360,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
	]
});

/***************browse button**************************/
document.querySelector("html").classList.add('js');

var fileInput  = document.querySelector( ".input-file" ),  
    button     = document.querySelector( ".input-file-trigger" ),
    the_return = document.querySelector(".file-return");
      
button.addEventListener( "keydown", function( event ) {  
    if ( event.keyCode == 13 || event.keyCode == 32 ) {  
        fileInput.focus();  
    }  
});
button.addEventListener( "click", function( event ) {
   fileInput.focus();
   return false;
});  
fileInput.addEventListener( "change", function( event ) {  
    the_return.innerHTML = this.value;  
});  

/***********************carousel swiper**************/
$("#carouselExampleControls").swipe({

  swipe: function(event, direction, distance, duration, fingerCount, fingerData) {

    if (direction == 'left') $(this).carousel('next');
    if (direction == 'right') $(this).carousel('prev');

  },
  allowPageScroll:"vertical"

});
$('#carouselExampleControls').carousel({
    interval: false,
	wrap: false
});
/***********advetiser menu***************/
