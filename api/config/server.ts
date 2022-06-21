['NODE_ENV','PORT'].forEach(varName => {
    if(!process.env[varName]) throw new Error(`Environment variable ${varName} is missing`)
});
const config  = {
    'env' : process.env.NODE_ENV,
    'port' : process.env.PORT
}

export default config