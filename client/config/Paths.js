const path = require("path")

const topdir = path.resolve(__dirname, "..")

/** Absolute paths. */
const Paths = {
    project: topdir,
    src: path.join(topdir, "src"),
    config: path.join(topdir, "config"),
    public: path.join(topdir, "public"),
}

module.exports = Object.freeze(Paths)