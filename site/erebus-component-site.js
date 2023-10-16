Erebus.events.documentReady().then(function() {
    const contentArea = Erebus.element('#div_page_content');
    
    Erebus.router.register('/', () => contentArea.load('./site/fragments/home.html'));
    Erebus.router.default(() => contentArea.load('./site/fragments/home.html'));
    Erebus.router.start();
});