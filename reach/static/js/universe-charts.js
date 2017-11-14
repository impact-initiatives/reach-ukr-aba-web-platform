function renderNext(question) {

}


function universeCharts(dataset, selected_settlement) {

    var questions = [
        ['comm_q6', '#education', '#a5c9a1'],
        ['comm_q9', '#medical', '#58585a'],
        ['comm_q16', '#fuel', '#d2cbb8'],

        ['comm_q76', '#wash', '#56b3cd'],
        ['comm_q51', '#livelihoods1', '#f69e61'],
        ['comm_q58', '#livelihoods2', '#95a0a9'],
        ['comm_q61', '#livelihoods3', '#0067a9'],
        ['comm_q62', '#livelihoods4', '#fff67a']
    ];

    var universeCall = universe(dataset).then(function (myUniverse) {

        return myUniverse.filter('KOATUU', selected_settlement)

    }).then(
        function (myUniverse) {

            myUniverse.filter('related_question', 'comm_q63');
            return myUniverse.query({
                groupBy: 'option_label',
                select: {
                    $sum: 'Value' // Count the number of records
                }
            })

        }
    ).then(function (res) {

        createChart(res.data, '#protection', '#ee5859');
        return res.universe;

    });

    universeCall.nextChart = function (question, container, color) {
        return this.then(
            function (myUniverse) {
                myUniverse.filterAll();
                return myUniverse.filterAll([
                    {
                        column: 'KOATUU',
                        value: selected_settlement
                    },
                    {
                        column: 'related_question',
                        value: question
                    }
                ])
            }
        ).then(function (myUniverse) {
            return myUniverse.query({
                groupBy: 'option_label',
                select: {
                    $sum: 'Value' // Count the number of records
                }
            })
        }).then(function (res) {
            // console.log(res.data)
            createChart(res.data, container, color);
            return res.universe;
        });
    };

    questions.map(function (d) {
        console.log(d[0])
        universeCall.nextChart(d[0], d[1], d[2]);
        // console.log(d[0], d[1], d[2]);
    })


//     .then(
//         function (myUniverse) {
//             myUniverse.filterAll();
//
//             return myUniverse.filterAll([
//                 {
//                     column: 'KOATUU',
//                     value: selected_settlement
//                 },
//                 {
//                     column: 'related_question',
//                     value: 'comm_q9'
//                 }
//             ])
//         }
//     ).then(function (myUniverse) {
//             return myUniverse.query({
//                 groupBy: 'option_label',
//                 select: {
//                     $sum: 'Value' // Count the number of records
//                 }
//             })
//         }
//     ).then(function (res) {
//         createChart(res.data, '#medical', '#58585a');
//
//         return res.universe;
//     }).then(function (myUniverse) {
//         myUniverse.filterAll();
//
//         return myUniverse.filterAll([
//             {
//                 column: 'KOATUU',
//                 value: selected_settlement
//             },
//             {
//                 column: 'related_question',
//                 value: 'comm_q16'
//             }
//         ])
//     }).then(function (myUniverse) {
//         return myUniverse.query({
//             groupBy: 'option_label',
//             select: {
//                 $sum: 'Value' // Count the number of records
//             }
//         })
//     })
//     .then(function (res) {
//
//         createChart(res.data, '#fuel', '#d2cbb8');
//         return res.universe;
//
//     });
}