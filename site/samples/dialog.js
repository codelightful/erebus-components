function sampleDialogHandler() {
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet risus nullam eget felis eget nunc lobortis mattis aliquam. Risus viverra adipiscing at in tellus. Nisi vitae suscipit tellus mauris a diam maecenas. Sit amet consectetur adipiscing elit. Libero justo laoreet sit amet.';

    function openDialog(dialogType) {
        Erebus.dialog(dialogType, longText).then(function() {
            alert('The dialog has been closed');
        });
    }

    Erebus.$('#btnDialogInfo').onClick(function() {
        openDialog(Erebus.dialog.TYPE.info);
    });
    Erebus.$('#btnDialogSuccess').onClick(function() {
        openDialog(Erebus.dialog.TYPE.success);
    });
    Erebus.$('#btnDialogWarn').onClick(function() {
        openDialog(Erebus.dialog.TYPE.warn);
    });
    Erebus.$('#btnDialogError').onClick(function() {
        openDialog(Erebus.dialog.TYPE.error);
    });
    Erebus.$('#btnDialogConfirm').onClick(function() {
        Erebus.dialog.confirm(longText).then(function(select) {
            if (select) {
                alert('You have selected YES');
            } else {
                alert('You have selected NO');
            }
        });
    });
    Erebus.$('#btnDialogMulti').onClick(function() {
        Erebus.dialog.info('Dialog 1. ' + longText).then(function() {
            alert('Closed dialog 1');
        });
        Erebus.dialog.warn('Dialog 2. ' + longText).then(function() {
            alert('Closed dialog 2');
        });
        Erebus.dialog.error('Dialog 3. ' + longText).then(function() {
            alert('Closed dialog 3');
        });
        Erebus.dialog.success('Dialog 4. ' + longText).then(function() {
            alert('Closed dialog 4');
        });
    });
}
