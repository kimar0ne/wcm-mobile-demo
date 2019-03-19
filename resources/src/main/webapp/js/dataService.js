/**
<<<<<<< HEAD
* @author markdowney
*/
=======
 * @author markdowney
 */
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
/*jslint */
/*global openDatabase: true, $: true */
"use strict";

var dataService = (function () {
    //Load the database
    var db;

    function errorHandler(transaction, error) {
        alert('Oops. Error was ' + error.message + ' (Code ' + error.code + ')');
        return true;
    }

    return {

<<<<<<< HEAD
        //return the child categories and article of the category passed as an argument
        getCategoriesFromRest: function (currentCategory, callback) {

=======
        //return the child categories and article of the category passed as an argument
        getCategoriesFromRest: function (currentCategory, callback) {

            //alert("start rest call to " + "/ecmdemo/rest-ecmdemo/categories/all/repository/" + currentCategory + "/");
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
            $.getJSON("/ecmdemo/rest-ecmdemo/categories/all/repository/" + currentCategory + "/", callback);

        },



        //return the info about the article
        getArticleFromRest: function (articlePath, callback) {

            $.getJSON("/ecmdemo/rest-ecmdemo/categories/articles/repository/" + articlePath, callback);

<<<<<<< HEAD
        },

        //Initialise the database
=======
        },

        //Initialise the database
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
        startDatabase: function () {

            var shortName = 'eXo',
                version = '1.0',
                displayName = 'eXo',
                maxSize = 65536;

            db = openDatabase(shortName, version, displayName, maxSize);

            db.transaction(
                function (transaction) {
                    transaction.executeSql(
<<<<<<< HEAD
                        'CREATE TABLE IF NOT EXISTS categories ' +
                        ' (name TEXT NOT NULL, ' +
                        ' parentPath TEXT NOT NULL, ' +
                        ' icon TEXT, type TEXT NOT NULL,' +
						' local_path TEXT NOT NULL, ' +
						' PRIMARY KEY(name, parentPath));',
                        [], null, errorHandler);

                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS articles ' +
                        ' (name TEXT NOT NULL, ' +
                        ' parentPath TEXT, content TEXT NOT NULL, ' +
                        ' icon TEXT, local_path TEXT NOT NULL, ' +
						' PRIMARY KEY(name, parentPath));',
                        [], null, errorHandler);
                }
            );
        },


        //Create a category entry in the database
        createCategoryEntry: function (parentId, entry, local_path) {

            db.transaction(
                function (transaction) {
                    transaction.executeSql(
                             'INSERT OR REPLACE INTO categories (name, parentPath, icon, type, local_path) VALUES (?, ?, ?, ?, ?);',
                        [entry.name, parentId, entry.icon, entry.type, local_path], null, errorHandler
=======
                        'CREATE TABLE IF NOT EXISTS categories '  +
                        '  (name TEXT NOT NULL, '  +
                        '   parentPath TEXT NOT NULL, '  +
                        '   icon TEXT, type TEXT NOT NULL, PRIMARY KEY(name, parentPath));',
                        [], null, errorHandler);

                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS articles '  +
                        '  (name TEXT NOT NULL, '  +
                        '   parent_path TEXT, content TEXT NOT NULL, '  +
                        '   icon TEXT, path TEXT NOT NULL PRIMARY KEY);',
                        [], null, errorHandler);
                }
            );
        },


        //Create an entry in the database
        createCategoryEntry: function (parentId, entry) {

            db.transaction(
                function (transaction) {
                    transaction.executeSql(
                             'INSERT OR REPLACE INTO categories (name, parentPath, icon, type) VALUES (?, ?, ?, ?);',
                        [entry.name, parentId, entry.icon, entry.type], null, errorHandler
                    );
                }
            );
            return false;
        },

        //Create an article entry
        createArticleEntry: function (parentId, entry) {

            db.transaction(
                function (transaction) {
                    transaction.executeSql(
                             'INSERT OR REPLACE INTO articles (name, parent_path, content, icon, path) VALUES (?, ?, ?, ?, ?);',
                        [entry.name, entry.parentPath, entry.content, entry.icon, parentId], null, errorHandler
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
                    );
                }
            );
            return false;
        },

<<<<<<< HEAD
        //Create an article entry
        createArticleEntry: function (parentId, entry, local_path) {
=======
        //get all child categories of 'path' from database
        getCategoriesFromDatabase: function (path, callback) {
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4

            db.transaction(
                function (transaction) {
                    transaction.executeSql(
<<<<<<< HEAD
                             'INSERT OR REPLACE INTO articles (name, parentPath, content, icon, local_path) VALUES (?, ?, ?, ?, ?);',
                        [entry.name, parentId, entry.content, entry.icon, local_path], null, errorHandler
                    );
                }
            );
            return false;
        },

        //get all child categories of 'path' from database
        getCategoriesFromDatabase: function (path, callback) {
=======
                        'SELECT * FROM categories WHERE parentPath=?;', [path],
                        function (transaction, result) {
                            callback(result);
                        }, errorHandler);
                }
            );
        },


        //get an article from database
        getArticleFromDatabase: function (path, callback) {
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4

            db.transaction(
                function (transaction) {
                    transaction.executeSql(
<<<<<<< HEAD
                        'SELECT * FROM categories WHERE local_path=?;', [path],
=======
                        'SELECT * FROM articles WHERE path=?;', [path],

>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
                        function (transaction, result) {
                            callback(result);
                        }, errorHandler);
                }
<<<<<<< HEAD
            );
        },


        //get an article from database
        getArticleFromDatabase: function (path, callback) {

            db.transaction(
                function (transaction) {
                    transaction.executeSql(
                        'SELECT * FROM articles WHERE local_path=?;', [path],

                        function (transaction, result) {
                            callback(result);
                        }, errorHandler);
                }
            );
        },



        //delete all entries
        deleteEntries: function () {

            db.transaction(
                function (transaction) {
                    transaction.executeSql('DELETE FROM categories;', null, errorHandler);
                    transaction.executeSql('DELETE FROM articles;', null, errorHandler);
                }

            );
        },


    };
}());
=======
            );
        },



        //delete all entries
        deleteEntries: function () {

            db.transaction(
                function (transaction) {
                    transaction.executeSql('DELETE FROM categories;', null, errorHandler);
                    transaction.executeSql('DELETE FROM articles;', null, errorHandler);
                }

            );
        },

        //drop entries
        dropEntries: function () {

            db.transaction(
                function (transaction) {
                    transaction.executeSql('DROP TABLE entries;', null, errorHandler);
                }
            );
        }
    };
}());
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
