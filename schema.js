/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global psd */

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
  
  draw(ctx)
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
  
  drawDirectConnect(rect2, ctx)
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
  
  draw(ctx)
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
        this.drawDirectConnect(this.x, y, this.connections[conns++], ctx);
        drawLine = true;
      }
      else
      {
        this.drawGear(this.x, (gears%2) ? y -1 : y + 2, this.gears[k], (gears % 2)===0, ctx);
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
  
  drawDirectConnect(x, y, rect2, ctx)
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
  
  drawGear(x,y,tooths, isTop, ctx)
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
  constructor(ctx)
  {
    this.ctx = ctx;
    this.wheels = [];
    this.wheels[0] = new Rect(10,10,80,30, "#aaa", "Wheel");
    this.wheels[1] = new Rect(10,150,80,30, "#aaa", "Wheel");
    this.diff = new Rect(10,70,80,40, "#666", "Diff");
    this.axis = [];
    this.axis[0] = new Axis(this.diff);
    this.axis[0].addConnection(this.diff);
    this.axis[0].addGear(psd.gears.big);
    this.axis[0].addGear(psd.gears.middleSmall);
    this.axis[1] = new Axis(this.axis[0]);
    this.mg1 = new Rect(300, 308, 80, 60, "#aaf", "MG1");
    this.mg2 = new Rect(300, 60, 80, 60, "#55a", "MG2");
    this.ice = new Rect(20, 308, 80, 60, "#dd6", "ICE");
    this.axis[1].addConnection(this.mg2);
    this.axis[1].setFirstObj(this.mg2);
    this.axis[1].addGear(psd.gears.small);
    this.axis[1].addGear(1);
    this.axis[1].addConnection(this.axis[1]);
    this.axis[0].addConnection(this.axis[1]);
    this.axis[1].addGear(psd.gears.middleBig);
    this.axis[1].addGear(psd.gears.ringOutside);
    this.axis[1].addConnection(this.ice);
    this.axis[1].addGear(psd.gears.ringInside);
    this.axis[1].addGear(psd.gears.planetary);
    this.axis[1].addConnection(this.ice);
    this.axis[1].addGear(1);
    this.axis[1].addGear(psd.gears.sun);
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
    this.wheels[0].draw(this.ctx);
    this.wheels[1].draw(this.ctx);
    this.mg1.draw(this.ctx);
    this.mg2.draw(this.ctx);
    this.ice.draw(this.ctx);
    this.diff.draw(this.ctx);
    this.diff.drawDirectConnect(this.wheels[0], this.ctx);
    this.diff.drawDirectConnect(this.wheels[1], this.ctx);
    for(var k=0;k<this.axis.length;k++)
    {
      this.axis[k].draw(this.ctx);
    }
  }
};

window.addEventListener("load", ()=>{
  var canvas_sch = document.getElementById("gears");
  var ctx = canvas_sch.getContext("2d");  
  car = new Car(ctx);
  car.draw();
});
