var dotdata=[];

var hddata=[];
var strokedata=[];
var suicidedata=[];
//for (var i=0; i<50;i++){
//	dotdata.push(Math.random()*50)
//}

var parentwidth = 0.5*(document.getElementById("chart").offsetWidth)
var margin={top:10, right:25, bottom:50, left:100}
var width=parentwidth-margin.left-margin.right
var height=600-margin.top-margin.bottom
var radius=3.5
var xScale=d3.scale.linear()
	.domain([0,300])
	.range([0,width]);

var currentFile="HeartDisease";
var sortby = "state"

document.getElementById("heartDis").style.color="blue";

function sortDots(data){
	if (sortby == "state"){
	data = _.orderBy(data,sortby,'asc');
	} else {
	data = _.orderBy(data,sortby,'desc');}

	return data;
}

function getLabels(data){
var dotlabels=[];
	for (i=0;i<data.length;i++){
		dotlabels.push(data[i].state)
	}
return dotlabels;
}

var sortSelected = document.sortForm.sort;

for (i=0;i<sortSelected.length;i++){
		sortSelected[i].onclick = function (){
		sortby = this.value
		updateDots(currentFile)
	}
}

var hAxis;
yScale=d3.scale.ordinal()
				.rangePoints([0,height]);
var yLoc=d3.scale.ordinal()
				.rangePoints([0,height])

var vAxis = d3.svg.axis()
						.orient('left')

var vGuide;

d3.json('data/'+currentFile+'.json', function(error,data){
if (!error){
sortDots(data)
var labels = getLabels(data)
//var tempColor;
var natest = labels.indexOf("National");//pull index of National estimate
//var ref = [dotdata[natest]];//pull value of National estimate

//dotdata.sort(function compareNumbers(a,b){return a-b;})
yScale.domain(labels)

yLoc.domain(d3.range(0,labels.length))

vAxis.scale(yScale)


var dotplot=d3.select('#chart').append('svg')
	.attr('id','dotplot')
  .attr('width',width+margin.left+margin.right)
  .attr('height', height+margin.top+margin.bottom)
  .style('background','rgba(245,245,250,.98)')
  .append('g')//groups everything below it together - useful for grouping different parts of the figure
  .attr("transform","translate("+margin.left+","+margin.top+")")
  .selectAll('circle').data(data)
  .enter().append('circle')
  .attr('class', 'dots')
  .style('fill','rgba(0,0,0,1)')
  .attr('r',radius)
  .attr('cy', function(d,i){return yLoc(i)})
  .attr('cx', function(d){return xScale(d.aa_rate)})

d3.select('#dotplot').append('text')
	.text("Deaths/100,000 Persons")
	.attr("x",250)
	.attr("y",590)

//reference line
d3.select('#dotplot').data(["0"]).append('line')
  .attr('stroke', '#000')
  .attr('stroke-dasharray', '5,5')
  .attr('x1',function(d){return xScale(d)})
  .attr('x2',function(d){return xScale(d)})
  .attr('y1',0)
  .attr('y2',height)
  .attr("transform","translate("+margin.left+","+margin.top+")")

//y-axis gridlines
d3.select('#dotplot').append('g').selectAll('line')
	.data(labels).enter().append('line')
    .attr('stroke','#000')
    .attr('stroke-width','.5')
    .attr('x1',-5)
    .attr('x2',width)
    .attr('y1',function(d){return yScale(d)})
    .attr('y2',function(d){return yScale(d)})
    .attr("transform","translate("+margin.left+","+margin.top+")")

//AXES
hAxis = d3.svg.axis()
	.scale(xScale)
	.orient('bottom')

var hGuide = d3.select('svg').append('g')
	hAxis(hGuide)
	hGuide.attr("transform","translate("+margin.left+","+(height+margin.top+10)+")")
	hGuide.selectAll('path')
		.style({fill: 'none', stroke:"#000"})




vGuide = d3.select('svg').append('g')
	vAxis(vGuide)
	vGuide.attr("transform","translate("+margin.left+","+margin.top+")")
	vGuide.selectAll('path')
		.style({fill: 'none', stroke:"#000"})

}

});

function updateDots(file){
	d3.json('data/'+file+'.json', function(error,data){
	console.log(data[0])
	data = sortDots(data)
	console.log(data[0])
	var labels = getLabels(data)
	console.log(labels)
	yScale.domain(labels)
	yLoc.domain(d3.range(0,labels.length))
  vAxis.scale(yScale)
	vAxis(vGuide)

	d3.selectAll('circle').data(data)
		.transition().duration(750).delay(100)
		.attr('cy', function(d,i){return yLoc(i)})
		.attr('cx', function(d){return xScale(d.aa_rate)})

	});
}

function changeListItemColor(id){
var causelistArray = document.getElementById("causeList").getElementsByTagName("li")
				for (i=0;i<causelistArray.length;i++){
					if (causelistArray[i].id == id){
						causelistArray[i].style.color="blue";
					} else {
						causelistArray[i].style.color="black";
					}
				}
}

function addCauseListeners(id,file){
	document.getElementById(id).addEventListener("click",function(){
		currentFile=file;
		updateDots(currentFile)
		changeListItemColor(id)

	});

}

$.getJSON('constants/id_file.json',function(result){
	if (result){
				for (i=0;i<10;i++){
					var id=result[i].id
					var file=result[i].file
					addCauseListeners(id,file)
			}
		};
	});
