<script>
  import LayerGroupIcgc from "./LayerGroupIcgc.svelte";

  let display = false;
  export let layerTree = [
    {
      groupLabel: "Dipòsits quaternaris",
      groupId: "opt_quaternari",
      items: [
        { label: "Elements geomorfològics", value: "Elements_geomorfologics" },
        { label: "Contactes", value: "Contactes_del_quaternari" },
        { label: "Unitats geològiques", value: "FILLq,PATT1q,LABELq/label" },
      ],
    },

    {
      groupLabel: "Basament prequaternari",
      groupId: "opt_basament",
      items: [
        { label: "Contactes", value: "Contactes_del_basament" },
        {
          label: "Falles i plecs",
          value: "gt125mv10sh0ffl1r010_202101,gt125mv10sh0ffl1r010_202101_5513",
        },
        {
          label: "Unitats geològiques",
          value: "FILL,PATT1,PATT2,PATT3,PATT4,LABEL/label",
        },
      ],
    },
  ];

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
      <LayerGroupIcgc {layer} />
    {/each}
  </div>
</div>
