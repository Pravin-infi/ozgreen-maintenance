// sticky header
jQuery(window).scroll(function () {
    let scr = jQuery(window).scrollTop();
    if (scr > 50) {
      jQuery('header').addClass('sticky');
    } else {
      if (screen.width > 991) {
        jQuery('header').removeClass('sticky');
      }
    }
  });
  jQuery(document).ready(function () {
    if (screen.width < 991) {
      jQuery("header").addClass("sticky");
    }
  });
  