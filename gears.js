/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var canvas_sch;
var ctx;
var canvas_psd;
var ctx2;
var car;

var sonnenrad = 30;   // sungear
var umlaufrad = 23;  // ringgear
var hohlrad_i = 78;
var hohlrad_a = 65;
var zwischenrad_g = 53;
var zahnrad_k = 17;
var zwischenrad_k = 21;
var zahnrad_g = 73;
var reifen = 1.94;
var rpm2kw = ((1.0 / 60) / 1000) * Math.PI * 2;


class Rect
{
  constructor(x,y,w,h,color,text)
  {
    this.width = w;
    this.height = h;
    this.x = x;
    this.y = y;
    this.color = color;
    this.text = text;
  }
  
  draw()
  {
    var grd = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
    grd.addColorStop(0, this.color);
    grd.addColorStop(0.5, "#ddd");
    grd.addColorStop(1, this.color);
    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.baseLine = "middle";
    ctx.strokeText(this.text, this.x + this.width/2, this.y + this.height/2 + 6);
  }
  
  drawDirectConnect(rect2)
  {
    if(rect2.x >= this.x + this.width)
    {
      
    }
    else if(rect2.x + rect2.width <= this.x)
    {
      
    }
    else if(rect2.y > this.y + this.height)
    {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width /2, this.y + this.height);
      ctx.lineTo(rect2.x + rect2.width / 2, rect2.y);
      ctx.stroke();
    }
    else if(rect2.y + rect2.height <= this.y)
    {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width /2, this.y);
      ctx.lineTo(rect2.x + rect2.width / 2, rect2.y + rect2.height);
      ctx.stroke();
    }
  }
};

class Axis
{
  constructor(leftObj)
  {
    this.STEP = 30;
    this.height = this.STEP * 2;
    
    this.x = leftObj.x + 80;
    if(!isNaN(leftObj.width)) this.x += leftObj.width;
    this.y = leftObj.y - this.STEP;
    if(!isNaN(leftObj.height)) this.y += leftObj.height / 2;
    this.connections = [];
    this.gears = [];
  }
  
  setFirstObj(obj)
  {
    this.y = obj.y - this.STEP;
    if(!isNaN(obj.height)) this.y += obj.height / 2;
  }
  
  addConnection(conn)
  {
    this.gears.push(0);
    this.connections.push(conn);
    this.height += this.STEP;
  }
  
  addGear(tooths)
  {
    this.gears.push(tooths);
    this.height -= 7;
  }
  
  draw()
  {
    var conns = 0;
    var gears = 0;
    var y = this.y + this.STEP;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, y);
    ctx.moveTo(this.x-10, this.y);
    ctx.lineTo(this.x+10, this.y);
    ctx.stroke();
    for(var k=0;k<this.gears.length;k++)
    {
      var drawLine = false;
      if(this.gears[k] === 0)
      {
        this.drawDirectConnect(this.x, y, this.connections[conns++]);
        drawLine = true;
      }
      else
      {
        this.drawGear(this.x, (gears%2) ? y -1 : y + 2, this.gears[k], (gears % 2)===0);
        gears++;
        if((gears%2) === 0)
        {
          drawLine = true;
          y += 2;
        }
      }
      if(drawLine)
      {
        ctx.beginPath();
        ctx.moveTo(this.x, y);
        y+=this.STEP;
        ctx.lineTo(this.x, y);
        ctx.stroke();
      }
    }
    ctx.beginPath();
    ctx.moveTo(this.x-10, y);
    ctx.lineTo(this.x+10, y);
    ctx.stroke();
  }
  
  drawDirectConnect(x, y, rect2)
  {
    if(isNaN(rect2.width)) rect2.width = 1;
    if(isNaN(rect2.height)) rect2.height = 1;
    
    if(rect2.x >= x)
    {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(rect2.x, rect2.y + rect2.height / 2);
      ctx.stroke();
    }
    else if(rect2.x + rect2.width <= x)
    {
      ctx.beginPath();
      ctx.moveTo(x, y);
      if(rect2.y + rect2.height / 2 > y)
      {
        ctx.lineTo(x - (x - rect2.x - rect2.width) / 2 - Math.abs(y - rect2.y - rect2.height/2) / 3, y);
        ctx.lineTo(x - (x - rect2.x - rect2.width) / 2 - Math.abs(y - rect2.y - rect2.height/2) / 3, rect2.y + rect2.height / 2);
      }
      if(rect2.y + rect2.height / 2 < y)
      {
        ctx.lineTo(x - (x - rect2.x - rect2.width) / 2 - Math.abs(y - rect2.y - rect2.height/2) / 3, y);
        ctx.lineTo(x - (x - rect2.x - rect2.width) / 2 - Math.abs(y - rect2.y - rect2.height/2) / 3, rect2.y + rect2.height / 2);
      }
      ctx.lineTo(rect2.x + rect2.width, rect2.y + rect2.height / 2);
      ctx.stroke();
    }
  }
  
  drawGear(x,y,tooths, isTop)
  {
    ctx.beginPath();
    ctx.moveTo(x-10, y);
    ctx.lineTo(x+10, y);
    ctx.stroke();
    
    if(tooths > 1)
    {
      ctx.font = '15px serif';
      ctx.fillText(tooths + "t", x-20, isTop ? y - 8 : y + 13);
    }
  }
};

