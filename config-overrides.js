const { override } = require("customize-cra");

const setOptimizationSideEffect = flag => config => {
    config.optimization.sideEffects = flag
    return config;
}

module.exports = override(
    setOptimizationSideEffect(false)
);