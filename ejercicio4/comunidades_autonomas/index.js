(function() {
    const map = d3.select("#map");
    let width = map.node().getBoundingClientRect().width;
    let height = map.node().getBoundingClientRect().height;
    let centered;

    const svg = map.append("svg")
        .attr("width", width)
        .attr("height", height);

    // Define the div for the tooltip
    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.json("es.json", function (error, es) {
        if (error) return console.error(error);

        const subunits = topojson.feature(es, es.objects.ESP_adm1);

        const projection = d3.geoMercator()
            .scale(width + 1000)
            .center([-4, 40])
            .translate([width / 2, height / 2]);

        const path = d3.geoPath()
            .projection(projection);

        const g = svg.append('g');
        g.selectAll(".subunit")
            .data(subunits.features)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return "subunit " + d.properties.NAME_1;
            })
            .attr("d", path)
            .style('fill', function (d) {
                return d3.hsl(Math.random() * 100, 0.5, 0.5);
            })
            .on('click', clicked)
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.properties.NAME_1 + "<br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        g.append("path")
            .datum(topojson.mesh(es, es.objects.ESP_adm1, function (a, b) {
                return a !== b && a.id !== "ESP";
            }))
            .attr("d", path)
            .attr("class", "subunit-boundary");

        function clicked(d) {
            let x, y, k;

            if (d && centered !== d) {
                const centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 4;
                centered = d;
                if (d.properties.HASC_1 === "ES.CN"){
                    document.querySelector('.Canarias').style.transform = 'translate(0,0)';
                }
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
                if (d.properties.HASC_1 === "ES.CN"){
                    document.querySelector('.Canarias').style.transform = '';
                }
            }

            g.selectAll("path")
                .classed("active", centered && function (d) {
                    return d === centered;
                });
            g.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                .style("stroke-width", 1.5 / k + "px");
        }
        d3.select(window).on('resize', resize);
        function resize(){
            let width = document.querySelector('#map').offsetWidth;
            let height = document.querySelector('#map').offsetHeight;
            projection
                .scale(width + 1000)
                .translate([width/2,height/2]);
            d3.selectAll("path").attr('d', path);
        }
    });
})();