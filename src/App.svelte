<script>
	import ButtonIcgc from "./components/ButtonIcgc.svelte";
	import LogoIcgc from "./components/LogoIcgc.svelte";
	import LayerTreeIcgc from "./components/LayerTreeIcgc.svelte";
	import OverLayersIcgc from "./components/LayerGroupIcgc/OverLayersIcgc.svelte";
	import SliderOpacityIcgc from "./components/SliderOpacityIcgc.svelte";
	export let name;
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

</script>

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

<main>
	<div style="background-color:#F59E1B">
		<LogoIcgc
		style="padding-left: 2px;padding-top: 2px;"
		type="white" />
	</div>
	
	<h1>Hi {name}!</h1>
	<hr />
	<div id="divComponents">
		<h4>Button:</h4>
		<ButtonIcgc label="button" />
		<h4 >LayerTree:</h4>
		<LayerTreeIcgc
			{mapLayersArray}
			on:Change={changeStatus}
			bind:group={selected} />

		<pre class="status">Selected: {selected.join(', ')}</pre>
		<pre class="status">Onchange: {change}</pre>

		<h4 >OverLayers:</h4>
		<OverLayersIcgc {layerTree} />
		<h4 >SliderOpacity:</h4>
		<SliderOpacityIcgc {item} />
	</div>
</main>
