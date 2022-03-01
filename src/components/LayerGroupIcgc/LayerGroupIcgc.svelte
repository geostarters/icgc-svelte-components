<script>
  import LayerCheckBox from "./LayerCheckBox.svelte";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  export let layer;
  let display = false;
  let activated = true;
  function activateTheLayerGroup(layer, activated) {
    // activateLayerGroup(layer, activated)
    console.log("activateGroup:", layer.groupLabel, activated);
  }
  function colapseGroup() {
    display = !display;
  }

</script>

<style>
  .multiselect {
    /* width: 85%; */
    padding-bottom: 10px;
    font-family: Arial, Helvetica, sans-serif;
  }

  .selectBox {
    position: relative;
    cursor: pointer;
  }
  .select {
    margin: 0px !important;
    font-size: smaller;
  }

  .selectBox select {
    width: 100%;
    font-weight: bold;
  }

  .checkboxes {
    /* border: 1px #dadada solid; */
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding-right: 30px;
    width: 80%;
  }

  .headCheck {
    font-size: 14px;
    font-weight: bold;
    color: rgb(0, 0, 0);
  }

  select {
    font-family: inherit;
    font-size: inherit;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
  }

</style>

<form>
  <div class="multiselect">
    <div style="display: flex;
      height: 32px;    padding-bottom: 19px;">
      <div style="width:100%" class="selectBox" on:click={colapseGroup}>
        <select
          class="select"
          style="border-radius: 11px;    border-color: transparent;
            background-color: rgb(147 211 195);">
          <option>{layer.groupLabel}</option>
        </select>
      </div>
    </div>

    {#if display}
      <div id={layer.groupId} class="checkboxes">
        {#if layer.groupId !== 'opt_elements'}
          <div>
            <FormField>
              <Checkbox
                indeterminate={true}
                bind:checked={activated}
                class="indentedfield"
                on:change={activateTheLayerGroup(layer, activated)} />

              <span class="headCheck" slot="label">Visualitza-ho tot </span>
            </FormField>
          </div>
        {/if}

        {#each layer.items as item, index}
          <LayerCheckBox {item} {activated} />
        {/each}
      </div>
    {/if}
  </div>
</form>
