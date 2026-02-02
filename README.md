# Webpack Template v1

Minimal Webpack 5 project template using ES modules and separate development and production configurations.

This repository is intended to be used as a **template** for new projects.

## Included

- Webpack 5
- `webpack.common.js`, `webpack.dev.js`, `webpack.prod.js`
- HTML generation via `HtmlWebpackPlugin`
- CSS support
- Asset handling for images and fonts
- Development server
- ES module syntax (`"type": "module"`)

## Usage

1. Click **Use this template** on GitHub  
2. Clone the new repository  
3. Install dependencies:
    ```bash
   npm install
4. tart development server:
    ```bash
    npm run dev
5. Build for production:
    ```bash
    npm run build

## Structure
    src /
    ├─ index.js
    ├─ template.html
    └─ style.css
```
webpack.common.js
webpack.dev.js
webpack.prod.js
```
## Notes
- dist/ is generated automatically
- Do not edit files inside dist/
- This is an infrastructure template
- Replace this README for real projects

Not intended for publishing as an npm package.