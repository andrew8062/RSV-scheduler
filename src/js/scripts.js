
class Job {
	constructor(name, day, unit, tier=1, destoryed=false) {
		this.name = name
		this.day = day
		this.unit = unit
		this.destoryed = destoryed
		this.tier = tier
		this.select = true
		this.wait;
	}
	info(){
		return 'name: ' + this.name + ' day: '+this.day + ' unit '+this.unit + ' destoryed: '+this.destoryed + ' tier: ' + this.tier
	} 
}
class Jobs{
	constructor(){
		this.list = []
	}

	addJob(name, day, unit, tier=1, destoryed=false){
		this.list.push(new Job(name, day, unit, tier, destoryed))
	}

	generateHTMLOutput(){
		let html =`
		<table class="table table-striped table-hover">
		<thead class="thead-dark ">
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
		this.list.forEach((default_job, i) =>{
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

		return html
	}
	updateFromHTML(){
		let selector = document.getElementsByClassName('selector')
		let day = document.getElementsByClassName('day')
		let unit = document.getElementsByClassName('unit')
		let tier = document.getElementsByClassName('tier')
		let destoryed = document.getElementsByClassName('destoryed')

		for (let i in this.list){
			this.list[i].select = selector[i].checked
			this.list[i].day = parseInt(day[i].value)
			this.list[i].unit = parseInt(unit[i].value)
			this.list[i].tier = parseInt(tier[i].value)
			this.list[i].destoryed = destoryed[i].checked
		}
	}
	minimumRequiredSystem(){
		let maxSystemPerTestItem = 0
		let totalDestoryedSystem = 0

		this.list.forEach(job =>{ 
			if (job.destoryed){
				totalDestoryedSystem += job.unit
			}
			else if( job.unit > maxSystemPerTestItem ){
				maxSystemPerTestItem = job.unit
			}
		})
		return maxSystemPerTestItem + totalDestoryedSystem
	}
	removeUnselectedItem(){
		for (let i=this.list.length-1; i>=0; i--){ 
			if ( this.list[i].select == false){
				this.list.splice(i,1)
			}
		}
	}
	sort(){
		this.list.sort(this._compare)
	}
	getSize(){
		return this.list.length
	}
	get(i){
		return this.list[i]
	}
	getByName(name){

		return this.list.find( job => {
			return job.name == name
		})
	}

	print(){
		this.list.forEach( job =>{
			console.log(job)
		})
	}
	_compare(a,b){

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
}
class System{
	constructor(id, running, available){
		this.id = id
		this.running = running
		this.available = available
		this.history = []
	}
}

class Systems{
	constructor(){
		this.list = []
	}
	createMultipleSystem(n){
		for (let i=0; i<n; i++){
			this.addSystem(i,0,true)
		}
	}
	addSystem(id, running, available){
		this.list.push(new System(id, running, available))
	}
	isSystemRunning(){
		this.list.forEach(system =>{
			if (system.running){
				return true
			}
		})
		return false
	}

	//find minmim of n number of available systems
	find_empty_system(num=1, name){
		let available = []
		//find all available systems
		if (name){
			this.list.forEach(system=>{
				if (system.running == 0 && system.available && system.name == name){
					available.push(system)	
				}
			})
		}

		this.list.forEach(system=>{
			if (system.running == 0 && system.available && system.name == undefined){
				available.push(system)	
			}
		})

		//return false if no enough systems can be provided
		if (available.length <　num){
			return false
		}
		//return just enough systems
		let returnSystems = available.slice(0,num)
		//add wait name to system if the job has rules
		if (name){
			console.log('name', name)
			let nextRuleNames = rules.getNextRule(name)
			console.log('nextRuleNames', nextRuleNames)
			if (nextRuleNames.length > 0){
				nextRuleNames.forEach( nextRuleName=> {
					let nextRuleJob = jobs.getByName(nextRuleName)
					console.log('nextRuleJob', nextRuleJob)			
					let ruleUnit = nextRuleJob.unit

					for (let i=0; i<returnSystems.length; i++){
						if (returnSystems[i].name == undefined || returnSystems[i].name == name){
							console.log(i, nextRuleJob.name)
							returnSystems[i].name = nextRuleJob.name
							ruleUnit -= 1
						}
						if (ruleUnit == 0){
							break
						}
					}
					console.log('returnSystems', returnSystems)

				})
				console.log(systems.list)
			}else{
				returnSystems.forEach( system=> {
					system.name = undefined
				})
			}
		}
		return returnSystems
	}
	running (){
		this.list.forEach( system => {
			if (system.running > 0){
				system.running -= 1
			}
		})
	}
}

class Rules{
	constructor(){
		this.list = []
	}
	addRule(criteria){
		this.list.push(criteria)
	}

	isRuleExist(name){
		let found = false
		this.list.forEach( criteria=> {
			let indexOfName = criteria.indexOf(name)
			if ( indexOfName >= 0){
				found = true
			}
		})
		return found
	}

	getNextRule(name){
		let ret = []
		for( let i=0; i<this.list.length; i++ ){
			let criteria = this.list[i]
			let indexOfName = criteria.indexOf(name)
			if( indexOfName < criteria.length-1 ){
				ret.push(criteria[ indexOfName+1 ])
			}
		}
		return ret
	}


}

let systems = new Systems()
let rules = new Rules()
rules.addRule(['Temperature/Humidity Test Non Operational','Power Button+ Finger Print Reader Combo Test',
 'System Foot Abrasion'])

let jobs = new Jobs()
jobs.addJob("Temperature/Humidity Test Non Operational", 7,9, 1,false)
jobs.addJob("Torsion Test (50k)", 5,3)
jobs.addJob("System Pogo", 7,3)
jobs.addJob("Weighted Shock Test", 1,2)
jobs.addJob("Edu Durability Test", 10,5, 1, true)
jobs.addJob("Free Fall Drop", 3,3, 1, true)
jobs.addJob("Temperature/Voltage Margining Test", 10,2, 2, true)
jobs.addJob("Wrenching Test", 7,4)
jobs.addJob("Buffing", 1,2)
jobs.addJob("LCD Wobble", 1,2)
jobs.addJob("LCD POGO", 5,3)
jobs.addJob("Palmrest POGO", 5,3)
jobs.addJob("Button Cycling", 6,3)
jobs.addJob("Module Cycling", 6,4)
jobs.addJob("Power Button+ Finger Print Reader Combo Test", 10, 4, 2)
jobs.addJob("Thermal Shock", 5,5, 1, true)
jobs.addJob("Liquid Spill Test", 5,5, 1, true)
jobs.addJob("Hinge Cycling Test", 5,5)
jobs.addJob("Random Vibration", 2,2, 1, true)
jobs.addJob("Half-Sine Shock", 2,2,1, true)
jobs.addJob("Shock Strain Test  (Intel and AMD MB only)", 3,1,1, true)
jobs.addJob("Palm Rest Vibration",1,2)
jobs.addJob("Hinge Cycle Abrasion", 12,2,2)
jobs.addJob("Durability A Group", 5,4, 1,true)
jobs.addJob("Durability B Group", 5,4, 1,true)
jobs.addJob("Durability C Group", 5,4, 1,true)
jobs.addJob("System Foot Abrasion", 7,5,  2)


document.getElementById('list').innerHTML = jobs.generateHTMLOutput();




//update HTML




var checkMinimumSystem = function(totalSystem, minSystem){
	if ( totalSystem < minSystem ){
		alert("You need at least "+minSystem+" to run this RSV test plan")
		return false
	}
	return true
}



var simulator = function(totalSystem){
	// console.log('start++')
	
	systems.createMultipleSystem(totalSystem)

	var startRunning = function(){
		// console.log('simulaotr++')
		let best_result =""
		let day = 0
		//keep running until all jobs are done and no systems are running for remaining jobs
		while (jobs.getSize() > 0 || systems.isSystemRunning()){
			//loop jobs backward
			for (let i = jobs.getSize()-1; i>=0; i--){
				let job = jobs.get(i)
				//get empty systems
				let available_systems = systems.find_empty_system(job.unit)
				if (rules.isRuleExist(job.name)){
					available_systems = systems.find_empty_system(job.unit, job.name)
				}

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
					jobs.list.splice(i,1)
				}
				//if no availabe systems, means all of them are doing jobs. skip one day for it to run
				else { continue }
			}
		day++
		systems.running()
		}	
		// console.log(day)
		best_result = JSON.stringify(systems)
		return [day, best_result]
	}

	return{
		startRunning,
	}
}


var run = function(n){
	//update current value from HTML
	jobs.updateFromHTML()
	let totalSystem = parseInt(document.getElementById("totalSystem").value)
	let minSystem = jobs.minimumRequiredSystem()

	if ( checkMinimumSystem(totalSystem, minSystem) == false ){ return 0}
	
	jobs.sort()
	jobs.removeUnselectedItem()

	let result = simulator(totalSystem).startRunning()
	let day = result[0]
	let systems = result[1]

	systems = JSON.parse(systems)
	document.getElementById('running_day').innerHTML = "Need minimum "+day+" days";
	let chartData = outputGoogleChart(systems)
	csvData = outputCSVsourceData(systems)
	exportToCSV(csvData);

	return day
}


function outputCSVsourceData (systems){
	let csvSourceData = []
	csvSourceData.push( ["System", "test name", "tier", "start day", "end day"] )
	systems.list.forEach( function(sys, index) {
		let system_histories = sys.history
		system_histories.forEach( (sys_history) => {
			let history = sys_history
			let id = index
			let name = history[0]
			let tier = history[1]
			let start = history[2]
			let end = start + history[3]
			csvSourceData.push([id, name, tier, start, end])
		})
		
	})
	return csvSourceData
	// console.log(google_chart_data)
}
function outputGoogleChartFormat(systems){
	let chartData = []
	systems.list.forEach( function(sys, index) {
		let system_histories = sys.history
		system_histories.forEach( (sys_history) => {
			let history = sys_history
			let ms_to_day = 86400000
			let id = index.toString()
			let name = history[0]
			let tier = history[1]
			let start = history[2]*ms_to_day
			let end = start + history[3]*ms_to_day

			color = tier == 1 ? '#e63b6f' : '#19fce1'
			chartData.push([id, name, color, start, end])
		})
		
	})
	console.log(chartData)
	return chartData
	// console.log(google_chart_data)
}

function outputGoogleChart(systems){

	chartData = outputGoogleChartFormat(systems)
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
		dataTable.addRows(chartData);
		let options = {

		}

	    //customize bar shape+
	    var observer = new MutationObserver(setBorderRadius);
	    google.visualization.events.addListener(chart, 'ready', function () {
	    	var svg = jQuery('#waterfall svg');
			svg.attr("xmlns", "http://www.w3.org/2000/svg");
			svg.css('overflow','visible')

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
	<!-- @cloudformatter calls to render the SVG -->
	    
	<!-- Convert the SVG to PDF and download it -->
	var click="return xepOnline.Formatter.Format('waterfallWrapper', {render:'download', srctype:'svg'})";
	jQuery('#buttons').append('<button onclick="'+ click +'">PDF</button>');
	<!-- Convert the SVG to PNG@120dpi and open it -->
	click="return xepOnline.Formatter.Format('waterfallWrapper', {render:'newwin', mimeType:'image/png', resolution:'120', srctype:'svg'})";
	jQuery('#buttons').append('<button onclick="'+ click +'">PNG @120dpi</button>');
	<!-- Convert the SVG to JPG@300dpi and open it -->
	click="return xepOnline.Formatter.Format('waterfallWrapper', {render:'newwin', mimeType:'image/jpg', resolution:'300', srctype:'svg'})";
	jQuery('#buttons').append('<button onclick="'+ click +'">JPG @300dpi</button>');
	return chartData
}

function exportToCSV(sourceData){
	console.log('export to CSV')
	let csvContent = "data:text/csv;charset=utf-8,";
	sourceData.forEach(function(rowArray){
	   let row = rowArray.join(",");
	   csvContent += row + "\r\n";
	}); 
	let encodedUri = encodeURI(csvContent);
	let link = document.getElementById('export')
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.csv");
	link.setAttribute("class", "btn btn-info")
	link.innerHTML= "Click Here to download";

}