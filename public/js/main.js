var cs = {
    version: '2012.12.30.17.07',
    waiting: 'https://console.ng.bluemix.net/devops/code/file/tessa.l.watkins@gmail.com-OrionContent/C-Insights-1483116832297/public/images/waiting.gif',
    tab: '',
    init: function () {
        console.log('Initializing CS Main JS version ' + this.version);
        $('#trigger-modal').leanModal({ closeButton: '.modal-close' });
        $('ul.tabs li').on('click', function (e) {
            var $btn = $(e.target).closest('li');
            if (!$btn.hasClass('disabled')) {
                cs.switchTab($btn.data('id'));
            }
        });
        $('form').on('submit', function (e) {
            e.preventDefault();//Prevent Default form submission
            var validationErrors = 0;
            var errorMsg = '';
            if($('#client-name').val().length <= 0) {
            	validationErrors++;
            }
            switch(cs.tab){
            	case 'text':
            		if($('#text textarea').val().length <= 0) {
            			validationErrors++;
            		}
            		break;
            	default:
            	validationErrors++;
            }
        	cs.getData();
            
        });
        //Initialize a tab
        cs.switchTab('text');
    },
    switchTab: function (tab) {
    	cs.tab = tab;
        $('ul.tabs li').removeClass('active');
        $('.tabbed-sections section').removeClass('active').addClass('hide');
        $('ul.tabs li[data-id=' + tab + ']').addClass('active');
        $('.tabbed-sections #' + tab).removeClass('hide').addClass('active');
    },
    triggerModal: function(title, message, exitBtn, updateOnly) {
		var $modal = $('#modal');
		$modal.find('h1').text(title);
		$modal.find('.modal-content').html('<p>' + message + '</p>');
		$modal.find('.modal-close').text('CLOSE');
		if($modal.css('display') == 'none'){
			$('#trigger-modal').click();//Trigger modal
		}
    },
    formComplete: function (success, name, url) {
        if (success) {
        	cs.triggerModal('REPORT COMPLETED', '<p>Your Consumer Insights report is completed. Please click the download button below to download it.</p><p><a href="' + url + '" download="' + name + '" target="_blank" class="btn">DOWNLOAD REPORT (CSV)</a></p>', 'CLOSE');
        }
        else {
        	var errorMsg = name === undefined ? 'Sorry, an error has occurred.<br />Please check the console for error logs.' : name;
        	cs.triggerModal('ERROR', '<p>' + errorMsg + '</p>', 'CLOSE')
        }
    },
    getData: function () {
        //Set wait modal text properties
        cs.triggerModal('PLEASE WAIT...','<p>Your Consumer Insights report is being generated. Please do not close or refresh this page. Once completed, your download of the CSV file should begin automatically. Please ensure that pop-ups are allowed on your browser for this application.</p><img src="'+ cs.waiting +'" alt="Please wait..." />','CANCEL');

        // check if the captcha is active and the user complete it
        var recaptcha = grecaptcha.getResponse();

        //Configure data object
        var formData = {};
        switch (cs.tab) {
            case 'twitter':
            	// Get the content items from the JSON file.
                break;
            case 'facebook':
            	// Get the content items from the JSON file.
                break;
            case 'file':
            	// Get the content items from the JSON file.
                break;
            default:
                formData = {
                    recaptcha: recaptcha,
                    text: $('#' + cs.tab + ' textarea').first().val(),
                    language: 'en'
                };
                break;
        }
        var apiUrl = '/api/profile';
		$.ajax({
            headers: {
                'csrf-token': $('meta[name="ct"]').attr('content')
            },
            type: 'POST',
            data: formData,
            url: apiUrl,
            dataType: 'json',
            success: function (response) {
                console.log(response);
                if (response.error) {
                    cs.formComplete(false);
                } else {
                	cs.generateReportFile(response);
                    //$results.show();
                    //showTraits(response);
                    //showTextSummary(response);
                    //showVizualization(response);
                }

            },
            error: function (xhr) {
                console.log(xhr);
                var errorMsg;
		        try {
		          errorMsg = JSON.parse(xhr.responseText);
		        } catch(e) {}
		
		        if (xhr && xhr.status === 429) {
		          errorMsg = 'Complete the captcha to proceed';
		        }

                cs.formComplete(false, errorMsg.error);
            }
        });
    },
    generateReportFile(data) {
    	console.log('Generating report...');
    	
    	//Get current timestamp and create file name
    	var dt = new Date();
    	var client = $('#client-name').val().replace(' ', '');
    	var fileName = 'C-Insights_'+client+'_'+dt.getFullYear()+'-'+(dt.getMonth() + 1)+'-'+dt.getDate()+'_'+ cs.tab +'_'+dt.getHours()+'-'+dt.getMinutes()+'-'+dt.getSeconds() + '.csv';
    	console.log('Report: ' + fileName);
    	
    	//Start the file generation parameters
    	var colSep = ',';
    	//var colSep = '%20';
    	var rowSep = '\r\n';
    	//var rowSep = '%0';
    	var csvString = "";
    	
    	
    	//CSV Row Headers
    	csvString += 'Group' + colSep + 'Category' + colSep + 'Personality Detail' + colSep + 'Percentage' + rowSep;
    	
    	//Cycle through the data and generate the file in a string format
    	if(cs.cExists(data.tree.children)) {
    		for(var root_i = 0; root_i < data.tree.children.length; root_i++) {
	    		//Cycling through "Personality", "Needs", and "Values"
	    		var rootObj = data.tree.children[root_i];
	    		//console.log(rootObj.name);
	    		if(cs.cExists(rootObj.children)) {
	    			for(var p_i = 0; p_i < rootObj.children.length; p_i++){
	    				//Cycling through parent objects. "Openness", "Challenge", "Hedonism"
	    				var parentObj = rootObj.children[p_i];
	    				//console.log('- ' + parentObj.name+ ': ' + parentObj.percentage);
	    				if(cs.cExists(parentObj.children)) {
	    					for(var c_i = 0; c_i < parentObj.children.length; c_i++){
	    						//Cyling through child objects. "Extraversion", "Curiosity", "Conservation"
	    						var childObj = parentObj.children[c_i];
	    						//console.log('-- ' + childObj.name+ ': ' + childObj.percentage);
	    						if(cs.cExists(childObj.children)) {
	    							//Only necessary for "Personality"
	    							for(var gc_i = 0; gc_i < childObj.children.length; gc_i++){
	    								//Cycling through grandchildren. "Dutifullness", "Altruism", "Fiery"
	    								var gChildObj = childObj.children[gc_i];
	    								//console.log('--- ' + gChildObj.name + ': ' + gChildObj.percentage);
	    								csvString += rootObj.name + colSep + childObj.name + colSep + gChildObj.name + colSep + gChildObj.percentage + rowSep;
	    							}
	    						} else {
	    							csvString += rootObj.name + colSep + childObj.name + colSep + colSep + childObj.percentage + rowSep;
	    						}
	    					}
	    				}
	    			}
	    		}
    		}
    	}
    	//console.log(csvString);
    	console.log(data);
    	
    	//Create the file URL
    	var fileUrl = 'data:application/csv;charset=utf-8,'+encodeURIComponent(csvString);
    	
    	//Fake additional wait time
        setTimeout(function () {
            cs.formComplete(true, fileName, fileUrl);
        }, 1500);
    },
    cExists(thisArray){
    	return thisArray != undefined && thisArray.length > 0;
    }
}

$(document).ready(function () { cs.init(); });