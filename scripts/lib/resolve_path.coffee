# a function to format 'require' path passed as arguments to scripts in the scripts directory
module.exports = (path)-> path.replace /^(\.\/)?(\w+)/, "../$2"