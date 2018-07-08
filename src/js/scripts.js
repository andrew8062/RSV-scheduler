
var job = function(name, day, unit, fetal=false){
	this.name = name
	this.day = day
	this.unit = unit
	this.fetal = fetal

	this.info = function(){
		return 'name: ' + this.name + ' day: '+this.day + ' unit '+this.unit + ' fetal: '+this.fetal
	}
	
}




function compare(a,b){
		if (a.day == 10) { return 1}
		if(a.fetal && !b.fetal) {return -1}
		if (a.day < b.day) { return -1}
		if (a.day > b.day) { return 1}
		return 0;
	}

var system = function(id, running, available){
	this.id = id
	this.running = running
	this.available = available
	this.history = []
}

default_jobs = []

default_jobs.push(new job("temperature humidity test", 10,4, true))
default_jobs.push(new job("System Pogo", 7,2))
default_jobs.push(new job("Weighted Shock", 1,2))
default_jobs.push(new job("Edu Durability", 10,5))
default_jobs.push(new job("Temperature/voltage margin", 10,2, true))
default_jobs.push(new job("Free Fall Drop", 2,3))
default_jobs.push(new job("wrenching", 5,3))
default_jobs.push(new job("Buffing", 1,1))
default_jobs.push(new job("LCD Wobble", 1,2))
default_jobs.push(new job("LCD POGO", 5,3))
default_jobs.push(new job("Palmrest Pogo", 5,3))
default_jobs.push(new job("Button Cycling", 3,4))
default_jobs.push(new job("Module Cycling", 3,4))
default_jobs.push(new job("Thermal Profile", 7,1))
default_jobs.push(new job("Thermal Shock", 5,5, true))
default_jobs.push(new job("Liquid", 5,5, true))
default_jobs.push(new job("Hinge Cycling", 5,5))
default_jobs.push(new job("vibration", 2,2,true))
default_jobs.push(new job("Strain test", 2,1,true))
default_jobs.push(new job("Palm rest vibration", 1,2))
default_jobs.push(new job("Hinge cycle abrasion", 3,3))
html = ''
html +=`
<div class="divTableRow">
    <div class="divTableCell">Name</div>
    <div class="divTableCell">Select</div>
    <div class="divTableCell">Day</div>
    <div class="divTableCell">Unit</div>
    <div class="divTableCell">Destoryed</div>
  </div>
`
for (var i in default_jobs){
	fetal = default_jobs[i].fetal ? "checked" :""
	html+=
	`
	<div class="divTableRow" id=`+ i +`>
	    <div class="divTableCell">`+ default_jobs[i].name +`</div>
	    <div class="divTableCell"><input class='selector' type="checkbox" name="select""></div>
	    <div class="divTableCell"><input class='day' type="text" name="day" size=3 value=`+ default_jobs[i].day+`></div>
	    <div class="divTableCell"><input class='unit' type="text" name="unit" size =3 value=`+ default_jobs[i].unit +`></div>
	    <div class="divTableCell"><input class='destoryed' type="checkbox" name="firstname " `+ fetal +` ></div>
	  </div>
	  `
}

