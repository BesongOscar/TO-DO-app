declare module "*.svg" {
  import { SvgProps } from "react-native-svg";
  import React from "react";
  const SVG: React.FC<SvgProps>;
  export default SVG;
}
