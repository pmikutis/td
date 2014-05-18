_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g,
	escape: /\{\{-(.+?)\}\}/g,
	evaluate: /\{\{=(.+?)\}\}/g
};

function logargs() {
  console.log(arguments)
}


var browser = {
	android: /Android/.test(navigator.userAgent)
}
browser.iphone = !browser.android



function pd( func ) {
	return function( event ) {
		event.preventDefault()
		func && func(event)
	}
}

document.ontouchmove = pd()

var app = {
	view: {},
	model: {}
}

var bb = {
	view: {},
	model: {}
}



bb.init = function() {


     var Router = Backbone.Router.extend({
        routes : {
            'settings' : 'showSettings',
            'main' : 'showMain'
        },
        showSettings : function() {
            $('div.main').hide();
            $('div.settings').show();
        },
        showMain : function() {
            $('div.settings').hide();
            $('div.main').show();
            
        }
    });
/*
	var swipeon = false


	var scrollContent = {
		scroll: function() {
			var self = this
			setTimeout( function() {
				if( self.scroller ) {
					self.scroller.refresh()
				}		
				else {
					self.scroller = new iScroll( $("div[data-role='content']")[0] )
				}
			},500)
		}
	}

*/

	bb.model.State = Backbone.Model.extend(_.extend({
		defaults: {
			items: 'loading'
		}
	}))



	bb.model.TripDay = Backbone.Model.extend(_.extend({
		defaults: {
			dayLocation: '',
			dayDescription: '',
            dayDistance: '',
            dayNotes: '',
            dayPhotos: new bb.model.Photos()
		},
		initialize: function() {
			console.log('bb.model.TripDay - initialize')
			var self = this
			_.bindAll(self)
		}		
	}))





    bb.model.Photo = Backbone.Model.extend(_.extend({
        defaults: {
            photoName: '',
            photoURL: '',
            photoDate: '',
        },
        initialize: function() {
            console.log('bb.model.Photo - initialize')
            var self = this
            _.bindAll(self)
        }       
    }))





    bb.model.Trip = Backbone.Model.extend(_.extend({
        defaults: {
            dayLocation: '',
            dayDescription: '',
            dayDistance: '',
            dayNotes: '',
        },
        initialize: function() {
            console.log('bb.model.TripDay - initialize')
            var self = this
            _.bindAll(self)
            this.dayPhotos = new Photos;
            this.dayPhotos.url = 'api/'
        }       
    }))





    bb.model.Photos = Backbone.Collection.extend(_.extend({
        model: bb.model.Photo,
        url: '/api/rest/Trips/:trip/photos',
        //localStorage: new Store("items"),

        initialize: function() {
            console.log('bb.model.Photos - initialize')
            var self = this
            _.bindAll(self)
            self.count = 0
            self.on('reset', function() {
                console.log('bb.model.Photos - reset')
                self.count = self.length
            })
        },

        additem: function(photoName, photoURL, photoDate) {
            console.log('bb.model.Photos - additem')
            var self = this
            var item = new bb.model.Photo({
            photoName: photoName,
            photoURL: photoURL,
            photoDate: photoDate
        })
        console.log('bb.model.Photos - adding item.')
        self.add(item)
        console.log('bb.model.Photos - item added.')
        self.count++
        item.save()
        /*
        item.save({
            success : function() { addNewRow();
            }
        });
*/
        console.log('bb.model.Photos - done save.')
        }
    }))






	bb.model.Trips = Backbone.Collection.extend(_.extend({
		model: bb.model.Item,
        url: '/api/rest/todo',
		//localStorage: new Store("items"),

		initialize: function() {
			console.log('bb.model.Items - initialize')
			var self = this
			_.bindAll(self)
			self.count = 0
			self.on('reset', function() {
				console.log('bb.model.Items - reset')
				self.count = self.length
			})
		},

		additem: function(msg, gps_lat, gps_long) {
			console.log('bb.model.Items - additem')
			var self = this
			var item = new bb.model.Item({
			text: msg,
            gps_lat: gps_lat,
            gps_long: gps_long
		})
		console.log('bb.model.Items - adding item.')
		self.add(item)
		console.log('bb.model.Items - item added.')
		self.count++
        item.save()
        /*
		item.save({
            success : function() { addNewRow();
            }
        });
*/
        console.log('bb.model.Items - done save.')
		}
	}))



	bb.view.Head = Backbone.View.extend(_.extend({
		events: {
			'click #add': 'clickAdd',
			'click #cancel' : 'cancelTodoEntry',
			'click #save' : 'saveTodoEntry',
			'click #text' : 'enterText',
			'keyup #text' : 'keyupTodoText',
            'click #settings' : 'goToSettings',
            'click #goback' : 'goToHome',


		}, 

		initialize: function( items ) {
			console.log('bb.view.Head - initialize')
			var self = this
			_.bindAll(self) 
			self.items = items
			self.setElement("div[data-role='header']")
			self.elem = {
                add : self.$el.find('#add'),
                title : self.$el.find('#titlebar')
            }
            self.tm = {
                title : _.template(self.elem.title.html())
            }

            this.router = new Router();
            Backbone.history.start();
			
			self.elem.add.hide()
			app.model.state.on('change:items',self.render)
			self.items.on('sync',self.render)
		},

		render: function() {
			console.log('bb.view.Head - render')
			var self = this
			self.setElement("div[id='main']")
            self.elem = {
                add : self.$el.find('#add'),
                title : self.$el.find('#titlebar'),
                todotext : self.$el.find('#text'),
                cancel : self.$el.find('#cancel'),
                newitem : self.$el.find('#newitem')
            }

			var loaded = 'loaded' == app.model.state.get('items')
			self.elem.title.html( self.tm.title({
				title: loaded ? self.items.length+' Items' : 'Loading...'
			}) )
			if( loaded ) {
				self.elem.add.show()
			}
		},

		clickAdd : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='main']")

            self.elem = {
                add : self.$el.find('#add'),
                cancel : self.$el.find('#cancel'),
                newitem : self.$el.find('#newitem'),
                todotext : self.$el.find('#text'),
                save : self.$el.find('#save')
            }

            self.elem.add.hide()
            self.elem.cancel.show()
            self.elem.newitem.slideDown()
            self.elem.todotext.focus()
            saveon = false
            app.activatesave(self.elem.todotext.val(), self.elem.save)
            //scroll()
        },

        cancelTodoEntry : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='main']")
            self.elem = {
                add : self.$el.find('#add'),
                cancel : self.$el.find('#cancel'),
                newitem : self.$el.find('#newitem')
            }
            self.elem.add.show()
            self.elem.cancel.hide()
            self.elem.newitem.slideUp()
        }, 

        saveTodoEntry : function() {
            console.log('tap #save - saving...')
            var self = this
            _.bindAll(self)

            self.setElement("div[id='main']")

            self.elem = {
                todotext : self.$el.find('#text'),
                add : self.$el.find('#add'),
                cancel : self.$el.find('#cancel'),
                newitem : self.$el.find('#newitem'),
                locate : self.$el.find('#locate')
            }
            var text = self.elem.todotext.val()
            var checkLocation = self.elem.locate.val()
            console.log('to locate? - '+checkLocation)
            gps_lat = ''
            gps_long =''

            if(checkLocation == "on") {
                navigator.geolocation.getCurrentPosition(
                    function(position){
                        gps_lat  = position.coords.latitude;
                        gps_long = position.coords.longitude;
                    },
                    function(error){
                        var txt;
                        switch(error.code) {
                          case error.PERMISSION_DENIED:    txt = 'Permission denied'; break;
                          case error.POSITION_UNAVAILABLE: txt = 'Position unavailable'; break;
                          case error.TIMEOUT:              txt = 'Position lookup timed out'; break;
                          default: txt = 'Unknown position.'
                        }
                        
                    }
                );                
            }

            setTimeout(function() {
                // Do rest after 0.1 second to get gps coordinates before continue
                console.log('lat: '+gps_lat + ' long: '+gps_long)

                if(0 == text.length) {
                    return
                }
                self.elem.todotext.val('').blur()

                console.log('tap #save - adding item...')
                self.items.additem(text, gps_lat, gps_long)
                self.elem.cancel.hide()
                self.elem.add.show()
                self.elem.newitem.slideUp()
                console.log('tap #save - done!')
            }, 100);
        },

        enterText : function() {
            var self = this

            _.bindAll(self)
            self.setElement("div[id='main']")
            self.elem = {
                todotext : self.$el.find('#text')
            }
            self.elem.todotext.focus()
        },

        keyupTodoText : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='main']")

            self.elem = {
                save : self.$el.find('#save'),
                todotext : self.$el.find('#text')
            }
            app.activatesave(self.elem.todotext.val(), self.elem.save)
        },

        goToSettings : function() {
            app.view.settings.render()
            this.router.navigate("settings");
        },

        goToHome : function() {
            this.router.navigate("main");
        }

	}))





	bb.view.List = Backbone.View.extend(_.extend({
		initialize: function( items ) {
			console.log('bb.view.List - initialize')
			var self = this
			_.bindAll(self)

			self.setElement('#list')
			self.items = items
			self.items.on('sync',self.render)
			app.model.state.on('change:items', self.render)			
		},

		render: function() {
			console.log('bb.view.List - render')
			var self = this
			self.$el.empty()
			self.items.each(function(item){
				self.appenditem(item)
			})
            self.scroll()
		},

		appenditem: function(item) {
			console.log('bb.view.List - appenditem')
			var self = this
			var itemview = new bb.view.Item({
				model: item
			})
			self.$el.append(itemview.el)
			self.scroll()
		}
	},scrollContent))




	bb.view.Item = Backbone.View.extend(_.extend({
		events : {
            "click .check" : "markItem",
            "swipe .tm" : "swipeItem",
            "click .delete" : "deleteItem"
        },


		initialize: function() {
			console.log('bb.view.Item - initialize')
			var self = this
			_.bindAll(self)
			self.render()
		},

		render: function() {
			console.log('bb.view.Item - render')
			var self = this
			console.log('bb.view.Item - appending id -> ' + self.model.attributes.id)
			var html = self.tm.item( self.model.toJSON(), gps_url = "http://maps.google.com/maps/api/staticmap?sensor=true&center="+
                    self.model.attributes.gps_lat+","+self.model.attributes.gps_long+
                    "&zoom=14&size=300x200&markers=color:red|"+self.model.attributes.gps_lat+","+self.model.attributes.gps_long)
			self.$el.append( html )
			app.markitem(self.$el, self.model.attributes.done)
		},

		markItem : function() {
            console.log('tap #check - marking...')
            var self = this
            _.bindAll(self)
            self.model.toggle()
            app.markitem(self.$el, self.model.attributes.done)
            console.log('tap #check - done!')
        },

        swipeItem : function() {
            console.log('swipe #item - iniating delete...')
            var self = this
            _.bindAll(self)

            var itemdata = self.model.attributes

            self.setElement("div[data-role='header']")

            self.elem = {
                add : self.$el.find('#add'),
                cancel : self.$el.find('#cancel')
            }

            if(!swipeon) {
                console.log('swipe #item - show delete button ' + itemdata.id)
                $('#delete_' + itemdata.id).show()
                self.elem.add.hide()
                self.elem.cancel.show()
                swipeon = true
            } else {
                self.elem.add.show()
                self.elem.cancel.hide()
                $('div.delete').hide()
                swipeon = false
            }
        },

        deleteItem : function() {
            console.log('tap #delete - deleting...')
            var self = this
            _.bindAll(self)
            console.log("ID: "+self.model.attributes.id + " element: li[id='" + self.model.attributes.id + "']")
            self.setElement("li[id='" + self.model.attributes.id + "']")
            console.log('will do self.remove()..')
            self.remove()
            console.log('will destroy model..')
            self.model.destroy();

            console.log('will unbind now...')
            self.unbind(); 
            console.log('will change to header...')
            self.setElement("div[data-role='header']")
            self.elem = {
                add : self.$el.find('#add'),
                cancel : self.$el.find('#cancel')
            }

            self.elem.add.show()
            self.elem.cancel.hide()
            app.view.list.render()
            app.view.head.render() 
            console.log('tap #delete - done!')
        },

	},{
		tm: {
			item: _.template( $('#list').html() )
		}
	}))




