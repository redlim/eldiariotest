import * as d3 from 'd3'
import es from './geojson/es.json'
import * as topojson from 'topojson'
import d3Legend from 'd3-svg-legend'
import provinceSeats from './data/valorporprovincia.json'
import validVotes from './data/votosvalidos2016.json'
import { colorbrewer } from './libs/colorbrewer'
import './index.css'

// FUENTE
//https://www.tuexperto.com/2019/04/04/escanos-por-provincia-2019-reparto-de-diputados-congreso/
const mapContainer = document.querySelector('#map');

const width = mapContainer.clientWidth;
const height = mapContainer.clientHeight;
let centered;

// Define the div for the tooltip
const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const tooltipDom = (d)  =>{
    return `${d.properties.NAME_2} 
            <br/> 
            Número de escaños por provincia: ${provinceSeats[d.properties.NAME_2]} `;
};

const provinceValues = Object.keys(provinceSeats).reduce((acc, province) =>{
    acc.push(provinceSeats[province]);
    return acc;
},[]);

const colorScale = d3.scaleQuantize()
    .domain([d3.min(provinceValues), d3.max(provinceValues)])
    .range(colorbrewer.Blues[4]);

const svg = d3.select('#map')
            .append('svg')
            .style('cursor', 'pointer');

svg.attr('viewBox', `50 10 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin");

const map = svg.append("g")
            .attr("class", "map");


const colorLegend = d3Legend.legendColor()
    .labelFormat( d3.format(",d"))
    .scale(colorScale)
    .labelDelimiter('-')
    .shapePadding(10)
    .shapeWidth(20)
    .shapeHeight(20)
    .labelOffset(10);

svg.append("g")
    .attr("transform", "translate(60, 40)")
    .attr("class", "legendQuant");

svg.select(".legendQuant")
    .call(colorLegend);

const drawMap = () => {
    const subunits = topojson.feature(es, es.objects.ESP_adm2);

    const projection = d3.geoMercator()
        .scale(2000)
        .center([-6, 40])
        .translate([width / 2, height / 2]);

    const path = d3.geoPath()
        .projection(projection);

    map.append('g')
    .selectAll(".subunit")
        .data(subunits.features)
        .enter()
        .append("path")
        .attr("class", function (d) {
            return "subunit " + d.properties.NAME_1;
        })
        .attr("d", path)
        .style('fill', function (d) {
            return colorScale(provinceSeats[d.properties.NAME_2]);
        })
        .on('click', clicked)
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html( tooltipDom(d))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    function clicked(d) {
        let x, y, k;

        if (d && centered !== d) {
            const centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;
            if (d.properties.NAME_1 ===  "Islas Canarias"){
                document.querySelector('.Canarias').style.transform = 'translate(0,0)';
            }
        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;
            if (d.properties.NAME_1 === "Islas Canarias"){
                document.querySelector('.Canarias').style.transform = '';
            }
        }

        map.selectAll("path")
            .classed("active", centered && function (d) {
                return d === centered;
            });
        map.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
    }
}
drawMap();
document.querySelector('#updateMap').addEventListener('click',()=>{
    updateMap();
});
const updateMap = () =>{

    const parsedData = validVotes.Datos.Metricas[0].Datos.reduce((acc, data)=>{
        acc[data.Parametro] = data.Valor;
        return acc;
    },{});

    const parsedDataValues = Object.keys(parsedData).reduce((acc, province) =>{
        acc.push(parsedData[province]);
        return acc;
    },[]);

    const newColorScale = d3.scaleQuantize()
        .domain([d3.min(parsedDataValues), d3.max(parsedDataValues)])
        .range(colorbrewer.Blues[4]);

    d3.selectAll('path')
        .transition()
        .delay(100)
        .style('fill', function (d) {
            return newColorScale(parsedData[d.properties.NAME_2]);
        });

    const newColorLegend = d3Legend.legendColor()
        .labelFormat( d3.format(",d"))
        .scale(newColorScale)
        .labelDelimiter('-')
        .shapePadding(10)
        .shapeWidth(20)
        .shapeHeight(20)
        .labelOffset(10);

    svg.select(".legendQuant")
        .attr("transform", "translate(60, 40)")
        .call(newColorLegend);

}