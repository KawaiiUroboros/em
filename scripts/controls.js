document.getElementById('btn-clear').addEventListener('click', function () {
    points.length = 0;
    gmm = null;
    generatePoints();
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
}
function runE() {
    if (!gmm) {
        initializeGmm()
    }
    gmm.runE();
    redraw();
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
}
