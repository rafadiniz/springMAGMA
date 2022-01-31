
let physics;

let points;

let particles = [];
let springs = [];
let attractor;

let posx = [];
let posy = [];

let posx2 = [];
let posy2 = [];

let velx = [];
let vely = [];

let t = 0;

let pSize;

let mCount = 0;
let mAtx;
let mAty;

let pg;

function preload() {
  points = loadTable("data/pointsMagma.csv", "csv", "header");
}

function setup() {
  createCanvas(1280, 720, WEBGL);

  frameRate(24);

  for (let i = 0; i < points.getRowCount(); i++) {

    x = points.get(i, 'x');
    y = points.get(i, 'y');

    //posx[i] = x * 0.6;
    //posy[i] = y * 0.6;

    posx2[i] = x * 0.6;
    posy2[i] = y * 0.6;

    velx[i] = 3;
    vely[i] = 2;
  }

  // inicializa a física
  physics = new VerletPhysics2D();
  physics.setDrag(0.2);


  for (let i = 0; i < points.getRowCount(); i++) {
    particles.push(new Particle(new Vec2D(0, 0), 0, 0, 0));

    particles[i].x = posx2[i];
    particles[i].y = posy2[i];
  }

  attractor = new Particle(new Vec2D(0, 0), 200, 50, -20);
  attractor.lock();


  for (let i = 0; i < points.getRowCount(); i++) {
    let spring1 = new VerletSpring2D(particles[i], particles[(i + 1) % particles.length], -20, 0.001);
    springs.push(spring1);
    physics.addSpring(spring1);
    if (i % 5 == 0) {
      let spring2 = new VerletSpring2D(particles[i], particles[(i + 25) % particles.length], 400, 0.00001);
      springs.push(spring2);
      physics.addSpring(spring2);
    }
    if ((i + 5) % 10 == 0) {
      let spring2 = new VerletSpring2D(particles[i], attractor, 1, 0.0001);
      springs.push(spring2);
      physics.addSpring(spring2);
    }
  }

  //pSize = particles.length;
}

function draw() {

  t += 0.01;

  seconds = millis() / 10000;
 
  physics.update();

  background(241);
  stroke(255);
  fill(255, 20);


  beginShape();
  for (let i = 0; i < points.getRowCount(); i++) {
    //interação do mouse com os pontos
    if (mouseIsPressed) {

      attractor.unlock(); 
      attractor.set(new Vec2D(mouseX-width/2, mouseY-height/2));


      //particles[i].x += map(noise(particles[i].x*0.01+t),0,1,-1,1)*4;
      //particles[i].y += map(noise(i*0.017+t),0,1,-1,1)*4;

      //if (dist(particles[i].x, particles[i].y, (mouseX-width/2)+cos(i*0.1)*10, (mouseY-height/2)+sin(i*0.1)*10) < 50) {
      //  if (mouseX - width / 2 > particles[i].x) {
      //    particles[i].x -= noise(particles[i].x*0.01)*100;
      //  } else {
      //    particles[i].x += noise(particles[i].x*0.01)*100;
      //  }
      //  if (mouseY - height / 2 > particles[i].y) {
      //    particles[i].y -= noise(particles[i].y*0.01)*100;
      //  } else {
      //    particles[i].y += noise(particles[i].y*0.01)*100;
      //  }
      //}
    } else {


      //INTERPOLAÇÃO DE ARRAYS
      //obtendo a diferença e testando
      if (particles[i].x - posx2[i] > 0) {
        //se a diferença for maior que 0 a posição 1 decrementa
        particles[i].x -= velx[i];
        //quando a posição 1 decresce até a posição 2, permanece nesta
        if (particles[i].x <= posx2[i]) {
          particles[i].x = posx2[i];
        }
      } else {
        //se a diferença for menor que 0 a posição 1 incrementa
        particles[i].x += velx[i];
        //quando a posição 1 alcança a posição 2, permanece nesta
        if (particles[i].x >= posx2[i]) {
          particles[i].x = posx2[i];
        }
      }
      if (particles[i].y - posy2[i] > 0) {
        particles[i].y -= vely[i];
        if (particles[i].y <= posy2[i]) {
          particles[i].y = posy2[i];
        }
      } else {
        particles[i].y += vely[i];
        if (particles[i].y >= posy2[i]) {

          particles[i].y = posy2[i];
        }
      }

      attractor.lock();
    }


    stroke(0, 150);
    fill(127 + tan(posy2[i] * 1.7 + t) * 127);
    //noFill();
    vertex(particles[i].x, particles[i].y);

  }
  endShape();


  //for (let i = 0; i < pSize; i++) {


  //  stroke(240, 10);
  //  line(springs[i].a.x, springs[i].a.y, springs[i].b.x, springs[i].b.y);
  //}
}