// console.log(html)
document.getElementById('list').innerHTML = html;
var update = function(){
	select = document.getElementsByClassName('selector')
	day = document.getElementsByClassName('day')
	unit = document.getElementsByClassName('unit')
	fetal = document.getElementsByClassName('destoryed')

	for (var i in default_jobs){
		default_jobs[i].day = parseInt(day[i].value)

		default_jobs[i].unit = parseInt(unit[i].value)
		default_jobs[i].fetal = fetal[i].checked
	}

}
var start = function(n=35){
	// console.log('start++')
	default_systems = []
	let total_system = parseInt(document.getElementsByClassName('total_system')[0].value)
	for (var i = 0; i<total_system; i++){
		default_systems.push(new system(i, 0, true))
	}
	jobs = JSON.parse(JSON.stringify(default_jobs))
	systems = JSON.parse(JSON.stringify(default_systems))
	// shuffleArray(jobs)
	jobs.sort(compare)
	let running_systems = function(){
		for (var i in systems){
			if (systems[i].running){
				return true
			}
		}
		return false
	}

	let find_empty_system = function(num=1){
		available = []
		for (var i in systems){
			s = systems[i]
			if (s.running == 0 && s.available){
				available.push(s)
			}
		}
		if (available.length <　num){
			return false
		}
		return available.slice(0,num)
	}

	let running = function(){
		for (var i in systems){
			if (systems[i].running > 0){
				systems[i].running--
			}
		}
	}



	let simulator = function(day){
		// console.log('simulaotr++')
		let best_result =""

		while (jobs.length > 0 || running_systems()){
			// console.log('while++')
			for (var i = jobs.length-1; i>=0; i--){
				// console.log('for++: '+i)
				job = jobs[i]
				
				available_systems = find_empty_system(job.unit)
				if (available_systems){
					for (var j in available_systems){
						s = available_systems[j]
						s.running = job.day
						if (job.fetal){
							s.available = false
							s.history.push([job.name+"(D)", day, job.day])
						}else {s.history.push([job.name, day, job.day])
}
					}
					// console.log('job shift')
					jobs.pop()
				}
				else { break }
				// console.log('for--')
			}
			day++
			// console.log('running')
			running()
			
		}
		// console.log(day)
		best_result = JSON.stringify(systems)
		return [day, best_result]
	}

	let start = function(){
		for (var i = 0; i<5; i++) {simulator(0)}
	}
	/**
	 * Randomize array element order in-place.
	 * Using Durstenfeld shuffle algorithm.
	 */
	function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	}

	return{
		simulator:simulator,
		start:start,


	}
}
var run1000 = function(n)
{
	let min_day = 999
	let resultHTML = ""
	let day = 0

	day, systems = start(n).simulator(0)

	for(var i=0; i<1; i++ ){
		[day, systems] = start(n).simulator(0)
		if (min_day > day) {min_day = day}
	}

	systems = JSON.parse(systems)
	output_google_chart_format(systems)
	//output result to HTML
	// for (let i in systems){
	// 	let index = parseInt(i)+1
	// 	if (i%2 == 0) {resultHTML += "<font color='red'>"}
	// 	else if(i%2 == 1) {resultHTML += "<font color='blue'>"}
	// 	resultHTML += "System: "+ index +"  "
	// 	resultHTML += systems[i].history
	// 	resultHTML += "</font>"
	// 	resultHTML += "</br>"
	// }
	document.getElementById('running_day').innerHTML = "Need minimum "+min_day+" days";
	return min_day
}


var output_google_chart_format = function(systems){
	google_chart_data = []
	for (let i in systems){
		system_histories = systems[i].history
		for (let j in system_histories){
				let logs = system_histories[j]
				// console.log(i +' '+ logs)
				if (logs[0] != "DESTORYED"){
					let id = i
					ms_to_day = 86400000
					let start = logs[1]*ms_to_day
					let end = start + logs[2]*ms_to_day
					google_chart_data.push([id, logs[0], start, end])					
				}
			}
		}
	console.log(google_chart_data)
	output_google_chart(google_chart_data)

  }

  var output_google_chart = function(chart_data){
  	google.charts.load("current", {packages:["timeline"]});
  	google.charts.setOnLoadCallback(drawChart);
  	function drawChart() {
	    var container = document.getElementById('waterfall');
	    var chart = new google.visualization.Timeline(container);
	    var dataTable = new google.visualization.DataTable();

	    dataTable.addColumn({ type: 'string', id: 'Term' });
	    dataTable.addColumn({ type: 'string', id: 'Name' });
	    dataTable.addColumn({ type: 'number', id: 'Start' });
	    dataTable.addColumn({ type: 'number', id: 'End' });

	    dataTable.addRows(chart_data);
		
	    chart.draw(dataTable);
  }
}