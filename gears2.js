      /*
      Gear image generation code adapted from http://jsbin.com/oresos/latest
      
      Gear Animation code Copyright (c) 2014 Ryan Cahoon and is distributed under the following terms

      Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
      files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
      modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
      Software is furnished to do so, subject to the following conditions:

      * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
        Software.
      * The names of the contributors may not be used to endorse or promote products derived from this software without
        specific prior written permission.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
      WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
      COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
      ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      */
     
var Animation = function(){
    this.t = 0;
    this.timeInterval = 0;
    this.startTime = 0;
    this.lastTime = 0;
    this.frame = 0;
    this.animating = false;
    
    // provided by Paul Irish
    window.requestAnimFrame = (function(callback){
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
    })();
};

Animation.prototype.setStage = function(func){
    this.stage = func;
};

Animation.prototype.isAnimating = function(){
    return this.animating;
};

Animation.prototype.getFrame = function(){
    return this.frame;
};

Animation.prototype.start = function(){
    this.animating = true; 
    var date = new Date();
    this.startTime = date.getTime();
    this.lastTime = this.startTime;
    
    if (this.stage !== undefined) {
        this.stage();
    }
    
    this.animationLoop();
};

Animation.prototype.stop = function(){
    this.animating = false;
};

Animation.prototype.getTimeInterval = function(){
    return this.timeInterval;
};

Animation.prototype.getTime = function(){
    return this.t;
};

Animation.prototype.getFps = function(){
    return this.timeInterval > 0 ? 1000 / this.timeInterval : 0;
};

Animation.prototype.animationLoop = function(){
    var that = this;
    
    this.frame++;
    var date = new Date();
    var thisTime = date.getTime();
    this.timeInterval = thisTime - this.lastTime;
    this.t += this.timeInterval;
    this.lastTime = thisTime;
    
    if (this.stage !== undefined) {
        this.stage();
    }
    
    if (this.animating) {
        requestAnimFrame(function(){
            that.animationLoop();
        });
    }
};
      
pi=Math.PI;

// degrees to radians
function degrees_to_radians(theta) { return theta/180*pi; }

// polar to cartesian 
function polar(r,theta) { return [r*Math.sin(theta), r*Math.cos(theta)]; }

// gear parameter setup
mm_per_tooth = 2*2*pi; // pixel size of one gear tooth (even though it says millimeters, it's pixels) must be same for two gears to fit each other
pressure_angle= 20; // in degrees, determines gear shape, range is 10 to 40 degrees, most common is 20 degrees
clearance=2; // freedom between two gear centers
backlash=2; // freedom between two gear contact points
axle_radius=20; // center hole radius in pixels
ring_margin=20;
pressure_angle = degrees_to_radians ( pressure_angle); // convet degrees to radians

