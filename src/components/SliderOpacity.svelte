<script>
  import { getContext } from "svelte";

  export let item;

  const changePaintProperty = getContext("changePaintProperty");

  function changeOpacity(e) {
    console.log("event target", event.target.value);
  }

</script>

<style>
  .map-overlay {
    font: bold 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
    position: relative;
    width: 75% !important;
    top: 0px !important;
    left: -5px !important;
    padding: 0px;
  }

  .map-overlay .map-overlay-inner {
    background-color: #fff;
    box-shadow: 0px !important;
    border-radius: 0px !important;
    padding: 0px !important;
    margin-bottom: 0px !important;
  }

  .map-overlay input {
    background-color: transparent;
    display: inline-block;
    width: 100%;
    position: relative;
    margin: 0;
    cursor: ew-resize;
  }

</style>

<div class="map-overlay top">
  <h3>Slider Opacity:</h3>
  <div class="map-overlay-inner">
    <input
      on:change={changeOpacity}
      type="range"
      min="0"
      max="100"
      step="0"
      value="50" />
  </div>
</div>
