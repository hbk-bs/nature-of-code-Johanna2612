

let particles = []; // Ein Array für alle Partikel

let baseSpeedTop = 1;
let baseSpeedMiddle = 0.75;
let baseSpeedBottom = 0.5;

let numParticles = 1400; // Erhöhe die Anzahl der Partikel für einen dichteren Effekt
let turbulenceFactor = 0.1; // Stärke der Turbulenzen

function setup() {
  createCanvas(600, 600);
  noStroke();

  for (let i = 0; i < numParticles; i++) {
    let y = random(height);
    let speed;
    let alphaValue = random(1, 4);
    let sizeValue = random(1, 2);

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
        x: random(width) - width,
        y: y,
        size: 2.5 + random(5, 20),
        alpha: alphaValue,
        speed: speed,
        yVelocity: 0 // Starte mit einer vertikalen Geschwindigkeit von Null
      });
    }
  }
  console.log("Anzahl der Partikel:", particles.length); // Gib die tatsächliche Anzahl der erzeugten Partikel aus
}

function draw() {
  background(255, 10); // Weißer Hintergrund bleibt

  fill(0); // Graue Farbe für alle Partikel
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    fill(p.y / 10, p.alpha); // Verwende die individuelle Alpha-Komponente
    ellipse(p.x, p.y, p.size, p.size);
    p.x += p.speed + noise(p.x * 0.1, frameCount * 0.01) * 0.5; // Füge Rauschen für subtile horizontale Variation hinzu
    p.yVelocity += random(-turbulenceFactor, turbulenceFactor); // Zufällige vertikale Beschleunigung (Turbulenz)
    p.y += p.yVelocity; // Anwenden der vertikalen Geschwindigkeit
    p.yVelocity *= 0.85; // Langsames Abbremsen der vertikalen Geschwindigkeit, um ein zu starkes Auf und Ab zu verhindern

    // Begrenzung der vertikalen Bewegung, falls gewünscht
    if (p.y < 0) {
       p.y = 0;
      p.yVelocity *= -0.8; // Abprallen oder Umkehren
     } else if (p.y > height) {
      p.y = height;
       p.yVelocity *= -0.8; // Abprallen oder Umkehren
     }

    if (p.x > width + p.size / 2) {
      p.x = -p.size / 2;
    }
  }
}