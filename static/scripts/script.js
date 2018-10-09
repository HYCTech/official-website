/*!
 * Plugin: mock clock
 * Author: CheneyLiu
 * Email: lhy6551@qq.com
 * Licensed under the MIT license
 */
;(function($, window, document, undefined) {

  var pluginName = 'mockclock';
  var pluginVersion = 'v1.0.2';
  var defaults = {
    timeText: [],
    timeTips: [
      {
        time: '09:00',
        img: 'images/smile_01.png',
        title: '微笑迎接&nbsp;每天新的开始',
        intro: '互联/物联网 + 时代的工作方式'
      },
      {
        time: '10:00',
        title: '无论何时何地&nbsp;始终陪伴身边',
        intro: '跨终端&nbsp;云服务&nbsp;享受一致化体验'
      },
      {
        time: '14:00',
        title: '一路上有你&nbsp;携手同行',
        intro: '开放式服务窗口&nbsp;拓展市场渠道'
      },
      {
        time: '16:00',
        title: '你想你说&nbsp;我都能知道',
        intro: '无缝沟通&nbsp;轻松协作办公'
      },
      {
        time: '18:00',
        img: 'images/smile_02.png',
        title: '辛苦了&nbsp;明天还要加油哦',
        intro: '安排计划&nbsp;让明日工作更加有序'
      }
    ]
  };

  var currentTimeText = '00:00';
  /**
   * MockClock 模拟时钟构造器
   * @param {DOMElement} element
   * @param {Object} options
   */
  function MockClock(element, options) {
    this._name = pluginName;
    this._version = pluginVersion;

    this.element = element;
    this.$element = $(element);
    this.settings = $.extend({}, defaults, options);
    this.init();

    return this;
  }

  MockClock.prototype.init = function() {
    var _this = this;
    _this.render();
  };

  MockClock.prototype.render = function() {
    var $show = $('<div class="clock-show"></div>');
    var $tips = $('<div class="clock-tips"></div>');

    // 时钟模板
    var showTpl = '';
    showTpl += '<div class="clock-block">';
    for (var i = 0; i < 2; i++) {
      showTpl += '<div class="clock-block-inner"><div>';
      for (var j = 9; j >= 0; j--) {
        if (j == 9) {
          // showTpl += '<span data-num="'+ 0 +'">'+ 0 +'</span>';
        }
        showTpl += '<span data-num="'+ j +'">'+ j +'</span>';
      }
      showTpl += '</div></div>';
    }
    showTpl += '</div>';
    showTpl += showTpl;
    $show.html(showTpl);

    // tips模板
    var tipsTpl = '';
    var timeTips = this.settings.timeTips;
    for (var i = 0; i < timeTips.length; i++) {
      tipsTpl += '<div class="clock-tips-inner '+ (timeTips[i].img?'':'text-center') +'" data-time="'+ timeTips[i].time +'">';
        tipsTpl += timeTips[i].img?'<img class="img" src="'+ timeTips[i].img +'" alt="">':'';// 图片地址为空时不添加图片
        tipsTpl += '<h1>'+ timeTips[i].title +'</h1>';
        tipsTpl += '<p>'+ timeTips[i].intro +'</p>'
      tipsTpl += '</div>';
    }
    $tips.html(tipsTpl);


    var $el = this.$element;
    $el.append($show, $tips);

    // 对一些属做处理
    this.digitBoxs = $show.find('.clock-block-inner > div');
    $(this.digitBoxs).css({
      top: - (this.digitBoxs.get(0).scrollHeight - this.digitBoxs.find('span').height())
    });

    this.tipsItems = $tips.find('.clock-tips-inner');
    this.tipsItems.hide();
  };

  MockClock.prototype.rolling = function($digitBox, timer) {

    var _this = this;
    var rollAnimate = $digitBox;
    var oTop = -(_this.digitBoxs.height() - _this.digitBoxs.find('span').height());

    (function roll() {
      $digitBox.animate({ top: 0, }, timer, function() {
        $(this).css('top', oTop+'px');
        roll();
      });
    })();
    return rollAnimate;
  };

  MockClock.prototype.rollTo = function(time) {
    var _this = this;
    var timeArray = time || _this.settings.timeText;
    timeArray = timeArray.split('');
    timeArray.splice(2,1);

    _this.digitBoxs.each(function(index, el) {
      var rollAnimate = _this.rolling($(this), (4-index)*100);
      var rollTop = (9 - timeArray[index]) * _this.digitBoxs.find('span').innerHeight();
      setTimeout(function() {
        rollAnimate.stop();
        rollAnimate.animate({ top: -rollTop,}, 250, function() {
        });
      }, (index+1)*300);
    });
  };

  MockClock.prototype.hideTips = function(time) {
    this.$element.find('.clock-tips').children().hide();
    this.$element.find('.clock-tips').removeClass('showing');
  };

  MockClock.prototype.showTips = function(time) {
    this.$element.find('[data-time="'+time+'"]').show();
    this.$element.find('.clock-tips').addClass('showing');
  };

  MockClock.prototype.animate = function(time, isShow) {
    var _this = this;
    var $el = $(this.element);
    var top = $(window).height();
    if (!isShow) {
      _this.hideTips(time);

      $el.animate({top: "-8em"}, 700, function() {
        _this.rollTo(time);
      });

    }else{

      _this.hideTips(time);

      $el.animate({top: '2.5em'}, 700, function() {
       _this.rollTo(time);
      });

      setTimeout(function(){
        _this.showTips(time);
      }, 1500);
    }
  };

  /**
   * 注册为jQuery对象
   * @param  {Object} options
   * @return {jQuery} 
   */
  $.fn.mockclock = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        this[pluginName] = new MockClock(this, options);
        $.data(this, "plugin_" + pluginName, this[pluginName]);
      }
    });
  }
})(jQuery, window, document);


jQuery(document).ready(function($) {

  var mockclock = $('#mockclock').mockclock({

  }).get(0).mockclock;

  $('#fullpage').fullpage({
    anchors: ['企盟家', '09:00', '10:00', '14:00', '16:00', '18:00', 'copyright'],
    css3: true,
    navigation: true,
    showActiveTooltip: true,
    onLeave: function(index, nextIndex, direction) {
      // if (index == 2 && direction == 'up') {
      //   $fakeclock.rollTime('00:00', false);
      // }
      // initRender($(this), index);
    },
    afterLoad: function(anchorLink, index) {
      if (index == 1) {
        mockclock.animate('00:00', false);
      }else if(index == 7){
        // mockclock.animate('18:00', true);
      }else{
        mockclock.animate(anchorLink, true);
      }
    }
  });

  var $dowmloadLinks = $('.download');
  $dowmloadLinks.find('.download-link').each(function(index, el) {
    if ($(this).hasClass('window')) {
      return;
    }
    var to;
    $(this).hover(function() {
      to = $(this).attr('href').split('#')[1];
      $(this).siblings('.download-qrcode.'+to).show();
    }, function() {
      to = $(this).attr('href').split('#')[1];
      $(this).siblings('.download-qrcode.'+to).hide();
    });
  });

  $('.nextpage').click(function(event) {
    $.fn.fullpage.moveTo(2);
  });
});