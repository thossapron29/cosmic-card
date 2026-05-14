import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = join(process.cwd(), "public/assets/cosmic");
mkdirSync(outputDir, { recursive: true });

function rgba(r, g, b, a = 255) {
  return [r, g, b, a];
}

function hex(value, alpha = 255) {
  const clean = value.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : clean;

  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
    alpha,
  ];
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function mixColor(colorA, colorB, t) {
  return [
    Math.round(mix(colorA[0], colorB[0], t)),
    Math.round(mix(colorA[1], colorB[1], t)),
    Math.round(mix(colorA[2], colorB[2], t)),
    Math.round(mix(colorA[3], colorB[3], t)),
  ];
}

function createCanvas(width, height) {
  return {
    width,
    height,
    pixels: new Uint8Array(width * height * 4),
  };
}

function blendPixel(canvas, x, y, color) {
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
    return;
  }

  const index = (y * canvas.width + x) * 4;
  const srcAlpha = color[3] / 255;
  const dstAlpha = canvas.pixels[index + 3] / 255;
  const outAlpha = srcAlpha + dstAlpha * (1 - srcAlpha);

  if (outAlpha <= 0) {
    return;
  }

  canvas.pixels[index] = Math.round(
    (color[0] * srcAlpha + canvas.pixels[index] * dstAlpha * (1 - srcAlpha)) /
      outAlpha,
  );
  canvas.pixels[index + 1] = Math.round(
    (color[1] * srcAlpha +
      canvas.pixels[index + 1] * dstAlpha * (1 - srcAlpha)) /
      outAlpha,
  );
  canvas.pixels[index + 2] = Math.round(
    (color[2] * srcAlpha +
      canvas.pixels[index + 2] * dstAlpha * (1 - srcAlpha)) /
      outAlpha,
  );
  canvas.pixels[index + 3] = Math.round(outAlpha * 255);
}

function fill(canvas, color) {
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      blendPixel(canvas, x, y, color);
    }
  }
}

function drawRadialGradient(canvas, cx, cy, radius, innerColor, outerColor) {
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(canvas.width - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(canvas.height - 1, Math.ceil(cy + radius));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const distance = Math.hypot(x - cx, y - cy);
      const t = Math.min(1, distance / radius);
      blendPixel(canvas, x, y, mixColor(innerColor, outerColor, t));
    }
  }
}

function fillCircle(canvas, cx, cy, radius, color) {
  const minX = Math.floor(cx - radius);
  const maxX = Math.ceil(cx + radius);
  const minY = Math.floor(cy - radius);
  const maxY = Math.ceil(cy + radius);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (Math.hypot(x - cx, y - cy) <= radius) {
        blendPixel(canvas, x, y, color);
      }
    }
  }
}

function fillEllipse(canvas, cx, cy, rx, ry, color) {
  const minX = Math.floor(cx - rx);
  const maxX = Math.ceil(cx + rx);
  const minY = Math.floor(cy - ry);
  const maxY = Math.ceil(cy + ry);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) {
        blendPixel(canvas, x, y, color);
      }
    }
  }
}

function isInsideRoundedRect(localX, localY, width, height, radius) {
  const nearestX = Math.max(radius, Math.min(localX, width - radius));
  const nearestY = Math.max(radius, Math.min(localY, height - radius));
  const dx = localX - nearestX;
  const dy = localY - nearestY;
  return dx * dx + dy * dy <= radius * radius;
}

function fillRotatedRoundedRect(
  canvas,
  cx,
  cy,
  width,
  height,
  radius,
  angle,
  colorTop,
  colorBottom = colorTop,
) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const halfW = width / 2;
  const halfH = height / 2;
  const bound = Math.ceil(Math.hypot(halfW, halfH));

  for (let y = cy - bound; y <= cy + bound; y += 1) {
    for (let x = cx - bound; x <= cx + bound; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const localX = dx * cos + dy * sin + halfW;
      const localY = -dx * sin + dy * cos + halfH;

      if (
        localX >= 0 &&
        localX <= width &&
        localY >= 0 &&
        localY <= height &&
        isInsideRoundedRect(localX, localY, width, height, radius)
      ) {
        const t = Math.max(0, Math.min(1, localY / height));
        blendPixel(canvas, x, y, mixColor(colorTop, colorBottom, t));
      }
    }
  }
}

