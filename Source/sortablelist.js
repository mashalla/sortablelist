/*
---

name: Accessible SortableList

license: MIT-style license.

authors: Boris Wetzel

...
*/

var SortableList = new Class({

    Implements: [Options, Events],

    /* Default options for Sortables - See http://mootools.net/docs/more/Drag/Sortables */
    options: {
        clone: true,
        revert: true,
        opacity: 0.7
    },

    initialize: function(list, options) {
    
        this.setOptions(options);
        
        /* Remeber the list */
        this.list = $$(list)[0];
        
        /* For Drag and Drop - See http://mootools.net/docs/more/Drag/Sortables */
        this.sortables = new Sortables(list, this.options);
        
        /* Add tabindex to the list, only the list itself may get focus */
        this.list.setProperty('tabindex', 0);
        
        /* Add active class to the first item in the list (virtual focus)*/
        this.list.getChildren('li')[0].addClass("active");
        
        /* Status of the shift key */
        this.shift = false;
        
        /* Add keydown event */
        this.list.addEvent('keydown', function(event) {
            if (event.code == 16)
            {
                this.shift = true;
                this.list.getChildren('li.active').addClass('move');
            }
            else if (event.code == 38)
            {
                this.arrowup(event);
            }
            else if (event.code == 40)
            {
                this.arrowdown(event);
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
            active.removeClass("active");
            prev.addClass("active");
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
            this.sortables.removeItems(active.destroy());
        }
        else
        {
            /* Move the virtual focus down */
            active.removeClass("active");
            next.addClass("active");
        }
    }
        
});