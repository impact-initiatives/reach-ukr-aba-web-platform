function createChart(data, container, color) {
    var mydata = [
        {
            y: data.map(function (d) {
                return d.key
            }),
            x: data.map(function (d) {
                return d.value.sum
            }),
            type: 'bar',
            marker: {color: color},
            orientation: 'h'
        }
    ];

    Plotly.newPlot(container, mydata, {
            autosize: false,
            width: 350,
            height: 280,
            margin: {
                l: 200,
                r: 10,
                b: 30,
                t: 30,
                pad: 4
            },
            // paper_bgcolor: '#7f7f7f',
            // plot_bgcolor: '#c7c7c7'
        }
    );
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