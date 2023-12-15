const fs= require('fs');
const writeFile= function (path,content) {
    fs.writeFileSync(path,JSON.stringify(content),'utf-8')
}

module.exports =  writeFile;