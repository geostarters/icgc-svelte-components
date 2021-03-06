# @geostarters/icgc-svelte-components

[![npm version](https://badge.fury.io/js/%40geostarters%2Ficgc-svelte-components.svg)](https://badge.fury.io/js/%40geostarters%2Ficgc-svelte-components)
![License](https://img.shields.io/badge/license-MIT-blue.svg)


A lib of Svelte Components


## To use components

Installation
```bash
npm i @geostarters/icgc-svelte-components --save
```

Svelte sample code

```javascript
 import {LogoIcgc,
         ButtonIcgc,
         LayerTreeIcgc,
         OverLayersIcgc,
         SliderOpacityIcgc} from "@geostarters/icgc-svelte-components";

 <LogoIcgc type="white"/>

 <ButtonIcgc label="button" />

 <LayerTreeIcgc {mapLayersArray} on:Change={change} bind:group={selected} />
 
 <OverLayersIcgc {layerTree} />

 <SliderOpacityIcgc />
```


<a href="https://geostarters.github.io/icgc-svelte-components/public/index.html" target="_blank">View demo</a>

### Components


```<LogoIcgc/>```

  *Properties*
```javascript
  type: "color"|| white;
  href :"url to link" || "https://www.icgc.cat";
  src : "url to logo" || default url logos;
  style : "css style" || "position: absolute;z-index: 1000;right: 50px;bottom:10px";
```
<hr>

  ```<ButtonIcgc/>```

  *Properties*
```javascript
   style : "css style" || "background: #c8ffe7";
```
<hr>

```<LayerTreeIcgc/>```

  *Properties*
```javascript
   mapLayersArray : layers array || [
        { id: "building", name: "Edificis", checked: true },
        { id: "place", name: "Llocs", checked: false },
        { id: "water", name: "Aigua", checked: true },
    ];
```
*Events*
```javascript
   on:change={ }
```

<hr>

```<OverLayersIcgc/>```

  *Properties*
```javascript
   layerTree : layers array || [
        	{
			groupLabel: "Group 1",
			groupId: "opt_group1",
			items: [
				{
					label: "Layer 1",
					id: "layer1",
					layout: { visibility: "none" },
				},
				{
					label: "Layer 2",
					id: "layer2",
					layout: { visibility: "none" },
				},
				{
					label: "Layer 3",
					id: "layer3",
					layout: { visibility: "visible" },
				},
			],
		},

		{
			groupLabel: "Group 2",
			groupId: "opt_group2",
			items: [
				{ label: "Layer A", id: "layerA" },
				{
					label: "Layer B",
					id: "layerB",
					layout: { visibility: "none" },
				},
				{
					label: "Layer C",
					id: "layerC",
					layout: { visibility: "none" },
				},
			],
		},
    ];
```
*Events*
```javascript
   on:change={ }
   on:click={}
```

<hr>

  ```<SliderOpacityIcgc/>```

  *Properties*
```javascript
      type="range"
      min="0"
      max="100"
      step="0"
      value="50";
```
*Events*
```javascript
   on:change={ }
```
<hr>

## Common functions 

```
  import  {isWithinCat,getEmptyGeoJSON} from "@geostarters/icgc-svelte-components";

  isWithinCat([1.4622,41.7139 ,1.8117 ,42.0330])

```

[COMMON DOCS](Common.md)

<hr>

## Whit this repo

    - Create components with Svelte
    - Generate a StoryBook 
    - Publish the components via NPM
    - Reuse the components in other applications


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


    -Step 1: Go to  **package.json** and update versi??n number
     
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

Institut Cartogr??fic i Geol??gic de Catalunya (ICGC) - https://icgc.cat

??rea d???Innovaci?? i Estrat??gia Digital - Unitats Geostart i Web SIG
