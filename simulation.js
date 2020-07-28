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
    this.svg = null;
    this.iceReal = 0;
    this.speedReal = 0;
  }
  
  get w() { return parseInt(this.svg.style.width);  }
  get h() { return parseInt(this.svg.style.height);  }
  get max() { return Math.max(Math.max(psd.engines.mg1.max, psd.engines.mg2.max), 20000) + 1000;  }  // >= 20'000
  get min() { return Math.min(Math.min(psd.engines.mg1.min, psd.engines.mg2.min), -this.max); }           // <= -20'000
  get zero() { return parseInt(this.h / 2); }
  get border() { return 15; }
  get length() { return this.zero - this.border; }
  get icex() { return parseInt(1.0 * (psd.gears.ringInside/(psd.gears.sun+psd.gears.ringInside)) * (this.w*4/6)); }
  get icey() { return parseInt((53.0/30.0) * this.length * psd.engines.ice.max / psd.engines.mg2.max); } // todo: find the right formula
  
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
  
  createView(svg)
  {
    this.svg = svg;
    const w = this.w;
    const h = this.h;
    const max = this.max;
    const min = this.min;
    const zero = this.zero;
    const border = this.border;
    const length = this.length;
    
    var t, l, r, x, y1, y2;
    const ns = "http://www.w3.org/2000/svg";
    
    // draw 0 line
    l = document.createElementNS(ns, "line");
    l.setAttribute("x1",  w/6);  l.setAttribute("y1",  zero);      l.setAttribute("x2", w*5/6); l.setAttribute("y2", zero);     l.setAttribute("stroke", "#aaa");  
    svg.appendChild(l);
    
    // draw MG1
    x = parseInt(w / 6);
    l = document.createElementNS(ns, "line");
    l.setAttribute("x1",  x);    l.setAttribute("y1",  border);    l.setAttribute("x2", x);     l.setAttribute("y2", h-border);  l.setAttribute("stroke", "#aaa");  
    svg.appendChild(l);
    r = document.createElementNS(ns, "rect");
    y1 = zero - length * psd.engines.mg1.max / max;
    y2 = zero + length * psd.engines.mg1.min / min;
    r.setAttribute("x",  x-3);   r.setAttribute("y",  y1);         r.setAttribute("width", 6);  r.setAttribute("height", y2 - y1);  
    r.setAttribute("rx",  3);    r.setAttribute("ry",  3);         r.setAttribute("fill", "#000");
    svg.appendChild(r);
    t = document.createElementNS(ns, "text");
    t.setAttribute("x",  x + 5); t.setAttribute("y",  15);         t.setAttribute("fill", "#88f");    
    t.appendChild(document.createTextNode("MG1"));
    svg.appendChild(t);
    t = document.createElementNS(ns, "text");
    t.setAttribute("x",  w/6-60); t.setAttribute("y",  zero+5);    t.setAttribute("fill", "#5a5");  t.setAttribute("id", "svg_mg1_rpm"); 
    t.appendChild(document.createTextNode("0rpm"));
    svg.appendChild(t);
    
    // draw MG2
    x = parseInt(w * 5 / 6);
    l = document.createElementNS(ns, "line");
    l.setAttribute("x1",  x);    l.setAttribute("y1",  border);    l.setAttribute("x2", x);     l.setAttribute("y2", h-border);  l.setAttribute("stroke", "#aaa");  
    svg.appendChild(l);
    r = document.createElementNS(ns, "rect");
    y1 = zero - length * psd.engines.mg2.max / max;
    y2 = zero + length * psd.engines.mg2.min / min;
    r.setAttribute("x",  x-3);   r.setAttribute("y",  y1);         r.setAttribute("width", 6);  r.setAttribute("height", y2 - y1);  
    r.setAttribute("rx",  3);    r.setAttribute("ry",  3);         r.setAttribute("fill", "#000");
    svg.appendChild(r);
    t = document.createElementNS(ns, "text");
    t.setAttribute("x",  x-38);  t.setAttribute("y",  15);         t.setAttribute("fill", "#55b");    
    t.appendChild(document.createTextNode("MG2"));
    svg.appendChild(t);
    t = document.createElementNS(ns, "text");
    t.setAttribute("x",  w*5/6+10); t.setAttribute("y",  zero+5);    t.setAttribute("fill", "#5a5");  t.setAttribute("id", "svg_mg2_rpm"); 
    t.appendChild(document.createTextNode("0rpm"));
    svg.appendChild(t);
    
    // connection lines
    x = this.w*2/6;//this.icex;
    l = document.createElementNS(ns, "line");
    l.setAttribute("x1",  w/6);    l.setAttribute("y1",  zero);    l.setAttribute("x2", w/6+x);     l.setAttribute("y2", zero);  l.setAttribute("stroke", "#4b4");  
    l.setAttribute("id", "svg_icemg1");
    svg.appendChild(l);
    l = document.createElementNS(ns, "line");
    l.setAttribute("x1",  w/6+x);    l.setAttribute("y1",  zero);    l.setAttribute("x2", w*5/6);   l.setAttribute("y2", zero);  l.setAttribute("stroke", "#4b4");  
    l.setAttribute("id", "svg_icemg2");
    svg.appendChild(l);
    
    // draw ICE
    var fo = document.createElementNS(ns, "foreignObject");
    fo.setAttribute("x", w/6);   fo.setAttribute("y", 0);          fo.setAttribute("width", w*4/6); fo.setAttribute("height", h);
    //fo.setAttribute("style", "background-color:red");
    svg.appendChild(fo);
    l = document.createElement("input");
    //y2 = length * psd.engines.ice.max / max + 15; // 15 is the border of the slider
    y2 = this.icey + 15;
    l.setAttribute("type", "range");l.setAttribute("min", "0");l.setAttribute("max", psd.engines.ice.max);l.setAttribute("value", 0);
    l.setAttribute("id", "rpmice");l.setAttribute("style", "width:" + y2 + "px;height:10px;position:absolute;left:" + (-y2/2) + "px;top:-5px;transform:rotate(-90deg) translate(" + (-zero+y2/2-6) + "px," + (x-3) + "px);");
    l.addEventListener("input", ()=>{sim.calculateNewRPM();});
    fo.appendChild(l);
    l = document.createElement("input");
    l.setAttribute("type", "range");l.setAttribute("min", -50);l.setAttribute("max", 250);l.setAttribute("value", 0);
    l.setAttribute("id", "speed");l.setAttribute("style", "width:" + (w*4/6-15) + "px;height:10px;position:absolute;left:5px;bottom:20px;");
    l.addEventListener("input", ()=>{sim.calculateNewRPM();});
    l.addEventListener("dblclick", ()=>{l.value=0;sim.calculateNewRPM();});
    fo.appendChild(l);
    t = document.createElementNS(ns, "text");
    t.setAttribute("x",  x+w/6-15);  t.setAttribute("y",  15);         t.setAttribute("fill", "#aa2");    
    t.appendChild(document.createTextNode("ICE"));
    svg.appendChild(t);
    t = document.createElementNS(ns, "text");
    t.setAttribute("x",  x+w/6-20); t.setAttribute("y",  zero+25);    t.setAttribute("fill", "#5a5");  t.setAttribute("id", "svg_ice_rpm"); 
    t.appendChild(document.createTextNode("0rpm"));
    svg.appendChild(t);
    t = document.createElementNS(ns, "text");
    t.setAttribute("x",  w/2-30); t.setAttribute("y",  h-7);    t.setAttribute("fill", "#555");  t.setAttribute("id", "svg_speed"); 
    t.appendChild(document.createTextNode("0 km/h"));
    svg.appendChild(t);
    
  }
  
  calculateNewRPM()
  {
    var d = psd.calculateFromSpeed(document.getElementById("rpmice").value, document.getElementById("speed").value);
    
    this.updateGearAnimation(d.rpm.mg1, d.rpm.ice, d.rpm.mg2);
    
    const length = this.length;
    const zero = this.zero;
    const max = this.max;
    const min = this.min;

    document.getElementById("svg_speed").innerHTML = d.speed + " km/h";
    document.getElementById("svg_ice_rpm").innerHTML = d.rpm.ice + "rpm";
    document.getElementById("svg_icemg1").y2.baseVal.value = zero - parseInt(this.icey * d.rpm.ice / psd.engines.ice.max);
    document.getElementById("svg_icemg2").y1.baseVal.value = zero - parseInt(this.icey * d.rpm.ice / psd.engines.ice.max);
    
    // for a better graphic:
    //document.getElementById("svg_icemg1").y2.baseVal.value -= parseInt((d.rpm.mg1 - d.rpm.mg2 *0.6) / 5000);
    //document.getElementById("svg_icemg2").y1.baseVal.value -= parseInt((d.rpm.mg2 * 0.6 - d.rpm.mg1) / 5000);
    
    document.getElementById("svg_mg1_rpm").innerHTML = parseInt(d.rpm.mg1);
    document.getElementById("svg_mg2_rpm").innerHTML = parseInt(d.rpm.mg2);
        
    if(d.rpm.mg1 > psd.engines.mg1.max)
    {
      document.getElementById("svg_mg1_rpm").setAttribute('y', zero - parseInt(length * psd.engines.mg1.max / max));
      document.getElementById("svg_icemg1").y1.baseVal.value = zero - parseInt(length * psd.engines.mg1.max / max);
      document.getElementById("svg_icemg1").setAttribute('stroke', "#e11");
    }
    else if(d.rpm.mg1 < psd.engines.mg1.min)
    {
      document.getElementById("svg_mg1_rpm").setAttribute('y', zero + parseInt(length * psd.engines.mg1.min / min));
      document.getElementById("svg_icemg1").y1.baseVal.value = zero + parseInt(length * psd.engines.mg1.min / min);
      document.getElementById("svg_icemg1").setAttribute('stroke', "#e11");
    }
    else
    {
      document.getElementById("svg_mg1_rpm").setAttribute('y', zero - parseInt(length * d.rpm.mg1 / max));
      document.getElementById("svg_icemg1").y1.baseVal.value = zero - parseInt(length * d.rpm.mg1 / max);
      document.getElementById("svg_icemg1").setAttribute('stroke', "#1e1");
    }
    
    if(d.rpm.mg2 > psd.engines.mg2.max)
    {
      document.getElementById("svg_mg2_rpm").setAttribute('y', zero - parseInt(length * psd.engines.mg2.max / max));
      document.getElementById("svg_icemg2").y2.baseVal.value = zero - parseInt(length * psd.engines.mg2.max / max);
      document.getElementById("svg_icemg2").setAttribute('stroke', "#e11");
    }
    else if(d.rpm.mg2 < psd.engines.mg2.min)
    {
      document.getElementById("svg_mg2_rpm").setAttribute('y', zero + parseInt(length * psd.engines.mg2.min / min));
      document.getElementById("svg_icemg2").y2.baseVal.value = zero + parseInt(length * psd.engines.mg2.min / min);
      document.getElementById("svg_icemg2").setAttribute('stroke', "#e11");
    }
    else
    {
      document.getElementById("svg_mg2_rpm").setAttribute('y', zero - parseInt(length * d.rpm.mg2 / max));
      document.getElementById("svg_icemg2").y2.baseVal.value = zero - parseInt(length * d.rpm.mg2 / max);
      document.getElementById("svg_icemg2").setAttribute('stroke', "#1e1");
    }
  }
  
  fillTechData(div)
  {
    var t, tr, td;
    t = document.createElement("table");
    t.setAttribute("style", "width:100%;font-size:80%;vertical-align:top;");
    tr = document.createElement("tr");
    td = document.createElement("th");
    td.setAttribute("colspan", 2);
    td.setAttribute("style", "font-size:120%;");
    td.appendChild(document.createTextNode("Tech Data"));
    tr.appendChild(td);
    t.appendChild(tr);
    tr = document.createElement("tr");
    td = document.createElement("td");
    {
      var t2 = document.createElement("table");
      t2.setAttribute("style", "width:80%;text-align:left;");
      var tr2 = document.createElement("tr");
      var td2 = document.createElement("th");
      td2.setAttribute("colspan", 2);
      td2.appendChild(document.createTextNode("Gears"));
      tr2.appendChild(td2);
      t2.appendChild(tr2);
      for(var x in psd.gears)
      {
        tr2 = document.createElement("tr");
        td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(x));
        tr2.appendChild(td2);
        td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(psd.gears[x]));
        tr2.appendChild(td2);
        t2.appendChild(tr2);
      }
      td.appendChild(t2);
      tr.appendChild(td);
    }
    td = document.createElement("td");
    {
      var t2 = document.createElement("table");
      t2.setAttribute("style", "width:80%;text-align:left;vertical-align:top;");
      var tr2 = document.createElement("tr");
      var td2 = document.createElement("th");
      td2.setAttribute("colspan", 2);
      td2.appendChild(document.createTextNode("Engines"));
      tr2.appendChild(td2);
      t2.appendChild(tr2);
      for(var y in psd.engines)
      {
        for(var x in psd.engines[y])
        {
          tr2 = document.createElement("tr");
          td2 = document.createElement("td");
          td2.appendChild(document.createTextNode(y.toUpperCase() + " " + x));
          tr2.appendChild(td2);
          td2 = document.createElement("td");
          td2.appendChild(document.createTextNode(psd.engines[y][x]));
          tr2.appendChild(td2);
          t2.appendChild(tr2);
        }
      }
      td.appendChild(t2);
      t2 = document.createElement("table");
      t2.setAttribute("style", "width:80%;text-align:left;vertical-align:top;margin-top:20px;");
      tr2 = document.createElement("tr");
      td2 = document.createElement("th");
      td2.setAttribute("colspan", 2);
      td2.appendChild(document.createTextNode("Tire"));
      tr2.appendChild(td2);
      t2.appendChild(tr2);
      for(var y in psd.tire)
      {
        if(isNaN(psd.tire[y])) continue;
        tr2 = document.createElement("tr");
        td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(y));
        tr2.appendChild(td2);
        td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(psd.tire[y]));
        tr2.appendChild(td2);
        t2.appendChild(tr2);
      }
      td.appendChild(t2);
      tr.appendChild(td);
    }
    t.appendChild(tr);
    
    
    div.appendChild(t);
  }
};

var sim = new Simulation();

window.addEventListener("load", ()=>{
  sim.createView(document.getElementById("sim_svg"));
  sim.fillTechData(document.getElementById("tech_sheet"));
});


