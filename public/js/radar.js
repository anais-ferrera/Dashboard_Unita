 $(document).ready(function(){
   
    $(".div_content").hide();
     //unhides first option content
     //$("#DivContent:first").show(); 
     $("#radarChart_ch").show(); 
     
     //listen to dropdown for change
     $("#radar").change(function(){
       //rehide content on change
       $('.div_content').hide();
       //unhides current item
       $('#'+$(this).val()).show();
     }); 
    });
//////////////////////////////////////////////////////////////
//////////////////////// Set-Up //////////////////////////////
//////////////////////////////////////////////////////////////
var margin = { top: 10, right: 10, bottom: 20, left: 80 },
width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
height = Math.min(width, window.innerHeight - margin.top - margin.bottom);
				
//////////////////////////////////////////////////////////////
////////////////////////// Data //////////////////////////////
//////////////////////////////////////////////////////////////
var data_re = [
    //RENEWABLE ENERGY
        { name: 'Architecture-UBI',
            axes: [
                {axis: 'Civil Engineering-UBI', value: 90},
                {axis: 'Geographic Information Systems-UVT', value: 80},
                {axis: "Renewable Energies-UNIZAR", value: 60},
                {axis: 'Environmental Biology-UNITO', value: 75},
                {axis: 'Master sociologie-UPPA', value: 15},
                {axis: 'Biotechnology-UNITO', value: 25},
                {axis: "Forestry and environmental sciences-UNITO", value: 20},
                {axis: 'Biochemistry-UBI', value: 35},
                {axis: 'Design-UVT', value: 60},
                {axis: 'Physics-UVT', value: 50},
            ]
        },
        { name: 'Territorial planning-UVT',
            axes: [
                {axis: 'Civil Engineering-UBI', value: 100},
                {axis: 'Geographic Information Systems-UVT', value: 100},
                {axis: "Renewable Energies-UNIZAR", value: 20},
                {axis: 'Environmental Biology-UNITO', value: 35},
                {axis: 'Master sociologie-UPPA', value: 10},
                {axis: 'Biotechnology-UNITO', value: 50},
                {axis: "Forestry and environmental sciences-UNITO", value: 10},
                {axis: 'Biochemistry-UBI', value: 20},
                {axis: 'Design-UVT', value: 70},
                {axis: 'Physics-UVT', value: 20},
            ]
        }
    ];
    //CULTURAL HERITAGE
    var data_ch = [ 
           { name: 'Lusophone studies-UBI',
            axes: [
                {axis: 'Civil engineering-UBI', value: 40},
                {axis: 'Journalism-UBI', value: 80},
                {axis: "Studies on culture-UBI", value: 100},
                {axis: 'Philosophy-UNITO', value: 70},
                {axis: 'Pedagogical sciences-UNITO', value: 10},
                {axis: 'History of art-UNITO', value: 20},
                {axis: "Performing arts for theatre-UVT", value: 10},
                {axis: 'European union law-UVT', value: 20},
                {axis: 'Master geography-USMB', value: 40},
                {axis: 'Legal practice-UNIZAR', value: 60},
            ]
        },
        { name: 'Architecture-UNIZAR',
            axes: [
                {axis: 'Civil engineering-UBI', value: 10},
                {axis: 'Journalism-UBI', value: 20},
                {axis: "Studies on culture-UBI", value: 80},
                {axis: 'Philosophy-UNITO', value: 50},
                {axis: 'Pedagogical sciences-UNITO', value: 10},
                {axis: 'History of art-UNITO', value: 30},
                {axis: "Performing arts for theatre-UVT", value: 5},
                {axis: 'European union law-UVT', value: 75},
                {axis: 'Master geography-USMB', value: 85},
                {axis: 'Legal practice-UNIZAR', value: 65},
            ]
        }				
    ];
//CIRCULAR ECONOMY
    var data_ce = [
        { name: 'Management-UVT',
        axes: [
            {axis: 'Tourism development and planning-UVT', value: 20},
            {axis: 'Circular Economy-UNIZAR', value: 50},
            {axis: "Ecologie Industrielle et Territoriale-USMB", value: 10},
            {axis: 'Master Droit notarial-UPPA', value: 60},
            {axis: 'Biotechnology-UBI', value: 30},
            {axis: 'Economics-UNITO', value: 55},
            {axis: "Animal Science-UNITO", value: 5},
            {axis: 'Design-UVT', value: 5},
            {axis: 'Licence Economie Gestion-UPPA', value: 90},
            {axis: 'Biology-UVT', value: 5},
                                    ]
        },
        { name: 'Economics-UBI',
        axes: [
        {axis: 'Tourism development and planning-UVT', value: 60},
        {axis: 'Circular Economy-UNIZAR', value: 85},
        {axis: "Ecologie Industrielle et Territoriale-USMB", value: 20},
        {axis: 'Master Droit notarial-UPPA', value: 15},
        {axis: 'Biotechnology-UBI', value: 10},
        {axis: 'Economics-UNITO', value: 100},
        {axis: "Animal Science-UNITO", value: 15},
        {axis: 'Design-UVT', value: 10},
        {axis: 'Licence Economie Gestion-UPPA', value: 80},
        {axis: 'Biology-UVT', value: 10},
                                        ]
                                    }
        ];
            
//////////////////////////////////////////////////////////////
///// Second example /////////////////////////////////////////
///// Chart legend, custom color, custom unit, etc. //////////
//////////////////////////////////////////////////////////////
	var radarChartOptions_ch = {
	w: 290,
	h: 350,
	margin: margin,
	maxValue: 60,
	levels: 5,
	roundStrokes: false,
	color: d3.scaleOrdinal().range(["#EEDA2F", "#885AF9"]),
	format: '.0f',
	legend: { title: 'Programs', translateX: 170, translateY: 15 },
    unit: ''
};
				
// Draw the chart, get a reference the created svg element :
let svg_radar_ch = RadarChart("#radarChart_ch", data_ch, radarChartOptions_ch);

var radarChartOptions_re = {
	w: 290,
	h: 350,
	margin: margin,
	maxValue: 60,
	levels: 5,
	roundStrokes: false,
	color: d3.scaleOrdinal().range(["#61DB53", "#DB53AB"]),
	format: '.0f',
	legend: { title: 'Programs', translateX: 170, translateY: 15 },
    unit: ''
};
				
// Draw the chart, get a reference the created svg element :
let svg_radar_re = RadarChart("#radarChart_re", data_re, radarChartOptions_re);

var radarChartOptions_ce = {
	w: 290,
	h: 350,
	margin: margin,
	maxValue: 60,
	levels: 5,
	roundStrokes: false,
	color: d3.scaleOrdinal().range(["#DB802C","#18B3DB"]),
	format: '.0f',
	legend: { title: 'Programs', translateX: 170, translateY: 15 },
    unit: ''
};
				
// Draw the chart, get a reference the created svg element :
let svg_radar_ce = RadarChart("#radarChart_ce", data_ce, radarChartOptions_ce);