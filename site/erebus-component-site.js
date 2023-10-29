Erebus.events.documentReady().then(function() {
    const contentArea = Erebus.element('#div_page_content');
    const sideBarArea = Erebus.element('#div_page_sidebar');
    sideBarArea.load('./site/fragments/sidebar.html')

    Erebus.router.default(() => contentArea.load('./site/fragments/home.html'));
    Erebus.router.register('/', () => contentArea.load('./site/fragments/home.html'));
	Erebus.router.register('api/:section', (params) => contentArea.load(`./site/docs/${params.section}.html`));
    Erebus.router.register('samples/:section', (params) => contentArea.load(`./site/samples/${params.section}.html`));
    Erebus.router.start();
});
