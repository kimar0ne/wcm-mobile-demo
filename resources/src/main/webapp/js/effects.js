/**
 * @author markdowney
 */

 
 var jQT = new $.jQTouch({
                
				icon: 'css/img/exo.png',
                addGlossToIcon: false,
                //startupScreen: 'jqt_startup.png',
                statusBar: 'black',     
       
            });
			
			
            $(function(){
                
		
				
				$('.category').live('pageAnimationStart', function(e, info){
						
						 if (info.direction == 'in'){
							handleCategoryLink($(this).attr('id'));
						 }														         
                });

			
				$('.article').live('pageAnimationStart', function(e, info){
						
						 if (info.direction == 'in'){
                       		handleArticleLink($(this).attr('id'));	
                       		}					         
                }); 
				
				
				$('.category').live('pageAnimationStart', function(e, info){
						 
						 if (info.direction == 'out'){
						 	handleBackButton();	
						 }			
                }); 
				
				$('.article').live('pageAnimationStart', function(e, info){
						 
						 if (info.direction == 'out') {
						 	handleBackButton();
						 }		
                });
								

            });