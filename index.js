let particles = []; // Ein Array für alle Partikel

let baseSpeedTop = 0.75;
let baseSpeedMiddle = 0.5;
let baseSpeedBottom = 0.25;

let numParticles = 1500; // Erhöhe die Anzahl der Partikel für einen dichteren Effekt
let turbulenceFactor = 0.1; // Stärke der Turbulenzen
let lineLength = 40; // Länge der Striche

// Ball-Parameter
let ballDiameter = 100;
let ballX; // Wird später berechnet
let ballY; // Wird später berechnet
let ballColor = 0; // Startfarbe: Schwarz
let collisionTime = -1; // Zeitpunkt der ersten Kollision (-1 bedeutet keine Kollision)
const transitionDuration = 5000; // Dauer des gesamten Übergangs in Millisekunden
const midColor = 150; // Mittlere Farbe: Grau
const targetColor = 225; // Ziel-Hellgrau-Wert
let baseDistortionAmount = 1; // Startstärke der Verzerrung
let targetDistortionAmount = 7; // Zielstärke der Verzerrung
let distortionDetail = 10; // Feinheit der Verzerrung
let isDistorting = false; // Zustand, ob die Verzerrung aktiv ist

function setup() {
  createCanvas(600, 600);
  noStroke();

  // Berechnung der horizontalen Position (Mitte unten)
  ballX = width / 2;
  ballY = height * (2 / 3) + ballDiameter / 2; // Mittig unten

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

  let collisionDetected = false;
  let ballRadius = ballDiameter / 2;
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    // Überprüfe auf Überlappung mit dem Ball
    let distance = dist(p.x, p.y, ballX, ballY);
    if (distance < ballRadius) {
      collisionDetected = true;
      break; // Wir haben die erste Überlappung gefunden
    }
  }

  // Wenn die erste Kollision erkannt wurde
  if (collisionDetected && collisionTime === -1) {
    collisionTime = millis(); // Speichere den Zeitpunkt der Kollision
    isDistorting = true; // Aktiviere die Verzerrung
  }

  let currentDistortionAmount = 0;
  if (isDistorting && collisionTime !== -1) {
    let elapsedTime = millis() - collisionTime;
    let normalizedTime = constrain(elapsedTime / transitionDuration, 0, 1); // Wert zwischen 0 und 1
    currentDistortionAmount = lerp(baseDistortionAmount, targetDistortionAmount, normalizedTime);
  }

  // Zeichne den Ball mit oder ohne Verzerrung
  noStroke();
  if (isDistorting && currentDistortionAmount > 0) {
    fill(ballColor, 15); // Niedrige Transparenz für die einzelnen Verzerrungen
    for (let i = 0; i < distortionDetail; i++) {
      let offsetX = random(-currentDistortionAmount, currentDistortionAmount);
      let offsetY = random(-currentDistortionAmount, currentDistortionAmount);
      circle(ballX + offsetX, ballY + offsetY, ballDiameter);
    }
    fill(ballColor, 150); // Zeichne den Hauptball darüber
    circle(ballX, ballY, ballDiameter);
  } else {
    fill(ballColor, 150); // Zeichne den normalen Ball, wenn keine Verzerrung aktiv ist
    circle(ballX, ballY, ballDiameter);
  }

  // Berechne die aktuelle Farbe basierend auf der verstrichenen Zeit
  if (collisionTime !== -1) {
    let elapsedTime = millis() - collisionTime;
    let normalizedTime = constrain(elapsedTime / transitionDuration, 0, 1); // Wert zwischen 0 und 1

    if (normalizedTime < 0.5) {
      // Erste Hälfte der Zeit: von Schwarz zu Grau
      ballColor = lerp(0, midColor, normalizedTime * 2); // *2, da wir nur die halbe Zeit nutzen
    } else {
      // Zweite Hälfte der Zeit: von Grau zu Hellgrau
      ballColor = lerp(midColor, targetColor, (normalizedTime - 0.5) * 2); // *(normalizedTime - 0.5) und dann *2
    }
  }

  stroke(0);
  strokeWeight(6);

  // Zeichne die Partikel über dem Ball
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