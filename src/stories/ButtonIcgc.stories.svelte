<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import Button  from '../components/ButtonIcgc.svelte';
  </script>
<Meta
    title="icgc-svelte/ButtonIcgc"
    component={Button}
    argTypes={{
      label: { control: "text" },
      onClick: { action: "onClick" },
    }}
  />
  <Template let:args>
    <Button {...args} on:click={args.onClick} />
  </Template>
  <Story
    name="Primary"
    args={{
      label: "ok",
    }}
  />
  
  <Story
    name="Small"
    args={{
      label: "ok",
    }}
  />
