_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g,
	escape: /\{\{-(.+?)\}\}/g,
	evaluate: /\{\{=(.+?)\}\}/g
};

function logargs() {
  console.log(arguments)
}

     var Router = Backbone.Router.extend({
        routes : {
            'settings' : 'showSettings',
            ':id/tripdetails' : 'showTripDetails'
        },
        showSettings : function() {
            window.location.href = "#settings";
            app.view.settings.render()
        },
        showTripDetails : function(id) {
            window.location.href = "#trip_details";
            app.view.tripDetails = new bb.view.TripDetails(app.model.trips.get(id))
            app.view.tripDetails.render()
        }
    });

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


bb.model.State = Backbone.Model.extend(_.extend({
		defaults: {
			items: 'loading'
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




    bb.model.Photos = Backbone.Collection.extend(_.extend({
        model: bb.model.Photo,
        //url: '/api/rest/trips/:tripid/photos',
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
            var photo = new bb.model.Photo({
            photoName: photoName,
            photoURL: photoURL,
            photoDate: photoDate
        })
        console.log('bb.model.Photos - adding item.')
        self.add(photo)
        console.log('bb.model.Photos - item added.')
        self.count++
        photo.save()
        /*
        item.save({
            success : function() { addNewRow();
            }
        });
*/
        console.log('bb.model.Photos - done save.')
        }
    }))





	bb.model.TripDay = Backbone.Model.extend(_.extend({
		defaults: {
			dayNumber: '',
			dayLocation: '',
			dayDescription: '',
            dayDistance: '',
            dayNotes: '',
		},
		initialize: function() {
			console.log('bb.model.TripDay - initialize')
			var self = this
			_.bindAll(self)
			self.dayPhotos = new bb.model.Photos
			self.dayPhotos.url = self.url + '/photos'
		}		
	}))



 bb.model.TripDays = Backbone.Collection.extend(_.extend({
        model: bb.model.TripDay,
        //url: '/api/rest/Trips/:trip/photos',
        //localStorage: new Store("items"),

        initialize: function() {
            console.log('bb.model.TripDays - initialize')
            var self = this
            _.bindAll(self)
            self.count = 0
            self.on('reset', function() {
                console.log('bb.model.TripDays - reset')
                self.count = self.length
            })
        },

        addTripDay: function(location, description, distance, notes) {
            console.log('bb.model.TripDays - addTripDay')
            var self = this
            var tripDay = new bb.model.TripDay({
            dayNumber: self.count + 1,
            dayLocation: location,
            dayDescription: description,
            dayDistance: distance,
            dayNotes: notes
        })
        console.log('bb.model.TripDays - adding day.')
        self.add(tripDay)
        console.log('bb.model.TripDays - day added.')
        self.count++
        tripDay.save()
        /*
        item.save({
            success : function() { addNewRow();
            }
        });
*/
        console.log('bb.model.TripDays - done save.')
        }
    }))





    bb.model.Trip = Backbone.Model.extend(_.extend({
        defaults: {
            tripName: '',
            tripDescription: '',
            tripStartLat: '',
            tripStartLong: '',
            tripEndLat: '',
            tripEndLong: '',
            showDistance: true,
            tripDistance: '',
            usr:'default',
            passwd: '' 
        },
        initialize: function() {
            console.log('bb.model.TripDay - initialize')
            var self = this
            _.bindAll(self)
            self.tripDays = new bb.model.TripDays;
            self.tripDays.url = self.url + '/tripdays'
            //console.log('tripdays url:' + self.TripDays.url)
        }       
    }))


//var usr = 'default'


	bb.model.Trips = Backbone.Collection.extend(_.extend({
		model: bb.model.Trip,
        url: '/api/rest/trips',
		//localStorage: new Store("items"),

		initialize: function() {
			console.log('bb.model.Trips - initialize')
			var self = this
			_.bindAll(self)
			self.count = 0
			self.on('reset', function() {
				console.log('bb.model.Trips - reset')
				self.count = self.length
			})
		},

		addTrip: function(tripName, tripDescription, tripStartLat, tripStartLong, tripEndLat,tripEndLong, showDistance,tripDistance, usr, passwd) {
			console.log('bb.model.Trips - addTrip')
			var self = this
			var trip = new bb.model.Trip({
			tripName: tripName,
            tripDescription: tripDescription,
            tripStartLat: tripStartLat,
            tripStartLong: tripStartLong,
            tripEndLat: tripEndLat,
            tripEndLong: tripEndLat,
            showDistance: showDistance,
            tripDistance: tripDistance,
            usr: usr,
            passwd: passwd
		})

//addTripDay: function(location, description, distance, notes) {
		trip.tripDays.addTripDay('Day 1', '', 0, '')
        console.log('bb.model.Trips - adding Trip.')

		self.add(trip)
		console.log('bb.model.Trips - Trip added.')
		self.count++
        trip.save()
        console.log('bb.model.Trips - done save.')
		}
	}))


bb.view.Index = Backbone.View.extend(_.extend({
		events: {
			'click #add_trip_btn': 'clickAdd',
            'click #settings_btn1': 'goToSettings'
			//'click #settings_btn' : 'goToSettings'
		}, 

		initialize: function( trips ) {
			console.log('bb.view.Index - initialize')
			var self = this
			_.bindAll(self) 
			self.trips = trips
			self.setElement("div[id='index']")
			self.elem = {
                add_trip : self.$el.find('#add_trip_btn'),
                settings : self.$el.find('#settings_btn')
            }

            //this.router = new Router();
            //Backbone.history.start();
			
			//self.elem.add_trip.hide()
			app.model.state.on('change:items',self.render)
			self.trips.on('sync',self.render)
		},

		render: function() {
			console.log('bb.view.Index - render')
			var self = this
			self.setElement("div[id='index']")
            self.elem = {
                add_trip : self.$el.find('#add_trip_btn'),
                settings : self.$el.find('#settings_btn')
            }

			var loaded = 'loaded' == app.model.state.get('items')
			if( loaded ) {
				self.elem.add_trip.show()
			}
			
		},

		clickAdd : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='add_trip']")
            console.log('Add button clicked')
        },


        goToSettings : function() {
            console.log('Settings button clicked')
            var self = this
            _.bindAll(self)
            self.setElement("div[id='index']")
            window.location.href = "#settings"
            setTimeout(function() {
                app.view.settings.render()
                app.view.settings.refreshSlider
            }, 100);
        }


        })) // end of index view


bb.view.TripList = Backbone.View.extend(_.extend({
        initialize: function( trips ) {
            console.log('bb.view.TripList - initialize')
            var self = this
            _.bindAll(self)

            self.setElement('#trip_list')
            self.trips = trips
            self.trips.on('sync',self.render)
            app.model.state.on('change:trips', self.render)         
        },

        render: function() {
            console.log('bb.view.TripList - render')
            var self = this
            self.$el.empty()
            self.trips.each(function(trip){
                self.appenditem(trip)
            })
            //self.scroll()
        },

        appenditem: function(trip) {
            console.log('bb.view.TripList - appenditem')
            var self = this
            var tripview = new bb.view.Trip({
                model: trip
            })
            self.$el.append(tripview.el)
            //self.scroll()
        }
    }))




bb.view.Trip = Backbone.View.extend(_.extend({
        events : {
            "click .tm" : "goToTripDetails"
          //  "swipe .tm" : "swipeItem",
           // "click .delete" : "deleteItem"
        },


        initialize: function() {
            console.log('bb.view.Trip - initialize')
            var self = this
            _.bindAll(self)
            self.render()
        },

        render: function() {
            console.log('bb.view.Trip - render')
            var self = this
            console.log('bb.view.Trip - appending id -> ' + self.model.attributes.id)
            var html = self.tm.trip(self.model.toJSON())
            self.$el.append( html )
        },

        goToTripDetails : function() {
            console.log('clicked the list item - will go to trip details...')
            var self = this
            _.bindAll(self)

            window.location.href = "#trip_details";
            app.view.tripDetails = new bb.view.TripDetails(self.model)
            app.view.tripDetails.render()
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
            self.setElement("div[id='index']")
            self.elem = {
                add_trip : self.$el.find('#add_trip_btn'),
                settings : self.$el.find('#settings_btn')
            }

            self.elem.add_trip.show()
            app.view.list.render()
            app.view.index.render() 
            console.log('tap #delete - done!')
        },

    },{
        tm: {
            trip: _.template( $('#trip_list').html() )
        }
    }))






bb.view.AddTrip = Backbone.View.extend(_.extend({
        events: {
            'click #save_new_trip_btn': 'saveTrip',
           // 'click #add_trip_cancel' : 'cancelAddTrip',
           // 'click #upload_photo_btn' : 'uploadPhoto',
            'click #take_picture_btn' : 'takePicture'
        }, 

        initialize: function( trips ) {
            console.log('bb.view.AddTrip - initialize')
            var self = this
            _.bindAll(self)
            self.trips = trips
            self.trips.on('sync',self.render)
            self.scroller = new iScroll( $("div[data-role='content']")[3],  { onBeforeScrollStart : null } );
            //app.model.state.on('change:trips', self.render)  
            /*self.setElement("div[id='add_trip']")
            self.elem = {
                save_trip : self.$el.find('#save_new_trip_btn'),
                cancel_trip : self.$el.find('#add_trip_cancel'),
                tripName : self.$el.find('#add_trip_name'),
                tripDescription : self.$el.find('#add_trip_description'),
                start_trip_here : self.$el.find('#start_trip_checkbox_1'),
                use_trip_distance : self.$el.find('#start_trip_checkbox_2'),
                upload_photo : self.$el.find('#upload_photo_btn'),
                take_picture : self.$el.find('#take_picture_btn')

            }
*/
            //this.router = new Router();
            //Backbone.history.start();
            
            //self.elem.add_trip.hide()
        },

        render: function() {
            console.log('bb.view.AddTrip - render')
            var self = this
            _.bindAll(self)
            self.setElement("div[id='add_trip']")
            self.elem = {
                save_trip : self.$el.find('#save_new_trip_btn'),
                cancel_trip : self.$el.find('#add_trip_cancel'),
                tripName : self.$el.find('#inp_tw23'),
                tripDescription : self.$el.find('#add_trip_description'),
                start_trip_here : self.$el.find('#start_trip_checkbox_1'),
                use_trip_distance : self.$el.find('#start_trip_checkbox_2'),
                upload_photo : self.$el.find('#upload_photo_btn'),
                take_picture : self.$el.find('#take_picture_btn')
            }
            if( self.scroller ) {
                self.scroller.refresh()
            }

            
        },

        saveTrip : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='add_trip']")
            console.log('Save trip button clicked')

            self.elem = {
                tripName : self.$el.find('#inp_tw23'),
                tripDescription : self.$el.find('#txt_tw24'),
                locate_start : self.$el.find('#locate_start'),
                show_distance : self.$el.find('#show_distance'),
                upload_photo : self.$el.find('#upload_photo_btn'),
                take_picture : self.$el.find('#take_picture_btn')
            }
            
            var name =  self.elem.tripName.val() //self.elem.tripName.val()
            var desc = self.elem.tripDescription.val()
            var checkLocation = self.elem.locate_start.val()
            var use_distance = self.elem.show_distance.val()
            console.log('to locate? - '+checkLocation)
            console.log('name: '+name+', desc: '+desc)
            gps_lat = ''
            gps_long =''

            if(checkLocation == "on") {
                console.log('will get gps..')
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
            else {console.log('not checked')}
            setTimeout(function() {
                // Do rest after 0.1 second to get gps coordinates before continue
                console.log('lat: '+gps_lat + ' long: '+gps_long)

                if(0 == name.length) {
                    return
                }
                self.elem.tripName.val('').blur()

                console.log('tap #save - adding item...')
//addTrip:(tripName, tripDescription, tripStartLat, tripStartLong, tripEndLat,tripEndLong, showDistance,tripDistance, usr, passwd)
                self.trips.addTrip(name, desc, gps_lat, gps_long, '', '', use_distance, 0, 'default','pass')
                console.log('tap #save - done!')
                var last_trip = self.trips.at(self.trips.length - 1);
                window.location.href = "#trip_details";
                app.view.tripDetails = new bb.view.TripDetails(last_trip)
                app.view.tripDetails.render()
            }, 100);
        },

        takePicture : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='add_trip']")
            console.log('Save trip button clicked')

            self.elem = {
                tripName : self.$el.find('#inp_tw23'),
                tripDescription : self.$el.find('#txt_tw24'),
                locate_start : self.$el.find('#locate_start'),
                show_distance : self.$el.find('#show_distance'),
                upload_photo : self.$el.find('#upload_photo_btn'),
                take_picture : self.$el.find('#take_picture_btn')
            }


            var pictureSource;   // picture source
            var destinationType; // sets the format of returned value 

            // Wait for PhoneGap to connect with the device
            //
            document.addEventListener("deviceready",onDeviceReady,false);

            // PhoneGap is ready to be used!
            //
            function onDeviceReady() {
                pictureSource=navigator.camera.PictureSourceType;
                destinationType=navigator.camera.DestinationType;
            }

            // Called when a photo is successfully retrieved
            //
            function onPhotoDataSuccess(imageData) {
              // Uncomment to view the base64 encoded image data
              // console.log(imageData);

              // Get image handle
              //
              var smallImage = document.getElementById('smallImage');

              // Unhide image elements
              //
              smallImage.style.display = 'block';

              // Show the captured photo
              // The inline CSS rules are used to resize the image
              //
              smallImage.src = "data:image/jpeg;base64," + imageData;
            }

            // Called when a photo is successfully retrieved
            //
            function onPhotoURISuccess(imageURI) {
              // Uncomment to view the image file URI 
              // console.log(imageURI);

              // Get image handle
              //
              var largeImage = document.getElementById('largeImage');

              // Unhide image elements
              //
              largeImage.style.display = 'block';

              // Show the captured photo
              // The inline CSS rules are used to resize the image
              //
              largeImage.src = imageURI;
            }

            // A button will call this function
            //
            function capturePhoto() {
              // Take picture using device camera and retrieve image as base64-encoded string
              navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
            }

            // A button will call this function
            //
            function getPhoto(source) {
              // Retrieve image file location from specified source
              navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
                destinationType: destinationType.FILE_URI,
                sourceType: source });
            }

            // Called if something bad happens.
            // 
            function onFail(message) {
              alert('Failed because: ' + message);
            }
            capturePhoto();

        } // end of upload photo

    


        })) // end of addtrip view





