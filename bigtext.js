;(function($) {
  $.fn.textfill = function(options) {
    var fontSize = options.maxFontPixels;
    var ourText = $('span:visible:first', this);
    var maxHeight = $(this).height();
    var maxWidth = $(this).width();
    var textHeight;
    var textWidth;
    do {
      ourText.css('font-size', fontSize);
      textHeight = ourText.height();
      textWidth = ourText.width();
      fontSize = fontSize - 1;
    } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
    return this;
  }

  var $om = null;
  function fill(s) {

    if(!$om) {
      var ui = '<div id="openmouse-bigtext-wrapper"><div id="openmouse-bigtext"> \
          <span>' + s + '</span> \
        </div></div>';
        
      $('body').append(ui);
      $om = $('#openmouse-bigtext');
      $om.click(function(e) {
        e.preventDefault();
        $om.hide();
        $('#openmouse').removeClass('om-white');
      });
      $om.find('span').css('line-height', '1.4em');
    } else {
      $om.find('span').text(s);
      $om.find('span').css('height', 'auto');
      $om.find('span').css('display', 'inline');
    }
    $om.find('span').css('line-height', '1.4em');
    
    
    $om.show();
    $om.textfill({maxFontPixels:540});
    var h = $om.find('span').height();
    $om.find('span').css('display', 'block').css('padding-top', ($om.height() - h) / 2);
  }
  //fill();

  $(document).keypress(function(e) {
    
    if(e.keyCode != 8706 && e.keyCode != 402) {
      return;
    }
    e.preventDefault();

    var selected = window.getSelection().toString();

    var data = {
      'event': 'quote',
      'value': selected
    }
    var xtraData = {};
    if(selected != '') {
      fill(selected);
    }
    if(e.keyCode == 8706) {
      // green
      $om.removeClass('theme-f');
      $om.addClass('theme-d');
      $('#openmouse').addClass('om-white');
    }
    if(e.keyCode == 402) {
      // black
      $om.removeClass('theme-d');
      $om.addClass('theme-f');
      $('#openmouse').removeClass('om-white');
    }

    xtraData['color'] = $om.css('color');
    xtraData['bgcolor'] = $om.css('background-color');
    xtraData['url'] = window.location.href;

    data['data'] = xtraData;

    var server = 'http://' + OpenMouseSettings.proxyUrl + '/logentries/';
    chrome.extension.sendRequest({
      action: '$.ajax',
      url: server + 'special/quote',
      params: {
        data: data,
        type: 'POST',
        dataType: 'json'
      }
    });
    
  })

})(jQuery);