class Car
{
  constructor()
  {
    this.wheels = [];
    this.wheels[0] = new Rect(10,10,80,30, "#aaa", "Wheel");
    this.wheels[1] = new Rect(10,150,80,30, "#aaa", "Wheel");
    this.diff = new Rect(10,70,80,40, "#666", "Diff");
    this.axis = [];
    this.axis[0] = new Axis(this.diff);
    this.axis[0].addConnection(this.diff);
    this.axis[0].addGear(73);
    this.axis[0].addGear(21);
    this.axis[1] = new Axis(this.axis[0]);
    this.mg1 = new Rect(300, 308, 80, 60, "#aaf", "MG1");
    this.mg2 = new Rect(300, 60, 80, 60, "#55a", "MG2");
    this.ice = new Rect(20, 308, 80, 60, "#dd6", "ICE");
    this.axis[1].addConnection(this.mg2);
    this.axis[1].setFirstObj(this.mg2);
    this.axis[1].addGear(17);
    this.axis[1].addGear(1);
    this.axis[1].addConnection(this.axis[1]);
    this.axis[0].addConnection(this.axis[1]);
    this.axis[1].addGear(53);
    this.axis[1].addGear(65);
    this.axis[1].addConnection(this.ice);
    this.axis[1].addGear(78);
    this.axis[1].addGear(23);
    this.axis[1].addConnection(this.ice);
    this.axis[1].addGear(1);
    this.axis[1].addGear(30);
    this.axis[1].addConnection(this.mg1);
    this.axis[1].addGear(1);
    this.axis[1].addGear(1);
    this.axis[1].addConnection(this.ice);
    this.axis[1].addGear(1);
    this.axis[1].addGear(1);
    this.axis[1].addConnection(this.ice);
  }
  
  draw()
  {
    this.wheels[0].draw();
    this.wheels[1].draw();
    this.mg1.draw();
    this.mg2.draw();
    this.ice.draw();
    this.diff.draw();
    this.diff.drawDirectConnect(this.wheels[0]);
    this.diff.drawDirectConnect(this.wheels[1]);
    for(var k=0;k<this.axis.length;k++)
    {
      this.axis[k].draw();
    }
  }
};

setTimeout(()=>{init();}, 300);

function init()
{
  canvas_sch = document.getElementById("gears"); 
  canvas_psd = document.getElementById("psd"); 
  ctx = canvas_sch.getContext("2d");
  ctx2 = canvas_psd.getContext("2d");
  
  car = new Car();
  car.draw();
  
  setInterval(()=>{rotateGears();}, 200);
}

var cx      = 200,                    // center x
    cy      = 200,                    // center y
    cx2     = 200,
    cy2     = 200 - 40 - 30 - 5,
    radiusO = 50,                    // outer radius
    radiusI = 40,                    // inner radius
    taperO  = 40,                     // outer taper %
    taperI  = 30,                     // inner taper %
    
    radius2 = 75,                    // inner radius
    radius2I = 20,                    // inner radius
    radius2O = 30,                    // inner radius
    
    radius4 = 120,                    // inner radius
    radius4I = 100,                    // inner radius
    radius4O = 110,                    // inner radius

    // pre-calculate values for loop

    pi2     = 2 * Math.PI,            // cache 2xPI (360deg)
    angle1  = pi2 / (sonnenrad * 2),    // angle between notches
    taperAI1 = angle1 * taperI * 0.005, // inner taper offset (100% = half notch)
    taperAO1 = angle1 * taperO * 0.005, // outer taper offset
    a       = angle1,                  // iterator (angle)
    angle2  = pi2 / (zahnrad_k * 2),    // angle between notches
    taperAI2 = angle2 * taperI * 0.005, // inner taper offset (100% = half notch)
    taperAO2 = angle2 * taperO * 0.005, // outer taper offset
    b       = angle2,                  // iterator (angle)
    angle3  = 0,
    angle4  = pi2 / (zahnrad_g * 2),    // angle between notches
    taperAI4 = angle4 * taperI * 0.005, // inner taper offset (100% = half notch)
    taperAO4 = angle4 * taperO * 0.005, // outer taper offset
    c       = angle4,                  // iterator (angle)
    speed   = 0.5,
    toggle  = false;                  // notch radius level (i/o)
    
