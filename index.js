

let particles = []; // Ein Array für alle Partikel

let baseSpeedTop = 1;
let baseSpeedMiddle = 0.75;
let baseSpeedBottom = 0.5;

let numParticles = 1500; // Erhöhe die Anzahl der Partikel für einen dichteren Effekt

function setup() {
  createCanvas(600, 500);
  noStroke();

  for (let i = 0; i < numParticles; i++) {
    let y = random(height);
    let speed;
    let alphaValue = random(150, 210);
    let sizeValue = random(2, 5);

    // Sanfter Übergang der Geschwindigkeit basierend auf der y-Position
    if (y < height / 3) {
      speed = lerp(baseSpeedTop, baseSpeedMiddle, y / (height / 3));
    } else if (y < 2 * height / 3) {
      speed = lerp(baseSpeedMiddle, baseSpeedBottom, (y - height / 3) / (height / 3));
    } else {
      speed = baseSpeedBottom;
    }

    // Beeinflusse die Wahrscheinlichkeit der Partikelverteilung
    let densityFactor = map(y, 0, height, 1, 0.3); // Linearer Abfall der Dichte von oben nach unten
    if (random(1) < densityFactor) {
      particles.push({
        x: random(width),
        y: y,
        size: 2,
        alpha: alphaValue,
        speed: speed
      });
    }
  }
  console.log("Anzahl der Partikel:", particles.length); // Gib die tatsächliche Anzahl der erzeugten Partikel aus
}


function draw() {
  background(255); // Weißer Hintergrund bleibt

  fill(0); // Graue Farbe für alle Partikel
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    fill(0, p.alpha); // Verwende die individuelle Alpha-Komponente
    ellipse(p.x, p.y, p.size, p.size);
    p.x += p.speed;
    if (p.x > width + p.size / 2) {
      p.x = -p.size / 2;
    }
  }
}

