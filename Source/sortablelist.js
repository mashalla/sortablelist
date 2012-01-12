/*
---

name: Accessible SortableList

license: MIT-style license.

authors: Boris Wetzel

...
*/

Element.implement({
    slFocus: function() {
        this.getSiblings('li').setProperty('tabindex', -1);
        this.setProperty('tabindex', 0).focus();
        return this;
    }
});

var SortableList = new Class({

    initialize: function(list, options) {
    
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
            onStart: function(element, clone) { clone.addClass('move').slFocus(); },
            onComplete: function(element) { element.removeClass('move').slFocus(); }
        });
                
        /* Make the first item focusable */
        this.list.getChildren('li')[0].setProperty('tabindex', 0);
        
        /* Add event listeners to monitor the items */
        this.list.addEvent('mousedown:relay(li)', function(event, target) {
            this.list.getChildren('li').removeClass('move').setProperty('aria-grabbed', 'false');
            target.slFocus().addClass('move').setProperty('aria-grabbed', 'false');
        }.bind(this));

        this.list.addEvent('blur:relay(li)', function() {
            /* Wait 100ms to check if the focus left the list */
            (function() { 
                if (this.list.getChildren('li:focus').length == 0)
                {
                    this.list.getChildren('li').removeClass('move').setProperty('aria-grabbed', 'false');
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
                this.list.getChildren('li').removeClass('move').setProperty('aria-grabbed', 'false');
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
            this.sortables.addItems(active.clone().inject(prev, 'before').slFocus());
            this.sortables.removeItems(active).destroy();
        }
        else
        {
            /* Move focus up */
            prev.slFocus();
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
            this.sortables.addItems(active.clone().inject(next, 'after').slFocus());
            this.sortables.removeItems(active).destroy();
        }
        else
        {
            /* Move focus down */
            next.slFocus();
        }
    }
       
});