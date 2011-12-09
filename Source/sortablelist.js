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
            opacity: 0.5,
            onStart: this.sortablesStart,
            onComplete: this.sortablesComplete
        });
        
        /* Add tabindex to the list, only the list itself may get focus */
        this.list.setProperty('tabindex', 0);
        
        /* Add mousedown event to the list to recieve focus */
        this.list.addEvent('mousedown', function(event) {
            this.list.focus();
        }.bind(this));
        
        /* Add event listener to the list to monitor its items (recieve virtual focus) */
        this.list.addEvent('click:relay(li)', function(event, target) {
            this.list.getChildren('li.active').removeClass('active');
            target.addClass('active');
        }.bind(this));
        
        /* Add active class to the first item in the list (virtual focus)*/
        this.list.getChildren('li')[0].addClass('active');
        
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
        this.list.getChildren('li.active').removeClass('active');
        this.list.getChildren('li.move').removeClass('move');
        element.addClass('active').addClass('move');
        clone.addClass('active').addClass('move');
    },
    
    sortablesComplete: function(element) {
        this.list.getChildren('li.move').removeClass('move');
    }
        
});