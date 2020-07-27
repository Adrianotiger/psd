/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global psd */

class PlanetaryAnimation
{
  constructor(ctx)
  {
    this.ctx = ctx;
    
    this.cx = ctx.canvas.width * 0.5;
    this.cy = ctx.canvas.height * 0.5;
    
    angle1 = 0.05;
    
    this.ring = [];
    this.ring.OX = ctx.canvas.width * 0.4;
    this.ring.O = this.ring.OX - 10;
    this.ring.I = this.ring.O - 10;
    this.ring.tooths = psd.gears.ringInside;
    this.ring.toothAngle = Math.PI / this.ring.tooths;
    this.ring.TaperO = this.ring.toothAngle * 30 * 0.005; // inner taper offset (100% = half notch)
    this.ring.TaperI = this.ring.toothAngle * 50 * 0.005; // inner taper offset (100% = half notch)
    this.ring.speed = 0;
    this.ring.angle = 0.04;
    
    this.planets = [];
    this.planets.O = this.ring.I * 0.33;
    this.planets.I = this.planets.O - 10;
    this.planets.tooths = psd.gears.planetary;
    this.planets.toothAngle = Math.PI / this.planets.tooths;
    this.planets.TaperO = this.planets.toothAngle * 50 * 0.005; // inner taper offset (100% = half notch)
    this.planets.TaperI = this.planets.toothAngle * 30 * 0.005; // inner taper offset (100% = half notch)
    this.planets.speed = 0;
    this.planets.angle = 0;
    this.planets.offsets = [-0.07,0.12,0.08,0.0];
    
    this.engine = [];
    this.engine.speed = 0;
    this.engine.angle = 0;
    this.engine.radius = this.ring.O - this.planets.O - 3;
    
    this.sun = [];
    this.sun.O = this.engine.radius - this.planets.I - 3;
    this.sun.I = this.sun.O - 10;
    this.sun.tooths = psd.gears.sun;
    this.sun.toothAngle = Math.PI / this.sun.tooths;
    this.sun.TaperO = this.sun.toothAngle * 60 * 0.005; // inner taper offset (100% = half notch)
    this.sun.TaperI = this.sun.toothAngle * 30 * 0.005; // inner taper offset (100% = half notch)
    this.sun.speed = 0;
    this.sun.angle = 0;
    
    
    this.ani = setInterval(()=>{this.step();}, 33);
  }
  
  setMG1(mg1, mg2)
  {
    const slowMotionFactor = 200000.0;
    //this.engine.speed = -ice / slowMotionFactor;
    this.sun.speed = mg1 / slowMotionFactor;
    this.planets.speed = -this.sun.speed * (this.sun.tooths / this.planets.tooths) - this.engine.speed * this.planets.tooths / 10.0;
    //this.ring.speed = this.planets.speed * (this.planets.tooths / this.ring.tooths) - this.engine.speed * 0.702;
    this.ring.speed = mg2 / slowMotionFactor / (this.planets.tooths * this.ring.tooths / 470.0);
    //this.engine.speed = -(-this.planets.speed + this.ring.speed) / 2.0;
  }
  
  step()
  {
    this.engine.angle += this.engine.speed;
    this.sun.angle += this.sun.speed;
    this.ring.angle += this.ring.speed;
    this.planets.angle += this.planets.speed;
    this.draw();
  }
  
  draw()
  {
    this.drawRing();
    this.drawPlanets();
    this.drawSun();
  }
  
