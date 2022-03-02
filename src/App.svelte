<script>
	
	import ButtonIcgc from "./components/ButtonIcgc.svelte";
	import LogoIcgc from "./components/LogoIcgc.svelte";
	import LayerTreeIcgc from "./components/LayerTreeIcgc.svelte";
	import OverLayersIcgc from "./components/LayerGroupIcgc/OverLayersIcgc.svelte";
	import SliderOpacity from "./components/SliderOpacity.svelte";
	export let name;
	let selected = ["water"];
	let item = 'Layer1'
	let mapLayersArray = [
        { id: "building", name: "Edificis2", layout: { visibility: "none" } },
        { id: "place", name: "Llocs2", layout: { visibility: "visible" } },
        { id: "water", name: "Aigua2", layout: { visibility: "none" } },
    ];
	let change;
	let layerTree = [
    {
      groupLabel: "Dipòsits quaternaris",
      groupId: "opt_quaternari",
      items: [
        { label: "Elements g", value: "Elements_geomorfologics" },
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
	function canvi(e){
		console.info(e.detail);
		change = `${e.detail.id} : ${e.detail.checked}`; 
	}
</script>
<main>
	<h1>Holas {name}!</h1>

	<LogoIcgc style ="position: absolute;z-index: 1000;left: 5px;bottom:10px;background-color:black" type="white"/>
	<ButtonIcgc label="bt" />
	<LayerTreeIcgc {mapLayersArray} on:Change={canvi}  bind:group={selected} />
	
	<pre class="status">Selected: {selected.join(', ')}</pre>
	<pre class="status">Onchange: {change}</pre>
<OverLayersIcgc {layerTree}/>
	<SliderOpacity {item}/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
