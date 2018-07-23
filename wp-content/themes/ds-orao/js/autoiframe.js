/**
 * Glowna obsluga ladowania zawartosci do iframe'a:
 * - ustawianie wysokosci iframe w zaleznosci od zawartosci
 * - obsluga linkow zewnetrznych
 * - obsluga linkow wewnetrznych
 * - obsluga "tabow"
 */
jQuery(function(){
  autoiframe();

  // Options for the observer (which mutations to observe)
  var config = { attributes: true, childList: true };
  var first = true;

  // Callback function to execute when mutations are observed
  var callback = function(mutationsList) {
    for(var mutation of mutationsList) {
      if (mutation.type == 'attributes' && first == true) {
        console.log('The ' + mutation.attributeName + ' attribute was modified.');
        first = false;
        core(targetNode);
      }
    }
  };

  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);

  // Select the node that will be observed for mutations
  var targetNode = document.getElementById('program-cont');

  // Start observing the target node for configured mutations
  if (!jQuery.isEmptyObject(targetNode)) {
    observer.observe(targetNode, config);
  }
});

function autoiframe() {
  jQuery('.autoiframe').each(function() {
    var iframeWin = this;
    core(iframeWin);
  });
}

function core(iframeWin) {
  var	base_url		= document.getElementById("iframe-script").src.split('&').pop().toString();
  var iframe_url  = jQuery(iframeWin).attr('src');
  var hash        = window.location.hash;
  console.log('iframe_url: ' + iframe_url + hash);
  jQuery(iframeWin).attr('src', base_url + iframe_url + hash);

  if (jQuery(iframeWin).length > 0 && typeof iframe_url != 'undefined') {

    jQuery(iframeWin).load(function() {

      var urlArray = window.location.href.split('/');
      var delay = 200;

      if (iframe_url.indexOf("aktualnosci-aplikacja") >= 0) {
        delay = 3000;
      }

      // Ustawianie wysokosci iframe-a po zaladowaniu strony
      jQuery(iframeWin).show();
      setTimeout(function(){
        setHeight(iframeWin, iframeWin.contentWindow.document.body.offsetHeight + 'px');
      }, delay);

      jQuery(iframeWin).contents().find('html').css('overflow','hidden');

      // Otwieranie zakladki cennika
      if (urlArray.indexOf("cennik") > 0 && urlArray[urlArray.length-1].indexOf("#") == 0) {
        var group = urlArray[urlArray.length-1];

        jQuery(iframeWin).contents().find(group + ' .taba-link').addClass('active');
        jQuery(iframeWin).contents().find(group + ' .taba-cont').css('display','table');
      }

      // Obsluga inner_link
      jQuery(iframeWin).contents().find('a.inner_link').each(function() {
        var urlA = jQuery(this).attr('href');
        var innerLink = jQuery(this).attr('aria-link');

        if (urlA.indexOf('\*') >= 0 && typeof innerLink == 'undefined') {
          innerLink = urlA.substring(urlA.indexOf('\*')+1,urlA.length);
        }

        if (innerLink != '' && typeof innerLink != 'undefined') {
          jQuery(this).attr('href', base_url + innerLink);
          jQuery(this).click(function(event) {
            event.preventDefault();
            event.stopPropagation();
            var urlA = jQuery(this).attr('href');
            openInSameWindow(urlA);
          });
        }
        else {
          jQuery(this).attr('href', base_url + '/get-from-wapro.php?src=' + urlA);
        }
      });

      // Obsluga outer_link
      jQuery(iframeWin).contents().find('a.outer_link').click(function(event) {
        event.preventDefault();
        event.stopPropagation();
        var urlA = jQuery(this).attr('href');
        if(urlA.indexOf('http://www.wapro.pl') == -1) {
          urlA = 'http://www.wapro.pl/' + urlA;
        }
        openInNewTab(urlA);
      });

      // Obsluga tabs menu
      jQuery(iframeWin).contents().find('#tabs .tab-menu a').click(function(event) {
        var tabControls = jQuery(this).parent().attr('aria-controls');
        if (tabControls.indexOf('/historia-zmian/') !== -1) {
          event.preventDefault();
          event.stopPropagation();
          openInSameWindow(base_url + tabControls);
        }
        else {
          window.location.hash = tabControls;
          setTimeout(function(){
            setHeight(iframeWin, iframeWin.contentWindow.document.body.offsetHeight + 'px');
          }, 600);
        }
      });

      // Obsluga history-navigate
      jQuery(iframeWin).contents().find('.history-navigate span').click(function() {
        setTimeout(function(){
          setHeight(iframeWin, iframeWin.contentWindow.document.body.offsetHeight + 'px');
        }, 600);
      });

      // Obsluga taba-link
      jQuery(iframeWin).contents().find('.taba-link').click(function() {

        if (jQuery(this).hasClass("active")) {
          jQuery(this).removeClass("active");
          jQuery(this).parent().find(".taba-cont").hide();
        }
        else {
          jQuery(this).addClass("active");
          jQuery(this).parent().find(".taba-cont").show();
        }
        iframeWin.style.height = iframeWin.contentWindow.document.body.offsetHeight + 'px';
      });

      // Obsluga taba-open
      jQuery(iframeWin).contents().find('.taba-open').click(function() {
        var group = jQuery(this).attr('rel');
        if (jQuery(this).hasClass("active")) {
          jQuery(iframeWin).contents().find('.'+group).find(".taba-cont").hide();
          jQuery(iframeWin).contents().find('.'+group).find(".taba-link").removeClass("active");
          jQuery(this).removeClass("active");
          jQuery(this).html('<span>ROZWIŃ WSZYSTKIE GRUPY</span><span></span>');
        }
        else {
          jQuery(iframeWin).contents().find('.'+group).find(".taba-cont").show();
          jQuery(iframeWin).contents().find('.'+group).find(".taba-link").addClass("active");
          jQuery(this).addClass("active");
          jQuery(this).html('<span>ZWIŃ WSZYSTKIE GRUPY</span><span></span>');
        }
        setTimeout(function(){
          setHeight(iframeWin, iframeWin.contentWindow.document.body.offsetHeight + 'px');
        }, 600);
      });

      // Obsluga rozwin-pozostale
      jQuery(iframeWin).contents().find('.rozwin-pozostale').click(function() {
        if (jQuery(this).parent().parent().find(".rozwin-hidden").hasClass("hidden")) {
          jQuery(this).parent().parent().find(".rozwin-hidden").removeClass("hidden");
          jQuery(this).html('<span>UKRYJ POZOSTAŁE</span><span class="gora"></span>');
        }
        else {
          jQuery(this).parent().parent().find(".rozwin-hidden").addClass("hidden");
          jQuery(this).html('<span>POKAŻ POZOSTAŁE</span><span class="dol"></span>');
        }

        setHeight(iframeWin, iframeWin.contentWindow.document.body.offsetHeight + 'px');
      });

      // Obsluga klikniecia w naglowek produktu
      jQuery(iframeWin).contents().find('.product-type h3').click(function() {
        jQuery('.product-type').removeClass('active');
        jQuery(this).parent().addClass('active');

        setTimeout(function(){
          setHeight(iframeWin, iframeWin.contentWindow.document.body.offsetHeight + 'px');
        }, 600);
      });

      // Obsluga klikniecia w miniaturke w galerii
      jQuery(iframeWin).contents().find('.showbox a.fangal').click(function(event) {
        console.log('fangal click()');

        setTimeout(function(){
          if (jQuery(iframeWin).contents().find('.fancybox-wrap').length > 0) {
            console.log(jQuery(iframeWin).contents().find('.fancybox-wrap').offset().top);
            jQuery('html, body').animate({
              scrollTop: jQuery(iframeWin).contents().find('.fancybox-wrap').offset().top + jQuery(iframeWin).offset().top
            }, 2000);
          }
        }, 600);
      });
    });
  }
}

/**
 * Ustawianie wysokosci iframe'a
 */
function setHeight(iframe, height) {
  iframe.style.height = height;
}

/**
 * Otwieranie w nowym "tabie"
 */
function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

/**
 * Otwieranie w tym samym oknie
 */
function openInSameWindow(url) {
  var win = window.open(url, '_self');
  win.focus();
}

/**
 * Sprawdzanie daty ostatniej modyfikacji pliku i jej zwracanie w return
 */
function fetchHeader(url, wch) {
  try {
    var req=new XMLHttpRequest();
    req.open("HEAD", url, false);
    req.send(null);
    if(req.status== 200){
      var mydate = new Date(req.getResponseHeader(wch));
      var month = mydate.getFullYear()+''+(mydate.getMonth()+1)+''+mydate.getDay()+''+mydate.getHours()+''+mydate.getMinutes()+''+mydate.getSeconds();
      return month;
    }
    else return null;
  } catch(er) {
    return null;
  }
}
