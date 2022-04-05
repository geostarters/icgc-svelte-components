<script>
  import ButtonIcgc from "./components/ButtonIcgc.svelte";
  import LogoIcgc from "./components/LogoIcgc.svelte";
  import LayerTreeIcgc from "./components/LayerTreeIcgc.svelte";
  import OverLayersIcgc from "./components/LayerGroupIcgc/OverLayersIcgc.svelte";
  import SliderOpacityIcgc from "./components/SliderOpacityIcgc.svelte";
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import {isWithinCat} from "./components/CommonIcgc.svelte";
 
  let selected = ["water"];
  let item = "Layer1";
  let mapLayersArray = [
    { id: "building", name: "Edificis2", layout: { visibility: "none" } },
    { id: "place", name: "Llocs2", layout: { visibility: "visible" } },
    { id: "water", name: "Aigua2", layout: { visibility: "none" } },
  ];
  let change;
  let layerTree = [
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
  function changeStatus(e) {
    console.info(e.detail);
    change = `${e.detail.id} : ${e.detail.checked}`;
  }

  
//map.getBounds().toArray()
  console.info(isWithinCat([1.4622,41.7139 ,1.8117 ,42.0330]));


</script>
<main>
  <div style="background-color:#F59E1B">
    <LogoIcgc style="padding-left: 2px;padding-top: 2px;" type="white" />
  </div>
 
  <div>
    <LayoutGrid>
      <Cell  style="border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center" span={2}>
        <div>
          <h4>Button:</h4>
          <ButtonIcgc label="button" />
        </div>
      </Cell>
      <Cell style="border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center" span={2}>
        <div>
          <h4>LayerTree:</h4>
          <LayerTreeIcgc {mapLayersArray} on:Change={changeStatus} bind:group={selected} />
          <pre class="status">Selected: {selected.join(", ")}</pre>
          <pre class="status">Onchange: {change}</pre>
        </div>
      </Cell>
      <Cell style="border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center" span={2}>
        <div>
          <h4>OverLayers:</h4>
          <OverLayersIcgc {layerTree} />
        </div>
      </Cell>
      <Cell style="border-right: 1px solid #f5f5f5; background-color:#f7f7f7;text-align:center" span={2}>
        <div>
          <h4>SliderOpacity:</h4>
          <SliderOpacityIcgc />
        </div>
      </Cell>	  
    </LayoutGrid>
  </div>
</main>
<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
 
  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
