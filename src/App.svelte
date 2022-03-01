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
	<OverLayersIcgc />
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
