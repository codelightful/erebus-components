function sampleToastHandler() {
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet risus nullam eget felis eget nunc lobortis mattis aliquam. Risus viverra adipiscing at in tellus. Nisi vitae suscipit tellus mauris a diam maecenas. Sit amet consectetur adipiscing elit. Libero justo laoreet sit amet.';

    function openToast(toastType) {
        Erebus.toast(toastType, longText).then(function(toastObj) {
            alert('The toast has been opened and will be closed automatically in 5 seconds');
            toastObj.onClose(function() {
                alert('The toast has been closed');
            });
            toastObj.autoClose(5000);
        });
    }

    Erebus.$('#btnToastInfo').onClick(function() {
        openToast(Erebus.toast.TYPE.info);
    });
    Erebus.$('#btnToastSuccess').onClick(function() {
        openToast(Erebus.toast.TYPE.success);
    });
    Erebus.$('#btnToastWarn').onClick(function() {
        openToast(Erebus.toast.TYPE.warn);
    });
    Erebus.$('#btnToastError').onClick(function() {
        openToast(Erebus.toast.TYPE.error);
    });
    Erebus.$('#btnToastMulti').onClick(function() {
        Erebus.toast.info('Toast 1. ' + longText);
        Erebus.toast.success('Toast 2. ' + longText);
        Erebus.toast.error('Toast 3. ' + longText);
        Erebus.toast.warn('Toast 4. ' + longText);
    });
    Erebus.$('#btnToastCloseAll').onClick(function() {
        Erebus.toast.closeAll();
    });
}