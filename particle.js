
class Particle extends VerletParticle2D {
  constructor(position, radius, range, strength) {
    super(position);
    this.r = radius;
    physics.addParticle(this);

    this.behavior = new AttractionBehavior(this, range, strength);
    physics.addBehavior(this.behavior);

  }

}