bb.view.Settings = Backbone.View.extend(_.extend({
        events : {
  //          "click .savefont" : "fontSave",
  //          "click .updatecredentials" : "credentialsUpadate"
        },
        initialize: function() {
            console.log('bb.view.Settings - initialize')
            var self = this         
            _.bindAll(self)
            self.setElement('#settingscontent')

        },

        render: function() {
            console.log('bb.view.Settings - render')
            var self = this
            self.setElement('#settingscontent')
            self.elem = {
                fontsize : self.$el.find('#fontsize')
            } 
            /*          
            if (localStorage.fontsize){
                console.log('fontsize found and is ' + localStorage.fontsize)
                self.$el.find('#fontsize').val(localStorage.fontsize)
            }
            else {
                console.log('fonsize not found..')
                localStorage.fontsize = "14";
                self.elem.fontsize.val("14")
            }
            */


        }
    }))




} // end of bb.init()



app.markitem = function(item, done) {
    item.find('span.check').html( done ? '&#10003;' : '&nbsp;')
    item.find('span.text').css({
        'text-decoration' : done ? 'line-through' : 'none'
    })
}


app.activatesave = function(currentTextIn, save) {
    console.log('app.activatesave')
    var textlen = currentTextIn.length

    if(!saveon && 0 < textlen) {
        save.css('opacity', 1)
        saveon = true
    } else if(0 == textlen) {
        save.css('opacity', 0.3)
        saveon = false
    }
}


app.init_browser = function() {
	if( browser.android ) {
		$("#main div[data-role='content']").css({
			bottom: 0
		})
	}
}




app.init = function() {
	console.log('start init')
	bb.init()
	app.init_browser()
	app.model.state = new bb.model.State()
	app.model.items = new bb.model.Items()
	app.view.head = new bb.view.Head(app.model.items)
	app.view.head.render()
	app.view.list = new bb.view.List(app.model.items)
	app.view.list.render()
    app.view.settings = new bb.view.Settings()
	app.model.items.fetch( {
		success: function() {
				app.model.state.set({items:'loaded'})
				app.view.list.render()
		}
	})
	console.log('end init')
}

$(app.init)