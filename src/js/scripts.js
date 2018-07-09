
var job = function(name, day, unit, fetal=false){
	this.name = name
	this.day = day
	this.unit = unit
	this.fetal = fetal

	this.info = function(){
		return 'name: ' + this.name + ' day: '+this.day + ' unit '+this.unit + ' fetal: '+this.fetal
	}
}

var job_max_day = function(jobs){
	let max = 0
	jobs.forEach(function(job){
		if (job.day > max) {max = job.day}
	})
	return max
}

function compare(a,b){
		if (a.day == max_day) {return 1}
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
let max_day = job_max_day(default_jobs)

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
var start = function(){
	// console.log('start++')

	//get number of system from HTML and creat systems
	let default_systems = []
	let total_system = parseInt(document.getElementsByClassName('total_system')[0].value)
	for (var i = 0; i<total_system; i++){
		default_systems.push(new system(i, 0, true))
	}
	//retrive data from original dataset
	jobs = JSON.parse(JSON.stringify(default_jobs))
	systems = JSON.parse(JSON.stringify(default_systems))
	//Using shuffle or static sort
	// shuffleArray(jobs)
	jobs.sort(compare)

	//check if exist a system that still running
	let running_systems = function(){
		for (var i in systems){
			if (systems[i].running){
				return true
			}
		}
		return false
	}

	//find minmim of n number of available systems
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

	//let all systems run of 1 day
	let running = function(){
		for (var i in systems){
			if (systems[i].running > 0){
				systems[i].running--
			}
		}
	}



	let simulator = function(){
		// console.log('simulaotr++')
		let best_result =""
		let day = 0
		//keep running until all jobs are done and no systems are running for remaining jobs
		while (jobs.length > 0 || running_systems()){
			//loop jobs backward
			for (var i = jobs.length-1; i>=0; i--){
				
				job = jobs[i]
				//get empty systems
				available_systems = find_empty_system(job.unit)
				if (available_systems){
					for (var j in available_systems){
						s = available_systems[j]
						s.running = job.day
						//if the job will damage system, system will be marked as not avaiable
						if (job.fetal){
							s.available = false
							s.history.push([job.name+"(D)", day, job.day])
						}else {s.history.push([job.name, day, job.day])
}
					}
					jobs.pop()
				}
				//if no availabe systems, means all of them are doing jobs. skip one day for it to run
				else { break }
			}
			day++
			running()
			
		}
		// console.log(day)
		best_result = JSON.stringify(systems)
		return [day, best_result]
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
		


	}
}
var run1000 = function(n)
{
	//update current value from HTML
	update()
	let resultHTML = ""
	let day = 0
	
	result = start().simulator()
	day = result[0]
	systems = result[1]

	systems = JSON.parse(systems)
	output_google_chart_format(systems)

	document.getElementById('running_day').innerHTML = "Need minimum "+day+" days";
	return day
}


var output_google_chart_format = function(systems){
	google_chart_data = []
	for (let i in systems){
		system_histories = systems[i].history
		for (let j in system_histories){
				let logs = system_histories[j]
				if (logs[0] != "DESTORYED"){
					let id = i
					ms_to_day = 86400000
					let start = logs[1]*ms_to_day
					let end = start + logs[2]*ms_to_day
					google_chart_data.push([id, logs[0], start, end])					
				}
			}
		}
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