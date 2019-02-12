/*jshint esversion: 6 */

let cw = 900;
let ch = 600;
let canvas1 = document.createElement("canvas");
canvas1.id = "canvas1";
canvas1.width = cw;
canvas1.height = ch;
let canvas2 = document.createElement("canvas");
canvas2.id = "canvas2";
canvas2.width = cw;
canvas2.height = ch;
document.getElementById("con").appendChild(canvas2);

let ctx1 = canvas1.getContext('2d');
ctx1.msImageSmoothingEnabled = true;
ctx1.imageSmoothingEnabled = true;

let ctx2 = canvas2.getContext('2d');
ctx2.msImageSmoothingEnabled = true;
ctx2.imageSmoothingEnabled = true;

let length = 200;
let frames = 1;

let wavelength = length / 2;
let amplitude = 40;
let frequency = 1;
let num = 2;
let skew = 0;
let rotation = 180;
let diffspacex = 0;
let diffspacey = 0;
let pointsize = 5;
let pointsizex = 0;
let pointsizey = 0;
let H = 180;
let S = 50;
let L = 0;

let sx = cw / 2;
let sy = ch / 2;

let clock = 0;
let scw;
let time = 0;
let objectArray = [];
let xs1 = [];
var coll = createPalette(length);
createIA(length);
animate();

let le = document.getElementById("length");
let nu = document.getElementById("number");
let wa = document.getElementById("wavelength");
let am = document.getElementById("amplitude");
let fr = document.getElementById("frequency");
let fm = document.getElementById("frames");
let dix = document.getElementById("diffrancex");
let diy = document.getElementById("diffrancey");
let ps = document.getElementById("pointsize");
let psx = document.getElementById("pointsizex");
let psy = document.getElementById("pointsizey");
let hue = document.getElementById("H");
let saturation = document.getElementById("S");
let light = document.getElementById("L");

let ro = document.getElementById("rotation");
let sk = document.getElementById("skew");

le.oninput = function() {
    length = parseInt(le.value);
    createIA(length);
    console.log(le.value);
};
nu.oninput = function() {
    num = parseInt(nu.value);
    console.log(nu.value);
};
wa.oninput = function() {
    wavelength = length / parseInt(wa.value);
    console.log(wa.value);
};
am.oninput = function() {
    amplitude = parseInt(am.value);
    console.log(am.value);
};
fr.oninput = function() {
    frequency = parseInt(fr.value);
    console.log(frequency);
};

dix.oninput = function() {
    diffspacex = parseInt(dix.value);
    console.log(diffspacex);
};
diy.oninput = function() {
    diffspacey = parseInt(diy.value);
    console.log(diffspacey);
};
ro.oninput = function() {
    rotation = parseInt(ro.value);
    console.log(ro.value);
};
sk.oninput = function() {
    skew = parseInt(sk.value);
    console.log(sk.value);
};
ps.oninput = function() {
    pointsize = parseInt(ps.value);
    console.log(ps.value);
};
psx.oninput = function() {
    pointsizex = parseInt(psx.value);
    console.log(psx.value);
};
psy.oninput = function() {
    pointsizey = parseInt(psy.value);
    console.log(psy.value);
};
hue.oninput = function() {
    H = parseInt(hue.value);
    console.log(hue.value);
};
saturation.oninput = function() {
    S = parseInt(saturation.value);
    console.log(saturation.value);
};
light.oninput = function() {
    L = parseInt(light.value);
    console.log(light.value);
};

function createIA(l) {
    xs1 = [];
    for (let i = 0; i < l; i++) {
        xs1.push(i);
    }
    coll = createPalette(length);
}// end createIA



