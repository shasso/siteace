import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

//Websites = new Mongo.Collection("websites");

//// On Client and Server
//// create index for EasySearch component
//// basically turns Mongo collection (which natively supports full-text search, but
//// Meteor mongo does not) into searchable collection by any field we specify
//// good documenection at: http://matteodem.github.io/meteor-easy-search/
////
//WebsitesIndex = new EasySearch.Index({
//    collection: Websites,
//    fields: ['title', 'description'],
//    engine: new EasySearch.Minimongo({
//        sort: function(){
//            return {upVote:-1, createOn:-1};
//        }
//    })
//});


//// set up security on Websites collections
//Websites.allow({
//    insert: function (userId, doc) {
//        console.log("testing security on  insert");

//        if (Meteor.user()) { // users are logged in       
//            // the user is logged in, the image has the correct user id
//            return true;
//        }
//        else { // user is not logged in
//            return false;
//        }
//    },
//    update: function (userId, doc) {
//        console.log("testing security on  insert");

//        if (Meteor.user()) { // users are logged in 
//            // the user is logged in, the image has the correct user id
//            return true;
//        }
//        else { // user is not logged in
//            return false;
//        }
//    }
//});


if (Meteor.isClient) {
    /// routing
    Router.configure({
        layoutTemplate: 'ApplicationLayout'
    });

    Router.route('/', function () {
        this.render('welcome', {
            to: "main"
        });
    });

    Router.route('/websitelists', function () {
        this.render('navbar', {
            to: "navbar"
        });
        this.render('website_form', {
            to: "form"
        });
        this.render('website_list', {
            to: "main"
        });
    });

    Router.route('/detail/:_id', function () {
        this.render('navbar', {
            to: "navbar"
        });
        this.render('detail', {
            to: "main",
            data: function () {
                return Websites.findOne({ _id: this.params._id });
            }
        });
    });

    /// accounts config
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
    });

    /////
    // template helpers 
    /////

    // helper function that returns all available websites
    Template.website_list.helpers({
        websites: function () {
            return Websites.find({}, { sort: { upVote: -1 } });        
        },
        comments: function () {
            return Websites.find({}, { comments: true });
        },
        websitesIndex: function () {
            return WebsitesIndex;
        }
    });

    Template.oneComment.helpers({
        getUser: function (user_id) {
            console.log("passed user id: " + user_id);
            var user = Meteor.users.findOne({ _id: user_id });
            //console.log("user: " + user.username);
            if (user) {
                return user.username;
            }
            else {
                return "anonymous";
            }
        }
    });


    /////
    // template events 
    /////

    Template.website_item.events({
        "click .js-upvote": function (event) {
            // example of how you can access the id for the website in the database
            // (this is the data context for the template)
            var website_id = this._id;
            console.log("Up voting website with id " + website_id);
            Websites.update({ _id: website_id }, { $inc: { upVote: 1 } }
           );
            return false;// prevent the button from reloading the page
        },
        "click .js-downvote": function (event) {

            // example of how you can access the id for the website in the database
            // (this is the data context for the template)
            var website_id = this._id;
            console.log("Down voting website with id " + website_id);

            // put the code in here to remove a vote from a website!
            Websites.update({ _id: website_id }, { $inc: { downVote: -1 } }
           );
            return false;// prevent the button from reloading the page
        }
    })

    Template.website_form.events({
        "click .js-toggle-website-form": function (event) {
            $("#website_form").toggle('slow');
        },
        "submit .js-save-website-form": function (event) {

            // here is an example of how to get the url out of the form:
            var url = event.target.url.value;
            var title = event.target.title.value;
            var description = event.target.description.value;
            console.log("The url they entered is: " + url);
            console.log("title: " + title);
            console.log("description: " + description);

            //  put your website saving code in here!	
            if (Meteor.user()) {
                Websites.insert({
                    url: url,
                    title: title,
                    description: description,
                    createdOn: new Date(),
                    createdBy: Meteor.user()._id

                })
            }
            return false;// stop the form submit from reloading the page
        }
    });

    /// details 
    Template.comment_form.events({
        "click .js-toggle-comment-form": function (event) {
            $("#comment_form").toggle('slow');
        },
        "submit .js-save-comment-form": function (event) {

            // here is an example of how to get the comment out of the form
            var website_item_id = this._id;
            var comment = event.target.comment.value;
            console.log("comment: " + comment + " for id: " + website_item_id);


            if (Meteor.user()) {
                //  put your website saving code in here!	
                var user_comment = {
                    comment: comment,
                    createdOn: new Date(),
                    createdBy: Meteor.user()._id
                };

                Websites.update({ _id: website_item_id }, { $addToSet: { comments: user_comment } });
            }
            return false;// stop the form submit from reloading the page
        }
    });


    // Search box
    Template.navbar.helpers({
        websitesIndex: function () {
            return WebsitesIndex;
        },
        comments: function () {
            return Websites.find({}, { comments: true });
        }
    });

}


//if (Meteor.isServer) {
//    // start up function that creates entries in the Websites databases.
//    Meteor.startup(function () {
//        // code to run on server at startup
//        if (!Websites.findOne()) {
//            console.log("No websites yet. Creating starter data.");
//            Websites.insert({
//                title: "Goldsmiths Computing Department",
//                url: "http://www.gold.ac.uk/computing/",
//                description: "This is where this course was developed.",
//                createdOn: new Date()
//            });
//            Websites.insert({
//                title: "University of London",
//                url: "http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
//                description: "University of London International Programme.",
//                createdOn: new Date()
//            });
//            Websites.insert({
//                title: "Coursera",
//                url: "http://www.coursera.org",
//                description: "Universal access to the world’s best education.",
//                createdOn: new Date()
//            });
//            Websites.insert({
//                title: "Google",
//                url: "http://www.google.com",
//                description: "Popular search engine.",
//                createdOn: new Date()
//            });
//        }
//    });
//}
