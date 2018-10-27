// Global variable declaration

//create variable to store initial list of topics
let topicList = ["success", "mind blown", "cat fails", "jim gaffigan", "recipe", "overthinking", "web development", "cops", "hockey", "fortnight"];

// api key and base url with result limit set to 10

let giphyAPIkey = "&api_key=NQSAZ9aZLIub8kWhTjjcJaKh9Ybix4Bc";
let giphyAPIurl = "https://api.giphy.com/v1/gifs/search?limit=10&";

//object to contain most of the functionality of the application
let app = {
    button: {
        populate: function () {
            $("#button-display").html("");
            for (a = 0; a < topicList.length; a++) {
                let currentTopic = topicList[a];
                let topicButton = $("<button class='topicSelector btn btn-outline-secondary custom-button'>");
                topicButton.text(currentTopic);
                $("#button-display").append(topicButton);
            }
            $(".custom-button").on("click", function (event) {
                console.log("something happened");
                console.log(event.target.innerText);
                let passTerm = event.target.innerText;
                app.gif.fetch(passTerm);
            });
        },
        add: function (topicToAdd) {
            topicList.push(topicToAdd);
            app.button.populate();
        }
    },
    gif: {
        current: [],
        fetch: function (searchTerm) {
            app.gif.current = [];
            $.ajax({
                url: giphyAPIurl + "q=" + searchTerm + giphyAPIkey,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                // console.log(response.data[0].images.original_still.url);
                for (b = 0; b < response.data.length; b++) {
                    let stillURL = response.data[b].images.original_still.url;
                    let animatedURL = response.data[b].images.original.url;
                    let gifRating = response.data[b].rating;
                    let gifObj = {
                        id: b,
                        still: stillURL,
                        animated: animatedURL,
                        rating: gifRating,
                        state: false
                    };
                    app.gif.current.push(gifObj);
                }
                console.log(app.gif.current);
                app.gif.update();
            })
        },
        update: function () {
            $("#gif-section").html("");
            for (c = 0; c < app.gif.current.length; c++) {
                let tempDiv = $("<div class = 'card gif-panel'>");

                let headerElem = $("<div class='card-header'>");
                headerElem.html("<b> Rating: " + app.gif.current[c].rating + "</b>");
                tempDiv.append(headerElem);

                let tempImgDiv = $("<div class = 'card-body'>");
                let gifImg = $("<img class = 'gif-display'>");
                gifImg.attr("src", app.gif.current[c].still);
                gifImg.attr("id", c);
                tempImgDiv.append(gifImg);

                tempDiv.append(tempImgDiv);

                $("#gif-section").append(tempDiv);
            }
            $(".gif-display").on("click", function (event) {
                console.log(event.currentTarget.id);
                let jQuerySel = "#" + event.currentTarget.id;
                let clickedID = Number(event.currentTarget.id);
                console.log(app.gif.current[clickedID].state);
                if (app.gif.current[clickedID].state === false) {
                    let newURL = app.gif.current[clickedID].animated;
                    $(jQuerySel).attr("src", newURL);
                    app.gif.current[clickedID].state = true;
                    console.log(app.gif.current[clickedID].state);  
                } else if (app.gif.current[clickedID].state = true) {
                    let newURL = app.gif.current[clickedID].still;
                    $(jQuerySel).attr("src", newURL);
                    app.gif.current[clickedID].state = false;
                }
            })
        }
    }
}
$(document).ready(function () {
    app.button.populate();
    $("#add-topic").on("click", function () {
        let newTopic = $("#topic-to-add").val();
        if (newTopic.length > 0) {
            app.button.add(newTopic);
            app.button.populate();
            $("#topic-to-add").val("");
        }
    })
})


