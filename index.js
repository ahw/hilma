function _transform(x, domain, range) {
    const [domainMin, domainMax] = domain;
    const [rangeMin, rangeMax] = range;
    const domainRatioOffset = (x - domainMin) / (domainMax - domainMin);
    const rangeAbsoluteOffset = domainRatioOffset * (rangeMax - rangeMin);
    // console.log(`_transform ${x} on ${domain} to ${rangeMin + rangeAbsoluteOffset} on ${range}`);
    return rangeMin + rangeAbsoluteOffset;
}

function _createShape(name, attrs, xmlns = 'http://www.w3.org/2000/svg') {
    const shape = document.createElementNS(xmlns, name);
    Object.keys(attrs).forEach(attr => {
        shape.setAttribute(attr, attrs[attr]);
    })

    return shape;
}

function hex2rgb(hex) {
    return hex.replace(/#/, '').match(/\w\w/g).map(code => parseInt(code, 16));
}

class CoordinateSystem {
    constructor() {
        this.svg = document.getElementById('svg');
        const { clientWidth, clientHeight } = this.svg;
        this.svgDomain = [0, clientWidth];
        this.svgRange = [clientHeight, 0];
        // These will be the same
        // this.svgUnitsPerXUnit = clientWidth / this.domainSize();
        // this.svgUnitsPerYUnit = clientHeight / this.domainSize();
        // this.xUnitsPerPixel = this.domainSize() / clientWidth;
        this.svg.setAttribute('viewBox', `0 0 ${clientWidth} ${clientHeight}`);
        this.xmlns = 'http://www.w3.org/2000/svg';
    }
}

class PolarCoordinateSystem extends CoordinateSystem {
    constructor(rMax) {
        super()
        this.clientAspectRatio = this.svg.clientWidth / this.svg.clientHeight;
        const { clientWidth, clientHeight } = this.svg;
        let xMin = -rMax;
        let xMax = rMax;
        let yMin = -rMax;
        let yMax = rMax;
        if (this.clientAspectRatio > 1) {
            xMin = -rMax * this.clientAspectRatio;
            xMax = rMax * this.clientAspectRatio;
            yMin = -rMax;
            yMax = rMax;
        } else if (this.clientAspectRatio < 1) {
            xMin = -rMax;
            xMax = rMax;
            yMin = -rMax * this.clientAspectRatio;
            yMax = rMax * this.clientAspectRatio;
        }

        this.cartesian = new CartesianCoordinateSystem(xMin, xMax, yMin, yMax);
    }

    transform(r, theta, options) {
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        return { x, y };
    }

    plot(r, theta, options = { pointSize: 1, fill: 'red' }) {
        const { x, y } = this.transform(r, theta);
        this.cartesian.plot(x, y, options);
    }
}

class CartesianCoordinateSystem extends CoordinateSystem {
    constructor(xMin, xMax, yMin, yMax) {
        super();
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;
        this.domain = [xMin, xMax];
        this.range = [yMin, yMax];

        /*
        this.visibleAspectRatio = this.svg.clientWidth / this.svg.clientHeight;
        if (this.visibleAspectRatio > 1) {
            const extra = this.visibleAspectRatio * this.rangeSize();
            this.visibleXMin = this.xMin - extra/2;
            this.visibleXMax = this.xMax + extra/2;
            this.visibleYMin = this.yMin;
            this.visibleYMax = this.yMax;
        } else if (this.visibleAspectRatio < 1) {
            const extra = this.rangeSize() / this.visibleAspectRatio;
            this.visibleXMin = this.xMin;
            this.visibleXMax = this.xMax;
            this.visibleYMin = this.yMin - extra/2;
            this.visibleYMax = this.yMax + extra/2;
        } else {
            this.visibleXMin = this.xMin;
            this.visibleXMax = this.xMax;
            this.visibleYMin = this.yMin;
            this.visibleYMax = this.yMax;
        }
        */
    }

    xAxis(y) {
        const start = this.transform(this.xMin, y);
        const end = this.transform(this.xMax, y);
        const line = _createShape('line', {
            x1: start[0],
            y1: start[1],
            x2: end[0],
            y2: end[1],
            stroke: 'black',
            'stroke-width': 1,
        });
        this.svg.appendChild(line);
    }

    yAxis(x) {
        const start = this.transform(x, this.yMin);
        const end = this.transform(x, this.yMax);
        const line = _createShape('line', {
            x1: start[0],
            y1: start[1],
            x2: end[0],
            y2: end[1],
            stroke: 'black',
            'stroke-width': 1,
        });
        this.svg.appendChild(line);
    }

    rangeSize() {
        return this.yMax - this.yMin;
    }

    domainSize() {
        return this.xMax - this.xMin;
    }

    transform(x, y) {
        return [
            _transform(x, this.domain, this.svgDomain),
            _transform(y, this.range, this.svgRange)
        ];
    }

    plot(x, y, options = { pointSize: 1, fill: 'red' }) {
        const [svgX, svgY] = this.transform(x, y);
        const circle = _createShape('circle', { cx: svgX, cy: svgY, r: options.pointSize, fill: options.fill, opacity: 0.7 });
        this.svg.appendChild(circle);
    }
}

/*
const cartesian = new CartesianCoordinateSystem(-10, 6, -10, 10);
cartesian.xAxis(0);
cartesian.yAxis(0);

function f(x) {
    return 0.01 * (x + 7) * (x + 5) * (x - 1) * (x - 5);
}

function g(x) {
    return x;
}

cartesianUnitsPerPixel = cartesian.xUnitsPerPixel;
console.log('cartesian units per pixel', cartesianUnitsPerPixel);
for (let x = -10; x <= 10; x += 3*cartesianUnitsPerPixel) {
    const y = f(x);
    // console.log('plotting', x, y);
    cartesian.plot(x, f(x), { pointSize: 1 });
    cartesian.plot(x, g(x));
}
*/

const polar = new PolarCoordinateSystem(1.1);

// const startColor = [255, 0, 0];
// const endColor = [0, 113, 18];
// const startColor = [0, 0, 0];
// const endColor = [255, 255, 255];
const startColor = hex2rgb('#120E12');
const endColor = hex2rgb('#F3121A');
console.log(startColor, endColor);

for (let theta = 0; theta < 80*Math.PI; theta += Math.PI/180) {
    // polar.plot(Math.sin(theta), theta);
    // polar.plot(-Math.sin(theta), theta);
    // polar.plot(Math.cos(theta), theta);
    // polar.plot(-Math.cos(theta), theta);
    setTimeout(function() {
        const r = _transform(theta, [0, 80*Math.PI], [startColor[0], endColor[0]]);
        const g = _transform(theta, [0, 80*Math.PI], [startColor[1], endColor[1]]);
        const b = _transform(theta, [0, 80*Math.PI], [startColor[2], endColor[2]]);
        polar.plot(Math.sin(Math.cos(0.1 * theta) * theta), theta, {
            pointSize: 1,
            fill: `rgb(${r}, ${g}, ${b})`,
        });
    }, theta * 100);
}
