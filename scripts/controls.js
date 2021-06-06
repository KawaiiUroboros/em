document.getElementById('btn-clear').addEventListener('click', function () {
    points.length = 0;
    gmm = null;
    point = null;
    generatePoints();

    let params = document.querySelector(".tool-tips");
    let divs = params.querySelectorAll("div");

    divs.forEach(div => params.removeChild(div));

    initializeGmm();
    redraw();
    document.getElementById('btn-run-e').disabled = false;
    document.getElementById('btn-run-m').disabled = true;
});

document.getElementById('btn-run-a').addEventListener('click', _ => run(1));
document.getElementById('btn-run-b').addEventListener('click', _ => run(10));
document.getElementById('btn-run-e').addEventListener('click', _ => runE());
document.getElementById('btn-run-m').addEventListener('click', _ => runM());

// document.getElementById('btn-init-clusters').addEventListener('click', function() {
// 	initializeGmm();
// 	redraw();
// });

function run(iterations) {
    if (gmm) {
        if (gmm.singularity) return;

        gmm.runEM(iterations);
    } else {
        initializeGmm();
    }
    redraw();
    probability();
}
function runE() {
    if (!gmm) {
        initializeGmm()
    }
    gmm.runE();
    probability();
    document.getElementById('btn-run-e').disabled = true;
    document.getElementById('btn-run-m').disabled = false;
}

function runM() {
    if (gmm) {
        gmm.runM();
    } else {
        initializeGmm();
    }
    redraw();
    document.getElementById('btn-run-e').disabled = false;
    document.getElementById('btn-run-m').disabled = true;
}

function initializeGmm() {
    let sel = document.getElementById('number-of-clusters');
    let clusters = Number(sel.options[sel.selectedIndex].text);

    let dx = xMax - xMin;
    let dy = yMax - yMin;

    let means = Array(clusters).fill(0)
        .map(_ => [xMin + Math.random() * dx, yMin + Math.random() * dy]);

    let covariances = Array(clusters).fill(0)
        .map(_ => [[dx * dx * .01, 0], [0, dy * dy * .01]]);

    gmm = new GMM({
        dimensions: 2,
        bufferSize: 1000,
        weights: Array(clusters).fill(1 / clusters),
        means,
        covariances
    });

    points.forEach(p => gmm.addPoint(p));

    for (let i = 0; i < gmm.clusters; i++) {
        let params = document.querySelector(".tool-tips");

        let div = document.createElement("div");
        div.setAttribute("id", "cluster-"+i);
        div.className = "tooltip";

        div.style.backgroundColor = clusterColors[i];

        let w = document.createElement("p");
        let m = document.createElement("p");
        let c = document.createElement("p");
        let r = document.createElement("p");
        w.className = "weight-" + i;
        m.className = "mean-" + i;
        c.className = "covariance-" + i;
        r.className = "resp-" + i;


        w.textContent += "weight " + gmm.weights[i];
        m.textContent += "mean " + gmm.means[i];
        c.textContent += "covariance " + gmm.covariances[i];

        div.appendChild(w);
        div.appendChild(m);
        div.appendChild(c);
        div.appendChild(r);

        params.appendChild(div);
        // draw.ellipse(gmm.means[i], gmm.covariances[i], clusterColors[i], i);
    }
}
