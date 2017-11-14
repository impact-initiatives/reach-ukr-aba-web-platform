function universeCharts(dataset, selected_settlement) {

    var questions = [
        ['comm_q63', '#protection', '#ee5859'],
        ['comm_q6', '#education', '#a5c9a1'],
        ['comm_q9', '#medical', '#58585a'],
        ['comm_q16', '#fuel', '#d2cbb8'],
        ['comm_q76', '#wash', '#56b3cd'],
        ['comm_q51', '#livelihoods1', '#f69e61'],
        ['comm_q58', '#livelihoods2', '#95a0a9'],
        ['comm_q61', '#livelihoods3', '#0067a9'],
        ['comm_q62', '#livelihoods4', '#fff67a']
    ];

    var nextChart = function (question, container, color) {
        universe(dataset).then(function (myUniverse) {
            return myUniverse.filter('KOATUU', selected_settlement)
        }).then(
            function (myUniverse) {

                myUniverse.filter('related_question', question);
                return myUniverse.query({
                    groupBy: 'option_label',
                    select: {
                        $sum: 'Value'
                    }
                })

            }
        ).then(function (res) {

            createChart(res.data, container, color);
            return res.universe;

        });

    };

    questions.map(function (d) {
        nextChart(d[0], d[1], d[2]);
    })
}