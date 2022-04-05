<script context="module">
  import booleanWithin from  "@turf/boolean-within";
  import bboxPolygon from  "@turf/bbox-polygon";
  //https://delight-im.github.io/Javadoc-to-Markdown/


  /**
   * GetRastersSources from Mapbox Style.
   * @param {object} sources - Input sources object map.getSources().
   * @param {object} rasterSources - Output raster sources.
   * @return {object} rasterSources
   */
  export function getRastersSources(sources, rasterSources) {
    for (var key in sources) {
      if (sources.hasOwnProperty(key)) {
        if (sources[key].type && sources[key].type.indexOf("raster") != -1) {
          rasterSources.push(key);
        }
      }
    }

    return rasterSources;
  }

  /**
   * Simplify from Mapbox Style.
   * @param {object} currentStyle - Input styke object map.getStyle().
   * @param {boolean} esriFy - Optimize for Esri Styles.
   * @param {boolean} nonAddVisibilityNone -  add or  no Layers visibility:none
   * @return {object} Mapbox Style
   */

  export function simplifyStyle(currentStyle, esriFy, nonAddVisibilityNone) {
    //true,true
    const style = currentStyle;
    let newStyle = {};
    let layers = style.layers;
    let sources = style.sources;
    let _sources = {};
    let _layers = [];
    let rasterSources = ["routing-in", "routing-out", "routing-path"];

    if (esriFy) {
      rasterSources = getRastersSources(sources, rasterSources);
    }

    for (var key in sources) {
      if (sources.hasOwnProperty(key)) {
        if (!usedSource(key, layers)) {
          rasterSources.push(key);

          delete sources[key];
        }
      }
    }

    for (var key in sources) {
      let rs = rasterSources.find((element) => element == key);
      if (!rs) {
        _sources[key] = sources[key];
      }
    }

    for (let i = 0; i < style.layers.length; i++) {
      let noExist = "";
      if (style.layers[i].source) {
        noExist = rasterSources.find((element) => element == style.layers[i].source);

        if (esriFy) {
          noExist =
            style.layers[i].type.indexOf("raster") != -1 || style.layers[i].type.indexOf("hillshade") != -1 || style.layers[i].source.indexOf("contour") != -1
              ? style.layers[i].source
              : noExist;
        }
      }

      if (style.layers[i].id == "background") {
        _layers.push(style.layers[i]);
      }
      if (
        style.layers[i] &&
        style.layers[i].id &&
        style.layers[i].id.indexOf("municipis-pol-") == -1 &&
        style.layers[i].id.indexOf("routing-") == -1 &&
        style.layers[i].id != "sky" &&
        noExist == undefined
      ) {
        if (nonAddVisibilityNone) {
          if (style.layers[i].layout) {
            if (style.layers[i].layout.visibility != "none") {
              _layers.push(style.layers[i]);
            }
          } else {
            _layers.push(style.layers[i]);
          } // end else
        } else {
          _layers.push(style.layers[i]);
        }
      }
    }

    newStyle.version = currentStyle.version;
    newStyle.name = currentStyle.name;

    newStyle.center = currentStyle.center;
    newStyle.zoom = currentStyle.zoom;
    newStyle.bearing = currentStyle.bearing;
    newStyle.pitch = currentStyle.pitch;
    newStyle.sources = _sources;
    newStyle.sprite = currentStyle.sprite;
    newStyle.glyphs = currentStyle.glyphs;
    newStyle.layers = _layers;
    return newStyle;
  }

  /**
 * Check is a Source is Used.
 * @function usedSource
 * @param {object} source - Input style object map.getSources().
 * @param {object} layersArray - Input stlke object map.getLayers().
 * @return {boolean} 
 */

  function usedSource(source, layersArray) {
    let isUsed = false;

    for (let i = 0; i < layersArray.length; i++) {
      let ly = layersArray[i];

      if (ly.source == source) {
        if (ly.layout && ly.layout.visibility && ly.layout.visibility == "visible" && ly.id.indexOf("routing-") == -1) {
          isUsed = true;
        }
      }
    }

    return isUsed;
  }

  /**
   * X,Y coordinates inside Catalonia BBOX.
   * @function isInsideCat
   * @param {float} x - Longitude.
   * @param {float} y - Latitude.
   * @return {boolean}
   */

  export function isInsideCat(x, y) {
    var x0 = 0.154;
    var y0 = 40.472;
    var x1 = 3.317;
    var y1 = 42.856;
    if (z < 10) {
      return false;
    } else if (x >= x0 && x <= x1 && y >= y0 && y <= y1) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * getFirstSymbolLayerId form MapboxStyle.
   * @function getFirstSymbolLayerId
   * @param {object} layers - Input style object map.getLayers().
   * @return {object} layer.
   */

  export function getFirstSymbolLayerId(layers) {
    let layer = "background";
    for (var i = 0; i < layers.length; i++) {
      //  console.info(layers[i]);
      if (layers[i].type == "symbol" && layers[i]["source-layer"] !== "contour") {
        layer = layers[i].id;
        return layer;
      }
    }
  }

  /**
   * removeAccents form MapboxStyle.
   * @function getFirstSymbolLayerId
   * @param {string} string - I.
   * @return {string} string.
   */
  export function removeAccents(s) {
    var r = s.toLowerCase();
    // r = r.replace(new RegExp("\\s", "g"), "");
    r = r.replace(new RegExp("[àáâãäå]", "g"), "a");
    r = r.replace(new RegExp("æ", "g"), "ae");
    r = r.replace(new RegExp("ç", "g"), "c");
    r = r.replace(new RegExp("[èéêë]", "g"), "e");
    r = r.replace(new RegExp("[ìíîï]", "g"), "i");
    r = r.replace(new RegExp("ñ", "g"), "n");
    r = r.replace(new RegExp("[òóôõö]", "g"), "o");
    r = r.replace(new RegExp("œ", "g"), "oe");
    r = r.replace(new RegExp("[ùúûü]", "g"), "u");
    r = r.replace(new RegExp("[ýÿ]", "g"), "y");
    //r = r.replace(new RegExp("\\W", "g"), "");
    return r;
  }

 /**
   * @function getEmptyGeoJSON
   * @return {object} geojson.
   */

  export function getEmptyGeoJSON() {
    return {
      type: "FeatureCollection",
      features: [],
    };
  }

  /**
   * @function getGeoJSONPoint
   * @param {float} lng - Longitude.
   * @param {float} lat - Latitude.
   * @return {object} point geojson.
   */
  export function getGeoJSONPoint(lng, lat) {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        },
      ],
    };
  }

   /**
   * isWithinCat check if a bbox is within Catalonia.
   * @param {array} bbox - Input map.getBounds().toArray() or [1.4622,41.7139 ,1.8117 ,42.0330].
   * @return {boolean} 
   */
   export function isWithinCat (bbox){

const catGeometry={ "type": "Feature", "properties": { }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 3.13659668, 42.45183467 ], [ 4.5703125, 42.45183467 ], [ 4.5703125, 40.32142 ], [ 0.46142578, 40.50962285 ], [ 0.47186781, 40.53462912 ], [ 0.43878899, 40.54636661 ], [ 0.43199223, 40.57932906 ], [ 0.38788005, 40.60680307 ], [ 0.33928745, 40.60831124 ], [ 0.29180998, 40.6231958 ], [ 0.27075837, 40.63786187 ], [ 0.26840553, 40.65952669 ], [ 0.29202721, 40.68813711 ], [ 0.26170782, 40.70601407 ], [ 0.23697901, 40.70142566 ], [ 0.22378807, 40.73224654 ], [ 0.1981649, 40.72488755 ], [ 0.17026509, 40.7327526 ], [ 0.17763713, 40.75491444 ], [ 0.18927312, 40.75063644 ], [ 0.21210423, 40.76757767 ], [ 0.22948802, 40.76731195 ], [ 0.23397906, 40.78582349 ], [ 0.25889269, 40.80081523 ], [ 0.27746103, 40.82350803 ], [ 0.25984739, 40.8385287 ], [ 0.25082872, 40.85584265 ], [ 0.2554135, 40.87303047 ], [ 0.24591097, 40.88720759 ], [ 0.2482948, 40.90885517 ], [ 0.26026193, 40.92792793 ], [ 0.2928301, 40.96859314 ], [ 0.26016983, 41.01190772 ], [ 0.26142695, 41.02695717 ], [ 0.23036421, 41.03714316 ], [ 0.23061462, 41.05601646 ], [ 0.218939, 41.0616188 ], [ 0.21944141, 41.08339359 ], [ 0.20154376, 41.084124 ], [ 0.20046385, 41.10219196 ], [ 0.21938026, 41.13175532 ], [ 0.24863413, 41.13000124 ], [ 0.2599792, 41.14923681 ], [ 0.27221805, 41.14858024 ], [ 0.30168143, 41.16097701 ], [ 0.30566403, 41.18506685 ], [ 0.31856831, 41.22011582 ], [ 0.3384086, 41.23013747 ], [ 0.3626851, 41.22590175 ], [ 0.37740788, 41.23634187 ], [ 0.37956599, 41.27066988 ], [ 0.3856495, 41.2785035 ], [ 0.36555846, 41.30377127 ], [ 0.36756899, 41.31961031 ], [ 0.35135067, 41.33269192 ], [ 0.37422648, 41.35225152 ], [ 0.35734719, 41.3724972 ], [ 0.31997505, 41.39440772 ], [ 0.34203086, 41.41292772 ], [ 0.34822912, 41.43968038 ], [ 0.35666508, 41.45139147 ], [ 0.34506499, 41.46218287 ], [ 0.34273838, 41.48387788 ], [ 0.37173074, 41.48480403 ], [ 0.39749007, 41.4906529 ], [ 0.41740349, 41.51630983 ], [ 0.44659688, 41.54189095 ], [ 0.43046769, 41.56470025 ], [ 0.43610484, 41.58516874 ], [ 0.42954345, 41.60087415 ], [ 0.40347521, 41.59309591 ], [ 0.34979871, 41.5995633 ], [ 0.34572274, 41.62196151 ], [ 0.35376376, 41.62952554 ], [ 0.33239582, 41.66001435 ], [ 0.32849911, 41.68172691 ], [ 0.3420412, 41.6963999 ], [ 0.36809145, 41.71357523 ], [ 0.36877904, 41.72256215 ], [ 0.39957551, 41.75640222 ], [ 0.448692, 41.76465292 ], [ 0.46901917, 41.7651147 ], [ 0.47407996, 41.78803405 ], [ 0.51552854, 41.82209248 ], [ 0.54203313, 41.82012194 ], [ 0.55116948, 41.83112756 ], [ 0.55735343, 41.85395486 ], [ 0.57901516, 41.85092949 ], [ 0.58052776, 41.86322709 ], [ 0.60651756, 41.8708282 ], [ 0.59218845, 41.88474261 ], [ 0.60238539, 41.92252321 ], [ 0.56263313, 41.93271796 ], [ 0.5612646, 41.93873835 ], [ 0.59273874, 41.96872057 ], [ 0.62409537, 41.99183131 ], [ 0.65808036, 42.00249847 ], [ 0.65175767, 42.02610075 ], [ 0.66867224, 42.04293886 ], [ 0.66956206, 42.06128783 ], [ 0.68281162, 42.08805975 ], [ 0.69976022, 42.10567847 ], [ 0.69575541, 42.15109856 ], [ 0.71320509, 42.16362119 ], [ 0.69786714, 42.17164953 ], [ 0.71403291, 42.22287002 ], [ 0.73298739, 42.24787326 ], [ 0.74421038, 42.29968999 ], [ 0.75590341, 42.31003683 ], [ 0.74420634, 42.32653713 ], [ 0.74631866, 42.35650126 ], [ 0.72286265, 42.36561022 ], [ 0.74421564, 42.38352572 ], [ 0.73570889, 42.41278666 ], [ 0.72679706, 42.42673267 ], [ 0.71075982, 42.4357429 ], [ 0.70903902, 42.45885316 ], [ 0.69481598, 42.475822 ], [ 0.73694481, 42.50823876 ], [ 0.7211416, 42.52442446 ], [ 0.75767238, 42.56914822 ], [ 0.76755787, 42.61153987 ], [ 0.73758112, 42.6125424 ], [ 0.70863065, 42.62074431 ], [ 0.69858879, 42.62908869 ], [ 0.69553811, 42.65861991 ], [ 0.68558195, 42.65882617 ], [ 0.6734992, 42.67897867 ], [ 0.67408741, 42.69947862 ], [ 0.68253011, 42.70881029 ], [ 0.65053192, 42.76514391 ], [ 0.65261185, 42.78766232 ], [ 0.67083133, 42.80465493 ], [ 0.66236275, 42.84128065 ], [ 0.70853963, 42.86144233 ], [ 0.71608128, 42.85828732 ], [ 0.73597135, 42.84878725 ], [ 0.77957166, 42.83591937 ], [ 0.80076007, 42.84064175 ], [ 0.83312344, 42.8283491 ], [ 0.85558905, 42.82681009 ], [ 0.88512405, 42.81321672 ], [ 0.9080348, 42.79677052 ], [ 0.93092082, 42.78883216 ], [ 0.95862804, 42.8041387 ], [ 0.98288498, 42.78696546 ], [ 1.00556923, 42.79082648 ], [ 1.04388963, 42.78110021 ], [ 1.07347457, 42.78263485 ], [ 1.10847515, 42.77187132 ], [ 1.13265016, 42.7504983 ], [ 1.13321261, 42.72825768 ], [ 1.16613059, 42.70892987 ], [ 1.18921318, 42.71740573 ], [ 1.21670893, 42.72011641 ], [ 1.22911809, 42.7277549 ], [ 1.25272054, 42.71446938 ], [ 1.27489626, 42.71874584 ], [ 1.35735575, 42.71964235 ], [ 1.35095321, 42.70299018 ], [ 1.38950002, 42.68667688 ], [ 1.39685382, 42.66806709 ], [ 1.41366367, 42.65558915 ], [ 1.42042037, 42.62505283 ], [ 1.44283388, 42.59894907 ], [ 1.42648783, 42.58278529 ], [ 1.44183813, 42.56448409 ], [ 1.42287693, 42.5555258 ], [ 1.41662888, 42.53544443 ], [ 1.4391619, 42.54346506 ], [ 1.46755539, 42.50978332 ], [ 1.44300228, 42.49515661 ], [ 1.44430759, 42.4415567 ], [ 1.45205041, 42.43713106 ], [ 1.51718349, 42.42873127 ], [ 1.55287668, 42.43323213 ], [ 1.56752227, 42.45882475 ], [ 1.60023513, 42.46678524 ], [ 1.63101131, 42.46455034 ], [ 1.65703568, 42.46826818 ], [ 1.66197559, 42.49260894 ], [ 1.70353537, 42.48980389 ], [ 1.72562101, 42.50433475 ], [ 1.73088537, 42.49255021 ], [ 1.74618889, 42.49546575 ], [ 1.76302325, 42.48751496 ], [ 1.82349008, 42.48653226 ], [ 1.84759938, 42.46784921 ], [ 1.87995293, 42.46029138 ], [ 1.88356471, 42.45129067 ], [ 1.91557594, 42.44617749 ], [ 1.93682882, 42.45422944 ], [ 1.94081778, 42.43040904 ], [ 1.95808046, 42.42368337 ], [ 1.95487003, 42.41149182 ], [ 1.97151999, 42.37415541 ], [ 1.98585625, 42.36214392 ], [ 2.01218262, 42.35321742 ], [ 2.05883944, 42.35874741 ], [ 2.1166265, 42.38325003 ], [ 2.12870147, 42.41257191 ], [ 2.15683907, 42.42344249 ], [ 2.20674326, 42.41771574 ], [ 2.24636902, 42.42918608 ], [ 2.25693009, 42.4387358 ], [ 2.29846876, 42.42331892 ], [ 2.31251042, 42.42848203 ], [ 2.32511341, 42.41746481 ], [ 2.34392313, 42.41686207 ], [ 2.36117432, 42.40276257 ], [ 2.38707916, 42.40028518 ], [ 2.41421622, 42.39188782 ], [ 2.43118723, 42.39422311 ], [ 2.43356521, 42.37748118 ], [ 2.46620553, 42.36070429 ], [ 2.48304926, 42.33995666 ], [ 2.50016092, 42.34319045 ], [ 2.52616619, 42.33342087 ], [ 2.5422112, 42.33390848 ], [ 2.55622204, 42.35326676 ], [ 2.57709043, 42.35808095 ], [ 2.61848367, 42.34545454 ], [ 2.67552227, 42.34293206 ], [ 2.67392409, 42.35869244 ], [ 2.66073986, 42.37823123 ], [ 2.67370345, 42.40452988 ], [ 2.69342977, 42.40659121 ], [ 2.7165249, 42.42127562 ], [ 2.75515633, 42.42597489 ], [ 2.77059427, 42.41169674 ], [ 2.7989918, 42.41849373 ], [ 2.80447122, 42.43041866 ], [ 2.82724209, 42.43925877 ], [ 2.83965554, 42.45925106 ], [ 2.86119945, 42.45524441 ], [ 2.87033511, 42.46772289 ], [ 2.88255607, 42.46042246 ], [ 2.91823766, 42.45624047 ], [ 2.93188154, 42.47466977 ], [ 2.94524599, 42.47988089 ], [ 2.96726224, 42.46544678 ], [ 2.98890843, 42.47414043 ], [ 3.0135392, 42.46646771 ], [ 3.04037155, 42.47342368 ], [ 3.04721384, 42.45702665 ], [ 3.08524568, 42.42584308 ], [ 3.09868402, 42.42508951 ], [ 3.10454185, 42.42855089 ], [ 3.13659668, 42.45183467 ] ] ] } };

return booleanWithin(bboxPolygon(bbox), catGeometry);

}
</script>
