
class Job {
  constructor(name, day, unit, tier=1, destoryed=false) {
	this.name = name
	this.day = day
	this.unit = unit
	this.destoryed = destoryed
	this.tier = tier
	this.select = true
	}
	info(){
		return 'name: ' + this.name + ' day: '+this.day + ' unit '+this.unit + ' destoryed: '+this.destoryed + ' tier: ' + this.tier
	}  
}
class System{
	constructor(id, running, available){
		this.id = id
		this.running = running
		this.available = available
		this.history = []
	}
}









var default_jobs = []
default_jobs.push(new Job("Temperature/Humidity Test Non Operational", 7,9, 1,true))
default_jobs.push(new Job("Torsion Test (50k)", 5,3))
default_jobs.push(new Job("System Pogo", 7,3))
default_jobs.push(new Job("Weighted Shock Test", 1,2))
default_jobs.push(new Job("Edu Durability Test", 10,5, 1, true))
default_jobs.push(new Job("Free Fall Drop", 3,3, 1, true))
default_jobs.push(new Job("Temperature/Voltage Margining Test", 10,2, 2, true))
default_jobs.push(new Job("Wrenching Test", 7,4))
default_jobs.push(new Job("Buffing", 1,2))
default_jobs.push(new Job("LCD Wobble", 1,2))
default_jobs.push(new Job("LCD POGO", 5,3))
default_jobs.push(new Job("Palmrest POGO", 5,3))
default_jobs.push(new Job("Button Cycling", 6,3))
default_jobs.push(new Job("Module Cycling", 6,4))
default_jobs.push(new Job("Power Button+ Finger Print Reader Combo Test", 10, 4, 2))
default_jobs.push(new Job("Thermal Shock", 5,5, 1, true))
default_jobs.push(new Job("Liquid Spill Test", 5,5, 1, true))
default_jobs.push(new Job("Hinge Cycling Test", 5,5))
default_jobs.push(new Job("Random Vibration", 2,2, 1, true))
default_jobs.push(new Job("Half-Sine Shock", 2,2,1, true))
default_jobs.push(new Job("Shock Strain Test  (Intel and AMD MB only)", 3,1,1, true))
default_jobs.push(new Job("Palm Rest Vibration",1,2))
default_jobs.push(new Job("Hinge Cycle Abrasion", 12,2,2))
default_jobs.push(new Job("Durability A Group", 5,4, 1,true))
default_jobs.push(new Job("Durability B Group", 5,4, 1,true))
default_jobs.push(new Job("Durability C Group", 5,4, 1,true))
default_jobs.push(new Job("System Foot Abrasion", 7,5,  2))

let html =`
<table class="table">
<thead class="thead-dark">
<tr>
<th scope="col">ID</th>
<th scope="col">Name</th>
<th scope="col">Select</th>
<th scope="col">Day</th>
<th scope="col">Unit</th>
<th scope="col">Tier</th>
<th scope="col">Destoryed</th>
</tr>
</thead>
<tbody>
`
//generate table HTML output
default_jobs.forEach((default_job, i) =>{
	let destoryedHTML = default_job.destoryed ? "checked" :""
	let selectHTML = default_job.select ? "checked" :""
	let rowIndex = i+1
	html+=
	`
		<tr>
		<th scope="row">${rowIndex}</th>
	    <td> ${default_job.name} </td>
	    <td><input class='selector' type="checkbox" name="select"  ${selectHTML} ></td>
	    <td><input class='day' type="text" name="day" size=3 value=${default_job.day}></td>
	    <td><input class='unit' type="text" name="unit" size =3 value=${default_job.unit}></td>
	   	<td><input class='tier' type="text" name="tier" size =3 value=${default_job.tier}></td>
	    <td><input class='destoryed' type="checkbox" name="firstname " ${destoryedHTML} ></div>
	    </tr>
	  `
})

html += '</tbody></table>'
document.getElementById('list').innerHTML = html;




//update HTML
var updateFromHTML = function(){
	let selector = document.getElementsByClassName('selector')
	let day = document.getElementsByClassName('day')
	let unit = document.getElementsByClassName('unit')
	let tier = document.getElementsByClassName('tier')
	let destoryed = document.getElementsByClassName('destoryed')

	for (let i in default_jobs){
		default_jobs[i].select = selector[i].checked
		default_jobs[i].day = parseInt(day[i].value)
		default_jobs[i].unit = parseInt(unit[i].value)
		default_jobs[i].tier = parseInt(tier[i].value)
		default_jobs[i].destoryed = destoryed[i].checked
	}
}

var minimumRequiredSystem = function(){
	let maxSystemPerTestItem = 0
	let totalDestoryedSystem = 0

	for( i in default_jobs ){
		if (default_jobs[i].destoryed){
			totalDestoryedSystem += default_jobs[i].unit
		}
		else if( default_jobs[i].unit > maxSystemPerTestItem ){
			maxSystemPerTestItem = default_jobs[i].unit
		}
	}
	return maxSystemPerTestItem + totalDestoryedSystem
}

var checkMinimumSystem = function(totalSystem, minSystem){
	if ( totalSystem < minSystem ){
		alert("You need at least "+minSystem+" to run this RSV test plan")
		return false
	}
	return true
}



