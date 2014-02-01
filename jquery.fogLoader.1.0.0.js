(function ($) {
    var _progval = 0;
    var _interval;
    
    $.fn.fogLoader = function (opts) {
        var defaults = {
            message: 'Loading',
            animated: false,
            closeOnEscape: true,
            height: 25,
            maxHeight: false,
            maxWidth: false,
            minHeight: 15,
            minWidth: 20,
            position: 'center',
            width: 130,
            textAlign: 'center',
            wrapText: 'nowrap',
            fontSize: '1em',
            fontFamily: null,
            fontWeight: 'normal',
            borderRadius: null,
            borderWidth: '1px',
            style: 'message',
            progressMax: 10,
            progressChar: '.',
            progressSpell: false,
            progressDelay: 250,
            progressValue: 0
        };
        var settings = null; 
        var spelllen = 1;
        var methods = {
            close: function () {
                $('.ui-progressbar').remove();
                clearInterval(_interval);
                $(this).dialog('close')
            },
            destroy: function () {
                $('.ui-progressbar').remove();
                clearInterval(_interval);
                $(this).dialog('destroy')
            },
            progressValue: function(){
                return _progval;
            },
            updateProgress: function (step) {
                fillProgressBar(step)
            }
        };
        if (typeof opts === 'object' || !opts) {
            settings = $.extend({}, defaults, opts)
        } else {
            if (methods[opts]) {
                return methods[opts].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {
                $.error('_method ' + opts + ' does not exist on jQuery.fogLoader')
            }
        };
        function fillProgressBar(val) {
            _progval = val;
            $('.ui-progressbar-value').css('width', _progval  + '%').show();
        }
        $(this).each(function () {
            var dlg = '#ui-dialog-title-' + $(this).attr('id');
            var msg;
            if (settings.style == 'message') {
                if (settings.animated) {
                    if (settings.progressSpell) {
                        msg = settings.message.substring(0, 1);
                    } else {
                        msg = settings.message;
                    }
                } else {
                    msg = settings.message + '...';
                }
            }
            $(this).dialog({
                modal: true,
                resizable: false,
                closeText: '',
                draggable: false,
                closeOnEscape: settings.closeOnEscape,
                height: settings.height,
                width: settings.width,
                maxHeight: settings.maxHeight,
                minHeight: settings.minHeight,
                maxWidth: settings.maxWidth,
                minWidth: settings.minWidth,
                position: settings.position,
                title: msg,
                beforeclose: function (a, b) {
                    $('#ui-dialog-title-loader-progressbar').remove();
                    clearInterval(_interval);
                    $(this).dialog('destroy')
                }
            });
            $('.ui-dialog-titlebar')
                .show()
                .addClass('ui-state-default').removeClass('ui-widget-header')
                .css({fontSize: settings.fontSize,
                      fontWeight: settings.fontWeight,
                      whiteSpace: settings.wrapText,
                      'border-width': '0px'
            });
            if (settings.fontFamily != null) {
                $('.ui-dialog-titlebar').css({fontFamily: settings.fontFamily});
            }
            $('.ui-dialog-titlebar-close').remove();
            $('.ui-dialog').css({
                padding: '0',
                borderWidth: settings.borderWidth
            });
            if (settings.borderRadius) {
                $('.ui-dialog, .ui-dialog-titlebar').css({
                    '-moz-border-radius': settings.borderRadius,
                    '-webkit-border-radius': settings.borderRadius
                });
            };
            if (settings.style == 'progressbar') {
                var pbar = $('<div>').attr('id', dlg + '-' + settings.style)
                                     .css('height', (settings.height -5) + 'px')
                                     .progressbar({value: settings.progressValue, max: settings.progressMax})
                var pbarval = $('.ui-progressbar-value');
                _progressParams = {val: settings.progressValue, max: settings.progressMax};
                $('.ui-dialog-titlebar').hide();
                $(this).css({height: 'auto',
                             padding: 1,
                             overflow: 'hidden'})
                        .append(pbar);
                pbarval.css('margin', '-2px');
                if (!$.support.htmlSerialize){
                    pbarval.css('height', (settings.height + 5) + 'px')
                }
                $('.ui-dialog .ui-widget-content').css('border-width', '0px');
                if(settings.progressValue != false){
                    fillProgressBar(settings.progressValue);
                }
            }else{
                $(this).hide();
            }
            if (settings.animated && settings.style != 'progressbar') {
                settings.progressMax = settings.message.length + 3;
                _interval = setInterval(function () {
                    var spellmsg = $('.ui-dialog-title').html();
                    if (!spellmsg) {
                        clearInterval($(this).data('progress-interval'));
                    } else {
                        if (spellmsg.length < (settings.message.length + (settings.progressMax - settings.message.length))) {
                            if (settings.progressSpell && settings.animated) {
                                if (spelllen < settings.message.length) {
                                    spellmsg += settings.message.substring(spelllen, spelllen+1);
                                } else {
                                    spellmsg += settings.progressChar;
                                }
                                spelllen++;
                            } else {
                                spellmsg += settings.progressChar;
                            }
                        } else {
                            spelllen = 1;
                            spellmsg = settings.progressSpell ? settings.message.substring(0, 1) : settings.message;
                        }
                        $('.ui-dialog-title').html(spellmsg);
                    }
                }, settings.progressDelay);
            };
            $('.ui-widget-overlay').css('position', 'fixed');
        })
    }
})(jQuery);