# @geostarters/icgc-svelte-components


    - Create components with Svelte
    - Generate a StoryBook 
    - Publish the components via NPM
    - Reuse the components in other applications

## To use components

Installation
```
npm i @geostarters/icgc-svelte-components --save
```

Svelte code

```javascript
 import {LogoIcgc} from "@geostarters/icgc-svelte-components";

 <LogoIcgc type="white"/>

```

### Components


  ```<LogoIcgc/>```

  *Properties*
```bash
  type: "color"|| white;
  href :url to link || "https://www.icgc.cat";
  src : url to logo || default url logos;
  style : css style || "position: absolute;z-index: 1000;right: 50px;bottom:10px";
```
<hr>

```<LayerTreeIcgc/>```

  *Properties*
```bash
   mapLayersArray : layers array || [
        { id: "building", name: "Edificis", checked: true },
        { id: "place", name: "Llocs", checked: false },
        { id: "water", name: "Aigua", checked: true },
    ];
```
*Events*
```bash
   on:change={ }
```

<hr>

## To develope components

 ### Local installation

*You need [Node.js](https://nodejs.org) installed*

```bash
git clone https://github.com/geostarters/icgc-svelte-components.git

cd icgc-svelte-components

git checkout devel

npm install

```

**To start in developement mode**

```
npm run dev
```

**To run storybook**

```
npm run storybook
```

**To deploy storybook**

```
npm run build-storybook
```


**New git branch**

```
git checkout -b "nombranch"
```

**To build for production mode**

```
npm run build
```

**To update code**

```git
git pull
git add .
git commit -m "text commit"
git push
```

### In ordre to start developing

    -Step 1 : Create a Svelte components in **/src/components/**
    -Step 2 : Import and try component in **/src/App.svelte**
    -Step 3 : Create storie component in **/src/stories** 
    -Step 4 : Run StoryBook ```npm run storybook```
    -Step 5 : Import component in **/src/export.js** and ```run start build```

### In order to publish NPM's components    

https://www.npmjs.com/package/@geostarters/icgc-svelte-components


    -Step 1: Go to  **package.json** and update versión number
     
```json
     "name": "@geostarters/icgc-svelte-components",
     "version": "0.0.2",
```
    -Step 2: Open terminal
     
```bash
    npm run build
    npm login
    Username: icgcgeostarters
    Password: XXXXXXXX
    Email: (this IS public): geostarters [at] gmail [dot] com
    npm publish --access public 
    
```

## Used styles

This template use Svelte Material UI 

Documentation 

https://sveltematerialui.com/


Material Icons

https://fonts.google.com/icons?selected=Material+Icons+Outlined:assignment_returned

## Version

```javascript
alpha 0.0.2
```
## License

Reconeixement 4.0 Internacional de Creative Commons
(CC-BY 4-0)

[More info](https://www.icgc.cat/L-ICGC/Informacio-publica/Transparencia/Reutilitzacio-de-la-informacio)

##  Credits            

Developed by :

Institut Cartogràfic i Geològic de Catalunya (ICGC) - https://icgc.cat

Àrea d’Innovació i Estratègia Digital - Unitats Geostart i Web SIG
