/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
var main = function(toDoObjects) {
    "use strict";
    console.log("SANITY CHECK");
    var toDos = toDoObjects.map(function(toDo) {
        // we'll just return the description
        // of this toDoObject
        return toDo.description;
    });

    $(".tabs a span").toArray().forEach(function(element) {
        var $element = $(element);

        // create a click handler for this element
        $element.on("click", function() {
            var $content,
                $input,
                $button;

            $(".tabs a span").removeClass("active");
            $element.addClass("active");
            $("main .content").empty();

            if ($element.parent().is(":nth-child(1)")) {
                $content = $("<ul data-bind='foreach: todoslist'>");
                $content.append($("<li data-bind='text: todo'>"));

            } else if ($element.parent().is(":nth-child(2)")) {
                $content = $("<ul data-bind='foreach: todoslist'>");
                $content.append($("<li data-bind='text: todo'>"));

            } else if ($element.parent().is(":nth-child(3)")) {
                var tags = [];

                toDoObjects.forEach(function(toDo) {
                    toDo.tags.forEach(function(tag) {
                        if (tags.indexOf(tag) === -1) {
                            tags.push(tag);
                        }
                    });
                });
                console.log(tags);

                var tagObjects = tags.map(function(tag) {
                    var toDosWithTag = [];
                    toDoObjects.forEach(function(toDo) {
                        if (toDo.tags.indexOf(tag) !== -1) {
                            toDosWithTag.push(toDo.description);
                        }
                    });

                    return {
                        "name": tag,
                        "toDos": toDosWithTag
                    };
                });

                console.log(tagObjects);

                tagObjects.forEach(function(tag) {
                    var $tagName = $("<h3>").text(tag.name),
                        $content = $("<ul>");


                    tag.toDos.forEach(function(description) {
                        var $li = $("<li>").text(description);
                        $content.append($li);
                    });

                    $("main .content").append($tagName);
                    $("main .content").append($content);
                });

            } else if ($element.parent().is(":nth-child(4)")) {
                var $input = $("<input data-bind='value description'>").addClass("description"),
                    $inputLabel = $("<p>").text("Description: "),
                    $tagInput = $("<input data-bind='value tags'>").addClass("tags"),
                    $tagLabel = $("<p>").text("Tags: ");
                $button = $("<span data-bind='click: submitToDo'>").text("+");

                $content = $("<div>").append($inputLabel)
                    .append($input)
                    .append($tagLabel)
                    .append($tagInput)
                    .append($button);
            }

            $("main .content").append($content);

            return false;
        });
    });

    $(".tabs a:first-child span").trigger("click");
};

function ViewModel() {
    "use strict";
    var self = this,
        newToDo;

    self.description = ko.observable("");
    self.tags = ko.observable("");

    self.todoslist = ko.observableArray([{
        todo: "Get Groceries"
    }, {
        todo: "Make up some new ToDos"
    }, {
        todo: "Prep for Monday's class"
    }, {
        todo: "Answer recruiter emails on LinkedIn"
    }, {
        todo: "Take Gracie to the park"
    }, {
        todo: "Finish writing book"
    }]);

    self.tagsList = ko.observableArray([]);

    //update list of todos and send new todo to server
    var submitToDo = function() {
        newToDo = {
            "description": self.description(),
            "tags": self.tags()
        };
        self.todoslist.push({
            todo: self.newToDo()
        });
        $.post("todos", newToDo, function(result) {
            console.log(result);

            //toDoObjects.push(newToDo);
            toDoObjects = result;

            // update toDos
            toDos = toDoObjects.map(function(toDo) {
                return toDo.description;
            });

            self.description("");
            self.tags("");

        });
    };

}

$(document).ready(function() {
    "use strict";
    $.getJSON("todos.json", function(toDoObjects) {
        main(toDoObjects);
    });
    ko.applyBindings(new ViewModel());
});
