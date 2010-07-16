
/**
 * @author markdowney
 */


var current_path = [];
var online;

/*jslint white:false, undef:false */

$(document).ready(function(){ 

	online = navigator.onLine;
	
	$('#title').append(" (online: "+online+")");
	
	startDatabase();
	//deleteEntries();	
		
	//Define the root taxonomyTree
	var taxonomyTree = "acme";
		
	//initialize the current path	
	current_path.push(taxonomyTree);
		
	//if online mode, get root categories and add to menu
	if(online){
			getCategoriesFromRest(current_path.join('/'), function(categories) {		
			addCategories("home",categories.lstNode);
		});
	}
	
	//if offline, load from db and add to menu
	else {

		getCategoriesFromDatabase("#home", function(result){
				
			var categories = [];		
            for (var i=0; i < result.rows.length; i++) {
				var row = result.rows.item(i);				   
				categories.push(row);
            }
			addCategories("home", categories);			
		});
	}	
});


//Adds the <li> element to the parent menu and creates a new <div> menu
function categoryTemplate(parent_path, category){
		
	var parent_id = "#"	+ parent_path;
		
	if (category.type == "article") {
		$(parent_id + " ul:first").append(tmpl("article_li_template", category));
		$('body').append(tmpl("article_menu_template", category));
	}
	else {
		$(parent_id + " ul:first").append(tmpl("category_li_template", category));
		$('body').append(tmpl("category_menu_template", category));
	}
}


//foreach category, create entry if online and apply template
function addCategories(parent_id, categories){
				
	for (var i = 0; i < categories.length; i++) {	
		
		categories[i].path = categories[i].path.replace(/\//g,'_').replace(/ /g,'-');
	
		if (online) {
			createCategoryEntry(parent_id, categories[i]);
		}	
		categoryTemplate(parent_id, categories[i]);
	}
}

//handles a click on a category
function handleCategoryLink(category_link){
											
	//if menu is empty, load data
	if (!($("#"+category_link + " ul li")).length) {
					
		current_path.push(category_link.substring(category_link.lastIndexOf('_') + 1));
		
		//if online, get all childs fromREST service
		if (online) {
		
			getCategoriesFromRest(current_path.join('/'), function(childCategories){
				addCategories(category_link, childCategories.lstNode);				
			});
		}
		else {
			//if offline, load from db
			getCategoriesFromDatabase(category_link, function(result){
				
				var categories = [];		
                for (var i=0; i < result.rows.length; i++) {
					var row = result.rows.item(i);				   
					categories.push(row);
                }
				addCategories(category_link, categories);
	
			});
		}
	}
}

//handles a click on an article
function handleArticleLink(article_link){


	//Check if article already exists	
	if (!($("#"+article_link + " ul")).length) {
	
			alert("on est 2xin");

	
		//get category childs of selected items
		current_path.push(article_link.substring(article_link.lastIndexOf('_')+1));	
		
		if (online) {
			
			alert("path: "+current_path.join('/'));
			
			getArticleFromRest(current_path.join('/'), function(article){
				article.content = "This is the content of the article ...";
				$("#"+article_link + ' p').append(article.content);
				article.path = article.path.replace(/\//g,'_').replace(/ /g,'-');
				createArticleEntry(article);
			});
		}
		else{
			getArticleFromDatabase(article_link, function(result){
				var article = result.rows.item(0);
				$("#"+article_link + ' p').append(article.content);
			});
		}
	}
}

//handle back button
function handleBackButton(){
	current_path.pop();
}



