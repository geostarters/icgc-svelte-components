<script>
    import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
    import IcgcLogo  from '../components/LogoIcgc.svelte';
  </script>
<Meta
    title="icgc-svelte/LogoIcgc"
    component={IcgcLogo}
    argTypes={{
      width: { control: "number" },
      title: { control: "text" },
      type: {
        control: { type: "select", options: ["color","white"] },
      },
      href: { control: "text" },
      src: { control: "text" },
      style: { control: "text" }
    }}
  />
  <Template let:args>
    <IcgcLogo {...args}  />
  </Template>
  <Story
    name="By default"
    args={{     
    }}
  />
  <Story
    name="White logo"
    args={{
      type: "white",
      style: "position: absolute;z-index: 1000;right: 50px;top:10px;background-color:black",
    }}
  />
  <Story
    name="Large"
    args={{
      width: 400,
    }}
  />
  <Story
    name="Position top"
    args={{
      style: "position: absolute;z-index: 1000;right: 50px;top:10px"
    }}
  />
  <Story
    name="Free logo"
    args={{
      style: "position: absolute;z-index: 1000;right: 50px;top:10px",
      src:"https://web.gencat.cat/web/.content/Imatge/marca_home/NG_logo_generalitat_home2.png_602392567.png",
      width:"250",
      url:"https://territori.gencat.cat/ca/inici/",
      title:"Departament de Polítiques Digitals i Territori de la Generalitat de Catalunya"
    }}
  />
