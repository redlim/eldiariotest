import * as d3 from "d3";
import * as topojson from "topojson";
import es from "../geojson/es";

export class SpainMap  {

    constructor(container) {
        this.mapContainer = document.querySelector(container);
        this.svg = d3.select(container)
            .append('svg')
            .style('cursor', 'pointer');
        this.map = this.svg.append("g")
            .attr("class", "map");
        this.centered = null;

        this.tooltipContainer = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    }

    init ({data, color, colorLegend, tooltipText}){
        const width = this.mapContainer.clientWidth;
        const height = this.mapContainer.clientHeight;
        const subunits = topojson.feature(es, es.objects.ESP_adm2);

        const projection = d3.geoMercator()
            .scale(2000)
            .center([-6, 40])
            .translate([width / 2, height / 2]);

        const path = d3.geoPath()
            .projection(projection);

        this.svg.attr('viewBox', `50 10 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMinYMin");

        this.svg.append("g")
            .attr("transform", "translate(60, 40)")
            .attr("class", "legendQuant");

        this.svg.select(".legendQuant")
            .call(colorLegend);

        this.map.append('g')
            .selectAll(".subunit")
            .data(subunits.features)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return "subunit " + d.properties.NAME_1;
            })
            .attr("d", path)
            .style('fill', function (d) {
                return color(data[d.properties.NAME_2]);
            })
            .on('click', (d) => this._handleClick(d,path, width, height))
            .on("mouseover",(d)=> this._handleMouseOver(d, data, tooltipText))
            .on("mouseout", () => this._handleMouseOut());
    }

    _tooltipDom(d,data,text){
        return `${d.properties.NAME_2} 
        <br/> 
        ${text} ${data[d.properties.NAME_2]} `;
    }
    _handleMouseOver(d, data, text){
        this.tooltipContainer.transition()
            .duration(200)
            .style("opacity", .9);

        this.tooltipContainer.html(this._tooltipDom(d,data, text))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    }
    _handleMouseOut(){
        this.tooltipContainer.transition()
            .duration(500)
            .style("opacity", 0);
    }
    _handleClick(d,path, width,height) {
        let x, y, k;

        if (d && this.centered !== d) {
            const centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            this.centered = d;
            if (d.properties.NAME_1 ===  "Islas Canarias"){
                document.querySelector('.Canarias').style.transform = 'translate(0,0)';
            }
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            this.centered = null;
            if (d.properties.NAME_1 === "Islas Canarias"){
                document.querySelector('.Canarias').style.transform = '';
            }
        }

        this.map.selectAll("path")
            .classed("active", this.centered && function (d) {
                return d === this.centered;
            });
        this.map.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
    }


    update({data, color, colorLegend, tooltipText}){
        d3.selectAll('path')
            .on('mouseover',(d)=>this._handleMouseOver(d, data, tooltipText))
            .transition()
            .delay(100)
            .style('fill', (d) => {
                    return color(data[d.properties.NAME_2]);
            });


        this.svg.select(".legendQuant")
            .attr("transform", "translate(60, 40)")
            .call(colorLegend);
    }
}