/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class PSDData
{
  constructor()
  {
    this.rpm = [];
    this.rpm.ice = 0;
    this.rpm.mg1 = 0;
    this.rpm.mg2 = 0;
    this.rpm.wheels = 0;
    this.rpm.diff = 0;
    this.rpm.ring = 0;
    this.speed = 0;
    this.valid = true;
  }
}

class PSD
{
  constructor()
  {
    this.gears = [];
    this.gears.sun = 30;
    this.gears.planetary = 23;
    this.gears.ringInside = 78;
    this.gears.ringOutside = 65;
    this.gears.middleBig = 53;
    this.gears.small = 17;
    this.gears.middleSmall = 21;
    this.gears.big = 73;
    
    this.tire = [];
    this.tire.diameter = 17;
    this.tire.width = 215;
    this.tire.ratio = 45;
    this.tire.getCircumference = function (){ return parseInt(Math.PI * (this.diameter * 25.4 + 2.0 * this.ratio / 100 * this.width) / 10.0) / 100.0; };
    
    this.engines = [];
    this.engines.ice = [];
    this.engines.ice.max = 5200;
    this.engines.mg1 = [];
    this.engines.mg1.min = -10000;
    this.engines.mg1.max = 10000;
    this.engines.mg2 = [];
    this.engines.mg2.min = -17000;
    this.engines.mg2.max = 17000;
    
    this.rpm2kw = ((1.0 / 60) / 1000) * Math.PI * 2;
  }
  
  calculateFromSpeed(rpmIce, speed)
  {
    var d = new PSDData();
    d.rpm.ice = parseInt(rpmIce);
    d.speed = parseInt(speed);
    
    d.rpm.wheels = ((d.speed / 3.6) / this.tire.getCircumference()) * 60;
    d.rpm.diff = (this.gears.big / this.gears.middleSmall) * d.rpm.wheels;
    d.rpm.ring = (this.gears.middleBig / this.gears.ringOutside) * d.rpm.diff;
    
    var ioPlanetary = - this.gears.ringInside / this.gears.sun;
    
    d.rpm.mg1 = ioPlanetary * d.rpm.ring + (1 - ioPlanetary) * d.rpm.ice;
    d.rpm.mg2 = d.rpm.diff * (this.gears.middleBig / this.gears.small);
    
    return d;
  }
};

var psd = new PSD();
