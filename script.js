
function genereatePoints() {
    return Array(100).fill().map(() => [Math.round(Math.random() * 400),Math.round(Math.random() * 400)]);
}

const points = genereatePoints();

const groups = multivariate_gaussian_fit(points, 5);

function setup() {
    createCanvas(400, 400);
}

function draw() {
    points.forEach((p)=>{
        point(p[0],p[1]);
    })
    groups.forEach((g)=>{
        const a = g.sigma[0][0];
        const b = g.sigma[0][1];
        const c = g.sigma[1][1];
        const l1 =  ((a+c)/2) + Math.sqrt(Math.pow(((a-c)/2),2))+Math.pow(b,2);
        const l2 =  ((a+c)/2) - Math.sqrt(Math.pow(((a-c)/2),2))+Math.pow(b,2);
        ellipse(g.mu[0], g.mu[1], Math.sqrt(l2), Math.sqrt(l1))
    })
}

console.log(groups);