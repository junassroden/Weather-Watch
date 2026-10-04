/* The one supporting-metric row used anywhere a labelled measurement
   needs to appear — icon, label, value, optional status word. It reads
   as a line in a list, not a floating box, so five or eight of these in
   a row stay quiet instead of turning into a grid of equal-weight tiles.
   Props are unchanged from the previous boxed version, so every existing
   call site keeps working without edits. */
export default function StatCard({
    title,
    value,
    unit = "",
    status = "",
    statusTone = "neutral",
    icon: Icon,
    iconSrc,
    children,
}) {
    const available = value !== null && value !== undefined && value !== "";

    return (
        <div className="overview-metric-row">
            {iconSrc ? (
                <img src={iconSrc} alt="" width={22} height={22} aria-hidden="true" />
            ) : Icon ? (
                <Icon size={20} strokeWidth={1} aria-hidden="true" />
            ) : null}

            <div className="overview-metric-text">
                <span>{title}</span>
                <strong>
                    {available ? value : "--"}
                    {available && unit && <small>{unit}</small>}
                </strong>
            </div>

            {status && (
                <span className={`overview-metric-status stat-status-${statusTone}`}>
                    {status}
                </span>
            )}

            {children}
        </div>
    );
}