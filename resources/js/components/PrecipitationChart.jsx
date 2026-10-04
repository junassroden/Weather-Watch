/* Plots real Open-Meteo hourly precipitation probability. No synthetic
   smoothing of values — the curve is a Catmull-Rom spline drawn through
   the actual reported points, so every vertex is a real API reading. */

function hourLabel(time) {
    return new Date(time).toLocaleTimeString([], { hour: "numeric" });
}

function buildPath(points) {
    if (points.length < 2) return "";

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }

    return path;
}

export default function PrecipitationChart({ times = [], values = [] }) {
    const series = times
        .slice(0, 12)
        .map((time, index) => ({ time, value: values[index] }))
        .filter((point) => point.value !== null && point.value !== undefined);

    if (series.length < 2) {
        return (
            <div className="chart-empty">
                Precipitation probability is unavailable for this location.
            </div>
        );
    }

    const width = 640;
    const height = 180;
    const padX = 34;
    const padTop = 12;
    const padBottom = 26;
    const plotH = height - padTop - padBottom;

    const points = series.map((point, index) => ({
        x: padX + (index / (series.length - 1)) * (width - padX - 12),
        y: padTop + (1 - point.value / 100) * plotH,
    }));

    const linePath = buildPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + plotH} L ${points[0].x} ${padTop + plotH} Z`;
    const gridValues = [100, 80, 60, 40, 20];

    return (
        <div className="chart-wrap">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                className="precipitation-chart"
                role="img"
                aria-label="Precipitation probability over the next twelve hours"
            >
                <defs>
                    <linearGradient id="precipFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                </defs>

                {gridValues.map((value) => {
                    const y = padTop + (1 - value / 100) * plotH;
                    return (
                        <g key={value}>
                            <line
                                x1={padX}
                                x2={width - 12}
                                y1={y}
                                y2={y}
                                className="chart-grid-line"
                            />
                            <text x={0} y={y + 3} className="chart-axis-label">
                                {value}%
                            </text>
                        </g>
                    );
                })}

                <path d={areaPath} fill="url(#precipFill)" />
                <path d={linePath} className="chart-line" />
            </svg>

            <div className="chart-x-labels">
                {series.map((point, index) =>
                    index % 2 === 0 ? (
                        <span key={point.time}>{hourLabel(point.time)}</span>
                    ) : null
                )}
            </div>
        </div>
    );
}