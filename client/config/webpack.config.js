const webpack = require("webpack")
const merge = require("webpack-merge")
const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const base = require("./common.webpack.config")
const Paths = require("./Paths")


// BUILD_KIND: indicates production or not, process.env is set accordingly
// if its out of sync.
module.exports = function (env, argv) {
    env = env || {}
    // I think this is only used in devserver???
    const scalaArtifact = "ui/target/scala-2.13/Scala.js"
    const scalapath = path.join(__dirname, scalaArtifact)
    console.log("Scala module artifact: ", scalapath)
    console.log("process.env.NODE_ENV : ", process.env.NODE_ENV)
    console.log("env.BUILD_KIND       : ", env.BUILD_KIND)
    const ENV = env.BUILD_KIND ?
        env.BUILD_KIND : process.env.NODE_ENV ?
            process.env.NODE_ENV : "development"
    const isProd = ENV === "production"
    console.log("Final env            : ", ENV)
    console.log("Production build?    : ", isProd)
    // output to fully specified path in env var or default is dist
    const dist = process.env.OUTPUT_PATH ?
        path.resolve(__dirname, process.env.OUTPUT_PATH) :
        path.join(__dirname, "dist")
    console.log("Output path          : ", dist)

    // path for serving files, for SPAs, not under public path.
    const servePath = process.env.SERVE_PATH ? process.env.SERVE_PATH : undefined
    console.log("Serve path           : ", servePath)
    if (!!servePath) {
        console.log("Serve path must have trailing slash according to docs.")
        if (servePath.slice(-1) !== "/") throw new Error("Serve path should end in /")
    }
    // must have trailing slash
    const publicPath = process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : undefined
    console.log("Public path          : ", publicPath)//"<not set>")
    if (!!publicPath) {
        console.log("Public path must have trailing slash according to docs.")
        if (publicPath.slice(-1) !== "/") throw new Error("Public path should end in /")
    }
    const output = base.libraryOutput(
        dist,
        isProd,
        //publicPath,
        servePath,
    )
    // default is config.production.ts if no env vars are set
    const configfilename =
        (env.CONFIG_FILE || process.env.CONFIG_FILE) ?
            (env.CONFIG_FILE || process.env.CONFIG_FILE) :
            `config.${ENV}.js`
    const configfilepath = path.resolve(__dirname, configfilename)
    console.log("BuildConstants config file: ", configfilepath)

    const globals = (nodeEnv) => ({
        "process.env.NODE_ENV": JSON.stringify(nodeEnv || "development"),
        ...(publicPath ?
            { "process.env.PUBLIC_PATH": JSON.stringify(publicPath) } : {}),
        ...(process.env.API_ENDPOINT ?
            { "process.env.API_ENDPOINT": JSON.stringify(process.env.API_ENDPOINT) } : {}),
    })
    const g = globals(isProd ? "production" : undefined)
    console.log("Globals: ", g)

    const copyplugin = new CopyWebpackPlugin(base.copyPublicPatterns)

    const cleanPlugin = new CleanWebpackPlugin()

    if (isProd) {
        return merge(
            output,
            base.core({ scalapath, configfilepath, dist, publicPath }),
            base.prod,
            {
                plugins: [
                    cleanPlugin,
                    ...base.indexHTMLPlugin,
                    new webpack.HashedModuleIdsPlugin(),
                    new webpack.DefinePlugin(g),
                    copyplugin,
                ]
            })
    }
    else {
        return merge(
            output,
            base.core({ scalapath, configfilepath, dist, publicPath }),
            base.dev,
            {
                plugins: [
                    cleanPlugin,
                    ...base.indexHTMLPlugin,
                    new webpack.DefinePlugin(g),
                    copyplugin,
                    new webpack.HotModuleReplacementPlugin(),
                ]
            })
    }
}
