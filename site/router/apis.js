Erebus.router.register('api/:section', Erebus.controller({ 
    fragment: (params) => `./site/docs/${params.section}.html`
}));
