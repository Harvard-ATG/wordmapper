jQuery(document).ready(function($) {
  $('span:has(refs)').addClass("aligned");


})

$.fn.highlightAlignments = function() { 

	var symbol = $(this).find("refs").attr("nrefs").split(" ");
       
        for($i=0; $i<symbol.length; $i++) {

			var xxx = symbol[$i];
						
       		$(this).parent().siblings().children("span[n="+xxx+"]").addClass("highlight2");
			
			}
			
<!-- at this point all we do is go to the last "ref" and highlight all words it points to -->

		var targetNode = $(this).parent().siblings().children("span[n="+xxx+"]");
	 
	 	var symbol = $(this).parent().siblings().children("span[n="+xxx+"]").find("refs").attr("nrefs").split(" ");
	 
	 	for($i=0; $i<symbol.length; $i++) {

			var xxx = symbol[$i];

						
       		$(targetNode).parent().siblings().children("span[n="+xxx+"]").addClass("highlight2");    
       		
    
}
}

$.fn.AlignmentsToString = function() { 

	var symbol = this.find("refs").attr("nrefs").split(" ");
    
    
    
    var yyy ="";
        for($i=0; $i<symbol.length; $i++) {

			var xxx = symbol[$i];
						
			this.parent().siblings().children("span[n="+xxx+"]").addClass("highlight2");
			yyy = yyy + this.parent().siblings().children("span[n="+xxx+"]").text() + " ";
			
			}
			
<!-- at this point all we do is go to the last "ref" and highlight all words it points to -->
	var zzz = "";
		

		 var targetNode = this.parent().siblings().children("span[n="+xxx+"]");
	 
	 	var symbol = this.parent().siblings().children("span[n="+xxx+"]").find("refs").attr("nrefs").split(" ");
	 
	 	for($i=0; $i<symbol.length; $i++) {

			var xxx = symbol[$i];
						
       		$(targetNode).parent().siblings().children("span[n="+xxx+"]").addClass("highlight2");    
       		zzz = zzz + $(targetNode).parent().siblings().children("span[n="+xxx+"]").text() + " ";
    
}

return zzz + "\t" + yyy;


}

    $(function () {
    
    
    
    

$("#btnClear").click(function () {

	$(".highlight").removeClass("highlight");
	$(".highlight2").removeClass("highlight2");

})

$("#btnClearAlignments").click(function () {

	$(".highlight").removeClass("highlight");
	$(".highlight2").removeClass("highlight2");
	
	$("refs").remove();
	 $('span').removeClass("aligned");
	
})


$("#btnExport").click(function () {

		var myWindow=window.open('','Export','width=500,height=700')
		var htmlStr = "<html>" + $("html").html() + "</html>";
		
    $(myWindow.document.body).text(htmlStr).replace("<br>", "<br/>\n");


})


$("#btnBuildIndex").click(function () {

	var myWindow=window.open("","Export",'width=500,height=700')
	    
	    var items = $("refs");
	    var alignments = "";
	    var theIndex = new Object;
		$("refs").each(function() {
		
	 	var nrefs = $(this).attr("nrefs");
		var n = $(this).parent().attr("n");


		if(typeof theIndex[nrefs] != 'undefined')
		    
		    {		theIndex[nrefs] = theIndex[nrefs] + " " + n;}

                else

		    {		theIndex[nrefs] = n;		    }


		

		}


		    )


		    myWindow.document.open("index" +',scrollbars=1');
	myWindow.document.write("<html><body>\n");
		myWindow.document.write("<table border=2 cellpadding=2>");

		var keys= [];
		for (k in theIndex) {

		    if (theIndex.hasOwnProperty(k)) {
			keys.push(k);
		}

		}

		keys.sort();
		len = keys.length;

		for (i = 0; i < len; i++) {

		    k = keys[i];

			var index = theIndex[k];

			myWindow.document.write("<tr><td>" + refToString(k) + "</td><td>" + refToString(theIndex[k]) + "</td><td>" + k + "</td><td>" + theIndex[k] + "</td></tr>\n")

		    }


		


    myWindow.document.write("</table>");
    		myWindow.document.write("</body></html>");
    myWindow.document.close();

})


    function refToString(a) {

    var array = a.split(" ");
    var text = "";

    for(index = 0; index < array.length; index++) {
	var i = array[index];
	var itext = $("span[n="+i+"]").text();

	text = text + itext + " ";
    }

    return text.trim();
}



$("#btnSearch").click(function () {
      
    
    $(".highlight").each(function(index) {
    
    <!-- first remove all alignments for highlighted nodes -->
    <!-- step 1: delete <refs> in $(this)
   <!-- step 2: have to ensure that selected node is not a target of any node in parent:sibling-->
   <!-- go through each node in parent:sibling, removing any reference to $(this)
    $(this).removeClass("aligned");
	var refs = "";
	
	var span = $(this);
	
	var n = span.attr("n");
	var exx = "";
	var nrefs = "";
	
	span.children().filter("refs").remove();
	

	var spans = $(this).parent().siblings().children();

	$(this).parent().siblings().children().each(function(index) {
	 		
	 	var nrefs = $(this).children().attr("nrefs");
	 		
	 	var nspace = n + " ";
	 	
	 	if (nrefs) {
	 	
	 	var nrepl = nrefs.replace(n, "");
	
		$(this).children().attr("nrefs", nrefs.replace(n, "")); 

		}
	    })

	$(this).parent().siblings().children().each(function(index) {
	 		
	 	var nrefs = $(this).children().attr("nrefs");

		if (nrefs == " ") {

			$(this).children().filter("refs").remove();
		    $(this).removeClass("aligned");
		}
	    })

		
	    })
		
		
	<!-- now add alignments -->
	
			
		
		$(".highlight").each(function(index) {
	
	
	var refs = "";
	var span = $(this);
	 	
	 	$(this).parent().siblings().children().filter(".highlight").each(function(index) {
	 		
	 		refs = refs + $(this).attr("n") + " ";
	 		
	 		 		
		})

	 	var insert = "<refs nrefs=\"" + refs + "\"/>";
	 	
	 	<!-- span.children().filter("refs").remove(); -->
	 	
	 	if (refs) {
	 	span.append(insert.replace(" \"", "\""));
	 	}
   
		
		})
		
    
	$(".highlight").removeClass("highlight");
 	$('span:has(refs)').addClass("aligned");	
		
		<!-- the following is needed to remove spans that no longer point to anything -->
		
		$('refs[nrefs=""]').parent().removeClass("aligned");
		$('refs[nrefs=""]').remove();
		
	

})


         <!-- $('span:has(refs)').css("color", "red");-->
     
     
     $('span').mouseout(function() {

 		$(".highlight2").removeClass("highlight2");
	
		})
        
  	  $('span').mouseover(function() {

	if ($(this).find("refs").attr("nrefs")) {
		$(this).highlightAlignments(); 
	}
	    
	})


 $('span').click(function(evt) {

  if (evt.altKey) {
  
        var text = $(this).text();
		var alignments = "";
	 	
	 	$("span:contains("+text+")").each(function(index) {
	 	if ($(this).find("refs").attr("nrefs")) {
	 
	 
	 		$(this).highlightAlignments();
	 	
	 	alignments = alignments + $(this).AlignmentsToString() + "\n";
		}
	})
			
		if (alignments != "") {
	
		 	alert(alignments)
		}
    
    
} else {
		$(this).toggleClass("highlight");
		}

  })


    $('span').dblclick(function() {
		var text = $(this).text();
		
	 	$("span:contains("+text+")").each(function(index) {
	 	$(this).addClass("highlight");
		})
    })
    
    
    });
    
