/**
<<<<<<< HEAD
* @author markdowney
*/
=======
 * @author markdowney
 */
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
/*jslint */
/*global document:true, navigator:true, $: true, tmpl:true, dataService */
"use strict";

(function () {

<<<<<<< HEAD
    var online,
        taxonomyTree = "acme",
        jQT = new $.jQTouch({
            icon: 'css/img/exo.png',
            addGlossToIcon: false,
            statusBar: 'black'
        });


    //Adds the <li> element to the parent menu and creates a new <div> menu
    function categoryTemplate(parent_path, category, local_path) {

        if (parent_path === taxonomyTree) {
            parent_path = "home";
        }
		if (category.type === ""){
			category.type = "article";
		}

        if (category.type === "article") {

			$("#" + parent_path + " ul:first").append(tmpl("article_li_template", category));
			if (!($("#" + category.parentPath + "_" + category.name)).length) {
                $('body').append(tmpl("article_menu_template", category));
            }
			$("#"+category.parentPath+'_'+category.name.replace(/ /g, '-')).data("localpath", local_path + '/' + category.name);
        }

        else {

            $("#" + parent_path + " ul:first").append(tmpl("category_li_template", category));
			$('body').append(tmpl("category_menu_template", category));
			$("#"+category.parentPath+'_'+category.name.replace(/ /g, '-')).data("localpath", local_path + '/' + category.name);
			//alert("adding li template to: "+ $("#" + parent_path).attr('id')+" \nadd localPathData to div id: "+category.parentPath+'_'+(category.name).replace(/ /g, '-')+"  \nData is : "+ local_path + '/' + category.name+" \ntype: "+category.type);
=======
    var current_path = [],
        online,
        taxonomyTree = "acme",
        jQT = new $.jQTouch({

            icon: 'css/img/exo.png',
            addGlossToIcon: false,
            //startupScreen: 'jqt_startup.png',
            statusBar: 'black'
        });


    //Adds the <li> element to the parent menu and creates a new <div> menu
    function categoryTemplate(parent_path, category) {


        if (parent_path === "_" + taxonomyTree) {
            parent_path = "home";
        }

        if (category.type === "article") {
            $("#" + parent_path + " ul:first").append(tmpl("article_li_template", category));
            if (!($("#" + category.parentPath + "_" + category.name)).length) {
                $('body').append(tmpl("article_menu_template", category));
            }
        }
        else {
            $("#" + parent_path + " ul:first").append(tmpl("category_li_template", category));
            $('body').append(tmpl("category_menu_template", category));
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
        }
    }


<<<<<<< HEAD



    //foreach category, create entry if online and apply template
    function addCategories(parent_id, categories, local_path) {

        for (var i = 0; i < categories.length; i += 1) {

			categories[i].parentPath = categories[i].parentPath.replace(/\//g, '_').replace(/ /g, '-');

            if (online) {
                dataService.createCategoryEntry(parent_id, categories[i], local_path);
            }
            categoryTemplate(parent_id, categories[i], local_path);
        }
    }




    //handles a click on a category
    function handleCategoryLink(category_id, current_path) {


        //if menu is empty, load data
        if (!$("#" + category_id + " ul li").length) {

            //if online, get all childs fromREST service
            if (online) {

                dataService.getCategoriesFromRest(current_path, function (childCategories) {
                    addCategories(category_id, childCategories.lstNode, current_path);
=======
    //foreach category, create entry if online and apply template
    function addCategories(parent_id, categories) {

        for (var i = 0; i < categories.length; i += 1) {
            categories[i].parentPath = categories[i].parentPath.replace(/\//g, '_').replace(/ /g, '-');
            if (online) {
                dataService.createCategoryEntry(parent_id, categories[i]);
            }
            categoryTemplate(parent_id, categories[i]);
        }
    }

    //handles a click on a category
    function handleCategoryLink(category_link) {

        current_path.push(category_link.substring(category_link.lastIndexOf('_') + 1));
        alert("pushed: " + current_path.join('/'));

        //if menu is empty, load data
        if (!$("#" + category_link + " ul li").length) {

            //if online, get all childs fromREST service
            if (online) {

                dataService.getCategoriesFromRest(current_path.join('/'), function (childCategories) {
                    addCategories(category_link, childCategories.lstNode);
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
                });
            }
            else {
                //if offline, load from db
<<<<<<< HEAD
                dataService.getCategoriesFromDatabase(current_path, function (result) {

                    var categories = [], i, row;
                    for (i = 0; i < result.rows.length; i += 1) {
                        row = result.rows.item(i);
                        categories.push(row);
                    }
                    addCategories(category_id, categories, current_path);
=======
                dataService.getCategoriesFromDatabase(category_link, function (result) {

                    var categories = [], i, row;
                    for (i = 0; i < result.rows.length; i += 1) {
                        row = result.rows.item(i);
                        categories.push(row);
                    }
                    addCategories(category_link, categories);

>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
                });
            }
        }
    }

<<<<<<< HEAD

    //handles a click on an article
    function handleArticleLink(article_id, current_path) {

        //Check if article already exists
        if (!$("#" + article_id + " .article_content p").length) {
            if (online) {

                dataService.getArticleFromRest(current_path, function (article) {
                    $("#" + article_id + ' .article_content').append('<p>').append(article.content).append('</p>');
                    var path = (article.parentPath + "/" + article.name).replace(/\//g, '_').replace(/ /g, '-');
                    dataService.createArticleEntry(article_id, article, current_path);
                });
            } else {
                dataService.getArticleFromDatabase(current_path, function (result) {
					var article = result.rows.item(0);
                    $("#" + article_id + ' .article_content').append('<p>').append(article.content).append('</p>');
=======
    //handles a click on an article
    function handleArticleLink(article_link) {

        //get category childs of selected items
        current_path.push(article_link.substring(article_link.lastIndexOf('_') + 1));
        alert("pushed: " + current_path.join('/'));

        //Check if article already exists
        if (!$("#" + article_link + " .article_content p").length) {
            if (online) {

                dataService.getArticleFromRest(current_path.join('/'), function (article) {
                    $("#" + article_link + ' .article_content').append('<p>').append(article.content).append('</p>');
                    var path = (article.parentPath + "/" + article.name).replace(/\//g, '_').replace(/ /g, '-');
                    dataService.createArticleEntry(article_link, article);
                });
            } else {
                dataService.getArticleFromDatabase(article_link.substring(article_link.lastIndexOf('_')), function (result) {
                    var article = result.rows.item(0);
                    $("#" + article_link + ' .article_content').append('<p>').append(article.content).append('</p>');
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4

                });
            }
        }
    }
<<<<<<< HEAD





    $(document).ready(function () {

        online = navigator.onLine;

	    $('#taxonomyInput').attr('placeholder', taxonomyTree);
        $('#title').append(" (online: " + online + ")");

        dataService.startDatabase();

        //if online mode, get root categories and add to menu
        if (online) {

            dataService.getCategoriesFromRest(taxonomyTree, function (categories) {
				addCategories(taxonomyTree, categories.lstNode, taxonomyTree);
            });
        }


        //if offline, load from db and add to menu
        else {

            dataService.getCategoriesFromDatabase(taxonomyTree, function (result) {

                var categories = [], i, row;
                for (i = 0; i < result.rows.length; i += 1) {
                    row = result.rows.item(i);
                    categories.push(row);
                }
                addCategories(taxonomyTree, categories, taxonomyTree);
            });
        }

        $('.category').live('pageAnimationStart', function (e, info) {
            if (info.direction === 'in') {
				handleCategoryLink($(this).attr('id'), $(this).data("localpath"));
            }
=======

    //handle back button
    function handleBackButton() {
        current_path.pop();
        alert("poped: " + current_path.join('/'));
    }


    $(document).ready(function () {

        online = navigator.onLine;

        $('#title').append(" (online: " + online + ")");

        dataService.startDatabase();
        //deleteEntries();

        //Define the root taxonomyTree

        //initialize the current path
        current_path.push(taxonomyTree);

        //if online mode, get root categories and add to menu
        if (online) {
            dataService.getCategoriesFromRest(current_path.join('/'), function (categories) {
                addCategories("_" + taxonomyTree, categories.lstNode);
            });
        }

        //if offline, load from db and add to menu
        else {

            dataService.getCategoriesFromDatabase("_" + taxonomyTree, function (result) {

                var categories = [], i, row;
                for (i = 0; i < result.rows.length; i += 1) {
                    row = result.rows.item(i);
                    categories.push(row);
                }
                addCategories("_" + taxonomyTree, categories);
            });
        }

        $('.category').live('pageAnimationStart', function (e, info) {
            if (info.direction === 'in') {
                handleCategoryLink($(this).attr('id'));
            } else if (info.direction === 'out') {
                handleBackButton();
            }
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
        });

        $('.article').live('pageAnimationStart', function (e, info) {
            if (info.direction === 'in') {
<<<<<<< HEAD
                handleArticleLink($(this).attr('id'), $(this).data("localpath"));
            }
        });

		$('#taxonomyButton').tap (function (e, info) {
           taxonomyTree = $('#taxonomyInput').attr('placeholder');
=======
                handleArticleLink($(this).attr('id'));
            } else if (info.direction === 'out') {
                handleBackButton();
            }
>>>>>>> 7b653f0b28fe86c6f6e85c2c0309a8833d5110d4
        });

    });

}());