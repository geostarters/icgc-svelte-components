<script>
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import Checkbox from "@smui/checkbox";
    import FormField from "@smui/form-field";
    export let mapLayersArray = [
        { id: "building", name: "Edificis", layout: { visibility: "none" } },
        { id: "place", name: "Llocs", layout: { visibility: "visible" } },
        { id: "water", name: "Aigua", layout: { visibility: "none" } },
    ];
    export let group = [];
    const dispatch = createEventDispatcher();

    onMount(async () => {
        if (group.length === 0) {
            group = mapLayersArray.map(function (layer) {
                if (
                    layer &&
                    layer.layout &&
                    layer.layout.visibility == "visible"
                ) {
                    return layer.id;
                }
            });
        }
    });

    function onChange(event) {
        const visible = event.target.checked ? "visible" : "none";

        dispatch("Change", {
            e: event,
            layers: group,
            id: event.target.value,
            checked: event.target.checked,
            layout: { visibility: visible },
        });
    }
</script>

<div>
    {#each mapLayersArray as layer}
        <div>
            <FormField>
                <Checkbox on:change={onChange} bind:group value={layer.id} />
                <span slot="label">{layer.name}</span>
            </FormField>
        </div>
    {/each}
</div>
