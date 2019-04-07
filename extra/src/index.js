import * as d3 from 'd3'
import d3Legend from 'd3-svg-legend'
import provinceSeats from './data/valorporprovincia.json'
import validVotes from './data/votosvalidos2016.json'
import { colorbrewer } from './libs/colorbrewer'
import { SpainMap } from './libs/map'
import constants from './utils/const'
import './index.css'

// **** config of Province Seats in 2019 ****//
const provinceValues = Object.keys(provinceSeats).reduce((acc, province) =>{
    acc.push(provinceSeats[province]);
    return acc;
},[]);

const colorScale = d3.scaleQuantize()
    .domain([d3.min(provinceValues), d3.max(provinceValues)])
    .range(colorbrewer.Blues[constants.COLOR_SCALE_MAX]);

const colorLegend = d3Legend.legendColor()
    .labelFormat( d3.format(",d"))
    .scale(colorScale)
    .labelDelimiter('-')
    .shapePadding(10)
    .shapeWidth(20)
    .shapeHeight(20)
    .labelOffset(10);

const mapSitesPerProvinceConf = {
    data: provinceSeats,
    color: colorScale,
    colorLegend,
    tooltipText: 'Escaños por provincia: ',
    title: 'Número de escaños por provincia en 2019',
    shortTitle: 'Votos válidos'
};

// ***** config of Number of valid votes ***** //
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
    .range(colorbrewer.Blues[constants.COLOR_SCALE_MAX]);

const newColorLegend = d3Legend.legendColor()
    .labelFormat( d3.format(".3f"))
    .scale(newColorScale)
    .labelDelimiter('-')
    .shapePadding(10)
    .shapeWidth(20)
    .shapeHeight(20)
    .labelOffset(10);

const mapValidVotesIn2016Conf = {
    data: parsedData,
    color: newColorScale,
    colorLegend: newColorLegend,
    tooltipText: 'Votos válidos en 2016: ',
    title: 'Número de votos válidos por cada diputado elegido en 2016',
    shortTitle: 'Escaños por provincia'
};


const mapTitle = document.querySelector('#mapTitle');
const spainMap = new SpainMap('#map');

mapTitle.innerText = mapSitesPerProvinceConf.title;
spainMap.init(mapSitesPerProvinceConf);

let switchMap = false;
document.querySelector('#updateMap').addEventListener('click',(e)=>{
    switchMap = !switchMap;
    if (switchMap) {
        mapTitle.innerText = mapValidVotesIn2016Conf.title;
        return spainMap.update(mapValidVotesIn2016Conf);
    }
    mapTitle.innerText = mapSitesPerProvinceConf.title;
    spainMap.update(mapSitesPerProvinceConf)
});