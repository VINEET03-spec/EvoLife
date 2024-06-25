
Array.prototype.last = function() {
  return this[this.length - 1];
}

var cnt = 0;
var secondRepeated = -1;
const chart = document.getElementById("chart")
const chartSecondary = document.getElementById("chartSecondary")

let historic = new Historic();
let historicE = new Historic();
let historicD = new Historic();

function resetChart() {
  Plotly.purge(chart);
  if(!split_screen) Plotly.purge(chartSecondary);
}

function splitChart() {
  split_screen = !split_screen;
  historicE.clear();
  historicD.clear();
  resetChart();
  removeChartTitle();
  buildChart(chartType);
  insertChartTitle();
}

function insertChartTitle() {
  if(split_screen) {
    $(chart).prepend(`<div class="sideTitle">Left side</div>`)
    $(chartSecondary).prepend(`<div class="sideTitle">Right side</div>`)
  }
}

function removeChartTitle() {
  $(chart).html("")
  $(chartSecondary).html("")
}

function insertNextDataChart() {
  if(total_seconds == secondRepeated) {
    return;
  }
  secondRepeated = total_seconds;
    //  Carnivores
    historic.carnivores.population.push(popC.sem_div)
    historic.carnivores.speed.push(velMedC.sem_div)
    historic.carnivores.agility.push(forcaMedC.sem_div)
    historic.carnivores.ray.push(rayMedC.sem_div)
    historic.carnivores.detection.push(rayDetMedC.sem_div)
    historic.carnivores.energy.push(energMedC.sem_div)
    historic.carnivores.spent.push(taxaEnergMedC.sem_div)
    historic.carnivores.average_litter_size.push(litterMediaC.sem_div)

    //  Herbivores
    historic.herbivores.population.push(popH.sem_div)
    historic.herbivores.speed.push(velMedH.sem_div)
    historic.herbivores.agility.push(forcaMedH.sem_div)
    historic.herbivores.ray.push(rayMedH.sem_div)
    historic.herbivores.detection.push(rayDetMedH.sem_div)
    historic.herbivores.energy.push(energMedH.sem_div)
    historic.herbivores.spent.push(taxaEnergMedH.sem_div)
    historic.herbivores.average_litter_size.push(litterMediaH.sem_div)

    //  seconds
    historic.seconds.push(total_seconds)
    historic.food_rate.push(inputRateFood.value)

    if(split_screen) {
        // Carnivores
        historicE.carnivores.population.push(popC.esq)
        historicE.carnivores.speed.push(velMedC.esq)
        historicE.carnivores.agility.push(forcaMedC.esq)
        historicE.carnivores.ray.push(rayMedC.esq)
        historicE.carnivores.detection.push(rayDetMedC.esq)
        historicE.carnivores.energy.push(energMedC.esq)
        historicE.carnivores.spent.push(taxaEnergMedC.esq)
        historicE.carnivores.average_litter_size.push(litterMediaC.esq)

        // Herbivores
        historicE.herbivores.population.push(popH.esq)
        historicE.herbivores.speed.push(velMedH.esq)
        historicE.herbivores.agility.push(forcaMedH.esq)
        historicE.herbivores.ray.push(rayMedH.esq)
        historicE.herbivores.detection.push(rayDetMedH.esq)
        historicE.herbivores.energy.push(energMedH.esq)
        historicE.herbivores.spent.push(taxaEnergMedH.esq)
        historicE.herbivores.average_litter_size.push(litterMediaH.esq)

        historicE.seconds.push(total_seconds)

        historicE.food_rate.push(inputRateFood.value)
        // Carnivores
        historicD.carnivores.population.push(popC.dir)
        historicD.carnivores.speed.push(velMedC.dir)
        historicD.carnivores.agility.push(forcaMedC.dir)
        historicD.carnivores.ray.push(rayMedC.dir)
        historicD.carnivores.detection.push(rayDetMedC.dir)
        historicD.carnivores.energy.push(energMedC.dir)
        historicD.carnivores.spent.push(taxaEnergMedC.dir)
        historicD.carnivores.average_litter_size.push(litterMediaC.dir)

        // Herbivores
        historicD.herbivores.population.push(popH.dir)
        historicD.herbivores.speed.push(velMedH.dir)
        historicD.herbivores.agility.push(forcaMedH.dir)
        historicD.herbivores.ray.push(rayMedH.dir)
        historicD.herbivores.detection.push(rayDetMedH.dir)
        historicD.herbivores.energy.push(energMedH.dir)
        historicD.herbivores.spent.push(taxaEnergMedH.dir)
        historicD.herbivores.average_litter_size.push(litterMediaH.dir)

        historicD.seconds.push(total_seconds)

        historicD.food_rate.push(inputRateFood.value)
    }
  let arraySeconds = [[total_seconds], [total_seconds]];
  let values;
  let values2;

  switch(chartType) {
    case 1:
      if(split_screen) {
        values = [[historicE.carnivores.population.last()], [historicE.herbivores.population.last()]];
        values2 = [[historicD.carnivores.population.last()], [historicD.herbivores.population.last()]];
      } else
        values = [[historic.carnivores.population.last()], [historic.herbivores.population.last()]];
      break;
    case 2:
      if(split_screen) {
        values = [[historicE.carnivores.speed.last()], [historicE.herbivores.speed.last()]];
        values2 = [[historicD.carnivores.speed.last()], [historicD.herbivores.speed.last()]];
      } else
        values = [[historic.carnivores.speed.last()], [historic.herbivores.speed.last()]];
      break;
    case 3:
      if(split_screen) {
        values = [[historicE.carnivores.agility.last()], [historicE.herbivores.agility.last()]];
        values2 = [[historicD.carnivores.agility.last()], [historicD.herbivores.agility.last()]];
      } else
        values = [[historic.carnivores.agility.last()], [historic.herbivores.agility.last()]];
      break;
    case 4:
      if(split_screen) {
        values = [[historicE.carnivores.ray.last()], [historicE.herbivores.ray.last()]];
        values2 = [[historicD.carnivores.ray.last()], [historicD.herbivores.ray.last()]];
      } else
        values = [[historic.carnivores.ray.last()], [historic.herbivores.ray.last()]];
      break;
    case 5:
      if(split_screen) {
        values = [[historicE.carnivores.detection.last()], [historicE.herbivores.detection.last()]];
        values2 = [[historicD.carnivores.detection.last()], [historicD.herbivores.detection.last()]];
      } else
        values = [[historic.carnivores.detection.last()], [historic.herbivores.detection.last()]];
      break;
    case 6:
      if(split_screen) {
        values = [[historicE.carnivores.energy.last()], [historicE.herbivores.energy.last()]];
        values2 = [[historicD.carnivores.energy.last()], [historicD.herbivores.energy.last()]];
      } else
        values = [[historic.carnivores.energy.last()], [historic.herbivores.energy.last()]];
      break;
    case 7:
      if(split_screen) {
        values = [[historicE.carnivores.spent.last()], [historicE.herbivores.spent.last()]];
        values2 = [[historicD.carnivores.spent.last()], [historicD.herbivores.spent.last()]];
      } else
        values = [[historic.carnivores.spent.last()], [historic.herbivores.spent.last()]];
      break;
    case 8:
      if(split_screen) {
        values = [[historicE.carnivores.average_litter_size.last()], [historicE.herbivores.average_litter_size.last()]];
        values2 = [[historicD.carnivores.average_litter_size.last()], [historicD.herbivores.average_litter_size.last()]];
      } else
        values = [[historic.carnivores.average_litter_size.last()], [historic.herbivores.average_litter_size.last()]];
  }

  Plotly.extendTraces(chart,{y: values, x: arraySeconds}, [0,1]);
  cnt++;
    if(cnt >500) {
        Plotly.relayout('chart',{
            xaxis: {
                range: [cnt-500,cnt]
            }
        });
    }
  
  if(split_screen) {
    Plotly.extendTraces(chartSecondary,{y: values2, x: arraySeconds}, [0,1]);
    cnt++;
    if(cnt >500) {
        Plotly.relayout('chartSecondary',{
            xaxis: {
                range: [cnt-500,cnt]
            }
        });
    }
  }
}
function changeChart(type) {
  if(type == chartType || type < 1 || type > 8) {
    return;
  }
  resetChart();
  removeChartTitle();
  buildChart(type);
  insertChartTitle();
  chartType = type;
}

