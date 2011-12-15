/*
---

name: Accessible SortableList

license: MIT-style license.

authors: Boris Wetzel

...
*/

var SortableList = new Class({

    Implements: Options,

    /* Default options for Sortables - See http://mootools.net/docs/more/Drag/Sortables */
    /* Not working
    options: {
        clone: true,
        revert: true,
        opacity: 0.5,
        onStart: this.sortablesStart,
        onComplete: this.sortablesComplete
    },
    */

    initialize: function(list, options) {
    
        /* this.setOptions(options); */
        
        /* Status of the shift key */
        this.shift = false;
        
        /* Remeber the list */
        this.list = $$(list)[0];
        
        /* Roles */
        this.list.setProperty('role', 'application');
        this.list.getElements('span').setProperty('role', 'presentation');
        
        /* Aria */
        this.list.getChildren('li').setProperty('aria-grabbed', 'false');
        
        /* For Drag and Drop - See http://mootools.net/docs/more/Drag/Sortables */
        this.sortables = new Sortables(list, {
            clone: true,
            revert: true,
            opacity: 0,
            onStart: this.sortablesStart,
            onComplete: this.sortablesComplete
        });
                
        /* Make the first item focusable */
        this.list.getChildren('li')[0].setProperty('tabindex', 0);
        
        /* Add event listeners to monitor the items */
        this.list.addEvent('mousedown:relay(li)', function(event, target) {
            this.list.getChildren('li.move').removeClass('move');
            var oldactive = this.list.getChildren('li:focus');
            target.setProperty('tabindex', 0).addClass('move').focus();
            oldactive.setProperty('tabindex', -1);
        }.bind(this));

        this.list.addEvent('mouseup:relay(li)', function() {
            this.list.getChildren('li.move').removeClass('move');
        }.bind(this));
        
        this.list.addEvent('blur:relay(li)', function() {
            (function() { 
                if (this.list.getChildren('li:focus').length == 0)
                {
                    this.list.getChildren('li.move').removeClass('move');
                    this.shift = false;
                }
            }.bind(this)).delay(100);
        }.bind(this));
        
        /* Add keydown event */
        this.list.addEvent('keydown', function(event) {
            switch (event.code) {
                case 16: 
                    this.shift = true;
                    this.list.getChildren('li:focus').addClass('move').setProperty('aria-grabbed', 'true');
                    break;
                case 38:
                    this.arrowup(event);
                    break;
                case 40:
                    this.arrowdown(event);
                    break;
            }
        }.bind(this));
        
        /* Add keyup event */
        this.list.addEvent('keyup', function(event) {
            if (event.code == 16)
            {
                this.shift = false;
                this.list.getChildren('li.move').removeClass('move').setProperty('aria-grabbed', 'false');
            }
        }.bind(this));
    },

    arrowup: function(event) {
        /* Stop the default behavior of the arrow key */
        event.stop();

        /* Store active and previous item */
        var active = this.list.getChildren('li:focus')[0];
        var prev = active.getPrevious('li');
        
        /* Return if active is the first item */
        if (!prev) return;
        
        if (this.shift)
        {
            /* Swap the two items and update sortables */
            /* this.sortables.addItems(active.clone().inject(prev, 'before').focus()); */
            var clone = active.clone();
            clone.inject(prev, 'before').focus();
            this.sortables.addItems(clone);
            this.sortables.removeItems(active).destroy();
        }
        else
        {
            /* Move focus up */
            prev.setProperty('tabindex', 0).focus();
            active.setProperty('tabindex', -1);
        }
    },
    
    arrowdown: function(event) {
        /* Stop the default behavior of the arrow key */
        event.stop();
        
        /* Store active and next item */
        var active = this.list.getChildren('li:focus')[0];
        var next = active.getNext('li');
        
        /* Return if active is the last item */
        if (!next) return;
        
        if (this.shift)
        {
            /* Swap the items and update sortables */
            /* this.sortables.addItems(active.clone().inject(next, 'after').focus()); */
            var clone = active.clone();
            clone.inject(next, 'after').focus();
            this.sortables.addItems(clone);
            this.sortables.removeItems(active).destroy();
        }
        else
        {
            /* Move focus down */
            next.setProperty('tabindex', 0).focus();
            active.setProperty('tabindex', -1);
        }
    },
    
    sortablesStart: function(element, clone) {
        clone.addClass('move').focus();
    },
    
    sortablesComplete: function(element) {
        element.removeClass('move').focus();
    }
        
});