import { readFileSync, writeFileSync } from 'fs';
import { OpenApiSpec, PathObject } from '@loopback/openapi-v3-types';

let swaggerJsonFile = process.argv[2];
let key  = process.argv[3];
let outputJsonFile = process.argv[4];

outputJsonFile = outputJsonFile.indexOf('.json',0) ===-1 ? outputJsonFile + '.json' : outputJsonFile;

const f = readFileSync(swaggerJsonFile, { encoding: 'utf8' });
const openapiSpec = <OpenApiSpec>JSON.parse(f);

// const commonPaths = extractPaths('/api/common/license/', sfLicenseSpec.paths);
// const licensePaths = extractPaths('/api/tenants/{tenantId}/license', sfLicenseSpec.paths);
const paths = extractPaths(key,openapiSpec.paths);

openapiSpec.paths = paths;
if (Object.keys(paths).length > 0 ) {
  writeFileSync(outputJsonFile,JSON.stringify(openapiSpec,null,2),{encoding:'utf8'});
}

function extractPaths(searchKey: string, pathObject: PathObject) {
    const result: PathObject = <PathObject>{};
    Object.keys(pathObject).forEach(key => {
        const keyPart = key.substring(0, searchKey.length);
        if (searchKey === keyPart) {
            result[key] = pathObject[key];
        }
    });
    return result;
}