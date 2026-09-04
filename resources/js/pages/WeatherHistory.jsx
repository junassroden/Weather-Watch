import {
    History,
    Database,
} from "lucide-react";

import Header from "../components/Header";

export default function WeatherHistory() {
    return (
        <div className="weather-app">

            <Header />

            <main className="page-content">

                <div className="container">

                    <div className="page-header">

                        <span className="eyebrow">
                            WEATHER HISTORY
                        </span>

                        <h1>
                            Weather History
                        </h1>

                        <p>
                            Review historical weather
                            conditions and trends for
                            your selected location.
                        </p>

                    </div>

                    <div className="history-empty">

                        <div className="history-empty-icon">
                            <History size={32} />
                        </div>

                        <h2>
                            Historical Data
                        </h2>

                        <p>
                            Historical weather storage
                            and trend analysis will be
                            connected to the WeatherWatch
                            database.
                        </p>

                        <div className="history-status">

                            <Database size={18} />

                            <span>
                                History API not connected
                            </span>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}