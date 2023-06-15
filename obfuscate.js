const JsConfuser = require('js-confuser').default;
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const inputFile = process.argv[3];
const encryptionLevel = parseInt(process.argv[2]);

if (!inputFile || isNaN(encryptionLevel) || encryptionLevel < 1 || encryptionLevel > 3) {
  console.log('Por favor, especifica un nivel de encriptación válido (1-3) y el archivo que deseas ofuscar. Ejemplo: node obfuscate.js <nivel> <nombre-archivo>');
  process.exit(1);
}

fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.log('Error al leer el archivo:', err);
    process.exit(1);
  }

  const obfuscateCode = async (obfuscationOptions) => {
    try {
      const obfuscatedCode = await JsConfuser.obfuscate(data, {
        target: 'node',
        preset: obfuscationOptions.preset,
      });

      const obfuscationResult = JavaScriptObfuscator.obfuscate(obfuscatedCode, obfuscationOptions);

      const outputFile = getUniqueOutputFileName(inputFile);
      fs.writeFile(outputFile, obfuscationResult.getObfuscatedCode(), (err) => {
        if (err) {
          console.log('Error al guardar el archivo:', err);
        } else {
          console.log('El archivo', outputFile, 'se ha guardado exitosamente.');
        }
      });
    } catch (error) {
      console.log('Error al ofuscar el código:', error);
    }
  };

  let obfuscationOptions;

  switch (encryptionLevel) {
   case 1:
      obfuscationOptions = {
        optionsPreset: 'low-obfuscation',
        preset: 'low',
        identifiersPrefix: 'Alexita',
        
      };
      break;
    case 2:
      obfuscationOptions = {
        optionsPreset: 'medium-obfuscation',
        preset: 'medium',
        identifiersPrefix: 'Alexita',

      };
      break;
    case 3:
      obfuscationOptions = {
        optionsPreset: 'high-obfuscation',
        identifiersPrefix: 'Alexita',
        preset: 'high',
      };
      break;
    default:
      console.log('Nivel de encriptación no válido. Debe ser un valor entre 1 y 3.');
      process.exit(1);
  }

  obfuscateCode(obfuscationOptions);
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
