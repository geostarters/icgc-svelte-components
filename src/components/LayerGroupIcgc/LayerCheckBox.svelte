<script>
  import { getContext } from "svelte";
  import Checkbox from "@smui/checkbox";
  import FormField from "@smui/form-field";
  export let activated = true;
  export let item;

  const activateLayer = getContext("activateLayer");
  function activateTheLayer(item, activated) {
    // activateLayer(item,activated)
    console.log("activateGroup:", item.label, activated);
  }

</script>

<style>
  .labels {
    color: black;
    width: 100% !important;
    font-weight: 700;
    font-size: 13px;
    font-family: Arial, Helvetica, sans-serif;
  }

  @media (max-width: 624px) {
    .labels {
      font-weight: 500;
      font-size: smaller;
    }
  }
  @media (max-width: 500px) {
    .labels {
      font-weight: 500;
      font-size: smaller;
    }
  }
  @media (max-width: 321px) {
    .labels {
      font-weight: 500;
      font-size: smaller;
    }
  }

</style>

<FormField class="field" style="padding-left: 10px;">
  <Checkbox
    bind:checked={activated}
    on:change={activateTheLayer(item, activated)} />
  <span class="labels"> {item.label} </span>
</FormField>
