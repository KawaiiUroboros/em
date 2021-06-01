
function genereatePoints() {
    const arr = Array(25).fill().map(() => [150 + Math.round(Math.random() * 100),150 + Math.round(Math.random() * 100)]);
    return arr.concat(Array(25).fill().map(() => [300 + Math.round(Math.random() * 50),300 + Math.round(Math.random() * 50)]));
}

let points;
let groups;

function setup() {
    points = genereatePoints();
    groups = multivariate_gaussian_fit(points, 2);
    createCanvas(500, 500);
    background(110,111,89);
    console.log(groups[0].probability(points[0]));
    console.log(groups[1].probability(points[0]));
    console.log(groups);
}

function draw() {
    groups.forEach((g)=> {
        const a = g.sigma[0][0];
        const b = g.sigma[0][1];
        const c = g.sigma[1][1];
        const l1 =  ((a+c)/2) + Math.sqrt(Math.pow(((a-c)/2),2))+Math.pow(b,2);
        const l2 =  ((a+c)/2) - Math.sqrt(Math.pow(((a-c)/2),2))+Math.pow(b,2);
        ellipse(g.mu[0], g.mu[1], Math.sqrt(l2), Math.sqrt(l1))
    })
    strokeWeight(3);

    points.forEach((p) => {

        point(p[0],p[1]);
    })
}
