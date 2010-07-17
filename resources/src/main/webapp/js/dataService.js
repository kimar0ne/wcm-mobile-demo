/**
 * @author markdowney
 */

 
//return the child categories and article of the category passed as an argument 
function getCategoriesFromRest(currentCategory, callback){
	
	//alert("start rest call to "+"/ecmdemo/rest-ecmdemo/categories/all/repository/"+currentCategory+"/");	
	$.getJSON("/ecmdemo/rest-ecmdemo/categories/all/repository/"+currentCategory+"/", callback);
	
}



//return the info about the article
function getArticleFromRest(articlePath, callback){
	
	$.getJSON("/ecmdemo/rest-ecmdemo/categories/articles/repository/"+articlePath, callback);

}
 
 
//Load the database
var db;
	
	
function errorHandler(transaction, error) {
    alert('Oops. Error was '+error.message+' (Code '+error.code+')');
    return true;
}		
	
//Initialise the database	
function startDatabase(){
		
	var shortName = 'eXo';
	var version = '1.0';
	var displayName = 'eXo';
	var maxSize = 65536;
			
	db = openDatabase(shortName, version, displayName, maxSize);
			
	db.transaction(
		function(transaction){
			transaction.executeSql(
				'CREATE TABLE IF NOT EXISTS categories ' +
				'  (name TEXT NOT NULL, ' +
				'   parentPath TEXT NOT NULL, ' +
				'   icon TEXT, type TEXT NOT NULL, PRIMARY KEY(name, parentPath));', 
				[], null, errorHandler);	
				
			transaction.executeSql(
				'CREATE TABLE IF NOT EXISTS articles ' +
				'  (name TEXT NOT NULL, ' +
				'   parent_path TEXT, content TEXT NOT NULL, ' +
				'   icon TEXT, path TEXT NOT NULL PRIMARY KEY);', 
				[], null, errorHandler);	
		}			
	);		
}


//Create an entry in the database
function createCategoryEntry(parentId, entry) {
	
    db.transaction(
        function(transaction) {			
            transaction.executeSql(
   				  'INSERT OR REPLACE INTO categories (name, parentPath, icon, type) VALUES (?, ?, ?, ?);', 
                [entry.name, parentId, entry.icon, entry.type], null, errorHandler
            );
        }
    );
    return false;
}

//Create an article entry
function createArticleEntry(parentId, entry) {
	
    db.transaction(
        function(transaction) {			
            transaction.executeSql(
   				  'INSERT OR REPLACE INTO articles (name, parent_path, content, icon, path) VALUES (?, ?, ?, ?, ?);', 
                [entry.name, entry.parentPath, entry.content, entry.icon, parentId], null, errorHandler
            );
        }
    );
    return false;
}

//get all child categories of 'path' from database
function getCategoriesFromDatabase(path, callback){
	
	db.transaction(
        function(transaction) {
            transaction.executeSql(
                'SELECT * FROM categories WHERE parentPath=?;',[path],
               
			    function(transaction, result){
					callback(result);
				}, errorHandler
            );
        }
    );
}


//get an article from database
function getArticleFromDatabase(path, callback){
	
	db.transaction(
        function(transaction) {
            transaction.executeSql(
                'SELECT * FROM articles WHERE path=?;',[path],
               
			    function(transaction, result){
					callback(result);
				}, errorHandler
            );
        }
    );
}



//delete all entries
function deleteEntries(){
	
    db.transaction(
        function(transaction) {
            transaction.executeSql('DELETE FROM categories;', null, errorHandler);
			transaction.executeSql('DELETE FROM articles;', null, errorHandler);
        }
		
    );
}

//drop entries
function dropEntries(){
	
    db.transaction(
        function(transaction) {
            transaction.executeSql('DROP TABLE entries;', null, errorHandler);
        }
    );
}