var simulator = function(totalSystem){
	// console.log('start++')
	
	//get number of system from HTML and creat systems
	let default_systems = []
	for (var i = 0; i<totalSystem; i++){
		default_systems.push(new System(i, 0, true))
	}
	//retrive data from original dataset
	jobs = JSON.parse(JSON.stringify(default_jobs))
	jobs = removeUnselectedItem(jobs)

	let systems = JSON.parse(JSON.stringify(default_systems))
	//Using shuffle or static sort
	// shuffleArray(jobs)
	jobs.sort(compare)

	function removeUnselectedItem(jobs){
	for (let i=jobs.length-1; i>=0; i--){ 
		if ( jobs[i].select == false){
			jobs.splice(i,1)
		}
	}
	return jobs
	}

	//check if exist a system that still running
	let isSystemRunning = function(){
		for (var i in systems){
			if (systems[i].running){
				return true
			}
		}
		return false
	}
	
	function compare(a,b){

		if (a.tier > b.tier) { return -1}
		if (a.tier < b.tier) {return 1}

		if(a.destoryed && !b.destoryed) {return -1}
		if(!a.destoryed && b.destoryed) {return 1}		

		if (a.day > b.day) { return 1}
		if (a.day < b.day) { return -1}

		if(a.unit > b.unit) {return 1}
		if(a.unit < b.unit) {return -1}	
		return 0;
	}

	//find minmim of n number of available systems
	let find_empty_system = function(num=1){
		let available = []
		for (let i in systems){
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
	let systemRunning = function(){
		for (let i in systems){
			if (systems[i].running > 0){
				systems[i].running -= 1
			}
		}
	}

	var startRunning = function(){
		// console.log('simulaotr++')
		let best_result =""
		let day = 0
		//keep running until all jobs are done and no systems are running for remaining jobs
		while (jobs.length > 0 || isSystemRunning()){
			//loop jobs backward
			for (let i = jobs.length-1; i>=0; i--){
				let job = jobs[i]
				// console.log(job)
				//get empty systems
				let available_systems = find_empty_system(job.unit)
				if (available_systems){
					for (let j in available_systems){
						s = available_systems[j]
						s.running = job.day
						//if the job will damage system, system will be marked as not avaiable
						if (job.destoryed){
							s.available = false
							s.history.push([job.name+"(D)", job.tier, day, job.day])
						}else {s.history.push([job.name, job.tier, day, job.day])}
					}					
					// jobs.pop()
					jobs.splice(i,1)
				}
				//if no availabe systems, means all of them are doing jobs. skip one day for it to run
				else { continue }
			}
			day++
			systemRunning()
		}
		// console.log(day)
		best_result = JSON.stringify(systems)
		return [day, best_result]
	}

	return{
		startRunning,
	}
}


var run = function(n)
{
	//update current value from HTML
	updateFromHTML()
	let totalSystem = parseInt(document.getElementsByClassName('total_system')[0].value)
	let minSystem = minimumRequiredSystem()
	
	if ( checkMinimumSystem(totalSystem, minSystem) == false ){ return 0}

	let resultHTML = ""
	let result = simulator(totalSystem).startRunning()
	let day = result[0]
	let systems = result[1]

	systems = JSON.parse(systems)
	document.getElementById('running_day').innerHTML = "Need minimum "+day+" days";

	output_google_chart_format(systems)
	return day
}


var output_google_chart_format = function(systems){
	let google_chart_data = []
	systems.forEach( function(sys, index) {
		let system_histories = sys.history
		console.log(system_histories)
		system_histories.forEach( (sys_history) => {
			let history = sys_history
			let ms_to_day = 86400000
			let id = index.toString()
			let name = history[0]
			let tier = history[1]
			let start = history[2]*ms_to_day
			let end = start + history[3]*ms_to_day

			color = tier == 1 ? '#e63b6f' : '#19fce1'
			google_chart_data.push([id, name, color, start, end])
		})
		
		})
	output_google_chart(google_chart_data)
	// console.log(google_chart_data)
  }

  var output_google_chart = function(chart_data){
  	google.charts.load("current", {packages:["timeline"]});
  	google.charts.setOnLoadCallback(drawChart);
  	function drawChart() {
	    let  container = document.getElementById('waterfall');
	    let  chart = new google.visualization.Timeline(container);
	    let dataTable = new google.visualization.DataTable();

	    dataTable.addColumn({ type: 'string', id: 'Term' });
	    dataTable.addColumn({ type: 'string', id: 'Name' });
		dataTable.addColumn({ type: 'string', role: 'style'});
	    dataTable.addColumn({ type: 'number', id: 'Start' });
	    dataTable.addColumn({ type: 'number', id: 'End' });
	    dataTable.addRows(chart_data);
	    let options = {

	    }

	    //customize bar shape+
		var observer = new MutationObserver(setBorderRadius);
		  google.visualization.events.addListener(chart, 'ready', function () {
		    setBorderRadius();
		    observer.observe(container, {
		      childList: true,
		      subtree: true
		    });
		  });

		  function setBorderRadius() {
		    Array.prototype.forEach.call(container.getElementsByTagName('rect'), function (rect) {
		      if (parseFloat(rect.getAttribute('x')) > 0) {
		        rect.setAttribute('rx', 20);
		        rect.setAttribute('ry', 20);
		      }
		    });
		  }
	    //customize bar shape-


		
	    chart.draw(dataTable, options)
  }
}