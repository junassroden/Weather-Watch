/* The single card shape used for every "Today's Overview" tile and, on
   other pages, for any labelled metric. Title top-left, large value,
   optional status word, optional icon bottom-right. */
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
        <article className="stat-card">
            <span className="stat-card-title">{title}</span>

            <div className="stat-card-body">
                <div className="stat-card-text">
                    <div className="stat-card-value">
                        {available ? value : "--"}
                        {available && unit && <span>{unit}</span>}
                    </div>

                    {status && (
                        <span className={`stat-card-status stat-status-${statusTone}`}>
                            {status}
                        </span>
                    )}
                </div>

                {iconSrc ? (
                    <img src={iconSrc} alt="" aria-hidden="true" className="stat-card-icon stat-card-icon-img" />
                ) : Icon ? (
                    <span className="stat-card-icon" aria-hidden="true">
                        <Icon size={30} />
                    </span>
                ) : null}
            </div>

            {children}
        </article>
    );
}