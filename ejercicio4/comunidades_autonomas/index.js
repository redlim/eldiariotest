(function() {
    function getWidthAndHeight(selector) {
        const width = document.querySelector(selector).offsetWidth;
        const height = document.querySelector(selector).offsetHeight;
        return {width,height}
    }

    const canariasId = 'ES.CN';
    const canariasClass = '.Canarias';
    const canariasContainer = document.querySelector(canariasClass);
    const map = d3.select("#map");
    const {width, height } = getWidthAndHeight('#map');
    const viewPortrait = width < height;
    let centered;

    const svg = map.append("svg")
        .attr("width", width)
        .attr("height", height);

    // Define the div for the tooltip
    const div = d3.select("#map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.json("es.json", function (error, es) {
        if (error) return console.error(error);

        const subunits = topojson.feature(es, es.objects.ESP_adm1);

        const projection = d3.geoMercator()
            .scale(viewPortrait ? 1000 : width + 1000)
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
            .style('fill', function () {
                return d3.hsl(Math.random() * 100, 0.6, 0.5);
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
                if (d.properties.HASC_1 === canariasId){
                    canariasContainer.style.transform = 'translate(0,0)';
                }
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
                if (d.properties.HASC_1 === "ES.CN"){
                    canariasContainer.style.transform = '';
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
            const {width, height } = getWidthAndHeight('#map');
            d3.select('svg')
                .attr("width", width)
                .attr("height", height);

            if (width < height ) {
                console.log('hey', width, height)
                projection
                    .scale(500)
                    .translate([width/2,height/2]);
            } else
            projection
                .scale(width + 1000)
                .translate([width/2,height/2]);
            d3.selectAll("path").attr('d', path);
        }
    });
})();