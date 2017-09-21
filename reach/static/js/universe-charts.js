function universeCharts(dataset, selected_settlement) {
    universe(dataset).then(function (myUniverse) {
        return myUniverse.filter('KOATUU', selected_settlement)
    }).then(function (myUniverse) {
        myUniverse.filter('related_question', 'comm_q63');
        return myUniverse.query({
            groupBy: 'option_label',
            select: {
                $sum: 'Value' // Count the number of records
            }
        })
    }).then(function (res) {
        createChart(res.data.filter(function (d) {
            return d.value.sum > 0
        }), 'myDiv', '#ee5859');

        return res.universe;

    }).then(function (myUniverse) {
        myUniverse.filterAll();
        return myUniverse.filterAll([
            {
                column: 'KOATUU',
                value: selected_settlement
            },
            {
                column: 'related_question',
                value: 'comm_q6'
            }
        ])
    }).then(function (myUniverse) {


        return myUniverse.query({
            groupBy: 'option_label',
            select: {
                $sum: 'Value' // Count the number of records
            }
        })
    }).then(function (res) {
        createChart(res.data.filter(function (d) {
            return d.value.sum > 0
        }), 'myDiv2', '#a5c9a1');

        return res.universe;
    }).then(function (myUniverse) {
        myUniverse.filterAll()

        return myUniverse.filterAll([
            {
                column: 'KOATUU',
                value: selected_settlement
            },
            {
                column: 'related_question',
                value: 'comm_q9'
            }
        ])
    }).then(function (myUniverse) {
        return myUniverse.query({
            groupBy: 'option_label',
            select: {
                $sum: 'Value' // Count the number of records
            }
        })
    }).then(function (res) {
        createChart(res.data.filter(function (d) {
            return d.value.sum > 0
        }), 'myDiv3', '#58585a')

        return res.universe;
    }).then(function (myUniverse) {
        myUniverse.filterAll()

        return myUniverse.filterAll([
            {
                column: 'KOATUU',
                value: selected_settlement
            },
            {
                column: 'related_question',
                value: 'comm_q16'
            }
        ])
    }).then(function (myUniverse) {
        return myUniverse.query({
            groupBy: 'option_label',
            select: {
                $sum: 'Value' // Count the number of records
            }
        })
    }).then(function (res) {
        createChart(res.data.filter(function (d) {
            return d.value.sum > 0
        }), 'myDiv4', '#d2cbb8')

        return res.universe;
    });
}