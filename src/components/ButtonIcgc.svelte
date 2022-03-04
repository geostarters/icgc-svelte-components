<script>
    import { createEventDispatcher } from "svelte";
    import Button, { Label } from "@smui/button";
    export let label = "ok";
    const dispatch = createEventDispatcher();
    /**
     * Button click handler
     */
    function onClick(event) {
        dispatch("click", event);
    }
</script>

<svelte:head>
    <!-- Fonts --><link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
    />

    <!-- Material Typography --><link
        rel="stylesheet"
        href="https://unpkg.com/@material/typography@13.0.0/dist/mdc.typography.css"
    />

    <!-- SMUI --><link
        rel="stylesheet"
        href="https://unpkg.com/svelte-material-ui/bare.css"
    />
</svelte:head>

<Button on:click={onClick} style="background: #c8ffe7">
    <Label >{label}</Label>
</Button>


<style>
    
</style>