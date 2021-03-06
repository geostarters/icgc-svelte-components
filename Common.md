### Documentation Common

```
  import  {isWithinCat,getEmptyGeoJSON} from "@geostarters/icgc-svelte-components";

  isWithinCat([1.4622,41.7139 ,1.8117 ,42.0330])
  
```
#### `export function getFirstSymbolLayerId(layers)`

getFirstSymbolLayerId form MapboxStyle.

 * **Parameters:** `layers` — `object` — - Input style object map.getLayers().
 * **Returns:** `object` — layer.

#### `export function getEmptyGeoJSON()`

 * **Returns:** `object` — geojson.

#### `export function getGeoJSONPoint(lng, lat)`

 * **Parameters:**
   * `lng` — `float` — - Longitude.
   * `lat` — `float` — - Latitude.
 * **Returns:** `object` — point geojson.

#### `export function getRastersSources(sources, rasterSources)`

GetRastersSources from Mapbox Style.

 * **Parameters:**
   * `sources` — `object` — - Input sources object map.getSources().
   * `rasterSources` — `object` — - Output raster sources.
 * **Returns:** `object` — rasterSources

#### `export function simplifyStyle(currentStyle, esriFy, nonAddVisibilityNone)`

Simplify from Mapbox Style.

 * **Parameters:**
   * `currentStyle` — `object` — - Input styke object map.getStyle().
   * `esriFy` — `boolean` — - Optimize for Esri Styles.
   * `nonAddVisibilityNone` — `boolean` — -  add or  no Layers visibility:none
 * **Returns:** `object` — Mapbox Style

#### `export function isInsideCat(x, y)`

X,Y coordinates inside Catalonia BBOX.

 * **Parameters:**
   * `x` — `float` — - Longitude.
   * `y` — `float` — - Latitude.
 * **Returns:** `boolean` — 

#### `export function usedSource(source, layersArray)`

Check is a Source is Used.

 * **Parameters:**
   * `source` — `object` — - Input style object map.getSources().
   * `layersArray` — `object` — - Input stlke object map.getLayers().
 * **Returns:** `boolean` — 

#### `export function removeAccents(s)`

removeAccents form MapboxStyle.

 * **Parameters:** `string` — `string` — - I.
 * **Returns:** `string` — string.

#### `export function isWithinCat(bbox)`

isWithinCat check if a bbox is within Catalonia.

 * **Parameters:** `bbox` — `array` — - Input map.getBounds().toArray() or [1.4622,41.7139 ,1.8117 ,42.0330].
 * **Returns:** `boolean` — 