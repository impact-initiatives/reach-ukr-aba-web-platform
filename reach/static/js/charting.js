var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight || e.clientHeight || g.clientHeight,
    p = 50;

var chartWidth = (x / 2 - p * 2) / 2;

function createChart(source, container, color) {


    var data = source.filter(function (d) {
        return d.value.sum > 0
    }).map(function (d) {
        return {
            key: d.key,
            value: d.value.sum
        }
    }).sort(function (a, b) {
        if (a.value > b.value) {
            return -1;
        }
        if (a.value < b.value) {
            return 1;
        }
        // a == b
        return 0;
    });

    var chart = c3.generate({
        bindto: container,
        size: {
            height: 320,
            width: chartWidth
        },
        data: {
            json: data,
            keys: {
                x: 'key', // it's possible to specify 'x' when category axis
                value: ['value']
            },
            order: 'desc',
            colors: {value: color},
            type: 'bar'
        },
        legend: {
            show: false
        },
        axis: {
            rotated: true,
            x: {
                type: 'category',
                tick: {
                    rotate: 90
                },
                inner: true
            },
            y: {
                tick: {
                    format: d3.format("d")
                }
            }
        }
    });


    // var mydata = [
    //     {
    //         y: data.map(function (d) {
    //             return d.key
    //         }),
    //         x: data.map(function (d) {
    //             return d.value.sum
    //         }),
    //         type: 'bar',
    //         marker: {color: color},
    //         orientation: 'h'
    //     }
    // ];
    //
    // Plotly.newPlot(container, mydata, {
    //         autosize: false,
    //         width: 350,
    //         height: 280,
    //         margin: {
    //             l: 200,
    //             r: 10,
    //             b: 30,
    //             t: 30,
    //             pad: 4
    //         },
    //         // paper_bgcolor: '#7f7f7f',
    //         // plot_bgcolor: '#c7c7c7'
    //     }
    // );
}


// function singleChoices(data) {
//
//     var singleChoiceContainer = d3.select("#single-choice")
//         .selectAll('div')
//         .data(data);
//
//     singleChoiceContainer
//         .exit()
//         .remove();
//
//     singleChoiceContainer
//         .data(data)
//         .enter()
//         .append("div")
//         // .merge(singleChoiceContainer)
//         .text(function (d, i) {
//             return (i + 1) + '. ' + d.question + ': ' + d.response;
//         });
//
// }