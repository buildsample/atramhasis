define([
    'dijit/_WidgetsInTemplateMixin',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dojo/_base/declare',
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/topic",
    "dojo/on",
    "dijit/form/Button",
    "dojo/text!./templates/ConceptDetailList.html"
], function (WidgetsInTemplateMixin, TemplatedMixin, WidgetBase, declare, arrayUtil, domConstruct, domClass, topic, on, Button, template) {
    return declare([WidgetBase, TemplatedMixin, WidgetsInTemplateMixin], {
        templateString: template,

        postMixInProperties: function () {
            this.inherited(arguments);
        },

        buildRendering: function () {
            this.inherited(arguments);
        },

        postCreate: function () {
            this.inherited(arguments);

        },

        startup: function () {
            this.inherited(arguments);
        },

        mapLabelsForList: function (labels, type) {
            var filteredItems = arrayUtil.filter(labels, function (item) {
                return item.type == type;
            });
            return arrayUtil.map(filteredItems, function (item) {
                return {"id": "", "mainlabel": item.label, "sublabel": item.language};
            });
        },

        mapNotesForList: function (notes, type) {
            var filteredItems = arrayUtil.filter(notes, function (item) {
                return item.type == type;
            });
            return arrayUtil.map(filteredItems, function (item) {
                return {"id": "", "mainlabel": item.note, "sublabel": item.language};
            });
        },

        mapRelationsForList: function (relations) {
            return arrayUtil.map(relations, function (item) {
                return {"id": item.id, "mainlabel": item.label, "sublabel": item.id};
            });
        },

        buidList: function (items, title, clickable, isEditRelation) {
            var self=this;
            this.reset();
            var node = this.ConceptListNode;
            if (items && items.length > 0) {

                domConstruct.place("<h3>" + title + ":</h3>", node, "first");
                var ul = domConstruct.create("ul", {
                    className: 'conceptlist'
                }, node);

                var scheme = this.schemeid;

                var sortedItems = items.sort(function (a, b) {
                    var nameA = a.mainlabel.toLowerCase(), nameB = b.mainlabel.toLowerCase();
                    if (nameA < nameB) //sort string ascending
                        return -1;
                    if (nameA > nameB)
                        return 1;
                    return 0; //default return value (no sorting)
                });

                arrayUtil.forEach(sortedItems, function (item) {
                    var li = domConstruct.create("li", {
                        innerHTML: item.mainlabel + " (<em>" + item.sublabel + "</em>)"
                    }, ul);
                    if (clickable) {
                        domClass.add(li, "clickable");
                        on(li, "click", function () {
                            topic.publish("concept.open", item.id, scheme);
                        });
                    }
                    if (isEditRelation) {

                        var btn = new Button({
                            label: "remove this relation",
                            showLabel: false,
                            iconClass: 'minIcon',
                            onClick: function () {
                                self._removeRelationFromList(li,item.id);
                            }
                        }).placeAt(li);


                    }
                });
            }
        },
        _removeRelationFromList: function (li,relId) {
              domConstruct.destroy(li);
              topic.publish("relation.delete",relId);

        },
        _mapLabelToDisplayedLabel: function (labels, typevalue, typeToBeDisplayed) {

            var self = this;
            var filteredItems = arrayUtil.filter(labels, function (item) {
                return item.type == typevalue;
            });
            return arrayUtil.map(filteredItems, function (item) {
                return {label: item.label, language: self._getLanguageToDisplay(item.language), languageValue: item.language, type: typeToBeDisplayed, typeValue: item.type};
            });
        },
        _mapNoteToDisplayInGrid: function (notes, typevalue, typeToBeDisplayed) {

            var self = this;
            var filteredItems = arrayUtil.filter(notes, function (item) {
                return item.type == typevalue;
            });

            return arrayUtil.map(filteredItems, function (item) {
                return {label: item.note, language: self._getLanguageToDisplay(item.language), languageValue: item.language, type: typeToBeDisplayed, typeValue: item.type};
            });
        },
        _getLanguageToDisplay: function (language) {
            switch (language) {
                case "nl":
                    return "NL";
                    break;
                case "fr":
                    return "FR";
                    break;
                case "en":
                    return "EN";
                    break;
                default:
                    return language;
                    break;
            }
        },

        reset: function () {

            domConstruct.empty(this.ConceptListNode);

        }

    });
});
