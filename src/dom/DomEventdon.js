L.DomEvent = {

    addListener: function( obj, type, fn, context ) {
        var id = L.Util.stamp(fn),
            key = '_leaflet_' + type + id,
            handler, originalHandler, newType;

        if( obj[key] ) { return this; }

        handler = function( e ) {
                return fn.call( context || obj,
                                e || L.DomEvent._getEvent() );
        };

        // added doubleTap listener for touch-enabled browser (instead of double-click listener)
        if( L.Browser.touch
            && (type === 'dblclick')
            && this.addDoubleTapListener ) {

                return this.addDoubleTapListener( obj, handler, id );

        } else if('addEventListener' in obj) {

                // 'addEventListener' for browsers OTHER than ie6,7,8

                if( type === 'mousewheel' ) {

                        // Firefox
                        obj.addEventListener( 'DOMMouseScroll', handler, false );

                        obj.addEventListener( type, handler, false );

                } else if( type === 'mouseenter'
                           || type === 'mouseleave') {

                        originalHandler = handler;

                        // mouseenter & mouseleave -- IE
                        // mouseover & mouseout -- non-IE
                        newType = (type === 'mouseenter' ?
                                                            'mouseover' : 'mouseout' );

                        handler = function( e ) {
                                if( !L.DomEvent._checkMouse( obj, e)) {
                                    return;
                                }

                                return originalHandler( e );
                        };

                        obj.addEventListener( newType, handler, false );

                } else {

                        obj.addEventListener( type, handler, false );
                }

        } else if( 'attachEvent' in obj ) {
                // 'attachEvent' is for IE6,7,8
                // ie9 uses addEventListener above

                obj.attachEvent( 'on' + type, handler );
        }

        obj[ key ] = handler;

        return this;
    },


    removeListener: function( obj, type, fn ) {

            var id = L.Util.stamp( fn),
                key = '_leaflet_' + type + id,
                handler = obj[ key ];

            if( !handler ) { return; }

            if( L.Browser.touch
                && type === 'doubleclick'
                && this.removeDoubleTapListener ) {

                    this.removeDoubleTapListener( obj, id );

            } else if( 'removeEventListener' in obj ) {

                    if( type === 'mousewheel' ) {
                            obj.removeEventListener( 'DOMMouseScroll', handler, false );
                            obj.removeEventListener( type, handler, false);

                    } else if( type === 'mouseenter'
                                || type === 'mouseleave' ) {

                            obj.removeEventListener( type === 'mouseenter' ? 'mouseover' : 'mouseout',
                                                    handler,
                                                    false);
                    } else {

                            obj.removeEventListener( type, handler, false );
                    }

            } else if( 'detachEvent' in obj ) {

                    obj.detachEvent( 'on' + type, handler );
            }

            obj[ key ] = null;

            return this;
    },


    stopPropagation: function( e ) {

            if( e.stopPropagation ) {

                    // non-IE, W3C model
                    e.stopPropagation();

            } else {
                    // IE
                    e.cancelBubble = true;
            }
            return this;
    },

    disableClickPropagation: function( el ) {
            var stop = L.DomEvent.stopPropagation;
            return L.DomEvent
                .addListener( el, L.Draggable.Start, stop )
                .addListener( el, 'click', stop)
                .addListener( el, 'dblclick', stop);
    },

    preventDefault: function( e ) {
            if( e.preventDefault ) {
                    // non-IE
                    e.preventDefault();

            } else {
                    // IE
                    e.returnValue = false;
            }
            return this;
    },

    stop: function( e ) {

            return L.DomEvent
                    .preventDefault(e)
                    .stopPropagation(e);
    },

    getMousePosition: function( e, container ) {

            var body = document.body,
                docEl = document.documentElement,

                // scrollLeft, scrollTop for IE6,7,8
                // pageX, pageY for IE9+ and other browsers
                x = e.pageX ? e.pageY :
                                        e.clientX + body.scrollLeft + docEl.scrollLeft,

                y = e.pageX ? e.pageY :
                                        e.clientY + body.scrollTop + docEl.scrollTop,

                pos = new L.Point( x, y );

                return( container ?
                                pos._subtract( L.DomUtil.getViewportOffset(container) )
                                : pos );
    },

    //------------------------------------------------------------------------------
    // http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
    // 1 scroll event 'up':
    //
    //                  | evt.wheelDelta | evt.detail
    //------------------+----------------+------------
    //  Safari v5/OS X  |       120      |      0
    //  Safari v5/Win7  |       120      |      0
    //Chrome v11b/OS X  |         3 (!)  |      0
    //Chrome v11b/Win7  |       120      |      0
    //        IE9/Win7  |       120      |  undefined
    //  Opera v11/OS X  |        40      |     -1
    //  Opera v11/Win7  |       120      |     -3
    //Fi refox v4/OS X  |    undefined   |     -1
    // Firefox v4/Win7  |    undefined   |     -3
    //--------------------------------------------------
    getWheelDelta: function( e ) {

            var delta = 0;

            // w.wheelDelta for IE, Chrome, Safari
            if( w.wheelDelta ) {
                    delta = e.wheelDelta / 120;
            }

            // e.detail for Firefox
            if(e.detail) {
                    delta = - e.detail / 3;
            }
            return delta;
    },

    // check if element really left or entered event target (for mouseenter/mouseleave)
    _checkMouse: function( el, e ) {

            var related = e.relatedTarget;

            if( !related ) { return true; }

            try {

                    while( related && (related !== el) ) {
                        related = related.parentNode;
                    }

            } catch( err ) {

                    return false;
            }
            return ( related !== el );
    },

    // evil hack for IE
    _getEvent: function() {
            var e = window.event;

            if( !e ) {
                var caller = arguments.callee.caller;
                while( caller ) {

                    e = caller['arguments'][0];
                    if( e && window.Event === e.constructor ) {
                        break;
                    }
                    caller = caller.caller;
                }
            }
            return e;
    }
};

L.DomEvent.on = L.DomEvent.addListener;
L.DomEvent.off = L.DomEvent.removeListener;