function rotateGears()
{
  //sonnenrad  
  a+=speed;
  b-=speed * (sonnenrad / zahnrad_k);
  c+=speed / 100;
  
  ctx2.clearRect(0, 0, canvas_psd.width, canvas_psd.height);
  
  ctx2.fillStyle = '#55a';
  ctx2.ellipse(cx, cy, radius4, radius4, 0, 0, Math.PI * 2);
  ctx2.fill();
  
  ctx2.beginPath();
  //ctx2.moveTo(cx + radiusO * Math.cos(taperAO1), cy + radiusO * Math.sin(taperAO1));
  for (let k=0;k<zahnrad_g*2;k++) 
  {
    c+=angle4;
    // draw inner to outer line
    if (toggle) {
        ctx2.lineTo(cx + radius4I * Math.cos(c - taperAI4),
                   cy + radius4I * Math.sin(c - taperAI4));
        ctx2.lineTo(cx + radius4O * Math.cos(c + taperAO4),
                   cy + radius4O * Math.sin(c + taperAO4));
    }

    // draw outer to inner line
    else {
        ctx2.lineTo(cx + radius4O * Math.cos(c - taperAO4),  // outer line
                   cy + radius4O * Math.sin(c - taperAO4));
        ctx2.lineTo(cx + radius4I * Math.cos(c + taperAI4),  // inner line
                   cy + radius4I * Math.sin(c + taperAI4));
    }

    // switch level
    toggle = !toggle;
  }
  ctx2.closePath();
  ctx2.fillStyle = '#eee';
  ctx2.fill();
  
  ctx2.beginPath();
  ctx2.fillStyle = '#dd5';
  ctx2.ellipse(cx, cy, radius2+5, radius2+5, 0, 0, Math.PI * 2);
  ctx2.fill();
  ctx2.closePath();
  ctx2.beginPath();
  ctx2.fillStyle = '#eee';
  ctx2.ellipse(cx, cy, radius2 - 5, radius2 - 5, 0, 0, Math.PI * 2);
  ctx2.fill();
  
  ctx2.closePath();
  
  ctx2.beginPath();
  //ctx2.moveTo(cx + radiusO * Math.cos(taperAO1), cy + radiusO * Math.sin(taperAO1));
  for (let k=0;k<sonnenrad*2;k++) 
  {
    a+=angle1;
    // draw inner to outer line
    if (toggle) {
        ctx2.lineTo(cx + radiusI * Math.cos(a - taperAI1),
                   cy + radiusI * Math.sin(a - taperAI1));
        ctx2.lineTo(cx + radiusO * Math.cos(a + taperAO1),
                   cy + radiusO * Math.sin(a + taperAO1));
    }

    // draw outer to inner line
    else {
        ctx2.lineTo(cx + radiusO * Math.cos(a - taperAO1),  // outer line
                   cy + radiusO * Math.sin(a - taperAO1));
        ctx2.lineTo(cx + radiusI * Math.cos(a + taperAI1),  // inner line
                   cy + radiusI * Math.sin(a + taperAI1));
    }

    // switch level
    toggle = !toggle;
  }

  ctx2.closePath();
  ctx2.fillStyle = '#aaf';
  ctx2.fill();
  
  /*
  ctx2.beginPath();
  ctx2.ellipse(cx, cy, radius2, radius2, Math.PI / 4, 0, 2 * Math.PI);
  ctx2.closePath();
  ctx2.stroke();*/
  
  angle3 += speed / 10;
  for(let j=0;j<4;j++)
  {
    cx2 = 200 + Math.sin(j * pi2 / 4 + angle3) * 75;
    cy2 = 200 + Math.cos(j * pi2 / 4 + angle3) * 75;
    
    ctx2.beginPath();
    //ctx2.moveTo(cx2 + radius2O * Math.cos(taperAO2), cy2 + radius2O * Math.sin(taperAO2));
    for (let k=0;k<zahnrad_k*2;k++) 
    {
      b+=angle2;
      // draw inner to outer line
      if (toggle) {
          ctx2.lineTo(cx2 + radius2I * Math.cos(b - taperAI2),
                     cy2 + radius2I * Math.sin(b - taperAI2));
          ctx2.lineTo(cx2 + radius2O * Math.cos(b + taperAO2),
                     cy2 + radius2O * Math.sin(b + taperAO2));
      }

      // draw outer to inner line
      else {
          ctx2.lineTo(cx2 + radius2O * Math.cos(b - taperAO2),  // outer line
                     cy2 + radius2O * Math.sin(b - taperAO2));
          ctx2.lineTo(cx2 + radius2I * Math.cos(b + taperAI2),  // inner line
                     cy2 + radius2I * Math.sin(b + taperAI2));
      }

      // switch level
      toggle = !toggle;
    }
    ctx2.closePath();
    ctx2.fillStyle = '#f88';
    ctx2.fill();
  }
  

}


function updateRPM()
{
  var rpmice = document.getElementById("rpmice").value;
  var speed = document.getElementById("speed").value;
  
  var rpm_wheels = ((speed / 3.6) / reifen) * 60;
  var rpm_diff = (zahnrad_g / zwischenrad_k) * rpm_wheels;
  var rpm_hohl = (zwischenrad_g / hohlrad_a) * rpm_diff;
  
  var ioPlanetar = - hohlrad_i / sonnenrad;
  var rpm_mg1 = ioPlanetar * rpm_hohl + (1 - ioPlanetar) * rpmice;
  var rpm_mg2 = rpm_diff * (zwischenrad_g / zahnrad_k);
  
  document.getElementById("rpmmg1").value = parseInt(rpm_mg1);
  document.getElementById("rpmmg2").value = parseInt(rpm_mg2);
  
}