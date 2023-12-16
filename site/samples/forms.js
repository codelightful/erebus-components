function sampleFormHandler() {
    Erebus.$('#btnValidateForm').onClick(function() {
        const result = Erebus.form('divTestForm01').validate(Erebus.form.handler);
        console.log('result=', result);
    });
}
