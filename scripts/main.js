'use strict';

const canvas = document.querySelector('.graph canvas');
const ctx = canvas.getContext('2d');
const xMin = -100, xMax = 100;
const yMin = -100, yMax = 100;

const clusterColors = [
    'rgb(238,5,7)',
    'rgb( 55, 126, 184)',
    'rgb( 77, 175,  74)',
    'rgb(152,  78, 163)',
    'rgb(255, 127,   0)',
    'rgb(255, 255,  51)',
    'rgb(166,  86,  40)',
];

const points = [];

let gmm = null;

let point;

function generateGroup() {

    // TODO: random radius..
    let a = 10 + Math.random() * 40;
    let b = 10 + Math.random() * 40;

    let centerX = 100 - Math.random() * 200;
    let centerY = 100 - Math.random() * 200;

    for (let i = 0; i < 100; ++i) {

        let r = a * Math.random();
        let fi = 2 * Math.PI * Math.random();
        let x = centerX + r * Math.cos(fi);
        let y = centerY + b / a * r * Math.sin(fi);

        points.push([x, y]);
    }

}

function generatePoints() {
    for (let i = 0; i < 2 + Math.random() * 7; ++i) {
        generateGroup();
    }
}

generatePoints();

canvas.addEventListener('click', function (e) {
    let w = canvas.width;
    let h = canvas.height;

    let p = [e.offsetX / w * (xMax - xMin) + xMin, e.offsetY / h * (yMax - yMin) + yMin];

    point = points.filter(point => p[0] - 2 <= point[0] && point[0] <= p[0] + 2 && p[1] - 2 <= point[1] && point[1] <= p[1] + 2)[0];
    probability();


    // let sel = document.getElementById('number-of-points');
    // let n = Number(sel.options[sel.selectedIndex].text);  // number of points
    //
    // if (n === 1) {
    //     points.push(p);
    //     if (gmm) gmm.addPoint(p);
    // } else for (let i = 0; i < n; i++) {
    //     let alpha = Math.random() * 2 * Math.PI / n + i / n * 2 * Math.PI;
    //     let r = Math.random() * (xMax - xMin) * .04;
    //     let q = [p[0] + r * Math.cos(alpha), p[1] + r * Math.sin(alpha)];
    //     points.push(q);
    //     if (gmm) gmm.addPoint(q);
    // }

    redraw();
});


function probability() {
    if(!point&&gmm) {
        for (let i = 0; i < gmm.clusters; ++i) {
            let div = document.getElementById("cluster-" + i);
            let r = div.querySelector(".resp-"+i);
            r.style.display = "none";
        }
    }

    if (point&&gmm) {
        for (let i = 0; i < gmm.clusters; ++i) {
            let div = document.getElementById("cluster-" + i);
            let r = div.querySelector(".resp-"+i);
            r.style.display = "";
            r.textContent = "probability "+gmm.cResps[i][points.indexOf(point)].toFixed(2);
        }
    }
}

