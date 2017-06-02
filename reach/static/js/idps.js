var projection = d3.geo.mercator().center([36, 48]).scale(1900);

var mapChart = dc.geoChoroplethChart("#map"),
    dataTable = dc.dataTable("#table"),
    oblastChart = dc.barChart('#oblasts');

d3.json('../../static/data/idps.json', function (error, data) {

    var cf = crossfilter(data);
    var oblast = cf.dimension(function (d) {
        return d['Name'];
    });

    var dateParse = d3.time.format('%d.%m.%Y');

    var period = cf.dimension(function (d) {
        return dateParse.parse(d['Period']);
    });
    var numberidp = cf.dimension(function (d) {
        return d['IDPs'];
    });

    var idps = numberidp.group().all().map(function (d) {
        return d.key
    });

    var NameDimension = cf.dimension(function (d) {
            return d.Name;
        }),
        PeriodDim = cf.dimension(function (d) {
            return d.Period;
        }),
        periods = PeriodDim.group().all().map(function (d) {
            return d.key
        }),
        oblastslist = oblast.group().all().map(function (d) {
            return d.key
        }),
        IDPsSumGroup = oblast.group().reduce(function (p, v) {
            p[v.Period] = (p[v.Period] || 0) + v['IDPs'];
            return p;
        }, function (p, v) {
            p[v.Period] = (p[v.Period] || 0) - v['IDPs'];
            return p;
        }, function () {
            return {};
        });


    var oblasts = oblast.group()
        .reduceSum(function (d) {
            return d["IDPs"];
        });

    var oblastList = oblast.group().all().map(function (d) {
        return d.key
    });


    var quantile = d3.scale.threshold()
        .domain([1, 5000, 10000, 150000, 20000, 25000, 50000, 100000, 150000, 300000])
        .range([
            '#ffffff',
            '#fbd5d5',
            '#f7b1b1',
            '#f38d8e',
            '#f06a6b',
            '#ec4647',
            '#e92324',
            '#d01516',
            '#ac1112',
            '#890e0e',
            '#650a0b'
        ]);


    function sel_stack(i) {
        return function (d) {
            return d.value[i];
        };
    }

    oblastChart
        .width(890)
        .height(500)
        .x(d3.scale.ordinal().domain(oblastslist))
        .xUnits(dc.units.ordinal)
        .title(function (d) {
            return d.key + ' [' + this.layer + ']: ' + d.value[this.layer];
        })
        .margins({top: 10, right: 10, bottom: 80, left: 40})
        .brushOn(false)
        .clipPadding(10)
        .dimension(oblast)
        .renderType('group')
        .group(IDPsSumGroup, periods[0], sel_stack(periods[0]))
        .transitionDuration(500)
        .centerBar(true)
        /*                .gap(5)*/
        .renderType('group')
        .colors(d3.scale.ordinal().range(['rgb(88,88,90)', 'rgb(209,211,212)', 'rgb(238,88,89)', 'rgb(210,203,184)']))
        /*                .colors(['rgb(88,88,90)','#ec4647','rgb(209,211,212)','rgb(210,203,184)'])*/
        .xUnits(dc.units.ordinal)
        .elasticX(true)
        .elasticY(true)
        //            .xAxisLabel('Oblast')
        .yAxisLabel(null)
        //            .on('filtered', function(chart, filter) {
        //                var filters = {}
        ////                filters['Status'] = status_chart.filters()
        ////                updateFilters(filters)
        //            })
        .xAxis()
        .ticks(10);


    for (var i = 1; i < periods.length; ++i) {
        oblastChart.stack(IDPsSumGroup, periods[i], sel_stack(periods[i]));
    }


    var margin = {top: 30, right: 40, bottom: 80, left: 50};

    oblastChart.on("renderlet.oblastChart", function (chart) {
        chart.selectAll(".x text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr('transform', "rotate(-65)");
    });

    dataTable
        .dimension(oblast)
        .group(function (d) {
            return 'Total number:'
        })
        .columns([
            //                function(d) { return d.KOATUU; },
            function (d) {
                return d.Name;
            },
            function (d) {
                return d3.format(',')(d.IDPs);
            }
        ]);


    mapChart
        .width(670)
        .dimension(oblast)
        .group(oblasts)
        .colors(quantile)
        .overlayGeoJson(
            adm1.features
            , "state"
            , function (d) {
                return d.properties.NAME_LAT;
            }
        )
        .projection(projection);

    //            .on('filtered', function(chart, filter) {
    //                var filters = {};
    //                filters['map'] = mapChart.filters();
    //                console.log(mapChart.filters())
    //                dataTable.filters = mapChart.filters();
    //                oblast.filterAll(mapChart.filters());
    //                dc.redrawAll();
    //                dataTable.render();
    //                console.log(filters)
    //            });

    periods.forEach(function (e, i) {
        periods[i] = +moment(e, 'DD.MM.YYYY').format("X");
    });

     period.filterExact(periods[0]);

    dc.renderAll();

    $("#periodSlider").ionRangeSlider({
        values: periods,
        grid: true,
        force_edges: true,
        keyboard: true,
        prettify: function (num) {
            var m = moment(num, "X").locale("ru");
            return m.format("Do MMMM, YYYY");
        },
        onFinish: function (data) {
            var periodFilter = moment(data.from_value, "X").locale("ru").format("DD.MM.YYYY");
            period.filterExact(dateParse.parse(periodFilter));
            dc.redrawAll();
        }
    });


    {
        // fix interactions between map and oblast charts

        var all = dc.chartRegistry.list();

        mapChart.onClick = function (datum, layerIndex) {
            var selectedRegion = mapChart.geoJsons()[layerIndex].keyAccessor(datum);
            oblastChart.filter(selectedRegion);
            mapChart.redrawGroup()
        };

        mapChart.hasFilter = function (filter) {
            var filters = oblastChart.filters();
            if (!filter) {
                return filters.length > 0
            }
            return filters.indexOf(filter) != -1
        }
    }

    var svg = d3.select("#legend");

    svg.append("g")
        .attr("class", "legendQuant")
        .attr("transform", "translate(20,20)");

    var legend = d3.legend.color()
        .labelFormat(d3.format(",.0f"))
        .scale(quantile);

    svg.select(".legendQuant")
        .call(legend);

    var ResetAll = function () {
        dc.filterAll();
        dc.redrawAll();
        filters = {}
    };


    $('#reset').on('click', function (e) {
        ResetAll();
    });

});
