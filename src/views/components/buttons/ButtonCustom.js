import Button from "@mui/material/Button";

const ButtonCustom = (props) => {
  const {
    text,
    loading,
    onClick,
    useBackToTop = false,
    color = "warning",
    icon,
    href,
    useTargetBlank = false,
  } = props;

  return (
    <Button
      size="small"
      fullWidth
      target={useTargetBlank ? "_blank" : ""}
      href={href}
      disabled={loading}
      color={color}
      onClick={() => {
        if (useBackToTop) {
          const anchor = document.querySelector("body");
          if (anchor) {
            anchor.scrollIntoView({ behavior: "smooth" });
          }
        }
        onClick();
      }}
      variant="contained"
    >
      {icon}
      {text}
    </Button>
  );
};

export default ButtonCustom;
