const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const crypto = require('crypto');

function hashClass(cssStr) {
    return 'style-' + crypto.createHash('md5').update(cssStr).digest('hex').substring(0, 8);
}

const toKebab = (str) => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

const unitlessNumbers = new Set(['fontWeight', 'opacity', 'zIndex', 'lineHeight', 'flex', 'flexGrow', 'flexShrink', 'order']);

function formatValue(key, val) {
    if (typeof val === 'number') {
        if (val === 0 || unitlessNumbers.has(key)) {
            return val.toString();
        }
        return val + 'px';
    }
    return val;
}

const srcDir = path.join(__dirname, 'src');
const indexCssPath = path.join(srcDir, 'index.css');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

const extractedStyles = new Map();

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) return;

    let code = fs.readFileSync(filePath, 'utf-8');

    let ast;
    try {
        ast = parser.parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
        });
    } catch (e) {
        console.error('Cant parse', filePath);
        return;
    }

    let changed = false;

    traverse(ast, {
        JSXOpeningElement(path) {
            const attributes = path.node.attributes;
            const styleIndex = attributes.findIndex(
                a => a.type === 'JSXAttribute' && a.name.name === 'style'
            );

            if (styleIndex === -1) return;
            const styleAttr = attributes[styleIndex];
            const styleValue = styleAttr.value;

            if (styleValue.type !== 'JSXExpressionContainer' || styleValue.expression.type !== 'ObjectExpression') {
                return;
            }

            const properties = styleValue.expression.properties;
            if (properties.length === 0) return;

            let isStatic = true;
            let cssLines = [];

            for (const prop of properties) {
                if (prop.type !== 'ObjectProperty') { isStatic = false; break; }
                const keyNode = prop.key;
                let keyName;
                if (keyNode.type === 'Identifier') keyName = keyNode.name;
                else if (keyNode.type === 'StringLiteral') keyName = keyNode.value;
                else { isStatic = false; break; }

                let val;
                if (prop.value.type === 'StringLiteral') {
                    val = prop.value.value;
                } else if (prop.value.type === 'NumericLiteral') {
                    val = prop.value.value;
                } else {
                    isStatic = false;
                    break;
                }

                const kebabKey = toKebab(keyName);
                const cssVal = formatValue(keyName, val);
                cssLines.push(`${kebabKey}: ${cssVal};`);
            }

            if (!isStatic) return;

            changed = true;
            const cssContent = cssLines.join(' ');
            const className = hashClass(cssContent);
            if (!extractedStyles.has(className)) {
                extractedStyles.set(className, `\n.${className} {\n  ${cssLines.join('\n  ')}\n}`);
            }

            // Remove style attribute
            attributes.splice(styleIndex, 1);

            // Find className attribute
            const classIndex = attributes.findIndex(
                a => a.type === 'JSXAttribute' && a.name.name === 'className'
            );

            if (classIndex === -1) {
                // Add className
                attributes.push(t.jsxAttribute(t.jsxIdentifier('className'), t.stringLiteral(className)));
            } else {
                const classAttr = attributes[classIndex];
                if (classAttr.value.type === 'StringLiteral') {
                    classAttr.value.value += ' ' + className;
                } else if (classAttr.value.type === 'JSXExpressionContainer') {
                    // It's an expression like className={dynamicClass} -> className={`${dynamicClass} ${className}`}
                    const expr = classAttr.value.expression;
                    classAttr.value.expression = t.templateLiteral([
                        t.templateElement({ raw: '', cooked: '' }, false),
                        t.templateElement({ raw: ' ' + className, cooked: ' ' + className }, true)
                    ], [expr]);
                }
            }
        }
    });

    if (changed) {
        const output = generate(ast, {}, code);
        fs.writeFileSync(filePath, output.code);
        console.log(`Updated ${filePath}`);
    }
}

walkDir(srcDir, processFile);

if (extractedStyles.size > 0) {
    let cssAppended = Array.from(extractedStyles.values()).join('\n');
    fs.appendFileSync(indexCssPath, '\n/* Auto-extracted inline styles */\n' + cssAppended + '\n');
    console.log(`Extracted ${extractedStyles.size} unique styles to index.css`);
} else {
    console.log('No static styles found to extract.');
}
