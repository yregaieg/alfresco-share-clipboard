model.jsonModel.services.push("fmaul/services/ClipboardService");

// --- custom action in search result documnt actions ---

var searchResultPage = widgetUtils.findObject(model.jsonModel.widgets, "id", "FCTSRCH_SEARCH_RESULT");

if (searchResultPage != null) {
    searchResultPage.config = {
        enableContextMenu: false,
        mergeActions: true,
        additionalDocumentAndFolderActions: ["org_alfresco_clipboard-add_document"]
    }
}

// --- custom clipboard menu in the top right ---

var propertyCell = {
    name: "alfresco/lists/views/layouts/Cell",
    config: {
        widgets: [{
            name: "alfresco/renderers/Property",
            config: {
                propertyToRender: "name"
            }
        }]
    }
};

var deleteActionCell = {
    name: "alfresco/lists/views/layouts/Cell",
    config: {
        widgets: [{
            name: "alfresco/renderers/PublishAction",
            config: {
                publishPayloadType: "CURRENT_ITEM",
                iconClass: "delete-16",
                propertyToRender: "title",
                altText: "Delete {0}",
                publishTopic: "ALF_CLIPBOARD_DELETE"
            }
        }]
    }
};

var showWhenClipboardNotEmpty = {
    initialValue: false,
    rules: [{
        topic: "ALF_CLIPBOARD_SHOW",
        attribute: "reveal",
        is: [true],
        strict: true
    }]
}

var clipboardMenu = {
    id: "ALF_CLIPBOARD_POPUP_MENU",
    name: "alfresco/menus/AlfMenuBarPopup",
    config: {
        label: msg.get("header.clipboard"),
        widgets: [{
            name: "alfresco/menus/AlfMenuItem",
            config: {
                label: msg.get("actions.folder.download"),
                iconClass: "alf-download-as-zip-icon",
                publishTopic: "ALF_CLIPBOARD_ACTION_DOWNLOAD"

            }
        }, {
            name: "alfresco/menus/AlfMenuItem",
            config: {
                label: msg.get("action.clipboard.send.attachment"),
                iconClass: "alf-social-email-icon",
                publishTopic: "ALF_CLIPBOARD_ACTION_SEND_EMAIL"
            }
        }, {
            name: "alfresco/menus/AlfMenuItem",
            config: {
                label: msg.get("action.clipboard.clear"),
                iconClass: "alf-delete-icon",
                publishTopic: "ALF_CLIPBOARD_ACTION_CLEAR"
            }
        }],
        visibilityConfig: showWhenClipboardNotEmpty
    }
};

var searchMenuBar = widgetUtils.findObject(model.jsonModel.widgets, "id", "FCTSRCH_SEARCH_LIST_MENU_BAR");

if (searchMenuBar) {
    searchMenuBar.config.widgets.unshift(clipboardMenu);
}

// --- custom list of currently saved clipboard items ---

var pageVertical = widgetUtils.findObject(model.jsonModel.widgets, "id", "FCTSRCH_MAIN_VERTICAL_STACK");
var topMenu = widgetUtils.findObject(model.jsonModel.widgets, "id", "FCTSRCH_TOP_MENU_BAR");
var searchForm = widgetUtils.findObject(model.jsonModel.widgets, "id", "FCTSRCH_SEARCH_FORM");
widgetUtils.deleteObjectFromArray(model.jsonModel.widgets, "id", "FCTSRCH_TOP_MENU_BAR");
widgetUtils.deleteObjectFromArray(model.jsonModel.widgets, "id", "FCTSRCH_SEARCH_FORM");

if (pageVertical) {
    pageVertical.config.widgets.splice(2, 0, {
        id: "FCTSRCH_TOP_MENU_HORIZONTAL",
        name: "alfresco/layout/LeftAndRight",
        config: {
            widgetsLeft: [{
                id: "FCTSRCH_TOP_MENU_VERTICAL",
                name: "alfresco\/layout\/VerticalWidgets",
                config: {
                    widgets: [topMenu, searchForm]
                }
            }],
            widgetsRight: [{
                id: "CLIPBOARD_WINDOW",
                name: "alfresco/layout/ClassicWindow",
                config: {
                    title: msg.get("header.clipboard"),
                    widgets: [{
                        name: "alfresco\/lists\/AlfList",
                        config: {
                            loadDataPublishTopic: "ALF_CLIPBOARD_GET",
                            reloadDataTopic: "ALF_CLIPBOARD_CHANGED",
                            widgets: [{
                                name: "alfresco/lists/views/AlfListView",
                                config: {
                                    widgets: [{
                                        name: "alfresco/lists/views/layouts/Row",
                                        config: {
                                            widgets: [propertyCell, deleteActionCell]
                                        }
                                    }]
                                }
                            }]
                        }
                    }],
                    visibilityConfig: showWhenClipboardNotEmpty
                }
            }]
        }
    });
}
