#!/usr/bin/env sh
which doctoc > /dev/null || {
  echo "requires to have https://www.npmjs.com/package/doctoc installed, either globally or just in this repo"
  echo "(it is not installed as a dev dependency as the use made of it is not worth the subdependencies maintainance)"
  exit 1
}

doctoc README.md
# Override summuries to directly link to the right doc
sed -i 's/#setup/SETUP.md/' ./README.md
