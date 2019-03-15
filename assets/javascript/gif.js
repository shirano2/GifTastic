$(document).ready(function() {
    var topics=["dog", "cat", "rabbit", "hamster", "skunk", "goldfish", "bird", "ferret", "turtle", "sugar glider", "chinchilla", "hedgehog", "hermit crab", "gerbil", "pygmy goat", "chicken", "capybara", "teacup pig", "serval", "salamander", "frog"];
    var favor=[];
    var apikey="sDqWP1aiJ6v3Zdm916R5NtKSHIMNAK7H";
    var num=10;
    var topic;

    /* set Cookie */
    function setCookie(cname, cvalue, exdays) {
	  var d = new Date();
	  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	  var expires = "expires="+d.toUTCString();
	  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
    
    /* read Cookie */
	function getCookie(cname) {
	  var name = cname + "=";
	  var ca = document.cookie.split(';');
	  for(var i = 0; i < ca.length; i++) {
	    var c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
	}
    
    /* check Cookie */
	function checkCookie() { 
	  var cookie = getCookie("favorite");
	  if (cookie != "") {
          favor=JSON.parse(getCookie("favorite"));
	    return true;
	  } else {
	    return false;
	  }
	}

    /* show the topic button (above) */
    function showButton() {
        $("#buttons").empty();
        for (var i=0;i<topics.length;i++) {
            $("#buttons").append("<button id='"+topics[i]+"' data-topic='"+topics[i]+"'>"+topics[i]+"</button>");
        }
    }

    /* make a form */
    function showInput() {
        $(".input").empty();
        var form=$("<form>");
        form.append("<h2>Add an animal</h2>");
        form.append("<input type='text'><br>");
        form.append("<input id='submit' type='submit' value='Search'>");
        $(".input").append(form);
    }

    /* make a my favorite link */
    function myFavorite() {
        $(".input").append("<a id='favlink' href='#'><h2>♡ My Favorite</h2></a>");
    }

    /* if you click the button */
    $(document).on("click","button",function() {
        if($(this).hasClass("fav") || $(this).hasClass("download") || $(this).hasClass("del")) { /* download, or favorite or delete button */
            if($(this).hasClass("fav")){ /* if add to my favorite */
                var obj={
                    "still":$(this).siblings("img").attr("data-still"), 
                    "gif":$(this).siblings("img").attr("data-gif"), 
                    "rate":$(this).siblings("img").attr("data-rate"), 
                    "title":$(this).siblings("img").attr("data-title")
                }
                favor.push(obj); 
                setCookie("favorite",JSON.stringify(favor),1);
            } else if($(this).hasClass("del")) { /* if you remove from my favorite */
                favor.splice($(this).attr("data-del"),1);
                $(this).parent().remove();
                setCookie("favorite",JSON.stringify(favor),1);
            }
        } else { /* if you press a topic button */
            $(".favorite").hide();
            $(".container").show();
            if($(this).attr("data-num")!=undefined) { /* if you press below topic button which can show more */
                num=parseInt($(this).attr("data-num"))+10;
            } else { /* if you press above topic button */
                num=10;
                $(".active").removeClass("active");
                $(this).addClass("active");
            }  
            topic=$(this).attr("data-topic");  
            var queryURL="https://api.giphy.com/v1/gifs/search?api_key="+ apikey +"&q="+topic+"&limit="+num;
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                $(".container").empty();
                var col=$("<div>");
                col.addClass("content");
                for(var i=0; i<response.data.length;i++) {
                    var rating=response.data[i].rating;
                    var title=response.data[i].title;
                    title=title.substr(0,title.length-4);
                    var stillImage=response.data[i].images["480w_still"].url;
                    var movingImage=response.data[i].images["downsized"].url;
                    var col2=$("<div>");
                    col2.addClass("each");
                    col2.append("<h2>Raiting: "+rating+"</h2>");
                    col2.append("<img src='"+stillImage+"' data-still='"+stillImage+"' data-gif='"+movingImage+"' data-status='still' data-rate='"+rating+"' data-title='"+title+"'>");
                    col2.append("<h3>Title: "+title+"</h3>");
                    col2.append("<a href='data:image/gif;"+movingImage+"' download='"+title+".gif'><button class='download'>❐ Download</button></a>");
                    col2.append("<button class='fav'>♥ Favorite</button>");
                    col.append(col2);
                }
                $(".container").append(col);
                $(".container").append("<button class='add' data-num='"+num+"' data-topic='"+topic+"'>Show More</button>");
            });
        }
    });

    /* if you click the images */
    $(document).on("click","img",function() {
        if($(this).attr("data-status")=="still") {
            $(this).addClass("active");
            $(this).attr("data-status","animated");
            $(this).attr("src",$(this).attr("data-gif"));
        } else {
            $(this).removeClass("active");
            $(this).attr("data-status","still");
            $(this).attr("src",$(this).attr("data-still"));
        }
    });

    /* if you click submit in form */
    $(document).on("click","#submit",function(e) {
        e.preventDefault();
        topic=$("input").val().trim();
        if(topics.indexOf(topic)<0) {
            topics.push(topic);
            showButton();
            $("#buttons button:last-child").trigger("click");
        } else {
            $("#"+topic).trigger("click");
        }  
    });

    /* if you click my favorite link */
    $(document).on("click","#favlink",function() {
        $(".favorite").empty();
        $(".favorite").show();
        $(".container").hide();
        if(checkCookie()) {
            for(var i=0;i<favor.length;i++) {
                var rating=favor[i].rate;
                var title=favor[i].title;
                var stillImage=favor[i].still;
                var movingImage=favor[i].gif;
                var col2=$("<div>");
                col2.addClass("each");
                col2.append("<h2>Raiting: "+rating+"</h2>");
                col2.append("<img src='"+stillImage+"' data-still='"+stillImage+"' data-gif='"+movingImage+"' data-status='still' data-rate:'"+rating+"' data-title='"+title+"'>");
                col2.append("<h3>Title: "+title+"</h3>");
                col2.append("<button class='del' data-del='"+i+"'>delete</button>");
                $(".favorite").append(col2);
            }
        }
    });

    /* start */
    showButton();
    showInput();
    myFavorite();
    checkCookie();
});