bb.view.TripDetails = Backbone.View.extend(_.extend({
        events: {
            'click #edit_det_btn': 'toggleEdit',
            'click #go_home_btn' : 'toggleHome',
            'click #upload_photo_btn' : 'uploadPhoto'
           /* 'click #take_picture_btn' : 'takePicture'
            'keyup #text' : 'keyupTodoText',
            'click #settings' : 'goToSettings',
            'click #goback' : 'goToHome',
*/

        }, 

        initialize: function( trip ) {
            console.log('bb.view.TripDetails - initialize')
            var self = this
            _.bindAll(self)
            self.trip = trip
            self.trip.on('sync',self.render)
            self.scroller = new iScroll( $("div[data-role='content']")[5],  { onBeforeScrollStart : null } );
            //app.model.state.on('change:trips', self.render)  
            self.setElement("div[id='trip_details']")
            self.elem = {
                edit_details : self.$el.find('#edit_det_btn'),
                go_home : self.$el.find('#go_home_btn'),
                tripDescription : self.$el.find('#txt_tw37'),
                trip_location : self.$el.find('#inp_tw40'),
                tripName : self.$el.find('#inp_tw36'),
                trip_photos : self.$el.find('#trip_photos')
            }
            self.state = 'read'
     

            //this.router = new Router();
            //Backbone.history.start();
            
            //self.elem.add_trip.hide()
        },

        render: function() {
            console.log('bb.view.TripDetails - render')
            var self = this
            _.bindAll(self)
            self.setElement("div[id='trip_details']")
            self.elem = {
                edit_details : self.$el.find('#edit_det_btn'),
                go_home : self.$el.find('#go_home_btn'),
                tripDescription : self.$el.find('#txt_tw37'),
                trip_location : self.$el.find('#inp_tw40'),
                tripName : self.$el.find('#inp_tw36'),
                trip_photos : self.$el.find('#trip_photos')
            }
            console.log(self.trip)
            self.elem.tripName.val(self.trip.get('tripName'))
            self.elem.tripName.prop("readonly",true);
            self.elem.tripDescription.val(self.trip.get('tripDescription'))
            self.elem.tripDescription.prop("readonly",true);
            if(self.trip.get('tripStartLat')){
                var location = 'Start GPS: '+ self.trip.get('tripStartLat')+' '+self.trip.get('tripStartLong');
            }
            else {var location = "No Location data entered"}
            self.elem.trip_location.val(location)
            self.elem.trip_location.prop("readonly",true);
            self.state = 'read'
            if( self.scroller ) {
                self.scroller.refresh()
            }

            
        },

        toggleEdit : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='trip_details']")
            self.elem = {
                edit_details : self.$el.find('#edit_det_btn'),
                go_home : self.$el.find('#go_home_btn'),
                tripDescription : self.$el.find('#txt_tw37'),
                trip_location : self.$el.find('#inp_tw40'),
                tripName : self.$el.find('#inp_tw36'),
                trip_photos : self.$el.find('#trip_photos')
            }
            if (self.state == 'read'){
                // Will switch to edit
                console.log('Edit Started')
                self.state = 'write'
                self.elem.edit_details.text("Save");
                self.elem.edit_details.attr('data-icon', 'gear');
                self.elem.go_home.text("Cancel");
                self.elem.go_home.attr('data-icon', 'delete');
                self.elem.go_home.attr("href", "#");
                self.elem.tripName.prop("readonly",false);
                self.elem.tripDescription.prop("readonly",false);
                self.elem.trip_location.prop("readonly",false);
            }
            else if (self.state == 'write') {
                //will save and switch to read mode
                console.log('Edit finished')
                self.state = 'read'
                self.trip.set({tripName: self.elem.tripName.val(), tripDescription: self.elem.tripDescription.val()});
                self.trip.save()
                self.elem.edit_details.text("Edit");
                self.elem.edit_details.attr('data-icon', '');
                self.elem.go_home.text("Go Back");
                self.elem.go_home.attr('data-icon', 'home');
                self.elem.go_home.attr("href", "#index");
                self.elem.tripName.prop("readonly",true);
                self.elem.tripDescription.prop("readonly",true);
                self.elem.trip_location.prop("readonly",true);
            }   
        },



        toggleHome : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='trip_details']")
            self.elem = {
                edit_details : self.$el.find('#edit_det_btn'),
                go_home : self.$el.find('#go_home_btn'),
                tripDescription : self.$el.find('#txt_tw37'),
                trip_location : self.$el.find('#inp_tw40'),
                tripName : self.$el.find('#inp_tw36'),
                trip_photos : self.$el.find('#trip_photos')
            }
            if (self.state == 'read'){
                // Will go home
                app.view.triplist.render()
                window.location.href = "#index";
            }
            else if (self.state == 'write') {
                //will load details again and switch to read mode
                console.log('Edit cancelled')
                self.elem.edit_details.text("Edit");
                self.elem.edit_details.attr('data-icon', '');
                self.elem.go_home.text("Go Back");
                self.elem.go_home.attr('data-icon', 'home');
                self.elem.go_home.attr("href", "#");
                self.elem.tripName.val(self.trip.get('tripName'))
                self.elem.tripName.prop("readonly",true);
                self.elem.tripDescription.val(self.trip.get('tripDescription'))
                self.elem.tripDescription.prop("readonly",true);
                if(self.trip.get('tripStartLat')){
                    var location = 'Start GPS: '+ self.trip.get('tripStartLat')+' '+self.trip.get('tripStartLong');
                }
                else {var location = "No Location data entered"}
                self.elem.trip_location.val(location)
                self.elem.trip_location.prop("readonly",true);
                self.state = 'read'
                if( self.scroller ) {
                    self.scroller.refresh()
                }
            }       
        },

        uploadPhoto  : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='trip_details']")
            self.elem = {
                edit_details : self.$el.find('#edit_det_btn'),
                go_home : self.$el.find('#go_home_btn'),
                tripDescription : self.$el.find('#txt_tw37'),
                trip_location : self.$el.find('#inp_tw40'),
                tripName : self.$el.find('#inp_tw36'),
                trip_photos : self.$el.find('#trip_photos')
            }
        }


        
        })) // end of index view







