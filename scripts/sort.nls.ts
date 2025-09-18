import path from "path"
import fs from "fs"
import mirror from "../package.nls.json"

const root = path.resolve(__dirname, "..")
const root_nls_json_files = fs.readdirSync(root, {withFileTypes: true})
.filter(f => f.isFile() && /(package.nls.([\w-]+).json)$/g.test(f.name))
.map(f => path.resolve(f.parentPath, f.name))

root_nls_json_files.forEach(filePath => {
    const content = JSON.parse(fs.readFileSync(filePath, {encoding: "utf-8"}))
    const newContent = {} as Record<string, string>

    const keys = Object.keys(mirror)
    for(const key of keys){
        newContent[key] = content[key]
    }

    fs.writeFileSync(filePath, JSON.stringify(newContent, null, 4))
})
