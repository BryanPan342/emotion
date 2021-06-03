import p5 from 'p5';
import {
  INIT_PARTICLES_COUNT,
  INIT_SPEED,
  ACCEL,
} from '../../utils/constants';

export default function sketch(p: p5): void {
  let canvas: p5.Renderer;
  const particles: Particle[] = [];
  const max = 150;
  let BALL_RADIUS:number;

  let BOUNDARY_RADIUS:number;
  let BOUNDARY_X:number;
  let BOUNDARY_Y:number;
  const PINK: p5.Color = p.color(158, 34, 94);
  const HOT_PINK:p5.Color = p.color(184, 47, 170);

  p.setup = () => {
    canvas = p.createCanvas(window.innerWidth, window.innerHeight);
    canvas.id('p5-background');
    BALL_RADIUS = p.width / 100;
    BOUNDARY_RADIUS = p.width * 0.32;
    BOUNDARY_X= p.width * 0.4;
    BOUNDARY_Y = p.height * 0.7;
    // Setting mode to degrees for spawning particles in circle
    p.angleMode(p.DEGREES);
    p.background(0);
    // Initialize array
    // Max number of particles
    p.frameRate(30);

    for (let i = 0; i < INIT_PARTICLES_COUNT; i++) {
      particles.push(new Particle(p.random(p.width), p.random(p.height), p.random(0, 359), BALL_RADIUS, PINK));
    }
  };
  p.windowResized = () => {
    console.log("hello");
    p.resizeCanvas(window.innerWidth, window.innerHeight, true);
  };

  p.draw = () => {
    // Reset background
    p.background(0, 0, 0, 50);
    p.fill(HOT_PINK);

    p.ellipse(p.mouseX, p.mouseY, BALL_RADIUS*2, BALL_RADIUS*2);
    p.fill(PINK);
    p.ellipse(BOUNDARY_X, BOUNDARY_Y, BOUNDARY_RADIUS);

    // If too many particles on screen
    if (particles.length > max) {
      // Delete old particles (from beginning of array)
      particles.splice(0, 10);
    }

    // Loop through the array and show each particle
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].show();

    }
  };
  /** Spawn ringParticles in ring with centre mouse x and y coords */
  p.mouseClicked = () => {
    particles.push(new Particle(p.mouseX, p.mouseY, p.random(0, 359), BALL_RADIUS, HOT_PINK));
  };

  class Particle {
    public pos: p5.Vector;
    private _vel: p5.Vector;
    private _acc: p5.Vector;
    private _radius: number;
    public color:p5.Color;

    constructor(x: number, y: number, theta: number, radius: number, color: p5.Color) {
      this._radius = radius; // Radius
      this.pos = p.createVector(x, y); // Position
      this._vel = p.createVector(INIT_SPEED, INIT_SPEED); // Velocity
      this._acc = p.createVector(ACCEL, ACCEL); // Acceleration
      this.color = color;

      this._vel.limit(INIT_SPEED + 2);
      this._vel.rotate(theta); // Rotate velocity to the given rotation (avoids complicated maths)
      this._acc.rotate(theta); // Rotate to the given rotation (avoids complicated maths)
    }

    public update () {
      // this.vel.add(this.acc);

      this.pos.add(this._vel); // Update position with velocity
      this.edges(); // Check if hitting edge for rebound
      // this.acc.mult(0);
    }

    public show() {
      p.noStroke();
      // Set colour based on average of x and y position
      p.fill(this.color);
      // Draw point
      p.ellipse(this.pos.x, this.pos.y, this._radius);
    }

    public edges() {
      const x_dist = this.pos.x - BOUNDARY_X;
      const y_dist = this.pos.y - BOUNDARY_Y;

      // If hitting edge, invert appropriate velocity
      if (this.pos.x < 0 + this._radius) {
        // this.acc.add(createVector(ACCEL, ACCEL));

        this._acc.x *= -1;
        this._vel.x *= -1;
        this.pos.x = 0 + this._radius;
        this._vel.add(this._acc);
      } else if (this.pos.x > p.width - this._radius) {
        // this.acc.add(createVector(ACCEL, ACCEL));


        this._acc.x *= -1;
        this._vel.x *= -1;
        this.pos.x = p.width - this._radius;
        this._vel.add(this._acc);
      }
      if (this.pos.y < 0 + this._radius) {
        // this.acc.add(createVector(ACCEL, ACCEL));

        this._acc.y *= -1;
        this._vel.y *= -1;
        this.pos.y = 0 + this._radius;
        this._vel.add(this._acc);
      } else if (this.pos.y > p.height - this._radius) {
        // this.acc.add(createVector(ACCEL, ACCEL));

        this._acc.y *= -1;
        this._vel.y *= -1;
        this.pos.y = p.height - this._radius;
        this._vel.add(this._acc);
      } else if (p.sqrt(x_dist * x_dist + y_dist * y_dist) < BOUNDARY_RADIUS / 2) {
        this._vel.reflect(p.createVector(x_dist, y_dist));
      } else {
        if (
          p.sqrt(this._vel.x * this._vel.x + this._vel.y * this._vel.y) > INIT_SPEED
        ) {
          this._vel.limit(INIT_SPEED + 2);

        }
        // this.vel.add(this.decc);
      }
    }
  }
}
