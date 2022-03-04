<script>
  import LayerGroupIcgc from "./LayerGroupIcgc.svelte";

  export let layerTree;
  function activateTheLayer(item, activated) {
    layersValue = `${item.label} : ${activated}`;
  }

</script>

<style>
  .container {
    padding: 0px;
  }
  #capaselect {
    left: -5px;
    padding-left: 15px;
    position: relative;
    padding-top: 0px;
    max-height: 700px;
    /* overflow: auto; */
    top: -17px;
  }

</style>

<div>
  <h3>Selector de capes:</h3>

  <div id="capaselect" class="container list">
    {#each layerTree as layer, index}
      <LayerGroupIcgc {layer} {activateTheLayer} />
    {/each}
  </div>
</div>
