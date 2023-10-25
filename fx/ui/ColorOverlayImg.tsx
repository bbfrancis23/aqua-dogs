import { styled } from "@mui/material/styles"

// Wishlist: theme color support, default: opacity and transition
export const ColorOverlayImg = styled("div")<{
  width?: string;
  height?: string;
  img: string;
  color?: string;
  opacity?: string,
  transition?: string,
}>
((props) => (
  {
    position: "relative",
    width: props.width ? props.width : "100%",
    height: props.height ? props.height : "100%",
    display: "flex",
    background: `url("${props.img}")`,
    backgroundPosition: "center",

    "&::before": {
      content: "\"\"",
      background:
        props.color ? props.color : props.theme.palette.secondary.main,
      width: props.width ? props.width : "100%",
      height: props.height ? props.height : "100%",
      opacity: props.opacity ? props.opacity : ".4",
      transition: props.transition ? props.transition : ".5s ease"
    }
  }
))

// QA: Brian Francis 8-22-23