function buildChart(type) {
  let title = "Population";
  let yTitle = "No. of Individuals"; 
  let data = [];
  let data2 = [];
  switch (type) {
    case 1: // Population
      if(split_screen) {
        data = [historicE.carnivores.population, historicE.herbivores.population];
        data2 = [historicD.carnivores.population, historicD.herbivores.population];
      } else
        data = [historic.carnivores.population, historic.herbivores.population];
      break;
    case 2:
      title = "speed";
      yTitle = "speed average";

      if(split_screen) {
        data = [historicE.carnivores.speed, historicE.herbivores.speed];
        data2 = [historicD.carnivores.speed, historicD.herbivores.speed];
      } else
        data = [historic.carnivores.speed, historic.herbivores.speed];
      break;
    case 3: 
      title = "agility";
      yTitle = "agility average";

      if(split_screen) {
        data = [historicE.carnivores.agility, historicE.herbivores.agility];
        data2 = [historicD.carnivores.agility, historicD.herbivores.agility];
      } else
        data = [historic.carnivores.agility, historic.herbivores.agility];
      break;
    case 4: // ray
      //indice = 7;
      title = "ray";
      yTitle = "ray average";

      if(split_screen) {
        data = [historicE.carnivores.ray, historicE.herbivores.ray];
        data2 = [historicD.carnivores.ray, historicD.herbivores.ray];
      } else
        data = [historic.carnivores.ray, historic.herbivores.ray];
      break;
    case 5: // ray detection
      //indice = 9;
      title = "Detection range";
      yTitle = "average detection ray";

      if(split_screen) {
        data = [historicE.carnivores.detection, historicE.herbivores.detection];
        data2 = [historicD.carnivores.detection, historicD.herbivores.detection];
      } else
        data = [historic.carnivores.detection, historic.herbivores.detection];
      break;
    case 6: // energy
      //indice = 11;
      title = "energy";
      yTitle = "average energy level";

      if(split_screen) {
        data = [historicE.carnivores.energy, historicE.herbivores.energy];
        data2 = [historicD.carnivores.energy, historicD.herbivores.energy];
      } else
        data = [historic.carnivores.energy, historic.herbivores.energy];
      break;
    case 7: 
      //indice = 13;
      title = "energy spent";
      yTitle = "average energy rate";

      if(split_screen) {
        data = [historicE.carnivores.spent, historicE.herbivores.spent];
        data2 = [historicD.carnivores.spent, historicD.herbivores.spent];
      } else
        data = [historic.carnivores.spent, historic.herbivores.spent];
      break;
    case 8: 
    title = "Average litter";
    yTitle = "Average litter size";

    if(split_screen) {
      data = [historicE.carnivores.average_litter_size, historicE.herbivores.average_litter_size];
      data2 = [historicD.carnivores.average_litter_size, historicD.herbivores.average_litter_size];
    } else
      data = [historic.carnivores.average_litter_size, historic.herbivores.average_litter_size];
  }
  let carnivores = {
    x: split_screen? historicE.seconds:historic.seconds,
    y: data[0],
    type: 'scatter',
    mode: 'lines',
    name: 'Carnivores',
    line: { color: 'red', shape: 'spline'}
  };

  let herbivores = {
    x: split_screen? historicE.seconds:historic.seconds,
    y: data[1],
    type: 'scatter',
    mode: 'lines',
    name: 'Herbivores',
    line: {color: 'green', shape: 'spline'}
  };

  let dataConfig = [carnivores, herbivores];

  var layout = {
  title: title,

  xaxis: {
      showline: true,
      domain: [0],
      title: "seconds",
      showgrid: true
  },
  yaxis: { 
      showline: true, 
      title: yTitle, 
      rangemode: "tozero" 
  },
  legend: {
      orientation: 'h',
          traceorder: 'reversed',
      x: 0.05,
      y: -.3
  },
  plot_bgcolor:"#222",
  paper_bgcolor:"#222",
  font: {
      color: '#ddd'
  }
}
  Plotly.newPlot('chart', dataConfig, layout);
  let carnivores2, herbivores2, dataConfig2;
  if(split_screen) {
    carnivores2 = {
      x: historicD.seconds,
      y: data2[0],
      type: 'scatter',
      mode: 'lines',
      name: 'Carnivores',
      line: { color: 'red', shape: 'spline'}
    };
  
    herbivores2 = {
      x: historicD.seconds,
      y: data2[1],
      type: 'scatter',
      mode: 'lines',
      name: 'Herbivores',
      line: {color: 'green', shape: 'spline'}
    };
    dataConfig2 = [carnivores2, herbivores2];
    Plotly.newPlot(chartSecondary, dataConfig2, layout);
  }
}