function strokeRotatedRoundedRect(
  canvas,
  cx,
  cy,
  width,
  height,
  radius,
  angle,
  thickness,
  color,
) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const halfW = width / 2;
  const halfH = height / 2;
  const bound = Math.ceil(Math.hypot(halfW, halfH));

  for (let y = cy - bound; y <= cy + bound; y += 1) {
    for (let x = cx - bound; x <= cx + bound; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const localX = dx * cos + dy * sin + halfW;
      const localY = -dx * sin + dy * cos + halfH;

      if (
        localX >= 0 &&
        localX <= width &&
        localY >= 0 &&
        localY <= height &&
        isInsideRoundedRect(localX, localY, width, height, radius) &&
        !isInsideRoundedRect(
          localX - thickness,
          localY - thickness,
          width - thickness * 2,
          height - thickness * 2,
          Math.max(0, radius - thickness),
        )
      ) {
        blendPixel(canvas, x, y, color);
      }
    }
  }
}

function fillPolygon(canvas, points, color) {
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  const minX = Math.floor(Math.min(...xs));
  const maxX = Math.ceil(Math.max(...xs));
  const minY = Math.floor(Math.min(...ys));
  const maxY = Math.ceil(Math.max(...ys));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      let inside = false;

      for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
        const xi = points[i][0];
        const yi = points[i][1];
        const xj = points[j][0];
        const yj = points[j][1];

        const intersect =
          yi > y !== yj > y &&
          x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;

        if (intersect) inside = !inside;
      }

      if (inside) {
        blendPixel(canvas, x, y, color);
      }
    }
  }
}

function drawLine(canvas, x1, y1, x2, y2, thickness, color) {
  const minX = Math.floor(Math.min(x1, x2) - thickness);
  const maxX = Math.ceil(Math.max(x1, x2) + thickness);
  const minY = Math.floor(Math.min(y1, y2) - thickness);
  const maxY = Math.ceil(Math.max(y1, y2) + thickness);
  const lengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      let t = 0;
      if (lengthSquared > 0) {
        t =
          ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / lengthSquared;
      }
      t = Math.max(0, Math.min(1, t));
      const nearestX = x1 + (x2 - x1) * t;
      const nearestY = y1 + (y2 - y1) * t;
      if (Math.hypot(x - nearestX, y - nearestY) <= thickness / 2) {
        blendPixel(canvas, x, y, color);
      }
    }
  }
}

function makeStarPoints(cx, cy, outerRadius, innerRadius, spikes = 5) {
  const points = [];
  const step = Math.PI / spikes;

  for (let i = 0; i < spikes * 2; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + i * step;
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }

  return points;
}

function fillHeart(canvas, cx, cy, scale, color) {
  const minX = Math.floor(cx - scale * 1.4);
  const maxX = Math.ceil(cx + scale * 1.4);
  const minY = Math.floor(cy - scale * 1.2);
  const maxY = Math.ceil(cy + scale * 1.4);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const nx = (x - cx) / scale;
      const ny = (y - cy) / scale;
      const value = (nx * nx + ny * ny - 1) ** 3 - nx * nx * ny * ny * ny;

      if (value <= 0) {
        blendPixel(canvas, x, y, color);
      }
    }
  }
}

