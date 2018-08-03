$(document).ready(function(){

    onscroll = function(){
        if (window.scrollY > 650){
            $("#navbar").css('background', 'rgba(20, 20, 20, 0.85)');
            $(".selected").addClass("home-link");
            $(".vis-btn").fadeIn();
        }
        else {
            $("#navbar").css('background', 'transparent');
            $(".selected").removeClass("home-link");
            $(".vis-btn").fadeOut();
        }
    }

    $(".alert").on('click', function(){
        $(this).fadeOut();
    })

    setTimeout(function(){
        $(".alert").fadeOut();
    },3000);

    $("#hamburger-menu").on('click', function(){
        $("#navbar-links").fadeToggle();
        $("#navbar").toggleClass('new-bgcolor');
    })

});