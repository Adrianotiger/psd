/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global psd, planetary */

class Simulation
{
  constructor()
  {  
  }
  
  updateGearAnimation(mg1, ice, mg2)
  {
    //planetary.setMG1(mg1, mg2);
      // sun: carrier + ring = sun
      // carrier: sun + ring = carrier
      // ring: sun + carrier = ring
      // gear2SunSpeed = 0;
      // gear2CarrierSpeed = 0;
      // gear2RingSpeed = 0;
    if(ice === 0)
    {
      gear2Mode = "ring"; 
      gear2SunSpeed = mg1 / 1000.0;
      gear2CarrierSpeed = 0;
    }
    else if(mg2 === 0)
    {
      gear2Mode = "sun"; 
      gear2RingSpeed = 0;
      gear2CarrierSpeed = ice / 250.0;
    }
    else
    {
      gear2Mode = "sun"; 
      gear2RingSpeed = mg2 / 1000.0;
      gear2CarrierSpeed = ice / 250.0;
    }
  }
  
  calculateNewRPM()
  {
    var d = psd.calculateFromSpeed(document.getElementById("rpmice").value, document.getElementById("speed").value);
    
    this.updateGearAnimation(d.rpm.mg1, d.rpm.ice, d.rpm.mg2);
    
    const max_line = 120.0;
    const zeroY = 160;

    document.getElementById("svg_speed").innerHTML = d.speed + " km/h";
    document.getElementById("svg_ice_rpm").innerHTML = d.rpm.ice + "rpm";
    document.getElementById("svg_icemg1").y2.baseVal.value = zeroY - parseInt(0.95 * max_line * d.rpm.ice / psd.engines.ice.max);
    document.getElementById("svg_icemg2").y1.baseVal.value = zeroY - parseInt(0.95 * max_line * d.rpm.ice / psd.engines.ice.max);
    
    // for a better graphic:
    document.getElementById("svg_icemg1").y2.baseVal.value -= parseInt((d.rpm.mg1 - d.rpm.mg2 *0.6) / 5000);
    document.getElementById("svg_icemg2").y1.baseVal.value -= parseInt((d.rpm.mg2 * 0.6 - d.rpm.mg1) / 5000);
    
    document.getElementById("svg_mg1_rpm").innerHTML = parseInt(d.rpm.mg1);
    document.getElementById("svg_mg2_rpm").innerHTML = parseInt(d.rpm.mg2);
        
    if(d.rpm.mg1 > psd.engines.mg1.max)
    {
      document.getElementById("svg_mg1_rpm").setAttribute('y', zeroY - parseInt(max_line * psd.engines.mg1.max / psd.engines.mg1.max));
      document.getElementById("svg_icemg1").y1.baseVal.value = zeroY - parseInt(max_line * psd.engines.mg1.max / psd.engines.mg1.max);
      document.getElementById("svg_icemg1").setAttribute('stroke', "#e11");
    }
    else if(d.rpm.mg1 < psd.engines.mg1.min)
    {
      document.getElementById("svg_mg1_rpm").setAttribute('y', zeroY + parseInt(max_line * psd.engines.mg1.min / psd.engines.mg1.min));
      document.getElementById("svg_icemg1").y1.baseVal.value = zeroY + parseInt(max_line * psd.engines.mg1.min / psd.engines.mg1.min);
      document.getElementById("svg_icemg1").setAttribute('stroke', "#e11");
    }
    else
    {
      document.getElementById("svg_mg1_rpm").setAttribute('y', zeroY - parseInt(max_line * d.rpm.mg1 / psd.engines.mg1.max));
      document.getElementById("svg_icemg1").y1.baseVal.value = zeroY - parseInt(max_line * d.rpm.mg1 / psd.engines.mg1.max);
      document.getElementById("svg_icemg1").setAttribute('stroke', "#1e1");
    }
    
    if(d.rpm.mg2 > psd.engines.mg2.max)
    {
      document.getElementById("svg_mg2_rpm").setAttribute('y', zeroY - parseInt(max_line * psd.engines.mg2.max / psd.engines.mg2.max));
      document.getElementById("svg_icemg2").y2.baseVal.value = zeroY - parseInt(max_line * psd.engines.mg2.max / psd.engines.mg2.max);
      document.getElementById("svg_icemg2").setAttribute('stroke', "#e11");
    }
    else if(d.rpm.mg2 < psd.engines.mg2.min)
    {
      document.getElementById("svg_mg2_rpm").setAttribute('y', zeroY + parseInt(max_line * psd.engines.mg2.min / psd.engines.mg2.min));
      document.getElementById("svg_icemg2").y2.baseVal.value = zeroY + parseInt(max_line * psd.engines.mg2.min / psd.engines.mg2.min);
      document.getElementById("svg_icemg2").setAttribute('stroke', "#e11");
    }
    else
    {
      document.getElementById("svg_mg2_rpm").setAttribute('y', zeroY - parseInt(max_line * d.rpm.mg2 / psd.engines.mg2.max));
      document.getElementById("svg_icemg2").y2.baseVal.value = zeroY - parseInt(max_line * d.rpm.mg2 / psd.engines.mg2.max);
      document.getElementById("svg_icemg2").setAttribute('stroke', "#1e1");
    }
  }
};

var sim = new Simulation();