// function isInsideEllipse(h, k, x, y, a, b, theta) {
//     return (Math.pow(Math.cos(theta) * (x - h) + Math.sin(theta) * (y - k), 2) / Math.pow(a, 2)) +
//         (Math.pow(Math.sin(theta) * (x - h) - Math.cos(theta) * (y - k), 2) / Math.pow(b, 2));
// }
// function isPoint(el, p) {
//     if (el[0] <= p[0] + 2 && el[0] >= p[0] - 2) {
//         if (el[1] <= p[1] + 2 && el[1] >= p[1] - 2) {
//
//             return true;
//         }
//     }
//     return false;
// }
// canvas.onmousemove = e => {
//     let p = [e.offsetX, e.offsetY];
//     let w = canvas.width;
//     let h = canvas.height;
//     let p2 = [e.offsetX / w * (xMax - xMin) + xMin, e.offsetY / h * (yMax - yMin) + yMin];
//     let point = points.filter(el => isPoint(el, p2))[0];
//     let resp;
//     if(!point&&gmm){
//         for (let i = 0; i < gmm.clusters; ++i) {
//             let div = document.getElementById("cluster-" + i);
//             let r = div.querySelector(".resp-"+i);
//             r.style.display = "none";
//         }
//     }
//     if (point&&gmm) {
//         resp = gmm.predict(point).map(item=>item.toFixed(2));
//         console.log(resp);
//         for (let i = 0; i < gmm.clusters; ++i) {
//             let div = document.getElementById("cluster-" + i);
//             let r = div.querySelector(".resp-"+i);
//             r.style.display = "";
//             r.textContent = "вероятность "+resp[i];
//         }
//     }
//
//     if (draw && draw.ellipses.length > 0) {
//         let ellipse = draw.ellipses
//             .filter(el => isInsideEllipse(el.centerX, el.centerY, p[0], p[1], el.r1, el.r2, el.theta) <= 1)
//             .sort((a, b) => a.r1 - b.r1)[0];
//
//         let index = draw.ellipses.indexOf(ellipse);
//         let tooltip = document.querySelector(".tool-tip");
//         let spans = document.querySelectorAll(".tool-tip span");
//
//         let w = gmm.weights[index];
//         let m = gmm.means[index];
//         let c = gmm.covariances[index];
//
//         if (m && c) {
//             m = m.map(item => item.toFixed(2));
//             c = c.map(item => item.map(_item => _item.toFixed(2)));
//
//             spans.forEach((item, i) => item.innerHTML = [w.toFixed(2), m, c][i]);
//             tooltip.style.left = e.pageX + 5 + "px";
//             tooltip.style.top = e.pageY + 5 + "px";
//             tooltip.classList.add("active");
//         }
//         else
//             tooltip.classList.remove("active");
//     }
// }
//
// window.onmousemove = e => {
//     if (e.target.classList.contains('canvas-wrapper'))
//         document.querySelector(".tool-tip").classList.remove("active");
// }

function points2string() {
    console.log(
        points
            .map(p => [Math.round(p[0]), Math.round(p[1])])
            .map(p => '[' + p.toString() + ']')
            .join(',')
    );
}

const yAxis = document.querySelector('.graph .y-axis');
const canvasWrap = document.querySelector('.graph .canvas-wrapper');
const canvasWrapStyle = window.getComputedStyle(canvasWrap, null);

const draw = new Draw(canvas, xMin, xMax, yMin, yMax);

resizeGraph();
window.addEventListener('resize', resizeGraph);

function resizeGraph() {
    let w = parseFloat(canvasWrapStyle.getPropertyValue('width'));
    let paddingX = parseFloat(canvasWrapStyle.getPropertyValue('padding-left'));
    let paddingY = parseFloat(canvasWrapStyle.getPropertyValue('padding-top'));

    let h = w - 2 * paddingX + 2 * paddingY;
    canvasWrap.style.height = h + 'px';
    yAxis.style.height = h + 'px';

    canvas.width = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;

    redraw();
}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gmm) {
        let pointColors = points
            .map(p => gmm.predict(p))
            .map(probs => probs.reduce(
                (iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0
            ))
            .map(i => clusterColors[i]);

        pointColors[points.indexOf(point)] = 'black';

        for (let i = 0; i < gmm.clusters; i++) {
            draw.ellipse(gmm.means[i], gmm.covariances[i], clusterColors[i], i);
        }
        draw.points(points, pointColors);

        for (let i = 0; i < gmm.clusters; ++i) {
            let div = document.getElementById("cluster-" + i);
            let w = div.querySelector(".weight-" + i);
            let m = div.querySelector(".mean-" + i);
            let c = div.querySelector(".covariance-" + i);

            w.textContent = "weight " + gmm.weights[i].toFixed(2);
            m.textContent = "min " + gmm.means[i].map(item => item.toFixed(2));
            c.textContent = "covariance " + gmm.covariances[i].map(item => item.map(item => item.toFixed(2)));
        }

        // if (gmm.singularity) draw.singularity(gmm.singularity);
    } else {
        draw.points(points);
    }
}