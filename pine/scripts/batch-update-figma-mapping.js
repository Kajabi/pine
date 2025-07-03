function typeToFigma(name, type) {
  // Handle union types (enums)
  if (/\|/.test(type)) {
    const options = {};
    type.split('|').map(s => s.trim().replace(/['"]/g, ''))
      .forEach(opt => {
        if (opt) options[opt.charAt(0).toUpperCase() + opt.slice(1)] = opt;
      });
    return `figma.enum('${name[0].toUpperCase() + name.slice(1)}', ${JSON.stringify(options, null, 2)})`;
  }
  if (/boolean/.test(type)) return `figma.boolean('${name[0].toUpperCase() + name.slice(1)}')`;
  if (/number/.test(type)) return `figma.string('${name[0].toUpperCase() + name.slice(1)}')`;
  if (/string/.test(type)) return `figma.string('${name[0].toUpperCase() + name.slice(1)}')`;
  // fallback
  return `figma.string('${name[0].toUpperCase() + name.slice(1)}') // TODO: Review type: ${type}`;
}