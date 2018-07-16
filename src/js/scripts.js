
var job = function(name, day, unit, fetal=false, tier=1){
	this.name = name
	this.day = day
	this.unit = unit
	this.fetal = fetal
	this.tier = tier

	this.info = function(){
		return 'name: ' + this.name + ' day: '+this.day + ' unit '+this.unit + ' fetal: '+this.fetal + ' tier: ' + this.tier
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

		// if (a.day == max_day) {return 1}


		if (a.tier > b.tier) { return -1}
		if (a.tier < b.tier) {return 1}

		if(a.fetal && !b.fetal) {return -1}
		if(!a.fetal && b.fetal) {return 1}		

		if (a.day > b.day) { return 1}
		if (a.day < b.day) { return -1}

		if(a.unit > b.unit) {return 1}
		if(a.unit < b.unit) {return -1}	
		return 0;
	}

var system = function(id, running, available){
	this.id = id
	this.running = running
	this.available = available
	this.history = []
}


let default_jobs = []
default_jobs.push(new job("Temperature/Humidity Test Non Operational", 7,9, true))
default_jobs.push(new job("Torsion Test (50k)", 5,3))
default_jobs.push(new job("System Pogo", 7,3))
default_jobs.push(new job("Weighted Shock Test", 1,2))
default_jobs.push(new job("Edu Durability Test", 10,5, true))
default_jobs.push(new job("Free Fall Drop", 3,3, true))
default_jobs.push(new job("Temperature/Voltage Margining Test", 10,2, false, tier=2))

default_jobs.push(new job("Wrenching Test", 7,4))
default_jobs.push(new job("Buffing", 1,2))
default_jobs.push(new job("LCD Wobble", 1,2))
default_jobs.push(new job("LCD POGO", 5,3))

default_jobs.push(new job("Palmrest POGO", 5,3))
default_jobs.push(new job("Button Cycling", 6,3))
default_jobs.push(new job("Module Cycling", 6,4))
default_jobs.push(new job("Power Button+ Finger Print Reader Combo Test", 10, 4,false, tier=2))

default_jobs.push(new job("Thermal Shock", 5,5, true))
default_jobs.push(new job("Liquid Spill Test", 5,5, true))
default_jobs.push(new job("Hinge Cycling Test", 5,5))
default_jobs.push(new job("Random Vibration", 2,2,true))
default_jobs.push(new job("Half-Sine Shock", 2,2,true))
default_jobs.push(new job("Shock Strain Test  (Intel and AMD MB only)", 3,1,true))

default_jobs.push(new job("Palm Rest Vibration",1,2))
default_jobs.push(new job("Hinge Cycle Abrasion", 12,2, false, tier=2))
default_jobs.push(new job("Durability A Group", 5,4, true))
default_jobs.push(new job("Durability B Group", 5,4, true))
default_jobs.push(new job("Durability C Group", 5,4, true))
default_jobs.push(new job("System Foot Abrasion", 7,5, false, tier=2))


let max_day = job_max_day(default_jobs)
let html = ''

html +=`
<div class="divTableRow">
    <div class="divTableCell">Name</div>
    <div class="divTableCell">Select</div>
    <div class="divTableCell">Day</div>
    <div class="divTableCell">Unit</div>
    <div class="divTableCell">Tier</div>
    <div class="divTableCell">Destoryed</div>
  </div>
`
for (let i in default_jobs){
	let fetal = default_jobs[i].fetal ? "checked" :""
	html+=
	`
	<div class="divTableRow" id=`+ i +`>
	    <div class="divTableCell">`+ default_jobs[i].name +`</div>
	    <div class="divTableCell"><input class='selector' type="checkbox" name="select""></div>
	    <div class="divTableCell"><input class='day' type="text" name="day" size=3 value=`+ default_jobs[i].day+`></div>
	    <div class="divTableCell"><input class='unit' type="text" name="unit" size =3 value=`+ default_jobs[i].unit +`></div>
	   	<div class="divTableCell"><input class='tier' type="text" name="tier" size =3 value=`+ default_jobs[i].tier +`></div>
	    <div class="divTableCell"><input class='destoryed' type="checkbox" name="firstname " `+ fetal +` ></div>
	  </div>
	  `
}

document.getElementById('list').innerHTML = html;
var update = function(){
	let select = document.getElementsByClassName('selector')
	let day = document.getElementsByClassName('day')
	let unit = document.getElementsByClassName('unit')
	let tier = document.getElementsByClassName('tier')
	let fetal = document.getElementsByClassName('destoryed')

	for (let i in default_jobs){
		default_jobs[i].day = parseInt(day[i].value)
		default_jobs[i].unit = parseInt(unit[i].value)
		default_jobs[i].tier = parseInt(tier[i].value)
		default_jobs[i].fetal = fetal[i].checked
	}
}
var start = function(total_system){
	// console.log('start++')

	//get number of system from HTML and creat systems
	let default_systems = []
	for (var i = 0; i<total_system; i++){
		default_systems.push(new system(i, 0, true))
	}
	//retrive data from original dataset

	let jobs = JSON.parse(JSON.stringify(default_jobs))
	let systems = JSON.parse(JSON.stringify(default_systems))
	//Using shuffle or static sort
	// shuffleArray(jobs)
	jobs.sort(compare)
	for (let i in jobs){
		// console.log(jobs[i])
	}
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
	let running = function(){
		for (let i in systems){
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

			for (let i = jobs.length-1; i>=0; i--){
				let job = jobs[i]
				// console.log(job)
				//get empty systems
				available_systems = find_empty_system(job.unit)
				if (available_systems){
					for (let j in available_systems){
						s = available_systems[j]
						s.running = job.day
						//if the job will damage system, system will be marked as not avaiable
						if (job.fetal){
							s.available = false
							s.history.push([job.name+"(D)", day, job.day])

						}else {s.history.push([job.name, day, job.day])}

					}					
					// jobs.pop()
					jobs.splice(i,1)
				}
				//if no availabe systems, means all of them are doing jobs. skip one day for it to run
				else { continue }
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
	    for (let i = array.length - 1; i > 0; i--) {
	        let j = Math.floor(Math.random() * (i + 1));
	        let temp = array[i];
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
	let total_system = parseInt(document.getElementsByClassName('total_system')[0].value)

	let result = start(total_system).simulator()
	let day = result[0]
	let systems = result[1]

	systems = JSON.parse(systems)
	output_google_chart_format(systems)

	document.getElementById('running_day').innerHTML = "Need minimum "+day+" days";
	return day
}


var output_google_chart_format = function(systems){
	let google_chart_data = []
	for (let i in systems){
		let system_histories = systems[i].history
		for (let j in system_histories){
				let logs = system_histories[j]
				if (logs[0] != "DESTORYED"){
					let id = i
					let ms_to_day = 86400000
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
	    let  container = document.getElementById('waterfall');
	    let  chart = new google.visualization.Timeline(container);
	    let dataTable = new google.visualization.DataTable();

	    dataTable.addColumn({ type: 'string', id: 'Term' });
	    dataTable.addColumn({ type: 'string', id: 'Name' });
	    dataTable.addColumn({ type: 'number', id: 'Start' });
	    dataTable.addColumn({ type: 'number', id: 'End' });

	    dataTable.addRows(chart_data);
		
	    chart.draw(dataTable)
  }
}