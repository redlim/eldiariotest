(function () {

    const width = 960,
        height = 450;
    let centered;

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

// Define the div for the tooltip
    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.json("es.json", function (error, es) {
        if (error) return console.error(error);
        const subunits = topojson.feature(es, es.objects.ESP_adm2);

        const projection = d3.geo.mercator()
            .scale(2300)
            .center([0, 40])
            .translate([width / 2, height / 2]);

        const path = d3.geo.path()
            .projection(projection);

        const g = svg.append('g');

        g.selectAll(".subunit")
            .data(subunits.features)
            .enter()
            .append("path")
            .attr("class", (d) => {
                return "subunit " + d.id;
            })
            .attr("d", path)
            .style('fill',(d) => {
                return d3.hsl(Math.random() * 100, 0.5, 0.5);
            })
            .on('click', clicked)
            .on("mouseover",(d) => {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.properties.NAME_2 + "<br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", (d) => {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        g.append("path")
            .datum(topojson.mesh(es, es.objects.ESP_adm2, (a, b) =>{
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
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
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
    });
})();