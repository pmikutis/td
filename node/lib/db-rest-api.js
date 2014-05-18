// API implementation

var common = require('./common')

var uuid    = common.uuid
var mongodb = common.mongodb


var tripcoll = null

var util = {}

util.validate = function( input ) {
  return input.tripName
}

util.fixid = function( doc ) {
  if( doc._id ) {
    doc.id = doc._id.toString()
    delete doc._id
  }
  else if( doc.id ) {
    doc._id = new mongodb.ObjectID(doc.id)
    delete doc.id
  }
  return doc
}


exports.ping = function( req, res ) {
  var output = {ok:true,time:new Date()}
  res.sendjson$( output )
}


exports.echo = function( req, res ) {
  var output = req.query

  if( 'POST' == req.method ) {
    output = req.body
  }

  res.sendjson$( output )
}


exports.rest = {

  create: function( req, res ) {
    var input = req.body
    
    if( !util.validate(input) ) {
      return res.send$(400, 'invalid')
    }

    var trip = {
      tripName: input.tripName,
      tripDescription: input.tripDescription,
      tripStartLat:input.tripStartLat, 
      tripStartLong:input.tripStartLong,
      tripEndLat:input.tripEndLat,
      tripEndLong:input.tripEndLong,
      showDistance:input.showDistance,
      tripDistance:input.tripDistance,
      usr:input.usr,
      passwd:input.passwd,
      created: new Date().getTime(),
    }

    tripcoll.insert(trip, res.err$(function( docs ){
      var output = util.fixid( docs[0] )
      res.sendjson$( output )
    }))
  },


  read: function( req, res ) {
    var input = req.params

    console.log(req.params)

    var query = util.fixid( {id:input.id} )
    tripcoll.findOne( query, res.err$( function( doc ) {
      if( doc ) {
        var output = util.fixid( doc )
        res.sendjson$( output )
      }
      else {
        res.send$(404,'not found')
      }
    }))
  },


  list: function( req, res ) {
    var input = req.query
    var output = []

    var query   = {}
    var options = {sort:[['created','desc']]}

    tripcoll.find( query, options, res.err$( function( cursor ) {
      cursor.toArray( res.err$( function( docs ) {
        output = docs
        output.forEach(function(item){
          util.fixid(item)
        })
        res.sendjson$( output )
      }))
    }))
  },


  update: function( req, res ) {
    //var id    = req.params.id
    var input = req.body
     var id = input.id
    
    if( !util.validate(input) ) {
      return res.send$(400, 'invalid')
    }

    var query = util.fixid( {id:id} )
    tripcoll.update( query, {$set:{
      tripName: input.tripName, 
      tripDescription: input.tripDescription, 
      tripStartLat:input.tripStartLat, 
      tripStartLong:input.tripStartLong,
      tripEndLat:input.tripEndLat,
      tripEndLong:input.tripEndLong,
      showDistance:input.showDistance,
      tripDistance:input.tripDistance,
      usr:input.usr,
      passwd:input.passwd 
    }}, res.err$( function( count ) {
      if( 0 < count ) {
        var output = util.fixid( doc )
        res.sendjson$( output )
      }
      else {
        console.log('404')
        res.send$(404,'not found')
      }
    }))
  },


  del: function( req, res ) {
    var input = req.params

    var query = util.fixid( {id:input.id} )
    tripcoll.remove( query, res.err$( function() {
      var output = {}
      res.sendjson$( output )
    }))
  }

}



exports.connect = function(options,callback) {
  var client = new mongodb.Db( options.name, new mongodb.Server(options.server, options.port, {}))
  client.open( function( err, client ) {
    if( err ) return callback(err);

    client.collection( 'trips', function( err, collection ) {
      if( err ) return callback(err);

      tripcoll = collection
      callback()
    })
  })
}


