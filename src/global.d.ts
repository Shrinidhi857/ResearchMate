declare namespace JSX {
  interface IntrinsicElements {
    "dotlottie-player": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      autoplay?: boolean;
      loop?: boolean;
      background?: string;
      speed?: string | number;
      style?: React.CSSProperties;
    };
  }
}
declare module "html2pdf.js";
