const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Paths = require("./Paths")
const { CheckerPlugin } = require("awesome-typescript-loader")

const dev = {
    devtool: "source-map",
    mode: "development",
}

const prod = {
    devtool: "source-map",
    mode: "production"
}

function core({ configfilepath, dest, publicPath }) {
    return {
        entry: {
            "App": path.resolve(Paths.src, "index.tsx"),
        },
        target: "web",
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json", "*"],
            alias: {
                // JS: path.resolve(__dirname, Paths.JS),
                // Public: path.resolve(__dirname, Paths.Public),
                // App: path.resolve(__dirname, Paths.app),
                // resources: path.resolve(__dirname, Paths.resources),
                "config": configfilepath,
            },
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader',
                },
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    loader: "awesome-typescript-loader",
                    exclude: [/node_modules/],
                    options: {
                        configFileName: path.join(__dirname, "tsconfig.json"),
                        useCache: true
                    }
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: ["url-loader"]
                },
                {
                    test: [/Scala\.js$/],
                    use: [
                        {
                            loader: "scalajs-friendly-source-map-loader",
                            options: {
                                // change this to false if offline
                                bundleHttp: (process.env.OFFLINE === "true") ? false : true
                            }
                        }],
                    enforce: "pre",
                    exclude: [/node_modules/],
                },
            ]
        },
        plugins: [
            new CheckerPlugin()
        ],
        devServer: devServer({ dest, publicPath })
    }
}

const copyPublicPatterns = [
    { from: Paths.public, globOptions: { ignore: "*~" } },
]

function libraryOutput(dest, isProd, servePath) {
    const hash = isProd ? "[chunkhash]" : "[hash]"
    return {
        name: "client",
        output: {
            publicPath: servePath,
            path: dest,
            filename: `[name].${hash}.js`,
            chunkFilename: `[name].${hash}.js`,
            library: "[name]",
            libraryTarget: "var",
        },
        // https://stackoverflow.com/questions/48985780/webpack-4-create-vendor-chunk
        // https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
        // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
        // https://webpack.js.org/guides/caching/
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        // all takes all chunks
                        //chunks: "all"
                        // initial takes only initially loaded chunks, dynamic import <> initial
                        chunks: "initial"
                    }
                }
            },
        }
    }
}

function devServer({ distDir, publicPath }) {
    const endpoint = process.env.DEV_SERVER_API_ENDPOINT ?
        process.env.DEV_SERVER_API_ENDPOINT : 'http://localhost:3001'
    const contentBase = path.join(__dirname, Paths.public)

    console.log("Dev server endpoint: ", endpoint)
    console.log("   Proxy to backend API server can use http for local dev.")
    console.log("            distDir: ", distDir)
    console.log("         publicPath: ", publicPath)
    console.log("     Static content: ", contentBase)

    return {
        contentBase,
        compress: true,
        hot: true,
        open: false,
        https: process.env.HTTPS ? process.env.HTTPS : true,
        host: "0.0.0.0", // allow from anywhere on dev machine network
        port: process.env.PORT ? process.env.PORT : 8080,
        watchContentBase: true,
        historyApiFallback: {
            index: (publicPath ? `${publicPath}app.html` : "/app.html"),
            verbose: true,
        },
        disableHostCheck: true,
        index: "app.html",
        overlay: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // proxy back to API server
        proxy: [{
            context: ["/hello", "/graphql"],
            target: endpoint,
            secure: false
        }]
    }
}

const indexHTMLPlugin = [
    new HtmlWebpackPlugin({
        title: "App",
        filename: "app.html",
        template: path.join(Paths.public, "app.html")
    }),
]

module.exports = Object.freeze({
    prod,
    dev,
    indexHTMLPlugin,
    devServer,
    libraryOutput,
    copyPublicPatterns,
    core
})