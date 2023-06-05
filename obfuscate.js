const JsConfuser = require('js-confuser').default;
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];

if (!inputFile) {
  console.log('Por favor, especifica el archivo que deseas ofuscar. Ejemplo: node obfuscate.js <nombre-archivo>');
  process.exit(1);
}

fs.readFile(inputFile, 'utf8', function(err, data) {
  if (err) {
    console.log('Error al leer el archivo:', err);
    process.exit(1);
  }

  JsConfuser.obfuscate(data, {
    target: 'node',
    preset: 'high',
    stringEncoding: true, // <- Normally enabled
  }).then(obfuscatedCode => {
    const obfuscationResult = JavaScriptObfuscator.obfuscate(obfuscatedCode, {
      compact: true,
      simplify: true,
      numbersToExpressions: true,
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: 'variable',
      stringArrayThreshold: 0.75,
      target: 'browser',
      splitStringsChunkLength: 10,
      stringArray: true,
      stringArrayCallsTransform: true,
      optionsPreset: 'default',
      renameGlobals: false,
      renameProperties: false,
      identifiersPrefix: 'Alexita',
    });

    const outputFile = getUniqueOutputFileName(inputFile);

    fs.writeFile(outputFile, obfuscationResult.getObfuscatedCode(), function(err) {
      if (err) {
        console.log('Error al guardar el archivo:', err);
      } else {
        console.log('El archivo', outputFile, 'se ha guardado exitosamente.');
      }
    });
  });
});

function getUniqueOutputFileName(inputFile) {
  const baseName = path.basename(inputFile, path.extname(inputFile));
  const outputDir = path.dirname(inputFile);
  let outputFile = path.join(outputDir, baseName + '.obfuscated.js');

  let counter = 1;
  while (fs.existsSync(outputFile)) {
    outputFile = path.join(outputDir, baseName + '.obfuscated' + counter + '.js');
    counter++;
  }

  return outputFile;
}