function drawSmile(canvas, cx, cy, radius, thickness, color) {
  for (let angle = 0.25; angle <= Math.PI - 0.25; angle += 0.01) {
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius * 0.72;
    fillCircle(canvas, x, y, thickness / 2, color);
  }
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function writePng(filePath, canvas) {
  const raw = Buffer.alloc((canvas.width * 4 + 1) * canvas.height);

  for (let y = 0; y < canvas.height; y += 1) {
    const rowOffset = y * (canvas.width * 4 + 1);
    raw[rowOffset] = 0;
    for (let x = 0; x < canvas.width; x += 1) {
      const pixelIndex = (y * canvas.width + x) * 4;
      const target = rowOffset + 1 + x * 4;
      raw[target] = canvas.pixels[pixelIndex];
      raw[target + 1] = canvas.pixels[pixelIndex + 1];
      raw[target + 2] = canvas.pixels[pixelIndex + 2];
      raw[target + 3] = canvas.pixels[pixelIndex + 3];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(canvas.width, 0);
  ihdr.writeUInt32BE(canvas.height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);

  writeFileSync(filePath, png);
}

function drawAvatar() {
  const canvas = createCanvas(512, 512);
  drawRadialGradient(
    canvas,
    256,
    180,
    360,
    hex("#fff7ef"),
    hex("#c5b5ff"),
  );
  fillCircle(canvas, 256, 256, 228, rgba(255, 255, 255, 118));
  fillEllipse(canvas, 256, 392, 116, 76, hex("#f7ebe6"));
  fillCircle(canvas, 256, 248, 96, hex("#f4cbb9"));
  fillCircle(canvas, 256, 170, 108, hex("#3c251c"));
  fillCircle(canvas, 188, 150, 42, hex("#3c251c"));
  fillCircle(canvas, 324, 148, 44, hex("#3c251c"));
  fillEllipse(canvas, 256, 184, 110, 96, hex("#4c3024"));
  fillCircle(canvas, 256, 244, 92, hex("#f8d7c4"));
  fillCircle(canvas, 220, 236, 10, hex("#30211f"));
  fillCircle(canvas, 292, 236, 10, hex("#30211f"));
  fillCircle(canvas, 216, 232, 3, rgba(255, 255, 255, 210));
  fillCircle(canvas, 288, 232, 3, rgba(255, 255, 255, 210));
  fillEllipse(canvas, 196, 274, 16, 10, rgba(247, 170, 180, 120));
  fillEllipse(canvas, 316, 274, 16, 10, rgba(247, 170, 180, 120));
  drawSmile(canvas, 256, 284, 20, 8, hex("#c96a7c"));
  drawLine(canvas, 214, 206, 238, 198, 8, rgba(75, 46, 39, 200));
  drawLine(canvas, 278, 198, 302, 206, 8, rgba(75, 46, 39, 200));
  drawLine(canvas, 214, 365, 244, 330, 30, hex("#fff5f2"));
  drawLine(canvas, 298, 330, 326, 365, 30, hex("#fff5f2"));
  return canvas;
}

function drawCardStack() {
  const canvas = createCanvas(640, 760);
  fill(canvas, rgba(0, 0, 0, 0));
  drawRadialGradient(canvas, 220, 520, 180, rgba(47, 23, 122, 88), rgba(47, 23, 122, 0));
  const top = hex("#b073ff");
  const bottom = hex("#5c31dd");
  const border = hex("#ffd48c", 220);

  fillRotatedRoundedRect(canvas, 420, 410, 230, 390, 32, 0.36, top, bottom);
  strokeRotatedRoundedRect(canvas, 420, 410, 230, 390, 32, 0.36, 6, border);
  fillRotatedRoundedRect(canvas, 376, 362, 250, 420, 34, 0.24, top, bottom);
  strokeRotatedRoundedRect(canvas, 376, 362, 250, 420, 34, 0.24, 6, border);
  fillRotatedRoundedRect(canvas, 334, 330, 270, 448, 36, 0.14, top, bottom);
  strokeRotatedRoundedRect(canvas, 334, 330, 270, 448, 36, 0.14, 6, border);
  fillRotatedRoundedRect(canvas, 292, 302, 292, 478, 38, 0.08, top, bottom);
  strokeRotatedRoundedRect(canvas, 292, 302, 292, 478, 38, 0.08, 6, border);

  strokeRotatedRoundedRect(
    canvas,
    292,
    302,
    244,
    430,
    28,
    0.08,
    2,
    rgba(255, 222, 164, 180),
  );

  const starPoints = makeStarPoints(294, 302, 72, 28, 8);
  fillPolygon(canvas, starPoints, rgba(255, 252, 243, 250));
  fillEllipse(canvas, 294, 302, 98, 145, rgba(255, 219, 170, 0));
  for (const point of [
    [220, 206],
    [260, 170],
    [344, 182],
    [380, 256],
    [210, 396],
    [364, 420],
    [290, 116],
    [292, 490],
  ]) {
    fillCircle(canvas, point[0], point[1], 3, rgba(255, 241, 187, 220));
  }

  return canvas;
}

function drawCloudMascot() {
  const canvas = createCanvas(360, 300);
  fill(canvas, rgba(0, 0, 0, 0));
  drawRadialGradient(canvas, 180, 220, 120, rgba(160, 124, 244, 70), rgba(160, 124, 244, 0));
  const body = hex("#d7c0ff");
  const bodyDark = hex("#bc9bf8");
  fillCircle(canvas, 118, 138, 62, body);
  fillCircle(canvas, 190, 110, 76, body);
  fillCircle(canvas, 258, 142, 62, body);
  fillCircle(canvas, 192, 184, 86, bodyDark);
  fillCircle(canvas, 126, 188, 50, bodyDark);
  fillCircle(canvas, 252, 190, 50, bodyDark);
  fillCircle(canvas, 160, 170, 8, hex("#24253e"));
  fillCircle(canvas, 226, 170, 8, hex("#24253e"));
  fillCircle(canvas, 158, 167, 2, rgba(255, 255, 255, 210));
  fillCircle(canvas, 224, 167, 2, rgba(255, 255, 255, 210));
  fillEllipse(canvas, 136, 194, 12, 8, rgba(255, 177, 202, 140));
  fillEllipse(canvas, 248, 194, 12, 8, rgba(255, 177, 202, 140));
  drawSmile(canvas, 192, 196, 18, 7, hex("#2a2c48"));
  return canvas;
}

function drawStarCloud() {
  const canvas = createCanvas(380, 300);
  fill(canvas, rgba(0, 0, 0, 0));
  drawRadialGradient(canvas, 220, 220, 110, rgba(255, 205, 103, 55), rgba(255, 205, 103, 0));
  const star = makeStarPoints(216, 122, 82, 34, 5);
  fillPolygon(canvas, star, hex("#ffd56b"));
  fillCircle(canvas, 188, 138, 8, hex("#252949"));
  fillCircle(canvas, 238, 138, 8, hex("#252949"));
  fillCircle(canvas, 186, 136, 2, rgba(255, 255, 255, 210));
  fillCircle(canvas, 236, 136, 2, rgba(255, 255, 255, 210));
  fillEllipse(canvas, 170, 162, 10, 7, rgba(255, 181, 196, 160));
  fillEllipse(canvas, 254, 162, 10, 7, rgba(255, 181, 196, 160));
  drawSmile(canvas, 214, 168, 16, 7, hex("#2a2c48"));
  const cloud = hex("#f7f1fb");
  fillCircle(canvas, 122, 248, 34, cloud);
  fillCircle(canvas, 182, 230, 46, cloud);
  fillCircle(canvas, 244, 242, 38, cloud);
  fillCircle(canvas, 294, 252, 28, cloud);
  fillEllipse(canvas, 210, 258, 132, 54, cloud);
  return canvas;
}

function drawQuoteHeart() {
  const canvas = createCanvas(280, 220);
  fill(canvas, rgba(0, 0, 0, 0));
  drawRadialGradient(canvas, 140, 118, 110, rgba(255, 139, 186, 50), rgba(255, 139, 186, 0));
  fillHeart(canvas, 140, 118, 54, hex("#ff76aa"));
  fillCircle(canvas, 48, 82, 5, rgba(255, 198, 225, 210));
  fillCircle(canvas, 228, 70, 4, rgba(255, 198, 225, 210));
  fillCircle(canvas, 220, 164, 5, rgba(255, 198, 225, 210));
  fillPolygon(canvas, makeStarPoints(236, 120, 10, 4, 4), rgba(255, 233, 242, 235));
  fillPolygon(canvas, makeStarPoints(58, 164, 9, 4, 4), rgba(255, 233, 242, 235));
  return canvas;
}

const assets = [
  ["avatar-orion.png", drawAvatar()],
  ["card-stack.png", drawCardStack()],
  ["cloud-mascot.png", drawCloudMascot()],
  ["star-cloud.png", drawStarCloud()],
  ["quote-heart.png", drawQuoteHeart()],
];

for (const [fileName, canvas] of assets) {
  writePng(join(outputDir, fileName), canvas);
}

console.log(`Generated ${assets.length} PNG placeholder assets in ${outputDir}`);
