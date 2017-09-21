$('#indicator').selectize({
    create: false,
    sortField: 'text'
}).on('change', function (e) {
    var value = $(this).val();
    console.log(value);
//            period.filterExact(value);
//            dc.redrawAll();
});

$('#indicator').on('change', function (e) {
    var val = $(this).text();
    console.log(val);
});