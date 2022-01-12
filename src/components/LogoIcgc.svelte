<script>
  export let width = 125;
  export let title = "Institut Cartogràfic i Geològic de Catalunya";
  export const typeList = {
    color: "ICGC_color_norma.svg",
    white: "ICGC_white_norma.svg",
  };
  export let type="color";
  export let href = "https://www.icgc.cat";
  export let src = `https://betaserver.icgc.cat/logos/${typeList[type]}`;
  export let style =
    "position: absolute;z-index: 1000;right: 50px;bottom:10px";
</script>
<div {style}>
  <a {title} rel="noopener noreferrer" {href} target="_blank">
    <img
      {width}
      alt={title}
     {src}
    />
  </a>
</div>
