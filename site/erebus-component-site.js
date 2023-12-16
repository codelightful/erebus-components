Erebus.events.documentReady().then(function() {
    const contentArea = Erebus.$('#div_page_content');
    const sideBarArea = Erebus.$('#div_page_sidebar');
    sideBarArea.load('./site/fragments/sidebar.html');

    Erebus.controller.setTarget('#div_page_content');

    Erebus.router.register('/', Erebus.controller({ 
        fragment: './site/fragments/home.html' 
    }));
    Erebus.router.register('api/:section', Erebus.controller({ 
        fragment: (params) => `./site/docs/${params.section}.html`
    }));
    Erebus.router.register('samples/:section', Erebus.controller({ 
        fragment: (params) => `./site/samples/${params.section}.html`,
        handler: function(params) {
            if (params.section === 'dialog') {
                sampleDialogHandler();
            } else if (params.section === 'toast') {
                sampleToastHandler();
            } else if (params.section === 'forms') {
                sampleFormHandler();
            }
        }
    }));
    Erebus.router.default(() => contentArea.load('./site/fragments/home.html'));
    Erebus.router.start();
});
