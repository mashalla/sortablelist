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
    /* Not working?
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
        
        /* Remeber the list */
        this.list = $$(list)[0];
        
        /* For Drag and Drop - See http://mootools.net/docs/more/Drag/Sortables */
        this.sortables = new Sortables(list, {
            clone: true,
            revert: true,
            opacity: 0,
            onStart: this.sortablesStart,
            onComplete: this.sortablesComplete
        });
        
        /* Add tabindex to the list, only the list gets focus */
        this.list.setProperty('tabindex', 0);
        
        /* Add event listeners to monitor the items */
        this.list.addEvent('mousedown:relay(li)', function(event, target) {
            this.list.focus();
            this.list.getChildren('li.active').removeClass('active');
            this.list.getChildren('li.move').removeClass('move');
            target.addClass('active').addClass('move');
        }.bind(this));

        this.list.addEvent('mouseup:relay(li)', function() {
            this.list.getChildren('li.move').removeClass('move');
        }.bind(this));
        
        /* Add active class to the first item in the list (virtual focus)*/
        this.list.getChildren('li')[0].addClass('active');
        
        /* Status of the shift key */
        this.shift = false;
        
        /* Add keydown event */
        this.list.addEvent('keydown', function(event) {
            switch (event.code) {
                case 16: 
                    this.shift = true;
                    this.list.getChildren('li.active').addClass('move');
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
                this.list.getChildren('li.move').removeClass('move');
            }
        }.bind(this));
        
        /* Add blur event */
        this.list.addEvent('blur', function() {
            this.shift = false;
            this.list.getChildren('li.move').removeClass('move');
        }.bind(this));
    },

    arrowup: function(event) {
        /* Stop the default behavior of the arrow key */
        event.stop();

        /* Store active and previous item */
        var active = this.list.getChildren('li.active')[0];
        prev = active.getPrevious('li');
        
        /* Return if active is the first item */
        if (!prev) return;
        
        if (this.shift)
        {
            /* Swap the two items and update sortables */
            this.sortables.addItems(active.clone().inject(prev, 'before'));
            this.sortables.removeItems(active).destroy();
        }
        else
        {
            /* Move the virtual focus up */
            active.removeClass('active');
            prev.addClass('active');
        }
    },
    
    arrowdown: function(event) {
        /* Stop the default behavior of the arrow key */
        event.stop();
        
        /* Store active and next item */
        var active = this.list.getChildren('li.active')[0];
        next = active.getNext('li');
        
        /* Return if active is the last item */
        if (!next) return;
        
        if (this.shift)
        {
            /* Swap the items and update sortables */
            this.sortables.addItems(active.clone().inject(next, 'after'));
            this.sortables.removeItems(active).destroy();
        }
        else
        {
            /* Move the virtual focus down */
            active.removeClass('active');
            next.addClass('active');
        }
    },
    
    sortablesStart: function(element, clone) {
        clone.addClass('active').addClass('move');
    },
    
    sortablesComplete: function(element) {
        this.list.getChildren('li.move').removeClass('move');
    }
        
});