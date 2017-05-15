Websites = new Mongo.Collection("websites");

// On Client and Server
// create index for EasySearch component
// basically turns Mongo collection (which natively supports full-text search, but
// Meteor mongo does not) into searchable collection by any field we specify
// good documenection at: http://matteodem.github.io/meteor-easy-search/
//
WebsitesIndex = new EasySearch.Index({
    collection: Websites,
    fields: ['title', 'description'],
    engine: new EasySearch.Minimongo({
        sort: function () {
            return { upVote: -1, createOn: -1 };
        }
    })
});


// set up security on Websites collections
Websites.allow({
    insert: function (userId, doc) {
        console.log("testing security on  insert");

        if (Meteor.user()) { // users are logged in       
            // the user is logged in, the image has the correct user id
            return true;
        }
        else { // user is not logged in
            return false;
        }
    },
    update: function (userId, doc) {
        console.log("testing security on  insert");

        if (Meteor.user()) { // users are logged in 
            // the user is logged in, the image has the correct user id
            return true;
        }
        else { // user is not logged in
            return false;
        }
    }
});