function animate() {
    let points1 = xs1.map(x => {
        let nt, fn, frnt;
        if (frequency === 0) {
            nt = 0;
        } else {
            nt = time;
        }

        if (skew === 0) {
            scw = 0;
        } else if (skew < 0) {
            scw = x / (-8 + Math.abs(skew));
        } else if (skew > 0) {
            scw = (length - x) / (8 - skew);
        }

        if (frequency === 0) {
            frnt = nt;
        } else {
            if (frequency < 0) {
                fn = -21 + Math.abs(frequency);
            } else if (frequency > 0) {
                fn = 21 - frequency;
            }
            frnt = nt / fn;
        }
        let y = Math.sin((x / wavelength * (Math.PI * 2)) + frnt) * (scw + (amplitude + 0));
        return [x + sx + diffspacex, y + sy + diffspacey];
    });

    let points2 = xs1.map(x => {
        if (skew === 0) {
            scw = 0;
        } else if (skew < 0) {
            scw = x / (-8 + Math.abs(skew));
        } else if (skew > 0) {
            scw = (length - x) / (8 - skew);
        }

        let y = Math.sin((x / wavelength * (Math.PI * 2)) + time / frequency) * scw + (amplitude + 10);
        return [x + sx, y + sy];
    });

    ctx1.clearRect(0, 0, cw, ch);
    ctx1.fillStyle = 'hsl(' + H + ',' + S + '%,' + L + '%)';
    ctx1.fillRect(0, 0, cw, ch);

    let cx = cw / 2;
    let cy = ch / 2;
    let Angle = 360 / num;

    let rgba = hsl2rgb(H, S, L);
    for (let j = 0; j < 360; j += Angle) {
        ctx1.beginPath();
        for (let i = 0; i < points1.length; i++) {
            ctx1.fillStyle = coll[i];
            let s1 = convert(j + rotation, points1[i][0], points1[i][1], sx, sy);
            ctx1.fillRect(
                s1[0] - ((pointsize + pointsizex) / 2),
                s1[1] - ((pointsize + pointsizey) / 2),
                pointsize + pointsizex,
                pointsize + pointsizey
            );
        }
        ctx1.lineWidth = pointsize;
        ctx1.stroke();
    }

    let imgData = ctx1.getImageData(0, 0, cw, ch);
    ctx2.putImageData(imgData, 0, 0);

    let cool1 = coll.pop();
    let cool2 = coll.pop();
    let cool3 = coll.pop();
    let cool4 = coll.pop();
    coll.unshift(cool1);
    coll.unshift(cool2);
    coll.unshift(cool3);
    coll.unshift(cool4);
    time -= frames;
    requestAnimationFrame(animate);
}// end animate

function convert(ang, x, y, cx, cy) {
    return [
        cx + Math.cos(ang * Math.PI / 180) * (x - cx) - Math.sin(ang * Math.PI / 180) * (y - cy),
        cy + Math.sin(ang * Math.PI / 180) * (x - cx) + Math.cos(ang * Math.PI / 180) * (y - cy)
    ];
} //end convert

function createPalette(paletteLength) {
    let palette = [];
    for (let i = 0; i < paletteLength; i++) {
        let hue = i / paletteLength;
        palette[i] = makeSpectralColor(hue);
    }
    return palette;
} //end createPalette


//http://hsl2rgb.nichabi.com/javascript-function.php
function makeSpectralColor(hue) {
    let section = Math.floor(hue * 6);
    let fraction = hue * 6 - section;
    let rgb;
  	let r, g, b;
    switch (section) {
        case 0:
            r = 1;
            g = fraction;
            b = 0;
            break;
        case 1:
            r = 1 - fraction;
            g = 1;
            b = 0;
            break;
        case 2:
            r = 0;
            g = 1;
            b = fraction;
            break;
        case 3:
            r = 0;
            g = 1 - fraction;
            b = 1;
            break;
        case 4:
            r = fraction;
            g = 0;
            b = 1;
            break;
        case 5:
            r = 1;
            g = 0;
            b = 1 - fraction;
            break;
    }
    let rx = new Number(Math.floor(r * 255)).toString(16);
    if (rx.length === 1)
        rx = "0" + rx;
    let gx = new Number(Math.floor(g * 255)).toString(16);
    if (gx.length === 1)
        gx = "0" + gx;
    let bx = new Number(Math.floor(b * 255)).toString(16);
    if (bx.length === 1)
        bx = "0" + bx;
    let color = "#" + rx + gx + bx;
    return color;
} //end makeSpectralColor

function hsl2rgb(h, s, l) {
    let r, g, b, m, c, x;

    if (!isFinite(h)) h = 0;
    if (!isFinite(s)) s = 0;
    if (!isFinite(l)) l = 0;

    h /= 60;
    if (h < 0) h = 6 - (-h % 6);
    h %= 6;

    s = Math.max(0, Math.min(1, s / 100));
    l = Math.max(0, Math.min(1, l / 100));

    c = (1 - Math.abs((2 * l) - 1)) * s;
    x = c * (1 - Math.abs((h % 2) - 1));

    if (h < 1) {
        r = c;
        g = x;
        b = 0;
    } else if (h < 2) {
        r = x;
        g = c;
        b = 0;
    } else if (h < 3) {
        r = 0;
        g = c;
        b = x;
    } else if (h < 4) {
        r = 0;
        g = x;
        b = c;
    } else if (h < 5) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }

    m = l - c / 2;
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
} //end hsl2rgb