  drawRing()
  {
    this.ctx.fillStyle = '#55a';
    this.ctx.ellipse(this.cx, this.cy, this.ring.OX, this.ring.OX, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    var c = this.ring.angle;
    
    this.ctx.beginPath();
    var toggle = true;
    for (let k=0;k<this.ring.tooths*2;k++) 
    {
      c += this.ring.toothAngle;
      // draw inner to outer line
      if (toggle) {
          this.ctx.lineTo(this.cx + this.ring.I * Math.cos(c - this.ring.TaperI),
                     this.cy + this.ring.I * Math.sin(c - this.ring.TaperI));
          this.ctx.lineTo(this.cx + this.ring.O * Math.cos(c + this.ring.TaperO),
                     this.cy + this.ring.O * Math.sin(c + this.ring.TaperO));
      }
      // draw outer to inner line
      else {
          this.ctx.lineTo(this.cx + this.ring.O * Math.cos(c - this.ring.TaperO),  // outer line
                     this.cy + this.ring.O * Math.sin(c - this.ring.TaperO));
          this.ctx.lineTo(this.cx + this.ring.I * Math.cos(c + this.ring.TaperI),  // inner line
                     this.cy + this.ring.I * Math.sin(c + this.ring.TaperI));
      }

      // switch level
      toggle = !toggle;
    }
    this.ctx.closePath();
    this.ctx.fillStyle = '#eee';
    this.ctx.fill();
  }
  
  drawPlanets()
  {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#dd5';
    this.ctx.ellipse(cx, cy, this.engine.radius + 5, this.engine.radius + 5, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.fillStyle = '#eee';
    this.ctx.ellipse(cx, cy, this.engine.radius - 5, this.engine.radius - 5, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
        
    for(let j=0;j<4;j++)
    {
      cx2 = this.cx + Math.sin(j * pi2 / 4.0 + this.engine.angle) * this.engine.radius;
      cy2 = this.cy + Math.cos(j * pi2 / 4.0 + this.engine.angle) * this.engine.radius;
      
      var b = this.planets.angle + this.planets.offsets[j];
      this.ctx.beginPath();
      var toggle = true;
      
      for (let k=0;k<this.planets.tooths*2;k++) 
      {
        b += this.planets.toothAngle;
        // draw inner to outer line
        if (toggle) {
            this.ctx.lineTo(cx2 + this.planets.I * Math.cos(b - this.planets.TaperI),
                       cy2 + this.planets.I * Math.sin(b - this.planets.TaperI));
            this.ctx.lineTo(cx2 + this.planets.O * Math.cos(b + this.planets.TaperO),
                       cy2 + this.planets.O * Math.sin(b + this.planets.TaperO));
        }
        // draw outer to inner line
        else {
            this.ctx.lineTo(cx2 + this.planets.O * Math.cos(b - this.planets.TaperO),  // outer line
                       cy2 + this.planets.O * Math.sin(b - this.planets.TaperO));
            this.ctx.lineTo(cx2 + this.planets.I * Math.cos(b + this.planets.TaperI),  // inner line
                       cy2 + this.planets.I * Math.sin(b + this.planets.TaperI));
        }
        toggle = !toggle;
      }
      
      this.ctx.closePath();
      this.ctx.fillStyle = '#f88';
      this.ctx.fill();
    }
  }
  
  drawSun()
  {
    var toggle = true;
    var a = this.sun.angle;
    this.ctx.beginPath();
    for (let k=0;k<this.sun.tooths*2;k++) 
    {
      a += this.sun.toothAngle;
      // draw inner to outer line
      if (toggle) {
          this.ctx.lineTo(this.cx + this.sun.I * Math.cos(a - this.sun.TaperI),
                     this.cy + this.sun.I * Math.sin(a - this.sun.TaperI));
          this.ctx.lineTo(this.cx + this.sun.O * Math.cos(a + this.sun.TaperO),
                     this.cy + this.sun.O * Math.sin(a + this.sun.TaperO));
      }
      // draw outer to inner line
      else {
          this.ctx.lineTo(this.cx + this.sun.O * Math.cos(a - this.sun.TaperO),  // outer line
                     this.cy + this.sun.O * Math.sin(a - this.sun.TaperO));
          this.ctx.lineTo(this.cx + this.sun.I * Math.cos(a + this.sun.TaperI),  // inner line
                     this.cy + this.sun.I * Math.sin(a + this.sun.TaperI));
      }

      // switch level
      toggle = !toggle;
    }

    this.ctx.closePath();
    this.ctx.fillStyle = '#aaf';
    this.ctx.fill();
  }
};

var planetary = null;



window.addEventListener("load", ()=>{
  var canvas = document.getElementById("planetary");
  var ctx = canvas.getContext("2d");  
  planetary = new PlanetaryAnimation(ctx);
});



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

setTimeout(()=>{init2();}, 300);

function init2()
{
  canvas_psd = document.getElementById("planetary"); 
  ctx2 = canvas_psd.getContext("2d");
  
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
  return;
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

