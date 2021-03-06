function loadHeaderAndFooter() {
	
	$.ajax('head.html', {
		dataType: 'html',
		success: function(data) {
			$('#head').html(data);
			if(window.pageId) {
				setHeaderButton(window.pageId);
			}
		}
	});
	
	$.ajax('bottom.html', {
		dataType: 'html',
		success: function(data) {
			$('#bottom').html(data);
		}
	});
}

function loadContent(fileName) {
	$.ajax(fileName, {
		dataType: 'html',
		success: function(data) {
			$('#content').html(data);
			
			init();
		}
	});
	
}

function setHeaderButton(pageName) {
	$('.header_button').each(function(i, elem) {
		$(elem).parent().removeClass('active')
	})
	$(pageName).parent().addClass('active')
}

function init() {
	if( $('#eclipse_installation_instructions') ) {
		$('#eclipse_installation_instructions').hide();
	}
	if( $('#eclipse_uninstallation_instructions') ) {
		$('#eclipse_uninstallation_instructions').hide();
	}
	if( $('#idea_installation_instructions') ) {
		$('#idea_installation_instructions').hide();
	}
	if( $('#idea_uninstallation_instructions') ) {
		$('#idea_uninstallation_instructions').hide();
	}
	
	if($('#copy_button')) {
	  ShowLMCButton("http://cope.eecs.oregonstate.edu/client-recorder/", "COPY", null,"js/lmcbutton.swf", 'copy_button')
	  $('#copy_button').css({
		  'padding-right' : '10px'
	  })
	}
	if($('#idea_copy_button')) {
	  ShowLMCButton("http://cope.eecs.oregonstate.edu/IDEARecorder/updatePlugins.xml", "COPY", null,"js/lmcbutton.swf", 'idea_copy_button')
	  $('#idea_copy_button').css({
		  'padding-right' : '10px'
	  })
	}
}

$(document).ready(function(){
	
	
	init()
	
	loadHeaderAndFooter()
	
	//$('#footer').css('margin-top',$(document).height() - ($('#header').height() + $('#content').height()  ) - $('#footer').height());
	//$('#footer').width($('#content').width());
	
});

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function sendEmail(email) {
	if(!validateEmail(email)) {
		alert('Please enter valid e-mail');
	} else {
		$.ajax({
			type: "POST",
			url: "https://mandrillapp.com/api/1.0/messages/send.json",
			data: {
				'key': 'm7p9RHXIdNa4M1OkLA1QiQ',
				'message': {
				'from_email': 'cope@engr.oregonstate.edu',
				'to': [
					{
						'email': 'cope@engr.oregonstate.edu',
						'name': 'COPE',
						'type': 'to'
					}
				],
				'autotext': 'true',
				'subject': 'COPE for IntelliJ IDEA request',
				'html': 'Somebody with e-mail <a href="mailto:' + email + '">' + email + '</a> expressed interest in COPE for IntelliJ IDEA!'
				}
			}
		}).done(function(response) {
			alert('Thanks! We will send you an e-mail once we publish COPE for IntelliJ IDEA');
			//console.log(response); // if you're into that sorta thing
		});
	}
}

function sendErrorReportMail( ide, errorDesription, stepsToReproduce, stackTrace, version, callback/*, attachmentContents*/) {
	$.get( 'errorReportTemplate.html', function ( html ) {
        html = html.replace('${IDE}', ide);
        html = html.replace('${Version}', version);
        html = html.replace('${ErrorDescription}', errorDesription);
        html = html.replace('${StepsToReproduce}', stepsToReproduce);
        html = html.replace('${StackTrace}', stackTrace);
        
        $.ajax({
            type: "POST",
            url: "https://mandrillapp.com/api/1.0/messages/send.json",
            data: {
                'key': 'm7p9RHXIdNa4M1OkLA1QiQ',
                'message': {
                    'from_email': 'cope@engr.oregonstate.edu',
//                    'from_email': 'shmarkas@eecs.oregonstate.edu', 
                   'to': [
                        {
                            'email': 'cope@engr.oregonstate.edu',
//                            'email': 'shmarkas@eecs.oregonstate.edu',
                            'name': 'COPE',
                            'type': 'to'
                        }
                    ],
                    'autotext': 'true',
                    'subject': 'COPE Error report',
                    'html': html
//                    'images' : images
                }
            }
        }).done( function(response) {
            alert('Your error report has been successfully submitted. We appreciate your feedback!');
            callback.call();
        });
    } )
}