function make_gear(number_of_teeth, internal, color) {
  // Draw an involute gear in your browswer using JavaScript and SVG
  // Tested on Internet Explorer 10 and Firefox 22

  // Adapted from: Public Domain Parametric Involute Spur Gear by Leemon Baird, 2011, Leemon@Leemon.com http://www.thingiverse.com/thing:5505

  // see also http://grabcad.com/questions/tutorial-how-to-model-involute-gears-in-solidworks-and-show-design-intent

  // point on involute curve
  function q6(b,s,t,d) { return polar(d,s*(iang(b,d)+t)); }

  // unwind this many degrees to go from r1 to r2
  function iang(r1,r2) { return Math.sqrt((r2/r1)*(r2/r1) - 1) - Math.acos(r1/r2); }

  // radius a fraction f up the curved side of the tooth 
  function q7(f,r,b,r2,t,s) { return q6(b,s,t,(1-f)*Math.max(b,r)+f*r2); }

  // rotate an array of 2d points
  function rotate ( points_array, angle ) {
    var answer =[];
    for(var i=0; i<points_array.length; i++) {
      var x=points_array[i][0];
      var y=points_array[i][1];
      var xr = x * Math.cos (angle) - y * Math.sin (angle);
      var yr = y * Math.cos (angle) + x * Math.sin (angle);
      answer.push( [xr,yr] );
    }
    return answer;
  }

  function pitch_radius ( number_of_teeth )
  {
    return mm_per_tooth * number_of_teeth / pi / 2;
  }

  // involute gear maker
  function build_gear ( number_of_teeth )
  {
    var p  = pitch_radius(number_of_teeth);            // radius of pitch circle
    var c  = p + mm_per_tooth / pi - clearance;        // radius of outer circle
    var b  = p * Math.cos(pressure_angle);             // radius of base circle
    var r  = p-(c-p)-clearance;                        // radius of root circle
    var t  = mm_per_tooth / 2-backlash / 2;            // tooth thickness at pitch circle
    var k  = -iang(b, p) - t/2/p;                      // angle where involute meets base circle on side of tooth

    // here is the magic - a set of [x,y] points to create a single gear tooth

    var points=[ polar(r, -pi/number_of_teeth), polar(r, r<b ? k : -pi/number_of_teeth),
             q7(0/5,r,b,c,k, 1), q7(1/5,r,b,c,k, 1), q7(2/5,r,b,c,k, 1), q7(3/5,r,b,c,k, 1), q7(4/5,r,b,c,k, 1), q7(5/5,r,b,c,k, 1),
             q7(5/5,r,b,c,k,-1), q7(4/5,r,b,c,k,-1), q7(3/5,r,b,c,k,-1), q7(2/5,r,b,c,k,-1), q7(1/5,r,b,c,k,-1), q7(0/5,r,b,c,k,-1),
             polar(r, r<b ? -k : pi/number_of_teeth), polar(r, pi/number_of_teeth) ];

    var answer = [];

    // create every gear tooth by rotating the first tooth

    for (var i=0; i<number_of_teeth; i++ ) answer = answer.concat (  rotate( points, -i*2*pi/number_of_teeth ) );

    return answer; // returns an array of [x,y] points
  }

  // create polygon using pointlist

  var gear1 = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  gear1.setAttribute("points", build_gear(number_of_teeth).toString());

  // add the new graphics to the document structure

  var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("stroke", "#000000");
  group.setAttribute("stroke-width", "2px");

  // create the axle circle in the center of the gear
  var axle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  var mark_radius;
  if (internal) {
    axle1.setAttribute("r", pitch_radius(number_of_teeth) + ring_margin);
    mark_radius = pitch_radius(number_of_teeth) + ring_margin / 2;

    gear1.setAttribute("fill", "#ffffff");
    axle1.setAttribute("fill", color);

    group.appendChild(axle1);
    group.appendChild(gear1);
  } else {
    axle1.setAttribute("r", Math.max(1, Math.min(axle_radius, pitch_radius(number_of_teeth) - 20)).toString());
    mark_radius = pitch_radius(number_of_teeth) - 10;

    axle1.setAttribute("fill", "#ffffff");
    gear1.setAttribute("fill", color);

    group.appendChild(gear1);
    group.appendChild(axle1);
  }

  var mark = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  mark.setAttribute("r", 2);
  mark.setAttribute("fill", "#000000");
  mark.setAttribute("transform", "rotate(90) translate(" + mark_radius + ")");
  group.appendChild(mark);

  group.changeTeeth = function(new_teeth) {
    gear1.setAttribute("points", build_gear(new_teeth).toString());
    var mark_radius;
    if (internal) {
      axle1.setAttribute("r", mm_per_tooth * new_teeth / pi / 2 + ring_margin);
      mark_radius = pitch_radius(new_teeth) + ring_margin / 2;
    } else {
      axle1.setAttribute("r", Math.max(1, Math.min(axle_radius, pitch_radius(new_teeth) - 20)).toString());
      mark_radius = pitch_radius(new_teeth) - 10;
    }
    mark.setAttribute("transform", "rotate(90) translate(" + mark_radius + ")");
  };
  
  return group;
}

