let particles = []; // Ein Array für alle Partikel

let baseSpeedTop = 0.75;
let baseSpeedMiddle = 0.5;
let baseSpeedBottom = 0.25;

let numParticles = 1500; // Erhöhe die Anzahl der Partikel für einen dichteren Effekt
let turbulenceFactor = 0.1; // Stärke der Turbulenzen
let lineLength = 40; // Länge der Striche

// Silhouette-Parameter
let silhouetteHeight = 100;
let silhouetteWidth = 50;
let silhouetteX; // Wird später berechnet
let silhouetteY; // Wird später berechnet
let silhouetteColor = 0; // Startfarbe: Schwarz
let collisionTime = -1; // Zeitpunkt der ersten Kollision (-1 bedeutet keine Kollision)
const transitionDuration = 4000; // Dauer des gesamten Übergangs in Millisekunden
const midColor = 150; // Mittlere Farbe: Grau
const targetColor = 220; // Ziel-Hellgrau-Wert

function setup() {
  createCanvas(600, 600);
  noStroke();

  // Berechnung der horizontalen Position (Mitte)
  silhouetteX = width / 2 - silhouetteWidth / 2;

  // Berechnung der vertikalen Position (unteres Drittel)
  silhouetteY = height * (2 / 3) - silhouetteHeight / 2;

  for (let i = 0; i < numParticles; i++) {
    let y = random(height);
    let speed;
    let alphaValue = random(1, 3);

    if (y < height / 3) {
      speed = lerp(baseSpeedTop, baseSpeedMiddle, y / (height / 3));
    } else if (y < 2 * height / 3) {
      speed = lerp(baseSpeedMiddle, baseSpeedBottom, (y - height / 3) / (height / 3));
    } else {
      speed = baseSpeedBottom;
    }

    let densityFactor = map(y, 0, height, 1, 0.3);
    if (random(1) < densityFactor) {
      particles.push({
        x: random(width) - width,
        y: y,
        alpha: alphaValue,
        speed: speed,
        yVelocity: 0
      });
    }
  }
  console.log("Anzahl der Partikel:", particles.length);
}

function draw() {
  background(255, 10);

  // Deaktiviere die Umrandung für das Rechteck
  noStroke();

  // Zeichne die Silhouette im Hintergrund
  fill(silhouetteColor, 150);
  rect(silhouetteX, silhouetteY, silhouetteWidth, silhouetteHeight);

  let collisionDetected = false;
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    // Überprüfe auf Überlappung
    if (p.x > silhouetteX && p.x < silhouetteX + silhouetteWidth &&
        p.y > silhouetteY && p.y < silhouetteY + silhouetteHeight) {
      collisionDetected = true;
      break; // Wir haben die erste Überlappung gefunden
    }
  }

  // Wenn die erste Kollision erkannt wurde
  if (collisionDetected && collisionTime === -1) {
    collisionTime = millis(); // Speichere den Zeitpunkt der Kollision
  }

  // Berechne die aktuelle Farbe basierend auf der verstrichenen Zeit
  if (collisionTime !== -1) {
    let elapsedTime = millis() - collisionTime;
    let normalizedTime = constrain(elapsedTime / transitionDuration, 0, 1); // Wert zwischen 0 und 1

    if (normalizedTime < 0.5) {
      // Erste Hälfte der Zeit: von Schwarz zu Grau
      silhouetteColor = lerp(0, midColor, normalizedTime * 2); // *2, da wir nur die halbe Zeit nutzen
    } else {
      // Zweite Hälfte der Zeit: von Grau zu Hellgrau
      silhouetteColor = lerp(midColor, targetColor, (normalizedTime - 0.5) * 2); // *(normalizedTime - 0.5) und dann *2
    }
  }

  // Aktiviere die Umrandung für die Partikel
  stroke(0);
  strokeWeight(6);

  // Zeichne die Partikel über der Silhouette
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    stroke(p.y / 10, p.alpha);
    line(p.x, p.y, p.x + lineLength, p.y);

    p.x += p.speed + noise(p.x * 0.1, frameCount * 0.01) * 0.5;
    p.yVelocity += random(-turbulenceFactor, turbulenceFactor);
    p.y += p.yVelocity;
    p.yVelocity *= 0.85;

    if (p.x > width + lineLength / 2) {
      p.x = -lineLength / 2;
    }
  }
}