bb.view.Settings = Backbone.View.extend(_.extend({
        events: {
            'click #settings_done_btn': 'settingsDone'
        }, 

        initialize: function( ) {
            console.log('bb.view.Settings - initialize')
            var self = this
            _.bindAll(self) //$("div[data-role='content']")[1]
            self.scroller = new iScroll( $("div[data-role='content']")[1],  { onBeforeScrollStart : null } );
            //app.model.state.on('change:trips', self.render)  
            self.setElement("div[id='settings']")
            self.elem = {
                usr : self.$el.find('#inp_tw14'),
                passwd : self.$el.find('#inp_tw15'),
                conf_passwd : self.$el.find('#inp_tw16'),
                font_size : self.$el.find('#rng_tw17'),
                done_btn : self.$el.find('#settings_done_btn')
            }

            if (localStorage.getItem("td_usr")){
                app.settings = [localStorage.getItem("td_usr"), localStorage.getItem("td_passwd"), localStorage.getItem("td_font_size")]
            }
            else {
                app.settings = ['DefaultUser', '', '6']
            }
            console.log('1 font size: '+app.settings[2])
            //this.router = new Router();
            //Backbone.history.start();
        },

        render: function() {
            console.log('bb.view.Settings - render')
            var self = this
            _.bindAll(self)
            self.setElement("div[id='settings']")
            self.elem = {
                usr : self.$el.find('#inp_tw14'),
                passwd : self.$el.find('#inp_tw15'),
                conf_passwd : self.$el.find('#inp_tw16'),
                font_size : self.$el.find('#rng_tw17'),
                done_btn : self.$el.find('#settings_done_btn')
            }

            self.elem.usr.val(app.settings[0])
            self.elem.passwd.val(app.settings[1])
            self.elem.conf_passwd.val(app.settings[1])
            self.elem.font_size.val(app.settings[2])
            console.log('2 font size: '+self.elem.font_size.val())
            if( self.scroller ) {
                self.scroller.refresh()
            }          
        },

        refreshSlider : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='settings']")
            self.elem = {
                usr : self.$el.find('#inp_tw14'),
                passwd : self.$el.find('#inp_tw15'),
                conf_passwd : self.$el.find('#inp_tw16'),
                font_size : self.$el.find('#rng_tw17'),
                done_btn : self.$el.find('#settings_done_btn')
            }
            self.elem.font_size.val(app.settings[2]).slider("refresh")
        },


        settingsDone : function() {
            var self = this
            _.bindAll(self)
            self.setElement("div[id='settings']")
            self.elem = {
                usr : self.$el.find('#inp_tw14'),
                passwd : self.$el.find('#inp_tw15'),
                conf_passwd : self.$el.find('#inp_tw16'),
                font_size : self.$el.find('#rng_tw17'),
                done_btn : self.$el.find('#settings_done_btn')
            }
            var td_passwd = self.elem.passwd.val()
            var td_conf_passwd = self.elem.conf_passwd.val()
            if (td_passwd == td_conf_passwd){
                localStorage["td_usr"] = self.elem.usr.val()
                localStorage["td_passwd"] = self.elem.passwd.val()
                localStorage["td_font_size"] = self.elem.font_size.val()
                window.location.href = "#index";
            }
            else {alert ('Passwords do not match!')}
        }
        
        })) // end of settings view




	}	// end of bb.init function

app.init = function() {
	console.log('start init')
	bb.init()
	app.model.state = new bb.model.State()
	app.model.trips = new bb.model.Trips()
	app.view.index = new bb.view.Index(app.model.trips)
    app.view.index.render()
    app.view.triplist = new bb.view.TripList(app.model.trips)
    app.view.triplist.render()
    app.view.addtrip = new bb.view.AddTrip(app.model.trips)
    app.view.addtrip.render()
    app.view.settings = new bb.view.Settings()
    app.view.settings.render()
    app.model.trips.fetch( {
        success: function() {
                app.model.state.set({items:'loaded'})
                app.view.triplist.render()
        }
    })
	console.log('end init')
}

$(app.init)