function makeCarrier(points, radius) {
  radius *= points.length / 1.923;
  points.push(points[0]);
  var spec = "M" + points[0][0] + "," + points[0][1];
  for (var i = 1; i < points.length; ++i) {
    spec += " A" + radius + "," + radius;
    spec += " 0 0 1";
    spec += " " + points[i][0] + "," + points[i][1];
  }
  return spec;
}

// sun: carrier + ring = sun
// carrier: sun + ring = carrier
// ring: sun + carrier = ring
var gear2Mode = "sun"; 
var gear2SunSpeed = 0;
var gear2CarrierSpeed = 0;
var gear2RingSpeed = 0;

window.onload = function(){
  var S = 30, P = 23, R = 78;

  var numPlanets = 4;

  var sunAngle = 0;
  var carrierAngle = 0;
  var ringAngle = 0;

  var sunSpeed = 0;
  var carrierSpeed = 0;
  var ringSpeed = 0;

  var sun = make_gear(S, false, "#aaf");
  var planet = make_gear(P, false, "#f888");
  var ring = make_gear(R, true, "#55a");

  svg_height = parseInt(document.getElementById("psd_ani").style.height);
  svg_width = parseInt(document.getElementById("psd_ani").style.width);

  var anim = new Animation();

  var svg_image = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg_image.setAttribute("height", svg_height.toString());
  svg_image.setAttribute("width", svg_width.toString());
  svg_image.setAttribute("viewBox", -svg_width/2 + " " + -svg_height/2 + " " + svg_width + " " + svg_height);
  svg_image.setAttribute("preserveAspectRatio", "xMidYMid slice");

  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.appendChild(planet);
  planet.setAttribute("id", "planet");

  var carrier = document.createElementNS("http://www.w3.org/2000/svg", "path");
  carrier.setAttribute("stroke", "#888888");
  carrier.setAttribute("stroke-width", "2px");
  carrier.setAttribute("fill", "#dd5");

  svg_image.appendChild(defs);
  svg_image.appendChild(ring);
  svg_image.appendChild(carrier);
  svg_image.appendChild(sun);
  var planets = [];

  document.getElementById("psd_ani").appendChild(svg_image);

  updated = true;
  anim.setStage(function(){
    while(planets.length < numPlanets) {
      var p = document.createElementNS("http://www.w3.org/2000/svg", "use");
      p.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#planet");
      svg_image.appendChild(p);
      planets.push(p);
      updated = true;
    }
    while(planets.length > numPlanets) {
      svg_image.removeChild(planets.pop());
      updated = true;
    }

    if (gear2Mode === 'sun')
    {
      planetTeeth = P;//parseInt(document.getElementById("planetTeeth").value);
      ringTeeth = R;//parseInt(document.getElementById("ringTeeth").value);
      if ((planetTeeth !== P) || (ringTeeth !== R)) {
        sunTeeth = ringTeeth-2*planetTeeth;
        if (sunTeeth >= 4) {
          S = sunTeeth;
          P = planetTeeth;
          R = ringTeeth;
          sun.changeTeeth(S);
          planet.changeTeeth(P);
          ring.changeTeeth(R);
          updated = true;
        }
      }
      //document.getElementById("sunTeeth").value = S;

      carrierSpeed = gear2CarrierSpeed; //parseFloat(document.getElementById("carrierSpeed").value);
      ringSpeed = gear2RingSpeed; //parseFloat(document.getElementById("ringSpeed").value);
      sunSpeed = (S+R)/S * carrierSpeed - R/S * ringSpeed;
      //document.getElementById("sunSpeed").value = sunSpeed.toFixed(3);
    }
    else if (gear2Mode === 'carrier')
    {
      sunTeeth = S; //parseInt(document.getElementById("sunTeeth").value);
      ringTeeth = R; //parseInt(document.getElementById("ringTeeth").value);
      if ((sunTeeth !== S) || (ringTeeth !== R)) {
        planetTeeth = Math.floor((ringTeeth-sunTeeth)/2);
        if (planetTeeth >= 4) {
          S = sunTeeth;
          P = planetTeeth;
          R = ringTeeth;
          sun.changeTeeth(S);
          planet.changeTeeth(P);
          ring.changeTeeth(R);
          updated = true;
        }
      }
      //document.getElementById("planetTeeth").value = P;

      sunSpeed = gear2SunSpeed; //parseFloat(document.getElementById("sunSpeed").value);
      ringSpeed = gear2RingSpeed; //parseFloat(document.getElementById("ringSpeed").value);
      carrierSpeed = R/(S+R) * ringSpeed + S/(S+R) * sunSpeed;
      //document.getElementById("carrierSpeed").value = carrierSpeed.toFixed(3);
    }
    else if (gear2Mode === 'ring')
    {
      sunTeeth = S; //parseInt(document.getElementById("sunTeeth").value);
      planetTeeth = P; //parseInt(document.getElementById("planetTeeth").value);
      if ((sunTeeth !== S) || (planetTeeth !== P)) {
        ringTeeth = sunTeeth+2*planetTeeth;
        S = sunTeeth;
        P = planetTeeth;
        R = ringTeeth;
        sun.changeTeeth(S);
        planet.changeTeeth(P);
        ring.changeTeeth(R);
        updated = true;
      }
      //document.getElementById("ringTeeth").value = R;

      sunSpeed = gear2SunSpeed;// parseFloat(document.getElementById("sunSpeed").value);
      carrierSpeed = gear2CarrierSpeed; //parseFloat(document.getElementById("carrierSpeed").value);
      ringSpeed = (S+R)/R * carrierSpeed - S/R * sunSpeed;
      //document.getElementById("ringSpeed").value = ringSpeed.toFixed(3);
    }

    //document.getElementById("numPlanetsOut").value = numPlanets;

    //document.getElementById("sunSpeedOut").value = sunSpeed.toFixed(3);
    //document.getElementById("carrierSpeedOut").value = carrierSpeed.toFixed(3);
    //document.getElementById("ringSpeedOut").value = ringSpeed.toFixed(3);

    //document.getElementById("sunTeethOut").value = S;
    //document.getElementById("planetTeethOut").value = P;
    //document.getElementById("ringTeethOut").value = R;

    if ((sunSpeed === 0) && (carrierSpeed === 0) && (ringSpeed === 0) && !updated) {
      return;
    }

    var inc = 2 * Math.PI / 1000 * this.getTimeInterval();
    sunAngle += inc * sunSpeed;
    carrierAngle += inc * carrierSpeed;
    ringAngle += inc * ringSpeed;

    var carrierPoints = [];
    var planetOrbitRadius = (S+P)*mm_per_tooth/(2*pi);

    sun.setAttribute("transform", "rotate(" + (sunAngle - 90) + ")");
    ring.setAttribute("transform", "rotate(" + (ringAngle - 90 - (1-P%2)*180.0/R) + ")");
    for(var i=0; i < planets.length; ++i)
    {
      planetPosition = carrierAngle + 360*i/planets.length;
      planetAngle1 = S * (planetPosition - sunAngle);
      planetAngle = R * (ringAngle - planetPosition);
      carrierOffset = (planetAngle - planetAngle1) % 360;
      while(carrierOffset > 180) carrierOffset -= 360;
      while(carrierOffset < -180) carrierOffset += 360;
      carrierOffset /= (R+S);
      planetPosition += carrierOffset;
      //planetAngle = S/P * (planetPosition - sunAngle) + 90 + 180/P;
      planetAngle = R/P * (ringAngle - planetPosition) + 90 + 180/P;

      planets[i].setAttribute("transform", "rotate(" + planetPosition + ") translate(" + planetOrbitRadius + ") rotate(" + planetAngle + ")");

      var planetPositionRad = planetPosition * Math.PI/180;
      carrierPoints.push([planetOrbitRadius * Math.cos(planetPositionRad),
                          planetOrbitRadius * Math.sin(planetPositionRad)]);
    }
    carrier.setAttribute("d", makeCarrier(carrierPoints, planetOrbitRadius));

    updated = false;
  });

  anim.start();
};