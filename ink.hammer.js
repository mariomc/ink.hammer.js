Ink.createModule('Ink.UI.Hammer', 1, ['Ink.Dom.Event'], function(InkEvent) {

    /** 
     * The Hammer.js lib needs to exist first. If you don't want 
     * to call the library as an external file, change the
     * verification below for the whole library, excluding
     * the closure and AMD definition.
     */

    if(!window.Hammer ) {
        return;
    }

    /** 
     * For this beta version, we need the bean library to  
     * to handle custom events and other syntax sugar
     */

    if(!window.bean ) {
        return;
    }

    /**
     * bind dom events
     * this overwrites addEventListener
     * @param   {HTMLElement}   element
     * @param   {String}        eventTypes
     * @param   {Function}      handler
     */
    Hammer.event.bindDom = function (element, types, handler) {
        bean.on(element, types, function(ev){
            var data = ev.originalEvent || ev;
            if(data.pageX === undefined) {
              data.pageX = InkEvent.pointerX(data);
              data.pageY = InkEvent.pointerY(data);
            }

            if(!data.target) {
              data.target = ev.target;
            }

            if(data.which === undefined) {
              data.which = data.button;
            }

            handler.call(this, data);
        });
        return this;
    };

    /**
     * the methods are called by the instance, but with the Ink plugin
     * we use the Ink event methods instead.
     * @param   {String}   eventTypes
     * @param   {Function}      handler
     * @param   {String}   fallbackEvents
     */
    Hammer.Instance.prototype.on = function(types, handler) {
        //console.log("on ", types);
        bean.on(this.element, types, function(ev){
            var data = ev.originalEvent || ev;

            if(data.pageX === undefined) {
              data.pageX = InkEvent.pointerX(data);
              data.pageY = InkEvent.pointerY(data);
            }

            if(!data.target) {
              data.target = ev.target;
            }

            if(data.which === undefined) {
              data.which = data.button;
            }

            handler.call(this, data);
        });        
        return this;
    };

    Hammer.Instance.prototype.off = function(types, handler) {
        bean.off(this.element, types, handler);
        return this;
    };


    /**
     * trigger events
     * this is called by the gestures to trigger an event like 'tap'
     * @this    {Hammer.Instance}
     * @param   {String}    gesture
     * @param   {Object}    eventData
     * @return  {Event}
     */
    Hammer.Instance.prototype.trigger = function(gesture, eventData){
        var el = this.element;
        // optional
        if(!eventData) {
            eventData = {};
        }

        var ev = document.createEvent ? Hammer.DOCUMENT.createEvent('Event') : document.createEventObject();
        if(document.createEvent){
            ev.initEvent(gesture, true, true);
        } else {
            ev.target = el;
            ev.type = gesture;
        }
        ev.eventType = gesture;
        ev.gesture = eventData;
        bean.fire(el, gesture, [ev]);

        return this;
    };

  return Hammer;

});