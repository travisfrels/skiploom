CREATE TABLE togglz (
    feature_name    VARCHAR(100) PRIMARY KEY,
    feature_enabled INTEGER,
    strategy_id     VARCHAR(200),
    strategy_params VARCHAR(2000)
);
